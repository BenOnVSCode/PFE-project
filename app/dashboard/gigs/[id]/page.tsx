'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Application {
  id: string
  message: string
  status: string
  createdAt: string
  author: {
    id: string
    name?: string
    email: string
  }
}

interface Gig {
  id: string
  title: string
  description: string
  budget?: string
  timeline?: string
  skills: string[]
  status: string
  createdAt: string
  applications: Application[]
}

export default function GigDetails() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [gig, setGig] = useState<Gig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchGig = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/gigs/${params.id}`)
      if (response.ok) {
        const gigData = await response.json()
        setGig(gigData)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to fetch gig:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (params.id) {
      fetchGig()
    }
  }, [params.id, fetchGig])

  const handleApplicationUpdate = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED') => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchGig() // Refresh the gig data
      } else {
        alert('Failed to update application')
      }
    } catch (error) {
      console.error('Failed to update application:', error)
      alert('Something went wrong')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (session?.user.role !== 'CLIENT') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only clients can manage gigs.</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Gig Not Found</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gig Details</h1>
              <p className="text-gray-600">Manage your project and review applications</p>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gig Information */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      gig.status === 'OPEN' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gig.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Description</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{gig.description}</p>
                  </div>

                  {gig.budget && (
                    <div>
                      <h4 className="font-medium text-gray-900">Budget</h4>
                      <p className="text-gray-600">{gig.budget}</p>
                    </div>
                  )}

                  {gig.timeline && (
                    <div>
                      <h4 className="font-medium text-gray-900">Timeline</h4>
                      <p className="text-gray-600">{gig.timeline}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900">Required Skills</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {gig.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Posted</h4>
                    <p className="text-gray-600">{formatDate(gig.createdAt)}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Applications</h4>
                    <p className="text-gray-600">{gig.applications.length} received</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Applications ({gig.applications.length})
                  </h2>
                  
                  {gig.applications.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {gig.applications.filter(app => app.status === 'PENDING').length} Pending
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {gig.applications.filter(app => app.status === 'ACCEPTED').length} Accepted
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {gig.applications.filter(app => app.status === 'REJECTED').length} Rejected
                      </span>
                    </div>
                  )}
                </div>
                
                {gig.applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">
                      Developers will be able to apply to your gig once you share it.
                    </p>
                    <div className="text-sm text-gray-500">
                      Share your gig link to get applications from qualified developers.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sort applications: Pending first, then by date */}
                    {gig.applications
                      .sort((a, b) => {
                        // Pending applications first
                        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                        // Then by date (newest first)
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                      })
                      .map((application) => (
                      <div key={application.id} className={`border rounded-lg p-6 transition-all duration-200 ${
                        application.status === 'PENDING' 
                          ? 'border-yellow-200 bg-yellow-50/30 hover:bg-yellow-50/50' 
                          : application.status === 'ACCEPTED'
                          ? 'border-green-200 bg-green-50/30'
                          : 'border-red-200 bg-red-50/30'
                      }`}>
                        {/* Application Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-lg font-semibold text-gray-600">
                                {(application.author.name || 'A').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {application.author.name || 'Anonymous Developer'}
                              </h4>
                              <p className="text-sm text-gray-600">{application.author.email}</p>
                              <p className="text-xs text-gray-500">
                                Applied {formatDate(application.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            application.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>

                        {/* Application Message */}
                        <div className="mb-6">
                          <h5 className="font-medium text-gray-900 mb-3">Application Message</h5>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {application.message}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {application.status === 'PENDING' && (
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleApplicationUpdate(application.id, 'ACCEPTED')}
                                disabled={isUpdating}
                                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Accept Application
                              </button>
                              <button
                                onClick={() => handleApplicationUpdate(application.id, 'REJECTED')}
                                disabled={isUpdating}
                                className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Accepting will automatically reject all other applications
                            </div>
                          </div>
                        )}

                        {/* Status Messages */}
                        {application.status === 'ACCEPTED' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <div>
                                <p className="text-green-800 font-medium">
                                  Application Accepted
                                </p>
                                <p className="text-green-700 text-sm">
                                  The developer has been notified and the project is now assigned to them.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {application.status === 'REJECTED' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <div>
                                <p className="text-red-800 font-medium">
                                  Application Rejected
                                </p>
                                <p className="text-red-700 text-sm">
                                  This application was not selected for the project.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
