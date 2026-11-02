/* use-file-manager/_assets: explorer CSS, icons and default design tokens. */
(function () {
  'use strict';
  env.template('use-file-manager/_assets', () => {
    const CSS = (D) => `
  .fm-win { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: ${D.panel}; color: ${D.fg};
    border: 1px solid ${D.line}; border-radius: ${D.windowRadius}px; box-shadow: 0 2px 4px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.1);
    user-select: none; -webkit-user-select: none; font-size: ${D.fontSize}px; }
  .fm-title { flex: none; position: relative; display: flex; align-items: center; gap: 10px; height: ${D.titleHeight}px; padding: 0 12px;
    background: color-mix(in srgb, ${D.fg} 5%, ${D.panel}); border-bottom: 1px solid ${D.line}; }
  .fm-title .lights { display: flex; gap: 6px; }
  .fm-title .lights i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; }
  .fm-title .lights i:nth-child(2) { background: #febc2e; }
  .fm-title .lights i:nth-child(3) { background: #28c840; }
  .fm-title b { font-size: 12.5px; font-weight: 600; color: ${D.muted}; }
  .fm-bar { flex: none; display: flex; align-items: center; gap: 6px; height: ${D.toolbarHeight}px; padding: 0 10px; border-bottom: 1px solid ${D.line}; min-width: 0; }
  .fm-ib { flex: none; height: 30px; min-width: 30px; padding: 0 8px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    border: 1px solid transparent; border-radius: 6px; background: transparent; color: ${D.fg}; font: ${D.controlFont}; font-size: ${D.fontSize}px; cursor: pointer; }
  .fm-ib:hover { background: color-mix(in srgb, ${D.fg} 7%, transparent); }
  .fm-ib[disabled] { opacity: .35; cursor: default; }
  .fm-ib svg { width: 16px; height: 16px; }
  .fm-crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 2px; height: 30px; padding: 0 6px; border: 1px solid ${D.line};
    border-radius: 6px; background: color-mix(in srgb, ${D.fg} 2%, ${D.panel}); overflow: hidden; }
  .fm-crumb { flex: 0 1 auto; min-width: 0; max-width: 150px; padding: 3px 6px; border-radius: 4px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fm-crumb:hover, .fm-crumb.drop { background: color-mix(in srgb, ${D.accent} 14%, transparent); }
  .fm-crumb.cur { font-weight: 650; }
  .fm-sep { flex: none; color: ${D.muted}; font-size: ${D.detailFontSize}px; }
  .fm-body { flex: 1; min-height: 0; display: flex; }
  .fm-tree { flex: none; overflow: hidden; padding: 8px 6px; border-right: 1px solid ${D.line}; background: color-mix(in srgb, ${D.fg} 2.5%, ${D.panel}); }
  .fm-tr { display: flex; align-items: center; gap: 4px; padding-right: 8px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
  .fm-tr:hover { background: color-mix(in srgb, ${D.fg} 6%, transparent); }
  .fm-tr.cur { background: color-mix(in srgb, ${D.accent} 15%, transparent); font-weight: 600; }
  .fm-tr.drop { background: color-mix(in srgb, ${D.accent} 28%, transparent); outline: 1px dashed ${D.accent}; }
  .fm-tr .chev { flex: none; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; color: ${D.muted}; border-radius: 3px; }
  .fm-tr .chev:hover { background: color-mix(in srgb, ${D.fg} 10%, transparent); }
  .fm-tr .chev svg { width: 10px; height: 10px; transition: none; }
  .fm-tr .chev.open svg { transform: rotate(90deg); }
  .fm-tr .lb { overflow: hidden; text-overflow: ellipsis; }
  .fm-tr svg.fi { flex: none; width: 16px; height: 16px; }
  .fm-main { flex: 1; min-width: 0; position: relative; display: flex; flex-direction: column; }
  .fm-pane { flex: 1; min-height: 0; position: relative; overflow: hidden; padding: 10px 12px; }
  .fm-ghdr { display: flex; align-items: center; gap: 8px; height: 24px; margin-top: 2px; font-size: ${D.detailFontSize}px; font-weight: 650; color: ${D.muted}; }
  .fm-ghdr::after { content: ''; flex: 1; height: 1px; background: ${D.line}; }
  .fm-tiles { display: grid; padding: 6px; column-gap: ${D.tileGap}px; row-gap: ${D.tileGap}px; align-content: start; }
  .fm-tile { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 4px; padding: 6px 4px 4px;
    border: 1px solid transparent; border-radius: 7px; cursor: default; min-width: 0; }
  .fm-tile:hover { background: color-mix(in srgb, ${D.fg} 5%, transparent); }
  .fm-tile.sel { background: color-mix(in srgb, ${D.accent} 16%, transparent); border-color: color-mix(in srgb, ${D.accent} 45%, transparent); }
  .fm-tile.drop, .fm-row.drop { background: color-mix(in srgb, ${D.accent} 28%, transparent); border-color: ${D.accent}; }
  .fm-tile.cut, .fm-row.cut { opacity: .45; }
  .fm-tile .ic { flex: none; display: flex; align-items: center; justify-content: center; }
  .fm-tile .nm { width: 100%; text-align: center; font-size: ${D.nameFontSize}px; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; word-break: break-word; }
  .fm-pane.compact .fm-ghdr { height: 20px; margin-top: 0; }
  .fm-pane.compact .fm-tiles { padding-top: 3px; padding-bottom: 3px; row-gap: 4px; }
  .fm-pane.compact .fm-tile { gap: 2px; padding-top: 3px; padding-bottom: 3px; }
  .fm-pane.compact .fm-tile .nm { font-size: 11.5px; line-height: 1.2; }
  .fm-ren { width: 100%; box-sizing: border-box; padding: 2px 4px; border: 1px solid ${D.accent}; border-radius: 4px; outline: 0; background: ${D.panel};
    color: ${D.fg}; font: ${D.controlFont}; font-size: ${D.nameFontSize}px; user-select: text; -webkit-user-select: text; }
  .fm-lhead, .fm-row { display: grid; align-items: center; column-gap: 10px; padding: 0 8px; }
  .fm-lhead { height: 28px; font-size: ${D.detailFontSize}px; font-weight: 650; color: ${D.muted}; border-bottom: 1px solid ${D.line}; }
  .fm-row { border: 1px solid transparent; border-radius: 5px; white-space: nowrap; }
  .fm-row:hover { background: color-mix(in srgb, ${D.fg} 5%, transparent); }
  .fm-row.sel { background: color-mix(in srgb, ${D.accent} 16%, transparent); border-color: color-mix(in srgb, ${D.accent} 40%, transparent); }
  .fm-row .nm { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .fm-row .nm span { overflow: hidden; text-overflow: ellipsis; }
  .fm-row .dim { color: ${D.muted}; font-size: ${D.detailFontSize}px; overflow: hidden; text-overflow: ellipsis; }
  .fm-rect { position: absolute; z-index: 5; border: 1px solid ${D.accent}; background: color-mix(in srgb, ${D.accent} 14%, transparent); pointer-events: none; }
  .fm-status { flex: none; display: flex; align-items: center; gap: 16px; height: ${D.statusHeight}px; padding: 0 12px; border-top: 1px solid ${D.line}; font-size: ${D.detailFontSize}px; color: ${D.muted}; }
  .fm-menu { position: absolute; z-index: 40; min-width: 176px; padding: 5px; border: 1px solid ${D.line}; border-radius: 8px; background: ${D.panel};
    box-shadow: 0 12px 30px rgba(0,0,0,.2); }
  .fm-mi { display: flex; align-items: center; justify-content: space-between; gap: 18px; height: 28px; padding: 0 10px; border-radius: 5px; cursor: pointer; white-space: nowrap; }
  .fm-mi:hover { background: ${D.accent}; color: #fff; }
  .fm-mi kbd { font: ${D.controlFont}; font-size: 11.5px; opacity: .6; }
  .fm-mi.dis { color: ${D.muted}; cursor: default; }
  .fm-mi.dis:hover { background: transparent; color: ${D.muted}; }
  .fm-msep { height: 1px; margin: 4px 6px; background: ${D.line}; }
  .fm-ghost { position: absolute; z-index: 45; display: flex; align-items: center; gap: 6px; padding: 5px 9px; border-radius: 6px; pointer-events: none;
    background: ${D.panel}; border: 1px solid ${D.accent}; box-shadow: 0 8px 22px rgba(0,0,0,.2); font-size: ${D.detailFontSize}px; font-weight: 600; opacity: .93; }
  .fm-ghost .n { padding: 0 6px; border-radius: 9px; background: ${D.accent}; color: #fff; font-size: 11px; }
  .fm-viewer { position: absolute; inset: 10px; z-index: 30; display: flex; flex-direction: column; border: 1px solid ${D.line}; border-radius: 9px;
    background: ${D.panel}; box-shadow: 0 16px 40px rgba(0,0,0,.25); }
  .fm-viewer .vh { flex: none; display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 8px 0 14px; border-bottom: 1px solid ${D.line}; font-weight: 650; }
  .fm-viewer .vh span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fm-viewer .vb { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: ${D.muted}; }
  .fm-toast { position: absolute; z-index: 25; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; align-items: center; gap: 12px;
    padding: 8px 10px 8px 14px; border-radius: 8px; background: ${D.toastBackground}; color: ${D.toastColor}; box-shadow: 0 8px 24px rgba(0,0,0,.25); white-space: nowrap; max-width: 92%; }
  .fm-toast span.t { overflow: hidden; text-overflow: ellipsis; }
  .fm-toast .u { color: ${D.undoColor}; font-weight: 700; cursor: pointer; padding: 2px 6px; border-radius: 4px; }
  .fm-toast .x { color: ${D.dismissColor}; cursor: pointer; padding: 0 4px; }
  `;

  const SVG = (inner, cls = '', vb = '0 0 24 24') => `<svg class="${cls}" viewBox="${vb}">${inner}</svg>`;
  const ICON = {
    back: SVG('<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    up: SVG('<path d="M12 19V6M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    undo: SVG('<path d="M9 7H4V2M4.5 7A8 8 0 1 1 4 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    trash: SVG('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>'),
    grid: SVG('<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" stroke-width="1.7"/>'),
    share: SVG('<path d="M12 15V3M7 8l5-5 5 5M5 13v7h14v-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
    chev: SVG('<path d="M8 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  };
  const KIND_COLOR = { document: '#1c7ed6', text: '#495057', spreadsheet: '#2b8a3e', presentation: '#e8590c', image: '#ae3ec9', video: '#c92a2a',
    audio: '#d6336c', archive: '#868e96', data: '#0c8599', web: '#1971c2', design: '#7048e8' };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const TOKENS = {
    panel: 'var(--panel)',
    fg: 'var(--fg)',
    line: 'var(--line)',
    accent: 'var(--accent)',
    muted: 'var(--muted)',
    fontSize: 13,
    nameFontSize: 12,
    detailFontSize: 12,
    controlFont: 'inherit',
    windowRadius: 10,
    margin: 10,
    titleHeight: 34,
    toolbarHeight: 44,
    statusHeight: 26,
    tileGap: 10,
    treeIndent: 14,
    folderTone: '#f2b52f',
    kindColors: KIND_COLOR,
    fileFallbackColor: '#868e96',
    icons: ICON,
    titleLabels: ['Files', 'File Explorer', 'Finder', 'Drive', 'Documents', 'Storage'],
    separators: ['›', '/', '▸'],
    lightsChance: 0.6,
    listHeadings: ['Name', 'Date modified', 'Kind', 'Size'],
    emptyText: 'This folder is empty.',
    previewText: 'Preview is not available for this file.',
    toastBackground: '#23262e',
    toastColor: '#f1f3f7',
    undoColor: '#8fb8ff',
    dismissColor: '#aab',
  };
    return { CSS, SVG, MON, TOKENS };
  });
})();
