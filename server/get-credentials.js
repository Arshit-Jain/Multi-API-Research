import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function getCredentials() {
  console.log('🔧 PostgreSQL Credentials Setup')
  console.log('')
  console.log('Please provide your PostgreSQL credentials from pgAdmin4:')
  console.log('(Right-click on PostgreSQL 15 → Properties → Connection tab)')
  console.log('')

  const host = await question('Host (usually localhost): ') || 'localhost'
  const port = await question('Port (usually 5432): ') || '5432'
  const user = await question('Username (usually postgres): ') || 'postgres'
  const password = await question('Password: ')
  const database = await question('Database name (multi-api-research): ') || 'multi-api-research'

  console.log('')
  console.log('📝 Creating .env file...')

  const envContent = `# Database Configuration
DB_HOST=${host}
DB_PORT=${port}
DB_NAME=${database}
DB_USER=${user}
DB_PASSWORD=${password}

# Session Secret
SESSION_SECRET=your-secret-key-change-in-production

# Server Configuration
PORT=3000`

  // Write .env file
  const fs = await import('fs')
  fs.writeFileSync('.env', envContent)

  console.log('✅ .env file created successfully!')
  console.log('')
  console.log('🧪 Testing connection...')

  // Test connection
  try {
    const { Pool } = await import('pg')
    const pool = new Pool({
      host,
      port: parseInt(port),
      database,
      user,
      password
    })

    const client = await pool.connect()
    console.log('✅ Connection successful!')
    client.release()
    await pool.end()

    console.log('')
    console.log('🎉 Setup complete! You can now run:')
    console.log('   npm run setup-db')
    console.log('   npm start')

  } catch (error) {
    console.log('❌ Connection failed:', error.message)
    console.log('')
    console.log('💡 Please check your credentials in pgAdmin4:')
    console.log('   1. Right-click on PostgreSQL 15')
    console.log('   2. Select Properties')
    console.log('   3. Go to Connection tab')
    console.log('   4. Verify Host, Port, Username, and Password')
  }

  rl.close()
}

getCredentials()
