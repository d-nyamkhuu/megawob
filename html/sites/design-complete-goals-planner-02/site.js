// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winTitle = util.el('div', 'irix-title', header, 'Plan Editor');
      const winIcon = util.el('span', 'irix-app-icon', header, '▤');
      winTitle.prepend(winIcon);
      winTitle.textContent = '';
      winTitle.append(winIcon, document.createTextNode('Event Planner'));
      const menu = util.el('nav', 'planner-menu', header);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, item);
      const toolbar = util.el('div', 'planner-toolbar', header);
      for (const [icon, label] of [['▧','New'],['📂','Open'],['▤','Print'],['♟','Contacts'],['▦','Calendar']]) {
        const action = util.el('button', '', toolbar);
        action.type = 'button'; action.innerHTML = `<b>${icon}</b><span>${label}</span>`;
      }
      const search = util.el('div', 'planner-search', toolbar);
      search.innerHTML = '<b>⌕</b><span>Search events...</span>';
      const winControls = util.el('div', 'irix-window-controls', header);
      for (const mark of ['−', '□', '×']) util.el('button', 'irix-window-control', winControls, mark).type = 'button';
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, search, toolbar, winControls, winIcon, winTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const hero = util.el('section', 'planner-hero', body);
      const emblem = util.el('div', 'planner-emblem', hero, '▲');
      const event = util.el('div', 'planner-event', hero);
      util.el('strong', '', event, 'Riverside Retreat');
      util.el('div', 'planner-subtitle', event, 'Event Planning');
      const details = util.el('div', 'planner-details', event);
      util.el('span', '', details, '♧　Lakeside Conference Center\n　　 Pinecrest, CA');
      util.el('span', '', details, '▦　 Sep 8, 2031 – Sep 29, 2031\n　　 22 nights');
      const overview = util.el('aside', 'planner-overview', hero);
      util.el('strong', '', overview, 'Event Overview');
      const metrics = util.el('div', 'planner-metrics', overview);
      for (const [ico, label, value] of [['♟','Attendees','48'],['▤','Sessions','12'],['⚑','Rooms','28']]) {
        const metric = util.el('div', '', metrics);
        util.el('span', '', metric, `${ico}　${label}`); util.el('b', '', metric, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, details, emblem, event, hero, metrics, overview });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'irix-inspector', body);
      const inspectorHead = util.el('div', 'irix-inspector-head', inspector);
      util.el('span', 'irix-inspector-icon', inspectorHead, '▤');
      util.el('strong', '', inspectorHead, 'Properties');
      const inspectorBlock = (title, rows) => {
        const block = util.el('section', 'irix-inspector-block', inspector);
        util.el('h3', '', block, title);
        const grid = util.el('div', 'irix-inspector-grid', block);
        for (const [k, v] of rows) { util.el('span', '', grid, k); util.el('span', '', grid, v); }
      };
      inspectorBlock('Selection', [['Type', 'Plan Settings'], ['Item', 'Multiple'], ['Modified', '—'], ['Size', '—']]);
      inspectorBlock('Appearance', [['Theme', 'Lavender'], ['Surface', 'Slate'], ['Font', 'Helvetica'], ['Text Size', '12']]);
      inspectorBlock('Limits', [['Volume Min', '0%'], ['Volume Max', '100%'], ['Range Handles', '2']]);
      const logo = util.el('div', 'irix-logo', inspector);
      util.el('span', '', logo, 'sgi');
      util.el('small', '', logo, '™');
      inspector.remove();
      if (display === 'panel') { const panel = body.querySelector('.ref-panel'); if (panel) inspector.insertBefore(panel, inspector.children[1]); }
      Object.assign(_c, { inspector, inspectorBlock, inspectorHead, logo, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, ctx, decoyBtn, decoys, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        util.el('span', 'planner-stat-icon', foot, '▥');
        util.el('span', 'ref-foot-text', foot, '48 attendees　　│　　12 sessions　　│　　28 rooms　　│　　22 nights');
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer' || placement === 'link' || (!submit && !ctx.finish)) submit = endBtn(tools, 'ref-submit', placement === 'link' ? `${label} ›` : label);
        util.el('span', 'planner-updated', foot, '♟　Last updated: Aug 12, 2005　10:24 AM');
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-complete-goals-planner-02',
    template: 'site/base',
    design: { parts },
  });
})();
