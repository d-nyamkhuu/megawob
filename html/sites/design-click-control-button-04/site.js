(function () {
  'use strict';
  const ICONS = {
    cursor: '<path d="M7.5 3.7 17.5 12l-5.1 1.1 2.7 6-2.2 1-2.7-6-3.2 3.3z"/>',
    text: '<path d="M5 5h14M12 5v15"/>',
    rect: '<rect x="4.5" y="4.5" width="15" height="15"/>',
    circle: '<circle cx="12" cy="12" r="8"/>',
    line: '<path d="M5 12h14"/>',
    undo: '<path d="M9 4.5 4.5 9 9 13.5M5 9h9a5.3 5.3 0 0 1 0 10.6" stroke-linejoin="round" stroke-linecap="round"/>',
    redo: '<path d="M15 4.5 19.5 9 15 13.5M19 9h-9a5.3 5.3 0 0 0 0 10.6" stroke-linejoin="round" stroke-linecap="round"/>',
    trash: '<path d="M4 6.5h16M9 6.5V3.8h6v2.7M6.3 6.5v14h11.4v-14M10 10v7M14 10v7"/>',
  };
  const TOOLS = [
    ['cursor', 6], ['text', 14.3], ['rect', 22.3], ['circle', 30.3],
    ['line', 38.2], ['undo', 48.7], ['redo', 55.5], ['trash', 64.3],
  ];
  const palette = { bg: '#fafbfd', panel: '#f5f7f9', fg: '#050d17', muted: '#6c7c98', line: '#dce1e9' };

  // Preserve the original typography within the template-owned instruction elements.
  function styleNote(note, text, display, u) {
    note.classList.add('instruction');
    note.dataset.display = display;
    const copy = text.textContent;
    note.classList.toggle('long', copy.length > 34);
    note.classList.toggle('xlong', copy.length > 80);
    text.textContent = '';
    copy.split(/("[^"]*")/).forEach((part, i) => {
      if (!part) return;
      if (i % 2) u.el('span', 'kq', text, part);
      else text.appendChild(document.createTextNode(part));
    });
  }

  function drawDocument(u, shell) {
    const doc = u.el('section', 'kdoc', shell);
    u.el('div', 'kdoc-name', doc, 'Untitled Document');
    const saved = u.el('div', 'kdoc-saved', doc, 'Saved just now');
    u.el('i', '', saved);
    const paper = u.el('article', 'kpaper', doc);
    const heading = u.el('h1', 'kh1', paper);
    heading.appendChild(document.createTextNode('Pro'));
    u.el('span', 'kj', heading, 'j');
    heading.appendChild(document.createTextNode('ect Plan'));
    u.el('div', 'ksub', paper, 'A SIMPLER TOMORROW');
    const sec = (top, num, title) => {
      const s = u.el('div', 'ksec', paper);
      s.style.top = top + 'vh';
      const h = u.el('div', 'ksec-h', s);
      u.el('b', '', h, num);
      u.el('span', '', h, title);
      return s;
    };
    let s = sec(30.7, '01', 'Overview');
    u.el('p', '', s, 'Define the goal, scope, and key stakeholders for this project.');
    u.el('p', '', s, 'Keep the focus on measurable outcomes and clear next steps.');
    s = sec(50.5, '02', 'Key Tasks');
    ['Research and gather requirements', 'Create initial draft', 'Review and incorporate feedback'].forEach((t) => {
      const r = u.el('div', 'kcheck', s);
      u.el('i', '', r);
      u.el('span', '', r, t);
    });
    s = sec(75.7, '03', 'Next Steps');
    u.el('p', '', s, 'Align on priorities, confirm timelines, and move into execution.');
    return { doc, saved };
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated note slot even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'kin');
      const shell = u.el('main', 'kshell', document.body);
      const left = u.el('section', 'kleft', shell);
      const toolbar = u.el('div', 'ktoolbar', left);
      const { doc, saved } = drawDocument(u, shell);
      const strip = u.el('nav', 'kstrip', shell);
      TOOLS.forEach(([n, t], i) => {
        const b = u.el('span', 'ktool' + (i === 0 ? ' on' : ''), strip);
        b.style.top = t + 'vh';
        b.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[n] + '</svg>';
      });
      Object.assign(_c, { shell, left, toolbar, doc, saved, strip, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) styleNote(note, note, _c.display, _c.util);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      // Inert chrome actions share the document's existing saved-status area.
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((b) => _c.saved.appendChild(b));
      if (_c.submit && !_c.submit.classList.contains('ref-icon')) {
        const label = _c.submit.textContent;
        _c.submit.style.setProperty('--end-length', Math.max(1, label.length));
        _c.submit.textContent = '';
        _c.util.el('span', 'kbutton-label', _c.submit, label);
      }
    },
    'frame.body': () => (_c) => { _c.body = _c.left; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) styleNote(panel, panel.querySelector('.ref-panel-text'), _c.display, _c.util);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.left.appendChild(note);
        note.classList.add('instruction-toast');
        styleNote(note, note.querySelector('.ref-note-text'), _c.display, _c.util);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.doc.appendChild(foot);
        foot.querySelectorAll('.ref-xtra').forEach((b) => _c.saved.appendChild(b));
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.strip.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-click-control-button-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'kinetic.css'],
    design: {
      THEMES: { 'design-click-control-button-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b5cff'],
      LOW_ACCENTS: ['#0b5cff'],
      parts,
    },
  });
})();
