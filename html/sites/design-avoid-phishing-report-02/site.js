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
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-header-instr', display === 'header');
        document.body.classList.toggle('ref-panel-instr', display === 'panel');
        Object.assign(_c, { H, W, display, roomy, tall });
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
        util.el('div', 'ref-tips-title', tips, '♧  Tips');
        util.el('ul', 'ref-tips-list', tips).innerHTML =
          '<li>Look for sender address spoofing, urgent requests, or links and attachments you weren’t expecting.</li><li>Report messages that look like impersonation or phishing attempts.</li><li>Keep genuine ticket notifications and other legitimate messages.</li>';
        util.el('div', 'ref-legend-title', tips, 'Message types');
        util.el('div', 'ref-legend', tips).innerHTML =
          '<div>✉　Email</div><div>▰　Support ticket</div><div>▤　Accounts payable</div><div>♙　Account or access request</div>';
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, tips });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, util } = _c;
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        const dock = util.el('nav', 'ref-app-dock', document.body);
        const dockItems = [
          ['Mail', '<rect x="3.5" y="5.5" width="21" height="16" rx="2.5"/><path d="m4.5 7 9 7 10-7"/>'],
          [
            'Calendar',
            '<rect x="4" y="5.5" width="20" height="17" rx="2.5"/><path d="M8 3.5v4M20 3.5v4M4.5 10h19M9 14h.01M14 14h.01M19 14h.01M9 18h.01M14 18h.01"/>',
          ],
          [
            'People',
            '<circle cx="9" cy="9" r="3.5"/><path d="M2.8 21c.4-4 2.4-6 6.2-6s5.8 2 6.2 6M17 6.2a3.2 3.2 0 0 1 0 6.2M17 16c2.7.2 4.2 1.8 4.5 4.5"/>',
          ],
          [
            'Tasks',
            '<rect x="4" y="4.5" width="17" height="19" rx="2.5"/><path d="M9 3v4M16 3v4M8 13l2.2 2.2L17 9M8 19h9"/>',
          ],
          ['Files', '<path d="M6 3.5h8l5 5V22H6zM14 3.5V9h5M9 13h7M9 17h7"/>'],
        ];
        for (const [item, paths] of dockItems) {
          const a = util.el('a', `ref-dock-item${item === 'Mail' ? ' active' : ''}`, dock);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'dock', label: item });
          });
          const icon = util.el('span', 'ref-dock-icon', a);
          icon.innerHTML = `<svg viewBox="0 0 28 28" aria-hidden="true">${paths}</svg>`;
          util.el('span', '', a, item);
        }
        Object.assign(_c, { dock, dockItems });
      },
  };

  env.site({
    name: 'design-avoid-phishing-report-02',
    template: 'site/base',
    design: { parts },
  });
})();
