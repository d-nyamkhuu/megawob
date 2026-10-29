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
        if (kind === 'banner')
          el.style.top = document.querySelector('.crm-global').getBoundingClientRect().bottom + 'px';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const art = util.el('div', 'crm-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 210 290" aria-hidden="true"><path fill="#fff" opacity=".55" d="M-20 50Q5 15 35 48Q55 20 76 50Q100 80 45 84H-20zM100 210Q120 170 150 197Q165 170 190 190Q235 210 211 240H100z"/><path fill="#81c9ff" d="m23 118 159-46-60 129-24-57z"/><path fill="#2488ef" d="m23 118 159-46-84 72z"/><path fill="#0069d7" d="m98 144 24 57 14-88z"/><path fill="#b8e4ff" d="m98 144 84-72-46 41z"/><path fill="none" stroke="#a8d8fb" stroke-width="2" d="M13 221q55-22 49 18t64 25"/></svg>';
          util.el('b', 'crm-promo-heading', box, 'Stay in the loop');
          const close = util.el('button', 'crm-promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
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
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        // This design is the fixed enterprise Lightning palette; keep draws above stable.
        name = 'light';
        accent = '#1682ed';
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
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
        document.body.dataset.display = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('crm-titlebar');
        header.innerHTML = '<b>Team Calendar</b>';
        const globalBar = util.el('div', 'crm-global', document.body);
        globalBar.innerHTML = '<nav><span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Tools</span><span>Help</span></nav>';
        const toolbar = util.el('div', 'crm-toolbar-row', document.body);
        toolbar.innerHTML = '<div class="crm-quick"><button><svg viewBox="0 0 24 24"><path d="M5 5h14v16H5zM8 3v4m8-4v4M5 9h14"/></svg>New Event</button><button><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3 2-5 6-5s6 2 6 5m0-4c3-.5 6 1.2 6 4"/></svg>New Meeting <span>⌄</span></button></div><div class="crm-summary-actions"></div><div class="crm-search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>Search events, people or rooms</div>';
        header.after(globalBar);
        globalBar.after(toolbar);
        S.frameBrand(_c, header);
        Object.assign(_c, { globalBar, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { header, headerTools, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('section', 'crm-summary', document.body);
        summary.innerHTML = '<div class="crm-editorial"><div class="crm-big-title"><strong>March 2027</strong><b>Week 9</b></div><aside><div class="crm-month-caption"><span>‹</span><b>March 2027</b><span>›</span></div><div class="crm-month-grid"></div></aside></div>';
        document.querySelector('.crm-toolbar-row').appendChild(headerTools);
        const left = util.el('aside', 'crm-left', document.body);
        left.innerHTML = '<section class="crm-left-month"><div class="crm-month-caption"><b>March 2027</b><span>‹　›</span></div><div class="crm-month-grid"></div></section><section><h3>Calendars</h3><label><input type="checkbox" checked><i class="blue"></i>My Calendar</label><label><input type="checkbox" checked><i class="red"></i>Team</label><label><input type="checkbox" checked><i class="green"></i>Product</label><label><input type="checkbox"><i class="purple"></i>Design</label><label><input type="checkbox"><i class="orange"></i>Engineering</label></section><section><h3>People</h3><label><input type="checkbox" checked><i class="blue"></i>Aisha Khan</label><label><input type="checkbox" checked><i class="red"></i>Daniel Park</label><label><input type="checkbox" checked><i class="green"></i>Maria Santos</label><label><input type="checkbox" checked><i class="purple"></i>Liam Chen</label><label><input type="checkbox" checked><i class="orange"></i>Priya Sharma</label></section><section><h3>Time zones</h3><label><input type="checkbox" checked>Local time (UTC+05:30)</label><label><input type="checkbox" checked>UTC</label></section>';
        const mini = summary.querySelector('.crm-month-grid');
        mini.classList.add('crm-month-summary');
        body.before(left);
        body.before(summary);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, left, mini, summary, titleCopy: header });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        document.documentElement.style.setProperty('--crm-chrome-bottom', document.querySelector('.crm-toolbar-row').getBoundingClientRect().bottom + 'px');
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'crm-inspector', body);
        inspector.innerHTML = '<h2>Event Details</h2><div class="crm-field"><label>Title</label><div class="crm-title-value"></div></div><div class="crm-field"><label>Date</label><div class="crm-date-control"><span class="crm-date-value"></span><span class="crm-date-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v16H4zM8 2v6m8-6v6M4 10h16M7 13h2m3 0h2m3 0h1M7 16h2m3 0h2"/></svg></span></div></div><div class="crm-field"><label>Start time</label><div class="crm-start-value"></div></div><div class="crm-field"><label>Duration</label><div class="crm-choice"><span class="crm-duration-value"></span></div></div><div class="crm-field"><label>Time zone</label><div class="crm-choice"><span class="crm-zone-value"></span></div></div><div class="crm-field"><label>Location</label><div class="crm-location-value"></div></div><div class="crm-field"><label>Attendees</label><div class="crm-searchbox"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><span>Add people, rooms or resources</span></div></div><div class="crm-field crm-description"><label>Description</label><div></div></div><div class="crm-field"><label>Calendar</label><div class="crm-choice"><i class="red"></i> Team</div></div><div class="crm-field"><label>Show as</label><div class="crm-choice">Busy</div></div><div class="crm-field"><label>Reminder</label><div class="crm-choice">15 minutes</div></div><a>More options</a>';
        const eventList = util.el('section', 'crm-event-list', document.body);
        eventList.innerHTML = '<div class="crm-list-head"><span>Title</span><span>Date</span><span>Time (UTC)</span><span>Time (UTC+05:30)</span><span>Duration</span><span>Attendees</span><span>Location</span></div>';
        body.after(eventList);
        const listBody = util.el('div', 'crm-list-body', eventList);
        for (const row of [...eventList.querySelectorAll('.crm-list-row')]) listBody.appendChild(row);
        Object.assign(_c, { eventList, listBody, stage });
      },
  };

  env.site({
    name: 'design-use-calendar-timezone-05',
    template: 'site/base',
    design: { parts },
  });
})();
