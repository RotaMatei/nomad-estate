import { redirect } from 'next/navigation';

// Fallback for /details without an id
export default function DetailsIndex() {
  // Redirect to home or a not-found route; adjust as needed
  redirect('/');
}
