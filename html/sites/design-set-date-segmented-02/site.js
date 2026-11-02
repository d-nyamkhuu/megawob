(function () {
  'use strict';
  const palette = { bg: '#edf6fb', panel: '#fff', fg: '#142f57', muted: '#47617f', line: '#c7dceb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util,
        body = u.el('div', 'ds-body', document.body),
        top = u.el('header', 'ds-top', body),
        brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-paw', brand, '');
      u.el('div', 'ds-brandtext', brand, 'Paw Haven');
      u.el('small', '', brand, 'Animal Shelter');
      const nav = u.el('nav', 'ds-menu', top);
      ['Animals', 'Adoptions', 'Donors', 'Reports', 'Settings'].forEach((x, i) =>
        u.el('div', 'ds-tab' + (!i ? ' active' : ''), nav, x),
      );
      u.el('div', 'ds-search', top, '⌕  Search animals…');
      const workspace = u.el('div', 'ds-workspace', body),
        side = u.el('aside', 'ds-side', workspace);
      u.el('h2', '', side, 'Animals');
      const list = u.el('div', 'ds-animal-list', side);
      [
        ['Luna', 'Cat · Female'], ['Max', 'Dog · Male'],
        ['Bella', 'Cat · Female'], ['Charlie', 'Dog · Male'],
        ['Molly', 'Cat · Female'], ['Cooper', 'Dog · Male'],
        ['Daisy', 'Cat · Female'], ['Rocky', 'Dog · Male'],
        ['Lucy', 'Cat · Female'], ['Buddy', 'Dog · Male'],
      ].forEach((a, i) => {
        const row = u.el('div', 'ds-animal' + (!i ? ' selected' : ''), list);
        u.el('span', 'ds-thumb', row, '');
        const t = u.el('span', '', row);
        u.el('b', '', t, a[0]);
        u.el('small', '', t, a[1]);
      });
      u.el('div', 'ds-count', side, '10 animals');
      const content = u.el('main', 'ds-content', workspace),
        summary = u.el('section', 'ds-summary', content);
      u.el('div', 'ds-catphoto', summary, '');
      const inf = u.el('div', 'ds-summary-main', summary);
      u.el('h1', '', inf, 'Luna');
      u.el('div', 'ds-subline', inf, 'Cat  ·  Female  ·  Domestic Shorthair');
      const facts = u.el('div', 'ds-facts', inf);
      [
        ['Age:', '2 years', 'Status:', 'Available'],
        ['Weight:', '7.6 kg', 'Intake Date:', '2022-06-14'],
        ['Color:', 'Gray and White', 'Location:', 'Main Shelter'],
        ['ID:', 'A1023', 'Microchip:', '985112006543210'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-factrow', facts);
        row.forEach((v, i) => u.el('span', 'ds-factpart' + (i % 2 ? ' value' : ''), r, v));
      });
      const lower = u.el('div', 'ds-lower', content),
        work = u.el('section', 'ds-work', lower),
        tabs = u.el('div', 'ds-detailtabs', work);
      ['Details', 'Medical', 'Adoption', 'Notes', 'Photos'].forEach((x, i) =>
        u.el('div', 'ds-detailtab' + (!i ? ' active' : ''), tabs, x),
      );
      const header = u.el('div', '', content);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') header.className = 'ds-header-note';
      content.insertBefore(header, lower);
      const activity = u.el('aside', 'ds-activity', lower);
      u.el('h2', '', activity, 'Recent Activity');
      [
        ['2022-06-14', 'Intake record created'],
        ['2022-06-16', 'Health check completed'],
        ['2022-06-18', 'Vaccination updated'],
        ['2022-06-20', 'Photo added'],
        ['2022-06-22', 'Moved to main shelter'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-activityrow', activity);
        u.el('span', '', r, a[0]);
        u.el('span', '', r, a[1]);
      });
      Object.assign(_c, { shell: body, top, content, lower, work, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      if (_c.display === 'toast') {
        _c.top.classList.add('ds-toast-mode');
        _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.ds-search'));
      }
    },
    'frame.body': () => (_c) => { _c.body = _c.lower; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.work });
      const panel = _c.work.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ds-stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.work.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        e = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      e.dataset.role = 'overlay';
      const words = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', e, words[ctx.kind]);
      const b = u.el('button', '', e, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el: e, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-segmented-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-segmented-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1880db'],
      LOW_ACCENTS: ['#1880db'],
      parts,
    },
  });
})();
