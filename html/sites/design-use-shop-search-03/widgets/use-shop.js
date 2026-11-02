// Adds the people corpus and its continuously loaded, scrollable result feed.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-03',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  traits: { corpus: 'people', infinite: true },
  template: 'use-shop/store',
  design: {
    parts: {
      searchBar: (base, S) => (V) => {
        base(V);
        const clear = S.H.btn(V.util, 'se-clear', V.box, '×');
        clear.setAttribute('aria-label', 'Clear search text');
        clear.addEventListener('click', () => {
          if (!V.ctx.model.pick) V.commit({ ...V.ctx.model, text: '' });
        });
      },

      searchPanes: (base) => (V) => {
        base(V);
        if (V.spec.infinite) V.list.classList.add('as-pane', 'se-pane');
      },

      searchSizing: (_base) => (V) => {
        const { spec, col, body, bar, meta } = V;
        if (spec.infinite) {
          V.cardH = Math.max(32, Math.floor((col.clientHeight - bar.offsetHeight - meta.offsetHeight) / spec.rows));
          if (V.ctx.model.pitch !== V.cardH) V.ctx.update({ ...V.ctx.model, pitch: V.cardH });
        } else {
          const bh = body.getBoundingClientRect().height;
          const avail = bh - 32 - 46 - 40 - 50;
          V.cardH = Math.max(60, Math.min(118, Math.floor(avail / spec.perPage)));
        }
        V.lines = V.cardH >= 98 ? 2 : V.cardH >= 78 ? 1 : 0;
        col.style.setProperty('--se-lines', Math.max(1, V.lines));
      },

      searchReset: (_base, S) => (V) => {
        V.x.feed = null;
        V.x.lbx = null;
      },

      searchRebuild: (base, S) => (V, m) => {
        base(V, m);
        if (V.spec.infinite) V.list.classList.toggle('idle', m.query === null);
        const count = document.querySelector('.result-count');
        if (count) count.textContent = `${m.query === null ? 0 : S.H.F().resultsFor(V.spec, m.query).length} RESULTS`;
      },

      searchCard: (_base, S) => (V, r, i, res, m, parent = V.list) => {
        const { ctx, util, cardH, lines, titles, commit, spec } = V;
        const { hashStr, FAV } = S.H;
        const card = util.el('div', 'se-card', parent);
        card.style.height = cardH + 'px';
        card.style.setProperty('--row-height', cardH + 'px');
        card.dataset.n = String(i + 1);
        if (spec.corpus) card.dataset.corpus = spec.corpus;
        const url = util.el('div', 'se-url', card);
        const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
        fav.style.background = FAV[hashStr(r.host) % FAV.length];
        util.el('span', 'se-host', url, r.host);
        util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
        const t = util.el('a', 'se-title', card, r.title);
        if (spec.corpus === 'people') {
          const parts = String(r.title).trim().split(/\s+/);
          fav.textContent = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
        }
        t.dataset.role = 'result';
        t.dataset.index = i;
        t.addEventListener('click', () => {
          if (ctx.model.pick) return;
          commit(S.H.F().apply(ctx.model, spec, { click: { result: i } }));
        });
        titles[i] = t;
        if (spec.corpus) {
          const metadata = S.H.F().resultMeta(spec, r);
          if (metadata && metadata.length) {
            const line = util.el('div', 'se-person-meta', card);
            util.el('span', '', line, metadata.slice(0, 2).map(([, value]) => value).join(' · '));
            if (metadata.length > 2) {
              const detail = util.el('span', 'se-person-detail', card,
                metadata.slice(2).map(([, value]) => value).join(' · '));
              detail.title = metadata.slice(2).map(([label]) => label).join(' · ');
            }
          }
        }
        if (lines) util.el('div', 'se-desc', card, r.desc);
        return card;
      },

      searchRows: (base, S) => (V, m, res) => {
        if (!V.spec.infinite) return base(V, m, res);
        const { ctx, util, spec, cardH } = V;
        const mkCard = (i, parent = V.list) => S.P.searchCard(V, res[i], i, res, m, parent);
        const lbx = S.H.listPane(ctx, V.list, {
          keys: [...Array(m.loaded).keys()],
          build: (i) => mkCard(i),
          rows: spec.rows,
          pitch: cardH,
          gap: 0,
          scroll: m.scroll,
          label: 'results',
        });
        lbx.list.style.height = '100%';
        const foot = util.el('div', 'se-foot', lbx.list);
        foot.style.height = Math.round(cardH * 0.6) + 'px';
        V.x.feed = { shown: m.loaded, mkCard, foot, track: V.list.querySelector('.as-track') };
        V.x.lbx = lbx;
        paintFoot(V, m);
        lbx.refresh();
        return true;
      },

      searchPaint: (base) => (V, m) => {
        base(V, m);
        const feed = V.x.feed;
        if (!feed || m.pick || m.query === null) return;
        if (feed.shown !== m.loaded || feed.foot.classList.contains('busy') !== (m.loading > 0)) {
          while (feed.shown < m.loaded) {
            const i = feed.shown++;
            const row = feed.mkCard(i);
            V.x.lbx.list.insertBefore(row, feed.foot);
            V.x.lbx.option(i, row);
          }
          feed.track.classList.toggle('idle', m.loaded <= V.spec.rows);
          paintFoot(V, m);
          V.x.lbx.refresh();
        }
      },

      searchLocate: (base, S) => (V, t) => {
        if (V.spec.infinite && V.x.lbx) {
          if (t.thumb) return V.x.lbx.locateThumb();
          if (t.scroll !== undefined) return V.x.lbx.locateThumbFor(t.scroll);
          if (t.pane) return S.H.where(V.x.lbx.list, 'results list');
        }
        return base(V, t);
      },
    },
  },
});


function paintFoot(V, m) {
  const f = V.x.feed.foot;
  f.replaceChildren();
  f.classList.toggle('busy', m.loading > 0);
  V.util.el('span', '', f, m.loading > 0
    ? 'Loading more results…'
    : m.loaded >= V.spec.results.length
      ? 'You have reached the end of the results.'
      : 'Scroll down for more results');
  if (m.loading > 0) V.util.el('i', '', f, '● ● ●');
}
