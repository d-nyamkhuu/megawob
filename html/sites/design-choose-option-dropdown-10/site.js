(function () {
  'use strict';
  const END_FALLBACK = [
    'Submit',
    'Done',
    'Finish',
    'Continue',
    'Save',
    'OK',
    'Confirm',
    'Apply',
    'Complete',
    "I'm done",
  ];
  const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const C = {
    'site': 'design-choose-option-dropdown-10',
    'brand': 'Tracker',
    'title': 'Task Details',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Tasks|Options',
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
      const paths = {
        logo: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5ZM2 12h20M12 2v20M7 7h10v10H7V7Z',
        search: 'M20 20l-5-5M16 9a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
        bell: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3ZM10 21h4M12 2v2',
        Edit: 'm4 16-1 5 5-1L20 8l-5-5L4 16ZM13 5l5 5',
        Comment: 'M3 4h18v13H10l-5 4v-4H3V4Z',
        Assign: 'M5 21v-3a7 7 0 0 1 14 0v3M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
        Label: 'M3 3h9l9 9-9 9-9-9V3ZM7 7h.01',
        Priority: 'M12 2v20M5 6h14M3 12h18M7 18h10',
        Move: 'm8 5-7 7 7 7M1 12h22M16 5l7 7-7 7',
        More: 'M4 12h.01M12 12h.01M20 12h.01',
        doc: 'M4 2h10l6 6v14H4V2ZM14 2v7h6M8 13h8M8 17h8',
      };
      function icon(el, key) {
        el.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' +
          paths[key] +
          '"/></svg>';
      }
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      icon(logo, 'logo');
      u.el('span', 'ds-brand', top, C.brand);
      const tabs = u.el('span', 'ds-tabs', top);
      ['Issues', 'Boards', 'Roadmap', 'Reports', 'Automation'].forEach((t, i) =>
        u.el('span', i === 0 ? 'on' : '', tabs, t),
      );
      const search = u.el('span', 'ds-search', top);
      icon(u.el('i', '', search), 'search');
      u.el('span', '', search, 'Search issues...');
      u.el('kbd', '', search, 'Ctrl K');
      const bell = u.el('span', 'ds-bell', top);
      icon(bell, 'bell');
      u.el('span', 'ds-avatar', top, 'JD');
      const nav = u.el('nav', 'ds-menu', document.body);
      const nb = u.el('span', 'ds-newissue', nav);
      u.el('span', '', nb, '＋  New Issue');
      u.el('span', 'ds-split', nb, '⌄');
      [
        ['✎', 'Edit'],
        ['▭', 'Comment'],
        ['☺', 'Assign'],
        ['◇', 'Label'],
        ['⊤', 'Priority'],
        ['↔', 'Move'],
        ['···', 'More'],
      ].forEach(([i, t]) => {
        const g = u.el('span', 'ds-tool', nav);
        icon(u.el('i', '', g), t);
        u.el('em', '', g, t);
        if (t === 'Priority' || t === 'Move') u.el('span', 'ds-toolchev', g, '⌄');
      });
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
      const endR = ctx.rng.fork('chrome/end');
      const endPool = ((ctx.content && ctx.content.END_LABELS) || END_FALLBACK).map(labelText);
      const endVariant = endR.int(0, 9);
      const endLabel = endVariant < 5 ? 'Submit' : labelText(endR.pick(endPool));
      const placement = endVariant < 5 ? 'footer' : endVariant < 7 ? 'toolbar' : 'link';
      const collideR = ctx.rng.fork('chrome/collide');
      const collidePool = [...new Set(endPool.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
      const collide = collidePool.length && collideR.bool(0.3) ? labelText(collideR.pick(collidePool)) : null;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') {
          const legend = u.el('h2', 'ds-task-legend', b);
          icon(u.el('i', '', legend), 'doc');
          u.el('span', '', legend, 'Create Issue');
          const pj = u.el('div', 'ds-project', b);
          u.el('span', '', pj, 'Project');
          u.el('b', '', pj, 'Website Redesign      ⌄');
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') {
        const note = briefing(content, 'ds-header-note');
        const legend = u.el('h2', 'ds-task-legend', note);
        icon(u.el('i', '', legend), 'doc');
        u.el('span', '', legend, 'Create Issue');
        const pj = u.el('div', 'ds-project', note);
        u.el('span', '', pj, 'Project');
        u.el('b', '', pj, 'Website Redesign      ⌄');
      }
      if (mode === 'hidden' || mode === 'toast') {
        const heading = u.el('div', 'ds-sceneheading', content);
        const legend = u.el('h2', 'ds-task-legend', heading);
        icon(u.el('i', '', legend), 'doc');
        u.el('span', '', legend, 'Create Issue');
        const pj = u.el('div', 'ds-project', heading);
        u.el('span', '', pj, 'Project');
        u.el('b', '', pj, 'Website Redesign      ⌄');
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const status = u.el('div', 'ds-motif-status', document.body);
      u.el('span', '', status, 'Ready.');
      u.el('span', '', status, 'Mon Apr 22 1991  10:14 AM');
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const makeEnd = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const makeDecoy = (parent, text, collides) => {
        const b = u.el('button', collides ? 'ds-motif-action ds-pq' : 'ds-motif-action', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (!ctx.finish && placement === 'toolbar') submit = makeEnd(nav, 'ds-submit ds-toolbar-end', endLabel);
      if (collide && placement === 'toolbar') makeDecoy(nav, collide, true);
      if (placement === 'link' && !ctx.finish) submit = makeEnd(foot, 'ds-endlink', endLabel + ' ›', 'a');
      u.el('span', 'ds-ready', foot, 'Ready to submit');
      u.el('span', 'ds-noblock', foot, 'No blocking issues');
      if (collide && placement !== 'toolbar') makeDecoy(foot, collide, true);
      makeDecoy(foot, 'Cancel', false);
      makeDecoy(foot, 'Save Draft', false);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(foot, 'ds-submit', endLabel);
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
