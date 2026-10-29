// Library catalog frame, with shared site/base behavior adapted to its sheet and tool column.
(function () {
  'use strict';
  const C = {
    'title': 'Riverton Public Library',
    'tagline': 'Knowledge Serves a Larger World',
    'bar': 'Map Collection',
    'item': 'Item 317 of 482',
    'nav': [
      'Home',
      'Catalog',
      'New Arrivals',
      'Author Index',
      'Title Index',
      'Subject Index',
      'Periodicals',
      'Research Tools',
      'Using the Library',
      'Library Policies',
    ],
    'top': ['Catalog', 'Research Help', 'Library Information', 'Contact Us'],
    'meta': [
      ['Title:', 'The World: A General Map'],
      ['Author:', 'Cartographic Institute'],
      ['Date:', '1992'],
      ['Subject:', 'Maps — General'],
    ],
    'steps': [
      'Hold the mouse button and move the pencil to draw on the canvas.',
      'Release the mouse button to finish your stroke.',
      'Use Clear to erase the drawing.',
    ],
  };

  const palette = { bg: '#fcf9f2', panel: '#fcf9f2', fg: '#111111', muted: '#8f7776', line: '#b89a98' };

  function inertLink(a) {
    a.href = '#';
    a.onclick = (ev) => { ev.preventDefault(); env.log('decoy', { label: a.textContent }); };
  }

  function instructionText(el, u) {
    const text = el.textContent;
    el.className = 'instruction';
    el.textContent = '';
    for (const part of text.split(/(from dot)/)) {
      u.el('span', part === 'from dot' ? 'instruction-small' : '', el, part);
    }
  }

  // Keep the template's control semantics, and apply this sheet's existing button styles.
  function styleControls(parent) {
    for (const b of parent.querySelectorAll('[data-role="submit"]')) {
      b.classList.add('submit');
      if (b.classList.contains('ref-endlink')) b.classList.add('submit-link');
      if (b.closest('.bar')) b.classList.add('submit-bar');
    }
    for (const b of parent.querySelectorAll('[data-role="xtra"]')) b.classList.add('end-xtra');
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The library's compact panel and in-flow toast also fit smaller viewports.
      _c.display = _c.ctx.display;
      if (_c.display === 'panel' && _c.W < 1100) _c.display = 'header';
      document.body.className = 'design library' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const body = document.body;
      const noop = inertLink;
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      const ic = u.svg('svg', { viewBox: '0 0 100 80' }, brand);
      u.svg(
        'path',
        {
          d: 'M5 15L12 15V9L18 9V5Q39 0 50 8Q61 0 82 5V9H88V15H95V74H58Q50 79 42 74H5ZM12 15V69Q34 64 50 72Q66 64 88 69V15M18 9V63Q38 59 50 68Q62 59 82 63V9M50 8V72',
          fill: '#fcf9f2',
          stroke: '#6b1426',
          'stroke-width': 3,
        },
        ic,
      );
      for (const y of [13, 18, 23, 28, 33, 38, 43, 48, 53, 58]) {
        u.svg(
          'path',
          {
            d: 'M22 ' + y + 'Q36 ' + (y - 4) + ' 44 ' + y + 'M56 ' + y + 'Q64 ' + (y - 4) + ' 78 ' + y,
            fill: 'none',
            stroke: '#6b1426',
            'stroke-width': 1.8,
          },
          ic,
        );
      }
      const bt = u.el('div', '', brand);
      u.el('div', 'brand-title', bt, C.title);
      u.el('div', 'brand-tag', bt, C.tagline);
      const tl = u.el('div', 'toplinks', head);
      C.top.forEach((t, i) => {
        if (i) u.el('span', '', tl, '|');
        noop(u.el('a', '', tl, t));
      });
      const se = u.el('div', 'search', head);
      u.el('span', '', se, 'Search Catalog:');
      u.el('div', 'inp', se);
      u.el('button', 'btn', se, 'Search').type = 'button';
      Object.assign(_c, { shell, head });
    },
    'frame.nav': () => (_c) => {
      const { util: u, shell } = _c;
      const noop = inertLink;
      const content = u.el('div', 'content ref-body', shell);
      const side = u.el('nav', 'side', content),
        ol = u.el('ol', '', side);
      C.nav.forEach((t, i) => {
        const li = u.el('li', '', ol);
        u.el('b', '', li, i + 1 + '.');
        noop(u.el('a', '', li, t));
      });
      const sheet = u.el('section', 'sheet', content);
      const bar = u.el('div', 'bar', sheet);
      u.el('h1', '', bar, C.bar);
      const it = u.el('div', 'item', bar);
      u.el('span', '', it, C.item);
      u.el('i', 'tri l', it);
      u.el('i', 'tri r', it);
      const meta = u.el('div', 'meta', sheet);
      for (const [k, v] of C.meta) {
        const r = u.el('div', '', meta);
        u.el('span', '', r, k);
        u.el('span', 'v', r, v).style.width = 'auto';
      }
      Object.assign(_c, { contentNode: content, sheet, bar, header: bar });
    },
    'frame.instruction': (base) => (_c) => {
      const local = { ..._c, header: _c.sheet };
      base(local);
      const text = _c.sheet.querySelector('.ref-instruction');
      if (text) {
        const note = _c.util.el('section', 'task-note', _c.sheet);
        note.append(text);
        instructionText(text, _c.util);
        _c.note = note;
      }
      _c.sheet.querySelector('.ref-spacer')?.remove();
    },
    'frame.body': () => (_c) => {
      const { util: u, sheet, headerTools } = _c;
      const work = u.el('div', 'work', sheet);
      const aside = u.el('aside', 'aside', work);
      u.el('h3', '', aside, 'Instructions');
      const st = u.el('ol', '', aside);
      for (const t of C.steps) u.el('li', '', st, t);
      u.el('hr', '', aside);
      u.el('h3', '', aside, 'Tools');
      const pen = u.el('button', 'tbtn sel', aside);
      pen.type = 'button';
      const pi = u.svg(
        'svg',
        { viewBox: '0 0 24 24', fill: 'none', stroke: '#222', 'stroke-width': 1.4, 'stroke-linejoin': 'round' },
        pen,
      );
      u.svg('path', { d: 'M3 22L5 15L18 2Q19 1 21 3Q23 5 22 6L9 19ZM16 4L20 8M5 15L9 19M7 16L19 4M3 22L6 21' }, pi);
      u.el('span', '', pen, 'Freehand Pencil');
      const clr = u.el('button', 'tbtn', aside);
      clr.type = 'button';
      const ci = u.svg(
        'svg',
        { viewBox: '0 0 24 24', fill: 'none', stroke: '#222', 'stroke-width': 1.4, 'stroke-linejoin': 'round' },
        clr,
      );
      u.svg('path', { d: 'M3 15L14 3H20L22 7L11 20H3ZM3 15H11V20M11 15L22 3M20 3L11 15' }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const actionRule = u.el('hr', '', aside);
      aside.append(headerTools);
      Object.assign(_c, { work, body: work, aside, st, actionRule });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.work.querySelector('.ref-panel');
      if (note) {
        note.className = 'task-note instruction-panel';
        note.querySelector('.ref-panel-title').remove();
        instructionText(note.querySelector('.ref-panel-text'), _c.util);
        _c.aside.insertBefore(note, _c.st);
        _c.note = note;
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.work);
      stage.dataset.role = 'stage';
      _c.work.prepend(stage);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.className = 'task-note instruction-toast';
        instructionText(note.querySelector('.ref-note-text'), _c.util);
        note.querySelector('.ref-note-x').className = 'note-close';
        _c.sheet.insertBefore(note, _c.work);
        _c.note = note;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        _c.aside.append(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.bar.append(dock);
    },
    'frame.end': (base) => (_c) => {
      const { aside, sheet, work, note, display, actionRule } = _c;
      styleControls(sheet);
      if (display === 'panel' && note && note.parentNode === aside && aside.scrollHeight > aside.clientHeight) {
        sheet.insertBefore(note, work);
        note.classList.remove('instruction-panel');
        note.classList.add('instruction-fallback');
      }
      actionRule.hidden = !aside.querySelector('[data-role="submit"], [data-role="xtra"]');
      if (aside.scrollHeight > aside.clientHeight) aside.classList.add('aside-tight');
      return base(_c);
    },
    overlay: () => function (ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Reference Desk',
        promo: 'New in the catalog',
        banner: 'Library notice',
      }[kind];
      const text = {
        cookie: 'This catalog stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand finding an item?',
        promo: 'Browse the latest additions to the collection.',
        banner: 'The library closes early today.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.type = 'button';
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };

  env.site({
    name: 'design-draw-shape-line-02',
    template: 'site/base',
    styles: ['../base/site.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { library: palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b1426'],
      LOW_ACCENTS: ['#6b1426'],
      parts,
    },
  });
})();
