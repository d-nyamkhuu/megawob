// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const lineIcon = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const icons = {
    Activity: lineIcon('<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>'),
    Integrations: lineIcon('<path d="M9 15l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M15 9l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0M8 16l8-8"/>'),
    Settings: lineIcon('<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.5 2.2 2 1.1 2.2-.6 2 3.4-1.6 1.7v2.4l1.6 1.7-2 3.4-2.2-.6-2 1.1L14 22h-4l-.5-2.2-2-1.1-2.2.6-2-3.4 1.6-1.7v-2.4L3.3 10l2-3.4 2.2.6 2-1.1z"/>'),
    Reports: lineIcon('<path d="M4 21v-8M12 21V4M20 21v-12" stroke-width="3"/>'),
    Account: lineIcon('<circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2z"/>'),
    Webhook: lineIcon('<path d="M13 2 7 13h5l-1 9 7-12h-5l1-8z" fill="currentColor" stroke="none"/>'),
    Schedule: lineIcon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v5M17 2v5M3 9h18"/>'),
    'Manual trigger': lineIcon('<path d="M5 2v19l5-5 4 6 3-2-4-6 7-1z" fill="currentColor" stroke="none"/>'),
    'App event': lineIcon('<path d="m4 7 8-4 8 4-8 4-8-4zm0 5 8 4 8-4M4 17l8 4 8-4"/>'),
    'Send email': lineIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'),
    Database: lineIcon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>'),
    Transform: lineIcon('<path d="M5 2h10l4 4v16H5zM15 2v5h4M8 11h8M8 15h8M8 19h6"/>'),
    'Data mapper': lineIcon('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
    API: lineIcon('<circle cx="5" cy="12" r="2.5"/><circle cx="18" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m7 11 8-5M7 13l8 5"/>'),
    'Send response': lineIcon('<path d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5zM10 20h4"/>'),
    Condition: lineIcon('<path d="M3 4h18l-7 8v6l-4 3v-9z"/>'),
    Delay: lineIcon('<circle cx="12" cy="12" r="9"/><path d="M12 5v7l5 3"/>'),
    Split: lineIcon('<path d="M12 21V4m0 0-4 4m4-4 4 4M12 13H6l-3-3m9 3h6l3-3"/>'),
    Merge: lineIcon('<path d="M12 3v17m0 0-4-4m4 4 4-4M3 6l3 3h6m9-3-3 3h-6"/>'),
  };

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          if (display !== 'header' || nav) rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header);
          brand.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 27 20 10 31 29" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="20" cy="9" r="5"/><circle cx="9" cy="29" r="5"/><circle cx="32" cy="30" r="5"/></svg><span>Relayboard</span>';
          brand.dataset.role = 'brand';
        }
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        {
          const side = util.el('aside', 'ref-side', body);
          if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
          const addNav = (parent, cls, item) => {
            const a = util.el('a', cls, parent, item);
            a.href = '#';
            a.dataset.role = 'nav';
            a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
            return a;
          };
          const navBox = util.el('nav', 'rb-side-nav', side);
          [['Workflows','♧','12'],['Activity','◷','8'],['Integrations','↗','5'],['Settings','⚙','']].forEach(([name, icon, count], i) => {
            const a = addNav(navBox, 'rb-nav-row'+(i===0?' selected':''), name);
            const ico=util.el('span','rb-nav-icon',a,icon);
            ico.innerHTML=i===0?'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 29 20 9 32 29" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="9" r="4"/><circle cx="9" cy="29" r="4"/><circle cx="32" cy="29" r="4"/></svg>':icons[name];
            util.el('span','rb-nav-label',a,name);
            if (count) util.el('span','rb-count',a,count);
            a.firstChild.nodeType === 3 && a.removeChild(a.firstChild);
          });
          const heading = util.el('div','rb-section-head',side);
          util.el('strong','',heading,'My Workflows');
          util.el('span','rb-plus',heading,'+');
          const list = util.el('div', 'ref-directory-list', side);
          [['Support Requests','Active'],['Customer Onboarding','Draft'],['Lead Processing','Active'],['Order Fulfillment','Draft'],['Feedback Collection','Active']].forEach(([name,status],i)=>{
            const row = addNav(list,`ref-sidelink${i===0?' selected':''}`,name);
            util.el('span','rb-work-name',row,name);
            const right=util.el('span','rb-work-status '+status.toLowerCase(),row,status);
            util.el('i','',right);
            row.firstChild.nodeType === 3 && row.removeChild(row.firstChild);
          });
          const statusHead = util.el('div','rb-section-head rb-status-head',side);
          util.el('strong','',statusHead,'Workflow Status');
          const statusList=util.el('div','rb-status-list',side);
          [['Active','6'],['Draft','4'],['Paused','1'],['Error','1']].forEach(([name,count])=>{
            const row=util.el('div','rb-status-row',statusList);
            util.el('span','rb-status-dot '+name.toLowerCase(),row);
            util.el('span','',row,name);
            util.el('span','rb-status-count',row,count);
          });
        }
        Object.assign(_c, { body });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (!_c.ctx.finish) {
        const r = _c.rng.fork('relayboard/end-placement');
        _c.placement = r.pick(['bottom','footer','link','bottom','header','bottom','icon','bottom']);
      }
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, util } = _c;
      const tools = util.el('div','ref-tools rb-top-tools',document.body);
      if (decoys.length && placement !== 'bottom') decoyBtn(tools,decoys[0]);
      if (collide && collide.where === 'header') decoyBtn(tools,collide.text,true);
      let submit = null;
      if (placement === 'header') submit = endBtn(tools,'ref-submit',label);
      if (placement === 'icon') submit = endBtn(tools,'ref-submit ref-icon','✓');
      Object.assign(_c,{headerTools:tools,submit});
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'bottom' || placement === 'footer' || placement === 'link') {
        const actions=util.el('div','rb-action-bar '+placement,document.body);
        if (placement === 'bottom') submit=endBtn(actions,'ref-submit',label);
        else {
          if (decoys.length>1) decoyBtn(actions,decoys[1]);
          if (collide && collide.where==='footer') decoyBtn(actions,collide.text,true);
          submit=endBtn(actions,placement==='link'?'ref-endlink':'ref-submit',placement==='link'?label+' ›':label);
        }
        if (placement==='bottom' && collide) decoyBtn(actions,collide.text,true);
      }
      const dock=util.el('footer','rb-dock',document.body);
      [['♧','Workflows'],['▥','Reports'],['▦','Integrations'],['♙','Account']].forEach(([icon,name],i)=>{
        const tab=util.el('a','rb-dock-tab'+(i===0?' selected':''),dock);
        tab.href='#'; tab.dataset.role='nav';
        const ico=util.el('span','rb-dock-icon',tab,icon);
        ico.innerHTML=i===0?'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 29 20 9 32 29" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="9" r="4"/><circle cx="9" cy="29" r="4"/><circle cx="32" cy="29" r="4"/></svg>':i===2?lineIcon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'):icons[name];
        util.el('span','',tab,name);
        tab.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'nav',label:name});});
      });
      Object.assign(_c,{submit});
    },
    'frame.floating': (base, S) => function (_c) {},
    overlay: (base, S) => function (ctx) {
      const result=base(ctx);
      const roots=document.querySelectorAll('.ref-ov');
      const root=roots[roots.length-1];
      if (!root) return result;
      const {util}=ctx;
      root.classList.add('rb-overlay');
      if (root.classList.contains('ref-ov-promo')) {
        const box=root.querySelector('.ref-ov-box');
        const art=util.el('div','rb-promo-art',box);
        art.innerHTML='<svg viewBox="0 0 140 140" aria-hidden="true"><path d="m20 55 45-30 50 35-6 56-88-7z" fill="#7d82ff"/><rect x="32" y="42" width="72" height="61" rx="5" fill="white" transform="rotate(-10 68 72)"/><path d="M20 59 68 86l48-27-7 58-88-7z" fill="#589aff"/><path d="m21 110 48-36 40 43z" fill="#8b70fc"/><path d="m116 20 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#7196ff"/></svg>';
        util.el('h2','rb-overlay-title',box,'Relayboard updates');
        const input=util.el('input','rb-overlay-input',box);
        input.type='email'; input.placeholder='Your email address'; input.setAttribute('aria-label','Your email address');
      } else if (root.classList.contains('ref-ov-chat')) {
        const heading=util.el('h3','rb-overlay-title',root,'Relayboard support');
        root.prepend(heading);
        const composer=util.el('div','rb-chat-composer',root);
        const input=util.el('input','rb-overlay-input',composer);
        input.type='text'; input.placeholder='Type a message…'; input.setAttribute('aria-label','Chat message');
        const send=util.el('button','rb-chat-send',composer,'➤');
        send.type='button'; send.setAttribute('aria-label','Send message');
        send.addEventListener('click',()=>env.log('overlay-click',{label:'Send message'}));
      }
      return result;
    },
  };

  env.site({
    name: 'design-use-workflow-editor-connect-05',
    template: 'site/base',
    design: { parts },
  });
})();
