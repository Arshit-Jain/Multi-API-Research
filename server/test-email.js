import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config()

// Test SendGrid configuration
async function testSendGrid() {
  console.log('=== Testing SendGrid Configuration ===')
  
  // Check environment variables
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set')
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL || '❌ Not set')
  
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set in your .env file')
    console.log('Please add: SENDGRID_API_KEY=your-sendgrid-api-key')
    return
  }
  
  if (!process.env.FROM_EMAIL) {
    console.error('❌ FROM_EMAIL is not set in your .env file')
    console.log('Please add: FROM_EMAIL=your-verified-email@domain.com')
    return
  }
  
  // Configure SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  try {
    // Test with a simple email
    const testEmail = {
      to: process.env.FROM_EMAIL, // Send to yourself for testing
      from: process.env.FROM_EMAIL,
      subject: 'SendGrid Test - OpenAI Research System',
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<p>This is a test email to verify SendGrid configuration.</p>'
    }
    
    console.log('📧 Sending test email...')
    const result = await sgMail.send(testEmail)
    
    console.log('✅ Test email sent successfully!')
    console.log('Message ID:', result[0].headers['x-message-id'])
    console.log('Check your email inbox for the test message.')
    
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message)
    
    if (error.response) {
      console.error('Response body:', error.response.body)
      
      // Common error messages
      if (error.response.body?.errors) {
        error.response.body.errors.forEach(err => {
          console.error(`- ${err.message}`)
        })
      }
    }
    
    // Provide helpful suggestions
    if (error.message.includes('Forbidden')) {
      console.log('\n💡 Suggestions:')
      console.log('1. Verify your SendGrid API key is correct')
      console.log('2. Make sure your sender email is verified in SendGrid')
      console.log('3. Check if your SendGrid account is active')
    }
  }
}

testSendGrid()
