/* scroll-page/content.js: the page content: banks (sections, FAQ, values, code formats, pane kinds) and the builders of
 * sections, tools, FAQ items and pane rows. Attached to the task's lib. */
(function () {
  'use strict';
  const lib = env.taskOf('scroll-page').lib;
  const { quote: q } = env.util;
  const C = env.content;

  // ---------------------------------------------------------------- content banks (page sections)

  // [heading, about (how a goal may describe it), own action labels]
  const KINDS = {
    article: {
      domains: ['news', 'science', 'travel', 'finance', 'community'],
      crumbs: [
        'News', 'Features', 'Local', 'Science', 'Money', 'Travel', 'Opinion', 'World', 'Arts', 'Food', 'Books',
        'Style', 'Nation', 'Business'
      ],
      tools: [
        'Save', 'Share', 'Listen', 'Print', 'Follow', 'Gift this article', 'Comments', 'Font', 'Cite', 'Transcript',
        'Email', 'Reading list', 'Text size', 'Audio speed'
      ],
      sections: [
        ['Background', 'the background to the story', ['Read the original report', 'See the timeline']],
        ['What changed this year', 'what changed this year', ['Compare with last year', 'View the data']],
        ['Why it matters', 'why the story matters', ['Read the analysis']],
        ['What the experts say', 'what experts think', ['Listen to the interview', 'Read the full interview']],
        ['By the numbers', 'the key statistics', ['Download the dataset', 'View the chart']],
        ['Local reactions', 'how local residents reacted', ['Share your story', 'Read reader comments']],
        ['What happens next', 'the next steps', ['Set a reminder', 'Follow this story']],
        ['How to get involved', 'ways to take part', ['Sign the petition', 'Find a local group']],
        ['Questions from readers', "readers' questions", ['Ask a question', 'See all answers']],
        ['Methodology', 'how the data was collected', ['Read the methodology', 'Download the survey']],
        ['Corrections', 'corrections to the article', ['Report an error']],
        ['Related coverage', 'related articles', ['See all coverage']],
        ['About the author', 'the writer of the piece', ['More from this writer']],
        ["Editor's note", 'the note from the editors', ['Contact the newsroom']],
        ['A look back', 'the history behind it', ['Browse the archive']],
        ['The cost of it all', 'the money involved', ['See the budget breakdown']],
      ],
    },
    docs: {
      domains: ['howto', 'support', 'product'],
      crumbs: [
        'Docs', 'Guides', 'API reference', 'Developers', 'Platform', 'Quickstart', 'Reference', 'Tutorials',
        'Examples', 'SDKs', 'Components', 'Deployment', 'Concepts', 'Endpoints', 'Integrations', 'Command line',
        'Extensions'
      ],
      tools: [
        'Edit this page', 'Copy link', 'Print', 'Give feedback', 'Open in new tab', 'Download PDF', 'Copy code',
        'View source', 'Flag an issue', 'Suggest an edit', 'API explorer', 'Version history'
      ],
      sections: [
        ['Overview', 'the general overview', ['Read the quickstart']],
        ['Installation', 'installing the package', ['Download the installer', 'View release notes']],
        ['Configuration', 'the configuration options', ['See all options', 'Copy example config']],
        ['Authentication', 'how to authenticate', ['Create an API key', 'Rotate keys']],
        ['Rate limits', 'request limits', ['Request a higher limit', 'View usage']],
        ['Error codes', 'the list of error codes', ['See error reference']],
        ['Webhooks', 'webhook events', ['Add an endpoint', 'Send a test event']],
        ['Pagination', 'paging through results', ['See an example']],
        ['Troubleshooting', 'fixing common problems', ['Open a support ticket', 'Check system status']],
        ['Migrating from v1', 'upgrading from the old version', ['Read the migration guide', 'Run the upgrade tool']],
        ['Security', 'security practices', ['Report a vulnerability', 'Read the security policy']],
        ['Client libraries', 'the official SDKs', ['Install the SDK', 'Browse the source']],
        ['Changelog', 'recent changes', ['View full changelog', 'Subscribe to updates']],
        ['Getting help', 'where to get support', ['Join the community forum']],
        ['Data retention', 'how long data is kept', ['Export your data']],
        ['Limits and quotas', 'account quotas', ['Upgrade your plan']],
      ],
    },
    faq: {
      domains: ['support', 'policy'],
      crumbs: [
        'Help Center', 'Support', 'Customer service', 'Help', 'Order status', 'Billing', 'Delivery', 'Returns',
        'Account access', 'Contact options', 'Accessibility', 'Community', 'Repairs', 'Service alerts',
        'Product guides'
      ],
      tools: [
        'Print', 'Share', 'Rate this page', 'Contact us', 'Change language', 'Search help', 'View all topics',
        'Send a message', 'Check an order', 'Set text size', 'Audio options', 'Reading mode', 'Font controls',
        'Privacy options', 'Keyboard guide'
      ],
      sections: [
        ['Orders', 'placing orders', ['Track your order', 'View order history']],
        ['Shipping', 'delivery and shipping', ['See delivery options', 'Check delivery times']],
        ['Returns & refunds', 'sending items back', ['Start a return', 'Print a return label']],
        ['Payments', 'paying for orders', ['Update payment method', 'View invoices']],
        ['Your account', 'managing your account', ['Reset password', 'Edit profile']],
        ['Gift cards', 'gift cards', ['Check gift card balance', 'Buy a gift card']],
        ['Warranty & repairs', 'repairs under warranty', ['Book a repair', 'Register a product']],
        ['Privacy & data', 'your personal data', ['Download your data', 'Delete your account']],
        ['Subscriptions', 'recurring subscriptions', ['Manage subscription', 'Cancel subscription']],
        ['Store pickup', 'collecting orders in a store', ['Find a store', 'Change pickup store']],
        ['Business accounts', 'accounts for companies', ['Apply for a business account']],
        ['Getting in touch', 'contacting customer service', ['Start a chat', 'Request a callback']],
        ['Accessibility', 'accessibility support', ['Read our accessibility statement']],
        ['Price promise', 'price matching', ['Request a price match']],
      ],
    },
    product: {
      domains: ['product', 'support'],
      crumbs: [
        'Shop', 'Home & living', 'Electronics', 'Outdoor', 'Kitchen', 'Audio', 'Appliances', 'Furniture', 'Lighting',
        'Garden', 'Bedding', 'Storage', 'Sports', 'Crafts', 'Personal care', 'Toys', 'Office', 'Travel',
        'Pet supplies', 'Computers', 'Books', 'Clothing', 'Footwear', 'Baby & kids'
      ],
      tools: [
        'Add to wishlist', 'Share', 'Compare', 'Ask a question', 'Print', 'View dimensions', 'Watch video',
        'Find a retailer'
      ],
      sections: [
        ['Overview', 'the product overview', ['Watch the video']],
        ['Key features', 'the main features', ['Compare models']],
        ['Specifications', 'the technical details', ['Download spec sheet', 'View dimensions']],
        ["What's in the box", 'the box contents', ['See accessories']],
        ['Delivery', 'delivery options', ['Check delivery to my area', 'See delivery costs']],
        ['Returns', 'the returns policy', ['Read the returns policy', 'Start a return']],
        ['Warranty', 'warranty coverage', ['Extend warranty', 'Register your product']],
        ['Customer reviews', 'what customers say', ['Write a review', 'See all reviews']],
        ['Questions & answers', 'questions from shoppers', ['See all questions']],
        ['Care instructions', 'looking after the product', ['Download care guide']],
        ['Accessories', 'matching accessories', ['Shop accessories', 'Add bundle to cart']],
        ['Sustainability', 'the environmental impact', ['Read our impact report', 'Recycle your old device']],
        ['Financing', 'paying in instalments', ['Check your eligibility']],
        ['Setup service', 'having it installed', ['Book an installation']],
      ],
    },
    terms: {
      domains: ['policy', 'finance'],
      crumbs: [
        'Legal', 'Policies', 'Terms', 'Trust center', 'Privacy', 'Licenses', 'Data use', 'Notices', 'Conduct',
        'Rights', 'Disputes', 'Scope', 'Waivers', 'Eligibility', 'Enforcement'
      ],
      tools: [
        'Download PDF', 'Print', 'Email me a copy', 'Previous versions', 'Translate', 'View as HTML', 'Copy text',
        'Compare revisions', 'View attachments', 'Report a concern', 'Document outline', 'Citation details',
        'Legal notice', 'Reading options', 'Open in reader'
      ],
      sections: [
        ['Acceptance of these terms', 'accepting the terms', ['Download a PDF copy']],
        ['Your account', 'account responsibilities', ['Manage your account']],
        ['Fees and billing', 'fees and payments', ['View current prices', 'Update billing details']],
        ['Cancellation and termination', 'ending the contract', ['Cancel your plan', 'Request account closure']],
        ['Content you upload', 'content users post', ['Read the content guidelines']],
        ['Acceptable use', 'what users may not do', ['Report abuse', 'Read the acceptable use policy']],
        ['Intellectual property', 'copyright and trademarks', ['Submit a copyright notice']],
        ['Privacy', 'how personal data is handled', ['Read the privacy notice', 'Manage cookie settings']],
        ['Disclaimers', 'warranty disclaimers', ['Read the full disclaimer']],
        ['Limitation of liability', 'limits on liability', ['See liability caps']],
        ['Disputes and governing law', 'resolving disputes', ['Start a dispute', 'Contact our legal team']],
        ['Changes to these terms', 'future changes to the terms', ['Subscribe to updates']],
        ['Contact', 'contacting the company', ['Send us a letter']],
        ['Third-party services', 'services run by other companies', ['See the list of partners']],
      ],
    },
  };
  const KIND_NAMES = { article: 'article', docs: 'page', faq: 'help page', product: 'product page', terms: 'terms' };
  const TITLES = {
    docs: ['Getting started with the Reports API', 'Sync service: developer guide', 'Billing API reference',
      'Using webhooks with Ledgerly', 'Command-line tool guide', 'Search API: concepts and setup',
      'Deploying the edge worker', 'Single sign-on setup', 'Import and export guide', 'Notifications API',
      'API key configuration guide', 'Event delivery and retries', 'Working with record filters',
      'Workspace access setup', 'Bulk data export reference', 'Request signing overview', 'Regional endpoint guide',
      'Managing service credentials', 'Streaming updates quickstart', 'Schema validation reference'],
    faq: ['Help Center: frequently asked questions', 'Customer support', 'Orders, delivery and returns',
      'Help with your account', 'Shopping with us: FAQ', 'Support and service', 'Account and order help',
      'Customer care questions', 'Help with a purchase', 'Everyday service guide', 'Shopping questions and help'],
    terms: ['Terms of Service', 'Terms and Conditions of Use', 'Customer Agreement', 'Terms of Sale',
      'Subscription Terms', 'Platform Terms of Use', 'Service Agreement', 'Online Service Terms', 'Customer Use Terms',
      'Membership Terms', 'Platform Use Agreement', 'Sales Terms and Conditions', 'Hosted Services Agreement',
      'Account Holder Agreement', 'Subscriber Conditions', 'Digital Platform Contract', 'Service Access Conditions',
      'Digital Access Agreement'],
  };
  const GENERIC = [
    'Learn more', 'Read more', 'Contact us', 'See details', 'Find out more', 'Get help', 'At a glance',
    'Browse topics', 'General info', 'Page overview', 'Quick guide', 'Our approach', 'Key points', 'More context',
    'General notes', 'Useful info', 'Related info'
  ];

  // [question, about, action label]
  const FAQ = [
    ['How do I reset my password?', 'resetting a password', 'Reset password'],
    ['Can I change my delivery address after ordering?', 'changing the delivery address', 'Edit delivery address'],
    ['How long does delivery take?', 'delivery times', 'See delivery options'],
    ['Where is my order?', 'finding a missing order', 'Track your order'],
    ['How do I return an item?', 'returning an item', 'Start a return'],
    ['When will I get my refund?', 'when refunds arrive', 'Check refund status'],
    ['Can I cancel my order?', 'cancelling an order', 'Cancel order'],
    ['Which payment methods do you accept?', 'the accepted payment methods', 'See payment options'],
    ['Why was my card declined?', 'declined cards', 'Update payment method'],
    ['How do I use a gift card?', 'redeeming a gift card', 'Check gift card balance'],
    ['Do you ship internationally?', 'shipping abroad', 'See shipping countries'],
    ['How do I change my email address?', 'changing the account email', 'Edit profile'],
    ['How do I delete my account?', 'deleting an account', 'Delete account'],
    ['Can I download my invoices?', 'getting invoices', 'View invoices'],
    ['How do I contact customer service?', 'reaching customer service', 'Start a chat'],
    ['Is my personal data safe?', 'data protection', 'Read the privacy notice'],
    ['How do I unsubscribe from emails?', 'stopping marketing emails', 'Manage email preferences'],
    ['What does the warranty cover?', 'what the warranty covers', 'Book a repair'],
    ['Can I collect my order in a store?', 'picking up in a store', 'Find a store'],
    ['How do I apply a discount code?', 'using a discount code', 'View current offers'],
    ['Do you offer student discounts?', 'student discounts', 'Verify student status'],
    ['How do I pause my subscription?', 'pausing a subscription', 'Manage subscription'],
    ['How do I cancel my subscription?', 'cancelling a subscription', 'Cancel subscription'],
    ['Can I change my delivery slot?', 'rescheduling a delivery', 'Change delivery slot'],
    ['What if my item arrives damaged?', 'damaged deliveries', 'Report a problem'],
    ['How do I turn on two-step sign-in?', 'two-step sign-in', 'Set up two-step sign-in'],
    ['Can I share my account with family?', 'family sharing', 'Invite family members'],
    ['Where can I find my order number?', 'locating an order number', 'View order history'],
    ['How do I update my billing address?', 'the billing address', 'Update billing details'],
    ['Do you price match?', 'price matching', 'Request a price match'],
    ['How do I leave a review?', 'writing a review', 'Write a review'],
    ['Can I order by phone?', 'ordering by phone', 'Request a callback'],
    ['What are your opening hours?', 'opening hours', 'Find a store'],
    ['How do I recycle my old device?', 'recycling an old device', 'Book a recycling pickup'],
    ['Can I get a paper receipt?', 'paper receipts', 'Download receipt'],
    ["Why can't I sign in?", 'sign-in problems', 'Reset password'],
    ['How do I change the language of the site?', 'the site language', 'Change language'],
    ['Do you have a mobile app?', 'the mobile app', 'Get the app'],
    ['Can I buy now and pay later?', 'paying later', 'Check your eligibility'],
    ['How do I report a security issue?', 'reporting a security issue', 'Report a vulnerability'],
    ['How do I create an account?', 'creating an account', 'Create account'],
    ['Can I change my display name?', 'changing a display name', 'Edit display name'],
    ['How do I make the text larger?', 'adjusting the text size', 'Adjust text size'],
    ['Where can I manage my cookie choices?', 'cookie preferences', 'Manage cookies'],
    ['Can I save items to a wish list?', 'saving items to a wish list', 'View wish list'],
    ['How do I compare two products?', 'comparing products', 'Compare products'],
    ['Where can I find a size guide?', 'choosing the right size', 'View size guide'],
    ['How should I care for my product?', 'product care', 'View care instructions'],
    ['Where are the assembly instructions?', 'assembling a product', 'Open assembly guide'],
    ['How do I find replacement parts?', 'finding replacement parts', 'Browse spare parts'],
    ['Where can I manage my preorders?', 'managing preorders', 'View preorders'],
    ['How do I add gift wrapping to an order?', 'gift wrapping', 'Choose gift wrapping'],
    ['Can I check out as a guest?', 'guest checkout', 'Continue as guest'],
    ['How do I reorder a previous purchase?', 'repeating a purchase', 'Order again'],
    ['How do I change the quantity in my basket?', 'basket quantities', 'Edit basket'],
    ['What if I receive the wrong item?', 'incorrect items in a delivery', 'Report wrong item'],
    ['Where can I see my loyalty points?', 'loyalty point balances', 'View points balance'],
    ['How do I place a bulk order?', 'bulk purchases', 'Request a bulk quote'],
    ['Can I arrange a product demonstration?', 'product demonstrations', 'Book a demonstration'],
    ['How do I book a product installation?', 'product installation services', 'Book installation'],
    ['Where do I download my purchased files?', 'accessing digital purchases', 'Open downloads'],
    ['How do I activate my software license?', 'software license activation', 'Activate license'],
    ['How do I report a broken link?', 'broken website links', 'Report broken link'],
    ['Why won\'t a product video play?', 'video playback problems', 'Check video playback'],
    ['How do I filter my search results?', 'filtering search results', 'Explore search filters'],
    ['How do I check stock at a nearby store?', 'local store stock', 'Check store stock'],
    ['How do I install a software update?', 'installing software updates', 'Check for updates'],
    ['How do I verify my email address?', 'verifying an email address', 'Verify email'],
    ['How do I merge two accounts?', 'merging duplicate accounts', 'Request an account merge'],
    ['How do I add a profile photo?', 'profile photos', 'Update profile photo'],
    ['Where can I set my time zone?', 'account time zone settings', 'Choose time zone'],
    ['How do I disconnect a linked app?', 'removing access for linked apps', 'Manage linked apps'],
    ['How do I choose a different product colour?', 'product colour selection', 'Choose colour'],
    ['Where can I check for product recalls?', 'product recall notices', 'View recall notices'],
    ['How do I share a product page with someone?', 'sharing product links', 'Share product'],
    ['Where can I manage a product rental?', 'product rental management', 'View rentals'],
    ['How do I trade in a device towards a purchase?', 'device trade-ins', 'Start a trade-in'],
    ['How do I add engraving to a product?', 'personalised product engraving', 'Choose engraving'],
    ['Where can I see the details of my free trial?', 'free trial details', 'View trial details'],
    ['How do I check my subscription usage?', 'subscription usage tracking', 'View usage'],
    ['How do I make my files available offline?', 'offline file access', 'Manage offline files'],
    ['Why won\'t my file upload finish?', 'file upload problems', 'Check upload help'],
    ['How do I restore a file I deleted?', 'recovering deleted files', 'Open deleted files'],
    ['Where can I see how much storage I have used?', 'storage space usage', 'View storage usage'],
    ['How do I back up my device settings?', 'backing up device settings', 'Open backup settings'],
    ['How do I turn on captions for videos?', 'video caption settings', 'Enable captions'],
    ['Can I switch the site to a dark theme?', 'site colour themes', 'Choose theme'],
    ['Where can I find the keyboard shortcuts?', 'keyboard shortcuts', 'View keyboard shortcuts'],
    ['Where can I check for a service outage?', 'service availability', 'View service status'],
    ['How do I report an error in the app?', 'app error reports', 'Report an app error'],
    ['Where can I suggest a new feature?', 'feature suggestions', 'Suggest a feature'],
    ['How do I update my phone number?', 'changing an account phone number', 'Update phone number'],
    ['How do I hide my public profile?', 'public profile visibility', 'Set profile visibility'],
    ['How do I block another user?', 'blocking other users', 'Manage blocked users'],
    ['Can I get a copy of my support chat?', 'support chat transcripts', 'Request chat transcript'],
    ['How do I make a formal complaint?', 'the complaints process', 'File a complaint'],
    ['Where can I check the progress of my repair?', 'repair progress tracking', 'Track a repair'],
    ['How do I rename a file?', 'renaming files', 'Rename file'],
    ['How do I organise my files into folders?', 'organising files in folders', 'Create a folder'],
    ['How do I share a file with someone?', 'sharing files with others', 'Share a file'],
    ['How do I sort my files by date?', 'file list sorting', 'Choose file sort order'],
    ['How do I export a report as a spreadsheet?', 'spreadsheet report exports', 'Export report'],
    ['How do I print a document?', 'printing documents', 'Open print options'],
    ['How do I scan a paper document into the app?', 'scanning paper documents', 'Scan a document'],
    ['How do I adjust my device\'s sleep timer?', 'device sleep timer settings', 'Set sleep timer'],
  ];

  // Copy values: [value label, aliases, generator key, field labels]
  const VALUES = [
    ['Order number', ['order no.', 'order ID'], 'order', ['Order number', 'Order no.', 'Order ID']],
    ['Tracking number', ['tracking code', 'shipment number'], 'tracking', ['Tracking number', 'Tracking code']],
    ['Invoice number', ['invoice ID', 'invoice reference'], 'invoice', ['Invoice number', 'Invoice reference']],
    ['Promo code', ['discount code', 'coupon code'], 'coupon', ['Discount code', 'Promo code', 'Coupon']],
    ['Gift card code', ['gift card number', 'voucher code'], 'gift', ['Gift card code', 'Voucher code']],
    ['Product code', ['SKU', 'item code'], 'sku', ['Product code', 'SKU', 'Item number']],
    ['Booking reference', ['confirmation code', 'reservation code'], 'booking', ['Booking reference', 'Reference']],
    ['Customer ID', ['customer number', 'account number'], 'customer', ['Customer ID', 'Customer number']],
    ['Case number', ['ticket number', 'support case number'], 'case', ['Case number', 'Ticket number']],
    ['License key', ['product key', 'activation key'], 'license', ['License key', 'Activation key']],
  ];
  const CODE_GEN = {
    order: (r, c) => c.orderId(r),
    tracking: (r, c) => c.trackingCode(r),
    invoice: (r, c) => c.invoiceId(r),
    coupon: (r, c) => c.couponCode(r),
    gift: (r, c) => c.giftCardCode(r),
    sku: (r, c) => c.sku(r),
    booking: (r, c) => c.letters(r, 6),
    customer: (r) => `CU${r.int(1000000, 9999999)}`,
    case: (r) => String(r.int(10000000, 99999999)),
    license: (r, c) => `${c.alnum(r, 4)}-${c.alnum(r, 4)}-${c.alnum(r, 4)}`,
  };

  // Scroll panes: kind -> page kinds that host it, title, row action labels, row generator.
  const PANE_KINDS = {
    releases: { hosts: ['docs', 'terms'], title: 'Release history', labels: ['Download', 'Notes'] },
    updates: { hosts: ['article'], title: 'Live updates', labels: ['Share', 'Copy link'] },
    sellers: { hosts: ['product'], title: 'Other sellers', labels: ['Add to cart', 'Details'] },
    articles: { hosts: ['faq', 'docs'], title: 'Help articles', labels: ['Open', 'Save'] },
    versions: { hosts: ['terms', 'docs'], title: 'Previous versions', labels: ['View', 'Download'] },
  };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

  // ---------------------------------------------------------------- sampling helpers

  function paras(rng, spec, domain, k) {
    return C.paragraphs(rng, k, { domain, csplit: spec.csplit, min: 2, max: 4 });
  }

  function personName(rng, spec) {
    return C.personName(rng, { csplit: spec.csplit }).full;
  }

  function pageTitle(rng, spec) {
    if (spec.kind === 'article') return C.pick(rng, C.HEADLINES, spec);
    if (spec.kind === 'product') return C.pick(rng, C.PRODUCTS, spec).name;
    return C.pick(rng, TITLES[spec.kind], spec);
  }

  // Build sections with globally unique action ids.
  function makeSections(rng, spec, n) {
    const K = KINDS[spec.kind];
    const picked = C.sample(rng, K.sections, n, spec);
    while (picked.length < n) picked.push(rng.pick(K.sections));
    const linkBank = C.LINK_TEXTS;
    let aid = 0;
    const sections = picked.map(([heading, about, labels], i) => {
      const actions = [];
      const own = rng.sample(labels, rng.int(1, Math.min(2, labels.length)));
      for (const label of own) actions.push({ id: `a${aid++}`, label, kind: rng.bool(0.6) ? 'link' : 'button' });
      if (rng.bool(0.55)) actions.push({ id: `a${aid++}`, label: rng.pick(GENERIC), kind: 'link' });
      else if (rng.bool(0.4)) actions.push({ id: `a${aid++}`, label: C.pick(rng, linkBank, spec), kind: 'link' });
      return { id: `s${i}`, heading, about, paras: paras(rng, spec, rng.pick(K.domains), rng.int(1, 3)), actions };
    });
    // Labels must stay unique inside one section.
    for (const s of sections) {
      const seen = new Set();
      s.actions = s.actions.filter((a) => (seen.has(a.label) ? false : (seen.add(a.label), true)));
    }
    spec._aid = aid;
    return sections;
  }

  const nextId = (spec, p = 'a') => `${p}${spec._aid++}`;

  function makeTools(rng, spec, labels, k) {
    return rng.sample(labels, Math.min(k, labels.length)).map((label) => ({ id: nextId(spec), label, kind: 'button' }));
  }

  function makeFaq(rng, spec, n) {
    const qs = C.sample(rng, FAQ, n, spec);
    return qs.map(([q, about, label], i) => {
      const actions = [{ id: nextId(spec), label, kind: 'link' }];
      if (rng.bool(0.4)) actions.push({ id: nextId(spec), label: rng.pick([
        'Contact support', 'Learn more', 'Read more', 'Search help', 'Browse guides'
      ]), kind: 'link' });
      return { id: `q${i}`, q, about, paras: paras(rng, spec, 'support', rng.int(1, 2)), actions };
    });
  }

  function paneRows(rng, spec, kind, n, start) {
    const labels = PANE_KINDS[kind].labels;
    const rows = [];
    const used = new Set();
    const k0 = start || 0;
    let ver = [rng.int(2, 6), rng.int(0, 9), rng.int(0, 9)];
    let minute = rng.int(9 * 60, 11 * 60);
    let year = rng.int(2020, 2025);
    let month = rng.int(0, 11);
    for (let i = 0; i < n; i++) {
      let title;
      let ref;
      let meta;
      if (kind === 'releases') {
        title = `v${ver.join('.')}`;
        ref = `the ${title} release`;
        meta = `${MONTHS[(month + i) % 12]} ${rng.int(1, 28)}`;
        if (ver[2] > 0) ver[2] -= 1; else if (ver[1] > 0) { ver[1] -= 1; ver[2] = rng.int(2, 6); } else { ver[0] -= 1; ver[1] = 9; ver[2] = 3; }
        if (ver[0] < 1) ver = [1, 0, 0];
      } else if (kind === 'updates') {
        minute += rng.int(4, 25);
        const hh = String(Math.floor(minute / 60) % 24).padStart(2, '0');
        const mm = String(minute % 60).padStart(2, '0');
        const head = C.pick(rng, C.HEADLINES, spec);
        title = `${hh}:${mm}`;
        ref = `the update posted at ${hh}:${mm}`;
        meta = head;
      } else if (kind === 'sellers') {
        const co = C.pick(rng, C.COMPANIES, spec);
        title = co;
        ref = `the offer from ${co}`;
        meta = `$${rng.int(40, 400)}.${rng.pick(['00', '49', '95', '99'])} · ${rng.int(1, 9)} days`;
      } else if (kind === 'articles') {
        const t = C.pick(rng, C.TOPICS, spec);
        title = t;
        ref = `the article "${t}"`;
        meta = `${rng.int(2, 15)} min read`;
      } else {
        title = `Effective ${rng.int(1, 28)} ${MONTHS[month]} ${year}`;
        ref = `the version effective ${title.slice(10)}`;
        meta = `Version ${n - i + k0}.0`;
        month -= rng.int(2, 7);
        while (month < 0) { month += 12; year -= 1; }
      }
      if (used.has(title)) continue;
      used.add(title);
      const acts = labels.slice(0, rng.bool(0.5) ? 2 : 1).map((label) => ({ id: nextId(spec), label, kind: 'button' }));
      rows.push({ id: `r${k0 + rows.length}`, title, ref, meta, actions: acts });
    }
    return rows;
  }

  Object.assign(lib, {
    CODE_GEN, FAQ, KINDS, KIND_NAMES, MONTHS, PANE_KINDS, VALUES, makeFaq, makeSections, makeTools, nextId,
    pageTitle, paneRows, personName,
  });
})();
