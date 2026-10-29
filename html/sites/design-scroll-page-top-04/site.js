// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, ({ bg: '#fff', panel: '#fff', fg: '#111', muted: '#333', line: '#111' })[k] || v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const mast = util.el('div', 'bn-mast', document.body);
      const logo = util.el('div', 'bn-logo', mast);
      util.el('span', '', logo, 'Bright');
      util.el('span', 'bn-logo-notes', logo, 'Notes');
      const mark = util.el('span', 'bn-logo-mark', logo);
      mark.innerHTML = '<svg viewBox="0 0 20 25" aria-hidden="true"><path d="M3 12 16 10M5 5 14 1M6 19l10 5"/></svg>';
      util.el('span', 'bn-shape bn-triangle', mast);
      util.el('span', 'bn-shape bn-circle', mast);
      util.el('span', 'bn-dots', mast);
      const menu = util.el('div', 'mac-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Help']) util.el('span', 'mac-menu-item', menu, item);
      Object.assign(_c, { collide, cr, decoys, label, logo, mark, mast, menu, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      if (display === 'header') header.classList.add('mac-note-header');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const appTools = util.el('div', 'mac-app-tools', document.body);
      const glyphs = [
        '<path d="M3 11.2 12 3l9 8.2v9.3a.5.5 0 0 1-.5.5h-6v-6.5h-5V21h-6a.5.5 0 0 1-.5-.5z"/>',
        '<path d="M6 2.5h8l5 5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/><path d="M14 2.8V8h5M8 13h8M8 17h8"/>',
        '<path d="M3 7.5h7l2 2h9v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3.5 9.5 5 5h6"/>',
        '<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 10v8M14 10v8"/>',
        '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
        '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.7 1.5c-1.1 1.3-2.2 1.3-2.2 3M12 17.5v.1"/>',
      ];
      for (const [i, label] of ['Home', 'New Note', 'Open', 'Delete', 'Search', 'Help'].entries()) {
        const tool = util.el('div', `mac-app-tool${i === 4 ? ' mac-search-tool' : ''}`, appTools);
        const icon = util.el('span', 'mac-app-icon', tool);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${glyphs[i]}</svg>`;
        util.el('span', '', tool, label);
      }
      const hero = util.el('section', 'bn-hero', document.body);
      util.el('div', 'bn-hero-title', hero, 'Help Center');
      util.el('div', 'bn-hero-subtitle', hero, 'Find answers, learn features, and get the most out of BrightNotes.');
      const search = util.el('div', 'bn-search', hero);
      util.el('span', 'bn-search-icon', search, '⌕');
      util.el('span', '', search, 'Search help articles...');
      const tabs = util.el('nav', 'bn-tabs', document.body);
      for (const [i, item] of ['Help Center', 'Using BrightNotes', 'Account & Billing', 'Team & Sharing', 'Integrations', 'Troubleshooting', 'What’s New'].entries()) {
        util.el('span', `bn-tab${i === 0 ? ' active' : ''}`, tabs, item);
      }
      Object.assign(_c, { appTools, glyphs, headerTools, hero, search, submit, tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const topicIndex = util.el('aside', 'mac-topic-index', body);
      util.el('div', 'mac-index-heading', topicIndex, 'Articles in this section');
      for (const item of ['Getting started', 'Creating notes', 'Organizing your notes', 'Searching', 'Sharing with your team',
        'Using integrations', 'Account settings', 'Billing and payments', 'Troubleshooting', 'Keyboard shortcuts',
        'Mobile apps', 'More resources']) {
        const row = util.el('div', `mac-topic${item === 'Sharing with your team' ? ' selected' : ''}`, topicIndex);
        util.el('span', '', row, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, topicIndex });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'bn-tips', body);
      util.el('div', 'bn-side-title', tips, 'Helpful tips');
      for (const [icon, title, copy] of [['▤', 'Find what you need', 'Use the table of contents to jump to a section.'], ['⌕', 'Search help articles', 'Type keywords in the search bar above.'], ['?', 'Still need help?', 'Visit our support center for more articles or get in touch with our team.']]) {
        const tip = util.el('div', 'bn-tip', tips);
        util.el('span', 'bn-tip-icon', tip, icon);
        const words = util.el('div', '', tip);
        util.el('strong', '', words, title);
        util.el('span', '', words, copy);
      }
      util.el('div', 'bn-side-rule', tips);
      util.el('div', 'bn-side-title', tips, 'Related articles');
      for (const item of ['Setting permissions for a note', 'Inviting guests to your workspace', 'Collaborating on notes', 'Managing shared content']) {
        util.el('a', 'bn-related', tips, item);
      }
      Object.assign(_c, { stage, tips });
    },
  };

  env.site({
    name: 'design-scroll-page-top-04',
    template: 'site/base',
    design: { parts },
  });
})();
