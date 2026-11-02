// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        // Keep the reference design single-purpose, while consuming the same seeded draws.
        rng.bool(0.35);
        const sidebar = false;
        rng.bool(0.5);
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.appTitle = 'Riverton Community Credit Union - Member Services';
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const menu = util.el('nav', 'legacy-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Member', 'Inquiries', 'Reports', 'Tools', 'Window', 'Help']) {
          util.el('span', '', menu, item);
        }
        const toolbar = util.el('div', 'legacy-toolbar', document.body);
        for (const [icon, label] of [
          ['▤', 'New'],
          ['📂', 'Open'],
          ['▤', 'Print'],
          ['🔍', 'Find'],
          ['▣', 'Reports'],
        ]) {
          const tool = util.el('div', 'legacy-tool', toolbar);
          util.el('span', 'legacy-tool-icon', tool, icon);
          util.el('span', '', tool, label);
        }
        Object.assign(_c, { menu, toolbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const left = util.el('aside', 'legacy-left', body);
        const logo = util.el('div', 'legacy-logo', left);
        util.el('div', 'legacy-logo-art', logo).innerHTML =
          '<svg viewBox="0 0 300 112" aria-hidden="true"><path fill="#7293df" d="M0 89 48 42 76 70 117 13 169 79 202 49 300 91Z"/><path fill="#f6f2e7" d="m48 42 17 18 12-6 40-41 19 33-17-11-15 18-13-8-17 26-21-14-11 12Z"/><path fill="#214f9c" d="m0 89 48-47 20 23 48-52 53 66-49-30-29 25-29-14-26 28Z"/><g fill="#14572c"><path d="M18 96 29 56l11 40Zm24 1 13-51 14 51Zm31-2 11-39 11 39Zm139 1 11-44 12 44Zm28 0 13-53 14 53Zm29 0 11-39 12 39Z"/><path d="M23 83h12v30H23zm26 0h12v30H49zm34 4h10v26H83zm145-1h11v27h-11zm28-4h12v31h-12zm27 5h10v26h-10z"/></g><path fill="#20552b" d="M4 103h292v5H4z"/></svg><div class="legacy-logo-name">Riverton<br>Community<br>Credit Union</div>';
        const navBox = util.el('section', 'legacy-box', left);
        util.el('strong', 'legacy-box-title', navBox, 'Member Services');
        for (const line of [
          '▣  Member Inquiries',
          '▤  Account Services',
          '▤  Loan Services',
          '▤  Transaction Processing',
          '▤  Reports',
          '▤  System Maintenance',
        ])
          util.el('div', 'legacy-side-line', navBox, line);
        const quick = util.el('section', 'legacy-box', left);
        util.el('strong', 'legacy-box-title', quick, 'Quick Links');
        for (const line of ['▣  Holiday Schedule', '%  Rate Information', '▤  Forms Library', '▤  Community News'])
          util.el('div', 'legacy-side-line', quick, line);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, left, logo, navBox, quick });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'legacy-inspector', body);
        util.el('div', 'legacy-inspector-title', inspector, 'Related Records');
        for (const line of [
          '♟  Member Information',
          '▤  Loan Accounts',
          '▤  Certificates (CDs)',
          '▤  Share Accounts',
          '▤  ATM/Debit Cards',
          '▤  Check Orders',
          '▤  IRA Accounts',
          '▤  Account Statements',
          '▤  Transaction History',
          '▤  Service Requests',
        ]) {
          util.el('div', 'legacy-inspector-line', inspector, line);
        }
        const masthead = util.el('div', 'legacy-masthead', document.body);
        util.el('div', 'legacy-masthead-logo', masthead).innerHTML =
          '<svg viewBox="0 0 300 112" aria-hidden="true"><path fill="#7293df" d="M0 89 48 42 76 70 117 13 169 79 202 49 300 91Z"/><path fill="#f6f2e7" d="m48 42 17 18 12-6 40-41 19 33-17-11-15 18-13-8-17 26-21-14-11 12Z"/><path fill="#214f9c" d="m0 89 48-47 20 23 48-52 53 66-49-30-29 25-29-14-26 28Z"/><g fill="#14572c"><path d="M18 96 29 56l11 40Zm24 1 13-51 14 51Zm31-2 11-39 11 39Zm139 1 11-44 12 44Zm28 0 13-53 14 53Zm29 0 11-39 12 39Z"/><path d="M23 83h12v30H23zm26 0h12v30H49zm34 4h10v26H83zm145-1h11v27h-11zm28-4h12v31h-12zm27 5h10v26h-10z"/></g><path fill="#20552b" d="M4 103h292v5H4z"/></svg>';
        util.el(
          'div',
          'legacy-masthead-copy',
          masthead,
          'Riverton Community Credit Union\nA Stronger Community Together',
        );
        Object.assign(_c, { inspector, masthead, stage });
      },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-lookup-02',
    template: 'site/base',
    design: { parts },
  });
})();
