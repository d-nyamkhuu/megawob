// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-textarea-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {"site": "design-type-text-textarea-01", "brand": "New Contact", "title": "", "instruction": "top", "rail": "", "menu": "", "briefTitle": "Instructions"},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { top, u } = _c;
          u.el('span','ds-window-controls',top,'−   □   ×');
        },
        'frame.19': (base, S) => function (_c) {
          const { briefing, content, main, mode, u } = _c;
          [['Spouse','ds-filler-family'],['Web page','ds-filler-email'],['Pager','ds-filler-phone']].forEach(([label,cls])=>{const row=u.el('div','ds-filler '+cls,main);u.el('span','',row,label);u.el('div','ds-filler-input',row,'');});
          const notes=u.el('div','ds-filler ds-filler-notes',main);
          u.el('span','',notes,'Notes:');
          u.el('div','ds-filler-input ds-filler-area',notes,'');
          if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
          Object.assign(_c, { notes });
        },
        'frame.22': (base, S) => function (_c) {
          const { body, u } = _c;
          const inspector=u.el('aside','ds-inspector',body);
          u.el('h2','',inspector,'Prop.');
          u.el('div','ds-inspector-label',inspector,'Category');
          u.el('div','ds-people',inspector,'👨‍👩');
          u.el('div','ds-select',inspector,'▼');
          u.el('div','ds-inspector-label ds-status-label',inspector,'Status');
          u.el('div','ds-flag',inspector,'⚑');
          u.el('div','ds-select',inspector,'▼');
          u.el('div','ds-rule',inspector,'');
          u.el('div','ds-date',inspector,'Created:\n4/25/2003\n10:14 AM');
          u.el('div','ds-date ds-modified',inspector,'Last modified:\n4/25/2003\n10:14 AM');
          _c.submit = null;
          Object.assign(_c, { inspector });
        },
      },
    },
  });
})();
