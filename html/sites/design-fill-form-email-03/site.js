(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-03',
    'brand': 'Mail',
    'title': 'Add Contact',
    'instruction': 'right',
    'rail': '',
    'menu': 'Reply|Reply All|Forward|Delete|Flag',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'TOS');
      ['File', 'Edit', 'View', 'Desk', 'Options'].forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, 'Mon  Mar 10  1986  10:24');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [
        ['Disk A', 'M3 1h16l3 3v19H3z M7 2v8h10V2 M6 13h13v9H6z M9 16h7 M9 19h7'],
        ['Files', 'M4 1h12l5 5v17H4z M16 1v6h5 M7 10h11 M7 14h11 M7 18h11'],
        ['Mail', 'M1 3h22v18H1z M3 5h18v14H3z M3 5l9 8 9-8 M3 19l6-7 M21 19l-6-7'],
        ['Apps', 'M2 2h20v19H2z M5 5h14v13H5z M5 20h14'],
        ['Trash', 'M4 6h16v17H4z M2 4h20v3H2z M8 1h8v3H8z M8 9v12 M12 9v12 M16 9v12'],
      ].forEach(([t, d], i) => {
        const it = u.el('div', 'ds-ico' + (t === 'Mail' ? ' sel' : ''), rail);
        it.innerHTML =
          '<svg viewBox="0 0 24 24" width="40" height="40" fill="#eee" stroke="#000" stroke-width="2" stroke-linejoin="miter"><path d="' +
          d +
          '"/></svg>';
        if (t === 'Mail')
          it.querySelector('svg').innerHTML =
            '<rect x="1" y="3" width="22" height="18" fill="#eee"/><rect x="3" y="5" width="18" height="14" fill="#eee" stroke-width="1"/><path d="M3 5l9 8 9-8 M3 19l6-7 M21 19l-6-7" fill="none" stroke-width="1"/>';
        if (t === 'Disk A')
          it.querySelector('svg').innerHTML =
            '<path d="M3 1h16l3 3v19H3z" fill="#111"/><path d="M7 2h10v8H7z M6 13h13v9H6z" fill="#eee" stroke-width="1"/><path d="M13 3v5 M8 15h9 M8 18h9 M8 20h9" fill="none" stroke-width="1"/>';
        if (t === 'Apps')
          it.querySelector('svg').insertAdjacentHTML(
            'beforeend',
            '<path fill="#111" stroke="none" d="M5 5h14v13H5z"/><path stroke="#eee" stroke-width="1" d="M6 6h3"/>',
          );
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-wintitle', content);
      u.el('i', 'gem-box', tb);
      u.el('span', '', tb, 'Mail - Customer Inquiry');
      u.el('i', 'gem-box r', tb);
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
      main.dataset.display = ctx.display;
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
      // Episode controls use independent streams so the original task draws are unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['footer', 'toolbar', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const tools = u.el('div', 'gem-chrome-tools', tb);
      tb.insertBefore(tools, tb.lastElementChild);
      let submit = null;
      if (!ctx.finish) {
        const parent =
          placement === 'footer' ? foot : placement === 'toolbar' ? tools : u.el('div', 'gem-end-status', content);
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'link' ? ' gem-end-link' : ''),
          parent,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'gem-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (!tools.childElementCount) tools.remove();
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
