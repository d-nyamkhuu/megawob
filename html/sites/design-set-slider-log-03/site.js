/* Atari ST GEM desktop utility: "Image Adjuster" window on a green desktop. */
(function () {
  'use strict';
  function trash(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 30 34', class:'trash-icon', 'aria-hidden':'true'}, parent);
    u.svg('rect',{x:3,y:3,width:24,height:4,fill:'#fff',stroke:'#000','stroke-width':2},svg);
    u.svg('rect',{x:11,y:0.5,width:8,height:3,fill:'#fff',stroke:'#000','stroke-width':1.5},svg);
    u.svg('path',{d:'M5 8h20l-2 24H7Z',fill:'#ddd',stroke:'#000','stroke-width':2},svg);
    u.svg('path',{d:'M10 11v18M15 11v18M20 11v18',stroke:'#000','stroke-width':1.5},svg);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'gem-dialog overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat:'Survey',cookie:'Privacy',toast:'Notice',promo:'Information',banner:'System notice'}[ctx.kind];
    const bar = u.el('div', 'gem-dialog-title', el);
    const x = u.el('button', 'survey-x', bar, ''); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('span', '', bar, title);
    const body = u.el('div', 'gem-dialog-body', el);
    if (survey) {
      u.el('p', 'survey-intro', body, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', body, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy','Somewhat easy','Neither easy nor difficult','Somewhat difficult','Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', body, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', body);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option...'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown); options.hidden = true;
      for (const label of ['Finding records','Image quality','Help and guidance']) { const b = u.el('button', '', options, label); b.type = 'button'; b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }; }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', body, {cookie:'This desk accessory can remember your display preferences.',toast:'The image is ready for editing.',promo:'Discover more desk accessories.',banner:'The utility is available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'OK'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  // Keep the GEM furniture; shared sections own instructions and control behavior.
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = `gem instruction-${_c.display}`;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const menu = u.el('header', 'menubar', document.body);
      const logo = u.el('span', 'mi apple', menu);
      const icon = u.svg('svg', {viewBox:'0 0 18 20', 'aria-hidden':'true'}, logo);
      u.svg('path', {d:'M3 4h3V1h7v3h3v15H2V5h1M6 5v7h7V5M5 15v2h8v-2', fill:'#000'}, icon);
      for (const m of ['Desk','File','Edit','Options']) u.el('span', 'mi', menu, m);
      u.el('span', 'clock', menu, 'Mon   Mar 3 1986   10:24');
      const win = u.el('div', 'window', document.body);
      const titlebar = u.el('div', 'titlebar', win);
      u.el('span', 'gadget close', titlebar);
      u.el('span', 'stripes', titlebar);
      u.el('span', 'wtitle', titlebar, 'Image Adjuster');
      u.el('span', 'stripes', titlebar);
      u.el('span', 'gadget full', titlebar);
      const windowBody = u.el('div', 'wbody', win);
      const header = u.el('div', 'task', windowBody);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { header, titlebar, windowBody });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.className = 'instruction';
        instruction.style.fontSize = _c.ctx.instruction.length > 80 ? '2.75vw' : '3.65vw';
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titlebar;
      base(_c);
      _c.header = header;
      _c.headerTools.className = 'gem-title-tools';
      if (_c.submit) _c.submit.classList.add('primary', 'titlebar-end');
    },
    'frame.body': () => (_c) => {
      const { util: u, windowBody } = _c;
      u.el('hr', 'rule', windowBody);
      const body = u.el('div', 'panels ref-body', windowBody);
      const preview = u.el('section', 'preview', body);
      u.el('div', 'panel-title', preview, 'Preview');
      const pic = u.el('div', 'pic', preview);
      u.el('div', 'pic-img', pic);
      const setting = u.el('section', 'setting', body);
      Object.assign(_c, { body, preview, setting });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.preview });
      const panel = _c.preview.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'instruction-card instruction-card-panel';
        panel.querySelector('.ref-panel-title').className = 'instruction-caption';
        panel.querySelector('.ref-panel-text').className = 'instruction';
      }
    },
    'frame.stage': () => (_c) => {
      const { util: u, setting } = _c;
      const stage = u.el('main', 'record-stage', setting);
      stage.dataset.role = 'stage';
      const note = u.el('div', 'note', setting);
      u.el('div', '', note, 'Scale is logarithmic (each step ×10).');
      u.el('div', 'note-help', note, 'Drag the handle to set the value.');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.className = 'instruction-card instruction-card-toast';
        const caption = _c.util.el('div', 'instruction-caption', null, 'Notice');
        note.prepend(caption);
        note.querySelector('.ref-note-text').className = 'instruction';
        const close = note.querySelector('.ref-note-x');
        close.className = 'instruction-close';
        close.textContent = _c.closeLabel;
        _c.preview.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      const actions = foot || _c.util.el('div', '', _c.windowBody);
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        foot.querySelector('.ref-tools').className = 'gem-action-tools';
        _c.windowBody.append(foot);
      }
      actions.className = 'actions';
      if (_c.placement === 'link') actions.classList.add('actions-link');
      if (_c.submit && actions.contains(_c.submit)) {
        _c.submit.classList.add(_c.placement === 'link' ? 'end-link' : 'primary');
      }
      _c.actions = actions;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.submit.className = 'primary';
        _c.actions.append(_c.submit);
        dock.remove();
      }
      const tr = _c.util.el('div', 'trash', document.body);
      trash(tr);
      _c.util.el('span', '', tr, 'TRASH');
    },
    // The striped GEM dialogs are part of this design's visual language.
    overlay: () => drawOverlay,
  };

  env.site({
    name: 'design-set-slider-log-03',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      LANGS: ['en'],
      THEMES: { gem: { bg: '#e9e9e9', panel: '#f2f2f2', fg: '#000', muted: '#000', line: '#000' } },
      LOW_THEME: { bg: '#e9e9e9', panel: '#f2f2f2', fg: '#000', muted: '#000', line: '#000' },
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
