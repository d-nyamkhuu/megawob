// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.classList.toggle('orion-note-header', display === 'header');
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      rng.bool(0.5); // keep the reference frame draw sequence stable
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const directory = util.el('aside', 'orion-directory', body);
      util.el('h2', '', directory, 'Employee Directory');
      const filter = util.el('div', 'orion-filter', directory, 'All Employees　　▾');
      filter.setAttribute('aria-hidden', 'true');
      const rows = util.el('div', 'orion-directory-rows', directory);
      const listHead = util.el('div', 'orion-directory-head', rows);
      util.el('span', '', listHead, 'Name');
      util.el('span', '', listHead, 'Title');
      const people = [
        ['Daniel Cho', 'CEO'], ['Maya Singh', 'Chief People Officer'], ['Lars Pettersen', 'VP, Engineering'],
        ['Jelena Kovačević', 'VP, Product'], ['Alessia Farouk', 'Product Manager'], ['Kenji Tanaka', 'Senior Product Designer'],
        ['Priya Sharma', 'Product Analyst'], ['Tomás Ribeiro', 'Engineering Manager'], ['Sophie Martin', 'Software Engineer'],
        ['Diego Herrera', 'Software Engineer'], ['Mei Lin', 'QA Engineer'], ['Carlos Mendes', 'DevOps Engineer'],
        ['Fatima Al-Sayed', 'HR Business Partner'], ['Oliver Grant', 'Recruiter'], ['Nina Patel', 'Office Manager'],
        ['Lucas Moretti', 'IT Support Specialist'],
      ];
      for (const [person, title] of people) {
        const row = util.el('div', 'orion-directory-row', rows);
        util.el('span', 'orion-person-photo', row, person.split(/\s+/).map((part) => part[0]).join('').slice(0, 2));
        util.el('span', 'orion-person-name', row, person);
        util.el('span', 'orion-person-title', row, title);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, directory, filter, listHead, people, rows });
    },
  };

  env.site({
    name: 'design-use-hr-orgchart-04',
    template: 'site/base',
    design: { parts },
  });
})();
