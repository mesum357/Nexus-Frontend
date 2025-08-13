import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Building2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/config'

interface StudentApplication {
  _id: string;
  institute: {
    _id: string;
    name: string;
    logo?: string;
    city?: string;
    type?: string;
  };
  studentName: string;
  courseName: string;
  courseDuration?: string;
  status: 'submitted' | 'review' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE_URL}/api/institute/applications/my`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to fetch applications')
        }
        const data = await res.json()
        setApplications(data.applications || [])
      } catch (e: any) {
        setError(e?.message || 'Failed to load applications')
      } finally {
        setIsLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const getStatusBadge = (status: StudentApplication['status']) => {
    switch (status) {
      case 'accepted': return <Badge variant="default">Accepted</Badge>
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>
      case 'review': return <Badge variant="secondary">Under Review</Badge>
      default: return <Badge variant="outline">Submitted</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
            <p className="text-sm text-muted-foreground">All applications you have submitted to institutes</p>
          </div>

          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">Loading applications...</div>
          )}

          {error && !isLoading && (
            <div className="text-center py-12 text-red-600 text-sm">{error}</div>
          )}

          {!isLoading && !error && applications.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">You have not submitted any applications yet.</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && !error && applications.length > 0 && (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app._id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {app.courseName}
                      </CardTitle>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium text-foreground">{app.institute.name}</span>
                        {app.institute.city && <span>• {app.institute.city}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


