(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-12',
    'brand': 'Notebook',
    'menu': 'File|Edit|View|Note|Tools|Help',
    'heading': 'Set Notebook Password',
  };
  const ICON = {
    chev: '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    bang: '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="12" fill="#f26a0f"/><rect x="10.7" y="5" width="2.6" height="9" rx="1.2" fill="#fff"/><circle cx="12" cy="18" r="1.6" fill="#fff"/></svg>',
    logo: '<svg viewBox="0 0 20 24" width="100%" height="100%"><rect x="1" y="1" width="18" height="22" rx="3" fill="#ff842a" stroke="#dc6312"/><path d="M4 3v17h12M6 4h7M6 6h5" fill="none" stroke="#fff2d9" stroke-width="1.2"/><path d="M15 3v3" stroke="#fff2d9"/></svg>',
    list: '<svg viewBox="0 0 24 24" width="100%" height="100%"><g fill="currentColor"><circle cx="4" cy="6" r="1.6"/><circle cx="4" cy="12" r="1.6"/><circle cx="4" cy="18" r="1.6"/></g><path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" stroke-width="1.8"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    numbered:
      '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M9 5h12M9 12h12M9 19h12" stroke="currentColor" stroke-width="1.8"/><g fill="currentColor" font-family="Arial" font-weight="bold" font-size="7"><text x="1" y="7">1</text><text x="1" y="14">2</text><text x="1" y="21">3</text></g></svg>',
    img: '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="8" r="2" fill="currentColor"/><path d="M4 19l6-7 4 4 3-3 4 6z" fill="currentColor"/></svg>',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const ends =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS.map(labelOf)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labels = [...new Set(ends)];
      const originalLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const alternates = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = er.bool(0.5) ? originalLabel : alternates.length ? er.pick(alternates) : originalLabel;
      const placements = ['security', 'security', 'toolbar', 'status'];
      const placement = ctx.finish ? null : er.pick(placements);
      const cr = ctx.rng.fork('chrome/collide');
      const collidePool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = cr.bool(0.3) && collidePool.length ? cr.pick(collidePool) : null;
      const top = u.el('header', 'ds-top', document.body);
      const lg = u.el('span', 'nb-logo', top);
      lg.innerHTML = ICON.logo;
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'nb-wc', top);
      wc.innerHTML = '<i class="mn"></i><i class="mx"></i><i class="cl"></i>';
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const tb = u.el('div', 'nb-tool', document.body);
      const sel = u.el('div', 'nb-sel', tb);
      u.el('span', '', sel, 'Normal text');
      u.el('span', 'nb-ch', sel).innerHTML = ICON.chev;
      const sep = () => u.el('i', 'nb-sep', tb);
      sep();
      [
        ['B', 'b'],
        ['I', 'i'],
        ['U', 'u'],
        ['S', 's'],
      ].forEach(([t, c]) => u.el('span', 'nb-ic nb-' + c, tb, t));
      sep();
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.list;
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.numbered;
      sep();
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.link;
      u.el('span', 'nb-ic nb-sv', tb).innerHTML = ICON.img;
      function decoy(parent, text) {
        const b = u.el('button', 'nb-chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      }
      function endBtn(parent, cls) {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      }
      if (collide && !ctx.finish) decoy(tb, collide);
      let submit = null;
      if (!ctx.finish && placement === 'toolbar') submit = endBtn(tb, 'nb-end-toolbar');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'nb-h1', content, C.heading);
      let mode = ctx.display;
      if (mode === 'panel' && (window.innerWidth < 1260 || window.innerHeight < 700)) mode = 'header';
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        const ic = u.el('span', 'nb-bang', b);
        ic.innerHTML = ICON.bang;
        const t = u.el('div', 'nb-ntext', b);
        u.el('div', 'ds-instruction', t, ctx.instruction);
        u.el('div', 'nb-sub', t, 'This will protect your notes with a master password.');
        return b;
      }
      if (mode !== 'hidden' && mode !== 'panel')
        note(content, mode === 'toast' ? 'ds-header-note ds-toast' : 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const chk = u.el('label', 'nb-show', content);
      const toggle = u.el('input', 'nb-box', chk);
      toggle.type = 'checkbox';
      toggle.addEventListener('change', () =>
        stage.querySelectorAll('input[data-role="field"]').forEach((input) => {
          input.type = toggle.checked ? 'text' : 'password';
        }),
      );
      u.el('span', '', chk, 'Show password');
      const side = u.el('aside', 'nb-side', body);
      u.el('h2', 'nb-sh', side, 'Note settings');
      if (mode === 'panel') note(side, 'ds-panel-note nb-panel-note');
      u.el('div', 'nb-sec', side, 'Appearance');
      [
        ['Theme:', 'Light'],
        ['Font size:', '14 px'],
        ['Editor font:', 'Consolas'],
      ].forEach(([l, v]) => {
        const r = u.el('div', 'nb-row', side);
        u.el('span', 'nb-rl', r, l);
        const s = u.el('div', 'nb-dd', r);
        u.el('span', '', s, v);
        u.el('span', 'nb-ch', s).innerHTML = ICON.chev;
      });
      const sv = u.el('button', 'nb-save', side, 'Save view');
      sv.type = 'button';
      const savedView = u.el('div', 'nb-small', side, 'Saves only your current appearance preferences.');
      sv.addEventListener('click', () => {
        savedView.textContent = 'Appearance preferences saved. Password not submitted.';
      });
      u.el('hr', 'nb-hr', side);
      u.el('div', 'nb-sec nb-sec2', side, 'Security');
      u.el('div', 'nb-p', side, 'Set a password to keep your notes private.');
      u.el('div', 'nb-p', side, 'This does not encrypt existing files until you submit.');
      if (!ctx.finish && placement === 'security') submit = endBtn(side, 'ds-submit');
      const foot = u.el('footer', 'nb-status', document.body);
      u.el('span', '', foot, 'Ready');
      if (!ctx.finish && placement === 'status') submit = endBtn(foot, 'nb-end-status');
      u.el('span', 'nb-sp', foot);
      u.el('span', '', foot, 'Ln 1, Col 1');
      u.el('i', 'nb-sep2', foot);
      u.el('span', '', foot, 'UTF-8');
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
