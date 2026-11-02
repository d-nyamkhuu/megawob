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
        if (kind === 'banner') el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'cookie') {
          const copy = box.querySelector('.ref-ov-text');
          const title = util.el('strong', 'log-cookie-title', copy, 'We use cookies to improve your experience');
          copy.prepend(title);
          const icon = util.el('span', 'log-cookie-icon', box);
          icon.setAttribute('aria-hidden', 'true');
          box.prepend(icon);
        }
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
        if (display === 'toast' && (!tall || !roomy)) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-has-header-note', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const navDraw = rng.bool(0.5);
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, local, nav, rng, util } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          const brand = util.el('div', 'ref-brand', header, 'Log Explorer');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const navLabels = ['Code', 'Builds', 'Pipelines', 'Logs', 'Database', 'Feature Flags', 'Environments'];
          for (const item of navLabels) {
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
        const status = util.el('div', 'log-header-status', header);
        util.el('span', '', status, 'Last updated: 14:27:12');
        const refresh = util.el('label', '', status, 'Auto-refresh');
        const refreshBox = util.el('input', '', refresh);
        refreshBox.type = 'checkbox';
        refreshBox.checked = true;
        util.el('span', '', refresh, '(10s)');
        Object.assign(_c, { headerTools, refresh, refreshBox, status, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const help = util.el('aside', 'log-help', body);
        util.el('h3', '', help, 'Search Tips');
        util.el(
          'p',
          '',
          help,
          'Type keywords to find log events.\nUse quotes for exact phrases.\nYou can filter by service, severity,\nand time range.',
        );
        util.el('h3', '', help, 'Common Examples');
        util.el(
          'p',
          'log-examples',
          help,
          'error\n"upstream timeout"\nservice:session-cache\nuser:12345\nrequest_id:abc123',
        );
        util.el('h3', '', help, 'Severity Levels');
        for (const [level, description] of [
          ['ERROR', 'Application errors, request failures'],
          ['WARN', 'Potential problems'],
          ['INFO', 'General information'],
          ['DEBUG', 'Detailed diagnostic information'],
        ]) {
          const row = util.el('div', 'log-severity', help);
          util.el('i', `sev-${level.toLowerCase()}`, row);
          const copy = util.el('div', '', row);
          util.el('b', '', copy, level);
          util.el('span', '', copy, description);
        }
        util.el('h3', '', help, 'Fields in Details');
        for (const [key, desc] of [
          ['timestamp', 'When the event occurred'],
          ['service', 'Source service'],
          ['level', 'Log severity'],
          ['message', 'Log message text'],
          ['host', 'Hostname or instance'],
          ['request_id', 'Request identifier'],
          ['trace_id', 'Distributed trace identifier'],
          ['user', 'Associated user (if any)'],
        ]) {
          const row = util.el('div', 'log-field', help);
          util.el('span', '', row, key);
          util.el('span', '', row, desc);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, headerTools, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // Keep the required episode decoys in the form utility area, leaving the
        // title bar dedicated to the explorer's status and header end control.
        const headerDecoys = [...headerTools.querySelectorAll('.ref-xtra')];
        if (headerDecoys.length) {
          let utility = document.querySelector('.ref-foot .ref-tools, .ref-float-dock');
          if (!utility) utility = util.el('div', 'ref-utility', document.body);
          for (const button of headerDecoys) utility.append(button);
        }
        Object.assign(_c, { headerDecoys, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-dev-tools-logs-03',
    template: 'site/base',
    design: { parts },
  });
})();
