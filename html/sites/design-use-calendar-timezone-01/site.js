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
          el.style.top = document.querySelector('.crm-summary').getBoundingClientRect().bottom + 'px';
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
        const globalBar = util.el('div', 'crm-global', document.body);
        globalBar.innerHTML =
          '<span class="crm-launcher" aria-hidden="true">' +
          '<i></i>'.repeat(9) +
          '</span><b>Acme CRM</b><nav><span>Home</span><span>Accounts</span><span>Contacts</span><span>Leads</span><span>Opportunities</span><span>Projects</span><strong>Calendar</strong><span>Reports</span><span>Dashboards</span></nav><span class="crm-search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>Search...</span><span class="crm-bell"><svg viewBox="0 0 24 24"><path d="M4 17h16l-3-4V9a5 5 0 0 0-10 0v4zM10 21h4M12 2v2"/></svg></span><span class="crm-user">JS</span>';
        header.before(globalBar);
        S.frameBrand(_c, header);
        Object.assign(_c, { globalBar, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { header, headerTools, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('section', 'crm-summary', document.body);
        summary.innerHTML =
          '<div class="crm-team-title"><span class="crm-calendar-icon">▢</span><div><b>Team Calendar</b><small>Product Team</small></div><div class="crm-summary-actions"><button>Today</button><button>‹</button><button>›</button><b>Nov 7 – 13, 2027　⌄</b><button>Day</button><button class="selected">Week</button><button>Month</button><button class="crm-new">New Event　⌄</button></div></div><div class="crm-team-row"><div><i>JS</i><b>Jordan Silva</b><small>Product Manager</small></div><div><i>MK</i><b>Morgan Kim</b><small>UX Designer</small></div><div><i>RT</i><b>Riley Tan</b><small>Backend Engineer</small></div><div><i>AP</i><b>Avery Patel</b><small>QA Engineer</small></div><div><i>SL</i><b>Sam Lee</b><small>DevOps Engineer</small></div><aside><b>November 2027</b><small>Su　 Mo　 Tu　 We　 Th　 Fr　 Sa<br>　1　 2　 3　 4　 5　 6　 7<br>8　9　10　11　12　13　14<br>15　16　17　18　19　20　21</small></aside><aside><b>Team Availability</b><small>● Jordan Silva　　　　 83%<br>● Morgan Kim　　　　 67%<br>● Riley Tan　　　　　 75%<br>● Avery Patel　　　　 67%<br>● Sam Lee　　　　　 58%</small></aside></div>';
        const titleCopy = summary.querySelector('.crm-team-title > div');
        titleCopy.className = 'crm-title-copy';
        titleCopy.appendChild(header);
        summary.querySelector('.crm-team-title').appendChild(headerTools);
        summary.querySelector('.crm-calendar-icon').innerHTML =
          '<svg viewBox="0 0 28 28"><path d="M5 6h18v18H5zM5 11h18M9 3v6M19 3v6"/></svg>';
        const mini = summary.querySelector('.crm-team-row > aside');
        mini.className = 'crm-month-summary';
        mini.innerHTML =
          '<div class="crm-month-caption"><span>‹</span><b>November 2027</b><span>›</span></div><div class="crm-month-grid">' +
          ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => '<span class="crm-weekday">' + d + '</span>').join('') +
          '<span></span>' +
          Array.from(
            { length: 30 },
            (_, i) => '<span' + (i === 8 ? ' class="crm-today"' : '') + '>' + (i + 1) + '</span>',
          ).join('') +
          '</div>';
        const availability = mini.nextElementSibling;
        availability.className = 'crm-availability';
        availability.innerHTML =
          '<b>Team Availability</b>' +
          ['Jordan Silva', 'Morgan Kim', 'Riley Tan', 'Avery Patel', 'Sam Lee']
            .map(
              (person, i) =>
                '<div><i></i><span>' + person + '</span><span>' + [83, 67, 75, 67, 58][i] + '%</span></div>',
            )
            .join('');
        body.before(summary);
        S.frameSidebar(_c, body);
        Object.assign(_c, { availability, body, mini, summary, titleCopy });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const eventList = util.el('section', 'crm-event-list', document.body);
        eventList.innerHTML =
          '<b class="crm-list-title">Upcoming Events</b><div class="crm-list-head"><span>Title</span><span>Date</span><span>Time (EST)</span><span>Time (UTC−03:30)</span><span>Duration</span><span>Attendees</span><span>Location</span></div><div class="crm-list-row"><b>●　Standup</b><span>Mon, Nov 8, 2027</span><span>8:00 AM</span><span>4:30 AM</span><span>30 min</span><span>Jordan Silva, Sam Lee</span><span>Teams</span></div><div class="crm-list-row"><b>●　UX Sync</b><span>Mon, Nov 8, 2027</span><span>10:00 AM</span><span>6:30 AM</span><span>1 hr</span><span>Morgan Kim, Avery Patel</span><span>Conference Room A</span></div><div class="crm-list-row"><b>●　Product Review</b><span>Tue, Nov 9, 2027</span><span>9:00 AM</span><span>5:30 AM</span><span>1 hr</span><span>Jordan Silva, Riley Tan</span><span>Teams</span></div><div class="crm-list-row"><b>●　Marketing Sync</b><span>Tue, Nov 9, 2027</span><span>11:00 AM</span><span>7:30 AM</span><span>1 hr</span><span>Jordan Silva, Morgan Kim</span><span>Teams</span></div>';
        body.after(eventList);
        const listBody = util.el('div', 'crm-list-body', eventList);
        for (const row of [...eventList.querySelectorAll('.crm-list-row')]) listBody.appendChild(row);
        Object.assign(_c, { eventList, listBody, stage });
      },
  };

  env.site({
    name: 'design-use-calendar-timezone-01',
    template: 'site/base',
    design: { parts },
  });
})();
