/* choose-option/scenarios/matrix.js: matrix sampling and start states. */
(function () {
  'use strict';
  const { matrixAsked } = env.taskOf('choose-option').lib;

  const SCALES = {
    quality: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'],
    agree: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
    satisfied: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'],
    often: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    important: ['Not important', 'Somewhat important', 'Very important'],
    likely: ['Unlikely', 'Maybe', 'Likely'],
  };

  const MATRIX_SCENES = [
    { title: 'Dinner feedback', note: 'Tell us how we did.', scale: ['quality', 'satisfied'],
      rows: [
        'Food quality', 'Service', 'Cleanliness', 'Value for money', 'Wait time', 'Menu variety', 'Atmosphere',
        'Noise level', 'Table lighting', 'Table spacing', 'Chair comfort', 'Table size', 'Dinner plates', 'Cutlery',
        'Glassware', 'Table linen', 'Music', 'Airflow', 'Room warmth', 'Restrooms', 'Beverage range', 'Portion size',
        'Order accuracy', 'Reservations', 'Coat storage', 'Menu print', 'Entrance', 'Condiments', 'Bread basket',
        'Bill layout', 'Serving trays', 'Table decor'
      ] },
    { title: 'Course evaluation', note: 'Your answers are anonymous.', scale: ['agree'],
      rows: ['The instructor was clear', 'The pace was right', 'The materials were useful', 'The assignments were fair', 'The room was comfortable',
        'The topics were relevant', 'I would recommend the course', 'The workload was manageable',
        'The goals made sense', 'I felt welcome in class', 'Tests matched the lessons', 'The feedback helped me',
        'I could ask questions freely', 'The schedule suited me', 'The tools were easy to use',
        'The breaks were well timed', 'I gained practical skills', 'The examples felt real',
        'The discussions had depth', 'The sessions began on time', 'I enjoyed group projects',
        'The course held my interest', 'The lesson order worked', 'The grading was consistent',
        'I remember the key ideas', 'I had time to reflect', 'I could review missed work',
        'The slides were easy to read', 'I grew more confident', 'I chose my learning goals',
        'I used ideas outside class', 'My experience was valued'] },
    { title: 'Support survey', note: 'It takes one minute.', scale: ['satisfied', 'quality'],
      rows: [
        'Response time', 'Agent knowledge', 'Problem resolution', 'Friendliness', 'Ease of contact', 'Follow-up',
        'Clarity of answers', 'Self-service help', 'Agent patience', 'Active listening', 'Case ownership',
        'Data privacy', 'Opening hours', 'Language options', 'Handoff process', 'Call reception', 'Chat readability',
        'Ticket tracking', 'Queue estimates', 'Transcript access', 'Escalation route', 'Screen sharing',
        'Callback slots', 'Mobile access', 'Agent honesty', 'Email formatting', 'File uploads', 'Identity checks',
        'Session stability', 'Reply relevance', 'Intake process', 'Record accuracy'
      ] },
    { title: 'Weekly habits', note: 'How often do you do each?', scale: ['often'],
      rows: [
        'Exercise', 'Cook at home', 'Read for pleasure', 'Cycle to work', 'Meditate', 'Meet friends',
        'Cook a new recipe', 'Go for a walk', 'Water plants', 'Keep a journal', 'Listen to music', 'Play the piano',
        'Draw a picture', 'Do a puzzle', 'Wash laundry', 'Tidy a room', 'Mend clothes', 'Plan a meal',
        'Visit a museum', 'Call a relative', 'Feed the pets', 'Sort recycling', 'Learn a language', 'Tend a garden',
        'Take photos', 'Watch a film', 'Stargaze', 'Write a poem', 'Clean windows', 'Polish shoes', 'Fold origami',
        'Volunteer'
      ] },
    { title: 'Feature priorities', note: 'Rate how much each matters to you.', scale: ['important', 'likely'],
      rows: [
        'Dark mode', 'Offline access', 'Faster search', 'Calendar sync', 'Shared folders', 'Voice notes',
        'Custom themes', 'Keyboard shortcuts', 'Document tags', 'Version history', 'Text translation',
        'Automatic saves', 'Data export', 'Task reminders', 'Pinned items', 'Split view', 'Read receipts',
        'File previews', 'Quick filters', 'Guest access', 'Audit log', 'Bulk editing', 'Password lock',
        'Link sharing', 'Text narration', 'Activity feed', 'Storage meter', 'Focus timer', 'Public profiles',
        'File compression', 'Scheduled backups'
      ] },
    { title: 'Library feedback', note: 'Tell us about your visit.', scale: ['quality', 'satisfied'], rows: ['Book selection', 'Reading desks', 'Shelf labels', 'Study booths', 'Loan periods', 'Return slots', 'Computers', 'Book condition'] },
    { title: 'Park facilities', note: 'Rate the spaces you used.', scale: ['satisfied', 'quality'], rows: ['Walking paths', 'Play equipment', 'Shade cover', 'Picnic tables', 'Drinking taps', 'Garden beds', 'Trail signs', 'Bike racks'] },
    { title: 'Parcel delivery', note: 'Rate your last delivery.', scale: ['quality', 'satisfied'], rows: ['Parcel tracking', 'Box condition', 'Courier care', 'Drop location', 'Arrival alerts', 'Time estimates', 'Proof of receipt', 'Redelivery'] },
    { title: 'Museum feedback', note: 'Rate your museum visit.', scale: ['satisfied', 'quality'], rows: ['Exhibit layout', 'Display labels', 'Audio guides', 'Collection range', 'Floor maps', 'Guided tours', 'Visitor seating', 'Locker storage'] },
    { title: 'Team reflection', note: 'Reflect on working together.', scale: ['agree'], rows: ['Our roles made sense', 'I could share ideas freely', 'Our meetings had a purpose', 'We handled changes well', 'I trusted my teammates', 'Our deadlines were realistic', 'We split tasks evenly', 'We celebrated our progress'] },
    { title: 'Travel routines', note: 'Rate your travel habits.', scale: ['often'], rows: ['Catch a bus', 'Pack a snack', 'Check a map', 'Reserve a seat', 'Use a suitcase', 'Ask directions', 'Buy a day pass', 'Ride a ferry'] },
    { title: 'Creative hobbies', note: 'How often do you do crafts?', scale: ['often'], rows: ['Make a collage', 'Carve wood', 'Sew a costume', 'Build a model', 'Weave a basket', 'Mold clay', 'Press flowers', 'String beads'] },
    { title: 'Event priorities', note: 'Rate what matters to you.', scale: ['important', 'likely'], rows: ['Live music', 'Guest speakers', 'Hands-on demos', 'Outdoor seating', 'Craft displays', 'Game tables', 'Food stalls', 'Quiet areas'] },
    { title: 'Room preferences', note: 'Rate your room preferences.', scale: ['important', 'likely'], rows: ['Natural light', 'Floor cushions', 'Wall shelves', 'Window blinds', 'Standing desks', 'Reading lights', 'Storage baskets', 'Indoor greenery'] },
    { title: 'Cinema feedback', note: 'Rate your recent screening.', scale: ['quality', 'satisfied'], rows: ['Screen sharpness', 'Sound balance', 'Seat cushioning', 'Aisle width', 'Ticket collection', 'Film selection', 'Subtitles', 'Lobby layout'] },
    { title: 'Tool rental', note: 'Rate your rental experience.', scale: ['satisfied', 'quality'], rows: ['Tool condition', 'Pickup process', 'Safety guides', 'Return flexibility', 'Rental duration', 'Accessory kits', 'Staff advice', 'Carry cases'] },
    { title: 'Home upkeep', note: 'How often do you do each?', scale: ['often'], rows: ['Dust shelves', 'Sweep floors', 'Wash windows', 'Mend clothes', 'Sort recycling', 'Water plants', 'Clear gutters', 'Change bedding'] },
    { title: 'Outdoor activities', note: 'Rate your time outdoors.', scale: ['often'], rows: ['Fly a kite', 'Watch birds', 'Skip stones', 'Climb a hill', 'Play catch', 'Paddle a canoe', 'Look at stars', 'Collect leaves'] },
  ];

  function sampleMatrix(rng, spec, opts) {
    const scene = rng.pick(MATRIX_SCENES);
    const cols = SCALES[rng.pick(scene.scale)];
    const level = opts.level;
    const n = level === 'easy' ? 3 : level === 'medium' ? rng.int(3, 4) : opts.ood ? rng.int(6, 8) : rng.int(3, 5);
    const rows = rng.sample(scene.rows, n);
    const k = level === 'easy' ? 1 : level === 'medium' ? rng.int(1, 2) : rng.int(1, Math.min(opts.ood ? 5 : 3, n - 1));
    const asked = new Set(rng.sample(rows.map((_, i) => i), k));
    const goals = rows.map((_, i) => (asked.has(i) ? rng.pick(cols) : null));
    return Object.assign(spec, { label: 'Survey', labelAliases: ['survey', 'questionnaire', 'form'], noun: 'answer', plural: 'answers',
      title: scene.title, note: scene.note, options: rows, rows, cols, goals });
  }

  env.scenario('choose-option', {
    name: 'matrix',
    sample(rng, spec, opts) {
      const scenario = spec.scenario;return sampleMatrix(rng, spec, opts);
    },
    init(spec, rng, { mode }) {
      const asked = matrixAsked(spec);
      const values = spec.rows.map(() => (rng.bool(0.4) ? rng.pick(spec.cols) : ''));
      const right = (i) => spec.goals[i];
      const off = (i) => {
        const j = spec.cols.indexOf(spec.goals[i]);
        return spec.cols[j > 0 && (j === spec.cols.length - 1 || rng.bool(0.5)) ? j - 1 : j + 1];
      };
      if (mode === 'partial') {
        asked.forEach((i, k) => { values[i] = asked.length > 1 ? (k === 0 ? right(i) : '') : off(i); });
      } else if (mode === 'wrong') {
        asked.forEach((i) => { values[i] = rng.bool(0.6) ? spec.cols[spec.cols.length - 1 - spec.cols.indexOf(spec.goals[i])] : off(i); });
        // a mirrored middle column is the goal itself: shift it
        asked.forEach((i) => { if (values[i] === spec.goals[i]) values[i] = off(i); });
      } else {
        asked.forEach((i) => { if (rng.bool(0.5)) values[i] = off(i); else if (values[i] === spec.goals[i]) values[i] = ''; });
      }
      return { values };
    },
  });
})();
