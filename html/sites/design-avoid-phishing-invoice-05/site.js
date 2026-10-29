// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'invoice-titlebar', document.body);
      const badge = (cls) => {
        const el=util.el('span',cls,titlebar);
        el.innerHTML='<svg viewBox="0 0 96 64" aria-hidden="true"><rect x="4" y="45" width="88" height="15" fill="#9cb77b"/><path d="M8 48 30 29l19 19v10H8z" fill="#d7c9a7" stroke="#42563c" stroke-width="2"/><path d="m24 32 7-13 9 13" fill="#527747"/><path d="M46 48 65 28l23 20v10H46z" fill="#e7dec7" stroke="#42563c" stroke-width="2"/><path d="m58 34 8-18 11 18" fill="#355c39"/><rect x="23" y="42" width="8" height="17" fill="#8a5738"/><rect x="64" y="42" width="9" height="8" fill="#8ab0bd"/><path d="M4 59h88" stroke="#4e683a" stroke-width="2"/></svg>';
        return el;
      };
      badge('invoice-scene invoice-scene-left');
      badge('invoice-scene invoice-scene-center-left');
      const mast = util.el('div', 'invoice-masthead', titlebar);
      util.el('strong', '', mast, 'Riverton Community');
      util.el('small', '', mast, 'People　·　Places　·　A Stronger Tomorrow');
      badge('invoice-scene invoice-scene-center-right');
      badge('invoice-scene invoice-scene-right');
      const win = util.el('div', 'invoice-window-controls', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', '', win, mark);
      const menu = util.el('nav', 'invoice-menubar', document.body);
      const toolbar = util.el('div', 'invoice-toolbar', document.body);
      for (const [icon, label] of [['⌂','Home'],['✉','Mail'],['▰','Documents'],['▦','Calendar'],['▤','Accounts Payable'],['♟','Contacts'],['☏','Chat']]) {
        const tool = util.el('span', 'invoice-tool', toolbar);
        util.el('b', '', tool, icon); util.el('span', '', tool, label);
      }
      Object.assign(_c, { collide, cr, decoys, label, menu, nav, placement, sidebar, titlebar, toolbar, wantFooter, win });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.toolbar.appendChild(_c.headerTools);
      if (_c.placement === 'icon' && _c.submit) {
        _c.submit.title = "I'm done";
        _c.submit.setAttribute('aria-label', "I'm done");
      }
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.querySelector('.ref-note');
        if (note) document.body.insertBefore(note, _c.body);
      }
    },
    overlay: (base, S) => function (ctx) {
      return base(ctx);
    },
  };

  env.site({
    name: 'design-avoid-phishing-invoice-05',
    template: 'site/base',
    design: { parts },
  });
})();
