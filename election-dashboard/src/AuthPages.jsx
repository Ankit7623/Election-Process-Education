import { useState } from 'react'
import { Landmark, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Phone } from 'lucide-react'

export default function AuthPages({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, simulate successful auth
    const userName = isLogin ? email.split('@')[0] : name;
    onLogin({ email, name: userName || 'User', phone: phone || '+91 98765 43210' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-navy-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-civic-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in-up z-10">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-500 to-civic-500 flex items-center justify-center shadow-xl shadow-navy-500/25 mb-4">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
            Election Ed Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Your personal guide to the voting process
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border-default shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy-500 via-civic-400 to-navy-500 opacity-50" />
          
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-civic-400" />
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-primary/60 border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-primary/60 border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1 flex justify-between items-center">
                Password
                {isLogin && (
                  <button type="button" onClick={(e) => e.preventDefault()} className="text-civic-400 hover:text-civic-300 normal-case text-[10px] tracking-normal cursor-pointer">
                    Forgot password?
                  </button>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-primary/60 border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-primary/60 border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-navy-600 to-civic-600 hover:from-navy-500 hover:to-civic-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-navy-600/25 cursor-pointer group"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-civic-400 font-semibold hover:text-civic-300 transition-colors cursor-pointer"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-text-muted mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
