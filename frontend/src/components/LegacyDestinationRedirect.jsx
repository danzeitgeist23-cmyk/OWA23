import { useParams, Navigate } from 'react-router-dom';

// Redirect legacy Spanish island URL (/destinos/:slug) to the English canonical
// (/destinations/:slug), preserving the island slug.
export default function LegacyDestinationRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/destinations/${slug}`} replace />;
}
