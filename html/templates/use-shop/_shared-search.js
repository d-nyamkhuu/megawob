/* use-shop/_shared-search: identical search part implementations shared by store and adapted.
 * Call with the factory scope; each template retains its overridable BASE entries. */
(function () {
  'use strict';
  function searchSide(S) {
    return (V) => {
      const { util, rng, body, main } = V;
      if (body.getBoundingClientRect().width > 1080) {
        const side = util.el('aside', 'se-side', main);
        const b1 = util.el('div', 'se-box2', side);
        util.el('h4', '', b1, 'Related searches');
        const chips = util.el('div', 'se-chips', b1);
        for (const t of rng.sample(
          ['news', 'reviews', 'near me', 'images', 'wiki', 'videos', 'prices', 'today', 'map'],
          5,
        ))
          util.el('span', '', chips, t);
        const b2 = util.el('div', 'se-box2', side);
        util.el('h4', '', b2, 'Search tips');
        util.el('p', '', b2, 'Results are listed a few per page. Use the page numbers below the results to see more.');
      }
    };
  }

  function searchWire(S) {
    return (V) => {
      const { ctx, spec, input, go, commit } = V;
      V.tf = env.ui.textField(input, {
        value: ctx.model.text,
        label: 'search',
        onInput: (v) => commit({ ...ctx.model, text: v }),
      });
      S.H.trackFocus(ctx, input, 'search');
      const doSearch = () => {
        if (!input.value.trim() || ctx.model.pick) return;
        commit(S.H.F().apply({ ...ctx.model, text: input.value }, spec, { click: { button: 'search' } }));
      };
      go.addEventListener('click', doSearch);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSearch();
        }
      });
    };
  }

  function searchHide(S) {
    return (V, m) => {
      V.list.hidden = V.pager.hidden = !!m.pick;
    };
  }

  function searchReset(S) {
    return () => {};
  }

  function searchPaint(S) {
    return (V, m) => {
      if (V.input.value !== m.text) V.tf.set(m.text);
      const key = JSON.stringify([m.query, m.page, m.pick]);
      if (key !== V.shown) {
        V.shown = key;
        S.P.searchRebuild(V, m);
      }
      S.P.paintEnd(V, m);
    };
  }

  function searchLocate(S) {
    return (V, t) => {
      if (t.field) return V.tf.locate();
      if (t.button) return S.H.where(V.go, 'Search button');
      if (t.back) return S.H.where(V.back, 'Back to results');
      if (t.page !== undefined) return S.H.where(V.pages[t.page], `page ${t.page}`);
      if (t.pager) return S.H.where(t.pager === 'prev' ? V.prev : V.next, `pager ${t.pager}`);
      if (t.result !== undefined) return S.H.where(V.titles[t.result], `result ${t.result}`);
      return null;
    };
  }

  function searchCommit(S) {
    return (V) => (m) => {
      V.ctx.update(m);
      V.paint(V.ctx.model);
    };
  }
  env.template('use-shop/_shared-search', () => ({ searchSide, searchWire, searchHide, searchReset, searchPaint, searchLocate, searchCommit }));
})();
