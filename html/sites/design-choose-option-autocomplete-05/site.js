(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-05',
    'brand': 'CorpTracker',
    'title': 'Destination',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endBank = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓']
      ).map(labelOf);
      const standard = endR.bool(0.5);
      const placement = standard ? 'footer' : endR.pick(['footer', 'link', 'icon']);
      const label = standard ? 'Submit' : endR.pick(endBank);
      const collideR = ctx.rng.fork('chrome/collide');
      const collidePool = [...new Set(endBank.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
      const collide =
        !ctx.finish && collidePool.length && collideR.bool(0.3)
          ? { label: collideR.pick(collidePool), where: 'footer' }
          : null;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const bld = u.el('span', 'ds-bldg', top);
      const tabs = u.el('nav', 'ds-tabs', top);
      ['People', 'Offices', 'Projects', 'Reports', 'Settings'].forEach((t) =>
        u.el('span', 'ds-tab' + (t === 'Offices' ? ' on' : ''), tabs, t),
      );
      const who = u.el('span', 'ds-who', top);
      who.append('Welcome, Alex Reed  |  ');
      u.el('u', '', who, 'Sign out');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      const cbox = u.el('div', 'ds-ctx', main);
      u.el('h2', 'ds-formtitle', cbox, 'New Employee');
      const dec = u.el('div', 'ds-xtras', cbox);
      [
        ['First name:', 'Jamie'],
        ['Last name:', 'Carter'],
        ['Email:', 'jamie.carter@company.com'],
        ['Department:', 'Marketing ▾'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-drow', dec);
        row.style.top = i * 3.1 + 'em';
        u.el('span', 'ds-dl', row, r[0]);
        u.el('span', 'ds-dv' + (i === 3 ? ' sm' : ''), row, r[1]);
      });
      const aft = u.el('div', 'ds-after', cbox);
      u.el('span', 'ds-dl', aft, 'Start date:');
      u.el('span', 'ds-dv ds-date', aft, '2025-06-16');
      u.el('span', 'ds-cal', aft);
      const nl = u.el('span', 'ds-dl ds-nl', aft, 'Notes:');
      u.el('span', 'ds-dv ds-notes', aft, 'Add any relevant notes here...');
      const marker = u.el('div', 'ds-swiss-label', cbox);
      u.el('strong', '', marker, '01');
      u.el('h1', '', marker, 'Trip Details');
      u.el('div', 'ds-redrule', marker);
      u.el('p', '', marker, 'Fill in your travel information to continue.');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const makeEnd = (parent, cls, text, labelText) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', labelText);
        b.title = labelText;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'ds-header-tools', top);
          submit = makeEnd(tools, 'ds-submit ds-header-end', label, label);
        } else if (placement === 'icon') {
          submit = makeEnd(foot, 'ds-submit ds-icon-end', '✓', label);
        } else if (placement === 'link') {
          submit = makeEnd(foot, 'ds-end-link', label + ' ›', label);
        } else submit = makeEnd(foot, 'ds-submit', label, label);
      }
      if (collide) {
        const parent = collide.where === 'header' ? u.el('div', 'ds-header-tools ds-header-xtras', top) : foot;
        decoy(parent, collide.label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
