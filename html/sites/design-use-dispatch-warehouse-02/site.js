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
        if (kind === 'banner' || kind === 'toast')
          el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom + (kind === 'toast' ? 12 : 0)}px`;
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
          const art = util.el('div', 'wh-news-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 100 80" fill="none"><path d="m10 33 40-29 40 29v40H10z" fill="#427ff0"/><rect x="26" y="5" width="49" height="51" rx="6" fill="#dceaff"/><path d="M35 18h30M35 28h30M35 38h22" stroke="#3b7eea" stroke-width="5"/><path d="m10 33 40 25 40-25v40H10z" fill="#6a9cff"/><path d="m10 73 40-28 40 28" fill="#4c87f5"/></svg>';
          box.prepend(art);
          const heading = util.el('h2', 'wh-news-title', box, 'Get warehouse insights');
          art.after(heading);
          const input = util.el('input', 'wh-news-field', box);
          input.type = 'text';
          input.placeholder = 'Enter your email address';
          input.setAttribute('aria-label', 'Email address');
          row.before(input);
          const close = util.el('button', 'wh-news-close', box, '×');
          close.type = 'button';
          close.title = 'Close';
          close.addEventListener('click', () => ctx.dismiss('close'));
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
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.instruction = display;
        document.body.classList.toggle('wh-finish', !!ctx.finish);

        // The reference design is a full-window Material app, without desktop frame.
        const win = util.el('div', 'wh-windowbar', document.body);
        util.el('span', 'wh-appicon', win, '▧');
        util.el('span', 'wh-windowtitle', win, 'Warehouse Dispatch');
        const winControls = util.el('div', 'wh-windowcontrols', win);
        util.el('span', '', winControls, '−');
        util.el('span', '', winControls, '□');
        util.el('span', 'wh-close', winControls, '×');
        const menu = util.el('div', 'wh-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) util.el('span', '', menu, item);
        Object.assign(_c, { H, W, display, menu, roomy, tall, win, winControls });
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
        const sampledNav = W >= 1180 && rng.bool(0.5);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        const referenceEnd = !word && rng.fork('material/end-label').bool(0.5);
        if (referenceEnd) label = 'OK';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          nav,
          placement,
          referenceEnd,
          sampledNav,
          sidebar,
          wantFooter,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, sampledNav, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          // Retain the scaffold's random draws even though this design's brand is fixed.
          if (display !== 'header' || sampledNav) {
            rng.pick(TITLES);
            if (word) lr.pick(K.brand);
          }
          const title = 'Harborview Logistics';
          const brand = util.el('div', 'ref-brand', header, title);
          brand.dataset.role = 'brand';
        }
        if (nav) {
          if (sampledNav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const n = util.el('nav', 'ref-nav', header);
          for (const item of ['Warehouse', 'Inbound', 'Outbound', 'Inventory', 'Reports']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
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
        const search = util.el('button', 'wh-search', headerTools);
        search.type = 'button';
        search.title = 'Search';
        search.setAttribute('aria-label', 'Search');
        search.innerHTML =
          '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="m18 18 7 7"/></svg>';
        search.addEventListener('click', () => env.log('decoy', { label: 'Search' }));
        util.el('span', 'wh-avatar', headerTools, 'JD');
        Object.assign(_c, { headerTools, search, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('aside', 'wh-summary', body);
        util.el('div', 'wh-summary-label', summary, 'Dispatch');
        const reference = util.el('h1', 'wh-reference', summary);
        util.el('div', 'wh-summary-date', summary, 'Wed, Jul 18, 2024');
        const progress = util.el('div', 'wh-progress', summary);
        const ring = util.el('div', 'wh-ring', progress);
        const assignedBlock = util.el('div', '', progress);
        const assignedValue = util.el('strong', 'wh-progress-value', assignedBlock);
        util.el('div', '', assignedBlock, 'Assigned');
        const totals = util.el('div', 'wh-totals', summary);
        const countRows = {};
        for (const label of ['Assigned', 'Unassigned', 'Total items']) {
          const row = util.el('div', 'wh-summary-row', totals);
          util.el('span', '', row, label);
          countRows[label] = util.el('span', '', row);
        }
        const binSummary = util.el('div', 'wh-bin-summary', summary);
        util.el('h2', '', binSummary, 'Storage bins');
        const binRows = util.el('div', '', binSummary);
        S.frameSidebar(_c, body);
        Object.assign(_c, {
          assignedBlock,
          assignedValue,
          binRows,
          binSummary,
          body,
          countRows,
          progress,
          reference,
          ring,
          summary,
          totals,
        });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, summary, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', summary);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          summary.prepend(panel);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const {
          assignedValue,
          binRows,
          countRows,
          endBtn,
          label,
          placement,
          reference,
          referenceEnd,
          ring,
          stage,
          util,
        } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        if (submit && referenceEnd) {
          let foot = document.querySelector('.ref-foot');
          if (!foot) foot = util.el('footer', 'ref-foot', document.body);
          let tools = foot.querySelector('.ref-tools');
          if (!tools) tools = util.el('div', 'ref-tools', foot);
          submit.className = 'ref-submit';
          submit.textContent = label;
          tools.append(submit);
          const dock = document.querySelector('.ref-float-dock');
          if (dock && !dock.children.length) dock.remove();
        }
        // The widget publishes model-derived summary values without touching its DOM.
        const refreshSummary = ({ detail: data }) => {
          reference.textContent = data.reference;
          assignedValue.textContent = `${data.assigned} / ${data.total}`;
          ring.style.setProperty('--progress', `${data.total ? (data.assigned / data.total) * 100 : 0}%`);
          countRows.Assigned.textContent = data.assigned;
          countRows.Unassigned.textContent = data.total - data.assigned;
          countRows['Total items'].textContent = data.total;
          binRows.replaceChildren();
          for (const [name, count] of Object.entries(data.groups)) {
            const zone = name.toLowerCase().split(' ')[0];
            const row = util.el('div', `wh-summary-row wh-zone-${zone}`, binRows);
            util.el(
              'span',
              'wh-zone-icon',
              row,
              zone === 'chilled' || zone === 'frozen' ? '❄' : zone === 'hazmat' ? '⚠' : '◇',
            );
            util.el(
              'span',
              'wh-zone-label',
              row,
              zone === 'ambient'
                ? 'Ambient (15–25°C)'
                : zone === 'chilled'
                  ? 'Chilled (2–8°C)'
                  : zone === 'frozen'
                    ? 'Frozen (≤−18°C)'
                    : name,
            );
            util.el('span', '', row, count);
          }
          const total = util.el('div', 'wh-summary-row wh-bin-total', binRows);
          util.el('span', '', total, 'Total bins');
          util.el('span', '', total, data.bins);
        };
        stage.addEventListener('warehouse-summary', refreshSummary);
        Object.assign(_c, { submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-dispatch-warehouse-02',
    template: 'site/base',
    design: { parts },
  });
})();
