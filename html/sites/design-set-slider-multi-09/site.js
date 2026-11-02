/* PixelPlay Photo Studio: Memphis-style document with a margin for the task and actions. */
(function () {
  'use strict';
  const PHOTO =
    '<img src="sites/design-set-slider-multi-09/assets/coastal-preview-v2.webp" alt="Sunset over a rocky Pacific coastal cove">';
  const IC = {
    reset:
      '<svg viewBox="0 0 24 24"><path d="M4 8a8 8 0 0 1 14-3M20 16a8 8 0 0 1-14 3M4 3v5h5M20 21v-5h-5" fill="none" stroke="#14163a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    preview:
      '<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2" fill="none" stroke="#14163a" stroke-width="2"/><path d="M5 17l4.5-5 3.5 4 2.5-3 3 4" fill="none" stroke="#14163a" stroke-width="2"/><circle cx="9" cy="9" r="1.5" fill="#14163a"/></svg>',
    compare:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" fill="none" stroke="#14163a" stroke-width="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" stroke="#14163a" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'Quick feedback',
      cookie: 'Cookies',
      toast: 'Studio notice',
      promo: 'Try PixelPlay Plus',
      banner: 'Studio notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was this tool to use?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach(
        (label) => {
          const row = u.el('label', '', choices);
          const radio = u.el('input', '', row);
          radio.type = 'radio';
          radio.name = 'ease';
          radio.value = label;
          u.el('span', '', row, label);
        },
      );
      u.el('div', 'survey-question second', el, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Finding tools', 'Image quality', 'Help and guidance']) {
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
          cookie: 'This studio can remember your display preferences.',
          toast: 'Your image is ready for editing.',
          promo: 'Discover more tools for your photos.',
          banner: 'The studio is available offline.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'primary survey-close',
      el,
      survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function shape(parent, cls, html) {
    const d = document.createElement('div');
    d.className = 'pp-shape ' + cls;
    if (html) d.innerHTML = html;
    parent.appendChild(d);
    return d;
  }
  function styleNote(el, display) {
    if (!el) return;
    el.classList.add('instruction');
    el.dataset.display = display;
    const text = el.textContent;
    el.classList.toggle('long', text.length > 135);
    el.classList.toggle('very-long', text.length > 220);
    el.textContent = '';
    const colors = ['#2f6df0', '#ff6b6b', '#7a4be0'];
    let ci = 0;
    text.split(/(“[^”]*”)/).forEach((part) => {
      if (/^“[^”]*”$/.test(part)) {
        const s = document.createElement('span');
        s.className = 'q';
        s.textContent = part;
        s.style.color = colors[ci++ % 3];
        el.appendChild(s);
      } else if (part) el.appendChild(document.createTextNode(part));
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('pp', 'instruction-' + _c.display);
      const page = u.el('div', 'pp-page', document.body);
      for (const cls of ['circ-coral', 'circ-lilac', 'tri-coral', 'tri-purple', 'circ-pink', 'dots', 'divider']) shape(page, cls);
      shape(page, 'squiggle',
        '<svg viewBox="0 0 160 36"><path d="M5 18 Q18 -2 31 18 T57 18 T83 18 T109 18 T135 18 Q145 7 154 23" fill="none" stroke="#cbbdf0" stroke-width="11" stroke-linecap="round"/></svg>');
      shape(page, 'rays',
        '<svg viewBox="0 0 100 62"><g stroke="#ff7468" stroke-width="4" stroke-linecap="round"><path d="M18 14l14 20"/><path d="M54 4v26"/><path d="M88 16l-12 18"/><path d="M2 54l22 4"/></g></svg>');
      const logo = u.el('div', 'pp-logo', page);
      const word = u.el('div', 'pp-word', logo);
      u.el('span', 'a', word, 'Pixel');
      u.el('span', 'b', word, 'Play');
      u.el('div', 'pp-sub', logo, 'PHOTO STUDIO');
      shape(page, 'tri-blue');
      u.el('div', 'pp-tag', page, 'SIMPLE TOOLS. BRIGHTER IDEAS.');
      const photo = u.el('div', 'pp-photo', page);
      photo.innerHTML = PHOTO;
      u.el('h1', 'pp-h', page, 'Image Adjustments');
      u.el('p', 'pp-hsub', page, 'Fine-tune your image with the sliders below.');
      const bar = u.el('div', 'pp-bar', page);
      const reset = u.el('button', 'pp-btn', bar);
      reset.type = 'button';
      reset.dataset.action = 'reset';
      reset.innerHTML = IC.reset + '<span>Reset</span>';
      for (const k of ['preview', 'compare']) {
        const b = u.el('button', 'pp-btn', bar);
        b.type = 'button';
        b.setAttribute('aria-disabled', 'true');
        b.innerHTML = IC[k] + '<span>' + (k === 'preview' ? 'Preview' : 'Compare') + '</span>';
        b.onclick = () => env.log('decoy', { label: k === 'preview' ? 'Preview' : 'Compare' });
      }
      const task = u.el('aside', 'pp-task', page);
      const toolbar = u.el('div', 'pp-toolbar', page);
      Object.assign(_c, { page, header: task, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c.header.querySelector('.ref-instruction'), _c.display);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').hidden = true;
        styleNote(panel.querySelector('.ref-panel-text'), _c.display);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'record-stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        styleNote(text, _c.display);
        for (const cls of ['instruction', 'long', 'very-long']) {
          note.classList.toggle(cls, text.classList.contains(cls));
          text.classList.remove(cls);
        }
        const close = note.querySelector('.ref-note-x');
        close.textContent = 'Close';
        close.classList.add('instruction-close');
      }
      const u = _c.util;
      const acts = u.el('div', 'pp-acts', _c.page);
      u.el('div', 'pp-acth', acts, 'ACTIONS');
      [
        ['#cfc4ee', _c.display === 'hidden' ? 'Adjust the sliders to match your task.' : 'Adjust the sliders to match the values above.'],
        ['#ff6b6b', 'Preview the image as you make changes.'],
        ['#bce9e0', 'Finish when you’re ready.'],
      ].forEach(([c, t]) => {
        const r = u.el('div', 'pp-act', acts);
        u.el('i', '', r).style.background = c;
        u.el('span', '', r, t);
      });
      const scale = _c.page.getBoundingClientRect().width / 1672;
      const noteBottom = _c.display === 'hidden' ? 0 : _c.header.getBoundingClientRect().bottom;
      const actionsTop = Math.max(acts.getBoundingClientRect().top, noteBottom + 24 * scale);
      acts.style.top = actionsTop + 'px';
      const actionsBottom = _c.toolbar.getBoundingClientRect().top - 16 * scale;
      const actionRows = acts.querySelectorAll('.pp-act');
      const actionHeight = Array.from(actionRows).reduce((height, row) =>
        height + row.getBoundingClientRect().height + 22 * scale, 0);
      const headingHeight = acts.querySelector('.pp-acth').getBoundingClientRect().height + 22 * scale;
      if (actionsTop + actionHeight + headingHeight > actionsBottom) acts.classList.add('compact');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.page.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#fcf9ef', panel: '#ffffff', fg: '#14163a', muted: '#3a3b52', line: '#cfcfcf' };
  env.site({
    name: 'design-set-slider-multi-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-multi-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff6b6b'],
      LOW_ACCENTS: ['#ff6b6b'],
      parts,
    },
  });
})();
