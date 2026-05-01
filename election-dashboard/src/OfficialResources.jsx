import { ExternalLink } from 'lucide-react'

const RESOURCES = [
  { name: 'Election Commission of India (ECI)', url: 'https://eci.gov.in', desc: 'Official portal for election information, statistics, and legal frameworks in India.', color: 'from-navy-600 to-navy-500' },
  { name: "Voter's Service Portal (NVSP)", url: 'https://voters.eci.gov.in', desc: 'Register to vote, check your name in the voter list, and update details online.', color: 'from-civic-600 to-civic-500' },
  { name: 'Know Your Candidate (KYC)', url: 'https://kyc.eci.gov.in', desc: 'Find out the criminal antecedents and assets of candidates contesting elections.', color: 'from-purple-600 to-purple-500' },
  { name: 'Association for Democratic Reforms (ADR)', url: 'https://adrindia.org', desc: 'Research candidate backgrounds, financial details, and election transparency reports.', color: 'from-amber-600 to-amber-500' },
  { name: "Systematic Voters' Education (SVEEP)", url: 'https://ecisveep.nic.in', desc: 'Voter education, spreading voter awareness, and promoting voter literacy in India.', color: 'from-blue-600 to-blue-500' },
]

export default function OfficialResources({ onResourceClick }) {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Official Resources</h2>
            <p className="text-xs text-text-muted">Trusted sources for election information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESOURCES.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              onClick={() => { if (onResourceClick) onResourceClick(); }}
              className="group p-4 rounded-xl bg-surface-primary/40 border border-border-default hover:border-border-hover hover:bg-surface-hover transition-all duration-200 block">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md`}>
                  {r.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-civic-300 transition-colors truncate">{r.name}</h3>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-civic-400 transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
