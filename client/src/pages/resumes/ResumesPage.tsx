import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useResumes } from '../../hooks/useResumes'
import { Button } from '../../components/ui/Button'
import { formatDate, formatFileSize } from '../../lib/utils'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer">
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
            <Button loading={uploading}>Upload Resume</Button>
          </label>
          <Link to="/resumes/build">
            <Button variant="outline">Build from Scratch</Button>
          </Link>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : resumes.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">No resumes yet. Upload or create one to get started.</div>
        ) : (
          resumes.map((resume) => (
            <div key={resume._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{resume.title}</h3>
                  <p className="text-sm text-gray-500">Created {formatDate(resume.createdAt)}</p>
                </div>
                <div className="space-x-2">
                  <Link to={`/resumes/${resume._id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => deleteResume(resume._id)}>Delete</Button>
                </div>
              </div>

              {resume.originalFileName && (
                <p className="mt-2 text-sm text-gray-600">Source: {resume.originalFileName}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
