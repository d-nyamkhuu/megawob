// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('footer.ref-foot');
      if (foot) {
        const zoom = _c.util.el('div', 'kde-zoom', foot);
        _c.util.el('span', '', zoom, '−');
        const track = _c.util.el('span', 'kde-zoom-track', zoom);
        _c.util.el('span', 'kde-zoom-thumb', track);
        _c.util.el('span', '', zoom, '100%');
        foot.querySelector('.ref-tools')?.before(zoom);
      }
    },
    overlay: (base) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const action = document.querySelector('.ref-task [data-role="submit"]');
        if (action) {
          const dock = ctx.util.el('div', 'kde-banner-end', document.body);
          dock.appendChild(action);
        }
      }
      return result;
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      let wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      const preferred = rng.fork('chrome/kde-preferred-end');
      if (!ctx.finish && preferred.bool(0.5) && W >= 1180) {
        placement = 'footer';
        wantFooter = true;
        if (!word) label = 'Continue';
      }
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'ref-titlebar', document.body);
      const lights = util.el('div', 'ref-window-lights', titlebar);
      for (const tone of ['red', 'amber', 'green']) util.el('span', `ref-light ref-light-${tone}`, lights);
      util.el('div', 'ref-window-title', titlebar, 'Project Tracker.ods — Sheets');
      const windowButtons = util.el('div', 'kde-window-buttons', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', '', windowButtons, mark);
      const menubar = util.el('div', 'kde-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Help']) {
        const menu = util.el('button', 'kde-menu-item', menubar, item);
        menu.type = 'button';
      }
      Object.assign(_c, { collide, cr, decoys, label, lights, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') {
        const note = util.el('div', 'ref-instruction', header, ctx.instruction);
        header.before(note);
      } else util.el('div', 'ref-spacer', header);
      const appTools = util.el('div', 'ref-app-tools', header);
      const iconSvg = {
        New: '<svg viewBox="0 0 24 24"><path d="M5 2h10l4 4v16H5zM15 2v5h4M8 11h8M12 8v8"/></svg>',
        Open: '<svg viewBox="0 0 24 24"><path d="M2 6h8l2 2h10l-2 12H3zM3 6V4h8l2 2"/></svg>',
        Print: '<svg viewBox="0 0 24 24"><path d="M6 8V2h12v6M5 18H3V9h18v9h-2M6 15h12v7H6zM18 11h1"/></svg>',
        Undo: '<svg viewBox="0 0 24 24"><path d="M9 7 4 12l5 5M4 12h10c5 0 7 3 7 7"/></svg>',
        Redo: '<svg viewBox="0 0 24 24"><path d="m15 7 5 5-5 5m5-5H10c-5 0-7 3-7 7"/></svg>',
      };
      const appButton = (glyph, label, selected, kind) => {
        const b = util.el('button', `ref-app-tool ${kind || ''}${selected ? ' is-selected' : ''}`, appTools);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        const icon = util.el('span', 'ref-app-glyph', b, glyph);
        if (iconSvg[label]) icon.innerHTML = iconSvg[label];
        return b;
      };
      for (const [icon, name] of [['♧','New'],['▣','Open'],['▤','Print'],['↶','Undo'],['↷','Redo'],['⟳','Reload']]) appButton(icon,name,false,'filetool');
      util.el('span', 'kde-separator', appTools);
      const font = util.el('div', 'kde-select kde-font', appTools, 'Liberation Sans'); util.el('span','',font,'⌄');
      const size = util.el('div', 'kde-select kde-size', appTools, '10'); util.el('span','',size,'⌄');
      util.el('span', 'kde-separator', appTools);
      for (const [icon,name] of [['B','Bold'],['𝘐','Italic'],['U̲','Underline'],['☷','Align left'],['☰','Align center'],['≡','Align right'],['▦','Bullets'],['4$','Currency'],['%','Percent'],['%','Percent format'],['♧','Decimals'],['▦','Borders'],['▥','Chart'],['▥','Graph']]) appButton(icon,name,false,'formattool');
      Object.assign(_c, { appButton, appTools });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const records = util.el('aside', 'kde-records', body);
      const sideNote = body.querySelector('.ref-panel');
      if (sideNote) records.appendChild(sideNote);
      const head = util.el('div', 'kde-records-head', records);
      util.el('strong', '', head, 'All Records (36)');
      util.el('span', 'kde-records-head-icons', head, '▦   ⋮   ⋮');
      const list = util.el('div', 'kde-records-list', records);
      const entries = [
        ['Website Redesign', 'Alicia Chen', 'Open'],
        ['Mobile App Launch', 'Ben Carter', 'In Progress'],
        ['Marketing Campaign', 'Carla Ruiz', 'Open'],
        ['Data Migration', 'Daniel Kim', 'Completed'],
        ['Customer Portal', 'Eva Patel', 'Open'],
        ['Internal Tools Upgrade', 'Frank Moore', 'In Progress'],
        ['Q1 Sales Enablement', 'Grace Lee', 'Open'],
        ['Security Review', 'Henry Wilson', 'In Progress'],
        ['Partner Integration', 'Isabella Nguyen', 'Open'],
        ['Product Research', 'Jack Taylor', 'Completed'],
        ['UX Improvements', 'Alicia Chen', 'Open'],
        ['Analytics Dashboard', 'Ben Carter', 'In Progress'],
      ];
      entries.forEach(([title, owner, status], i) => {
        const item = util.el('div', `kde-record${i === 0 ? ' selected' : ''}`, list);
        util.el('span', 'kde-record-id', item, `PRJ-${String(i + 1001)}`);
        const info = util.el('div', 'kde-record-info', item);
        util.el('div', 'kde-record-title', info, title);
        util.el('div', 'kde-record-owner', info, owner);
        util.el('span', `kde-record-badge badge-${status.toLowerCase().replace(/\s+/g, '-')}`, item, status);
      });
      Object.assign(_c, { stage, records });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-filter-03',
    template: 'site/base',
    design: { parts },
  });
})();
