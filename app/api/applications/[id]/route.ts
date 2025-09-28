import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/applications/[id] - Update application status (gig owners only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Only gig owners can update application status' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        gig: {
          select: { ownerId: true, status: true }
        }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (application.gig.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (application.gig.status !== 'OPEN') {
      return NextResponse.json({ error: 'Gig is no longer open' }, { status: 400 })
    }

    // If accepting, reject all other applications and set gig to IN_PROGRESS
    if (status === 'ACCEPTED') {
      await prisma.$transaction([
        // Reject all other applications for this gig
        prisma.application.updateMany({
          where: {
            gigId: application.gigId,
            id: { not: params.id }
          },
          data: { status: 'REJECTED' }
        }),
        // Accept this application
        prisma.application.update({
          where: { id: params.id },
          data: { status: 'ACCEPTED' }
        }),
        // Set gig status to IN_PROGRESS
        prisma.gig.update({
          where: { id: application.gigId },
          data: { status: 'IN_PROGRESS' }
        })
      ])
    } else {
      // Just reject this application
      await prisma.application.update({
        where: { id: params.id },
        data: { status: 'REJECTED' }
      })
    }

    const updatedApplication = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        gig: {
          select: { id: true, title: true, status: true }
        }
      }
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
