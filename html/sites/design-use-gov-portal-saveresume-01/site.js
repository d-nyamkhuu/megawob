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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Rivermere Council');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const councilNav = ['Home', 'Benefits & Support', 'Housing', 'Council Tax', 'Services', 'My Account'];
          for (const [index, sampled] of (word ? navItems : councilNav).entries()) {
            const item = word ? sampled : councilNav[index % councilNav.length];
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        // The council masthead is present in every episode; retain the existing
        // conditional draws above while making the visual navigation stable.
        if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'Rivermere Council');
        if (!header.querySelector('.ref-nav')) {
          const councilNav = util.el('nav', 'ref-nav', header);
          for (const text of ['Home', 'Benefits & Support', 'Housing', 'Council Tax', 'Services', 'My Account']) {
            const a = util.el('a', 'ref-navlink', councilNav, text);
            a.addEventListener('click', () => env.log('decoy', { what: 'nav', label: text }));
          }
        }
        const brand = header.querySelector('.ref-brand');
        brand.innerHTML =
          '<svg class="council-crest" viewBox="0 0 50 50" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 15h20v15q-1 9-10 13-9-4-10-13Z M19 17v13q1 6 6 9 5-3 6-9V17 M20 10h10v5H20Z M20 10l-2-5 6 3 1-6 2 6 6-3-3 5 M10 15Q0 34 21 46 M40 15q10 19-11 31 M9 21l-5-3m4 11-6-2m10 10-7-1m13 7-7 1m30-23 5-3m-4 11 6-2m-10 10 7-1m-13 7 7 1 M25 20v13m-5-8h10"/></g></svg><span>Rivermere Council</span>';
        Object.assign(_c, { brand, header });
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
        const index = util.el('nav', 'ref-applications', document.body);
        util.el('strong', 'ref-applications-title', index, 'My Applications');
        for (const [i, [title, date]] of [
          ['Civic Support', '12 Mar 2015'],
          ['Housing Register', '3 Feb 2015'],
          ['Council Tax Reduction', '14 Jan 2015'],
          ['Discretionary Support', '20 Nov 2014'],
          ['Free School Meals', '5 Nov 2014'],
        ].entries()) {
          const item = util.el('div', 'ref-application' + (i === 0 ? ' current' : ''), index);
          util.el('strong', '', item, title);
          util.el('span', '', item, 'Saved ' + date);
        }
        util.el('a', 'ref-view-applications', index, 'View all applications →');
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) index.after(headerNote);
        Object.assign(_c, { headerNote, headerTools, index, submit });
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
        // Utility decoys belong in the form's footer, leaving the navigation clear.
        const utilityButtons = [...headerTools.querySelectorAll('.ref-xtra')];
        if (utilityButtons.length) {
          const utilityFoot =
            document.querySelector('.ref-foot .ref-tools') || util.el('div', 'ref-utility-foot', document.body);
          for (const button of utilityButtons) utilityFoot.append(button);
        }
        Object.assign(_c, { submit, utilityButtons });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-gov-portal-saveresume-01',
    template: 'site/base',
    design: { parts },
  });
})();
