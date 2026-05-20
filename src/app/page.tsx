import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to demo UI (UI-only)
  redirect('/dashboard')
}
