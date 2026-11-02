(function () {
  'use strict';
  const palette = { bg: '#f4f0e6', panel: '#f8f5ec', fg: '#201b19', muted: '#6d625c', line: '#c9beac' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the catalog's original note breakpoints.
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' && _c.W < 1260) || (display === 'toast' && _c.H < 760)) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'library', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Rivermere Public Library');
      const tools = u.el('div', 'tools', head);
      ['Search', 'Help', 'Contact'].forEach((t) => u.el('span', 'menu-item', tools, t + ' ▼'));
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      ['Quick Tools', 'New Search', 'Browse Subjects', 'My Account', 'Help', 'A library is a hospital for the mind.']
        .forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', work);
      center.dataset.instruction = _c.display;
      const toolbar = u.el('div', 'catalog-tools', center);
      Object.assign(_c, { shell, work, center, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const aside = _c.util.el('aside', 'inspector', _c.work);
      ['Today', 'Tue, Apr 23, 1996', '10:24 AM', '“Better information builds a kinder world.”', 'Need Help?',
        'Ask a librarian at the front desk or click Help.']
        .forEach((s, i) => _c.util.el(i === 0 ? 'h2' : 'p', '', aside, s));
      aside.classList.toggle('task-panel', _c.display === 'panel');
      Object.assign(_c, { body: _c.work, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      const clear = _c.util.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.clear-text'));
    },
    overlay: () => (ctx) => {
      if (ctx.initial) {
        const restore = ctx.util.el('section', 'restore-modal', document.body);
        const restoreHead = ctx.util.el('strong', 'restore-title', restore, 'Layout could not be restored');
        ctx.util.el(
          'p',
          '',
          restore,
          'Your previous session’s layout could not be restored.\nSome panels may be misplaced or hidden.',
        );
        ctx.util.el('p', 'restore-question', restore, 'Would you like to use the default layout?');
        const restoreActions = ctx.util.el('div', 'restore-actions', restore);
        const restoreBtn = ctx.util.el('button', 'restore-default', restoreActions, 'Use default layout');
        ctx.util.el('button', 'restore-current', restoreActions, 'Keep current layout');
        restoreBtn.type = 'button';
        restoreBtn.addEventListener('click', () => ctx.dismiss());
        restoreActions.lastChild.type = 'button';
        restoreActions.lastChild.addEventListener('click', () => ctx.dismiss());
        const end = document.querySelector('.submit,.end-control');
        if (end) {
          const er = end.getBoundingClientRect(),
            rr = restore.getBoundingClientRect();
          const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          if (overlaps(er, rr)) {
            const note = document.querySelector('.instruction:not([hidden])');
            const nr = note && note.getBoundingClientRect();
            const shell = document.querySelector('.shell');
            const W = shell.clientWidth,
              H = shell.clientHeight;
            const choices = [
              { left: rr.left, top: er.top - rr.height - 12 },
              { left: rr.left, top: er.bottom + 12 },
              { left: er.right + 12, top: rr.top },
              { left: er.left - rr.width - 12, top: rr.top },
            ]
              .map((p) => ({ ...p, right: p.left + rr.width, bottom: p.top + rr.height }))
              .filter((p) => p.left >= 8 && p.top >= 8 && p.right <= W - 8 && p.bottom <= H - 8 && !overlaps(p, er));
            const position = choices.find((p) => !nr || !overlaps(p, nr)) || choices[0];
            if (position) {
              restore.style.left = position.left + 'px';
              restore.style.top = position.top + 'px';
              restore.style.transform = 'none';
            }
          }
        }
        return { el: restore, dismiss: restoreBtn };
      }
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
    name: 'design-handle-text-unicode-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { library: palette },
      LOW_THEME: palette,
      ACCENTS: ['#64202b'],
      LOW_ACCENTS: ['#64202b'],
      parts,
    },
  });
})();
