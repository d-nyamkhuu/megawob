/* avoid-dark-patterns/_browser-choices: installs replaceable choices parts; S reads and writes live page state. */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.options = (b, parent, m) => {
      const box = S.el('div', b.t === 'opts' ? 'sd-opts' : 'sd-radios', parent);
      for (const id of b.ctls) S.P.option(id, box, m);
      return null;
    };

    BASE.cards = (b, parent, m) => {
      const box = S.el('div', 'sd-cards', parent);
      for (const id of b.ctls) S.P.listingCard(id, box, m);
      return null;
    };

    BASE.cards2 = (b, parent, m) => {
      const box = S.el('div', 'sd-cards2', parent);
      for (const item of b.items) S.P.planCard(item, box, m);
      return null;
    };

    BASE.chips = (b, parent, m) => {
      const box = S.el('div', 'sd-chips', parent);
      for (const id of b.ctls) {
        const c = S.spec.ctls[id];
        S.P.ctlBtn(id, box, m.vals[c.key] === c.value ? 'on' : '');
      }
      return null;
    };

    BASE.stepper = (b, parent, m) => {
      const row = S.el('div', 'sd-stepper', parent);
      S.el('span', '', row, b.label).style.fontWeight = '600';
      const st = S.el('div', 'sd-step', row);
      S.P.ctlBtn(b.minus, st);
      S.el('b', '', st, String(m.vals[b.key]));
      S.P.ctlBtn(b.plus, st);
      return null;
    };

    BASE.list = (b, parent, m) => {
      const box = S.el('div', 'sd-list', parent);
      for (const id of b.ctls) S.P.listItem(id, box, m);
      return null;
    };

    BASE.sum = (b, parent, m) => {
      const s = S.fam.summary(m, S.spec, b.fees);
      const box = S.el('div', 'sd-sum sd-card', parent);
      S.el('h4', '', box, S.D.summaryTitle);
      if (b.lines) for (const r of s.rows) { const d = S.el('div', `r${r.extra ? ' x' : ''}`, box); S.el('span', '', d, r.label); S.el('span', '', d, S.P.money(r.amount, r.mo)); }
      if (s.fees.length || b.lines) { const d = S.el('div', 'r', box); S.el('span', '', d, S.D.subtotalLabel); S.el('span', '', d, S.fam.fmt(S.spec, s.sub)); }
      for (const f of s.fees) { const d = S.el('div', 'r fee', box); S.el('span', '', d, f.label); S.el('span', '', d, S.fam.fmt(S.spec, f.amount)); }
      const d = S.el('div', 'r tot', box);
      S.el('span', '', d, S.D.totalLabel);
      S.el('span', '', d, S.fam.fmt(S.spec, s.total));
      return null;
    };

    BASE.badge = (b, parent, m) => {
      const d = S.el('div', `sd-badge ${b.tone}`, parent);
      d.innerHTML = b.tone === 'urgent' ? S.D.icons.clock : b.tone === 'scarce' ? S.D.icons.fire : S.D.icons.users;
      S.el('span', '', d, b.text);
      return null;
    };

    BASE.banner = (b, parent, m) => {
      const d = S.el('div', 'sd-banner', parent);
      S.el('span', '', d, b.text);
      S.P.ctlBtn(b.ctl, d);
      return null;
    };

    BASE.notice = (b, parent, m) => {
      if (b.hideWhen && m.vals[b.hideWhen[0]] === b.hideWhen[1]) return null;
      const d = S.el('div', 'sd-notice', parent);
      S.el('span', '', d, b.text);
      if (b.ctl) S.P.ctlBtn(b.ctl, d);
      return null;
    };

    BASE.hero = (b, parent, m) => {
      const d = S.el('div', 'sd-hero', parent);
      S.el('h3', '', d, b.title);
      S.el('p', '', d, b.text);
      return null;
    };
  }

  env.template('avoid-dark-patterns/_browser-choices', () => ({ install }));
})();
