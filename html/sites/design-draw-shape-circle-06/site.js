(function () {
  'use strict';
  const C = {
    'title': 'Riverton Manufacturing',
    'sub': 'B2B  EXTRANET',
    'accent': '#b5471f',
    'navy': '#0f2a52',
    'bg': '#e3e9f1',
    'surface': '#fff',
    'font': 'Verdana, Geneva, Tahoma, sans-serif',
  };
  const TABS = ['Orders', 'Inventory', 'Accounts', 'Partners', 'Reports', 'Support'];
  const COLS = ['PO #', 'Customer', 'Item', 'Qty', 'Unit Price', 'Status', 'Ship Date'];
  const ROWS = [
    ['PO-43821', 'Midland Tools', 'Drill Bit Set', '50', '$12.40', 'Shipped', '03/03/1999'],
    ['PO-43820', 'Summit Hardware', 'Safety Goggles', '100', '$3.25', 'Processing', '03/12/1999'],
    ['PO-43819', 'Caldwell Supply', 'Work Gloves', '200', '$2.10', 'Shipped', '03/01/1999'],
    ['PO-43818', 'Pinecrest Builders', 'HI-Vis Vest', '75', '$6.90', 'Processing', '03/14/1999'],
    ['PO-43817', 'Lakeside Materials', 'Steel Brackets', '500', '$1.55', 'Shipped', '02/28/1999'],
    ['PO-43816', 'Trenton Industrial', 'Extension Cord', '150', '$4.75', 'Processing', '03/10/1999'],
    ['PO-43815', 'North Ridge Co.', 'Tool Box', '80', '$18.20', 'Shipped', '03/02/1999'],
    ['PO-43814', 'Valley Contractors', 'Hard Hat', '120', '$5.60', 'Processing', '03/11/1999'],
    ['PO-43813', 'Brookfield Supply', 'Measuring Tape', '300', '$2.95', 'Shipped', '02/27/1999'],
    ['PO-43812', 'Granite Works', 'Utility Knife', '250', '$1.40', 'Processing', '03/09/1999'],
  ];
  const DETAILS = [
    ['PO #:', 'PO-43821'],
    ['Customer:', 'Midland Tools'],
    ['Item:', 'Drill Bit Set'],
    ['Quantity:', '50'],
    ['Unit Price:', '$12.40'],
    ['Status:', 'Shipped'],
    ['Ship Date:', '03/03/1999'],
  ];
  env.site({
    name: 'design-draw-shape-circle-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design extranet' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(labels));
      const placement = endR.pick(['footer', 'footer', 'footer', 'toolbar', 'link']);
      let collide = null;
      if (collideR.bool(0.3)) {
        const pool = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (pool.length) collide = collideR.pick(pool);
      }
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111820',
        muted: '#555d68',
        line: '#9aa6b8',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      const title = u.el('div', 'title', brand);
      const logo = u.svg('svg', { class: 'brand-logo', width: 12, height: 16, viewBox: '0 0 12 16' }, title);
      u.svg('rect', { x: 0, y: 0, width: 12, height: 16, fill: '#f4f6f7' }, logo);
      u.svg(
        'path',
        { d: 'M2 1L8 6L5 10L8 14M4 2L10 6L7 11L10 15', fill: 'none', stroke: '#a1acba', 'stroke-width': 1 },
        logo,
      );
      u.el('span', '', title, C.title);
      u.el('div', 'subtitle', brand, C.sub);
      const tabs = u.el('nav', 'tabs', head);
      TABS.forEach((t) => {
        const b = u.el('button', 'tab', tabs, t);
        b.type = 'button';
      });
      const util = u.el('div', 'util', head);
      u.el('div', '', util, 'Welcome, Alex Carter   |   Sign Out');
      u.el('div', '', util, 'Mar 12, 1999');
      const content = u.el('div', 'content', shell);
      const left = u.el('section', 'ledger panel', content);
      const lh = u.el('div', 'panel-head ledger-head', left);
      u.el('h2', '', lh, 'Purchase Orders');
      const sr = u.el('div', 'search', lh);
      u.el('span', '', sr, 'Search PO#:');
      u.el('span', 'search-box', sr);
      u.el('span', 'go', sr, 'Go');
      u.el('a', 'adv', lh, 'Advanced Search');
      const tbl = u.el('table', 'po', left);
      const tr0 = u.el('tr', '', u.el('thead', '', tbl));
      COLS.forEach((c, i) => u.el('th', 'c' + i, tr0, c + (i === 0 ? '  ▲' : '')));
      const tb = u.el('tbody', '', tbl);
      ROWS.forEach((r, j) => {
        const tr = u.el('tr', j === 0 ? 'sel' : '', tb);
        r.forEach((v, i) => u.el('td', 'c' + i, tr, v));
      });
      const lf = u.el('div', 'ledger-foot', left);
      u.el('span', '', lf, 'Showing 1 - 10 of 25 orders');
      const pg = u.el('span', 'pager', lf);
      u.el('span', '', pg, '« Prev');
      u.el('b', 'cur', pg, '1');
      u.el('a', '', pg, '2');
      u.el('a', '', pg, '3');
      u.el('a', '', pg, 'Next');
      u.el('span', '', pg, '»');
      const right = u.el('div', 'rcol', content);
      const det = u.el('section', 'details panel', right);
      u.el('div', 'panel-head', det).append(
        Object.assign(document.createElement('h2'), { textContent: 'Order Details' }),
      );
      const dl = u.el('div', 'dl', det);
      DETAILS.forEach(([k, v]) => {
        u.el('span', 'k', dl, k);
        u.el('span', 'v', dl, v);
      });
      const turn = u.el('section', 'turn panel', right);
      u.el('div', 'turn-title', turn, 'Drawing Task');
      const note = u.el('section', 'task-note', turn);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (instruction.textContent.length > 70) instruction.classList.add('long-instruction');
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Dismiss task notice');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', turn);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', turn);
      const pen = u.el('button', 'pencil', footer);
      pen.type = 'button';
      pen.setAttribute('aria-pressed', 'true');
      pen.onclick = () => {
        pen.setAttribute('aria-pressed', 'true');
        env.log('tool', { tool: 'pen' });
      };
      const ic = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 24 24' }, pen);
      u.svg('path', { d: 'M3 21L4 16L15 5L19 9L8 20ZM16.5 3.5L18 2L22 6L20.5 7.5Z', fill: '#10263f' }, ic);
      u.el('span', '', pen, 'Pencil');
      const clr = u.el('button', 'clear', footer, 'Clear');
      clr.type = 'button';
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      const addDecoy = (parent, label) => {
        const b = u.el('button', 'xtra-end', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label, collide: true });
      };
      if (collide) addDecoy(lh, collide);
      if (!ctx.finish) {
        const end = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', endLabel);
          b.title = endLabel;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'toolbar') submit = end(lh, 'button', 'submit toolbar-submit', endLabel);
        else if (placement === 'link') submit = end(lf, 'a', 'end-link', endLabel);
        else submit = end(footer, 'button', 'submit', endLabel);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box, 'Product Updates Newsletter');
      u.el('p', '', box, 'Get occasional updates about new features and tips.');
      u.el('div', 'nl-input', box, 'Your email address (optional)');
      const cb = u.el('div', 'nl-check', box);
      u.el('span', 'nl-box', cb);
      u.el('span', '', cb, 'Send me product updates');
      const dismiss = u.el('button', 'dismiss', box, 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      const x = u.el('button', 'nl-x', box, '✕');
      x.type = 'button';
      x.onclick = () => dismiss.click();
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
