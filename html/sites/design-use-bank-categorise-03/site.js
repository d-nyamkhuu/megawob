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
        const endRect = document.querySelector('[data-role="submit"]')?.getBoundingClientRect();
        if ((kind === 'cookie' || kind === 'chat') && endRect && endRect.top > window.innerHeight / 2) {
          el.style.bottom = window.innerHeight - endRect.top + 14 + 'px';
        }
        if (kind === 'banner') {
          const headerRect = document.querySelector('.ref-task')?.getBoundingClientRect();
          if (headerRect) el.style.top = headerRect.bottom + 6 + 'px';
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
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('rb-header-note', display === 'header');
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
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        if (rng.fork('riverbend/end-label').bool(0.5)) label = 'Submit';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of (local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav),
          ['Overview', 'Transactions', 'Bill Pay', 'Transfers', 'Cards', 'Goals'])) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        } else {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of ['Overview', 'Transactions', 'Bill Pay', 'Transfers', 'Cards', 'Goals']) {
            const a = util.el('a', 'ref-navlink', n, item);
            if (item === 'Transactions') a.classList.add('selected');
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const topSearch = util.el('div', 'rb-topsearch', header, '⌕  Search transactions, merchants…');
        Object.assign(_c, { topSearch });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);

        // RISC OS style application iconbar. Keep it separate from the window title.
        const appbar = util.el('nav', 'rb-iconbar', document.body);
        const traffic = util.el('div', 'rb-traffic', appbar);
        for (const name of ['close', 'minimize', 'maximize']) util.el('span', name, traffic);
        const logo = util.el('div', 'rb-logo', appbar);
        logo.innerHTML =
          '<svg width="34" height="27" viewBox="0 0 34 27" fill="none" aria-hidden="true"><path d="M3 11L9 5Q12 2 16 6L19 9Q21 11 24 8L27 5L31 9" stroke="#57bed3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 20L9 14Q12 11 16 15L19 18Q21 20 24 17L27 14L31 18" stroke="#0b77ed" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Riverbend Bank</span>';
        const icons = [
          ['⌂', 'Home'],
          ['▱', 'Accounts'],
          ['▣', 'Transactions'],
          ['✉', 'Bill Pay'],
          ['⇄', 'Transfers'],
          ['▰', 'Cards'],
          ['◷', 'Budgets'],
          ['▥', 'Insights'],
          ['⚙', 'Settings'],
        ];
        const navPaths = {
          Home: 'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
          Accounts: 'M5 7h14v13H5zM8 7V4h8v3M5 12h14M9 16h6',
          Transactions: 'M4 5h16v14H4zM4 10h16M7 15h4M16 14h2',
          'Bill Pay': 'M3 5h18v15H3zM3 6l9 8 9-8M8 4v4M16 4v4',
          Transfers: 'M4 7h16l-4-4M20 17H4l4 4M20 7l-4 4M4 17l4-4',
          Cards: 'M3 6h18v14H3zM3 11h18M7 16h3',
          Budgets: 'M11 3a9 9 0 1 0 10 10H11zM14 2v8h8a9 9 0 0 0-8-8z',
          Insights: 'M4 21V10M9 21V3M14 21V13M19 21V6',
          Settings: 'M9 3h6l1 4 4 1 1 6-4 2-1 4H9l-1-4-4-2 1-6 4-1zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
        };
        for (const [glyph, text] of icons) {
          const item = util.el('button', `rb-iconitem${text === 'Transactions' ? ' active' : ''}`, appbar);
          item.type = 'button';
          const icon = util.el('span', 'rb-icon', item);
          icon.innerHTML =
            '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
            navPaths[text] +
            '"/></svg>';
          util.el('span', 'rb-icon-label', item, text);
          item.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
        }
        Object.assign(_c, { appbar, icons, logo, navPaths, traffic });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        const status = util.el('div', 'rb-status', document.body);
        util.el('strong', 'rb-status-brand', status, '▤  RiscBank');
        util.el('span', 'rb-status-time', status, 'Mon 17 Apr 1989   10:24');
        Object.assign(_c, { status, submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, ctx, endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const summary = util.el('aside', 'rb-summary', body);
        const instructionPanel = body.querySelector('.ref-panel');
        if (instructionPanel) summary.append(instructionPanel);
        // Static filler cards: nothing here reads the widget, so nothing moves when the task is worked.
        const txs = (ctx.spec && ctx.spec.transactions) || [];
        const money = (cents) =>
          '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const monthDay = (iso) => {
          const [year, month, day] = String(iso || '').split('-');
          return month
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1] +
                ' ' +
                Number(day) +
                ', ' +
                year
            : '';
        };
        const spending = util.el('section', 'rb-card rb-spending', summary);
        util.el('h2', '', spending, 'Spending by Category');
        util.el('p', 'rb-muted', spending, 'Last 30 days');
        const chartRow = util.el('div', 'rb-chart-row', spending);
        const donut = util.el('div', 'rb-donut', chartRow);
        const donutCenter = util.el('div', 'rb-donut-center', donut);
        util.el('strong', '', donutCenter, money(txs.reduce((n, t) => n + t.amount, 0)));
        util.el('span', '', donutCenter, 'Total spent');
        const legend = util.el('div', 'rb-legend', chartRow);
        const shares = [
          ['Dining', '#ffad21', 34],
          ['Groceries', '#1dc886', 27],
          ['Transport', '#3284f5', 21],
          ['Utilities', '#19c999', 11],
          ['Other', '#8699b7', 7],
        ];
        let angle = 0;
        const stops = [];
        for (const [category, color, share] of shares) {
          stops.push(color + ' ' + angle + '% ' + (angle + share) + '%');
          angle += share;
          const line = util.el('div', 'rb-legend-row', legend);
          util.el('i', '', line).style.background = color;
          util.el('span', '', line, category);
          util.el('span', 'rb-legend-number', line, share + '%');
        }
        donut.style.background = 'conic-gradient(' + stops.join(',') + ')';
        const counts = util.el('section', 'rb-card rb-counts', summary);
        util.el('h2', '', counts, 'Transaction Categories');
        const countRow = (symbol, label, cls, value) => {
          const row = util.el('div', 'rb-count-row', counts);
          util.el('span', 'rb-count-icon ' + cls, row, symbol);
          util.el('span', '', row, label);
          util.el('strong', '', row, value);
        };
        countRow('✓', 'Matched by rules', 'rb-green', '41');
        countRow('•••', 'Awaiting rules', 'rb-gray', '6');
        countRow('', 'Statement lines', 'rb-none', '47');
        const recentCard = util.el('section', 'rb-card rb-recent', summary);
        util.el('h2', '', recentCard, 'Recent Activity');
        const recent = util.el('div', 'rb-recent-list', recentCard);
        const merchantColors = ['#14bf77', '#006e54', '#ffb600', '#b45a1d'];
        txs.slice(0, 4).forEach((t, i) => {
          const row = util.el('div', 'rb-activity-row', recent);
          const icon = util.el(
            'span',
            'rb-activity-icon',
            row,
            t.name
              .split(' ')
              .map((x) => x[0])
              .slice(0, 2)
              .join(''),
          );
          icon.style.background = merchantColors[i];
          const info = util.el('div', 'rb-activity-info', row);
          util.el('strong', '', info, t.name);
          util.el('span', '', info, monthDay(t.date));
          util.el('span', 'rb-activity-amount', row, '−' + money(t.amount));
        });
        Object.assign(_c, {
          chartRow,
          counts,
          donut,
          donutCenter,
          instructionPanel,
          legend,
          recent,
          recentCard,
          spending,
          submit,
          summary,
        });
      },
  };

  env.site({
    name: 'design-use-bank-categorise-03',
    template: 'site/base',
    design: { parts },
  });
})();
