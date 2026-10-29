(function () {
  'use strict';
  const ICON = {
    folder:
      '<svg viewBox="0 0 32 30"><defs><linearGradient id="folderGold" x2="0" y2="1"><stop stop-color="#fff5bc"/><stop offset=".45" stop-color="#ffe17a"/><stop offset="1" stop-color="#edb52d"/></linearGradient></defs><path d="M2 6q0-2 2-2h10l3 4h12v19H2Z" fill="#efc14b" stroke="#a57a28" stroke-width="1.3"/><path d="M3 12h27l-4 15H1Z" fill="url(#folderGold)" stroke="#b58a29" stroke-width="1.3"/><path d="M4 13h23M4 6h9" stroke="#fff9cf" stroke-width="1.4"/></svg>',
    doc: '<svg viewBox="0 0 22 28"><defs><linearGradient id="docPaper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dbeaff"/></linearGradient></defs><path d="M2 1h12l6 6v20H2Z" fill="url(#docPaper)" stroke="#376fb5" stroke-width="1.2"/><path d="M14 1v7h6M5 12h11M5 16h11M5 20h11" fill="none" stroke="#438de6" stroke-width="1.2"/></svg>',
    new: '<svg viewBox="0 0 22 28"><defs><linearGradient id="newPaper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f1f5ff"/></linearGradient></defs><path d="M2 1h12l6 6v20H2Z" fill="url(#newPaper)" stroke="#6a8bb9" stroke-width="1.3"/><path d="M14 1v7h6" fill="none" stroke="#6a8bb9" stroke-width="1.2"/></svg>',
    team: '<svg viewBox="0 0 32 32"><defs><linearGradient id="teamBlue" x2="0" y2="1"><stop stop-color="#9ed7ff"/><stop offset="1" stop-color="#1876ce"/></linearGradient><linearGradient id="teamSkin" x2="1" y2="1"><stop stop-color="#ffe6bc"/><stop offset="1" stop-color="#cd864e"/></linearGradient></defs><path d="M17 18c4-5 10-2 12 2l1 8-12 1Z" fill="url(#teamBlue)" stroke="#20568b"/><ellipse cx="22" cy="10" rx="5" ry="7" fill="url(#teamSkin)" stroke="#9b653c"/><path d="M17 10V7q3-7 9-2l1 5-3-4-3 2-4-1Z" fill="#a45d31"/><path d="M2 21c3-6 11-6 14 0l2 8q-8 3-17-1Z" fill="url(#teamBlue)" stroke="#20568b"/><ellipse cx="10" cy="11" rx="5" ry="7" fill="url(#teamSkin)" stroke="#9b653c"/><path d="M5 11V7q1-5 6-4l4 3-1 5-2-5-6 2Z" fill="#8d542f"/><path d="m7 18 3 4 3-4M19 17l3 3 3-3" fill="#fff" stroke="#87a6be" stroke-width=".6"/></svg>',
    gear: '<svg viewBox="0 0 32 32"><defs><linearGradient id="gearBlue" x2="0" y2="1"><stop stop-color="#b6d9ff"/><stop offset=".5" stop-color="#77b3f2"/><stop offset="1" stop-color="#2977ce"/></linearGradient></defs><path d="m13 1 6 0 1 5 3 1 4-3 4 4-3 4 1 3 4 1v6l-5 1-1 3 3 4-4 3-4-3-3 1-1 4h-6l-1-5-3-1-4 3-4-4 3-4-1-3-4-1v-6l5-1 1-3-3-4 4-4 4 3 3-1Z" transform="translate(2 1) scale(.85)" fill="url(#gearBlue)" stroke="#1c5ba6" stroke-width="1.5"/><circle cx="16" cy="16" r="5" fill="#e4efff" stroke="#3678b9" stroke-width="2"/></svg>',
    disk: '<svg viewBox="0 0 32 32"><defs><linearGradient id="diskBlue" x2="1" y2=".5"><stop stop-color="#5ba8f5"/><stop offset=".3" stop-color="#0046bb"/><stop offset="1" stop-color="#0754bb"/></linearGradient><linearGradient id="diskMetal"><stop stop-color="#aeb8c6"/><stop offset=".3" stop-color="#fff"/><stop offset="1" stop-color="#bbc8d5"/></linearGradient></defs><path d="M3 1h25l3 3v26H2V2Z" fill="url(#diskBlue)" stroke="#052d7a" stroke-width="1.4"/><path d="M7 2h18v12H7Z" fill="url(#diskMetal)" stroke="#173d6c"/><path d="M20 2h4v10h-4Z" fill="#a42f20"/><path d="M7 19h18v11H7Z" fill="#f7faff" stroke="#134277"/><path d="M10 22h10M10 25h10" stroke="#b9cadf"/><path d="M4 3v24" stroke="#a4d3ff"/></svg>',
    find: '<svg viewBox="0 0 32 32"><defs><linearGradient id="lensBlue" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".4" stop-color="#b7dcff"/><stop offset="1" stop-color="#4f9ee6"/></linearGradient></defs><path d="m19 19 10 10q1 3-2 3L17 22Z" fill="#ac4825" stroke="#713b26" stroke-width="1.5"/><circle cx="12" cy="12" r="10" fill="url(#lensBlue)" stroke="#6c8cae" stroke-width="1.5"/><path d="M5 12q0-7 8-7" fill="none" stroke="#fff" stroke-width="2"/></svg>',
    print:
      '<svg viewBox="0 0 32 32"><defs><linearGradient id="printSilver" x2="0" y2="1"><stop stop-color="#e8eff8"/><stop offset=".4" stop-color="#9eabb9"/><stop offset="1" stop-color="#dae3ec"/></linearGradient></defs><path d="M8 2h15l2 15H6Z" fill="#f9fcff" stroke="#6d8da9" stroke-width="1.4"/><path d="M9 7h12M9 10h12" stroke="#b2c6d7"/><path d="M3 14h25l2 5v9H2V18Z" fill="url(#printSilver)" stroke="#5d6f86" stroke-width="1.3"/><path d="M7 21h17v10H7Z" fill="#fff" stroke="#677d94"/><path d="M9 24h13M9 27h13" stroke="#a8bdd1"/><path d="M5 18h3" stroke="#2a782b" stroke-width="2"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1c64c8" stroke="#0b3c8c"/><rect x="10.5" y="10" width="3" height="8" fill="#fff"/><circle cx="12" cy="6.5" r="1.8" fill="#fff"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1c64c8" stroke="#0b3c8c"/><text x="12" y="17" font-size="15" font-weight="700" text-anchor="middle" fill="#fff">?</text></svg>',
    mon: '<svg viewBox="0 0 40 34"><defs><linearGradient id="monitorSky" x2=".8" y2="1"><stop stop-color="#bce9ff"/><stop offset=".4" stop-color="#42b2fc"/><stop offset="1" stop-color="#0874d7"/></linearGradient></defs><path d="M16 25h8l1 6H15Z" fill="#b7c4d1" stroke="#6c7f97"/><path d="M12 31h16l2 2H10Z" fill="#d1d9e0" stroke="#6c7f97"/><rect x="1" y="1" width="38" height="26" rx="2" fill="#e4e3d5" stroke="#75889e"/><rect x="3" y="3" width="34" height="22" fill="#364c6e"/><path d="M5 5h30v18H5Z" fill="url(#monitorSky)"/><path d="m5 18 30-11v5L5 23Z" fill="#4a9fe7" opacity=".6"/></svg>',
    clip: '<svg viewBox="0 0 24 30"><rect x="2" y="4" width="20" height="25" rx="2" fill="#1870d6" stroke="#153d9a" stroke-width="1.5"/><rect x="5" y="7" width="14" height="19" fill="#fffdf1"/><path d="M9 3a3 3 0 0 1 6 0v4H9Z" fill="#92b8e2" stroke="#15408e"/><path d="M10 12h6M10 17h6M10 22h6" stroke="#3678cb"/><path d="M7 12h1M7 17h1M7 22h1" stroke="#d2652a" stroke-width="1.6"/></svg>',
    win: '<svg viewBox="0 0 32 32"><defs><linearGradient id="flagRed"><stop stop-color="#ffb574"/><stop offset=".45" stop-color="#f66c2b"/><stop offset="1" stop-color="#cb421c"/></linearGradient><linearGradient id="flagGreen"><stop stop-color="#a4dd54"/><stop offset=".5" stop-color="#84c636"/><stop offset="1" stop-color="#3c8d20"/></linearGradient><linearGradient id="flagBlue"><stop stop-color="#71c6fa"/><stop offset=".5" stop-color="#218cdb"/><stop offset="1" stop-color="#1d68bb"/></linearGradient><linearGradient id="flagGold"><stop stop-color="#fff49a"/><stop offset=".5" stop-color="#fbd838"/><stop offset="1" stop-color="#f0aa11"/></linearGradient></defs><path d="M5 4q6-3 11 0l-3 11q-5-3-11 0Z" fill="url(#flagRed)" stroke="#995223" stroke-width=".6"/><path d="M18 5q6 3 11 0l-3 11q-6 3-11 0Z" fill="url(#flagGreen)" stroke="#578129" stroke-width=".6"/><path d="M2 17q6-3 11 0l-3 11q-5-3-10 0Z" fill="url(#flagBlue)" stroke="#246a9d" stroke-width=".6"/><path d="M15 18q6 3 11 0l-3 11q-6 3-11 0Z" fill="url(#flagGold)" stroke="#b89b25" stroke-width=".6"/><path d="M6 5q4-2 8 0M19 6q5 2 8 0M3 18q4-2 8 0M16 19q5 2 8 0" fill="none" stroke="#fff" opacity=".5"/></svg>',
  };
  const END_FALLBACK = [
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
  ];
  function labelOf(x) {
    return typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
  }
  function ctl(parent, u, big) {
    const c = u.el('span', 'xp-ctl', parent);
    c.innerHTML = '<i class="min"><b></b></i><i class="max"><b></b></i><i class="cls">&#x2715;</i>';
    return c;
  }
  env.site({
    name: 'design-click-control-collapsible-12',
    styles: ['xp.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'xp';
      const endR = ctx.rng.fork('chrome/end');
      const labelBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK;
      const referenceEnd = endR.bool(0.5);
      const endLabel = referenceEnd ? 'Submit' : labelOf(endR.pick(labelBank));
      const placementPick = ctx.finish ? null : endR.pick(['footer', 'footer', 'toolbar', 'link']);
      const placement = ctx.finish ? null : referenceEnd ? 'footer' : placementPick;
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(labelBank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = collideR.pick(options);
      }
      let display = ctx.display || 'header';
      if (display === 'panel' && (window.innerWidth < 1260 || window.innerHeight < 700)) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      document.body.dataset.instr = display;
      let submit = null;
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'xp-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const desk = u.el('main', 'desk', document.body);
      const win = u.el('section', 'xp-win main-win', desk);
      const tb = u.el('div', 'xp-title', win);
      u.el('span', 'ti', tb).innerHTML = ICON.folder;
      u.el('span', 'tt', tb, 'Project Navigator');
      ctl(tb, u);
      const mb = u.el('div', 'xp-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((s) => u.el('span', '', mb, s));
      const tools = u.el('div', 'xp-tools', win);
      [
        ['new', 'New'],
        ['folder', 'Open'],
        ['disk', 'Save'],
        ['|'],
        ['print', 'Print'],
        ['|'],
        ['find', 'Find'],
      ].forEach((t) => {
        if (t[0] === '|') {
          u.el('span', 'sep', tools);
          return;
        }
        const b = u.el('span', 'tbtn', tools);
        b.innerHTML = ICON[t[0]] + '<em>' + t[1] + '</em>';
      });
      if (!ctx.finish && placement === 'toolbar') submit = endBtn(tools, 'xp-toolbar-end', endLabel);
      if (collide) {
        const b = u.el('button', 'xp-pq', tools, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const body = u.el('div', 'xp-body', win);
      const rail = u.el('nav', 'tree', body);
      rail.innerHTML =
        '<div class="n0"><i class="tri">&#9662;</i>' +
        ICON.folder +
        '<span>Project Alpha</span></div>' +
        ['Overview', 'Tasks', 'Documents', 'Team', 'Settings']
          .map(
            (s, i) =>
              '<div class="n1' +
              (s === 'Tasks' ? ' cur' : '') +
              '">' +
              (s === 'Team' ? ICON.team : s === 'Settings' ? ICON.gear : ICON.doc) +
              '<span>' +
              s +
              '</span></div>',
          )
          .join('');
      if (display === 'panel') {
        const task = u.el('div', 'xp-task-panel', rail);
        u.el('strong', '', task, 'Task');
        u.el('div', '', task, ctx.instruction);
      }
      const center = u.el('section', 'center', body);
      const hd = u.el('div', 'pane-head', center);
      u.el('span', 'hi', hd).innerHTML = ICON.clip;
      u.el('span', 'ht', hd, 'Tasks');
      u.el('span', 'sa', hd).innerHTML = '<a>Show All</a> <i>&#9660;</i>';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display !== 'header';
      note.dataset.icon = '1';
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'xp-foot', win);
      const hb = u.el('button', 'xp-btn help', foot);
      hb.type = 'button';
      hb.innerHTML = ICON.help + '<span>Help</span>';
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'submit xp-btn', endLabel);
      if (!ctx.finish && placement === 'link') submit = endBtn(foot, 'xp-endlink', endLabel + ' ›');
      const cn = u.el('button', 'xp-btn cancel', foot, 'Cancel');
      cn.type = 'button';
      u.el('div', 'xp-status', win, 'Ready');
      // secondary window
      const v = u.el('section', 'xp-win opt-win', desk);
      const vt = u.el('div', 'xp-title', v);
      u.el('span', 'ti', vt).innerHTML = ICON.gear;
      u.el('span', 'tt', vt, 'View Options');
      ctl(vt, u);
      const vb = u.el('div', 'opt-body', v);
      const top = u.el('div', 'opt-top', vb);
      u.el('span', 'mon', top).innerHTML = ICON.mon;
      const tx = u.el('div', 'opt-tx', top);
      u.el('h3', '', tx, 'View Options');
      u.el('p', '', tx, 'Customize how items are displayed. This only saves your view preferences.');
      const f = u.el('div', 'opt-form', vb);
      f.innerHTML =
        '<label>Group by:</label><div class="sel">Section<i>&#9660;</i></div><label>Sort by:</label><div class="sel">Title (A - Z)<i>&#9660;</i></div><label>Show columns:</label><div class="cols"><div><b class="ck on">&#10003;</b>Item count</div><div><b class="ck on">&#10003;</b>Last modified</div><div><b class="ck"></b>Owner</div><div><b class="ck"></b>Status</div></div>';
      const ob = u.el('div', 'opt-btns', vb);
      const sv = u.el('button', 'xp-btn save', ob);
      sv.type = 'button';
      sv.innerHTML = ICON.disk + '<span>Save view</span>';
      sv.addEventListener('click', () => env.log('decoy', { label: 'Save view' }));
      const rs = u.el('button', 'xp-btn', ob, 'Reset');
      rs.type = 'button';
      const rb = u.el('div', 'recycle', desk);
      rb.innerHTML =
        '<svg viewBox="0 0 44 48"><defs><linearGradient id="binGlass"><stop stop-color="#fff"/><stop offset=".5" stop-color="#cbecff"/><stop offset="1" stop-color="#91bad9"/></linearGradient></defs><path d="m3 9 27-5 11 5-4 31-20 6-9-5Z" fill="url(#binGlass)" stroke="#d7e9ff" stroke-width="1.5"/><path d="m3 9 12 5 26-5-12-5Z" fill="#f1faff"/><path d="m15 14 2 31M7 14l5 25" stroke="#fff" opacity=".8" stroke-width="2"/><path d="m26 18 5 1-3 6-2-3-6 2 1-5Zm7 8 2 5-6 3 1-3-5-2 3-4Zm-10 4-3 5 5 3 1-4 5-1-2 5-7 3-7-6 4-6Z" fill="#279645" stroke="#2c8e48" stroke-width=".4"/></svg><span>Recycle Bin</span>';
      const bar = u.el('footer', 'taskbar', document.body);
      bar.innerHTML =
        '<div class="start">' +
        ICON.win +
        '<span>start</span></div><div class="tk">' +
        ICON.folder +
        '<span>Project Navigator</span></div><div class="tk on">' +
        ICON.gear +
        '<span>View Options</span></div><div class="tray"><svg viewBox="0 0 24 24"><path d="M3 3h17v12H3Z" fill="#d9e6ff" stroke="#1c478c"/><path d="M6 5h11v7H6Z" fill="#1d64c2"/><path d="M7 16h10l2 3H5Z" fill="#fff" stroke="#6f85b0"/><path d="m15 12 7 2-1 7-6-2Z" fill="#e3d07a" stroke="#475a8d"/></svg><svg viewBox="0 0 24 24"><path d="M2 9h5l6-5v16l-6-5H2Z" fill="#d9e9ff" stroke="#3863a6"/><path d="M16 7q6 5 0 10M19 4q8 8 0 16" fill="none" stroke="#e8f1ff" stroke-width="2"/></svg><span>10:24 AM</span></div>';
      if (display === 'toast') {
        const toast = u.el('div', 'xp-toast', document.body);
        u.el('span', 'toast-info', toast, 'i');
        u.el('div', '', toast, ctx.instruction);
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
