import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create clients
  const client1 = await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      name: 'Sarah Johnson',
      password: hashedPassword,
      role: 'CLIENT',
      isActive: true,
      emailVerified: new Date(),
    },
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'client2@example.com' },
    update: {},
    create: {
      email: 'client2@example.com',
      name: 'Mike Chen',
      password: hashedPassword,
      role: 'CLIENT',
      isActive: true,
      emailVerified: new Date(),
    },
  })

  // Create developers
  const developer1 = await prisma.user.upsert({
    where: { email: 'dev1@example.com' },
    update: {},
    create: {
      email: 'dev1@example.com',
      name: 'Alex Rodriguez',
      password: hashedPassword,
      role: 'DEVELOPER',
      isActive: true,
      emailVerified: new Date(),
    },
  })

  const developer2 = await prisma.user.upsert({
    where: { email: 'dev2@example.com' },
    update: {},
    create: {
      email: 'dev2@example.com',
      name: 'Emma Wilson',
      password: hashedPassword,
      role: 'DEVELOPER',
      isActive: true,
      emailVerified: new Date(),
    },
  })

  const developer3 = await prisma.user.upsert({
    where: { email: 'dev3@example.com' },
    update: {},
    create: {
      email: 'dev3@example.com',
      name: 'David Kim',
      password: hashedPassword,
      role: 'DEVELOPER',
      isActive: true,
      emailVerified: new Date(),
    },
  })

  console.log('Created users:', { client1, client2, developer1, developer2, developer3 })

  // Create test gigs
  const gig1 = await prisma.gig.create({
    data: {
      title: 'E-commerce Website Development',
      description: `I need a modern, responsive e-commerce website built for my online store. The website should include:

- Product catalog with search and filtering
- Shopping cart and checkout functionality
- User accounts and order history
- Admin panel for inventory management
- Payment integration (Stripe/PayPal)
- Mobile-responsive design
- SEO optimization

The store will initially have around 500 products across 20 categories. I'm looking for a clean, modern design that's easy to navigate.

Please include your portfolio and estimated timeline in your proposal.`,
      budget: '$2,000 - $4,000',
      timeline: '4-6 weeks',
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'CSS'],
      status: 'IN_PROGRESS',
      ownerId: client1.id,
    },
  })

  const gig2 = await prisma.gig.create({
    data: {
      title: 'Mobile App for Food Delivery',
      description: `Looking for an experienced developer to create a food delivery mobile app for both iOS and Android.

Key features needed:
- User registration and authentication
- Restaurant listings with menus
- Real-time order tracking
- Payment processing
- Push notifications
- Admin dashboard for restaurants
- Driver app for delivery personnel

The app should handle high traffic and have a scalable architecture. Experience with React Native or Flutter is preferred.

Please share examples of similar apps you've built.`,
      budget: '$5,000 - $8,000',
      timeline: '8-12 weeks',
      skills: ['React Native', 'Firebase', 'Node.js', 'PostgreSQL', 'AWS'],
      status: 'OPEN',
      ownerId: client1.id,
    },
  })

  const gig3 = await prisma.gig.create({
    data: {
      title: 'Data Analytics Dashboard',
      description: `I need a comprehensive data analytics dashboard for my business. The dashboard should:

- Connect to multiple data sources (Google Analytics, Facebook Ads, CRM)
- Display key metrics and KPIs
- Generate automated reports
- Allow custom date range filtering
- Export data to Excel/PDF
- Real-time data updates
- User role management

The dashboard should be intuitive and provide actionable insights for business decisions.

Experience with data visualization libraries and API integrations is essential.`,
      budget: '$3,000 - $5,000',
      timeline: '6-8 weeks',
      skills: ['Python', 'Django', 'JavaScript', 'Chart.js', 'PostgreSQL'],
      status: 'UNDER_REVIEW',
      ownerId: client2.id,
    },
  })

  const gig4 = await prisma.gig.create({
    data: {
      title: 'WordPress Plugin Development',
      description: `I need a custom WordPress plugin that will help manage event registrations for my organization.

Plugin requirements:
- Custom post type for events
- Registration form with custom fields
- Payment integration (Stripe)
- Email notifications
- Admin interface for managing registrations
- Export registrations to CSV
- Integration with existing WordPress theme

The plugin should be well-documented and easy to maintain. Experience with WordPress development and security best practices is required.`,
      budget: '$1,500 - $2,500',
      timeline: '3-4 weeks',
      skills: ['PHP', 'WordPress', 'JavaScript', 'MySQL', 'Stripe API'],
      status: 'COMPLETED',
      ownerId: client2.id,
    },
  })

  const gig5 = await prisma.gig.create({
    data: {
      title: 'AI-Powered Chatbot Integration',
      description: `Looking to integrate an AI-powered chatbot into my existing website to improve customer support.

Requirements:
- Natural language processing capabilities
- Integration with existing website (React/Next.js)
- Training on company-specific knowledge base
- Multi-language support (English, Spanish)
- Analytics and conversation tracking
- Fallback to human agents when needed
- Custom branding and styling

Experience with AI/ML libraries and chatbot development is essential. Please include examples of previous chatbot projects.`,
      budget: '$4,000 - $6,000',
      timeline: '6-8 weeks',
      skills: ['Python', 'TensorFlow', 'React', 'Node.js', 'OpenAI API'],
      status: 'ON_HOLD',
      ownerId: client1.id,
    },
  })

  console.log('Created gigs:', { gig1, gig2, gig3, gig4, gig5 })

  // Create test applications
  const application1 = await prisma.application.create({
    data: {
      gigId: gig1.id,
      authorId: developer1.id,
      message: `Hi Sarah,

I'm excited about your e-commerce project! I have 5+ years of experience building modern web applications and have successfully delivered 20+ e-commerce sites.

Here's my approach:
1. Set up a scalable React frontend with Next.js for SEO optimization
2. Build a robust Node.js backend with Express and MongoDB
3. Integrate Stripe for secure payments
4. Implement responsive design with Tailwind CSS
5. Add comprehensive testing and documentation

I can start immediately and deliver within your 4-6 week timeline. I'll provide weekly progress updates and include 30 days of post-launch support.

My portfolio includes similar projects for retail clients. I'm confident I can deliver exactly what you're looking for.

Best regards,
Alex`,
      status: 'PENDING',
    },
  })

  const application2 = await prisma.application.create({
    data: {
      gigId: gig1.id,
      authorId: developer2.id,
      message: `Hello Sarah,

I specialize in e-commerce development and would love to work on your project! I've built over 15 successful online stores with features similar to what you need.

My expertise includes:
- React/Next.js for frontend development
- Node.js and Express for backend
- MongoDB for data management
- Stripe integration for payments
- Responsive design and mobile optimization

I can complete this project in 5 weeks with high-quality code and comprehensive documentation. I also offer 60 days of free maintenance and support.

Let's discuss your specific requirements in more detail. I'm available for a video call this week.

Looking forward to working with you!

Emma`,
      status: 'PENDING',
    },
  })

  const application3 = await prisma.application.create({
    data: {
      gigId: gig2.id,
      authorId: developer1.id,
      message: `Hi Sarah,

Your food delivery app project sounds exciting! I have extensive experience building mobile apps for the food industry.

My approach:
- React Native for cross-platform development
- Firebase for real-time features and backend
- Google Maps integration for delivery tracking
- Stripe for payment processing
- Push notifications for order updates

I've built 3 similar food delivery apps and can show you live examples. The 8-12 week timeline works perfectly for me.

I'll provide:
- Complete source code
- App store deployment assistance
- 90 days of support and bug fixes
- Documentation and training for your team

Ready to start immediately!

Alex`,
      status: 'PENDING',
    },
  })

  const application4 = await prisma.application.create({
    data: {
      gigId: gig3.id,
      authorId: developer3.id,
      message: `Hello Mike,

I'm very interested in your analytics dashboard project. I specialize in data visualization and business intelligence solutions.

My technical approach:
- Python with Django for the backend API
- React for the interactive frontend
- Chart.js and D3.js for advanced visualizations
- PostgreSQL for data storage
- Automated report generation
- Real-time data processing

I have experience integrating with Google Analytics, Facebook Ads API, and various CRM systems. I can deliver a comprehensive solution within your timeline.

Key deliverables:
- Responsive dashboard with customizable widgets
- Automated daily/weekly/monthly reports
- Data export functionality
- User management system
- API documentation

I'm available to start next week and can provide a detailed project plan.

Best,
David`,
      status: 'PENDING',
    },
  })

  console.log('Created applications:', { application1, application2, application3, application4 })

  // Create sample reviews for completed gigs
  const review1 = await prisma.review.create({
    data: {
      gigId: gig4.id, // WordPress Plugin Development (completed)
      reviewerId: client2.id, // Mike Chen (client) reviewing developer
      revieweeId: developer1.id, // Alex Rodriguez (developer)
      rating: 5,
      comment: 'Alex delivered an excellent WordPress plugin that exceeded our expectations. The code was clean, well-documented, and the plugin works flawlessly. Great communication throughout the project and delivered on time. Highly recommended!'
    }
  })

  const review2 = await prisma.review.create({
    data: {
      gigId: gig4.id, // WordPress Plugin Development (completed)
      reviewerId: developer1.id, // Alex Rodriguez (developer) reviewing client
      revieweeId: client2.id, // Mike Chen (client)
      rating: 4,
      comment: 'Mike was a great client to work with. Clear requirements, responsive feedback, and fair payment terms. The project scope was well-defined and he was understanding when we needed to make adjustments. Would work with him again.'
    }
  })

  // Update some applications to accepted status for more realistic data
  await prisma.application.update({
    where: { id: application1.id },
    data: { status: 'ACCEPTED' }
  })

  await prisma.application.update({
    where: { id: application4.id },
    data: { status: 'ACCEPTED' }
  })

  console.log('Created reviews:', { review1, review2 })

  console.log('Seed completed successfully!')
  console.log('\nTest accounts created:')
  console.log('Clients:')
  console.log('- client1@example.com / password123 (Sarah Johnson)')
  console.log('- client2@example.com / password123 (Mike Chen)')
  console.log('Developers:')
  console.log('- dev1@example.com / password123 (Alex Rodriguez)')
  console.log('- dev2@example.com / password123 (Emma Wilson)')
  console.log('- dev3@example.com / password123 (David Kim)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
