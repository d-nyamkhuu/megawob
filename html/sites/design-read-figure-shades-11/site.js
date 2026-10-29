(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-11',
    'title': 'Color Training',
    'menu': ['File', 'Edit', 'View', 'Help'],
    'apps': ['Applications', 'Places', 'System'],
    'clock': 'Mon Apr 17, 2006    10:24 AM',
  };
  const icons = {
    bulb: '<defs><radialGradient id="bulb"><stop stop-color="#fffde1"/><stop offset=".7" stop-color="#ffe580"/><stop offset="1" stop-color="#d9a634"/></radialGradient></defs><path d="M13 38C13 28 4 27 4 17a15 15 0 0 1 30 0c0 10-9 11-9 21" fill="url(#bulb)" stroke="#8c641e" stroke-width="2"/><path d="M13 36h12v12q-6 6-12 0z" fill="#b8b9af" stroke="#575b58" stroke-width="2"/><path d="M13 39h12m-12 5h12m-11 4h10M16 36l-3-19 6 3 6-3-4 19" fill="none" stroke="#8c7d53" stroke-width="1.5"/><path d="M8 15q1-9 10-9" fill="none" stroke="white" stroke-width="3"/>',
    palette:
      '<path d="M7 25C-2 20 5 6 15 3 26-1 35 6 29 15c-3 4-10 2-11 5-2 4 3 8-3 9z" fill="#edc95b" stroke="#5e4c2a" stroke-width="1.6"/><ellipse cx="10" cy="18" rx="3" ry="3.5" fill="#4d80ac"/><circle cx="12" cy="9" r="3" fill="#9e3434"/><circle cx="21" cy="7" r="3" fill="#bb7218"/><circle cx="24" cy="13" r="2.5" fill="#64843b"/><ellipse cx="10" cy="25" rx="2" ry="3" fill="#e9e5d7"/>',
    fox: '<circle cx="16" cy="16" r="13" fill="#2c80b6" stroke="#343b3f"/><path d="M5 4l7 5 11-4-2 8 8-3c2 15-13 22-23 13C1 18 2 12 5 4z" fill="#e98516" stroke="#91501c"/><path d="M7 6l5 7-3 4c3 7 12 6 15 1-1 9-14 12-19 3-3-5-1-11 2-15z" fill="#ffba32"/><path d="M14 10l7-2-2 6-6 1" fill="#f2e5b7"/>',
    logo: '<path d="M14 2l3 4 5-1 2 5 5 2-1 6-4 3-1 6-6-1-4 4-4-5-6-1 1-6-3-4 5-4 1-6z" fill="#e9e5d9" stroke="#504638"/><circle cx="15" cy="15" r="8" fill="#9e5d30" stroke="#67503b"/><circle cx="15" cy="15" r="5" fill="#eee6d8"/>',
    sound:
      '<path d="M2 12h5l7-6v21l-7-6H2z" fill="#e5e0d3" stroke="#3d3026"/><path d="M18 10q7 6 0 13m4-17q11 10 0 21" fill="none" stroke="#e5e0d3" stroke-width="2"/>',
  };
  const draw = (el, name, box = '0 0 32 32') => {
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + box + '">' + icons[name] + '</svg>';
    return el;
  };
  env.site({
    name: C.site,
    initialOverlay: { kind: 'promo' },
    styles: ['site.css', 'gnome.css'],
    frame(ctx) {
      document.body.className = 'gnome instruction-' + ctx.display;
      const u = ctx.util;
      const panel = u.el('header', 'g-panel', document.body);
      draw(u.el('i', 'g-logo', panel), 'logo');
      for (const a of C.apps) u.el('span', 'g-app', panel, a);
      draw(u.el('i', 'g-fox', panel), 'fox');
      u.el('i', 'g-help', panel, '?');
      draw(u.el('i', 'g-sound', panel), 'sound');
      u.el('span', 'g-clock', panel, C.clock);
      const win = u.el('main', 'g-win', document.body),
        tb = u.el('div', 'g-title', win);
      draw(u.el('i', 'g-wicon', tb), 'bulb', '0 0 38 54');
      u.el('span', '', tb, C.title);
      const wc = u.el('div', 'g-wc', tb);
      for (const k of ['min', 'max', 'close']) {
        const b = u.el('i', 'g-wb ' + k, wc);
        b.innerHTML = k === 'min' ? '<s></s>' : k === 'max' ? '<s class="sq"></s>' : '×';
      }
      const mb = u.el('nav', 'g-menu', win);
      for (const m of C.menu) u.el('span', '', mb, m);
      const client = u.el('div', 'g-client', win);
      let display = ctx.display;
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1120 || window.innerHeight < 680))
        display = 'header';
      let brief = null;
      if (display === 'header') brief = u.el('div', 'brief', client, ctx.instruction);
      else if (display === 'panel') {
        const note = u.el('aside', 'g-instr-panel', client);
        u.el('b', '', note, 'Instructions');
        u.el('div', '', note, ctx.instruction);
      } else if (display === 'toast') {
        const note = u.el('aside', 'g-instr-toast', client);
        u.el('span', '', note, ctx.instruction);
      }
      const stage = u.el('section', 'stage', client);
      const footer = u.el('footer', 'bottom', client);
      let submit = null;
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content && ctx.content.END_LABELS;
        const choices =
          Array.isArray(labels) && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        if (er.bool(0.5)) {
          placement = 'footer';
          label = 'Submit';
        } else {
          placement = er.pick(['footer', 'header', 'link']);
          const alternatives = choices.filter(
            (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || '').trim().toLowerCase() !== 'submit',
          );
          const item = er.pick(alternatives.length ? alternatives : choices);
          label = typeof item === 'string' ? item : item.label || item.text || item.name || 'Submit';
        }
        const mk = (parent, cls, text, icon) => {
          const b = u.el(icon ? 'button' : cls === 'g-end-link' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          if (cls === 'g-end-link') b.href = '#';
          if (icon) {
            b.setAttribute('aria-label', label);
            b.title = label;
          }
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = mk(footer, 'submit', label, false);
        else if (placement === 'header') {
          const holder = u.el('div', 'g-end-header', mb);
          submit = mk(holder, 'g-end-header-btn', label, false);
        } else submit = mk(footer, 'g-end-link', label + ' ›', false);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || ''));
          const options = [...new Set(pool)].filter((x) => x && x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const d = u.el('button', 'g-end-xtra', placement === 'header' ? mb : footer, cr.pick(options));
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
      if (ctx.finish) u.el('span', 'g-finish-status', footer, 'Ready');
      const pal = u.el('aside', 'g-pal', document.body),
        pt = u.el('div', 'g-ptitle', pal);
      draw(u.el('i', 'g-picon', pt), 'palette');
      u.el('span', '', pt, 'Color Picker');
      const px = u.el('i', 'g-wb close', pt);
      px.textContent = '×';
      const pb = u.el('div', 'g-pbody', pal);
      u.el('i', 'g-sw', pb);
      const tx = u.el('div', 'g-pt', pb);
      u.el('div', '', tx, 'RGB: 181, 56, 56');
      u.el('div', '', tx, 'Hex:  #B53838');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay g-tour', document.body);
      draw(u.el('i', 'g-bulb', el), 'bulb', '0 0 38 54');
      u.el('b', '', el, 'Welcome to Color Training!');
      u.el('p', '', el, 'You can select tiles by clicking on them. Try to complete the exercise.');
      const x = u.el('i', 'g-x', el);
      x.textContent = '×';
      const dismiss = u.el('button', 'g-skip', el, 'Skip tour');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      u.el('span', 'g-next', el, 'Next tip ›');
      return { el, dismiss };
    },
  });
})();
