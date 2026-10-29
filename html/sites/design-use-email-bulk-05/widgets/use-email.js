// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-email',
  site: 'design-use-email-bulk-05',
  name: 'design',
  split: 'train',
  scenarios: ['bulk'],
  template: 'use-email/base',
  design: { parts: {
    mailGeometry: (base) => function(ctx, ads) {
      const g=base(ctx,ads), W=ctx.size.width, H=ctx.size.height;
      g.appW=W;g.appH=H-139;g.left=0;g.top=0;
      g.rail=false;g.sideW=Math.max(230,Math.round(W*.23));
      g.stack=true;g.listW=W-g.sideW;g.readW=g.listW;
      g.rowH=Math.max(24,Math.min(56,Math.floor((H-139-76-130)/ctx.spec.rows)));
      g.rowKind='compact';
      document.documentElement.style.setProperty('--mail-row-h',g.rowH+'px');
      return g;
    },
    mailTopActions: () => function(ctx,nodes) {
      const row=ctx.util.el('div','my-icons',nodes.topEl);
      const paths=[
        '<path d="M3 7h18l2 6v8H1v-8zM1 13h6l2 3h6l2-3h6"/>',
        '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M7 1v6M17 1v6M3 9h18M8 13h1m5 0h1m-7 5h1m5 0h1"/>',
        '<circle cx="9" cy="8" r="3"/><path d="M2 21v-2a6 6 0 0 1 12 0v2M17 6a3 3 0 0 1 0 6m-1 4a5 5 0 0 1 5 5"/>',
        '<circle cx="4" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="20" cy="12" r="1.4"/>'
      ];
      for(const p of paths){const e=ctx.util.el('span','',row);e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
      return null;
    },
    mailSidebar: () => function(ctx,side) {
      const card=ctx.util.el('div','my-tip',side);
      const bulb=ctx.util.el('span','my-bulb',card);
      bulb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16c-.3-1.7-1.8-2.8-1.8-5.3a5.8 5.8 0 0 1 11.6 0c0 2.5-1.5 3.6-1.8 5.3zM9 19h6M10 22h4"/></svg>';
      const body=ctx.util.el('div','',card);
      ctx.util.el('strong','',body,'Tips');
      ctx.util.el('span','',body,'Use the checkboxes to select multiple messages. Then you can star, archive, delete and more.');
      return null;
    },
    mailListHeading: () => function(ctx,lb) {
      const h=lb.previousElementSibling;
      if(h&&!h.querySelector('.my-date')){
        ctx.util.el('span','my-date',h,'Date');
        const filter=ctx.util.el('span','my-filter',h);
        filter.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="9" cy="6" r="2" fill="#fff"/><circle cx="16" cy="12" r="2" fill="#fff"/><circle cx="11" cy="18" r="2" fill="#fff"/></svg>';
      }
    },
    mailPaintTop: () => function(ctx) {
      const input=ctx.stage.querySelector('.am-search input');
      if(input) input.placeholder='Search mail';
    }
  } },
});
