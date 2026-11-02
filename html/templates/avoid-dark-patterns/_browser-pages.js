/* avoid-dark-patterns/_browser-pages: installs replaceable pages parts; S reads and writes live page state. */
(function () {
  'use strict';
  function install(BASE, S) {
    const { BLOCK_PARTS } = env.templateLib('avoid-dark-patterns/_browser-assets');
    BASE.block = (b, parent, m) => {
      const name = BLOCK_PARTS[b.t];
      return name ? S.P[name](b, parent, m): null;
    };

    BASE.blocks = (list, parent, m) => {
      let checks = null;
      for (const b of list || []) {
        if (b.t === 'check') {
          checks = S.P.block(b, checks || parent, m);
        } else {
          checks = null;
          S.P.block(b, parent, m);
        }
      }
    };

    BASE.screenBody = (sc, parent, m) => {
      const body = S.el('div', 'sd-body', parent);
      if (S.look.sideLeft && sc.side) body.style.flexDirection = 'row-reverse';
      S.P.main(sc, body, m);
      if (sc.side) S.P.side(sc, body, m);
      return body;
    };

    BASE.pageFor = (sid, parent, m) => {
      const sc = S.spec.screens[sid];
      if (S.app.kind === 'app') {
        S.P.header(parent, m);
        const ab = S.el('div', 'sd-appbody', parent);
        const rail = S.el('div', 'sd-rail', ab);
        for (let i = 0; i < 4; i++) S.el('i', i === (sid === 'done' ? 1 : 0) ? 'on' : '', rail);
        const col = S.el('div', '', ab);
        col.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;';
        S.P.screenBody(sc, col, m);
      } else {
        S.P.header(parent, m);
        S.P.screenBody(sc, parent, m);
      }
    };

    BASE.dialog = (parent, list, m, cls) => {
      const dim = S.el('div', 'sd-dim', parent);
      const dlg = S.el('div', `sd-dlg ${cls || ''}`, dim);
      S.P.blocks(list, dlg, m);
      return dlg;
    };

    BASE.modalEl = (parent, md) => {
      const dim = S.el('div', 'sd-dim', parent);
      const dlg = S.el('div', 'sd-dlg sd-modal', dim);
      const art = S.el('div', 'sd-art', dlg);
      art.innerHTML = S.D.icons[md.art] || S.D.icons.gift;
      S.el('h3', '', dlg, md.title);
      if (md.text) S.el('p', '', dlg, md.text);
      for (const id of md.ctls) S.P.ctlBtn(id, dlg);
      return dlg;
    };

    BASE.fits = () => {
      const over = (e) => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1;
      for (const e of S.page.querySelectorAll('.sd-main, .sd-side, .sd-dlg, .sd-body')) if (over(e)) return false;
      return !over(S.page);
    };

    BASE.paint = (m) => {
      S.ctlEls = {};
      S.page.textContent = '';
      S.win.classList.remove(...S.D.compactClasses);
      const sc = S.spec.screens[m.screen];
      S.hostEl.textContent = (sc && sc.domain) || S.app.domain;
      S.pathEl.textContent = (sc && sc.path) || '/';
      S.tabTitle.textContent = sc && sc.title && sc.title !== S.app.name ? `${S.P.fill(m, sc.title)} · ${S.app.name}` : S.app.name;
      const draw = () => {
        S.page.textContent = '';
        S.ctlEls = {};
        if (sc.dialog) {
          const under = S.el('div', 'sd-under', S.page);
          under.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;';
          S.P.pageFor(sc.dialog.over, under, m);
          S.P.dialog(S.page, sc.blocks, m, 'wide');
          // controls of the page under the wall are not reachable
          for (const id of Object.keys(S.ctlEls)) if (under.contains(S.ctlEls[id])) delete S.ctlEls[id];
        } else {
          S.P.pageFor(m.screen, S.page, m);
        }
        if (m.modal) S.P.modalEl(S.page, S.spec.modals[m.modal]);
      };
      draw();
      for (const c of S.D.compactClasses) {
        if (S.P.fits()) break;
        S.win.classList.add(c);
      }
    };

    BASE.main = (sc, body, m) => {
      const main = S.el('div', `sd-main${S.look.cardMain && !sc.side ? '' : ''}`, body);
      S.P.blocks(sc.blocks, main, m);
      return main;
    };

    BASE.side = (sc, body, m) => {
      const side = S.el('div', 'sd-side', body);
      side.style.width = `${S.sideW}px`;
      S.P.blocks(sc.side, side, m);
      return side;
    };

    BASE.decorated = (ctx) => {};

    BASE.rendered = (ctx) => {};

    BASE.anchors = (ctx) => {
      return [S.bar];
    };

    BASE.sync = (m) => {
      S.P.paint(m);
    };

    BASE.locate = (t) => {
      const p = t && t.ctl && S.ctlEls[t.ctl] ? S.P.pointOf(S.ctlEls[t.ctl]): null;
      if (!p) throw new Error(`avoid-dark-patterns/classic cannot locate ${JSON.stringify(t)}`);
      return p;
    };
  }

  env.template('avoid-dark-patterns/_browser-pages', () => ({ install }), { uses: ['avoid-dark-patterns/_browser-assets'] });
})();
