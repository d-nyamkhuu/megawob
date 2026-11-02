// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-02',
    styles: ['site.css', 'notebook.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'developer',
        'title': 'Image Annotation',
        'subtitle': '●  Crop Task',
        'aside': 'Crop Tools',
        'leftTabs': ['Task', 'Hints', 'Shortcuts', 'Examples', 'Settings'],
        'foot': 'Image size: 800 × 450     |     Format: PNG     |     Zoom: 100%',
        'accent': '#70f270',
        'bg': '#0c1115',
        'surface': '#171e26',
        'font': 'Courier New, monospace',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, head, u } = _c;
            if (C.leftTabs) {
              const rail = u.el('nav', 'notebook-tabs', body);
              for (const text of C.leftTabs) {
                const bt = u.el('button', 'tab', rail, text);
                bt.type = 'button';
                if (text === 'Task') bt.classList.add('active');
                bt.onclick = () => {
                  rail.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                  bt.classList.add('active');
                };
              }
            }
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
            // Goal text belongs only in the frame's instruction element.
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, C.aside);
            u.el('p', '', _c.aside, 'Drag the handles to adjust the crop area.');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, shell, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'aside' : er.pick(['header', 'footer']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            shell.dataset.endPlacement = ctx.finish ? 'finish' : placement;
            shell.dataset.instructionDisplay = ctx.display;
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'header' ? head : placement === 'footer' ? footer : _c.aside;
              _c.submit = u.el(
                'button',
                'submit' + (placement === 'aside' ? '' : ' notebook-end-' + placement),
                parent,
                endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (cr.bool(0.3)) {
              const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = cr.pick(options),
                  decoy = u.el('button', 'notebook-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { cr, endLabel, endLabels, er, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
        'frame.30': (base, S) =>
          function (_c) {
            const { instruction, note, stage } = _c;
            if (!note.hidden) {
              const textRange = document.createRange();
              textRange.selectNodeContents(instruction);
              let font = parseFloat(getComputedStyle(instruction).fontSize);
              const fits = () => {
                const box = instruction.getBoundingClientRect(),
                  text = textRange.getBoundingClientRect(),
                  style = getComputedStyle(instruction);
                return (
                  text.top >= box.top + parseFloat(style.paddingTop) - 1 &&
                  text.bottom <= box.bottom - parseFloat(style.paddingBottom) + 1
                );
              };
              while (font > 12 && !fits()) {
                font -= 0.5;
                instruction.style.setProperty('font-size', font + 'px', 'important');
              }
              textRange.detach();
            }
            return { stage, submit: _c.submit };
          },
      },
    },
  });
})();
