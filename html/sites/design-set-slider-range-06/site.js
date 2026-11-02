/* Neo-brutalist stacked native windows: Visual Toolkit main window plus a smaller Reference window. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function icon(parent, kind) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 40 40');
    s.setAttribute('class', 'nav-icon');
    s.setAttribute('aria-hidden', 'true');
    const paths = {
      adjust: '<path d="M3 6h34M3 20h34M3 34h34" stroke="#111" stroke-width="5" stroke-linecap="round"/><circle cx="11" cy="6" r="5" fill="#111"/><circle cx="27" cy="20" r="5" fill="#111"/><circle cx="27" cy="34" r="5" fill="#111"/>',
      filters: '<circle cx="20" cy="20" r="18" fill="#111"/><path d="M13 8C2 14 4 30 18 33C8 25 8 15 13 8Z" fill="#e4e3de"/>',
      crop: '<path d="M10 2v28h28M2 10h28v28" fill="none" stroke="#111" stroke-width="5"/>',
      style: '<path d="M20 3C9 3 2 11 2 20s8 17 15 17c4 0 4-4 2-6-2-3 0-5 3-5h8c5 0 8-3 8-7C38 10 30 3 20 3z" fill="#111"/><circle cx="12" cy="18" r="3" fill="#fff"/><circle cx="19" cy="11" r="3" fill="#fff"/><circle cx="28" cy="13" r="3" fill="#fff"/>',
      settings: '<path d="M16 1h8l1 5 4 2 5-3 5 6-4 4 1 4 5 1v8l-5 1-2 4 3 5-6 5-4-4-4 1-1 5h-8l-1-5-4-2-5 3-5-6 4-4-1-4-5-1v-8l5-1 2-4-3-5 6-5 4 4 4-1z" transform="translate(2 0) scale(.86)" fill="#111"/><circle cx="20" cy="20" r="6" fill="currentColor"/>',
    };
    s.innerHTML = paths[kind];
    parent.append(s);
  }
  function winButtons(u, parent) {
    const box = u.el('div', 'win-btns', parent);
    u.el('span', 'wb wb-min', box);
    u.el('span', 'wb wb-max', box);
    const x = u.el('span', 'wb wb-x', box);
    x.innerHTML = '<svg viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="#111" stroke-width="3"/></svg>';
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'nb-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Quick survey', cookie: 'Privacy', toast: 'Notice', promo: 'Upgrade', banner: 'Service notice'}[ctx.kind];
    const bar = u.el('div', 'nb-ov-bar', el);
    u.el('span', '', bar, title);
    const x = u.el('button', 'survey-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'nb-ov-body', el);
    if (survey) {
      u.el('p', '', body, 'How easy was the toolkit to use today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio';
        radio.name = 'ease';
        radio.value = label;
        u.el('span', '', row, label);
      });
    } else {
      u.el('p', '', body, {cookie: 'This toolkit can remember your display preferences.', toast: 'Your adjustments are ready.', promo: 'Try the full toolkit.', banner: 'The toolkit is available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const palette = { bg: '#f6f4ee', panel: '#fff', fg: '#111', muted: '#111', line: '#c3c3c0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel' && !_c.tall) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('nb', `instruction-${_c.display}`);
      const main = u.el('section', 'win win-main', document.body);
      const tb = u.el('header', 'titlebar', main);
      u.el('span', 'title', tb, 'VISUAL TOOLKIT');
      winButtons(u, tb);
      const body = u.el('div', 'win-body', main);
      const side = u.el('nav', 'sidebar', body);
      [['adjust', 'Adjust'], ['filters', 'Filters'], ['crop', 'Crop'], ['style', 'Style'], ['settings', 'Settings']].forEach(([k, label], i) => {
        const item = u.el('div', 'nav-item' + (i === 0 ? ' on' : ''), side);
        icon(item, k);
        u.el('span', '', item, label);
      });
      const content = u.el('div', 'content', body);
      u.el('h1', '', content, 'Image Adjustments');
      u.el('hr', '', content);
      const ref = u.el('section', 'win win-ref', document.body);
      const rtb = u.el('header', 'titlebar', ref);
      u.el('span', 'title', rtb, 'REFERENCE');
      winButtons(u, rtb);
      const rb = u.el('div', 'ref-body', ref);
      u.el('h2', '', rb, 'Opacity Guide');
      u.el('hr', '', rb);
      // A neutral illustration: the task widget must not populate this with target values.
      const card = u.el('div', 'guide-card', rb);
      const description = u.el('p', '', card, 'Drag each handle to adjust the selected range.');
      description.hidden = _c.display === 'panel' || _c.display === 'hidden';
      Object.assign(_c, { main, toolbar: tb, body, contentPane: content, header: content, guide: card, referenceBody: rb });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.classList.toggle('long', _c.ctx.instruction.length > 75);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.insertBefore(_c.headerTools, _c.toolbar.querySelector('.win-btns'));
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.guide;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const mini = u.el('div', 'mini', _c.guide);
      u.el('div', 'mini-fill', mini);
      u.el('span', 'mini-thumb a', mini).dataset.v = '10';
      u.el('span', 'mini-thumb b', mini).dataset.v = '72';
      const ticks = u.el('div', 'mini-ticks', _c.guide);
      for (let i = 0; i <= 5; i++) {
        const tick = u.el('i', '', ticks, String(i * 20));
        tick.style.left = `${i * 20}%`;
      }
      if (_c.display !== 'panel') u.el('div', 'guide-note', _c.referenceBody, 'Target values are within the slider range.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', _c.contentPane);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.contentPane.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('win-footer');
      _c.main.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      _c.footer = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-range-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-range-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffdc43'],
      LOW_ACCENTS: ['#ffdc43'],
      parts,
    },
  });
})();
