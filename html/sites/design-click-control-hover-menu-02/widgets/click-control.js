// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-menu-02',
  name: 'design',
  split: 'train',
  scenarios: ['hover-menu'],
  template: 'click-control/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        // Retain all frame sampling; only its presentation differs from the template.
        const frame = base(ctx);
        const { page, h1 } = frame;
        page.classList.add('breeze-task');
        page.style.setProperty('--breeze-nav-height', Math.min(76, Math.max(40, ctx.size.height - 64)) + 'px');
        Object.assign(page.style, {
          top: '0', bottom: '0', left: '0', width: ctx.size.width + 'px',
          overflow: 'visible', border: '0', borderRadius: '0', boxShadow: 'none',
        });
        for (const selector of ['.uc-brand', '.uc-navright', '.uc-side', '.uc-crumb']) {
          page.querySelector(selector)?.remove();
        }
        // This remains the template's blank-area target, including in partial starts.
        Object.assign(h1.style, { margin: '0', padding: '0 18px', fontSize: '14px',
          fontWeight: '400', height: '24px', flex: 'none', lineHeight: '24px' });
        ctx.util.el('style', 'breeze-task-style', page).textContent = `
          .breeze-task .uc-nav { height:var(--breeze-nav-height); padding:0 16px; gap:0; background:#fff; }
          .breeze-task .uc-navlinks { height:100%; width:100%; justify-content:space-around; align-items:stretch; gap:0; overflow:visible; font-size:18px; }
          .breeze-task .uc-htop .lbl { height:100%; padding:0 22px; }
          .breeze-task .uc-htop .lbl:before { display:inline-flex; align-items:center; justify-content:center; width:25px; height:26px; margin-right:7px; color:#13547d; font-size:20px; line-height:1; }
          .breeze-task .uc-htop:nth-child(1) .lbl:before { content:'▦'; }
          .breeze-task .uc-htop:nth-child(2) .lbl:before { content:'♟'; }
          .breeze-task .uc-htop:nth-child(3) .lbl:before { content:'▣'; }
          .breeze-task .uc-htop:nth-child(4) .lbl:before { content:'✣'; }
          .breeze-task .uc-htop:first-child .lbl { border-bottom:3px solid #0088e8; color:#0088e8; }
          .breeze-task .uc-main { padding:0; overflow:visible; }
          .breeze-task .uc-content { padding:0; }
          .breeze-task .uc-hdrop { border-radius:3px; background:#fff; }
          .breeze-task .uc-navview { padding:8px 18px; overflow:auto; }
          .breeze-task .uc-navview h2 { margin:5px 0; font-size:16px; }
          .breeze-task .uc-navview p { font-size:13px; }
          @media(max-width:1100px) { .breeze-task .uc-navlinks { font-size:15px; } .breeze-task .uc-htop .lbl { padding:0 10px; } }
        `;
        return frame;
      },
      buildHoverMenu: (base) => (...args) => {
        const view = base(...args);
        // The dashboard is supplied by the frame; keep the recovery area intact.
        const content = args[1];
        content.querySelector('.uc-hero')?.remove();
        content.querySelector('.uc-feats')?.remove();
        return view;
      },
    },
  },
});
