// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-media-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        'frame.10': (base, S) =>
          function (_c) {
            const { ctx, u } = _c;
            document.body.className = `wmp instruction-${ctx.display}`;
            const frame = u.el('div', 'wmp-frame', document.body);
            const head = u.el('header', 'wmp-titlebar', frame);
            u.el('span', 'wmp-appicon', head, '▶');
            u.el('span', 'wmp-title', head, 'Windows Media Player');
            const win = u.el('div', 'window-controls', head);
            for (const [c, t] of [
              ['min', '—'],
              ['max', '□'],
              ['close', '×'],
            ])
              u.el('span', c, win, t);
            Object.assign(_c, { frame, head, win });
          },
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.13': () => () => {},
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.21': (base, S) =>
          function (_c) {
            const { ctx, frame, u } = _c;
            const tabs = u.el('nav', 'wmp-tabs', frame);
            for (const [i, t] of ['Now Playing', 'Library', 'Rip', 'Burn', 'Sync', 'Media Guide'].entries()) {
              const b = u.el('div', `wmp-tab ${i === 0 ? 'active' : ''}`, tabs, t);
            }
            const search = u.el('div', 'wmp-search', tabs, 'Search　⌕');
            const main = u.el('div', 'wmp-main', frame);
            const side = u.el('nav', 'wmp-nav', main);
            for (const t of [
              '♫  Music',
              '　▸ Playlists',
              '　　 ♫ Favorites',
              '　　 ♫ Recently Added',
              '　　 ♫ Top Rated',
              '♫  Library',
              '　　 ♪ Songs',
              '　　 ⚲ Artists',
              '　　 ◷ Albums',
              '　　 ◎ Genres',
              '▣  Videos',
              '▧  Pictures',
              '▤  Recorded TV',
              '▧  Other Libraries',
            ]) {
              const item = u.el('div', `nav-item ${t.includes('Videos') ? 'selected' : ''}`, side, t);
            }
            const stageWrap = u.el('section', 'player-area', main);
            const stageHead = u.el('div', 'subwindow-title', stageWrap);
            u.el('span', '', stageHead, 'Mountain Lake');
            const subcontrols = u.el('div', 'sub-controls', stageHead);
            for (const t of ['−', '□', '×']) u.el('span', '', subcontrols, t);
            const stage = u.el('main', 'record-stage', stageWrap);
            stage.dataset.role = 'stage';
            const help = u.el('aside', 'help-pane', main);
            u.el('h2', '', help, 'Help and Tips');
            const tips = [
              [
                '❔',
                'Play a video',
                'Click the Play button to start playback. Use the slider to move to a different point in the video.',
              ],
              ['🔊', 'Adjust the volume', 'Drag the volume slider to make the audio louder or softer.'],
              [
                '⏭',
                'Skip forward or back',
                'Use the Previous and Next buttons to go to the previous or next video in your playlist.',
              ],
              ['▣', 'View full screen', 'Click the Full Screen button to watch the video in full screen mode.'],
            ];
            for (const [ico, title, copy] of tips) {
              const row = u.el('article', 'help-tip', help);
              u.el('span', 'tip-icon', row, ico);
              const body = u.el('div', '', row);
              u.el('h3', '', body, title);
              u.el('p', '', body, copy);
            }
            const instruction = u.el('div', 'instruction', frame, ctx.instruction);
            if (ctx.display === 'hidden') instruction.hidden = true;
            if (ctx.display === 'toast') {
              const close = u.el('button', 'instruction-close', instruction, '×');
              close.onclick = () => {
                instruction.hidden = true;
              };
            }
            const footer = u.el('footer', 'wmp-footer', frame);
            const note = u.el('div', 'footer-note', footer, 'Ready');
            Object.assign(_c, {
              footer,
              help,
              instruction,
              main,
              note,
              search,
              side,
              stage,
              stageHead,
              stageWrap,
              subcontrols,
              tabs,
              tips,
            });
          },
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
        'frame.44': () => () => {},
        'frame.45': () => () => {},
        'frame.50': (base, S) =>
          function (_c) {
            const { actions, ctx, label, makeSubmit, placement, u } = _c;
            if (!ctx.finish && placement === 'note') _c.submit = makeSubmit(actions, 'primary', label);
            const reset = u.el('button', 'reset', actions, 'Save');
            reset.type = 'button';
            reset.dataset.role = 'xtra';
            reset.onclick = () => env.log('decoy', { label: 'Save', collide: false });
            Object.assign(_c, { reset });
          },
        'frame.51': () => () => {},
        'frame.52': () => () => {},
      },
    },
  });
})();
