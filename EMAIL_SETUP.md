# Email Functionality Setup Guide

This guide will help you set up the email functionality to send research reports as PDFs to users.

## Features

- **PDF Generation**: Research reports are automatically converted to professional PDFs
- **Email Delivery**: Reports are sent via SendGrid with HTML and text versions
- **Executive Summary**: Each email includes a concise summary of the research
- **Professional Formatting**: PDFs include proper headings, sections, and styling

## Setup Instructions

### 1. SendGrid Account Setup

1. **Create a SendGrid Account**
   - Go to [SendGrid](https://sendgrid.com/)
   - Sign up for a free account (100 emails/day free tier)

2. **Get API Key**
   - Navigate to Settings → API Keys
   - Create a new API key with "Full Access" permissions
   - Copy the API key

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Verify a single sender email address (recommended for testing)
   - Or set up domain authentication for production

### 2. Environment Configuration

1. **Update your `.env` file** in the server directory:
   ```env
   # SendGrid Email Configuration
   SENDGRID_API_KEY=your-sendgrid-api-key-here
   FROM_EMAIL=your-verified-email@yourdomain.com
   ```

2. **Replace the placeholder values**:
   - `your-sendgrid-api-key-here`: Your actual SendGrid API key
   - `your-verified-email@yourdomain.com`: Your verified sender email

### 3. Dependencies

The following packages have been added to `package.json`:
- `@sendgrid/mail`: For sending emails via SendGrid
- `pdfkit`: For generating PDF documents

Install them by running:
```bash
cd server
npm install
```

## How It Works

### 1. Research Completion
When a research report is completed, an email button appears in the UI.

### 2. PDF Generation
- The system extracts the research content
- Creates a professional PDF with proper formatting
- Includes title, topic, content sections, and footer

### 3. Email Composition
- **Subject**: "OpenAI Deep Research Results: [Topic]"
- **HTML Body**: Professional email template with summary
- **Text Body**: Plain text version for email clients
- **Attachment**: Complete research report as PDF

### 4. Email Delivery
- Sends via SendGrid API
- Includes both HTML and text versions
- PDF attached as base64-encoded file

## API Endpoint

**POST** `/api/chats/:chatId/send-email`

**Headers**: 
- `Content-Type: application/json`
- Session cookie for authentication

**Response**:
```json
{
  "success": true,
  "message": "Research report sent successfully",
  "messageId": "sendgrid-message-id",
  "summary": "Executive summary of the research"
}
```

## File Structure

```
server/
├── services/
│   ├── emailService.js     # Email and PDF generation logic
│   └── openai.js          # Existing OpenAI service
├── temp/                  # Temporary PDF files (auto-cleaned)
└── index.js              # Email endpoint added
```

## Testing

### 1. Test SendGrid Configuration
Before testing the full functionality, verify your SendGrid setup:

```bash
cd server
npm run test-email
```

This will:
- Check if environment variables are set
- Send a test email to verify SendGrid is working
- Provide helpful error messages if something is wrong

### 2. Test Full Email Functionality
1. **Complete a research session** in your app
2. **Click the email button** that appears when research is done
3. **Check your email** for the report with PDF attachment
4. **Verify PDF formatting** and content accuracy

## Troubleshooting

### Common Issues

1. **"Failed to send research report" / "Forbidden" error**
   - Run `npm run test-email` to diagnose the issue
   - Check SendGrid API key is correct and has proper permissions
   - Verify sender email is authenticated in SendGrid
   - Ensure your SendGrid account is not suspended
   - Check server logs for detailed error messages

2. **PDF not generating**
   - Ensure `temp` directory is writable
   - Check server has sufficient disk space
   - Verify PDFKit is properly installed

3. **Email not received**
   - Check spam/junk folder
   - Verify recipient email address
   - Check SendGrid activity logs

### Debug Mode

Enable detailed logging by checking the server console for:
- `=== EMAIL ENDPOINT ===`
- `=== Email Service: Starting email generation ===`
- `=== Email Service: PDF generated ===`
- `=== Email Service: Email sent successfully ===`

## Production Considerations

1. **Rate Limiting**: SendGrid free tier has limits
2. **File Cleanup**: Temporary PDFs are automatically deleted
3. **Error Handling**: Comprehensive error handling included
4. **Security**: Only authenticated users can send emails
5. **Scalability**: Consider using cloud storage for PDFs in production

## Customization

### Email Template
Edit the HTML template in `emailService.js` to match your brand.

### PDF Styling
Modify the PDF generation in `generatePDF()` function for custom formatting.

### Summary Generation
Adjust the `generateSummary()` function to change how summaries are created.

## Support

For issues with:
- **SendGrid**: Check [SendGrid Documentation](https://docs.sendgrid.com/)
- **PDF Generation**: Check [PDFKit Documentation](https://pdfkit.org/)
- **Application**: Check server logs and browser console
