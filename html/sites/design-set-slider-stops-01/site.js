// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-stops-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        frame: (base, S) =>
          function (ctx) {
            const u = ctx.util;
            const endRng = ctx.rng.fork('chrome/end');
            const placement = endRng.pick(['footer', 'footer', 'header', 'note']);
            const endLabels = ctx.content && ctx.content.END_LABELS;
            const endLabel = endRng.pick(
              Array.isArray(endLabels) && endLabels.length
                ? endLabels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
            );
            const label =
              typeof endLabel === 'string'
                ? endLabel
                : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
            const collideRng = ctx.rng.fork('chrome/collide');
            const collisionPool = (
              Array.isArray(endLabels) && endLabels.length
                ? endLabels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
            )
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
            const collision = collideRng.bool(0.3) && collisionPool.length ? collideRng.pick(collisionPool) : null;
            document.body.className = `photos-app instruction-${ctx.display}`;
            const head = u.el('header', 'photos-titlebar', document.body);
            u.el('span', 'photos-appicon', head, '▣');
            u.el('span', 'photos-title', head, 'Photos');
            const windowBtns = u.el('div', 'window-controls', head);
            ['−', '□', '×'].forEach((x) => u.el('span', 'window-control', windowBtns, x));
            let submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = () => ctx.submit();
              return b;
            };
            if (!ctx.finish && placement === 'header') submit = makeSubmit(head, 'primary header-submit', label);
            const main = u.el('div', 'photos-main', document.body);
            const stage = u.el('main', 'record-stage', main);
            stage.dataset.role = 'stage';
            const inspector = u.el('aside', 'adjustments', main);
            u.el('h2', 'adjustments-title', inspector, '☷　Adjustments');
            const sections = [
              [
                '☼',
                'Light',
                [
                  ['Brightness', '0'],
                  ['Contrast', '0'],
                ],
              ],
              [
                '◉',
                'Color',
                [
                  ['Saturation', '+1'],
                  ['Temperature', 'Neutral'],
                ],
              ],
              ['△', 'Details', [['Sharpness', '0']]],
              ['⌑', 'Size', [['Size', 'M']]],
            ];
            sections.forEach(([icon, title, rows]) => {
              const box = u.el('section', 'adjustment-card', inspector);
              u.el('h3', '', box, `${icon}　${title}`);
              u.el('span', 'chevron', box, '⌃');
              rows.forEach(([name, value]) => {
                const row = u.el('div', 'adjustment-row', box);
                u.el('span', '', row, name);
                u.el('span', 'adjustment-value', row, value);
              });
            });
            if (ctx.display === 'header') {
              const note = u.el('div', 'task-note header-note', head, ctx.instruction);
            }
            if (ctx.display === 'panel') {
              const note = u.el('div', 'task-note panel-note', inspector, ctx.instruction);
            }
            if (ctx.display === 'toast') {
              const note = u.el('div', 'task-note toast-note', document.body, ctx.instruction);
            }
            const footer = u.el('footer', 'photos-dock', document.body);
            const tabs = [
              ['▣', 'Photos'],
              ['▢', 'Albums'],
              ['✧', 'For you'],
              ['♧', 'Sharing'],
              ['•••', 'More'],
            ];
            tabs.forEach(([icon, name], i) => {
              const item = u.el('div', 'dock-item' + (i === 0 ? ' selected' : ''), footer);
              u.el('span', 'dock-icon', item, icon);
              u.el('span', '', item, name);
            });
            if (!ctx.finish && placement === 'footer') submit = makeSubmit(footer, 'primary', label);
            if (!ctx.finish && placement === 'note') {
              submit = makeSubmit(footer, 'primary', label);
            }
            if (collision) {
              const decoy = u.el('button', 'end-xtra', head, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            const reset = u.el('button', 'reset', head, 'Reset');
            reset.type = 'button';
            reset.dataset.action = 'reset';
            return { stage, submit };
          },
      },
    },
  });
})();
