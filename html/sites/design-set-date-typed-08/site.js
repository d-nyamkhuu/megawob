(function () {
  'use strict';
  const C = {site:'design-set-date-typed-08',brand:'Task Manager',title:'Project Task',instruction:'top',rail:'',menu:'Project Task',briefTitle:'Instructions'};
  const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  const FALLBACK_END = ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  env.site({
    name:C.site,
    styles:['site.css'],
    scripts:[],
    frame(ctx) {
      if (!document.body._fragGuard) { document.body._fragGuard = true; document.body.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault(); }); }
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const content = ctx.content || {};
      const endRng = ctx.rng.fork('chrome/end');
      const endPool = (Array.isArray(content.END_LABELS) && content.END_LABELS.length ? content.END_LABELS : FALLBACK_END).map(labelOf);
      const endLabel = endRng.bool(0.5) ? 'Submit' : endRng.pick(endPool.filter(x => x.trim().toLowerCase() !== 'submit'));
      const placement = ctx.finish ? null : endLabel.trim().toLowerCase() === 'submit' ? 'footer' : endRng.pick(['header','link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endPool)].filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      if (C.menu) {
        const nav = u.el('nav','ds-menu',document.body);
        C.menu.split('|').forEach(t => u.el('span','',nav,t));
      }
      const body = u.el('div','ds-body',document.body);
      if (C.rail) {
        const rail = u.el('aside','ds-rail',body);
        C.rail.split('|').forEach(t => u.el('div','',rail,t));
      }
      const contentArea = u.el('div','ds-content',body);
      let mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'panel' : C.instruction;
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside',cls,parent);
        if (cls === 'ds-brief') u.el('h2','',b,C.briefTitle || 'Task');
        u.el('div','ds-instruction',b,ctx.instruction);
        return b;
      }
      let headerNote = null;
      if (mode === 'top') headerNote = briefing(contentArea,'ds-header-note');
      const main = u.el('div','ds-main',contentArea);
      if (mode === 'panel') {
        main.classList.add('ds-panel-layout');
        briefing(main,'ds-brief');
      }
      const stage = u.el('main','ds-stage',main);
      if (mode === 'toast') {
        const note = briefing(contentArea,'ds-toast');
        contentArea.insertBefore(note,main);
      }
      const foot = u.el('footer','ds-footer',contentArea);
      const links = u.el('span','ds-links',foot);
      ['Home','Contact Us','Privacy Policy'].forEach((t,i) => {
        if (i) u.el('i','',links,'|');
        u.el('a','',links,t).href = '#';
      });
      u.el('span','ds-copy',foot,'© 1995 Campus Services');

      let submit = null;
      const endControl = (parent, tag, cls, text) => {
        const b = u.el(tag,cls,parent,text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label',endLabel);
        b.title = endLabel;
        b.addEventListener('click',e => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      if (!ctx.finish) {
        const clr = u.el('button','ds-clear',foot,'Clear Form');
        clr.type = 'button';
        if (placement === 'footer') submit = endControl(foot,'button','ds-submit',endLabel);
        else if (placement === 'header' && mode === 'toast') {
          // The toast occupies the top edge, so keep this episode's end control in the form footer.
          submit = endControl(foot,'button','ds-submit',endLabel);
        } else if (placement === 'header') {
          if (headerNote) headerNote.classList.add('ds-has-end');
          submit = endControl(headerNote || contentArea,'button','ds-submit ds-submit-header',endLabel);
        } else {
          submit = endControl(links,'a','ds-end-link',`${endLabel} ›`);
        }
      }
      if (collide) {
        const b = u.el('a','ds-pq',links,collide);
        b.href = '#';
        b.dataset.role = 'xtra';
        b.addEventListener('click',e => { e.preventDefault(); env.log('decoy',{label:collide,collide:true}); });
      }
      return {stage,submit};
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);
      el.dataset.role = 'overlay';
      const texts = {cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss = u.el('button','',el,ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click',() => ctx.dismiss('close'));
      return {el,dismiss,ttlSteps:ctx.kind === 'toast' ? 4 : 0};
    }
  });
})();
