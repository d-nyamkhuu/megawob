// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
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
        // This design keeps a stable Memphis palette across episode frame scenarios.
        root.style.setProperty('--bg', '#fffaf1');
        root.style.setProperty('--panel', '#ffffff');
        root.style.setProperty('--fg', '#101b3e');
        root.style.setProperty('--muted', '#5e6884');
        root.style.setProperty('--line', '#c9cbd4');
        root.style.setProperty('--accent', '#1768e8');
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
        document.body.dataset.refDisplay = display;
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Company Mail and Accounts');
        brand.dataset.role = 'brand';
        util.el('span', 'ref-brand-sub', header, 'MAIL & TICKET TRIAGE');
        Object.assign(_c, { brand, header, title });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);

        // Fixed classic application tabs sit between the caption bar and task area.
        const tabs = util.el('nav', 'ref-tabs', header);
        for (const item of ['Mail', 'Accounts Payable', 'Vendor Records', 'Payment Queue', 'Reports']) {
          const tab = util.el('a', 'ref-tab', tabs, item);
          tab.href = '#';
          tab.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'tab', label: item });
          });
        }
        Object.assign(_c, { tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const tips = util.el('aside', 'ref-tips', body);
        util.el('div', 'ref-tips-title', tips, '♧  Tips');
        util.el('ul', 'ref-tips-list', tips).innerHTML =
          '<li>Look for sender address spoofing, urgent requests, or links and attachments you weren’t expecting.</li><li>Report messages that look like impersonation or phishing attempts.</li><li>Keep genuine ticket notifications and other legitimate messages.</li>';
        util.el('div', 'ref-legend-title', tips, 'Message types');
        util.el('div', 'ref-legend', tips).innerHTML =
          '<div>✉　Email</div><div>▰　Support ticket</div><div>▤　Accounts payable</div><div>♙　Account or access request</div>';
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, tips });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const related = util.el('aside', 'ref-related', body);
        util.el('strong', 'ref-related-title', related, 'Related Records');
        const relatedGroup = (icon, title, lines) => {
          const group = util.el('section', 'ref-related-group', related);
          util.el('span', 'ref-related-icon', group, icon);
          const copy = util.el('div', 'ref-related-copy', group);
          util.el('b', '', copy, title);
          util.el('div', '', copy, lines.join('\n'));
        };
        relatedGroup('▣', 'IT Tickets (3)', [
          '#48217  Apr 24, 9:14 AM',
          '#48219  Apr 23, 4:18 PM',
          '#48210  Apr 22, 11:06 AM',
        ]);
        relatedGroup('▤', 'Pending Invoices (4)', [
          'Inv 90877  Apr 23, 2:41 PM',
          'Inv 90821  Apr 22, 9:17 AM',
          'Inv 90803  Apr 21, 3:05 PM',
          'Inv 90756  Apr 20, 10:48 AM',
        ]);
        relatedGroup('▣', 'Vendor Contacts (5)', [
          'Contoso Ltd.',
          'Fabrikam Inc.',
          'Northwind Traders',
          'Wide World Importers',
          'A. Datum Corporation',
        ]);
        Object.assign(_c, { related, relatedGroup, stage });
      },
  };

  env.site({
    name: 'design-avoid-phishing-report-04',
    template: 'site/base',
    design: { parts },
  });
})();
