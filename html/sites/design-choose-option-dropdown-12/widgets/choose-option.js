// Adds this site's Preferences panel, collapsible task controls, and upward popup placement.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-12',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    details: false,
    note: false,
    motif: false,
    parts: {
      begin: (base, S) => (ctx) => {
        const { util, size } = ctx;
        const pref = util.el('section', 'pp-sec', ctx.stage);
        const ph = util.el('div', 'pp-sech', pref);
        ph.innerHTML = '<i class="tri down"></i>';
        util.el('b', '', ph, 'Preferences');
        const pb = util.el('div', 'pp-secb', pref);
        const r1 = util.el('div', 'pp-row', pb);
        util.el('span', '', r1, 'Theme:');
        const fk = util.el('span', 'pp-fake', r1, 'Ocean Blue');
        util.el('i', 'pp-chev', fk);
        [['Start Playback Minimized:'], ['Check for Updates:']].forEach(([k]) => {
          const r = util.el('div', 'pp-row', pb);
          util.el('span', '', r, k);
          const c = util.el('span', 'pp-chk', r);
          c.innerHTML = '<u>✓</u>';
          util.el('span', '', c, 'Yes');
        });
        const r4 = util.el('div', 'pp-row', pb);
        util.el('span', '', r4, 'Default Volume:');
        const sl = util.el('span', 'pp-slide', r4);
        util.el('i', '', sl);
        util.el('s', '', sl);
        util.el('span', 'pp-num', r4, '70');

        const tsec = util.el('section', 'pp-sec tc', ctx.stage);
        const th = util.el('div', 'pp-sech', tsec);
        const tri = util.el('i', 'tri', th);
        util.el('b', '', th, 'Task controls');
        const showBtn = util.el('button', 'pp-show', th, 'Show controls');
        showBtn.type = 'button';
        // Preserve reference dimensions unless a shorter stage needs room for the field.
        const unit = ph.getBoundingClientRect().height / 3.35;
        const prefHeight = size.height - th.offsetHeight - 7 * unit - 12;
        if (pref.offsetHeight > prefHeight) {
          pref.classList.add('pp-compact-preferences');
          pref.style.setProperty('--pp-pref-height', Math.max(ph.offsetHeight + 4 * unit, prefHeight) + 'px');
        }
        const tbody = util.el('div', 'pp-secb pp-tbody', tsec);
        Object.assign(S.els, { tsec, tri, showBtn, tbody });
      },
      wrap: (base, S) => (ctx) => ctx.util.el('div', 'fp-wrap', S.els.tbody),
      selectLayout: (base, S) => (ctx, controls) => {
        const { rows, trigger, pop, rowMax } = controls;
        const { util } = ctx;
        if (!rows.size) return;
        const sr = ctx.stage.getBoundingClientRect();
        const tr = trigger.getBoundingClientRect();
        const n = rows.size;
        const below = sr.bottom - tr.bottom - 4 - 10 - 12;
        const above = tr.top - sr.top - 4 - 10 - 12;
        const upward = below < Math.ceil(n / 3) * 24 && above > below;
        const avail = upward ? above : below;
        pop.style.top = upward ? 'auto' : 'calc(100% + 4px)';
        pop.style.bottom = upward ? 'calc(100% + 4px)' : 'auto';
        let cols = 1;
        while (cols < 3 && Math.ceil(n / cols) * 24 > avail) cols++;
        const per = Math.ceil(n / cols);
        const h = util.clamp(Math.floor(avail / per), 22, rowMax);
        pop.classList.toggle('cols', cols > 1);
        pop.style.gridTemplateRows = cols > 1 ? `repeat(${per}, ${h}px)` : '';
        pop.style.gridTemplateColumns = cols > 1 ? `repeat(${cols}, minmax(0, 1fr))` : '';
        const w = Math.max(tr.width, cols > 1 ? cols * 190 : tr.width);
        const left = Math.min(0, sr.right - 8 - (tr.left + w));
        pop.style.left = left + 'px';
        pop.style.right = 'auto';
        pop.style.width = w + 'px';
        for (const r of rows.values()) {
          r.style.height = h + 'px';
          r.style.fontSize = h < 28 ? '14px' : '';
        }
      },
      rendered: (base, S) => (ctx) => {
        const { tsec, tri, showBtn } = S.els;
        const setOpenSec = (on) => {
          tsec.classList.toggle('collapsed', !on);
          tri.classList.toggle('down', on);
          showBtn.textContent = on ? 'Hide controls' : 'Show controls';
          if (on && S.st.layout) S.st.layout();
          S.st.show();
        };
        S.st.showPoint = () => (tsec.classList.contains('collapsed') ? ctx.util.center(showBtn) : null);
        showBtn.addEventListener('click', () => setOpenSec(tsec.classList.contains('collapsed')));
        if (ctx.model.open) setOpenSec(true);
        else tsec.classList.add('collapsed');
      },
      locate: (base, S) => (target) => {
        const show = S.st.showPoint && S.st.showPoint();
        return show || base(target);
      },
    },
  },
});
