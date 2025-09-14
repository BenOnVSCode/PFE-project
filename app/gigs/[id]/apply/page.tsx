'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Gig {
  id: string
  title: string
  description: string
  budget?: string
  timeline?: string
  skills: string[]
  status: string
  createdAt: string
  owner: {
    id: string
    name?: string
  }
}

export default function ApplyToGig() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [gig, setGig] = useState<Gig | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchGig = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/gigs/${params.id}`)
      if (response.ok) {
        const gigData = await response.json()
        setGig(gigData)
      } else {
        setError('Gig not found')
      }
    } catch (error) {
      setError('Failed to load gig')
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchGig()
    }
  }, [params.id, fetchGig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gigId: params.id,
          message
        }),
      })

      if (response.ok) {
        setSuccess('Application submitted successfully!')
        setMessage('')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit application')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (session?.user.role !== 'DEVELOPER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Only developers can apply to gigs.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Apply to Gig</h1>
              <p className="text-gray-600">Submit your application for this project</p>
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gig Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                  <p className="text-sm text-gray-600">Posted by {gig.owner.name || 'Anonymous'}</p>
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
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    gig.status === 'OPEN' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {gig.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Application</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Application Message *
                  </label>
                  <textarea
                    id="message"
                    rows={8}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tell the client why you're the right fit for this project. Include your relevant experience, approach, and any questions you have about the project."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum 10 characters required
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                    {success}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || gig.status !== 'OPEN'}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>

              {gig.status !== 'OPEN' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    This gig is no longer accepting applications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
