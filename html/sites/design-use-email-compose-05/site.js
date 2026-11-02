// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-compose-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    frame(ctx) {
      const { util } = ctx;
      const root = util.el('div', 'sunny-page', document.body);
      const mast = util.el('header', 'sunny-mast', root);
      util.el('div', 'sunny-art sunny-art-left', mast, '☀  ♠♠ ⌂ ♠♠');
      const brand = util.el('div', 'sunny-brand', mast);
      util.el('div', 'sunny-name', brand, 'Sunnydale Community');
      util.el('div', 'sunny-tag', brand, 'O U R   T O W N  •  O U R   P E O P L E  •  O N L I N E');
      util.el('div', 'sunny-art sunny-art-right', mast, '♠♠ ⌂ ♜ ♠');
      const mode = ctx.display || 'hidden';
      if (mode === 'header') {
        root.classList.add('sunny-header-note');
        util.el('div', 'sunny-instruction sunny-instruction-header', mast, ctx.instruction);
      }
      const nav = util.el('nav', 'sunny-nav', root);
      [['⌂','Home'],['✉','Mail'],['♟','People'],['▦','Events'],['♟','Groups'],['▣','Resources']].forEach(([icon,label]) => {
        const tab = util.el('button', 'sunny-tab' + (label === 'Mail' ? ' active' : ''), nav);
        tab.type = 'button';
        util.el('span', 'sunny-tab-icon', tab, icon);
        util.el('span', '', tab, label);
        if (label !== 'Mail') tab.addEventListener('click', () => env.log('decoy', {what:'nav',label}));
      });
      const body = util.el('div', 'sunny-body', root);
      const stage = util.el('main', 'sunny-stage', body);
      const folderTitle = util.el('div', 'sunny-folder-title', body, 'Inbox');
      const searchButton = util.el('button', 'sunny-search-button', body, 'Search');
      searchButton.type = 'button';
      searchButton.addEventListener('click', () => {
        const input = stage.querySelector('.am-search input');
        if (input) input.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter',code:'Enter',bubbles:true}));
      });
      const side = util.el('aside', 'sunny-side', body);
      if (mode === 'panel' && (ctx.size?.width || document.documentElement.clientWidth) >= 1180) {
        const panel = util.el('section', 'sunny-box sunny-goal', side);
        util.el('div', 'sunny-box-title', panel, 'Community note');
        util.el('div', 'sunny-goal-copy', panel, ctx.instruction);
      } else if (mode === 'panel') {
        root.classList.add('sunny-header-note');
        util.el('div', 'sunny-instruction sunny-instruction-header', mast, ctx.instruction);
      }
      const status = util.el('section', 'sunny-box sunny-status', side);
      util.el('div', 'sunny-box-title', status, 'Mail Status');
      const statusBody = util.el('div', 'sunny-status-body', status);
      util.el('span', 'sunny-envelope', statusBody, '✉');
      const statusRows = util.el('div', 'sunny-status-rows', statusBody);
      [['Inbox:','8'],['Drafts:','1'],['Sent Mail:','24'],['Trash:','3']].forEach(([a,b]) => {
        const row = util.el('div', 'sunny-status-row', statusRows);
        util.el('span','',row,a); util.el('span','',row,b);
      });
      const meter = util.el('div','sunny-meter',status);
      util.el('div','sunny-meter-fill',meter);
      util.el('div','sunny-meter-caption',status,'18 MB of 50 MB used');
      const today = util.el('section','sunny-box sunny-today',side);
      util.el('div','sunny-box-title',today,'Today');
      const todayBody = util.el('div','sunny-today-body',today);
      util.el('div','sunny-date',todayBody,'▦  Sunday, April 14, 1996');
      util.el('div','sunny-no-events',todayBody,'No upcoming events today.');
      const scene = util.el('div','sunny-scene',side);
      util.el('div','sunny-scene-sky',scene,'☁');
      util.el('div','sunny-scene-town',scene,'♠ ⌂ ♜ ⌂ ♠');
      util.el('div','sunny-scene-water',scene,'〰〰〰〰〰〰');
      util.el('div','sunny-scene-tree',scene,'♣');
      util.el('div','sunny-scene-bench',scene,'▰');
      if (mode === 'toast') {
        const note = util.el('div','sunny-toast',root);
        util.el('span','',note,ctx.instruction);
        const x = util.el('button','',note,'×'); x.type='button'; x.setAttribute('aria-label','Close');
        x.addEventListener('click',()=>{note.style.display='none';env.log('note-close');});
      }
      const foot = util.el('footer','sunny-foot',root);
      const r = ctx.rng.fork('sunny/end');
      const sampledLabel = ctx.content.endLabel(r);
      const baseline = r.bool(0.5);
      const label = baseline ? 'Save' : sampledLabel;
      const place = ctx.finish ? null : baseline ? 'footer' : r.pick(['header','footer','link','icon']);
      if (place === 'footer' || place === 'link') root.classList.add('sunny-footbar');
      let submit = null;
      const endButton = (parent,kind,txt) => {
        const b = util.el(kind === 'link' ? 'a' : 'button','sunny-end sunny-end-'+kind,parent,txt);
        if (b.tagName === 'BUTTON') b.type='button'; else b.href='#';
        b.dataset.role='submit'; b.title=label; b.setAttribute('aria-label',label);
        b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
        return b;
      };
      if (place === 'header') submit=endButton(nav,'header',label);
      else if (place === 'icon') submit=endButton(nav,'icon','✓');
      else if (place === 'link') submit=endButton(foot,'link',label);
      else if (place === 'footer') submit=endButton(foot,'footer',label);
      const dr=ctx.rng.fork('sunny/extra');
      if (!ctx.finish && dr.bool(0.3)) {
        const alt=label === 'Save' ? 'Mark complete' : ctx.content.collideLabel(dr,label);
        const b=util.el('button','sunny-extra',foot,alt);b.type='button';
        b.addEventListener('click',()=>env.log('decoy',alt === 'Mark complete' ? {label:alt} : {label:alt,collide:true}));
      }
      if (dr.bool(0.25)) {
        const b=util.el('button','sunny-extra',foot,'Language');b.type='button';
        b.addEventListener('click',()=>env.log('decoy',{label:'Language'}));
      }
      return {stage,submit};
    },
    overlay(ctx) {
      const {util,kind,rng} = ctx;
      const el = util.el('div','sunny-overlay sunny-overlay-'+kind,document.body);
      el.dataset.role='overlay';
      const box = kind === 'promo' ? util.el('div','sunny-overlay-box',el) : el;
      const note = ctx.content.bannerText(rng,kind === 'banner' ? 'notice' : kind).text;
      if (kind === 'chat') util.el('div','sunny-overlay-heading',box,'Community help desk');
      if (kind === 'promo') util.el('div','sunny-overlay-heading',box,'Sunnydale Community');
      util.el('div','sunny-overlay-text',box,note);
      const buttons = util.el('div','sunny-overlay-buttons',box);
      const close = util.el('button','sunny-overlay-close',buttons,kind === 'cookie' ? 'Accept' : kind === 'banner' ? 'Dismiss' : kind === 'promo' ? 'No thanks' : '×');
      close.type='button';close.setAttribute('aria-label','Close');
      close.addEventListener('click',()=>ctx.dismiss(kind === 'cookie' ? 'accept' : 'close'));
      return {el,dismiss:close};
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
        'site': 'design-use-email-compose-05',
        'scenario': 'compose',
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
