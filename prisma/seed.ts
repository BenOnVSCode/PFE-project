import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting comprehensive seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create multiple clients
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
      bio: 'Tech startup founder looking for talented developers',
      location: 'San Francisco, CA',
      company: 'TechStart Inc.',
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
      bio: 'E-commerce entrepreneur with multiple online stores',
      location: 'New York, NY',
      company: 'E-Commerce Solutions',
    },
  })

  const client3 = await prisma.user.upsert({
    where: { email: 'client3@example.com' },
    update: {},
    create: {
      email: 'client3@example.com',
      name: 'Lisa Thompson',
      password: hashedPassword,
      role: 'CLIENT',
      isActive: true,
      emailVerified: new Date(),
      bio: 'Marketing agency owner specializing in digital campaigns',
      location: 'Los Angeles, CA',
      company: 'Digital Marketing Pro',
    },
  })

  const client4 = await prisma.user.upsert({
    where: { email: 'client4@example.com' },
    update: {},
    create: {
      email: 'client4@example.com',
      name: 'Robert Davis',
      password: hashedPassword,
      role: 'CLIENT',
      isActive: true,
      emailVerified: new Date(),
      bio: 'Healthcare startup founder focused on patient management',
      location: 'Boston, MA',
      company: 'HealthTech Solutions',
    },
  })

  const client5 = await prisma.user.upsert({
    where: { email: 'client5@example.com' },
    update: {},
    create: {
      email: 'client5@example.com',
      name: 'Jennifer Martinez',
      password: hashedPassword,
      role: 'CLIENT',
      isActive: true,
      emailVerified: new Date(),
      bio: 'Non-profit organization director seeking tech solutions',
      location: 'Chicago, IL',
      company: 'Community Impact Foundation',
    },
  })

  // Create multiple developers
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
      bio: 'Full-stack developer with 5+ years experience in React, Node.js, and Python',
      location: 'Austin, TX',
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      experience: 'Senior developer with expertise in web applications and API development',
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
      bio: 'Mobile app developer specializing in React Native and Flutter',
      location: 'Seattle, WA',
      skills: ['React Native', 'Flutter', 'JavaScript', 'Firebase', 'iOS', 'Android'],
      experience: 'Mobile development expert with 4+ years building cross-platform apps',
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
      bio: 'Data scientist and backend developer with ML expertise',
      location: 'Denver, CO',
      skills: ['Python', 'Django', 'Machine Learning', 'TensorFlow', 'PostgreSQL', 'Docker'],
      experience: 'Data science and backend development with focus on AI/ML solutions',
    },
  })

  const developer4 = await prisma.user.upsert({
    where: { email: 'dev4@example.com' },
    update: {},
    create: {
      email: 'dev4@example.com',
      name: 'Sophie Chen',
      password: hashedPassword,
      role: 'DEVELOPER',
      isActive: true,
      emailVerified: new Date(),
      bio: 'Frontend specialist with expertise in modern JavaScript frameworks',
      location: 'Portland, OR',
      skills: ['Vue.js', 'React', 'TypeScript', 'CSS', 'Webpack', 'GraphQL'],
      experience: 'Frontend developer with 3+ years building responsive web applications',
    },
  })

  const developer5 = await prisma.user.upsert({
    where: { email: 'dev5@example.com' },
    update: {},
    create: {
      email: 'dev5@example.com',
      name: 'Marcus Johnson',
      password: hashedPassword,
      role: 'DEVELOPER',
      isActive: true,
      emailVerified: new Date(),
      bio: 'DevOps engineer and cloud architecture specialist',
      location: 'Miami, FL',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Linux'],
      experience: 'DevOps engineer with expertise in cloud infrastructure and automation',
    },
  })

  const developer6 = await prisma.user.upsert({
    where: { email: 'dev6@example.com' },
    update: {},
    create: {
      email: 'dev6@example.com',
      name: 'Rachel Green',
      password: hashedPassword,
      role: 'DEVELOPER',
      isActive: true,
      emailVerified: new Date(),
      bio: 'WordPress and PHP developer with e-commerce experience',
      location: 'Phoenix, AZ',
      skills: ['PHP', 'WordPress', 'WooCommerce', 'MySQL', 'JavaScript', 'CSS'],
      experience: 'WordPress developer with 4+ years building custom themes and plugins',
    },
  })

  console.log('Created users:', { 
    clients: [client1, client2, client3, client4, client5], 
    developers: [developer1, developer2, developer3, developer4, developer5, developer6] 
  })

  // Create gigs with all possible statuses
  console.log('Creating gigs with all statuses...')

  // DRAFT gig
  const draftGig = await prisma.gig.create({
    data: {
      title: 'Social Media Management Platform',
      description: `I need a comprehensive social media management platform that allows scheduling posts across multiple platforms, analytics tracking, and team collaboration features. This is still in planning phase.`,
      budget: '$8,000 - $12,000',
      timeline: '12-16 weeks',
      skills: ['React', 'Node.js', 'MongoDB', 'Social Media APIs', 'Analytics'],
      status: 'DRAFT',
      ownerId: client3.id,
    },
  })

  // OPEN gigs
  const openGig1 = await prisma.gig.create({
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
      status: 'OPEN',
      ownerId: client1.id,
    },
  })

  const openGig2 = await prisma.gig.create({
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
      ownerId: client2.id,
    },
  })

  const openGig3 = await prisma.gig.create({
    data: {
      title: 'Healthcare Patient Portal',
      description: `We need a secure patient portal for our healthcare practice that allows patients to:

- View medical records and test results
- Schedule appointments online
- Communicate with healthcare providers
- Access educational resources
- Make payments securely

The system must be HIPAA compliant and integrate with our existing EMR system.`,
      budget: '$15,000 - $25,000',
      timeline: '16-20 weeks',
      skills: ['React', 'Node.js', 'PostgreSQL', 'HIPAA Compliance', 'EMR Integration'],
      status: 'OPEN',
      ownerId: client4.id,
    },
  })

  // IN_PROGRESS gigs
  const inProgressGig1 = await prisma.gig.create({
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
      status: 'IN_PROGRESS',
      ownerId: client2.id,
    },
  })

  const inProgressGig2 = await prisma.gig.create({
    data: {
      title: 'Non-Profit Volunteer Management System',
      description: `Our non-profit organization needs a volunteer management system to:

- Track volunteer hours and activities
- Manage volunteer applications and onboarding
- Schedule volunteer shifts
- Send automated reminders and communications
- Generate reports for grant applications
- Integrate with our donor management system

The system should be user-friendly for both staff and volunteers.`,
      budget: '$6,000 - $10,000',
      timeline: '10-14 weeks',
      skills: ['Vue.js', 'Laravel', 'MySQL', 'Email Integration', 'Reporting'],
      status: 'IN_PROGRESS',
      ownerId: client5.id,
    },
  })

  // ON_HOLD gigs
  const onHoldGig1 = await prisma.gig.create({
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

  const onHoldGig2 = await prisma.gig.create({
    data: {
      title: 'Blockchain-Based Supply Chain Tracking',
      description: `We need a blockchain-based system to track products through our supply chain from manufacturer to consumer. The system should provide transparency and authenticity verification.

Features needed:
- Product registration and tracking
- Smart contracts for automated processes
- Mobile app for end consumers
- Admin dashboard for supply chain management
- Integration with existing ERP systems

This project is currently on hold pending budget approval.`,
      budget: '$50,000 - $80,000',
      timeline: '24-32 weeks',
      skills: ['Blockchain', 'Solidity', 'React', 'Node.js', 'Smart Contracts'],
      status: 'ON_HOLD',
      ownerId: client3.id,
    },
  })

  // UNDER_REVIEW gigs
  const underReviewGig1 = await prisma.gig.create({
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
      status: 'UNDER_REVIEW',
      ownerId: client2.id,
    },
  })

  const underReviewGig2 = await prisma.gig.create({
    data: {
      title: 'Cloud Migration and DevOps Setup',
      description: `We need to migrate our existing applications to AWS and set up a complete DevOps pipeline. This includes:

- Containerization of existing applications
- Setting up CI/CD pipelines
- Infrastructure as Code using Terraform
- Monitoring and logging setup
- Security best practices implementation
- Documentation and training for the team

The migration should be done with minimal downtime and include rollback procedures.`,
      budget: '$20,000 - $35,000',
      timeline: '12-16 weeks',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
      status: 'UNDER_REVIEW',
      ownerId: client4.id,
    },
  })

  // COMPLETED gigs
  const completedGig1 = await prisma.gig.create({
    data: {
      title: 'Company Website Redesign',
      description: `We needed a complete redesign of our company website with modern design, improved user experience, and better SEO. The project included:

- Responsive design for all devices
- Content management system integration
- Contact forms and lead generation
- Blog functionality
- SEO optimization
- Performance optimization

The project was completed successfully and the website is now live.`,
      budget: '$3,500 - $5,000',
      timeline: '6-8 weeks',
      skills: ['React', 'Next.js', 'Tailwind CSS', 'Contentful', 'SEO'],
      status: 'COMPLETED',
      ownerId: client3.id,
    },
  })

  const completedGig2 = await prisma.gig.create({
    data: {
      title: 'Inventory Management System',
      description: `We needed a custom inventory management system for our retail business. The system includes:

- Product catalog management
- Stock level tracking
- Automated reorder alerts
- Barcode scanning integration
- Sales reporting and analytics
- Multi-location support

The system has been successfully deployed and is being used daily by our team.`,
      budget: '$8,000 - $12,000',
      timeline: '10-14 weeks',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Barcode API', 'Reporting'],
      status: 'COMPLETED',
      ownerId: client1.id,
    },
  })

  // CANCELLED gigs
  const cancelledGig1 = await prisma.gig.create({
    data: {
      title: 'Mobile Game Development',
      description: `We were looking to develop a mobile puzzle game for iOS and Android. The game was planned to have:

- Multiple puzzle levels
- In-app purchases
- Social features and leaderboards
- Cross-platform multiplayer
- Regular content updates

Unfortunately, this project was cancelled due to budget constraints and changing business priorities.`,
      budget: '$25,000 - $40,000',
      timeline: '20-28 weeks',
      skills: ['Unity', 'C#', 'Mobile Development', 'Game Design', 'Multiplayer'],
      status: 'CANCELLED',
      ownerId: client5.id,
    },
  })

  // CLOSED gigs
  const closedGig1 = await prisma.gig.create({
    data: {
      title: 'Legacy System Modernization',
      description: `We needed to modernize our legacy COBOL system and migrate it to a modern web-based platform. The project included:

- Data migration from legacy systems
- New web interface development
- API development for integrations
- User training and documentation
- Testing and quality assurance

This project was closed after successful completion and the legacy system has been decommissioned.`,
      budget: '$100,000 - $150,000',
      timeline: '32-40 weeks',
      skills: ['COBOL', 'Java', 'Spring Boot', 'React', 'Database Migration'],
      status: 'CLOSED',
      ownerId: client4.id,
    },
  })

  console.log('Created gigs with all statuses:', { 
    draftGig, 
    openGigs: [openGig1, openGig2, openGig3], 
    inProgressGigs: [inProgressGig1, inProgressGig2], 
    onHoldGigs: [onHoldGig1, onHoldGig2], 
    underReviewGigs: [underReviewGig1, underReviewGig2], 
    completedGigs: [completedGig1, completedGig2], 
    cancelledGig1, 
    closedGig1 
  })

  // Create applications for various gigs
  console.log('Creating applications...')

  // Applications for OPEN gigs
  const app1 = await prisma.application.create({
    data: {
      gigId: openGig1.id,
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

  const app2 = await prisma.application.create({
    data: {
      gigId: openGig1.id,
      authorId: developer4.id,
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

Sophie`,
      status: 'PENDING',
    },
  })

  const app3 = await prisma.application.create({
    data: {
      gigId: openGig2.id,
      authorId: developer2.id,
      message: `Hi Mike,

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

Emma`,
      status: 'PENDING',
    },
  })

  const app4 = await prisma.application.create({
    data: {
      gigId: openGig3.id,
      authorId: developer1.id,
      message: `Hello Robert,

I'm very interested in your healthcare patient portal project. I have experience with HIPAA-compliant applications and healthcare systems.

My technical approach:
- React for the frontend with secure authentication
- Node.js with Express for the backend API
- PostgreSQL for secure data storage
- HIPAA compliance implementation
- EMR system integration
- Secure communication features

I have experience working with healthcare clients and understand the importance of security and compliance. I can deliver a comprehensive solution within your timeline.

Key deliverables:
- Secure patient portal with role-based access
- Appointment scheduling system
- Medical records viewing
- Secure messaging system
- Payment processing
- EMR integration

I'm available to start next week and can provide a detailed project plan.

Best,
Alex`,
      status: 'PENDING',
    },
  })

  // Applications for IN_PROGRESS gigs (already accepted)
  const app5 = await prisma.application.create({
    data: {
      gigId: inProgressGig1.id,
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
      status: 'ACCEPTED',
    },
  })

  const app6 = await prisma.application.create({
    data: {
      gigId: inProgressGig2.id,
      authorId: developer4.id,
      message: `Hello Jennifer,

I'm excited about your volunteer management system project! I have experience building systems for non-profit organizations.

My approach:
- Vue.js for the frontend with intuitive user interface
- Laravel for the backend API
- MySQL for data storage
- Email integration for automated communications
- Comprehensive reporting system
- Donor management system integration

I understand the unique needs of non-profit organizations and can deliver a solution that meets your requirements while staying within budget.

Key features:
- Volunteer registration and onboarding
- Shift scheduling and management
- Automated reminder system
- Hours tracking and reporting
- Grant application reports
- Donor system integration

I'm available to start immediately and can provide a detailed project plan.

Best,
Sophie`,
      status: 'ACCEPTED',
    },
  })

  // Applications for UNDER_REVIEW gigs
  const app7 = await prisma.application.create({
    data: {
      gigId: underReviewGig1.id,
      authorId: developer6.id,
      message: `Hello Mike,

I specialize in WordPress development and would love to work on your event registration plugin! I have 4+ years of experience building custom WordPress plugins.

My expertise includes:
- Custom post types and fields
- Payment gateway integration (Stripe, PayPal)
- Email notification systems
- Admin interface development
- CSV export functionality
- WordPress security best practices

I can deliver a well-documented, secure plugin that integrates seamlessly with your existing WordPress theme. The 3-4 week timeline works perfectly for me.

Key deliverables:
- Custom event post type
- Registration form with validation
- Stripe payment integration
- Email notifications
- Admin management interface
- CSV export functionality
- Complete documentation

I'm available to start immediately and can provide a detailed project plan.

Best,
Rachel`,
      status: 'PENDING',
    },
  })

  const app8 = await prisma.application.create({
    data: {
      gigId: underReviewGig2.id,
      authorId: developer5.id,
      message: `Hello Robert,

I'm very interested in your cloud migration and DevOps setup project. I specialize in AWS cloud architecture and DevOps automation.

My technical approach:
- Containerization with Docker and Kubernetes
- Infrastructure as Code using Terraform
- CI/CD pipeline setup with GitHub Actions
- Monitoring and logging with CloudWatch and ELK stack
- Security best practices implementation
- Zero-downtime deployment strategies

I have experience migrating legacy applications to AWS and setting up complete DevOps pipelines. I can deliver a robust, scalable solution within your timeline.

Key deliverables:
- Containerized applications
- Automated CI/CD pipelines
- Infrastructure as Code
- Monitoring and alerting setup
- Security hardening
- Documentation and training
- Rollback procedures

I'm available to start next week and can provide a detailed project plan.

Best,
Marcus`,
      status: 'PENDING',
    },
  })

  console.log('Created applications:', { 
    openGigApps: [app1, app2, app3, app4], 
    inProgressApps: [app5, app6], 
    underReviewApps: [app7, app8] 
  })

  // Create sample reviews for completed gigs
  console.log('Creating reviews...')

  const review1 = await prisma.review.create({
    data: {
      gigId: completedGig1.id,
      reviewerId: client3.id, // Lisa Thompson (client) reviewing developer
      revieweeId: developer1.id, // Alex Rodriguez (developer)
      rating: 5,
      comment: 'Alex delivered an excellent website redesign that exceeded our expectations. The code was clean, well-documented, and the website works flawlessly. Great communication throughout the project and delivered on time. Highly recommended!'
    }
  })

  const review2 = await prisma.review.create({
    data: {
      gigId: completedGig1.id,
      reviewerId: developer1.id, // Alex Rodriguez (developer) reviewing client
      revieweeId: client3.id, // Lisa Thompson (client)
      rating: 4,
      comment: 'Lisa was a great client to work with. Clear requirements, responsive feedback, and fair payment terms. The project scope was well-defined and she was understanding when we needed to make adjustments. Would work with her again.'
    }
  })

  const review3 = await prisma.review.create({
    data: {
      gigId: completedGig2.id,
      reviewerId: client1.id, // Sarah Johnson (client) reviewing developer
      revieweeId: developer2.id, // Emma Wilson (developer)
      rating: 5,
      comment: 'Emma did an outstanding job on our inventory management system. The system is user-friendly, efficient, and has significantly improved our operations. She was professional, responsive, and delivered exactly what we needed. Excellent work!'
    }
  })

  const review4 = await prisma.review.create({
    data: {
      gigId: completedGig2.id,
      reviewerId: developer2.id, // Emma Wilson (developer) reviewing client
      revieweeId: client1.id, // Sarah Johnson (client)
      rating: 5,
      comment: 'Sarah was an excellent client to work with. She provided clear requirements, was always available for feedback, and made the payment process smooth. The project was well-organized and I would definitely work with her again.'
    }
  })

  console.log('Created reviews:', { review1, review2, review3, review4 })

  console.log('Seed completed successfully!')
  console.log('\n=== COMPREHENSIVE TEST DATA CREATED ===')
  console.log('\n📊 SUMMARY:')
  console.log(`👥 Users: ${5 + 6} total (5 clients, 6 developers)`)
  console.log(`📋 Gigs: ${1 + 3 + 2 + 2 + 2 + 2 + 1 + 1} total`)
  console.log(`   - DRAFT: 1`)
  console.log(`   - OPEN: 3`)
  console.log(`   - IN_PROGRESS: 2`)
  console.log(`   - ON_HOLD: 2`)
  console.log(`   - UNDER_REVIEW: 2`)
  console.log(`   - COMPLETED: 2`)
  console.log(`   - CANCELLED: 1`)
  console.log(`   - CLOSED: 1`)
  console.log(`📝 Applications: 8 total`)
  console.log(`⭐ Reviews: 4 total`)
  
  console.log('\n🔐 TEST ACCOUNTS (password: password123):')
  console.log('\n👔 CLIENTS:')
  console.log('- client1@example.com (Sarah Johnson) - TechStart Inc.')
  console.log('- client2@example.com (Mike Chen) - E-Commerce Solutions')
  console.log('- client3@example.com (Lisa Thompson) - Digital Marketing Pro')
  console.log('- client4@example.com (Robert Davis) - HealthTech Solutions')
  console.log('- client5@example.com (Jennifer Martinez) - Community Impact Foundation')
  
  console.log('\n💻 DEVELOPERS:')
  console.log('- dev1@example.com (Alex Rodriguez) - Full-stack developer')
  console.log('- dev2@example.com (Emma Wilson) - Mobile app developer')
  console.log('- dev3@example.com (David Kim) - Data scientist & backend')
  console.log('- dev4@example.com (Sophie Chen) - Frontend specialist')
  console.log('- dev5@example.com (Marcus Johnson) - DevOps engineer')
  console.log('- dev6@example.com (Rachel Green) - WordPress developer')
  
  console.log('\n🎯 TESTING SCENARIOS:')
  console.log('1. Login as any client to see their gigs and manage applications')
  console.log('2. Login as any developer to browse open gigs and view applications')
  console.log('3. Test status management by changing gig statuses')
  console.log('4. Test application acceptance (sets gig to IN_PROGRESS)')
  console.log('5. View reviews on completed projects')
  console.log('6. Check dashboard stats for all statuses')
  
  console.log('\n✨ All features are ready for testing!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
