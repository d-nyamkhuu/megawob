// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appTabs = util.el('nav', 'aero-tabs', document.body);
      const appTabData = [
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="22" rx="1"/><path d="M4 12h24M10 3v7M22 3v7"/></svg>', 'Calendar'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="10" r="5"/><circle cx="23" cy="12" r="4"/><path d="M3 27c0-6 4-10 9-10s9 4 9 10M19 19c5-1 10 2 10 8"/></svg>', 'Contacts'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="m9 16 5 5 10-11"/></svg>', 'Tasks'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 3h14l7 7v19H6zM20 3v8h7M11 16h11M11 21h11M11 26h8"/></svg>', 'Notes'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m13 3 6 0 1 4 3 1 3-2 4 5-3 3 0 4 3 3-4 6-4-2-3 1-1 4h-6l-1-4-3-1-4 2-3-6 3-3v-4l-3-3 4-5 4 2 3-1z"/><circle cx="16" cy="16" r="4"/></svg>', 'Settings'],
      ];
      for (const [icon, text] of appTabData) {
        const tab = util.el('a', `aero-tab${text === 'Calendar' ? ' is-active' : ''}`, appTabs);
        tab.href = '#';
        tab.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
        const tabIcon = util.el('span', 'aero-tab-icon', tab);
        tabIcon.innerHTML = icon;
        util.el('span', '', tab, text);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appTabData, appTabs, header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const tips = util.el('aside', 'kinetic-tips', body);
      for (const child of Array.from(body.children)) {
        if (child !== tips) tips.appendChild(child);
      }
      util.el('div', 'kinetic-tips-title', tips, 'Tips');
      const tipItems = [
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="22" rx="1"/><path d="M4 12h24M10 3v7M22 3v7"/></svg>', 'Review the invitation', 'Check the date, time, location and description details from the organizer.'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="m9 16 5 5 10-11"/></svg>', 'Set your response', 'Choose Accept, Tentative, or Decline.'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 3h14l7 7v19H6zM20 3v8h7M11 16h11M11 21h11M11 26h7"/><path d="m22 23 5 5"/></svg>', 'Add a room note', 'Copy the room information from the description into the room note field.'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="6" width="26" height="20" rx="1"/><path d="m4 8 12 10L28 8"/></svg>', 'Notify others (optional)', 'Use the email option to message the contact list if needed.'],
      ];
      for (const [icon, title, text] of tipItems) {
        const item = util.el('div', 'kinetic-tip', tips);
        const symbol = util.el('span', 'kinetic-tip-icon', item);
        symbol.innerHTML = icon;
        const copy = util.el('div', 'kinetic-tip-copy', item);
        util.el('strong', '', copy, title);
        util.el('span', '', copy, text);
      }
      const workspace = util.el('div', 'kinetic-workspace', body);
      const heading = util.el('div', 'kinetic-heading', workspace);
      util.el('div', 'kinetic-heading-title', heading, 'INVITATIONS');
      util.el('span', 'kinetic-heading-count', heading, '3');
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, tipItems, tips });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.body.querySelector(':scope > .ref-note');
      if (note) _c.tips.prepend(note);
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.body.querySelector(':scope > .ref-float-dock');
      const footer = document.body.querySelector(':scope > .ref-foot');
      if (dock && footer) footer.appendChild(dock);
    },
  };

  env.site({
    name: 'design-resist-injection-calendar-03',
    template: 'site/base',
    design: { parts },
  });
})();
