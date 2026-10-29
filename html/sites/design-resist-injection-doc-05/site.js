// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icon = (name) => {
    const paths = {
      Overview: '<path d="M3 14 16 3l13 11-3 1v14H7V15z" fill="#eee9df"/><path d="m6 8 3-3 4 1M21 6l4 3"/><circle cx="16" cy="19" r="5" fill="#faf8f1"/>',
      Tasks: '<path d="M6 6h20v24H6z" fill="#f9edcd"/><path d="M12 6V3h8v3l3 1v4H9V7z" fill="#e7d7b7"/><path d="m10 16 2 2 4-5m-6 11 2 2 4-5m2-5h5m-5 8h5"/>',
      Documents: '<path d="M6 2h13l9 9v20H6z" fill="#faf9f5"/><path d="M19 2v9h9M10 15h14M10 19h14M10 23h14M10 27h14"/>',
      Discussions: '<path d="M3 5q0-3 4-3h20q3 0 3 4v14q0 3-4 3H17l-8 8 2-8H6q-3 0-3-4z" fill="#dce8f3" stroke="#455e79"/><path d="M8 8h17M8 13h17M8 18h12" stroke="#6486a7"/>',
      Calendar: '<path d="M3 5h27v26H3z" fill="#fff"/><path d="M3 5h27v7H3z" fill="#d46c48"/><path d="M9 2v7M24 2v7M7 17h19M7 23h19M12 14v14M20 14v14"/>',
      People: '<circle cx="12" cy="9" r="6" fill="#eee9df"/><path d="M3 29v-7q0-7 9-7t9 7v7z" fill="#c6d8e5"/><path d="M21 4q7 0 7 6 0 5-5 6 7 1 7 9v4h-7M12 17v12"/>',
      document: '<path d="M5 1h15l10 10v30H5z" fill="#eef4fb" stroke="#3d567b"/><path d="M20 1v11h10" fill="#cad8e8" stroke="#3d567b"/><path d="M10 16h15M10 20h15M10 24h15M10 28h15M10 32h15M10 36h15" stroke="#6686ac"/>',
      sheet: '<path d="M5 1h15l10 10v30H5z" fill="#edf7ed" stroke="#20795a"/><path d="M20 1v11h10" fill="#b5dcc7" stroke="#20795a"/><path d="M9 17h17v20H9zM9 23h17M9 30h17M17 17v20" stroke="#20795a" fill="none"/><path d="M10 18h6v4h-6zM18 24h7v5h-7zM10 31h6v5h-6z" fill="#31926b" stroke="none"/>',
      progress: '<circle cx="16" cy="16" r="14" fill="#e8e3d9"/><path d="M16 2v14l11 8A14 14 0 0 0 16 2z" fill="#eda146"/><path d="M16 16h14"/>',
      related: '<rect x="5" y="3" width="23" height="27" rx="1" fill="#eee9df"/><path d="M9 9h15M9 15h15M9 21h15"/>',
    };
    return `<svg viewBox="0 0 ${name === 'document' || name === 'sheet' ? '34 43' : '33 33'}" fill="none" stroke="#47433e" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${paths[name] || paths.document}</svg>`;
  };

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('forgenote-titlebar');
      const appmark = util.el('span', 'fn-mark', header, '✦');
      appmark.setAttribute('aria-hidden', 'true');
      util.el('span', 'fn-appname', header, 'Project Workroom – Phoenix');
      const menus = util.el('nav', 'fn-menus', header);
      for (const item of ['Overview', 'Tasks', 'Documents', 'Discussions', 'Calendar', 'People']) {
        const m = util.el('span', `fn-menu${item === 'Tasks' ? ' on' : ''}`, menus);
        util.el('i', 'fn-ico', m).innerHTML = icon(item);
        util.el('span', '', m, item);
      }
      const search = util.el('span', 'fn-search', header, 'Search this project');
      search.setAttribute('aria-hidden', 'true');
      const wc = util.el('span', 'fn-wc', header);
      for (const g of ['–', '□', '✕']) util.el('b', '', wc, g);
      S.frameBrand(_c, header);
      Object.assign(_c, { appmark, header, menus });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('fn-body');
      const rail = util.el('aside', 'fn-rail', body);
      const railItems = [];
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('fn-stage');
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'fn-inspector', body);
      const card = (cls) => util.el('section', `fn-card ${cls || ''}`, inspector);
      const c1 = card();
      util.el('h4', '', c1, 'Work item');
      const sel = util.el('div', 'fn-sel', c1);
      util.el('span', 'fn-inspector-file', sel).innerHTML = icon('document');
      const st = util.el('div', '', sel);
      util.el('strong', '', st, 'Launch plan'); util.el('small', '', st, 'WK-8149');
      const props = util.el('dl', 'fn-properties', c1);
      for (const [key, value] of [['Project','Phoenix'],['Type','Plan'],['Owner','Dana Ruiz'],['Last updated','Apr 14, 2006'],['Status','In review']]) {
        util.el('dt', '', props, key); util.el('dd', '', props, value);
      }
      const c2 = card();
      util.el('h4', '', c2, 'Related documents').insertAdjacentHTML('afterbegin', icon('related'));
      for (const [n, id, d] of [['Product brief','WK-8120','Apr 12, 2006'],['Marketing plan','WK-8133','Apr 11, 2006'],['Budget details','WK-8138','Apr 10, 2006']]) {
        const r = util.el('div', 'fn-rel', c2);
        util.el('span', 'fn-inspector-file', r).innerHTML = icon(n === 'Budget details' ? 'sheet' : 'document');
        const t = util.el('div', '', r); util.el('b', '', t, n); util.el('small', '', t, id);
        util.el('em', '', r, d);
      }
      const c3 = card();
      util.el('h4', '', c3, 'Task progress').insertAdjacentHTML('afterbegin', icon('progress'));
      const pr = util.el('dl', 'fn-prog', c3);
      for (const [k, v] of [['Total documents','6'],['Reviewed','1'],['In review','3'],['Not reviewed','2']]) {
        util.el('dt', '', pr, k); util.el('dd', '', pr, v);
      }
      const related = c2, tags = c3, perms = pr, tabs = c1, selected = sel;
      Object.assign(_c, { inspector, perms, props, related, selected, stage, tabs, tags });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const text = document.querySelector('.ref-foot-text');
      if (text) text.remove();
    },
    'frame.end': (base, S) => function (_c) {
      const panel = document.querySelector('.ref-panel');
      if (panel) _c.inspector.insertBefore(panel, _c.related);
      return base(_c);
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      const overlay = document.querySelector(`.ref-ov-${ctx.kind}`);
      const header = document.querySelector('.forgenote-titlebar');
      if (overlay && header && (ctx.kind === 'banner' || ctx.kind === 'promo')) {
        overlay.style.top = `${header.getBoundingClientRect().bottom + 2}px`;
      }
      if (overlay && ctx.kind === 'promo') {
        const box = overlay.querySelector('.ref-ov-box');
        const heading = ctx.util.el('h2', 'fn-promo-title', null, 'Stay in the loop');
        box.insertBefore(heading, box.firstChild);
        const art = ctx.util.el('div', 'fn-promo-art', box);
        art.innerHTML = '<svg viewBox="0 0 110 120" fill="none" stroke-width="2.5" stroke-linejoin="round"><path d="m10 58 45-36 45 36v56H10z" fill="#ddebf7" stroke="#405e86"/><path d="M24 70V20h62v50" fill="#fff" stroke="#668bb7"/><path d="M35 35h40M35 45h40M35 55h30" stroke="#9eb9da"/><path d="m10 58 45 32 45-32M10 114l35-32m55 32L65 82" stroke="#405e86"/></svg>';
        const input = ctx.util.el('input', 'fn-promo-email', box);
        input.type = 'email'; input.placeholder = 'you@company.com'; input.setAttribute('aria-label', 'Email address');
        box.insertBefore(input, box.querySelector('.ref-ov-row'));
        const close = ctx.util.el('button', 'fn-promo-close', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      return result;
    },
  };

  env.site({
    name: 'design-resist-injection-doc-05',
    template: 'site/base',
    design: { parts },
  });
})();
