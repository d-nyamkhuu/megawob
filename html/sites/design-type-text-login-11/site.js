(function () {
  'use strict';
  const C = {
    site: 'design-type-text-login-11',
    app: 'ForgeDraft 2014',
    file: '[ brkt_design.dwg ]',
    menu: 'File|Edit|View|Draw|Modify|Dimension|Tools|Window|Help',
    briefTitle: 'Project Brief',
  };
  const NS = 'http://www.w3.org/2000/svg';
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const ICONS = {
    Line: '<path d="M4 26L26 4M4 26H10"/><circle cx="26" cy="4" r=".7"/>',
    Circle: '<circle cx="15" cy="15" r="11"/>',
    Arc: '<path d="M5 26C5 12 13 5 26 5M5 26H10"/>',
    Rectangle: '<rect x="4" y="7" width="22" height="16"/>',
    Polyline: '<path d="M3 21L7 12C12 9 14 16 18 19S25 18 27 9"/>',
    Text: '<text x="4" y="27" fill="#b7d4ef" stroke="none" font-family="Arial,sans-serif" font-size="31">A</text>',
    Move: '<path d="M15 3V27M3 15H27M15 3l-3 4M15 3l3 4M15 27l-3-4M15 27l3-4M3 15l4-3M3 15l4 3M27 15l-4-3M27 15l-4 3"/>',
    Copy: '<rect x="4" y="4" width="14" height="14"/><rect x="11" y="11" width="14" height="14" fill="#0d2a47"/>',
    Rotate: '<path d="M24 15A9 9 0 1 1 15 6H21M17 2L22 6L17 10"/>',
    Scale: '<rect x="4" y="4" width="22" height="22"/>',
    Trim: '<path d="M5 5L25 25M25 5L5 25"/>',
    Extend: '<path d="M3 15H26M20 9L26 15L20 21"/>',
    Linear: '<path d="M4 6V24M26 6V24M4 15H26M4 15l5-3M4 15l5 3M26 15l-5-3M26 15l-5 3"/>',
    Angular: '<path d="M3 24L14 4L25 24ZM14 12L23 5M16 8L20 10"/>',
    Diameter: '<circle cx="15" cy="15" r="11"/><path d="M7 23L23 7"/>',
    Radius: '<circle cx="15" cy="15" r="11"/><path d="M6 24L24 6" stroke-dasharray="8 3 2 3"/>',
  };
  const GROUPS = [
    ['Draw', ['Line', 'Circle', 'Arc', 'Rectangle', 'Polyline', 'Text'], 39],
    ['Modify', ['Move', 'Copy', 'Rotate', 'Scale', 'Trim', 'Extend'], 0],
    ['Dimension', ['Linear', 'Angular', 'Diameter', 'Radius'], 0],
  ];
  function svg(parent, html, vb, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb);
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  function drawing(parent) {
    const s = svg(
      parent,
      '<g fill="none" stroke="#35c8ea" stroke-width="2">' +
        '<path d="M98 181H359L493 134H572L596 159V405H98Z"/>' +
        '<circle cx="164" cy="250" r="36"/><path d="M164 205V295M120 250H208" stroke-dasharray="14 4 3 4"/>' +
        '<circle cx="538" cy="193" r="35"/><path d="M538 146V237M491 193H585" stroke-dasharray="14 4 3 4"/>' +
        '<path d="M98 357H596M164 250V405" stroke-dasharray="17 6" stroke-width="1"/>' +
        '<path d="M98 56V176M538 56V181M98 66H538M98 66l14-4M98 66l14 4M538 66l-14-4M538 66l-14 4"/>' +
        '<path d="M48 181H91M48 405H91M57 181V405M57 181l-4 14M57 181l4 14M57 405l-4-14M57 405l4-14" />' +
        '<path d="M164 250L230 140H282" />' +
        '<path d="M782 134H825V230L870 328H934V405H782Z M825 230V405M782 185H835M782 357H934M889 319V405M889 328H904V349L889 357" />' +
        '<path d="M782 82H885M782 82l14-4M782 82l14 4M885 82l-14-4M885 82l-14 4M782 72V127M885 72V127"/>' +
        '<path d="M889 387V461M934 387V461M856 452H967M889 452l-14-4M889 452l-14 4M934 452l14-4M934 452l14 4"/>' +
        '<path d="M578 134H660M650 134V236M650 134l-4 14M650 134l4 14"/>' +
        '</g><g fill="#35c8ea" font-family="Segoe UI,Arial,sans-serif" font-size="19">' +
        '<text x="304" y="59">120</text><text x="821" y="76">25</text><text x="237" y="128">Ø12</text><text x="900" y="448">10</text>' +
        '<text transform="translate(40 300) rotate(-90)" font-size="18">60</text>' +
        '<text x="1013" y="537" font-size="20">BRACKET A</text><text x="1013" y="562" font-size="20">SCALE 1:1</text></g>' +
        '<g stroke="#b7d4ef" stroke-width="1.5" fill="none"><path d="M26 620V573M26 620H70M26 573l-5 11M26 573l5 11M70 620l-11-5M70 620l-11 5"/></g>' +
        '<text x="25" y="555" fill="#35c8ea" font-size="19" font-family="Segoe UI,Arial">Y</text><text x="70" y="610" fill="#35c8ea" font-size="19" font-family="Segoe UI,Arial">X</text>',
      '0 0 1245 645',
      'cad-svg',
    );
    s.setAttribute('preserveAspectRatio', 'none');
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'cad-top', document.body);
      svg(
        top,
        '<path d="M10 2L17 5V12L13 17H7L3 13V6Z M7 7L10 5L13 7V12L9 14L6 11V8M10 9L14 6" fill="none" stroke="#b7d4ef" stroke-width="1.6"/>',
        '0 0 20 20',
        'cad-logo',
      );
      u.el('span', 'cad-apptitle', top, C.app + '  -  ' + C.file);
      u.el('span', 'cad-wc', top, '—      ☐      ✕');
      const nav = u.el('nav', 'cad-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const main = u.el('div', 'cad-main', document.body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : 'left';
      const brief = u.el('aside', 'cad-brief', main);
      u.el('h2', '', brief, C.briefTitle);
      u.el('p', 'cad-desc', brief, 'Log in to access the drawing and project files.');
      let note = null;
      if (mode === 'left') {
        note = u.el('div', 'ds-instruction cad-instr', brief, ctx.instruction);
      } else if (mode === 'panel') {
        const box = u.el('section', 'cad-instr-panel', brief);
        u.el('div', 'cad-instr-panel-h', box, 'Current Operation');
        note = u.el('div', 'ds-instruction cad-instr', box, ctx.instruction);
      } else if (mode === 'toast') {
        note = u.el('div', 'ds-instruction cad-instr cad-instr-toast', brief, ctx.instruction);
      }
      const tbl = u.el('div', 'cad-meta', brief);
      [
        ['Project:', 'Bracket Assembly'],
        ['File:', 'brkt_design.dwg'],
        ['Units:', 'millimeters'],
        ['Version:', '1.0'],
      ].forEach((r) => {
        u.el('span', '', tbl, r[0]);
        u.el('span', '', tbl, r[1]);
      });
      u.el('p', 'cad-must', brief, 'You must be logged in to view and edit the drawing.');
      const work = u.el('section', 'cad-work', main);
      drawing(work);
      const coord = u.el('div', 'cad-coord', work, 'X:  182.5     Y:  64.0     Z:  0.0');
      const dlg = u.el('div', 'cad-dlg', work);
      const tb = u.el('div', 'cad-dlg-title', dlg);
      u.el('span', '', tb, 'Sign In');
      u.el('span', 'cad-x', tb, '✕');
      const stage = u.el('main', 'ds-stage cad-stage', dlg);
      const dfoot = u.el('div', 'cad-dlg-foot', dlg);
      const keep = u.el('span', 'cad-keep', dfoot);
      u.el('i', 'cad-box', keep);
      u.el('span', '', keep, 'Keep me signed in');
      u.el('span', 'cad-forget', dfoot, 'Forget password?');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const endPick = er.int(0, 3);
      const defaultEnd = ctx.finish || endPick < 2;
      const endOptions = ctx.content.END_LABELS.map(labelOf);
      const baseEndLabel = endOptions.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
      const endLabel = defaultEnd ? baseEndLabel : labelOf(er.pick(ctx.content.END_LABELS));
      const placement = defaultEnd ? 'dialog' : endPick === 2 ? 'status' : 'layers';
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'dialog') submit = makeEnd(dlg, 'ds-submit', endLabel);
      const tools = u.el('div', 'cad-tools', document.body);
      GROUPS.forEach((g) => {
        const grp = u.el('div', 'cad-grp cad-grp-' + g[0].toLowerCase(), tools);
        u.el('div', 'cad-grp-h', grp, g[0]);
        const row = u.el('div', 'cad-grp-b', grp);
        g[1].forEach((n) => {
          const b = u.el('div', 'cad-tool', row);
          svg(b, '<g fill="none" stroke="#dce6f0" stroke-width="1.8">' + ICONS[n] + '</g>', '0 0 30 30');
          u.el('span', '', b, n);
        });
      });
      const lay = u.el('div', 'cad-grp cad-grp-layers', tools);
      u.el('div', 'cad-grp-h', lay, 'Layers');
      const lbody = u.el('div', 'cad-grp-b cad-layer-body', lay);
      const sel = u.el('div', 'cad-layer', lbody);
      u.el('i', 'cad-sw', sel);
      u.el('span', '', sel, '0');
      u.el('span', 'cad-caret', sel, '⌄');
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(endOptions)].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = cr.pick(options);
      }
      const decoy = (parent, label) => {
        const b = u.el('button', 'cad-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (!ctx.finish && placement === 'layers') submit = makeEnd(lbody, 'cad-end cad-end-layer', endLabel);
      if (collide && placement === 'layers') decoy(lbody, collide);
      const status = u.el('footer', 'cad-status', document.body);
      u.el('span', '', status, 'Ready');
      const statusActions = u.el('div', 'cad-status-actions', status);
      if (!ctx.finish && placement === 'status') submit = makeEnd(statusActions, 'cad-end cad-end-status', endLabel);
      if (collide && (placement === 'status' || placement === 'dialog')) decoy(statusActions, collide);
      const tg = u.el('div', 'cad-toggles', status);
      ['SNAP', 'GRID', 'ORTHO', 'OSNAP'].forEach((t) => u.el('span', '', tg, t));
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'cad-news ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const h = u.el('div', 'cad-news-h', el);
      u.el('span', '', h, 'Drafting News');
      const dismiss = u.el('button', 'cad-news-x', h, '✕');
      dismiss.type = 'button';
      dismiss.setAttribute('aria-label', 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      const b = u.el('div', 'cad-news-b', el);
      const r = u.el('div', 'cad-news-r', b);
      svg(
        r,
        '<rect x="2" y="4" width="40" height="28" rx="2" fill="none" stroke="#1d2b3b" stroke-width="2"/><path d="M3 6L22 22L41 6" fill="none" stroke="#1d2b3b" stroke-width="2"/>',
        '0 0 44 36',
        'cad-env',
      );
      u.el('div', '', r, 'Get the latest CAD tips in your inbox.');
      u.el('p', '', b, 'Weekly tutorials, templates and more.');
      u.el('div', 'cad-news-in', b, 'Your email address');
      const sub = u.el('button', 'cad-news-sub', b, 'Subscribe');
      sub.type = 'button';
      sub.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
