/* use-bank/_frame: classic workspace frame parts.
 * install(BASE, S) preserves part names/order; S supplies the live design and page state.
 * No DOM work or randomness occurs until a part is called.
 */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.shell = (E) => {
      const { P } = S;
      const { u } = E;
      P.topbar(E);
      P.navigation(E);
      const layout=u.el('div','bk-layout',E.root);
      P.rail(E,layout);
      const main=u.el('main','bk-main',layout);
      P.sidebar(E,layout);
      P.heading(E,main);
      E.pane=u.el('div','bk-scroll',main);E.footer=u.el('div','bk-footer',main);
      E.pane.addEventListener('scroll',()=>P.mirror(E));
    };

    BASE.topbar = (E) => {
      const { D, P } = S;
      const { s, u } = E;
      const top=u.el('div','bk-top',E.root), logo=u.el('span','bk-logo',top);P.icon(E,u,logo,'bank');
      u.el('span','bk-brand',top,D.brand);u.el('span','bk-personal',top,D.personal);u.el('span','bk-user',top,s.customer);
      const tools=u.el('div','bk-top-tools',top);
      const bell=P.tool(E,tools,'Notifications, 3 unread','bell',()=>P.popup(E,'Notifications','Your February statement is ready.\nA recurring payment is due on March 5.\nYour contact information was updated.'));u.el('span','bk-dot',bell,'3');
      P.tool(E,tools,'Secure message centre','file',()=>P.popup(E,'Secure message centre','Inbox (2 unread)\nStatement delivery preferences updated\nWelcome to Pinebridge digital banking\nNo reply is needed for these messages.'));
      P.tool(E,tools,'Help and support','help',()=>P.popup(E,'Help & support','For questions about a payment, have its confirmation number ready. Your saved changes and scheduled payments appear in Payment activity. You can review a dispute in the Resolution centre.'));
    };

    BASE.navigation = (E) => {
      const { P } = S;
      const { u } = E;
      const nav=u.el('nav','bk-nav',E.root);nav.setAttribute('aria-label','Banking navigation');
      ['Accounts','Activity','Pay & transfer','Cards','Statements','Offers'].forEach(label=>P.localButton(E,nav,label,()=>label===E.active?P.ui(E,{preview:null}):P.ui(E,{preview:label}),label===E.active?'active':''));
      u.el('span','bk-session',nav,'Secure session / Personal profile');
    };

    BASE.rail = (E, layout) => {
      const { D, P } = S;
      const { ctx, s, u } = E;
      if(ctx.size.width > D.railAt) {
        const rail=u.el('aside','bk-rail',layout);u.el('h4','',rail,'Workspace');
        [['Overview','wallet'],['Transaction history','file'],['Pay a bill','calendar'],['Recurring transfers','transfer'],['Card controls','card'],['Resolution centre','shield']].forEach(([label,glyph])=>{
          const selected=label===E.titles[s.scenario] || label==='Transaction history'&&s.scenario==='categorise' || label==='Resolution centre'&&s.scenario==='dispute';
          P.localButton(E,rail,label,()=>selected?P.ui(E,{preview:null}):P.ui(E,{preview:label}),selected?'active':'',glyph);
        });
        u.el('hr','',rail);u.el('h4','',rail,'Manage');
        [['Saved billers','file'],['Alerts & preferences','bell'],['Documents','download'],['Contact support','help']].forEach(([label,glyph])=>P.localButton(E,rail,label,()=>P.popup(E,label,'Your account information is up to date. Statements, saved billers and notification settings are available from your personal banking profile.'),'',glyph));
      }
    };

    BASE.sidebar = (E, layout) => {
      const { D, P } = S;
      const { ctx, s, u, F } = E;
      if(ctx.size.width > D.sidebarAt) {
        const side=u.el('aside','bk-side',layout), accounts=u.el('div','bk-side-section',side);u.el('h4','',accounts,'Accounts at a glance');
        s.accounts.forEach(a=>P.account(E,a,accounts));
        const context=u.el('div','bk-side-section',side);
        u.el('h4','',context,s.scenario==='dispute'?'Resolution centre':s.scenario==='limits'?'Card services':s.scenario==='categorise'?'Spending insights':'Upcoming activity');
        const items=s.scenario==='dispute'?[['shield','1 open case','A merchant response is pending'],['clock','Case PB-20416','Update expected by March 8'],['file','No documents requested','We will contact you if needed']]
          :s.scenario==='limits'?[['card','Digital wallet','1 device connected'],['shield','Travel notification','No travel notice on file'],['bell','Purchase alerts','Enabled for purchases over $100']]
          :s.scenario==='categorise'?[['wallet','February spending',F.helpers.money(s.transactions.reduce((n,t)=>n+t.amount,0))],['file','Monthly statement','Available in Documents'],['bell','Budget alerts','2 categories near their budget']]
          :[['calendar','3 payments scheduled','Next payment: March 5'],['transfer','Savings contribution','$150.00 / Monthly'],['file','1 new eBill','Statement ready to view']];
        items.forEach(([glyph,label,detail])=>{const line=u.el('div','bk-minirow',context);P.icon(E,u,line,glyph);const p=u.el('p','',line,label);u.el('small','',p,detail);});
        const support=u.el('div','bk-side-section',side);u.el('h4','',support,'Stay informed');u.el('p','bk-note',support,'February account statements are ready. Paperless delivery is on.');
        P.localButton(E,support,'View documents',()=>P.ui(E,{preview:'Statements'}),'bk-btn link','file');
        const secure=u.el('div','bk-minirow',side);P.icon(E,u,secure,'shield');u.el('p','',secure,'Your connection is encrypted. Pinebridge will never ask for a verification code by message.');
      }
    };

    BASE.account = (E, a, accounts) => {
      const { u, F } = E;
      const box=u.el('div','bk-account',accounts);u.el('small','',box,a.label);const balance=u.el('b','',box,F.helpers.money(a.balance));balance.dataset.account=a.label;u.el('small','',box,'Available balance');
    };

    BASE.heading = (E, main) => {
      const { P } = S;
      const { u } = E;
      const head=u.el('div','bk-heading',main), heading=u.el('div','',head);
      E.crumb=u.el('div','bk-crumb',heading);E.title=u.el('h2','',heading);
      const headtools=u.el('div','bk-headtools',head);E.stateBadge=u.el('span','',headtools);
      P.tool(E,headtools,'Page options','dots',()=>P.popup(E,'Page options','Keep a copy of the confirmation number for your records. Completed transactions are included in your next monthly statement.'));
    };

    BASE.frame = (E) => {
      const { D } = S;
      const { ctx, u } = E;
      const root = u.el('div',`bk${ctx.size.width < D.compactAt ? ' compact' : ''}`,ctx.stage);
      root.style.width = `${Math.max(D.minWidth,ctx.size.width-D.inset)}px`;
      root.style.height = `${Math.max(D.minHeight,ctx.size.height-D.inset)}px`;
      return root;
    };

    BASE.styles = (E) => {
      const { D } = S;
      return D.css
        .replaceAll('var(--bg)',D.background)
        .replaceAll('var(--panel)',D.panel)
        .replaceAll('var(--fg)',D.foreground)
        .replaceAll('var(--muted)',D.muted)
        .replaceAll('var(--line)',D.line)
        .replaceAll('var(--accent)',D.accent)
        .replaceAll('#20835d',D.positive)
        .replaceAll('#bc8227',D.attention)
        .replaceAll('#d04c4c',D.error)
        .replaceAll('#c44c4c',D.invalid)
        .replace('font:13px/1.4 system-ui,sans-serif',`font:${D.font}`)
        .replace('border-radius:8px',`border-radius:${D.radius}`)
        .replace('width:206px',`width:${D.sideWidth}`)
        .replace('width:178px',`width:${D.compactSideWidth}`)
        .replace('width:146px',`width:${D.railWidth}`)
        .replaceAll('height:35px',`height:${D.controlHeight}`)
        .replace('width:min(410px,100%)',`width:min(${D.dialogWidth},100%)`);
    };

    BASE.begin = (E, ctx) => {};
    BASE.rendered = (E) => {};
    BASE.drawn = (E) => {};
    BASE.fieldDrawn = (E, f, box) => {};

    BASE.locate = (E, t) => {
      const { P } = S;
      const { ctx } = E;
      const el=E.refs[P.key(E,t)];if(!el)throw new Error(`use-bank target not rendered: ${JSON.stringify(t)}`);return ctx.util.center(el);
    };
  }
  env.template('use-bank/_frame', () => ({ install }));
})();
