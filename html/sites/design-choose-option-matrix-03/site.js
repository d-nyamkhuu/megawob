(function () {
  'use strict';
  const palette = { bg: '#aaa', panel: '#b8b8b8', fg: '#151515', muted: '#333', line: '#686868' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const frame = u.el('div', 'wb-frame', document.body);
      const top = u.el('header', 'wb-titlebar', frame);
      u.el('span', 'wb-appicon', top, '⌘');
      u.el('span', 'wb-appname', top, 'Course Manager');
      u.el('span', 'wb-winbtn', top, '▁');
      u.el('span', 'wb-winbtn wb-close', top, '×');
      const menu = u.el('nav', 'wb-menubar', frame);
      ['Project', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'wb-body', frame);
      const rail = u.el('aside', 'wb-rail', body);
      [['▣', 'Courses'], ['▤', 'Feedback'], ['♟', 'Students'], ['▥', 'Reports'], ['⚙', 'Settings']].forEach((x, i) => {
        const a = u.el('div', 'wb-navitem' + (i === 1 ? ' selected' : ''), rail);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const records = u.el('section', 'wb-records', body);
      u.el('div', 'wb-pane-title', records, 'Feedback Records');
      const list = u.el('div', 'wb-record-list', records);
      const names = ['Anderson, Lisa', 'Brown, Mark', 'Chen, Wei', 'Davis, Pat', 'Evans, Robin', 'Fisher, Alex', 'Garcia, Maria', 'Hall, James', 'Harris, Elise', 'Ito, Ken', 'Jackson, Paula', 'Kim, Daniel', 'Lewis, Nora', 'Martin, Chris', 'Nguyen, Anh', 'Patel, Ravi', 'Roberts, Sam', 'Taylor, Morgan', 'Thomas, Jordan', 'White, Casey'];
      names.forEach((n, i) => {
        const row = u.el('div', 'wb-record' + (i === 4 ? ' selected' : ''), list);
        u.el('b', '', row, '▤');
        u.el('span', '', row, n);
        u.el('time', '', row, `${((12 + i * 2 - 1) % 31) + 1} ${i < 10 ? 'Mar' : 'Apr'} 1990`);
      });
      const workspace = u.el('div', 'wb-workspace', body);
      Object.assign(_c, { frame, top, body, records, workspace, header: workspace });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('div', 'wb-header-note', _c.workspace);
        box.appendChild(note);
        _c.header = box;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.records;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const summary = u.el('section', 'wb-summary', _c.workspace);
      u.el('div', 'wb-pane-title', summary, 'Course Feedback');
      const summ = u.el('div', 'wb-summary-body', summary);
      u.el('div', 'wb-grad', summ, '🎓');
      const meta = u.el('div', 'wb-course-meta', summ);
      u.el('strong', '', meta, 'Introduction to Computer Graphics');
      u.el('span', '', meta, 'Course Code:  CG101');
      u.el('span', '', meta, 'Dates:  12 Mar 1990 – 16 Mar 1990');
      u.el('span', '', meta, 'Instructor:  Thomas Blake');
      const student = u.el('div', 'wb-student-meta', summ);
      u.el('span', '', student, 'Student:   Evans, Robin');
      u.el('span', '', student, 'Date:      20 Mar 1990');
      u.el('span', '', student, 'Location:  Lab 3');
      u.el('span', '', student, 'Format:    In person');
      const task = u.el('section', 'wb-task', _c.workspace);
      u.el('div', 'wb-pane-title', task, 'Your Feedback');
      _c.stage = u.el('main', 'ds-stage', task);
      _c.task = task;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.workspace.insertBefore(note, _c.task);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.frame.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
  };
  env.site({
    name: 'design-choose-option-matrix-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-matrix-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#003c9f'],
      LOW_ACCENTS: ['#003c9f'],
      parts,
    },
  });
})();
