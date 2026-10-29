// ShopEase glass workspace: a design on the shared site frame.
(function () {
  'use strict';
  const svg = (paths, view = '0 0 32 32') =>
    '<svg aria-hidden="true" viewBox="' +
    view +
    '" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">' +
    paths +
    '</svg>';
  const cart = svg(
    '<path d="M2 3h5l5 21h15l4-15H9M11 15h18M13 20h15M16 9l2 14M24 9l-1 14"/><circle cx="14" cy="29" r="2"/><circle cx="26" cy="29" r="2"/>',
  );
  const clipboard = svg(
    '<rect x="3" y="7" width="26" height="26" rx="2" fill="white"/><path d="M12 7V4a4 4 0 0 1 8 0v3M11 7h10v5H11zM11 17h10M11 22h10M11 27h6"/>',
    '0 0 32 36',
  );
  const icons = [
    svg(
      '<path d="M4 4h6v6H4zM13 4h6v6h-6zM22 4h6v6h-6zM4 13h6v6H4zM13 13h6v6h-6zM22 13h6v6h-6zM4 22h6v6H4zM13 22h6v6h-6zM22 22h6v6h-6z" fill="currentColor" stroke="none"/>',
    ),
    svg(
      '<path d="M1 28L12 5l6 12 5-8 8 19z" fill="currentColor" stroke="none"/><path d="M8 14l4-2 4 4M21 16l2-2 3 3" stroke="white"/>',
    ),
    svg('<path d="M11 4L2 10l5 7 5-3v15h11V14l4 3 5-7-9-6-3 4h-6z" fill="currentColor" stroke="none"/>'),
    svg(
      '<path d="M2 23c2-5 8-5 12-11l3 3 4-7 6 3 4 10c-5 7-17 9-27 8z" fill="currentColor" stroke="none"/><path d="M16 16l5 3M13 19l5 3" stroke="white" stroke-width="1"/>',
    ),
    svg(
      '<path d="M7 12h20l2 17H5z" fill="currentColor"/><path d="M11 17V9a6 6 0 0 1 12 0v8" stroke="currentColor"/><path d="M11 18v3M23 18v3" stroke="white"/>',
    ),
    svg(
      '<path d="M18 3h12v12L13 31 1 19z" fill="currentColor" stroke="none"/><circle cx="24" cy="9" r="2" fill="white" stroke="none"/>',
    ),
    svg('<circle cx="8" cy="8" r="4"/><circle cx="24" cy="24" r="4"/><path d="M5 29L27 3"/>'),
  ];

  const theme = {
    bg: '#dff2ff', panel: '#ffffff', fg: '#163d6b', line: '#c8cdd5',
    muted: '#5f6a78', font: 'Arial,sans-serif',
  };

  function decorateInstruction(note, text, util, title = 'Your Task') {
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    const heading = util.el('h2', '', null, title);
    util.el('span', 'note-icon', heading).innerHTML = clipboard;
    note.prepend(heading);
    const instruction = text.textContent;
    text.replaceChildren();
    for (const part of instruction.split(/("[^"]*"|“[^”]*”|\b\d+(?:st|nd|rd|th)\b)/g)) {
      if (/^(?:"|“|\d)/.test(part)) util.el('strong', 'instruction-emphasis', text, part);
      else text.append(part);
    }
  }

  env.site({
    name: 'design-use-shop-search-11',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'chat' },
    design: {
      THEMES: { light: theme }, LOW_THEME: theme,
      ACCENTS: ['#459b14'], LOW_ACCENTS: ['#459b14'],
      parts: {
        'frame.layout': () => function (_c) {
          const W = window.innerWidth, H = window.innerHeight;
          const display = _c.ctx.display || 'header';
          // This compact frame has a dedicated instruction column at every size.
          document.body.className = 'side-left instruction-' + display;
          Object.assign(_c, { W, H, display, roomy: W >= 1260, tall: H >= 700 });
        },
        'frame.header': () => function (_c) {
          const u = _c.util;
          const shell = u.el('div', 'site-shell', document.body);
          const header = u.el('header', 'design-header', shell);
          const brand = u.el('div', 'design-brand', header);
          u.el('span', 'brand-cart', brand).innerHTML = cart;
          brand.append('Shop');
          u.el('span', 'brand-ease', brand, 'Ease');
          u.el('div', 'window-controls', header, '−  □  ×');
          u.el('nav', 'design-nav', header, 'Home   |   Categories   |   Deals   |   Help');
          u.el('p', 'shop-tagline', header, 'Find more for your everyday');
          u.el('div', 'ambient-tagline', shell, 'A simpler way to shop');
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          if (_c.display !== 'header') return;
          const note = _c.util.el('section', '', _c.shell);
          base({ ..._c, header: note });
          decorateInstruction(note, note.querySelector('.ref-instruction'), _c.util);
          _c.note = note;
        },
        'frame.body': () => function (_c) {
          const body = _c.util.el('div', 'design-body ref-body', _c.shell);
          if (_c.note) body.append(_c.note);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => function (_c) {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (!panel) return;
          const title = panel.querySelector('.ref-panel-title');
          const label = _c.word ? title.textContent : 'Your Task';
          title.remove();
          decorateInstruction(panel, panel.querySelector('.ref-panel-text'), _c.util, label);
        },
        'frame.stage': () => function (_c) {
          const { body, util } = _c;
          const stage = util.el('main', 'stage', body);
          const categories = util.el('nav', 'shop-categories', body);
          for (const [i, label] of ['All Products', 'Sports & Outdoors', 'Clothing', 'Shoes', 'Accessories', 'Brands', 'Sale'].entries()) {
            const b = util.el('button', '', categories);
            b.type = 'button';
            util.el('b', '', b).innerHTML = icons[i];
            util.el('span', '', b, label);
            b.addEventListener('click', () => env.log('decoy', { what: label }));
          }
          Object.assign(_c, { stage });
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) note.classList.add('task-note');
        },
        'frame.end': (base) => function (_c) {
          const { shell, submit, util } = _c;
          // Keep template-created controls and their handlers; only dress and place them.
          shell.append(_c.headerTools);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            foot.classList.add('design-footer');
            shell.append(foot);
          }
          const dock = document.querySelector('.ref-float-dock');
          if (dock) shell.append(dock);
          if (submit) {
            const label = submit.textContent;
            submit.replaceChildren();
            util.el('span', 'submit-label', submit, label);
            util.el('span', 'submit-check', submit).innerHTML = svg('<path d="M5 17l8 8L28 7"/>');
            submit.classList.add('end-control');
            if (_c.placement === 'header' || _c.placement === 'icon') submit.classList.add('end-header');
            else if (_c.placement === 'link') submit.classList.add('end-link');
          }
          return base(_c);
        },
        overlay: (base) => function (ctx) {
          // The reference tip is the only popup drawn in this design's own style.
          if (ctx.kind !== 'chat') return base(ctx);
          const u = ctx.util;
          const el = u.el('section', 'reference-overlay chat', document.body);
          el.setAttribute('role', 'dialog');
          el.setAttribute('aria-label', 'Tip of the day');
          const heading = u.el('h2', '', el, 'Tip of the day');
          u.el('span', 'tip-bulb', heading).innerHTML = svg(
            '<path d="M12 26h8M13 30h6M12 23c0-5-5-6-5-12a9 9 0 0 1 18 0c0 6-5 7-5 12z" fill="#ffe36d" stroke="#f7c739"/><path d="M16 0v-4M3 3L0 0M29 3l3-3M0 13h-4M32 13h4" stroke="white"/>',
            '-5 -5 42 42',
          );
          const x = u.el('button', 'tip-x', heading, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Close tip');
          x.addEventListener('click', () => ctx.dismiss());
          u.el('div', 'overlay-copy', el, 'Compare products, read reviews,\nand find the best fit for your needs!');
          const actions = u.el('div', 'overlay-actions', el);
          const c = u.el('label', 'tip-checkbox', actions);
          const ch = u.el('input', '', c);
          ch.type = 'checkbox';
          c.append(' Do not show again');
          const dismiss = u.el('button', 'primary', actions, 'Close');
          dismiss.type = 'button';
          dismiss.addEventListener('click', () => ctx.dismiss());
          return { el, dismiss };
        },
      },
    },
  });
})();
