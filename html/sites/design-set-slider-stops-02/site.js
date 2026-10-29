// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-stops-02',
    styles: ['site.css', 'studio.css', 'studio-fix.css'],
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
            document.body.className = `studio instruction-${ctx.display}`;
            const head = u.el('header', 'studio-header', document.body);
            const brand = u.el('div', 'studio-brand', head, 'STUDIO');
            const tabs = u.el('nav', 'studio-tabs', head);
            for (const [name, active] of [
              ['LIBRARY', true],
              ['EDIT', false],
              ['PRESETS', false],
              ['EXPORT', false],
            ]) {
              const b = u.el('button', active ? 'active' : '', tabs, name);
              b.type = 'button';
              b.setAttribute('aria-disabled', 'true');
            }
            const tools = u.el('div', 'studio-tools', head);
            u.el('span', 'search-icon', tools);
            u.el('span', 'bell-icon', tools);
            u.el('span', 'avatar', tools, 'JD');
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
            const main = u.el('div', 'studio-main', document.body);
            const sidebar = u.el('aside', 'photo-sidebar', main);
            const listHead = u.el('div', 'photo-heading', sidebar);
            u.el('b', '', listHead, 'PHOTOS');
            u.el('span', '', listHead, '24');
            const list = u.el('div', 'photo-list', sidebar);
            const entries = [
              ['Alpine Lake', 'Mar 14, 2025', 'lake'],
              ['Forest Trail', 'Mar 12, 2025', 'forest'],
              ['Coastal Cliffs', 'Mar 10, 2025', 'coast'],
              ['Desert Ridge', 'Mar 08, 2025', 'desert'],
              ['City Skyline', 'Mar 05, 2025', 'city'],
              ['Mountain Cabin', 'Mar 01, 2025', 'cabin'],
              ['Sunset Bay', 'Feb 26, 2025', 'sunset'],
              ['Misty Valley', 'Feb 22, 2025', 'mist'],
            ];
            for (const [title, date, kind] of entries) {
              const row = u.el('div', `photo-row ${title === 'Alpine Lake' ? 'selected' : ''}`, list);
              u.el('span', `photo-thumb ${kind}`, row);
              const meta = u.el('span', 'photo-meta', row);
              u.el('b', '', meta, title);
              u.el('small', '', meta, date);
            }
            const work = u.el('div', 'studio-work', main);
            const top = u.el('section', 'record-preview', work);
            u.el('div', 'hero-image', top);
            const details = u.el('div', 'record-details', top);
            u.el('h2', 'record-title', details, 'ALPINE LAKE');
            u.el('div', 'record-meta', details, 'Mar 14, 2025　 |　 4032 × 2268　 |　 7.6 MB　 |　 JPG');
            u.el(
              'p',
              'record-description',
              details,
              'A serene alpine lake with snow-capped peaks and evergreen forests reflected in calm water.',
            );
            const stage = u.el('main', 'adjust-stage', work);
            stage.dataset.role = 'stage';
            const adjustTitle = u.el('div', 'adjust-title', stage);
            u.el('span', '', adjustTitle, 'ADJUST');
            u.el('span', '', adjustTitle, 'IMAGE');
            const task = u.el('aside', 'task-note', document.body);
            const instruction = u.el('div', 'instruction', task, ctx.instruction);
            if (ctx.display === 'hidden' || ctx.display === 'header') task.hidden = true;
            if (ctx.display === 'toast') {
              work.append(task);
              const close = u.el('button', 'instruction-close', instruction, '×');
              close.setAttribute('aria-label', 'Close instruction');
              close.onclick = () => {
                instruction.style.visibility = 'hidden';
              };
            }
            if (ctx.display === 'header') {
              const note = u.el('div', 'header-instruction', head, ctx.instruction);
              note.className = 'header-instruction';
            }
            const actions = u.el('div', 'studio-actions', head);
            if (!ctx.finish && placement === 'footer') submit = makeSubmit(actions, 'primary', label);
            if (!ctx.finish && placement === 'note') {
              submit = u.el('a', 'footer-submit-link', actions, label);
              submit.href = '#';
              submit.dataset.role = 'submit';
              submit.setAttribute('aria-label', label);
              submit.title = label;
              submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (collision) {
              const parent = placement === 'header' ? actions : head;
              const decoy = u.el('button', 'end-xtra', parent, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            if (placement !== 'header') {
              const b = u.el('button', 'reset', actions, 'Reset');
              b.type = 'button';
              b.dataset.action = 'reset';
            }
            return { stage, submit };
          },
      },
    },
  });
})();
