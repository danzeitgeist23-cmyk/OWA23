import { useParams, Navigate } from 'react-router-dom';

// Redirects the legacy Spanish activity URL (/actividad/:id) to the English
// canonical one (/activity/:id) while preserving the activity slug so shared
// links and any existing indexed URLs keep resolving to the right activity.
export default function LegacyActivityRedirect() {
  const { id } = useParams();
  return <Navigate to={`/activity/${id}`} replace />;
}
