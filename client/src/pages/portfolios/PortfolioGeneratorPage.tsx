import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePortfolios } from '../../hooks/usePortfolios'
import { Button } from '../../components/ui/Button'
import { 
  ArrowLeft, Github, Sparkles, CheckCircle, 
  Globe, Code, Star, GitFork, Calendar,
  AlertCircle, Loader, Plus
} from 'lucide-react'

interface GitHubRepo {
  id: string
  name: string
  description: string
  url: string
  language: string
  stars: number
  forks: number
  updatedAt: string
}

export function PortfolioGeneratorPage() {
  const navigate = useNavigate()
  const { generatePortfolio, getGitHubRepos } = usePortfolios()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [portfolioConfig, setPortfolioConfig] = useState({
    title: '',
    description: '',
    theme: 'modern',
    includeContact: true,
    includeAbout: true,
    includeSkills: true
  })
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (step === 2) {
      fetchRepos()
    }
  }, [step])

  const fetchRepos = async () => {
    try {
      setLoading(true)
      const repoData = await getGitHubRepos()
      setRepos(repoData)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GitHub repositories')
    } finally {
      setLoading(false)
    }
  }

  const handleRepoToggle = (repoId: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    )
  }

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      const portfolioData = {
        ...portfolioConfig,
        selectedRepos: selectedRepos
      }
      await generatePortfolio(portfolioData)
      navigate('/portfolios')
    } catch (err: any) {
      setError(err.message || 'Failed to generate portfolio')
    } finally {
      setGenerating(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio Configuration</h2>
        <p className="text-gray-400">Customize your portfolio settings</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio Title</label>
          <input
            type="text"
            value={portfolioConfig.title}
            onChange={(e) => setPortfolioConfig(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe - Full Stack Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={portfolioConfig.description}
            onChange={(e) => setPortfolioConfig(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your professional background..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['modern', 'minimal', 'creative'].map((theme) => (
              <button
                key={theme}
                onClick={() => setPortfolioConfig(prev => ({ ...prev, theme }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  portfolioConfig.theme === theme
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-white font-medium capitalize">{theme}</div>
                <div className="text-gray-400 text-sm mt-1">
                  {theme === 'modern' && 'Clean and professional'}
                  {theme === 'minimal' && 'Simple and elegant'}
                  {theme === 'creative' && 'Bold and artistic'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Sections to Include</label>
          <div className="space-y-3">
            {[
              { key: 'includeAbout', label: 'About Section', desc: 'Personal introduction and background' },
              { key: 'includeSkills', label: 'Skills Section', desc: 'Technical skills and expertise' },
              { key: 'includeContact', label: 'Contact Section', desc: 'Contact information and social links' }
            ].map((section) => (
              <label key={section.key} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={portfolioConfig[section.key as keyof typeof portfolioConfig] as boolean}
                  onChange={(e) => setPortfolioConfig(prev => ({ ...prev, [section.key]: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="text-white font-medium">{section.label}</div>
                  <div className="text-gray-400 text-sm">{section.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select Repositories</h2>
        <p className="text-gray-400">Choose which GitHub repositories to showcase</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Fetching your GitHub repositories...</p>
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-12">
          <Github className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Repositories Found</h3>
          <p className="text-gray-500 mb-6">Connect your GitHub account to import repositories</p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Github className="w-4 h-4 mr-2" />
            Connect GitHub
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {selectedRepos.length} of {repos.length} repositories selected
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedRepos(repos.map(r => r.id))}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Select All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
            {repos.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRepos.includes(repo.id)
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => handleRepoToggle(repo.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{repo.name}</h3>
                      {selectedRepos.includes(repo.id) && (
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{repo.description || 'No description available'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        {repo.language || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Review & Generate</h2>
        <p className="text-gray-400">Review your portfolio configuration before generating</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Portfolio Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Title:</span>
              <span className="text-white">{portfolioConfig.title || 'Untitled Portfolio'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Theme:</span>
              <span className="text-white capitalize">{portfolioConfig.theme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Selected Repositories:</span>
              <span className="text-white">{selectedRepos.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Repositories</h3>
          <div className="space-y-2">
            {selectedRepos.length === 0 ? (
              <p className="text-gray-400">No repositories selected</p>
            ) : (
              selectedRepos.map((repoId) => {
                const repo = repos.find(r => r.id === repoId)
                return repo ? (
                  <div key={repoId} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <Github className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{repo.name}</span>
                  </div>
                ) : null
              })
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/portfolios">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Portfolio Generator
                </span>
              </h1>
              <p className="text-gray-300">Create a beautiful portfolio from your GitHub repositories</p>
            </div>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Previous
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(Math.min(3, step + 1))}
                disabled={step === 2 && selectedRepos.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                loading={generating}
                onClick={handleGenerate}
                disabled={selectedRepos.length === 0}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Portfolio
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
