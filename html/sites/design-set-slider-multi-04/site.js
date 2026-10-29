/* DraftPro 2014: CAD drafting window, blueprint canvas on the left, properties inspector on the right. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    new: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
    newc: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/><circle cx="17" cy="17" r="4" fill="#3b9cff" stroke="none"/>',
    open: '<path d="M2 6h7l2 3h10v11H2z" fill="#f4bc16" stroke="#9b7410"/><path d="M2 20l3-10h17l-3 10z" fill="#ffd12c" stroke="#a77b0e"/>',
    save: '<path d="M4 4h14l3 3v13H4z" fill="#9aa7b6"/><path d="M8 4v6h8V4M7 20v-6h10v6"/>',
    print:
      '<path d="M7 3h10v6H7zM4 9h16v9h-4v3H8v-3H4z" fill="#c4ccd6"/><path d="M8 15h8v6H8z" fill="#e4e9ee" stroke="#46535e"/><path d="M7 12h2" stroke="#354652"/>',
    undo: '<path d="M9 5L4 10l5 5M4 10h11a5 5 0 014 8"/>',
    redo: '<path d="M15 5l5 5-5 5M20 10H9a5 5 0 00-4 8"/>',
    zin: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6M7 10h6M10 7v6"/>',
    zout: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6M7 10h6"/>',
    zall: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6M7 10h6M10 7v6"/>',
    hand: '<path d="M7 21l-4-8q-1-3 2-2l3 3V5q0-2 2-1v8-10q2-2 3 0v10-9q2-1 3 1v9-7q2-1 3 1v8l-3 6z" fill="#d8dee6"/>',
    pan: '<path d="M7 21l-4-8 3-1 3 3-3-11 2-1 4 10-1-12 2-1 2 13 2-10 2 1-1 10 3-5 2 2-5 10zM8 16l3 3h4l3-4"/>',
    zwin: '<circle cx="10" cy="10" r="7" fill="#2a8cf0"/><path d="M15 15l6 6"/>',
    line: '<path d="M4 20L20 4"/>',
    circ: '<circle cx="12" cy="12" r="8"/>',
    rect: '<rect x="4" y="6" width="16" height="12"/>',
    poly: '<path d="M3 21l3-8 5-2 3-7h7l-3 7-5 2-3 8zM4 18l5-3 7 1" />',
    dim1: '<path d="M3 4h18M3 20h18M5 2v4M19 2v4M5 18v4M19 18v4M10 12h5"/>',
    dim2: '<path d="M3 5h18M3 20h18M5 18L19 7M3 18h4M17 7h4"/>',
    dim3: '<path d="M4 20L20 6v14zM9 20l9-8" />',
    snap: '<path d="M3 17h18v5H3z" fill="#11b3e8"/><path d="M6 12l2-5 3 2-3 4zM14 10l3-7 2 2-3 6z" stroke="#f0d887"/>',
  };
  const TOOLS = [
    'new',
    'newc',
    'open',
    'save',
    '|',
    'print',
    '|',
    'undo',
    'redo',
    '||',
    'zin',
    'zout',
    'zall',
    '||',
    'hand',
    'zwin',
    'pan',
    '||',
    'line',
    'circ',
    'rect',
    'poly',
    '||',
    'dim1',
    'dim2',
    'dim3',
    '||',
    'snap',
  ];

  function icon(parent, key) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'ico');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', '#dfe6ee');
    s.setAttribute('stroke-width', '1.6');
    s.innerHTML = ICONS[key];
    parent.appendChild(s);
    if (['save', 'pan', 'line', 'circ', 'rect', 'dim1', 'dim2', 'snap'].includes(key)) parent.classList.add('dropdown');
  }

  function drawing(parent) {
    const cy = '#9fe6ee';
    const y = (cx, cyy) => `<rect x="${cx - 6}" y="${cyy - 6}" width="12" height="12" fill="#ffe800"/>`;
    const cross = (x, yy, r, e) =>
      `<circle cx="${x}" cy="${yy}" r="${r}"/><path d="M${x - e} ${yy}H${x + e}M${x} ${yy - e}V${yy + e}" stroke-width="1.2" stroke-dasharray="28 8 6 8"/>`;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 116 1272 786');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('class', 'drawing');
    svg.innerHTML = `
      <g fill="none" stroke="${cy}" stroke-width="2.2">
        <path d="M303 507L493 329H834L1024 507V678H834V661H493V678H303Z"/>
        <circle cx="664" cy="507" r="147"/><circle cx="664" cy="507" r="104"/>
        ${cross(493, 408, 24, 36)}${cross(834, 408, 24, 36)}${cross(387, 607, 33, 45)}${cross(941, 607, 33, 45)}
      </g>
      <g stroke="${cy}" stroke-width="1.4" stroke-dasharray="28 8 6 8" fill="none">
        <path d="M664 278V740M467 507H836"/>
      </g>
      <g stroke="${cy}" stroke-width="1.4" fill="${cy}">
        <path d="M193 329H834M193 678H300M207 336V671M303 678V760M1024 678V760M311 749H1016" fill="none"/>
        <path d="M207 329l-5 14h10zM207 678l-5-14h10zM303 749l14-5v10zM1024 749l-14-5v10z" stroke="none"/>
        <path d="M1163 230V176M1163 230H1218" fill="none"/>
        <path d="M1163 168l-4 10h8zM1226 230l-10-4v8z" stroke="none"/>
      </g>
      ${y(493, 329)}${y(834, 329)}${y(303, 507)}${y(1024, 507)}${y(303, 678)}${y(1024, 678)}
      <g fill="#9fe6ee" font-family="Segoe UI, Arial, sans-serif" font-size="23">
        <text x="664" y="742" text-anchor="middle">120</text>
        <text transform="translate(198 507) rotate(-90)" text-anchor="middle">60</text>
        <text x="1163" y="162" text-anchor="middle" font-size="20">Y</text>
        <text x="1241" y="237" text-anchor="middle" font-size="20">X</text>
        <g font-size="19" text-anchor="middle">
          <text x="37" y="853">0</text><text x="98" y="853">10</text><text x="159" y="853">20</text>
          <text x="220" y="853">30</text><text x="282" y="853">40</text><text x="343" y="853">50</text>
        </g>
      </g>
      <path d="M37 873H343M37 861V873M98 861V873M159 861V873M220 861V873M282 861V873M343 861V873" stroke="#dce9f0" stroke-width="1.4" fill="none"/>`;
    parent.appendChild(svg);
  }

  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'DraftPro feedback',
      cookie: 'Privacy settings',
      toast: 'Drawing notice',
      promo: 'Upgrade to DraftPro 2015',
      banner: 'Service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el(
      'p',
      'survey-intro',
      el,
      {
        chat: 'Help us improve DraftPro by sharing how you use it.',
        cookie: 'DraftPro can store usage statistics on this machine.',
        toast: 'The drawing has been recalculated.',
        promo: 'Get parametric constraints and cloud sync.',
        banner: 'Licence server maintenance tonight.',
      }[ctx.kind],
    );
    const dismiss = u.el(
      'button',
      'primary survey-close',
      el,
      ctx.kind === 'cookie' ? 'Reject optional' : ctx.kind === 'chat' ? 'Close' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  env.site({
    name: 'design-set-slider-multi-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `cad instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = endRng.bool(0.5) ? 'inspector' : endRng.pick(['toolbar', 'status']);
      const endLabel = placement === 'inspector' ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.toLowerCase());
      const collideLabel = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.onclick = () => ctx.submit();
        return b;
      };

      const title = u.el('header', 'titlebar', document.body);
      title.innerHTML =
        '<svg class="app" viewBox="0 0 24 24"><path d="M4 2h11l7 8-2 9-5 3H6l-4-4V6z" fill="#159bea"/><path d="M12 5a6 6 0 106 8M12 5l3 5h5M8 8v7l4 3" stroke="#063c65" stroke-width="2.5" fill="none"/><path d="M17 4l3 4" stroke="#9bddff" stroke-width="2"/></svg>';
      u.el('span', 'ttl', title, 'DraftPro 2014 - [Component_A.dwg]');
      const wc = u.el('span', 'wctl', title);
      wc.innerHTML =
        '<svg viewBox="0 0 14 14"><path d="M1 7h12" stroke="#fff" stroke-width="1.3"/></svg><svg viewBox="0 0 14 14"><rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3"/></svg><svg viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="#fff" stroke-width="1.3"/></svg>';

      const menu = u.el('nav', 'menubar', document.body);
      for (const m of ['File', 'Edit', 'View', 'Draw', 'Modify', 'Dimension', 'Tools', 'Help'])
        u.el('span', '', menu, m);

      const tb = u.el('div', 'toolbar', document.body);
      const centers = [
        27, 65, 103, 142, 210, 262, 301, 356, 396, 435, 486, 530, 570, 655, 714, 765, 816, 873, 928, 979, 1040,
      ];
      const dividers = [178, 236, 330, 460, 624, 846, 1011];
      let toolIndex = 0,
        dividerIndex = 0;
      for (const t of TOOLS) {
        if (t[0] === '|') {
          const divider = u.el('span', 'sep' + (t === '||' ? ' wide' : ''), tb);
          divider.style.left = dividers[dividerIndex++] / 18 + 'em';
        } else {
          const tool = u.el('span', 'tool', tb);
          tool.style.left = centers[toolIndex++] / 18 + 'em';
          icon(tool, t);
        }
      }
      const actions = u.el('div', 'toolbar-actions', tb);
      if (collideLabel) {
        const decoy = u.el('button', 'cad-xtra', actions, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collideLabel, collide: true });
      }
      let submit = null;
      if (!ctx.finish && placement === 'toolbar') submit = endButton(actions, 'cad-end');

      const work = u.el('div', 'workspace', document.body);
      const canvas = u.el('main', 'canvas', work);
      drawing(canvas);
      const instruction = u.el('div', 'instruction', canvas);
      const text = ctx.instruction || '';
      const cut = text.indexOf(':');
      if (cut > 0) {
        u.el('span', 'lead', instruction, text.slice(0, cut + 1));
        instruction.appendChild(document.createTextNode(text.slice(cut + 1)));
      } else {
        const lead = text.match(/^.*?\bsliders\b/i);
        if (lead) {
          u.el('span', 'lead', instruction, lead[0]);
          instruction.appendChild(document.createTextNode(text.slice(lead[0].length)));
        } else instruction.textContent = text;
      }
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'panel') u.el('div', 'instruction-caption', instruction, 'Task · View Controls');
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, '×');
        close.setAttribute('aria-label', 'Close instruction');
        close.onclick = () => {
          instruction.hidden = true;
        };
      }

      const insp = u.el('aside', 'inspector', work);
      u.el('div', 'ihead', insp, 'Properties');
      u.el('div', 'isec first', insp, 'View Controls');
      const stage = u.el('div', 'record-stage', insp);
      stage.dataset.role = 'stage';
      const sections = [
        [
          'Selection Info',
          [
            ['Objects', '4'],
            ['Type', 'Mixed'],
            ['Layer', 'Mechanical'],
            ['Color', 'By Layer'],
          ],
        ],
        [
          'Canvas',
          [
            ['Units', 'mm'],
            ['Grid Spacing', '10'],
            ['Snap', 'On'],
            ['Ortho', 'Off'],
          ],
        ],
      ];
      for (const [name, rows] of sections) {
        const sec = u.el('section', 'ipanel', insp);
        u.el('div', 'isec', sec, name);
        for (const [k, v] of rows) {
          const r = u.el('div', 'irow', sec);
          u.el('span', 'k', r, k);
          u.el('span', 'v', r, v);
        }
      }
      if (!ctx.finish && placement === 'inspector') {
        const foot = u.el('div', 'isubmit', insp);
        submit = endButton(foot, 'primary');
      }

      const st = u.el('footer', 'statusbar', document.body);
      u.el('span', 'ready', st, 'Ready');
      if (!ctx.finish && placement === 'status') submit = endButton(st, 'cad-end status-end');
      for (const m of ['SNAP', 'GRID', 'ORTHO', 'OSNAP']) u.el('span', 'cell', st, m);
      u.el('span', 'cell coord first', st, 'X: 142.318');
      u.el('span', 'cell coord', st, 'Y: 87.652');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
