/* Mac OS 9 Platinum frame, designed on the shared site/base sections. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'mac-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Feedback', cookie: 'Privacy', toast: 'Notice', promo: 'Information', banner: 'Service notice'}[ctx.kind];
    u.el('div', 'dlg-title', el, title);
    const x = u.el('button', 'survey-x', el, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'dlg-body', el);
    if (survey) {
      u.el('p', 'survey-intro', body, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', body, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', body, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', body);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown); options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) { const b = u.el('button', '', options, label); b.type = 'button'; b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }; }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', body, {cookie: 'This application can remember your display preferences.', toast: 'The parameter sheet is ready for editing.', promo: 'Discover more adjustable instruments.', banner: 'The adjuster is available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'mac-btn default survey-close', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }

  // The shared instruction sections own display modes; this sheet only supplies their typography.
  function sheetInstruction(node) {
    node.classList.add('instruction');
    const sentences = node.textContent.match(/^(.+?\.)\s+(.+)$/);
    if (sentences) {
      node.textContent = sentences[1];
      node.appendChild(document.createElement('br'));
      node.appendChild(document.createTextNode(sentences[2]));
    }
  }

  const platinum = { bg: '#7885ae', panel: '#d9dce3', fg: '#08090c', muted: '#08090c', line: '#8c909c' };
  env.site({
    name: 'design-set-slider-log-04',
    template: 'site/base',
    design: {
      THEMES: { platinum },
      LOW_THEME: platinum,
      ACCENTS: ['#555b6a'],
      LOW_ACCENTS: ['#555b6a'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = `mac instruction-${_c.display}`;
        },
        'frame.header': () => (_c) => {
          const u = _c.util;
          // Menu bar
          const bar = u.el('header', 'menubar', document.body);
          const apple = u.el('span', 'apple', bar);
          const svg = env.util.svg('svg', {viewBox: '0 0 24 28', class: 'apple-svg', 'aria-hidden': 'true'}, apple);
          env.util.svg('path', {d: 'M12 8c-2-1.6-6-1-7 3-1 4 2 11 4.500 11 1.200 0 1.800-.8 2.500-.8s1.300.8 2.500.8c2.500 0 4.500-4 4.500-5-2.500-1-3-5 0-6.500-1.500-2-4-1.700-5.500-.7zM13 7c0-2 1-3.500 3-4 0 2-1 3.500-3 4z', fill: '#455eb1', stroke: '#18223e'}, svg);
          for (const m of ['File', 'Edit', 'View', 'Tools', 'Window', 'Help']) u.el('span', 'menu', bar, m);
          u.el('span', 'clock', bar, '3:27 PM');
          const icon = u.el('span', 'clock-icon', bar);
          const clockSvg = env.util.svg('svg', {viewBox:'0 0 20 23', 'aria-hidden':'true'}, icon);
          env.util.svg('path', {d:'M5 2h8v3h4v16H2V5h3z', fill:'#aebbdc',stroke:'#25334a'}, clockSvg);
          env.util.svg('path', {d:'M8 7h4l2 3-3 2 2 3-3 4-3-2 2-3-3-3zM9 8l2 2m-4 6 5 1',fill:'#7589c4',stroke:'#26365d','stroke-width':'.8'}, clockSvg);
          // Window
          const win = u.el('div', 'mac-window', document.body);
          const tb = u.el('div', 'titlebar', win);
          u.el('span', 'tb-box tb-l1', tb);
          u.el('span', 'tb-box tb-l2', tb);
          u.el('span', 'tb-stripes', tb);
          u.el('span', 'tb-title', tb, 'Parameter Adjuster');
          u.el('span', 'tb-stripes', tb);
          u.el('span', 'tb-box tb-r1', tb, '–');
          u.el('span', 'tb-box tb-r2', tb, '×');
          const index = u.el('nav', 'side-index', document.body);
          for (let i = 1; i <= 20; i++) u.el('div', 'idx' + (i === 1 ? ' sel' : ''), index, String(i));
          u.el('div', 'status-strip', document.body);
          u.el('div', 'grow-box', document.body);
          _c.header = u.el('header', 'ref-task', document.body);
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.header.querySelector('.ref-instruction');
          if (instruction) {
            const note = _c.util.el('section', 'task-note', _c.header);
            note.appendChild(instruction);
            sheetInstruction(instruction);
          }
        },
        // The numbered index replaces the reference frame's filler sidebar.
        'frame.body': () => (_c) => { _c.body = document.body; },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-note');
            panel.querySelector('.ref-panel-title').classList.add('note-caption');
            sheetInstruction(panel.querySelector('.ref-panel-text'));
          }
        },
        'frame.stage': () => (_c) => {
          const u = _c.util;
          // Working sheet
          const stage = u.el('main', 'record-stage', document.body); stage.dataset.role = 'stage';
          const scale = u.el('div', 'scale-note', document.body, 'Scale:  logarithmic (×10 per major tick)');
          const info = u.el('section', 'info-box', document.body);
          u.el('div', 'info-heading', info, 'Parameter information');
          u.el('div', 'info-help', info, 'Drag the handle to adjust.');
          u.el('div', 'info-current', info);
          u.el('div', 'info-scale', info, 'Scale: logarithmic');
          _c.stage = stage;
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('task-note');
            _c.util.el('div', 'note-caption', note, 'Parameter Adjuster — Notice');
            sheetInstruction(note.querySelector('.ref-note-text'));
            note.querySelector('.ref-note-x').classList.add('instruction-close', 'mac-btn');
          }
        },
        'frame.end': (base) => (_c) => {
          // Style the controls created and wired by the shared tools/footer/floating sections.
          if (_c.submit) {
            _c.submit.classList.add('mac-btn', 'default', 'submit-btn');
            if (_c.placement === 'header' || _c.placement === 'icon') _c.submit.classList.add('end-toolbar');
            if (_c.placement === 'link') _c.submit.classList.add('end-link');
          }
          for (const decoy of document.querySelectorAll('.ref-xtra')) decoy.classList.add('mac-btn');
          return base(_c);
        },
        // Retain the site's Platinum dialogs, including its custom feedback survey.
        overlay: () => drawOverlay,
      },
    },
  });
})();
