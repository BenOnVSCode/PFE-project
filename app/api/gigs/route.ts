import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createGigSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required')
})

// GET /api/gigs - Get all gigs (for developers) or user's own gigs (for clients)
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/gigs called')
    const session = await getServerSession(authOptions)
    console.log('Session exists:', !!session)
    console.log('User role:', session?.user?.role)
    console.log('User ID:', session?.user?.id)
    
    if (!session) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userRole = session.user.role

    let gigs

    if (userRole === 'CLIENT') {
      console.log('Fetching gigs for CLIENT')
      // Clients see their own gigs
      gigs = await prisma.gig.findMany({
        where: { ownerId: session.user.id },
        include: {
          applications: {
            include: {
              author: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      console.log('Found gigs for client:', gigs.length)
    } else {
      console.log('Fetching gigs for DEVELOPER')
      // Developers see all open gigs
      gigs = await prisma.gig.findMany({
        where: { 
          status: 'OPEN',
          ownerId: { not: session.user.id } // Don't show their own gigs
        },
        include: {
          owner: {
            select: { id: true, name: true }
          },
          applications: {
            where: { authorId: session.user.id },
            select: { id: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      console.log('Found gigs for developer:', gigs.length)
    }

    console.log('Returning gigs:', gigs.map(g => ({ id: g.id, title: g.title })))
    return NextResponse.json(gigs)
  } catch (error) {
    console.error('Error fetching gigs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/gigs - Create a new gig (clients only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/gigs called')
    const session = await getServerSession(authOptions)
    console.log('Session exists:', !!session)
    console.log('User role:', session?.user?.role)
    
    if (!session || session.user.role !== 'CLIENT') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Only clients can create gigs' }, { status: 403 })
    }

    const body = await request.json()
    console.log('Request body received:', body)
    
    const { title, description, budget, timeline, skills } = createGigSchema.parse(body)
    console.log('Data validated successfully:', { title, description, budget, timeline, skills })

    console.log('Attempting to create gig in database...')
    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        budget,
        timeline,
        skills,
        ownerId: session.user.id
      }
    })

    console.log('Gig created successfully with ID:', gig.id)
    return NextResponse.json(gig, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error('Error creating gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
