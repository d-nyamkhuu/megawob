// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      rng.bool(0.35); // preserve the reference frame draw
      const sidebar = true;
      rng.bool(0.5); // preserve the reference frame draw
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, nav, rng, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // retain seeded draw sequence
        for (const item of ['Home', 'Benefits', 'Housing', 'Council Tax', 'Licences', 'Environment', 'Your Council']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        util.el('strong', 'ref-side-title', side, 'Civic Support');
        rng.sample(content.NAV_ITEMS, rng.int(4, 7)); // retain seeded draw sequence
        for (const item of ['Overview', 'Who can apply', 'Apply online', 'Required evidence', 'After you apply', 'Changes to your details', 'Help and contact']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'ref-help', body);
      util.el('strong', 'ref-help-title', help, 'Help and Information');
      const helpSection = (title, text, link, bullets) => {
        const section = util.el('section', 'ref-help-section', help);
        util.el('a', 'ref-help-heading', section, title);
        if (text) util.el('div', 'ref-help-copy', section, text);
        if (bullets) {
          const list = util.el('ul', 'ref-help-list', section);
          for (const item of bullets) util.el('li', '', list, item);
        }
        if (link) {
          const a = util.el('a', 'ref-help-link', section, link);
          a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'help', label: link }); });
        }
      };
      helpSection('Civic Support', 'Financial help for people on low incomes or in need of extra support.', 'More about Civic Support');
      helpSection('What you will need', 'You may need to provide:', 'View full list of evidence',
        ['Proof of identity', 'Proof of address', 'Proof of income (if applicable)', 'Details of any dependants']);
      helpSection('Keeping your details safe', 'Your information will be used only for the purpose of assessing your application.', 'Our privacy policy');
      helpSection('Need help?', 'Call 0171 496 3000\nMon–Fri, 8.30am – 5.00pm', 'Email us');
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) help.appendChild(taskPanel);
      Object.assign(_c, { help, helpSection, stage, taskPanel });
    },
  };

  env.site({
    name: 'design-use-gov-portal-branching-01',
    template: 'site/base',
    design: { parts },
  });
})();
