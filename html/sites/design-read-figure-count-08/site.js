(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-count-08',
    'task': 'read-figure',
    'scenario': 'count',
    'style': 'ribbon',
    'title': 'Shape Counter - Practice',
    'menu': '',
    'note': '',
    'layout': 'doc',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      const ti = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22', class: 'ti' }, top);
      u.svg('circle', { cx: 11, cy: 11, r: 10, fill: '#efcc42', stroke: '#e8f6e8' }, ti);
      u.svg('path', { d: 'M11 1A10 10 0 0 1 21 11H11zM11 21A10 10 0 0 1 1 11H11z', fill: '#73ac40' }, ti);
      u.svg('path', { d: 'M11 2v18M2 11h18', stroke: '#fffbd8', 'stroke-width': 0.7 }, ti);
      u.el('span', 'ttl', top, C.title);
      const wcs = u.el('div', 'wc', top);
      u.el('i', 'min', wcs);
      u.el('i', 'max', wcs);
      u.el('i', 'x', wcs);
      const tabs = u.el('div', 'tabs', app);
      ['Home', 'Insert', 'View', 'Help'].forEach((t, i) => u.el('span', i ? 'tab' : 'tab on', tabs, t));
      const rb = u.el('div', 'ribbon', app);
      const IC = {
        Paste:
          '<rect x="6" y="6" width="20" height="24" rx="2" fill="#e8b860" stroke="#a87a28"/><rect x="11" y="3" width="10" height="6" fill="#999"/><rect x="14" y="13" width="14" height="17" fill="#fff" stroke="#888"/>',
        Cut: '<path d="M9 4l9 14M19 4l-9 14" stroke="#556" stroke-width="2"/><circle cx="9" cy="22" r="4" fill="none" stroke="#36c" stroke-width="2"/><circle cx="19" cy="22" r="4" fill="none" stroke="#36c" stroke-width="2"/>',
        Copy: '<rect x="6" y="4" width="14" height="18" fill="#fff" stroke="#789"/><rect x="12" y="10" width="14" height="18" fill="#fff" stroke="#789"/>',
        Select: '<path d="M8 3v24l6-6 5 10 4-2-5-9h9z" fill="#fff" stroke="#2a7bd0" stroke-width="2"/>',
        Draw: '<path d="M5 29h26" stroke="#a4b4c5" stroke-width="1.5"/><path d="M6 27l3-9L24 3q2-2 4 0l3 3q1 2-1 4L15 25z" fill="#39a343" stroke="#487953"/><path d="M9 18l6 7-9 2z" fill="#e9c491"/><path d="M6 27l1-4 3 3z" fill="#263b43"/><path d="M11 18L26 4" stroke="#b8e998" stroke-width="2"/>',
        Eraser:
          '<path d="M5 29h25" stroke="#a4b4c5" stroke-width="1.5"/><path d="M4 22L22 3q1-2 3 0l6 5q1 1-1 3L13 30z" fill="#9daec0" stroke="#637991"/><path d="M4 22l8-9 10 9-9 8z" fill="#ed6875" stroke="#a34d5b"/><path d="M7 20l6-6 8 7" fill="none" stroke="#ffa4ac"/>',
        ZI: '<circle cx="13" cy="13" r="9" fill="#e8f2fb" stroke="#35618f" stroke-width="2.5"/><path d="M8 13h10M13 8v10M20 20l8 8" stroke="#35618f" stroke-width="3"/>',
        ZO: '<circle cx="13" cy="13" r="9" fill="#e8f2fb" stroke="#35618f" stroke-width="2.5"/><path d="M8 13h10M20 20l8 8" stroke="#35618f" stroke-width="3"/>',
        Z1: '<rect x="3" y="3" width="20" height="20" fill="#e8f2fb" stroke="#35618f" stroke-width="2"/><circle cx="14" cy="14" r="7" fill="none" stroke="#35618f" stroke-width="2.5"/><path d="M20 20l8 8" stroke="#35618f" stroke-width="3"/>',
        New: '<path d="M6 2h14l7 8v20H6z" fill="#fafcff" stroke="#507ca8" stroke-width="1.4"/><path d="M20 2v8h7" fill="#deebf7" stroke="#507ca8"/>',
        Open: '<path d="M3 8h9l3 3h13v15H3z" fill="#f2b84a" stroke="#b07a1a"/><path d="M3 26l5-12h22l-4 12z" fill="#fcd878" stroke="#b07a1a"/>',
        Save: '<rect x="4" y="4" width="24" height="24" rx="2" fill="#2a62c8" stroke="#183c80"/><rect x="9" y="4" width="14" height="9" fill="#fff"/><rect x="9" y="18" width="14" height="10" fill="#dde"/>',
        Print:
          '<rect x="9" y="3" width="14" height="9" fill="#fff" stroke="#789"/><rect x="3" y="12" width="26" height="12" rx="2" fill="#7a8794" stroke="#455"/><rect x="9" y="19" width="14" height="9" fill="#fff" stroke="#789"/>',
      };
      const icon = (p, k, s) => {
        const v = u.svg('svg', { width: s, height: s, viewBox: '0 0 32 32', class: 'ic' }, p);
        v.innerHTML =
          '<defs><linearGradient id="shine-' +
          k +
          '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".42"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#123c69" stop-opacity=".18"/></linearGradient></defs>' +
          IC[k];
        const base = v.querySelector('defs + *');
        if (base && ['Paste', 'Draw', 'Eraser', 'Open', 'Save', 'Print'].includes(k)) {
          const sheen = base.cloneNode();
          sheen.setAttribute('fill', 'url(#shine-' + k + ')');
          sheen.setAttribute('stroke', 'none');
          v.append(sheen);
        }
      };
      const grp = (name, items) => {
        const g = u.el('div', 'grp', rb),
          r = u.el('div', 'items', g);
        items.forEach(([l, k, small]) => {
          if (Array.isArray(l)) {
            const col = u.el('div', 'col', r);
            l.forEach(([a, b]) => {
              const c = u.el('div', 'sm', col);
              icon(c, b, 26);
              u.el('span', '', c, a);
            });
            return;
          }
          const b = u.el('div', 'big', r);
          icon(b, k, 48);
          u.el('span', '', b, l);
        });
        u.el('div', 'gn', g, name);
      };
      grp('Clipboard', [
        ['Paste', 'Paste'],
        [
          [
            ['Cut', 'Cut'],
            ['Copy', 'Copy'],
          ],
        ],
      ]);
      grp('Tools', [
        ['Select', 'Select'],
        ['Draw', 'Draw'],
        ['Eraser', 'Eraser'],
      ]);
      grp('Zoom', [
        ['Zoom In', 'ZI'],
        ['Zoom Out', 'ZO'],
        ['100%', 'Z1'],
      ]);
      grp('File', [
        ['New', 'New'],
        ['Open', 'Open'],
        ['Save', 'Save'],
        ['Print', 'Print'],
      ]);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const rng = ctx.rng,
        ends = (
          ctx.content.END_LABELS || [
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
          ]
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x))),
        er = rng.fork('chrome/end'),
        cr = rng.fork('chrome/collide'),
        placement = ctx.finish ? 'home' : er.pick(['home', 'home', 'home', 'ribbon', 'status']),
        label = er.bool(0.5) ? 'Submit' : er.pick(ends.filter((x) => String(x).toLowerCase() !== 'submit')),
        collide = cr.bool(0.3)
          ? cr.pick(ends.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase()))
          : null;
      document.body.classList.add('end-' + placement);
      const decoy = (parent, text, collision) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collision ? { label: text, collide: true } : { label: text }),
        );
      };
      if (collide) {
        const b = u.el('button', 'chrome-xtra ribbon-xtra', rb, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', center);
      const sb = u.el('div', 'status', app);
      u.el('span', '', sb, 'Ready');
      const zs = u.el('span', 'zoom', sb, '100%   −');
      u.el('i', 'track', sb);
      u.el('span', '', sb, '+');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', placement === 'ribbon' ? rb : placement === 'status' ? sb : footer, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
        if (placement === 'status') submit.setAttribute('aria-label', label);
      }
      if (ctx.display === 'hidden') brief.hidden = true;
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
