/* use-social-feed/feed: frame parts; each part remains independently overridable. */
(function () {
  'use strict';

  function installChrome(BASE, S) {
    const { CSS, INLINE_ACTS, svg, TRENDS, TREND_CATS, AV_COLORS } = env.templateLib('use-social-feed/_assets');
    BASE.style = () => {
      if (document.getElementById('as-style')) return;
      const s = document.createElement('style');
      s.id = 'as-style';
      s.textContent = CSS + S.D.css + (S.D.inlineActs ? INLINE_ACTS : '');
      document.head.append(s);
      if (S.D.siteCssLast) {
        const local = document.querySelector('link[href$="site.css"]');
        if (local) document.head.append(local);
      }
    };
    BASE.svg = svg;
    BASE.up = (R, ev) => R.ctx.update(R.F.helpers.act(R.ctx.model, R.spec, ev));
    BASE.begin = () => {};
    BASE.page = (R) => {
      const { util, rng } = R;
      const page = util.el('div', 'as-page', R.ctx.stage);
      page.style.setProperty('--as-fs', rng.pick(['15px', '15px', '14.5px']));
      page.style.setProperty('--as-pad', rng.int(10, 14) + 'px');
      page.style.setProperty('--as-ph', rng.int(118, 150) + 'px');
      return page;
    };
    BASE.layout = (R) => {
      const { util, rng, size } = R;
      if (S.D.layout === 'plain') return util.el('section', 'as-col', R.page);
      const wide = size.width >= 1180;
      const railW = S.P.rail(R, !wide);
      const col = util.el('section', 'as-col', R.page);
      const sideW = wide ? 312 : 0;
      const room = Math.floor(size.width - 32 - railW - sideW);
      col.style.width = Math.min(room, rng.int(540, 640)) + 'px';
      R.page.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      if (wide) S.P.sidebar(R);
      return col;
    };
    BASE.rail = (R, slim) => {
      const { util } = R;
      const r = util.el('nav', 'as-rail' + (slim ? ' slim' : ''), R.page);
      S.P.logo(R, r);
      S.NAV_ITEMS.forEach((entry, i) => S.P.navItem(R, r, entry, i));
      util.el('span', '', util.el('div', 'as-postbtn', r), 'Post');
      return slim ? 78 : 230;
    };
    BASE.logo = (R, r) => {
      R.util.el('div', 'as-logo', r).innerHTML = S.P.svg(S.ICON.logo);
    };
    BASE.navItem = (R, r, [ic, label, shown], i) => {
      const { util, rng } = R;
      const d = util.el('div', 'as-nav' + (i === S.D.navOn ? ' on' : ''), r);
      const wrap = util.el('i', '', d);
      wrap.innerHTML = S.P.svg(S.ICON[shown || ic]);
      if (ic === 'bell' && rng.bool(0.7)) util.el('b', 'badge', wrap, String(rng.int(1, 12)));
      util.el('span', '', d, label);
    };
    BASE.sidebar = (R) => {
      const { util, rng } = R;
      const { content } = R.ctx;
      const side = util.el('aside', 'as-side', R.page);
      const s = util.el('div', 'as-search', side);
      s.innerHTML = S.P.svg(S.ICON.explore) + '<span>Search</span>';
      const tr = util.el('div', 'as-card', side);
      util.el('h4', '', tr, 'Trends for you');
      for (const t of rng.sample(TRENDS, 4)) {
        const d = util.el('div', 'as-trend', tr);
        util.el('small', '', d, rng.pick(TREND_CATS));
        util.el('b', '', d, t);
        util.el('small', '', d, `${(rng.int(12, 980) / 10).toFixed(1)}K posts`);
      }
      const who = util.el('div', 'as-card', side);
      util.el('h4', '', who, 'Who to follow');
      for (let i = 0; i < 3; i++) {
        const p = content.personName ? content.personName(rng) : { first: 'Mara', last: 'Lind', full: 'Mara Lind' };
        const d = util.el('div', 'as-who', who);
        const av = util.el('div', 'as-av', d, p.first[0]);
        av.style.background = rng.pick(AV_COLORS);
        const t = util.el('div', 'as-who-t', d);
        util.el('b', '', t, p.full);
        util.el('span', '', t, '@' + (content.ascii ? content.ascii(p.first) : p.first).toLowerCase() + rng.int(1, 99));
        util.el('div', 'as-follow', d, 'Follow');
      }
    };
    BASE.columnMade = () => {};

  }

  function installFrame(BASE, S) {
    const { TAB_NAMES } = env.templateLib('use-social-feed/_assets');
    // ---------------------------------------------------------------- header: title + tabs

    BASE.header = (R) => {
      const { util, rng, spec } = R;
      const lists = Object.keys(spec.lists);
      R.live = lists.length > 1;
      R.head = util.el('div', 'as-head' + (R.live && rng.bool(0.5) ? ' split' : ''), R.col);
      util.el('b', '', R.head, S.D.title);
      S.P.titled(R);
      if (R.live) {
        for (const k of rng.bool(0.7) ? ['foryou', 'following'] : ['following', 'foryou']) R.tabEls[k] = S.P.liveTab(R, k);
      } else S.P.decorTabs(R);
      S.P.headed(R);
    };
    BASE.titled = () => {};
    BASE.liveTab = (R, k) => {
      const t = R.util.el('div', 'as-tab live', R.head, TAB_NAMES[k]);
      t.dataset.role = 'tab';
      t.addEventListener('click', () => { if (R.ctx.model.tab !== k) { R.up({ tab: k }); R.paint(); } });
      return t;
    };
    // Decorative tabs of a single timeline.
    BASE.decorTabs = (R) => {
      const { util, rng } = R;
      const following = rng.bool(0.4);
      util.el('div', 'as-tab' + (following ? '' : ' on'), R.head, 'For you');
      util.el('div', 'as-tab' + (following ? ' on' : ''), R.head, 'Following');
    };
    BASE.headed = () => {};

    // ---------------------------------------------------------------- timeline frame, toast, confirm dialog

    BASE.frame = (R) => {
      const { util, rng } = R;
      const { col } = R;
      R.box = util.el('div', 'as-box', col);
      S.P.boxMade(R);
      R.toast = util.el('div', 'as-toast', col);
      R.toastT = util.el('span', '', R.toast);
      R.toastUndo = util.el('button', '', R.toast, 'Undo');
      R.toastUndo.type = 'button';
      R.toastUndo.dataset.role = 'undo';
      R.toastUndo.addEventListener('click', () => {
        const n = R.ctx.model.picks.length;
        if (n && R.F.helpers.PERSISTENT.includes(R.ctx.model.picks[n - 1][1])) { R.up({ undo: n - 1 }); R.paint(); }
      });

      // ---- confirm dialog
      R.scrim = util.el('div', 'as-scrim', col);
      R.scrim.hidden = true;
      const dlg = util.el('div', 'as-confirm', R.scrim);
      dlg.dataset.role = 'dialog';
      R.dlgH = util.el('h3', '', dlg);
      R.dlgP = util.el('p', '', dlg);
      R.okB = util.el('button', 'danger', null);
      R.cancelB = util.el('button', '', null, 'Cancel');
      R.okB.type = 'button';
      R.cancelB.type = 'button';
      if (rng.bool(0.75)) dlg.append(R.okB, R.cancelB);
      else dlg.append(R.cancelB, R.okB);
      R.okB.addEventListener('click', () => { R.up({ confirm: true }); R.paint(); });
      R.cancelB.addEventListener('click', () => { R.up({ cancel: true }); R.paint(); });
    };
    BASE.boxMade = () => {};
    BASE.framed = () => {};
    BASE.ready = () => {};

  }

  env.template('use-social-feed/_frame', () => ({ installChrome, installFrame }), { uses: ['use-social-feed/_assets'] });
})();
