// ═══════════════════════════════════════════════════════════════
//  Election AI Agent — Node.js Express Server
//  Integrates Google Generative AI (Gemini) with strict
//  non-partisan guardrails and official source referencing.
// ═══════════════════════════════════════════════════════════════

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Configuration ───────────────────────────────────────────
const PORT = process.env.PORT || 3001
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.error('⚠️  GEMINI_API_KEY is not set. Add it to server/.env')
  console.error('   Get your key at: https://aistudio.google.com/apikey')
  process.exit(1)
}

// ─── Trusted Sources ─────────────────────────────────────────
// The AI must reference these official sources in every response
const TRUSTED_SOURCES = [
  {
    name: 'Election Commission of India',
    url: 'https://eci.gov.in',
    description: 'Official portal of the Election Commission of India',
  },
  {
    name: 'National Voters\' Service Portal',
    url: 'https://voters.eci.gov.in',
    description: 'Voter registration, ID cards, polling station lookup',
  },
  {
    name: 'USA.gov — Voting & Elections',
    url: 'https://www.usa.gov/voting',
    description: 'Official U.S. government voting information',
  },
  {
    name: 'Vote.org',
    url: 'https://www.vote.org',
    description: 'Non-partisan voter registration and information',
  },
  {
    name: 'Election Assistance Commission (EAC)',
    url: 'https://www.eac.gov',
    description: 'U.S. federal election administration support',
  },
  {
    name: 'International IDEA',
    url: 'https://www.idea.int',
    description: 'International electoral standards and data',
  },
  {
    name: 'National Conference of State Legislatures (NCSL)',
    url: 'https://www.ncsl.org/elections-and-campaigns',
    description: 'State-by-state election laws and voter ID requirements',
  },
]

// ─── System Instruction ──────────────────────────────────────
// Forces the AI to remain strictly non-partisan and factual
const SYSTEM_INSTRUCTION = `
You are the 'Voter Guide 2026' AI Agent. Your mission is to increase voter literacy.
Tone: Patient, clear, and strictly neutral.
Core Knowledge: Voter registration, polling booth procedures, ID requirements (Aadhaar, Voter ID, etc.), and VVPAT explanation.

## CORE RULES:

1. **ABSOLUTE NON-PARTISANSHIP**: You must NEVER express support for, or opposition to, any political party, candidate, ideology, or policy position. You must refuse any request to do so.
   - Constraint 1: If a user asks 'Who should I vote for?' or 'Is Candidate X good?', you must respond: 'As an educational AI, I cannot provide political opinions. You can compare their manifestos using our Fact-Check tool.'

2. **FORMATTING**: 
   - Constraint 2: Always format steps in bullet points for readability.

3. **VERIFICATION**:
   - Constraint 3: If the query is about a specific date or location, remind the user to verify with their local electoral officer.

4. **OFFICIAL DATA ONLY**: Base all answers on verified, official election data from government sources and recognized non-partisan organizations. Never speculate or present unverified claims.

5. **SOURCE REFERENCING**: You MUST include at least one relevant source from this trusted list in EVERY response:
${TRUSTED_SOURCES.map(s => `   - **${s.name}**: ${s.url} — ${s.description}`).join('\n')}

6. **UNCERTAINTY PROTOCOL**: If you are unsure about any information, you MUST explicitly say:
   "I'm not fully certain about this. For the most accurate and up-to-date information, please check the official government portal at https://www.usa.gov/voting or https://eci.gov.in"
`

// ─── Initialize Gemini ───────────────────────────────────────
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: SYSTEM_INSTRUCTION,
})

// Store chat sessions per user (in-memory; use Redis/DB in production)
const chatSessions = new Map()

// ─── Express App Setup ───────────────────────────────────────
const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}))
app.use(express.json({ limit: '1mb' }))

// ─── Serve built frontend in production ──────────────────────
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
}

// ─── Security Request Logger Middleware ──────────────────────
// Logs all incoming requests with timestamp, IP, and body info
const logDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

const logStream = fs.createWriteStream(
  path.join(logDir, `requests-${new Date().toISOString().slice(0, 10)}.log`),
  { flags: 'a' }
)

// Use morgan for HTTP request logging
app.use(morgan('combined', { stream: logStream }))
app.use(morgan('dev')) // Console logging for development

