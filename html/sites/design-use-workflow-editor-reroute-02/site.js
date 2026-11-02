// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const GLYPHS = {
    flow: 'M5 19 12 12 19 5M3 17h4v4H3zM10 10h4v4h-4zM17 3h4v4h-4z',
    workflows: 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zM10 8h4v8h-4z',
    runs: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h8v8H8zM10 11l4 1-4 2',
    integrations: 'M9 3H6L3 7l2 4h4l2-4zM18 3h-3l-2 4 2 4h4l2-4zM12 13H9l-2 4 2 4h4l2-4z',
    library: 'M4 4h16v16H4zM4 8h16',
    settings: 'm9 3-1 3-3 1-2 4 2 2v4l4 2 3-1 3 1 4-2v-4l2-2-2-4-3-1-1-3zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    bolt: 'm13 2-8 12h7l-1 8 8-12h-7z',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 6v6l4 2',
    play: 'm7 4 13 8-13 8z',
    event: 'M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M12 9v8M11 6h2',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    plus: 'M12 3v18M3 12h18',
    pencil: 'm4 16 12-12 4 4L8 20H4zM13 7l4 4M4 16l4 4',
    trash: 'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7',
    globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M5 6h14M5 18h14M12 3c-5 5-5 13 0 18 5-5 5-13 0-18',
    branch:
      'M8 5v6l-4 8M8 11l10 8M8 5h10M10 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0M6 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0M20 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
    switch: 'M3 7h17l-4-4M20 7l-4 4M21 17H4l4-4M4 17l4 4',
    filter: 'M3 4h18l-7 8v8l-4-2v-6z',
    sliders: 'M3 6h18M3 12h18M3 18h18M16 3v6M8 9v6M15 15v6',
    file: 'M6 2h8l5 5v15H6zM14 2v6h5M9 12h7M9 16h7',
  };

  function glyph(util, parent, name) {
    const svg = util.svg(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
      },
      parent,
    );
    util.svg('path', { d: GLYPHS[name] || GLYPHS.flow }, svg);
    if (name === 'bolt' || name === 'play') svg.setAttribute('fill', 'currentColor');
    return svg;
  }

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') {
          const head = document.querySelector('.relay-editor-head');
          if (head) el.style.top = head.getBoundingClientRect().bottom + 'px';
        }
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
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
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        for (const [k, v] of Object.entries({
          bg: '#f7f9fc',
          panel: '#fff',
          fg: '#10162b',
          muted: '#596b90',
          line: '#dce3ed',
          accent: '#0860f9',
        }))
          root.style.setProperty(`--${k}`, v);
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const navDraw = W >= 1180 && rng.bool(0.5);
        const nav = W >= 760;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, navDraw, placement, rng, util, wantFooter } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('relay-header');
        document.body.dataset.instruction = display;
        document.body.classList.toggle('relay-footer-space', !!wantFooter || placement === 'floating');
        const windowTools = util.el('div', 'relay-window-tools', header);
        for (const mark of ['−', '□', '×']) util.el('span', '', windowTools, mark);
        if (display !== 'header' || nav) {
          if (display !== 'header' || navDraw) rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Relayboard');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const logo = util.el('div', 'relay-logo', n);
          glyph(util, logo, 'flow');
          if (navDraw) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const [item, icon] of [
            ['Workflows', 'workflows'],
            ['Runs', 'runs'],
            ['Integrations', 'integrations'],
            ['Library', 'library'],
            ['Settings', 'settings'],
          ]) {
            const a = util.el('a', `ref-navlink${item === 'Workflows' ? ' active' : ''}`, n);
            glyph(util, a, icon);
            util.el('span', '', a, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header, windowTools });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const search = util.el('div', 'relay-search', header, '⌕　Search workflows...');
        util.el('div', 'relay-bell', header, '♟');
        util.el('div', 'relay-avatar', header, 'JD');
        Object.assign(_c, { search });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body relay-layout', document.body);
        const summary = util.el('aside', 'relay-summary', body);
        const summaryHead = util.el('div', 'relay-summary-head', summary);
        util.el('strong', '', summaryHead, 'Workflows');
        const create = util.el('button', 'relay-new-workflow', summaryHead);
        glyph(util, create, 'plus');
        util.el('span', '', create, 'New workflow');
        create.addEventListener('click', () => env.log('decoy', { label: 'New workflow' }));
        const workflowSearch = util.el('div', 'relay-search', summary);
        glyph(util, workflowSearch, 'search');
        util.el('span', '', workflowSearch, 'Search workflows...');
        for (const [name, updated, active] of [
          ['Order processing', 'Updated 2 hours ago', true],
          ['Customer support', 'Updated 1 day ago', false],
          ['Inventory sync', 'Updated 3 days ago', true],
          ['Refund handling', 'Updated 4 days ago', false],
          ['Lead qualification', 'Updated 1 week ago', true],
          ['Onboarding', 'Updated 1 week ago', false],
          ['Data cleanup', 'Updated 2 weeks ago', false],
          ['Monthly reporting', 'Updated 2 weeks ago', true],
        ]) {
          const row = util.el('div', `relay-workflow${name === 'Order processing' ? ' selected' : ''}`, summary);
          util.el('i', active ? 'active' : '', row, '');
          const copy = util.el('span', '', row);
          util.el('b', '', copy, name);
          util.el('small', '', copy, updated);
          util.el('span', 'more', row, '⋮');
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, create, summary, summaryHead, workflowSearch });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, header, util } = _c;
        const editor = util.el('section', 'relay-editor', body);
        const edhead = util.el('div', 'relay-editor-head', editor);
        util.el('span', 'relay-app-icon', edhead, '⌘');
        const edtitle = util.el('div', 'relay-title', edhead);
        util.el('b', '', edtitle, 'Order processing');
        const titleLine = edtitle.querySelector('b');
        const status = util.el('span', 'relay-active', titleLine);
        util.el('i', '', status);
        util.el('span', '', status, 'Active');
        if (display === 'header') edtitle.appendChild(header.querySelector('.ref-instruction'));
        util.el('span', 'relay-updated', edtitle, 'Updated 2 hours ago');
        const toolrow = util.el('div', 'relay-toolrow', editor, 'Workflows　　Runs');
        const stage = util.el('main', 'ref-stage', editor);
        // The widget suppresses inherited editor frame through its design parts.
        const palette = util.el('aside', 'relay-palette', editor);
        const paletteHead = util.el('div', 'relay-palette-tabs', palette);
        util.el('b', 'selected', paletteHead, 'Steps');
        util.el('span', '', paletteHead, 'Apps');
        const stepSearch = util.el('div', 'relay-palette-search', palette);
        glyph(util, stepSearch, 'search');
        util.el('span', '', stepSearch, 'Search steps...');
        for (const [heading, items] of [
          [
            'TRIGGERS',
            [
              ['bolt', 'Webhook trigger', 'green'],
              ['clock', 'Schedule', 'blue'],
              ['play', 'Manual trigger', 'violet'],
              ['event', 'App event', 'purple'],
            ],
          ],
          [
            'ACTIONS',
            [
              ['mail', 'Send email', 'teal'],
              ['plus', 'Create record', 'orange'],
              ['pencil', 'Update record', 'blue'],
              ['trash', 'Delete record', 'red'],
              ['globe', 'HTTP request', 'blue'],
            ],
          ],
          [
            'CONDITIONS',
            [
              ['branch', 'Condition', 'purple'],
              ['switch', 'Switch', 'teal'],
              ['filter', 'Filter', 'purple'],
            ],
          ],
          [
            'TRANSFORM',
            [
              ['sliders', 'Normalize fields', 'orange'],
              ['file', 'Format data', 'blue'],
            ],
          ],
        ]) {
          const group = util.el('section', 'relay-palette-section', palette);
          util.el('div', 'relay-palette-group', group, heading);
          for (const [icon, label, tone] of items) {
            const row = util.el('div', 'relay-palette-row', group);
            glyph(util, util.el('b', `relay-palette-icon ${tone}`, row), icon);
            util.el('span', '', row, label);
          }
        }
        const stats = util.el('aside', 'relay-stats', body);
        const types = util.el('div', 'relay-card', stats);
        util.el('strong', '', types, 'Step Types');
        for (const [ico, n, name, color] of [
          ['ϟ', '1', 'Trigger', 'green'],
          ['⚙', '2', 'Actions', 'blue'],
          ['◆', '1', 'Condition', 'orange'],
          ['▤', '1', 'Data', 'purple'],
          ['■', '1', 'End', 'red'],
        ]) {
          const row = util.el('div', 'relay-type', types);
          util.el('b', color, row, ico);
          util.el('em', '', row, n);
          util.el('span', '', row, name);
        }
        const connections = util.el('div', 'relay-card relay-connections', stats);
        util.el('strong', '', connections, 'Connections');
        for (const [n, label, color] of [
          ['5', 'Total', 'blue'],
          ['0', 'Errors', 'red'],
          ['0', 'Warnings', 'orange'],
        ]) {
          const row = util.el('div', 'relay-count', connections);
          util.el('b', color, row, n);
          util.el('span', '', row, label);
        }
        S.frameAlign(_c, stage);
        Object.assign(_c, {
          connections,
          edhead,
          editor,
          edtitle,
          palette,
          paletteHead,
          stage,
          stats,
          status,
          stepSearch,
          titleLine,
          toolrow,
          types,
        });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-workflow-editor-reroute-02',
    template: 'site/base',
    design: { parts },
  });
})();
