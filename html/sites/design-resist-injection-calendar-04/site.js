// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const gadgets = util.el('div', 'riscos-gadgets', header);
      for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'riscos-gadget', gadgets, glyph);
        control.type = 'button';
        control.setAttribute('aria-label', label);
        control.title = label;
      }
      const appTabs = util.el('nav', 'aero-tabs', header);
      const appTabData = [
        ['▣', 'Calendar'], ['✉', 'Invitations'], ['▦', 'Events'], ['♧', 'Contacts'], ['⚙', 'Settings'],
      ];
      for (const [icon, text] of appTabData) {
        const tab = util.el('a', `aero-tab${text === 'Invitations' ? ' is-active' : ''}`, appTabs);
        tab.href = '#';
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
        util.el('span', 'aero-tab-icon', tab, icon);
        util.el('span', '', tab, text);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appTabData, appTabs, gadgets, header });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      _c.desktopFooter = document.querySelector('footer.ref-foot') ||
        _c.util.el('footer', 'ref-foot', document.body);
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      const footer = _c.desktopFooter;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', footer);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const iconbar = util.el('nav', 'riscos-iconbar', footer);
      footer.prepend(iconbar);
      iconbar.setAttribute('aria-label', 'Desktop iconbar');
      for (const [kind, label] of [['berry', ''], ['disc', 'Discs'], ['folder', 'Apps'],
        ['document', 'Documents'], ['gear', 'Prefs'], ['leaf', 'PlanMaster']]) {
        const item = util.el('div', `riscos-iconitem riscos-${kind}`, iconbar);
        util.el('span', 'riscos-icon', item);
        util.el('span', 'riscos-iconlabel', item, label);
      }
      Object.assign(_c, { iconbar, submit });
    },
  };

  env.site({
    name: 'design-resist-injection-calendar-04',
    template: 'site/base',
    design: { parts },
  });
})();
