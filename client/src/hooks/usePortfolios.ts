import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Portfolio } from '../types'

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.portfolios.getAll()
      setPortfolios(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch portfolios')
    } finally {
      setLoading(false)
    }
  }

  const generatePortfolio = async (data: any) => {
    try {
      const response = await api.portfolios.generate(data)
      await fetchPortfolios() // Refresh the list
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to generate portfolio')
    }
  }

  const publishPortfolio = async (id: string) => {
    try {
      const response = await api.portfolios.publish(id)
      await fetchPortfolios() // Refresh the list
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to publish portfolio')
    }
  }

  const deletePortfolio = async (id: string) => {
    try {
      await api.portfolios.delete(id)
      await fetchPortfolios() // Refresh the list
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete portfolio')
    }
  }

  const getPortfolio = async (id: string) => {
    try {
      const response = await api.portfolios.getById(id)
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to get portfolio')
    }
  }

  const getGitHubRepos = async () => {
    try {
      const response = await api.github.getRepos()
      return response.data
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fetch GitHub repositories')
    }
  }

  useEffect(() => {
    fetchPortfolios()
  }, [])

  return {
    portfolios,
    loading,
    error,
    generatePortfolio,
    publishPortfolio,
    deletePortfolio,
    getPortfolio,
    getGitHubRepos,
    refetch: fetchPortfolios,
  }
}

export function usePortfolio(id: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.portfolios.getById(id)
        setPortfolio(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch portfolio')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPortfolio()
    }
  }, [id])

  return { portfolio, loading, error }
}
