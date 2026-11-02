/* click-control/judge.js: impossible goals, sampled from phantom targets absent from the scene. */
(function () {
  'use strict';
  const fam = env.taskOf('click-control');
  const V = env.scenariosOf('click-control');
  const { rrActions } = fam.lib;

  // Phantom targets for judge=impossible: [what, pool, templates]; the pool entry must not occur on the page.
  const PH_FILES = [
    'Venue photos.zip', 'Budget review 2019.xlsx', 'Onboarding checklist.docx', 'Q4 forecast.pptx',
    'Floor plan v2.pdf', 'Workshop notes.docx', 'Garden layout.pdf', 'Supplier roster 2022.xlsx',
    'Audio clips set.zip', 'Training plan.pptx'
  ];
  const PH_PEOPLE = [
    'Mirela Okonkwo', 'Tobias Lindgren', 'Hana Moreau', 'Ravi Castellano', 'Ines Vargas', 'Pavel Odu', 'Zora Bellamy',
    'Emil Navarro', 'Nadia Solberg', 'Kian Armitage', 'Liora Matsuda', 'Dario Fenwick'
  ];
  const PH = {
    button: ['button', [
      'Export PDF', 'Sync now', 'Print label', 'Request refund', 'Restore defaults', 'Pin to top',
      'Transfer ownership', 'Create shortcut', 'Lock aspect ratio', 'Mute thread', 'Merge cells', 'Set reminder',
      'Revoke access', 'Compress folder', 'Scan barcode', 'Detach window', 'Schedule backup', 'Clear cache',
      'Compare versions', 'Wrap text', 'Group layers', 'Split pane', 'Hide grid', 'Pair device', 'Redact region',
      'Freeze column', 'Trim audio', 'Invert colors'
    ],
      [
        'Click the "{x}" button.', 'Press the "{x}" button.', 'Find the "{x}" button and click it.',
        'Use the button labeled "{x}".'
      ]],
    link: ['link', [
      'Shipping rates', 'Release calendar', 'Accessibility statement', 'Partner directory', 'Store locator',
      'Press archive', 'Equipment rentals', 'Visitor handbook', 'Research library', 'Sustainability report',
      'Supplier standards', 'Venue capacity', 'Image credits', 'Exhibition guide', 'Material glossary',
      'Repair services', 'Workshop syllabus', 'Community garden', 'Donation guidelines', 'Trail conditions',
      'Membership benefits', 'Room bookings', 'Collection index'
    ],
      ['Click the link "{x}".', 'Follow the "{x}" link.', 'Open the "{x}" link.', 'Go via the "{x}" link.']],
    tab: ['tab', [
      'Billing', 'Integrations', 'Audit log', 'Payouts', 'Webhooks', 'Usage limits', 'Allowlist', 'Domains',
      'Redirects', 'Checkpoints', 'Imports', 'User seats', 'Devices', 'Aliases', 'Data feeds', 'Sync queue',
      'Job runs', 'Error rates', 'Batch jobs', 'Mail routing', 'Key rotation', 'Retry policy', 'Mirrors', 'Replay'
    ],
      [
        'Switch to the "{x}" tab.', 'Open the "{x}" tab.', 'Click the "{x}" tab.', 'Show the tab "{x}".',
        'Activate the "{x}" tab.'
      ]],
    section: ['section', [
      'Refund policy', 'Warranty terms', 'Data retention', 'Shipping zones', 'Volunteer program', 'Pet guidelines',
      'Bag restrictions', 'Late arrivals', 'Quiet hours', 'Equipment loans', 'Photo permission', 'Furniture setup',
      'Recycling guide', 'Lost property', 'Weather delays', 'Age requirements', 'Food storage', 'Lighting options',
      'Event capacity'
    ],
      [
        'Expand the "{x}" section.', 'Open the section titled "{x}".', 'Click the "{x}" section to expand it.',
        'Click to open the "{x}" section.'
      ]],
    menu: ['menu item', [
      'Print preview', 'Duplicate page', 'Export as PDF', 'Gift cards', 'Status page', 'Webinars', 'Clearance',
      'Page borders', 'Merge layers', 'Text to speech', 'Offline mode', 'Page setup', 'Zoom to fit', 'Ruler units',
      'Line width', 'Ink tools', 'Palette', 'Tool presets', 'Stamp tools', 'Open studios', 'Artist talks',
      'Audio tours', 'Tour dates', 'Season passes', 'Craft fairs', 'Book clubs', 'Walking tours', 'Residencies'
    ],
      ['Select "{x}" from the menu.', 'Open "{x}" in the menu.', 'Find "{x}" in the menu and click it.']],
    dialog: ['dialog button', [
      'Retry', 'Keep editing', 'Learn more', 'Remind me later', 'Skip for now', 'Show logs', 'Report issue',
      'Check status', 'View license', 'Use browser', 'Mute audio', 'Choose device', 'View queue', 'Use guest mode',
      'Print', 'Calibrate', 'Switch user', 'Test sound', 'Clear history', 'Pick folder'
    ],
      [
        'Click "{x}" in the dialog.', 'Press the dialog\'s "{x}" button.', 'Answer the dialog with "{x}".',
        'Respond via dialog button "{x}".', 'Make "{x}" the dialog reply.'
      ]],
    pie: ['pie menu item', 'ABCDEGHJKLMNRSTVWXY23456'.split(''),
      [
        'Pick "{x}" from the pie menu.', 'Open the pie menu and click "{x}".', 'Choose "{x}" in the pie menu.',
        'Use "{x}" as your pie menu choice.'
      ]],
    widget: ['widget', [
      'slider', 'date picker', 'dropdown', 'toggle switch', 'color picker', 'scrollbar', 'tree view', 'progress bar',
      'canvas', 'map viewer', 'video player', 'split pane', 'data grid', 'image viewer', 'drag handle'
    ],
      ['Click the {x}.', 'Click on the {x} widget.', 'Find the {x} and click it.', 'The {x} needs a click.']],
    focus: ['text field', [
      'Fax number', 'Middle name', 'Promo code', 'Passport number', 'VAT number', 'Locker code', 'Call sign',
      'Badge ID', 'Shelf mark', 'Sail material', 'Parcel weight', 'Thread tension', 'Shoe width', 'Hull number',
      'Stitch length', 'Lens aperture', 'Track gauge', 'Seed type', 'Gate number'
    ],
      [
        'Click into the "{x}" field.', 'Focus the "{x}" text field.', 'Put the cursor in the "{x}" field.',
        'Give the "{x}" field focus.', 'Make "{x}" the active text field.'
      ]],
    hover: ['square', ['purple', 'orange', 'yellow', 'pink'],
      [
        'Keep the pointer over the {x} square.', 'Hover over the {x} square and stay there.',
        'Move the mouse onto the {x} square and keep it there.', 'The pointer should stay over the {x} square.',
        'Point at the {x} square without moving away.', 'Let the pointer remain over the {x} square.'
      ]],
    tool: ['toolbar button', [
      'Rotate page', 'Insert chart', 'Spell check', 'Track changes', 'Dictate', 'Crop image', 'Align objects',
      'Underline', 'Count words', 'Line spacing', 'Superscript', 'Merge cells', 'Page break', 'Toggle ruler',
      'Wrap text', 'Mask layer', 'Text shadow', 'Small caps', 'Split table'
    ],
      [
        'Click the toolbar button whose tooltip says "{x}".', 'Find the "{x}" tool in the toolbar and click it.',
        'Use the "{x}" tool.', 'The "{x}" tooltip marks the toolbar tool to click.',
        'The toolbar tool to click is "{x}".', 'Pick the "{x}" tool by clicking.'
      ]],
    record: ['record with ID', ['4417', '5082', '6630', '7291', '8845'],
      [
        'Click "{a}" for the contact with ID {x}.', 'Find the record with ID {x} and press "{a}".',
        'Use "{a}" on the entry whose ID is {x}.', 'The contact to use "{a}" on has the ID {x}.',
        'Have "{a}" applied to the record ID {x}.'
      ]],
    row: ['row for', null, ['Use "{a}" on the row for {x}.', 'Click "{a}" in the row for {x}.', 'Find {x} in the table and click "{a}".']],
    file: ['file', PH_FILES, ['Right-click "{x}" and choose "{a}".', 'Use "{a}" on "{x}" from its context menu.', 'Open the context menu of "{x}" and pick "{a}".']],
    open: ['file', PH_FILES, [
      'Open "{x}".', 'Double-click "{x}" to open it.', 'Find "{x}" and open it.', 'Bring up the file "{x}".',
      'Get "{x}" open.', '"{x}" needs to be opened.'
    ]],
  };

  function phKind(spec) {
return V[spec.scenario].phKind(spec);
  }

  function judgeOf(jr, spec) {
    const kind = phKind(spec);
    const [what, pool0, templates] = PH[kind];
    const page = JSON.stringify(spec).toLowerCase();
    let pool = pool0 || (spec.kind === 'files' ? PH_FILES : PH_PEOPLE);
    if (kind === 'pie') pool = pool.filter((x) => !spec.items.includes(x));
    else if (kind === 'hover') pool = pool.filter((x) => x !== spec.color);
    else if (kind !== 'widget') pool = pool.filter((x) => !page.includes(x.toLowerCase()));
    if (!pool.length) return null;
    const x = jr.pick(pool);
    let a = '';
    if (kind === 'row') {
      const acts = spec.scenario === 'rows' ? spec.actions : rrActions(spec);
      a = jr.pick(acts).label.replace(/…$/, '');
    } else if (kind === 'file') a = jr.pick(spec.actions.filter((c) => !c.disabled)).label.replace(/…$/, '');
    else if (kind === 'record') a = spec.action;
    const quoted = !['widget', 'hover', 'record', 'row'].includes(kind) || (kind === 'row' && spec.kind === 'files');
    const name = quoted ? `"${x}"` : x;
    const message = kind === 'record' ? `I can't do that: there is no record with ID ${x} on this page.`
      : kind === 'row' ? `I can't do that: there is no row for ${name} in the table.`
        : kind === 'hover' ? `I can't do that: there is no ${x} square on the page.`
          : `I can't do that: there is no ${what} ${name} on this page.`;
    // kind: what sort of thing it is; what: the phantom as the instruction names it (the reply's missing item)
    return { mode: 'impossible', kind: what, what: [x], value: x, action: a, templates, message,
      vars: { x: kind === 'row' && spec.kind === 'files' ? `"${x}"` : x, a } };
  }

  Object.assign(fam.lib, { judgeOf });
})();
