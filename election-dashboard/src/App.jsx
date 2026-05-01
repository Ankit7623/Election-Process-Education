import { useState, useRef, useEffect } from 'react'
import {
  Search,
  Send,
  SquareCheck,
  ShieldCheck,
  Newspaper,
  ExternalLink,
  CheckCircle2,
  Bot,
  User,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  BookOpen,
  Landmark,
  CircleDot,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Star,
  TrendingUp,
  Settings,
} from 'lucide-react'
import EligibilityChecker from './EligibilityChecker'
import BallotDemo from './BallotDemo'
import FactCheckCorner from './FactCheckCorner'
import OfficialResources from './OfficialResources'
import ProfilePage from './ProfilePage'
import AuthPages from './AuthPages'
import SettingsPage from './SettingsPage'

/* ─── Quick-reply suggestions for the AI ─── */
const QUICK_REPLIES = [
  'How do I register to vote?',
  'What ID do I need at the polling booth?',
  'What is an EVM and VVPAT?',
  'Can I vote online in India?',
]

/* ─── Sidebar navigation items ─── */
const SIDEBAR_LINKS = [
  { label: 'Eligibility Checker', icon: ShieldCheck, color: 'text-civic-400' },
  { label: 'Digital Ballot Demo', icon: SquareCheck, color: 'text-navy-400' },
  { label: 'Fact-Check Corner', icon: Newspaper, color: 'text-accent-amber' },
  { label: 'Official Resources', icon: ExternalLink, color: 'text-accent-blue' },
  { label: 'Profile', icon: User, color: 'text-purple-400' },
  { label: 'Settings', icon: Settings, color: 'text-gray-400' },
]

/* ─── Featured topics for hero section ─── */
const FEATURED_TOPICS = [
  { icon: BookOpen, label: 'Voter Registration' },
  { icon: Landmark, label: 'How Elections Work' },
  { icon: CircleDot, label: 'Ballot Types' },
  { icon: Star, label: 'Your Rights' },
]

