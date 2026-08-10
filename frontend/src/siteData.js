import { activities as bookableActivities } from './activityCatalog';
import {
  activities as legacyActivities,
  blogPosts,
  categories,
  destinations,
  stats,
  testimonials,
} from './mock';

export const activities = [...bookableActivities, ...legacyActivities];
export { blogPosts, categories, destinations, stats, testimonials };
