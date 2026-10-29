// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-breakout-03',
  name: 'design',
  split: 'train',
  scenarios: ['breakout'],
  template: 'use-chat/workspace',
  design: {
    inset: '0px',
    font: 'Georgia, "Times New Roman", serif',
    parts: {
      // Lay out the board during render, before the kit records the app anchor.
      room: (base, S) => (board, room, rooms, model) => {
        board.classList.add('riverside-breakout-grid');
        base(board, room, rooms, model);
        const panel = rooms.get(room);
        panel.classList.toggle('riverside-assigned-room', room !== -1);
        panel.style.gridColumn = room === -1 ? '1' : '2';
        panel.style.gridRow = room === -1 ? `1 / ${S.spec.roomNames.length + 1}` : String(room + 1);
        board.style.gridTemplateRows = `repeat(${S.spec.roomNames.length}, minmax(0, 1fr))`;
      },
      styles: (base) => () => base() + `
        /* The outer chrome supplies workspace navigation and the details inspector. */
        .ch-top, .ch-rail, .ch-nav, .ch-status { display:none; }
        .ch-callmeta, .ch-breaknotice, .ch-guide { display:none; }
        .ch-roomstatus, .ch-roomfooter { display:none; }
        .ch-app { background:transparent; box-shadow:none; border-radius:0; }
        .ch-app button { border-color:#b9ad98; background:linear-gradient(#fffdf8,#e9e1d3); color:#2b2118; box-shadow:inset 0 1px #fff, 0 1px 2px #c4b9a8; }
        .riverside-breakout-grid {
          grid-template-columns:minmax(0, .9fr) minmax(0, 1.8fr);
          gap:12px;
        }
        .ch-room { min-width:0; overflow:hidden; }
        .ch-head h2 { font-size:27px; }
        .ch-head p { font-size:20px; }
        .ch-roomhead { font-size:20px; flex:none; }
        .ch-roomhead .ch-count { font-size:16px; }
        .ch-roster { min-height:0; }
        .ch-participant { min-height:60px; padding:6px; font-size:20px; }
        .ch-participant small { font-size:12px; }
        .ch-participant .ch-avatar { flex:none; }
        .ch-empty { font-size:18px; }
        .ch-roomstatus, .ch-roomfooter { font-size:11px; }
        .ch-room.drop { border-width:1px; }
        .ch-app.ch-compact .ch-head h2 { font-size:19px; }
        .ch-app.ch-compact .ch-head p { font-size:14px; }
        .ch-app.ch-compact .ch-roomhead { font-size:16px; min-height:30px; padding:5px; }
        .ch-app.ch-compact .ch-participant { font-size:16px; min-height:38px; padding:4px; margin:3px 0; }
        .ch-app.ch-compact .ch-participant small { font-size:9px; }
        .ch-app.ch-compact .ch-empty { font-size:14px; }
        .ch-app .riverside-assigned-room .ch-roomhead { min-height:30px; padding:5px; font-size:16px; }
        .ch-app .riverside-assigned-room .ch-participant { min-height:0; padding:3px 5px; margin:3px 0; font-size:14px; }
        .ch-app .riverside-assigned-room .ch-participant small { font-size:9px; }
      `,
    },
  },
});
