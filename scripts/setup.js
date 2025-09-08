const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function setupDatabase() {
  console.log('🚀 Setting up database...')

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!')
    console.error('Please create a .env file with your database connection string.')
    console.error('Example: DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"')
    process.exit(1)
  }

  try {
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@moe.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    console.log('📧 Creating admin user...')

    const hashedPassword = await hashPassword(adminPassword)

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Mohamed Abdelrazig Abdelrahim',
        personalInfo: {
          create: {
            name: 'PortfolioPro Platform',
            title: 'Professional Portfolio Platform',
            description: 'Transform your professional presence with our comprehensive portfolio platform. Create stunning, modern websites that showcase your work, skills, and experience with ease.',
            email: 'hello@portfoliopro.com',
            location: 'Online Platform',
            phone: '1-800-PORTFOLIO',
            bio: 'PortfolioPro is your complete solution for creating professional portfolios that impress. With our intuitive dashboard, you can easily manage your content, customize themes, and showcase your work to potential clients and employers.',
            availability: 'Always Available',
            availabilityStatus: 'available',
          }
        },
        settings: {
          create: {}
        }
      },
      include: {
        personalInfo: true,
        settings: true
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   User ID: ${adminUser.id}`)
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('   ⚠️  Please change the password after first login!')
    console.log('')
    // Automatically update .env file
    const { execSync } = require('child_process')
    try {
      execSync(`node scripts/setup-env.js "${adminUser.id}"`, { stdio: 'inherit' })
    } catch (error) {
      console.log('📋 Please manually add this to your .env file:')
      console.log(`DEFAULT_USER_ID="${adminUser.id}"`)
    }

    // Create default site content
    console.log('📝 Creating default site content...')
    const defaultContent = [
      { section: 'navigation', key: 'brandName', value: 'Your Portfolio' },
      { section: 'navigation', key: 'brandInitials', value: 'YP' },
      { section: 'navigation', key: 'resumeButtonText', value: 'Resume' },
      { section: 'hero', key: 'greeting', value: 'Hi, I\'m' },
      { section: 'hero', key: 'primaryButtonText', value: 'View Projects' },
      { section: 'hero', key: 'secondaryButtonText', value: 'Contact Me' },
      { section: 'about', key: 'title', value: 'About Me' },
      { section: 'about', key: 'subtitle', value: 'My background and journey' },
      { section: 'about', key: 'nameLabel', value: 'Name' },
      { section: 'about', key: 'emailLabel', value: 'Email' },
      { section: 'skills', key: 'title', value: 'My Skills' },
      { section: 'skills', key: 'subtitle', value: 'Technologies I work with' },
      { section: 'projects', key: 'title', value: 'My Projects' },
      { section: 'projects', key: 'subtitle', value: 'Showcase of my work' },
      { section: 'experience', key: 'title', value: 'Work Experience' },
      { section: 'experience', key: 'subtitle', value: 'My professional journey' },
      { section: 'contact', key: 'title', value: 'Get In Touch' },
      { section: 'contact', key: 'subtitle', value: 'Let\'s work together' },
      { section: 'footer', key: 'copyrightText', value: '© 2024 Your Portfolio. All rights reserved.' },
      { section: 'status', key: 'available', value: 'Available for new opportunities' },
      { section: 'status', key: 'busy', value: 'Currently busy with existing projects' },
      { section: 'forms', key: 'contact', value: '{"title":"Send Me a Message","namePlaceholder":"Your Name","emailPlaceholder":"Your Email","submitButtonText":"Send Message","successTitle":"Message sent!"}' },
      { section: 'admin', key: 'dashboard', value: '{"title":"Portfolio Dashboard","backToPortfolioText":"Back to Portfolio","previewSiteText":"Preview Site"}' },
      { section: 'accessibility', key: 'adminDashboard', value: 'Admin Dashboard' },
      { section: 'accessibility', key: 'moreOptions', value: 'More options' },
      { section: 'accessibility', key: 'closeMenu', value: 'Close menu' },
    ]

    await prisma.siteContent.createMany({
      data: defaultContent,
      skipDuplicates: true,
    })

    console.log('✅ Default site content created!')

    // Create sample data for demonstration
    console.log('🎯 Creating sample portfolio data...')

    // Sample skills (Platform capabilities)
    await prisma.skill.createMany({
      data: [
        { userId: adminUser.id, name: 'Next.js', level: 98 },
        { userId: adminUser.id, name: 'React', level: 95 },
        { userId: adminUser.id, name: 'TypeScript', level: 92 },
        { userId: adminUser.id, name: 'Tailwind CSS', level: 90 },
        { userId: adminUser.id, name: 'Node.js', level: 88 },
        { userId: adminUser.id, name: 'PostgreSQL', level: 85 },
        { userId: adminUser.id, name: 'Prisma ORM', level: 87 },
        { userId: adminUser.id, name: 'Vercel Deployment', level: 90 },
        { userId: adminUser.id, name: 'Responsive Design', level: 95 },
        { userId: adminUser.id, name: 'Modern UI/UX', level: 92 },
        { userId: adminUser.id, name: 'Admin Dashboard', level: 90 },
        { userId: adminUser.id, name: 'Theme Customization', level: 88 },
      ],
    })

    // Sample social links
    await prisma.socialLink.createMany({
      data: [
        { userId: adminUser.id, platform: 'GitHub', url: 'https://github.com/Moegreen249', icon: 'Github' },
        { userId: adminUser.id, platform: 'LinkedIn', url: 'https://linkedin.com/in/mohamedabdelrazig', icon: 'Linkedin' },
        { userId: adminUser.id, platform: 'Email', url: 'mailto:mohamed2abdelrazig@gmail.com', icon: 'Mail' },
      ],
    })

    // Sample projects (Portfolio examples)
    await prisma.project.createMany({
      data: [
        {
          userId: adminUser.id,
          title: 'Creative Designer Portfolio',
          description: 'A stunning portfolio showcasing creative work with interactive galleries, client testimonials, and project showcases. Perfect for designers, photographers, and creative professionals.',
          demoUrl: '#',
          featured: true,
        },
        {
          userId: adminUser.id,
          title: 'Tech Developer Portfolio',
          description: 'Modern portfolio for developers featuring code snippets, project repositories, technical skills, and GitHub integration. Showcases technical expertise and coding projects.',
          demoUrl: '#',
          featured: true,
        },
        {
          userId: adminUser.id,
          title: 'Business Professional Portfolio',
          description: 'Professional portfolio for consultants and business professionals with case studies, client success stories, and service offerings.',
          demoUrl: '#',
          featured: true,
        },
        {
          userId: adminUser.id,
          title: 'Artist & Content Creator Portfolio',
          description: 'Dynamic portfolio for artists and content creators featuring media galleries, social media integration, and audience engagement tools.',
          demoUrl: '#',
          featured: true,
        },
        {
          userId: adminUser.id,
          title: 'Freelancer Service Portfolio',
          description: 'Comprehensive portfolio for freelancers showcasing services, pricing, testimonials, and project timelines. Includes booking and inquiry forms.',
          demoUrl: '#',
          featured: true,
        },
        {
          userId: adminUser.id,
          title: 'Agency Portfolio',
          description: 'Multi-page portfolio for agencies featuring team profiles, service offerings, case studies, and client testimonials with advanced customization options.',
          demoUrl: '#',
          featured: true,
        },
      ],
    })

    // Sample experience (Platform development journey)
    await prisma.experience.createMany({
      data: [
        {
          userId: adminUser.id,
          company: 'PortfolioPro Platform',
          position: 'Core Platform Development',
          duration: '2024 - Present',
          description: 'Built the foundation of PortfolioPro with Next.js and TypeScript, implementing a robust admin dashboard, theme customization system, and content management features. Created responsive designs that work seamlessly across all devices.',
        },
        {
          userId: adminUser.id,
          company: 'PortfolioPro Platform',
          position: 'Advanced Features & Integration',
          duration: '2024 - Present',
          description: 'Integrated Prisma ORM with PostgreSQL for data persistence, implemented authentication system, and added advanced features like live preview, theme builder, and multi-language support.',
        },
        {
          userId: adminUser.id,
          company: 'PortfolioPro Platform',
          position: 'UI/UX Design & Optimization',
          duration: '2024 - Present',
          description: 'Designed and implemented modern UI components, optimized performance, and created an intuitive user experience that makes portfolio creation effortless for users of all skill levels.',
        },
        {
          userId: adminUser.id,
          company: 'PortfolioPro Platform',
          position: 'Deployment & Scaling',
          duration: '2024 - Present',
          description: 'Configured Vercel deployment pipeline, implemented CI/CD processes, and optimized the platform for scalability. Added analytics, monitoring, and continuous improvement features.',
        },
      ],
    })

    console.log('✅ Sample data created!')

    console.log('🎉 Database setup completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Add the DEFAULT_USER_ID to your .env file (shown above)')
    console.log('2. Start your development server: npm run dev')
    console.log('3. Visit your portfolio at: http://localhost:3000')
    console.log('4. Visit the admin dashboard at: http://localhost:3000/admin')
    console.log('5. Log in with the admin credentials above')
    console.log('6. Configure your email settings in the Settings page')
    console.log('7. Start customizing your PortfolioPro content!')
    console.log('')
    console.log('🎉 Your PortfolioPro platform is ready!')
    console.log('   All content is now loaded from the database in production.')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    console.error('Error details:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run setup
setupDatabase()
  .catch((error) => {
    console.error('Setup script failed:', error)
    process.exit(1)
  })
