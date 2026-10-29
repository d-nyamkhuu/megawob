// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-bulk-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'mac',
        'brand': 'File   Edit   Message   Window',
        'nav': '',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#080808',
        'line': '#111',
        'title': 'repeating-linear-gradient(0deg,#fff 0 1px,#555 1px 2px)',
        'control': '#fff',
        'accent': '#fff',
        'accentfg': '#000',
        'sel': '#050505',
        'selfg': '#fff',
        'font': '"DejaVu Sans Mono",monospace',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-bulk-05',
        'scenario': 'delete',
        'platform': 'desktop',
        'account': 'Mon Apr 14  10:24 AM',
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
        frame: () => function(ctx) {
          const E = (tag, cls, parent, value) => ctx.util.el(tag, cls, parent, value);
          for (const [key, value] of Object.entries({panel:'#fff',fg:'#0b1730',muted:'#65718a',line:'#e1e8f0',accent:'#1765d5'})) document.documentElement.style.setProperty('--'+key,value);
          const title = E('header','my-title',document.body);
          const logo = E('span','my-logo',title);
          logo.innerHTML = '<svg viewBox="0 0 44 36"><rect width="44" height="36" rx="5" fill="#4285ed"/><path d="M2 3L22 21 42 3" fill="none" stroke="white" stroke-width="3"/><path d="M2 34L16 21M42 34L28 21" fill="none" stroke="#2464c6" stroke-width="2"/></svg>';
          E('span','my-name',title,'Mail');
          let mode = ctx.display || 'header';
          if (window.innerWidth < 1150 && (mode === 'panel' || mode === 'toast')) mode = 'header';
          if (mode === 'header') {
            const note = E('aside','my-instr my-instr-head',title);
            E('span','my-info',note,'ⓘ'); E('span','',note,ctx.instruction);
          }
          const menu = E('nav','my-menu',document.body);
          for (const label of ['File','Edit','View','Go','Message','Tools','Help']) {
            const b=E('button','',menu,label); b.type='button';
            b.addEventListener('click',()=>env.log('decoy',{label}));
          }
          const stage=E('main','stage my-stage',document.body);
          if (mode === 'panel') {
            const note=E('aside','my-instr my-instr-panel',document.body);
            E('strong','',note,'Your task'); E('span','',note,ctx.instruction);
          } else if (mode === 'toast') {
            const note=E('aside','my-instr my-instr-toast',document.body);
            E('span','my-info',note,'ⓘ'); E('span','',note,ctx.instruction);
            const x=E('button','my-close',note,'×'); x.type='button'; x.setAttribute('aria-label','Close');
            x.addEventListener('click',()=>{note.hidden=true;env.log('note-close')});
          }
          const footer=E('footer','my-footer',document.body);
          const er=ctx.rng.fork('chrome/end');
          const source=(ctx.content&&ctx.content.END_LABELS)||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
          const words=source.map(x=>typeof x==='string'?x:x.label||x.text||x.name||String(x));
          const home=er.bool(.5), place=home?'footer':er.pick(['footer','header','link','icon']);
          const label=home?'Submit':er.pick(words);
          let submit=null;
          if (!ctx.finish) {
            const parent=(place==='header'||place==='icon')?title:footer;
            submit=E(place==='link'?'a':'button','my-submit my-submit-'+place,parent,place==='icon'?'✓':label);
            if(submit.tagName==='BUTTON')submit.type='button';else submit.href='#';
            submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;
            submit.addEventListener('click',e=>{e.preventDefault();ctx.submit()});
            const cr=ctx.rng.fork('chrome/collide');
            if(cr.bool(.3)){
              const choices=[...new Set(words)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
              if(choices.length){const t=cr.pick(choices);const d=E('button','my-extra',footer,t);d.type='button';d.dataset.role='xtra';d.addEventListener('click',()=>env.log('decoy',{label:t,collide:true}));}
            }
          }
          return {stage,submit};
        },
      },
    },
  });
})();
