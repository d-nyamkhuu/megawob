/* recall-info/_classic-compare: classic's compare parts and view builder; part names stay in classic. */
(function () {
  'use strict';

  function parts(S, shared) {
    const { el, titleLine } = shared;
    const BASE = {};
    // compare: a catalog with separate product details.
    BASE.catalog = (ctx, work) => {
      const { spec } = ctx;
      const items = spec.items;
      el('h2', 'ur-h', work, spec.title);
      const bar = el('div', 'ur-choice', work);
      const body = el('div', 'ur-body', work);
      const list = el('div', 'ur-view', body);
      const grid = el('div', 'ur-cgrid', list);
      grid.style.setProperty('--ur-cc', items.length > 5 ? '2' : '1');
      return { bar, body, list, grid };
    };

    BASE.tile = (ctx, grid, it, i, apply) => {
      const { spec } = ctx;
      const t = el('div', 'ur-tile', grid);
      el('span', 'sw', t, it.name.charAt(0).toUpperCase());
      el('span', 'nm', t, it.name).title = it.name;
      const v = el('button', 'ur-btn small', t, S.D.detailsLabel);
      v.type = 'button';
      v.addEventListener('click', () => apply({ open: i }));
      let c = null;
      if (spec.listChoose) {
        c = el('button', 'ur-btn small', t, spec.actLabel);
        c.type = 'button';
        c.addEventListener('click', () => apply({ pick: i }));
      }
      S.P.decorated(ctx, t, it);
      return { v, c };
    };

    BASE.detail = (ctx, body, apply) => {
      const { spec } = ctx;
      const det = el('div', 'ur-view ur-detail', body);
      const back = el('button', 'ur-link', det, `‹ All ${spec.nouns}`);
      back.type = 'button';
      back.style.paddingLeft = '0';
      back.addEventListener('click', () => apply({ back: true }));
      const dName = el('h3', '', det);
      const dPrice = el('div', 'ur-price', det);
      const dl = el('dl', 'ur-specs', det);
      const dBlurb = el('p', 'ur-p', det);
      const dBtn = el('button', 'ur-btn primary', det, spec.actLabel);
      dBtn.type = 'button';
      dBtn.style.marginTop = '8px';
      dBtn.addEventListener('click', () => apply({ pick: ctx.model.open }));
      return { det, back, dName, dPrice, dl, dBlurb, dBtn };
    };

    BASE.detailData = (ctx, i, dName, dPrice, dl, dBlurb) => {
      const items = ctx.spec.items;
      const it = items[i];
      dName.textContent = it.name;
      dPrice.textContent = `$${it.price.toFixed(2)}`;
      dl.innerHTML = '';
      for (const [k, v] of [['Rating', `★ ${it.rating.toFixed(1)} / 5`], ['Delivery', `${it.delivery} day${it.delivery === 1 ? '' : 's'}`],
        ['Colour', it.colour], ['Warranty', `${it.warranty} year${it.warranty === 1 ? '' : 's'}`]]) {
        el('dt', '', dl, k);
        el('dd', '', dl, v);
      }
      dBlurb.textContent = it.blurb;
    };

    BASE.choice = (ctx, bar, m) => {
      const items = ctx.spec.items;
      bar.innerHTML = '';
      if (m.picked == null) bar.append('Your choice: none yet');
      else {
        bar.append('Your choice: ');
        el('b', '', bar, items[m.picked].name);
        bar.append(` · $${items[m.picked].price.toFixed(2)}`);
      }
    };

    return { parts: BASE };
  }

  function build(S, shared) {
    const { el, center, actions, fitPanels } = shared;
    return (ctx, work, app) => {
      const { spec } = ctx;
      const items = spec.items;
      const apply = actions(ctx, paint);
      const { bar, body, list, grid } = S.P.catalog(ctx, work);
      const tiles = items.map((it, i) => S.P.tile(ctx, grid, it, i, apply));
      const { det, back, dName, dPrice, dl, dBlurb, dBtn } = S.P.detail(ctx, body, apply);
      const showDetail = (i) => S.P.detailData(ctx, i, dName, dPrice, dl, dBlurb);
      function paint(m) {
        list.hidden = m.view !== 'list';
        det.hidden = m.view !== 'detail';
        S.P.choice(ctx, bar, m);
        if (m.view === 'detail' && m.open !== null) {
          showDetail(m.open);
          const on = m.picked === m.open;
          dBtn.textContent = on ? '✓ Chosen' : `${spec.actLabel} this ${spec.noun}`;
          dBtn.classList.toggle('on', on);
        }
        tiles.forEach((t, i) => {
          if (!t.c) return;
          const on = m.picked === i;
          t.c.textContent = on ? '✓ Chosen' : spec.actLabel;
          t.c.classList.toggle('on', on);
        });
      }
      let hmax = 0;
      list.hidden = false;
      det.hidden = true;
      hmax = list.offsetHeight;
      list.hidden = true;
      det.hidden = false;
      for (let i = 0; i < items.length; i++) { showDetail(i); hmax = Math.max(hmax, det.offsetHeight); }
      body.style.height = `${hmax + 4}px`;
      paint(ctx.model);
      return {
        paint,
        locate(t) {
          if (t.open !== undefined) return center(tiles[t.open].v);
          if (t.nav === 'back') return center(back);
          if (t.choose !== undefined) return center(tiles[t.choose].c);
          if (t.chooseOpen) return center(dBtn);
          throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
        },
      };
    };
  }

  env.template('recall-info/_classic-compare', () => ({ parts, build }));
})();
