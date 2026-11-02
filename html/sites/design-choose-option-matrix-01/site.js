// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-matrix-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      C: {site:'design-choose-option-matrix-01',brand:'Help Center',title:'Customer Support Survey',instruction:'top',rail:'',menu:'HOME|KNOWLEDGE BASE|COMMUNITY|SURVEYS|SUPPORT',briefTitle:'Instructions'},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { top, u } = _c;
          const icons=u.el('span','ds-top-icons',top);
          ['search','bell','avatar','caret'].forEach(name=>u.el('i','ds-icon ds-icon-'+name,icons));
          Object.assign(_c, { icons });
        },
        'frame.19': (base, S) => function (_c) {
          const { C } = S;
          const { main, u } = _c;
          const survey=u.el('div','ds-survey-head',main);
          u.el('h1','',survey,C.title);
          const progress=u.el('div','ds-progress',survey);
          u.el('span','',progress,'4 of 4 questions');
          const dots=u.el('span','ds-dots',progress);
          for(let i=0;i<4;i++){const dot=u.el('b','',dots);if(i<3)dot.classList.add('done');}
          const stage=u.el('main','ds-stage',main);
          Object.assign(_c, { dots, progress, stage, survey });
        },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.24': () => function (_c) {
          if (_c.mode === 'toast') _c.briefing(_c.contentRoot, 'ds-status-note');
        },
      },
    },
  });
})();
