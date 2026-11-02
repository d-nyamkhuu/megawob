// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-media-04',
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
            document.body.className = `chronicle instruction-${ctx.display}`;
            const head = u.el('header', 'paper-header', document.body);
            u.el('h1', 'masthead', head, 'The Daily Chronicle');
            const topnav = u.el('nav', 'top-nav', head);
            ['NEWS', 'BUSINESS', 'SPORTS', 'ENTERTAINMENT', 'LIFE'].forEach((x) => u.el('span', '', topnav, x));
            const search = u.el('div', 'search-box', head);
            u.el('span', '', search, 'Search videos, topics, and more...');
            u.el('b', 'search-icon', search, '⌕');
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
            const rail = u.el('nav', 'left-rail', main);
            const items = [
              ['⌂', 'Home'],
              ['▤', 'News'],
              ['▥', 'Business'],
              ['◉', 'Sports'],
              ['▶', 'Entertainment'],
              ['▣', 'Life'],
              ['★', 'Most Popular'],
              ['◷', 'Latest Updates'],
              ['◆', 'Video Library'],
              ['♟', 'Community'],
              ['⚙', 'Settings'],
            ];
            items.forEach(([icon, name], i) => {
              const row = u.el('div', `rail-item${i === 4 ? ' active' : ''}`, rail);
              u.el('b', 'rail-icon', row, icon);
              u.el('span', '', row, name);
            });
            const task = u.el('aside', 'catalog-task', main);
            const instruction = u.el('div', 'instruction', task, ctx.instruction);
            if (ctx.display === 'hidden') instruction.hidden = true;
            if (ctx.display === 'header') {
              instruction.classList.add('instruction-header');
              head.append(instruction);
            }
            if (ctx.display === 'panel') {
              instruction.classList.add('instruction-panel');
              rail.append(instruction);
            }
            if (ctx.display === 'toast') {
              instruction.classList.add('instruction-toast');
              document.body.append(instruction);
            }
            if (ctx.display === 'toast') {
              const close = u.el('button', 'instruction-close', instruction, 'Close');
              close.onclick = () => {
                instruction.style.visibility = 'hidden';
              };
            }
            const stage = u.el('main', 'record-stage', main);
            stage.dataset.role = 'stage';
            u.el('h2', 'video-headline', stage, 'City Park Renovation Nears Completion');
            const side = u.el('aside', 'related-panel', main);
            u.el('h2', 'related-heading', side, 'Related Videos');
            const related = [
              ['park', 'A Closer Look at the New Park', '124,930 views', '3:12'],
              ['garden', 'Green Spaces Make Stronger Cities', '98,414 views', '2:41'],
              ['walk', 'Voices from the Community', '67,522 views', '3:05'],
              ['playground', 'New Playground Brings Families Together', '91,336 views', '2:28'],
              ['sunset', 'City’s Next Chapter', '110,982 views', '3:18'],
            ];
            related.forEach(([kind, title, views, time]) => {
              const row = u.el('div', 'related-row', side);
              const thumb = u.el('div', `related-thumb ${kind}`, row);
              u.el('b', 'duration', thumb, time);
              const copy = u.el('div', 'related-copy', row);
              u.el('strong', '', copy, title);
              u.el('span', '', copy, views);
            });
            const stats = u.el('section', 'video-stats', side);
            u.el('h2', '', stats, 'Video Stats');
            u.el('strong', '', stats, '110,982');
            u.el('span', '', stats, ' views');
            u.el('p', '', stats, 'Apr 14, 2011');
            const footer = u.el('footer', 'library-footer', document.body);
            const note = u.el(
              'div',
              'footer-note',
              footer,
              'City Park Renovation Ne with reportage and video from the Daily Chronicle.',
            );
            if (!ctx.finish && placement === 'note') {
              submit = u.el('a', 'footer-submit-link', head, label);
              submit.href = '#';
              submit.dataset.role = 'submit';
              submit.setAttribute('aria-label', label);
              submit.title = label;
              submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const actions = u.el('div', 'footer-actions', head);
            if (!ctx.finish && placement === 'footer') submit = makeSubmit(head, 'primary header-submit', label);
            if (collision) {
              const parent = head;
              const decoy = u.el('button', 'end-xtra', parent, collision);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
            }
            if (ctx.display === 'header') head.append(instruction);
            return { stage, submit };
          },
      },
    },
  });
})();
