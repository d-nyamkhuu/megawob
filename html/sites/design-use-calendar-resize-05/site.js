// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#ffffff', panel: '#f7f8f8', fg: '#111318', muted: '#617080', line: '#d6dde2' },
    dark: { bg: '#ffffff', panel: '#f7f8f8', fg: '#111318', muted: '#617080', line: '#d6dde2' },
    warm: { bg: '#ffffff', panel: '#f7f8f8', fg: '#111318', muted: '#617080', line: '#d6dde2' },
  };

  const LOW_THEME = { bg: '#ffffff', panel: '#f7f8f8', fg: '#111318', muted: '#617080', line: '#d6dde2' };

  const LOW_ACCENTS = ['#d8fa86', '#d8fa86', '#d8fa86', '#d8fa86'];

  const ACCENTS = ['#d8fa86', '#d8fa86', '#d8fa86', '#d8fa86', '#d8fa86', '#d8fa86'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const titlebar = document.querySelector('.ref-task');
      if (titlebar && ['banner', 'toast', 'promo'].includes(kind)) {
        el.style.top = `${titlebar.getBoundingClientRect().bottom + (kind === 'toast' ? 10 : 1)}px`;
      }
      if (kind === 'chat') {
        const end = document.querySelector('[data-role="submit"]');
        if (end) {
          const box = end.getBoundingClientRect();
          if (box.top > window.innerHeight - 110) el.style.bottom = `${window.innerHeight - box.top + 12}px`;
        }
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      // Keep the reference design's single-purpose desktop window. Draw the same
      // variation values as the shared site, but do not add dashboard navigation.
      const sidebarPick = roomy && rng.bool(0.35);
      const sidebar = false;
      const navPick = W >= 1180 && rng.bool(0.5);
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navPick, placement, sidebar, sidebarPick, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, navPick, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || navPick) {
        rng.pick(TITLES);
        if (word) lr.pick(K.brand);
      }
      const brand = util.el('div', 'ref-brand', header, 'WorkHub');
      brand.dataset.role = 'brand';
      const menu = util.el('nav', 'app-menu', document.body);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Calendar', 'Team', 'Tools', 'Help']) {
        const item = util.el('button', 'app-menu-item', menu, label);
        item.type = 'button';
      }
      const toolbar = util.el('div', 'app-toolbar', document.body);
      const item = (cls, icon, label) => {
        const b = util.el('button', `app-tool ${cls}`, toolbar);
        b.type = 'button';
        if (icon) util.el('span', 'app-tool-icon', b, icon);
        util.el('span', 'app-tool-label', b, label);
        return b;
      };
      item('tool-new', '✚', 'New Event');
      item('tool-today', '▦', 'Today');
      const back = item('tool-back', '‹', '');
      const next = item('tool-next', '›', '');
      util.el('div', 'app-slot-nav', toolbar);
      item('tool-people', '♟', 'Add People');
      item('tool-zone', '', 'Time Zone⌄');
      const search = util.el('label', 'app-search', toolbar);
      util.el('span', 'app-search-icon', search, '⌕');
      const input = util.el('input', '', search);
      input.type = 'text';
      input.placeholder = 'Search events, people...';
      Object.assign(_c, { brand, header, toolbar, back, next });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const footCaption = util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        footCaption.textContent = '';
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-calendar-resize-05',
    template: 'site/base',
    design: { THEMES, LOW_THEME, LOW_ACCENTS, ACCENTS, parts },
  });
})();
