'use client'

import { useState } from 'react'

interface StatusManagerProps {
  currentStatus: string
  gigId: string
  onStatusChange: (newStatus: string) => void
  isLoading?: boolean
}

const statusOptions = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800', description: 'Not yet published' },
  { value: 'OPEN', label: 'Open', color: 'bg-green-100 text-green-800', description: 'Accepting applications' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800', description: 'Work has started' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'bg-orange-100 text-orange-800', description: 'Temporarily paused' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-indigo-100 text-indigo-800', description: 'Being reviewed' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-emerald-100 text-emerald-800', description: 'Work finished' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800', description: 'Project cancelled' },
  { value: 'CLOSED', label: 'Closed', color: 'bg-slate-100 text-slate-800', description: 'No longer accepting applications' }
]

export default function StatusManager({ currentStatus, gigId, onStatusChange, isLoading = false }: StatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus)

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus)
    setIsOpen(false)
    onStatusChange(newStatus)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${currentStatusOption?.color}`}
      >
        <span className="mr-2">{currentStatusOption?.label}</span>
        <svg
          className={`-mr-1 ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                option.value === selectedStatus ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
                {option.value === selectedStatus && (
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
