// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-email',
  site: 'design-use-email-move-05',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'use-email/base',
  design: { parts: {
    mailGeometry: (base) => (ctx, ads) => {
      const g = base(ctx, ads), W = ctx.size.width, H = ctx.size.height;
      const narrow = W < 1400;
      const appW = Math.round(W * (narrow ? .90 : .716));
      const sideW = Math.round(appW * .16), listW = Math.round(appW * .37);
      return { ...g, appW, appH: Math.round(H * .765), left: Math.round(W * (narrow ? .05 : .144)),
        top: Math.round(H * .13), rail: false, stack: false, sideW, listW,
        readW: appW - sideW - listW - 1, rowH: Math.max(28, Math.round(32 * W / 1536)), rowKind: 'compact' };
    },
    build: (base) => (ctx, style) => {
      if (window.drawDraftBackdrop) window.drawDraftBackdrop();
      const v = base(ctx, style);
      const t = document.createElement('div'); t.className = 'mail-window-caption';
      t.innerHTML = '<span>✉ &nbsp; Mail</span><span class="mail-window-controls">— &nbsp; ▣ &nbsp; <b>×</b></span>';
      v.app.prepend(t);
      const top = v.app.querySelector('.am-top'), side = v.app.querySelector('.am-side');
      if (top) { const a = document.createElement('span'); a.className='mail-account'; a.textContent='jcarter@northbridge.com'; top.prepend(a); }
      const compose = v.app.querySelector('.am-new');
      if (compose && side) { compose.classList.add('cad-compose'); t.insertBefore(compose,t.lastElementChild); }
      const decorate = () => {
        const actions=v.app.querySelector('.am-acts'), bar=v.app.querySelector('.am-bar');
        if (actions && bar && actions.parentElement !== bar) { actions.classList.add('cad-replies'); bar.prepend(actions); }
        const label=v.app.querySelector('.am-flabel'); if(label && /^folders$/i.test(label.textContent.trim())) label.textContent='Projects';
        const heading=v.app.querySelector('.am-lhead b'); if(heading) heading.textContent='All ▾';
        v.app.querySelectorAll('.am-bar .am-tb').forEach(b => { if(/move/i.test(b.title)) b.classList.add('cad-move'); });
      };
      const sync=v.sync; v.sync = (m) => { const result=sync(m); decorate(); return result; };
      decorate();
      return v;
    },
  } },
});
