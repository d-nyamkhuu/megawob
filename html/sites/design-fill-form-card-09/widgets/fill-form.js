// This card design wraps the source document in a profile window and reserves space for its page frame.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-09',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    parts: {
      beforeForm: (base) => (ctx, R) => {
        base(ctx, R);
        const { util } = ctx;
        const { docPane } = R;
        const source = docPane.firstElementChild;
        const title = util.el('div', 'ds-titlebar ds-profile-title', docPane);
        util.el('span', 'ds-tb-btn', title, '−');
        util.el('span', 'ds-tb-title', title, 'Profile');
        const ctl = util.el('span', 'ds-tb-ctl', title);
        util.el('span', 'ds-tb-btn ds-maximize', ctl, '');
        util.el('span', 'ds-tb-btn', ctl, '×');
        const menu = util.el('nav', 'ds-wmenu ds-profile-menu', docPane);
        ['File', 'Edit', 'View'].forEach((x) => util.el('span', '', menu, x));
        const frame = util.el('fieldset', 'ds-profile-frame', docPane);
        util.el('legend', '', frame, 'Contact Profile');
        frame.append(source);
        docPane.prepend(title, menu);
      },
      fit: () => (ctx, R) => {
        const { root, formPane, tabbar, docPane } = R;
        const L = ctx.spec.layout;
        root.style.setProperty('--ff-available', Math.max(0, ctx.size.height - 8) + 'px');
        let fs = 21;
        for (; fs >= 8; fs -= 0.5) {
          root.style.fontSize = fs + 'px';
          const maxH = Math.min(ctx.size.height, ctx.stage.clientHeight) - 4;
          if (L.tabs) {
            root.style.setProperty('--ff-available', Math.max(0, maxH - tabbar.offsetHeight - fs) + 'px');
            if (fs <= 12) root.classList.add('ds-compact');
          }
          if (root.offsetHeight <= maxH && formPane.scrollWidth <= ctx.size.width + 1) break;
        }
        const availableH = Math.min(ctx.size.height, ctx.stage.clientHeight) - 4;
        if (L.tabs && root.offsetHeight > availableH) {
          const scale = Math.min(1, availableH / root.offsetHeight);
          root.style.transformOrigin = 'top left';
          root.style.transform = 'scale(' + scale + ')';
        }
        if (!L.tabs) {
          let df = parseFloat(getComputedStyle(docPane).fontSize);
          const cap = document.body.clientHeight * 0.85;
          while (docPane.offsetHeight > cap && df > 11) {
            df -= 0.5;
            docPane.style.fontSize = df + 'px';
          }
        }
      },
    },
  },
});
