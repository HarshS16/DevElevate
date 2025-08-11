import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Resume } from '../types'

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResumes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.resumes.getAll()
      setResumes(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch resumes')
    } finally {
      setLoading(false)
    }
  }

  const uploadResume = async (file: File) => {
    const formData = new FormData()
    formData.append('resume', file)
    
    try {
      const response = await api.resumes.upload(formData)
      await fetchResumes() // Refresh the list
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upload resume')
    }
  }

  const buildResume = async (data: any) => {
    try {
      const response = await api.resumes.build(data)
      await fetchResumes() // Refresh the list
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to build resume')
    }
  }

  const enhanceResume = async (id: string, data: any) => {
    try {
      const response = await api.resumes.enhance(id, data)
      await fetchResumes() // Refresh the list
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to enhance resume')
    }
  }

  const deleteResume = async (id: string) => {
    try {
      await api.resumes.delete(id)
      await fetchResumes() // Refresh the list
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete resume')
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  return {
    resumes,
    loading,
    error,
    uploadResume,
    buildResume,
    enhanceResume,
    deleteResume,
    refetch: fetchResumes,
  }
}

export function useResume(id: string) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.resumes.getById(id)
        setResume(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch resume')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchResume()
    }
  }, [id])

  return { resume, loading, error }
}
