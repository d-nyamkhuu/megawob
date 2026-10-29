// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-stops-03',
    styles: ['site.css', 'yosemite.css'],
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
            document.body.className = `music-app instruction-${ctx.display}`;
            const app = u.el('div', 'music-window', document.body);
            const traffic = u.el('div', 'traffic', app);
            for (const c of ['red', 'yellow', 'green']) u.el('i', c, traffic);
            const sidebar = u.el('nav', 'music-sidebar', app);
            u.el('div', 'side-heading', sidebar, 'Library');
            [
              ['♫', 'Music'],
              ['▤', 'Movies'],
              ['▣', 'TV Shows'],
              ['◉', 'Podcasts'],
              ['▱', 'Audiobooks'],
            ].forEach(([icon, label], i) => {
              const row = u.el('div', 'side-row' + (i === 0 ? ' selected' : ''), sidebar);
              u.el('span', 'side-icon', row, icon);
              u.el('span', '', row, label);
            });
            u.el('div', 'side-heading playlists', sidebar, 'Playlists');
            [
              ['≡', 'Recently Added'],
              ['≡', 'Top 25 Most Played'],
              ['≡', 'Chill Mix'],
              ['≡', 'Workout'],
              ['≡', 'Driving'],
              ['≡', 'Favorites'],
            ].forEach(([icon, label]) => {
              const row = u.el('div', 'side-row playlist', sidebar);
              u.el('span', 'side-icon', row, icon);
              u.el('span', '', row, label);
            });
            const library = u.el('section', 'library-view', app);
            const top = u.el('header', 'music-header', library);
            const title = u.el('div', 'music-title', top);
            u.el('h1', '', title, 'Music');
            u.el('div', 'music-subtitle', title, '162 songs, 10 hours 24 minutes');
            const search = u.el('div', 'searchbox', top);
            u.el('span', 'search-icon', search, '⌕');
            u.el('span', '', search, 'Search Music');
            const table = u.el('div', 'music-table', library);
            const columns = u.el('div', 'music-columns', table);
            ['Name⌃', 'Artist', 'Album', 'Genre', 'Time'].forEach((x, i) => {
              const c = u.el('div', '', columns, x);
              c.dataset.col = String(i);
            });
            const songs = [
              ['Morning Light', 'Alex Rivers', 'Sunrise', 'Alternative', '4:12'],
              ['Riverbank', 'The Similar', 'Indie Rock', 'Indie Rock', '3:48'],
              ['Golden Years', 'June Park', 'Golden', 'Pop', '4:06'],
              ['Shadow Dance', 'Luna Vale', 'Night Drive', 'Electronic', '3:55'],
              ['Letters Home', 'Mason Reed', 'Letters', 'Folk', '4:20'],
              ['Brightest Sky', 'Northbound', 'Open Road', 'Rock', '3:31'],
              ['Keep Moving', 'Avery Lane', 'Motion', 'Pop', '4:03'],
              ['North and South', 'The Pines', 'Horizon', 'Indie Folk', '5:12'],
              ['Whisper', 'Hollow Coast', 'Quiet Hours', 'Ambient', '3:49'],
              ['River Town', 'Alex Rivers', 'River Town', 'Alternative', '4:01'],
              ['All We Have', 'Mira Sol', 'Wide Awake', 'Pop', '3:54'],
              ['Stronger', 'June Park', 'Stronger', 'Pop', '4:28'],
              ['Easy Way Out', 'The Pines', 'Horizon', 'Indie Folk', '3:17'],
              ['Fields', 'Northbound', 'Open Road', 'Rock', '4:11'],
              ['Paper Planes', 'Paper Cities', 'Paper Planes', 'Indie Pop', '3:52'],
            ];
            const thumbs = ['🌄', '🌅', '🌄', '🌿', '🌅', '🌇', '🌌', '🌄', '🌃', '🌄', '🌤', '🌊', '🌲', '🌅', '◈'];
            songs.forEach((song, i) => {
              const row = u.el('div', 'song-row', table);
              const name = u.el('div', 'song-name', row);
              u.el('span', 'cover-thumb', name, thumbs[i]);
              u.el('span', '', name, song[0]);
              song.slice(1).forEach((v, j) => u.el('div', 'song-cell', row, v));
            });
            const floating = u.el('section', 'settings-window', app);
            const bar = u.el('div', 'settings-titlebar', floating);
            const lights = u.el('div', 'traffic small', bar);
            for (const c of ['red', 'yellow', 'green']) u.el('i', c, lights);
            u.el('div', 'window-title', bar, 'Audio Settings');
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
            if (!ctx.finish && placement === 'header') submit = makeSubmit(bar, 'primary header-submit', label);
            const main = u.el('div', 'settings-body', floating);
            const tabs = u.el('nav', 'settings-tabs', main);
            [
              ['◖', 'Playback'],
              ['☷', 'Equalizer'],
              ['▣', 'Output'],
              ['⚙', 'Advanced'],
            ].forEach(([icon, name], i) => {
              const t = u.el('div', 'settings-tab' + (i === 0 ? ' active' : ''), tabs);
              u.el('span', 'tab-icon', t, icon);
              u.el('span', '', t, name);
            });
            const work = u.el('section', 'settings-work', main);
            const task = u.el('div', 'task-heading', work);
            u.el('h2', '', task, 'Playback Settings');
            const instruction = u.el('div', 'instruction', task, ctx.instruction);
            if (ctx.display === 'hidden') instruction.hidden = true;
            if (ctx.display === 'toast') {
              const close = u.el('button', 'instruction-close', instruction, 'Close');
              close.onclick = () => {
                instruction.hidden = true;
              };
            }
            if (ctx.display === 'panel') instruction.classList.add('panel-note');
            if (ctx.display === 'toast') instruction.classList.add('toast-note');
            const stage = u.el('main', 'record-stage', work);
            stage.dataset.role = 'stage';
            const help = u.el('aside', 'help-pane', main);
            u.el('h3', '', help, 'About Audio Settings');
            u.el('p', 'help-copy', help, 'Adjust playback settings to control the sound output for your music.');
            u.el('hr', '', help);
            u.el('h3', 'tips-title', help, 'Tips');
            const tips = u.el('ul', '', help);
            [
              'Higher volume may affect audio quality.',
              'Use balance to adjust the left and right channels.',
              'Bass boost can enhance low-frequency sound.',
            ].forEach((x) => u.el('li', '', tips, x));
            if (!ctx.finish && placement === 'footer') submit = makeSubmit(work, 'primary work-submit', label);
            if (!ctx.finish && placement === 'note') {
              submit = u.el('a', 'header-submit-link', bar, label);
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
              const parent = placement === 'header' ? work : bar;
              const decoy = u.el('button', 'end-xtra', parent, collision);
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
