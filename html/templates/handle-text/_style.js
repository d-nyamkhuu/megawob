/* handle-text/_style: original editor and reference stylesheet text, kept byte-identical. */
(function () {
  'use strict';
  const editorCSS = `
  .ut-card {
    flex: none; position: relative; display: flex; flex-direction: column;
    border: 1px solid color-mix(in srgb, var(--fg) 14%, var(--line)); border-radius: var(--ut-r);
    background: var(--panel); box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 10px 28px rgba(0,0,0,.08); overflow: hidden;
  }
  .ut-bar {
    display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 14px; flex: none;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 4%, var(--panel));
    font-size: 13.5px; color: var(--muted);
  }
  .ut-dots { display: flex; gap: 6px; }
  .ut-dots i { width: 10px; height: 10px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 18%, var(--panel)); }
  .ut-file { font-weight: 600; color: var(--fg); letter-spacing: .01em; }
  .ut-bar .ut-tag { margin-left: auto; font-size: 12px; padding: 2px 8px; border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--accent); font-weight: 600; }
  .ut-body { padding: var(--ut-pad); display: flex; gap: var(--ut-gap); }
  .ut-body.col { flex-direction: column; }
  .ut-body.row { flex-direction: row; align-items: flex-start; }
  .ut-status { flex: none; height: 28px; padding: 0 12px; display: flex; align-items: center; gap: 14px;
    border-top: 1px solid var(--line); font-size: 12.5px; color: var(--muted);
    background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); white-space: nowrap; overflow: hidden; }
  .ut-h { margin: 0 0 2px; font-size: 20px; font-weight: 700; color: var(--fg); }
  .ut-sub { margin: 0; font-size: 14px; color: var(--muted); }

  .ut-boxes { display: flex; gap: var(--ut-gap); }
  .ut-boxes.row { flex-direction: row; align-items: flex-start; }
  .ut-boxes.col { flex-direction: column; }
  .ut-boxes.wrap { flex-wrap: wrap; }
  .ut-src { display: flex; flex-direction: column; gap: 6px; flex: none; }
  .ut-src-title { font-size: 12.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .ut-text {
    width: var(--ut-bw); padding: 10px 12px; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line));
    border-radius: calc(var(--ut-r) - 2px); background: color-mix(in srgb, var(--panel) 55%, var(--bg));
    font-family: var(--ut-font); font-size: var(--ut-fs); line-height: 1.5; color: var(--fg);
    user-select: text; -webkit-user-select: text; cursor: text; outline: none; overflow-wrap: break-word;
  }
  .ut-text:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
  .ut-text ::selection, .ut-text::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit; }
  .ut-text.lines { padding: 6px 0; white-space: pre; overflow-wrap: normal; }
  .ut-ln { display: flex; padding: 0 12px 0 0; line-height: var(--ut-lh); min-height: var(--ut-lh); }
  .ut-ln .ut-num { flex: none; width: 2.6em; padding-right: .8em; text-align: right; color: var(--muted); opacity: .8; }
  .ut-text.lines.plain .ut-ln { padding-left: 12px; }

  .ut-fieldrow { display: flex; flex-direction: column; gap: 6px; }
  .ut-fieldrow.inline { flex-direction: row; align-items: center; gap: 12px; }
  .ut-label { font-size: 15px; font-weight: 600; color: var(--fg); white-space: nowrap; }
  .ut-input {
    width: var(--ut-fw); height: var(--ut-ih); padding: 0 11px; margin: 0;
    border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line)); border-radius: calc(var(--ut-r) - 3px);
    background: var(--panel); color: var(--fg); font: inherit; font-size: 16px; outline: none;
    user-select: text; -webkit-user-select: text; caret-color: var(--accent);
  }
  .ut-input::placeholder { color: var(--muted); opacity: .75; }
  .ut-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  .ut-input:disabled { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); color: var(--muted); cursor: not-allowed; }

  .ut-scroll { display: flex; flex: none; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line));
    border-radius: calc(var(--ut-r) - 2px); overflow: hidden; background: color-mix(in srgb, var(--panel) 55%, var(--bg)); }
  .ut-list { overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none;
    font-family: var(--ut-font); font-size: var(--ut-fs); color: var(--fg); user-select: text; -webkit-user-select: text; }
  .ut-list::-webkit-scrollbar { display: none; }
  .ut-list .ut-ln { white-space: pre; height: var(--ut-lh); padding-right: 14px; }
  .ut-list.plain .ut-ln { padding-left: 14px; }
  .ut-list .ut-ln.head { font-weight: 700; }
  .ut-track { position: relative; flex: none; width: 14px; border-left: 1px solid var(--line);
    background: color-mix(in srgb, var(--fg) 5%, var(--panel)); cursor: pointer; touch-action: none; }
  .ut-thumb { position: absolute; left: 2px; right: 2px; border-radius: 5px; cursor: grab; touch-action: none;
    background: color-mix(in srgb, var(--fg) 32%, var(--panel)); }
  .ut-thumb:hover, .ut-thumb.dragging { background: color-mix(in srgb, var(--fg) 52%, var(--panel)); }

  .ut-actions { display: flex; gap: 10px; justify-content: flex-end; align-items: center; }
  .ut-btn { min-width: 92px; height: 38px; padding: 0 16px; border-radius: calc(var(--ut-r) - 3px); font: inherit;
    font-weight: 600; cursor: pointer; border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line));
    background: var(--panel); color: var(--fg); }
  .ut-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .ut-btn:disabled { opacity: .45; cursor: not-allowed; }
  .ut-btn.pressed { outline: 3px solid color-mix(in srgb, var(--accent) 35%, transparent); }
  .ut-hint { font-size: 12.5px; color: var(--muted); margin-right: auto; }
  .ut-hint.ok { color: var(--accent); }

  .ut-flow { width: var(--ut-bw); font-size: 16px; line-height: 2.1; }
  .ut-flow > div { line-height: 1.6; margin: 4px 0; color: var(--fg); }
  .ut-flow .ut-btn { min-width: 0; height: 34px; margin: 2px 8px 2px 0; vertical-align: middle; }
  .ut-flow .ut-input { height: 32px; vertical-align: middle; margin: 2px 6px 2px 0; }
  .ut-flow span.lbl { margin-right: 6px; color: var(--fg); }

  .ut-spin { display: flex; align-items: stretch; height: 46px; }
  .ut-spin .ut-input { width: var(--ut-sw); height: 46px; text-align: center; font-size: 19px; font-variant-numeric: tabular-nums;
    border-radius: 0; cursor: default; }
  .ut-spin.stacked .ut-input { text-align: left; border-radius: calc(var(--ut-r) - 3px) 0 0 calc(var(--ut-r) - 3px); }
  .ut-arrows { display: flex; flex-direction: column; }
  .ut-sb { width: 34px; flex: 1; padding: 0; border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line)); background: color-mix(in srgb, var(--fg) 5%, var(--panel));
    color: var(--fg); cursor: pointer; display: flex; align-items: center; justify-content: center; font: inherit; }
  .ut-sb:hover { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
  .ut-sb:active { background: color-mix(in srgb, var(--accent) 26%, var(--panel)); }
  .ut-sb svg { width: 12px; height: 12px; }
  .ut-arrows .ut-sb { border-left: 0; }
  .ut-arrows .ut-sb + .ut-sb { border-top: 0; }
  .ut-arrows .ut-sb:first-child { border-top-right-radius: calc(var(--ut-r) - 3px); }
  .ut-arrows .ut-sb:last-child { border-bottom-right-radius: calc(var(--ut-r) - 3px); }
  .ut-spin.split .ut-sb { width: 42px; flex: none; font-size: 20px; }
  .ut-spin.split .ut-sb.dn { border-radius: calc(var(--ut-r) - 3px) 0 0 calc(var(--ut-r) - 3px); border-right: 0; }
  .ut-spin.split .ut-sb.up { border-radius: 0 calc(var(--ut-r) - 3px) calc(var(--ut-r) - 3px) 0; border-left: 0; }
  .ut-unit { align-self: center; margin-left: 10px; color: var(--muted); font-size: 15px; }
  .ut-card.flow { position: relative; margin: 16px auto 24px; }
  .ut-scroll > .ut-list, .ut-scroll > .ut-doc { flex: 1 1 auto; }
  .ut-list.native { scrollbar-width: thin; }
  .ut-list.native::-webkit-scrollbar { display: block; width: 10px; }
  .ut-list.native::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--fg) 30%, var(--panel)); border-radius: 5px; }
  .ut-list.native::-webkit-scrollbar-track { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
  .ut-result { display: flex; align-items: center; gap: 10px; min-height: 32px; padding: 0 10px; border-radius: 7px; font-size: 13.5px;
    color: var(--muted); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ut-result.bad { color: var(--fg); background: color-mix(in srgb, #e03131 10%, var(--panel)); }
  .ut-result.ok { color: var(--fg); background: color-mix(in srgb, #2f9e44 12%, var(--panel)); }
  .ut-result .ut-btn { min-width: 0; height: 26px; padding: 0 12px; margin-left: auto; font-size: 13px; }
  .ut-doc { overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none; position: relative;
    font-family: var(--ut-font); font-size: var(--ut-fs); line-height: 1.6; color: var(--fg); user-select: text; -webkit-user-select: text; }
  .ut-doc::-webkit-scrollbar { display: none; }
  .ut-doc.native { scrollbar-width: thin; }
  .ut-doc.native::-webkit-scrollbar { display: block; width: 10px; }
  .ut-doc.native::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--fg) 30%, var(--panel)); border-radius: 5px; }
  .ut-doc p { margin: 0 14px 12px 14px; }
  .ut-doc p:first-child { margin-top: 10px; }
  .ut-doc ::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit; }
  .ut-page p { margin: 0 0 14px; font-family: var(--ut-font); font-size: var(--ut-fs); line-height: 1.7; user-select: text; -webkit-user-select: text; }
  .ut-page ::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit; }
  .ut-edit .ut-input { font-family: var(--ut-font); }
  .ut-note { display: inline-flex; flex-direction: column; gap: 4px; padding: 10px 14px; border-radius: 8px; border: 1px dashed color-mix(in srgb, var(--fg) 25%, var(--line));
    background: color-mix(in srgb, #f2c200 10%, var(--panel)); }
  .ut-note .ut-text { width: auto; padding: 4px 8px; font-family: "DejaVu Sans Mono", "Liberation Mono", monospace; font-size: 16px; }
  `;
  const referenceCSS = `
      .ut-card {
        flex: none; position: relative; display: flex; flex-direction: column;
        border: 1px solid color-mix(in srgb, var(--fg) 14%, var(--line)); border-radius: var(--ut-r);
        background: var(--panel); box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 10px 28px rgba(0,0,0,.08); overflow: hidden;
      }
      .ut-bar {
        display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 14px; flex: none;
        border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 4%, var(--panel));
        font-size: 13.5px; color: var(--muted);
      }
      .ut-dots { display: flex; gap: 6px; }
      .ut-dots i { width: 10px; height: 10px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 18%, var(--panel)); }
      .ut-file { font-weight: 600; color: var(--fg); letter-spacing: .01em; }
      .ut-bar .ut-tag { margin-left: auto; font-size: 12px; padding: 2px 8px; border-radius: 10px;
        background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--accent); font-weight: 600; }
      .ut-body { padding: var(--ut-pad); display: flex; gap: var(--ut-gap); }
      .ut-body.col { flex-direction: column; }
      .ut-body.row { flex-direction: row; align-items: flex-start; }
      .ut-status { flex: none; height: 28px; padding: 0 12px; display: flex; align-items: center; gap: 14px;
        border-top: 1px solid var(--line); font-size: 12.5px; color: var(--muted);
        background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); white-space: nowrap; overflow: hidden; }
      .ut-h { margin: 0 0 2px; font-size: 20px; font-weight: 700; color: var(--fg); }
      .ut-sub { margin: 0; font-size: 14px; color: var(--muted); }

      .ut-boxes { display: flex; gap: var(--ut-gap); }
      .ut-boxes.row { flex-direction: row; align-items: flex-start; }
      .ut-boxes.col { flex-direction: column; }
      .ut-boxes.wrap { flex-wrap: wrap; }
      .ut-src { display: flex; flex-direction: column; gap: 6px; flex: none; }
      .ut-src-title { font-size: 12.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
      .ut-text {
        width: var(--ut-bw); padding: 10px 12px; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line));
        border-radius: calc(var(--ut-r) - 2px); background: color-mix(in srgb, var(--panel) 55%, var(--bg));
        font-family: var(--ut-font); font-size: var(--ut-fs); line-height: 1.5; color: var(--fg);
        user-select: text; -webkit-user-select: text; cursor: text; outline: none; overflow-wrap: break-word;
      }
      .ut-text:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
      .ut-text ::selection, .ut-text::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit; }
      .ut-text.lines { padding: 6px 0; white-space: pre; overflow-wrap: normal; }
      .ut-ln { display: flex; padding: 0 12px 0 0; line-height: var(--ut-lh); min-height: var(--ut-lh); }
      .ut-ln .ut-num { flex: none; width: 2.6em; padding-right: .8em; text-align: right; color: var(--muted); opacity: .8; }
      .ut-text.lines.plain .ut-ln { padding-left: 12px; }

      .ut-fieldrow { display: flex; flex-direction: column; gap: 6px; }
      .ut-fieldrow.inline { flex-direction: row; align-items: center; gap: 12px; }
      .ut-label { font-size: 15px; font-weight: 600; color: var(--fg); white-space: nowrap; }
      .ut-input {
        width: var(--ut-fw); height: var(--ut-ih); padding: 0 11px; margin: 0;
        border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line)); border-radius: calc(var(--ut-r) - 3px);
        background: var(--panel); color: var(--fg); font: inherit; font-size: 16px; outline: none;
        user-select: text; -webkit-user-select: text; caret-color: var(--accent);
      }
      .ut-input::placeholder { color: var(--muted); opacity: .75; }
      .ut-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
      .ut-input:disabled { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); color: var(--muted); cursor: not-allowed; }

      .ut-scroll { display: flex; flex: none; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line));
        border-radius: calc(var(--ut-r) - 2px); overflow: hidden; background: color-mix(in srgb, var(--panel) 55%, var(--bg)); }
      .ut-list { overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none;
        font-family: var(--ut-font); font-size: var(--ut-fs); color: var(--fg); user-select: text; -webkit-user-select: text; }
      .ut-list::-webkit-scrollbar { display: none; }
      .ut-list .ut-ln { white-space: pre; height: var(--ut-lh); padding-right: 14px; }
      .ut-list.plain .ut-ln { padding-left: 14px; }
      .ut-list .ut-ln.head { font-weight: 700; }
      .ut-track { position: relative; flex: none; width: 14px; border-left: 1px solid var(--line);
        background: color-mix(in srgb, var(--fg) 5%, var(--panel)); cursor: pointer; touch-action: none; }
      .ut-thumb { position: absolute; left: 2px; right: 2px; border-radius: 5px; cursor: grab; touch-action: none;
        background: color-mix(in srgb, var(--fg) 32%, var(--panel)); }
      .ut-thumb:hover, .ut-thumb.dragging { background: color-mix(in srgb, var(--fg) 52%, var(--panel)); }

      .ut-actions { display: flex; gap: 10px; justify-content: flex-end; align-items: center; }
      .ut-btn { min-width: 92px; height: 38px; padding: 0 16px; border-radius: calc(var(--ut-r) - 3px); font: inherit;
        font-weight: 600; cursor: pointer; border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line));
        background: var(--panel); color: var(--fg); }
      .ut-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
      .ut-btn:disabled { opacity: .45; cursor: not-allowed; }
      .ut-btn.pressed { outline: 3px solid color-mix(in srgb, var(--accent) 35%, transparent); }
      .ut-hint { font-size: 12.5px; color: var(--muted); margin-right: auto; }
      .ut-hint.ok { color: var(--accent); }

      .ut-flow { width: var(--ut-bw); font-size: 16px; line-height: 2.1; }
      .ut-flow > div { line-height: 1.6; margin: 4px 0; color: var(--fg); }
      .ut-flow .ut-btn { min-width: 0; height: 34px; margin: 2px 8px 2px 0; vertical-align: middle; }
      .ut-flow .ut-input { height: 32px; vertical-align: middle; margin: 2px 6px 2px 0; }
      .ut-flow span.lbl { margin-right: 6px; color: var(--fg); }

      .ut-spin { display: flex; align-items: stretch; height: 46px; }
      .ut-spin .ut-input { width: var(--ut-sw); height: 46px; text-align: center; font-size: 19px; font-variant-numeric: tabular-nums;
        border-radius: 0; cursor: default; }
      .ut-spin.stacked .ut-input { text-align: left; border-radius: calc(var(--ut-r) - 3px) 0 0 calc(var(--ut-r) - 3px); }
      .ut-arrows { display: flex; flex-direction: column; }
      .ut-sb { width: 34px; flex: 1; padding: 0; border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line)); background: color-mix(in srgb, var(--fg) 5%, var(--panel));
        color: var(--fg); cursor: pointer; display: flex; align-items: center; justify-content: center; font: inherit; }
      .ut-sb:hover { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); }
      .ut-sb:active { background: color-mix(in srgb, var(--accent) 26%, var(--panel)); }
      .ut-sb svg { width: 12px; height: 12px; }
      .ut-arrows .ut-sb { border-left: 0; }
      .ut-arrows .ut-sb + .ut-sb { border-top: 0; }
      .ut-arrows .ut-sb:first-child { border-top-right-radius: calc(var(--ut-r) - 3px); }
      .ut-arrows .ut-sb:last-child { border-bottom-right-radius: calc(var(--ut-r) - 3px); }
      .ut-spin.split .ut-sb { width: 42px; flex: none; font-size: 20px; }
      .ut-spin.split .ut-sb.dn { border-radius: calc(var(--ut-r) - 3px) 0 0 calc(var(--ut-r) - 3px); border-right: 0; }
      .ut-spin.split .ut-sb.up { border-radius: 0 calc(var(--ut-r) - 3px) calc(var(--ut-r) - 3px) 0; border-left: 0; }
      .ut-unit { align-self: center; margin-left: 10px; color: var(--muted); font-size: 15px; }
      .ut-card.flow { position: relative; margin: 16px auto 24px; }
      .ut-scroll > .ut-list, .ut-scroll > .ut-doc { flex: 1 1 auto; }
      .ut-list.native { scrollbar-width: thin; }
      .ut-list.native::-webkit-scrollbar { display: block; width: 10px; }
      .ut-list.native::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--fg) 30%, var(--panel)); border-radius: 5px; }
      .ut-list.native::-webkit-scrollbar-track { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
      .ut-result { display: flex; align-items: center; gap: 10px; min-height: 32px; padding: 0 10px; border-radius: 7px; font-size: 13.5px;
        color: var(--muted); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
      .ut-result.bad { color: var(--fg); background: color-mix(in srgb, #e03131 10%, var(--panel)); }
      .ut-result.ok { color: var(--fg); background: color-mix(in srgb, #2f9e44 12%, var(--panel)); }
      .ut-result .ut-btn { min-width: 0; height: 26px; padding: 0 12px; margin-left: auto; font-size: 13px; }
      .ut-doc { overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none; position: relative;
        font-family: var(--ut-font); font-size: var(--ut-fs); line-height: 1.6; color: var(--fg); user-select: text; -webkit-user-select: text; }
      .ut-doc::-webkit-scrollbar { display: none; }
      .ut-doc.native { scrollbar-width: thin; }
      .ut-doc.native::-webkit-scrollbar { display: block; width: 10px; }
      .ut-doc.native::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--fg) 30%, var(--panel)); border-radius: 5px; }
      .ut-doc p { margin: 0 14px 12px 14px; }
      .ut-doc p:first-child { margin-top: 10px; }
      .ut-doc ::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit; }
      .ut-page p { margin: 0 0 14px; font-family: var(--ut-font); font-size: var(--ut-fs); line-height: 1.7; user-select: text; -webkit-user-select: text; }
      .ut-page ::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit; }
      .ut-edit .ut-input { font-family: var(--ut-font); }
      .ut-note { display: inline-flex; flex-direction: column; gap: 4px; padding: 10px 14px; border-radius: 8px; border: 1px dashed color-mix(in srgb, var(--fg) 25%, var(--line));
        background: color-mix(in srgb, #f2c200 10%, var(--panel)); }
      .ut-note .ut-text { width: auto; padding: 4px 8px; font-family: "DejaVu Sans Mono", "Liberation Mono", monospace; font-size: 16px; }
      `;
  env.template('handle-text/_style', () => ({ editorCSS, referenceCSS }));
})();
