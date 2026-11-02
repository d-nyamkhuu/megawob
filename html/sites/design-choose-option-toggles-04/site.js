// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-toggles-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-toggles-04',brand:'Riverton Times',title:'Your Account',instruction:'header',briefTitle:'Your task'},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { C } = S;
          const { ctx, top, u } = _c;
          u.el('span','ds-date',top,'Thursday, April 3, 2008');
          const contentRoot=u.el('div','ds-content',document.body),width=window.innerWidth,height=window.innerHeight;
          _c.mode = ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':ctx.display==='panel'?'panel':ctx.display==='header'?'header':C.instruction;
          if((_c.mode==='panel'&&width<1260)||(_c.mode==='toast'&&height<700))_c.mode='header';
          const hero=u.el('section','ds-hero',contentRoot);
          const intro=u.el('div','ds-intro',hero);
          u.el('h1','',intro,C.title);
          u.el('p','',intro,'Manage your details, email preferences and other settings for your Riverton Times account.');
          const papers=u.el('div','ds-papers',hero);
          u.el('div','ds-paper-back',papers);
          u.el('div','ds-paper-front',papers,'Riverton Times');
          const details=u.el('aside','ds-details',hero);
          u.el('h2','',details,'Your details');
          u.el('div','ds-person',details,'Alex Morgan');
          u.el('div','',details,'alex.morgan@example.com');
          u.el('div','',details,'Member since 12 Mar 2006');
          const stats=u.el('div','ds-stats',details);
          [['5','Saved articles'],['2','Comments'],['0','Newsletters']].forEach(([n,t])=>{const x=u.el('div','ds-stat',stats);u.el('strong','',x,n);u.el('span','',x,t);});
          function briefing(parent,cls){const b=u.el('aside',cls,parent);if(cls==='ds-brief')u.el('h2','',b,C.briefTitle);u.el('div','ds-instruction',b,ctx.instruction);return b;}
          if(_c.mode==='header'){const note=briefing(top,'ds-header-note');const date=top.querySelector('.ds-date');if(date)top.insertBefore(note,date);}
          if(_c.mode==='panel')briefing(details,'ds-brief');
          Object.assign(_c, { briefing, contentRoot, details, height, hero, intro, papers, stats, width });
        },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.13': () => () => {},
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.19': (base, S) => function (_c) {
          const { main, u } = _c;
          u.el('h2','ds-section-title',main,'Email preferences');
          u.el('p','ds-section-caption',main,'Choose which emails you would like to receive from the Riverton Times.');
          const stage=u.el('main','ds-stage',main);
          Object.assign(_c, { stage });
        },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.29': (base, S) => function (_c) {
          const { ctx, endRng, labels } = _c;
          if(!ctx.finish){
      if(endRng.bool(0.5)){_c.placement='footer';_c.label=labels.find(x=>x.trim().toLowerCase()==='save')||'Submit';}
      else{
        _c.placement=endRng.pick(['footer','link','header']);
        const alternatives=labels.filter(x=>x.trim().toLowerCase()!=='submit');
        _c.label=alternatives.length?endRng.pick(alternatives):'Done';
      }
    }
        },
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.38': (base, S) => function (_c) {
          const { ctx, decoyBtn, endBtn, foot, top, u } = _c;
          if(!ctx.finish){
      if(_c.placement==='header'){
        const tools=u.el('div','ds-header-tools',top);top.classList.add('ds-tools-visible');
        if(_c.collide&&_c.collide.where==='header')decoyBtn(tools,_c.collide.text,true);
        _c.submit=endBtn(tools,'ds-submit ds-submit-head',_c.label);
      }else{
        if(_c.collide&&_c.collide.where==='header'){const tools=u.el('div','ds-header-tools',top);top.classList.add('ds-tools-visible');decoyBtn(tools,_c.collide.text,true);}
        if(_c.collide&&_c.collide.where==='footer')decoyBtn(foot,_c.collide.text,true);
        _c.submit=_c.placement==='link'?endBtn(foot,'ds-endlink',`${_c.label} ›`):endBtn(foot,'ds-submit',_c.label);
      }
    }
        },
      },
    },
  });
})();
