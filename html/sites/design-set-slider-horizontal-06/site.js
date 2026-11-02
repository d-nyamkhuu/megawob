/* Image Studio: early Aqua utility window, narrow command rail, seeded task instruction. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svgIcon(parent, cls, html) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 48 48');
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML =
      '<defs><linearGradient id="aqua-blue" x2="0" y2="1"><stop stop-color="#b9dfff"/><stop offset=".5" stop-color="#77b5f3"/><stop offset="1" stop-color="#397dbb"/></linearGradient><linearGradient id="aqua-metal" x2="0" y2="1"><stop stop-color="#fafcff"/><stop offset="1" stop-color="#b9cbdc"/></linearGradient></defs>' +
      html;
    parent.appendChild(s);
    return s;
  }
  const ICONS = {
    Edit: '<path d="M19 35h10l2 7H17z" fill="url(#aqua-metal)" stroke="#7f95ab"/><rect x="9" y="42" width="30" height="3" rx="1.5" fill="#eef5fb" stroke="#7f95ab"/><rect x="3" y="3" width="42" height="35" rx="3" fill="url(#aqua-metal)" stroke="#738aa1" stroke-width="1.5"/><rect x="7" y="7" width="34" height="26" fill="url(#aqua-blue)" stroke="#788fa8"/><path d="M7 30l11-12 9 8 7-11 7 15v3H7z" fill="#3b6895"/><path d="M15 21l3-3 3 4-3-1zM31 19l3-4 4 6-4-2z" fill="#eff8ff"/><circle cx="15" cy="13" r="2.5" fill="#ffffef"/><path d="M8 8h31v6C27 10 18 16 8 13z" fill="#fff" opacity=".25"/>',
    Effects:
      '<circle cx="24" cy="24" r="22" fill="url(#aqua-blue)" stroke="#5e81b0" stroke-width="1.7"/><path d="M4 31l10-13 10 10 8-13 12 17v3L24 43z" fill="#648f80"/><path d="M5 34l12-5 9 6 16-6c-3 11-12 15-19 15S8 40 5 34z" fill="#4a839c"/><path d="M9 11c8-8 22-9 29 0l-3 5c-9-5-15-2-24 2z" fill="#fff" opacity=".4"/><circle cx="33" cy="12" r="2" fill="#fff"/>',
    Adjust:
      '<path d="M13 5v32h31M5 13h32v31" fill="none" stroke="#557ba7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 5v32h31M5 13h32v31" fill="none" stroke="#92bce6" stroke-width="2" stroke-linecap="round"/><path d="M17 17h15v15H17z" fill="none" stroke="#fff" stroke-width="1"/>',
    Filters:
      '<path d="M25 3c13 0 22 10 20 24S31 47 17 44 1 34 6 27s12-9 11-15S19 3 25 3z" fill="url(#aqua-blue)" stroke="#5b81ab" stroke-width="1.7"/><ellipse cx="27" cy="22" rx="5" ry="7" fill="#dbe9f1" stroke="#5b81ab"/><circle cx="26" cy="9" r="3" fill="#ffed86" stroke="#a8994f"/><circle cx="37" cy="17" r="3" fill="#ffdb61" stroke="#a8994f"/><circle cx="38" cy="29" r="3" fill="#fbed89" stroke="#a8994f"/><circle cx="29" cy="38" r="3" fill="#f2c958" stroke="#a8994f"/><circle cx="17" cy="36" r="3" fill="#fbed89" stroke="#a8994f"/><circle cx="11" cy="29" r="2.5" fill="#ffdd6c"/><path d="M20 6c8-3 18 3 20 8-9-7-18-4-20 2z" fill="#fff" opacity=".3"/>',
    Preferences:
      '<path d="M20 3h7l1 6 4 2 5-3 5 5-3 5 2 4 6 1v7l-6 1-2 4 3 5-5 5-5-3-4 2-1 5h-7l-1-5-4-2-5 3-5-5 3-5-2-4-6-1v-7l6-1 2-4-3-5 5-5 5 3 4-2z" transform="translate(1 -1) scale(.95)" fill="url(#aqua-metal)" stroke="#6b88a6" stroke-width="1.8" stroke-linejoin="round"/><circle cx="24" cy="24" r="9" fill="#dce8f5" stroke="#6b88a6" stroke-width="2"/>',
    Help: '<circle cx="24" cy="24" r="22" fill="url(#aqua-blue)" stroke="#507aae" stroke-width="1.7"/><text x="24" y="37" text-anchor="middle" font-size="37" font-weight="bold" fill="#fff" stroke="#6b91b9" stroke-width=".6" font-family="Arial,sans-serif">?</text><path d="M7 13C14 2 34 1 41 13c-12-5-21-3-34 0z" fill="#fff" opacity=".25"/>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'We value your feedback',
      cookie: 'Your privacy matters',
      toast: 'Notice',
      promo: 'Image Studio Pro',
      banner: 'Service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (ctx.kind === 'chat') {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was it to adjust your image today?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio';
        radio.name = 'ease';
        radio.value = label;
        u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', el, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Image quality', 'Tool layout', 'Help and guidance']) {
        const b = u.el('button', '', options, label);
        b.type = 'button';
        b.onclick = () => {
          toggle.textContent = label;
          options.hidden = true;
          toggle.setAttribute('aria-expanded', 'false');
        };
      }
      toggle.onclick = () => {
        options.hidden = !options.hidden;
        toggle.setAttribute('aria-expanded', String(!options.hidden));
      };
    } else {
      u.el(
        'p',
        'survey-intro',
        el,
        {
          cookie: 'This app can remember your display preferences.',
          toast: 'Your adjustments are ready to apply.',
          promo: 'Discover more filters and effects.',
          banner: 'A new version is available.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'primary survey-close',
      el,
      ctx.kind === 'chat' ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#f1f4f8', panel: '#f2f5f9', fg: '#18335e', muted: '#4b6285', line: '#cdd7e3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every display uses the original card beneath the adjustment controls.
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
      document.body.classList.add('aqua', `instruction-${_c.display}`);
      const bar = u.el('header', 'titlebar', document.body);
      const lights = u.el('div', 'lights', bar);
      u.el('i', 'l-red', lights);
      u.el('i', 'l-yel', lights);
      u.el('i', 'l-grn', lights);
      u.el('div', 'wtitle', bar, 'Image Studio');
      const search = u.el('div', 'search', bar);
      svgIcon(search, 'mag', '<circle cx="20" cy="20" r="12" fill="none" stroke="#5a6b86" stroke-width="5"/><path d="M29 29l14 14" stroke="#5a6b86" stroke-width="6" stroke-linecap="round"/>');
      u.el('span', '', search, 'Search');
      const shell = u.el('div', 'shell', document.body);
      const rail = u.el('nav', 'rail', shell);
      for (const name of ['Edit', 'Effects', 'Adjust', 'Filters', 'Preferences', 'Help']) {
        const b = u.el('div', 'rail-item' + (name === 'Edit' ? ' on' : ''), rail);
        svgIcon(b, 'ico', ICONS[name]);
        u.el('span', '', b, name);
      }
      const content = u.el('section', 'content', shell);
      const head = u.el('div', 'head', content);
      u.el('h1', '', head, 'Adjust Image');
      const toolbar = u.el('div', 'head-tools', head);
      const resetAll = u.el('button', 'reset-all', toolbar);
      resetAll.type = 'button';
      resetAll.dataset.action = 'reset';
      svgIcon(resetAll, 'ri', '<path d="M38 24a14 14 0 1 1-5-10.7" fill="none" stroke="#2f6fc7" stroke-width="5"/><path d="M26 4l12 4-8 10z" fill="#2f6fc7"/>');
      u.el('span', '', resetAll, 'Reset All');
      const panes = u.el('div', 'panes', content);
      const photo = u.el('div', 'photo', panes);
      const lake = u.el('img', 'scene', photo);
      lake.decoding = 'sync';
      lake.loading = 'eager';
      lake.src = 'sites/design-set-slider-horizontal-06/assets/mountain-lake.webp';
      lake.alt = 'Snowy Alpine mountains and evergreen forest reflected in a blue lake';
      const controls = u.el('div', 'controls', panes);
      const tabs = u.el('div', 'tabs', controls);
      ['Basic', 'Color', 'Detail', 'Advanced'].forEach((t, i) => u.el('div', 'tab' + (i === 0 ? ' on' : ''), tabs, t));
      Object.assign(_c, { shell, content, panes, controls, tabs, toolbar, header: controls });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.controls.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.panes; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.controls });
      const note = _c.controls.querySelector('.ref-panel');
      if (note) note.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage');
      stage.dataset.role = 'stage';
      _c.controls.insertBefore(stage, _c.tabs.nextSibling);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.controls.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('foot');
      foot.querySelector('.ref-foot-text').remove();
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-horizontal-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-horizontal-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f7be0'],
      LOW_ACCENTS: ['#2f7be0'],
      parts,
    },
  });
})();
