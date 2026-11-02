// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const GEM_ICONS = {
    mail: '<rect x="3" y="7" width="26" height="19" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M4 8l12 10L28 8M4 25l8-10m16 10l-8-10" fill="none" stroke="currentColor" stroke-width="2"/>',
    calendar: '<rect x="4" y="6" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M4 12h24M10 2v8M23 2v8" stroke="currentColor" stroke-width="3"/><path d="M9 16h4v4H9zm7 0h4v4h-4zm7 0h2v4h-2zM9 23h4v4H9zm7 0h4v4h-4zm7 0h2v4h-2z"/>',
    contacts: '<circle cx="12" cy="9" r="5"/><circle cx="23" cy="11" r="4"/><path d="M2 29v-7c0-10 20-10 20 0v7zm22 0v-8a13 13 0 00-2-7c10 0 11 8 10 15z"/>',
    calls: '<path d="M8 2L2 8c-1 2 2 10 9 17s14 10 16 8l6-6-8-7-4 4c-5-2-10-7-12-12l4-4z" transform="scale(.88) translate(2 1)"/>',
    files: '<path d="M7 2h13l8 8v21H7zM20 2v9h8" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    team: '<circle cx="16" cy="7" r="5"/><circle cx="5" cy="11" r="4"/><circle cx="27" cy="11" r="4"/><path d="M7 30v-9c0-10 18-10 18 0v9zM0 30v-8c0-5 2-7 6-7a13 13 0 00-2 7v8zm28 0v-8a13 13 0 00-2-7c4 0 6 2 6 7v8z"/>',
  };

  const gemIcon = (name) => `<svg viewBox="0 0 34 34" aria-hidden="true" focusable="false">${GEM_ICONS[name] || GEM_ICONS.calendar}</svg>`;

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner' || kind === 'toast') {
        const header = document.querySelector('.ref-task');
        el.style.top = `${(header ? header.getBoundingClientRect().bottom : 94) + 2}px`;
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.placement': (base, S) => function (_c) {
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
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const er = rng.fork('gem/end');
      if (!ctx.finish) {
        placement = er.bool(0.6) ? 'header' : er.pick(wantFooter ? ['footer', 'link', 'icon'] : ['header', 'icon']);
        if (er.bool(0.65)) label = 'Save';
      }
      if (collide) collide.text = label === 'Finalize' ? 'Save' : 'Finalize';
      Object.assign(_c, { collide, cr, decoys, er, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Lumen Office');
      brand.dataset.role = 'brand';
      const windowTools = util.el('div', 'gem-window-controls', header);
      for (const mark of ['_', '□', '×']) util.el('span', '', windowTools, mark);
      util.el('span', 'ref-support', header, 'Support');
      Object.assign(_c, { brand, header, windowTools });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const tabs = util.el('div', 'gem-tabs', body);
      for (const [icon, label] of [['mail', 'Mail'], ['calendar', 'Calendar'], ['contacts', 'Contacts'], ['calls', 'Calls'], ['files', 'Files'], ['team', 'Team']]) {
        const tab = util.el('div', `gem-tab${label === 'Calls' ? ' gem-tab-active' : ''}`, tabs);
        util.el('span', 'gem-tab-icon', tab).innerHTML = gemIcon(icon);
        util.el('span', '', tab, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, tabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h2', '', inspector, 'Upcoming');
      const callList = util.el('div', 'ref-call-list', inspector);
      for (const [first, second, time] of [['Lumen Office', 'Video Call', '10:00 AM'], ['Project Sync', 'Video Call', '11:30 AM'],
        ['Design Review', 'Video Call', 'Tue 9:00 AM'], ['Engineering Standup', 'Video Call', 'Tue 11:00 AM'],
        ['Marketing Update', 'Video Call', 'Wed 10:00 AM'], ['All Hands', 'Video Call', 'Wed 2:00 PM'],
        ['Product Planning', 'Video Call', 'Thu 9:00 AM'], ['Client Check-In', 'Video Call', 'Thu 3:00 PM']]) {
        const row = util.el('div', 'ref-call-row', callList);
        util.el('span', 'ref-call-icon', row).innerHTML = gemIcon('calendar');
        const title = util.el('span', 'ref-call-title', row);
        util.el('span', '', title, first);
        util.el('span', '', title, second);
        util.el('span', 'ref-call-time', row, time);
      }
      const scroll = util.el('div', 'gem-scrollbar', inspector);
      const up = util.el('button', 'gem-scroll-up', scroll, '▲');
      up.type = 'button';
      up.setAttribute('aria-label', 'Scroll upcoming meetings up');
      up.addEventListener('click', () => { callList.scrollTop -= 84; env.log('decoy', { what: 'meeting-scroll', direction: 'up' }); });
      const track = util.el('div', 'gem-scroll-track', scroll);
      util.el('div', 'gem-scroll-thumb', track);
      const down = util.el('button', 'gem-scroll-down', scroll, '▼');
      down.type = 'button';
      down.setAttribute('aria-label', 'Scroll upcoming meetings down');
      down.addEventListener('click', () => { callList.scrollTop += 84; env.log('decoy', { what: 'meeting-scroll', direction: 'down' }); });
      Object.assign(_c, { callList, down, inspector, scroll, stage, track, up });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, headerTools, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        if (placement !== 'footer' && placement !== 'link') {
          while (tools.firstChild) headerTools.appendChild(tools.firstChild);
          foot.remove();
        }
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-protect-privacy-permissions-02',
    template: 'site/base',
    design: { parts },
  });
})();
