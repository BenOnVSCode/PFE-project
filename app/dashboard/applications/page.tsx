'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Application {
  id: string
  message: string
  status: string
  createdAt: string
  gig: {
    id: string
    title: string
    status: string
  }
}

export default function Applications() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user.role === 'DEVELOPER') {
      fetchApplications()
    }
  }, [session])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const applicationsData = await response.json()
        setApplications(applicationsData)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (session?.user.role !== 'DEVELOPER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only developers can view applications.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">Track your job applications and their status</p>
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">
                Start applying to gigs to see your applications here.
              </p>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Browse Available Gigs
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <div key={application.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {application.gig.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Applied: {formatDate(application.createdAt)}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.gig.status)}`}>
                            Gig Status: {application.gig.status}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Your Application Message</h4>
                      <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {application.message}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {application.status === 'PENDING' && (
                          <span className="text-yellow-600 text-sm">
                            ⏳ Waiting for client response
                          </span>
                        )}
                        {application.status === 'ACCEPTED' && (
                          <span className="text-green-600 text-sm">
                            ✅ Congratulations! Your application was accepted
                          </span>
                        )}
                        {application.status === 'REJECTED' && (
                          <span className="text-red-600 text-sm">
                            ❌ This application was not selected
                          </span>
                        )}
                      </div>

                      {application.status === 'ACCEPTED' && (
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <p className="text-green-800 text-sm font-medium">
                            🎉 You got the gig! The client will contact you soon.
                          </p>
                        </div>
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
