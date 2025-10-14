import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...')
  console.log('')
  
  // Display connection parameters
  console.log('📋 Connection Parameters:')
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`)
  console.log(`  Port: ${process.env.DB_PORT || 5432}`)
  console.log(`  Database: ${process.env.DB_NAME || 'multi-api-research'}`)
  console.log(`  User: ${process.env.DB_USER || 'postgres'}`)
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***' : 'not set'}`)
  console.log('')

  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'multi-api-research',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  })

  try {
    // Test basic connection
    console.log('🔌 Testing basic connection...')
    const client = await pool.connect()
    console.log('✅ Connection successful!')
    
    // Test database exists
    console.log('🗄️ Testing database access...')
    const result = await client.query('SELECT current_database(), current_user')
    console.log(`✅ Connected to database: ${result.rows[0].current_database}`)
    console.log(`✅ Connected as user: ${result.rows[0].current_user}`)
    
    // Test table creation permissions
    console.log('🔧 Testing table creation permissions...')
    await client.query('CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY)')
    console.log('✅ Table creation permissions OK')
    
    // Clean up test table
    await client.query('DROP TABLE IF EXISTS test_table')
    console.log('✅ Test table cleaned up')
    
    client.release()
    console.log('')
    console.log('🎉 All tests passed! Database is ready.')
    
  } catch (error) {
    console.error('❌ Connection failed:')
    console.error(`   Error: ${error.message}`)
    console.error('')
    
    if (error.code === '28P01') {
      console.log('💡 Password authentication failed. Try these solutions:')
      console.log('   1. Check your PostgreSQL password')
      console.log('   2. Try connecting with psql: psql -U postgres -h localhost')
      console.log('   3. Reset PostgreSQL password if needed')
    } else if (error.code === '3D000') {
      console.log('💡 Database does not exist. Create it with:')
      console.log('   createdb "multi-api research"')
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Connection refused. Check if PostgreSQL is running:')
      console.log('   - macOS: brew services start postgresql')
      console.log('   - Linux: sudo systemctl start postgresql')
      console.log('   - Windows: Start PostgreSQL service')
    }
    
    console.log('')
    console.log('🔧 Troubleshooting steps:')
    console.log('   1. Create .env file with correct credentials')
    console.log('   2. Ensure PostgreSQL is running')
    console.log('   3. Create the database: createdb "multi-api research"')
    console.log('   4. Check user permissions')
    
  } finally {
    await pool.end()
  }
}

testConnection()
