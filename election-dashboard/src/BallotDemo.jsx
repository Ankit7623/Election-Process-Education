import { useState } from 'react'
import { CheckCircle2, RotateCcw } from 'lucide-react'

const CANDIDATES = [
  { id: 1, name: 'Anil Kumar', party: 'National Development Party', color: 'from-navy-600 to-navy-500' },
  { id: 2, name: 'Priya Sharma', party: 'United Citizens Party', color: 'from-civic-600 to-civic-500' },
  { id: 3, name: 'Rajiv Singh', party: 'Liberty Alliance', color: 'from-amber-600 to-amber-500' },
  { id: 4, name: 'NOTA', party: 'None of the Above', color: 'from-gray-600 to-gray-500' },
]

export default function BallotDemo({ onComplete }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [votes, setVotes] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handlePropVote = (id, vote) => setVotes(prev => ({ ...prev, [id]: vote }))

  const handleSubmit = () => {
    if (selectedCandidate) {
      setSubmitted(true)
      if (onComplete) onComplete()
    }
  }

  const handleReset = () => { setSelectedCandidate(null); setSubmitted(false) }

  const allFilled = !!selectedCandidate

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-civic-900/30 border border-civic-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-civic-400" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Ballot Submitted!</h2>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            This is a demo — in a real election, your ballot would be securely recorded and your vote would remain anonymous.
          </p>
          <div className="glass-card rounded-xl p-4 max-w-sm mx-auto mb-6 text-left space-y-3">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Lok Sabha Election (MP)</p>
              <p className="text-sm font-semibold text-civic-300">{CANDIDATES.find(c => c.id === selectedCandidate)?.name}</p>
            </div>
          </div>
          <button onClick={handleReset} className="px-6 py-2.5 bg-surface-tertiary/60 border border-border-default text-text-secondary hover:text-text-primary text-sm font-medium rounded-xl transition-all cursor-pointer inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-text-primary mb-1">Digital Ballot Demo</h2>
        <p className="text-xs text-text-muted mb-6">Experience how a ballot works — select your choices below</p>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-navy-700/50 border border-navy-500/30 text-xs font-bold text-navy-300 flex items-center justify-center">1</span>
            Lok Sabha Election (MP)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CANDIDATES.map(c => (
              <button key={c.id} onClick={() => setSelectedCandidate(c.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${selectedCandidate === c.id ? 'bg-navy-700/30 border-navy-500 shadow-lg shadow-navy-500/10' : 'bg-surface-primary/40 border-border-default hover:bg-surface-hover'}`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                  <p className="text-xs text-text-muted">{c.party}</p>
                </div>
                {selectedCandidate === c.id && <CheckCircle2 className="w-5 h-5 text-civic-400 ml-auto" />}
              </button>
            ))}
          </div>
        </div>



        <button onClick={handleSubmit} disabled={!allFilled}
          className="w-full py-3 bg-gradient-to-r from-navy-600 to-civic-600 hover:from-navy-500 hover:to-civic-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-navy-600/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
          Submit Ballot
        </button>
        {!allFilled && <p className="text-xs text-text-muted text-center mt-2">Complete all selections to submit</p>}
      </div>
    </div>
  )
}
