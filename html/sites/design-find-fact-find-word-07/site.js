(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-07',
    'brand': 'FocusTask',
    'title': 'Text Search Challenge',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Window|Help',
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
      function icon(node, paths) {
        node.style.background = 'none';
        node.innerHTML =
          '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          paths +
          '</svg>';
      }
      const top = u.el('header', 'ds-top', document.body);
      const bw = u.el('span', 'ds-brandwrap', top);
      u.el('i', 'ds-logo', bw);
      u.el('span', 'ds-brand', bw, C.brand);
      const wc = u.el('span', 'ds-wctl', top);
      u.el('b', 'ds-wmin', wc);
      u.el('b', 'ds-wmax', wc);
      u.el('b', 'ds-wx', wc, '✕');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const rh = u.el('div', 'ds-ph', rail);
      icon(
        u.el('i', 'ds-ico ds-ico-list', rh),
        '<path d="M2 5h7m5 0h12M2 14h7m5 0h12M2 23h7m5 0h12M6 2v6m-3 3v6m4 3v6"/>',
      );
      u.el('span', '', rh, 'Find Tools');
      const fs = u.el('div', 'ds-fake', rail, 'Find in text...');
      fs.dataset.ph = '1';
      ['Match case', 'Whole words'].forEach((t) => {
        const r = u.el('div', 'ds-chk', rail);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'ds-title', content, 'Text Search Challenge');
      const side = u.el('aside', 'ds-side', body);
      const p1 = u.el('div', 'ds-panel', side);
      const h1 = u.el('div', 'ds-ph', p1);
      icon(
        u.el('i', 'ds-ico ds-ico-sun', h1),
        '<circle cx="14" cy="14" r="6"/><path d="M14 1v4m0 18v4M1 14h4m18 0h4M5 5l3 3m12 12 3 3M5 23l3-3M20 8l3-3"/>',
      );
      u.el('span', '', h1, 'Appearance');
      [
        ['Theme', 'Aubergine'],
        ['Text size', 'Medium'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-row', p1);
        u.el('span', '', r, a[0]);
        u.el('div', 'ds-fake ds-sel', r, a[1]);
      });
      const wr = u.el('div', 'ds-chk on', p1);
      u.el('i', '', wr);
      u.el('span', '', wr, 'Word wrap');
      const p2 = u.el('div', 'ds-panel', side);
      const h2 = u.el('div', 'ds-ph', p2);
      icon(u.el('i', 'ds-ico ds-ico-bolt', h2), '<path d="M17 1 4 16h9l-2 11 13-16h-9z"/>');
      u.el('span', '', h2, 'Quick Actions');
      ['Clear answer', 'Copy text', 'Reset task'].forEach((t) => {
        const b = u.el('div', 'ds-qa', p2);
        icon(
          u.el('i', 'ds-qi', b),
          t === 'Clear answer'
            ? '<path d="m4 17 13-14a2 2 0 0 1 3 0l6 6a2 2 0 0 1 0 3L13 26H9l-5-5a3 3 0 0 1 0-4zM12 9l10 10M7 14l10 10"/>'
            : t === 'Copy text'
              ? '<path d="M9 7H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3M9 3h9l6 6v13H9zM18 3v6h6M6 1H3v18"/>'
              : '<path d="M3 11a12 12 0 1 1 0 9M3 3v8h8"/>',
        );
        u.el('span', '', b, t);
      });
      const status = u.el('footer', 'ds-status', document.body);
      const rd = u.el('span', 'ds-ready', status);
      u.el('i', '', rd);
      u.el('span', '', rd, 'Ready');
      u.el('span', 'ds-sp', status);
      u.el('span', 'ds-word-count', status, 'Words: —');
      u.el('span', 'ds-char-count', status, 'Characters: —');
      u.el('span', 'ds-zoom', status, '100%');
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
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool =
          Array.isArray(labels) && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const sampledLabel = er.pick(pool);
        const placement = er.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'link']);
        const label = placement === 'footer' ? 'Submit' : sampledLabel;
        content.classList.toggle('has-end-footer', placement === 'footer');
        const makeEnd = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = makeEnd(foot, 'button', 'ds-submit', label);
        else if (placement === 'link') submit = makeEnd(status, 'a', 'ds-status-link', label + ' ›');
        else submit = makeEnd(document.querySelector('.ds-menu'), 'button', 'ds-menu-submit', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const choices = pool.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
          if (choices.length) {
            const other = cr.pick(choices);
            const d = u.el('button', 'ds-menu-xtra', document.querySelector('.ds-menu'), other);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: other, collide: true }));
          }
        }
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
