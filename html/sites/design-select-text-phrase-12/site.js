// Material paper document: a design on templates/site/base.js.
(function () {
  'use strict';

  const paper = { bg: '#f4f6fc', panel: '#fff', fg: '#1d2140', muted: '#686d84', line: '#d5dbea' };

  function styleInstruction(note, text, util) {
    note.classList.add('task-note');
    let heading = note.querySelector('.ref-panel-title');
    if (!heading) {
      heading = util.el('h3', 'note-head', null, 'Instructions');
      note.prepend(heading);
    }
    heading.classList.add('note-head');
    heading.textContent = 'Instructions';
    const instruction = note.querySelector('.ref-instruction, .ref-panel-text, .ref-note-text');
    instruction.classList.add('instruction');
    const quoted = text.match(/"([^"]+)"/);
    if (quoted) {
      instruction.textContent = text.slice(0, quoted.index);
      util.el('em', 'target-phrase', instruction, quoted[1]);
      instruction.append(document.createTextNode(text.slice(quoted.index + quoted[0].length)));
    }
  }

  const parts = {
    'frame.layout': () => (_c) => {
      const { ctx } = _c;
      const W = window.innerWidth, H = window.innerHeight;
      document.body.className = 'design paper-doc' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      Object.assign(_c, { W, H, roomy: W >= 1260, tall: H >= 700, display: ctx.display });
    },
    'frame.header': () => (_c) => {
      const { util: u, display } = _c;
      const shell = u.el('div', 'shell', document.body);
      const header = u.el('header', 'head', shell);
      const icon = u.svg('svg', { class: 'app-icon', viewBox: '0 0 24 30', width: 34, height: 42 }, header);
      u.svg('path', { d: 'M2 0H15L24 9V30H2Z', fill: '#fff' }, icon);
      u.svg('path', { d: 'M15 0V9H24Z', fill: '#b7c4ee' }, icon);
      u.el('div', 'title', header, 'Text Tasks');
      u.el('div', 'spacer', header);
      u.el('div', 'task-count', header, 'Task 1 of 1');
      u.el('div', 'vsep', header);
      const paused = u.el('div', 'paused', header);
      const pi = u.svg('svg', { viewBox: '0 0 32 32', width: 32, height: 32, fill: 'none', stroke: '#fff', 'stroke-width': 2.4 }, paused);
      u.svg('circle', { cx: 16, cy: 16, r: 13 }, pi);
      u.svg('path', { d: 'M12.5 10V22M19.5 10V22', 'stroke-width': 3 }, pi);
      u.el('span', 'pause-label', paused, 'Ready');
      const body = u.el('div', 'content ref-body', shell);
      if (display === 'hidden') body.classList.add('instruction-hidden');
      Object.assign(_c, { shell, header, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      if (_c.display !== 'header') return;
      const note = _c.util.el('section', 'task-note', _c.body);
      base({ ..._c, header: note });
      styleInstruction(note, _c.ctx.instruction, _c.util);
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const endBtn = _c.endBtn, decoyBtn = _c.decoyBtn;
      _c.endBtn = (parent, cls, text) => {
        const b = endBtn(parent, cls, text);
        b.classList.add('submit');
        if (_c.placement === 'header' || _c.placement === 'icon') b.classList.add('submit-header');
        if (_c.placement === 'link') {
          b.classList.add('submit-link');
          b.addEventListener('pointerdown', (e) => { if (e.button === 0) e.preventDefault(); });
        }
        return b;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('xtra');
      };
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('head-tools');
    },
    // The paper margin takes the place of the reference's filler sidebar and footer.
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction-panel');
        styleInstruction(note, _c.ctx.instruction, _c.util);
      }
    },
    frameAlign: () => (_c, stage) => {
      stage.style.justifyContent = 'flex-start';
      stage.style.alignItems = 'flex-start';
    },
    'frame.stage': (base) => (_c) => {
      base(_c);
      _c.stage.classList.add('stage');
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        _c.body.append(note);
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-x').classList.add('note-close');
        styleInstruction(note, _c.ctx.instruction, _c.util);
      }
    },
    'frame.footer': (base) => (_c) => {
      const { body, ctx, label, util: u } = _c;
      const aside = u.el('aside', 'aside', body);
      u.el('h3', '', aside, 'Action notes');
      const ol = u.el('ol', '', aside);
      for (const text of [
        'If the layout looks incorrect, click Use default layout.',
        'Drag across the document text to make a selection.',
        'Click in the document to clear a selection.',
        ctx.finish ? 'Finish the task when you are done.' : `Click ${label} when you are done.`,
      ]) u.el('li', '', ol, text);
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        aside.append(...foot.querySelector('.ref-tools').children);
        foot.remove();
      }
      _c.aside = aside;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.aside.append(...dock.children);
        dock.remove();
      }
    },
    overlay: (base) => (ctx) => {
      // Only the initial recovery dialog belongs to the pictured frame.
      if (!ctx.initial || ctx.kind !== 'promo') return base(ctx);
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-promo', document.body);
      el.dataset.role = 'overlay';
      const pause = document.querySelector('.pause-label');
      if (pause) pause.textContent = 'Paused';
      const box = u.el('div', 'obstruction-box', el);
      u.el('div', 'err-icon', box, '!');
      const body = u.el('div', 'err-body', box);
      u.el('h3', '', body, 'Layout could not be restored');
      u.el('p', '', body, 'Your previous layout could not be restored. Some panels may be out of place.');
      u.el('p', 'small', body, 'This will not change your task data.');
      const dismiss = u.el('button', 'dismiss', body, 'Use default layout');
      dismiss.type = 'button';
      dismiss.onclick = () => { if (pause) pause.textContent = 'Ready'; ctx.dismiss('close'); };
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-select-text-phrase-12',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    langs: ['en'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { paper }, LOW_THEME: paper,
      ACCENTS: ['#3556c7'], LOW_ACCENTS: ['#3556c7'],
      parts,
    },
  });
})();
