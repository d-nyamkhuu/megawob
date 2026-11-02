// Ledger results and a persistent details preview for the monochrome app catalog.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-09',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  traits: { corpus: 'apps' },
  template: 'use-shop/store',
  design: {
    goLabel: null,
    backLabel: '← Back',
    parts: {
      searchPanes: (base, S) => (V) => {
        const { util, col } = V;
        V.meta = util.el('div', 'se-meta', col);
        const head = util.el('div', 'se-head', col);
        for (const label of ['#', 'Name', 'Type', 'Publisher', 'Updated']) util.el('b', '', head, label);
        V.x.ledger = util.el('div', 'gem-ledger-pane', col);
        V.list = util.el('div', 'se-list', V.x.ledger);
        const rail = util.el('div', 'gem-scrollrail', V.x.ledger);
        const up = util.el('button', 'gem-scroll-arrow', rail, '');
        up.type = 'button';
        up.setAttribute('aria-label', 'Scroll results up');
        const track = util.el('div', 'gem-scroll-track', rail);
        const thumb = util.el('div', 'gem-scroll-thumb', track);
        const down = util.el('button', 'gem-scroll-arrow', rail, '');
        down.type = 'button';
        down.setAttribute('aria-label', 'Scroll results down');
        const paintScroll = () => {
          const range = V.list.scrollHeight - V.list.clientHeight;
          const height = track.clientHeight;
          const size = Math.min(height, Math.max(24, (height * V.list.clientHeight) / Math.max(1, V.list.scrollHeight)));
          thumb.hidden = range <= 0;
          thumb.style.height = size + 'px';
          thumb.style.top = (range > 0 ? (V.list.scrollTop / range) * (height - size) : 0) + 'px';
        };
        V.x.paintScroll = paintScroll;
        V.list.addEventListener('scroll', paintScroll);
        up.addEventListener('click', () => { V.list.scrollTop -= 43; paintScroll(); });
        down.addEventListener('click', () => { V.list.scrollTop += 43; paintScroll(); });
        track.addEventListener('click', (e) => {
          if (e.target !== track) return;
          V.list.scrollTop += (e.clientY < thumb.getBoundingClientRect().top ? -1 : 1) * V.list.clientHeight;
          paintScroll();
        });
        let scrollDrag = null;
        thumb.addEventListener('pointerdown', (e) => {
          scrollDrag = { y: e.clientY, top: V.list.scrollTop };
          thumb.setPointerCapture(e.pointerId);
          e.preventDefault();
        });
        thumb.addEventListener('pointermove', (e) => {
          if (!scrollDrag) return;
          const travel = track.clientHeight - thumb.offsetHeight;
          V.list.scrollTop = scrollDrag.top + ((e.clientY - scrollDrag.y) * (V.list.scrollHeight - V.list.clientHeight)) / Math.max(1, travel);
          paintScroll();
        });
        thumb.addEventListener('pointerup', () => { scrollDrag = null; });
        thumb.addEventListener('pointercancel', () => { scrollDrag = null; });
        V.pager = util.el('div', 'se-pager', col);
        V.visit = util.el('div', 'se-visit', col);
        V.x.previewButtons = document.querySelector('.gem-pbtns');
        V.x.moreInfo = document.querySelector('.gem-more-info');
        if (V.x.previewButtons) {
          V.visit.classList.add('gem-preview-visit');
          V.x.previewButtons.prepend(V.visit);
        }
        V.visit.hidden = true;
        V.pager.style.minHeight = '44px';
      },
      searchHide: (base, S) => (V, m) => {
        V.list.hidden = V.pager.hidden = false;
        V.x.ledger.hidden = false;
        if (V.x.moreInfo) V.x.moreInfo.hidden = !!m.pick;
      },
      searchCard: (base, S) => (V, r, i, res, m, parent = V.list) => {
        const { ctx, util, cardH, titles, commit } = V;
        const fields = S.H.F().resultMeta(V.spec, r);
        const value = (pattern) => {
          const field = fields.find(([label]) => pattern.test(label));
          return field ? field[1] : '—';
        };
        const updated = String(value(/updated|date/i))
          .replace(/January|February|March|April|June|July|August|September|October|November|December/g, (month) => month.slice(0, 3))
          .replace(/\b(\d),/, '0$1,');
        const card = util.el('div', 'se-card', parent);
        card.classList.toggle('gem-selected', i === (m.pick ? m.pick.index : m.page * V.spec.perPage));
        card.style.height = cardH + 'px';
        card.dataset.n = String(i + 1);
        const url = util.el('div', 'se-url', card);
        const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
        fav.style.background = S.H.FAV[S.H.hashStr(r.host) % S.H.FAV.length];
        util.el('span', 'se-host', url, value(/publisher|developer/i));
        util.el('span', 'se-path', url, value(/type|category/i));
        util.el('span', 'gem-result-date', card, updated);
        const title = util.el('a', 'se-title', card);
        util.el('span', 'gem-result-name', title, r.title);
        const symbols = [
          '<rect x="1" y="1" width="22" height="22" rx="2" fill="black"/><path d="M10 5h5v5h-5zM5 15h5v5H5zM15 15h5v5h-5z" fill="white" stroke="none"/>',
          '<path d="M3 16L16 3l5 5L8 21H3zM13 6l5 5M3 16l5 5"/>',
          '<path d="M2 2h20v20H2zM2 9h20M2 16h20M9 2v20M16 2v20"/>',
          '<path d="M2 22h21M4 21V13h3v8M10 21V5h3v16M16 21V1h3v20"/>',
          '<path d="M10 1h4l1 4 3-2 3 3-2 3 4 1v4l-4 1 2 3-3 3-3-2-1 4h-4l-1-4-3 2-3-3 2-3-4-1v-4l4-1-2-3 3-3 3 2z" fill="black"/><circle cx="12" cy="12" r="4" fill="white"/>',
          '<path d="M4 1h11l5 5v17H4zM15 1v6h5M7 11h10M7 15h10M7 19h8"/>',
          '<path d="M1 3h22v19H1z"/><circle cx="7" cy="8" r="2" fill="black"/><path d="M2 21l7-8 5 5 4-6 4 5v4z" fill="black"/>',
          '<path d="M2 2h20v20H2zM2 8h20M2 14h20M2 20h20M8 2v20M14 2v20M20 2v20"/>',
        ];
        const icon = util.el('span', 'gem-row-icon');
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">' + symbols[i % symbols.length] + '</svg>';
        title.prepend(icon);
        title.dataset.role = 'result';
        title.dataset.index = i;
        title.addEventListener('click', () => {
          if (ctx.model.pick) return;
          commit(S.H.F().apply(ctx.model, V.spec, { click: { result: i } }));
        });
        titles[i] = title;
      },
      searchRebuild: (base, S) => (V, m) => {
        S.P.searchReset(V, m);
        V.list.replaceChildren();
        V.pager.replaceChildren();
        V.titles = [];
        V.pages = [];
        S.P.searchHide(V, m);
        V.visit.hidden = !m.pick;
        if (m.pick) S.P.searchVisit(V, m);
        if (m.query === null) {
          S.P.searchEmpty(V, m);
          V.x.paintScroll();
          return;
        }
        const results = S.H.F().resultsFor(V.spec, m.query);
        S.P.searchMeta(V, m, results);
        S.P.searchRows(V, m, results);
        S.P.searchPager(V, m);
        V.x.paintScroll();
      },
      searchPaint: (base, S) => (V, m) => {
        base(V, m);
        const result = m.query === null ? null : S.H.F().resultsFor(V.spec, m.query)[m.pick ? m.pick.index : m.page * V.spec.perPage];
        const fields = result ? S.H.F().resultMeta(V.spec, result) : [];
        const value = (pattern) => {
          const field = fields.find(([label]) => pattern.test(label));
          return field ? field[1] : '—';
        };
        const updated = String(value(/updated|date/i))
          .replace(/January|February|March|April|June|July|August|September|October|November|December/g, (month) => month.slice(0, 3))
          .replace(/\b(\d),/, '0$1,');
        const panel = document.querySelector('.gem-prev');
        if (panel) {
          panel.querySelector('.gem-preview-name').textContent = result ? result.title : 'No selection';
          panel.querySelector('.gem-preview-host').textContent = result ? value(/publisher|developer/i) : 'Search results';
          panel.querySelector('.gem-preview-path').textContent = result ? value(/type|category/i) : '—';
          panel.querySelector('.gem-preview-date').textContent = 'Updated: ' + (result ? updated : '—');
          panel.querySelector('.gem-pdesc').textContent = result ? result.desc : 'Search above to view the matching results.';
        }
      },
    },
  },
});
