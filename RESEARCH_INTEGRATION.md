# Research Integration with OpenAI

This document describes the new research functionality integrated into the chat application.

## Features

### 1. Research Topic Refinement
- When a user sends their first message in a chat, it's treated as a research topic
- The system automatically generates 1-3 clarifying questions to refine the research focus
- Questions help narrow down scope, context, and specific aspects of interest

### 2. Question-Answer Flow
- Users answer clarifying questions one by one
- Visual indicator shows current question progress
- System tracks answers and question completion status

### 3. Research Page Generation
- After all questions are answered, the system generates a comprehensive research page
- Includes refined research question, objectives, methodology, and recommendations
- Formatted with markdown for better readability

## Technical Implementation

### Backend Changes
- **OpenAI Service** (`/server/services/openai.js`): Handles all OpenAI API interactions
- **Enhanced Message Endpoint**: Supports different message types (research_topic, clarification_answer, generate_research)
- **Environment Variables**: Added `OPENAI_API_KEY` to environment configuration

### Frontend Changes
- **Research State Management**: Added research flow state to useChat hook
- **Visual Indicators**: Research status banner shows current progress
- **Enhanced Message Display**: Research pages render with markdown formatting
- **API Integration**: Updated API service to support message types

## Usage Flow

1. **Start Research**: User types a research topic/question
2. **Clarifying Questions**: System generates 1-3 specific questions
3. **Answer Questions**: User answers each question individually
4. **Generate Research**: System creates comprehensive research page
5. **View Results**: Research page displays with formatted content

## Environment Setup

Add to your `.env` file:
```
OPENAI_API_KEY=your-openai-api-key-here
```

## API Endpoints

### Enhanced Message Endpoint
```
POST /api/chats/:chatId/messages
```

**Request Body:**
```json
{
  "message": "string",
  "messageType": "research_topic|clarification_answer|generate_research|regular",
  "questionIndex": "number (for clarification_answer)",
  "originalQuestions": "array (for clarification_answer)",
  "originalTopic": "string (for generate_research)",
  "questions": "array (for generate_research)",
  "answers": "array (for generate_research)"
}
```

**Response:**
```json
{
  "success": true,
  "response": "string",
  "messageType": "clarifying_questions|research_page|regular",
  "questions": "array (for clarifying_questions)"
}
```

## Research State

The frontend maintains research state with the following properties:
- `isResearchMode`: Whether research flow is active
- `originalTopic`: The initial research topic
- `clarifyingQuestions`: Array of generated questions
- `currentQuestionIndex`: Current question being answered
- `answers`: Array of user answers
- `isWaitingForAnswer`: Whether waiting for user response

## Styling

- Research status banner with gradient background
- Enhanced message bubbles for research content
- Markdown rendering for research pages
- Responsive design for mobile devices

## Error Handling

- OpenAI API failures fall back to simple responses
- Authentication errors are properly handled
- Network errors show user-friendly messages
- Research state resets on errors

## Future Enhancements

- Save research pages to database
- Export research pages as PDF
- Research templates and categories
- Collaborative research features
- Research history and favorites
