(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-duration-05',
    'brand': 'Library Study Room Reservation',
    'title': 'Reservation Details',
    'instruction': 'top',
    'rail': 'Your Reservation|Need Help?',
    'menu': 'Riverside Community Library',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    template: 'site/base',
    design: { parts: {
    'frame.header': () => function (_c) {
      const { ctx } = _c;
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const tb = u.el('div', 'ds-titlebar', body);
      u.el('span', 'ds-appicon', tb);
      u.el('span', 'ds-apptitle', tb, 'Workplace Organizer');
      const tbc = u.el('span', 'ds-wc', tb);
      ['_', '□', '×'].forEach((t) => u.el('i', '', tbc, t));
      const menu = u.el('nav', 'ds-menu', body);
      ['File', 'Edit', 'View', 'Create', 'Actions', 'Tools', 'Help'].forEach((t) => {
        const s = u.el('span', '', menu);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const top = u.el('header', 'ds-top', body);
      [['New', '▤'], ['Open', '▱'], ['Delete', '☒'], ['|'], ['Cut', '✂'], ['Copy', '▥'], ['Paste', '▦'], ['|'], ['Find', '⌕'], ['Print', '⎙']].forEach((t) => {
        if (t[0] === '|') return u.el('i', 'ds-sep', top);
        const b = u.el('span', 'ds-tool', top);
        u.el('b', '', b, t[1]);
        u.el('span', '', b, t[0]);
      });
      u.el('span', 'ds-grow', top);
      const work = u.el('div', 'ds-work', body);
      const nav = u.el('aside', 'ds-nav', work);
      [['Calendar', '▦'], ['Contacts', '☺'], ['Tasks', '☑'], ['Notes', '▤'], ['Folders', '▭']].forEach((t, i) => {
        const n = u.el('div', 'ds-navitem' + (i ? '' : ' on'), nav);
        u.el('b', '', n, t[1]);
        u.el('span', '', n, t[0]);
      });
      const list = u.el('section', 'ds-list', work);
      u.el('h3', '', list, 'Calendar - Week of Apr 24, 1994');
      const lt = u.el('div', 'ds-ltable', list);
      [['Date / Time', 'Subject', 1], ['Mon 4/25   9:00 AM', 'Staff Meeting'], ['Mon 4/25  11:00 AM', 'Project Review', 2], ['Mon 4/25   2:00 PM', 'Client Call'], ['Tue 4/26  10:00 AM', 'Design Discussion'], ['Wed 4/27   9:30 AM', 'Budget Update'], ['Thu 4/28   1:00 PM', 'Planning Session'], ['Fri 4/29   3:00 PM', 'Team Check-in']].forEach((r) => {
        const row = u.el('div', 'ds-lrow' + (r[2] === 1 ? ' hd' : r[2] === 2 ? ' sel' : ''), lt);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const content = u.el('div', 'ds-content', work);
      const wt = u.el('div', 'ds-subtitle', content);
      u.el('span', '', wt, 'Appointment');
      const wc = u.el('span', 'ds-wc', wt);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const tabs = u.el('div', 'ds-tabs', content);
      ['General', 'Recurrence', 'Attachments'].forEach((t, i) => u.el('span', i ? '' : 'on', tabs, t));
      const intro = u.el('div', 'ds-intro', content);
      const main = u.el('div', 'ds-main', content);
      const stat = u.el('div', 'ds-static', main);
      [['Subject:', 'Project Review'], ['Location:', 'Conference Room B']].forEach((r) => {
        const f = u.el('div', 'ds-field', stat);
        u.el('span', '', f, r[0]);
        u.el('div', '', f, r[1]);
      });
      u.el('hr', '', stat);
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const rail = u.el('aside', 'ds-rail', work);
      u.el('h2', '', rail, 'Properties');
      const pt = u.el('div', 'ds-ptable', rail);
      [['Property', 'Value', 1], ['Subject', 'Project Review'], ['Location', 'Conference Room B'], ['Date', 'Mon 4/25/1994'], ['Start time', '11:00'], ['Duration', '2 hours 0 minutes'], ['End time', '13:00'], ['Category', 'Business'], ['Show time as', 'Busy'], ['Reminder', '15 minutes'], ['Status', 'Confirmed']].forEach((r) => {
        const row = u.el('div', 'ds-lrow' + (r[2] ? ' hd' : ''), pt);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const status = u.el('div', 'ds-status', body);
      Object.assign(_c, { header: top, main, content, foot, rail, status });
    },
    'frame.nav': () => function () {},
    'frame.instruction': (base) => function (_c) {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
      const note = _c.content.querySelector('.ref-instruction, .ref-spacer');
      _c.content.insertBefore(note, _c.main);
    },
    'frame.body': () => function (_c) { _c.body = _c.main; },
    'frame.panel': (base) => function (_c) {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      _c.stage.classList.add('ds-stage');
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) _c.foot.prepend(foot);
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.status.append(dock);
    },
    fault: () => undefined,
    hazard: () => undefined,
    notice: () => undefined,
    overlay: () => function overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
    } },
  });
})();