/* ─── Simulated AI responses with CivicPulse Persona ─── */
/* ─── Expanded CivicPulse Knowledge Base ─── */
const AI_RESPONSES = {
  'register':
    "That's a great question—many first-time voters wonder the same thing! I've got you covered. 🗳️\n\nHere's how to register in India:\n\n1. **Online** — Visit the Voter's Service Portal (voters.eci.gov.in) and fill out Form 6.\n2. **By App** — Use the Voter Helpline App to register from your smartphone.\n3. **In Person** — Submit Form 6 to your Booth Level Officer (BLO) or Electoral Registration Officer (ERO).\n\nYou must be an Indian citizen and at least 19 years old to register. Does that make sense, or would you like me to explain a specific part again?",
  
  'id':
    "Let's break this down together! 🆔 You need to bring a valid ID to the polling booth to ensure your voice is counted.\n\nAccepted forms include:\n• **Voter ID (EPIC)**: Your Electoral Photo Identity Card\n• **Aadhaar Card**\n• **PAN Card**\n• **Driving License**\n• **Indian Passport**\n\nCheck the Election Commission of India website for the complete list of accepted alternative IDs. Would you like to know how to apply for a Voter ID if you don't have one yet?",
  
  'evm':
    "I'd be happy to explain! 🗳️ These are the backbone of our modern democracy.\n\n1. **EVM** — A standalone electronic device used to record votes securely. It's not connected to any network, so it's safe from hacking!\n2. **VVPAT** — A printer attached to the EVM that prints a paper slip containing the serial number, name, and symbol of the candidate you voted for.\n3. **Verification** — The slip is visible for 7 seconds behind a glass window, allowing you to verify your vote before it falls into a sealed box.\n\nDoes that help clear things up, or shall we dive deeper into the security features?",
  
  'online':
    "I hear you—it would be convenient, wouldn't it? But currently, you cannot vote online in India. 📍\n\n• **In-Person Voting**: Most citizens must vote in person at their designated polling booth to ensure security and secrecy.\n• **Postal Ballots**: Only specific groups (like armed forces personnel, senior citizens over 85, and Persons with Disabilities) are eligible to vote by postal ballot or from home.\n\nThe best way to influence the system is to be a master of the process! Let's make sure your voice is counted at the booth. Shall we look up your nearest polling station?",

  'eligibility':
    "Let's check your eligibility! 🛡️ In India, you are eligible to vote if you are:\n\n1. **An Indian Citizen**.\n2. **19 years of age** or older on the qualifying date.\n3. **Ordinarily resident** in the constituency where you want to register.\n4. **Not disqualified** due to unsoundness of mind or certain criminal convictions.\n\nYou can use our **Eligibility Checker** tool right here in the dashboard for a quick personalized check! Would you like me to guide you to that section?",

  'rights':
    "Knowing your rights is key to democracy! ⚖️ Here are your core rights as a voter:\n\n• **Right to Vote**: Every eligible citizen has the right to cast their vote.\n• **Right to Secrecy**: Your vote is private. No one can force you to disclose who you voted for.\n• **Right to Information**: You have the right to know about the candidates' backgrounds (check the 'Know Your Candidate' portal).\n• **NOTA**: You have the right to reject all candidates using the 'None of the Above' option.\n\nWhich of these would you like to explore further?",

  'process':
    "The voting process is simpler than it looks! 🗳️ Here's a quick walkthrough:\n\n1. **Verification**: Officials check your name in the voter list and verify your ID.\n2. **Inking**: An official will put indelible ink on your finger.\n3. **The Booth**: You enter the private booth and press the blue button next to your chosen candidate on the EVM.\n4. **Confirmation**: Wait for the beep and check the VVPAT window to see your vote slip for 7 seconds.\n\nI can also walk you through our **Digital Ballot Demo** to practice. Want to try it?",
    
  'status':
    "Checking your application status is easy! 📱 If you've already registered, you can track your Form 6 status on the **Voter's Service Portal (voters.eci.gov.in)** using your Reference ID. \n\nHave you already submitted a registration form, or are you just getting started?",

  'complaint':
    "If you notice any irregularities, you have the right to report them! 🚩 You can file a complaint through the **National Grievance Services Portal** or use the **cVIGIL app** to report violations of the Model Code of Conduct in real-time.\n\nIs there a specific concern you'd like to report, or are you just looking for the right contact info?",

  'age':
    "In our current system, the qualifying age is **19 years old**. 🎂 This means you must have reached 19 on or before the qualifying date to be on the voter list. \n\nAre you checking for yourself, or helping someone else understand the requirements?",

  'hello':
    "Hello there! I'm CivicPulse, your friendly Election Education Mentor. 👋 I'm here to help you navigate the voting process with ease and confidence.\n\nWhat's on your mind today? We can talk about registration, IDs, EVMs, or your rights as a voter!",

  'thanks':
    "You're very welcome! It's my pleasure to help. 😊 Remember, being an informed voter is the best way to participate in our democracy. Is there anything else you'd like to check before you go?",
}

function getAIResponse(message) {
  const lower = message.toLowerCase()
  
  // Anti-baiting logic
  const politicalKeywords = ['party', 'candidate', 'better', 'worst', 'winner', 'election result', 'politics', 'modi', 'rahul', 'bjp', 'congress']
  if (politicalKeywords.some(word => lower.includes(word)) && !lower.includes('process') && !lower.includes('how')) {
    return "My gears are only greased for the *process* of democracy, not the *politics* of it. ⚙️ Let's get you back on track to the ballot box! What can I help you with regarding registration or voting procedures?"
  }

  // Priority mapping (more specific keywords first)
  const priorityKeys = ['complaint', 'eligibility', 'register', 'status', 'rights', 'online', 'process', 'evm', 'hello', 'thanks', 'age', 'id']
  
  for (const key of priorityKeys) {
    if (lower.includes(key)) return AI_RESPONSES[key]
  }
  
  return `Thanks for asking about "${message}"! I'm CivicPulse, your friendly guide to exercising your right to vote. 🗳️\n\nI can help you with:\n• **Voter registration** processes\n• **ID requirements** for polling stations\n• **Voting methods** (EVMs, postal ballots)\n• **Election laws** and your rights\n\nDoes that help you get started, or would you like to explore a specific topic?`
}

