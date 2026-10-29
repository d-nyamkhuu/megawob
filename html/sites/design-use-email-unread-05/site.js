// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-unread-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    frame(ctx) {
      const { util } = ctx;
      const win = util.el('div', 'gn-window', document.body);
      const bar = util.el('header', 'gn-header', win);
      const brand = util.el('div', 'gn-brand', bar);
      util.el('span', 'gn-brand-icon', brand, '✉');
      util.el('strong', '', brand, 'Mail');
      const search = util.el('div', 'gn-search', bar);
      util.el('span', '', search, '⌕');
      util.el('span', '', search, 'Search mail');
      const controls = util.el('div', 'gn-window-controls', bar);
      util.el('span', '', controls, '⋮');
      util.el('span', '', controls, '−');
      util.el('span', '', controls, '□');
      util.el('span', '', controls, '×');
      const stage = util.el('main', 'gn-stage', win);
      const count = util.el('div', 'gn-count', win);
      const sort = util.el('div', 'gn-list-sort', win, 'Newest first  ﹀   ☷');
      const actions = util.el('div', 'gn-message-tools', win);
      const inspector = util.el('aside', 'gn-inspector', win);
      util.el('h3', '', inspector, 'Details');
      for (const [i, title] of ['From','To','Subject','Date','Labels','Attachments'].entries()) {
        const row = util.el('div', 'gn-detail', inspector);
        if (i === 4 || i === 5) row.classList.add('gn-detail-split');
        util.el('div', '', row, title);
        util.el('div', '', row, '–');
      }
      const nav = util.el('nav', 'gn-bottom', win);
      const system = util.el('div', 'gn-system', document.body);
      const dock = util.el('div', 'gn-dock', system);
      for (const [icon,cls] of [['⠿',''],['🦊',''],['✉','active'],['▰',''],['›_',''],['⚙','']]) util.el('span', cls, dock, icon);
      util.el('div', 'gn-tray', system, '⌁   ◖))   ▣       Apr 28  11:02 AM');
      let display = ctx.display || 'header';
      if (window.innerWidth < 1200 && display === 'panel') display = 'header';
      if (window.innerHeight < 700 && display === 'toast') display = 'header';
      if (display === 'header') { bar.classList.add('has-note'); util.el('div', 'gn-task-note', bar, ctx.instruction); }
      if (display === 'panel') {
        const note = util.el('div', 'gn-panel-note', inspector);
        util.el('strong', '', note, 'Task');
        util.el('div', '', note, ctx.instruction);
        inspector.insertBefore(note, inspector.querySelector('.gn-detail'));
      }
      if (display === 'toast') {
        const note = util.el('div', 'gn-toast-note', document.body);
        util.el('div', '', note, ctx.instruction);
        const x = util.el('button', '', note, '×');
        x.addEventListener('click', () => { note.remove(); env.log('note-close'); });
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('gn-end');
        const usual = er.bool(0.68);
        const label = usual ? 'OK' : ctx.content.endLabel(er);
        const form = usual ? 'header' : er.pick(['footer','link','icon']);
        const parent = form === 'footer' || form === 'link' ? nav : bar;
        submit = util.el(form === 'link' ? 'a' : 'button', 'gn-submit gn-submit-' + form, parent, form === 'icon' ? '✓' : label);
        if (form === 'link') submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        if (er.bool(0.3)) {
          const word = label === 'OK' ? 'Submit answer' : ctx.content.collideLabel(er, label);
          const other = util.el('button', 'gn-extra', bar, word);
          other.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const { util, kind, rng } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const el = util.el('div', `gn-overlay gn-overlay-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div','gn-overlay-card',el) : el;
      util.el('div','gn-overlay-text',box,text);
      const row = util.el('div','gn-overlay-buttons',box);
      const button = (label, how, primary) => {
        const b = util.el('button',primary?'gn-overlay-primary':'',row,label);
        b.type = 'button';
        b.addEventListener('click',()=>how ? ctx.dismiss(how) : env.log('overlay-click',{label}));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') { button('Settings',null,false); button('Reject all','reject',false); dismiss=button('Accept all','accept',true); }
      else if (kind === 'promo') { dismiss=button('No thanks','close',false); button('Learn more',null,true); }
      else if (kind === 'banner') dismiss=button('Dismiss','close',false);
      else { dismiss=button('×','close',false); dismiss.setAttribute('aria-label','Close'); }
      return {el,dismiss,ttlSteps:kind==='toast'?3:0};
    },
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
        'site': 'design-use-email-unread-05',
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
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
      },
    },
  });
})();
