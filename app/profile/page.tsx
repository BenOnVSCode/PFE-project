'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Force dynamic rendering to prevent SSR issues with router.push
export const dynamic = 'force-dynamic'

interface User {
  id: string
  name?: string
  email: string
  image?: string
  role: 'CLIENT' | 'DEVELOPER'
  bio?: string
  location?: string
  website?: string
  phone?: string
  skills?: string[]
  experience?: string
  company?: string
  createdAt: string
}

export default function Profile() {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    skills: [] as string[],
    experience: '',
    company: ''
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/profile`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          phone: userData.phone || '',
          skills: userData.skills || [],
          experience: userData.experience || '',
          company: userData.company || ''
        })
      } else {
        setError('Failed to load profile')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        fetchUserProfile() // Refresh the profile data
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  // Handle redirect in useEffect to avoid SSR issues
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile Not Found</h1>
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
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  {success}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                      />
                      <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., New York, NY"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {user.role === 'CLIENT' && (
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Your company name"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {user.role === 'DEVELOPER' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Skills
                        </label>
                        <div className="mt-1 flex space-x-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., React, Node.js, Python"
                          />
                          <button
                            type="button"
                            onClick={addSkill}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add
                          </button>
                        </div>
                        
                        {formData.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                          Experience
                        </label>
                        <textarea
                          id="experience"
                          rows={4}
                          value={formData.experience}
                          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe your professional experience..."
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.location || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Website</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.website ? (
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                            {user.website}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</dd>
                    </div>
                    {user.role === 'CLIENT' && user.company && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Company</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.company}</dd>
                      </div>
                    )}
                  </div>

                  {user.bio && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{user.bio}</dd>
                    </div>
                  )}

                  {user.role === 'DEVELOPER' && user.skills && user.skills.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Skills</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}

                  {user.role === 'DEVELOPER' && user.experience && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Experience</dt>
                      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{user.experience}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Member since</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
