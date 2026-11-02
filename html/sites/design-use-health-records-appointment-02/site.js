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
        const stageBox = document.querySelector('.ref-stage').getBoundingClientRect();
        const headerBox = document.querySelector('.ref-task').getBoundingClientRect();
        const belowHeader = Math.max(headerBox.bottom + 8, stageBox.top + 68);
        if (kind === 'banner') {
          Object.assign(el.style, {
            top: `${belowHeader}px`,
            left: `${stageBox.left}px`,
            right: `${window.innerWidth - stageBox.right}px`,
          });
        } else if (kind === 'promo') {
          Object.assign(el.style, {
            top: `${belowHeader}px`,
            left: `${stageBox.left}px`,
            right: `${window.innerWidth - stageBox.right}px`,
            bottom: '64px',
          });
        } else if (kind === 'cookie') {
          Object.assign(el.style, {
            left: `${stageBox.left}px`,
            right: `${window.innerWidth - stageBox.right}px`,
            bottom: '64px',
          });
        } else if (kind === 'chat') el.style.bottom = '64px';
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
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        const rail = util.el('aside', 'ehr-rail', document.body);
        const mark = util.el('div', 'ehr-rail-mark', rail);
        mark.innerHTML =
          '<svg viewBox="0 0 48 56" aria-hidden="true"><path d="M24 52V17M17 53l7-11 8 11M24 37L9 25M24 32l15-12M24 25L13 14M24 23l10-12M24 18l-3-9M9 25l-5-1m5 1 1-7m29 2 5-2m-5 2-1-7M13 14l-6-1m6 1-2-7m23 4 5-3m-5 3-1-7M21 9l-4-5m4 5 3-7"/><path d="M6 48c5-3 11-3 18-2 8-2 15-1 20 2M6 51c8-3 26-3 37 0M6 25l-3-5 4-3-2-5 6-2 1-6 7 1 4-4 5 4 7-2 2 6 6 1-1 6 4 4-4 4M13 31l-7 3 1-6m30-1 6 4-1-6M24 17l6-1m-6 10-8 1m8 10 7-4"/></svg>';
        util.el('div', 'ehr-rail-brand', rail, 'Riverside\nMedical Center');
        const navIcons = {
          Appointments:
            '<path d="M7 2h3v5H7zm15 0h3v5h-3zM5 5h22a2 2 0 0 1 2 2v22H3V7a2 2 0 0 1 2-2zm0 7v15h22V12zM8 15h4v4H8zm6 0h4v4h-4zm6 0h4v4h-4zM8 21h4v4H8zm6 0h4v4h-4zm6 0h4v4h-4z"/>',
          Patients:
            '<circle cx="12" cy="9" r="5"/><circle cx="23" cy="9" r="4"/><path d="M1 28v-5c0-6 5-9 11-9s11 3 11 9v5zm23 0v-5c0-4-1-6-4-8 7-1 11 3 11 8v5z"/>',
          Orders: '<path d="M7 2h13l7 7v21H5V4a2 2 0 0 1 2-2zm12 2v7h7zM9 14v2h14v-2zm0 5v2h14v-2zm0 5v2h10v-2z"/>',
          Medications:
            '<path d="M7 28a8 8 0 0 1-3-13L16 3a8 8 0 0 1 12 12L16 27a8 8 0 0 1-9 1zm9-23-6 6 11 11 6-7A6 6 0 0 0 16 5z"/>',
          Nursing: '<path d="M7 5h5V2h8v3h5v25H5V5zm7-1v4h4V4zm-5 9v2h12v-2zm0 5v2h12v-2zm0 5v2h10v-2z"/>',
          Beds: '<path d="M2 7h3v14h25v9h-3v-5H5v5H2zm6 5a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm9 2h10a3 3 0 0 1 3 3v3H7v-3h10z"/>',
          Reports: '<path d="M3 21h6v9H3zm10-9h6v18h-6zM23 3h6v27h-6z"/>',
        };
        for (const [icon, label] of [
          ['▦', 'Appointments'],
          ['♟', 'Patients'],
          ['▤', 'Orders'],
          ['◈', 'Medications'],
          ['▤', 'Nursing'],
          ['▰', 'Beds'],
          ['▥', 'Reports'],
        ]) {
          const item = util.el('div', `ehr-rail-item${label === 'Appointments' ? ' active' : ''}`, rail);
          const symbol = util.el('span', 'ehr-rail-icon', item);
          symbol.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + navIcons[label] + '</svg>';
          util.el('span', '', item, label);
        }
        const help = util.el('aside', 'ehr-help', document.body);
        util.el('h2', '', help, 'Scheduling Help');
        util.el('h3', '', help, '1. Choose a Date');
        util.el(
          'p',
          '',
          help,
          'Use the calendar to select a day. Available times for the selected date will appear in the schedule below.',
        );
        util.el('h3', '', help, '2. Select Visit Details');
        util.el('p', '', help, 'Choose a provider, visit type and duration using the buttons above the schedule.');
        util.el('h3', '', help, '3. Pick an Available Time');
        util.el('p', '', help, "Click an available time slot in the provider's schedule to book the appointment.");
        util.el('hr', '', help);
        util.el('h2', '', help, 'Schedule Legend');
        for (const [cls, label] of [
          ['free', 'Available time slot'],
          ['booked', 'Scheduled appointment'],
          ['lunch', 'Lunch / break'],
          ['busy', 'Unavailable'],
        ]) {
          const row = util.el('div', 'ehr-help-legend', help);
          util.el('i', `ehr-swatch ${cls}`, row);
          util.el('span', '', row, label);
        }
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
        Object.assign(_c, { accent, content, help, mark, name, navIcons, rail, rng, root, tr, util });
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
        const appTitle = util.el('div', 'ehr-titlebar', document.body);
        util.el('span', 'ehr-title-icon', appTitle, '▣');
        util.el('span', 'ehr-title-text', appTitle, 'City General Hospital - Electronic Health Records');
        const winBtns = util.el('span', 'ehr-window-buttons', appTitle);
        for (const glyph of ['_', '□', '×']) util.el('span', 'ehr-window-button', winBtns, glyph);
        const menu = util.el('nav', 'ehr-menubar', document.body);
        for (const item of [
          'File',
          'Edit',
          'View',
          'Patient',
          'Schedule',
          'Orders',
          'Nursing',
          'Reports',
          'Window',
          'Help',
        ]) {
          util.el('span', 'ehr-menu-item', menu, item);
        }
        const toolbar = util.el('div', 'ehr-toolbar', document.body);
        for (const icon of ['📂', '▤', '▤', '▦', '👥', '▦', '🖉', '▤', '▱'])
          util.el('span', 'ehr-tool-icon', toolbar, icon);
        Object.assign(_c, { H, W, appTitle, display, menu, roomy, tall, toolbar, winBtns });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.toggle('ehr-long-note', ctx.instruction.length > 180);
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
  };

  env.site({
    name: 'design-use-health-records-appointment-02',
    template: 'site/base',
    design: { parts },
  });
})();
