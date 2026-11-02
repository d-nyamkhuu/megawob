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
        if (kind === 'banner') {
          const work = document.querySelector('.ad-work');
          if (work) work.insertBefore(el, work.querySelector('.ad-workspace'));
        }
        if (kind === 'cookie' || kind === 'chat') {
          const end = document.querySelector('[data-role="submit"]');
          const rect = end && end.getBoundingClientRect();
          el.style.bottom = `${rect && rect.top > window.innerHeight * 0.6 ? window.innerHeight - rect.top + 12 : 72}px`;
        }
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'cookie') {
          const icon = util.el('span', 'cookie-symbol', box);
          icon.innerHTML =
            '<svg viewBox="0 0 28 28" aria-hidden="true"><path fill="#f4ad46" d="M25 13a6 6 0 0 1-7-8 6 6 0 0 1-5-4A13 13 0 1 0 27 15a6 6 0 0 1-2-2z"/><g fill="#b36b2b"><circle cx="9" cy="8" r="1.7"/><circle cx="6" cy="17" r="1.6"/><circle cx="14" cy="14" r="1.8"/><circle cx="17" cy="22" r="1.5"/></g></svg>';
        }
        if (kind === 'banner') {
          const icon = util.el('span', 'banner-symbol', box);
          icon.innerHTML =
            '<svg viewBox="0 0 28 28" aria-hidden="true"><path fill="#007aff" d="m4 10 16-6v18L4 16zM2 10h5v7H2zM7 17h5l2 8H9z"/><path stroke="#007aff" stroke-width="2" d="m23 5 3-3m-2 11h4m-5 7 3 3"/></svg>';
        }
        if (kind === 'promo') {
          const illustration = util.el('div', 'newsletter-art', box);
          illustration.innerHTML =
            '<svg viewBox="0 0 140 140" aria-hidden="true"><path fill="#d4e8ff" d="m10 63 60-49 60 49v62H10z"/><rect x="30" y="22" width="80" height="84" rx="7" fill="#f2f8ff"/><path stroke="#7eb6ff" stroke-width="5" d="M44 40h52M44 54h52M44 68h35"/><path fill="#4096ff" d="M10 63v62h120V63l-60 43z"/><path fill="#197bff" d="m10 125 60-46 60 46z"/></svg>';
          util.el('h2', 'newsletter-title', box, 'Stay in the loop');
        }
        if (kind === 'chat') util.el('strong', 'chat-title', box, 'How can we help?');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo' || kind === 'chat') {
          const inputRow = util.el('div', 'overlay-input-row', box);
          const input = util.el('input', 'overlay-input', inputRow);
          input.placeholder = kind === 'promo' ? 'name@company.com' : 'Type a message…';
          input.setAttribute('aria-label', kind === 'promo' ? 'Email address' : 'Chat message');
          if (kind === 'chat') {
            const send = util.el('button', 'chat-send', inputRow, '➤');
            send.type = 'button';
            send.setAttribute('aria-label', 'Send chat message');
            send.addEventListener('click', () => env.log('overlay-click', { label: 'Send chat message' }));
          }
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
          const close = util.el('button', 'promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
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
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const dock = util.el('nav', 'dispatch-dock', header);
        const dockItems = [
          [
            'Dispatch',
            '<path fill="currentColor" stroke="none" d="M2 4h12v14H2zM14 9h5l4 5v4h-9z"/><path fill="white" stroke="none" d="M16 10h2.5l2.5 4h-5z"/><circle fill="white" cx="7" cy="18" r="2.4"/><circle fill="white" cx="18" cy="18" r="2.4"/>',
          ],
          ['Deliveries', '<path d="M9 5h12M9 12h12M9 19h12"/><path d="M3 5h2v2H3zM3 11h2v2H3zM3 18h2v2H3z"/>'],
          [
            'Vehicles',
            '<path fill="currentColor" stroke="none" d="M2 4h12v14H2zM14 9h5l4 5v4h-9z"/><path fill="white" stroke="none" d="M16 10h2.5l2.5 4h-5z"/><circle fill="white" cx="7" cy="18" r="2.4"/><circle fill="white" cx="18" cy="18" r="2.4"/>',
          ],
          [
            'Map',
            '<path fill="currentColor" stroke="none" d="M12 24S3 14 3 9a9 9 0 1 1 18 0c0 5-9 15-9 15z"/><circle fill="white" stroke="none" cx="12" cy="9" r="3.3"/>',
          ],
          ['Reports', '<path d="M4 20V12h4v8zM10 20V7h4v13zM16 20V3h4v17z"/>'],
          [
            'Settings',
            '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="m9 1 6 0 .7 3.1 2 1.2 3.1-1 3 5.2-2.4 2.1v2.4l2.4 2.1-3 5.2-3.1-1-2 1.2-.7 3.1H9l-.7-3.1-2-1.2-3.1 1-3-5.2 2.4-2.1v-2.4L.2 9.5l3-5.2 3.1 1 2-1.2L9 1zm3 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>',
          ],
        ];
        for (let i = 0; i < dockItems.length; i++) {
          const [label, paths] = dockItems[i];
          const item = util.el('a', `dispatch-dock-item${i === 0 ? ' is-active' : ''}`, dock);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
          const icon = util.el('span', 'dispatch-dock-icon', item);
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
          util.el('span', 'dispatch-dock-label', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { dock, dockItems, header });
      },
  };

  env.site({
    name: 'design-use-dispatch-reschedule-05',
    template: 'site/base',
    design: { parts },
  });
})();
