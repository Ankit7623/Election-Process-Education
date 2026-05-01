import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Award, 
  Palette, 
  Globe, 
  Shield, 
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage({ 
  user, 
  preferences, 
  onTogglePreference,
  language = 'English (India)',
  onLanguageChange
}) {
  const [activeTab, setActiveTab] = useState('account')

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-navy-600/20 text-text-primary border border-navy-500/30 shadow-lg shadow-navy-900/20'
                  : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
              }`}
            >
              <tab.icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-navy-400' : ''}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto hidden lg:block" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card rounded-2xl p-6 sm:p-8 min-h-[400px] hover-lift smooth-transition">
          {activeTab === 'account' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Account Settings</h3>
                <p className="text-xs text-text-muted">Update your personal information and contact details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      className="w-full bg-surface-primary/40 border border-border-default rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-navy-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="email" 
                      defaultValue={user?.email}
                      className="w-full bg-surface-primary/40 border border-border-default rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-navy-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="tel" 
                      defaultValue={user?.phone}
                      className="w-full bg-surface-primary/40 border border-border-default rounded-xl pl-11 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-navy-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-default">
                <button className="px-6 py-2.5 bg-gradient-to-r from-navy-600 to-civic-600 hover:from-navy-500 hover:to-civic-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-navy-600/20 transition-all flex items-center gap-2 cursor-pointer">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Preferences</h3>
                <p className="text-xs text-text-muted">Manage your notifications and dashboard experience</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-primary/30 border border-border-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-navy-600/10 flex items-center justify-center text-navy-400">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">Election Alerts</p>
                      <p className="text-xs text-text-muted">Get notified about upcoming voting dates</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.electionAlerts}
                      onChange={() => onTogglePreference('electionAlerts')}
                    />
                    <div className="w-11 h-6 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-civic-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-primary/30 border border-border-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-civic-600/10 flex items-center justify-center text-civic-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">Learning Badges</p>
                      <p className="text-xs text-text-muted">Display achievements on your public profile</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.learningBadges}
                      onChange={() => onTogglePreference('learningBadges')}
                    />
                    <div className="w-11 h-6 bg-surface-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-civic-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Privacy & Security</h3>
                <p className="text-xs text-text-muted">Manage your password and security settings</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-primary/30 border border-border-default">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-accent-amber" />
                    <p className="text-sm font-bold text-text-primary">Change Password</p>
                  </div>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current Password" className="w-full bg-surface-primary/40 border border-border-default rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-navy-500/50" />
                    <input type="password" placeholder="New Password" className="w-full bg-surface-primary/40 border border-border-default rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-navy-500/50" />
                    <button className="px-4 py-2 bg-surface-tertiary hover:bg-surface-hover text-text-primary text-xs font-semibold rounded-lg border border-border-default transition-all cursor-pointer">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <p className="text-sm font-bold text-red-400">Danger Zone</p>
                  </div>
                  <p className="text-xs text-text-muted mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold rounded-lg transition-all cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
