/* avoid-dark-patterns/_browser-form: installs replaceable form parts; S reads and writes live page state. */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.h = (b, parent, m) => {
      if (b.back) S.P.ctlBtn(b.back, parent, 'sd-back');
      S.el('h2', 'sd-h', parent, S.P.fill(m, b.text));
      return null;
    };

    BASE.h2 = (b, parent, m) => {
      S.el('h3', 'sd-h2', parent, b.text);
      return null;
    };

    BASE.p = (b, parent, m) => {
      S.el('p', `sd-p ${b.tone || ''}`, parent, S.P.fill(m, b.text));
      return null;
    };

    BASE.note = (b, parent, m) => {
      if (b.text) S.el('p', 'sd-note', parent, b.text);
      return null;
    };

    BASE.error = (b, parent, m) => {
      if (m.note) S.el('div', 'sd-err', parent, m.note);
      return null;
    };

    BASE.ok = (b, parent, m) => {
      const d = S.el('div', 'sd-ok', parent);
      S.el('i', '', d, '✓');
      S.el('span', '', d, b.text);
      return null;
    };

    BASE.kv = (b, parent, m) => {
      const dl = S.el('dl', 'sd-kv', parent);
      for (const [k, v] of b.rows) { S.el('dt', '', dl, k); S.el('dd', '', dl, S.P.fill(m, v)); }
      return null;
    };

    BASE.line = (b, parent, m) => {
      const e = S.spec.priced.find((x) => x.id === b.pid);
      if (!e || !S.fam.active(m, e)) return null;
      const n = e.qty ? Number(m.vals[e.qty]) || 0 : 1;
      const row = S.el('div', 'sd-line', parent);
      const th = S.el('div', 'sd-thumb', row, e.label[0]);
      th.style.background = S.P.swatch(e.label);
      const nm = S.el('div', 'nm', row);
      const t = S.el('div', '', nm, e.label);
      if (b.tag) S.el('span', 'sd-tag', t, b.tag);
      if (e.sub) S.el('div', 'sub', nm, e.sub);
      if (b.minus || b.plus) {
        const st = S.el('div', 'sd-step', row);
        S.P.ctlBtn(b.minus, st);
        S.el('b', '', st, String(n));
        S.P.ctlBtn(b.plus, st);
      } else if (e.qty) S.el('span', 'sub', row, `Qty ${n}`);
      S.el('span', 'amt', row, S.P.money(e.price * n, e.mo));
      if (b.remove) S.P.ctlBtn(b.remove, row);
      return null;
    };

    BASE.also = (b, parent, m) => {
      const e = S.spec.priced.find((x) => x.id === b.pid);
      if (!e || S.fam.active(m, e)) return null;
      S.el('h3', 'sd-h2', parent, b.title);
      const row = S.el('div', 'sd-line', parent);
      const th = S.el('div', 'sd-thumb', row, e.label[0]);
      th.style.background = S.P.swatch(e.label);
      const nm = S.el('div', 'nm', row);
      S.el('div', '', nm, e.label);
      S.el('div', 'sub', nm, `★★★★☆ · ${S.fam.fmt(S.spec, e.price)}`);
      S.P.ctlBtn(b.ctl, row);
      return null;
    };

    BASE.check = (b, parent, m) => {
      const c = b.ctl ? S.spec.ctls[b.ctl] : null;
      const on = c ? !!m.vals[c.key] : !!b.on;
      const locked = c ? !!c.locked : !!b.locked;
      let box = parent;
      if (!parent.classList.contains('sd-checks')) box = S.el('div', `sd-checks${S.look.swRight && b.sw ? ' sd-sw-right' : ''}`, parent);
      const row = S.el('div', `sd-check${on ? ' on' : ''}${locked ? ' locked' : ''}`, box);
      S.el('span', b.sw ? 'sw' : 'box', row, b.sw ? '' : '✓');
      const tx = S.el('span', 'tx', row, c ? c.label : b.label);
      const sub = c ? c.sub : b.sub;
      if (sub) S.el('span', 'sub', tx, sub);
      if (c && c.price != null) S.el('span', 'pr', row, c.price ? `+${S.fam.fmt(S.spec, c.price)}${c.mo ? '/mo' : ''}` : S.D.freeLabel);
      if (c) {
        S.P.bind(b.ctl, row);
      }
      return box;
    };
  }

  env.template('avoid-dark-patterns/_browser-form', () => ({ install }));
})();
