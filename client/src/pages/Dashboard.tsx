import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useResumes } from '../hooks/useResumes'
import { usePortfolios } from '../hooks/usePortfolios'

export function Dashboard() {
  const { resumes, loading: resumesLoading } = useResumes()
  const { portfolios, loading: portfoliosLoading } = usePortfolios()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Resumes</h2>
            <Link to="/resumes">
              <Button size="sm">Manage</Button>
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            {resumesLoading ? 'Loading...' : `${resumes.length} resumes`}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Portfolios</h2>
            <Link to="/portfolios">
              <Button size="sm">Manage</Button>
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            {portfoliosLoading ? 'Loading...' : `${portfolios.length} portfolios`}
          </div>
        </div>
      </div>
    </div>
  )
}
