// Design on the shared use-file-manager/explorer template.
(function () {
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-multimove-05',
  name: 'design',
  split: 'train',
  scenarios: ['multimove'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#11171d', fg: '#e7eaf0', muted: '#b9c1ce', line: '#303a45', accent: '#3aa7f4',
    fontSize: 16, nameFontSize: 16, detailFontSize: 13, controlFont: '16px "Segoe UI", Arial, sans-serif',
    windowRadius: 8, margin: 0, titleHeight: 0, toolbarHeight: 76, statusHeight: 0, tileGap: 0,
    treeIndent: 22, folderTone: '#f7bf24', lightsChance: 0,
    titleLabels: ['Documents'], separators: ['›'],
    parts: {
      fit: (base, S) => ctx => {
        base(ctx);
        const size = ctx.size || {};
        const W = size.width ?? size.w ?? size[0] ?? S.geo.fullW;
        const H = size.height ?? size.h ?? size[1] ?? S.geo.fullH;
        S.geo = { fullW: W, fullH: H, winW: W, winH: H, left: 0, top: 0 };
      },
      css: (base) => ctx => base(ctx) + '\n.fm-title { overflow:hidden; border:0; }',
      // Re-decorate the window whenever the template redraws it (folder changes, moves).
      rendered: (base) => ctx => {
        base(ctx);
        decorate(ctx);
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => decorate(ctx));
        observer.observe(ctx.stage, { childList: true, subtree: true });
      },
      fileSvg: (_base, S) => (kind, ext, size) => {
        const suffix = String(ext || '').toLowerCase();
        const excel=/xls|csv/.test(suffix), word=/^docx?$/.test(suffix), pdf=/pdf/.test(suffix);
        const color = pdf ? '#ee3c40' : excel ? '#16834a' : word ? '#146bc4' : '#8e99a3';
        const image = /png|jpe?g|webp|gif/.test(suffix);
        const lines = image
          ? '<rect x="5" y="7" width="14" height="10" fill="#a8c7df" stroke="#333"/><path d="M6 16l4-4 3 2 2-3 3 5" fill="#6f9672" stroke="#333"/>'
          : /xls|csv/.test(suffix)
            ? '<path d="M6 9h12M6 13h12M6 17h12M10 7v12M14 7v12" stroke="#43845c" stroke-width="1.3"/>'
            : /pdf/.test(suffix)
              ? '<path d="M6 12h12M6 15h10" stroke="#c63b20" stroke-width="1.4"/>'
              : '<path d="M6 9h12M6 12h12M6 15h12M6 18h10" stroke="#4b82bd" stroke-width="1.2"/>';
        const badge=excel||word||pdf ? `<rect x="1" y="8" width="11" height="11" rx="1" fill="${color}"/><text x="6.5" y="16" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="${pdf?4.8:8}" font-weight="700">${excel?'X':word?'W':'PDF'}</text>` : '';
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 1.5h11l5 5V22H5z" fill="#f6f8fa" stroke="#aeb8c2" stroke-width="1.1"/><path d="M16 1.8v5h5" fill="#dbe3ea" stroke="#aeb8c2" stroke-width="1.1"/>${lines}${badge}</svg>`;
      },
    },
  },
});

let observer = null;
const setText = (node, value) => { if (node && node.textContent !== value) node.textContent = value; };
function decorate(ctx) {
  const win=ctx.stage.querySelector('.fm-win');
  if(!win) return;
  const bar=win.querySelector('.fm-bar'), crumbs=win.querySelector('.fm-crumbs'), tools=document.querySelector('.motif-menubar');
  if(bar && crumbs && !win.classList.contains('win-arranged')) {
    win.classList.add('win-arranged');
    if(tools) {
      const old=tools.querySelector('.win-aux');if(old)old.remove();
      const aux=document.createElement('div');aux.className='win-aux';
      for(const child of [...bar.children]) if(child.classList.contains('fm-ib') && (crumbs.compareDocumentPosition(child)&Node.DOCUMENT_POSITION_FOLLOWING)) aux.append(child);
      tools.insertBefore(aux,tools.querySelector('.ref-tools'));
    }
    const up=bar.querySelectorAll('.fm-ib')[1];
    for(const value of ['→','↓']){const arrow=document.createElement('span');arrow.className='win-address-arrow';arrow.textContent=value;bar.insertBefore(arrow,up||crumbs);}
    const folder=document.createElement('span');folder.className='win-location-folder';folder.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5a2 2 0 0 1 2-2h6l3 3h7a2 2 0 0 1 2 2v11H2z" fill="#efb521"/><path d="M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" fill="#ffd34e"/></svg>';crumbs.prepend(folder);
    const search=document.createElement('div');search.className='win-search';search.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span></span>';bar.append(search);
  }
  for(const pane of win.querySelectorAll('.fm-tiles')) {
    if(!pane.querySelector('.win-columns')){const head=document.createElement('div');head.className='win-columns';for(const label of ['Name','Date modified','Type','Size']){const cell=document.createElement('span');cell.textContent=label;head.append(cell);}pane.prepend(head);}
    for(const [i,tile] of [...pane.querySelectorAll('.fm-tile')].entries()) {
      if(tile.classList.contains('win-file-row'))continue;
      const nm=tile.querySelector('.nm'),ic=tile.querySelector('.ic');if(!nm||!ic)continue;
      tile.classList.add('win-file-row');
      const name=nm.textContent.trim(),suffix=(name.match(/\.([a-z0-9]{1,5})$/i)||[])[1]?.toLowerCase()||'';
      const types={docx:'Microsoft Word Document',doc:'Microsoft Word Document',xlsx:'Microsoft Excel Worksheet',xls:'Microsoft Excel Worksheet',csv:'Microsoft Excel Comma Separated Values File',pdf:'Adobe Acrobat Document',png:'PNG File',jpg:'JPG File',jpeg:'JPG File',txt:'Text Document',rtf:'Rich Text Document',odt:'OpenDocument Text',md:'Markdown File',pptx:'Microsoft PowerPoint Presentation',key:'Keynote Presentation'};
      const group=document.createElement('div');group.className='win-name';group.append(ic,nm);tile.prepend(group);
      const vals=[`10/${9+(i%10)}/2023 ${9+(i%3)}:${i%2?'03':'14'} AM`,types[suffix]||(suffix?suffix.toUpperCase()+' File':'File folder'),suffix?((name.length*37+i*53).toLocaleString('en-US')+' KB'):''];
      for(const [j,value] of vals.entries()){const cell=document.createElement('span');cell.className=['win-modified','win-type','win-size'][j];cell.textContent=value;tile.append(cell);}
    }
  }
  const current=win.querySelector('.fm-crumb.cur');
  const kindHeader=win.querySelector('.fm-lhead > span:nth-child(3)');if(kindHeader)setText(kindHeader,'Type');
  if(current){const name=current.textContent.trim();setText(document.querySelector('.motif-appname'),name);setText(document.querySelector('.motif-folder-copy strong'),name);setText(win.querySelector('.win-search span'),'Search '+name);const copy=document.querySelectorAll('.motif-folder-copy > span');setText(copy[2],'Path:  C:\\Users\\alex\\Documents\\'+[...win.querySelectorAll('.fm-crumb')].map(n=>n.textContent.trim()).join('\\'));}
  const status=win.querySelector('.fm-status > span');if(status)setText(document.querySelector('.win-item-count'),status.textContent);
}
})();
