// The reference month picker, sized inside the lease window's task column.
env.widget({
  task: 'set-date',
  site: 'design-set-date-month-02',
  name: 'design',
  split: 'train',
  scenarios: ['month'],
  template: 'set-date/base',
  design: {
    parts: {
      // Keep sizing in the template, where popup geometry is measured before play.
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('gtk-form-date-style')) return;
        const style = document.createElement('style');
        style.id = 'gtk-form-date-style';
        style.textContent = `
        .fd-card { background: transparent; border-color: transparent; border-radius: 0; box-shadow: none; color: #141b25; font-family: Arial, sans-serif; }
        .gtk-stage .fd-title { color: #10244d; border-bottom: 1px solid #c8c6c1; font: 700 19px Arial, sans-serif !important; margin-bottom: 14px; }
        .gtk-stage .fd-row { margin: 0 0 12px; gap: 10px; }
        .gtk-stage .fd-row:not(.fd-ex):not(.fd-notes) { display: block; }
        .gtk-stage .fd-row.fd-ex { display: grid; grid-template-columns: 36% minmax(0,1fr); }
        .gtk-stage .fd-row.fd-notes { display: flex; }
        .gtk-stage .fd-label { color: #171c22 !important; font: 400 18px Arial, sans-serif !important; margin-bottom: 6px; }
        .gtk-stage .fd-control, .gtk-stage .fd-static, .gtk-stage .fd-input { border-color: #b9b8b5; border-radius: 4px !important; background: linear-gradient(#fff,#f7f6f3) !important; color: #1c2025; font: 18px Arial, sans-serif !important; box-shadow: inset 0 1px 2px #0000000d; }
        .fd-control.open { border-color: #4286c2; box-shadow: 0 0 2px #4286c2; }
        .fd-pop { border-color: #9d9c98; border-radius: 3px; background: #f7f6f2; box-shadow: 0 5px 12px #0004; }
        .fd-head { background: linear-gradient(#6094c7,#3c70aa); color: #fff; }
        .fd-nav { color: #fff; border-radius: 3px; }
        .fd-nav:hover { background: #ffffff33; }
        .fd-mtitle { color: #fff; }
        .fd-mgrid { grid-template-columns: repeat(4, 1fr); }
        .fd-mcell { border-radius: 3px; color: #17243b; }
        .fd-mcell:hover { background: #d8e6f4; }
        .fd-mcell.sel { background: #4a83ba; color: #fff; }
        `;
        document.head.append(style);
      },
      fitCard: (base, S) => (height, util) => {
        base(height, util);
        // The frame owns the frame; fill its task column without covering help.
        S.card.style.width = Math.max(0, S.ctxRef.size.width - 32) + 'px';
        S.card.style.height = Math.max(0, S.ctxRef.size.height - 24) + 'px';
      },
    },
  },
});
