// Picks a varied set of activities for home sections. The catalog has many
// near-identical items (e.g. several "Jet Ski Tour — N minutos"), so selecting
// by category alone still repeats jet skis. We derive a coarse *activity type*
// from the title and pick at most one per type, then per category, then fill.

export function activityTypeKey(activity) {
  const t = (activity?.title || '').toLowerCase();
  if (/jet\s?ski|moto de agua/.test(t)) return 'jetski';
  if (/buggy/.test(t)) return 'buggy';
  if (/quad/.test(t)) return 'quad';
  if (/catamar|yate|crucero|barco|sail|vela|boat|cruise|party/.test(t)) return 'boat';
  if (/buceo|snorkel|dive|scuba/.test(t)) return 'dive';
  if (/delf|ballena|cet|whale|dolphin|ocean giants|wildlife/.test(t)) return 'wildlife';
  if (/parasail/.test(t)) return 'parasail';
  if (/fly\s?board|flyboard/.test(t)) return 'flyboard';
  if (/kayak/.test(t)) return 'kayak';
  if (/paddle|\bsup\b|stand up/.test(t)) return 'paddle';
  if (/parapente|paraglid|vuelo|tandem/.test(t)) return 'fly';
  if (/teide|senderis|hik|trek|volcan/.test(t)) return 'hike';
  if (/estrella|star|astro/.test(t)) return 'stars';
  if (/vino|wine|gastro|tapas/.test(t)) return 'food';
  if (/banana|crazy sofa|waterbull|sofa|towable|fun/.test(t)) return 'towable';
  if (/water taxi|lobos/.test(t)) return 'watertaxi';
  if (/pedal|pedalo/.test(t)) return 'pedal';
  if (/ski acu|water ski|wakeboard/.test(t)) return 'waterski';
  // fallback: first two significant words of the title
  return t.split(/[—\-|]/)[0].trim().split(/\s+/).slice(0, 2).join(' ') || 'other';
}

export function selectVariety(activities, count = 6) {
  const list = activities || [];
  const selected = [];
  const seenType = new Set();
  const seenCategory = new Set();

  // 1) one per activity type (max variety)
  for (const a of list) {
    if (selected.length >= count) break;
    const type = activityTypeKey(a);
    if (!seenType.has(type)) {
      seenType.add(type);
      seenCategory.add(a.category);
      selected.push(a);
    }
  }
  // 2) fill preferring unseen categories, still avoiding repeated types when possible
  if (selected.length < count) {
    for (const a of list) {
      if (selected.length >= count) break;
      if (selected.includes(a)) continue;
      if (!seenCategory.has(a.category)) { seenCategory.add(a.category); selected.push(a); }
    }
  }
  // 3) last resort fill in order
  if (selected.length < count) {
    for (const a of list) {
      if (selected.length >= count) break;
      if (!selected.includes(a)) selected.push(a);
    }
  }
  return selected;
}
