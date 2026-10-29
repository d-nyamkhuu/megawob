(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-count-08',
    nav: ['Home', 'Documents', 'Media', 'Locations', 'Contacts', 'Calendar', 'Tasks', 'Settings'],
    sections: [
      'Introduction',
      'North Island',
      'Coral Lagoon',
      'Wildlife',
      'Activities',
      'South Lagoon',
      'Getting There',
      'Travel Tips',
    ],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        shell = u.el('div', 'aero-shell', document.body);
      const rail = u.el('aside', 'aero-rail', shell);
      const icons = [
        '<path d="M3 11 12 3l9 8v10h-6v-6h-6v6H3z"/><path d="M2 11 12 2l10 9"/>',
        '<path d="M5 2h10l5 5v15H5z"/><path d="M15 2v6h5M8 12h8M8 16h8"/>',
        '<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m4 18 6-6 4 4 3-3 3 5"/>',
        '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a16 16 0 0 1 0 20M12 2a16 16 0 0 0 0 20"/>',
        '<circle cx="9" cy="8" r="4"/><circle cx="17" cy="9" r="3"/><path d="M2 21c0-5 3-8 7-8s7 3 7 8M15 14c4 0 7 2 7 6"/>',
        '<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M7 14h3M13 14h4"/>',
        '<rect x="4" y="3" width="16" height="19" rx="2"/><path d="m7 9 2 2 4-4M7 16l2 2 4-4"/>',
        '<circle cx="12" cy="12" r="3"/><path d="M19 13.5a7 7 0 0 0 0-3l2-1.5-2-3.5-2.3 1a8 8 0 0 0-2.5-1.5L14 2h-4l-.4 3a8 8 0 0 0-2.5 1.5l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 3l-2 1.5 2 3.5 2.3-1a8 8 0 0 0 2.5 1.5l.4 3h4l.4-3a8 8 0 0 0 2.5-1.5l2.3 1 2-3.5z"/>',
      ];
      C.nav.forEach((label, i) => {
        const item = u.el('div', 'aero-navitem' + (i === 1 ? ' selected' : ''), rail);
        const icon = u.el('span', 'aero-icon', item);
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', item, label);
      });
      const content = u.el('div', 'aero-content', shell);
      const main = u.el('div', 'aero-main', content);
      const inspector = u.el('aside', 'aero-inspector', main);
      const ih = u.el('div', 'aero-inspector-head', inspector, 'Document Details');
      const details = u.el('div', 'aero-details', inspector);
      const thumb = u.el('div', 'aero-island-thumb', details);
      u.el('span', 'aero-island', '');
      u.el('strong', 'aero-docname', details, 'Island Guide');
      u.el('div', 'aero-subtitle', details, 'Travel Guide');
      const meta = u.el('div', 'aero-meta', details);
      [
        ['Type:', 'Article'],
        ['Size:', '428 KB'],
        ['Modified:', 'Mar 14, 2006'],
        ['Language:', 'English'],
        ['Author:', 'R. Bennett'],
        ['Tags:', 'islands, travel, beaches, lagoon'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'aero-metarow', meta);
        u.el('span', '', row, k);
        u.el('span', k === 'Tags:' ? 'aero-tags' : '', row, v);
      });
      const sectionbox = u.el('div', 'aero-sections', inspector);
      u.el('div', 'aero-sections-head', sectionbox, 'Sections');
      const sl = u.el('div', 'aero-section-links', sectionbox);
      C.sections.forEach((s, i) => {
        const a = u.el('div', 'aero-section-link' + (!i ? ' active' : ''), sl);
        u.el('span', 'aero-page-icon', a, '▤');
        u.el('span', '', a, i + 1 + '. ' + s);
      });
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      function note(parent, cls) {
        const n = u.el('div', cls, parent);
        u.el('div', 'aero-note-label', n, 'Task');
        u.el('div', 'aero-note-text', n, ctx.instruction);
        return n;
      }
      if (display === 'panel') {
        details.style.display = 'none';
        note(inspector, 'aero-panel-note');
      }
      const workspace = u.el('div', 'aero-workspace', main);
      if (display === 'header') note(workspace, 'aero-header-note');
      if (display === 'toast') note(workspace, 'aero-toast');
      const stagewrap = u.el('div', 'aero-taskarea', workspace);
      const titlebar = u.el('div', 'aero-titlebar', stagewrap);
      u.el('div', 'aero-title', titlebar, 'Island Guide');
      const stage = u.el('main', 'ds-stage', stagewrap);
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5),
        placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish ? '' : baseline ? 'OK' : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'ok'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const p = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (p.length) collide = cr.pick(p);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'aero-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'aero-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (placement === 'header') {
        const tools = u.el('div', 'aero-end-tools aero-header-actions', workspace);
        workspace.insertBefore(tools, stagewrap);
        if (collide) decoy(tools, collide);
        submit = end(tools, 'aero-submit aero-header-end', label);
      } else if (placement === 'footer') {
        const tools = u.el('div', 'aero-end-tools aero-footer-end', stagewrap);
        if (collide) decoy(tools, collide);
        submit = end(tools, 'aero-submit', label);
      } else if (placement === 'link') {
        const tools = u.el('div', 'aero-end-tools aero-footer-end', stagewrap);
        if (collide) decoy(tools, collide);
        submit = end(tools, 'aero-endlink', label + ' ›');
      }
      if (ctx.finish) stagewrap.classList.add('aero-finish');
      if (display === 'header') stagewrap.classList.add('aero-has-note');
      if (display === 'panel') stagewrap.classList.add('aero-has-panel-note');
      if (placement === 'header') stagewrap.classList.add('aero-has-header-end');
      if (placement === 'footer' || placement === 'link') stagewrap.classList.add('aero-has-footer-end');
      if (display === 'toast') stagewrap.classList.add('aero-has-toast');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay aero-overlay aero-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Discover more from Island Guide.',
        banner: 'Island Guide service announcement.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
