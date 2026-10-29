(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-09',
    'title': 'Contact Manager',
    'instruction': 'top',
    'menu': 'Workspace|File|Edit|View|Tools',
    'wmenu': 'File|Edit|Actions|Help',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 15   10:24 AM');
      const body = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-titlebar', win);
      u.el('span', 'ds-tb-btn', tb, '−');
      u.el('span', 'ds-grip', tb);
      u.el('span', 'ds-tb-title', tb, C.title);
      const tc = u.el('span', 'ds-tb-ctl', tb);
      u.el('span', 'ds-tb-btn', tc, '−');
      u.el('span', 'ds-tb-btn ds-maximize', tc, '');
      u.el('span', 'ds-tb-btn', tc, '×');
      const wm = u.el('nav', 'ds-wmenu', win);
      C.wmenu.split('|').forEach((t) => {
        const s = u.el('span', '', wm);
        s.innerHTML = t.charAt(0) === 'F' && t === 'File' ? '<u>F</u>ile' : t;
      });
      const tool = u.el('div', 'ds-toolbar', win);
      const icons = {
        New: '<path d="M5 2h15l7 7v21H5z" fill="#f4f3ef" stroke="#252535" stroke-width="1.6"/><path d="M20 2v7h7M7 4v24h18" fill="none" stroke="#858593" stroke-width="1.2"/>',
        Open: '<path d="M2 5h11l3 4h11v17H2z" fill="#d4d3d4" stroke="#252535" stroke-width="1.5"/><path d="M2 26l5-12h24l-6 12z" fill="#858695" stroke="#252535" stroke-width="1.6"/><path d="M4 6h8M7 15h22" stroke="#fafafa"/>',
        Save: '<path d="M3 3h25v26H3z" fill="#666881" stroke="#252535" stroke-width="1.6"/><path d="M8 3h14v11H8zM8 19h16v10H8z" fill="#dddde2" stroke="#252535" stroke-width="1.5"/><path d="M19 5v7M11 22h10M5 5v21" stroke="#f9f9f9"/>',
        Delete:
          '<path d="M6 7h21v23H6z" fill="#999aa8" stroke="#252535" stroke-width="1.5"/><path d="M4 5h25v4H4zM12 5V2h9v3" fill="#dcdce0" stroke="#252535" stroke-width="1.5"/><path d="M9 11v16M14 11v16M19 11v16M24 11v16" stroke="#eee" stroke-width="2"/><path d="M11 11v16M16 11v16M21 11v16" stroke="#555568"/> ',
      };
      ['New', 'Open', 'Save', '|', 'Delete'].forEach((l) => {
        if (l === '|') {
          u.el('span', 'ds-tsep', tool);
          return;
        }
        const b = u.el('button', 'ds-tool' + (l === 'New' ? ' on' : ''), tool);
        b.type = 'button';
        b.innerHTML = '<svg viewBox="0 0 32 32" width="34" height="34">' + icons[l] + '</svg><span>' + l + '</span>';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: l }));
      });
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const placement = referenceEnd ? 'footer' : endR.pick(['toolbar', 'status']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const options = endLabels.filter((l) => l.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideR.pick(options);
          const b = u.el('button', 'ds-cancel ds-chrome-xtra', tool, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      let submit = null;
      function endControl(parent, cls) {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        return b;
      }
      if (!ctx.finish && placement === 'toolbar') submit = endControl(tool, 'ds-submit ds-toolbar-end');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(win, 'ds-header-note');
      const main = u.el('div', 'ds-main', win);
      if (mode === 'left' || mode === 'right') {
        const note = briefing(main, 'ds-brief');
        if (mode === 'right') note.style.order = '2';
      }
      if (mode === 'toast') {
        const note = briefing(win, 'ds-toast');
        win.insertBefore(note, main);
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', win);
      const clear = u.el('button', 'ds-cancel ds-clear', foot, 'Clear Form');
      clear.type = 'button';
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.dataset.role = 'xtra';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      if (!ctx.finish && placement === 'footer') submit = endControl(foot, 'ds-submit');
      const st = u.el('div', 'ds-statusbar', win);
      if (!ctx.finish && placement === 'status') submit = endControl(st, 'ds-status-end');
      u.el('span', 'ds-resize', st, '◢');
      const trash = u.el('div', 'ds-trash', body);
      trash.innerHTML = '<svg viewBox="0 0 32 32" width="46" height="46">' + icons.Delete + '</svg><span>Trash</span>';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
