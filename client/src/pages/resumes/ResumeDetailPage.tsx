import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useResumes } from '../../hooks/useResumes'
import { Button } from '../../components/ui/Button'
import { 
  ArrowLeft, Download, Edit3, Sparkles, 
  FileText, Calendar, AlertCircle, Zap,
  Target, BarChart3, CheckCircle
} from 'lucide-react'

export function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getResume, enhanceResume, generateCoverLetter, getATSScore } = useResumes()
  
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enhancing, setEnhancing] = useState(false)
  const [generatingCover, setGeneratingCover] = useState(false)
  const [checkingATS, setCheckingATS] = useState(false)
  const [atsScore, setATSScore] = useState<any>(null)

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const data = await getResume(id)
        setResume(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load resume')
      } finally {
        setLoading(false)
      }
    }
    
    fetchResume()
  }, [id, getResume])

  const handleEnhance = async () => {
    if (!id) return
    
    try {
      setEnhancing(true)
      await enhanceResume(id)
      // Refresh resume data
      const updatedResume = await getResume(id)
      setResume(updatedResume)
    } catch (err: any) {
      setError(err.message || 'Failed to enhance resume')
    } finally {
      setEnhancing(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!id) return
    
    try {
      setGeneratingCover(true)
      const jobDescription = prompt('Please paste the job description:')
      if (jobDescription) {
        await generateCoverLetter(id, jobDescription)
        alert('Cover letter generated successfully!')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate cover letter')
    } finally {
      setGeneratingCover(false)
    }
  }

  const handleCheckATS = async () => {
    if (!id) return
    
    try {
      setCheckingATS(true)
      const jobDescription = prompt('Please paste the job description to check ATS compatibility:')
      if (jobDescription) {
        const score = await getATSScore(id, jobDescription)
        setATSScore(score)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check ATS score')
    } finally {
      setCheckingATS(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen text-white p-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Resume</h2>
          <p className="text-gray-400 mb-6">{error || 'Resume not found'}</p>
          <Link to="/resumes">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resumes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
            <Link to="/resumes">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {resume.title}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-gray-400 mt-1">
                <Calendar className="w-4 h-4" />
                Created {new Date(resume.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Sparkles className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Enhancement</h3>
            <p className="text-gray-400 text-sm mb-4">Improve your resume with AI-powered suggestions</p>
            <Button 
              size="sm" 
              loading={enhancing}
              onClick={handleEnhance}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Enhance Resume
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <FileText className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Cover Letter</h3>
            <p className="text-gray-400 text-sm mb-4">Generate a tailored cover letter for any job</p>
            <Button 
              size="sm" 
              variant="outline"
              loading={generatingCover}
              onClick={handleGenerateCoverLetter}
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Generate Cover Letter
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <Target className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">ATS Score</h3>
            <p className="text-gray-400 text-sm mb-4">Check compatibility with job descriptions</p>
            <Button 
              size="sm" 
              variant="outline"
              loading={checkingATS}
              onClick={handleCheckATS}
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Check ATS Score
            </Button>
          </motion.div>
        </div>

        {/* ATS Score Results */}
        {atsScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">ATS Compatibility Score</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">{atsScore.score}%</div>
                <div className="text-sm text-gray-400">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{atsScore.matches}</div>
                <div className="text-sm text-gray-400">Keywords Matched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">{atsScore.suggestions}</div>
                <div className="text-sm text-gray-400">Suggestions</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume Preview
          </h3>
          <div className="bg-white/5 rounded-lg p-6 min-h-96 border border-white/10">
            <p className="text-gray-400 text-center">
              Resume preview would be displayed here
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
