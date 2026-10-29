// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
    dark: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
    warm: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
  };

  const LOW_THEME = { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' };

  const LOW_ACCENTS = ['#7194b8', '#7194b8', '#7194b8', '#7194b8'];

  const ACCENTS = ['#7194b8', '#7194b8', '#7194b8', '#7194b8', '#7194b8', '#7194b8'];

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish
          ? null
          : rng.pick(['header', 'header', 'header', 'footer', 'link', 'icon', 'floating']);
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
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, navPick, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const menu = util.el(
          'div',
          'kde-menu',
          document.body,
          'File　 Edit　 View　 Go　 Event　 Tools　 Settings　 Help',
        );
        menu.setAttribute('aria-hidden', 'true');
        if (display !== 'header' || navPick) {
          rng.pick(TITLES);
          if (word) lr.pick(K.brand);
        }
        const brand = util.el('div', 'ref-brand', header, 'Calendar — Kontakt');
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, header, menu });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const toolbar = util.el('div', 'kde-toolbar', document.body);
        toolbar.innerHTML =
          '<span class="kde-tool blue">＋</span> New Event　 <span class="kde-tool">☑</span> New To-do　 <span class="kde-tool">▣</span> New Journal　 │　 <span class="kde-tool">‹</span> Back　　<span class="kde-tool">›</span> Forward　 │　 <span class="kde-tool">▦</span> Today <span class="kde-search">⌕　 Search…</span>';
        const heading = util.el('div', 'kde-heading', document.body);
        util.el('div', 'kde-range', heading, 'April 16 – 20, 2018');
        util.el('div', 'kde-views', heading, 'Day　 Week　 Month　 ‹　 ›');
        Object.assign(_c, { headerTools, heading, submit, toolbar });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const status = util.el('div', 'kde-status', document.body);
        status.innerHTML = '<span>12 events</span><i></i><span>5 people</span>';
        const dock = util.el('nav', 'kde-dock', document.body);
        dock.innerHTML =
          '<span class="selected">▦　 Calendar</span><span>♙　 Contacts</span><span>☑　 Tasks</span><span>▤　 Notes</span>';
        Object.assign(_c, { dock, stage, status });
      },
  };

  env.site({
    name: 'design-use-calendar-resize-04',
    template: 'site/base',
    design: { THEMES, LOW_THEME, LOW_ACCENTS, ACCENTS, parts },
  });
})();
