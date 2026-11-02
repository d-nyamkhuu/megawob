(function () {
  'use strict';
  const palette = { bg: '#f5f8fb', panel: '#eef3fa', fg: '#18223b', muted: '#8494b2', line: '#d4deeb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
      // Preserve the original drawer width and stage height independently of
      // the shared frame's end-control placement.
      const spacing = _c.rng.fork('chrome/end');
      _c.drawerSpace = spacing.bool(0.5);
      _c.statusSpace = !_c.drawerSpace && spacing.pick(['header', 'footer']) === 'footer';
    },
    'frame.header': () => (_c) => {
      const { util: u, ctx, display, placement } = _c;
      document.body.classList.add('kinetic', 'instruction-' + display,
        'end-' + (placement === 'footer' || placement === 'link' ? 'footer' : placement === 'floating' ? 'floating' : 'header'));
      document.body.classList.toggle('finish-mode', !!ctx.finish);
      document.body.classList.toggle('drawer-space', _c.drawerSpace && !ctx.finish);
      document.body.classList.toggle('status-space', _c.statusSpace);
      const app = u.el('main', 'app', document.body);
      const brand = u.el('aside', 'brand', document.body);
      u.el('strong', 'brand-name', brand, 'BLOCK\nMATH');
      u.el('div', 'brand-tag', brand, 'SMALL\nTASKS\nBIGGER\nMINDS');
      u.el('i', 'brand-rule', brand);
      u.el('div', 'brand-links', brand, 'TOOLS\nSETTINGS\nHELP');
      const head = u.el('header', 'top', app);
      const meta = u.el('div', 'module', head);
      u.el('span', '', meta, 'MODULE 01');
      u.el('strong', 'dialog-title', head, 'ADD THE BLOCKS');
      const progress = u.el('div', 'progress', head);
      u.el('span', '', progress, 'STEP 1 OF 1');
      u.el('i', '', progress);
      const note = u.el('aside', 'instruction-note', document.body);
      note.hidden = display === 'hidden';
      if (display !== 'hidden') {
        u.el('span', 'note-kicker', note, 'FOCUS MODE');
        u.el('i', 'note-rule', note);
        u.el('span', 'note-foot', note, 'ONE STEP CLOSER');
      }
      Object.assign(_c, { app, head, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('note-copy');
        _c.header.insertBefore(note, _c.header.querySelector('.note-rule'));
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'center', _c.app);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-text').classList.add('note-copy');
        _c.header.insertBefore(panel, _c.header.querySelector('.note-rule'));
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('section', 'stage', _c.body);
      _c.stage = stage;
      const controls = u.el('section', 'task-drawer', _c.body);
      const taskhead = u.el('div', 'drawer-head', controls);
      u.el('b', '', taskhead, 'Task controls');
      const show = u.el('button', 'show-controls', taskhead, 'Show controls');
      show.type = 'button';
      show.setAttribute('aria-expanded', 'false');
      show.addEventListener('click', () => {
        document.body.classList.toggle('controls-open');
        const open = document.body.classList.contains('controls-open');
        show.textContent = open ? 'Hide controls' : 'Show controls';
        show.setAttribute('aria-expanded', String(open));
        if (open) {
          const input = stage.querySelector('input');
          if (input) input.focus();
        }
      });
      const prefs = u.el('section', 'preferences', _c.body);
      u.el('b', 'preferences-title', prefs, 'Preferences');
      const groups = u.el('div', 'pref-groups', prefs);
      function segmented(parent, title, labels, active) {
        const group = u.el('div', 'pref-group', parent);
        u.el('label', '', group, title);
        const row = u.el('div', 'segments', group);
        labels.forEach((label, i) => {
          const b = u.el('button', i === active ? 'active' : '', row, label);
          b.type = 'button';
          b.addEventListener('click', () => {
            row.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
            b.classList.add('active');
          });
        });
      }
      segmented(groups, 'Theme', ['Light', 'Dark', 'System'], 0);
      segmented(groups, 'Text size', ['A', 'A', 'A'], 1);
      const sound = u.el('div', 'pref-group sound', groups);
      u.el('label', '', sound, 'Sounds');
      const toggle = u.el('button', 'toggle on', sound, '');
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Toggle sounds');
      toggle.addEventListener('click', () => toggle.classList.toggle('on'));
      u.el('span', '', sound, 'On');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('note-copy');
        _c.header.insertBefore(note, _c.header.querySelector('.note-rule'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
      const copy = _c.header.querySelector('.note-copy');
      if (copy) {
        let fs = parseFloat(getComputedStyle(copy).fontSize);
        const over = () => copy.scrollHeight > copy.clientHeight + 1 ||
          _c.header.scrollHeight > _c.header.clientHeight + 1 ||
          _c.header.getBoundingClientRect().bottom > innerHeight - 8;
        while (fs > 11 && over()) copy.style.fontSize = --fs + 'px';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    'frame.end': (base) => (_c) => {
      const result = base(_c);
      if (!result.submit) return result;
      // Addition relocates the returned node. Relocate the whole footer or
      // floating section so its template control keeps its frame context.
      const section = result.submit.closest('.ref-foot, .ref-float-dock');
      if (section) {
        section.querySelectorAll('.ref-xtra').forEach((button) => _c.headerTools.appendChild(button));
        section.classList.add('frame-end-section');
        return { ...result, submit: section };
      }
      result.submit.classList.add('episode-end');
      return result;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-addition-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-addition-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1049d9'],
      LOW_ACCENTS: ['#1049d9'],
      parts,
    },
  });
})();
