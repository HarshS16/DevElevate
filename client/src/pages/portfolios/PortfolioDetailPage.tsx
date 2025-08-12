import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePortfolios } from '../../hooks/usePortfolios'
import { Button } from '../../components/ui/Button'
import { 
  ArrowLeft, ExternalLink, Globe, Github, 
  Calendar, AlertCircle, Settings, Share2,
  Eye, Code, Sparkles, CheckCircle
} from 'lucide-react'

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getPortfolio, publishPortfolio } = usePortfolios()
  
  const [portfolio, setPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const data = await getPortfolio(id)
        setPortfolio(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load portfolio')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPortfolio()
  }, [id, getPortfolio])

  const handlePublish = async () => {
    if (!id) return
    
    try {
      setPublishing(true)
      await publishPortfolio(id)
      // Refresh portfolio data
      const updatedPortfolio = await getPortfolio(id)
      setPortfolio(updatedPortfolio)
    } catch (err: any) {
      setError(err.message || 'Failed to publish portfolio')
    } finally {
      setPublishing(false)
    }
  }

  const handleShare = () => {
    if (portfolio?.hostedUrl) {
      navigator.clipboard.writeText(portfolio.hostedUrl)
      alert('Portfolio URL copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen text-white p-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Portfolio</h2>
          <p className="text-gray-400 mb-6">{error || 'Portfolio not found'}</p>
          <Link to="/portfolios">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolios
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
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
                  {portfolio.title}
                </span>
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Created {new Date(portfolio.createdAt).toLocaleDateString()}
                </div>
                {portfolio.hostedUrl && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {portfolio.hostedUrl && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <a 
                  href={portfolio.hostedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </Button>
                </a>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Globe className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Deployment Status</h3>
            <p className="text-gray-400 text-sm mb-4">
              {portfolio.hostedUrl ? 'Your portfolio is live and accessible' : 'Portfolio is ready to be published'}
            </p>
            {!portfolio.hostedUrl ? (
              <Button 
                size="sm" 
                loading={publishing}
                onClick={handlePublish}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Publish Portfolio
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Published</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Github className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">GitHub Integration</h3>
            <p className="text-gray-400 text-sm mb-4">
              {portfolio.githubRepos?.length || 0} repositories included
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Code className="w-4 h-4 mr-2" />
              Manage Repos
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Eye className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm mb-4">Track portfolio performance</p>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </motion.div>
        </div>

        {/* Portfolio Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Portfolio Preview
          </h3>
          
          {portfolio.hostedUrl ? (
            <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
              <div className="bg-white/10 px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white/10 rounded px-3 py-1 text-sm text-gray-300">
                  {portfolio.hostedUrl}
                </div>
                <a 
                  href={portfolio.hostedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                <iframe
                  src={portfolio.hostedUrl}
                  className="w-full h-full"
                  title="Portfolio Preview"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-12 text-center border border-white/10">
              <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Portfolio Not Published</h4>
              <p className="text-gray-500 mb-6">Publish your portfolio to see the live preview</p>
              <Button 
                loading={publishing}
                onClick={handlePublish}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
            </div>
          )}
        </motion.div>

        {/* Repository List */}
        {portfolio.githubRepos && portfolio.githubRepos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Github className="w-5 h-5" />
              Included Repositories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.githubRepos.map((repo: any, index: number) => (
                <div 
                  key={index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{repo.name}</h4>
                    <a 
                      href={repo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{repo.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{repo.language}</span>
                    <span>⭐ {repo.stars}</span>
                    <span>🍴 {repo.forks}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
