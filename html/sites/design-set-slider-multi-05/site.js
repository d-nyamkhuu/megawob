/* Dark developer image-adjust tool: narrow command rail, task note header, slider panel and preview pair. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    Adjust: '<rect x="4" y="4" width="20" height="20" rx="1.5"/><path d="M4 10h20M4 18h20"/>',
    Crop: '<path d="M8 3v17h17M3 8h17v17"/>',
    Filters: '<path d="M3 8h22M3 14h22M3 20h22"/><circle cx="17" cy="8" r="2.2" fill="#0f141b"/><circle cx="9" cy="14" r="2.2" fill="#0f141b"/><circle cx="18" cy="20" r="2.2" fill="#0f141b"/>',
    Layers: '<circle cx="14" cy="14" r="10"/><circle cx="14" cy="14" r="3.5"/>',
    Settings: '<circle cx="14" cy="14" r="3.5"/><path d="M11 3h6l1 3 3-1 3 4-2 3 3 2-1 5-4 0-1 4-5 1-2-3-3 1-4-3 1-4-3-2 2-5 3 0z"/>',
  };
  function icon(parent, name) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 28 28');
    s.setAttribute('class', 'rail-ico');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.8');
    s.innerHTML = ICONS[name];
    parent.append(s);
  }
  // Task text with the quoted names bold and the target numbers in the accent color.
  function fillInstruction(el, text) {
    for (const part of String(text).split(/(“[^”]*”|(?<![±\d.])-?\d+(?:\.\d+)?)/)) {
      if (!part) continue;
      if (/^“/.test(part)) { const b = document.createElement('b'); b.textContent = part; el.append(b); }
      else if (/^-?\d/.test(part)) { const n = document.createElement('span'); n.className = 'num'; n.textContent = part; el.append(n); }
      else el.append(document.createTextNode(part));
    }
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Quick feedback', cookie: 'Cookies', toast: 'Notice', promo: 'Update available', banner: 'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'How easy was this tool to use?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio'; radio.name = 'ease'; radio.value = label;
        u.el('span', '', row, label);
      });
      u.el('div', 'survey-question', el, 'What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) {
        const button = u.el('button', '', options, label);
        button.type = 'button';
        button.onclick = () => {
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
      u.el('p', 'survey-intro', el, {cookie: 'This tool stores display preferences locally.', toast: 'Preview rendering is ready.', promo: 'A new filter pack is available.', banner: 'Preview runs in offline mode.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', el, survey ? 'Close' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  function styleNote(note, text, display) {
    text.classList.add('instruction');
    text.dataset.display = display;
    const value = text.textContent;
    text.textContent = '';
    fillInstruction(text, value);
    const bang = document.createElement('div');
    bang.className = 'bang';
    bang.textContent = '!';
    bang.setAttribute('aria-hidden', 'true');
    note.prepend(bang);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have a dedicated place in the original frame.
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
      document.body.classList.add('devtool', 'instruction-' + _c.display);
      const rail = u.el('nav', 'cmd-rail', document.body);
      ['Adjust', 'Crop', 'Filters', 'Layers', 'Settings'].forEach((name, i) => {
        const b = u.el('div', 'rail-item' + (i === 0 ? ' active' : ''), rail);
        icon(b, name);
        u.el('span', '', b, name);
      });
      const page = u.el('div', 'page', document.body);
      const head = u.el('header', 'page-head', page);
      const ttl = u.el('div', '', head);
      u.el('h1', '', ttl, 'Image Adjustments');
      u.el('p', 'sub', ttl, 'Fine-tune the image using the sliders below.');
      const tools = u.el('div', 'header-tools', head);
      const ws = u.el('div', 'workspace', tools);
      u.el('span', '', ws, 'WORKSPACE');
      u.el('i', '', ws);
      u.el('span', 'dim', ws, '1024 × 576');
      const header = u.el('section', 'task-note', page);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { page, tools, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) styleNote(_c.header, text, _c.display);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.page);
      const preview = u.el('section', 'preview', body);
      const heads = u.el('div', 'pv-head', preview);
      u.el('span', '', heads, 'Original');
      u.el('span', '', heads, 'Adjusted (Preview)');
      const imgs = u.el('div', 'pv-imgs', preview);
      u.el('div', 'pv-img', imgs);
      u.el('div', 'pv-img adj', imgs);
      Object.assign(_c, { body, preview });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.preview;
      base(_c);
      _c.body = body;
      const panel = _c.preview.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        styleNote(panel, panel.querySelector('.ref-panel-text'), _c.display);
        _c.preview.prepend(panel);
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage', _c.body);
      stage.dataset.role = 'stage';
      _c.body.prepend(stage);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note');
        styleNote(note, note.querySelector('.ref-note-text'), _c.display);
        const close = note.querySelector('.ref-note-x');
        close.classList.add('instruction-close');
        close.textContent = 'Close';
        _c.preview.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('page-foot');
      _c.page.append(foot);
      const hint = foot.querySelector('.ref-foot-text');
      hint.classList.add('hint');
      hint.textContent = '';
      const info = _c.util.el('span', 'info', hint, 'i');
      info.setAttribute('aria-hidden', 'true');
      _c.util.el('span', '', hint, 'Image preview ready.');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.append(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#10151a', panel: '#182026', fg: '#e6edf3', muted: '#8b95a3', line: '#2a323d' };
  env.site({
    name: 'design-set-slider-multi-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#61e974'], LOW_ACCENTS: ['#61e974'], parts,
    },
  });
})();
