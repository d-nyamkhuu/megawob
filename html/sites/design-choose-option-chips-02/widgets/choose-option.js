// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-chips-02',
  name: 'design',
  split: 'train',
  scenarios: ['chips'],
  template: 'choose-option/base',
  design: {
    parts: {
      ensureStyle: (base) => function (id, css) {
        return base(id, css + (id === 'fp-style' ? `
        .gc-stage .fp-card { padding:0; }
        .gc-stage .fp-title,.gc-stage .fp-note,.gc-stage .fp-status { display:none; }
        .gc-stage .fp-card:before { content:"Organization Details";position:absolute;left:0;right:0;top:0;height:var(--gc-title);padding:7px 28px;background:linear-gradient(110deg,#c8cdec,#9ba8dc);border:1px solid #263a70;color:#11194f;font:bold var(--gc-title-font) Georgia,serif; }
        .gc-stage .fp-card:after { content:"Name                         Global Connect\\A Type                         Community Network";white-space:pre;position:absolute;top:var(--gc-title);left:0;right:0;height:var(--gc-rows);padding:0 28px;color:#10194f;font:20px/var(--gc-row) Georgia,serif;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.38) 0 calc(var(--gc-row) - 1px),rgba(147,151,160,.52) calc(var(--gc-row) - 1px) var(--gc-row)); }
        .gc-stage .fp-field { position:relative;z-index:1;display:grid;grid-template-columns:var(--gc-label) minmax(0,1fr);align-items:start;margin:var(--gc-details) 0 0;padding:8px;border:1px solid #c8c8c8;background:rgba(255,255,255,.28); }
        .gc-stage .fp-label { margin:6px 0 0 12px; }
        .gc-stage .fp-chipbox { min-height:48px;padding:8px 12px; }
        ` : ''));
      },
      place: (base) => function (card, ctx, popup) {
        base(card, ctx, popup); // Preserve the template's seeded placement draws.
        const { width, height } = ctx.size;
        const inspector = width < 1235 ? 205 : 265;
        const details = Math.min(202, Math.max(76, height - 280));
        const title = details < 130 ? 38 : 52;
        Object.assign(card.style, {
          left: '0px', top: '0px', width: Math.max(1, width - inspector) + 'px',
          height: height + 'px',
        });
        card.style.setProperty('--gc-title', title + 'px');
        card.style.setProperty('--gc-title-font', (title === 38 ? 26 : 34) + 'px');
        card.style.setProperty('--gc-details', details + 'px');
        card.style.setProperty('--gc-rows', (details - title) + 'px');
        card.style.setProperty('--gc-row', (details - title) / 2 + 'px');
        card.style.setProperty('--gc-label', Math.min(255, Math.max(130, (width - inspector) * .23)) + 'px');
      },
      buildChips: (base, S) => function (field, ctx) {
        base(field, ctx);
        const layout = S.st.layout;
        const show = S.st.show;
        const pop = field.querySelector('.fp-chippop');
        const box = field.querySelector('.fp-chipbox');
        S.st.layout = () => {
          layout();
          // The same options remain available in short stages, inside their own pane.
          const room = ctx.stage.getBoundingClientRect().bottom - box.getBoundingClientRect().bottom - 8;
          pop.style.maxHeight = Math.max(1, room) + 'px';
          pop.style.overflowY = 'auto';
          pop.style.overscrollBehavior = 'contain';
        };
        S.st.show = () => { show(); S.st.layout(); };
      },
    },
  },
});
