(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-03',
    'brand': 'Vacation Rental Finder',
    'instruction': 'top',
    'rail': 'Search|Dates|Guests|Amenities|Location|Review',
    'menu': '',
    'briefTitle': 'Your Task',
  };
  const TABCOL = ['#bff0d6', '#d9d0fa', '#cfe6fb', '#fdeec6', '#fbd3d6', '#e6e6ec'];
  const SP = 'http://www.w3.org/2000/svg';
  function svg(parent, html, cls, vb) {
    const s = document.createElementNS(SP, 'svg');
    s.setAttribute('viewBox', vb || '0 0 24 24');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  const palette = { bg: '#d9d0f6', panel: '#f6faf9', fg: '#0b152c', muted: '#6b6f85', line: '#d3d6e0' };
  function info(parent) {
    svg(parent, '<circle cx="12" cy="12" r="9.5" fill="none" stroke="#5016cb" stroke-width="1.8"/><path d="M12 11v6M12 7.5v1.5" stroke="#5016cb" stroke-width="2"/>', 'ds-info');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { ctx } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('span', 'ds-title', top);
      svg(tl, '<path d="M3 11.5 12 3l9 8.5h-2.5V21h-5v-6h-3v6h-5v-9.5z" fill="#5b2fd0"/>', 'ds-home');
      u.el('span', 'ds-brand', tl, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      svg(wc, '<path d="M5 12h14" stroke="#222" stroke-width="1.8"/>', 'ds-wi');
      svg(
        wc,
        '<rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="none" stroke="#222" stroke-width="1.8"/>',
        'ds-wi',
      );
      svg(wc, '<path d="M5 5l14 14M19 5 5 19" stroke="#222" stroke-width="1.8"/>', 'ds-wi');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        const b = u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), rail, t);
        b.style.background = TABCOL[i];
      });
      const spiral = u.el('div', 'ds-spiral', body);
      for (let i = 0; i < 16; i++) {
        const r = u.el('i', '', spiral);
        r.style.top = i * 5.96 + 3.8 + '%';
      }
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-head', content);
      const ht = u.el('div', '', head);
      u.el('h1', '', ht, 'Find Your Stay');
      u.el('p', '', ht, 'Set your preferences to find the perfect place.');
      svg(
        head,
        '<defs><linearGradient id="mint-hill" x2="0" y2="1"><stop stop-color="#d3eee7"/><stop offset="1" stop-color="#b6ddd1"/></linearGradient><linearGradient id="mint-roof" x2="0" y2="1"><stop stop-color="#bce1d8"/><stop offset="1" stop-color="#6db6a5"/></linearGradient></defs><path d="M63 71 91 24Q103 6 116 23L157 71Z" fill="url(#mint-hill)"/><path d="m99 28 8-9 10 10-9-2-2 7-2-7z" fill="#f0faf6"/><g stroke="#67b3a0" stroke-width="2.5" stroke-linejoin="round"><path d="M39 78V44L66 20l26 25v33z" fill="#f5faf6"/><path d="M79 29V20h9v16" fill="#d1e8e0"/><path d="m33 44 33-30 32 31-4 4-28-27-29 27z" fill="url(#mint-roof)"/><rect x="58" y="54" width="16" height="24" rx="2" fill="#8bd1bb"/><path d="M106 78q2-21 16-12 11-15 21 0 12-13 17 12" fill="#a4dbca"/><path d="M14 78V53M163 78V53"/><path d="M5 58 11 37q5-9 9 0l6 21q1 14-11 10Q3 70 5 58Z" fill="#98d9c3"/><path d="m154 58 5-21q4-9 8 0l6 21q2 13-9 10-12 2-10-10Z" fill="#a3ddca"/><path d="m15 43 1 15 6-5m142-10v15l-6-4" fill="none"/><path d="M4 79h170" fill="none"/></g><g fill="#79bda9"><rect x="61" y="34" width="4" height="4"/><rect x="67" y="34" width="4" height="4"/><rect x="61" y="40" width="4" height="4"/><rect x="67" y="40" width="4" height="4"/></g>',
        'ds-house',
        '0 0 180 90',
      );
      const fields = u.el('section', 'ds-fields', content);
      const headTools = u.el('div', 'ds-head-tools', head);
      headTools.appendChild(head.querySelector('.ds-house'));
      [
        ['Destination', 'Lisbon, Portugal', 'v'],
        ['Check-in', 'Apr 12, 2025', 'c'],
        ['Check-out', 'Apr 19, 2025', 'c'],
        ['Guests', '2 adults', 'v'],
      ].forEach(([l, v, k]) => {
        const f = u.el('div', 'ds-f', fields);
        u.el('label', '', f, l);
        const b = u.el('div', 'ds-in', f);
        u.el('span', '', b, v);
        if (k === 'v') svg(b, '<path d="m6 9 6 6 6-6" fill="none" stroke="#333" stroke-width="2"/>');
        else
          svg(
            b,
            '<rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="#333" stroke-width="1.7"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="#333" stroke-width="1.7"/>',
          );
      });
      const amen = u.el('section', 'ds-amen', content);
      u.el('div', 'ds-amen-heading', amen);
      const main = u.el('div', 'ds-main', amen);
      Object.assign(_c, { header: amen, body: main, contentPane: content, amen, main, headTools });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instruction');
        info(note);
        _c.amen.insertBefore(note, _c.main);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.headTools;
      base(_c);
      _c.header = header;
      _c.headTools.insertBefore(_c.headerTools, _c.headTools.firstChild);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        info(panel);
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.amen);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#7040e8'],
      LOW_ACCENTS: ['#7040e8'],
      parts,
    },
  });
})();
