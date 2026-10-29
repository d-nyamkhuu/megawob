// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-player-01',
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
            document.body.className = `library instruction-${ctx.display}`;
            const head = u.el('header', 'library-header', document.body);
            u.el('div', 'leaf-mark', head, '❧');
            const brand = u.el('div', 'brand', head);
            u.el('h1', '', brand, 'Willow Creek Media');
            const nav = u.el('nav', 'top-nav', head);
            for (const [name, active] of [
              ['Library', true],
              ['Collections', false],
              ['Projects', false],
              ['Analytics', false],
            ]) {
              const a = u.el('span', active ? 'active' : '', nav, name);
            }
            const search = u.el('div', 'search-box', head, '⌕  Search media');
            u.el('div', 'bell', head, '♧');
            u.el('div', 'avatar', head, 'JD');
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
            const main = u.el('div', 'library-main', document.body);
            const list = u.el('aside', 'video-list', main);
            const listHead = u.el('div', 'list-head', list);
            u.el('b', '', listHead, 'Videos');
            u.el('span', 'plus', listHead, '＋');
            const items = [
              ['Alpine Lake', '0:48', 'Jun 14, 2023'],
              ['Forest Trail', '1:12', 'Jun 12, 2023'],
              ['Coastal Drive', '2:17', 'Jun 10, 2023'],
              ['Morning Market', '1:03', 'Jun 8, 2023'],
              ['City Lights', '2:28', 'Jun 5, 2023'],
              ['Desert Road', '1:56', 'Jun 2, 2023'],
              ['Wildlife Close-Up', '1:20', 'May 28, 2023'],
              ['Autumn Colors', '2:11', 'May 25, 2023'],
            ];
            for (const [name, dur, date] of items) {
              const row = u.el('div', name === 'Alpine Lake' ? 'video-item selected' : 'video-item', list);
              u.el('img', 'video-thumb', row);
              const info = u.el('div', '', row);
              u.el('div', 'video-name', info, name);
              u.el('small', '', info, dur);
              u.el('small', '', info, date);
            }
            const stage = u.el('main', 'record-stage', main);
            stage.dataset.role = 'stage';
            const inspector = u.el('aside', 'inspector', main);
            u.el('h2', '', inspector, 'Details');
            u.el('img', 'inspector-image', inspector);
            u.el('h3', '', inspector, 'Alpine Lake');
            u.el('p', 'meta', inspector, 'Jun 14, 2023　|　0:48　|　3840 × 2160　·　318 MB　|　MP4');
            u.el('hr', '', inspector);
            u.el('b', '', inspector, 'Description');
            u.el(
              'p',
              'description',
              inspector,
              'A peaceful morning at an alpine lake, with clear reflections and snow-capped peaks in the distance.',
            );
            u.el('hr', '', inspector);
            u.el('b', '', inspector, 'Tags');
            u.el('p', 'tags', inspector, 'nature　 mountains　 lake　 outdoors　 ＋');
            u.el('hr', '', inspector);
            u.el('b', '', inspector, 'Location');
            u.el('p', 'description', inspector, '⌖　 Evergreen Valley, CO');
            u.el('hr', '', inspector);
            u.el('b', '', inspector, 'Camera');
            u.el('p', 'description', inspector, 'Lumix S5 II　·　3840 × 2160　|　30 fps　|　Rec. 709');
            const instruction = u.el(
              'div',
              'instruction ' + (ctx.display === 'panel' ? 'panel-note' : ctx.display === 'header' ? 'header-note' : ''),
              ctx.display === 'panel'
                ? inspector
                : ctx.display === 'header' || ctx.display === 'toast'
                  ? head
                  : document.body,
              ctx.instruction,
            );
            if (ctx.display === 'hidden') instruction.hidden = true;
            if (ctx.display === 'panel') inspector.insertBefore(instruction, inspector.children[1]);
            if (ctx.display === 'toast') instruction.classList.add('toast-note');
            const footer = u.el('footer', 'library-footer', document.body);
            const actions = u.el('div', 'footer-actions', footer);
            if (!ctx.finish && placement === 'note') submit = makeSubmit(actions, 'primary', label);
            if (!ctx.finish && placement === 'footer') submit = makeSubmit(actions, 'primary', label);
            if (collision) {
              const decoy = u.el('button', 'end-xtra', head, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            return { stage, submit };
          },
      },
    },
  });
})();
