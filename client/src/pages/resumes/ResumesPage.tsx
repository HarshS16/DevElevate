import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useResumes } from '../../hooks/useResumes'
import { Button } from '../../components/ui/Button'
import { formatDate, formatFileSize } from '../../lib/utils'
import {
  FileText, Upload, Plus, Eye, Download,
  Edit3, Trash2, Calendar, AlertCircle
} from 'lucide-react'

export function ResumesPage() {
  const { resumes, loading, error, uploadResume, deleteResume } = useResumes()
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      await uploadResume(file)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              My Resumes
            </span>
          </h1>
          <p className="text-gray-300">Manage and enhance your professional resumes</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              loading={uploading}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
          </label>
          <Link to="/resumes/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Build from Scratch
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your resumes...</p>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-20"
          >
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Upload an existing resume or build one from scratch to get started.</p>
            <div className="flex items-center justify-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
              </label>
              <Link to="/resumes/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Build from Scratch
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          resumes.map((resume, index) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{resume.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Created {formatDate(resume.createdAt)}
                  </div>
                </div>
                <FileText className="w-8 h-8 text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

              {resume.originalFileName && (
                <p className="text-sm text-gray-400 mb-4">
                  Source: {resume.originalFileName}
                </p>
              )}

              <div className="flex items-center gap-2">
                <Link to={`/resumes/${resume._id}`} className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteResume(resume._id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