/* ═══════════════════════════════════════════
   LIVE STATUS BADGE
   ═══════════════════════════════════════════ */
function LiveStatusBadge() {
  return (
    <div
      id="live-status-badge"
      className="flex items-center gap-2 rounded-full bg-civic-900/40 border border-civic-700/40 px-3 py-1.5"
      role="status"
      aria-label="AI is connected"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-civic-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-civic-400" />
      </span>
      <span className="text-xs font-semibold text-civic-300 tracking-wide uppercase">
        Live Status
      </span>
      <span className="text-[10px] text-civic-400 font-medium">• AI Connected</span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════ */
function Sidebar({ isOpen, onClose, activeLink, setActiveLink, stats }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          h-full lg:h-screen
          w-72 lg:w-64 xl:w-72
          bg-surface-secondary border-r border-border-default
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border-default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-civic-500 flex items-center justify-center shadow-lg shadow-navy-500/25">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary tracking-tight">
                Election Ed
              </h1>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
                Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-tertiary text-text-secondary transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Sidebar navigation">
          {SIDEBAR_LINKS.map((link) => (
            <button
              key={link.label}
              id={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setActiveLink(link.label)
                onClose()
              }}
              className={`
                sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group cursor-pointer
                ${
                  activeLink === link.label
                    ? 'bg-surface-tertiary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }
              `}
              aria-current={activeLink === link.label ? 'page' : undefined}
            >
              <link.icon
                className={`w-5 h-5 ${link.color} transition-transform duration-200 group-hover:scale-110`}
              />
              <span>{link.label}</span>
              <ChevronRight
                className={`w-4 h-4 ml-auto transition-all duration-200 ${
                  activeLink === link.label
                    ? 'opacity-100 translate-x-0 text-civic-400'
                    : 'opacity-0 -translate-x-2 text-text-muted'
                } group-hover:opacity-100 group-hover:translate-x-0`}
              />
            </button>
          ))}
        </nav>

        {/* Stats card */}
        <div className="mx-3 mb-3 p-4 rounded-xl glass-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-civic-400" />
            <span className="text-xs font-semibold text-text-primary">Learning Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-lg font-bold text-navy-300">{stats.modulesCompleted.size}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Topics</p>
            </div>
            <div>
              <p className="text-lg font-bold text-civic-400">{stats.totalQuestionsAnswered}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Questions</p>
            </div>
          </div>
        </div>

        {/* Live status */}
        <div className="px-4 py-4 border-t border-border-default">
          <LiveStatusBadge />
        </div>
      </aside>
    </>
  )
}

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8"
      aria-labelledby="hero-title"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-navy-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-civic-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-navy-900/50 border border-navy-700/40 rounded-full px-3 py-1 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-navy-300" />
          <span className="text-xs font-medium text-navy-200">AI-Powered Education</span>
        </div>

        <h2
          id="hero-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2"
        >
          <span className="gradient-text">Ask anything about the</span>
          <br />
          <span className="text-text-primary">Voting Process</span>
        </h2>
        <p className="text-text-secondary text-sm sm:text-base max-w-lg mb-6 leading-relaxed">
          Get instant, accurate answers about voter registration, election procedures,
          ballot types, and your civic rights.
        </p>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CHAT MESSAGE BUBBLE
   ═══════════════════════════════════════════ */
