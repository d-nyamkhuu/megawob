// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    frame: (base, S) => function frame(ctx) {
      const { ACCENTS, K, LOW_ACCENTS, LOW_THEME, THEMES, endLabel } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const cr = rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        let text = null;
        if (word) {
          const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
          const options = [...new Set(K.collide.map(word))].filter((x) => !same(x));
          if (options.length) text = cr.pick(options);
        } else text = content.collideLabel(cr, label);
        if (text !== null) collide = { text, where: cr.pick(['header', 'header', 'footer']) };
      }

      const header = util.el('header', 'ref-task', document.body);
      const brandText = (display !== 'header' || nav) && word ? word(lr.pick(K.brand)) : 'Rivermere Public Library';
      const brand = util.el('div', 'ref-brand', header, brandText);
      brand.dataset.role = 'brand';
      util.el('div', 'ref-tagline', header, 'Books  ·  People  ·  A Stronger Community');
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);

      const decoyBtn = (parent, text, collides) => {
        const b = util.el('button', 'ref-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      };
      const endBtn = (parent, cls, text) => {
        const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };

      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const publishingGroup = util.el('div', 'ref-publishing-group', headerTools);
      const status = util.el('div', 'ref-page-status', publishingGroup);
      util.el('div', 'ref-status-title', status, '●  Page Status: Draft (unpublished)');
      util.el('div', 'ref-status-date', status, 'Last edited: Apr 25, 1996 10:24 AM');
      const publish = util.el('button', 'ref-publish', publishingGroup, 'Publish changes');
      publish.type = 'button';
      publish.addEventListener('click', () => {
        const action = [...stage.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Publish changes');
        if (action) action.click();
      });
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }

      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const stage = util.el('main', 'ref-stage', body);
      stage.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.alignItems = rng.pick(['center', 'center', 'flex-start', 'flex-end']);

      const help = util.el('aside', 'ref-help', body);
      const helpTitle = util.el('div', 'ref-help-title', help);
      util.el('span', 'ref-help-mark', helpTitle, '?');
      util.el('strong', '', helpTitle, 'Help & Tips');
      for (const [title, text] of [
        ['Text', 'Enter the text to display on the banner image. Keep it short and descriptive.'],
        ['Link URL', 'Type a relative URL (e.g. /about) or a full URL (https://…).'],
        ['Alignment', 'Controls where the text appears on the image.'],
        ['Padding', 'Adds space around the text, in pixels.'],
      ]) {
        const item = util.el('section', 'ref-help-item', help);
        util.el('strong', '', item, title);
        util.el('div', '', item, text);
      }

      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }

      let footer;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        footer = foot;
        const dock = util.el('nav', 'ref-dock-nav', foot);
        const dockItems = [['page', 'Pages'], ['mail', 'Campaigns'], ['chat', 'Social'], ['chart', 'Analytics']];
        const dockPaths = {
          page: 'M5 2h11l7 7v21H5z M16 2v8h7',
          mail: 'M2 6h28v22H2z M2 6l14 13L30 6',
          chat: 'M3 5h26v20H15l-7 6v-6H3z M8 14h3m3 0h3m3 0h3',
          chart: 'M5 22h4v9H5z M14 14h4v17h-4z M23 5h4v26h-4z',
        };
        for (const [icon, text] of dockItems) {
          const item = util.el('a', 'ref-dock-item', dock);
          item.href = '#';
          const mark = util.svg('svg', { viewBox: '0 0 32 34', class: 'ref-dock-icon', fill: icon === 'page' || icon === 'chart' ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 1.6, 'aria-hidden': 'true' }, item);
          util.svg('path', { d: dockPaths[icon] }, mark);
          util.el('span', '', item, text);
          item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
        }
        const settings = util.el('a', 'ref-dock-settings', foot);
        const gear = util.svg('svg', { viewBox: '0 0 32 32', class: 'ref-settings-icon', fill: 'currentColor', 'aria-hidden': 'true' }, settings);
        util.svg('path', { d: 'M14 1h4l1 5 3 1 4-3 3 3-3 4 1 3 5 1v4l-5 1-1 3 3 4-3 3-4-3-3 1-1 5h-4l-1-5-3-1-4 3-3-3 3-4-1-3-5-1v-4l5-1 1-3-3-4 3-3 4 3 3-1z M16 9a7 7 0 1 0 0 14 7 7 0 0 0 0-14', 'fill-rule': 'evenodd' }, gear);
        util.el('span', '', settings, 'Settings');
        settings.href = '#';
        settings.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: 'Settings' }); });
        if (wantFooter) {
          const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
            'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
          util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
            word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        }
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', footer);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      return { stage, submit };
    },
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      el.dataset.role = 'overlay';
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
  };

  env.site({
    name: 'design-use-site-builder-blockedit-01',
    template: 'site/base',
    design: { parts },
  });
})();
