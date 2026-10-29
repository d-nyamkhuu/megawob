/* choose-option/data.js: content banks and field aliases. */
(function () {
  'use strict';
  const lib = env.taskOf('choose-option').lib;
  const { uniq, C, alpha } = lib;

  const COUNTRIES = uniq(C.COUNTRIES.map((c) => c.name)).sort(alpha);

  const CITY_ROWS = C.CITIES;

  const CITIES = uniq(CITY_ROWS.map((c) => c.city)).sort(alpha);

  const NAMES = uniq(C.FIRST_NAMES).filter((n) => /^[A-Za-z]+$/.test(n)).sort(alpha);

  const PRODUCTS = uniq(C.PRODUCTS.map((p) => p.name));

  const LANGUAGES = ['Afrikaans', 'Albanian', 'Arabic', 'Armenian', 'Basque', 'Bengali', 'Bulgarian',
    'Catalan', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Filipino',
    'Finnish', 'French', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Hebrew', 'Hindi',
    'Hungarian', 'Icelandic', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Kannada', 'Korean',
    'Latvian', 'Lithuanian', 'Malay', 'Malayalam', 'Maltese', 'Marathi', 'Mongolian', 'Nepali',
    'Norwegian', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Serbian',
    'Slovak', 'Slovenian', 'Spanish', 'Swahili', 'Swedish', 'Tamil', 'Telugu', 'Thai', 'Turkish',
    'Ukrainian', 'Urdu', 'Vietnamese', 'Welsh', 'Abkhazian', 'Afar', 'Akan', 'Amharic', 'Aragonese', 'Assamese',
    'Aymara', 'Bambara', 'Bashkir', 'Belarusian', 'Bislama', 'Bosnian', 'Breton', 'Burmese', 'Cebuano', 'Chamorro',
    'Chechen', 'Cherokee', 'Chichewa', 'Chinese', 'Chuvash', 'Cornish', 'Corsican', 'Dhivehi', 'Dzongkha', 'Ewe',
    'Faroese', 'Fijian', 'Guarani', 'Hausa', 'Hawaiian', 'Igbo', 'Inuktitut', 'Javanese', 'Kashmiri', 'Kazakh',
    'Khmer', 'Kurdish', 'Kyrgyz', 'Lao', 'Lingala', 'Macedonian', 'Malagasy', 'Maori', 'Pashto', 'Quechua', 'Romansh',
    'Samoan', 'Shona', 'Sindhi', 'Sinhala', 'Somali', 'Tajik', 'Tigrinya', 'Uzbek', 'Zulu', 'Adyghe', 'Ainu', 'Aleut',
    'Asturian', 'Balinese', 'Baluchi', 'Bemba', 'Bhojpuri', 'Buginese', 'Cheyenne', 'Choctaw', 'Chuukese', 'Dinka',
    'Erzya', 'Fon', 'Friulian', 'Fulah', 'Ganda', 'Gilbertese', 'Herero', 'Hiligaynon', 'Hmong', 'Iban', 'Kabyle',
    'Khasi', 'Kikuyu', 'Kongo', 'Konkani', 'Maithili', 'Manx', 'Mapudungun', 'Mohawk', 'Navajo', 'Occitan', 'Oromo',
    'Ossetian', 'Rapanui', 'Sango', 'Santali', 'Sardinian', 'Scots', 'Sundanese', 'Tahitian', 'Tatar', 'Tibetan',
    'Tswana', 'Turkmen', 'Uyghur', 'Venda', 'Wolof', 'Xhosa', 'Yiddish', 'Yoruba', 'Zhuang', 'Arapaho', 'Avaric',
    'Awadhi', 'Cree', 'Dakota', 'Dogri', 'Gayo', 'Hupa', 'Ingush', 'Kabardian', 'Kalmyk', 'Karelian', 'Komi', 'Kpelle',
    'Lamba', 'Lezghian', 'Luo', 'Madurese', 'Moksha', 'Neapolitan', 'Niuean', 'Nogai', 'Palauan', 'Pohnpeian', 'Tetum',
    'Tongan', 'Tuvinian', 'Udmurt'];

  const COLORS = ['Beige', 'Black', 'Blue', 'Blush', 'Bronze', 'Brown', 'Burgundy', 'Charcoal',
    'Cherry', 'Coral', 'Cream', 'Crimson', 'Cyan', 'Gold', 'Gray', 'Green', 'Indigo', 'Ivory',
    'Lavender', 'Lemon', 'Lilac', 'Lime', 'Magenta', 'Maroon', 'Mint', 'Mustard', 'Navy', 'Olive',
    'Orange', 'Orchid', 'Peach', 'Pink', 'Plum', 'Purple', 'Red', 'Rose', 'Ruby', 'Salmon', 'Sand',
    'Silver', 'Sky Blue', 'Slate', 'Tan', 'Teal', 'Turquoise', 'Violet', 'White', 'Yellow', 'Apricot', 'Auburn',
    'Celadon', 'Copper', 'Ecru', 'Emerald', 'Graphite', 'Hazel', 'Heather', 'Honey', 'Jade', 'Khaki', 'Mahogany',
    'Mauve', 'Ochre', 'Onyx', 'Pewter', 'Rust', 'Saffron', 'Sepia', 'Taupe', 'Umber', 'Amethyst', 'Beryl', 'Cobalt',
    'Denim', 'Flax', 'Glacier', 'Juniper', 'Lagoon', 'Marigold', 'Moss', 'Poppy', 'Smoke', 'Thistle', 'Vanilla',
    'Viridian', 'Almond', 'Amber', 'Ash', 'Azure', 'Bamboo', 'Bayberry', 'Bisque', 'Bluebell', 'Bole', 'Brass',
    'Brick', 'Carmine', 'Cerulean', 'Cinnamon', 'Citrine', 'Clover', 'Crocus', 'Eggplant', 'Fern', 'Ginger', 'Grape',
    'Ink', 'Jasmine', 'Lapis', 'Madder', 'Mink', 'Mulberry', 'Oyster', 'Papaya', 'Pine', 'Pumpkin', 'Seafoam',
    'Shamrock', 'Spruce', 'Straw', 'Wheat', 'Wine', 'Wisteria', 'Zinc', 'Bistre', 'Capri', 'Catawba', 'Cedar', 'Fawn',
    'Glaucous', 'Myrtle', 'Puce', 'Sangria', 'Tuscany', 'Ube', 'Zaffre', 'Sage'];

  const TOPPINGS = ['Anchovies', 'Artichokes', 'Bacon', 'Basil', 'Black olives', 'Broccoli', 'Chicken', 'Corn',
    'Feta', 'Garlic', 'Goat cheese', 'Green olives', 'Green peppers', 'Ham', 'Jalapenos', 'Mozzarella', 'Mushrooms',
    'Onions', 'Oregano', 'Pepperoni', 'Pineapple', 'Prosciutto', 'Red onions', 'Red peppers', 'Ricotta', 'Rocket',
    'Salami', 'Sausage', 'Spinach', 'Sun-dried tomatoes', 'Tomatoes', 'Truffle oil', 'Asiago', 'Parmesan', 'Provolone',
    'Gorgonzola', 'Blue cheese', 'Brie', 'Cheddar', 'Burrata', 'Fontina', 'Pecorino', 'Eggplant', 'Zucchini',
    'Asparagus', 'Capers', 'Green chilies', 'Cauliflower', 'Kale', 'Leeks', 'Shallots', 'Beets', 'Avocado',
    'Black pepper', 'Chili flakes', 'Fennel', 'Rosemary', 'Thyme', 'Sage', 'Meatballs', 'Ground beef', 'Steak',
    'Shrimp', 'Smoked salmon', 'Crab', 'Clams', 'Turkey', 'Chorizo', 'Pancetta', 'Soppressata', 'Capicola', 'Bresaola',
    'Lamb', 'Duck', 'Pesto', 'Hot honey', 'Romesco sauce', 'Harissa', 'Tapenade', 'Smoked gouda', 'Gruyere', 'Havarti',
    'Monterey Jack', 'Pepper jack', 'Cotija', 'Queso fresco', 'Halloumi', 'Manchego', 'Mascarpone', 'Radicchio',
    'Okra', 'Celery', 'Carrots', 'Red cabbage', 'Bok choy', 'Green beans', 'Figs', 'Pears', 'Apples', 'Dates',
    'Cranberries', 'Tuna', 'Lobster', 'Scallops', 'Calamari'];

  const AMENITIES = ['Air conditioning', 'Airport shuttle', 'Balcony', 'Bathtub', 'Breakfast included', 'Crib available',
    'Dishwasher', 'EV charger', 'Elevator', 'Fitness center', 'Free parking', 'Free Wi-Fi', 'Garden', 'Hot tub',
    'Kitchen', 'Kitchenette', 'Laundry', 'Ocean view', 'Pet friendly', 'Pool', 'Sauna', 'Self check-in', 'Spa',
    'Street parking', 'Washer', 'Wheelchair access', 'Workspace', 'Barbecue grill', 'Beach access', 'Bicycle rental',
    'Billiards table', 'Board games', 'Cable TV', 'Car rental', 'Ceiling fan', 'Coffee maker', 'Concierge service',
    'Conference room', 'Courtyard', 'Electric kettle', 'Fireplace', 'Game room', 'Hair dryer', 'Heating',
    'Ironing board', 'Library', 'Luggage storage', 'Mountain view', 'Non-smoking rooms', 'Outdoor furniture', 'Patio',
    'Private entrance', 'Room service', 'Shared lounge', 'Ski storage', 'Soundproof rooms', 'Tennis court',
    'Towels provided', 'Vending machine', 'Blackout curtains', 'High chair', 'Outdoor shower', 'In-room safe',
    'Connecting rooms', 'Airport parking', 'Bar', 'Business center', 'Valet parking', 'Garage parking', 'Picnic area',
    'Rooftop terrace', 'Sun deck', 'Fire pit', 'Golf course', 'Basketball court', 'Volleyball court',
    'Badminton court', 'Ski school', 'Kayak rental', 'Canoe rental', 'Boat rental', 'Fishing dock', 'Marina access',
    'Water park', 'Bicycle storage', 'Pet sitting', 'On-site cafe', 'Snack bar', 'Microwave', 'Refrigerator', 'Oven',
    'Stovetop', 'Toaster', 'Dishware provided', 'Cooking utensils', 'Express checkout', 'Luggage cart', 'Dry cleaning',
    'Wake-up service', 'Welcome drink', 'Free toiletries', 'Bathrobes', 'Slippers', 'Beach towels', 'Mosquito nets',
    'Water cooler', 'Ice machine', 'Filtered water', 'Desk lamp', 'Lockers', 'Security system', 'Smoke alarms',
    'Fire extinguisher', 'Baby monitor', 'Stroller rental', 'Playground', 'Yoga studio', 'Yoga classes',
    'Running track', 'Squash court', 'Pickleball court', 'Mini golf', 'Bowling alley', 'Arcade games', 'Live music',
    'Movie nights', 'Bidet', 'Walk-in shower', 'Steam room', 'Pet bowls'];

  const TOPICS = ['Business', 'Climate', 'Culture', 'Economy', 'Education', 'Energy', 'Fashion', 'Film',
    'Finance', 'Food', 'Gaming', 'Gardening', 'Health', 'History', 'Markets', 'Movies', 'Music',
    'Photography', 'Podcasts', 'Politics', 'Science', 'Space', 'Sports', 'Technology', 'Theater',
    'Travel', 'Wellness', 'Design', 'Parenting', 'Startups', 'Art', 'Books', 'Careers', 'Crafts', 'Automotive', 'Pets',
    'Wildlife', 'Outdoors', 'Hiking', 'Cycling', 'Running', 'Cooking', 'Baking', 'Law', 'Languages', 'Comics',
    'Animation', 'Television', 'Dance', 'Museums', 'Collecting', 'Esports', 'Journalism', 'Weather', 'Aviation',
    'Philosophy', 'Astronomy', 'Physics', 'Robotics', 'Geology', 'Fishing', 'Sailing', 'Camping', 'Skiing', 'Surfing',
    'Rugby', 'Cricket', 'Golf', 'Tennis', 'Swimming', 'Triathlon', 'DIY', 'Coffee', 'Tea', 'Beverages', 'Mythology',
    'Folklore', 'Opera', 'Genealogy', 'Sociology', 'Puzzles', 'Knitting', 'Sewing', 'Pottery', 'Beekeeping', 'Origami',
    'Billiards', 'Badminton', 'Volleyball', 'Baseball', 'Basketball', 'Soccer', 'Boxing', 'Gymnastics', 'Kayaking',
    'Canoeing', 'Snorkeling', 'Sculpture', 'Poetry', 'Jazz', 'Railways'];

  const SKILLS = ['Accounting', 'Agile', 'Android', 'Bookkeeping', 'Copywriting', 'CSS', 'Customer support',
    'Data analysis', 'Data entry', 'Excel', 'Figma', 'Go', 'Graphic design', 'HTML', 'iOS', 'Java', 'JavaScript',
    'Kotlin', 'Linux', 'Marketing', 'Negotiation', 'Photography', 'Project management', 'Public speaking',
    'Python', 'React', 'Recruiting', 'Rust', 'Sales', 'SEO', 'SQL', 'Swift', 'Translation', 'TypeScript',
    'UX research', 'Video editing', 'Accessibility', 'Animation', 'API design', 'Bash', 'C', 'Cloud computing',
    'Communication', 'Content strategy', 'Database design', 'Event planning', 'Facilitation', 'French',
    'Grant writing', 'Illustration', 'Interviewing', 'Machine learning', 'Mentoring', 'Operations', 'Payroll', 'Ruby',
    'Scrum', 'Social media', 'Spanish', 'Troubleshooting', 'User testing', 'Web development', 'XML',
    'Active listening', 'Audio production', 'Coaching', 'Copy editing', 'Cybersecurity', 'Data engineering',
    'Data governance', 'DevOps', 'English', 'Entrepreneurship', 'German', 'Japanese', 'Leadership', 'Logistics',
    'Market research', 'Painting', 'Procurement', 'Proofreading', 'Research', 'Risk management', 'Statistics',
    'Systems analysis', 'Training', 'Typography', 'Voice acting', 'Writing', 'Public relations', 'API testing',
    'Art direction', 'Biochemistry', 'Brand strategy', 'CAD drafting', 'Catering', 'Chemistry', 'Circuit design',
    'CNC machining', 'Data mining', 'Data modeling', 'Econometrics', 'Embedded systems', 'Food styling', 'Game design',
    'Localization', 'Motion graphics', 'Product design', 'Sign language', 'Soldering', 'Sustainability',
    'Video production', 'Virtualization', 'Landscape design', 'Lighting design', 'Urban planning'];

  const CATEGORIES = {
    country: { label: [
      'Country', 'Country of residence', 'Destination', 'Birth country', 'Citizenship', 'Export country'
    ], noun: 'country', plural: 'countries', pool: COUNTRIES,
      titles: [
        'Shipping address', 'Billing details', 'Create your account', 'Travel profile', 'Visa application',
        'Regional settings', 'Your location', 'Country information', 'Residence details', 'Trip destination',
        'Account region', 'Locale settings', 'Origin details', 'Country settings', 'Your home region',
        'Travel arrangements', 'Area preferences', 'Visitor information', 'Place details'
      ],
      notes: [
        'We use this to calculate shipping and taxes.', 'Tell us where you live.', 'Required for your booking.',
        'Countries are listed by name.', 'Country details belong in this form.', 'No street address goes here.'
      ] },
    name: { label: [
      'Assignee', 'Contact', 'Recipient', 'Reviewer', 'Manager', 'Sponsor', 'Organizer', 'Moderator', 'Author',
      'Architect', 'Recruiter', 'Delegate'
    ], noun: 'name', plural: 'names', pool: NAMES,
      titles: [
        'New task', 'Share document', 'Send invitation', 'Team directory', 'Request a review', 'Project members',
        'Review team', 'Invite team', 'Task ownership', 'Shared with', 'Team contacts', 'Document access',
        'Review panel', 'People assigned', 'Work roster'
      ],
      notes: [
        'Choose someone from your organization.', 'They will get an email notification.',
        'Only team members are listed.', 'People are identified by their names.',
        'Roles may differ between projects.', 'No email address is needed here.'
      ] },
    city: { label: [
      'City', 'Pickup city', 'Office location', 'Departure city', 'Hometown', 'Event city', 'Service city',
      'Warehouse city', 'Arrival city', 'Birth city', 'Campus city', 'Branch city', 'Return city'
    ], noun: 'city', plural: 'cities', pool: CITIES,
      titles: [
        'Delivery details', 'Find a store', 'Weather alerts', 'Office settings', 'Plan a trip', 'Local branch',
        'City guide', 'Regional offices', 'Route planning', 'Area information', 'Pickup locations',
        'City preferences', 'Regional search', 'Urban settings', 'Service areas', 'Local directory', 'Urban profile',
        'Arrival details', 'Metro guide'
      ],
      notes: [
        'Pick the nearest location.', 'You can change this later.', 'Used for local times and alerts.',
        'Cities can share a name.', 'These options refer to cities.', 'Street names are not included.'
      ] },
    language: { label: [
      'Language', 'Preferred language', 'Subtitle language', 'Spoken languages', 'Audio language', 'Reading language',
      'Menu language', 'Writing language', 'Lesson language', 'Chat language', 'Support language', 'Search language'
    ], noun: 'language', plural: 'languages', pool: LANGUAGES,
      titles: [
        'Account preferences', 'Profile settings', 'Playback settings', 'Translator profile', 'Language settings',
        'Translation options', 'Content language'
      ],
      notes: [
        'Applies to emails and the app interface.', 'You can change this at any time.', 'Saved to your profile.',
        'Language names are shown in English.', 'Fluency is not measured here.', 'This covers language choices.'
      ] },
    color: { label: [
      'Color', 'Finish', 'Accent color', 'Text color', 'Trim', 'Base coat'
    ], noun: 'color', plural: 'colors', pool: COLORS,
      titles: [
        'Customize your order', 'Product options', 'Theme settings', 'Color preferences', 'Appearance options',
        'Design settings', 'Product appearance', 'Visual style', 'Surface finish'
      ],
      notes: [
        'Colors may vary slightly on screen.', 'Preview updates after saving.', 'Free returns on all colors.',
        'Color names describe the options.', 'This section covers appearance.', 'A color code is not needed.'
      ] },
    product: { label: [
      'Product', 'Item', 'Item to return', 'Order line', 'Purchase'
    ], noun: 'product', plural: 'products', pool: PRODUCTS,
      titles: [
        'Add to order', 'Store inventory', 'Return an item', 'Gift registry', 'Create a listing', 'Browse catalog',
        'Order selection', 'Available items', 'Product catalog', 'Shopping list', 'Your saved items',
        'Inventory lookup', 'Replacement item', 'Product details', 'Catalog settings', 'Add a product',
        'Item preferences', 'Order contents'
      ],
      notes: [
        'All items ship within two days.', 'Prices include tax.', 'Select from your recent orders.',
        'Products serve different needs.', 'Product details differ.', 'Item names are shown below.'
      ] },
    size: { label: ['Size'], noun: 'size', plural: 'sizes', ordered: true, pool: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
      titles: ['Product options', 'Customize your order'], notes: ['See the size guide for measurements.', 'Free exchanges within 30 days.'] },
    shipping: { label: ['Shipping method', 'Delivery option'], noun: 'shipping method', plural: 'shipping methods', ordered: true,
      pool: ['Economy (8-12 days)', 'Standard (5-7 days)', 'Express (2-3 days)', 'Overnight', 'Same-day courier', 'Store pickup', 'Parcel locker', 'Freight'],
      titles: ['Checkout', 'Delivery details'], notes: ['Delivery times are estimates.', 'Choose how your order is delivered.'] },
    payment: { label: ['Payment method', 'Pay with'], noun: 'payment method', plural: 'payment methods', ordered: true,
      pool: ['Credit card', 'Debit card', 'Online wallet', 'Bank transfer', 'Gift card', 'Cash on delivery', 'Invoice', 'Store credit', 'Pay in 3 installments'],
      titles: ['Checkout', 'Payment'], notes: ['Your details are encrypted.', 'You will not be charged yet.'] },
    plan: { label: ['Plan', 'Subscription'], noun: 'plan', plural: 'plans', ordered: true,
      pool: ['Free', 'Starter', 'Basic', 'Standard', 'Plus', 'Professional', 'Premium', 'Business', 'Enterprise'],
      titles: [
        'Choose a plan', 'Billing', 'Upgrade your account', 'Membership options', 'Subscription details',
        'Account level', 'Service tiers', 'Plan comparison', 'Access options', 'Service package'
      ], notes: ['Cancel at any time.', 'Prices are per user per month.'] },
    frequency: { label: [
      'Email frequency', 'Report frequency', 'Backup schedule', 'Reminder cadence', 'Sync recurrence',
      'Export interval', 'Refresh interval', 'Cleanup cadence', 'Archive cadence'
    ], noun: 'frequency', plural: 'frequencies', ordered: true,
      pool: ['Hourly', 'Daily', 'Twice a week', 'Weekly', 'Every two weeks', 'Monthly', 'Quarterly', 'Yearly', 'Never'],
      titles: [
        'Notification settings', 'Preferences', 'Reports', 'Update cadence', 'Schedule preferences',
        'Routine settings'
      ], notes: ['You can unsubscribe at any time.', 'Applies to all projects.'] },
    topping: { label: ['Toppings', 'Extra toppings'], noun: 'topping', plural: 'toppings', pool: TOPPINGS,
      titles: ['Build your pizza', 'Order details'], notes: ['Each extra topping is $1.50.', 'All pizzas come with tomato sauce.'] },
    amenity: { label: ['Amenities', 'Must-have amenities'], noun: 'amenity', plural: 'amenities', pool: AMENITIES,
      titles: [
        'Filter stays', 'Search hotels', 'Listing details', 'Lodging options', 'Stay search', 'Guest comforts',
        'Stay features', 'Guest amenities', 'Room details', 'Property perks', 'Stay essentials', 'Stay basics'
      ], notes: ['Show only places that offer all of these.', 'Filters apply to the map too.'] },
    topic: { label: [
      'Topics', 'Newsletter topics', 'Interests', 'Subject areas', 'Feed themes', 'Coverage'
    ], noun: 'topic', plural: 'topics', pool: TOPICS,
      titles: ['Newsletter preferences', 'Personalize your feed'], notes: ['We send one digest per topic each week.', 'Pick what you want to hear about.'] },
    skill: { label: [
      'Skills', 'Tags', 'Expertise', 'Strengths', 'Craft', 'Focus'
    ], noun: 'skill', plural: 'skills', pool: SKILLS,
      titles: [
        'Edit your profile', 'Job posting', 'Freelancer profile', 'Skills directory', 'Capability profile',
        'Areas of practice', 'Work capabilities', 'Talent profile', 'Skill overview', 'Role requirements',
        'Expertise summary'
      ], notes: ['Add up to ten skills.', 'Shown on your public profile.'] },
  };

  const SCENARIO_CATS = {
    dropdown: ['country', 'color', 'language', 'city', 'product', 'name', 'frequency', 'plan', 'shipping'],
    radio: ['size', 'shipping', 'payment', 'plan', 'frequency', 'color', 'language'],
    checkbox: ['topping', 'amenity', 'topic', 'color', 'language', 'skill'],
    autocomplete: ['country', 'name', 'city', 'language'],
    listbox: ['country', 'color', 'language', 'city', 'product', 'name'],
    chips: ['language', 'topic', 'skill', 'city', 'person'],
    tags: ['language', 'topic', 'skill', 'city', 'person'],
  };

  const ALIASES = {
    Country: ['country'], 'Country of residence': ['country', 'home country'],
    Destination: ['destination country'], Assignee: ['owner', 'task owner'],
    Contact: ['contact person', 'contact name'], Recipient: ['addressee'], Reviewer: ['review owner'],
    City: ['city', 'town'], 'Pickup city': ['pick-up city', 'pickup location'], 'Office location': ['office', 'office city'],
    'Departure city': ['origin', 'from city'], Language: ['language setting'], 'Preferred language': ['language', 'language preference'],
    'Subtitle language': ['subtitles', 'captions language'], 'Spoken languages': ['languages', 'languages spoken'],
    Color: ['colour', 'color option'], Finish: ['color', 'finish option'], 'Accent color': ['accent colour', 'highlight color'],
    Product: ['item'], Item: ['product'], 'Item to return': ['return item', 'product to return'],
    Size: ['size option'], 'Shipping method': ['shipping', 'delivery method', 'shipping speed'], 'Delivery option': ['delivery', 'shipping option'],
    'Payment method': ['payment', 'payment option'], 'Pay with': ['payment method', 'payment'], Plan: ['subscription plan', 'tier'],
    Subscription: ['plan', 'subscription tier'], 'Email frequency': ['email cadence', 'how often you get emails'],
    'Report frequency': ['report cadence', 'report schedule'], 'Backup schedule': ['backup frequency', 'backups'],
    Toppings: ['topping list', 'pizza toppings'], 'Extra toppings': ['toppings', 'extras'], Amenities: ['amenity filters', 'facilities'],
    'Must-have amenities': ['amenities', 'amenity filters'], Topics: ['topic list', 'subjects'], 'Newsletter topics': ['topics', 'newsletter subjects'],
    Interests: ['topics', 'interest list'], Skills: ['skill tags', 'skill list'], Tags: ['tag list', 'labels'], Expertise: ['skills', 'areas of expertise'],
    Attendees: ['guest list', 'invitees'], Participants: ['attendees', 'people'], Members: ['member list', 'people'],
  };

  function aliasesFor(label) {
    const out = (ALIASES[label] || []).slice();
    const bank = C.FIELD_LABELS;
    if (Array.isArray(bank)) {
      const hit = bank.find((f) => f && f.label === label);
      if (hit && Array.isArray(hit.aliases)) out.push(...hit.aliases);
    }
    return uniq(out);
  }

  const SETTINGS = C.rows(`
    onoff | email notifications | Sends you an email for new activity.
    onoff | push notifications | Alerts on your phone and desktop.
    onoff | sound effects | Plays a sound for messages and alerts.
    onoff | video autoplay | Videos start playing as you scroll.
    onoff | location services | Lets the app use your location.
    onoff | read receipts | Others see when you have read their messages.
    onoff | spell check | Underlines misspelled words while you type.
    onoff | auto-save | Saves drafts every few seconds.
    onoff | dark mode | Uses a dark color scheme.
    onoff | weekly digest emails | A summary of the week, every Monday.
    onoff | marketing emails | Offers and product news.
    onoff | automatic updates | Installs updates in the background.
    onoff | desktop alerts | Banners in the corner of your screen.
    onoff | keyboard shortcuts | Single-key shortcuts in the editor.
    onoff | interface animations | Motion when panels open and close.
    onoff | usage analytics | Shares anonymous usage data with us.
    onoff | sync over mobile data | Syncs files when not on Wi-Fi.
    onoff | background refresh | Refreshes content while the app is closed.
    onoff | two-step sign-in | Asks for a code when you sign in.
    onoff | smart replies | Suggests short answers to messages.
    visible | online status | Others can see when you are active.
    visible | profile photo | Shown next to your name.
    visible | last seen time | When you were last online.
    visible | email address on your profile | Visible to everyone in your workspace.
    visible | birthday | Shown on your profile card.
    visible | phone number | Visible to your contacts.
    visible | completed tasks | Tasks you have finished stay in the list.
    visible | hidden files | Files whose names start with a dot.
    visible | line numbers | Numbers in the editor margin.
    visible | archived chats | Chats you archived appear in the list.
    allow | third-party cookies | Cookies set by other sites.
    allow | pop-ups | Windows that open on their own.
    allow | messages from strangers | People you have not connected with.
    allow | friend requests | Anyone can send you a request.
    allow | tagging in photos | Others can tag you in their photos.
    allow | calendar invites from anyone | Invites from outside your organization.
    allow | camera access | Sites and apps may use your camera.
    allow | direct messages from guests | Guest accounts can message you.
    onoff | word wrap | Moves long lines onto the next line in the editor.
    onoff | automatic indentation | Aligns new lines with the code above them.
    onoff | bracket matching | Highlights the matching bracket as you type.
    onoff | link previews | Builds a preview card for links in messages.
    onoff | live captions | Displays speech as text during calls.
    onoff | search suggestions | Suggests search terms as you type.
    onoff | duplicate file detection | Checks uploads for files you already have.
    onoff | download compression | Packs downloaded files into a smaller archive.
    onoff | photo backups | Copies new photos to your backup folder.
    onoff | offline caching | Keeps recently opened pages available offline.
    onoff | inactivity lock | Locks your workspace after a period of inactivity.
    onoff | scheduled exports | Exports your records at the times you choose.
    onoff | attachment scanning | Checks incoming attachments for unsafe content.
    onoff | time tracking | Records how long you spend on each task.
    onoff | automatic time zones | Adjusts event times to your current time zone.
    onoff | focus timer | Runs timed work sessions with short breaks.
    onoff | touch feedback | Gives a short vibration when you use touch controls.
    visible | file extensions | Shows the file type at the end of each filename.
    visible | word count | A running total of words below the editor.
    visible | storage meter | Shows how much of your storage is in use.
    visible | message timestamps | The time each message was sent.
    visible | folder sizes | Total space used by the files in each folder.
    visible | grid guides | Alignment lines across the design canvas.
    visible | document outline | A list of headings beside the document.
    visible | unread badges | Counts of unread items beside each folder.
    visible | page breaks | Marks where one printed page ends and the next begins.
    visible | weather widget | Current conditions on your home screen.
    allow | clipboard access | Sites may read text copied to your clipboard.
    allow | screen sharing | Apps may broadcast your screen during calls.
    allow | file downloads | Sites may save files to your device.
    allow | document printing | People with access may print your documents.
    allow | comments from viewers | People with view access may leave comments.
    allow | guest file uploads | Guest accounts may add files to shared folders.
    onoff | image optimization | Reduces image file sizes during upload.
    onoff | battery saver | Limits resource use to extend battery life.
    onoff | mouse smoothing | Smooths pointer movement while you draw.
    onoff | edge scrolling | Scrolls the canvas when you drag near its edges.
    onoff | canvas snapping | Aligns objects to nearby edges as you move them.
    onoff | automatic capitalization | Starts new sentences with a capital letter.
    onoff | call forwarding | Routes incoming calls to another number you choose.
    onoff | audio normalization | Balances volume across tracks during playback.
    onoff | split view | Keeps two documents open side by side.
    onoff | cursor blinking | Makes the text cursor blink while you type.
    visible | image thumbnails | Small previews of pictures in the file list.
    visible | task priorities | Priority levels beside tasks in the list.
    visible | rulers | Measurement scales along the edges of the canvas.
    visible | attachment sizes | The file size beside each message attachment.
    visible | meeting agenda | Planned discussion topics beside the call window.
    visible | chart legends | Keys explaining the colors and symbols in charts.
    allow | file renaming | Collaborators may change the names of shared files.
    onoff | password autofill | Fills sign-in forms with your saved passwords.
    onoff | broken link checking | Checks documents for links that no longer open.
    onoff | palm rejection | Ignores touches from your palm while you use a pen.
    onoff | text narration | Reads the text of the current page aloud.
    onoff | touchpad gestures | Uses finger movements on the touchpad to navigate.
    onoff | stereo audio | Plays separate left and right audio channels.
    visible | task due dates | Deadlines beside each task in the list.
    visible | file owners | The name of the person who owns each file.
    visible | slide notes | Speaker notes beneath the current slide in the editor.
    visible | map scale | A distance reference in the corner of the map.
    visible | playback queue | A list of tracks waiting to play next.
    visible | color values | Numeric color codes beside swatches in the palette.
    allow | poll creation | Members may start polls in group conversations.
    allow | folder creation | Members may add folders within the shared drive.
  `).map(([kind, concept, desc]) => ({ kind, concept, desc }));

  const SETTING_TITLES = [
    'Settings', 'Privacy & notifications', 'Preferences', 'Account settings', 'App settings', 'General options',
    'User options', 'Your settings', 'Workspace setup', 'More preferences'
  ];

  const TREES = [
    ['Email notifications', [
      'Comments', 'Mentions', 'Weekly digest', 'Product updates', 'Security alerts', 'Billing receipts',
      'Event reminders', 'Team invites', 'Survey requests', 'New devices', 'Password resets', 'File shares',
      'Task notices', 'Access requests', 'Login attempts', 'Outages', 'Trial expiry', 'Quota warnings',
      'Export results', 'Import errors', 'Renewal notices', 'Policy changes', 'Invoices', 'Usage summaries',
      'Support tickets', 'Payment failures', 'Waitlist news', 'Refund notices', 'Shipping delays', 'Backup results',
      'Form responses', 'Domain expiry', 'Job openings', 'Contest wins', 'New courses', 'Stock alerts'
    ]],
    ['Push notifications', [
      'Direct messages', 'Replies to you', 'New followers', 'Likes', 'Live streams', 'Trending posts',
      'Nearby events', 'Order status', 'Price drops', 'Incoming calls', 'Friend requests', 'Game invites',
      'High scores', 'Chat reactions', 'Goal milestones', 'Upload complete', 'Low storage', 'Sync errors',
      'Timer ends', 'New episodes', 'New badge', 'Auction bids', 'Queue ready', 'Poll results', 'Seat openings',
      'Your turn', 'New chapters', 'Doorbell rings', 'Ride arrivals', 'Match starts', 'Weather alerts',
      'Ticket scans', 'Battery low', 'Motion alerts', 'App crashes'
    ]],
    ['Repository permissions', [
      'Read code', 'Write code', 'Open issues', 'Close issues', 'Merge pull requests', 'Manage webhooks', 'Edit wiki',
      'Delete branches', 'Run workflows', 'Create tags', 'Manage releases', 'Review diffs', 'Assign issues',
      'Add labels', 'Pin issues', 'Lock threads', 'Set milestones', 'Fork repo', 'View history', 'Edit topics',
      'Archive project', 'Invite members', 'Remove members', 'Set visibility', 'Manage secrets', 'Cancel runs',
      'Read audit logs', 'Edit license', 'Protect tags', 'Manage deploy keys', 'Read metrics', 'Deploy code',
      'Set quotas', 'Manage runners', 'Delete caches', 'Rename repo'
    ]],
    ['Report columns', [
      'Order date', 'Customer', 'Region', 'Sales rep', 'Quantity', 'Unit price', 'Discount', 'Tax', 'Total',
      'Order ID', 'Status', 'Currency', 'Channel', 'Item code', 'Segment', 'Ship date', 'Due date', 'Margin',
      'Profit', 'Weight', 'Volume', 'Country', 'Ship city', 'Postcode', 'Warehouse', 'Carrier', 'Tracking', 'Batch',
      'Brand', 'Category', 'Gift wrap', 'Priority', 'Unit cost', 'Pack size', 'Ship fee', 'Coupon'
    ]],
    ['Backup folders', [
      'Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos', 'Mail archive', 'Projects', 'Shared drives',
      'Recipes', 'Crafts', 'Sketches', 'Letters', 'Manuals', 'Templates', 'Contracts', 'Certificates', 'Schoolwork',
      'Research', 'Travel plans', 'Home repairs', 'Garden plans', 'Pet records', 'Genealogy', 'Journals',
      'Presentations', 'Worksheets', 'Recordings', 'Fonts', 'Textures', 'Comics', 'Maps', 'Posters', 'Tickets',
      'Poetry'
    ]],
    ['Data to export', [
      'Contacts', 'Calendars', 'Notes', 'Bookmarks', 'Passwords', 'Browsing history', 'Chat logs', 'Photos',
      'Playlists', 'Tasks', 'Drafts', 'Game saves', 'Avatars', 'Wish lists', 'Poll votes', 'Ratings', 'Badges',
      'Highlights', 'Subscriptions', 'Purchases', 'Stickers', 'Login history', 'Custom themes', 'Workouts', 'Routes',
      'Vocabulary', 'Streaks', 'Profiles', 'Alarms', 'Collections', 'Search terms', 'Automations', 'Palettes'
    ]],
    ['Cookie categories', [
      'Strictly necessary', 'Preferences', 'Statistics', 'Marketing', 'Social media', 'Personalized ads',
      'Fraud prevention', 'Session replay', 'A/B testing', 'Shopping cart', 'Load balancing', 'Video playback',
      'Chat support', 'Error reports', 'Content access', 'Ad frequency', 'Referral tags', 'Survey state',
      'Device pairing', 'Map location'
    ]],
    ['Dietary filters', [
      'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Halal', 'Kosher', 'Low sodium', 'Keto',
      'Pescatarian', 'Paleo', 'Fish-free', 'Soy-free', 'Wheat-free', 'Raw food', 'No pork', 'Low fat', 'Egg-free',
      'Sesame-free', 'Low sugar', 'Low carb', 'No beef', 'No corn', 'No celery'
    ]],
  ].map(([name, options]) => ({ name, options }));

  const TREE_TITLES = [
    'Notification settings', 'Access control', 'Export options', 'Filters', 'Preferences', 'Configure report',
    'Options', 'List settings', 'Content settings', 'Selection settings', 'Configuration'
  ];

  Object.assign(lib, { CATEGORIES, SCENARIO_CATS, aliasesFor, SETTINGS, SETTING_TITLES, TREES, TREE_TITLES, CITY_ROWS });
})();
