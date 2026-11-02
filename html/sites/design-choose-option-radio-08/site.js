(function () {
  'use strict';
  const GEAR =
    '<svg viewBox="0 0 16 16" width="100%" height="100%"><circle cx="8" cy="8" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 1.5v2.4M8 12.1v2.4M1.5 8h2.4M12.1 8h2.4M3.4 3.4l1.7 1.7M10.9 10.9l1.7 1.7M3.4 12.6l1.7-1.7M10.9 5.1l1.7-1.7" stroke="currentColor" stroke-width="2.2"/></svg>';
  const ROWS = [
    ['Projects', '3', '20', '100', 'Unlimited'],
    ['Team Members', '1', '5', '25', 'Unlimited'],
    ['Storage', '1 GB', '10 GB', '100 GB', '1 TB'],
    ['Priority Support', '—', '—', '✓', '✓'],
    ['Custom Branding', '—', '—', '✓', '✓'],
  ];
  const palette = { bg: '#fbfcfe', panel: '#ffffff', fg: '#10162b', muted: '#66707d', line: '#bbc2c9' };
  function info(_c, note) {
    const icon = _c.util.el('span', 'ds-info', null, 'i');
    note.prepend(icon);
  }
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
      const u = _c.util;
      const tb = u.el('div', 'ds-titlebar', document.body);
      const ic = u.el('span', 'ds-appicon', tb);
      ic.innerHTML = GEAR;
      u.el('span', 'ds-apptitle', tb, 'Account Setup');
      const wc = u.el('span', 'ds-wctl', tb);
      u.el('i', 'ds-min', wc);
      u.el('i', 'ds-max', wc);
      u.el('i', 'ds-close', wc, '✕');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      Object.assign(_c, { tb, wc, body, content, main, stage, header: main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        const text = _c.util.el('span', 'ds-itext', null, note.textContent);
        note.replaceChildren(text);
        info(_c, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
      _c.tb.insertBefore(_c.headerTools, _c.wc);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const side = u.el('aside', 'ds-brief', _c.main);
      const help = u.el('div', 'ds-helplink', side);
      u.el('span', 'ds-q', help, '?');
      u.el('span', '', help, 'Help');
      Object.assign(_c, { side, body: _c.main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const note = _c.side.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-instruction', 'ds-panel-note');
        note.querySelector('.ref-panel-text').classList.add('ds-itext');
        info(_c, note);
      }
      const u = _c.util;
      u.el('h2', '', _c.side, 'Plan Details');
      u.el('p', 'ds-plansub', _c.side, 'Compare the features included in each plan.');
      const tbl = u.el('table', 'ds-table', _c.side);
      const thr = u.el('tr', '', u.el('thead', '', tbl));
      ['Feature', 'Starter', 'Pro', 'Business', 'Enterprise'].forEach((t) => u.el('th', '', thr, t));
      const tbd = u.el('tbody', '', tbl);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tbd);
        r.forEach((t) => u.el('td', '', tr, t));
      });
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
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
      const u = _c.util;
      const tools = foot.querySelector('.ref-tools');
      foot.querySelector('.ref-foot-text').remove();
      const gi = u.el('span', 'ds-gear', null);
      gi.innerHTML = GEAR;
      const step = u.el('span', 'ds-step', null, 'Step 1 of 2');
      const back = u.el('button', 'ds-back', null, 'Back');
      back.type = 'button';
      const next = u.el('button', 'ds-next', null, 'Next');
      next.type = 'button';
      const sep = u.el('i', 'ds-fsep');
      foot.prepend(gi, step, back, next, sep);
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
    name: 'design-choose-option-radio-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-radio-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2188ee'],
      LOW_ACCENTS: ['#2188ee'],
      parts,
    },
  });
})();
