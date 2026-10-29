/* recall-info/_classic-assets: byte-identical baseline CSS and design presets for classic. */
(function () {
  'use strict';

  const CSS = `
  .ur-app { position: absolute; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;
    background: var(--panel); color: var(--fg); border: 1px solid var(--line); border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 12px 32px rgba(0,0,0,.06); font-size: 14px; }
  .ur-app.flat { box-shadow: none; border-radius: 4px; }
  .ur-bar { flex: none; display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 18px; box-sizing: border-box;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ur-mark { width: 20px; height: 20px; border-radius: 5px; background: var(--accent); flex: none; }
  .ur-appname { font-weight: 700; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ur-user { margin-left: auto; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
  .ur-work { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 10px; padding: 14px 20px 16px; box-sizing: border-box; }
  .ur-work.tight { gap: 7px; padding: 10px 16px 12px; }
  .ur-h { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
  .ur-sub { color: var(--muted); font-size: 12.5px; }
  .ur-p { margin: 0; line-height: 1.45; }
  .ur-hint { margin: 0; color: var(--muted); font-size: 12.5px; }
  .ur-panel[hidden], .ur-view[hidden] { display: none; }
  .ur-panel h3 { margin: 0 0 8px; font-size: 15px; font-weight: 650; }
  .ur-btn { padding: 7px 16px; border-radius: 7px; font: inherit; font-weight: 600; font-size: 13.5px; cursor: pointer;
    border: 1px solid var(--line); background: var(--panel); color: var(--fg); white-space: nowrap; }
  .ur-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .ur-btn.small { padding: 4px 12px; font-size: 12.5px; }
  .ur-btn.on { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); border-color: var(--accent); color: var(--accent); }
  .ur-btn.gone { visibility: hidden; }
  .ur-link { color: var(--accent); cursor: pointer; font-weight: 600; font-size: 13.5px; text-decoration: none; background: none; border: 0; padding: 6px 4px; font-family: inherit; }
  .ur-link:hover { text-decoration: underline; }
  .ur-link.gone { visibility: hidden; }
  .ur-input { height: 34px; padding: 0 10px; box-sizing: border-box; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 6px;
    background: color-mix(in srgb, var(--panel) 75%, var(--bg)); color: var(--fg); font: inherit; font-size: 14px; outline: none; min-width: 0;
    user-select: text; -webkit-user-select: text; }
  .ur-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  .ur-label { font-size: 13px; font-weight: 600; }
  .ur-err { min-height: 16px; font-size: 12.5px; color: #d63939; }
  .ur-foot { flex: none; display: flex; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
  .ur-foot .grow { flex: 1; }

  .ur-prog { flex: none; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
  .ur-prog b { color: var(--fg); }
  .ur-barline { height: 6px; border-radius: 99px; background: var(--line); overflow: hidden; }
  .ur-barfill { height: 100%; background: var(--accent); border-radius: 99px; }
  .ur-codebox { margin: 12px 0 8px; padding: 14px 18px; border: 2px dashed var(--accent); border-radius: 10px; display: inline-block;
    background: color-mix(in srgb, var(--accent) 7%, var(--panel)); }
  .ur-codelabel { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .ur-code { font: 700 28px/1.2 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .06em; margin-top: 2px; }
  .ur-opts { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
  .ur-opt, .ur-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .ur-opt input, .ur-check input { margin: 0; width: 16px; height: 16px; accent-color: var(--accent); }
  .ur-check { margin-top: 10px; font-weight: 600; }
  .ur-done { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .ur-done .ok { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;
    font-weight: 700; color: #2f9e44; background: color-mix(in srgb, #2f9e44 18%, var(--panel)); }
  .ur-done h3 { margin: 0; font-size: 18px; }
  .ur-done .ur-code { font-size: 22px; }

  .ur-grid { display: grid; grid-template-columns: var(--ur-cols); column-gap: 10px; align-items: center; }
  .ur-colhead { flex: none; padding: 0 12px; height: 28px; border: 1px solid var(--line); border-radius: 7px 7px 0 0; font-size: 11.5px;
    text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 650; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ur-panewrap { position: relative; flex: 1; min-height: 0; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 7px 7px; overflow: hidden; }
  .ur-pane { position: absolute; left: 0; top: 0; bottom: 0; right: 14px; overflow: hidden; }
  .ur-inner { position: relative; }
  .ur-row { position: absolute; left: 0; right: 0; height: 32px; box-sizing: border-box; padding: 0 12px; font-size: 13.5px;
    border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .ur-row span, .ur-trow span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ur-row.odd { background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ur-row .n { color: var(--muted); font-variant-numeric: tabular-nums; }
  .ur-end { position: absolute; left: 0; right: 0; height: 30px; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 12.5px; }
  .ur-track { position: absolute; right: 0; top: 0; bottom: 0; width: 14px; background: color-mix(in srgb, var(--fg) 5%, var(--panel)); border-left: 1px solid var(--line); cursor: default; }
  .ur-thumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 32%, var(--panel)); cursor: grab; touch-action: none; }
  .ur-ans { flex: none; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding-top: 4px; }
  .ur-ans .ur-input { width: 90px; }
  .ur-readout { color: var(--muted); font-size: 13px; }
  .ur-readout b { color: var(--fg); }

  .ur-sel { flex: none; height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 12px; border-radius: 7px; font-size: 13px; white-space: nowrap;
    overflow: hidden; background: color-mix(in srgb, var(--accent) 9%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line)); }
  .ur-sel b { overflow: hidden; text-overflow: ellipsis; }
  .ur-tbl { flex: none; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
  .ur-thead { padding: 0 12px; height: 28px; font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 650;
    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); border-bottom: 1px solid var(--line); }
  .ur-trow { padding: 0 12px; height: 40px; box-sizing: border-box; font-size: 13.5px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .ur-trow:last-child { border-bottom: 0; }
  .ur-trow.off { visibility: hidden; }
  .ur-trow .num { font-variant-numeric: tabular-nums; }
  .ur-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 12px; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .ur-pager { flex: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: var(--muted); }
  .ur-pager .ur-btn { min-width: 34px; padding: 5px 10px; }

  .ur-tabs { flex: none; display: flex; gap: 2px; border-bottom: 1px solid var(--line); }
  .ur-tab { padding: 8px 16px; background: none; border: 0; border-bottom: 2px solid transparent; font: inherit; font-weight: 600; font-size: 14px;
    color: var(--muted); cursor: pointer; margin-bottom: -1px; }
  .ur-tab.on { color: var(--fg); border-bottom-color: var(--accent); }
  .ur-kv { border-collapse: collapse; width: 100%; font-size: 14px; }
  .ur-kv td { padding: 7px 10px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .ur-kv td:first-child { color: var(--muted); width: 38%; }
  .ur-kv td:last-child { font-weight: 600; overflow-wrap: anywhere; }
  .ur-fields { display: grid; grid-template-columns: repeat(var(--ur-fc, 1), minmax(0, 1fr)); gap: 8px 16px; }
  .ur-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ur-field .ur-input { width: 100%; }
  .ur-saved { font-size: 13px; color: var(--muted); line-height: 1.4; overflow-wrap: anywhere; min-height: 56px; }
  .ur-saved b { color: var(--fg); }

  .ur-choice { flex: none; height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 12px; border-radius: 7px; font-size: 13px; white-space: nowrap;
    overflow: hidden; background: color-mix(in srgb, var(--accent) 9%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line)); }
  .ur-cgrid { display: grid; grid-template-columns: repeat(var(--ur-cc, 1), minmax(0, 1fr)); gap: 8px 14px; }
  .ur-tile { display: flex; align-items: center; gap: 10px; padding: 8px 12px; height: 46px; box-sizing: border-box; border: 1px solid var(--line); border-radius: 8px; }
  .ur-tile .sw { width: 30px; height: 30px; flex: none; border-radius: 6px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); color: var(--muted);
    display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .ur-tile .nm { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
  .ur-detail h3 { margin: 6px 0 2px; font-size: 18px; }
  .ur-price { font-size: 24px; font-weight: 750; margin: 2px 0 8px; }
  .ur-specs { display: grid; grid-template-columns: auto 1fr; gap: 4px 18px; margin: 0 0 8px; font-size: 14px; }
  .ur-specs dt { color: var(--muted); }
  .ur-specs dd { margin: 0; font-weight: 600; }
  `;

  const TOKENS = {
    width: 600, title: null, tightHeight: 560,
    users: ['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park'],
    alignments: ['start', 'center', 'center', 'end'],
    panel: 'var(--panel)', fg: 'var(--fg)', line: 'var(--line)',
    accent: 'var(--accent)', muted: 'var(--muted)', bg: 'var(--bg)',
    frameRadius: '12px', fontSize: '14px', inputRadius: '6px',
    fieldWidth: '240px',
    detailsLabel: 'View details',
    minHeight: 420, maxHeight: 600,
    rowHeight: 32, footerHeight: 30, columns: {
      orders: '40px 1.1fr 1.6fr 1fr 0.9fr',
      tickets: '40px 0.9fr 2.6fr 0.9fr 1fr',
      files: '40px 2.2fr 1fr 0.9fr 1.2fr',
    },
  };
  const SCENARIOS = {
    compare: { width: 720, title: 'Store' },
    count: { width: 700, title: 'Workspace' },
    crossref: { width: 640, title: 'Back office' },
    paginate: { width: 740, title: 'Catalog', columns: 'minmax(0,2.6fr) minmax(0,1fr) minmax(0,0.9fr) minmax(0,1.3fr) 104px' },
  };

  env.template('recall-info/_classic-assets', () => ({ CSS, TOKENS, SCENARIOS }));
})();
