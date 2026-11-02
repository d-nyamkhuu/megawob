(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#101d42', muted: '#5a6b85', line: '#9db3cf' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design reserves its left column for notes at every viewport.
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
      const E = _c.util.el;
      const sc = E('div', 'ds-scene', document.body);
      const mode = _c.display;
      const left = E('aside', 'ds-left ds-note-' + mode, sc);
      if (mode === 'header') E('div', 'ds-tag', left, 'Your Task');
      const doc = E('div', 'ds-doc', sc);
      const hd = E('header', 'ds-head', doc);
      hd.innerHTML = '<svg class="ds-plane" viewBox="0 0 110 70"><path d="M46 29 30 5 38 2 67 19 64 24Z" fill="#bfd9ed"/><path d="M49 35 51 69 60 64 64 32Z" fill="#b3d4ed"/><path d="M3 49 11 48 85 12Q104 5 104 10Q101 15 93 18L18 51 7 59 5 53 0 51Z" fill="#e0eff8"/><path d="M11 48 89 13 99 10 95 16 19 51 7 56Z" fill="#c4e0f2"/><path d="M53 36 54 64 61 59 63 32Z" fill="#c6e2f5"/></svg>';
      E('div', 'ds-logo', hd, 'SkyWays');
      E('div', 'ds-logo2', hd, 'TRAVEL');
      E('div', 'ds-nav', hd, 'Plan  |  Search  |  Manage');
      const tab = E('div', 'ds-tab', doc);
      E('span', '', tab, 'Book a Flight');
      E('div', 'ds-docbody', doc);
      E('div', 'ds-panel-title', sc, 'Trip Details');
      [
        ['From', 'London (LHR)', 235, 1],
        ['Departure Date', 'Apr 12, 2025', 487, 2],
        ['Return Date', 'Apr 19, 2025', 557, 2],
        ['Passengers', '1 Adult', 628, 1],
        ['Class', 'Economy', 698, 1],
      ].forEach((r) => {
        const l = E('div', 'ds-rl', sc, r[0]);
        l.style.top = 'calc(var(--u)*' + (r[2] + 10) + ')';
        const f = E('div', 'ds-rf', sc, r[1]);
        f.style.top = 'calc(var(--u)*' + r[2] + ')';
        const b = E('div', 'ds-rb', f);
        b.dataset.k = r[3];
        if (r[3] === 2) b.innerHTML = '<svg viewBox="0 0 30 32" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h24v24H3zM3 12h24M8 2v7M22 2v7"/><path stroke-width="3" stroke-dasharray="3 3" d="M7 17h17M7 23h17"/></svg>';
      });
      const sm = E('div', 'ds-sum', sc);
      E('div', 'ds-sum-t', sm, 'Trip Summary');
      [
        ['From', 'London (LHR)', 250], ['To', 'Not selected', 300],
        ['Departure', 'Apr 12, 2025', 394], ['Return', 'Apr 19, 2025', 445],
        ['Passengers', '1 Adult', 496], ['Class', 'Economy', 547],
      ].forEach((r) => {
        const a = E('div', 'ds-sk', sc, r[0]);
        a.style.top = 'calc(var(--u)*' + r[2] + ')';
        const b = E('div', 'ds-sv', sc, r[1]);
        b.style.top = 'calc(var(--u)*' + r[2] + ')';
        if (r[0] === 'To') b.dataset.role = 'destination-summary';
      });
      E('div', 'ds-sum-hr', sc);
      const side = E('aside', 'ds-tools', sc);
      [
        ['Help', '<path d="M5 2h10l5 5v16H5zM15 2v6h5M8 12h9M8 16h9" fill="none" stroke="currentColor" stroke-width="1.7"/>'],
        ['Settings', '<path d="m10 1 4 0 1 3 2 1 3-1 2 3-2 3v3l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-3L2 7l2-3 3 1 2-1z" fill="currentColor"/><circle cx="12" cy="12" r="5" fill="#e1edf5"/>'],
        ['Support', '<circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M9 8c0-4 7-4 7 0 0 3-4 3-4 6M12 17v2" fill="none" stroke="#edf5fa" stroke-width="2.5"/>'],
      ].forEach((t) => {
        const d = E('div', 'ds-tool', side);
        d.innerHTML = '<svg viewBox="0 0 24 26">' + t[1] + '</svg><span>' + t[0] + '</span>';
      });
      Object.assign(_c, { sc, hd, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.hd;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.sc; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const title = _c.header.querySelector('.ref-panel-title');
      const text = _c.header.querySelector('.ref-panel-text');
      if (title) { title.classList.add('ds-panel-note-title'); title.textContent = 'Your Task'; }
      if (text) text.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.sc); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.sc.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.sc.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      // Existing flight actions are decorative application chrome.
      const cl = _c.util.el('button', 'ds-hex ds-clear', foot, 'Clear');
      cl.type = 'button';
      const ff = _c.util.el('button', 'ds-hex ds-find', foot, 'Find Flights');
      ff.type = 'button';
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-choose-option-autocomplete-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#2f6cc0'], LOW_ACCENTS: ['#2f6cc0'], parts,
    },
  });
})();
