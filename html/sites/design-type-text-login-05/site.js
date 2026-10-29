// XP Luna frame: visual sections on the shared site frame.
(function () {
  'use strict';
  const USERS =
    '<svg viewBox="0 0 110 92" width="110" height="92"><defs><radialGradient id="ub" cx="32%" cy="24%" r="80%"><stop stop-color="#b1e5ff"/><stop offset=".38" stop-color="#47b6fc"/><stop offset="1" stop-color="#0870d6"/></radialGradient><radialGradient id="ug" cx="30%" cy="20%" r="85%"><stop stop-color="#d6ffad"/><stop offset=".4" stop-color="#82cc47"/><stop offset="1" stop-color="#409215"/></radialGradient></defs><path d="M3 77C3 56 15 39 34 39S65 57 65 78Q35 96 5 81Z" fill="url(#ub)" stroke="#0868c2" stroke-width="3"/><path d="M10 74Q11 49 27 46" fill="none" stroke="#b4edff" stroke-width="4" opacity=".65"/><circle cx="35" cy="22" r="19" fill="url(#ub)" stroke="#0868c2" stroke-width="2.5"/><ellipse cx="29" cy="14" rx="5" ry="7" fill="#c9efff" opacity=".55"/><path d="M54 80C54 61 64 48 80 48S105 62 106 80Q83 94 56 83Z" fill="url(#ug)" stroke="#4a8b20" stroke-width="2.5"/><path d="M60 77Q60 59 73 54" fill="none" stroke="#ceff9c" stroke-width="3" opacity=".7"/><circle cx="80" cy="35" r="16" fill="url(#ug)" stroke="#4a8b20" stroke-width="2.5"/><ellipse cx="75" cy="29" rx="4" ry="6" fill="#e1ffc6" opacity=".6"/></svg>';

  const theme = {
    bg: '#f1efe5', panel: '#f5f9ff', fg: '#111111', muted: '#777777', line: '#aeb9cc',
  };

  // Preserve the reference's emphasis without interpreting the instruction as task data.
  function instructionStyle(el, util) {
    const text = el.textContent;
    el.classList.add('ds-instruction', 'xp-task');
    el.textContent = '';
    text.split(/("[^"\n]*")/g).forEach((part, i) =>
      util.el(i % 2 ? 'strong' : 'span', '', el, part));
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The document's margin has room for the instruction at every supported size.
      _c.display = _c.ctx.display;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const header = util.el('header', 'xp-title', document.body);
      util.el('span', 'xp-icon', header);
      util.el('span', 'xp-ttext', header, 'Account Login - MyPortal');
      const buttons = util.el('span', 'xp-btns', header);
      for (const [cls, glyph] of [['xp-b', '_'], ['xp-b', '□'], ['xp-b xp-x', '×']])
        util.el('i', cls, buttons, glyph);
      // Instructions are drawn by the shared sections, then the margin joins the body.
      const margin = util.el('aside', 'xp-margin');
      Object.assign(_c, { header, buttons, margin });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'xp-menu', document.body);
      for (const text of ['File', 'Edit', 'View', 'Tools', 'Help'])
        _c.util.el('span', '', menu, text);
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      if (_c.display === 'header') _c.util.el('h2', 'xp-mh', _c.margin, 'Task');
      base({ ..._c, header: _c.margin });
      const text = _c.margin.querySelector('.ref-instruction');
      if (text) {
        text.classList.remove('ref-instruction');
        instructionStyle(text, _c.util);
      }
      _c.margin.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      // Shared controls supply labels, decoy logging, finish mode and submit behavior.
      const tools = { ..._c, header: _c.menu };
      base(tools);
      tools.headerTools.className = 'xp-menutools';
      for (const button of tools.headerTools.querySelectorAll('[data-role="xtra"]'))
        button.className = 'xp-xtra';
      if (tools.submit) {
        tools.submit.className = 'xp-end xp-end-title';
        _c.buttons.prepend(tools.submit);
      }
      Object.assign(_c, { submit: tools.submit, headerTools: tools.headerTools });
    },
    'frame.body': () => (_c) => {
      const { util, margin } = _c;
      const body = util.el('div', 'xp-body ref-body', document.body);
      const doc = util.el('div', 'xp-doc', body);
      body.append(margin);
      Object.assign(_c, { body, doc });
    },
    'frame.panel': (base) => (_c) => {
      const { display, margin, util } = _c;
      base({ ..._c, body: margin });
      if (display === 'panel') {
        margin.style.order = '-1';
        const panel = margin.querySelector('.ref-panel');
        panel.className = 'xp-instructionpanel';
        const heading = panel.querySelector('.ref-panel-title');
        heading.className = 'xp-mh';
        heading.textContent = 'Task';
        const text = panel.querySelector('.ref-panel-text');
        text.classList.remove('ref-panel-text');
        instructionStyle(text, util);
      }
      util.el('h2', 'xp-mh xp-mh2', margin, 'Account Notes');
      const notes = util.el('ol', 'xp-notes', margin);
      for (const text of ['Account details are case sensitive.', 'Passwords are hidden as you type.'])
        util.el('li', '', notes, text);
    },
    'frame.stage': () => (_c) => {
      const { doc, util } = _c;
      const head = util.el('div', 'xp-head', doc);
      const logo = util.el('span', 'xp-logo', head);
      logo.innerHTML = USERS;
      const titles = util.el('div', 'xp-htext', head);
      util.el('div', 'xp-app', titles, 'MyPortal');
      util.el('div', 'xp-sub', titles, 'Sign in to your account');
      const group = util.el('section', 'xp-group', doc);
      util.el('div', 'xp-gtitle', group, 'Account Login');
      const inner = util.el('div', 'xp-ginner', group);
      const stage = util.el('main', 'ds-stage', inner);
      const extras = util.el('div', 'xp-extras', inner);
      const remember = util.el('label', 'xp-remember', extras);
      util.el('input', '', remember).type = 'checkbox';
      util.el('span', '', remember, 'Remember me');
      const forgot = util.el('a', 'xp-forgot', extras, 'Forgot your password?');
      forgot.href = '#';
      forgot.addEventListener('click', (event) => event.preventDefault());
      Object.assign(_c, { stage, inner });
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const { util } = _c;
      const foot = document.querySelector('.ref-foot') || util.el('footer', '', document.body);
      foot.className = 'xp-status';
      foot.querySelector('.ref-foot-text')?.remove();
      const ready = util.el('span', 'xp-ready', foot, 'Ready');
      foot.prepend(ready);
      const tools = foot.querySelector('.ref-tools');
      if (tools) tools.className = 'xp-foottools';
      for (const button of foot.querySelectorAll('[data-role="xtra"]')) button.className = 'xp-xtra';
      if (_c.submit && foot.contains(_c.submit))
        _c.submit.className = 'xp-end ' + (_c.placement === 'link' ? 'xp-end-link' : 'xp-end-footer');
      util.el('span', 'xp-num', foot, 'NUM');
      util.el('span', 'xp-grip', foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      if (_c.placement === 'floating') {
        const dock = _c.submit.parentElement;
        dock.className = 'xp-submitwrap';
        _c.submit.className = 'xp-submit';
        _c.inner.append(dock);
      }
    },
  };

  env.site({
    name: 'design-type-text-login-05',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { xp: theme },
      LOW_THEME: theme,
      ACCENTS: ['#0a4bc4'],
      LOW_ACCENTS: ['#0a4bc4'],
      LANGS: ['en'],
      parts,
    },
  });
})();
