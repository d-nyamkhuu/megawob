// This design adds the infinite product table and its scrollbar to the shared search widget.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-05',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  traits: { infinite: true },
  template: 'use-shop/store',
  design: {
    parts: {
      searchBar: (base) => (V) => {
        base(V);
        const endControl = document.querySelector('.end-control');
        if (endControl) V.bar.append(endControl);
      },
      searchPanes: (base, S) => (V) => {
        base(V);
        const { util, col } = V;
        V.resultPane = util.el('div', 'se-results', col);
        col.insertBefore(V.resultPane, V.pager);
        V.shell = util.el('div', 'se-list-shell', V.resultPane);
        V.colHead = util.el('div', 'se-colhead', V.shell);
        for (const h of ['#', 'Item', 'Price', 'Availability']) util.el('span', '', V.colHead, h);
        V.list.remove();
        V.list = util.el('div', 'se-list', V.shell);
        V.rail = null;
        V.track = null;
        V.thumb = null;
        V.lbx = null;
        V.feed = null;
      },
      searchSizing: (base, S) => (V) => {
        const { spec, col, body, ctx } = V;
        const bh = body.getBoundingClientRect().height;
        const avail = bh - 32 - 46 - 40 - 50;
        V.cardH = spec.infinite
          ? Math.max(22, Math.floor((V.shell.clientHeight - V.colHead.offsetHeight) / spec.rows))
          : Math.max(60, Math.min(118, Math.floor(avail / spec.perPage)));
        if (spec.infinite) S.H.mirrorPitch(ctx, V.cardH);
        V.lines = V.cardH >= 98 ? 2 : V.cardH >= 78 ? 1 : 0;
        col.style.setProperty('--se-lines', Math.max(1, V.lines));
      },
      searchRebuild: (base, S) => (V, m) => {
        const { util, ctx, spec, cardH, list, shell, resultPane, pager, visit, meta, go } = V;
        const { F, ICON, FAV, hashStr, btn, where } = S.H;
        V.list.remove();
        V.list = util.el('div', 'se-list', shell);
        if (V.rail) V.rail.remove();
        V.rail = util.el('div', 'se-scrollbar', resultPane);
        const scrollUp = btn(util, 'se-scroll-arrow', V.rail, '▲');
        scrollUp.setAttribute('aria-label', 'Scroll results up');
        V.track = util.el('div', 'se-scroll-track', V.rail);
        V.track.dataset.role = 'scrollbar';
        V.thumb = util.el('div', 'se-scroll-thumb', V.track);
        V.thumb.dataset.role = 'thumb';
        const scrollDown = btn(util, 'se-scroll-arrow', V.rail, '▼');
        scrollDown.setAttribute('aria-label', 'Scroll results down');
        scrollUp.addEventListener('click', () => { V.list.scrollTop -= cardH; });
        scrollDown.addEventListener('click', () => { V.list.scrollTop += cardH; });
        V.lbx = null;
        V.feed = null;
        pager.replaceChildren();
        V.titles = [];
        V.pages = [];
        V.list.hidden = !!m.pick;
        pager.hidden = !!m.pick || !spec.infinite;
        resultPane.hidden = !!m.pick;
        visit.hidden = !m.pick;
        if (m.pick) {
          S.P.searchVisit(V, m);
          return;
        }
        if (m.query === null) {
          meta.replaceChildren();
          util.el('strong', '', meta, 'Search Results');
          V.rail.classList.add('inactive');
          const e = util.el('div', 'se-empty', V.list);
          e.innerHTML = `${ICON.search}<div>Type your search above and press <b>${go.textContent}</b>.</div>`;
          return;
        }
        const res = F().resultsFor(spec, m.query);
        meta.replaceChildren();
        util.el('strong', '', meta, 'Search Results');
        const p0 = spec.infinite ? 0 : m.page * spec.perPage;
        util.el('span', '', meta, ` (${p0 + 1} - ${Math.min(spec.infinite ? m.loaded : (m.page + 1) * spec.perPage, res.length)} of ${res.length})`);
        const mkCard = (i) => {
          const r = res[i];
          const card = util.el('div', 'se-card');
          card.style.setProperty('height', cardH + 'px', spec.infinite ? 'important' : '');
          util.el('span', 'se-num', card, String(i + 1));
          const shoe = util.el('span', 'se-shoe', card);
          shoe.style.setProperty('--shoe', FAV[hashStr(r.title) % FAV.length]);
          shoe.style.filter = `hue-rotate(${hashStr(r.title) % 360}deg)`;
          util.el('span', 'se-price', card, '$' + (20 + (hashStr(r.title + r.host) % 80)) + '.99');
          const url = util.el('div', 'se-url', card);
          const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
          fav.style.background = FAV[hashStr(r.host) % FAV.length];
          util.el('span', 'se-host', url, r.host);
          util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
          const t = util.el('a', 'se-title', card, r.title);
          t.dataset.role = 'result';
          t.dataset.index = i;
          t.addEventListener('click', () => {
            if (ctx.model.pick) return;
            V.commit(F().apply(ctx.model, spec, { click: { result: i } }));
          });
          V.titles[i] = t;
          if (V.lines) util.el('div', 'se-desc', card, r.desc);
          return card;
        };
        const count = spec.infinite ? m.loaded : Math.min(p0 + spec.perPage, res.length);
        const options = [];
        for (let i = p0; i < count; i++) {
          const card = mkCard(i);
          V.list.append(card);
          options.push([i, card]);
        }
        if (spec.infinite) {
          V.feed = { res, mkCard, shown: m.loaded, foot: util.el('div', 'se-feed-foot', V.list) };
          V.feed.foot.style.height = Math.round(cardH * 0.6) + 'px';
          paintFoot(V, spec);
        }
        V.lbx = env.ui.listbox(V.list, {
          label: 'results', options,
          onScroll(i) {
            const scroll = Math.round(i * 1000) / 1000;
            if (ctx.model.scroll !== scroll) ctx.update({ ...ctx.model, scroll });
          },
          scrollbar: { track: V.track, thumb: V.thumb, pad: 0, minThumb: 20 },
        });
        V.lbx.list = V.list;
        V.lbx.set({ scroll: m.scroll || 0 });
        if (!spec.infinite) S.P.searchPager(V, m);
      },
      searchPaint: (base, S) => (V, m) => {
        if (V.input.value !== m.text) V.tf.set(m.text);
        const key = JSON.stringify([m.query, m.page, m.pick]);
        if (key !== V.shown) {
          V.shown = key;
          S.P.searchRebuild(V, m);
        } else if (V.feed && !m.pick && m.query !== null) {
          if (V.feed.shown !== m.loaded || V.feed.foot.classList.contains('busy') !== (m.loading > 0)) feedMore(V, m);
        }
        S.P.paintEnd(V, m);
      },
      searchLocate: (base, S) => (V, t) => {
        if (t.field) return V.tf.locate();
        if (t.button) return S.H.where(V.go, 'Search button');
        if (t.thumb === 'list') return V.lbx.locateThumb();
        if (t.scroll !== undefined) return V.lbx.locateThumbFor(t.scroll);
        if (t.pane === 'list') return S.H.where(V.list, 'results list');
        if (t.back) return S.H.where(V.back, 'Back to results');
        if (t.page !== undefined) return S.H.where(V.pages[t.page], `page ${t.page}`);
        if (t.pager) return S.H.where(t.pager === 'prev' ? V.prev : V.next, `pager ${t.pager}`);
        if (t.result !== undefined) return S.H.where(V.titles[t.result], `result ${t.result}`);
        return null;
      },
    },
  },
});

function paintFoot(V, spec) {
  V.feed.foot.textContent = V.ctx.model.loading > 0
    ? 'Loading more results…'
    : V.ctx.model.loaded >= spec.results.length
      ? 'You have reached the end of the results.'
      : 'Scroll down for more results';
  V.feed.foot.classList.toggle('busy', V.ctx.model.loading > 0);
}
function feedMore(V, m) {
  while (V.feed.shown < m.loaded) {
    const i = V.feed.shown++;
    const row = V.feed.mkCard(i);
    V.list.insertBefore(row, V.feed.foot);
    V.lbx.option(i, row);
  }
  paintFoot(V, V.spec);
  V.meta.lastElementChild.textContent = ` (1 - ${m.loaded} of ${V.feed.res.length})`;
  V.lbx.refresh();
}
