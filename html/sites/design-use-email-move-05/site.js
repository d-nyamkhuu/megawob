// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  window.drawDraftBackdrop = function () {
    if (document.querySelector('.cad-shell')) return;
    const root = document.createElement('div'); root.className = 'cad-shell'; root.setAttribute('aria-hidden','true');
    const iconPaths = ['M3 2h12v16H3z M6 6h6 M6 10h6','M2 7h6l2-3h7v12H2z','M3 2h14v16H3z M6 2v6h8V2 M6 12h8v6H6','M3 8V3h12v5 M2 8h15v7H2z M5 12h9v6H5','M16 6H5l4-4 M5 6l4 4','M2 6h11l-4-4 M13 6l-4 4','M3 3h12v12H3z M6 6h12v12H6','M8 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12 M12 12l6 6 M8 5v6 M5 8h6','M2 16L16 2 M2 2h14v14','M3 3h12v12H3z M2 8h16 M8 2v16','M3 3l13 13 M16 3L3 16','M3 16L9 2l8 14z'];
    const icon = (i,x,y,color='#9ac7df') => `<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.4" fill="none">${'<path d="'+iconPaths[i%iconPaths.length]+'"/>'}</g>`;
    let s = '<svg viewBox="0 0 1672 941" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cadbar" x2="0" y2="1"><stop stop-color="#405363"/><stop offset="1" stop-color="#293b4b"/></linearGradient></defs>';
    s += '<path fill="url(#cadbar)" d="M0 26h1672v64H0z"/><path stroke="#667989" d="M0 51h1672 M0 89h1672"/><text x="36" y="44" fill="#e7edf3" font-size="14" font-family="Tahoma,Arial">File　 Edit　 View　 Insert　 Format　 Tools　 Draw　 Dimension　 Modify　 Parametric　 Window　 Help</text>';
    for(let i=0;i<30;i++) s += icon(i,12+i*33,61,i%5===0?'#e6c75c':'#8ec9ee');
    s += '<path stroke="#cbd6df" stroke-width="2" d="M1128 70h75"/><g fill="#33495c" stroke="#7890a4"><rect x="1216" y="59" width="188" height="24"/><rect x="1429" y="59" width="180" height="24"/></g><g fill="#ecf2f6" font-size="14" font-family="Tahoma,Arial"><text x="1248" y="76">ByLayer</text><text x="1458" y="76">ByLayer</text></g>';
    s += '<path fill="#344959" stroke="#5f7787" d="M0 90h42v790H0z"/>';
    for(let i=0;i<19;i++) s += icon(8+i,11,113+i*32,'#a2cadf');
    s += '<g fill="none" stroke="#00b6dc" stroke-width="1.2"><rect x="123" y="194" width="118" height="504"/><rect x="129" y="200" width="105" height="452"/><path d="M139 202v449 M224 202v449 M123 698h118 M123 654h118"/>';
    for(let i=0;i<8;i++) s += `<rect x="143" y="${236+i*50}" width="76" height="37"/><path stroke-dasharray="9 4" d="M147 ${242+i*50}h67v24h-67z"/>`;
    s += '<path d="M45 697h744 M717 149v-18h200v18 M732 90v43 M897 90v43 M1292 112v726 M818 90v790 M574 90v95" stroke-dasharray="13 5"/></g>';
    s += '<g fill="none" stroke="#ffe300" stroke-width="1.5"><path d="M90 194v459 M82 194h36 M82 653h36 M124 151v36 M241 151v36 M125 166h115"/><path fill="#ffe300" d="M90 194l-4 12h8z M90 653l-4-12h8z M125 166l10-4v8z M240 166l-10-4v8z"/></g><g fill="#ffe300" font-size="15" font-family="Arial"><text x="170" y="161">600</text><text transform="translate(84 445) rotate(-90)">2000</text></g>';
    s += '<g stroke="#fff" fill="none"><path d="M60 830v-48 M60 830h43 M60 782l-3 7h6z M103 830l-7-3v6z"/></g><g fill="#fff" font-size="16" font-family="Arial"><text x="55" y="775">Y</text><text x="109" y="832">X</text></g>';
    s += '<path fill="#223241" stroke="#536778" d="M1454 90h218v821h-218z M1454 372h218 M1454 404h218"/><g fill="#dce9f5" font-family="Tahoma,Arial" font-size="14"><text x="1464" y="115">Project Files</text><text x="1653" y="115">×</text></g>';
    const files=['Network_Rack_Layout.dwg','Floor_Plan.dwg','Campus_Site.dwg','Rack_Details.dwg','Notes.txt','Materials.xlsx'];
    files.forEach((f,i)=>{if(!i)s+='<rect x="1460" y="130" width="205" height="30" fill="#28669e"/>';s+=icon(i<4?0:2,1469,138+i*32,i===5?'#85c8a2':'#a6d7f5')+`<text x="1495" y="${151+i*32}" fill="#edf2f7" font-family="Tahoma,Arial" font-size="14">${f}</text>`;});
    s += '<g fill="#dce9f5" font-family="Tahoma,Arial" font-size="14"><text x="1464" y="394">Properties</text><text x="1466" y="430">No selection</text><text x="1466" y="470" font-weight="bold">General</text></g>';
    const props=[['Color','□ ByLayer'],['Layer','0'],['Linetype','— ByLayer'],['Linetype scale','1.000'],['Lineweight','— ByLayer'],['Transparency','0'],['View',''],['Center X','2150.000'],['Center Y','1030.000'],['Center Z','0.000'],['Height','2500.000'],['Width','4000.000']];
    props.forEach((p,i)=>s+=`<path stroke="#384e60" d="M1456 ${481+i*30}h214"/><text x="1467" y="${502+i*30}" fill="#d8e1eb" font-family="Tahoma,Arial" font-size="13">${p[0]}</text><text x="1576" y="${502+i*30}" fill="#d8e1eb" font-family="Tahoma,Arial" font-size="13">${p[1]}</text>`);
    s += '<path fill="#2a3d4e" stroke="#516574" d="M0 881h1454v29H0z M0 910h1672v31H0z"/><path fill="#3b4e5e" stroke="#64798b" d="M89 881h79v26h-64z M168 881h75v26h-75z M243 881h75v26h-75z"/><g fill="#dce4ed" font-family="Tahoma,Arial" font-size="13"><text x="114" y="899">Model</text><text x="181" y="899">Layout1</text><text x="256" y="899">Layout2</text><text x="333" y="899">＋</text><text x="11" y="931">2473.506, 1182.664, 0.000</text></g></svg>';
    root.innerHTML=s; document.body.append(root);
  };
  env.site({
    name: 'design-use-email-move-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'classic',
        'brand': 'DraftPro 2014   -   Network_Rack_Layout.dwg',
        'nav': '',
        'bg': '#061b29',
        'surface': '#f7f8fa',
        'fg': '#172232',
        'line': '#aab8c5',
        'title': 'linear-gradient(180deg,#457eae,#24608e)',
        'control': '#f4f6f8',
        'accent': '#d9ecfa',
        'accentfg': '#16334c',
        'sel': '#c9e3f6',
        'selfg': '#fff',
        'font': '"Segoe UI",Tahoma,Arial,sans-serif',
        'note': 'right:2%;top:10%;width:23%',
        'end': 'right:2%;top:1%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-move-05',
        'scenario': 'move',
        'platform': 'desktop',
        'account': '—　▣　×',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 40,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => { window.drawDraftBackdrop(); },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
