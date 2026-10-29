/* fill-form/data.js: source-document banks, formatting and fact builders shared by the scenarios. */
(function () {
  'use strict';
  const { pad } = env.util;
  const C = env.content;
  const MONTHS = C.MONTHS;
  // ---------------------------------------------------------------- word banks (local data)

  // Plain name lists: personName() falls back to them when eight content names in a row are not typeable; they also
  // give a second name that differs from the first.
  const FIRST_FB = [
    'Amelia', 'Chloe', 'Elena', 'Grace', 'Isla', 'Benjamin', 'Daniel', 'Felix', 'Hugo', 'Jonas', 'Adrian', 'Aiden',
    'Alice', 'Clara', 'Ethan', 'Hannah', 'Isaac', 'Julia', 'Oliver', 'Thomas'
  ];
  const LAST_FB = [
    'Anderson', 'Becker', 'Castillo', 'Dubois', 'Eriksson', 'Fischer', 'Garcia', 'Hughes', 'Ivanova', 'Jensen',
    'Ashford', 'Alvarez', 'Bennett', 'Brennan', 'Calder', 'Carver', 'Delgado', 'Ellison', 'Fowler', 'Franklin'
  ];

  // code, name, cities (vendor addresses), postal-code pattern (# digit, A letter), phone pattern (as printed)
  const COUNTRIES = [
    ['US', 'United States', [
      'Portland', 'Austin', 'Denver', 'Madison', 'Raleigh', 'Tucson', 'Seattle', 'Boston', 'Chicago', 'Houston',
      'Phoenix', 'Atlanta', 'Detroit', 'Memphis', 'Orlando', 'Oakland', 'Spokane', 'Omaha', 'Boise', 'Richmond',
      'Newark', 'Tacoma', 'Wichita', 'Buffalo'
    ], '#####', '(###) ###-####'],
    ['CA', 'Canada', [
      'Toronto', 'Calgary', 'Halifax', 'Ottawa', 'Regina', 'Markham', 'Windsor', 'Kelowna', 'Nanaimo', 'Moncton',
      'Brandon', 'Guelph', 'Sarnia', 'Sudbury', 'Vaughan', 'Airdrie'
    ], 'A#A #A#', '(###) ###-####'],
    ['GB', 'United Kingdom', [
      'Leeds', 'Bristol', 'York', 'Brighton', 'Glasgow', 'London', 'Cardiff', 'Belfast', 'Swansea', 'Newport',
      'Chester', 'Durham', 'Exeter', 'Oxford', 'Bath', 'Truro', 'Derby', 'Bangor', 'Dundee', 'Stirling'
    ], 'AA# #AA', '0#### ######'],
    ['IE', 'Ireland', ['Dublin', 'Cork', 'Galway'], 'A## A#A#', '0## ### ####'],
    ['DE', 'Germany', [
      'Berlin', 'Hamburg', 'Munich', 'Leipzig', 'Cologne', 'Dresden', 'Bremen', 'Aachen', 'Potsdam', 'Erfurt',
      'Rostock', 'Kassel', 'Hanover', 'Krefeld', 'Koblenz', 'Cottbus', 'Wetzlar', 'Zwickau', 'Lubeck', 'Bochum'
    ], '#####', '0## #######'],
    ['FR', 'France', [
      'Lyon', 'Lille', 'Nantes', 'Bordeaux', 'Marseille', 'Paris', 'Nice', 'Rennes', 'Toulouse', 'Dijon', 'Reims',
      'Perpignan', 'Rouen', 'Angers', 'Valence', 'Amiens', 'Limoges', 'Avignon', 'Grenoble', 'Poitiers'
    ], '#####', '0# ## ## ## ##'],
    ['ES', 'Spain', [
      'Madrid', 'Valencia', 'Seville', 'Bilbao', 'Zaragoza', 'Alicante', 'Granada', 'Cordoba', 'Malaga', 'Logrono',
      'Burgos', 'Toledo', 'Segovia', 'Oviedo', 'Almeria', 'Zamora'
    ], '#####', '### ### ###'],
    ['IT', 'Italy', [
      'Milan', 'Turin', 'Bologna', 'Florence', 'Rome', 'Naples', 'Venice', 'Verona', 'Genoa', 'Palermo', 'Catania',
      'Ravenna', 'Parma', 'Cagliari', 'Perugia', 'Trieste'
    ], '#####', '0## #######'],
    ['NL', 'Netherlands', [
      'Utrecht', 'Rotterdam', 'Eindhoven', 'Leiden', 'Amsterdam', 'Haarlem', 'Groningen', 'Alkmaar', 'Tilburg',
      'Dordrecht', 'Nijmegen', 'Zwolle', 'Almere', 'Deventer', 'Enschede'
    ], '#### AA', '0## ### ####'],
    ['SE', 'Sweden', [
      'Uppsala', 'Malmo', 'Gothenburg', 'Lund', 'Stockholm', 'Vasteras', 'Orebro', 'Linkoping', 'Gavle', 'Umea',
      'Kalmar', 'Falun', 'Visby', 'Boras', 'Karlstad', 'Halmstad'
    ], '### ##', '0##-### ## ##'],
    ['NO', 'Norway', [
      'Bergen', 'Oslo', 'Trondheim', 'Stavanger', 'Tromso', 'Drammen', 'Alesund', 'Skien', 'Bodo', 'Hamar',
      'Tonsberg', 'Larvik'
    ], '####', '## ## ## ##'],
    ['CH', 'Switzerland', [
      'Zurich', 'Geneva', 'Basel', 'Bern', 'Lugano', 'Luzern', 'Sion', 'Chur', 'Olten', 'Baden', 'Aarau', 'Vevey',
      'Glarus', 'Schwyz', 'Kloten', 'Uster'
    ], '####', '0## ### ## ##'],
    ['AU', 'Australia', [
      'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Sydney', 'Canberra', 'Hobart', 'Darwin', 'Geelong', 'Cairns',
      'Ballarat', 'Bendigo', 'Toowoomba', 'Newcastle', 'Bundaberg', 'Geraldton'
    ], '####', '(0#) #### ####'],
    ['NZ', 'New Zealand', [
      'Auckland', 'Wellington', 'Christchurch', 'Invercargill', 'Queenstown', 'Whanganui', 'Whangarei', 'Hamilton',
      'Dunedin'
    ], '####', '0# ### ####'],
    ['JP', 'Japan', [
      'Osaka', 'Kyoto', 'Sapporo', 'Yokohama', 'Tokyo', 'Nagoya', 'Kobe', 'Fukuoka', 'Sendai', 'Kawasaki', 'Nagasaki',
      'Nara', 'Nagano', 'Niigata', 'Kumamoto', 'Himeji'
    ], '###-####', '0#-####-####'],
    ['BR', 'Brazil', [
      'Curitiba', 'Recife', 'Porto Alegre', 'Sao Paulo', 'Brasilia', 'Salvador', 'Fortaleza', 'Joao Pessoa',
      'Uberlandia', 'Manaus', 'Joinville', 'Teresina'
    ], '#####-###', '(##) #####-####'],
    ['MX', 'Mexico', [
      'Monterrey', 'Puebla', 'Guadalajara', 'Tijuana', 'Cancun', 'Queretaro', 'Chihuahua', 'Hermosillo', 'Veracruz',
      'Acapulco', 'Cuernavaca'
    ], '#####', '## #### ####'],
    ['PL', 'Poland', [
      'Krakow', 'Gdansk', 'Wroclaw', 'Warsaw', 'Poznan', 'Lublin', 'Gdynia', 'Gliwice', 'Rzeszow', 'Olsztyn',
      'Tarnow', 'Kielce'
    ], '##-###', '### ### ###'],
    ['PT', 'Portugal', [
      'Porto', 'Lisbon', 'Braga', 'Faro', 'Evora', 'Beja', 'Viseu', 'Aveiro', 'Leiria', 'Guarda', 'Silves', 'Tavira'
    ], '####-###', '### ### ###'],
    ['DK', 'Denmark', [
      'Aarhus', 'Odense', 'Copenhagen', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Viborg', 'Roskilde',
      'Hillerod', 'Silkeborg'
    ], '####', '## ## ## ##'],
  ].map(([code, name, cities, zip, phone]) => ({ code, name, cities, zip, phone }));

  const CURRENCIES = [
    { code: 'USD', name: 'US dollar', sym: '$' },
    { code: 'EUR', name: 'Euro', sym: '€' },
    { code: 'GBP', name: 'Pound sterling', sym: '£' },
    { code: 'CAD', name: 'Canadian dollar', sym: 'CA$' },
    { code: 'AUD', name: 'Australian dollar', sym: 'A$' },
    { code: 'CHF', name: 'Swiss franc', sym: 'CHF ' },
  ];

  const EVENTS = ['Open Data Summit', 'Northern Design Week', 'Urban Gardening Fair', 'Coastal Tech Meetup',
    'Spring Book Festival', 'Robotics Expo', 'Future of Work Forum', 'Harbor Jazz Weekend', 'Climate Data Workshop',
    'Indie Games Showcase', 'Regional Health Congress', 'Maker Faire North', 'Small Business Expo', 'Film Archive Days',
    'Rail Heritage Weekend', 'Open Source Camp', 'Ceramics Market', 'Accessibility Summit', 'Coffee Roasters Fair',
    'Women in Engineering Day', 'Night of Science', 'Translation Forum', 'Bird Count Weekend', 'Chess Open',
    'Kite Building Gathering', 'Textile Arts Symposium', 'River Restoration Forum', 'Autumn Bread Fair',
    'Amateur Astronomy Camp', 'City Cycling Expo', 'Folk Dance Weekend', 'Wildflower Sketching Day',
    'Acoustic Music Retreat', 'Puzzle Solving Open', 'Museum Learning Exchange', 'Local History Assembly',
    'Canal Boat Rally', 'Glass Art Showcase', 'Orchard Harvest Days', 'Ocean Mapping Seminar', 'Costume Design Salon',
    'Public Speaking Camp', 'Paper Craft Market', 'Winter Swimming Meet', 'Sound Recording Clinic',
    'Bamboo Architecture Week', 'Desert Geology Field Day', 'Boardwalk Poetry Evening', 'Food Heritage Roundtable',
    'Vintage Radio Exchange', 'Wetland Ecology Seminar', 'Clock Repair Workshop', 'Urban Transit Assembly',
    'Heritage Seed Swap', 'Shadow Puppetry Showcase', 'Trail Running Challenge', 'Freshwater Angling Meet',
    'Cheese Making Retreat', 'Model Aircraft Rally', 'Parkour Practice Jam', 'Cave Exploration Weekend',
    'Insect Habitat Fair', 'Freight Logistics Forum', 'Aquarium Design Showcase', 'Snow Sculpture Festival',
    'Dog Agility Open', 'Balloon Art Gathering', 'Perfume Blending Salon', 'Retro Computing Assembly',
    'Candle Makers Market', 'Tea Tasting Evening', 'Farm Machinery Expo', 'Stage Lighting Lab',
    'Beekeeping Skills Day', 'Circus Skills Weekend', 'Calligraphy Studio Day', 'Cider Pressing Gathering',
    'Creative Coding Jam', 'Falconry Heritage Day', 'Indoor Rowing Challenge', 'Kelp Farming Symposium',
    'Metal Casting Workshop', 'Mountain Weather Seminar', 'Lawn Bowls Open', 'Handbell Music Festival',
    'Dollhouse Builders Fair', 'Knot Tying Skills Clinic', 'Sign Painting Salon', 'Ice Sailing Meet',
    'Basket Weaving Market', 'Pasta Crafting Lab', 'Mosaic Art Exhibition', 'Toy Repair Cafe', 'Goat Herding Trials',
    'Water Polo Invitational', 'Cocoa Growers Roundtable', 'Improvised Comedy Night'];
  const ORGS = ['Riverside Library Club', 'City Fitness', 'Harbor Credit Union', 'Metro Transit', 'Parkside Clinic',
    'Civic Registry', 'Northgate Tennis Club', 'Lakeside Co-op', 'Hillcrest Swim Center', 'Union Station Parking',
    'Westbrook University', 'Greenway Car Share', 'Old Town Museum Friends', 'Seaside Sailing Club',
    'Maple Street Choir', 'Eastfield Rowing Club', 'Beacon Hill Gardeners', 'Meadowbrook Book Circle',
    'Central Tool Library', 'Pioneer Cycling Society', 'Redstone Nature Center', 'Northshore Makers Guild',
    'Fairview Camera Society', 'Oakridge History Circle', 'Silverline Food Pantry', 'Lighthouse Hiking Group',
    'Juniper Valley Birders', 'Milltown Reuse Exchange', 'Canyon View Planetarium', 'Pine Harbor Kayak Club',
    'Bayside Film Society', 'Highland Trail Stewards', 'Foxglove Garden Society', 'Frostvale Ice Rink',
    'Copperfield Water Co-op', 'Valley Loop Shuttle', 'Orchard Lane Beekeepers', 'Tidemark Paddle Club',
    'South Ferry Chess Club', 'Willowbend Running Club', 'Redfern Public Baths', 'Stonebridge Repair Cafe',
    'Brackenridge Scout Hall', 'High Meadow Dog Walkers', 'Dunlin Coast Bird Trust', 'Holloway Youth Center',
    'Fox Hollow Nature Trust', 'Cobalt Creek Anglers', 'Seabrook Lifeboat Guild', 'Tern Bay Coastal Watch',
    'Ravenwood Brass Society', 'Quarry Lane Stargazers', 'Marlowe Street Baths', 'Longbridge Folk School',
    'Cypress Bend Orienteers', 'Sparrowgate Scouts', 'Highridge Fire Brigade', 'South Quay Art Workshop',
    'Pinebridge Tool Share'];
  const SIZES = [['XS', 'extra small'], ['S', 'small'], ['M', 'medium'], ['L', 'large'], ['XL', 'extra large'], ['XXL', 'XXL']];
  const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

  // ---------------------------------------------------------------- small helpers

  const isLeap = (y) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const daysIn = (y, m) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  function randDate(rng, y0, y1) {
    const y = rng.int(y0, y1);
    const m = rng.int(1, 12);
    return { y, m, d: rng.int(1, daysIn(y, m)) };
  }
  function addDays(dt, n) {
    let { y, m, d } = dt;
    for (let i = 0; i < n; i++) {
      d++;
      if (d > daysIn(y, m)) { d = 1; m++; if (m > 12) { m = 1; y++; } }
    }
    return { y, m, d };
  }
  const DATE_FORMATS = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD.MM.YYYY'];
  function fmtForm(dt, f) {
    const Y = String(dt.y);
    const M = pad(dt.m);
    const D = pad(dt.d);
    if (f === 'YYYY-MM-DD') return `${Y}-${M}-${D}`;
    if (f === 'DD/MM/YYYY') return `${D}/${M}/${Y}`;
    if (f === 'MM/DD/YYYY') return `${M}/${D}/${Y}`;
    return `${D}.${M}.${Y}`;
  }
  // Document date styles: never an ambiguous all-numeric day/month order.
  function fmtDoc(dt, style) {
    const mon = MONTHS[dt.m - 1];
    if (style === 'long') return `${mon} ${dt.d}, ${dt.y}`;
    if (style === 'dmy') return `${dt.d} ${mon} ${dt.y}`;
    if (style === 'short') return `${pad(dt.d)} ${mon.slice(0, 3).toUpperCase()} ${dt.y}`;
    if (style === 'abbr') return `${dt.d} ${mon.slice(0, 3)} ${dt.y}`;
    return `${dt.y}-${pad(dt.m)}-${pad(dt.d)}`;
  }
  function pattern(rng, pat) {
    let out = '';
    for (const ch of pat) {
      if (ch === '#') out += rng.int(0, 9);
      else if (ch === 'A') out += 'ABCDEFGHJKLMNPRSTUVWXY'[rng.int(0, 21)];
      else out += ch;
    }
    return out;
  }
  function phoneOf(rng, country) {
    // Never print a leading '+', so "digits only" is just the printed digits.
    let p = pattern(rng, country.phone);
    if (country.code === 'US' || country.code === 'CA') p = p.replace(/^\((\d)/, (_, a) => `(${Math.max(2, +a)}`);
    return p;
  }
  const digits = (s) => s.replace(/\D/g, '');
  function money(cents, cur, style) {
    const neg = cents < 0;
    const abs = Math.abs(cents);
    const int = String(Math.floor(abs / 100));
    const dec = pad(abs % 100);
    if (style === 'eu') return `${neg ? '-' : ''}${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec} ${cur.sym.trim()}`;
    const body = `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`;
    if (style === 'plain') return (neg ? '-' : '') + body;
    if (style === 'code') return `${neg ? '-' : ''}${body} ${cur.code}`;
    return `${neg ? '-' : ''}${cur.sym}${body}`;
  }
  const amountGold = (cents) => `${Math.floor(cents / 100)}.${pad(cents % 100)}`;
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');
  const an = (w) => (/^([aeiou]|x[xls])/i.test(w) ? `an ${w}` : `a ${w}`);
  const typeable = (s) => /^[\p{L}' .-]+$/u.test(s) && !/[ßıİŉ]/.test(s);

  function personName(g) {
    for (let k = 0; k < 8; k++) {
      const p = C.personName(g.rng, { csplit: g.csplit });
      if (typeable(p.first) && typeable(p.last) && p.first !== p.last) return p;
    }
    return { first: g.rng.pick(FIRST_FB), last: g.rng.pick(LAST_FB) };
  }
  const companyOf = (g) => {
    return C.pick(g.rng, C.COMPANIES.filter((c) => !/"/.test(c) && c.length <= 34), g);
  };
  const jobOf = (g) => C.pick(g.rng, C.JOB_TITLES.filter((j) => j.length <= 32), g);
  const streetOf = (g) => `${g.rng.int(2, 980)} ${C.pick(g.rng, C.STREET_NAMES, g)}`;
  // Personal mail hosts only: a company domain would leak a company that may be a blank-gold field.
  const MAIL_HOSTS = C.EMAIL_DOMAINS.filter((x) => !/-|\.(edu|gov)$|example/.test(x)).slice(0, 20);
  function cityOf(g, country) {
    return C.pick(g.rng, C.CITIES.filter((c) => c.countryCode === country.code && typeable(c.city)), g).city;
  }
  function productsOf(g) {
    const ps = C.PRODUCTS.filter((p) => p.name.length <= 34 && p.priceMax <= 600 && !/"/.test(p.name));
    return ps.map((p) => ({ desc: p.name, lo: Math.max(1, p.priceMin), hi: Math.max(p.priceMin + 1, p.priceMax),
      qmax: p.priceMax < 15 ? 6 : p.priceMax < 60 ? 4 : 2, split: p }));
  }

  function person(g) {
    const country = g.rng.pick(COUNTRIES);
    const sex = g.rng.pick(['F', 'M']);
    const nm = personName(g);
    const { first, last } = nm;
    const host = g.rng.pick(MAIL_HOSTS);
    const h = (s) => C.ascii(s).toLowerCase().replace(/[^a-z]/g, '');
    const emailUser = g.rng.pick([`${h(first)}.${h(last)}`, `${h(first)[0]}${h(last)}`, `${h(first)}${g.rng.int(10, 99)}`, `${h(first)}_${h(last)}`]);
    let middle = personName(g).first;
    if (middle === first) middle = g.rng.pick(FIRST_FB.filter((n) => n !== first));
    return {
      first, last, sex, country, company: companyOf(g), middle, job: jobOf(g),
      email: `${emailUser}@${host}`,
      phone: phoneOf(g.rng, country),
      city: cityOf(g, country),
      street: streetOf(g),
      zip: pattern(g.rng, country.zip),
    };
  }

  // A fact is one candidate form field: { kind, labels[], gold, src, match, placeholder?, options?, blankOnly?,
  // computed?, needs?, wrong? }. Blank-only facts are never shown in the document (gold '').
  function textFact(labels, value, src, extra = {}) {
    return { kind: 'text', labels, gold: value, src: src === undefined ? value : src, match: 'text', ...extra };
  }
  function dateFact(rng, labels, dt, docStyle) {
    const fmt = rng.pick(DATE_FORMATS);
    const other = rng.pick(DATE_FORMATS.filter((f) => f !== fmt));
    return { kind: 'date', labels, gold: fmtForm(dt, fmt), src: fmtDoc(dt, docStyle), match: 'exact', placeholder: fmt, dt,
      wrong: [fmtDoc(dt, docStyle), fmtForm(dt, other)] };
  }
  function blankFact(labels, kind = 'text', extra = {}) {
    return { kind, labels, gold: '', src: null, match: kind === 'date' ? 'exact' : 'text', blankOnly: true, ...extra };
  }
  function countryOptions(rng, country, style) {
    const others = rng.sample(COUNTRIES.filter((c) => c !== country), rng.int(5, 7));
    const label = (c) => (style === 'code' ? c.code : `${c.name} (${c.code})`);
    const opts = [country, ...others].map(label).sort();
    return { options: opts, gold: label(country) };
  }


  Object.assign(env.taskOf('fill-form').lib, { FIRST_FB, LAST_FB, COUNTRIES, CURRENCIES, EVENTS, ORGS, SIZES, NUM_WORDS, isLeap, daysIn, randDate, addDays, DATE_FORMATS, fmtForm, fmtDoc, pattern, phoneOf, digits, money, amountGold, slug, an, typeable, personName, companyOf, jobOf, streetOf, MAIL_HOSTS, cityOf, productsOf, person, textFact, dateFact, blankFact, countryOptions });
})();
