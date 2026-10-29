// Yosemite Finder design on the shared explorer, retaining the template's actions.
function yosemiteIcon(name, size = 24) {
  const paths = {
    folder:'<path d="M2 6h8l2 3h18v19H2z"/><path d="M2 12h28"/>',
    clock:'<circle cx="16" cy="16" r="13"/><path d="M16 6v11h8"/>',
    people:'<circle cx="16" cy="10" r="5"/><path d="M7 28v-5c0-8 18-8 18 0v5z"/><path d="M6 9a4 4 0 0 0 0 8M26 9a4 4 0 0 1 0 8M1 26v-5l6-4M31 26v-5l-6-4"/>',
    grid:'<path d="M5 5h5v5H5zM14 5h5v5h-5zM23 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5zM23 14h5v5h-5zM5 23h5v5H5zM14 23h5v5h-5zM23 23h5v5h-5z"/>',
    list:'<path d="M4 7h24M4 16h24M4 25h24"/>',
    columns:'<path d="M3 6h26v21H3zM12 6v21M21 6v21"/>',
    gear:'<path d="M13 2h6l1 5 4-2 4 5-3 4 5 1v6l-5 1 2 4-5 4-4-3-1 4h-6l-1-5-4 2-4-5 3-4-4-1v-6l5-1-2-4 5-4 4 3z"/><circle cx="16" cy="17" r="5"/>',
    share:'<path d="M9 13H4v17h24V13h-5M16 22V2M9 9l7-7 7 7"/>',
    tag:'<path d="M15 7H4v18h11l13-9z"/><circle cx="10" cy="16" r="2"/>',
    cursor:'<path d="M5 2v26l7-7 6 11 5-3-6-10h10z" fill="currentColor" stroke="none"/>',
    menu:'<rect x="5" y="3" width="22" height="27" rx="2"/><path d="M9 9h14M9 14h14M9 19h11M9 24h8"/>',
    command:'<path d="M10 10h12v12H10zM10 10H6a4 4 0 1 1 4-4v4M22 10V6a4 4 0 1 1 4 4h-4M22 22h4a4 4 0 1 1-4 4v-4M10 22v4a4 4 0 1 1-4-4h4"/>',
    shift:'<path d="M16 2 2 17h8v14h12V17h8z"/>',
    marquee:'<path stroke-dasharray="4 3" d="M2 2h28v28H2z"/>',
    triangle:'<path d="m10 3 15 13-15 13z" fill="currentColor" stroke="none"/>',
    undo:'<path d="m14 4-11 9 11 8v-6h5c10 0 11 8 8 15 10-13 0-20-8-19h-5z" fill="currentColor" stroke="none"/>',
    cloud:'<path d="M8 25a7 7 0 1 1 0-14 9 9 0 0 1 17-1 7 7 0 0 1-1 15z"/>',
    desktop:'<rect x="2" y="3" width="28" height="21" rx="2"/><path d="M16 24v6M8 30h16"/>',
    disk:'<path d="M6 2h20l4 26-2 3H4l-2-3zM3 24h26M9 5h14"/><circle cx="24" cy="28" r="1"/>',
    download:'<circle cx="16" cy="16" r="14" fill="currentColor" stroke="none"/><path d="M16 6v18m-7-8 7 8 7-8" stroke="white"/>',
    apps:'<path d="m7 29 12-26M25 29 13 3M3 22h26"/>',
    search:'<circle cx="13" cy="13" r="9"/><path d="m20 20 9 9"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.folder}</svg>`;
}
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-open-05',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'use-file-manager/explorer',
  design: {
      titleHeight: 86, toolbarHeight: 58, statusHeight: 0, margin: 0, windowRadius: 8,
      fontSize: 15, nameFontSize: 14, detailFontSize: 13, folderTone: '#1599f4', tileGap: 20,
      lightsChance: 1, panel: '#fff', line: '#d2d5da', accent: '#1689ef',
      fg: '#20232a', muted: '#737b86',
    parts: {
      fit(base, S) { return (ctx) => {
        // Preserve the template's seeded draws, then fit this full-stage design.
        base(ctx);
        S.geo = { left: Math.round(ctx.size.width * .018), top: Math.round(ctx.size.height * .035), winW: Math.round(ctx.size.width * .964), winH: Math.round(ctx.size.height * .925) };
      }; },
      paneSize(base, S) { return (ctx) => {
        base(ctx);
        const { winW, winH } = S.geo;
        const recentW = Math.round(winW * .21);
        const treeW = Math.round(winW * .184);
        const railW = Math.round(winW * .133);
        S.geo = { treeW, paneW: winW - railW - treeW - recentW - 12,
          paneH: winH - S.D.titleHeight - S.D.toolbarHeight - 70 };
        S.els.win.style.setProperty('--fm-recent-width', recentW + 'px');
        S.els.win.style.setProperty('--fm-rail-width', railW + 'px');
      }; },
      css(base, S) { return (ctx) => base(ctx) + `
        .fm-win { box-sizing: border-box; }
        .fm-title { padding: 0 12px; gap: 10px; }
        .fm-title .lights { gap: 8px; }
        .fm-title .lights i { width: 16px; height: 16px; }
        .fm-bar { gap: 10px; padding: 0 12px; }
        .fm-ib { height: 34px; min-width: 34px; padding: 0 9px; }
        .fm-ib svg { width: 18px; height: 18px; }
        .fm-crumbs { height: 36px; }
        .fm-tree { box-sizing: border-box; padding: 8px 8px; }
        .fm-tr { min-height: 31px; font-size: 14px; }
        .fm-tr svg.fi { width: 22px; height: 22px; }
        .fm-pane { padding: 20px 18px; }
        .fm-tile { gap: 8px; }
        .fm-title b { display: none; }
      `; },
      title(base, S) { return (ctx) => {
        base(ctx);
        const title = S.els.title;
        const tabs = ctx.util.el('div', 'fm-app-tabs', title);
        for (const [icon, label, selected] of [['folder', 'Browse Files', true], ['clock', 'Recent Items', false], ['people', 'Shared', false]]) {
          const tab = ctx.util.el('div', selected ? 'fm-app-tab selected' : 'fm-app-tab', tabs);
          ctx.util.el('span', 'fm-tab-icon', tab).innerHTML = yosemiteIcon(icon, 28);
          ctx.util.el('span', '', tab, label);
        }
        const nav = ctx.util.el('div', 'fm-top-nav', title);
        for (const glyph of ['‹', '›']) {
          const b = ctx.util.el('button', 'fm-top-control fm-top-arrow', nav, glyph);
          b.type = 'button'; b.setAttribute('aria-label', glyph === '‹' ? 'Back' : 'Forward');
        }
        const group = ctx.util.el('div', 'fm-top-tools', title);
        const controls = [['▦', 'Icon view'], ['☷', 'List view'], ['◫', 'Column view']];
        for (const [glyph, label] of controls) {
          const b = ctx.util.el('button', 'fm-top-control', group, glyph);
          b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        }
        const search = ctx.util.el('div', 'fm-search', title);
        ctx.util.el('span', 'fm-search-icon', search, '⌕');
        ctx.util.el('span', 'fm-search-label', search, 'Search');
      }; },
      toolbar(base, S) { return (ctx) => {
        base(ctx);
        const {bar, crumbs, win, title} = S.els;
        const crumbRow = ctx.util.el('div', 'fm-path-row', win);
        crumbRow.appendChild(crumbs);
        const views = ctx.util.el('div', 'fm-native-views', bar);
        for (const [index, icon] of ['grid','list','columns'].entries()) {
          const b = ctx.util.el('button', 'fm-native-control' + (index === 0 ? ' active' : ''), views);
          b.type = 'button'; b.title = ['Icon view','List view','Column view'][index];
          b.innerHTML = yosemiteIcon(icon, 19);
        }
        bar.insertBefore(views, S.els.undoBtn);
        for (const icon of ['gear','share','tag']) {
          const b = ctx.util.el('button', 'fm-native-control fm-extra-tool', bar);
          b.type = 'button'; b.title = {gear:'Actions',share:'Share',tag:'Tags'}[icon];
          b.innerHTML = yosemiteIcon(icon,20);
        }
        const search = title.querySelector('.fm-search');
        bar.appendChild(search);
        search.querySelector('.fm-search-icon').innerHTML = yosemiteIcon('search',17);
      }; },
      tileSize(base, S) { return (m, groups) => {
        const original = base(m, groups);
        const rows = Math.max(1, groups.reduce((sum, g) => sum + Math.ceil(g.ids.length / S.spec.cols), 0));
        const available = S.geo.paneH - 40 - (S.spec.grouped ? groups.length * 26 : 0) - groups.length * 12 - Math.max(0, rows - groups.length) * S.D.tileGap;
        const tileH = Math.min(180, Math.floor(available / rows));
        if (tileH < 94) return original;
        return {tileH, iconPx:Math.min(94,tileH-76,S.sizes.tileW-20), lines:2};
      }; },
      tile(base, S) { return (m, id, height, iconSize, lines, box) => {
        const tile = base(m,id,height,iconSize,lines,box);
        const H = env.taskDef.helpers;
        const detail = H.isFolder(id) ? `${H.childrenOf(m,S.spec,id).length} items` : H.itemOf(S.spec,id).size;
        if (height > 110) S.ctx.util.el('div','fm-tile-detail',tile,detail);
        return tile;
      }; },
      folderSvg(base, S) { return (size, cls='fi', tone) => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="yosemiteFolder" x2="0" y2="1"><stop stop-color="#54c7f6"/><stop offset="1" stop-color="#77d1f4"/></linearGradient></defs><path d="M3 22q0-5 5-5h22q4 0 7 7l2 2h53q5 0 5 5v8H3z" fill="#8eddfb"/><rect x="3" y="29" width="94" height="66" rx="5" fill="url(#yosemiteFolder)"/><path d="M8 30h84" stroke="#60d3ff" stroke-width="2"/></svg>`; },
      fileSvg(base, S) { return (kind, extension, size) => {
        const ext = String(extension || '').toLowerCase();
        const badge = /doc|word/.test(ext) ? ['W','#1262b7'] : /xls|sheet/.test(ext) ? ['X','#21863d'] : /pdf/.test(ext) ? ['PDF','#ee242c'] : null;
        return `<svg width="${size}" height="${size}" viewBox="0 0 80 100" aria-hidden="true"><defs><linearGradient id="yosemitePaper" x2="0" y2="1"><stop stop-color="#f8f8f8"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><path d="M12 3h42l22 22v69q0 4-4 4H12q-4 0-4-4V7q0-4 4-4z" fill="url(#yosemitePaper)" stroke="#bfc2c5" stroke-width="1.5"/><path d="M54 3v22h22" fill="#e9e9e9" stroke="#bfc2c5"/><path d="M17 15h25M17 24h25M17 37h47M17 46h47M17 55h47M17 64h47M17 73h47M17 82h47" stroke="#c4c7ca" stroke-width="2"/>${badge ? `<rect x="0" y="33" width="35" height="45" rx="2" fill="${badge[1]}" stroke="#fff" stroke-width="2"/><text x="17" y="63" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="${badge[0].length>1?12:32}">${badge[0]}</text>`:''}</svg>`;
      }; },
      drawBar(base, S) { return (m) => {
        base(m);
        const label = S.els.win.querySelector('.fm-preview-name');
        if (label) label.textContent = S.els.crumbEls[m.cwd]?.textContent || 'Folder';
      }; },
      body(base, S) { return (ctx) => {
        base(ctx);
        const rail = ctx.util.el('aside','fm-favorites',S.els.win);
        const section = (text) => ctx.util.el('div','fm-favorite-section',rail,text);
        const entry = (icon,text,selected=false,color=null) => {
          const row=ctx.util.el('div','fm-favorite'+(selected?' selected':''),rail);
          const ic=ctx.util.el('span','fm-favorite-icon',row);
          if(color) {ic.classList.add('fm-tag-dot');ic.style.background=color;}
          else ic.innerHTML=yosemiteIcon(icon,22);
          ctx.util.el('span','',row,text);
        };
        section('Favorites');
        for(const [ic,text] of [['disk','All My Files'],['cloud','iCloud Drive'],['apps','Applications'],['desktop','Desktop'],['menu','Documents'],['download','Downloads']]) entry(ic,text,text==='Documents');
        section('Devices'); entry('disk','Macintosh HD'); section('Tags');
        for(const [text,color] of [['Red','#ff5851'],['Orange','#ff9832'],['Yellow','#f7c134'],['Green','#52c747'],['Blue','#13a4ef'],['Purple','#ac61e4'],['Gray','#94999e']]) entry('tag',text,false,color);
        entry('tag','All Tags…');
        const recent = ctx.util.el('aside', 'fm-recent', S.els.bodyEl);
        ctx.util.el('div', 'fm-recent-title', recent, '');
        const preview = ctx.util.el('div','fm-folder-preview',recent);
        ctx.util.el('div','fm-preview-icon',preview).innerHTML=S.P.folderSvg(90);
        const previewCopy=ctx.util.el('div','fm-preview-copy',preview);
        ctx.util.el('strong','fm-preview-name',previewCopy,'Folder');
        ctx.util.el('div','fm-preview-kind',previewCopy,'Folder');
        const entries = [
          ['cursor', 'Double-click a file to open it.', '', '#fff'],
          ['menu', 'Right-click for more options.', '', '#fff'],
          ['command', 'Hold ⌘ to select multiple items.', '', '#fff'],
          ['shift', 'Hold ⇧ to select a range.', '', '#fff'],
          ['marquee', 'Drag to select multiple items.', '', '#fff'],
          ['folder', 'Drag items to move or copy them into a folder.', '', '#fff'],
          ['triangle', 'Hover over a folder in the sidebar while dragging to open it.', '', '#fff'],
          ['undo', 'Press ⌘Z to undo your last action.', '', '#fff'],
        ];
        recent.classList.add('fm-tips');
        ctx.util.el('div', 'fm-tips-heading', recent, 'Tips');
        for (const [icon, name, date, color] of entries) {
          const row = ctx.util.el('div', 'fm-recent-row', recent);
          const thumb = ctx.util.el('span', 'fm-recent-thumb', row);
          thumb.innerHTML = yosemiteIcon(icon,28);
          const text = ctx.util.el('span', 'fm-recent-copy', row);
          ctx.util.el('span', 'fm-recent-name', text, name);
          ctx.util.el('span', 'fm-recent-date', text, date);
        }
      }; },
    },
  },
});
