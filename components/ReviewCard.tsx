'use client'

import StarRating from './StarRating'

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  reviewer: {
    id: string
    name?: string
    image?: string
  }
  gig: {
    id: string
    title: string
  }
}

interface ReviewCardProps {
  review: Review
  showGigTitle?: boolean
}

export default function ReviewCard({ review, showGigTitle = true }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {review.reviewer.image ? (
              <img
                src={review.reviewer.image}
                alt={review.reviewer.name || 'Reviewer'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {review.reviewer.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.reviewer.name || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      {showGigTitle && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Project: <span className="font-medium">{review.gig.title}</span>
          </p>
        </div>
      )}

      {review.comment && (
        <div className="mt-3">
          <p className="text-gray-700 text-sm leading-relaxed">
            {review.comment}
          </p>
        </div>
      )}
    </div>
  )
}
