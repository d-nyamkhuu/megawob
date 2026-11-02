// MarketGate's portal frame, drawn through the shared site frame sections.
(function () {
  'use strict';

  const theme = { bg: '#eef2f9', panel: '#fff', fg: '#111', muted: '#444', line: '#8a98b5' };

  function instruction(note) {
    note.classList.add('mg-instr');
    const text = note.textContent;
    const match = /^([\s\S]*?)("[^"]+")([\s\S]*)$/.exec(text);
    if (match) {
      note.textContent = '';
      note.appendChild(document.createTextNode(match[1]));
      const emphasis = document.createElement('span');
      emphasis.className = 'mg-red';
      emphasis.textContent = match[2];
      note.appendChild(emphasis);
      note.appendChild(document.createTextNode(match[3]));
    } else note.textContent = text;
    return note;
  }

  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      // Keep the portal's status panels, and retain all template placements.
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const header = util.el('header', 'mg-top', document.body);
      const logo = util.el('span', 'mg-logo', header);
      util.el('span', '', logo, 'Market');
      util.el('span', 'mg-gate', logo, 'Gate');
      const tag = util.el('span', 'mg-tag', header);
      tag.appendChild(document.createTextNode('Your Online Directory'));
      tag.appendChild(document.createElement('br'));
      tag.appendChild(document.createTextNode('for Shopping and More'));
      const nav = util.el('nav', 'mg-nav', header);
      ['Home', 'Products', 'Shops', 'Help', 'Contact'].forEach((text, i) => {
        if (i) util.el('i', '', nav, '|');
        util.el('a', '', nav, text);
      });
      const quick = util.el('div', 'mg-quick', header);
      util.el('b', '', quick, 'Quick Search:');
      util.el('input', 'mg-qi', quick).type = 'text';
      util.el('button', 'mg-btn', quick, 'Go').type = 'button';
      Object.assign(_c, { header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.instructionHome = document.createElement('div');
      _c.header = _c.instructionHome;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = document.createElement('div');
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const { util } = _c;
      const body = util.el('div', 'mg-body ref-body', document.body);
      const left = util.el('div', 'mg-left', body);
      Object.assign(_c, { body, left });
    },
    'frame.panel': (base) => (_c) => {
      const { display, left, util } = _c;
      const panel = util.el('section', 'mg-panel mg-ti', left);
      util.el('h2', 'mg-strip', panel, 'Task Instructions');
      const panelBody = util.el('div', 'mg-pbody', panel);
      const body = _c.body;
      _c.body = panelBody;
      base(_c);
      _c.body = body;
      if (display === 'header' || display === 'panel') {
        if (display === 'header') panelBody.appendChild(_c.instructionHome.firstChild);
        const note = instruction(panelBody.querySelector('.ref-instruction, .ref-panel-text'));
        if (display === 'panel') note.classList.add('mg-instr-panel');
        util.el('hr', 'mg-rule', panelBody);
      }
      if (display !== 'hidden') {
        util.el('p', 'mg-small', panelBody,
          'You are on the Returns page. Complete the form in the Returns Center.');
      }
      const helpful = util.el('section', 'mg-panel mg-hl', left);
      _c.floatingHome = util.el('h2', 'mg-strip big', helpful, 'Helpful Links');
      const links = util.el('div', 'mg-links', helpful);
      ['Returns Overview', 'Shipping Information', 'Our Policies',
        'Frequently Asked Questions', 'Contact Customer Service'].forEach((text) => util.el('a', '', links, text));
      const extras = util.el('div', 'mg-extras', links);
      for (const button of Array.from(_c.headerTools.querySelectorAll('.ref-xtra'))) extras.appendChild(button);
      for (const button of extras.children) button.classList.add('mg-xtra-link');
      if (display === 'hidden') {
        panel.remove();
        helpful.style.flex = '1';
        helpful.style.height = 'auto';
      }
      Object.assign(_c, { panelBody });
    },
    'frame.stage': () => (_c) => {
      const { body, headerTools, util } = _c;
      const center = util.el('section', 'mg-panel mg-rc', body);
      const title = util.el('h2', 'mg-strip big', center, 'Returns Center');
      title.appendChild(headerTools);
      if (_c.submit) _c.submit.classList.add('mg-btn', 'mg-end-head');
      _c.stage = util.el('main', 'ds-stage', center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.panelBody.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const { util } = _c;
      const footer = util.el('footer', 'mg-foot', document.body);
      const find = util.el('section', 'mg-fpanel f1', footer);
      util.el('h3', 'mg-strip', find, 'Find It');
      const search = util.el('div', 'mg-fbody', find);
      const input = util.el('input', 'mg-si', search);
      input.type = 'text';
      input.placeholder = 'Search products, brands, or topics';
      util.el('button', 'mg-btn', search, 'Go').type = 'button';
      const service = util.el('section', 'mg-fpanel f2', footer);
      util.el('h3', 'mg-strip', service, 'Customer Service');
      const serviceBody = util.el('div', 'mg-fbody links', service);
      [
        ['Email Us', '<rect x="1" y="4" width="22" height="17" rx="1" fill="#084a91"/><path d="M2 5l10 8L22 5" fill="none" stroke="white"/>'],
        ['Call Us', '<path d="M6 2l4 5-2 2c1 3 3 5 6 6l2-2 5 4-2 4C9 21 3 13 3 5z" fill="#084a91"/>'],
        ['Live Help', '<circle cx="12" cy="12" r="12" fill="#084a91"/><path d="M8.7 8a3.4 3.4 0 116.5 1.4c-.7 1.2-3.2 1.9-3.2 4" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="17.5" r="1.3" fill="white"/>'],
      ].forEach(([text, drawing]) => {
        const icon = util.el('span', 'mg-ic', serviceBody);
        icon.innerHTML = '<svg viewBox="0 0 24 24">' + drawing + '</svg>';
        util.el('a', '', serviceBody, text);
      });
      const account = util.el('section', 'mg-fpanel f3', footer);
      util.el('h3', 'mg-strip', account, 'Your Account');
      const accountBody = util.el('div', 'mg-fbody links', account);
      ['Order History', 'Returns', 'Account Settings'].forEach((text, i) => {
        if (i) util.el('i', '', accountBody, '|');
        util.el('a', '', accountBody, text);
      });
      const actions = util.el('section', 'mg-fpanel f4', footer);
      util.el('h3', 'mg-strip', actions, 'Form Actions');
      const actionBody = util.el('div', 'mg-fbody', actions);
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      actionBody.appendChild(foot);
      const end = foot.querySelector('[data-role="submit"]');
      if (end) end.classList.add(end.classList.contains('ref-endlink') ? 'mg-endlink' : 'mg-submit');
      const extras = document.querySelector('.mg-extras');
      for (const button of Array.from(foot.querySelectorAll('.ref-xtra'))) {
        button.classList.add('mg-xtra-link');
        extras.appendChild(button);
      }
      util.el('button', 'mg-btn mg-clear', actionBody, 'Clear').type = 'button';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.floatingHome.appendChild(dock);
        _c.submit.classList.add('mg-btn', 'mg-end-head');
      }
    },
  };

  env.site({
    name: 'design-choose-option-dropdown-02',
    template: 'site/base',
    styles: ['../base/site.css', 'site.css'],
    design: {
      THEMES: { portal: theme },
      LOW_THEME: theme,
      ACCENTS: ['#2a7ae4'],
      LOW_ACCENTS: ['#2a7ae4'],
      parts,
    },
  });
})();
