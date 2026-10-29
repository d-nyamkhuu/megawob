(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-06',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'irix',
    'layout': 'stack',
  };
  const ICONS = {
    File: '<path d="M21 3 39 22 21 40 3 22Z" fill="#252b41"/><path d="M20 2 37 20 20 37 3 20Z" fill="#aeb4d3"/><path d="m20 2 0 18-9-9Z" fill="#d2d6e9"/><path d="m20 2 8 9-8 9Z" fill="#858da9"/><path d="m11 11 9 9-17 0Z" fill="#f1f0ff"/><path d="m28 11 9 9-17 0Z" fill="#646c89"/><path d="m3 20 17 0-9 9Z" fill="#747e9e"/><path d="m20 20 17 0-9 9Z" fill="#d5d8ed"/><path d="m11 29 9-9 0 17Z" fill="#aab2cb"/><path d="m20 20 8 9-8 8Z" fill="#424d6a"/><path d="m11 11 9 9 8-9-8 18Z" fill="#3b4661" opacity=".6"/>',
    Edit: '<path d="M4 8h11l4 4h16l3 4v20H3V10Z" fill="#282f45"/><path d="M3 7h11l4 4h16v22H3Z" fill="#949bb7" stroke="#ccd0e5"/><path d="M4 9h9l4 4h16v3H4Z" fill="#6b728e"/><path d="M3 16h33v19H3Z" fill="url(#metalEdit)" stroke="#d0d4e4"/><path d="M5 34h31V17" fill="none" stroke="#333c55" stroke-width="1.5"/>',
    View: '<path d="M4 3h32v10H4Z" fill="url(#metalView)" stroke="#cad0e8"/><path d="M5 13h29v24H4Z" fill="#737d98" stroke="#30384e"/><path d="M6 14h6v22H6Z" fill="#a6aec7"/><path d="M14 16h16v20H14Z" fill="url(#metalView)" stroke="#c1c7dc"/><path d="M17 18h10v5H17Zm0 8h10v5H17Z" fill="#4d5874" stroke="#b7bed4"/><path d="M18 19h8m-8 8h8" stroke="#d3d7e9"/><path d="M35 3v10H5m7 1v22" fill="none" stroke="#353e59"/>',
    Tools:
      '<path d="M14 3 30 29Q32 34 12 37L8 35 10 30 10 5Z" fill="#242d45"/><path d="M12 3 28 29Q30 32 11 34L9 32 11 28 11 5Z" fill="url(#metalTools)" stroke="#bfc8df"/><path d="m12 4 1 24 15 2-15 3-3-2" fill="none" stroke="#4d5978" stroke-width="1.8"/><path d="m12 4 1 23-3 3" fill="none" stroke="#e1e4f4"/>',
    Options:
      '<defs><radialGradient id="sg" cx=".3" cy=".24" r=".73"><stop offset="0" stop-color="#d3d8e4"/><stop offset=".25" stop-color="#9aa5bb"/><stop offset=".65" stop-color="#616e88"/><stop offset=".87" stop-color="#414d6a"/><stop offset="1" stop-color="#151e37"/></radialGradient></defs><circle cx="21" cy="21" r="17" fill="#212b45"/><circle cx="20" cy="19" r="17" fill="url(#sg)"/><path d="M9 8Q11 0 19 3" fill="none" stroke="#e0e3ed" opacity=".3"/>',
    Help: '<path d="M3 9 20 2 38 10 38 31 21 39 3 30Z" fill="#252e48"/><path d="M3 9 20 2 37 10 20 17Z" fill="#929ab8" stroke="#c9d0e5" stroke-width="1.2"/><path d="m3 10 17 8v20L3 29Z" fill="url(#metalHelp)" stroke="#b4c0d8"/><path d="m20 18 17-7v20l-17 7Z" fill="#35435e"/><path d="m21 19 14-6v16l-14 6Z" fill="#46536e"/>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const mb = u.el('span', 'tb-menu', top);
      mb.innerHTML = '<i></i><i></i><i></i>';
      u.el('span', 'tb-title', top, 'Color Match — IRIX Resource Manager');
      u.el('span', 'tb-irix', top, 'IRIX');
      const wc = u.el('span', 'tb-ctl', top);
      for (const k of ['_', '□', '×']) u.el('b', '', wc, k);
      const tool = u.el('div', 'toolbar', app);
      for (const n of ['File', 'Edit', 'View', 'Tools', 'Options', 'Help']) {
        const t = u.el('div', 'tool', tool);
        const s = u.svg('svg', { width: 44, height: 44, viewBox: '0 0 40 40' }, t);
        s.innerHTML =
          '<defs><linearGradient id="metal' +
          n +
          '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#aab3cd"/><stop offset=".3" stop-color="#858fa9"/><stop offset="1" stop-color="#59657e"/></linearGradient></defs>' +
          ICONS[n];
        u.el('span', '', t, n);
      }
      const actions = u.el('div', 'chrome-actions', tool);
      u.el('div', 'sgi', tool, 'sgi');
      const ph = u.el('div', 'panelhead', app, 'Color Identification');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const footer = u.el('footer', 'bottom', app);
      const sys = u.el('div', 'sys', footer);
      const machine = u.svg('svg', { class: 'sysicon', viewBox: '0 0 40 64' }, sys);
      machine.innerHTML =
        '<defs><linearGradient id="tower"><stop stop-color="#a2afc6"/><stop offset=".3" stop-color="#52617c"/><stop offset="1" stop-color="#28374f"/></linearGradient></defs><path d="M5 6 23 2 38 9v48l-16 6L3 57Z" fill="url(#tower)" stroke="#222c43"/><path d="m5 6 18-4v58L5 55Z" fill="url(#tower)" stroke="#acb9ce"/><path d="m7 8 13-3v18L7 26Z" fill="#28364c" stroke="#70839e"/><path d="m6 29 14-3v30L6 53Z" fill="#26374e" stroke="#8593b0"/><path d="m24 6 11 5v18l-11-2Zm0 24 11 2v22l-11 5Z" fill="#65748e" opacity=".6"/><path d="m4 57 18 5 16-5" fill="none" stroke="#111c31" stroke-width="2"/>';
      u.el('span', '', sys, 'IRIX 6.5.22\nSGI Workstation');
      const mid = u.el('div', 'btns', footer),
        clock = u.el('div', 'clock', footer);
      u.el('span', '', clock, 'Mon Apr 14  10:27 AM');
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.bool(0.5) ? er.pick(['toolbar', 'status']) : 'footer';
      const label = placement === 'footer' ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? actions : placement === 'status' ? clock : mid;
        submit = u.el(placement === 'status' ? 'a' : 'button', 'submit end-' + placement, parent, label);
        if (placement === 'status') {
          submit.href = '#';
          clock.classList.add('has-end');
        } else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            decoy = u.el('button', 'chrome-xtra', actions, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
