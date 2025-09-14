import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createApplicationSchema = z.object({
  gigId: z.string().min(1, 'Gig ID is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

// GET /api/applications - Get applications (for developers to see their own)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const gigId = searchParams.get('gigId')

    let applications

    if (session.user.role === 'DEVELOPER') {
      // Developers see their own applications
      applications = await prisma.application.findMany({
        where: { authorId: session.user.id },
        include: {
          gig: {
            select: { id: true, title: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (session.user.role === 'CLIENT' && gigId) {
      // Clients see applications for a specific gig
      const gig = await prisma.gig.findUnique({
        where: { id: gigId },
        select: { ownerId: true }
      })

      if (!gig || gig.ownerId !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      applications = await prisma.application.findMany({
        where: { gigId },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/applications - Create a new application (developers only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'DEVELOPER') {
      return NextResponse.json({ error: 'Only developers can apply to gigs' }, { status: 403 })
    }

    const body = await request.json()
    const { gigId, message } = createApplicationSchema.parse(body)

    // Check if gig exists and is open
    const gig = await prisma.gig.findUnique({
      where: { id: gigId }
    })

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    if (gig.status !== 'OPEN') {
      return NextResponse.json({ error: 'Gig is not open for applications' }, { status: 400 })
    }

    if (gig.ownerId === session.user.id) {
      return NextResponse.json({ error: 'Cannot apply to your own gig' }, { status: 400 })
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        gigId_authorId: {
          gigId,
          authorId: session.user.id
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this gig' }, { status: 400 })
    }

    const application = await prisma.application.create({
      data: {
        gigId,
        message,
        authorId: session.user.id
      },
      include: {
        gig: {
          select: { id: true, title: true }
        }
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
