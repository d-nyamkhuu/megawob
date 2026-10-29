(function () {
  'use strict';
  const C = { 'title': 'Maple Grove Online' };
  env.site({
    name: 'design-resize-element-ghost-05',
    styles: ['home.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design home96' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#d9d3c6',
        panel: '#fbfaf4',
        fg: '#111',
        muted: '#555',
        line: '#7f8aa8',
        accent: '#0a2e9c',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', 'Georgia, "Times New Roman", serif');
      const shell = u.el('div', 'shell', body);
      const svgIcon = (parent, cls, paths) => {
        const s = u.svg(
          'svg',
          {
            class: cls,
            viewBox: '0 0 32 32',
            fill: 'none',
            stroke: '#17172b',
            'stroke-width': 1,
            'shape-rendering': 'crispEdges',
          },
          parent,
        );
        if (/tree/.test(cls)) {
          s.setAttribute('viewBox', '0 0 32 42');
          u.svg('path', { d: 'M14 11H18V38H21V41H11V38H14Z', fill: '#7b5d35' }, s);
          u.svg('path', { d: 'M16 14V39H18V14M12 21L15 24M19 18L17 21', stroke: '#d9b887' }, s);
          [
            [15, 0],
            [12, 3],
            [17, 3],
            [10, 6],
            [15, 7],
            [20, 7],
            [7, 10],
            [12, 11],
            [18, 11],
            [23, 11],
            [11, 15],
            [17, 15],
            [22, 16],
            [4, 17],
            [8, 20],
            [13, 19],
            [18, 20],
            [24, 20],
            [27, 18],
            [12, 23],
            [21, 23],
          ].forEach(([x, y], i) => {
            u.svg(
              'path',
              {
                d: `M${x} ${y}h3v-1h2v3h1v3h-3v1h-3v-2h-2v-2h2Z`,
                fill: ['#32582a', '#527d35', '#254a29', '#70934b'][i % 4],
              },
              s,
            );
            u.svg('path', { d: `M${x} ${y}h2v2h-2Z`, fill: '#a0b977', stroke: 'none' }, s);
          });
        } else if (/house|ico0/.test(cls)) {
          for (const [d, f] of [
            ['M2 14L7 9V3H11V6L18 2L30 13V16H27V28H5V16H2Z', '#18122c'],
            ['M4 13L18 4L29 13H25L18 8L9 15H4Z', '#4b4597'],
            ['M7 15H26V27H7Z', '#e8cda0'],
            ['M18 9L25 14V26H18Z', '#da8a9c'],
            ['M9 18H14V25H9Z', '#326c89'],
            ['M18 17H22V27H18Z', '#293454'],
            ['M5 28H28V30H3V27H5Z', '#4b773f'],
            ['M7 4H10V9H7Z', '#bb7789'],
          ])
            u.svg('path', { d, fill: f }, s);
          u.svg('path', { d: 'M11 18V24M9 21H14M21 17V25', stroke: '#b8e4d8' }, s);
        } else if (/mail/.test(cls)) {
          for (const [d, f] of [
            ['M15 15H18V31H14Z', '#8d7559'],
            ['M2 9L5 6H12L15 10H27V18H3Z', '#444d89'],
            ['M3 9H10V18H3Z', '#676a97'],
            ['M12 10H27V18H12Z', '#465f9a'],
            ['M18 3V12H16V2H21V5H18Z', '#c33846'],
            ['M11 29H20V32H11Z', '#719563'],
          ])
            u.svg('path', { d, fill: f }, s);
          u.svg('path', { d: 'M5 11H8V14H5ZM4 16H9M13 11V16M25 11V17', stroke: '#cdd4e2' }, s);
        } else if (/ico1|cal-ico/.test(cls)) {
          u.svg('path', { d: 'M4 5H28V29H4Z', fill: '#f8f8f8' }, s);
          u.svg('path', { d: 'M4 5H28V11H4Z', fill: '#d44252' }, s);
          u.svg('path', { d: 'M9 2V8M23 2V8', stroke: '#111', 'stroke-width': 3 }, s);
          for (let i = 0; i < 12; i++)
            u.svg(
              'path',
              { d: `M${8 + (i % 4) * 5} ${14 + Math.floor(i / 4) * 5}h2v2h-2Z`, fill: '#333', stroke: 'none' },
              s,
            );
        } else if (/ico2|doc/.test(cls)) {
          u.svg('path', { d: 'M7 3H22L26 7V29H7Z', fill: '#dae2f4' }, s);
          u.svg('path', { d: 'M21 3V8H26M11 11H22M11 15H22M11 19H21M11 23H18', stroke: '#222', 'stroke-width': 2 }, s);
        } else if (/ico3/.test(cls)) {
          u.svg('path', { d: 'M3 10H10L12 6H22L24 10H29V27H3Z', fill: '#66748a' }, s);
          u.svg('circle', { cx: 17, cy: 18, r: 7, fill: '#161626' }, s);
          u.svg('circle', { cx: 17, cy: 18, r: 4, fill: '#5a6384' }, s);
          u.svg('path', { d: 'M5 12H8V15H5Z', fill: '#fafafa' }, s);
        } else if (/ico4/.test(cls)) {
          [
            [9, 13, '#798fac'],
            [23, 13, '#c7aaa0'],
            [16, 9, '#bcbba6'],
          ].forEach(([x, y, c]) => {
            u.svg('path', { d: `M${x - 5} 29V23Q${x} 17 ${x + 5} 23V29Z`, fill: '#88b9ab' }, s);
            u.svg('circle', { cx: x, cy: y, r: 5, fill: c }, s);
          });
        } else if (/ico5/.test(cls)) {
          u.svg('circle', { cx: 16, cy: 16, r: 12, fill: '#3188d6' }, s);
          const t = u.svg(
            'text',
            { x: 11, y: 23, fill: '#fff', stroke: 'none', 'font-size': 21, 'font-weight': 'bold' },
            s,
          );
          t.textContent = '?';
        } else if (cls === 'smile') {
          u.svg('circle', { cx: 16, cy: 16, r: 12, fill: '#ffdf59', 'stroke-width': 2 }, s);
          u.svg('path', { d: 'M11 11v3M21 11v3M9 19L13 23H19L23 19', stroke: '#252333', 'stroke-width': 2 }, s);
        } else if (cls === 'heart') {
          u.svg('path', { d: 'M16 28L4 16V8L8 4H13L16 8L20 4H25L29 8V15Z', fill: '#d72f58', 'stroke-width': 2 }, s);
          u.svg('path', { d: 'M7 8H11V13H7Z', fill: '#ffbec8', stroke: 'none' }, s);
        } else if (cls === 'win-globe') {
          u.svg('circle', { cx: 16, cy: 16, r: 13, fill: '#b6c5e7', stroke: '#d3dff9' }, s);
          u.svg(
            'path',
            {
              d: 'M7 9L12 7L14 12L10 16L13 20L10 25M21 5L19 11L24 16L20 21L23 26',
              stroke: '#2d509b',
              'stroke-width': 4,
            },
            s,
          );
        } else if (/ev-ico/.test(cls)) {
          u.svg('path', { d: 'M6 5H26V30H6ZM12 3H20V8H12Z', fill: '#fff3d4' }, s);
          u.svg('path', { d: 'M10 12H22M10 17H22M10 22H22M10 27H20', stroke: '#282831' }, s);
        } else {
          for (const [d, f] of paths) u.svg('path', { d, fill: f || 'none' }, s);
          if (cls === 'town-ico')
            for (let x = 10; x < 24; x += 6) u.svg('path', { d: `M${x} 12h2v2h-2Z`, fill: '#17172b' }, s);
        }
        return s;
      };
      // masthead
      const head = u.el('header', 'head', shell);
      const hl = u.el('div', 'mast-left', head);
      const house = svgIcon(hl, 'mast-house', [
        ['M3 15L16 4L29 15', '#c0392b'],
        ['M7 15V28H25V15', '#e8b04a'],
        ['M13 28V19H19V28', '#2a4a9a'],
      ]);
      const hn = u.el('nav', 'mast-links', hl);
      for (const t of ['Home', 'People', 'Photos', 'Guestbook', 'Local Links']) u.el('span', '', hn, t);
      const hc = u.el('div', 'mast-center', head);
      const tree = () =>
        svgIcon(hc, 'mast-tree', [
          ['M16 2L6 14H11L4 22H12L9 27H23L20 22H28L21 14H26Z', '#3f8a3a'],
          ['M14 27V31H18V27', '#6b4a2a'],
        ]);
      tree();
      const mt = u.el('div', 'mast-text', hc);
      u.el('div', 'mast-title', mt, 'Maple Grove Online');
      u.el('div', 'mast-sub', mt, 'Our Neighborhood on the Web — Est. 1996');
      tree();
      const hr = u.el('div', 'mast-right', head);
      const m1 = u.el('div', 'mast-links right', hr);
      for (const t of ['Neighbors', 'Ideas', 'Friendships', 'A Brighter Tomorrow']) u.el('span', '', m1, t);
      svgIcon(hr, 'mast-mail', [
        ['M4 10H24V24H4Z', '#4a70c0'],
        ['M14 24V31', '#555'],
      ]);
      const m2 = u.el('div', 'mast-links italic', hr);
      for (const t of ['Good', 'Neighbors', 'Stronger', 'Together']) u.el('span', '', m2, t);
      // content
      const content = u.el('div', 'content', shell);
      const win = u.el('section', 'win forum', content);
      const tb = u.el('div', 'win-title', win);
      svgIcon(tb, 'win-globe', []);
      u.el('span', 'win-name', tb, 'Maple Grove Community Forum');
      const ctl = u.el('span', 'win-ctl', tb);
      for (const l of ['_', '□', '×']) {
        const b = u.el('button', '', ctl, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const wb = u.el('div', 'win-body', win);
      const side = u.el('aside', 'side', wb);
      for (const [i, t] of ['Community', 'Events', 'Classifieds', 'Photo Gallery', 'Neighbor List', 'Help'].entries()) {
        const r = u.el('div', 'side-item' + (i === 0 ? ' on' : ''), side);
        svgIcon(r, 'side-ico ico' + i, []);
        u.el('a', '', r, t);
      }
      const sig = u.el('div', 'side-sig', side);
      svgIcon(sig, 'sig-tree', [
        ['M16 2L6 14H11L4 22H12L9 27H23L20 22H28L21 14H26Z', '#3f8a3a'],
        ['M14 27V31H18V27', '#6b4a2a'],
      ]);
      u.el('div', '', sig, 'Small Town Big People');
      const main = u.el('div', 'main', wb);
      const th = u.el('div', 'town-head', main);
      svgIcon(th, 'town-ico', [
        ['M5 3H26L29 6V22L25 25H17L9 31V25H5L2 22V7Z', '#9ba1ae'],
        ['M5 3H25L28 6V21L25 24H16L9 29V24H5L2 21V7Z', '#f4f4fa'],
      ]);
      const tt = u.el('div', '', th);
      u.el('h1', '', tt, 'Town Square');
      u.el('p', '', tt, 'Share news, ask questions, and stay connected.');
      const table = u.el('table', 'forum', main);
      const tr = u.el('tr', '', table);
      for (const v of ['', 'Subject', 'Author', 'Replies', 'Last Post']) u.el('th', '', tr, v);
      for (const [s, a, n, d, ic] of [
        ['Spring Cleanup Day', 'KarenB', '6', 'Apr 10, 1996', 'doc'],
        ['Best homemade pie?', 'TomH', '14', 'Apr 9, 1996', 'smile'],
        ['New park equipment', 'LisaM', '8', 'Apr 8, 1996', 'doc'],
        ['Welcome, neighbors!', 'Admin', '3', 'Apr 6, 1996', 'heart'],
      ]) {
        const r = u.el('tr', '', table);
        svgIcon(u.el('td', 'ic', r), ic, []);
        const c = u.el('td', '', r);
        u.el('a', '', c, s);
        u.el('td', '', r, a);
        u.el('td', 'num', r, n);
        u.el('td', '', r, d);
      }
      const note = u.el('section', 'task-note', main);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', main);
      stage.dataset.role = 'stage';
      // calendar window
      const cal = u.el('section', 'win cal', content);
      const ct = u.el('div', 'win-title', cal);
      u.el('span', 'win-name', ct, 'Neighborhood Calendar');
      const cc = u.el('span', 'win-ctl', ct);
      for (const l of ['_', '□', '×']) {
        const b = u.el('button', '', cc, l);
        b.type = 'button';
      }
      const cb = u.el('div', 'cal-body', cal);
      const mh = u.el('div', 'cal-month', cb);
      svgIcon(mh, 'cal-ico', []);
      u.el('span', 'arr', mh, '◀');
      u.el('b', '', mh, 'April 1996');
      u.el('span', 'arr', mh, '▶');
      const ct2 = u.el('table', 'cal-grid', cb);
      const h = u.el('tr', '', ct2);
      for (const d of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) u.el('th', '', h, d);
      let day = 1;
      for (let w = 0; w < 5; w++) {
        const r = u.el('tr', '', ct2);
        for (let d = 0; d < 7; d++) {
          if (day === 4) day++;
          const blank = (w === 0 && d < 2) || day > 30;
          const td = u.el('td', day === 10 && !blank ? 'today' : '', r, blank ? '' : String(day));
          if (!blank) day++;
        }
      }
      const ev = u.el('div', 'events', cb);
      const eh = u.el('div', 'ev-head', ev);
      svgIcon(eh, 'ev-ico', []);
      u.el('b', '', eh, 'Upcoming Events');
      for (const [d, n, t] of [
        ['Apr 10', 'Park Committee Meeting', '7:00 PM'],
        ['Apr 22', 'Earth Day Clean-Up', '9:00 AM'],
        ['Apr 27', 'Community Potluck', '6:00 PM'],
      ]) {
        const r = u.el('div', 'ev-row', ev);
        u.el('span', '', r, d);
        u.el('span', '', r, n);
        u.el('span', '', r, t);
      }
      u.el('a', 'ev-more', ev, 'View Full Calendar →');
      // footer
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'footer-copy', footer, 'Maple Grove Online\nEst. 1996');
      const fl = u.el('nav', 'foot-links', footer);
      ['Home', 'People', 'Photos', 'Guestbook', 'Local Links'].forEach((t, i) => {
        if (i) u.el('i', '', fl, '|');
        u.el('a', '', fl, t);
      });
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end'),
          collideR = ctx.rng.fork('chrome/collide');
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
        const label = endR.bool(0.5) || !alternatives.length ? 'Submit' : labelOf(endR.pick(alternatives));
        const placement = endR.pick(['footer', 'footer', 'footer', 'footer-link', 'footer-icon', 'footer-link']);
        const endControl = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'footer') submit = endControl(footer, 'button', 'submit', label);
        else if (placement === 'footer-link') submit = endControl(fl, 'a', 'end-link', label + ' ›');
        else submit = endControl(fl, 'button', 'end-icon', '✓');
        const pool = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (pool.length && collideR.bool(0.3)) {
          const text = labelOf(collideR.pick(pool));
          const parent = collideR.pick([footer, fl]);
          const b = u.el('button', 'end-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: text, collide: true });
        }
      }
      u.el('div', 'foot-motto', footer, 'Neighbors\nMake a Kinder\nWorld');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Neighborhood news',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this page?',
        promo: 'Read the latest neighborhood news.',
        banner: 'You are viewing a shared page.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
