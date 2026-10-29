// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
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
        if (kind === 'cookie' || kind === 'promo') {
          const close = util.el('button', 'studio-overlay-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', closeLabelForOverlay());
          close.addEventListener('click', () => ctx.dismiss(kind === 'cookie' ? 'reject' : 'close'));
        }
        function closeLabelForOverlay() {
          return word ? word('close') : 'Close';
        }
        if (kind === 'promo') {
          util.el('div', 'studio-promo-title', box, 'Get product updates');
          const picture = util.el('div', 'studio-promo-picture', box);
          picture.innerHTML =
            '<svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="82" fill="#eee8ff"/><g transform="rotate(-14 90 90)"><rect x="35" y="53" width="110" height="78" rx="9" fill="#6435da"/><path d="m39 60 47 41q5 4 10 0l45-41" fill="none" stroke="white" stroke-width="3"/></g><path d="m16 35 4 10 10 4-10 4-4 10-4-10-10-4 10-4zm144 87 3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#8b6ce5"/></svg>';
          util.el('div', 'studio-promo-email', box, 'Enter your email');
          el.style.top = `${document.querySelector('.lo-bar').getBoundingClientRect().bottom}px`;
        }
        if (kind === 'chat') {
          util.el('strong', 'studio-chat-title', box, 'Hi there!');
          util.el('span', 'studio-chat-mark', box, '▤');
          const composer = util.el('div', 'studio-chat-composer', box, 'Type a message...');
          util.el('span', 'studio-chat-send', composer, '➤');
        }
        if (kind === 'cookie' || kind === 'chat') {
          const dock = document.querySelector('.ref-foot, .ref-float-dock');
          if (dock) el.style.bottom = `${dock.getBoundingClientRect().height + 16}px`;
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
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        document.body.dataset.studioInstruction = display;
        document.body.dataset.studioTaskNote = ctx.instruction;
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy ? (rng.bool(0.35), true) : false;
        const nav = W >= 1180 ? (rng.bool(0.5), true) : false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { lr, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { display, header, util } = _c;
        if (display === 'header') header.classList.add('studio-has-instruction');
        else util.el('div', 'ref-spacer', header);
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        const studioIcons = [
          ['Select', '<path d="M5 3l14 11-7 1-3 6L5 3z"/>'],
          ['Rectangle', '<rect x="4" y="4" width="16" height="16" rx="1"/>'],
          ['Ellipse', '<circle cx="12" cy="12" r="9"/>'],
          ['Text', '<path d="M5 5h14M12 5v15"/>'],
          [
            'Image',
            '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 3-4 5 6"/>',
          ],
          ['Undo', '<path d="M9 14 4 9l5-5M4 9h10a6 6 0 010 12h-2"/>'],
          ['Redo', '<path d="m15 14 5-5-5-5m5 5H10a6 6 0 000 12h2"/>'],
          ['Layers', '<path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5m-18 5 9 5 9-5"/>'],
        ];
        const studioTools = util.el('div', 'studio-tools', headerTools);
        studioIcons.forEach(([title, path], i) => {
          if (i === 5 || i === 7) util.el('span', 'studio-tool-divider', studioTools);
          const icon = util.el('span', `studio-tool${i === 0 ? ' active' : ''}`, studioTools);
          icon.title = title;
          icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
        });
        const zoom = util.el('div', 'studio-zoom', headerTools);
        zoom.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>100%</span><b>⌄</b>';
        const headerActions = util.el('div', 'studio-actions', headerTools);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerActions, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerActions, collide.text, true);
        if (placement === 'header') submit = endBtn(headerActions, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerActions, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerActions, headerTools, studioIcons, studioTools, submit, zoom });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'studio-rail', document.body);
        const mark = util.el('div', 'studio-mark', rail);
        mark.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="16" rx="6" ry="10" transform="rotate(30 16 16)" fill="none" stroke="white" stroke-width="4"/><path d="M7 23 25 8" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>';
        util.el('div', 'studio-rail-brand', rail, 'Studio');
        const railNav = util.el('nav', 'studio-rail-nav', rail);
        const railItems = [
          ['Home', '<path d="m3 11 9-8 9 8v10h-6v-6h-6v6H3z"/>'],
          ['Designs', '<path d="M4 5h12v14H4zM16 8l4-4 2 2-4 4M7 16l3-1 8-8"/>'],
          ['Assets', '<path d="M2 4h8l2 3h10v15H2z"/>'],
          [
            'Styles',
            '<path d="M12 3a9 9 0 100 18h2a2 2 0 002-2c0-1-1-2-1-3s1-2 3-2h1a2 2 0 002-2 9 9 0 00-9-9z"/><circle cx="7" cy="10" r="1"/><circle cx="11" cy="7" r="1"/><circle cx="16" cy="8" r="1"/>',
          ],
          [
            'Team',
            '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6M17 11a3 3 0 000-6M18 14c2 1 3 2 3 5"/>',
          ],
          [
            'Settings',
            '<path d="M10 2h4l1 3 2 1 3-1 2 4-2 2v2l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-2l-2-2 2-4 3 1 2-1z"/><circle cx="12" cy="12" r="4"/>',
          ],
        ];
        railItems.forEach(([title, path]) => {
          const link = util.el('a', `studio-rail-link${title === 'Designs' ? ' selected' : ''}`, railNav);
          link.href = '#';
          link.dataset.role = 'nav';
          link.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg><span>${title}</span>`;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'sidebar', label: title });
          });
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, mark, rail, railItems, railNav });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        stage.dataset.instruction = display;
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'ref-inspector', document.body);
        const tabs = util.el('div', 'ref-inspector-tabs', inspector);
        util.el('div', 'ref-inspector-tab active', tabs, 'Properties');
        util.el('div', 'ref-inspector-tab', tabs, 'Appearance');
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) inspector.appendChild(taskPanel);
        const section = util.el('div', 'ref-inspector-section', inspector);
        util.el('div', 'ref-inspector-heading', section, 'Card');
        const pair = (a, av, b, bv) => {
          const row = util.el('div', 'ref-inspector-pair', section);
          for (const [label, value] of [
            [a, av],
            [b, bv],
          ]) {
            const field = util.el('label', 'ref-inspector-field', row);
            util.el('span', '', field, label);
            util.el('div', 'ref-inspector-value', field, String(value));
          }
        };
        pair('X', '620', 'Y', '206');
        pair('Width', '260', 'Height', '160');
        const fill = util.el('div', 'ref-inspector-control', section);
        util.el('span', 'ref-inspector-label', fill, 'Fill');
        const fillValue = util.el('div', 'ref-inspector-value ref-fill-value', fill);
        fillValue.innerHTML = '<i class="studio-swatch"></i><span>#FFE8D6</span><b>⌄</b>';
        const stroke = util.el('div', 'ref-inspector-control', section);
        util.el('span', 'ref-inspector-label', stroke, 'Stroke');
        const strokeValue = util.el('div', 'ref-inspector-value ref-stroke-value', stroke);
        strokeValue.innerHTML = '<i class="studio-swatch studio-no-stroke"></i><span>None</span><b>⌄</b>';
        const radius = util.el('div', 'ref-inspector-control', section);
        util.el('span', 'ref-inspector-label', radius, 'Corner radius');
        util.el('div', 'ref-inspector-value', radius, '16');
        const layer = util.el('div', 'ref-inspector-control ref-layer-control', section);
        util.el('span', 'ref-inspector-heading', layer, 'Layer');
        const layerValue = util.el('div', 'ref-inspector-value studio-layer-value', layer);
        layerValue.innerHTML = '<span>Normal</span><b>⌄</b>';
        Object.assign(_c, {
          fill,
          fillValue,
          inspector,
          layer,
          layerValue,
          pair,
          radius,
          section,
          stage,
          stroke,
          strokeValue,
          tabs,
          taskPanel,
        });
      },
  };

  env.site({
    name: 'design-align-layout-spacing-04',
    template: 'site/base',
    design: { parts },
  });
})();
