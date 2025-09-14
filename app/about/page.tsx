import Link from 'next/link'

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            About This App
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Built with Modern Technologies
            </h2>
            <p className="text-gray-600 mb-6">
              This is a Next.js 14 application built with TypeScript, featuring the new App Router
              for better performance and developer experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• App Router (Next.js 14)</li>
                  <li>• TypeScript support</li>
                  <li>• Tailwind CSS styling</li>
                  <li>• Responsive design</li>
                  <li>• Modern UI components</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Getting Started</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Run <code className="bg-gray-100 px-2 py-1 rounded">npm install</code></li>
                  <li>• Start dev server with <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
                  <li>• Open <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></li>
                  <li>• Start building your app!</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Next.js App Router
            </h2>
            <p className="text-gray-600">
              This app uses the new App Router introduced in Next.js 13, which provides better
              performance, improved developer experience, and more flexible routing options.
              The app directory structure makes it easier to organize your application and
              leverage React Server Components for optimal performance.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
