(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-07',
    'brand': 'Notebook',
    'instruction': 'top',
    'rail': '1|2|3|4|5|6|7|8|9|10|11|12',
    'menu': 'File|Edit|View|Note|Format|Tools|Help',
    'briefTitle': 'Your Task',
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
      const icon = (p) =>
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        p +
        '</svg>';
      const top = u.el('header', 'ds-top', document.body);
      u.el('i', 'ds-logo', top).innerHTML = icon(
        '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M7 6h10M7 10h10M7 14h10M7 18h10M17 3v18"/>',
      );
      u.el('span', 'ds-brand', top, C.brand);
      const win = u.el('span', 'ds-win', top);
      [
        '<path d="M4 12h16"/>',
        '<rect x="5" y="5" width="14" height="14"/>',
        '<path d="M5 5l14 14M19 5L5 19"/>',
      ].forEach((p) => (u.el('i', '', win).innerHTML = icon(p)));
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const tb = u.el('div', 'ds-tools', document.body);
      const newb = u.el('span', 'ds-tb ds-newnote', tb);
      newb.innerHTML = icon('<path d="M5 2h10l5 5v15H5zM14 2v6h6"/>') + '<span>New Note</span>';
      [
        ['Save', '<path d="M3 3h15l3 3v15H3zM7 3v7h10V3M7 21v-8h10v8"/>'],
        ['Undo', '<path d="M8 4L3 9l5 5M3 9h10a7 7 0 010 14"/>'],
        ['Redo', '<path d="M16 4l5 5-5 5M21 9H11a7 7 0 000 14"/>'],
      ].forEach(([t, p], i) => {
        const e = u.el('span', 'ds-tb ds-action' + (i === 2 ? ' dim' : ''), tb);
        e.innerHTML = icon(p) + '<span>' + t + '</span>';
      });
      ['B', 'I', 'U'].forEach((t) => u.el('span', 'ds-tb ds-fmt ds-f' + t, tb, t));
      const font = u.el('span', 'ds-tb ds-font', tb, 'Monospace');
      u.el('i', 'ds-caret', font);
      const search = u.el('span', 'ds-tb ds-search', tb);
      search.innerHTML = icon('<circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/>') + '<span>Search notes...</span>';
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
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const clr = u.el('button', 'ds-clear', foot, 'Clear All');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        stage.querySelectorAll('input[type=checkbox]:checked').forEach((i) => i.click());
      });
      const endRng = ctx.rng.fork('chrome/end');
      const endBank = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        '✓',
      ];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const primary = endRng.bool(0.5);
      const placement = primary ? 'footer' : endRng.pick(['toolbar', 'footer', 'link']);
      const label = primary ? 'Submit' : endText(endRng.pick(endBank));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [
          ...new Set(endBank.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = endText(collideRng.pick(choices));
      }
      const makeEnd = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) {
        const d = u.el('button', 'ds-end-xtra', tb, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      let submit = null;
      if (!ctx.finish && placement === 'toolbar') submit = makeEnd(tb, 'ds-end-toolbar', label);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(foot, 'ds-submit', label);
      if (!ctx.finish && placement === 'link') submit = makeEnd(foot, 'ds-end-link', label + ' ›', true);
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
