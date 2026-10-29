// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-sections-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {"site": "design-type-text-sections-03", "brand": "Account Settings", "title": "", "instruction": "top", "rail": "|Home|People|Projects|Calendar|Messages|Files|Reports|Settings", "menu": "", "briefTitle": "Task"},
      parts: {
        'frame.8': () => () => {},
        'frame.19': (base, S) => function (_c) {
          const { briefing, content, main, mode, u } = _c;
          const inspector=u.el('aside','ds-inspector',main);
          u.el('h3','',inspector,'Profile');
          const person=u.el('div','ds-person',inspector);
          u.el('div','ds-avatar',person,'AH');
          const identity=u.el('div','',person);
          u.el('strong','',identity,'Alex Huang');
          u.el('p','',identity,'Product Manager');
          u.el('p','',identity,'San Francisco, CA');
          u.el('h4','',inspector,'Account Details');
          const details=u.el('div','ds-detail',inspector);
          [['Email','alex.chen@inboxly.io'],['Phone','(415) 555-0198'],['Location','San Francisco, CA'],['Member since','Mar 3, 2020'],['Account type','Standard']].forEach(([k,v])=>{u.el('span','',details,k);u.el('span','',details,v);});
          u.el('span','',details,'Status');
          u.el('span','ds-status',details,'●　Active');
          const activity=u.el('div','ds-activity',inspector);
          u.el('h4','',activity,'Recent Activity');
          [['Profile updated','Apr 12, 2024'],['Password changed','Jan 28, 2024'],['New sign-in','Jan 14, 2024']].forEach(([a,b])=>{const row=u.el('p','',activity);u.el('b','',row,a);u.el('span','',row,b);});
          if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
          Object.assign(_c, { activity, details, identity, inspector, person });
        },
      },
    },
  });
})();
