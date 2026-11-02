/* choose-option/_base-settings: base widget implementations.
 * reference.js retains their part hooks; scopeRef reads the live, overridable reference scope.
 */
(function () {
  'use strict';

  function buildToggles(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    const native = rng.bool(0.5);
    const square = rng.bool(0.25);
    const words = rng.bool(0.3);
    const n = spec.items.length;
    const cols = n > 7 ? 2 : 1;
    const grid = util.el('div', 'fp-trows', field);
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    const sw = [];
    spec.items.forEach((it, i) => {
      const row = util.el(native ? 'label' : 'div', 'fp-trow', grid);
      row.dataset.role = 'setting';
      const tx = util.el('div', 'fp-ttext', row);
      util.el('div', 'fp-tl', tx, it.label);
      util.el('div', 'fp-td', tx, it.desc);
      const word = words ? util.el('span', 'fp-onoff', row) : null;
      let s;
      if (native) {
        s = util.el('input', 'fp-switch' + (square ? ' sq' : ''), row);
        s.type = 'checkbox';
        s.setAttribute('role', 'switch');
        s.addEventListener('change', () => flip(i));
      } else {
        s = util.el('button', 'fp-switch' + (square ? ' sq' : ''), row);
        s.type = 'button';
        s.setAttribute('role', 'switch');
        s.addEventListener('click', () => flip(i));
      }
      s.dataset.role = 'switch';
      sw.push([s, word]);
    });
    function flip(i) {
      const on = scopeRef.st.ctx.model.on.slice();
      on[i] = !on[i];
      scopeRef.set({ on });
      show();
    }
    function show() {
      const m = scopeRef.st.ctx.model;
      sw.forEach(([s, word], i) => {
        if (native) s.checked = !!m.on[i];
        else s.setAttribute('aria-checked', String(!!m.on[i]));
        if (word) word.textContent = m.on[i] ? 'On' : 'Off';
      });
    }
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => (t.toggle !== undefined ? scopeRef.req(sw[t.toggle][0], `switch ${t.toggle}`) : null);
  }

  function buildTree(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    const fam = scopeRef.env.taskDef.helpers;
    const G = spec.groups.length;
    const kidH = rng.int(28, 32);
    // Groups sit side by side (the card is sized for G columns).
    const cols = G;
    const box = util.el('div', 'fp-tgroups', field);
    box.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    box.style.setProperty('--fp-kid', kidH + 'px');
    const parents = [];
    const links = [];
    const counts = [];
    const kids = new Map();
    const act = (t) => { scopeRef.set({ values: fam.treeClick(spec, scopeRef.st.ctx.model.values, t) }); show(); };
    spec.groups.forEach((g, gi) => {
      const col = util.el('div', 'fp-tg', box);
      const head = util.el(spec.links ? 'div' : 'label', 'fp-thead', col);
      if (!spec.links) {
        const p = util.el('input', '', head);
        p.type = 'checkbox';
        p.dataset.role = 'select-all';
        p.addEventListener('change', () => act({ parent: gi }));
        parents[gi] = p;
      }
      util.el('span', '', head, g.name);
      if (spec.links) {
        const ls = util.el('span', 'fp-links', head);
        const a = util.el('a', 'fp-link', ls, rng.pick(['Select all', 'All']));
        const b = util.el('a', 'fp-link', ls, rng.pick(['Clear', 'None', 'Clear all']));
        a.dataset.role = 'select-all';
        b.dataset.role = 'select-none';
        a.addEventListener('click', () => act({ link: [gi, 'all'] }));
        b.addEventListener('click', () => act({ link: [gi, 'none'] }));
        links[gi] = { all: a, none: b };
      } else counts[gi] = util.el('span', 'fp-tcount', head);
      for (const o of g.options) {
        const row = util.el('label', 'fp-tkid', col);
        const c = util.el('input', '', row);
        c.type = 'checkbox';
        c.dataset.role = 'option';
        c.addEventListener('change', () => act({ option: o }));
        util.el('span', '', row, o);
        kids.set(o, c);
      }
    });
    function show() {
      const m = scopeRef.st.ctx.model;
      for (const [o, c] of kids) c.checked = m.values.includes(o);
      spec.groups.forEach((g, gi) => {
        const s = fam.treeState(spec, gi, m.values);
        if (parents[gi]) {
          parents[gi].checked = s === 'all';
          parents[gi].indeterminate = s === 'some';
        }
        if (counts[gi]) counts[gi].textContent = `${g.options.filter((o) => m.values.includes(o)).length} of ${g.options.length}`;
      });
    }
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      if (t.parent !== undefined) return scopeRef.req(parents[t.parent], 'select-all checkbox');
      if (t.link) return scopeRef.req(links[t.link[0]][t.link[1]], 'link');
      if (t.option !== undefined) return scopeRef.req(kids.get(t.option), `checkbox ${t.option}`);
      return null;
    };
  }

  function renderCard(scopeRef, ctx, o) {
    scopeRef.ensureStyle('fp-style', scopeRef.CSS);
    scopeRef.ensureStyle('fp3-style', scopeRef.CSS3);
    const { util, rng, spec, size } = ctx;
    scopeRef.st = { ctx, spec, alive: () => false };
    const v = spec.scenario;
    const wrap = util.el('div', 'fp-wrap', ctx.stage);
    const card = util.el('div', 'fp-card' + (o.cls ? ` ${o.cls}` : ''), wrap);
    card.dataset.role = 'form';
    card.style.setProperty('--fp-r', rng.int(8, 14) + 'px');
    card.style.setProperty('--fp-rc', rng.int(5, 9) + 'px');
    if (o.cls) { card.style.setProperty('--fp-r', '4px'); card.style.setProperty('--fp-rc', '4px'); }
    let [w0, w1] = scopeRef.WIDTH[v];
    const wide = (v === 'checkbox' && spec.options.length > 5) || (v === 'radio' && spec.options.length > 6)
      || (v === 'toggles' && spec.items.length > 7);
    if (wide) [w0, w1] = v === 'toggles' ? [780, 860] : [560, 660];
    if (v === 'tree' && spec.groups.length > 1) [w0, w1] = [300 * spec.groups.length, 340 * spec.groups.length];
    card.style.width = Math.min(size.width - 32, rng.int(w0, w1)) + 'px';
    util.el('div', 'fp-title', card, spec.title);
    util.el('div', 'fp-note', card, spec.note);
    if (v === 'dependent') scopeRef.buildDependent(card, ctx);
    else {
      const field = util.el('div', 'fp-field', card);
      if (v !== 'toggles' && v !== 'tree' && v !== 'matrix') util.el('div', 'fp-label' + (rng.bool(0.35) && !o.cls ? ' caps' : ''), field, spec.label);
      if (v === 'dropdown') scopeRef.buildDropdown(field, ctx);
      else if (v === 'radio' || v === 'checkbox') scopeRef.buildChoices(field, ctx, v);
      else if (v === 'autocomplete') scopeRef.buildAutocomplete(field, ctx);
      else if (v === 'listbox') scopeRef.buildListbox(field, ctx);
      else if (v === 'grouped') scopeRef.buildGrouped(field, ctx);
      else if (v === 'combobox') scopeRef.buildCombobox(field, ctx, o.combo);
      else if (v === 'chips') scopeRef.buildChips(field, ctx);
      else if (v === 'tags') scopeRef.buildTags(field, ctx);
      else if (v === 'toggles') scopeRef.buildToggles(field, ctx);
      else if (v === 'matrix') scopeRef.buildMatrix(field, ctx);
      else scopeRef.buildTree(field, ctx);
    }
    if (v === 'chips') {
      // Room for chips to wrap onto more lines without moving anything outside the card.
      scopeRef.st.show();
      const boxEl = card.querySelector('.fp-chipbox');
      boxEl.style.minHeight = Math.max(44, boxEl.offsetHeight) + 'px';
      util.el('div', 'fp-status', card, 'Click the field to add more.');
    }
    if (v === 'tags') {
      scopeRef.st.reserve();
      util.el('div', 'fp-status', card, 'Type to find a tag, then pick it from the list.');
    }
    // Tight stages (side panels, footers, toasts): drop secondary text and spacing.
    if (card.offsetHeight > size.height - 24) card.classList.add('compact');
    // Freeze the card's box: nothing inside may move it during the episode.
    card.style.height = card.offsetHeight + (v === 'chips' ? 44 : 0) + 'px';
    scopeRef.place(card, ctx, scopeRef.POPUP.has(v));
    if (scopeRef.st.layout) scopeRef.st.layout();
    scopeRef.st.show();
    return { anchors: [card], sync: () => scopeRef.st.show() };
  }

  env.template('choose-option/_base-settings', () => ({ buildToggles, buildTree, renderCard }));
})();
