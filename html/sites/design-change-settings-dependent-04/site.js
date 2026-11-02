// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        document.body.classList.add('ref-workbench');
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-has-header', display === 'header');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const profile = util.el('div', 'wb-profile', header);
        const avatar = util.el('div', 'wb-avatar', profile, 'JS');
        const profileText = util.el('div', 'wb-profile-text', profile);
        util.el('strong', '', profileText, 'Jordan Smith');
        util.el('span', '', profileText, 'Product Manager');
        util.el('span', 'wb-contact', profileText, '✉　jordan.smith@acme.com');
        util.el('span', 'wb-contact', profileText, '♦　San Francisco, CA');
        util.el('span', 'wb-contact', profileText, '♣　Product Team');
        const meta = util.el('div', 'wb-meta', header);
        util.el('div', '', meta, 'Member since　　Jan 14, 2013');
        util.el('div', '', meta, 'Role　　　　　 Member');
        util.el('div', '', meta, 'Time zone　　　Pacific Time (US & Canada)');
        S.frameBrand(_c, header);
        Object.assign(_c, { avatar, header, meta, profile, profileText });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'wb-rail', body);
        util.el('div', 'wb-rail-brand', rail, 'Acme Projects');
        for (const [icon, title] of [
          ['◆', 'Dashboard'],
          ['■', 'Projects'],
          ['☑', 'Tasks'],
          ['▦', 'Calendar'],
          ['▣', 'Files'],
          ['♟', 'People'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', `wb-rail-item${title === 'Settings' ? ' selected' : ''}`, rail);
          util.el('span', 'wb-rail-icon', item, icon);
          util.el('span', '', item, title);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        let related = body;
        if (display === 'panel' || display === 'toast') {
          const panel = body.querySelector('.ref-panel');
          related = util.el('div', 'wb-related', body);
          if (panel) related.append(panel);
        }
        const projects = util.el('aside', 'wb-projects', related);
        const projectsHead = util.el('div', 'wb-projects-head', projects);
        util.el('strong', '', projectsHead, 'Your Projects');
        const newProject = util.el('button', 'wb-new-project', projectsHead, 'New Project');
        newProject.type = 'button';
        newProject.addEventListener('click', () => env.log('decoy', { what: 'new-project' }));
        const projectTable = util.el('div', 'wb-project-table', projects);
        util.el('div', 'wb-project-row wb-project-th', projectTable, 'Name　　　　　　　　　Updated ▴');
        for (const [dot, title, date] of [
          ['#3998f5', 'Website Redesign', 'Apr 2, 2013'],
          ['#2bb33e', 'Mobile App', 'Mar 28, 2013'],
          ['#ff7939', 'Marketing Site', 'Mar 25, 2013'],
          ['#ad55e9', 'Product Launch', 'Mar 20, 2013'],
          ['#dc353c', 'Customer Research', 'Mar 18, 2013'],
          ['#ffc52e', 'Design System', 'Mar 12, 2013'],
          ['#13b5a6', 'Q2 Planning', 'Mar 5, 2013'],
          ['#1675e8', 'Support Portal', 'Feb 28, 2013'],
          ['#ad55e9', 'API Integration', 'Feb 20, 2013'],
          ['#ff7939', 'Internal Tools', 'Feb 14, 2013'],
        ]) {
          const row = util.el('div', 'wb-project-row', projectTable);
          const mark = util.el('i', 'wb-project-dot', row);
          mark.style.background = dot;
          util.el('span', 'wb-project-name', row, title);
          util.el('span', 'wb-project-date', row, date);
        }
        Object.assign(_c, { newProject, projectTable, projects, projectsHead, related, stage });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        base(_c);
        if (_c.display === 'toast') {
          const note = document.body.lastElementChild;
          _c.related.append(note);
        }
      },
  };

  env.site({
    name: 'design-change-settings-dependent-04',
    template: 'site/base',
    design: { parts },
  });
})();
