// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Workplace Shell');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const libraryNav = ['Folder', 'Edit', 'View', 'Selected', 'Help'];
        const sampledNav = nav ? local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav) : libraryNav;
        for (let i = 0; i < libraryNav.length; i++) {
          const item = libraryNav[i];
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.body': (base) => function (_c) {
      base(_c);
      const { body, util } = _c;
      const tree = util.el('aside', 'wkp-tree', body);
      tree.setAttribute('aria-label', 'Workplace folders');
      util.el('div', 'wkp-folders', tree);
      const inspector = util.el('aside', 'wkp-properties', body);
      util.el('div', 'wkp-prop-bar', inspector, '▧  Properties');
      const tabs = util.el('div', 'wkp-prop-tabs', inspector);
      for (const label of ['General', 'Details', 'Attributes']) util.el('span', 'wkp-prop-tab', tabs, label);
      const identity = util.el('div', 'wkp-prop-identity', inspector);
      util.el('div', 'wkp-prop-icon', identity);
      const names = util.el('div', 'wkp-prop-names', identity);
      util.el('strong', '', names, 'Ridgeview National Park Help Center');
      util.el('div', '', names, 'Web Content');
      const details = util.el('div', 'wkp-prop-group', inspector);
      for (const [key, value] of [['Type:', 'Help Center Page'], ['Location:', 'https://www.ridgeviewnp.org/help'], ['Size:', '(variable)']]) {
        const row = util.el('div', 'wkp-prop-row', details);
        util.el('strong', '', row, key);
        util.el('span', '', row, value);
      }
      const dates = util.el('div', 'wkp-prop-group', inspector);
      for (const [key, value] of [['Created:', 'Mon, Jul 11, 1994  9:14 AM'], ['Modified:', 'Mon, Jul 11, 1994  9:14 AM'], ['Accessed:', 'Mon, Jul 11, 1994  9:16 AM']]) {
        const row = util.el('div', 'wkp-prop-row', dates);
        util.el('strong', '', row, key);
        util.el('span', '', row, value);
      }
      const description = util.el('div', 'wkp-prop-description', inspector);
      util.el('strong', '', description, 'Description:');
      const box = util.el('div', 'wkp-prop-textbox', description);
      util.el('div', '', box, 'Help articles, visitor information, park policies and more for Ridgeview National Park.');
      util.el('div', 'wkp-prop-scroll', box, '▲\n\n▼');
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.body.querySelector('.wkp-tree').prepend(panel);
    },
    'frame.end': (base) => function (_c) {
      const result = base(_c);
      const { util } = _c;
      document.body.style.setProperty('--wkp-shell-height', _c.header.getBoundingClientRect().height + 'px');
      const dock = util.el('div', 'wkp-dock', document.body);
      const apps = util.el('nav', 'wkp-dock-apps', dock);
      for (const [index, label] of ['LaunchPad', 'Shredder', 'File Manager', 'WebExplorer', 'Mail', 'Calendar', 'Print Manager'].entries()) {
        const button = util.el('button', 'wkp-dock-app', apps);
        button.type = 'button';
        const icon = util.el('span', 'wkp-dock-icon', button);
        icon.style.setProperty('--icon-x', [29, 225, 396, 583, 766, 926, 1093][index]);
        util.el('span', '', button, label);
        button.addEventListener('click', () => env.log('decoy', { label }));
      }
      const controls = util.el('div', 'wkp-dock-controls', dock);
      for (const old of document.querySelectorAll('.ref-foot, .ref-float-dock')) {
        for (const node of old.querySelectorAll('.ref-tools, .ref-float')) controls.append(node);
        old.remove();
      }
      const clock = util.el('div', 'wkp-clock', dock);
      util.el('span', 'wkp-speaker', clock, '♬');
      const time = util.el('div', '', clock);
      util.el('div', '', time, '9:16 AM');
      util.el('div', '', time, 'Mon, Jul 11, 1994');
      return result;
    },
    overlay: (base) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'chat') {
        const title = ctx.util.el('div', 'wkp-chat-title', null, '▤  Help Assistant');
        result.el.prepend(title);
        title.append(result.dismiss);
        const inputRow = ctx.util.el('div', 'wkp-chat-input', result.el);
        const input = ctx.util.el('input', '', inputRow);
        input.placeholder = 'Type a message...';
        input.setAttribute('aria-label', 'Message');
        const send = ctx.util.el('button', '', inputRow, 'Send');
        send.type = 'button';
        send.addEventListener('click', () => env.log('overlay-click', { label: 'Send' }));
      }
      return result;
    },
  };

  env.site({
    name: 'design-scroll-page-carousel-05',
    template: 'site/base',
    design: { parts },
  });
})();
