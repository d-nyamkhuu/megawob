(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-05',
    'brand': 'MediPlan Pro 2014 - Appointment Scheduler',
    'title': 'Project Task',
    'instruction': 'right',
    'rail': '',
    'menu': 'File|Edit|View|Tools|Help',
    'briefTitle': 'Task',
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
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="1" y="1" width="17" height="17"/><path d="M10 3v14M6 6l4 2 4-2M5 12l5-3 5 3M6 14l4-2 4 2"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-wc', top, '−    □    ×');
      let tb = null;
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        tb = u.el('div', 'ds-tools', document.body);
        ['New', 'Open', 'Save', 'Print', '|', 'Undo', 'Redo', '|', 'Zoom In', 'Zoom Out', 'Fit'].forEach((t) => {
          if (t === '|') u.el('i', '', tb);
          else {
            const icons = {
              New: '<path d="M5 2h10l5 5v15H5z" fill="#e3edf2"/><path d="M15 2v6h5"/>',
              Open: '<path d="M2 7V4h8l3 3h8v4M2 7h20l-4 13H1z" fill="#cbdce7"/>',
              Save: '<path d="M3 2h18v20H3z" fill="#bdcedb"/><path d="M7 2v7h10V2M6 14h12v8M15 3v4"/>',
              Print:
                '<path d="M6 2h12v6H6zM6 15h12v7H6z" fill="#dce8ef"/><path d="M3 8h18v10h-3M6 18H3V8M7 12h10M18 11h1M8 18h8"/>',
              Undo: '<path d="M3 3v8h8M3 11c2-9 16-10 18 0 1 6-3 10-9 10"/>',
              Redo: '<path d="M21 3v8h-8M21 11C19 2 5 1 3 11c-1 6 3 10 9 10"/>',
              'Zoom In': '<circle cx="10" cy="10" r="8" fill="#b9ccdb"/><path d="M16 16l6 6M6 10h8M10 6v8"/>',
              'Zoom Out': '<circle cx="10" cy="10" r="8" fill="#b9ccdb"/><path d="M16 16l6 6M6 10h8"/>',
              Fit: '<rect x="2" y="2" width="20" height="20" fill="#b9ccdb"/><path d="M6 12h12M12 6v12"/>',
            };
            const item = u.el('span', 'ds-tool' + (t === 'Undo' || t === 'Redo' ? ' dim' : ''), tb);
            item.innerHTML = '<svg viewBox="0 0 24 24">' + icons[t] + '</svg>';
            u.el('span', '', item, t);
          }
        });
      }
      const bank =
        Array.isArray(ctx.content && ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = ctx.rng.fork('chrome/end');
      const endPlace = ctx.finish ? 'none' : endR.pick(['stage', 'stage', 'stage', 'toolbar', 'toolbar', 'footer']);
      const endLabel = labelOf(endR.pick(bank));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [
          ...new Set(bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (options.length) collide = labelOf(collideR.pick(options));
      }
      const addButton = (parent, cls, text, role, action) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = role;
        b.addEventListener('click', action);
        return b;
      };
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'right'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      if (collide && tb)
        addButton(tb, 'ds-pq', collide, 'decoy', () => env.log('decoy', { label: collide, collide: true }));
      let submit = null;
      if (endPlace === 'toolbar' && tb) {
        submit = addButton(tb, 'ds-toolbar-end', endLabel, 'submit', () => ctx.submit());
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const status = u.el('em', '', foot);
      status.innerHTML =
        '<span class="ds-status-dim">CAP</span>   NUM   <span class="ds-status-dim">SCRL</span>   X: 347.6   Y: 112.3   mm';
      if (collide && !tb)
        addButton(foot, 'ds-pq', collide, 'decoy', () => env.log('decoy', { label: collide, collide: true }));
      if (endPlace === 'stage') {
        submit = addButton(foot, 'ds-submit', endLabel, 'submit', () => ctx.submit());
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
      } else if (endPlace === 'footer') {
        submit = addButton(foot, 'ds-footer-end', endLabel, 'submit', () => ctx.submit());
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
      }
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
