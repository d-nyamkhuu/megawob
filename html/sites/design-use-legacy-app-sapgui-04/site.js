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
      document.body.dataset.display = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'wb-menu', header);
      for (const item of ['File', 'Edit', 'Goto', 'Extras', 'System', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'wb-toolbar', header);
      for (const [icon, label] of [['▰','Open'], ['▤','New'], ['▣','Print'], ['⌕','Find'], ['▧','Document'], ['▤','List'], ['?','Help']]) {
        const b = util.el('button', '', toolbar, icon); b.type = 'button'; b.title = label;
      }
      const tabs = util.el('nav', 'wb-tabs', header);
      for (const [name, active] of [['Customer Maintenance', true], ['Customer Inquiry', false], ['Reports', false], ['Utilities', false]]) {
        const tab = util.el('div', active ? 'wb-tab active' : 'wb-tab', tabs, name);
        tab.setAttribute('aria-hidden', 'true');
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, tabs, toolbar });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'wb-help', body);
      util.el('div', 'wb-help-title', help, 'Help');
      const helpBody = util.el('div', 'wb-help-body', help);
      util.el('strong', '', helpBody, 'ZREC - Customer Maintenance');
      util.el('hr', '', helpBody);
      util.el('p', '', helpBody, 'Enter a customer ID and choose an action from the toolbar or menu.');
      util.el('p', '', helpBody, 'You can also type a transaction command in the field above (e.g. ZREC, ZINQ).');
      util.el('hr', '', helpBody);
      util.el('strong', '', helpBody, 'Field Information:');
      for (const [field, description] of [['Customer ID', 'Unique customer number.'], ['Cost center', '4-digit cost center code.'],
        ['Routing note', 'Free text (max 30 chars).'], ['Retry limit', 'Number of retry attempts (0 - 9).']]) {
        const row = util.el('div', 'wb-field-row', helpBody);
        util.el('span', 'wb-field-name', row, field);
        util.el('span', 'wb-field-description', row, description);
      }
      util.el('hr', '', helpBody);
      util.el('strong', '', helpBody, 'Navigation:');
      util.el('div', '', helpBody, 'F3       Back');
      util.el('div', '', helpBody, 'F4       Value help');
      util.el('div', '', helpBody, 'F7       Previous record');
      util.el('div', '', helpBody, 'F8       Next record');
      util.el('div', '', helpBody, 'Ctrl+S   Save record');
      util.el('div', '', helpBody, 'Ctrl+P   Print');
      Object.assign(_c, { help, helpBody, stage });
    },
  };

  env.site({
    name: 'design-use-legacy-app-sapgui-04',
    template: 'site/base',
    design: { parts },
  });
})();
