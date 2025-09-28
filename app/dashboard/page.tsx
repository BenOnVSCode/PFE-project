'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchGigs()
    }
  }, [session])

  const fetchGigs = async () => {
    console.log('Dashboard: fetchGigs called')
    setIsLoading(true)
    try {
      console.log('Dashboard: Making request to /api/gigs')
      const response = await fetch('/api/gigs')
      console.log('Dashboard: Response status:', response.status)
      
      if (response.ok) {
        const gigsData = await response.json()
        console.log('Dashboard: Gigs data received:', gigsData.length, 'gigs')
        setGigs(gigsData)
      } else {
        console.error('Dashboard: Response not ok:', response.status)
      }
    } catch (error) {
      console.error('Dashboard: Failed to fetch gigs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const isClient = session.user.role === 'CLIENT'
  const isDeveloper = session.user.role === 'DEVELOPER'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {session.user.name}!
              </h1>
              <p className="text-gray-600">
                {isClient ? 'Client Dashboard' : 'Developer Dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Role-specific content */}
          {isClient && (
            <div className="space-y-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Client Dashboard
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>As a client, you can post projects and hire developers.</p>
                  </div>
                  <div className="mt-5">
                    <Link
                      href="/dashboard/post-gig"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Post a New Project
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'OPEN').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Open Projects
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'OPEN').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'IN_PROGRESS').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            In Progress
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'IN_PROGRESS').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'COMPLETED').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Completed
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'COMPLETED').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.reduce((total, gig) => total + (gig.applications?.filter(app => app.status === 'PENDING').length || 0), 0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Proposals
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.reduce((total, gig) => total + (gig.applications?.filter(app => app.status === 'PENDING').length || 0), 0)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Status Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-5">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'ON_HOLD').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            On Hold
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'ON_HOLD').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'UNDER_REVIEW').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Under Review
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'UNDER_REVIEW').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'CANCELLED').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Cancelled
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'CANCELLED').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-slate-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'CLOSED').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Closed
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'CLOSED').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isDeveloper && (
            <div className="space-y-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Developer Dashboard
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>As a developer, you can browse projects and submit proposals.</p>
                  </div>
                  <div className="mt-5 space-x-3">
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Projects
                    </Link>
                    <Link
                      href="/dashboard/applications"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      My Applications
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'ACCEPTED') && gig.status === 'IN_PROGRESS').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Projects
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'ACCEPTED') && gig.status === 'IN_PROGRESS').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'COMPLETED' && gig.applications?.some(app => app.status === 'ACCEPTED')).length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Completed Projects
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'COMPLETED' && gig.applications?.some(app => app.status === 'ACCEPTED')).length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'PENDING')).length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Applications
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'PENDING')).length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.reduce((total, gig) => total + (gig.applications?.length || 0), 0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Proposals
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.reduce((total, gig) => total + (gig.applications?.length || 0), 0)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Developer Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-5">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'ACCEPTED') && gig.status === 'UNDER_REVIEW').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Under Review
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'ACCEPTED') && gig.status === 'UNDER_REVIEW').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'ACCEPTED') && gig.status === 'ON_HOLD').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            On Hold
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'ACCEPTED') && gig.status === 'ON_HOLD').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'REJECTED')).length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Rejected
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.applications?.some(app => app.status === 'REJECTED')).length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {gigs.filter(gig => gig.status === 'OPEN').length}
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Available Gigs
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {gigs.filter(gig => gig.status === 'OPEN').length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gigs Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isClient ? 'Your Posted Gigs' : 'Available Gigs'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isClient 
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
                {isClient ? '📝' : '🔍'}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isClient ? 'No gigs posted yet' : 'No gigs available'}
              </h3>
              <p className="text-gray-600 mb-4">
                {isClient 
                  ? 'Start by posting your first project to find developers'
                  : 'Check back later for new opportunities'
                }
              </p>
              {isClient && (
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
                      {isClient ? (
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
    </div>
  )
}
