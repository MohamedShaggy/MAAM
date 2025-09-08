const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  // Check if admin user exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'mohamed2abdelrazig@gmail.com' }
  })

  let adminUser

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    adminUser = existingAdmin

    // Update the admin user's personal info with Mohamed's content
    await prisma.personalInfo.upsert({
      where: { userId: adminUser.id },
      update: {
        name: 'Mohamed Abdelrazig Abdelrahim',
        title: 'IT Support Engineer & Frontend Developer',
        description: 'I\'m an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings.',
        email: 'mohamed2abdelrazig@gmail.com',
        location: 'Cairo, Egypt',
        phone: '+201102305748',
        avatar: '/profile-image.jpg',
        bio: 'I\'m an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings. Currently expanding my skills in frontend development and graphic design.',
        availability: 'Available for opportunities',
        availabilityStatus: 'available',
      },
      create: {
        userId: adminUser.id,
        name: 'Mohamed Abdelrazig Abdelrahim',
        title: 'IT Support Engineer & Frontend Developer',
        description: 'I\'m an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings.',
        email: 'mohamed2abdelrazig@gmail.com',
        location: 'Cairo, Egypt',
        phone: '+201102305748',
        avatar: '/profile-image.jpg',
        bio: 'I\'m an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings. Currently expanding my skills in frontend development and graphic design.',
        availability: 'Available for opportunities',
        availabilityStatus: 'available',
      },
    })
  } else {
    console.log('📧 Creating Mohamed Abdelrazig admin user...')

    const hashedPassword = await hashPassword('admin123')

    adminUser = await prisma.user.create({
      data: {
        email: 'mohamed2abdelrazig@gmail.com',
        password: hashedPassword,
        name: 'Mohamed Abdelrazig Abdelrahim',
        personalInfo: {
          create: {
            name: 'Mohamed Abdelrazig Abdelrahim',
            title: 'IT Support Engineer & Frontend Developer',
            description: 'I\'m an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings.',
            email: 'mohamed2abdelrazig@gmail.com',
            location: 'Cairo, Egypt',
            phone: '+201102305748',
            avatar: '/profile-image.jpg',
            bio: 'I\'m an IT Support Engineer with over two years of experience setting up, fixing, and improving IT systems. I enjoy helping users with technical issues, using the ITIL framework to keep things running smoothly, and working in busy team settings. Currently expanding my skills in frontend development and graphic design.',
            availability: 'Available for opportunities',
            availabilityStatus: 'available',
          }
        },
        settings: {
          create: {
            siteName: 'Mohamed Abdelrazig - Portfolio',
            siteDescription: 'Professional portfolio of Mohamed Abdelrazig Abdelrahim - IT Support Engineer and Frontend Developer',
            contactEmail: 'mohamed2abdelrazig@gmail.com',
          }
        }
      },
      include: {
        personalInfo: true,
        settings: true
      }
    })

    console.log('✅ Mohamed Abdelrazig admin user created successfully!')
    console.log(`   Email: mohamed2abdelrazig@gmail.com`)
    console.log(`   Password: admin123`)
  }

  // Clear existing skills and create Mohamed's skills
  console.log('🎯 Updating skills...')
  await prisma.skill.deleteMany({
    where: { userId: adminUser.id }
  })

  await prisma.skill.createMany({
    data: [
      { userId: adminUser.id, name: 'IT Support', level: 95 },
      { userId: adminUser.id, name: 'Network Setup', level: 90 },
      { userId: adminUser.id, name: 'Hardware/Software Troubleshooting', level: 88 },
      { userId: adminUser.id, name: 'HTML/CSS', level: 85 },
      { userId: adminUser.id, name: 'JavaScript', level: 80 },
      { userId: adminUser.id, name: 'React', level: 75 },
      { userId: adminUser.id, name: 'ITIL Framework', level: 85 },
      { userId: adminUser.id, name: 'User Training', level: 90 },
      { userId: adminUser.id, name: 'Remote Support', level: 88 },
      { userId: adminUser.id, name: 'Microsoft Office', level: 90 },
      { userId: adminUser.id, name: 'Ticketing Systems', level: 85 },
      { userId: adminUser.id, name: 'Data Security', level: 80 },
    ],
  })

  // Clear existing projects and create Mohamed's projects
  console.log('📁 Updating portfolio projects...')
  await prisma.projectTag.deleteMany({
    where: {
      project: { userId: adminUser.id },
    },
  })
  await prisma.project.deleteMany({
    where: { userId: adminUser.id }
  })

  await prisma.project.createMany({
    data: [
      {
        userId: adminUser.id,
        title: 'Medad Educational Platform',
        description: 'Improved the user experience and design of educational websites including medad.bh, alkhair.medad.bh, alnukhbaschools.com, bazarsyria.site, and ai.medad.bh. Created responsive, user-friendly interfaces.',
        image: '/placeholder.svg?height=400&width=600',
        demoUrl: 'https://medad.bh',
        featured: true,
      },
      {
        userId: adminUser.id,
        title: 'CharismaAI Platform',
        description: 'An AI-powered platform for content generation and creative assistance. Built with modern web technologies to provide intelligent solutions.',
        image: '/placeholder.svg?height=400&width=600',
        demoUrl: 'https://charismaai.vercel.app',
        repoUrl: 'https://github.com/Moegreen249',
        featured: true,
      },
      {
        userId: adminUser.id,
        title: 'ERP System Implementation',
        description: 'Set up and configured ERP systems for over 230 clients, ensuring secure and efficient business operations with proper network infrastructure.',
        image: '/placeholder.svg?height=400&width=600',
        featured: true,
      },
      {
        userId: adminUser.id,
        title: 'CCTV & GPS Integration',
        description: 'Implemented comprehensive CCTV and GPS systems for client security and tracking needs, including network configuration and user training.',
        image: '/placeholder.svg?height=400&width=600',
        featured: true,
      },
      {
        userId: adminUser.id,
        title: 'IT Support Dashboard',
        description: 'Developed an internal dashboard for tracking IT support tickets, managing user accounts, and monitoring system performance.',
        image: '/placeholder.svg?height=400&width=600',
        featured: true,
      },
      {
        userId: adminUser.id,
        title: 'Remote Support Platform',
        description: 'Built a remote support platform to help users remotely, solving technical problems efficiently regardless of location.',
        image: '/placeholder.svg?height=400&width=600',
        featured: true,
      },
    ],
  })

  // Add project tags
  const projects = await prisma.project.findMany({
    where: { userId: adminUser.id },
    select: { id: true, title: true }
  })

  for (const project of projects) {
    let tags = []
    switch (project.title) {
      case 'Medad Educational Platform':
        tags = ['HTML', 'CSS', 'JavaScript', 'UI/UX', 'Responsive Design', 'Educational Technology']
        break
      case 'CharismaAI Platform':
        tags = ['AI', 'Web Development', 'JavaScript', 'Next.js', 'Vercel', 'Content Generation']
        break
      case 'ERP System Implementation':
        tags = ['ERP Systems', 'Network Setup', 'IT Infrastructure', 'Security', 'Business Solutions']
        break
      case 'CCTV & GPS Integration':
        tags = ['CCTV', 'GPS', 'Network Security', 'System Integration', 'Security Solutions']
        break
      case 'IT Support Dashboard':
        tags = ['Dashboard', 'IT Support', 'Ticketing System', 'User Management', 'Analytics']
        break
      case 'Remote Support Platform':
        tags = ['Remote Support', 'Web Platform', 'Technical Support', 'JavaScript', 'Real-time Communication']
        break
    }

    for (const tag of tags) {
      await prisma.projectTag.create({
        data: {
          projectId: project.id,
          tag: tag,
        },
      })
    }
  }

  // Clear existing experience and create Mohamed's experience
  console.log('📈 Updating experience...')
  await prisma.experienceTech.deleteMany({
    where: {
      experience: { userId: adminUser.id },
    },
  })
  await prisma.experience.deleteMany({
    where: { userId: adminUser.id }
  })

  await prisma.experience.createMany({
    data: [
      {
        userId: adminUser.id,
        company: 'Medad for Training and Education',
        position: 'Frontend Developer & Graphic Designer',
        duration: '2024 - Present',
        description: 'Improved the user experience and design of educational websites including medad.bh, alkhair.medad.bh, alnukhbaschools.com, bazarsyria.site, and ai.medad.bh. Built responsive website interfaces using HTML, CSS, and JavaScript. Created marketing materials and designs with Photoshop and Illustrator.',
      },
      {
        userId: adminUser.id,
        company: 'Almoheet For Information Technology',
        position: 'Technical Support Engineer',
        duration: 'Mar 2022 - Apr 2023',
        description: 'Managed IT setups for over 230 clients, configuring ERP, CCTV, GPS, and network systems. Resolved IT issues for 120 clients, reducing downtime by 2 hours per problem. Provided remote support and trained 45 clients on IT systems, improving productivity by 30%.',
      },
      {
        userId: adminUser.id,
        company: 'Marambash for Accounting Systems',
        position: 'Technical Support Associate',
        duration: 'Dec 2021 - Mar 2022',
        description: 'Set up networks and CCTV systems for 10 clients, ensuring secure and efficient operations. Resolved technical issues for 20 clients while managing user accounts and permissions. Utilized ticketing systems to track and resolve support requests.',
      },
      {
        userId: adminUser.id,
        company: 'Nahda College',
        position: 'Student - Bachelor of Science in Information Technology',
        duration: 'Jun 2016 - Feb 2022',
        description: 'Completed Bachelor\'s degree in Information Technology, gaining comprehensive knowledge in computer science, networking, software development, and IT systems management.',
      },
    ],
  })

  // Add experience technologies
  const experiences = await prisma.experience.findMany({
    where: { userId: adminUser.id },
    select: { id: true, position: true }
  })

  for (const experience of experiences) {
    let technologies = []
    switch (experience.position) {
      case 'Frontend Developer & Graphic Designer':
        technologies = ['HTML', 'CSS', 'JavaScript', 'Photoshop', 'Illustrator', 'UI/UX Design']
        break
      case 'Technical Support Engineer':
        technologies = ['ERP Systems', 'CCTV', 'GPS', 'Network Setup', 'ITIL', 'Remote Support']
        break
      case 'Technical Support Associate':
        technologies = ['Network Setup', 'CCTV', 'User Management', 'Ticketing Systems', 'Technical Support']
        break
      case 'Student - Bachelor of Science in Information Technology':
        technologies = ['Information Technology', 'Computer Science', 'Networking', 'Software Development']
        break
    }

    for (const tech of technologies) {
      await prisma.experienceTech.create({
        data: {
          experienceId: experience.id,
          technology: tech,
        },
      })
    }
  }

  // Update social links
  console.log('🔗 Updating social links...')
  await prisma.socialLink.deleteMany({
    where: { userId: adminUser.id }
  })

  await prisma.socialLink.createMany({
    data: [
      {
        userId: adminUser.id,
        platform: 'GitHub',
        url: 'https://github.com/Moegreen249',
        icon: 'Github',
      },
      {
        userId: adminUser.id,
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/mohamedabdelrazig',
        icon: 'Linkedin',
      },
      {
        userId: adminUser.id,
        platform: 'Email',
        url: 'mailto:mohamed2abdelrazig@gmail.com',
        icon: 'Mail',
      },
    ],
  })

  // Update environment variable
  console.log('🔧 Setting DEFAULT_USER_ID...')
  const fs = require('fs')
  const path = require('path')
  const envPath = path.join(process.cwd(), '.env')

  let envContent = ''
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }

  const userIdRegex = /^DEFAULT_USER_ID=.*$/m
  const newUserIdLine = `DEFAULT_USER_ID="${adminUser.id}"`

  if (userIdRegex.test(envContent)) {
    envContent = envContent.replace(userIdRegex, newUserIdLine)
  } else {
    envContent += `\n${newUserIdLine}`
  }

  fs.writeFileSync(envPath, envContent.trim() + '\n')

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('🎉 Mohamed Abdelrazig\'s portfolio content ready!')
  console.log(`   Admin Email: mohamed2abdelrazig@gmail.com`)
  console.log(`   Admin Password: admin123`)
  console.log(`   DEFAULT_USER_ID: ${adminUser.id}`)
  console.log('')
  console.log('🚀 Start your server with: npm run dev')
  console.log('   Visit: http://localhost:3000')
  console.log('   Admin: http://localhost:3000/admin')

  process.exit(0)
}

seedDatabase()
  .catch((error) => {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
