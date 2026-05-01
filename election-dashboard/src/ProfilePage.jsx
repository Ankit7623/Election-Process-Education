
import {
  User,
  Settings,
  Bell,
  Shield,
  MapPin,
  Calendar,
  Award,
  LogOut,
  Mail,
  Phone,
  CheckCircle2,
  Camera,
  MessageSquare,
  Globe
} from 'lucide-react'

export default function ProfilePage({ 
  user, 
  onLogout, 
  activities = [], 
  voterStatus,
  preferences = { electionAlerts: true, learningBadges: true },
  onTogglePreference,
  onNavigate
}) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'chat': return <MessageSquare className="w-4 h-4" />
      case 'module': return <CheckCircle2 className="w-4 h-4" />
      case 'resource': return <Shield className="w-4 h-4" />
      case 'account': return <User className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Profile Card */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl relative group smooth-transition">
        {/* Banner with animated gradient */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-navy-600/40 via-civic-500/30 to-navy-600/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-surface-secondary/40" />
        </div>
        
        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 sm:-mt-12 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-navy-500 to-civic-500 p-1 shadow-2xl shadow-navy-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-surface-secondary flex items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                  {user?.name || 'Voter Profile'}
                </h2>
                <div className="w-5 h-5 rounded-full bg-civic-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-civic-400" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Pune, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Verified Citizen</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pb-2 w-full sm:w-auto">
              <button 
                onClick={() => onNavigate && onNavigate('Settings')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-surface-tertiary hover:bg-surface-hover border border-border-default rounded-xl text-sm font-semibold text-text-primary transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/5 hover:border-navy-500/30"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="glass-card rounded-2xl p-5 hover-lift">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-navy-400" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-text-primary truncate">{user?.email || 'test@example.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-muted">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-text-primary">{user?.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Voter Status */}
            <div className="glass-card rounded-2xl p-5 hover-lift">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-civic-400" />
                Voter Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">Registration</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    voterStatus?.registration === 'Active' ? 'bg-civic-500/20 text-civic-400' : 
                    voterStatus?.registration === 'Pending' ? 'bg-accent-amber/20 text-accent-amber' : 
                    'bg-surface-tertiary text-text-muted'
                  }`}>
                    {voterStatus?.registration || 'Not Checked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">Voter ID</p>
                  <p className="text-xs font-mono font-bold text-text-primary tracking-wider">
                    {voterStatus?.voterId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="glass-card rounded-2xl p-5 hover-lift">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent-blue" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-muted">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Election Alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.electionAlerts}
                      onChange={() => onTogglePreference('electionAlerts')}
                    />
                    <div className="w-9 h-5 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-civic-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-muted">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Learning Badges</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.learningBadges}
                      onChange={() => onTogglePreference('learningBadges')}
                    />
                    <div className="w-9 h-5 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-civic-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-5 sm:p-6 hover-lift">
          <h3 className="text-base font-bold text-text-primary mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-navy-400" />
            Recent Activity
          </h3>
          <div className="space-y-6">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-8 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Timeline connector */}
                  {index !== activities.length - 1 && (
                    <div className="absolute left-3.5 top-8 bottom-[-24px] w-0.5 bg-border-default" />
                  )}
                  {/* Icon point */}
                  <div className={`absolute left-0 top-0 w-7 h-7 rounded-lg flex items-center justify-center z-10 ${
                    activity.type === 'chat' ? 'bg-civic-500/20 text-civic-400' :
                    activity.type === 'module' ? 'bg-navy-500/20 text-navy-400' :
                    activity.type === 'resource' ? 'bg-accent-blue/20 text-accent-blue' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-text-primary">{activity.title}</h4>
                      <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{activity.timestamp}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{activity.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-text-muted italic">No activity yet. Explore the dashboard to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sign Out (Visible on mobile mostly) */}
      <div className="flex lg:hidden justify-center pt-4">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-6 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
