import { useState } from 'react'
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

const STATES_DATA = {
  'Andhra Pradesh': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Bihar': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Delhi': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Gujarat': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Karnataka': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Kerala': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Maharashtra': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Punjab': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Tamil Nadu': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'Uttar Pradesh': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
  'West Bengal': { minAge: 19, regDeadline: '3 weeks before', idRequired: true },
}

export default function EligibilityChecker({ onComplete, onQuestionAnswered, onResult }) {
  const [form, setForm] = useState({ name: '', age: '', state: '', citizen: '', registered: '', voterId: '' })
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})
  const [interactedFields, setInteractedFields] = useState(new Set())

  const trackField = (field) => {
    if (!interactedFields.has(field)) {
      setInteractedFields(prev => new Set([...prev, field]))
      if (onQuestionAnswered) onQuestionAnswered()
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.age || parseInt(form.age) < 1) e.age = 'Valid age is required'
    if (!form.state) e.state = 'Select a state'
    if (!form.citizen) e.citizen = 'Citizenship status is required'
    if (form.registered === 'yes' && !form.voterId.trim()) e.voterId = 'Voter ID is required if registered'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const age = parseInt(form.age)
    const stateInfo = STATES_DATA[form.state] || { minAge: 19, regDeadline: '3 weeks before', idRequired: true }
    const eligible = age >= stateInfo.minAge && form.citizen === 'yes'
    
    const finalResult = {
      eligible,
      age,
      state: form.state,
      stateInfo,
      name: form.name,
      registered: form.registered,
      voterId: form.voterId,
    }

    setResult(finalResult)
    if (onComplete) onComplete()
    if (onResult) onResult(finalResult)
  }

  const handleReset = () => { 
    setForm({ name: '', age: '', state: '', citizen: '', registered: '' }); 
    setResult(null); 
    setErrors({});
    setInteractedFields(new Set());
  }

  const inputClass = (field) =>
    `w-full bg-surface-primary/60 border ${errors[field] ? 'border-accent-red' : 'border-border-default'} rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200`

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civic-600 to-civic-500 flex items-center justify-center shadow-lg shadow-civic-500/25">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Voter Eligibility Checker</h2>
            <p className="text-xs text-text-muted">Check if you meet the requirements to vote</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <input type="text" placeholder="Enter your full name" value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  trackField('name');
                }} className={inputClass('name')} />
              {errors.name && <p className="text-xs text-accent-red mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Age</label>
                <input type="number" placeholder="Your age" min="1" max="150" value={form.age}
                  onChange={(e) => {
                    setForm({ ...form, age: e.target.value });
                    trackField('age');
                  }} className={inputClass('age')} />
                {errors.age && <p className="text-xs text-accent-red mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">State</label>
                <select value={form.state} onChange={(e) => {
                  setForm({ ...form, state: e.target.value });
                  trackField('state');
                }} className={inputClass('state')}>
                  <option value="">Select your state</option>
                  {Object.keys(STATES_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-accent-red mt-1">{errors.state}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Are you an Indian Citizen?</label>
              <div className="flex gap-4">
                {['yes', 'no'].map(v => (
                  <label key={v} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-medium ${form.citizen === v ? 'bg-navy-700/40 border-navy-500 text-text-primary' : 'bg-surface-primary/40 border-border-default text-text-secondary hover:bg-surface-hover'}`}>
                    <input type="radio" name="citizen" value={v} checked={form.citizen === v} onChange={(e) => {
                      setForm({ ...form, citizen: e.target.value });
                      trackField('citizen');
                    }} className="sr-only" />
                    {v === 'yes' ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
              {errors.citizen && <p className="text-xs text-accent-red mt-1">{errors.citizen}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Are you already registered to vote?</label>
              <div className="flex gap-4">
                {['yes', 'no', 'unsure'].map(v => (
                  <label key={v} className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 text-sm font-medium ${form.registered === v ? 'bg-navy-700/40 border-navy-500 text-text-primary' : 'bg-surface-primary/40 border-border-default text-text-secondary hover:bg-surface-hover'}`}>
                    <input type="radio" name="registered" value={v} checked={form.registered === v} onChange={(e) => {
                      setForm({ ...form, registered: e.target.value });
                      trackField('registered');
                    }} className="sr-only" />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {form.registered === 'yes' && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Voter ID Number</label>
                <input 
                  type="text" 
                  placeholder="Enter your Voter ID (e.g., XYZ1234567)" 
                  value={form.voterId}
                  onChange={(e) => {
                    setForm({ ...form, voterId: e.target.value });
                    trackField('voterId');
                  }} 
                  className={inputClass('voterId')} 
                />
                {errors.voterId && <p className="text-xs text-accent-red mt-1">{errors.voterId}</p>}
              </div>
            )}

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-navy-600 to-civic-600 hover:from-navy-500 hover:to-civic-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-navy-600/25 cursor-pointer">
              Check Eligibility
            </button>
          </form>
        ) : (
          <div className="animate-fade-in-up space-y-4">
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.eligible ? 'bg-civic-900/20 border-civic-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
              {result.eligible ? <CheckCircle2 className="w-6 h-6 text-civic-400" /> : <XCircle className="w-6 h-6 text-accent-red" />}
              <div>
                <h3 className={`text-base font-bold ${result.eligible ? 'text-civic-300' : 'text-accent-red'}`}>
                  {result.eligible ? `Congratulations, ${result.name}!` : `Sorry, ${result.name}`}
                </h3>
                <p className="text-sm text-text-secondary">
                  {result.eligible ? 'You appear to be eligible to vote!' : 'You may not be eligible to vote at this time.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Age Requirement', value: result.age >= 19 ? 'Met (19+)' : 'Not Met', ok: result.age >= 19 },
                { label: 'Citizenship', value: result.eligible ? 'Indian Citizen' : 'Not a citizen', ok: result.eligible },
                { label: 'ID Required', value: result.stateInfo.idRequired ? 'Yes' : 'No', ok: true },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-surface-tertiary/60 border border-border-default">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.ok ? 'text-civic-400' : 'text-accent-red'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {result.eligible && result.registered !== 'yes' && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-900/20 border border-navy-700/40">
                <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-accent-amber">Registration Reminder</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Registration deadline in {result.state}: <strong className="text-text-primary">{result.stateInfo.regDeadline}</strong>
                  </p>
                </div>
              </div>
            )}

            <button onClick={handleReset} className="w-full py-3 bg-surface-tertiary/60 border border-border-default text-text-secondary hover:text-text-primary text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer">
              Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
