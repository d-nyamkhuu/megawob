/* set-date/scenes.js: scene content and sampling phrases (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  const person = (rng, spec) => lib.C.personName(rng, lib.C.csplitOf(spec)).full;

  const SUBJECTS = () => lib.C.EMAIL_SUBJECTS.filter((x) => x.length <= 38 && !/submit/i.test(x));

  const subject = (rng, spec) => lib.C.pick(rng, SUBJECTS(), lib.C.csplitOf(spec));

  function cityRow(rng, spec) { return lib.C.pick(rng, lib.C.CITIES, lib.C.csplitOf(spec)); }

  const DATE_SCENES = [
    (r, s) => { const a = cityRow(r, s); let b = cityRow(r, s); if (b.city === a.city) b = cityRow(r.fork('b'), s);
      return { title: 'Book a flight', label: 'Departure date', dir: 'future', extra: [['From', `${a.city} (${a.iata})`], ['To', `${b.city} (${b.iata})`]] }; },
    (r, s) => ({ title: r.pick(['Your profile', 'Edit profile']), label: 'Birthday', dir: 'past', extra: [['Name', person(r, s)], ['Country', lib.C.pick(r, lib.C.COUNTRIES, lib.C.csplitOf(s)).name]] }),
    (r, s) => ({ title: 'New task', label: 'Due date', dir: 'future', extra: [['Task', subject(r, s)], ['Assignee', person(r, s)]] }),
    (r, s) => ({ title: 'Schedule a delivery', label: 'Delivery date', dir: 'future', extra: [['Order', lib.C.orderId(r)], ['Address', lib.C.address(r, 'en-US', lib.C.csplitOf(s)).line1]] }),
    (r, s) => ({ title: 'Book an appointment', label: 'Appointment date', dir: 'future', extra: [['Clinic', `${lib.C.pick(r, lib.C.COMPANIES, lib.C.csplitOf(s)).split(' ')[0]} ${r.pick([
      'Dental', 'Health Clinic', 'Physio', 'Eye Care', 'Podiatry', 'Audiology', 'Cardiology', 'Pediatrics', 'Allergy',
      'Skin Care', 'Sleep Care', 'Neurology', 'Urology', 'Family Care', 'ENT Care'
    ])}`], ['Patient', person(r, s)]] }),
    (r, s) => ({ title: 'Renew a permit', label: 'Start date', dir: 'future', extra: [['Permit', r.pick([
      'Parking, zone B', 'Residential parking', 'Street vendor', 'Event permit', 'Building work', 'Tree removal',
      'Road occupancy', 'Oversize load', 'Waste collection', 'Outdoor dining', 'Film production',
      'Commercial loading', 'Marina access', 'Temporary signage', 'Water discharge', 'Equipment storage'
    ])], ['Plate', `${lib.C.letters(r, 2)}-${lib.C.digits(r, 4)}`]] }),
    (r, s) => ({ title: 'Register a pet', label: 'Date of adoption', dir: 'past', extra: [['Name', r.pick([
      'Biscuit', 'Pepper', 'Mochi', 'Luna', 'Juniper', 'Ziggy', 'Olive', 'Maple', 'Pippin', 'Clover', 'Noodle',
      'Waffles', 'Tilly', 'Rascal', 'Doodle', 'Miso', 'Scout', 'Pebble', 'Cricket', 'Fable', 'Socks', 'Bingo',
      'Kipper', 'Sprout', 'Mabel', 'Toffee', 'Roo', 'Puddle'
    ])], ['Species', r.pick(['Dog', 'Cat', 'Rabbit', 'Parrot'])]] }),
    (r, s) => ({ title: 'Log an expense', label: 'Purchase date', dir: 'past', extra: [['Merchant', lib.C.pick(r, lib.C.COMPANIES, lib.C.csplitOf(s))], ['Employee', person(r, s)]] }),
    (r, s) => ({ title: 'Event registration', label: 'Event date', dir: 'future', extra: [['Venue', lib.C.pick(r, lib.C.VENUES, lib.C.csplitOf(s))], ['Attendee', person(r, s)]] }),
  ];

  const RANGE_SCENES = [
    (r, s) => ({ title: 'Reserve a room', label: 'Check-in', label2: 'Check-out', unit: 'night', extra: [['Hotel', `${r.pick([
      'Harbor View', 'The Linden', 'Hotel Aurora', 'Riverside', 'Casa Verde', 'Moss Lantern', 'Velvet Glen',
      'Cielo Bruma', 'Sedge Loom', 'The Dewcup', 'Fable Cairn', 'Brumelace'
    ])} ${r.pick(['Inn', 'Suites', 'Hotel', 'Lodge'])}`], ['Guests', r.pick(['1 adult', '2 adults', '2 adults, 1 child'])]] }),
    (r, s) => ({ title: 'Request time off', label: 'First day', label2: 'Last day', extra: [['Type', r.pick([
      'Vacation', 'Parental leave', 'Training', 'Personal leave', 'Bereavement', 'Jury duty', 'Volunteering',
      'Wedding', 'Errands'
    ])], ['Approver', person(r, s)]] }),
    (r, s) => { const c = cityRow(r, s); return { title: 'Rent a car', label: 'Pick-up', label2: 'Drop-off', unit: 'day', extra: [['Location', `${c.city} airport (${c.iata})`], ['Class', r.pick(['Compact', 'SUV', 'Economy', 'Van'])]] }; },
    (r, s) => ({ title: 'Filter the report', label: 'Start date', label2: 'End date', extra: [['Report', r.pick([
      'Weekly sales', 'Support tickets', 'Site traffic', 'Refunds', 'Order volume', 'Team attendance',
      'Delivery times', 'Product returns', 'Monthly traffic', 'Open requests', 'Regional growth', 'Service quality',
      'Daily bookings'
    ])], ['Region', r.pick(['North', 'EMEA', 'West', 'APAC'])]] }),
    (r, s) => ({ title: 'Book a cabin', label: 'Arrival', label2: 'Departure', unit: 'night', extra: [['Cabin', `${r.pick([
      'Pine', 'Lakeside', 'Fern', 'Summit', 'Birch', 'Cedar', 'Heath', 'Bramble', 'Thicket', 'Hollow', 'Cove',
      'Aspen', 'Pebble', 'Meadow', 'Dune', 'Willow'
    ])} cabin`], ['Guests', String(r.int(1, 6))]] }),
  ];

  const TIME_SCENES = [
    (r, s) => ({ title: 'Order a ride', label: 'Pickup time', extra: [['Pickup', lib.C.address(r, 'en-US', lib.C.csplitOf(s)).line1], ['Riders', String(r.int(1, 4))]] }),
    (r) => ({ title: 'Set an alarm', label: 'Alarm time', extra: [['Label', r.pick([
      'Gym', 'Flight', 'Meds', 'Standup', 'Commute', 'Stretch', 'Reading', 'Walk', 'Study', 'Laundry', 'Bedtime',
      'Coffee', 'Baking', 'Shower', 'Dishes', 'Music'
    ])], ['Sound', r.pick(['Chimes', 'Radar', 'Birdsong'])]] }),
    (r, s) => ({ title: 'Schedule a meeting', label: 'Start time', extra: [['Room', `${r.pick([
      'Atlas', 'Orion', 'Maple', 'Harbor', 'Cobalt', 'Lyra', 'Vega', 'Bamboo', 'Quartz', 'Delta', 'Lotus', 'Finch',
      'Opal', 'Sienna', 'Nimbus', 'Tundra'
    ])} ${r.int(1, 6)}`], ['Organizer', person(r, s)]] }),
    (r) => ({ title: 'Book a table', label: 'Reservation time', extra: [['Restaurant', r.pick([
      'Olive & Fig', 'Saffron House', 'Blue Door', 'Trattoria Nove', 'Amber Skillet', 'The Quiet Fork',
      'Figwood Pantry'
    ])], ['Party size', String(r.int(2, 8))]] }),
    (r) => ({ title: 'New reminder', label: 'Reminder time', extra: [['Reminder', r.pick([
      'Water the plants', 'Call the bank', 'Pick up laundry', 'Send the invoice', 'Tidy the desk'
    ])], ['Repeat', r.pick(['Never', 'Daily', 'Weekdays'])]] }),
  ];

  const DUR_SCENES = [
    (r) => ({ title: 'Kitchen timer', label: 'Timer', extra: [['Recipe', r.pick([
      'Sourdough loaf', 'Braised short ribs', 'Lentil soup', 'Granola', 'Apple oat muffins', 'Herbed potato bake',
      'Spinach feta pie', 'Carrot ginger soup', 'Chickpea stew', 'Maple pear crisp', 'Zucchini bread',
      'Lemon loaf cake', 'Mushroom risotto', 'Apple crumble', 'Herbed biscuits', 'Pear almond tart'
    ])]] }),
    (r, s) => ({ title: 'Schedule a meeting', label: 'Duration', extra: [['Organizer', person(r, s)]] }),
    (r) => ({ title: 'Park your car', label: 'Parking time', extra: [['Zone', `${lib.C.letters(r, 1)}${r.int(1, 9)}`]] }),
    (r) => ({ title: 'Log a workout', label: 'Workout length', extra: [['Activity', r.pick([
      'Cycling', 'Swimming', 'Rowing', 'Hiking', 'Walking', 'Dancing', 'Jogging', 'Pilates', 'Tennis', 'Soccer',
      'Climbing', 'Skating', 'Fencing', 'Aerobics', 'Skiing', 'Boxing'
    ])]] }),
    (r, s) => ({ title: 'Estimate a task', label: 'Time estimate', extra: [['Task', subject(r, s)]] }),
  ];

  const emailOf = (name) => `${name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ +/g, '.')}@example.com`;

  const SCENE_ROWS = {
    'Book a flight': (r, s) => [['Passengers', r.pick([
      '1 adult', '2 adults', '2 adults, 1 child', '1 adult, 1 child', '2 adults, 1 teen'
    ])], ['Cabin', r.pick(['Economy', 'Premium economy', 'Business'])],
      ['Bags', r.pick([
        'Carry-on only', '1 checked bag', '2 checked bags', '2 cabin bags', '1 garment bag', '1 sports bag',
        '1 personal bag'
      ])], ['Seat', r.pick(['Window', 'Aisle', 'No preference'])], ['Traveler', person(r, s)]],
    'Your profile': (r, s) => [['Email', emailOf(person(r, s))], ['City', cityRow(r, s).city], ['Language', r.pick(['English', 'Deutsch', 'Francais', 'Espanol'])],
      ['Occupation', r.pick([
        'Designer', 'Engineer', 'Teacher', 'Nurse', 'Accountant', 'Architect', 'Librarian', 'Paramedic', 'Pharmacist',
        'Chef', 'Carpenter', 'Journalist', 'Mechanic', 'Gardener', 'Translator', 'Plumber', 'Baker'
      ])], ['Pronouns', r.pick(['she/her', 'he/him', 'they/them', 'Prefer not to say'])]],
    'New task': (r, s) => [['Project', r.pick([
      'Website relaunch', 'Q3 planning', 'Onboarding', 'Mobile app', 'Client hub', 'Data cleanup', 'Team handbook',
      'Release plan'
    ])], ['Priority', r.pick(['Low', 'Normal', 'High', 'Urgent'])],
      ['Status', r.pick([
        'Not started', 'In progress', 'Blocked', 'In review', 'Completed', 'In revision', 'Scheduled', 'In testing'
      ])], ['Reviewer', person(r, s)], ['Estimate', r.pick(['2 h', '4 h', '1 day', '3 days'])]],
    'Schedule a delivery': (r, s) => [['Recipient', person(r, s)], ['Phone', `(${r.int(201, 989)}) ${r.int(200, 989)}-${lib.C.digits(r, 4)}`], ['Window', r.pick(['8 AM - 12 PM', '12 PM - 5 PM', '5 PM - 9 PM'])],
      ['Carrier', r.pick([
        'Parcel Express', 'Northline', 'Swift Freight', 'Cedar Route', 'Milepost Cargo'
      ])], ['Instructions', r.pick(['Leave at the door', 'Ring the bell', 'Hand to recipient'])]],
    'Book an appointment': (r, s) => [['Reason', r.pick([
      'Check-up', 'Cleaning', 'Follow-up', 'Consultation', 'Referral', 'Paperwork', 'Screening', 'Intake',
      'Questions', 'Education'
    ])], ['Provider', person(r, s)],
      ['Insurance', r.pick([
        'Aetna', 'Cigna', 'Self-pay', 'Blue Shield', 'Humana', 'MetLife', 'Guardian', 'Ameritas', 'Sun Life',
        'DentaQuest', 'Ambetter'
      ])], ['Phone', `(${r.int(201, 989)}) ${r.int(200, 989)}-${lib.C.digits(r, 4)}`], ['Reminder', r.pick(['Email', 'Text message', 'None'])]],
    'Renew a permit': (r, s) => [['Holder', person(r, s)], ['Vehicle', r.pick(['Sedan', 'Hatchback', 'Pickup', 'Van'])], ['Term', r.pick(['6 months', '1 year', '2 years'])],
      ['Fee', `$${r.pick([35, 60, 90, 120])}.00`], ['Delivery', r.pick(['Mail', 'Pick up', 'Email'])]],
    'Register a pet': (r) => [['Breed', r.pick(['Mixed breed', 'Labrador', 'Tabby', 'Siamese', 'Beagle', 'Holland Lop'])], ['Age', r.pick(['6 months', '1 year', '2 years', '4 years', '7 years'])],
      ['Sex', r.pick(['Female', 'Male'])], ['Shelter', `${r.pick(['Happy Tails', 'Second Chance', 'Riverside', 'Paws & Claws'])} ${r.pick(['Rescue', 'Shelter', 'Humane Society'])}`],
      ['Adoption fee', `$${r.pick([45, 60, 85, 120, 150, 200])}.00`], ['Adoption method', r.pick(['In person', 'Online', 'Foster-to-adopt', 'Transfer'])]],
    'Log an expense': (r, s) => [['Category', r.pick([
      'Meals', 'Travel', 'Supplies', 'Software', 'Lodging', 'Training', 'Repairs', 'Mileage', 'Postage', 'Phone'
    ])], ['Amount', `$${r.int(8, 480)}.${lib.C.digits(r, 2)}`],
      ['Payment', r.pick([
        'Corporate card', 'Personal card', 'Cash', 'Bank transfer', 'Money order', 'Voucher'
      ])], ['Project', r.pick(['Website relaunch', 'Q3 planning', 'Client visit'])], ['Receipt', r.pick(['Attached', 'Missing', 'Emailed'])]],
    'Event registration': (r, s) => [['Ticket', r.pick([
      'General', 'VIP', 'Student', 'Speaker', 'Guest', 'Member', 'Sponsor', 'Staff'
    ])], ['Email', emailOf(person(r, s))], ['Company', lib.C.pick(r, lib.C.COMPANIES, lib.C.csplitOf(s))],
      ['Dietary', r.pick([
        'None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'
      ])], ['T-shirt', r.pick(['S', 'M', 'L', 'XL'])]],
  };

  SCENE_ROWS['Edit profile'] = SCENE_ROWS['Your profile'];

  const GENERIC_ROWS = (r, s) => r.shuffle([['Email', emailOf(person(r, s))], ['Phone', `(${r.int(201, 989)}) ${r.int(200, 989)}-${lib.C.digits(r, 4)}`],
    ['Reference', `REF-${lib.C.digits(r, 5)}`], ['Contact', r.pick(['Email', 'Phone', 'Text message'])], ['Priority', r.pick(['Low', 'Normal', 'High'])],
    ['Department', r.pick([
      'Operations', 'Sales', 'Support', 'Finance', 'Product', 'Research', 'Learning', 'Design'
    ])], ['Status', r.pick(['Draft', 'Pending', 'Confirmed'])], ['Owner', person(r, s)]]);

  function addSceneRows(r, s, scene, n) {
    const want = Array.isArray(n) ? r.int(n[0], n[1]) : n;
    if (!(want > scene.extra.length)) return;
    const named = (SCENE_ROWS[scene.title] || (() => []))(r, s);
    const seen = new Set(scene.extra.map(([k]) => k));
    const rows = [];
    for (const row of named.concat(GENERIC_ROWS(r, s))) {
      if (seen.has(row[0])) continue;
      seen.add(row[0]);
      rows.push(row);
    }
    scene.extra = scene.extra.concat(rows.slice(0, want - scene.extra.length));
  }

  const DATE_ASKS = ['long', 'longDay', 'dmy', 'ordinal', 'iso', 'us', 'eu', 'relative'];

  function dateAsk(rng, iso, kinds) {
    const kind = rng.pick(kinds);
    if (kind !== 'relative') return { askKind: kind, ask: lib.fmtDate(iso, kind) };
    // "the first <weekday> after <anchor>" with anchor 1..7 days before: exactly one such day exists.
    const anchor = lib.fromDays(lib.days(iso) - rng.int(1, 7));
    return { askKind: kind, ask: `the first ${lib.WEEKDAYS[lib.weekday(iso)]} after ${lib.fmtDate(anchor, rng.pick(['long', 'iso']))}` };
  }

  function relToday(rng, today, dir) {
    const wd = lib.weekday(today);
    const future = [
      () => ['tomorrow', lib.addDays(today, 1)],
      () => ['the day after tomorrow', lib.addDays(today, 2)],
      () => { const n = rng.int(3, 20); return [rng.pick([`in ${n} days`, `${n} days from today`]), lib.addDays(today, n)]; },
      () => { const n = rng.int(1, 6); return [n === 1 ? rng.pick(['a week from today', 'in one week']) : rng.pick([`in ${n} weeks`, `${n} weeks from today`]), lib.addDays(today, 7 * n)]; },
      () => ['a week from tomorrow', lib.addDays(today, 8)],
      () => { const w = rng.int(0, 6); const gap = ((w - wd + 7) % 7) || 7; return [rng.pick([`this coming ${lib.WEEKDAYS[w]}`, `the first ${lib.WEEKDAYS[w]} after today`]), lib.addDays(today, gap)]; },
      () => { const gap = rng.int(6, 7); const w = (wd + gap) % 7; return [`next ${lib.WEEKDAYS[w]}`, lib.addDays(today, gap)]; },
      () => { const k = lib.addMonths(lib.monthOf(today), 1); return [rng.pick(['the first of next month', 'the 1st of next month']), `${k}-01`]; },
      () => { const k = lib.addMonths(lib.monthOf(today), 1); const d = rng.int(2, 28); return [`the ${lib.ordinal(d)} of next month`, `${k}-${lib.pad2(d)}`]; },
      () => ['the last day of next month', lib.lastOfMonth(lib.addMonths(lib.monthOf(today), 1))],
      () => (lib.lastOfMonth(lib.monthOf(today)) > today ? ['the last day of this month', lib.lastOfMonth(lib.monthOf(today))] : ['tomorrow', lib.addDays(today, 1)]),
    ];
    const past = [
      () => ['yesterday', lib.addDays(today, -1)],
      () => { const n = rng.int(2, 20); return [`${n} days ago`, lib.addDays(today, -n)]; },
      () => { const n = rng.int(1, 5); return [n === 1 ? 'a week ago' : `${n} weeks ago`, lib.addDays(today, -7 * n)]; },
      () => { const w = rng.int(0, 6); const gap = ((wd - w + 7) % 7) || 7; return [`the most recent ${lib.WEEKDAYS[w]} before today`, lib.addDays(today, -gap)]; },
      () => { const k = lib.addMonths(lib.monthOf(today), -1); return ['the first day of last month', `${k}-01`]; },
      () => ['the last day of last month', lib.lastOfMonth(lib.addMonths(lib.monthOf(today), -1))],
    ];
    const pool = dir === 'past' ? past : dir === 'future' ? future : future.concat(past);
    const [ask, target] = rng.pick(pool)();
    return { askKind: 'relToday', ask, target };
  }

  function rangeAsk(rng, s, e, scene) {
    const kinds = ['fromTo', 'iso', 'fromTo'];
    if (scene.unit) kinds.push('nights');
    const kind = rng.pick(kinds);
    const ys = lib.ymd(s)[0];
    const ye = lib.ymd(e)[0];
    const n = lib.days(e) - lib.days(s);
    if (kind === 'nights') return { askKind: kind, ask: `${lib.fmtDate(s, 'long')} for ${n} ${scene.unit}${n > 1 ? 's' : ''}` };
    if (kind === 'iso') return { askKind: kind, ask: `${s} through ${e}` };
    if (ys !== ye) return { askKind: kind, ask: `from ${lib.fmtDate(s, 'long')} to ${lib.fmtDate(e, 'long')}` };
    return { askKind: kind, ask: `from ${lib.fmtDate(s, 'monthDay')} to ${lib.fmtDate(e, 'monthDay')}, ${ye}` };
  }

  const randomDay = (rng, lo, hi) => lib.fromDays(rng.int(lib.days(lo), lib.days(hi)));

  function dayInMonth(rng, key, not) {
    const [y, m] = [+key.slice(0, 4), +key.slice(5, 7)];
    for (;;) {
      const iso = lib.isoOf(y, m, rng.int(1, lib.daysInMonth(y, m)));
      if (iso !== not) return iso;
    }
  }

  function startNear(rng, key, maxOff, hi) {
    const off = rng.bool(0.5) ? rng.int(-3, 3) : rng.int(-maxOff, maxOff);
    return lib.clampKey(lib.addMonths(key, off), lib.EPOCH.first, hi);
  }

  const inEpoch = (iso) => iso >= '2020-03-01' && iso <= '2032-10-31';

  const MONTH_SCENES = [
    (r, s) => ({ title: 'Add a payment card', label: 'Expiry', dir: 'future', extra: [['Cardholder', person(r, s)], ['Card number', `•••• ${lib.C.digits(r, 4)}`]] }),
    (r, s) => ({ title: 'Monthly report', label: 'Report month', dir: 'past', extra: [['Report', r.pick([
      'Revenue', 'Support volume', 'Churn', 'Signups', 'Order value', 'Margins', 'Returns', 'Wait time'
    ])], ['Region', r.pick(['North', 'EMEA', 'West', 'APAC'])]] }),
    (r) => ({ title: 'Start a subscription', label: 'Billing starts', dir: 'future', extra: [['Plan', r.pick([
      'Team', 'Pro', 'Starter', 'Business', 'Bronze', 'Silver', 'Gold', 'Growth', 'Plus', 'Premium', 'Core', 'Flex',
      'Studio', 'Custom', 'Copper', 'Crystal'
    ])], ['Seats', String(r.int(2, 40))]] }),
    (r, s) => ({ title: 'Set a budget', label: 'Budget month', dir: 'any', extra: [['Category', r.pick([
      'Groceries', 'Travel', 'Utilities', 'Software', 'Dining', 'Housing', 'Transit', 'Childcare'
    ])], ['Owner', person(r, s)]] }),
    (r) => ({ title: 'Lease details', label: 'Lease starts', dir: 'future', extra: [['Unit', `${r.int(1, 9)}${r.pick(['A', 'B', 'C'])}`], ['Term', r.pick(['6 months', '12 months', '24 months'])]] }),
    (r, s) => ({ title: 'Bank statement', label: 'Statement month', dir: 'past', extra: [['Account', `Checking ${lib.C.digits(r, 4)}`], ['Holder', person(r, s)]] }),
  ];

  const WEEK_SCENES = [
    (r, s) => ({ title: 'Submit a timesheet', label: 'Week', dir: 'any', extra: [['Employee', person(r, s)], ['Project', r.pick(['Atlas', 'Harbor', 'Maple', 'Orion'])]] }),
    (r) => ({ title: 'Plan the meals', label: 'Meal plan week', dir: 'future', extra: [['Household', r.pick([
      '2 adults', '2 adults, 2 kids', '1 adult', '1 adult, 2 kids'
    ])], ['Diet', r.pick(['Omnivore', 'Vegetarian', 'No dairy'])]] }),
    (r, s) => ({ title: 'Weekly report', label: 'Reporting week', dir: 'past', extra: [['Team', r.pick([
      'Support', 'Sales', 'Platform', 'Design', 'Research', 'Product', 'Growth', 'Admin'
    ])], ['Author', person(r, s)]] }),
    (r, s) => ({ title: 'Book a sprint', label: 'Sprint week', dir: 'future', extra: [['Board', r.pick([
      'Web', 'Mobile', 'Data', 'Infra', 'Search', 'Cloud', 'UX', 'Build'
    ])], ['Lead', person(r, s)]] }),
    (r) => ({ title: 'Shift schedule', label: 'Schedule week', dir: 'future', extra: [['Location', r.pick([
      'Downtown', 'Airport', 'Harbor', 'Mall', 'Midtown', 'Station', 'Campus', 'Market', 'Plaza', 'Resort',
      'Lakeside', 'Village', 'Suburb', 'Park', 'Arcade', 'Hilltop'
    ])], ['Role', r.pick(['Cashier', 'Barista', 'Driver', 'Cook'])]] }),
  ];

  Object.assign(lib, { DATE_SCENES, RANGE_SCENES, TIME_SCENES, DUR_SCENES, addSceneRows, DATE_ASKS, dateAsk, relToday, rangeAsk, randomDay, dayInMonth, startNear, inEpoch, MONTH_SCENES, WEEK_SCENES });
})();
