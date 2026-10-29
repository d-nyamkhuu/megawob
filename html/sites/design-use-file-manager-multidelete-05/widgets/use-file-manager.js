// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-multidelete-05',
  name: 'design',
  split: 'train',
  scenarios: ['multidelete'],
  template: 'use-file-manager/explorer',
  design: {
    folderTone: '#62a8e5', fontSize: 16, nameFontSize: 15, detailFontSize: 14, titleHeight: 0, toolbarHeight: 0, tileGap: 24,
    parts: {
      folderSvg: () => (size, cls = 'fi') => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="folder-face" x2="0" y2="1"><stop stop-color="#7cb9ee"/><stop offset="1" stop-color="#69abe3"/></linearGradient></defs><path d="M5 19Q5 11 13 11H32L43 20H88Q95 20 95 27V75Q95 84 87 84H13Q5 84 5 76Z" fill="#438dce" stroke="#3e84c4"/><path d="M6 33Q6 26 14 26H31L42 22H87Q95 22 95 31V76Q95 84 87 84H13Q6 84 6 76Z" fill="url(#folder-face)" stroke="#579bd6" stroke-width="1.3"/></svg>`,
      fileSvg: () => (kind, extension, size) => {
        const ext = String(extension || '').replace(/^\./, '').toLowerCase();
        const type = String(kind || '').toLowerCase();
        const is = (list) => list.includes(ext);
        const svg = (body, view = '0 0 100 100') => `<svg class="gnome-file" width="${size}" height="${size}" viewBox="${view}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
        const paper = `<defs><linearGradient id="paper-fill" x2="0" y2="1"><stop stop-color="#f8f9fb"/><stop offset="1" stop-color="#e9ebf0"/></linearGradient></defs><path d="M17 3H69L85 20V91Q85 97 79 97H17Q11 97 11 91V9Q11 3 17 3Z" fill="url(#paper-fill)" stroke="#d2d5de" stroke-width="1.4"/><path d="M69 3V17Q69 21 74 21H85" fill="#c7cbd4"/>`;
        if (is(['pdf']) || type === 'pdf') return svg(`<defs><linearGradient id="pdf-fill" x2="0" y2="1"><stop stop-color="#fa555c"/><stop offset="1" stop-color="#e41e28"/></linearGradient></defs><path d="M17 3H69L85 20V91Q85 97 79 97H17Q11 97 11 91V9Q11 3 17 3Z" fill="url(#pdf-fill)"/><path d="M69 3V21H85" fill="#ff8b91"/><path d="M31 70C34 63 48 60 57 60C68 60 71 56 66 54C59 51 45 46 44 36C42 21 54 30 48 44C44 57 34 73 30 72C25 71 30 66 36 63" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round"/>`);
        if (is(['zip','rar','7z','tar','gz']) || /archive|compressed/.test(type)) return svg(`<defs><linearGradient id="zip-fill" x2="1" y2="0"><stop stop-color="#eabf75"/><stop offset="1" stop-color="#d7a44d"/></linearGradient></defs><rect x="12" y="4" width="76" height="92" rx="7" fill="url(#zip-fill)" stroke="#cda058"/><path d="M49 5V72" stroke="#b18a4d" stroke-width="9"/><path d="M47 7h5m-5 5h5m-5 5h5m-5 5h5m-5 5h5m-5 5h5m-5 5h5m-5 5h5m-5 5h5m-5 5h5" stroke="#f6d794" stroke-width="2"/><rect x="46" y="61" width="8" height="15" rx="2" fill="#f5d990"/><path d="M48 67h4v5h-4z" fill="#a78047"/>`);
        if (is(['m4a','mp3','wav','flac','ogg','aac']) || /audio|music/.test(type)) return svg(`${paper}<path d="M48 37L70 31V65C70 75 54 78 53 69C52 63 60 60 65 62V43L47 48V72C46 81 30 82 30 73C30 66 40 64 43 67V43Q43 39 48 37" fill="#3d3e40"/>`);
        if (is(['xlsx','xls','ods','csv']) || /spreadsheet/.test(type)) {
          let cells = ''; for (let y=0;y<7;y++) for(let x=0;x<5;x++) cells += `<rect x="${13+x*16}" y="${27+y*8}" width="15" height="7" fill="${x+y>4?'#7abb9b':y%2?'#f2f6f4':'#fff'}" stroke="#d7e1dc" stroke-width=".5"/>`;
          return svg(`<rect x="2" y="15" width="96" height="67" rx="3" fill="#fff" stroke="#c7cdd2"/><text x="9" y="24" font-size="3.5" fill="#75aaa0">Worksheet</text>${cells}<path d="M10 31H92M10 47H92M10 63H92" stroke="#c8d7d1" stroke-width=".5"/>`);
        }
        if (is(['jpg','jpeg','png','webp','avif','heic','gif','svg']) || /image|photo|graphic/.test(type)) return svg(`<defs><linearGradient id="land-sky" x2="0" y2="1"><stop stop-color="#6986ae"/><stop offset=".6" stop-color="#d8b5c5"/><stop offset="1" stop-color="#8c9cad"/></linearGradient><linearGradient id="land-water" x2="0" y2="1"><stop stop-color="#adb1bf"/><stop offset="1" stop-color="#424c59"/></linearGradient></defs><rect x="1" y="18" width="98" height="66" rx="2" fill="#fff" stroke="#adb2bc"/><path d="M4 21H96V80H4Z" fill="url(#land-sky)"/><path d="M4 55L16 47L23 50L35 39L44 45L58 38L69 48L82 44L96 51V67H4Z" fill="#283443"/><path d="M4 59Q25 53 47 58T96 56V80H4Z" fill="url(#land-water)"/><path d="M4 68L15 64L27 68L40 64L51 72L65 68L74 76L96 72V80H4Z" fill="#20292d"/><path d="M5 81H95" stroke="#fff" opacity=".7"/>`);
        if (is(['mp4','mov','webm','mkv','avi']) || /video/.test(type)) return svg(`<rect x="1" y="18" width="98" height="66" rx="2" fill="#fff" stroke="#adb2bc"/><path d="M4 21H96V80H4Z" fill="#bab6a7"/><path d="M4 21H39V62H4Z" fill="#686a64"/><path d="M43 24H76V49H43Z" fill="#dce2df"/><path d="M49 24V49M67 24V49" stroke="#90968f" stroke-width="2"/><path d="M4 65L96 57V80H4Z" fill="#706355"/><path d="M21 56L63 49L90 61L46 73Z" fill="#a19379"/><circle cx="69" cy="41" r="5" fill="#c2a58f"/><path d="M64 47Q71 43 77 52L82 65L64 69Z" fill="#283039"/><circle cx="35" cy="46" r="5" fill="#c7af97"/><path d="M30 52L39 50L48 64L32 66Z" fill="#333c45"/><path d="M51 56L63 54L69 60L57 62Z" fill="#242b2f"/>`);
        return svg(`${paper}<path d="M25 29H68M25 37H70M25 45H68M25 53H69M25 61H64M25 69H67M25 77H48" stroke="#c1c6d1" stroke-width="3.5" stroke-linecap="round"/>`);
      },
      tile: (base, S) => (m, id, height, iconSize, lines, box) => {
        const tile = base(m, id, height, iconSize, lines, box);
        tile._label.style.webkitLineClamp = '2';
        const item = env.taskDef.helpers.itemOf(S.spec, id);
        if (item && item.size) S.ctx.util.el('div', 'sz', tile, item.size);
        return tile;
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { bar, backBtn, upBtn, undoBtn, trashBtn, crumbs } = S.els;
        undoBtn.innerHTML = S.D.icons.undo;
        const host = document.querySelector('.gnome-toolbar');
        // The old toolbar holds frame controls, so kit cleanup leaves it intact.
        // Keep those controls (and their handlers) while replacing our toolbar.
        const endTools = document.querySelector('.ref-task > .ref-tools') || host?.querySelector('.gnome-end-tools');
        if (host) host.replaceChildren(bar);
        const existing = [...bar.querySelectorAll('.fm-ib')].filter(b => ![backBtn,upBtn,undoBtn,trashBtn].includes(b));
        const left = ctx.util.el('div', 'gnome-nav-tools', bar);
        left.append(backBtn);
        const forward = ctx.util.el('button', 'fm-ib', left, '→'); forward.disabled = true; forward.title = 'Forward';
        left.append(upBtn);
        for (const b of existing) left.append(b);
        left.append(undoBtn, trashBtn);
        bar.prepend(left); bar.append(crumbs);
        const searchBox = ctx.util.el('label', 'gnome-search', bar);
        ctx.util.el('span', '', searchBox, '⌕');
        const input = ctx.util.el('input', '', searchBox); input.type = 'search'; input.placeholder = 'Search in Reference'; input.setAttribute('aria-label','Search files');
        const filter = () => {for (const tile of S.els.pane.querySelectorAll('[data-id]')) tile.style.display = (tile.textContent || '').toLowerCase().includes(input.value.toLowerCase()) ? '' : 'none';};
        input.addEventListener('input', filter); input.addEventListener('keydown', e => {if(e.key === 'Escape'){input.value='';filter();}});
        S.searchInput = input;
        const right = ctx.util.el('div','gnome-view-tools',bar);
        for (const [title, mark] of [['Icon view','▦'],['List view','☷'],['More options','⋮']]) {const b=ctx.util.el('button','fm-ib',right,mark);b.title=title;b.addEventListener('click',()=>ctx.log('decoy',{label:title}));}
        if (endTools) {endTools.classList.add('gnome-end-tools');bar.append(endTools);}
      },
      drawBar: (base, S) => m => {base(m);if(S.searchInput){const name=S.els.crumbs.lastElementChild?.textContent||'Reference';S.searchInput.placeholder=`Search in ${name}`;if(S.searchFolder!==m.cwd){S.searchFolder=m.cwd;S.searchInput.value='';}}},
      drawTree: (base, S) => m => {
        base(m);
        const rows = Object.keys(S.els.treeRows).length;
        if (S.ctx.size.height < rows * 36 + 360) return;
        const places = S.ctx.util.el('div','gnome-places',S.els.tree);
        for (const [icon,label] of [['◷','Recent'],['☆','Starred'],['⌂','Home'],['▤','Documents'],['↓','Downloads'],['▧','Pictures'],['♫','Music'],['◫','Videos'],['♜','Trash']]) {const row=S.ctx.util.el('div','gnome-place',places);S.ctx.util.el('span','',row,icon);S.ctx.util.el('span','',row,label);}
        S.els.tree.prepend(places);
      },
    },
  },
});
