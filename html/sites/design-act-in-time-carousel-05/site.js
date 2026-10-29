// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  const art = {
    new:'<path d="M8 3h12l7 7v20H8zM20 3v8h7"/>',
    open:'<path d="M3 9h11l3 4h14v17H3zM3 9V5h11l3 4h14v4"/>',
    print:'<path d="M8 12V3h18v9M8 23H3V12h28v11h-5M8 18h18v13H8zM11 23h12M11 27h12M8 7h14"/>',
    events:'<path d="M7 3h15l7 7v21H7zM22 3v8h7"/><circle cx="17" cy="18" r="3"/><path d="M12 26v-3c0-4 10-4 10 0v3z"/>',
    calendar:'<path d="M4 7h26v24H4zM4 13h26M10 3v8M24 3v8M9 18h3m4 0h3m4 0h3M9 23h3m4 0h3m4 0h3M9 27h3m4 0h3"/>',
    news:'<path d="M6 3h23v28H6zM10 7h6v7h-6zM20 8h5M20 12h5M10 18h15M10 22h15M10 26h11"/>',
    contacts:'<circle cx="13" cy="10" r="5"/><circle cx="24" cy="12" r="4"/><path d="M3 29v-6c0-10 20-10 20 0v6zM23 18c7 0 9 4 9 9h-8"/>',
    books:'<path d="M3 7h5v24H3zM11 3h6v28h-6zM20 7l6-1 5 24-6 1zM4 11h3M12 8h4M22 11l5-1"/>',
    document:'<path d="M7 3h15l7 7v21H7zM22 3v8h7M11 15h14M11 19h14M11 23h14M11 27h10"/>',
  };
  const building='<svg viewBox="0 0 180 140" fill="#f1f0ec" stroke="currentColor" stroke-width="1.5"><path d="M4 132h173M22 128V75h137v53M18 76l72-36 73 36zM27 72l63-27 63 27zM29 82h122M30 122h121M26 126h129M32 131h117"/><path d="M76 42V21h28v21M72 22l18-10 18 10zM81 20v-7h18v7M90 12V1M86 7h8"/><path d="M82 26h16v16H82zM88 27v13M94 27v13"/><circle cx="90" cy="63" r="7"/><path d="M90 58v6l4 2"/><g fill="#ddd"><path d="M43 84h9v36h-9zM68 84h9v36h-9zM102 84h9v36h-9zM128 84h9v36h-9z"/></g><g fill="#333"><path d="M31 89h6v12h-6zM31 107h6v12h-6zM57 89h6v12h-6zM57 108h6v11h-6zM86 90h9v30h-9zM116 89h6v12h-6zM116 108h6v11h-6zM144 89h7v12h-7zM144 108h7v11h-7z"/></g><path d="M5 128c-6-16 5-19 8-11-3-14 8-19 12-8 9-6 14 10 5 19M155 128c-5-15 5-21 9-14 1-15 12-13 12-2 10 5 2 16-2 16"/></svg>';
  const icon=(u,parent,name)=>{const el=u.el('span','lisa-icon',parent);el.innerHTML=name==='building'?building:'<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.8">'+(art[name]||art.news)+'</svg>';return el;};
  env.site({
    name: 'design-act-in-time-carousel-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-carousel-05',
        'brand': 'Riverton Community Center',
        'title': 'Riverton Community Center',
        'instruction': 'top',
        'rail': 'Announcements|Events|Programs|Facilities|Local Resources|News Archive',
        'menu': 'File|Edit|View|Go|Compose|Tools|Window|Help',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            _c.nav = null;
            if (C.menu) {
              _c.nav = u.el('nav', 'ds-menu', document.body);
              C.menu.split('|').forEach((t) => u.el('span', '', _c.nav, t));
              const bar = u.el('div', 'lisatoolbar', document.body);
              [['new','New'],['open','Open'],['print','Print'],['events','Events'],['calendar','Calendar'],['news','Bulletin'],['contacts','Contacts']].forEach(([name, label], i) => {
                const item = u.el('div', 'lisatool', bar);
                if (i === 3 || i === 5) item.classList.add('lisatool-sep');
                icon(u,item,name);
                u.el('span', 'lisatool-label', item, label);
              });
              const updates = u.el('aside', 'lisa-updates', document.body);
              u.el('h2', '', updates, 'Community Updates');
              [['document','3 Announcements'],['calendar','5 Upcoming Events'],['contacts','2 New Programs'],['news','1 News Item']].forEach(([name, label]) => {
                const row = u.el('div', 'lisa-update', updates);
                icon(u,row,name);
                u.el('span', '', row, label);
              });
              u.el('div', 'lisa-today-title', updates, 'Today');
              u.el('div', 'lisa-date', updates, 'Mon, Apr 9, 1984');
              const clock=u.el('div','lisa-clock',updates);
              let ticks='';for(let i=0;i<12;i++){const a=i*Math.PI/6;ticks+='<path d="M'+(80+68*Math.sin(a))+','+(80-68*Math.cos(a))+' '+(80+63*Math.sin(a))+','+(80-63*Math.cos(a))+'"/>';}
              clock.innerHTML='<svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="80" cy="80" r="78"/>'+ticks+'<g fill="currentColor" stroke="none" text-anchor="middle" font-family="Georgia,serif" font-size="20"><text x="80" y="27">12</text><text x="138" y="87">3</text><text x="80" y="146">6</text><text x="18" y="87">9</text></g><path stroke-width="3.5" d="M80 80L46 53M80 80L128 74"/><circle cx="80" cy="80" r="5" fill="currentColor"/></svg>';
              const identity = u.el('aside', 'lisa-identity', document.body);
              const mark=u.el('div', 'lisa-mark', identity);mark.innerHTML=building;
              u.el('strong', '', identity, 'Riverton\nCommunity Center');
              const navitems = u.el('div', 'lisa-navitems', identity);
              [['news','Announcements'],['calendar','Events'],['contacts','Programs'],['books','Facilities'],['document','Local Resources'],['news','News Archive']].forEach(([name, label], i) => {
                const row = u.el('div', 'lisa-navrow', navitems);
                if (i === 0) row.classList.add('current');
                icon(u,row,name);
                u.el('span', '', row, label);
              });
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, top, u } = _c;
            const er = ctx.rng.fork('chrome/end');
            const labels = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x));
            const submitWord = labels.find((x) => x.trim().toLowerCase() === 'done') || labels[0] || 'Done';
            const classic = er.bool(0.5);
            const placement = classic ? 'footer' : er.pick(['header', 'link']);
            const label = classic ? submitWord : er.pick(labels);
            const cr = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (cr.bool(0.3)) {
              const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (options.length)
                _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'header', 'footer']) };
            }
            const makeEnd = (parent, cls, text, tag = 'button') => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            const decoy = (parent, text) => {
              const b = u.el('button', 'ds-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            _c.submit = null;
            if (_c.nav && (placement === 'header' || (_c.collide && _c.collide.where === 'header'))) {
              const tools = u.el('span', 'ds-menu-tools', _c.nav);
              if (_c.collide && _c.collide.where === 'header') decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            } else if (_c.collide && _c.collide.where === 'header') {
              const tools = u.el('span', 'ds-menu-tools', _c.nav || top);
              decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            }
            if (_c.collide && _c.collide.where === 'footer') decoy(foot, _c.collide.label);
            if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', label);
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›');
            Object.assign(_c, { classic, cr, decoy, er, label, labels, makeEnd, placement, submitWord });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => function (_c) {
          const {ctx,u}=_c;
          const display=['panel','toast'].includes(ctx.display) && document.documentElement.clientWidth<1180?'header':ctx.display;
          document.body.dataset.lisaDisplay=display;
          document.querySelectorAll('.ds-brief,.ds-instruction,.ds-toast,.ds-note,[data-role="instruction"]').forEach(node=>node.remove());
          for(const node of document.querySelectorAll('[class^="ds-"]')) if(node.textContent.trim()===ctx.instruction)node.remove();
          if(display!=='hidden'){
            const note=u.el('section','lisa-note '+display,document.body);
            note.dataset.role='instruction';
            if(display==='panel')u.el('strong','lisa-note-title',note,'Task');
            u.el('div','lisa-note-text',note,ctx.instruction);
            if(display==='header')document.body.style.setProperty('--note-h',(note.getBoundingClientRect().height+12)+'px');
          }
          const brand=document.querySelector('.ds-brand');
          if(brand){const mark=icon(u,brand,'building');brand.insertBefore(mark,brand.firstChild);}
          const controls=document.querySelector('.ds-winctl')||document.querySelector('.ds-top > span:not(.ds-brand)');
          if(controls){controls.classList.add('ds-winctl');controls.textContent='';['−','□','×'].forEach(label=>u.el('span','lisa-window-button',controls,label));}
        },
      },
    },
  });
})();
