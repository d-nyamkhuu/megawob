// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-player-04',
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
            document.body.className = `utility instruction-${ctx.display}`;
            const head = u.el('header', 'windowbar', document.body);
            u.el('span', 'app-icon', head, '▤');
            u.el('strong', 'app-title', head, 'Media Utility');
            const win = u.el('div', 'window-buttons', head);
            for (const x of ['−', '□', '×']) u.el('span', 'window-button', win, x);
            const menu = u.el('nav', 'menubar', document.body);
            for (const x of ['File', 'Edit', 'View', 'Playback', 'Tools', 'Help']) u.el('span', 'menu-item', menu, x);
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
            const tabs = u.el('nav', 'tabs', document.body);
            for (const x of ['Library', 'Player', 'Video', 'Audio', 'Subtitles', 'Devices']) {
              const t = u.el('span', 'tab' + (x === 'Library' ? ' active' : ''), tabs, x);
            }
            const main = u.el('div', 'utility-main', document.body);
            const library = u.el('aside', 'media-library', main);
            u.el('strong', 'list-heading', library, 'Media Library');
            const columns = u.el('div', 'list-columns', library);
            u.el('span', '', columns, 'Title');
            u.el('span', '', columns, 'Duration');
            const list = u.el('div', 'media-list', library);
            const names = [
              ['Coastal View', '0:58'],
              ['Forest Trail', '2:17'],
              ['Market Place', '1:26'],
              ['Mountain Lake', '3:03'],
              ['City Streets', '2:42'],
              ['Ancient Ruins', '4:18'],
              ['Desert Road', '2:05'],
              ['Winter Trees', '1:49'],
              ['Harbor Night', '3:37'],
              ['River Bend', '2:24'],
              ['Sunset Fields', '2:56'],
              ['Native Wildlife', '1:38'],
            ];
            names.forEach((v, i) => {
              const row = u.el('div', 'media-row' + (i === 3 ? ' selected' : ''), list);
              u.el('span', 'film-icon', row, '▤');
              u.el('span', '', row, v[0]);
              u.el('span', 'duration', row, v[1]);
            });
            const work = u.el('section', 'work-area', main);
            const instruction = u.el('div', 'instruction', work, ctx.instruction);
            if (ctx.display === 'hidden' || ctx.display === 'panel') instruction.hidden = true;
            if (ctx.display === 'panel') {
              const note = u.el('aside', 'instruction-panel', library, ctx.instruction);
            }
            if (ctx.display === 'toast') {
              const close = u.el('button', 'instruction-close', instruction, '×');
              close.onclick = () => {
                instruction.style.visibility = 'hidden';
              };
            }
            if (!ctx.finish && placement === 'header') submit = makeSubmit(head, 'primary header-submit', label);
            const stage = u.el('main', 'record-stage', work);
            stage.dataset.role = 'stage';
            const footer = u.el('footer', 'utility-footer', document.body);
            u.el('span', 'status-text', footer, 'Ready');
            const actions = u.el('div', 'footer-actions', footer);
            if (!ctx.finish && placement === 'note') submit = makeSubmit(actions, 'footer-submit', label);
            if (!ctx.finish && placement === 'footer') submit = makeSubmit(actions, 'footer-submit', label);
            if (collision) {
              const decoy = u.el('button', 'end-xtra', actions, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            if (!ctx.finish && placement === 'header' && collision) {
              const decoy = u.el('button', 'end-xtra header-xtra', head, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            const reset = u.el('button', 'reset', actions, 'Reset');
            reset.type = 'button';
            reset.dataset.action = 'reset';
            return { stage, submit };
          },
      },
    },
  });
})();
