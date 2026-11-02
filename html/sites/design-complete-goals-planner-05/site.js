// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winTitle = util.el('div', 'irix-title', header, 'Plan Editor');
      const winIcon = util.el('span', 'irix-app-icon', header, '☼');
      winTitle.prepend(winIcon);
      const winControls = util.el('div', 'irix-window-controls', header);
      for (const mark of ['−', '□', '×']) util.el('button', 'irix-window-control', winControls, mark).type = 'button';
      winTitle.childNodes[1].textContent = 'Conference Planner';
      const menu = util.el('nav', 'openlook-menu', document.body);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, label);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, winControls, winIcon, winTitle });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const rail = util.el('nav', 'openlook-rail', body);
      const icons = [
        '<path d="M5 22 23 5l18 17-4 4-3-3v23H12V23l-3 3z" fill="#eee"/><path d="M27 7V3h7v11M24 33h8v13h-8z" fill="#b68d5a"/><path d="m12 23 11-10 11 10" fill="none"/>',
        '<path d="M6 10h13l4 5h20v29H6z" fill="#babfc5"/><path d="M7 16h36v28H7z" fill="#dce0e3"/><path d="M10 11h14v4H10" fill="#eee"/>',
        '<g fill="#bec8d4"><circle cx="11" cy="14" r="5"/><circle cx="25" cy="12" r="6"/><circle cx="39" cy="14" r="5"/><path d="M3 35V25c0-8 15-8 15 0v10zM32 35V25c0-8 15-8 15 0v10z"/><path d="M14 39V28c0-11 23-11 23 0v11z"/></g>',
        '<path d="M8 4h34v43H8z" fill="#dce0e4"/><path d="M15 13h21M15 20h21M15 27h21M15 35h13"/>',
        '<path d="M6 5h38v40H6z" fill="#d4dae2"/><path d="M13 27h5v11h-5zM23 20h5v18h-5zM33 12h5v26h-5z" fill="#9aabc0"/>'
      ];
      for (const [i, label] of ['Events','Venues','Attendees','Plans','Reports'].entries()) {
        const item = util.el('div', 'openlook-rail-item', rail);
        util.el('span', 'openlook-rail-icon', item).innerHTML = '<svg viewBox="0 0 50 50" fill="none" stroke="#18212b" stroke-width="1.8" stroke-linejoin="miter">' + icons[i] + '</svg>';
        util.el('span', '', item, label);
      }
      const inspector = util.el('aside', 'irix-inspector', body);
      const inspectorHead = util.el('div', 'irix-inspector-head', inspector);
      util.el('span', 'irix-inspector-icon', inspectorHead, '⌖');
      util.el('strong', '', inspectorHead, 'Tips');
      util.el('span', 'openlook-pin', inspectorHead).innerHTML = '<svg viewBox="0 0 28 34" fill="#202326" stroke="#080a0c" stroke-width="1.3"><path d="m16 3 9 4-3 4-2-1-5 12 3 4-13-5 5-1 5-12-2-1z"/><path d="m11 23-5 10" fill="none" stroke-width="2"/></svg>';
      const tips = util.el('div', 'openlook-tips', inspector);
      for (const line of ['Set the event date using the calendar.', 'Adjust the similarity threshold to control how closely items must match.', 'Choose a registration plan to see its features.']) util.el('p', '', tips, line);
      util.el('hr', '', inspector);
      util.el('h2', 'openlook-details-heading', inspector, 'Plan Details');
      const featureList = (title, items) => {
        const group = util.el('section', 'openlook-plan-group', inspector);
        util.el('h3', '', group, title);
        const list = util.el('ul', '', group);
        for (const item of items) util.el('li', '', list, item);
      };
      featureList('Basic', ['Access to main sessions', 'Exhibition area']);
      featureList('Standard', ['Main sessions', 'Exhibition area', 'Workshop access']);
      featureList('Premium', ['All Standard features', 'Priority seating']);
      const logo = util.el('div', 'irix-logo', inspector);
      util.el('span', '', logo, 'sgi');
      util.el('small', '', logo, '™');
      if (display === 'panel') { const panel = body.querySelector('.ref-panel'); if (panel) inspector.insertBefore(panel, inspector.children[1]); }
      logo.remove();
      Object.assign(_c, { inspector, inspectorHead, logo, rail, stage });
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      if (!document.querySelector('.ref-foot')) _c.util.el('footer', 'ref-foot', document.body);
    },
  };

  env.site({
    name: 'design-complete-goals-planner-05',
    template: 'site/base',
    design: { parts },
  });
})();
