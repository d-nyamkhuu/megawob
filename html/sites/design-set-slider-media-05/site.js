(function () {
  'use strict';
  const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const icons = {
    folder: 'M3 6h7l2 2h9v11H3z M3 9h18', play: 'M7 4v16l13-8z', pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
    stop: 'M5 5h14v14H5z', prev: 'M6 5v14 M19 5 9 12l10 7z', next: 'M18 5v14 M5 5l10 7-10 7z',
    full: 'M4 9V4h5 M15 4h5v5 M20 15v5h-5 M9 20H4v-5', save: 'M5 3h12l4 4v14H3V3z M7 3v7h10V3 M7 21v-7h10v7'
  };
  const el = (tag, cls, parent, text) => {
    const n = document.createElement(tag); if (cls) n.className = cls;
    if (text != null) n.textContent = text; if (parent) parent.appendChild(n); return n;
  };
  env.site({
    name: 'design-set-slider-media-05', styles: ['site.css'], scripts: [], template: 'site/base',
    design: {parts:{
    'frame.header': (base) => function(_c) {
      const app = el('div', 'player-window', document.body);
      const title = el('div', 'titlebar', app);
      el('div', 'app-mark', title, '▶'); el('span', 'app-title', title, 'Media Player');
      const win = el('div', 'window-buttons', title);
      el('span', '', win, '−'); el('span', '', win, '□'); el('span', 'window-close', win, '×');
      const menus = el('nav', 'menubar', app);
      ['File', 'Edit', 'View', 'Playback', 'Audio', 'Video', 'Subtitles', 'Tools', 'Help'].forEach(x => el('span', 'menu-item', menus, x));
      const bar = el('div', 'app-toolbar', app);
      const tool = (ic, label, divider) => { const b=el('button', `tool${divider?' divider':''}`, bar); b.type='button'; b.innerHTML=svg(icons[ic]); el('span','',b,label); return b; };
      tool('folder','Open',true); tool('play','Play'); tool('pause','Pause'); tool('stop','Stop',true);
      tool('prev','Previous'); tool('next','Next',true); tool('full','Full Screen');
      el('div','toolbar-spacer',bar);
      Object.assign(_c, {app, bar, header:app});
    },
    'frame.nav': (base) => function(_c) {},
    'frame.tools': (base) => function(_c) {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': (base) => function(_c) {
      const {app} = _c;
      const content=el('div','player-content',app);
      const main=el('main','media-column',content);
      const side=el('aside','info-column',content);
      const playlist=el('section','playlist',side);
      const ph=el('div','section-heading',playlist); el('strong','',ph,'Playlist'); el('span','muted',ph,'5 items');
      const rows=[['Coastal Horizons','4:18'],['Mountain Trails','3:52'],['City Moments','5:06'],['Rivers and Valleys','4:33'],['Golden Hour','3:17']];
      rows.forEach((row,i)=>{ const r=el('div',`playlist-row${i===0?' selected':''}`,playlist); el('div',`thumb thumb-${i+1}`,r); const t=el('div','row-copy',r); el('span','',t,row[0]); el('small','',t,row[1]); });
      const details=el('section','details',side); el('h3','',details,'Details');
      [['Title','Coastal Horizons'],['Length','4:18'],['Resolution','1920 × 1080'],['Frame rate','30 fps'],['Audio','Stereo (AAC)']].forEach(([a,b])=>{const r=el('div','detail-row',details);el('span','muted',r,a+':');el('span','',r,b);});
      const status=el('div','statusbar',app); el('span','',status,'Media Player'); el('span','status-right',status,'Ready');
      Object.assign(_c, {body:content, main, side});
    },
    'frame.panel': (base) => function(_c) {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) _c.side.prepend(panel);
    },
    'frame.stage': (base) => function(_c) {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      _c.stage.className = 'media-stage';
    },
    'frame.toast': (base) => function(_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.side.prepend(note);
    },
    'frame.footer': (base) => function(_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').textContent = 'Media Player · Ready';
        _c.app.appendChild(foot);
      }
    },
    'frame.floating': (base) => function(_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: (base) => function(ctx) {
      const box=el('div','consent-overlay',document.body); const card=el('div','consent-card',box);
      el('strong','',card,'Privacy preferences'); el('p','',card,'This media player uses essential settings to provide playback controls.');
      const b=el('button','consent-dismiss',card,'Accept'); b.type='button'; b.onclick=()=>ctx.dismiss('accept');
      return {el:box,dismiss:b};
    }
    }}
  });
})();
