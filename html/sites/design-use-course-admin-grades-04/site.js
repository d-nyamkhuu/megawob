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
        if (kind === 'banner') document.querySelector('.ref-body').before(el);
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo' || kind === 'banner')
          el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        if (kind === 'chat') util.el('div', 'aqua-chat-title', box, 'Need help?');
        if (kind === 'promo') {
          const art = util.el('div', 'aqua-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 170 180" aria-hidden="true"><path d="M20 67 83 22l66 46-4 94H25z" fill="#73baff"/><path d="m36 27 86-12 20 118-87 15z" fill="#f4fbff" stroke="#d4eaff"/><path d="m52 53 63-9m-60 25 62-9m-59 25 61-9" stroke="#8fbcf0" stroke-width="6"/><path d="m19 66 67 49 63-47-4 94H25z" fill="#338fff"/><path d="m25 162 61-47 59 47" fill="#68b6ff"/><path d="m17 20 8 4-7 5zm131 25 5-7 5 7-5 5zM9 130l4-5 5 5-5 5z" fill="#6aafff"/></svg>';
          util.el('h2', 'aqua-promo-title', box, 'Stay in the loop');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'aqua-promo-email', box);
          email.type = 'text';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
        }
        if (kind === 'chat') {
          const message = util.el('input', 'aqua-chat-message', box);
          message.type = 'text';
          message.placeholder = 'Type a message…';
          message.setAttribute('aria-label', 'Type a message');
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
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const courseHead = util.el('div', 'lms-course-head', header);
        util.el('div', 'lms-course-title', courseHead, 'Introduction to Biology');
        const courseTabs = util.el('nav', 'lms-course-tabs', courseHead);
        const navIcons = [
          '<path d="M5 18 20 4l15 14-3 3-3-3v17H12V18l-4 4z"/><path class="icon-paper" d="M17 23h7v12h-7z"/><path d="M27 5h5v10l-5-5z"/>',
          '<path d="M23 20c8 0 12 4 12 10v5H15V24z"/><ellipse cx="26" cy="13" rx="6" ry="8"/><path d="M5 35v-6c0-7 4-10 11-10s12 4 12 10v6z"/><ellipse cx="16" cy="12" rx="6" ry="8"/>',
          '<rect class="icon-paper" x="6" y="4" width="28" height="32" rx="1"/><path d="M10 9h6v5h-6zm9 0h11v5H19zm-9 9h6v5h-6zm9 0h11v5H19zm-9 9h6v5h-6zm9 0h11v5H19z"/>',
          '<path class="icon-paper" d="M8 4h22l3 3v29H8z"/><path d="M14 12h14M14 17h14M14 22h14M14 27h10" fill="none"/><path d="m26 8 9-7 2 3-10 7"/>',
          '<circle class="icon-paper" cx="20" cy="20" r="17"/><path d="M14 13c0-8 15-8 13 1-1 4-7 4-7 10M20 28v3" fill="none" stroke-width="3"/>',
          '<path d="M3 10V5h13l4 5h15v25H3z"/><path d="M2 13h35l-3 23H3z"/>',
          '<path d="M5 5h8v30H5zm12-2h8v32h-8zm10 3 7-1 5 29-8 1z"/><path class="icon-paper" d="M7 9h4v4H7zm12-2h4v4h-4zm11 3 3-1 1 4-3 1z"/>',
        ];
        for (const [i, tab] of [
          'Home',
          'Roster',
          'Grades',
          'Assignments',
          'Quizzes',
          'Modules',
          'Resources',
        ].entries()) {
          const a = util.el('span', `lms-course-tab${i === 2 ? ' active' : ''}`, courseTabs);
          const icon = util.el('span', 'lms-tab-icon', a);
          icon.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="aqua-icon-${i}" x2="0" y2="1"><stop stop-color="#b9deff"/><stop offset=".48" stop-color="#70b2fa"/><stop offset="1" stop-color="#2984d8"/></linearGradient></defs><g fill="url(#aqua-icon-${i})" stroke="#3879ba" stroke-width="1.5" stroke-linejoin="round">${navIcons[i]}</g></svg>`;
          util.el('span', 'lms-tab-label', a, tab);
        }
        util.el('div', 'lms-search', courseHead, '⌕  Search students');
        S.frameBrand(_c, header);
        Object.assign(_c, { courseHead, courseTabs, header, navIcons });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        if (ctx.instruction.length > 240) header.classList.add('ref-long-instruction');
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
          const footerText = word
            ? lr.pick([
                `© 2024 Example Co. ${word('footRights')}`,
                word('footSaved'),
                word('footHelp'),
                `v4.2.1 · ${word('footStatus')}`,
              ])
            : footText;
          util.el('span', 'ref-foot-text', foot, '');
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-course-admin-grades-04',
    template: 'site/base',
    design: { parts },
  });
})();
