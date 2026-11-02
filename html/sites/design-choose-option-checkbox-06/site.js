(function () {
  'use strict';
  const palette = { bg: '#513729', panel: '#f6efdf', fg: '#17130d', muted: '#5a4a38', line: '#b5a584' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Edit Listing');
      u.el('span', 'ds-tag', top, 'A place for memorable stays');
      const nav = u.el('nav', 'ds-menu', document.body);
      'Basic Info|Location|Amenities|Photos|Pricing|Availability'.split('|').forEach((t) =>
        u.el('span', t === 'Amenities' ? 'on' : '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-logo', rail, 'CozyStays');
      'Listings|Calendar|Messages|Host Tools|Settings'.split('|').forEach((t, i) =>
        u.el('div', i === 0 ? 'on' : '', rail, t));
      const chk = u.el('aside', 'ds-check', document.body);
      u.el('h3', '', chk, _c.display === 'panel' ? 'Your Task' : 'Listing checklist');
      ['Basic information', 'Location', 'Amenities', 'Photos', 'Pricing', 'Availability'].forEach((t) => {
        const r = u.el('div', t === 'Amenities' ? 'on' : '', chk);
        u.el('i', '', r);
        r.append(t);
      });
      u.el('p', '', chk, 'Small details make a big difference.');
      chk.classList.toggle('ds-task-panel', _c.display === 'panel');
      const pv = u.el('aside', 'ds-preview', document.body);
      u.el('h3', '', pv, 'Preview');
      u.el('div', 'ds-pic', pv);
      u.el('h4', '', pv, 'Seaside Apartment');
      u.el('p', '', pv, 'Bright and comfortable stay near the coast.');
      const stats = u.el('div', 'ds-stats', pv);
      ['4 guests', '2 bedrooms', '1 bathroom'].forEach((t) => u.el('span', '', stats, t));
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { shell: body, content, header: content, toolbar: nav, taskCard: chk });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.taskCard;
      base(_c);
      _c.body = body;
      const panel = _c.taskCard.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief', 'ds-panel-note');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('section', 'ds-initial ds-initial-tour', document.body);
        el.dataset.role = 'overlay';
        u.el('h2', '', el, 'Welcome!');
        u.el('p', '', el, 'Take a quick tour to learn about setting your preferences.');
        const dismiss = u.el('button', '', el, 'Skip tour');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          env.log('reference-obstruction-dismiss', { kind: 'tour' });
          ctx.dismiss('close');
        });
        return { el, dismiss };
      }
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
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-checkbox-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'tour' },
    design: {
      THEMES: { 'design-choose-option-checkbox-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#617d2f'],
      LOW_ACCENTS: ['#617d2f'],
      parts,
    },
  });
})();
