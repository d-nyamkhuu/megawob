/* solve-puzzle/_theme: shared puzzle CSS, icons, metadata and fonts. Reference units keep their overrides. */
(function () {
  'use strict';
  const CSS = `
      .pz-card { flex: none; position: relative; display: flex; flex-direction: column; overflow: hidden;
        border: 1px solid var(--line); border-radius: var(--pz-r); background: var(--panel); color: var(--fg);
        box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 10px 28px rgba(0,0,0,.07); }
      .pz-head { flex: none; display: flex; align-items: center; gap: 12px; padding: 14px 20px; }
      .pz-card.band .pz-head { background: color-mix(in srgb, var(--accent) 11%, var(--panel)); border-bottom: 1px solid color-mix(in srgb, var(--accent) 22%, var(--line)); }
      .pz-card.ruled .pz-head { border-bottom: 1px solid var(--line); margin: 0 4px; }
      .pz-badge { flex: none; width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
        background: var(--accent); color: #fff; }
      .pz-badge svg { width: 20px; height: 20px; }
      .pz-card.ruled .pz-badge { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); color: var(--accent); }
      .pz-title { font-size: 18px; font-weight: 700; letter-spacing: -.01em; line-height: 1.2; }
      .pz-sub { font-size: 13px; color: var(--muted); line-height: 1.3; }
      .pz-body { flex: none; padding: var(--pz-pad) calc(var(--pz-pad) + 6px); }
      .pz-foot { flex: none; display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 8px 20px; margin-top: auto;
        border-top: 1px solid var(--line); font-size: 13.5px; color: var(--muted);
        background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
      .pz-foot b { color: var(--fg); font-weight: 650; }
      .pz-num { font-family: var(--pz-font); font-variant-numeric: tabular-nums; }

      .pz-in { height: var(--pz-fh); width: var(--pz-fw); padding: 0 12px; margin: 0; text-align: center;
        border: 1.5px solid color-mix(in srgb, var(--fg) 24%, var(--line)); border-radius: 8px;
        background: color-mix(in srgb, var(--panel) 65%, var(--bg)); color: var(--fg);
        font: inherit; font-family: var(--pz-font); font-size: calc(var(--pz-fh) * .5); font-weight: 600; outline: none;
        user-select: text; -webkit-user-select: text; caret-color: var(--accent); }
      .pz-in:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .pz-in::placeholder { color: var(--muted); opacity: .6; font-weight: 400; }
      .pz-btn { height: 40px; padding: 0 20px; border-radius: 8px; font: inherit; font-size: 15px; font-weight: 650; cursor: pointer;
        border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .pz-btn:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
      .pz-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
      .pz-btn.primary:hover { background: color-mix(in srgb, var(--accent) 86%, #000); }
      .pz-btn.off { opacity: .45; cursor: default; }

      .pz-eq { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: nowrap; white-space: nowrap; }
      .pz-eq.stacked { flex-direction: column; gap: 14px; }
      .pz-expr { font-size: var(--pz-fs); font-weight: 650; letter-spacing: .01em; }
      .pz-expr i { font-family: Georgia, "DejaVu Serif", serif; font-style: italic; font-weight: 600; padding: 0 1px; }
      .pz-label { font-size: 13px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
      .pz-xrow { display: flex; align-items: center; gap: 12px; font-size: calc(var(--pz-fs) * .8); font-weight: 650; }
      .pz-xrow i { font-family: Georgia, "DejaVu Serif", serif; font-style: italic; }
      .pz-stack { display: flex; flex-direction: column; align-items: center; gap: 6px; }

      .pz-rows { display: flex; flex-direction: column; gap: var(--pz-gap); }
      .pz-oe { display: grid; align-items: center; gap: 14px; height: var(--pz-rh); }
      .pz-oe.sides { grid-template-columns: 96px 1fr 96px; }
      .pz-oe.right { grid-template-columns: 1fr auto; padding: 0 4px 0 14px; border: 1px solid var(--line); border-radius: 9px;
        background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
      .pz-oe .pz-val { text-align: center; font-size: calc(var(--pz-rh) * .52); font-weight: 700; }
      .pz-oe.right .pz-val { text-align: left; }
      .pz-oe .pz-btn { height: calc(var(--pz-rh) - 10px); padding: 0 14px; }
      .pz-oe .pz-btn[aria-checked="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
      .pz-seg { display: flex; }
      .pz-seg .pz-btn { border-radius: 0; min-width: 76px; }
      .pz-seg .pz-btn:first-child { border-radius: 8px 0 0 8px; }
      .pz-seg .pz-btn:last-child { border-radius: 0 8px 8px 0; margin-left: -1px; }

      .pz-lead { margin: 0 0 14px; font-size: 15.5px; }
      .pz-lead b { font-family: var(--pz-font); }
      .pz-grow { display: flex; align-items: center; gap: 10px; }
      .pz-grow .pz-btn { height: var(--pz-fh); }
      .pz-msg { display: flex; align-items: center; gap: 10px; height: 46px; margin-top: 14px; padding: 0 14px; border-radius: 8px;
        font-size: 17px; font-weight: 650; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); color: var(--muted); }
      .pz-msg.up, .pz-msg.down { color: var(--fg); background: color-mix(in srgb, #f08c00 14%, var(--panel)); }
      .pz-msg.ok { color: #fff; background: #2f9e44; }
      .pz-msg.bad { color: #c92a2a; background: color-mix(in srgb, #e03131 10%, var(--panel)); }
      .pz-msg svg { width: 22px; height: 22px; flex: none; }
      .pz-hist { display: flex; flex-wrap: wrap; align-content: flex-start; gap: 6px; height: 70px; margin-top: 12px; overflow: hidden; }
      .pz-chip { display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 10px; border-radius: 14px; font-size: 14px;
        font-weight: 600; border: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .pz-chip small { color: var(--muted); font-size: 12px; }
      .pz-chip.ok { background: #2f9e44; border-color: #2f9e44; color: #fff; }
      .pz-chip.ok small { color: #fff; }
      .pz-dots { display: flex; gap: 4px; margin-left: auto; }
      .pz-dots i { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); }
      .pz-dots i.used { background: color-mix(in srgb, var(--fg) 15%, var(--panel)); }

      .pz-gen { display: flex; flex-direction: column; align-items: center; gap: 16px; }
      .pz-display { display: flex; align-items: center; justify-content: center; width: var(--pz-dw); height: calc(var(--pz-dw) * .62);
        border-radius: 12px; font-size: calc(var(--pz-dw) * .36); font-weight: 700;
        border: 2px solid color-mix(in srgb, var(--fg) 15%, var(--line)); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .pz-display.lcd { background: #18241c; color: #8ef0a5; border-color: #0d140f; text-shadow: 0 0 8px rgba(142,240,165,.45); }
      .pz-display.empty { color: var(--muted); }
      .pz-display.lcd.empty { color: #3f6a4a; }
      .pz-gen .pz-btn { min-width: 150px; height: 44px; }
      .pz-cap { font-size: 13.5px; color: var(--muted); }

      .pz-hc { display: flex; gap: 20px; align-items: stretch; }
      .pz-hc.below { flex-direction: column; }
      .pz-board { position: relative; flex: none; cursor: crosshair; touch-action: none; border-radius: 6px;
        box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--fg) 22%, var(--line));
        background-color: color-mix(in srgb, var(--accent) 5%, var(--panel));
        background-image: radial-gradient(color-mix(in srgb, var(--fg) 16%, transparent) 1.1px, transparent 1.2px);
        background-size: var(--pz-grid) var(--pz-grid); }
      .pz-board.lines { background-image: linear-gradient(color-mix(in srgb, var(--fg) 7%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--fg) 7%, transparent) 1px, transparent 1px); }
      .pz-board svg { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
      .pz-panel { display: flex; flex-direction: column; gap: 12px; width: 200px; }
      .pz-hc.below .pz-panel { flex-direction: row; align-items: center; width: auto; gap: 16px; }
      .pz-temp { display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 10px; font-size: 21px;
        font-weight: 800; letter-spacing: .06em; color: var(--muted); background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
      .pz-hc.below .pz-temp { width: 150px; flex: none; }
      .pz-temp.hot { background: #e03131; color: #fff; }
      .pz-temp.warm { background: #f08c00; color: #fff; }
      .pz-temp.cold { background: #1c7ed6; color: #fff; }
      .pz-temp.ice { background: #99e9f2; color: #0b4f5c; }
      .pz-trend { display: flex; align-items: center; gap: 8px; min-height: 40px; font-size: 14.5px; font-weight: 600; line-height: 1.25; }
      .pz-trend svg { width: 20px; height: 20px; flex: none; }
      .pz-trend.warmer { color: #e8590c; }
      .pz-trend.colder { color: #1c7ed6; }
      .pz-trend.none { color: var(--muted); font-weight: 500; }
      .pz-legend { display: grid; grid-template-columns: 14px 1fr; gap: 5px 8px; align-items: center; font-size: 12.5px; color: var(--muted); }
      .pz-hc.below .pz-legend { grid-template-columns: repeat(4, 14px auto); }
      .pz-legend i { width: 12px; height: 12px; border-radius: 3px; }

      .pz-ttt { display: grid; grid-template-columns: repeat(3, var(--pz-cell)); grid-template-rows: repeat(3, var(--pz-cell));
        gap: var(--pz-tgap); position: relative; margin: 0 auto; }
      .pz-ttt.lined { gap: 0; }
      .pz-cellb { position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;
        border-radius: 10px; background: color-mix(in srgb, var(--fg) 5%, var(--panel)); border: 1px solid var(--line); }
      .pz-cellb:hover { background: color-mix(in srgb, var(--accent) 9%, var(--panel)); }
      .pz-ttt.lined .pz-cellb { border-radius: 0; background: transparent; border: 0; }
      .pz-ttt.lined .pz-cellb:hover { background: color-mix(in srgb, var(--accent) 7%, transparent); }
      .pz-ttt.lined .pz-cellb:nth-child(-n+6) { border-bottom: 3px solid color-mix(in srgb, var(--fg) 55%, var(--line)); }
      .pz-ttt.lined .pz-cellb:not(:nth-child(3n)) { border-right: 3px solid color-mix(in srgb, var(--fg) 55%, var(--line)); }
      .pz-cellb.taken { cursor: default; }
      .pz-cellb svg { width: 62%; height: 62%; }
      .pz-ttt > svg.pz-strike { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
      .pz-turn { display: inline-flex; align-items: center; gap: 8px; }
      .pz-turn i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
      .pz-turn.win i { background: #2f9e44; }
      .pz-turn.loss i { background: #e03131; }
      .pz-turn.draw i { background: var(--muted); }
      .pz-tbl { width: 100%; border-collapse: collapse; font-size: var(--pz-tfs, 14.5px); }
      .pz-tbl th { text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 650;
        padding: 6px 10px; border-bottom: 1.5px solid var(--line); }
      .pz-tbl td { padding: 0 10px; height: var(--pz-trh, 32px); border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent); white-space: nowrap;
        max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
      .pz-tbl td.num, .pz-tbl th.num { text-align: right; font-variant-numeric: tabular-nums; }
      .pz-calc { display: flex; gap: 18px; align-items: flex-start; }
      .pz-calc.below { flex-direction: column; align-items: stretch; }
      .pz-calc .pz-side { display: flex; flex-direction: column; gap: 8px; flex: none; }
      .pz-calc .pz-in { --pz-fw: 170px; --pz-fh: 44px; text-align: left; }
      .pz-offers { display: grid; gap: 12px; }
      .pz-offer { display: flex; flex-direction: column; gap: 6px; padding: 12px; border: 1px solid var(--line); border-radius: 10px;
        background: color-mix(in srgb, var(--fg) 2%, var(--panel)); min-width: 0; }
      .pz-offer.on { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 35%, transparent); }
      .pz-offer b { font-size: 14px; line-height: 1.25; height: 2.5em; overflow: hidden; }
      .pz-offer .price { font-size: 19px; font-weight: 750; }
      .pz-offer .meta { font-size: 12.5px; color: var(--muted); display: flex; justify-content: space-between; gap: 6px; }
      .pz-offer .pz-btn { height: 32px; font-size: 13.5px; padding: 0 10px; }
      .pz-offer.on .pz-btn { background: var(--accent); border-color: var(--accent); color: #fff; }
      .pz-form { display: grid; gap: 4px 22px; }
      .pz-fld { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
      .pz-fld label { font-size: 13px; font-weight: 650; }
      .pz-fld .pz-in { --pz-fh: 36px; width: 100%; box-sizing: border-box; text-align: left; font-family: inherit; font-size: 15px; font-weight: 500; }
      .pz-fld.bad .pz-in { border-color: #e03131; box-shadow: 0 0 0 3px color-mix(in srgb, #e03131 18%, transparent); }
      .pz-err { height: 16px; font-size: 12px; line-height: 16px; color: #c92a2a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pz-banner { display: flex; align-items: center; gap: 10px; padding: 8px 12px; margin-bottom: 10px; border-radius: 8px; font-size: 13.5px;
        background: color-mix(in srgb, #e03131 10%, var(--panel)); color: var(--fg); border: 1px solid color-mix(in srgb, #e03131 30%, var(--line)); }
      .pz-banner.ok { background: color-mix(in srgb, #2f9e44 12%, var(--panel)); border-color: color-mix(in srgb, #2f9e44 30%, var(--line)); }
      .pz-oe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--pz-gap) 18px; }
      `;
  const ICONS = {
        math: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 7h6M8 4v6M14 7h5M5 16l5 5M10 16l-5 5M14 16h5M14 20h5"/></svg>',
        algebra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6l7 12M11 6l-7 12M14 10h6M14 15h6"/></svg>',
        parity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><circle cx="17" cy="7" r="3.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><circle cx="17" cy="17" r="3.5"/></svg>',
        guess: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 9a3 3 0 1 1 4.2 2.8c-.8.4-1.2 1-1.2 1.9V15"/><circle cx="12" cy="19" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="10"/></svg>',
        dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
        flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4.5 2.5-7 1.5 1.5 2 3 2 4.5 1.5-1.5 2-5 1.5-8.5z"/></svg>',
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
      };
  const ARROW_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  const ARROW_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  const MARK_X = '<svg viewBox="0 0 100 100"><path d="M20 20L80 80M80 20L20 80" stroke="var(--accent)" stroke-width="13" stroke-linecap="round" fill="none"/></svg>';
  const MARK_O = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="31" stroke="color-mix(in srgb, var(--fg) 70%, var(--panel))" stroke-width="12" fill="none"/></svg>';
  const BAND_COLOR = { hot: '#e03131', warm: '#f08c00', cold: '#1c7ed6', ice: '#66d9e8' };
  const META = {
        arithmetic: { icon: 'math', titles: ['Quick math', 'Arithmetic', 'Math check'], subs: ['Whole numbers only.', 'Type the exact result.', ''] },
        algebra: { icon: 'algebra', titles: ['Solve for x', 'Algebra', 'Find x'], subs: ['x is a whole number.', 'Type only the number.', ''] },
        'odd-even': { icon: 'parity', titles: ['Odd or even?', 'Number check', 'Parity quiz'], subs: ['Mark every number.', 'Zero counts as even.', ''] },
        guess: { icon: 'guess', titles: ['Guess the number', 'Number guessing game', 'Mystery number'], subs: ['Higher or lower hints after each guess.', ''] },
        generate: { icon: 'dice', titles: ['Random number', 'Number generator', 'Lucky draw'], subs: ['Numbers from 0 to 10.', ''] },
        'hot-cold': { icon: 'flame', titles: ['Hot or cold', 'Treasure hunt', 'Find the hot spot'], subs: ['Each click tells you if you are getting warmer.', 'The spot is hidden somewhere on the board.', ''] },
        tictactoe: { icon: 'grid', titles: ['Tic-tac-toe', 'Noughts and crosses', 'Three in a row'], subs: ['You play X against the computer.', ''] },
        compute: { icon: 'math', titles: ['Quick check', 'Numbers', 'From the data'], subs: ['Use the figures shown below.', ''] },
        'fix-error': { icon: 'guess', titles: ['Could not save', 'Please review', 'Form errors'], subs: ['Some information needs attention.', ''] },
      };
  const FONTS = {
        sans: 'inherit',
        mono: 'ui-monospace, "DejaVu Sans Mono", "Liberation Mono", monospace',
        serif: 'Georgia, "DejaVu Serif", "Liberation Serif", serif',
      };
  // Preserve each template's original style text, including its indentation.
  const hotColdCSS = CSS.replace(/^    /gm, '');
  env.template('solve-puzzle/_theme', () => ({
    CSS, hotColdCSS, ICONS, ARROW_UP, ARROW_DOWN, CHECK, MARK_X, MARK_O, BAND_COLOR, META, FONTS,
  }));
})();
