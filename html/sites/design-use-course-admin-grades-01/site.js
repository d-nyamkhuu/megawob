// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'chat') util.el('strong', 'course-chat-title', box, 'Need help?');
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      if (kind === 'chat') util.el('div', 'course-chat-input', box, 'Type a message...');
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const courseHead = util.el('div', 'lms-course-head', header);
      util.el('div', 'lms-course-title', courseHead, 'Intro to Environmental Science');
      const courseTabs = util.el('nav', 'lms-course-tabs', courseHead);
      for (const [i, tab] of ['Course Home', 'Content', 'Assignments', 'Grades', 'People', 'Settings'].entries()) {
        const a = util.el('span', `lms-course-tab${i === 3 ? ' active' : ''}`, courseTabs, tab);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { courseHead, courseTabs, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { courseHead, ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', courseHead, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'course-rail', body);
      const symbol = (parent, path, cls = '') => {
        const svg = util.svg('svg', { viewBox: '0 0 24 24', class: cls, 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: path }, svg);
      };
      symbol(util.el('div', 'course-brand-mark', rail), 'M12 22V12C6 13 2 8 2 3c6 0 10 2 10 9C12 5 16 3 22 3c0 6-4 10-10 9M12 15 6 7M12 15l6-8');
      const paths = [
        'M2 11 12 2l10 9-2 2-2-2v11h-5v-7h-3v7H5V11l-2 2z',
        'M2 4c4-1 7 0 10 2 3-2 6-3 10-2v16c-4-1-7 0-10 2-3-2-6-3-10-2zM12 6v16',
        'M4 4h16v18H4zM7 1v6M17 1v6M4 9h16M8 13h3v3H8z',
        'M2 5h20v15H2zM3 6l9 8 9-8',
        'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 11a3 3 0 1 0 0-6M1 21v-3c0-6 14-6 14 0v3zM16 14c5 0 7 2 7 7h-6',
        'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8',
        'M10 2h4l1 3 3 1 3-1 2 4-3 2v3l3 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 3-2v-3L1 9l2-4 3 1 3-1zM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
      ];
      for (const [i, item] of ['Home', 'Courses', 'Calendar', 'Inbox', 'People', 'Files', 'Settings'].entries()) {
        const a = util.el('div', `lms-rail-item${i === 1 ? ' active' : ''}`, rail);
        symbol(util.el('span', 'lms-rail-icon', a), paths[i]);
        util.el('span', '', a, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, paths, rail, symbol });
    },
  };

  env.site({
    name: 'design-use-course-admin-grades-01',
    template: 'site/base',
    design: { parts },
  });
})();
