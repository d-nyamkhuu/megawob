// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-undo-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'industrial',
        'brand': 'File   Edit   View   Go   Message   Tools   Help',
        'nav': '',
        'bg': '#c9c8c3',
        'surface': '#e4e3df',
        'fg': '#171717',
        'line': '#777671',
        'title': 'linear-gradient(#790b16,#5a0710)',
        'control': 'linear-gradient(#f4f3ef,#c9c8c3)',
        'accent': '#7a1019',
        'accentfg': '#fff',
        'sel': '#771019',
        'selfg': '#fff',
        'font': 'Arial, Helvetica, sans-serif',
        'note': 'right:1%;top:15%;width:20%',
        'end': 'right:1%;bottom:1%',
        'geo': {
          'folders': 'left:0%;top:14%;width:15%;height:86%',
          'ledger': 'left:15%;top:31%;width:66%;height:36%',
          'document': 'right:0%;top:14%;width:19%;height:86%',
          'editor': 'left:15%;top:67%;width:66%;height:33%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-undo-05',
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
        'frame': () => (ctx) => {
          const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
          document.body.dataset.design = 'linux';
          const root = E('div', 'linux-shell', document.body);
          const display = ctx.display || 'header';
          root.dataset.display = display;
          const work = E('div', 'linux-work', root);
          const stage = E('main', 'linux-stage', work);
          if (display !== 'hidden') {
            const note = E('aside', 'linux-note', display === 'panel' ? work : root);
            note.dataset.display = display;
            E('b', '', note, 'Task');
            E('div', '', note, ctx.instruction);
            if (display === 'header') root.prepend(note);
          }
          const footer = E('footer', 'linux-footer', root);
          E('span', 'linux-ready', footer, 'Ready');
          let submit = null;
          if (!ctx.finish) {
            const r = ctx.rng.fork('chrome/end');
            const home = r.bool(.5);
            const place = home ? 'footer' : r.pick(['header', 'link']);
            const labels = (ctx.content.END_LABELS || ['OK', 'Done', 'Apply']).map(x => typeof x === 'string' ? x : x.label || x.text || String(x));
            const label = home ? 'OK' : r.pick(labels);
            let host = footer;
            if (place === 'header') { host = E('div', 'linux-command', root); root.prepend(host); }
            submit = E('button', 'linux-end ' + (place === 'link' ? 'as-link' : ''), host, label);
            submit.type = 'button'; submit.title = label; submit.setAttribute('aria-label', label);
            submit.addEventListener('click', () => ctx.submit());
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(.3)) {
              const choices = labels.filter(x => x !== label);
              const word = choices.length ? cr.pick(choices) : 'Ready';
              const extra = E('button', 'linux-extra', host, word);
              host.insertBefore(extra, submit);
              extra.addEventListener('click', () => env.log('decoy', {label:word, collide:true}));
            }
          }
          return {stage, submit};
        },
        'overlay': () => (ctx) => {
          const E=(tag,cls,p,text)=>ctx.util.el(tag,cls,p,text);
          const box=E('aside','perturb '+ctx.kind,document.body); box.setAttribute('role','dialog');
          const promo=ctx.kind==='promo';
          const headings={cookie:'Cookie preferences',toast:'Mail synchronized',chat:'Mail support',promo:'Thunderbird Newsletter',banner:'Service announcement'};
          const title=E('h3','',box,headings[ctx.kind] || 'Mail');
          const close=E('button','overlay-close',title,'×'); close.setAttribute('aria-label','Close'); close.addEventListener('click',()=>ctx.dismiss());
          E('h4','',box,promo?'Stay in the loop!':'Mozilla Thunderbird');
          E('p','',box,promo?'Get the latest Thunderbird news, tips, and features. Stay informed, delivered to your inbox.':ctx.kind==='cookie'?'Choose which cookies we may use.':ctx.kind==='banner'?'Scheduled maintenance tonight.':'Your mailbox is up to date.');
          if(promo){const input=E('input','',box);input.placeholder='you@example.com';input.setAttribute('aria-label','Email address');}
          const row=E('div','overlay-actions',box);
          if(promo){const sub=E('button','',row,'Subscribe');sub.addEventListener('click',()=>ctx.dismiss());}
          const dismiss=E('button','',row,promo?'No thanks':ctx.kind==='cookie'?'Reject optional':'Dismiss');
          dismiss.addEventListener('click',()=>ctx.dismiss());
          return {el:box,dismiss:close};
        },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
