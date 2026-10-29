/* use-text-editor/_styles: byte-preserving editor CSS; common card rules come from _shared. */
(function () {
  'use strict';
  const CLASSIC = `  .tc { background: var(--tc-bg); color: var(--tc-fg); }
  .tc .tc-tabs { flex: none; display: flex; align-items: stretch; height: 32px; background: var(--tc-chrome); border-bottom: 1px solid var(--tc-border); }
  .tc .tc-dots { display: flex; gap: 6px; align-items: center; padding: 0 12px; }
  .tc .tc-dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--tc-dot); display: block; }
  .tc .tc-tab { display: flex; align-items: center; gap: 7px; padding: 0 14px; background: var(--tc-bg); border-right: 1px solid var(--tc-border);
    border-top: 2px solid var(--accent); font-size: 12.5px; }
  .tc .tc-tab2 { display: flex; align-items: center; gap: 7px; padding: 0 14px; color: var(--tc-muted); font-size: 12.5px; border-right: 1px solid var(--tc-border); }
  .tc .tc-ficon { font: 700 9px/1 system-ui, sans-serif; padding: 2px 3px; border-radius: 3px; background: var(--tc-ficon); color: #1b1b1b; }
  .tc .tc-dirty { font-size: 10px; color: var(--tc-muted); width: 10px; }
  .tc .tc-strip { flex: none; position: relative; height: 62px; border-bottom: 1px solid var(--tc-border); background: var(--tc-bg); }
  .tc .tc-crumbs { position: absolute; left: 12px; top: 8px; font-size: 12px; color: var(--tc-muted); white-space: nowrap; }
  .tc .tc-findbtn { position: absolute; right: 10px; top: 5px; display: flex; gap: 6px; align-items: center; padding: 3px 10px;
    border: 1px solid var(--tc-border); border-radius: 4px; background: var(--tc-chrome); font-size: 12px; }
  .tc .tc-find { position: absolute; left: 8px; right: 8px; top: 4px; display: none; grid-template-columns: 22px 1fr auto; column-gap: 6px; row-gap: 4px;
    padding: 4px 6px; background: var(--tc-widget); border: 1px solid var(--tc-border); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,.18); }
  .tc .tc-find.open { display: grid; }
  .tc .tc-find .tc-exp { grid-row: 1 / span 2; border: 0; background: transparent; font-size: 13px; padding: 0; }
  .tc .tc-find input { min-width: 0; height: 22px; padding: 0 6px; border: 1px solid var(--tc-border); border-radius: 3px; background: var(--tc-input);
    color: var(--tc-fg); font-size: 12.5px; outline: none; }
  .tc .tc-find input:focus { border-color: var(--accent); }
  .tc .tc-row { display: flex; gap: 3px; align-items: center; }
  .tc .tc-ib { height: 22px; min-width: 24px; padding: 0 5px; border: 1px solid transparent; border-radius: 3px; background: transparent; font-size: 12px; }
  .tc .tc-ib:hover { background: var(--tc-hover); }
  .tc .tc-ib.on { border-color: var(--accent); background: var(--tc-on); }
  .tc .tc-ib.tc-ww { text-decoration: underline; }
  .tc .tc-tb { height: 22px; padding: 0 8px; border: 1px solid var(--tc-border); border-radius: 3px; background: var(--tc-chrome); font-size: 12px; }
  .tc .tc-count { font-size: 11.5px; color: var(--tc-muted); min-width: 64px; text-align: center; white-space: nowrap; }
  .tc .tc-r2 { display: none; }
  .tc .tc-find.rep .tc-r2 { display: contents; }
  .tc .tc-body { flex: none; display: flex; position: relative; overflow: hidden; }
  .tc .tc-gutter { flex: none; text-align: right; color: var(--tc-gutter); user-select: none; padding-right: 10px; box-sizing: border-box; }
  .tc .tc-gutter div.cur { color: var(--tc-gutter-cur); }
  .tc .tc-code { flex: none; position: relative; overflow: hidden; cursor: text; user-select: none; }
  .tc .tc-lines div, .tc .tc-gutter div { white-space: pre; }
  .tc .tc-over { position: absolute; inset: 0; pointer-events: none; }
  .tc .tc-line-cur { position: absolute; left: 0; right: 0; background: var(--tc-curline); }
  .tc .tc-sel { position: absolute; background: var(--tc-sel); }
  .tc .tc-match { position: absolute; background: var(--tc-match); }
  .tc .tc-match.now { background: var(--tc-match-now); outline: 1px solid var(--tc-match-edge); }
  .tc .tc-caret { position: absolute; width: 2px; background: var(--tc-caret); }
  .tc .tc-pop { position: absolute; pointer-events: auto; min-width: 190px; background: var(--tc-widget); border: 1px solid var(--tc-border);
    box-shadow: 0 3px 10px rgba(0,0,0,.25); border-radius: 3px; font-size: 12px; z-index: 3; }
  .tc .tc-pop div { display: flex; align-items: center; gap: 6px; height: var(--te-completion-height, 20px); padding: 0 8px; white-space: pre; cursor: pointer; }
  .tc .tc-pop div.sel { background: var(--tc-popsel); }
  .tc .tc-pop b { color: var(--tc-pophl); font-weight: 700; }
  .tc .tc-pop .ic { font-size: 9px; width: 18px; color: var(--tc-muted); }
  .tc .tc-pop .dt { margin-left: auto; padding-left: 14px; color: var(--tc-muted); font-size: 11px; }
  .tc .tc-mini { flex: none; position: relative; width: 56px; border-left: 1px solid var(--tc-border); overflow: hidden; }
  .tc .tc-mini i { position: absolute; height: 2px; background: var(--tc-mini); display: block; }
  .tc .tc-mini .view { position: absolute; left: 0; right: 0; top: 0; background: var(--tc-miniview); }
  .tc .tc-status { flex: none; display: flex; gap: 16px; align-items: center; height: 22px; padding: 0 10px; background: var(--accent); color: #fff; font-size: 11.5px; white-space: nowrap; }
  .tc .tc-status .sp { flex: 1; }
  .tc .k { color: var(--tc-k); } .tc .kc { color: var(--tc-kc); } .tc .s { color: var(--tc-s); } .tc .c { color: var(--tc-c); }
  .tc .n { color: var(--tc-n); } .tc .f { color: var(--tc-f); } .tc .v { color: var(--tc-v); } .tc .K { color: var(--tc-K); } .tc .p { color: var(--tc-p); }

  .tc { --tc-bg: #ffffff; --tc-fg: #1f1f1f; --tc-chrome: #f3f3f3; --tc-border: #e1e1e1; --tc-muted: #6f6f6f; --tc-dot: #d0d0d0;
    --tc-gutter: #8a9199; --tc-gutter-cur: #0b216f; --tc-curline: #f5f7fa; --tc-sel: #add6ff; --tc-match: #ffe08a; --tc-match-now: #f8c64a;
    --tc-match-edge: #c09000; --tc-caret: #000000; --tc-widget: #f8f8f8; --tc-input: #ffffff; --tc-hover: #e6e6e6; --tc-on: #dbe8fb;
    --tc-popsel: #d6ebff; --tc-pophl: #0066bf; --tc-mini: #c8ccd2; --tc-miniview: rgba(100,100,100,.12); --tc-ficon: #f1d23b;
    --tc-k: #0000ff; --tc-kc: #af00db; --tc-s: #a31515; --tc-c: #008000; --tc-n: #098658; --tc-f: #795e26; --tc-v: #001080; --tc-K: #0070c1; --tc-p: #3b3b3b; }
  .tc.dark { --tc-bg: #1e1e1e; --tc-fg: #d4d4d4; --tc-chrome: #252526; --tc-border: #3c3c3c; --tc-muted: #9d9d9d; --tc-dot: #4a4a4a;
    --tc-gutter: #858585; --tc-gutter-cur: #c6c6c6; --tc-curline: #282828; --tc-sel: #264f78; --tc-match: #623315; --tc-match-now: #9e6a03;
    --tc-match-edge: #f0b030; --tc-caret: #aeafad; --tc-widget: #252526; --tc-input: #3c3c3c; --tc-hover: #3a3d41; --tc-on: #094771;
    --tc-popsel: #04395e; --tc-pophl: #2aaaff; --tc-mini: #4b4f55; --tc-miniview: rgba(200,200,200,.1); --tc-ficon: #cbcb41;
    --tc-k: #569cd6; --tc-kc: #c586c0; --tc-s: #ce9178; --tc-c: #6a9955; --tc-n: #b5cea8; --tc-f: #dcdcaa; --tc-v: #9cdcfe; --tc-K: #4fc1ff; --tc-p: #d4d4d4; }
  .tc.warm { --tc-bg: var(--panel); --tc-chrome: var(--bg); --tc-border: var(--line); --tc-curline: rgba(0,0,0,.03); --tc-widget: var(--bg); --tc-input: var(--panel); }
  .tc.low { --tc-bg: var(--panel); --tc-fg: var(--fg); --tc-chrome: var(--bg); --tc-border: var(--line); --tc-k: #5b6fa0; --tc-kc: #8a6a9c;
    --tc-s: #9a6b5c; --tc-c: #7f9a7f; --tc-n: #6f8f80; --tc-f: #8a7a55; --tc-v: #5d6f86; --tc-K: #5a7f9c; --tc-p: var(--fg); --tc-widget: var(--bg); --tc-input: var(--panel); }

  `;

  const RICH = `  .tr { background: var(--bg); color: var(--fg); }
  .tr .tr-head { flex: none; display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 14px; background: var(--panel); }
  .tr .tr-logo { width: 18px; height: 22px; border-radius: 2px; background: var(--accent); position: relative; }
  .tr .tr-logo::after { content: ''; position: absolute; left: 4px; right: 4px; top: 7px; height: 8px; border-top: 2px solid #fff; border-bottom: 2px solid #fff; }
  .tr .tr-title { font-size: 15px; }
  .tr .tr-saved { font-size: 11.5px; color: var(--muted); }
  .tr .tr-bar { flex: none; display: flex; align-items: center; gap: 2px; height: 38px; padding: 0 8px; margin: 0 8px; border-radius: 19px; background: var(--panel);
    border: 1px solid var(--line); position: relative; }
  .tr .tr-b { height: 28px; min-width: 28px; padding: 0 7px; border: 0; border-radius: 4px; background: transparent; font-size: 13px; display: flex; align-items: center; gap: 5px; }
  .tr .tr-b:hover { background: var(--tr-hover); }
  .tr .tr-b[disabled] { opacity: .45; cursor: default; }
  .tr .tr-sep { width: 1px; height: 20px; background: var(--line); margin: 0 4px; }
  .tr .tr-grow { flex: 1; }
  .tr .tr-mode { border: 1px solid var(--line); background: var(--panel); }
  .tr .tr-menu { position: absolute; right: 8px; top: 38px; width: 230px; background: var(--panel); border: 1px solid var(--line); border-radius: 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,.2); padding: 4px 0; z-index: 4; display: none; }
  .tr .tr-menu.open { display: block; }
  .tr .tr-mi { display: block; width: 100%; text-align: left; padding: 6px 14px; border: 0; background: transparent; }
  .tr .tr-mi:hover { background: var(--tr-hover); }
  .tr .tr-mi b { display: block; font-weight: 600; }
  .tr .tr-mi span { display: block; font-size: 11.5px; color: var(--muted); }
  .tr .tr-mi.on b::before { content: '\\2713  '; }
  .tr .tr-strip { flex: none; position: relative; height: 40px; }
  .tr .tr-ruler { position: absolute; left: 0; right: 0; top: 14px; height: 12px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
    background: repeating-linear-gradient(90deg, transparent 0 11px, var(--line) 11px 12px); opacity: .7; }
  .tr .tr-find { position: absolute; left: 10px; right: 10px; top: 4px; height: 32px; display: none; align-items: center; gap: 5px; padding: 0 8px;
    background: var(--panel); border: 1px solid var(--line); border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,.15); font-size: 12.5px; white-space: nowrap; }
  .tr .tr-find.open { display: flex; }
  .tr .tr-find input { width: 120px; height: 22px; padding: 0 6px; border: 1px solid var(--line); border-radius: 3px; background: var(--bg); color: var(--fg); outline: none; }
  .tr .tr-find input:focus { border-color: var(--accent); }
  .tr .tr-find .rp { display: none; align-items: center; gap: 5px; }
  .tr .tr-find.rep .rp { display: flex; }
  .tr .tr-find.rep .tr-exp { display: none; }
  .tr .tr-chk { display: flex; align-items: center; gap: 3px; height: 22px; padding: 0 6px; border: 1px solid var(--line); border-radius: 3px; background: transparent; font-size: 12px; }
  .tr .tr-chk::before { content: ''; width: 10px; height: 10px; border: 1px solid var(--muted); border-radius: 2px; }
  .tr .tr-chk.on::before { background: var(--accent); border-color: var(--accent); }
  .tr .tr-fb { height: 22px; padding: 0 7px; border: 1px solid var(--line); border-radius: 3px; background: var(--bg); font-size: 12px; }
  .tr .tr-count { color: var(--muted); font-size: 11.5px; min-width: 52px; text-align: center; }
  .tr .tr-body { flex: none; display: flex; gap: 14px; padding: 0 14px; overflow: hidden; }
  .tr .tr-page { flex: none; position: relative; box-sizing: border-box; padding: 26px 34px; background: var(--panel); border: 1px solid var(--line);
    box-shadow: 0 1px 3px rgba(0,0,0,.08); cursor: text; user-select: none; overflow: hidden; }
  .tr .tr-text p { margin: 0 0 12px; }
  .tr .tr-text span.i { text-decoration: underline; text-decoration-thickness: 1.5px; }
  .tr .tr-text span.d { text-decoration: line-through; text-decoration-thickness: 1.5px; }
  .tr .tr-over { position: absolute; inset: 0; pointer-events: none; }
  .tr .tr-sel { position: absolute; background: var(--tr-sel); }
  .tr .tr-hit { position: absolute; background: var(--tr-hit); }
  .tr .tr-hit.now { background: var(--tr-hitnow); }
  .tr .tr-caret { position: absolute; width: 2px; background: var(--fg); }
  .tr .tr-margin { flex: none; position: relative; }
  .tr .tr-card { position: absolute; left: 0; right: 0; box-sizing: border-box; padding: 6px 8px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 7px; box-shadow: 0 1px 3px rgba(0,0,0,.1); font-size: 12px; }
  .tr .tr-card .hd { display: flex; align-items: center; gap: 6px; height: 22px; }
  .tr .tr-card .av { width: 18px; height: 18px; border-radius: 50%; color: #fff; font: 700 10px/18px system-ui, sans-serif; text-align: center; flex: none; }
  .tr .tr-card .nm { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tr .tr-card .ac { margin-left: auto; display: flex; gap: 2px; }
  .tr .tr-card .ac button { width: 24px; height: 22px; border: 0; border-radius: 4px; background: transparent; font-size: 14px; line-height: 22px; padding: 0; }
  .tr .tr-card .ac button:hover { background: var(--tr-hover); }
  .tr .tr-card .ac .ok { color: #188038; } .tr .tr-card .ac .no { color: #c5221f; }
  .tr .tr-card .ds { color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
  .tr .tr-foot { flex: none; display: flex; gap: 18px; align-items: center; height: 24px; padding: 0 16px; font-size: 11.5px; color: var(--muted);
    background: var(--panel); border-top: 1px solid var(--line); margin-top: auto; }
  .tr { --tr-hover: rgba(0,0,0,.06); --tr-sel: rgba(66,133,244,.28); --tr-hit: rgba(255,214,0,.45); --tr-hitnow: rgba(255,150,0,.6); }
  .tr.dark { --tr-hover: rgba(255,255,255,.08); --tr-sel: rgba(110,160,255,.35); --tr-hit: rgba(200,160,0,.4); --tr-hitnow: rgba(230,120,0,.6); }
  `;

  env.template('use-text-editor/_styles', () => {
    const { cardCss } = env.templateLib('use-text-editor/_shared');
    return { classic: cardCss + CLASSIC, rich: cardCss + RICH };
  }, { uses: ['use-text-editor/_shared'] });
})();
