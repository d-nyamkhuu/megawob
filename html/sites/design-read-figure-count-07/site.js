(function () {
  'use strict';
  const C = {"site":"design-read-figure-count-07","task":"read-figure","scenario":"count","style":"flash","title":"Shape Counter","menu":"","note":"Task","layout":"dlg","subtitle":"","aside":"Look at the shapes and count how many are small items."};
  const END_FALLBACK = ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util;
      const app = u.el('main', 'app', document.body);
      u.el('div', 'workspace-panel', document.body);
      const outline = u.svg('svg', {class:'frame-outline',viewBox:'0 0 1000 800',preserveAspectRatio:'none'}, app);
      u.svg('polygon', {points:'1,1 985,1 999,15 999,799 18,799 1,782',fill:'none',stroke:'#284b78','stroke-width':2}, outline);
      u.svg('path', {d:'M2 782L18 798H998V16',fill:'none',stroke:'#85afd6','stroke-width':2}, outline);
      const top = u.el('header', 'top', app);
      if (['mint','qt','dark','electron','motif','human','beos','gtk','eink'].includes(C.style)) {
        const icon = u.svg('svg', {width:26,height:26,viewBox:'0 0 26 26',class:'title-icon'}, top);
        u.svg('rect', {x:3,y:2,width:20,height:22,rx:C.style==='mint'?0:3,fill:C.style==='mint'?'none':C.style==='dark'?'#8266ce':C.style==='electron'?'#ee8520':'#d7e2e8',stroke:'currentColor','stroke-width':1.5}, icon);
        u.svg('path', {d:'M7 7h12M7 11h12M7 15h12M7 19h9',fill:'none',stroke:'currentColor','stroke-width':1.5}, icon);
      }
      u.el('span', '', top, C.title);
      if (['qt','dark','electron','motif','human','gtk','eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min','max','close']) {
          const svg = u.svg('svg', {width:20,height:20,viewBox:'0 0 20 20'}, wc);
          u.svg('path', {d:kind==='min'?'M3 12h14':kind==='max'?'M4 4h12v12H4z':'M4 4l12 12M16 4L4 16',fill:'none',stroke:'currentColor','stroke-width':1.5}, svg);
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app);
      const showHeader = ctx.display === 'header';
      const brief = u.el('div', 'brief', center, showHeader ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const noteOutline = u.svg('svg', {class:'note-outline',viewBox:'0 0 290 175',preserveAspectRatio:'none'}, aside);
      u.svg('polygon', {points:'1,1 260,1 289,30 289,174 28,174 1,147',fill:'none',stroke:'#91bf99','stroke-width':1.4}, noteOutline);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, ctx.display === 'panel' || ctx.display === 'toast' ? ctx.instruction : C.aside);
      aside.classList.add('note-' + ctx.display);

      const brand = u.el('div', 'brand', document.body);
      u.el('b', '', brand, 'Bright');
      u.el('i', '', brand, 'Path');
      u.el('div', 'brand-sub', brand, 'Learning Tools');
      const nav = u.el('nav', 'sidenav', document.body);
      ['Activities','My Progress','Settings','Help'].forEach((t,i) => u.el('div', i ? '' : 'on', nav, t));
      const gl = u.el('div', 'glyph', top);
      u.el('i', '', gl); u.el('i', '', gl); u.el('i', '', gl); u.el('i', '', gl);

      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : END_FALLBACK;
        const labelValue = endRng.pick([...labels.map(() => 'Submit'),...labels]);
        const label = typeof labelValue === 'string' ? labelValue : (labelValue.label || labelValue.text || labelValue.name || String(labelValue));
        const placement = endRng.pick(['footer','footer','header','link']);
        const collideRng = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (collideRng.bool(0.3)) {
          const otherLabels = [...new Set(labels.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x))))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (otherLabels.length) collision = collideRng.pick(otherLabels);
        }
        const parent = placement === 'header' ? top : footer;
        if (collision) {
          const decoy = u.el('button', 'flash-pq', parent, collision);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', {label:collision, collide:true}));
        }
        const cls = placement === 'link' ? 'submit flash-end-link' : placement === 'header' ? 'submit flash-end-header' : 'submit';
        const tag = placement === 'link' ? 'a' : 'button';
        submit = u.el(tag, cls, parent, placement === 'link' ? label + ' ›' : label);
        if (tag === 'button') submit.type = 'button';
        else submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
      }
      return {stage, submit};
    },
    overlay(ctx) {
      const u = ctx.util, el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return {el,dismiss};
    }
  });
})();