function ChatMessage({ message, index }) {
  const isUser = message.role === 'user'
  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-navy-600/30 border border-navy-500/30'
            : 'bg-civic-600/20 border border-civic-500/30'
        }`}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="w-4 h-4 text-navy-300" />
        ) : (
          <Bot className="w-4 h-4 text-civic-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-navy-700/40 border border-navy-600/30 text-text-primary rounded-tr-md'
            : 'bg-surface-tertiary border border-border-default text-text-primary rounded-tl-md'
        }`}
      >
        {message.content.split('\n').map((line, i) => (
          <p key={i} className={`${i > 0 ? 'mt-1.5' : ''}`}>
            {line
              .split(/(\*\*[^*]+\*\*)/)
              .map((part, j) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={j} className="font-semibold text-civic-300">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
          </p>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   TYPING INDICATOR
   ═══════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-lg bg-civic-600/20 border border-civic-500/30 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-civic-400" />
      </div>
      <div className="bg-surface-tertiary border border-border-default rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-text-muted" />
        <span className="typing-dot w-2 h-2 rounded-full bg-text-muted" />
        <span className="typing-dot w-2 h-2 rounded-full bg-text-muted" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CHAT INTERFACE
   ═══════════════════════════════════════════ */
function ChatInterface({ messages, onSendMessage, isTyping }) {
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    onSendMessage(input.trim())
    setInput('')
  }

  return (
    <section
      id="chat-interface"
      className="flex flex-col glass-card rounded-2xl overflow-hidden h-[480px] lg:h-[540px]"
      aria-label="Chat with Election Education AI"
    >
      {/* Chat header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default bg-surface-secondary/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-civic-600 to-civic-500 flex items-center justify-center shadow-md shadow-civic-500/20">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">CivicPulse Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-civic-400" />
              <span className="text-[10px] text-civic-400 font-medium">Online • Your Civic Guide</span>
            </div>
          </div>
        </div>
        <LiveStatusBadge />
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-600/30 to-civic-600/30 border border-border-default flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-navy-300" />
            </div>
            <h4 className="text-base font-bold text-text-primary mb-1.5">
              Start a Conversation
            </h4>
            <p className="text-xs text-text-muted max-w-xs leading-relaxed">
              Ask about voter registration, ballot types, election procedures, or any civic question.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} index={i} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick replies */}
      {messages.length === 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => onSendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-surface-tertiary/60 border border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border-default bg-surface-secondary/30"
      >
        <input
          id="chat-input"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-surface-primary/60 border border-border-default rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200"
          aria-label="Type your question"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2.5 rounded-xl bg-gradient-to-r from-navy-600 to-civic-600 hover:from-navy-500 hover:to-civic-500 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-navy-600/20 cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  )
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('Eligibility Checker')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  
  const [stats, setStats] = useState({
    modulesCompleted: new Set(),
    totalQuestionsAnswered: 0,
    totalInteractions: 0
  })

  /* ─── Activity Tracking System ─── */
  const [activities, setActivities] = useState([
    {
      id: 'initial',
      title: 'Joined the platform',
      description: 'Your civic journey began! Welcome to Election Education.',
      timestamp: 'Just now',
      type: 'account'
    }
  ])

  /* ─── Voter Status System ─── */
  const [voterStatus, setVoterStatus] = useState({
    registration: 'Not Checked',
    voterId: 'N/A',
    eligible: false,
    checked: false
  })

  /* ─── Preferences System ─── */
  const [preferences, setPreferences] = useState({
    electionAlerts: true,
    learningBadges: true
  })

  const [language, setLanguage] = useState('English (India)')

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    addActivity('Language Updated', `Preferred language set to ${newLang}.`, 'account')
  }

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    addActivity(
      'Updated Preferences', 
      `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} has been ${!preferences[key] ? 'enabled' : 'disabled'}.`,
      'account'
    )
  }

  const handleEligibilityResult = (result) => {
    setVoterStatus({
      registration: result.eligible ? (result.registered === 'yes' ? 'Active' : 'Pending') : 'Ineligible',
      voterId: result.eligible ? (result.registered === 'yes' ? result.voterId : 'Applied...') : 'N/A',
      eligible: result.eligible,
      checked: true
    })
  }

  const addActivity = (title, description, type) => {
    const newActivity = {
      id: Date.now().toString(),
      title,
      description,
      timestamp: 'Just now',
      type
    }
    setActivities(prev => [newActivity, ...prev].slice(0, 10)) // Keep last 10
  }

  const trackQuestion = () => {
    setStats(prev => ({ ...prev, totalQuestionsAnswered: prev.totalQuestionsAnswered + 1 }))
    addActivity('Asked a Question', 'Queried CivicPulse about election procedures.', 'chat')
  }

  const trackModuleCompletion = (moduleName) => {
    setStats(prev => {
      const nextModules = new Set(prev.modulesCompleted)
      nextModules.add(moduleName)
      return { ...prev, modulesCompleted: nextModules }
    })
    addActivity(`Completed ${moduleName}`, `Successfully finished the ${moduleName} module.`, 'module')
  }

  const trackInteraction = () => {
    setStats(prev => ({ ...prev, totalInteractions: prev.totalInteractions + 1 }))
    addActivity('Viewed Resource', 'Accessed official election resources.', 'resource')
  }

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: text }),
      })
      const data = await res.json()
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response || data.error }])
      }
    } catch (error) {
      console.error("Error communicating with AI server:", error)
      // Fallback to local response if server is unreachable
      const response = getAIResponse(text)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSearch = (query) => {
    if (!query.trim()) return
    handleSendMessage(query.trim())
    setSearchQuery('')
  }

  if (!isAuthenticated) {
    return <AuthPages onLogin={(userData) => { setUser(userData); setIsAuthenticated(true); setActiveLink('Eligibility Checker'); }} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-primary selection:bg-navy-500/30 selection:text-navy-200">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        stats={stats}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden smooth-transition">
        {/* Top bar */}
        <header
          id="top-bar"
          className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border-default bg-surface-secondary/60 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-tertiary text-text-secondary transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
              <Landmark className="w-4 h-4 text-navy-400" />
              <span>Election Education</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-text-secondary font-medium">{activeLink}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiveStatusBadge />
            <button
              onClick={() => setActiveLink('Profile')}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-500 to-civic-500 flex items-center justify-center text-xs font-bold text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
              aria-label="User Profile"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 layout-container w-full">
          {/* Hero */}
          <HeroSection />

          {activeLink === 'Profile' ? (
            <ProfilePage 
              user={user} 
              onLogout={() => { setIsAuthenticated(false); setUser(null); }} 
              activities={activities}
              voterStatus={voterStatus}
              preferences={preferences}
              onTogglePreference={togglePreference}
              onNavigate={setActiveLink}
            />
          ) : activeLink === 'Settings' ? (
            <SettingsPage 
              user={user}
              preferences={preferences}
              onTogglePreference={togglePreference}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                {activeLink === 'Eligibility Checker' && (
                  <EligibilityChecker 
                    onComplete={() => trackModuleCompletion('Eligibility')} 
                    onQuestionAnswered={trackQuestion}
                    onResult={handleEligibilityResult}
                  />
                )}
                {activeLink === 'Digital Ballot Demo' && (
                  <BallotDemo 
                    onComplete={() => trackModuleCompletion('Ballot')} 
                  />
                )}
                {activeLink === 'Fact-Check Corner' && (
                  <FactCheckCorner 
                    onComplete={() => trackModuleCompletion('FactCheck')} 
                    onQuestionAnswered={trackQuestion}
                  />
                )}
                {activeLink === 'Official Resources' && (
                  <OfficialResources 
                    onResourceClick={trackInteraction}
                  />
                )}


              </div>

              {/* Chat column */}
              <div className="lg:col-span-2">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
