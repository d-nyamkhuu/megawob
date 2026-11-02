/* set-date/_styles: the calendar template's structural styles, kept byte-identical. */
(function () {
  'use strict';
  const calendar = `
  .fd-card {
    position: absolute; display: flex; flex-direction: column; padding: 18px 24px; border-radius: 14px;
    background: var(--panel); border: 1px solid var(--line); box-shadow: 0 2px 10px rgba(0,0,0,.06);
  }
  .fd-title { font-size: 19px; font-weight: 700; }
  .fd-sub { margin: 2px 0 12px; font-size: 13px; color: var(--muted); }
  .fd-today { margin: -4px 0 12px; font-size: 13.5px; }
  .fd-today b { font-weight: 650; }
  .fd-row { flex: none; margin-bottom: 12px; }
  .fd-row.fd-notes { flex: 1; min-height: 0; display: flex; flex-direction: column; margin-bottom: 0; }
  .fd-notes .fd-static { flex: 1; min-height: 0; align-items: flex-start; padding-top: 10px; color: var(--muted); }
  .fd-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--muted); }
  .fd-label b { color: var(--accent); font-weight: 700; }
  .fd-static {
    height: 38px; display: flex; align-items: center; padding: 0 12px; border-radius: 8px; white-space: nowrap; overflow: hidden;
    border: 1px solid var(--line); background: color-mix(in srgb, var(--bg) 60%, var(--panel)); color: var(--fg); font-size: 15px;
  }
  .fd-control {
    height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 12px; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 8px; background: var(--panel);
    font-size: 16px; white-space: nowrap; overflow: hidden;
  }
  .fd-control.open { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .fd-control.bad { border-color: #d6336c; }
  .fd-control svg { flex: none; color: var(--muted); }
  .fd-control .fd-txt { flex: 1; font-variant-numeric: tabular-nums; overflow: hidden; text-overflow: ellipsis; }
  .fd-control .fd-arrowr { color: var(--muted); }
  .fd-ph { color: var(--muted); }
  .fd-help { min-height: 18px; margin-top: 6px; font-size: 12.5px; color: var(--muted); }
  .fd-help.err { color: #d6336c; font-weight: 600; }
  .fd-input {
    display: block; width: 100%; height: 44px; padding: 0 12px; border-radius: 8px; outline: none; box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel); color: var(--fg);
    font: inherit; font-size: 17px; letter-spacing: .04em; font-variant-numeric: tabular-nums;
    user-select: text; -webkit-user-select: text;
  }
  .fd-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .fd-input::placeholder { color: var(--muted); opacity: .75; letter-spacing: .08em; }

  .fd-pop {
    position: absolute; z-index: 10; padding: 12px; border-radius: 12px; background: var(--panel); box-sizing: border-box;
    border: 1px solid var(--line); box-shadow: 0 14px 34px rgba(0,0,0,.2);
  }
  .fd-months { display: flex; gap: 24px; }
  .fd-month { position: relative; }
  .fd-head { display: flex; align-items: center; justify-content: space-between; gap: 4px; height: 40px; }
  .fd-nav, .fd-navgap { width: 32px; height: 32px; flex: none; }
  .fd-nav { display: grid; place-items: center; border-radius: 8px; cursor: pointer; color: var(--fg); }
  .fd-nav:hover, .fd-mtitle.toggle:hover, .fd-sel:hover { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .fd-mtitle { padding: 4px 10px; border-radius: 6px; font-size: 15px; font-weight: 700; white-space: nowrap; }
  .fd-mtitle.toggle { cursor: pointer; }
  .fd-mtitle.toggle::after { content: ' \\25BE'; color: var(--muted); }
  .fd-sels { display: flex; gap: 6px; }
  .fd-sel { padding: 4px 8px; border: 1px solid var(--line); border-radius: 6px; font-size: 14px; font-weight: 650; cursor: pointer; white-space: nowrap; }
  .fd-sel::after { content: ' \\25BE'; color: var(--muted); font-size: 11px; }
  .fd-sel.on { border-color: var(--accent); color: var(--accent); }
  .fd-dow, .fd-grid { display: grid; grid-template-columns: repeat(7, var(--cell)); }
  .fd-dow { height: 26px; align-items: center; text-align: center; font-size: 11.5px; font-weight: 600; color: var(--muted); overflow: hidden; }
  .fd-grid { grid-auto-rows: var(--cell); }
  .fd-day { display: grid; place-items: center; font-size: 14px; cursor: pointer; border-radius: var(--round); font-variant-numeric: tabular-nums; }
  .fd-day:hover { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
  .fd-day.out { color: var(--muted); opacity: .55; }
  .fd-day.today { box-shadow: inset 0 0 0 1.5px var(--accent); font-weight: 700; }
  .fd-day.inr { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border-radius: 0; }
  .fd-day.off, .fd-day.off:hover { cursor: not-allowed; color: var(--muted); opacity: .4; text-decoration: line-through; background: transparent; }
  .fd-day.booked { background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--fg) 10%, var(--panel)) 0 3px, transparent 3px 7px); }
  .fd-day.sel, .fd-day.sel:hover, .fd-day.out.sel { background: var(--accent); color: #fff; font-weight: 700; opacity: 1; }
  .fd-years, .fd-mgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .fd-mgrid { grid-template-columns: repeat(3, 1fr); }
  .fd-menu { position: absolute; left: 0; right: 0; top: 40px; bottom: 0; z-index: 2; padding: 6px 0; background: var(--panel); }
  .fd-year, .fd-mcell { display: grid; place-items: center; border-radius: 8px; cursor: pointer; font-size: 14.5px; font-weight: 600; }
  .fd-year:hover, .fd-mcell:hover { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
  .fd-year.sel, .fd-mcell.sel { background: var(--accent); color: #fff; }
  .fd-foot { display: flex; justify-content: flex-end; align-items: center; gap: 10px; height: 36px; margin-top: 6px; border-top: 1px solid var(--line); padding-top: 6px; }
  .fd-btn { padding: 5px 12px; border: 1px solid var(--line); border-radius: 7px; cursor: pointer; font-size: 13.5px; font-weight: 600; color: var(--accent); }
  .fd-btn:hover { background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }

  .fd-spin { display: flex; align-items: center; gap: 10px; }
  .fd-seg { display: flex; flex-direction: column; width: 70px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  .fd-arr { height: 32px; display: grid; place-items: center; cursor: pointer; color: var(--muted); background: color-mix(in srgb, var(--bg) 50%, var(--panel)); }
  .fd-arr:hover { color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .fd-val {
    height: 50px; display: grid; place-items: center; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums;
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); outline: none; cursor: text;
  }
  .fd-val:focus { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--accent); }
  .fd-unit { font-size: 13px; color: var(--muted); margin-right: 6px; }
  .fd-colon { font-size: 28px; font-weight: 700; }
  .fd-ampm { display: flex; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; margin-left: 8px; }
  .fd-ampm.vert { flex-direction: column; }
  .fd-ap { padding: 12px 16px; cursor: pointer; font-weight: 700; color: var(--muted); }
  .fd-ap.on { background: var(--accent); color: #fff; }
  .fd-cols { display: flex; gap: 6px; }
  .fd-col { display: flex; flex-direction: column; width: 64px; }
  .fd-col + .fd-col { border-left: 1px solid var(--line); padding-left: 6px; }
  .fd-col h4 { margin: 0 0 4px; height: 20px; text-align: center; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .fd-opt { height: var(--row); display: grid; place-items: center; border-radius: 6px; cursor: pointer; font-variant-numeric: tabular-nums; }
  .fd-opt:hover { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
  .fd-opt.on { background: var(--accent); color: #fff; font-weight: 700; }

  .fd-chead { display: flex; align-items: center; justify-content: space-between; height: 46px; margin-bottom: 8px; }
  .fd-cread { font-size: 30px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .fd-cread span { padding: 0 4px; border-radius: 6px; cursor: pointer; }
  .fd-cread span.on { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); color: var(--accent); }
  .fd-dial { position: relative; border-radius: 50%; background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .fd-dial svg { position: absolute; inset: 0; pointer-events: none; }
  .fd-num { position: absolute; width: 32px; height: 32px; margin: -16px 0 0 -16px; display: grid; place-items: center; border-radius: 50%;
    cursor: pointer; font-size: 14px; font-variant-numeric: tabular-nums; }
  .fd-num:hover { background: color-mix(in srgb, var(--accent) 18%, var(--panel)); }
  .fd-num.on { background: var(--accent); color: #fff; font-weight: 700; }
  .fd-dur { display: flex; align-items: center; gap: 8px; }
  .fd-dur .fd-input { width: 84px; text-align: center; }
  .fd-presets { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .fd-chip { padding: 6px 12px; border: 1px solid var(--line); border-radius: 16px; cursor: pointer; font-size: 13.5px; }
  .fd-chip.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--accent); font-weight: 650; }
  .fd-stepper { display: flex; align-items: center; gap: 12px; }
  .fd-sbtn { width: 64px; height: 38px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 8px; cursor: pointer; font-weight: 700; }
  .fd-sbtn:hover { background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
  .fd-readout { min-width: 120px; text-align: center; font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
  `;
  env.template('set-date/_styles', () => ({ calendar }));
})();
