import { activities as bookableActivities } from './activityCatalog';
import {
  activities as legacyActivities,
  blogPosts,
  categories,
  destinations,
  stats,
  testimonials,
} from './mock';

function interleaveActivities(primary, secondary) {
  const mixed = [];
  const maxLength = Math.max(primary.length, secondary.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (primary[index]) mixed.push(primary[index]);
    if (secondary[index]) mixed.push(secondary[index]);
  }

  return mixed;
}

export const activities = interleaveActivities(bookableActivities, legacyActivities);
export { blogPosts, categories, destinations, stats, testimonials };
