import { redirect } from 'next/navigation';

/** `/details` without an id has nothing to show: send people to the search. */
export default function DetailsIndex() {
  redirect('/properties');
}
