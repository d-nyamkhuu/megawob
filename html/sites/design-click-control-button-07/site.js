(function () {
  'use strict';
  const cfg = { theme: 'ribbon', layout: 'ledger' };
  const I = {
    new: '<svg viewBox="0 0 32 32"><rect x="6" y="5" width="18" height="23" rx="2" fill="#e8b85a" stroke="#a87a28"/><rect x="11" y="3" width="8" height="5" fill="#8a8f98"/><rect x="12" y="11" width="14" height="17" fill="#fff" stroke="#9aa"/></svg>',
    edit: '<svg viewBox="0 0 32 32"><rect x="3" y="4" width="23" height="25" fill="#f8fcff" stroke="#8d97a6"/><path d="M6 7h10M6 10h8M6 25h13" stroke="#ced9e4"/><path d="M10 24 25 6l3 3-15 17-5 2z" fill="#96a6b6" stroke="#6b7e8e"/><path d="m24 7 3-3 3 3-3 3z" fill="#edb267" stroke="#cd9745"/><path d="m8 28 2-5 3 3z" fill="#3a4650"/><path d="M12 23 26 7" stroke="#dae7f0"/></svg>',
    del: '<svg viewBox="0 0 32 32"><path d="M7 7l18 18M25 7 7 25" stroke="#7b838f" stroke-width="5" stroke-linecap="round"/></svg>',
    ok: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#3aa84a" stroke="#2a7d36"/><path d="m9 16 5 5 9-10" fill="none" stroke="#fff" stroke-width="3.5"/></svg>',
    up: '<svg viewBox="0 0 32 32"><path d="M16 4 5 16h7v12h8V16h7z" fill="#4a90e2" stroke="#2f6bb5"/></svg>',
    down: '<svg viewBox="0 0 32 32"><path d="M16 28 5 16h7V4h8v12h7z" fill="#4a90e2" stroke="#2f6bb5"/></svg>',
    mail: '<svg viewBox="0 0 32 32"><rect x="3" y="7" width="26" height="18" fill="#f4f6f9" stroke="#8d97a6"/><path d="m3 8 13 10L29 8" fill="none" stroke="#8d97a6"/></svg>',
    flag: '<svg viewBox="0 0 32 32"><path d="M7 3v27" stroke="#9b9b93" stroke-width="3"/><path d="M7 3v27" stroke="#5e686d"/><path d="M8 4h19v13H8z" fill="#e53935" stroke="#b34736"/><path d="M11 5v11" stroke="#fa8973"/></svg>',
    cat: '<svg viewBox="0 0 32 32"><rect x="3" y="3" width="12" height="12" fill="#e8523a" stroke="#e0a18e"/><rect x="17" y="3" width="12" height="12" fill="#a8c955" stroke="#c8d895"/><rect x="3" y="17" width="12" height="12" fill="#3b8de0" stroke="#82b7e8"/><rect x="17" y="17" width="12" height="12" fill="#798bdc" stroke="#a9b0e5"/></svg>',
    pri: '<svg viewBox="0 0 32 32"><rect x="13.5" y="3" width="5" height="17" rx="2" fill="#e5352b"/><circle cx="16" cy="26" r="3" fill="#e5352b"/></svg>',
    due: '<svg viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="25" rx="1" fill="#fff" stroke="#8c9bad"/><rect x="4" y="5" width="24" height="6" fill="#4a90d2"/><path d="M9 3v5M23 3v5" stroke="#788ba3" stroke-width="2"/><path d="M8 14h3v3H8zm6 0h3v3h-3zm6 0h3v3h-3zM8 19h3v3H8zm6 0h3v3h-3zm6 0h3v3h-3zM8 24h3v3H8zm6 0h3v3h-3zm6 0h3v3h-3z" fill="#93a5b6"/><path d="M14 14h3v3h-3" fill="#df6760"/><path d="M8 19h3v3H8" fill="#e9c56c"/></svg>',
    ref: '<svg viewBox="0 0 32 32"><path d="M2 15A13 13 0 0 1 24 6l5-4-1 12-12-1 5-4A8 8 0 0 0 6 15z" fill="#56b7d4" stroke="#489db7" stroke-width=".6"/><path d="M30 18A13 13 0 0 1 8 27l-5 4 1-12 12 1-5 4A8 8 0 0 0 26 18z" fill="#56b7d4" stroke="#489db7" stroke-width=".6"/></svg>',
  };
  const groups = [
    [
      'Tasks',
      [
        ['New<br>Task', 'new'],
        ['Edit', 'edit'],
        ['Delete', 'del'],
      ],
    ],
    [
      'Organize',
      [
        ['Mark<br>Complete', 'ok'],
        ['Move Up', 'up'],
        ['Move Down', 'down'],
      ],
    ],
    [
      'Manage',
      [
        ['Assign', 'mail'],
        ['Follow Up', 'flag'],
      ],
    ],
    [
      'Tags',
      [
        ['Categorize', 'cat'],
        ['Priority', 'pri'],
        ['Due Date', 'due'],
      ],
    ],
    ['View', [['Refresh', 'ref']]],
  ];
  const rows = [
    ['1', 'Plan kickoff meeting', 'Not Started', 'High', 'Apr 28, 2025', 'Alex Carter'],
    ['2', 'Design mockups', 'In Progress', 'Medium', 'Apr 30, 2025', 'Jamie Park'],
    ['3', 'Develop prototype', 'Not Started', 'High', 'May 5, 2025', 'Taylor Kim'],
    ['4', 'User testing', 'Not Started', 'Medium', 'May 8, 2025', 'Morgan Lee'],
    ['5', 'Prepare launch plan', 'Not Started', 'Low', 'May 12, 2025', 'Casey Brown'],
  ];
  const PR = {
    High: '<i class="pr hi">&#8963;</i>',
    Medium: '<i class="pr md"></i>',
    Low: '<i class="pr lo">&#8595;</i>',
  };
  env.site({
    name: 'design-click-control-button-07',
    styles: ['site.css', 'ribbon.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const originalEnd = endRng.bool(0.5);
      const endLabel = originalEnd ? 'Submit' : endRng.pick(endLabels);
      const endPlacement = originalEnd ? 'status' : endRng.pick(['ribbon', 'ledger']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((l) => l.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      const shell = u.el('main', 'shell', document.body);
      const title = u.el('div', 'rb-title', shell);
      const appIcon = u.el('span', 'rb-ico', title);
      appIcon.innerHTML =
        '<svg viewBox="0 0 20 20"><path d="M3 2h13v16H3z" fill="#fff8d0" stroke="#9caaaf"/><path d="M4 3h11v4H4z" fill="#e7be47"/><path d="m4 9 3 2 2-5 3 7 4-4v8H4z" fill="#8cc7dc"/><path d="m4 9 3 2 2-5 3 7 4-4" fill="none" stroke="#fff" stroke-width="1.2"/><path d="M5 15h8M5 17h8" stroke="#659bbd"/></svg>';
      u.el('span', '', title, 'Task Manager - Projects');
      const wc = u.el('span', 'rb-wc', title);
      wc.innerHTML =
        '<i><svg viewBox="0 0 20 14"><path d="M5 10h10"/></svg></i><i><svg viewBox="0 0 20 14"><path d="M5 3h10v8H5zM5 5h10"/></svg></i><i class="x"><svg viewBox="0 0 20 14"><path d="m6 3 8 8M14 3l-8 8"/></svg></i>';
      const tabs = u.el('div', 'rb-tabs', shell);
      ['Home', 'View', 'Tools', 'Help'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      u.el('span', 'rb-help', tabs, '?');
      const rib = u.el('div', 'rb-ribbon', shell);
      groups.forEach((g) => {
        const gr = u.el('div', 'rb-group', rib);
        const bs = u.el('div', 'rb-btns', gr);
        g[1].forEach((b) => {
          const bt = u.el('div', 'rb-big', bs);
          const ic = u.el('span', 'rb-icon', bt);
          ic.innerHTML = I[b[1]];
          const svg = ic.querySelector('svg');
          const grad = 'rb-grad-' + b[1];
          svg.insertAdjacentHTML(
            'afterbegin',
            '<defs><linearGradient id="' +
              grad +
              '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#143e64" stop-opacity=".18"/></linearGradient></defs>',
          );
          const gloss = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          Array.from(svg.children)
            .filter((n) => n.tagName !== 'defs')
            .forEach((n) => {
              const c = n.cloneNode(true);
              c.setAttribute('fill', 'url(#' + grad + ')');
              c.setAttribute('stroke', 'none');
              gloss.appendChild(c);
            });
          svg.appendChild(gloss);
          const l = u.el('span', 'rb-lab', bt);
          l.innerHTML = b[0];
        });
        u.el('div', 'rb-gname', gr, g[0]);
      });
      const work = u.el('div', 'work rb-main', shell);
      const center = u.el('section', 'center', work);
      const led = u.el('div', 'rb-ledger', center);
      const ledgerHeading = u.el('div', 'rb-ph', led, 'Project Tasks');
      const tb = u.el('table', 'rb-table', led);
      const hr = u.el('tr', '', u.el('thead', '', tb));
      ['ID', 'Task Name', 'Status', 'Priority', 'Due Date', 'Assigned To'].forEach((h) => u.el('th', '', hr, h));
      const body = u.el('tbody', '', tb);
      rows.forEach((r, i) => {
        const tr = u.el('tr', i === 0 ? 'sel' : '', body);
        u.el('td', 'id', tr, r[0]);
        u.el('td', '', tr, r[1]);
        const st = u.el('td', '', tr);
        st.innerHTML = '<i class="dot ' + (r[2] === 'In Progress' ? 'blue' : '') + '"></i>' + r[2];
        const pr = u.el('td', '', tr);
        pr.innerHTML = PR[r[3]] + r[3];
        u.el('td', '', tr, r[4]);
        u.el('td', '', tr, r[5]);
      });
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.instruction.length > 55) note.classList.add('long-instruction');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const side = u.el('aside', 'rb-side', work);
      const det = u.el('div', 'rb-details', side);
      u.el('div', 'rb-ph', det, 'Task Details');
      const form = u.el('div', 'rb-form', det);
      [
        ['ID:', '1', 't'],
        ['Task Name:', 'Plan kickoff meeting', 'in'],
        ['Status:', '<i class="dot"></i>Not Started', 'dd'],
        ['Priority:', '<i class="pr hi">&#8963;</i>High', 'dd'],
        ['Due Date:', 'Apr 28, 2025', 'dt'],
        ['Assigned To:', 'Alex Carter', 'dd w'],
        ['Notes:', 'Schedule meeting with project stakeholders to align on goals and timeline.', 'nt'],
      ].forEach((f) => {
        u.el('label', '', form, f[0]);
        const v = u.el('div', 'f ' + f[2], form);
        v.innerHTML = f[1];
      });
      if (ctx.display === 'panel') {
        const card = u.el('section', 'rb-task-note', side);
        u.el('div', 'rb-ph', card, 'Action item');
        card.appendChild(note);
      }
      const pv = u.el('div', 'rb-preview', side);
      const ph = u.el('div', 'rb-ph', pv, 'Preview');
      const pc = u.el('span', 'pc', ph);
      pc.innerHTML = '<b>&#8212;</b><b>&#10005;</b>';
      const doc = u.el('div', 'rb-doc', pv);
      doc.innerHTML =
        '<div class="sc"></div><div class="pg"><h3>Project Kickoff Meeting</h3><hr><h4>Agenda</h4><ol><li>Introductions</li><li>Project goals</li><li>Timeline overview</li><li>Next steps</li></ol></div>';
      const sb = u.el('div', 'rb-status', shell);
      u.el('span', 'cnt', sb, '5 tasks');
      const right = u.el('span', 'rb-sr', sb);
      let submit = null;
      if (collideLabel) {
        const decoy = u.el('button', 'rb-xtra', right, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      if (!ctx.finish) {
        let endParent = right;
        if (endPlacement === 'ribbon') {
          endParent = u.el('div', 'rb-end-tools', rib);
          u.el('span', 'rb-end-caption', endParent, 'Task review');
        } else if (endPlacement === 'ledger') endParent = ledgerHeading;
        submit = u.el('button', 'submit rb-end-' + endPlacement, endParent, endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      u.el('span', 'zoom', right, '100%');
      u.el('span', 'slider', right);
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
