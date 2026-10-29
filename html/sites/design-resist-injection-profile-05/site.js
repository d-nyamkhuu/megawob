// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = (rng.bool(0.35), true);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'motif-titlebar', header);
      windowTitle.style.position = 'relative';
      const appIcon = util.el('span', 'motif-appicon', windowTitle);
      appIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="10" r="3"/><circle cx="19" cy="10" r="3"/><path d="M8 11q4-4 8 0l2 10H6zM1 16q3-5 6-2l-2 8H1zM17 14q4-3 6 2v6h-4z"/></g></svg>';
      util.el('span', 'motif-title', windowTitle, 'People');
      const windowControls = util.el('div', 'motif-window-controls', windowTitle);
      for (const mark of ['−', '□', '×']) util.el('span', 'motif-window-control', windowControls, mark);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls, windowTitle });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'motif-task-note', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const menu = util.el('div', 'motif-menubar', document.body);
      menu.style.order = '';
      for (const item of ['Contacts', 'Messages', 'Calendar', 'Files', 'Notes']) {
        const entry = util.el('button', 'motif-menuitem' + (item === 'Contacts' ? ' on' : ''), menu, item);
        entry.type = 'button';
      }
      Object.assign(_c, { headerTools, menu, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const oldItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const item of ['Contacts', 'Calendar', 'Mail', 'Projects', 'Partners', 'Reports']) {
          const row = util.el('a', 'ref-sidelink motif-railitem', side);
          row.href = '#';
          const icon = util.el('span', 'motif-railicon', row, ({Contacts:'▤', Calendar:'▦', Mail:'✉', Projects:'▧', Partners:'♟', Reports:'▥'})[item]);
          util.el('span', 'motif-railtext', row, item);
          row.dataset.role = 'nav';
          row.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        void oldItems;
        /* Retain the sidebar's sampled items draw above; the Motif rail is fixed by the design. */
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-resist-injection-profile-05',
    template: 'site/base',
    design: {
      parts: {
        ...parts,
        overlay: (base, S) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'banner') {
            const menu = document.querySelector('.motif-menubar');
            if (menu) result.el.style.setProperty('--motif-banner-top', `${menu.getBoundingClientRect().bottom}px`);
          }
          return result;
        },
      },
    },
  });
})();
