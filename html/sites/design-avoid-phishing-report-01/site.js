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
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Acme Tools');
        brand.dataset.role = 'brand';
        util.el('span', 'ref-brand-sub', header, 'MAIL & TICKET TRIAGE');
        Object.assign(_c, { brand, header, title });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const tips = util.el('aside', 'ref-tips', body);
        util.el('div', 'ref-tips-title', tips).innerHTML =
          '<svg viewBox="0 0 48 56" aria-hidden="true"><path d="M24 4a15 15 0 0 0-9 27c3 2 4 5 4 8h10c0-3 1-6 4-8A15 15 0 0 0 24 4Z"/><path d="M19 44h10m-9 5h8M24 0v-5M6 8 2 4m36 4 4-4M4 23h-6m46 0h6"/></svg><b>Tips</b>';
        util.el('ul', 'ref-tips-list', tips).innerHTML =
          '<li>Look for sender address spoofing, urgent requests, or links and attachments you weren’t expecting.</li><li>Report messages that look like impersonation or phishing attempts.</li><li>Keep genuine ticket notifications and other legitimate messages.</li>';
        util.el('div', 'ref-legend-title', tips, 'Message types');
        util.el('div', 'ref-legend', tips).innerHTML =
          '<div><svg viewBox="0 0 40 32"><path d="M2 3h36v26H2zM3 5l17 13L37 5"/></svg>Email</div><div><svg viewBox="0 0 40 32"><path d="M3 3h34v8q-7 5 0 10v8H3v-8q7-5 0-10z"/></svg>Support ticket</div><div><svg viewBox="0 0 40 32"><path d="M3 3h34v26H3zM10 10h20m-20 8h13"/></svg>Accounts payable</div><div><svg viewBox="0 0 40 40"><circle cx="20" cy="11" r="7"/><path d="M5 36c1-10 6-15 15-15s14 5 15 15z"/></svg>Account or access request</div>';
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, tips });
      },
  };

  env.site({
    name: 'design-avoid-phishing-report-01',
    template: 'site/base',
    design: { parts },
  });
})();
