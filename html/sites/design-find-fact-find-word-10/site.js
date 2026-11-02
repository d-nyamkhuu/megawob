(function () {
  'use strict';
  const LEAF =
    '<svg width="40" height="38" viewBox="0 0 40 38"><path d="M16 24C4 21 1 12 5 8c5-3 11 1 15 7" fill="#c5e4ec" stroke="#5796bb" stroke-width="2.5"/><path d="M11 34c1-9 1-18 8-24 5-5 12-3 19-7-2 9-4 18-12 22-5 2-9 0-11-2" fill="#8dc54b" stroke="#528eb1" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 34c3-11 10-18 19-23" fill="none" stroke="#4b9193" stroke-width="2.5" stroke-linecap="round"/></svg>';
  const DOC =
    '<svg width="58" height="70" viewBox="0 0 58 70"><path d="M6 3h32l14 14v50H6z" fill="#eef5fc" stroke="#6f93b8" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 3v14h14" fill="none" stroke="#6f93b8" stroke-width="2.5"/><path d="M14 28h30M14 38h30M14 48h30M14 58h20" stroke="#8fb0d2" stroke-width="3" stroke-linecap="round"/></svg>';
  const DOTS =
    '<svg width="76" height="76" viewBox="0 0 76 76"><circle cx="38" cy="38" r="33" fill="none" stroke="#5f7f9f" stroke-width="4"/><circle cx="23" cy="38" r="4.5" fill="#5f7f9f"/><circle cx="38" cy="38" r="4.5" fill="#5f7f9f"/><circle cx="53" cy="38" r="4.5" fill="#5f7f9f"/></svg>';
  const palette = { bg: '#f3f8fc', panel: '#fff', fg: '#1d3248', muted: '#4a6a85', line: '#b9d6ea' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = LEAF;
      const br = u.el('span', 'ds-brand', top);
      u.el('b', '', br, 'Task');
      u.el('i', '', br, 'Mate');
      const nav = u.el('nav', 'ds-menu', top);
      ['Focus', '·', 'Find', '·', 'Finish'].forEach((t) => u.el('span', t === '·' ? 'dot' : '', nav, t));
      const right = u.el('span', 'ds-links', top);
      ['Help', '|', 'Settings', '|', 'Sign Out'].forEach((t) => u.el('span', t === '|' ? 'sep' : '', right, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      content.dataset.endPlacement = _c.placement || 'none';
      let header = content;
      if (_c.display === 'header') {
        header = u.el('aside', 'ds-header-note', content);
        const ic = u.el('span', 'ds-docicon', header);
        ic.innerHTML = DOC;
        u.el('h2', '', header, 'Your Task');
      }
      Object.assign(_c, { header, right, body, contentPane: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.right;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const fb = u.el('aside', 'ds-feedback', _c.body);
      u.el('h3', '', fb, 'Feedback');
      const fbb = u.el('div', 'ds-fbbody', fb);
      const ic = u.el('span', '', fbb);
      ic.innerHTML = DOTS;
      u.el('p', '', fbb, _c.ctx.spec.answerBy === 'reply' ? 'Waiting for your reply...' : 'Waiting for your answer...');
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.contentPane;
      base(_c);
      _c.body = body;
      const panel = _c.contentPane.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-title').textContent = 'Your Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.contentPane);
      _c.stage = _c.util.el('main', 'ds-stage', main);
      _c.main = main;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.contentPane.appendChild(foot);
        foot.querySelector('.ref-foot-text').remove();
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(button);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-find-word-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2e8b2e'],
      LOW_ACCENTS: ['#2e8b2e'],
      parts,
    },
  });
})();
