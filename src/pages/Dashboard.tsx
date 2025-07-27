import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-blue-dark mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-text-blue-gray mb-8">
            You've successfully logged in to MY Online !
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-blue-dark mb-2">Store</h3>
                <p className="text-text-blue-gray text-sm mb-4">Browse local vendors</p>
                <Button variant="outline" size="sm">
                  <Link to="/store">Visit Store</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-blue-dark mb-2">Education</h3>
                <p className="text-text-blue-gray text-sm mb-4">Online courses & classes</p>
                <Button variant="outline" size="sm">
                  <Link to="/education">Learn Now</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-blue-dark mb-2">Feed</h3>
                <p className="text-text-blue-gray text-sm mb-4">City posts & events</p>
                <Button variant="outline" size="sm">
                  <Link to="/feed">View Feed</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-blue-dark mb-2">Marketplace</h3>
                <p className="text-text-blue-gray text-sm mb-4">Buy & sell items</p>
                <Button variant="outline" size="sm">
                  <Link to="/marketplace">Browse Items</Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-8">
              <Link to="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
