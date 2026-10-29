// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, navDraw, rng, util } = _c;
      const { K } = S;
      if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const title = util.el('div', 'fm-app-title', header);
      const appIcon = util.el('span', 'fm-app-folder', title);
      appIcon.innerHTML = '<svg width="24" height="22" viewBox="0 0 24 22"><path fill="#fff" d="M1 3a2 2 0 0 1 2-2h7l3 3h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z"/></svg>';
      util.el('span', '', title, 'Files');
      util.el('span', 'fm-window-buttons', title, '−　□　×');
      const menu = util.el('nav', 'fm-app-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', '', menu, item);
      const actions = util.el('div', 'fm-actions', header);
      const paths = {
        Back:'<path d="M19 12H5m6-7-7 7 7 7"/>', Forward:'<path d="M5 12h14m-6-7 7 7-7 7"/>', Up:'<path d="M12 21V4m-7 7 7-7 7 7"/>',
        'New Folder':'<path fill="#3f5fb8" stroke="none" d="M1 5h8l2 3h12v13H1z"/><path stroke="#fff" d="M12 10v8m-4-4h8"/>',
        Copy:'<path d="M8 3h12v18H8zM4 17H2V1h13v2"/>', Paste:'<path d="M6 5H3v17h18V5h-3M8 2h8v6H8z"/>',
        Delete:'<path fill="#ed3038" stroke="none" d="M5 7h14v15H5z"/><path d="M3 4h18M9 4V2h6v2"/>', Undo:'<path d="M3 13c5-8 13-8 19 0M3 6v8h8"/>'
      };
      for (const label of ['Back','Forward','Up','New Folder','Copy','Paste','Delete','Undo']) {
        const b = util.el('span', 'fm-action', actions); b.dataset.command = label;
        const icon = util.el('b', '', b);
        icon.innerHTML = `<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${paths[label]}</svg>`;
        util.el('span', '', b, label);
      }
      Object.assign(_c, { appTools: actions });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'panel' && (_c.W || _c.header.clientWidth || 1024) < 1200) {
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) panel.remove();
        _c.util.el('div', 'ref-instruction', _c.header, _c.ctx.instruction);
      } else if (_c.display === 'panel') {
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) {
          panel.querySelector('.ref-panel-title').textContent = 'Task';
          const close = _c.util.el('button', 'fm-task-close', panel, '×');
          close.type = 'button'; close.setAttribute('aria-label','Close task note');
          close.addEventListener('click', () => { panel.style.visibility = 'hidden'; env.log('note-close'); });
        }
      }
    },
    overlay: (base) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind !== 'chat') return result;
      const message = result.el.querySelector('.ref-ov-text').textContent;
      const head = ctx.util.el('div', 'fm-chat-head');
      ctx.util.el('span', 'fm-chat-symbol', head, '•••');
      ctx.util.el('strong', '', head, 'Chat');
      head.appendChild(result.dismiss);
      const body = ctx.util.el('div', 'fm-chat-body');
      ctx.util.el('span', 'fm-chat-avatar', body, 'AO');
      ctx.util.el('div', 'fm-chat-message', body, message);
      const compose = ctx.util.el('div', 'fm-chat-compose');
      ctx.util.el('span', '', compose, 'Type a message…');
      ctx.util.el('span', 'fm-chat-send', compose, '➤');
      result.el.replaceChildren(head, body, compose);
      return result;
    },
  };

  env.site({
    name: 'design-use-file-manager-select-05',
    template: 'site/base',
    design: { parts },
  });
})();
