(function () {
  'use strict';
  const rail = [
    ['Home', 'M3 11 12 3l9 8h-3v9h-5v-6h-2v6H6v-9Z'],
    ['Projects', 'M5 2h9l5 5v15H5ZM13 3v6h5ZM8 11v1h8v-1ZM8 14v1h8v-1ZM8 17v1h6v-1Z'],
    ['Tasks', 'M3 4h18v16H3Zm0 5h18M3 14h18M9 4v16M15 4v16'],
    ['Reports', 'M3 21V12h5v9Zm7 0V3h5v18Zm7 0v-8h5v8Z'],
    [
      'Settings',
      'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-1-6h2l.5 3 2 1 2.5-1.7 1.4 1.4L18 8.5l1 2 3 .5v2l-3 .5-1 2 1.7 2.5-1.4 1.4-2.5-1.7-2 1-.5 3h-2l-.5-3-2-1-2.5 1.7-1.4-1.4L6 15.5l-1-2-3-.5v-2l3-.5 1-2L4.3 6 5.7 4.6l2.5 1.7 2-1Z',
    ],
    [
      'Help',
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8 8c0-5 9-5 9 0 0 3-4 3-4 6h-2c0-4 4-4 4-6 0-3-5-3-5 0Zm3 8h2v2h-2Z',
    ],
  ];
  const tabs = ['Work Items', 'Details', 'Resources', 'Timeline', 'Related'];
  const rows = [
    ['PRJ-1001', 'Update client report', 'Taylor Kim', 'In Progress', 'b', 'High', 'r', '2025-04-28'],
    ['PRJ-1002', 'Design data model', 'Jordan Lee', 'Open', 'g', 'Medium', 'y', '2025-05-02'],
    ['PRJ-1003', 'QA test cycle', 'Morgan Patel', 'Open', 'g', 'Medium', 'y', '2025-05-06'],
    ['PRJ-1004', 'Prepare deployment', 'Casey Nguyen', 'Blocked', 'r', 'High', 'r', '2025-05-09'],
    ['PRJ-1005', 'Review security audit', 'Riley Chen', 'Open', 'g', 'Low', 'b', '2025-05-12'],
  ];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-click-control-pie-09',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref nb';
      const endRng = ctx.rng.fork('chrome/end');
      const placeRng = ctx.rng.fork('chrome/end-placement');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS.map(labelOf)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const placement = ctx.finish ? null : placeRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const label = endRng.bool(0.5) ? 'Submit' : endRng.pick(labels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideOptions = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collideOptions.length ? collideRng.pick(collideOptions) : null;
      const shell = u.el('main', 'shell', document.body);
      const rl = u.el('nav', 'rail', shell);
      const logo = u.el('div', 'logo', rl, 'NB');
      rail.forEach(([t, d]) => {
        const it = u.el('div', 'ri' + (t === 'Tasks' || t === 'Help' ? ' s' : ''), rl);
        it.innerHTML = '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="' + d + '"/></svg>';
        u.el('span', '', it, t);
      });
      const main = u.el('section', 'main', shell);
      const head = u.el('header', 'head', main);
      const brand = u.el('div', 'brand', head);
      u.el('b', '', brand, 'Northbridge');
      u.el('span', '', brand, 'Work Management');
      const usr = u.el('div', 'user', head);
      usr.innerHTML =
        'User:&nbsp; Alex Carter &nbsp;|&nbsp; Role:&nbsp; Analyst &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;<u>Sign Out</u>';
      const headTools = u.el('span', 'chrome-tools', usr);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (collide && placement !== 'footer') decoyBtn(headTools, collide, true);
      const display = ctx.display;
      const note = u.el(
        'div',
        'instruction ' + (display === 'panel' ? 'instruction-panel' : display === 'toast' ? 'instruction-toast' : ''),
        main,
        ctx.instruction,
      );
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      const tb = u.el('div', 'tabs', main);
      tabs.forEach((t, i) => {
        const x = u.el('div', 'tab' + (i === 0 ? ' on' : ''), tb);
        u.el('i', '', x, String(i + 1));
        u.el('span', '', x, t);
      });
      const grid = u.el('section', 'grid', main);
      const gh = u.el('div', 'bar', grid);
      u.el('b', '', gh, 'Work Items');
      const vw = u.el('span', 'view', gh);
      vw.innerHTML = 'View: <em>Active Items <small>&#9013;</small></em>';
      const tbl = u.el('table', 'tbl', grid);
      tbl.innerHTML =
        '<thead><tr><th class="c"><i class="cb"></i></th><th>ID</th><th>Title</th><th>Owner</th><th>Status</th><th>Priority</th><th>Due Date</th></tr></thead><tbody>' +
        rows
          .map(
            (r) =>
              '<tr><td class="c"><i class="cb"></i></td><td>' +
              r[0] +
              '</td><td>' +
              r[1] +
              '</td><td>' +
              r[2] +
              '</td><td><span class="pill ' +
              r[4] +
              '">' +
              r[3] +
              '</span></td><td><span class="pill ' +
              r[6] +
              '">' +
              r[5] +
              '</span></td><td>' +
              r[7] +
              '</td></tr>',
          )
          .join('') +
        '</tbody>';
      const bot = u.el('section', 'bottom', main);
      const p1 = u.el('div', 'panel det', bot);
      u.el('div', 'bar', p1, 'Item Details');
      const f = u.el('div', 'pbody', p1);
      [
        ['ID', 'PRJ-1003'],
        ['Title', 'QA test cycle'],
        ['Owner', 'Morgan Patel'],
        ['Status', 'Open ⌄'],
        ['Priority', 'Medium ⌄'],
        ['Due Date', '2025-05-06'],
      ].forEach(([l, v]) => {
        const r = u.el('div', 'frow', f);
        u.el('label', '', r, l);
        const fin = u.el('div', 'fin', r);
        u.el('span', '', fin, v.replace(' ⌄', ''));
        if (/⌄/.test(v))
          fin.insertAdjacentHTML(
            'beforeend',
            '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="m3 6 5 5 5-5"/></svg>',
          );
        else if (l === 'Due Date')
          fin.insertAdjacentHTML(
            'beforeend',
            '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 4h12v10H2Zm0 3h12M5 2v3m6-3v3"/></svg>',
          );
      });
      const p2 = u.el('div', 'panel desc', bot);
      u.el('div', 'bar', p2, 'Description');
      u.el(
        'div',
        'ta',
        u.el('div', 'pbody', p2),
        'Execute QA test cycle for release candidate.\nInclude regression, performance, and\nsecurity tests.',
      );
      const p3 = u.el('div', 'panel act', bot);
      u.el('div', 'bar', p3, 'Actions');
      const ab = u.el('div', 'pbody', p3);
      ['Add Note', 'Assign', 'Set Priority', 'Mark Complete'].forEach((t) => {
        const ic = {
          'Add Note': 'M5 2h14a1 1 0 0 1 1 1v15H9l-5 4V3a1 1 0 0 1 1-1ZM7 6v1h10V6ZM7 9v1h10V9ZM7 12v1h7v-1Z',
          'Assign': 'M9 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM1 21v-4c0-7 16-7 16 0v4Zm18-14v3h-3v2h3v3h2v-3h3v-2h-3V7Z',
          'Set Priority': 'M3 3h3v19H3Zm3 1c7-6 8 8 14 1v11C13 22 13 8 6 14Z',
          'Mark Complete': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 14-4-4 1.500-1.500L10 13l6-6 1.500 1.500Z',
        };
        const b = u.el('div', 'abtn', ab);
        u.el('i', '', b).innerHTML = '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="' + ic[t] + '"/></svg>';
        u.el('span', '', b, t);
      });
      const btns = u.el('div', 'btns', main);
      if (!ctx.finish) u.el('div', 'cancel', btns, 'Cancel');
      const stage = u.el('div', 'stage', grid);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? headTools : btns;
        if (placement === 'footer' && collide) decoyBtn(parent, collide, true);
        if (placement === 'footer') {
          submit = u.el('button', 'submit', parent, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else if (placement === 'header') {
          submit = u.el('button', 'submit header-submit', parent, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else {
          submit = u.el('a', 'end-link', parent, label + ' ›');
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
