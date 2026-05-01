import { useState } from 'react'
import { Newspaper, CheckCircle2, XCircle, ChevronRight } from 'lucide-react'

const MYTHS = [
  { myth: 'EVMs can be hacked via Bluetooth or Wi-Fi.', fact: 'EVMs are standalone, non-networked machines with no wireless communication capabilities.', category: 'Election Security' },
  { myth: 'Your vote doesn\'t count if your state always votes one way.', fact: 'Every vote matters! Local elections and state margins shape national policy and future constituency funding.', category: 'Voting Impact' },
  { myth: 'You can vote online if you are out of your home state.', fact: 'India does not have online voting. You must vote at your registered polling booth in person.', category: 'Voting Process' },
  { myth: 'Voter ID (EPIC) is the only acceptable ID at the polling booth.', fact: 'Aadhaar, PAN card, Passport, and Driving License are also accepted if you are on the voter list.', category: 'Voter ID' },
  { myth: 'You can get in trouble for not voting.', fact: 'Voting is a constitutional right, not a legal obligation in India. There are no penalties for not voting.', category: 'Voter Rights' },
  { myth: 'If you don\'t like any candidate, your vote is wasted.', fact: 'You can press NOTA (None of the Above) to register your rejection of all candidates.', category: 'Ballot Rules' },
]

export default function FactCheckCorner({ onComplete, onQuestionAnswered }) {
  const [revealed, setRevealed] = useState({})
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 })

  const handleGuess = (index, guess) => {
    if (revealed[index] !== undefined) return
    const correct = guess === 'myth'
    setRevealed(prev => ({ ...prev, [index]: correct }))
    setScore(prev => {
      const nextScore = { correct: prev.correct + (correct ? 1 : 0), wrong: prev.wrong + (correct ? 0 : 1), total: prev.total + 1 }
      if (nextScore.total === MYTHS.length && onComplete) onComplete()
      return nextScore
    })
    if (onQuestionAnswered) onQuestionAnswered()
  }

  const handleReset = () => { setRevealed({}); setScore({ correct: 0, wrong: 0, total: 0 }) }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Fact-Check Corner</h2>
              <p className="text-xs text-text-muted">Can you tell myth from fact?</p>
            </div>
          </div>
          {score.total > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-civic-400 font-bold">{score.correct} ✓</span>
              <span className="text-accent-red font-bold">{score.wrong} ✗</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {MYTHS.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${revealed[i] !== undefined ? 'bg-surface-tertiary/40 border-border-default' : 'bg-surface-primary/40 border-border-default hover:border-border-hover'}`}>
              <div className="flex items-start gap-3">
                <span className="text-[10px] bg-accent-amber/20 text-accent-amber font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5">{item.category}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary mb-3">"{item.myth}"</p>
                  {revealed[i] === undefined ? (
                    <div className="flex gap-3">
                      <button onClick={() => handleGuess(i, 'myth')} className="flex-1 py-2 rounded-lg bg-red-900/20 border border-red-700/30 text-sm font-medium text-accent-red hover:bg-red-900/30 transition-all cursor-pointer">
                        🚫 Myth
                      </button>
                      <button onClick={() => handleGuess(i, 'fact')} className="flex-1 py-2 rounded-lg bg-civic-900/20 border border-civic-700/30 text-sm font-medium text-civic-400 hover:bg-civic-900/30 transition-all cursor-pointer">
                        ✓ Fact
                      </button>
                    </div>
                  ) : (
                    <div className="animate-fade-in-up">
                      <div className={`flex items-center gap-2 mb-2 ${revealed[i] ? 'text-civic-400' : 'text-accent-red'}`}>
                        {revealed[i] ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span className="text-sm font-semibold">{revealed[i] ? 'Correct! This is a myth.' : 'Wrong — this is actually a myth!'}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 mt-0.5 text-civic-400 shrink-0" />
                        {item.fact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {score.total === MYTHS.length && (
          <div className="mt-6 text-center animate-fade-in-up">
            <p className="text-lg font-bold text-text-primary mb-1">
              Score: {score.correct}/{MYTHS.length}
            </p>
            <p className="text-sm text-text-secondary mb-4">
              {score.correct === MYTHS.length ? '🎉 Perfect! You\'re an election expert!' : score.correct >= MYTHS.length / 2 ? '👍 Good job! Keep learning!' : '📚 Time to brush up on election facts!'}
            </p>
            <button onClick={handleReset} className="px-6 py-2.5 bg-surface-tertiary/60 border border-border-default text-text-secondary hover:text-text-primary text-sm font-medium rounded-xl transition-all cursor-pointer">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
