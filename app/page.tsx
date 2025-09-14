'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Gig {
  id: string
  title: string
  description: string
  budget?: string
  timeline?: string
  skills: string[]
  status: string
  createdAt: string
  owner?: {
    id: string
    name?: string
  }
  applications?: Array<{
    id: string
    status: string
  }>
}

export default function Home() {
  const { data: session } = useSession()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchGigs()
    }
  }, [session])

  const fetchGigs = async () => {
    console.log('fetchGigs called')
    setIsLoading(true)
    try {
      console.log('Making request to /api/gigs')
      const response = await fetch('/api/gigs')
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const gigsData = await response.json()
        console.log('Gigs data received:', gigsData.length, 'gigs')
        console.log('Gigs:', gigsData.map((g: Gig) => ({ id: g.id, title: g.title })))
        setGigs(gigsData)
      } else {
        console.error('Response not ok:', response.status)
        const errorData = await response.json()
        console.error('Error data:', errorData)
      }
    } catch (error) {
      console.error('Failed to fetch gigs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Freelance App</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                  {session.user.role === 'CLIENT' && (
                    <Link
                      href="/dashboard/post-gig"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Post a Gig
                    </Link>
                  )}
                  <span className="text-gray-700 text-sm">
                    Welcome, {session.user.name}
                  </span>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section for non-authenticated users */}
      {!session && (
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Connect{' '}
              <span className="text-blue-600">Clients</span> with{' '}
              <span className="text-green-600">Developers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The ultimate freelance platform where talented developers meet innovative clients to create amazing projects together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Get Started Free
              </Link>
              <Link
                href="/about"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-blue-600 text-3xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">For Clients</h3>
                <p className="text-gray-600">
                  Post your projects and connect with skilled developers. Find the perfect match for your needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-green-600 text-3xl mb-4">💻</div>
                <h3 className="text-xl font-semibold mb-2">For Developers</h3>
                <p className="text-gray-600">
                  Showcase your skills and find exciting projects. Build your freelance career with quality clients.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-purple-600 text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">
                  Built with modern security practices and reliable infrastructure for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Gig Listings for authenticated users */}
      {session && (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {session.user.role === 'CLIENT' ? 'Your Posted Gigs' : 'Available Gigs'}
              </h1>
              <p className="text-gray-600 mt-2">
                {session.user.role === 'CLIENT' 
                  ? 'Manage your posted projects and review applications'
                  : 'Find exciting projects to work on'
                }
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : gigs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  {session.user.role === 'CLIENT' ? '📝' : '🔍'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {session.user.role === 'CLIENT' ? 'No gigs posted yet' : 'No gigs available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {session.user.role === 'CLIENT' 
                    ? 'Start by posting your first project to find developers'
                    : 'Check back later for new opportunities'
                  }
                </p>
                {session.user.role === 'CLIENT' && (
                  <Link
                    href="/dashboard/post-gig"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Post Your First Gig
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <div key={gig.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {gig.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          gig.status === 'OPEN' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {gig.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {gig.description.length > 100 
                          ? `${gig.description.substring(0, 100)}...` 
                          : gig.description
                        }
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {gig.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {gig.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{gig.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        {gig.budget && <div>Budget: {gig.budget}</div>}
                        {gig.timeline && <div>Timeline: {gig.timeline}</div>}
                        <div>Posted: {formatDate(gig.createdAt)}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        {session.user.role === 'CLIENT' ? (
                          <Link
                            href={`/dashboard/gigs/${gig.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Applications ({gig.applications?.length || 0})
                          </Link>
                        ) : (
                          <Link
                            href={`/gigs/${gig.id}/apply`}
                            className={`text-sm font-medium ${
                              gig.status === 'OPEN' 
                                ? 'text-blue-600 hover:text-blue-800' 
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {gig.status === 'OPEN' ? 'Apply Now' : 'Closed'}
                          </Link>
                        )}
                        
                        {gig.applications && gig.applications.length > 0 && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            gig.applications[0].status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : gig.applications[0].status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {gig.applications[0].status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  )
}
