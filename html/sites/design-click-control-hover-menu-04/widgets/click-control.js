// Preserve the template's interactions and seeded draws while sizing its menu to the task window.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-menu-04',
  name: 'design',
  split: 'train',
  scenarios: ['hover-menu'],
  template: 'click-control/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const view = base(ctx);
        const { page, content } = view;
        Object.assign(page.style, {
          left: '0px', top: '0px', bottom: '0px', width: ctx.size.width + 'px',
        });
        // The app frame already supplies branding and the inspector. Keep the
        // template content area available for its navigated view and Back control.
        for (const name of ['uc-brand', 'uc-navright', 'uc-side', 'uc-crumb', 'uc-h1']) {
          const el = page.querySelector('.' + name);
          if (el) el.style.display = 'none';
        }
        const nav = page.querySelector('.uc-nav');
        Object.assign(nav.style, { height: '64px', padding: '0 18px', gap: '0px' });
        const links = page.querySelector('.uc-navlinks');
        const characters = ctx.spec.tops.reduce((n, t) => n + t.label.length, 0);
        const fontSize = Math.min(20, (ctx.size.width - 36 - ctx.spec.tops.length * 42) / (characters * .65));
        Object.assign(links.style, {
          width: '100%', height: '100%', alignItems: 'center',
          justifyContent: 'space-around', overflow: 'visible',
          fontSize: Math.max(12, fontSize) + 'px',
        });
        const body = page.querySelector('.uc-body');
        const main = page.querySelector('.uc-main');
        Object.assign(body.style, { minHeight: '0px' });
        Object.assign(main.style, { padding: '0px', minHeight: '0px' });
        return view;
      },
      buildHoverMenu: (base) => (ctx, content, up, page) => {
        const view = base(ctx, content, up, page);
        // Leave the reference's empty recessed well, without hiding recovery.
        content.querySelector('.uc-hero').style.display = 'none';
        content.querySelector('.uc-feats').style.display = 'none';
        return view;
      },
    },
  },
});
