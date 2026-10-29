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
        if (kind === 'banner') {
          // Overlays must not resize the stage after the widget has been measured.
          el.style.top = `${document.querySelector('.ref-body').getBoundingClientRect().top}px`;
        } else if (kind === 'cookie') {
          const footer = document.querySelector('.ref-foot, .ref-float-dock');
          el.style.bottom = `${footer ? window.innerHeight - footer.getBoundingClientRect().top : 0}px`;
        } else if (kind === 'chat' || kind === 'promo') {
          const heading = util.el('div', 'civic-dialog-title', box, kind === 'chat' ? 'Need help?' : 'Stay informed');
          box.insertBefore(heading, box.firstChild);
          if (kind === 'chat') heading.appendChild(dismiss);
          else {
            const close = util.el('button', 'civic-dialog-close', heading, '×');
            close.type = 'button';
            close.setAttribute('aria-label', word ? word('close') : 'Close');
            close.addEventListener('click', () => ctx.dismiss('close'));
          }
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
        document.body.dataset.instruction = display;
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        base(_c);
        _c.wantFooter = true;
        if (!_c.ctx.finish) {
          const roll = _c.ctx.rng.fork('civic/windows-end').int(0, 7);
          _c.placement = roll < 4 ? 'footer' : ['header', 'icon', 'link', 'floating'][roll - 4];
          if (roll < 4) {
            _c.label = 'Finish';
            if (_c.collide && _c.collide.text === 'Finish')
              _c.collide.text = _c.content.collideLabel(_c.ctx.rng.fork('civic/windows-collide'), 'Finish');
          }
        }
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const winbar = util.el('div', 'gov-windowbar', document.body);
        util.el('span', 'gov-appicon', winbar, '▤');
        util.el('strong', 'gov-window-name', winbar, 'Civic Support Application');
        const wincontrols = util.el('div', 'gov-window-controls', winbar);
        for (const mark of ['−', '□', '×']) util.el('span', '', wincontrols, mark);
        const menubar = util.el('nav', 'gov-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', '', menubar, item);
        const toolbar = util.el('div', 'gov-toolbar', document.body);
        const toolbarItems = [
          ['new', 'New'],
          ['open', 'Open'],
          ['copy', 'Copy'],
          ['delete', 'Delete'],
          ['print', 'Print'],
          ['find', 'Find'],
        ];
        for (const [icon, label] of toolbarItems) {
          const tool = util.el('span', 'gov-tool', toolbar);
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          svg.classList.add('gov-icon', `gov-icon-${icon}`);
          const shape = (tag, attrs) => {
            const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
            svg.appendChild(node);
          };
          if (icon === 'new') {
            shape('path', { d: 'M5 2.5h9l5 5V21H5z', fill: '#fff', stroke: '#173d69', 'stroke-width': '1.5' });
            shape('path', { d: 'M14 2.5V8h5M8 12h8M8 15h8', fill: 'none', stroke: '#173d69', 'stroke-width': '1.4' });
          } else if (icon === 'open') {
            shape('path', { d: 'M2.5 7h8l2 2h9v11h-19z', fill: '#f4c84c', stroke: '#775b18', 'stroke-width': '1.5' });
            shape('path', { d: 'M2.5 11h19l-3 8h-19z', fill: '#ffe58a', stroke: '#775b18', 'stroke-width': '1.2' });
          } else if (icon === 'copy') {
            shape('rect', {
              x: '7',
              y: '5',
              width: '13',
              height: '16',
              fill: '#fff',
              stroke: '#173d69',
              'stroke-width': '1.5',
            });
            shape('path', { d: 'M4 17H3V2h13v1', fill: 'none', stroke: '#173d69', 'stroke-width': '1.5' });
            shape('path', { d: 'M10 9h7M10 12h7M10 15h5', stroke: '#173d69', 'stroke-width': '1.2' });
          } else if (icon === 'delete') {
            shape('path', { d: 'M4 3 21 21M21 3 4 21', fill: 'none', stroke: '#c52319', 'stroke-width': '2.7' });
          } else if (icon === 'print') {
            shape('path', {
              d: 'M6 8V3h12v5M6 17H3V9h18v8h-3M6 14h12v7H6z',
              fill: '#fff',
              stroke: '#173d69',
              'stroke-width': '1.5',
            });
            shape('circle', { cx: '18', cy: '11.5', r: '1', fill: '#173d69' });
          } else {
            shape('path', {
              d: 'M4 4h5v7h6V4h5l2 15h-9v-6h-2v6H2z',
              fill: '#153e68',
              stroke: '#082e50',
              'stroke-width': '1.3',
            });
            shape('path', { d: 'M5 6h3M16 6h3M4 17h5M15 17h5', stroke: '#7eaccb', 'stroke-width': '2' });
          }
          tool.appendChild(svg);
          util.el('span', '', tool, label);
        }
        // Keep the standard episode note and end controls in the application frame.
        document.body.insertBefore(winbar, header);
        document.body.insertBefore(menubar, header);
        document.body.insertBefore(toolbar, header);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, menubar, toolbar, toolbarItems, winbar, wincontrols });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        {
          const side = util.el('aside', 'ref-side', body);
          if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
          util.el('div', 'gov-side-title', side, 'My Applications');
          const grid = util.el('div', 'gov-applicant-grid', side);
          for (const label of ['Ref No.', 'Type', 'Status']) util.el('b', '', grid, label);
          for (const row of [
            ['CS-2024-0178', 'Housing Support', 'Draft'],
            ['CS-2024-0112', 'Council Tax Support', 'Submitted'],
            ['CS-2023-0945', 'Child Benefit', 'Approved'],
            ['CS-2023-0761', 'Disability Support', 'Closed'],
            ['CS-2023-0520', 'Housing Support', 'Closed'],
            ['CS-2022-1188', 'Council Tax Support', 'Closed'],
            ['CS-2022-0043', 'Child Benefit', 'Closed'],
          ]) {
            for (const [i, value] of row.entries()) {
              const cell = util.el('span', '', grid, value);
              if (grid.children.length === 4) cell.classList.add('selected');
            }
          }
        }
        Object.assign(_c, { body });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, display, endBtn, header, headerTools, label, placement, menubar, winbar, wincontrols, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // The instruction belongs to the title bar; controls live in the menu/footer.
        const note = header.querySelector('.ref-instruction');
        if (note) winbar.insertBefore(note, wincontrols);
        menubar.appendChild(headerTools);
        header.hidden = true;
        if (display === 'panel') {
          const panel = body.querySelector('.ref-panel');
          const side = body.querySelector('.ref-side');
          side.insertBefore(panel, side.querySelector('.gov-applicant-grid'));
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-gov-portal-checklist-05',
    template: 'site/base',
    design: { parts },
  });
})();
