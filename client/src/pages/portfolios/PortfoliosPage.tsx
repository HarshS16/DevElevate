import { Link } from 'react-router-dom'
import { usePortfolios } from '../../hooks/usePortfolios'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/utils'

export function PortfoliosPage() {
  const { portfolios, loading, error, deletePortfolio } = usePortfolios()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Portfolios</h1>
        <Link to="/portfolios/generate">
          <Button>Generate Portfolio</Button>
        </Link>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : portfolios.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">No portfolios yet. Generate one to get started.</div>
        ) : (
          portfolios.map((portfolio) => (
            <div key={portfolio._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{portfolio.title}</h3>
                  <p className="text-sm text-gray-500">Created {formatDate(portfolio.createdAt)}</p>
                </div>
                <div className="space-x-2">
                  <Link to={`/portfolios/${portfolio._id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                  <Button size="sm" variant="danger" onClick={() => deletePortfolio(portfolio._id)}>Delete</Button>
                </div>
              </div>

              {portfolio.hostedUrl && (
                <a href={portfolio.hostedUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700">
                  View Live Site →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
