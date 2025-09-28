import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  gigId: z.string().min(1, 'Gig ID is required'),
  revieweeId: z.string().min(1, 'Reviewee ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional()
})

// GET /api/reviews - Get reviews for a user or gig
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const gigId = searchParams.get('gigId')

    let reviews

    if (userId) {
      // Get reviews for a specific user
      reviews = await prisma.review.findMany({
        where: { revieweeId: userId },
        include: {
          reviewer: {
            select: { id: true, name: true, image: true }
          },
          gig: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (gigId) {
      // Get reviews for a specific gig
      reviews = await prisma.review.findMany({
        where: { gigId },
        include: {
          reviewer: {
            select: { id: true, name: true, image: true }
          },
          reviewee: {
            select: { id: true, name: true, image: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ error: 'userId or gigId parameter is required' }, { status: 400 })
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { gigId, revieweeId, rating, comment } = createReviewSchema.parse(body)

    // Check if the gig exists and is completed
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        applications: {
          where: { status: 'ACCEPTED' }
        }
      }
    })

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    if (gig.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Can only review completed gigs' }, { status: 400 })
    }

    // Check if the reviewer was involved in this gig
    const isOwner = gig.ownerId === session.user.id
    const isAcceptedDeveloper = gig.applications.some(app => app.authorId === session.user.id)
    
    if (!isOwner && !isAcceptedDeveloper) {
      return NextResponse.json({ error: 'You can only review gigs you were involved in' }, { status: 403 })
    }

    // Check if user is trying to review themselves
    if (session.user.id === revieweeId) {
      return NextResponse.json({ error: 'You cannot review yourself' }, { status: 400 })
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        gigId_reviewerId: {
          gigId,
          reviewerId: session.user.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this gig' }, { status: 400 })
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        gigId,
        revieweeId,
        reviewerId: session.user.id,
        rating,
        comment
      },
      include: {
        reviewer: {
          select: { id: true, name: true, image: true }
        },
        reviewee: {
          select: { id: true, name: true, image: true }
        },
        gig: {
          select: { id: true, title: true }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
