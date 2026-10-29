(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-arithmetic-08' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'walnut-studio instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      const mark = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36', class: 'title-icon' }, brand);
      u.svg(
        'rect',
        { x: 2, y: 2, width: 32, height: 32, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        mark,
      );
      const sigma = u.svg(
        'text',
        { x: 18, y: 27, 'text-anchor': 'middle', 'font-size': 27, 'font-family': 'Georgia', fill: 'currentColor' },
        mark,
      );
      sigma.textContent = 'Σ';
      u.el('span', 'brand-name', brand, 'Math Workspace');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const button = u.el('div', 'window-button ' + kind, wc);
        if (kind === 'min') button.textContent = '−';
        else if (kind === 'max') button.textContent = '□';
        else button.textContent = '×';
      }
      const center = u.el('div', 'center', app),
        bench = u.el('section', 'bench', center),
        heading = u.el('div', 'work-heading', bench);
      u.el('h1', '', heading, 'Arithmetic Practice');
      const divider = u.el('div', 'ornament', heading, '❧');
      const brief = u.el('div', 'brief', bench, ctx.instruction);
      const stage = u.el('section', 'stage', bench);
      const aside = u.el('aside', 'aside', center);
      const details = u.el('section', 'inspector-panel details', aside);
      u.el('div', 'panel-heading', details, 'Task Details');
      const rows = [
        ['Task', 'Arithmetic Calculation'],
        ['Difficulty', 'Basic'],
        ['Input', 'Keyboard or Mouse'],
        ['Answer Format', 'Whole number'],
      ];
      const table = u.el('div', 'detail-rows', details);
      rows.forEach((row) => {
        const r = u.el('div', 'detail-row', table);
        u.el('span', '', r, row[0]);
        u.el('strong', '', r, row[1]);
      });
      const tools = u.el('section', 'inspector-panel tool-panel', aside);
      u.el('div', 'panel-heading', tools, 'Tools');
      const toolList = u.el('div', 'tool-list', tools);
      [
        ['▦', 'Calculator'],
        ['◩', 'Clear'],
        ['⟲', 'Reset'],
      ].forEach((item) => {
        const b = u.el('button', 'tool-button', toolList);
        b.type = 'button';
        u.el('span', 'tool-icon', b, item[0]);
        u.el('span', '', b, item[1]);
      });
      const notes = u.el('section', 'inspector-panel notes-panel', aside);
      u.el('div', 'panel-heading', notes, 'Notes');
      const paper = u.el('div', 'notes-paper', notes);
      for (let i = 0; i < 5; i++) u.el('i', '', paper);
      const mode = ctx.display || 'header';
      if (mode === 'panel') {
        document.body.classList.add('instruction-panel');
        bench.removeChild(brief);
        notes.remove();
        const card = u.el('section', 'inspector-panel instruction-card', aside);
        u.el('div', 'panel-heading', card, 'Exercise');
        u.el('div', 'instruction-copy', card, ctx.instruction);
      } else if (mode === 'hidden') {
        document.body.classList.add('instruction-hidden');
        bench.removeChild(brief);
      } else if (mode === 'toast') {
        brief.classList.add('toast-note');
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            "I'm done",
          ];
        const original = er.bool(0.5),
          label = original ? 'Submit' : er.pick(labels),
          placement = original ? 'footer' : er.pick(['header', 'link']);
        const collide = cr.bool(0.3)
          ? cr.pick(labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase()))
          : null;
        const decoy = (parent, text) => {
          const b = u.el('button', 'end-xtra', parent, String(text));
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: String(text), collide: true }));
        };
        if (collide) decoy(placement === 'header' ? footer : top, collide);
        if (placement === 'header') {
          submit = u.el('button', 'end-control header-end', top, label);
          submit.type = 'button';
        } else if (placement === 'link') {
          submit = u.el('button', 'end-control footer-link', footer, label);
          submit.type = 'button';
        } else {
          submit = u.el('button', 'end-control', footer, label);
          submit.type = 'button';
        }
        submit.addEventListener('click', ctx.submit);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
