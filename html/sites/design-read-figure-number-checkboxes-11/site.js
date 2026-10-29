(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-number-checkboxes-11',
    'task': 'read-figure',
    'scenario': 'number-checkboxes',
    'style': 'win31',
    'title': 'Pattern Painter',
    'menu': 'File    Edit    Options    Help',
    'note': 'Tools',
    'layout': 'dialog',
    'subtitle': '',
    'aside': 'Terminal\nText Editor\nFile Manager\nHelp',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util,
        desktop = u.el('div', 'desktop-icons', document.body);
      [
        ['▣', 'Program Manager'],
        ['▰', 'My Files'],
        ['▤', 'Notepad'],
        ['▱', 'Print Manager'],
        ['♲', 'Recycle Bin'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'desktop-icon', desktop);
        u.el('span', 'desktop-glyph', item, icon);
        u.el('span', '', item, label);
      });
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, fill: '#e2e2dc', stroke: '#111', 'stroke-width': 1.5 }, icon);
      u.svg(
        'path',
        { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#101c8b', 'stroke-width': 1.5 },
        icon,
      );
      u.el('span', 'title-text', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'win-control', wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      let menu = null;
      if (C.menu) {
        menu = u.el('nav', 'menu', app);
        u.el('span', 'menu-label', menu, C.menu);
        u.el('span', 'menu-tools', menu);
      }
      const roomy = window.innerWidth >= 1260,
        tall = window.innerHeight >= 700;
      let display = ctx.display || 'header';
      if ((display === 'panel' && !roomy) || (display === 'toast' && !tall)) display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const center = u.el('div', 'center', app);
      let brief = null;
      if (display !== 'hidden') brief = u.el('div', 'brief', center, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      const menuTools = menu && menu.querySelector('.menu-tools');
      const er = ctx.rng.fork('chrome/end');
      const endItems =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link', 'footer']);
      const label = ctx.finish ? '' : baseline ? 'Submit' : endText(er.pick(endItems));
      const cr = ctx.rng.fork('chrome/collide');
      const otherEnds = [...new Set(endItems.map(endText))].filter(
        (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
      );
      const collide = !ctx.finish && otherEnds.length && cr.bool(0.3) ? cr.pick(otherEnds) : null;
      const decoy = (parent, text) => {
        const b = u.el('button', 'win-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const endBtn = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) {
          b.href = '#';
          b.addEventListener('click', (e) => e.preventDefault());
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (collide) decoy(menuTools, collide);
      let submit = null;
      if (placement === 'header') submit = endBtn(menuTools, 'submit toolbar-submit', label, false);
      if (placement === 'footer') submit = endBtn(footer, 'submit', label, false);
      if (placement === 'link') submit = endBtn(footer, 'submit win-link', label + ' ›', true);
      if (ctx.finish) u.el('span', 'finish-status', footer, 'Ready');
      const taskbar = u.el('div', 'taskbar', document.body);
      u.el('button', 'start-button', taskbar, '▦ Start');
      u.el('span', 'taskbar-app', taskbar, '▣  Pattern Painter');
      u.el('span', 'taskbar-clock', taskbar, '◖))　10:24 AM');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      if (ctx.kind === 'promo') {
        const title = u.el('div', 'tour-title', el);
        u.el('span', '', title, 'Welcome to Pattern Painter');
        const close = u.el('button', 'tour-close', title, '×');
        close.addEventListener('click', ctx.dismiss);
        const body = u.el('div', 'tour-body', el);
        u.el('span', 'tour-info', body, 'i');
        u.el('span', 'tour-copy', body, 'This short tour will show you how to complete a task.');
        const actions = u.el('div', 'tour-actions', body),
          next = u.el('button', 'tour-next', actions, 'Next >');
        next.addEventListener('click', ctx.dismiss);
        const dismiss = u.el('button', 'tour-skip', actions, 'Skip tour');
        dismiss.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const msgs = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, msgs[ctx.kind] || 'Welcome to Pattern Painter');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
