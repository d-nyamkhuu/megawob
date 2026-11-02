// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-email',
  site: 'design-use-email-undo-05',
  name: 'design',
  split: 'train',
  scenarios: ['undo'],
  template: 'use-email/base',
  design: {
    widget: 'classic',
    parts: {
      classicGeometry: (base) => (ctx) => {
        const g = base(ctx);
        return {...g, appW:ctx.size.width, appH:ctx.size.height, treeW:Math.round(ctx.size.width*.15), left:0, mx:0,
          rowH:Math.max(22, Math.min(28, Math.round(ctx.size.height*.034)))};
      },
      buildClassic: (base, S) => (ctx) => {
        const view = base(ctx);
        const app = view.app;
        const E = (tag, cls, p, text) => ctx.util.el(tag, cls, p, text);
        const tools = app.querySelector('.cl-tools');
        const receive = E('button','cl-tb toolbar-static',tools);
        receive.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke="#52667f" stroke-width="1.4"><path fill="#e9edf4" d="M3 12h26v16H3z"/><path d="m3 13 13 9 13-9"/><path fill="#c9d8e8" d="M12 2h8v10h5l-9 9-9-9h5z"/></svg><span>Get Mail</span>';
        tools.prepend(receive);
        const print = E('button','cl-tb toolbar-static',tools);
        print.innerHTML = '<svg viewBox="0 0 32 32" stroke="#4b607a" fill="#c6d0de" stroke-width="1.4"><path fill="white" d="M9 2h15v13H9z"/><path d="M3 12h26v14H3z"/><path fill="white" d="M8 20h17v10H8z"/><path d="M11 24h11M11 27h11"/></svg><span>Print</span>';
        const del=tools.querySelector('[data-op=delete] svg');
        if(del) del.outerHTML='<svg viewBox="0 0 32 32" fill="#d83727" stroke="#8b2118" stroke-width="1"><path d="m6 2 10 10L26 2l4 4-10 10 10 10-4 4-10-10L6 30l-4-4 10-10L2 6z"/></svg>';
        app.querySelector('.cl-title > span').textContent = 'Inbox - Mozilla Thunderbird';
        app.querySelector('.cl-title > svg').outerHTML='<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#608eaa" stroke="#d6e1e2"/><path d="m3 12 6-7 9 2 5-3 6 10-6 12-12-1-7-6 8 2 7-2-5-5-6 2z" fill="#d5ac5c" stroke="#88764d"/><path d="m8 15 15 2-1 10-15-2z" fill="#e4e9eb" stroke="#47667b"/><path d="m8 16 7 7 8-5" fill="none" stroke="#47667b"/></svg>';
        const menu = app.querySelector('.cl-menu');
        const menus = ['File','Edit','View','Go','Message','Tools','Help'];
        [...menu.children].filter(x=>x.tagName==='SPAN').forEach((x,i)=>x.textContent=menus[i]);
        const right = app.querySelector('.cl-right');
        const band = E('div', 'inbox-band', right);
        const heading = E('div', 'inbox-summary', band);
        const title = E('div', '', heading);
        const name = E('h1', '', title, 'Inbox');
        const count = E('div', '', title);
        const storage = E('div', 'mail-storage', heading);
        E('div','',storage,ctx.spec.me.addr || ctx.spec.me.name);
        E('div','',storage,'312 MB of 1.0 GB used');
        E('div','storage-meter',storage);
        const search = E('div','mail-search',band);
        const field = menu.querySelector('label');
        search.append(field);
        E('span','search-kind',search,'Subject or Sender ▾');
        right.prepend(band);
        const inspector = E('aside','message-inspector',app.querySelector('.cl-body'));
        E('h3','',inspector,'Message Properties');
        const details = E('div','inspector-details',inspector);
        const th = app.querySelector('.cl-th'); if(th) th.textContent='Mail';
        const personal = [...app.querySelectorAll('.cl-fo')].find(x=>x.title==='Personal Folders');
        if(personal) personal.querySelector('.lb').textContent = ctx.spec.me.addr || ctx.spec.me.name;
        const tree = app.querySelector('.cl-tree');
        for(const folder of tree.querySelectorAll('.cl-fo')) {
          const label=folder.title.toLowerCase();
          const folderLabels={'deleted items':'Trash','junk e-mail':'Spam','sent items':'Sent'};
          if(folderLabels[label]) {folder.querySelector('.lb').textContent=folderLabels[label];folder.title=folderLabels[label];}
          let art='<path d="M3 7h10l3 4h13v17H3z" fill="#d9e2ea"/><path d="M3 13h26"/>';
          if(label.includes('inbox')) art='<path fill="#e3e9ee" d="M3 10h26v18H3z"/><path fill="#5d9b6f" d="M11 2h10v10h6L16 22 5 12h6z"/>';
          else if(label.includes('deleted')||label==='trash') art='<path fill="#a4b3c4" d="m8 9 2 20h13l2-20z"/><path fill="#dce3e7" d="M6 5h21v5H6zm7-3h8v3h-8z"/><path d="m13 12 1 14m6-14-1 14"/>';
          else if(label.includes('junk')||label.includes('spam')) art='<path fill="#ef7424" stroke="#a63c1c" d="M17 1c7 10-2 11 5 17 2-3 3-6 2-9 12 20-8 27-17 16C0 17 8 12 9 6c2 6 4 7 4 7s7-2 4-12z"/><path fill="#ffd663" stroke="none" d="M16 12c7 10 7 16 0 17-9-1-6-10 0-17z"/>';
          else if(label.includes('draft')) art='<path fill="#f7f6e9" d="M5 3h20v26H5z"/><path fill="#d4b477" d="m10 23 2-7L25 2l5 5-14 14z"/><path d="m10 23 6-2-4-5z" fill="#777"/>';
          else if(label.includes('sent')||label.includes('archive')) art='<path fill="'+(label.includes('archive')?'#ede0b8':'#dae6ee')+'" d="M2 6h28v21H2z"/><path fill="none" d="m2 7 14 12L30 7M2 26l10-10m18 10L20 16"/>';
          const icon=folder.querySelector('svg'); if(icon) icon.outerHTML='<svg viewBox="0 0 32 32" stroke="#4c5a65" stroke-width="1.4" stroke-linejoin="round">'+art+'</svg>';
        }
        const local = E('div','local-folders',tree);
        E('b','',local,'▾  Local Folders');
        for(const label of ['Drafts','Templates','Sent','Trash']) E('div','',local,'✉  '+label);
        const syncDetails = m => {
          const order = env.taskDef.helpers.listOrder(m,ctx.spec);
          name.textContent = (m.view || 'Inbox').replace(/^./,x=>x.toUpperCase());
          count.textContent = order.length+' messages';
          const email = m.open == null ? null : ctx.spec.emails[m.open];
          details.replaceChildren();
          for(const [label,value] of [['Subject:',email?.subject],['From:',email ? email.name+' <'+email.addr+'>' : ''],['To:',ctx.spec.me.addr || ctx.spec.me.name],['Date:',email?.date?.line || email?.time],['Size:',email ? Math.max(4,Math.ceil(email.body.length/1024))+' KB' : ''],['Priority:','Normal'],['Status:',email ? (m.flags[m.open].unread ? 'Unread':'Read') : ''],['Labels:','None']]) {
            const row = E('div','property-row',details); E('span','',row,label); E('span','',row,value || '—');
          }
          E('div','attachment-label',details,'Attachments:');
          const files = E('div','inspector-files',details);
          if(email) for(const file of email.att) E('div','',files,'♧  '+file.file+'   '+file.size);
        };
        const sync = view.sync;
        view.sync = m => { sync(m); syncDetails(m); };
        syncDetails(ctx.model);
        return view;
      },
      classicListPaint: () => (ctx, nodes, state, model) => {
        const order = env.taskDef.helpers.listOrder(model,ctx.spec);
        const visible = Math.min(8,Math.max(ctx.spec.rows,Math.floor((ctx.size.height-390)/(model.rowPx || 26))));
        nodes.lbox.querySelector('.cl-lb').style.height = visible*(model.rowPx || 26)+'px';
        const rows = [...nodes.lbox.querySelectorAll('.cl-row')];
        rows.forEach((row,n)=>{
          const i=order[n]; if(i===undefined) return;
          let box = row.querySelector('.row-check');
          if(!box) {
            box=ctx.util.el('input','row-check',row); box.type='checkbox'; row.prepend(box);
            box.setAttribute('aria-label','Select message');
            box.addEventListener('click',ev=>{ev.stopPropagation();ctx.update(env.taskDef.helpers.act(ctx.model,ctx.spec,{check:i}));});
            const size=ctx.util.el('span','sz',row); size.textContent=Math.max(4,Math.ceil(ctx.spec.emails[i].body.length/1024))+' KB';
          }
          box.checked=model.checked.includes(i);
          row.querySelector('.tm').textContent=ctx.spec.emails[i].date?.line || ctx.spec.emails[i].time;
        });
        const col=nodes.lbox.querySelector('.cl-col');
        if(!col.querySelector('.check-heading')) {
          const c=ctx.util.el('span','check-heading',col,'□'); col.prepend(c);
          col.querySelector('.tm').textContent='Date';
          const sz=ctx.util.el('span','sz',col,'Size');
        }
        return state;
      },
    },
  },
});
