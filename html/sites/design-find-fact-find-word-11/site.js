(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-11',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'cookie' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'np-logo', top);
      u.el('span', 'ds-brand', top, 'NotePad Pro');
      const mn = u.el('span', 'np-menu', top);
      ['File', 'Edit', 'View', 'Format', 'Help'].forEach((t) => u.el('span', '', mn, t));
      const wins = u.el('span', 'np-win', top);
      ['minimize', 'maximize', 'close'].forEach((k) => u.el('i', 'np-win-' + k, wins));
      const tools = u.el('div', 'np-tools', document.body);
      [['New'], ['Open'], ['Save'], ['|'], ['Undo'], ['Redo'], ['|'], ['Plain Text ▾']].forEach((t) => {
        if (t[0] === '|') u.el('i', 'np-sep', tools);
        else {
          const icon = u.el('b', 'np-ic np-ic-' + t[0].split(' ')[0].toLowerCase(), tools);
          const paths = {
            New: '<path d="M5 2h14l8 8v23H5z M19 2v9h8"/>',
            Open: '<path d="M2 11h30v21H2z" fill="currentColor" stroke="none"/><path d="M3 8V5h10l4 4h14"/>',
            Save: '<path d="M3 2h25l5 5v27H3z M9 2v12h17V2 M10 34V21h16v13"/>',
            Undo: '<path d="M12 5L3 13l9 8 M4 13h16a11 11 0 0 1 0 22H13"/>',
            Redo: '<path d="M23 5l9 8-9 8 M31 13H15a11 11 0 0 0 0 22h7"/>',
            'Plain Text ▾': '<path d="M2 8h20 M12 8v25 M22 18h12 M28 18v15"/>',
          };
          icon.innerHTML =
            '<svg viewBox="0 0 36 38" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="miter">' +
            paths[t[0]] +
            '</svg>';
          u.el('span', 'np-tl' + (t[0] === 'Redo' ? ' dim' : ''), tools, t[0]);
        }
      });
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const sampledLabel = labelOf(er.pick(ctx.content.END_LABELS));
      const label = er.fork('reference-label').bool(0.5) ? 'Submit' : sampledLabel;
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'toolbar']);
      const collide = cr.bool(0.3)
        ? (() => {
            const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
            const choices = ctx.content.END_LABELS.filter((x) => !same(x));
            return choices.length ? labelOf(cr.pick(choices)) : null;
          })()
        : null;
      const decoy = (parent, text, isEnd) => {
        const b = u.el('button', isEnd ? 'np-xtra np-pq' : 'np-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', isEnd ? { label: text, collide: true } : { label: text }));
      };
      if (collide) decoy(tools, collide, true);
      let submit = null;
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (placement === 'toolbar') {
        const spacer = u.el('span', 'np-tool-spacer', tools);
        submit = end(tools, 'np-end-toolbar', label);
      }
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
      const display = ctx.display === 'header' ? 'top' : ctx.display;
      document.body.classList.toggle('np-no-footer-end', ctx.finish || placement === 'toolbar');
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (display === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (display === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      if (display === 'top') u.el('span', 'np-tasklbl', foot, 'Task:');
      if (display === 'top') briefing(foot, 'ds-header-note');
      if (!ctx.finish && placement !== 'toolbar') {
        submit = end(foot, 'ds-submit', label);
        if (placement === 'link') submit.classList.add('np-end-link');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie:
          'We use optional cookies to improve your experience, analyze usage, and show personalized content. You can accept all cookies or reject optional ones. Essential cookies will always be used.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      if (ctx.kind === 'cookie') u.el('h2', '', el, 'We value your privacy');
      u.el('div', 'np-ov-t', el, texts[ctx.kind]);
      if (ctx.kind === 'cookie') u.el('a', 'np-learn', el, 'Learn more');
      const row = u.el('div', 'np-ov-row', el);
      const dismiss = u.el('button', 'np-rej', row, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      if (ctx.kind === 'cookie') {
        const acc = u.el('button', 'np-acc', row, 'Accept all');
        acc.addEventListener('click', () => ctx.dismiss('close'));
      }
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
