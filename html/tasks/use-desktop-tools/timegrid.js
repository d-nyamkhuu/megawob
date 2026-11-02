/*
 * use-desktop-tools / timegrid.js: the half-hour time grid the calendar and week scenarios share (event names, time labels,
 * overlaps, scrolling the grid, the selfTest scroll steps). Loaded before them.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { C } = fam.lib;
  const { clamp } = env.util;

  const EVENT_NAMES = ['Dentist', 'Team standup', 'Lunch with Sam', 'Gym', 'Budget review', 'Yoga class',
    'Client call', 'Design review', 'Coffee chat', 'Haircut', 'Parent-teacher meeting', 'Sprint planning',
    'Quarterly review', 'Dinner with Ana', 'Piano lesson', 'Car service', 'Interview: frontend role',
    'Doctor appointment', 'Book club', 'Grocery run', 'Product demo', 'Onboarding session', 'Vet appointment',
    'Workshop', 'Pick up kids', 'Board meeting', 'Run club', 'Study group', 'Flight to Lisbon', 'Retro',
    'All-hands', 'Tax advisor', 'Photo shoot', 'Volunteer shift', 'Webinar', 'Pitch practice', 'Marketing sync',
    'Hiring panel', 'Language class', 'Physio', 'Movie night', 'Laundry', 'Call mom', 'Plan the trip',
    'Code review', 'Bank appointment', 'Launch prep', 'Lunch', 'Phonecall', 'Party', 'Meeting', 'Pottery class',
    'Recipe exchange', 'Garden club', 'Bike tune-up', 'Podcast recording', 'Portfolio update', 'Vendor walkthrough',
    'Customer feedback', 'Support rotation', 'Data cleanup', 'Invoice follow-up', 'Choir rehearsal', 'Drum practice',
    'Chess meetup', 'Trivia night', 'Potluck dinner', 'Seed starting', 'Dog training', 'Plant swap', 'Craft circle',
    'Sketching session', 'Roommate check-in', 'Family brunch', 'Neighbor visit', 'Game night', 'Pool practice',
    'Trail walk', 'Badminton practice', 'Gallery visit', 'Museum visit', 'Farmers market', 'Library visit',
    'Package pickup', 'Key copying', 'Closet sorting', 'Donation drop-off', 'Window repair', 'Appliance delivery',
    'Internet setup', 'Home inspection', 'Mailbox repair', 'Meal prep', 'Tea tasting', 'Flower arranging', 'Open mic',
    'Costume fitting', 'Puzzle meetup', 'Theater tickets', 'Bike ride', 'Roadmap discussion', 'Salsa lesson',
    'Grant application', 'Sewing workshop', 'Tea with Jordan', 'Oil change', 'Bookstore browse', 'Estate planning',
    'Mural painting', 'Science lecture', 'Practice interview', 'Houseplant care', 'Community garden',
    'Language exchange', 'Camping gear check', 'Sourdough baking', 'Podcast editing', 'Local history tour',
    'Board game design', 'Furniture assembly', 'Writing session', 'River kayaking', 'Home office reset',
    'Astronomy night', 'Shoe repair', 'Gallery opening', 'Recipe planning', 'Orchestra concert', 'Neighborhood walk',
    'Ceramics glazing', 'Farm visit', 'Photo selection', 'Woodworking demo', 'Coding meetup', 'Poetry reading',
    'Dance rehearsal', 'Storage unit visit', 'Birdwatching', 'Charity auction', 'Wardrobe fitting', 'Compost pickup',
    'Ferry ride', 'Trail maintenance', 'Film screening', 'Museum sketching', 'Seed library visit', 'Soup exchange',
    'Strength training', 'Hiring debrief', 'Vendor call', 'Wireframe critique', 'Incense blending', 'Barber visit',
    'School fundraiser', 'Release planning', 'Candle making', 'Violin lesson', 'Tire rotation', 'Pantry restock',
    'Prototype testing', 'New hire welcome', 'Cat grooming', 'Sofa delivery', 'Strategy session', 'Walking group',
    'Exam review', 'Mountain rail trip', 'Screenprint setup', 'Notary visit', 'Guest lecture', 'Speech rehearsal',
    'Film marathon', 'Closet repair', 'Weekend itinerary', 'Archive inventory', 'Seedling exchange',
    'Bike safety check', 'Podcast interview', 'Travel scrapbook', 'Usability review', 'Electrician visit',
    'Fossil cataloging', 'Marble carving', 'Stargazing journal'];
  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];
  const SLOTS = 48;

  function timeLabel(i, h24) {
    const h = Math.floor(i / 2) % 24;
    if (h24) return `${String(h).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}${i % 2 ? ':30' : ''}${h < 12 ? 'am' : 'pm'}`;
  }

  const overlaps = (a, b) => a.start < b.start + b.dur && b.start < a.start + a.dur;

  function eventNames(rng, crng, opts, n) {
    const pool = C.sample(crng, EVENT_NAMES, n + 4, { csplit: opts.csplit });
    const first = C.pick(crng, C.FIRST_NAMES, { csplit: opts.csplit });
    if (rng.bool(0.4)) pool[rng.int(0, pool.length - 1)] = `1:1 with ${first}`;
    return pool;
  }

  // Scroll a time grid so rows [lo, hi) are visible (route: scrollbar drag or wheel).
  function gridScroll(m, spec, lo, hi, pane) {
    const top = m.view.top;
    const bottom = m.view.bottom ?? top + 16;
    if (top <= lo + 1e-6 && hi <= bottom + 1e-6) return null;
    const rows = Math.max(1, Math.round(bottom - top));
    const want = clamp(Math.round(lo - (rows - (hi - lo)) / 2), 0, Math.max(0, SLOTS - rows));
    if (spec.route === 'wheel') {
      const px = m.view.px || 24;
      const dy = Math.round((want - top) * px);
      if (Math.abs(dy) >= 1) return { wheel: [{ pane }, dy] };
    }
    return { drag: [{ thumb: 'scroll' }, { scroll: want }] };
  }

  // selfTest: a step on the grid's scrollbar or wheel (16 rows of 24 px), else own(m); then the view's bottom row
  // when the widget never mirrored it.
  function gridStep(m, step, own) {
    const rowsN = 16;
    const setTop = (mm, top) => ({ ...mm, view: { top, bottom: top + rowsN, px: 24 } });
    if (step.wheel) m = setTop(m, clamp(m.view.top + step.wheel[1] / 24, 0, SLOTS - rowsN));
    else if (step.drag && step.drag[0].thumb) m = setTop(m, step.drag[1].scroll);
    else m = own(m);
    if (m.view.bottom === null) m = setTop(m, m.view.top);
    return m;
  }

  Object.assign(fam.lib, {
    EVENT_NAMES, eventNames, gridScroll, gridStep, MONTHS, overlaps, SLOTS, timeLabel, WEEKDAYS,
  });
  // Exposed for widgets.
  Object.assign(fam.helpers, { timeLabel, SLOTS });
})();
