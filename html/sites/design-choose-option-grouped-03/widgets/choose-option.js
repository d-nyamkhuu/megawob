// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-grouped-03',
  name: 'design',
  split: 'train',
  scenarios: ['grouped'],
  template: 'choose-option/base',
  design: {
    parts: {
      'renderCard': (base, S) => function renderCard(ctx, o) {
        const { CSS, CSS3, POPUP, WIDTH, buildAutocomplete, buildChips, buildChoices, buildCombobox, buildDependent, buildDropdown, buildGrouped, buildListbox, buildMatrix, buildTags, buildToggles, buildTree, ensureStyle, place } = S;
        ensureStyle('fp-style', CSS);
        ensureStyle('fp3-style', CSS3);
        const { util, rng, spec, size } = ctx;
        S.st = { ctx, spec, alive: () => false };
        const v = spec.scenario;
        const wrap = util.el('div', 'fp-wrap', ctx.stage);
        const card = util.el('div', 'fp-card' + (o.cls ? ` ${o.cls}` : ''), wrap);
        card.dataset.role = 'form';
        card.style.setProperty('--fp-r', rng.int(8, 14) + 'px');
        card.style.setProperty('--fp-rc', rng.int(5, 9) + 'px');
        if (o.cls) { card.style.setProperty('--fp-r', '4px'); card.style.setProperty('--fp-rc', '4px'); }
        let [w0, w1] = WIDTH[v];
        const wide = (v === 'checkbox' && spec.options.length > 5) || (v === 'radio' && spec.options.length > 6)
          || (v === 'toggles' && spec.items.length > 7);
        if (wide) [w0, w1] = v === 'toggles' ? [780, 860] : [560, 660];
        if (v === 'tree' && spec.groups.length > 1) [w0, w1] = [300 * spec.groups.length, 340 * spec.groups.length];
        card.style.width = Math.min(size.width - 32, rng.int(w0, w1)) + 'px';
        util.el('div', 'fp-title', card, spec.title);
        util.el('div', 'fp-note', card, spec.note);
        if (v === 'dependent') buildDependent(card, ctx);
        else {
          const field = util.el('div', 'fp-field', card);
          if (v !== 'toggles' && v !== 'tree' && v !== 'matrix') util.el('div', 'fp-label' + (rng.bool(0.35) && !o.cls ? ' caps' : ''), field, spec.label);
          if (v === 'dropdown') buildDropdown(field, ctx);
          else if (v === 'radio' || v === 'checkbox') buildChoices(field, ctx, v);
          else if (v === 'autocomplete') buildAutocomplete(field, ctx);
          else if (v === 'listbox') buildListbox(field, ctx);
          else if (v === 'grouped') buildGrouped(field, ctx);
          else if (v === 'combobox') buildCombobox(field, ctx, o.combo);
          else if (v === 'chips') buildChips(field, ctx);
          else if (v === 'tags') buildTags(field, ctx);
          else if (v === 'toggles') buildToggles(field, ctx);
          else if (v === 'matrix') buildMatrix(field, ctx);
          else buildTree(field, ctx);
        }
        if (v === 'chips') {
          // Room for chips to wrap onto more lines without moving anything outside the card.
          S.st.show();
          const boxEl = card.querySelector('.fp-chipbox');
          boxEl.style.minHeight = Math.max(44, boxEl.offsetHeight) + 'px';
          util.el('div', 'fp-status', card, 'Click the field to add more.');
        }
        if (v === 'tags') {
          S.st.reserve();
          util.el('div', 'fp-status', card, 'Type to find a tag, then pick it from the list.');
        }
        // Tight stages (side panels, footers, toasts): drop secondary text and spacing.
        if (card.offsetHeight > size.height - 24) card.classList.add('compact');
        // Freeze the card's box: nothing inside may move it during the episode.
        card.style.height = card.offsetHeight + (v === 'chips' ? 44 : 0) + 'px';
        place(card, ctx, POPUP.has(v));
        if (S.st.layout) S.st.layout();
        S.st.show();
        if (v === 'grouped') {
          const extra = util.el('div', 'ds-mock-fields', ctx.stage);
          [['Date', '▦'], ['Duration', '▼'], ['Purpose', '▼']].forEach(([label, icon]) => {
            const row = util.el('div', 'ds-mock-row', extra);
            util.el('span', '', row, `${label}:`);
            const control = util.el('div', 'ds-mock-control', row);
            util.el('b', icon === '▦' ? '' : 'ds-mock-arrow', control, icon);
          });
          const notes = util.el('div', 'ds-mock-row ds-mock-notes', extra);
          util.el('span', '', notes, 'Notes:');
          util.el('div', 'ds-mock-textarea', notes);
        }
        return { anchors: [card], sync: () => S.st.show() };
      },
    },
  },
});
