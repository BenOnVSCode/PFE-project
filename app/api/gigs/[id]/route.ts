import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/gigs/[id] - Get a specific gig
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gig = await prisma.gig.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        applications: {
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    // Check if user can view this gig
    const isOwner = gig.ownerId === session.user.id
    const isDeveloper = session.user.role === 'DEVELOPER'
    const isOpen = gig.status === 'OPEN'

    if (!isOwner && !(isDeveloper && isOpen)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(gig)
  } catch (error) {
    console.error('Error fetching gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/gigs/[id] - Update a gig (owners only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gig = await prisma.gig.findUnique({
      where: { id: params.id }
    })

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    if (gig.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, budget, timeline, skills, status } = body

    const updatedGig = await prisma.gig.update({
      where: { id: params.id },
      data: {
        title,
        description,
        budget,
        timeline,
        skills,
        status
      }
    })

    return NextResponse.json(updatedGig)
  } catch (error) {
    console.error('Error updating gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/gigs/[id] - Delete a gig (owners only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gig = await prisma.gig.findUnique({
      where: { id: params.id }
    })

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    if (gig.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await prisma.gig.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Gig deleted successfully' })
  } catch (error) {
    console.error('Error deleting gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
