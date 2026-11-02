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
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const pageRect = document.body.getBoundingClientRect();
        if (kind === 'cookie' && endRect && endRect.bottom > pageRect.height - 100)
          el.style.right = `${Math.max(6, pageRect.width - endRect.left + 10)}px`;
        if (kind === 'chat' && endRect && endRect.bottom > pageRect.height - 150) el.style.bottom = '76px';
        if (kind === 'banner') document.querySelector('.ref-task').after(el);
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.instruction = display;
        const scenery = util.el('div', 'r-scenery', header);
        scenery.innerHTML =
          '<svg viewBox="0 0 160 82" aria-hidden="true"><defs><g id="r-pine"><path d="M0 4L-9 18H-5L-14 30H-8L-18 43H-5V53H2V43H17L8 30H13L5 18H9Z" fill="#398564" stroke="#173d35" stroke-width="1.4"/><path d="M0 8L-5 19H1L-9 30H0L-12 41H1" fill="none" stroke="#a2c29b" stroke-width="2"/></g></defs><path d="M5 72L42 48 84 51 109 39 153 55 158 77Z" fill="#80bb78"/><path d="M60 48Q108 52 87 61T127 77H36Q78 64 57 61T60 48" fill="#92cbeb" stroke="#578aaf"/><use href="#r-pine" x="27" y="3"/><use href="#r-pine" transform="translate(56 20) scale(.7)"/><use href="#r-pine" transform="translate(92 28) scale(.55)"/><use href="#r-pine" transform="translate(120 24) scale(.65)"/><use href="#r-pine" transform="translate(141 32) scale(.65)"/></svg>';
        const hospital = util.el('div', 'r-hospital', header);
        hospital.innerHTML =
          '<svg viewBox="0 0 180 90" aria-hidden="true"><g stroke="#174573" stroke-width="2"><path d="M18 82V54H56V44H76V20L94 11 108 20V45H141V53H165V82Z" fill="#fffce5"/><path d="M78 21H108M84 12H101M93 11V2" fill="none"/><path d="M94 4L101 7 94 9" fill="#e5ad37"/><path d="M88 65H101V82H88Z" fill="#b3dce7"/><path d="M25 61H31V69H25ZM39 61H45V69H39ZM58 53H65V61H58ZM82 29H87V37H82ZM96 29H101V37H96ZM82 43H87V51H82ZM96 43H101V51H96ZM116 53H122V61H116ZM131 56H137V64H131ZM149 61H155V69H149Z" fill="#7bb1d3"/><path d="M21 82H171" stroke="#47935b" stroke-width="5"/></g></svg>';
        const facade = hospital.querySelector('svg');
        util.svg(
          'path',
          {
            d: 'M25 73h6v7h-6zM39 73h6v7h-6zM58 67h7v12h-7zM116 67h6v12h-6zM131 68h6v11h-6zM149 73h6v7h-6zM82 55h5v7h-5zM96 55h5v7h-5z',
            fill: '#6eacd1',
            stroke: '#174573',
            'stroke-width': '1.3',
          },
          facade,
        );
        util.svg(
          'path',
          {
            d: 'M17 53h40M56 43h20M110 44h31M141 52h25M76 24h32M94 25v38',
            fill: 'none',
            stroke: '#174573',
            'stroke-width': '1.3',
          },
          facade,
        );
        util.svg('use', { href: '#r-pine', transform: 'translate(8 34) scale(.65)' }, facade);
        util.el('div', 'r-motto', header, 'Compassionate Care\nfor a Healthier\nTomorrow');
        S.frameBrand(_c, header);
        Object.assign(_c, { facade, header, hospital, scenery });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { W, content, header, nav, rng, util } = _c;
        if (nav || W >= 760) {
          const n = util.el('nav', 'ref-nav', header);
          if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of [
            'Patient List',
            'Chart',
            'Orders',
            'Medications',
            'Nursing',
            'Bed Management',
            'Scheduling',
            'Reports',
          ]) {
            const a = util.el('a', 'ref-navlink', n, item);
            if (item === 'Nursing') {
              const badge = util.el('span', 'r-nursing-badge', a);
              badge.innerHTML =
                '<svg viewBox="0 0 28 22" aria-hidden="true"><path d="M2 7L7 2H21L26 7 23 17H5Z" fill="white" stroke="#173c68" stroke-width="1.5"/><path d="M11 6H17V9H20V14H17V17H11V14H8V9H11Z" fill="#c84448"/></svg>';
              a.prepend(badge);
            }
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
      },
  };

  env.site({
    name: 'design-use-health-records-vitals-02',
    template: 'site/base',
    design: { parts },
  });
})();
