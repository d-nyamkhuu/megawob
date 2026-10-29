// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-overshare-04',
  name: 'design',
  split: 'train',
  scenarios: ['overshare'],
  template: 'protect-privacy/classic',
  design: {
    font: '16px/1.28 "Times New Roman", Times, serif',
    radius: '0',
    parts: {
      // Preserve the template's seeded draws, then fit the sheet to the actual stage.
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        const fullW = Math.max(1, ctx.size.width - 2 * geo.M);
        const fullH = Math.max(1, ctx.size.height - 2 * geo.M);
        return { ...geo, fullW, fullH, winW: fullW, winH: fullH };
      },
      layout: (base, S) => (ctx) => {
        const app = base(ctx);
        const height = S.geo.winH - 2;
        const conversation = Math.max(Math.floor(height / 2) - 4, Math.min(300, Math.floor(height * 0.72)));
        app.style.gridTemplateRows = `minmax(0, 1fr) minmax(0, ${conversation}px)`;
        return app;
      },
      styles: (base) => () => base() + `
        .sp-win { color: #111; background: #fff; border-color: #b8b8b8; box-shadow: none; }
        .sp-tabs, .sp-bar { display: none; }
        .sp-app { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); gap: 8px; background: #fff; }
        .sp-side { min-height: 0; overflow: auto; background: #fffdee; border: 1px solid #d6d1bb; }
        .sp-side-h { background: linear-gradient(#e7e9ef, #d4d8e1); border-color: #ccd2dc; }
        .zephyr-notes-title { font-size: 24px; }
        .sp-kv { margin: 0; font-size: 18px; }
        .sp-kv dt { color: #111; }
        .sp-kv dd { font: inherit; }
        .sp-main { min-height: 0; background: #fff; }
        .sp-thread { overflow: auto; justify-content: flex-start; background: #edf3fa; border: 1px solid #c2ccda; }
        .sp-msg, .sp-mail { flex: none; border-radius: 0; background: transparent; color: #111; }
        .sp-msg.them, .sp-msg.me { background: transparent; color: #111; }
        .sp-muted, .sp-mail .who, .sp-site-h .sp-navs { color: #555; }
        .sp-btn { border-radius: 0; border: 2px outset #ddd; background: #ddd; color: #111; font-family: inherit; }
        .sp-btn.pri { background: #ddd; border-color: #ddd; color: #111; }
        .sp-in { border-radius: 0; border-color: #888; background: #fff; color: #111; }
        .sp-compose { background: #fff; }
        .sp-mailh, .sp-site-h { background: #fff; color: #111; }
      `,
      notesPanel: (base, S) => (m) => {
        base(m);
        const side = S.app.lastElementChild;
        side.style.width = 'auto';
        const heading = side.firstElementChild;
        heading.classList.add('zephyr-notes-title');
        heading.replaceChildren();
        S.P.element('span', '', heading, 'My Notes');
      },
    },
  },
});
