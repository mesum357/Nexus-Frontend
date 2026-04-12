import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WEB_APP_URL = 'https://edunia-iphone-app.onrender.com'

export default function IphoneAppInstructions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-20">
        <p className="text-sm font-medium text-primary mb-2">iPhone &amp; iPad</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Use E-Dunia as an app on your iPhone
        </h1>
        <p className="text-slate-600 text-lg mb-10">
          Install the web app to your Home Screen so it opens like a native app with a full-screen
          experience.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Step 1 — Open the app in Safari</h2>
            <p className="text-slate-600 mb-4">
              On your iPhone, open the link below in <strong>Safari</strong> (Add to Home Screen
              works best from Safari, not Chrome or other browsers).
            </p>
            <Button asChild variant="outline" className="gap-2">
              <a href={WEB_APP_URL} target="_blank" rel="noopener noreferrer">
                Open E-Dunia web app
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <p className="text-xs text-slate-500 mt-2 break-all">{WEB_APP_URL}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Step 2 — Add to Home Screen</h2>
            <ol className="list-decimal list-inside text-slate-600 space-y-2">
              <li>
                Tap the <strong>Share</strong> button (square with an arrow pointing up) at the
                bottom of Safari.
              </li>
              <li>
                Scroll down and tap <strong>Add to Home Screen</strong>.
              </li>
              <li>
                Choose a name (for example &quot;E-Dunia&quot;) and tap <strong>Add</strong>.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Step 3 — Launch from your Home Screen</h2>
            <p className="text-slate-600">
              Tap the new icon on your Home Screen. The site opens without Safari&apos;s address bar,
              similar to an installed app.
            </p>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-slate-500">
          <Link to="/" className="text-primary hover:underline font-medium">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
