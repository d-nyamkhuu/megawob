/* use-bank/_controls: classic workspace controls parts.
 * install(BASE, S) preserves part names/order; S supplies the live design and page state.
 * No DOM work or randomness occurs until a part is called.
 */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.icon = (E, u, parent, name, cls = '') => {
      const { D } = S;
      const svg = u.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',class:cls}, parent);
      u.svg('path', {d:D.icons[name] || D.icons.info}, svg);
      return svg;
    };

    BASE.key = (E, t) => {
      return JSON.stringify(t);
    };

    BASE.ref = (E, t,el) => {
      const { P } = S;
      E.refs[P.key(E,t)] = el; return el;
    };

    BASE.ui = (E, patch) => {
      const { P } = S;
      const { ctx } = E;
      ctx.update({...ctx.model,bankUI:{...ctx.model.bankUI,...patch}}); P.draw(E);
    };

    BASE.change = (E, act,full=true) => {
      const { P } = S;
      const { ctx, s, F } = E;
      ctx.update(F.helpers.apply(ctx.model,s,act)); if(full) P.draw(E);
    };

    BASE.tool = (E, parent,label,glyph,fn) => {
      const { P } = S;
      const b=P.localButton(E,parent,'',fn,'bk-iconbtn',glyph); b.setAttribute('aria-label',label);b.title=label;return b;
    };

    BASE.button = (E, parent,text,target,act,cls='',glyph) => {
      const { P } = S;
      return P.ref(E,target,P.localButton(E,parent,text,()=>P.change(E,act),`bk-btn ${cls}`,glyph));
    };

    BASE.badge = (E, parent,text,cls='',glyph) => {
      const { P } = S;
      const { u } = E;
      const el=u.el('span',`bk-tag ${cls}`,parent);if(glyph)P.icon(E,u,el,glyph);u.el('span','',el,text);return el;
    };

    BASE.row = (E, parent,k,v,cls='') => {
      const { u } = E;
      const el=u.el('div',`bk-row ${cls}`,parent);u.el('span','',el,k);u.el('b','',el,v);
    };

    BASE.sectionHead = (E, parent,title,meta='') => {
      const { u } = E;
      const h=u.el('div','bk-sectionhead',parent);u.el('h3','',h,title);if(meta)u.el('small','',h,meta);return h;
    };

    BASE.notice = (E, parent,text,glyph='info') => {
      const { P } = S;
      const { u } = E;
      const n=u.el('div','bk-notice',parent);P.icon(E,u,n,glyph);u.el('span','',n,text);return n;
    };

    BASE.popup = (E, title,text) => {
      const { P } = S;
      return P.ui(E,{popup:{title,text}});
    };

    BASE.localButton = (E, parent, text, fn, cls = '', glyph) => {
      const { P } = S;
      const { u } = E;
      const b=u.el('button',cls || 'bk-btn',parent); b.type='button';
      if(glyph) P.icon(E,u,b,glyph); if(text)u.el('span','',b,text);
      b.addEventListener('click',fn); return b;
    };

    BASE.mirror = (E) => {
      const { live } = S;
      const { ctx } = E;
      if(live?.ctx!==ctx) return;
      const needs={};
      for(const [id,el] of Object.entries(E.refs)) {
        if(el===E.pane || el===E.choicesPane)continue;
        const container=E.choicesPane?.contains(el)?E.choicesPane:E.pane.contains(el)?E.pane:null;
        if(!container)continue;
        const r=el.getBoundingClientRect(), c=container.getBoundingClientRect();
        if(r.width<1 || r.height<1)continue;
        if(r.top<c.top+2 || r.bottom>c.bottom-2) {
          const dy=Math.max(-220,Math.min(220,(r.top+r.bottom-c.top-c.bottom)/2));
          if(Math.abs(dy)>2) needs[id]={choices:container===E.choicesPane,dy};
        }
      }
      if(JSON.stringify(needs)!==JSON.stringify(ctx.model.bankScroll || {}))ctx.update({...ctx.model,bankScroll:needs});
    };
  }
  env.template('use-bank/_controls', () => ({ install }));
})();
