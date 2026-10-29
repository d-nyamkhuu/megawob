/* avoid-dark-patterns/_browser-controls: installs replaceable controls parts; S reads and writes live page state. */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.onCtl = (id) => {
      if (S.ctx.model.done) return;
      const r = S.fam.act(S.ctx.model, S.spec, id);
      S.ctx.update(r.model);
      S.P.paint(S.ctx.model);
      if (r.unsafe) S.ctx.flag(r.unsafe);
    };

    BASE.header = (parent, m) => {
      const head = S.el('header', 'sd-head', parent);
      const logo = S.el('div', `sd-logo${S.look.logoRound ? ' round' : ''}`, head);
      S.el('i', '', logo, S.app.name.replace(/^The /, '')[0]);
      S.el('span', '', logo, S.app.name);
      if (S.app.kind !== 'news') {
        const links = S.el('nav', 'sd-links', head);
        for (const l of S.look.links) S.el('span', '', links, l);
        S.el('div', 'sd-sp', head);
        if (S.look.search && ['shop', 'tickets', 'food', 'download', 'saas'].includes(S.app.kind)) S.el('div', 'sd-search', head, S.D.searchLabel);
        const ic = S.el('div', 'sd-icon', head, ['shop', 'food', 'tickets'].includes(S.app.kind) ? '⌂' : (S.app.name[0] || 'A'));
        if (['shop', 'food'].includes(S.app.kind)) {
          const n = S.P.cartCount(m);
          if (n) S.el('b', '', ic, String(n));
        }
      }
      return head;
    };

    BASE.cartCount = (m) => {
      let n = 0;
      for (const e of S.spec.priced) if (e.line && !e.fee && S.fam.active(m, e)) n += e.qty ? Number(m.vals[e.qty]) || 0 : 1;
      return n;
    };

    BASE.ctlBtn = (id, parent, extra = '') => {
      const c = S.spec.ctls[id];
      if (!c) return null;
      const b = S.el('button', `sd-b ${c.style || 'ghost'} ${extra}`.trim(), parent, c.label);
      S.P.bind(id, b);
      return b;
    };

    BASE.bind = (id, node) => {
      node.dataset.ctl = id;
      node.addEventListener('click', () => S.P.onCtl(id));
      S.ctlEls[id] = node;
      return node;
    };

    BASE.fill = (m, t) => {
      return S.fam.fill(m, S.spec, t);
    };

    BASE.money = (n, mo) => {
      return n === 0 && !mo ? S.D.freeLabel : `${S.fam.fmt(S.spec, n)}${mo ? '/mo' : ''}`;
    };

    BASE.swatch = (s) => {
      let h = 0;
      for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      h = S.D.thumbHues[h % S.D.thumbHues.length];
      return `linear-gradient(135deg, hsl(${h} 55% 58%), hsl(${(h + 40) % 360} 50% 42%))`;
    };
  }

  env.template('avoid-dark-patterns/_browser-controls', () => ({ install }));
})();
