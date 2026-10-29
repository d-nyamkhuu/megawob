// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const header = document.querySelector('.ref-task');
      if (header && (kind === 'banner' || kind === 'toast')) {
        el.style.top = `${header.getBoundingClientRect().bottom + (header.querySelector('.ref-instruction') ? 0 : 34)}px`;
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
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      if (!ctx.finish && !word && rng.fork('chrome/lisa-end').bool(0.5)) {
        placement = 'header';
        label = 'Continue';
      }
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Keep the design's application identity present in every instruction mode.
      // Preserve the original title draw when this branch used to render a generic brand.
      let title = 'Files';
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Files');
      brand.dataset.role = 'brand';
      const systemMenu = util.el('div', 'lisa-system-menu', header);
      for (const [index, text] of ['File Manager', 'File', 'Edit', 'View', 'Go', 'Special', 'Help'].entries()) {
        util.el(index ? 'span' : 'strong', '', systemMenu, text);
      }
      const systemStatus = util.el('div', 'lisa-system-status', header);
      util.el('span', 'lisa-system-help', systemStatus, '?');
      util.el('span', 'lisa-system-document', systemStatus, '▤');
      util.el('span', 'lisa-clock', systemStatus, 'Mon Apr 22   9:14 AM');
      Object.assign(_c, { brand, header, systemMenu, systemStatus, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'fm-search', header);
      util.el('span', 'fm-search-icon', search, '⌕');
      const searchText = util.el('span', 'fm-search-text', search, 'Search files');
      searchText.setAttribute('aria-label', 'Search files');
      const launcher = util.el('div', 'fm-launcher', header, '⠿');
      launcher.setAttribute('aria-label', 'Applications');
      const account = util.el('div', 'fm-account', header, '●');
      account.setAttribute('aria-label', 'Account');
      Object.assign(_c, { account, launcher, search, searchText });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      const inspector = util.el('aside', 'fm-inspector', body);
      const identity = util.el('div', 'fm-inspector-identity', inspector);
      util.el('span', 'fm-folder-icon', identity, '');
      const folder = util.el('div', 'fm-folder-copy', identity);
      util.el('strong', '', folder, 'Edits');
      util.el('span', '', folder, 'File folder');
      const properties = util.el('div', 'fm-properties', inspector);
      for (const [key, value] of [['Location', 'My Files › Projects › Website Redesign'],
        ['Size', '—'], ['Contains', '11 files, 1 folder'], ['Modified', 'Apr 16, 2014 5:42 PM']]) {
        const row = util.el('div', 'fm-property', properties);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { folder, identity, inspector, properties, stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-range-03',
    template: 'site/base',
    design: { parts },
  });
})();
