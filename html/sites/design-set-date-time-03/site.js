(function () {
  'use strict';
  const palette = { bg: '#f8f7f4', panel: '#f8f7f4', fg: '#111122', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes already have a place in this frame at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const top = u.el('header', 'ds-top', content);
      const tl = u.el('div', 'ds-titles', top);
      u.el('h1', 'ds-brand', tl, 'Schedule a Pickup');
      u.el('div', 'ds-sub', tl, 'Provide the details below to schedule your pickup.');
      const stp = u.el('div', 'ds-steps', top);
      u.el('div', 'ds-stepof', stp, 'Step 2 of 3');
      const trk = u.el('div', 'ds-track', stp);
      [['1', 'Details', 'done'], ['2', 'Pickup', 'cur'], ['3', 'Review', '']].forEach((s) => {
        const it = u.el('div', 'ds-step ' + s[2], trk);
        u.el('span', 'ds-dot', it, s[0]);
        u.el('span', 'ds-stl', it, s[1]);
      });
      Object.assign(_c, { shell, content, top, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-top-tools');
      if (_c.submit) _c.submit.classList.add('ds-top-submit');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-main', _c.content);
      const rail = u.el('aside', 'ds-rail', _c.shell);
      u.el('h2', '', rail, 'Pickup Summary');
      u.el('div', 'ds-reservation-values', rail);
      const help = u.el('section', 'ds-help', rail);
      u.el('h2', '', help, 'Help');
      const hp = u.el('p', '', help, 'Need to make a change?');
      u.el('br', '', hp);
      hp.append(document.createTextNode('Update the information on the left.'));
      const cq = u.el('section', 'ds-cq', rail);
      u.el('h2', '', cq, 'Common Questions');
      ['Can I change the pickup time?', 'What items can be picked up?', 'Do I need to be home?', 'How do I cancel?'].forEach((t) => u.el('a', '', cq, t));
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-set-date-time-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-time-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b3202a'],
      LOW_ACCENTS: ['#b3202a'],
      parts,
    },
  });
})();
