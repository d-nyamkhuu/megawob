/* avoid-dark-patterns/_browser-content: installs replaceable content parts; S reads and writes live page state. */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.plan = (b, parent, m) => {
      const d = S.el('div', 'sd-plan', parent);
      const l = S.el('div', '', d);
      S.el('div', 'nm', l, b.name);
      const ul = S.el('ul', '', l);
      for (const p of b.perks) S.el('li', '', ul, p);
      S.el('div', 'pr', d, b.price);
      return null;
    };

    BASE.ad = (b, parent, m) => {
      const d = S.el('div', `sd-ad ${b.look}`, parent);
      S.el('span', 'mk', d, S.look.adMark);
      const tx = S.el('div', 'tx', d);
      S.el('div', '', tx, b.title);
      S.el('div', '', tx, b.text);
      S.P.ctlBtn(b.ctl, d);
      return null;
    };

    BASE.file = (b, parent, m) => {
      const d = S.el('div', 'sd-file', parent);
      S.el('div', 'ic', d, (b.name.match(/\.(\w+)$/) || [, 'FILE'])[1].toUpperCase().slice(0, 4));
      const tx = S.el('div', '', d);
      S.el('div', 'nm', tx, b.name);
      S.el('div', 'sub', tx, `${b.size} · ${b.meta}`);
      return null;
    };

    BASE.product = (b, parent, m) => {
      const d = S.el('div', 'sd-prod', parent);
      S.el('div', 'im', d).style.background = S.P.swatch(b.name);
      const tx = S.el('div', '', d);
      S.el('div', 'nm', tx, b.name);
      if (b.sub) S.el('div', 'sd-note', tx, b.sub);
      const pr = S.el('div', 'pr', tx, S.fam.fmt(S.spec, b.price));
      if (b.was) S.el('s', '', pr, S.fam.fmt(S.spec, b.was));
      return null;
    };

    BASE.canvas = (b, parent, m) => {
      const d = S.el('div', 'sd-canvas', parent, b.name);
      d.style.background = S.P.swatch(b.name);
      return null;
    };

    BASE.media = (b, parent, m) => {
      S.el('div', 'sd-media', parent).style.background = S.P.swatch(S.P.fill(m, '$item') + b.kind);
      return null;
    };

    BASE.article = (b, parent, m) => {
      const d = S.el('article', 'sd-article', parent);
      S.el('h1', '', d, b.title);
      S.el('div', 'by', d, S.look.byline);
      S.el('p', '', d, b.text);
      return null;
    };

    BASE.btns = (b, parent, m) => {
      const d = S.el('div', `sd-btns${b.stack ? ' stack' : ''}`, parent);
      for (const id of b.ctls) S.P.ctlBtn(id, d);
      return null;
    };

    BASE.option = (id, box, m) => {
      const c = S.spec.ctls[id];
      const on = m.vals[c.key] === c.value;
      const o = S.el('div', `sd-opt${on ? ' on' : ''}${c.disabled ? ' dis' : ''}`, box);
      S.el('span', 'rd', o);
      const tx = S.el('div', 'tx', o);
      S.el('div', '', tx, c.label);
      if (c.sub) S.el('div', 'sub', tx, c.sub);
      if (c.price != null) S.el('span', 'pr', o, c.disabled ? S.D.soldOutLabel : `${S.P.money(c.price)}${c.per || ''}`);
      if (c.badge) S.el('span', 'bdg', o, c.badge);
      S.P.bind(id, o);
    };

    BASE.listingCard = (id, box, m) => {
      const c = S.spec.ctls[id];
      const card = S.el('div', 'sd-lcard', box);
      S.el('div', 'im', card).style.background = S.P.swatch(c.label);
      S.el('div', 't', card, c.label);
      if (c.sub) S.el('div', 'sub', card, c.sub);
      const btn = S.el('button', 'sd-b primary', card, c.btn || S.D.selectLabel);
      S.P.bind(id, btn);
    };

    BASE.planCard = (item, box, m) => {
      const [nm, pr, note, id] = item;
      const card = S.el('div', 'sd-lcard', box);
      S.el('div', 't', card, nm);
      S.el('div', '', card, pr).style.fontWeight = '700';
      S.el('div', 'sub', card, note);
      if (id) S.P.ctlBtn(id, card);
    };

    BASE.listItem = (id, box, m) => {
      const c = S.spec.ctls[id];
      const li = S.el('div', `sd-li${c.style === 'headline' ? ' sd-headline' : ''}`, box);
      S.el('div', 'im', li).style.background = S.P.swatch(c.label);
      const tx = S.el('div', 'tx', li);
      S.el('div', 't', tx, c.label);
      if (c.sub) S.el('div', 'sub', tx, c.sub);
      S.P.bind(id, li);
    };
  }

  env.template('avoid-dark-patterns/_browser-content', () => ({ install }));
})();
