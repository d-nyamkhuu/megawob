// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-gov-portal-branching-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.25': (base, S) => function (_c) {
          const { rng } = _c;
          rng.bool(0.35);
          const sidebar = true;
          rng.bool(0.5);
          const nav = true;
          Object.assign(_c, { nav, sidebar });
        },
        'frame.26': () => () => {},
        'frame.34': (base, S) => function (_c) {
          const { K, TITLES } = S;
          const { content, header, lr, nav, rng, util, word } = _c;
          const icon = (parent, name) => {
        const paths = {
          seal:'M3 9h18L12 3 3 9Zm2 2v8m5-8v8m4-8v8m5-8v8M3 21h18',
          file:'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h7m-7 4h7',
          user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2Z',
          mail:'M3 5h18v14H3V5Zm0 1 9 7 9-7',
          help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 8a3 3 0 1 1 4 3c-1 1-1 1-1 3m0 3h.01',
          settings:'m9 3 1-1h4l1 3 3 1 3 1-1 4 1 3-2 3-3-1-3 2-3-1-3 1-2-3 1-3-1-3 3-1 1-3Zm6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
          chart:'M4 15h3v6H4Zm7-6h3v12h-3Zm7-6h3v18h-3Z',
          clip:'m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L12 3a4 4 0 0 1 6 6l-9 9a2 2 0 0 1-3-3l8-8',
          upload:'M12 16V3m-6 6 6-6 6 6M3 16v6h18v-6',
          refresh:'M20 8a9 9 0 1 0 1 8M20 3v6h-6',
          share:'M12 16V2m-4 4 4-4 4 4M7 9H4v13h16V9h-3',
          screen:'M3 4h18v14H3V4Zm5 18h8m-4-4v4M7 9h3v4H7m6-4h4v4h-4',
        };
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','ref-svg');
        svg.setAttribute('fill',name==='chart'?'currentColor':'none');
        svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');
        svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
        svg.setAttribute('aria-hidden','true');
        const path=document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d',paths[name]||paths.file);svg.append(path);parent.prepend(svg);
      };
          if (_c.display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
        brand.textContent='';
        const appSeal=util.el('span','ref-app-seal',brand);icon(appSeal,'seal');
        const titles=util.el('div','ref-app-titles',brand);
        util.el('strong','',titles,'Civic Support Application');
        util.el('span','ref-app-subtitle',titles,'Apply for financial support and essential living assistance');
      }
          if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // retain seeded draw sequence
        for (const item of ['Home', 'Benefits', 'Housing', 'Council Tax', 'Licences', 'Environment', 'Your Council']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
          Object.assign(_c, { icon });
        },
        'frame.35': () => () => {},
        'frame.41': (base, S) => function (_c) {
          const { decoyBtn, decoys, headerTools, icon, util, wantFooter } = _c;
          const windowTools=util.el('div','ref-window-tools',headerTools);
          for(const name of ['screen','refresh','share']) {
        const b=util.el('button','ref-window-tool',windowTools);b.type='button';
        b.setAttribute('aria-label',name);icon(b,name);
        b.addEventListener('click',()=>env.log('decoy',{label:name}));
      }
          for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
          Object.assign(_c, { windowTools });
        },
        'frame.46': (base, S) => function (_c) {
          const { body, content, icon, rng, sidebar, util } = _c;
          if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sideTitle=util.el('strong', 'ref-side-title', side, 'Civic Services');icon(sideTitle,'seal');
        rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // retain seeded draw sequence
        for (const item of ['Applications', 'My Details', 'Evidence', 'Messages', 'Guidance', 'Settings']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          icon(a,({Applications:'file','My Details':'user',Evidence:'file',Messages:'mail',Guidance:'help',Settings:'settings'})[item]);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
        },
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
        'frame.71': () => () => {},
        'frame.76': (base, S) => function (_c) {
          const { body, closeLabel, ctx, icon, util } = _c;
          const summary = util.el('aside', 'ref-summary', body);
          const summaryList = util.el('section', 'ref-summary-list', summary);
          const summaryTitle=util.el('div', 'ref-summary-title', summaryList, 'Application summary');
          icon(summaryTitle,'chart');
          const summaryItems = ['Personal information', 'Employment details', 'Dependants', 'Correspondence preferences', 'Declaration'];
          for (const item of summaryItems) {
        const row = util.el('div', 'ref-summary-row', summaryList);
        util.el('span', 'ref-summary-circle', row, '');
        const copy = util.el('div', 'ref-summary-copy', row);
        util.el('span', 'ref-summary-label', copy, item);
        util.el('small', '', copy, 'Not started');
        util.el('span', 'ref-summary-chevron', row, '›');
      }
          const docs = util.el('section', 'ref-summary-docs', summary);
          const documentsTitle=util.el('div', 'ref-summary-subtitle', docs, 'Supporting documents');
          icon(documentsTitle,'clip');
          util.el('span','ref-document-count',documentsTitle,'0');
          const upload=util.el('div', 'ref-summary-upload', docs);
          icon(upload,'upload');
          util.el('div', 'ref-summary-upload-label', upload, 'Add evidence');
          const uploadHint=util.el('div','ref-upload-hint',upload,'Drag and drop files here');
          util.el('div','',uploadHint,'or ');
          util.el('span','ref-upload-link',uploadHint.lastChild,'choose files');
          util.el('small', 'ref-summary-hint', docs, 'Accepted formats: PDF, JPG, PNG\nMax file size: 10 MB per file');
          const help = util.el('section', 'ref-summary-help', summary);
          const helpTitle=util.el('div', 'ref-summary-subtitle', help, 'Help and guidance');
          icon(helpTitle,'help');
          for (const item of ['What counts as proof of address?', 'View eligibility rules', 'List of accepted evidence', 'Contact support']) {
        const row=util.el('div', 'ref-summary-help-row', help, item);icon(row,item==='Contact support'?'mail':'file');
        util.el('span','ref-help-chevron',row,'›');
      }
          const taskPanel = body.querySelector('.ref-panel');
          if (taskPanel) summary.insertBefore(taskPanel, summaryList);
          if (_c.display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        summary.style.paddingTop=`${Math.ceil(note.getBoundingClientRect().height)+24}px`;
      }
          Object.assign(_c, { docs, documentsTitle, help, helpTitle, summary, summaryItems, summaryList, summaryTitle, taskPanel, upload, uploadHint });
        },
        'overlay.6': (base, S) => function (_c) {
          const { K } = S;
          const { el, kind, rng, text, util, word } = _c;
          if(kind==='banner') {
        const header=document.querySelector('.ref-task');
        el.style.top=`${header.getBoundingClientRect().bottom+6}px`;
      }
          if(kind==='promo') {
        const bounds=document.querySelector('.ref-body').getBoundingClientRect();
        Object.assign(el.style,{top:`${bounds.top}px`,left:`${bounds.left}px`,width:`${bounds.width}px`,height:`${bounds.height}px`,bottom:'auto',right:'auto'});
      }
          const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
          if(kind==='promo') {
        const art=util.el('div','ref-promo-art',box);util.el('div','ref-promo-paper',art);
        util.el('strong','ref-promo-title',box,'Stay informed');
      }
          util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
          if(kind==='promo') util.el('div','ref-promo-email',box,'Your email address');
          const row = util.el('div', 'ref-ov-row', box);
          Object.assign(_c, { box, row });
        },
        'overlay.7': () => () => {},
        'overlay.8': () => () => {},
        'overlay.12': (base, S) => function (_c) {
          const { el, kind, rng, row, util } = _c;
          if(kind==='chat') {
        const head=util.el('div','ref-chat-head',el);
        util.el('strong','',head,'Chat with us');head.append(row);el.prepend(head);
        for(const label of ['Help with my application','Check my eligibility','Speak to an adviser']) {
          const action=util.el('button','ref-chat-option',el,label);action.type='button';
          action.addEventListener('click',()=>env.log('overlay-click',{label}));
        }
        util.el('div','ref-chat-input',el,'Type a message…');
      }
          return { el, dismiss: _c.dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
        },
      },
    },
  });
})();
