(function () {
  'use strict';
  const palette = { bg: '#f2f5fa', panel: '#ffffff', fg: '#0b173e', muted: '#6b778a', line: '#b9c3d1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if (display === 'panel' && _c.W < 1100) display = 'header';
      if (display === 'toast' && _c.H < 700) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
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
      u.el('span', 'ds-brand', top, 'Civic Services Portal');
      const nav = u.el('nav', 'ds-nav', top);
      ['My Account', 'Help', 'Sign Out'].forEach((t) => u.el('span', '', nav, t));
      const ov = u.el('section', 'ds-overview', document.body);
      const ovl = u.el('div', 'ds-ov-left', ov);
      u.el('h1', '', ovl, 'Office Visit Request');
      u.el('p', 'ds-ov-sub', ovl, 'Request an appointment at a local office.');
      const steps = u.el('div', 'ds-steps', ovl);
      [
        ['1', 'Your Details', 1],
        ['2', 'Choose an Office', 0],
        ['3', 'Review & Submit', 0],
      ].forEach((s, i) => {
        if (i) u.el('i', 'ds-step-line', steps);
        const st = u.el('span', 'ds-step' + (s[2] ? ' on' : ''), steps);
        u.el('b', '', st, s[0]);
        u.el('em', '', st, s[1]);
      });
      const ovr = u.el('div', 'ds-ov-right', ov);
      u.el('h2', '', ovr, 'Need to know');
      const ul = u.el('ul', '', ovr);
      [
        'Appointments help us serve you faster.',
        'Bring a valid ID to your visit.',
        'You will receive a confirmation by email.',
      ].forEach((t) => u.el('li', '', ul, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      u.el('h2', 'ds-work-title', content, 'Your Details');
      u.el('p', 'ds-work-sub', content, 'Please provide your information and preferred office location.');
      Object.assign(_c, { top, ov, ovr, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction');
        text.textContent = note.textContent;
        note.textContent = '';
        const icon = _c.util.el('span', 'ds-info-i', note, 'i');
        note.insertBefore(icon, note.firstChild);
        note.appendChild(text);
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
      _c.body = _c.ovr;
      base(_c);
      _c.body = body;
      if (_c.display === 'panel') {
        _c.ov.classList.add('ds-overview-panel');
        const panel = _c.ovr.querySelector('.ref-panel');
        panel.classList.add('ds-brief', 'ds-brief-overview');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const stage = u.el('main', 'ds-stage', main);
      const decor = u.el('div', 'ds-decor', main);
      const fake = (cls, label, val) => {
        const w = u.el('div', 'ds-fake ' + cls, decor);
        u.el('span', 'ds-fl', w, label);
        if (val !== null) u.el('div', 'ds-fv', w, val);
        return w;
      };
      fake('f-name', 'Full name', 'Jordan Lee');
      fake('f-email', 'Email address', 'jordan.lee@example.com');
      fake('f-reason', 'Reason for visit', 'Renewal');
      const dt = fake('f-date', 'Preferred date', 'Apr 21, 2017');
      const cal = u.el('span', 'ds-cal', dt.lastChild);
      cal.innerHTML =
        '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.7"><rect x="3" y="5" width="22" height="21" rx="1.5"/><path d="M3 11h22M9 2v7M19 2v7"/><path stroke-width="3" d="M8 15h3m5 0h3M8 20h3m5 0h3"/></svg>';
      const ad = fake('f-add', 'Additional information (optional)', '');
      ad.lastChild.textContent = 'e.g. accessibility needs, special assistance';
      Object.assign(_c, { stage, main });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        const icon = _c.util.el('span', 'ds-info-i', note, 'i');
        note.insertBefore(icon, note.firstChild);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('div', 'ds-footer', _c.content);
      const cancel = _c.util.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const hd = u.el('div', 'ds-ov-head', el);
      const gear = u.el('span', 'ds-gear', hd);
      gear.innerHTML =
        '<svg viewBox="0 0 52 52" fill="currentColor"><path d="M21 1h10l2 7 5 3 7-2 5 9-5 5v6l5 5-5 9-7-2-5 3-2 7H21l-2-7-5-3-7 2-5-9 5-5v-6l-5-5 5-9 7 2 5-3z"/><circle cx="26" cy="26" r="9" fill="#195798"/></svg>';
      u.el('span', 'ds-ov-title', hd, 'A new version is available');
      const x = u.el('button', 'ds-ov-x', hd, '×');
      x.type = 'button';
      x.addEventListener('click', () => ctx.dismiss('close'));
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: "We've made improvements to keep your information safe and your experience smooth.",
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      const bd = u.el('div', 'ds-ov-body', el);
      u.el('p', '', bd, texts.toast);
      const row = u.el('div', 'ds-ov-btns', bd);
      const dismiss = u.el('button', 'ds-later', row, 'Remind me later');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      const upd = u.el('button', 'ds-update', row, 'Update now');
      upd.type = 'button';
      upd.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-autocomplete-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-autocomplete-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d5fb4'],
      LOW_ACCENTS: ['#1d5fb4'],
      parts,
    },
  });
})();
