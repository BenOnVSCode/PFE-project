import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const gigCount = await prisma.gig.count()
    
    // Get the first user to use as owner for test gig
    const firstUser = await prisma.user.findFirst()
    
    if (!firstUser) {
      return NextResponse.json({
        success: true,
        userCount,
        gigCount,
        message: 'No users found - database is empty but connected'
      })
    }
    
    // Try to create a simple gig to test
    const testGig = await prisma.gig.create({
      data: {
        title: 'Test Gig',
        description: 'This is a test gig to verify database functionality',
        skills: ['Test'],
        status: 'OPEN',
        ownerId: firstUser.id
      }
    })

    return NextResponse.json({
      success: true,
      userCount,
      gigCount,
      testGig: testGig.id,
      ownerId: firstUser.id
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