// Custom security logger for chat requests
function securityLogger(req, res, next) {
  if (req.path === '/api/chat') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      queryLength: req.body?.query?.length || 0,
      sessionId: req.body?.sessionId || 'no-session',
    }
    const line = `[CHAT] ${JSON.stringify(logEntry)}\n`
    logStream.write(line)
    console.log(`🔒 Chat request from ${logEntry.ip} | Session: ${logEntry.sessionId} | Query length: ${logEntry.queryLength}`)
  }
  next()
}
app.use(securityLogger)

// ─── Rate limiting (simple in-memory) ────────────────────────
const rateLimits = new Map()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 15 // max 15 requests per minute

function rateLimiter(req, res, next) {
  const ip = req.ip || 'unknown'
  const now = Date.now()
  const record = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW }

  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + RATE_LIMIT_WINDOW
  }

  record.count++
  rateLimits.set(ip, record)

  if (record.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment before asking another question.',
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    })
  }
  next()
}

// ═══════════════════════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Election AI Agent',
    timestamp: new Date().toISOString(),
    trustedSources: TRUSTED_SOURCES.length,
  })
})

// Get trusted sources list
app.get('/api/sources', (req, res) => {
  res.json({ sources: TRUSTED_SOURCES })
})

// ─── POST /api/chat — Main AI Chat Endpoint ─────────────────
app.post('/api/chat', rateLimiter, async (req, res) => {
  const { query, sessionId = 'default' } = req.body

  // Validate input
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      error: 'Please provide a valid question about elections or voting.',
    })
  }

  if (query.length > 2000) {
    return res.status(400).json({
      error: 'Your question is too long. Please keep it under 2000 characters.',
    })
  }

  try {
    // Get or create chat session
    let chat = chatSessions.get(sessionId)
    if (!chat) {
      chat = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
      })
      chatSessions.set(sessionId, chat)
    }

    // Send message to Gemini
    const result = await chat.sendMessage(query.trim())
    const response = result.response.text()

    // Log successful response
    console.log(`✅ Response generated for session ${sessionId} (${response.length} chars)`)

    res.json({
      response,
      sessionId,
      sources: TRUSTED_SOURCES.filter(s =>
        response.toLowerCase().includes(s.name.toLowerCase()) ||
        response.includes(s.url)
      ),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message)

    // Handle specific error types
    if (error.message?.includes('SAFETY')) {
      return res.status(400).json({
        response: "I can't process that request as it may involve sensitive content. I'm here to help with factual election education. Please rephrase your question about voting or elections.",
        error: 'safety_filter',
      })
    }

    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(503).json({
        response: "I'm currently experiencing high demand. Please try again in a few moments.",
        error: 'quota_exceeded',
      })
    }

    // Default fallback — direct user to official sources
    res.status(500).json({
      response: "I'm unable to process your question right now. For the most accurate and up-to-date election information, please visit the official government portal:\n\n• **USA**: https://www.usa.gov/voting\n• **India**: https://eci.gov.in\n• **Voter Services**: https://voters.eci.gov.in\n\nThese portals have comprehensive, verified information about voter registration, polling locations, and election procedures.",
      error: 'ai_unavailable',
      sources: TRUSTED_SOURCES.slice(0, 3),
    })
  }
})

// ─── Reset chat session ──────────────────────────────────────
app.post('/api/chat/reset', (req, res) => {
  const { sessionId = 'default' } = req.body
  chatSessions.delete(sessionId)
  res.json({ message: 'Chat session reset successfully', sessionId })
})

// ─── Catch-all: serve frontend for client-side routing ───────
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ error: 'Endpoint not found' })
  }
})

// ─── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled error:', err)
  res.status(500).json({
    response: "Something went wrong. For reliable election information, please check the official government portal at https://www.usa.gov/voting or https://eci.gov.in",
    error: 'internal_error',
  })
})

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║        🗳️  Election AI Agent Server               ║
║        Running on http://localhost:${PORT}           ║
║        Gemini Model: gemini-2.0-flash             ║
║        Trusted Sources: ${TRUSTED_SOURCES.length} configured            ║
╚═══════════════════════════════════════════════════╝
  `)
})

export default app
