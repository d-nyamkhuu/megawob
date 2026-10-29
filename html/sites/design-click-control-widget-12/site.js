(function () {
  'use strict';
  const cfg = {
    title: 'Task Utility  -  Widget Practice',
    head: 'Tools are hidden',
    copy: 'The command ribbon is collapsed to give you more space.|Click the button to show the tools.',
    expand: 'Expand tools',
    icons: [
      [
        'Program Manager',
        '<svg viewBox="0 0 40 40"><rect x="5" y="4" width="28" height="22" fill="#000080" stroke="#000"/><rect x="9" y="8" width="20" height="14" fill="#fff"/><rect x="8" y="22" width="12" height="12" fill="#c0c0c0" stroke="#000"/><rect x="11" y="25" width="3" height="3" fill="#00a"/><rect x="15" y="25" width="3" height="3" fill="#0a0"/><rect x="11" y="29" width="3" height="3" fill="#a00"/><rect x="15" y="29" width="3" height="3" fill="#aa0"/></svg>',
      ],
      [
        'File Manager',
        '<svg viewBox="0 0 40 40"><rect x="9" y="4" width="22" height="30" fill="#ffff80" stroke="#000"/><rect x="13" y="10" width="14" height="4" fill="#fff" stroke="#000"/><path d="M13 19h14M13 23h14M13 27h14" stroke="#000"/></svg>',
      ],
      [
        'Recycle Bin',
        '<svg viewBox="0 0 40 40"><path d="M8 10h24l-3 25H11Z" fill="#c0c0c0" stroke="#000"/><path d="M8 10h24" stroke="#000" stroke-width="3"/><circle cx="20" cy="23" r="6" fill="none" stroke="#080" stroke-width="3"/></svg>',
      ],
      [
        'Notepad',
        '<svg viewBox="0 0 40 40"><rect x="8" y="6" width="24" height="29" fill="#fff" stroke="#000"/><rect x="8" y="6" width="24" height="7" fill="#00a0a0" stroke="#000"/><path d="M12 19h16M12 24h16M12 29h12" stroke="#008"/></svg>',
      ],
    ],
    tools: ['File', 'Edit', 'View', 'Insert', 'Format', 'Help'],
  };
  // Pixel-shaped desktop artwork uses the same small palette as the window frame.
  const iconArt = [
    '<path d="M9 2h25v23H9z" fill="#000080" stroke="#000"/><path d="M12 5h19v16H12z" fill="#808080" stroke="#fff"/><path d="M12 7h19v3H12z" fill="#00f"/><path d="M6 17h30v17H6z" fill="#c0c0c0" stroke="#000"/><path d="M9 20h24v3H9z" fill="#000080"/><path d="M3 22h23v17H3z" fill="#c0c0c0" stroke="#000"/><path d="M5 24h19v13H5z" fill="#fff"/><g fill="#0080b0" stroke="#000" stroke-width=".7"><path d="M7 26h4v4H7zM16 26h4v4h-4zM7 33h4v3H7zM16 33h4v3h-4zM29 25h4v4h-4z"/></g><path d="M4 23h21M7 18h28M10 3h23" stroke="#fff"/>',
    '<path d="M11 3h22v29l-5 5H8V8z" fill="#808040" stroke="#000"/><path d="M8 8h20v29H8z" fill="#ffffa0" stroke="#000"/><path d="M9 9h18v27H9z" fill="none" stroke="#fff"/><path d="m8 8 4-5h21l-5 5z" fill="#e0e0a0" stroke="#000"/><path d="M12 13h12v7H12z" fill="#202020"/><path d="M14 15h8v3h-8z" fill="#ffffc0"/><path d="M12 24h12M12 28h12M12 32h12" stroke="#000"/>',
    '<path d="m5 8 13-5 18 7-5 23-9 5L9 32z" fill="#a0a0a0" stroke="#000"/><path d="m5 8 17 7 14-5-18-7z" fill="#dedede" stroke="#000"/><path d="m8 9 10-4 14 5-10 4z" fill="#606060"/><path d="m22 15-1 20-11-5L6 11" fill="#c0c0c0"/><path d="m13 18 3-3 3 5-3-1-2 4-3-2 2-3m7 5 3 3-2 5-1-3-5-1 1-3 3 1" fill="#008020"/><path d="m6 8 16 7 13-5M9 12l3 18" fill="none" stroke="#fff"/>',
    '<path d="M10 8h24v28H10z" fill="#a0a0a0" stroke="#000"/><path d="M11 9h22v25H11z" fill="#fff"/><path d="M13 12h17M13 16h17M13 20h17M13 24h17M13 28h17M13 32h17" stroke="#808080"/><path d="m11 4 20 2-9 24H3z" fill="#00b0b0" stroke="#000"/><path d="m12 7 17 1-7 19H5z" fill="#00d0d0"/><path d="m12 12 13 1m-15 3 13 1m-15 3 13 1" stroke="#fff"/><g fill="#fff" stroke="#000" stroke-width=".6"><ellipse cx="12" cy="5" rx="1" ry="2"/><ellipse cx="16" cy="5" rx="1" ry="2"/><ellipse cx="20" cy="5" rx="1" ry="2"/><ellipse cx="24" cy="6" rx="1" ry="2"/><ellipse cx="28" cy="6" rx="1" ry="2"/></g>',
  ];
  cfg.icons.forEach(
    (i, n) => (i[1] = '<svg viewBox="0 0 40 40" shape-rendering="crispEdges">' + iconArt[n] + '</svg>'),
  );
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  // Build a fresh notice for every overlay, including notices scheduled after recovery.
  // Cloning a previously dismissed (hidden) notice gives the oracle a zero-size button.
  function ribbonNotice(u, ribbon, onDismiss) {
    const obstacle = u.el('div', 'design-obstacle ribbon-recovery', ribbon);
    const tbx = u.el('span', 'toolbox', obstacle);
    tbx.innerHTML =
      '<svg viewBox="0 0 170 140" shape-rendering="crispEdges"><path d="M9 42h142l12 15v73l-12 8H9z" fill="#808080" stroke="#000020" stroke-width="3"/><path d="M9 60h142v78H9z" fill="#b0b0b0" stroke="#000020" stroke-width="3"/><path d="M9 42h142l12 15-12 17H7V57z" fill="#c0c0c0" stroke="#000020" stroke-width="3"/><path d="m9 43 139 1-9 13H9M10 78v57h136" fill="none" stroke="#fff" stroke-width="3"/><path d="M48 51V24h68v27h-9V34H57v17z" fill="#0000c0" stroke="#000020" stroke-width="3"/><path d="M49 26h65M51 29v18M58 37h47" stroke="#8080ff" stroke-width="3"/><path d="M151 78v52M12 137h136" stroke="#404040" stroke-width="3"/></svg>';
    const tx = u.el('div', 'otext', obstacle);
    u.el('h2', '', tx, cfg.head);
    cfg.copy.split('|').forEach((t) => u.el('p', '', tx, t));
    const dismiss = u.el('button', 'dismiss-design', obstacle);
    dismiss.type = 'button';
    dismiss.innerHTML = cfg.expand + ' <span class="tri"></span>';
    dismiss.addEventListener('click', onDismiss);
    return { el: obstacle, dismiss };
  }
  env.site({
    name: 'design-click-control-widget-12',
    styles: ['site.css', 'site2.css'],
    initialOverlay: { kind: 'chat', p: 1 },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref win31';
      const compact = ctx.size && (ctx.size.width < 1180 || ctx.size.height < 700);
      let display = ctx.display || 'header';
      if (compact && (display === 'panel' || display === 'toast')) display = 'header';
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['stage', 'stage', 'footer', 'title']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const alternateLabels = endLabels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
      const label = ctx.finish
        ? null
        : placement === 'stage'
          ? 'Submit'
          : labelOf(er.pick(alternateLabels.length ? alternateLabels : endLabels));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(endLabels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = cr.pick(options);
      }
      const desk = u.el('div', 'desk', document.body);
      cfg.icons.forEach((i) => {
        const d = u.el('div', 'dicon', desk);
        const g = u.el('span', 'dglyph', d);
        g.innerHTML = i[1];
        u.el('span', 'dlabel', d, i[0]);
      });
      const win = u.el('main', 'win', document.body);
      const tb = u.el('header', 'titlebar', win);
      u.el('span', 'sysmenu', tb);
      u.el('span', 'ttext', tb, cfg.title);
      let submit = null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (placement === 'title') submit = endButton(tb, 'end-title');
      const wc = u.el('span', 'wctl', tb);
      [
        '<svg viewBox="0 0 16 16"><path d="M4 12h6" stroke="#000" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z" fill="none" stroke="#000" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13" stroke="#000" stroke-width="2.2"/></svg>',
      ].forEach((s) => {
        const b = u.el('i', '', wc);
        b.innerHTML = s;
      });
      const ribbon = u.el('section', 'ribbon', win);
      const strip = u.el('div', 'strip', ribbon);
      cfg.tools.forEach((t, i) => {
        const g = u.el('div', 'tgroup', strip);
        u.el('b', '', g, t);
        const row = u.el('div', '', g);
        ['■', '▲', '●'].forEach((c) => u.el('span', 'tbtn', row, c));
      });
      const work = u.el('div', 'work', win);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.style.setProperty(
        '--instruction-size',
        `clamp(22px,${Math.min(3.35, 110 / ctx.instruction.length)}vw,56px)`,
      );
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', center);
      if (placement === 'stage') {
        const act = u.el('div', 'actions', center);
        submit = endButton(act, 'submit');
      }
      const foot = u.el('footer', 'footer', win);
      u.el('span', 'ready', foot, 'Ready.');
      if (placement === 'footer') submit = endButton(foot, 'end-footer');
      if (collide) {
        const d = u.el('button', 'end-xtra', placement === 'footer' ? tb : foot, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      u.el('span', 'cell', foot, 'Task 1 of 1');
      const p = u.el('span', 'cell paused', foot);
      p.innerHTML = '<i></i><i></i> Paused';
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const ribbon = document.querySelector('.ribbon');
        return ribbonNotice(ctx.util, ribbon, () => ctx.dismiss());
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind + ' win-dialog', document.body);
      const t = ctx.util.el(
        'div',
        'dlg-title',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Tip of the Day',
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
          chat: 'This short tour will show you around the interface.',
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
