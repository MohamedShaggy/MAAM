const fs = require('fs')
const path = require('path')

function updateEnvFile(userId) {
  const envPath = path.join(process.cwd(), '.env')

  // Read existing .env file
  let envContent = ''
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }

  // Check if DEFAULT_USER_ID already exists
  const userIdRegex = /^DEFAULT_USER_ID=.*$/m
  const newUserIdLine = `DEFAULT_USER_ID="${userId}"`

  if (userIdRegex.test(envContent)) {
    // Update existing line
    envContent = envContent.replace(userIdRegex, newUserIdLine)
  } else {
    // Add new line
    envContent += `\n${newUserIdLine}`
  }

  // Write back to file
  fs.writeFileSync(envPath, envContent.trim() + '\n')

  console.log('✅ .env file updated with DEFAULT_USER_ID')
  console.log(`   ${newUserIdLine}`)
}

// Get user ID from command line argument
const userId = process.argv[2]
if (!userId) {
  console.error('❌ Please provide a user ID as an argument')
  console.error('   Usage: node scripts/setup-env.js "your-user-id"')
  process.exit(1)
}

updateEnvFile(userId)
console.log('🎉 Environment setup complete!')
