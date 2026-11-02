// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-confirmshame-04',
  name: 'design',
  split: 'train',
  scenarios: ['confirmshame'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: "16px/1.4 Georgia, 'Times New Roman', serif",
    windowRadius: '0px',
    windowShadow: '0 2px 7px rgba(0,0,0,.32)',
    dimColor: 'rgba(40, 29, 20, .12)',
    geometry: {
      margin: 0, minWidth: 1, minHeight: 1, widthBreakpoint: 900,
      widthMin: 1, widthMax: 820, widthScale: [1, 1], heightBreakpoint: 560,
      heightMin: 1, heightMax: 480, heightScale: [1, 1], sideBreakpoint: 900,
      sideNarrow: 240, sideRange: [255, 290],
    },
    parts: {
      screenBody: (base, S) => (sc, parent, m) => {
        const win = parent.closest('.sd-win');
        if (win) {
          Object.assign(win.style, { display: 'flex', flexDirection: 'column', overflow: 'hidden' });
          for (const child of win.children) child.style.flexShrink = '0';
          win.classList.add('c1', 'c2', 'c3');
        }
        Object.assign(parent.style, {
          display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: '0', overflow: 'hidden',
        });
        const body = base(sc, parent, m);
        Object.assign(body.style, { flex: '1 1 0', minHeight: '0', overflow: 'hidden' });
        return body;
      },
      main: (base, S) => (sc, parent, m) => {
        const main = base(sc, parent, m);
        Object.assign(main.style, { minHeight: '0', overflow: 'auto' });
        return main;
      },
      modalEl: (base, S) => (parent, md) => {
        const el = S.ctx.util.el;
        const dlg = base(parent, { ...md, ctls: [] });
        dlg.replaceChildren();
        dlg.classList.add('lib-offer');
        Object.assign(dlg.style, {
          width: `${Math.min(810, S.ctx.size.width - 16)}px`,
          maxWidth: 'none',
          height: `${Math.min(480, S.ctx.size.height - 16)}px`,
          maxHeight: '100%', padding: '0', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        });
        const bar = el('div', 'lib-offer-title', dlg, md.title || 'Protect Your Purchase');
        const close = el('span', 'lib-offer-close', bar, '×');
        close.setAttribute('aria-hidden', 'true');
        const columns = el('div', 'lib-offer-columns', dlg);
        const copy = el('div', 'lib-offer-copy', columns);
        const art = el('div', 'lib-frame-art', copy);
        art.setAttribute('aria-hidden', 'true');
        el('h3', '', copy, 'Add a 2-Year Protection Plan for Only $12.99');
        if (md.text) el('p', '', copy, md.text);
        const perks = el('div', 'lib-perks', copy);
        for (const item of ['Covers accidental damage', 'Includes parts and labour', 'Easy claims with no hassle']) {
          el('div', '', perks, item);
        }
        const choices = el('div', 'lib-offer-choices', columns);
        Object.assign(choices.style, { display: 'block', minHeight: '0', overflow: 'auto' });
        el('div', 'lib-offer-meta', choices, 'Format:　Electronics　　Publisher:　HomeView　　ISBN:　9781592840271　　Availability:　In Stock');
        for (const id of md.ctls) S.P.ctlBtn(id, choices);
        return dlg;
      },
    },
  },
});
