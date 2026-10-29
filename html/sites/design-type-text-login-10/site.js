(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-login-10',
    'brand': 'EverNotes',
    'title': '',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Notes|Calendar|Tasks|Settings',
    'briefTitle': 'Instructions',
  };
  function endChoice(ctx) {
    const r = ctx.rng.fork('chrome/end');
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const labels = ctx.content.END_LABELS.map(labelOf);
    if (r.bool(0.5)) return { placement: 'footer', label: labels.find((x) => x === 'Submit') || labels[0], labels };
    return { placement: r.pick(['toolbar', 'link']), label: r.pick(labels), labels };
  }
  function decoyBtn(ctx, parent, label) {
    const b = ctx.util.el('button', 'ds-xtra', parent, label);
    b.type = 'button';
    b.dataset.role = 'xtra';
    b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const end = endChoice(ctx);
      u.el('div', 'ds-straps', document.body);
      const paper = u.el('div', 'ds-paper', document.body);
      const top = u.el('header', 'ds-top', paper);
      u.el('span', 'ds-logo', top);
      const bb = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bb, C.brand);
      u.el('span', 'ds-tag', bb, 'Keep What Matters');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', paper);
        const icons = [
          '<path fill="currentColor" d="M2 13L14 2l12 11h-4v13h-6v-9h-5v9H5V13Z"/>',
          '<path d="M5 2h13l6 6v19H5Z M18 2v7h6M9 13h11M9 17h11M9 21h11"/>',
          '<rect x="3" y="5" width="23" height="22" rx="2"/><path d="M8 1v8M21 1v8M3 11h23M8 15h2m4 0h2m4 0h2M8 20h2m4 0h2m4 0h2M8 24h2m4 0h2"/>',
          '<circle cx="14" cy="14" r="12"/><path stroke-width="3" d="m7 14 5 5 10-12"/>',
          '<path fill="currentColor" stroke="none" d="M12 0h5l1 5 4 2 4-2 3 5-4 3v4l4 3-3 5-4-2-4 2-1 4h-5l-1-4-4-2-4 2-3-5 4-3v-4L0 10l3-5 4 2 4-2Z"/><circle cx="14" cy="14" r="5" fill="#654635" stroke="none"/>',
        ];
        C.menu.split('|').forEach((t, i) => {
          const item = u.el('span', '', nav);
          item.innerHTML = '<svg viewBox="0 0 29 29" aria-hidden="true">' + icons[i] + '</svg>';
          item.append(document.createTextNode(t));
          item.addEventListener('click', () => env.log('decoy', { label: t }));
        });
      }
      const tools = u.el('div', 'ds-top-tools', top);
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(end.labels)].filter(
          (x) => x.trim().toLowerCase() !== end.label.trim().toLowerCase(),
        );
        if (options.length) decoyBtn(ctx, tools, cr.pick(options));
      }
      const body = u.el('div', 'ds-body', paper);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const display = ctx.display === 'panel' && paper.clientWidth < 1100 ? 'header' : ctx.display;
      const mode =
        display === 'hidden' ? 'hidden' : display === 'toast' ? 'toast' : display === 'panel' ? 'left' : natural;
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
      const foot = u.el(
        'footer',
        'ds-footer' + (ctx.finish ? ' ds-footer-finish' : ' ds-footer-' + end.placement),
        content,
      );
      u.el('span', '', foot, ctx.finish ? 'Ready' : end.placement === 'toolbar' ? 'Notebook ready' : '');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' +
            (end.placement === 'toolbar' ? ' ds-submit-toolbar' : end.placement === 'link' ? ' ds-submit-link' : ''),
          end.placement === 'toolbar' ? tools : foot,
          end.label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = end.label;
        submit.setAttribute('aria-label', end.label);
        submit.addEventListener('click', () => ctx.submit());
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
