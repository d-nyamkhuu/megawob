/* use-social-feed/feed: posts parts; each part remains independently overridable. */
(function () {
  'use strict';

  function installPostText(BASE, S) {
    const { GONE, initials, richText } = env.templateLib('use-social-feed/_assets');
    BASE.goneRow = (R, feed, p, m, ci) => {
      const { util, spec, F } = R;
      const parts = {};
      const [q, item] = m.picks[ci];
      const row = util.el('div', 'as-gone', feed);
      row.dataset.role = 'post';
      util.el('span', '', row, GONE[item](spec.posts[q].handle));
      const u = util.el('button', 'as-undo', row, 'Undo');
      u.type = 'button';
      u.dataset.role = 'undo';
      u.addEventListener('click', () => {
        const i = F.helpers.collapsedBy(spec, R.ctx.model, p);
        if (i >= 0) { R.up({ undo: i }); R.paint(); }
      });
      parts.undo = u;
      return [row, parts];
    };
    BASE.postRow = (R, feed) => {
      const row = R.util.el('article', 'as-post', feed);
      row.dataset.role = 'post';
      return row;
    };
    BASE.rowMade = () => {};
    BASE.avatar = (R, row, post) => {
      const av = R.util.el('div', 'as-av', row, initials(post.name));
      if (S.AVATAR_SHEET) {
        av.textContent = '';
        const tile = R.handles.indexOf(post.handle) % S.D.avatarTiles;
        av.style.backgroundImage = `url(${S.AVATAR_SHEET})`;
        av.style.backgroundSize = '300% 300%';
        av.style.backgroundPosition = `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`;
        av.title = post.name;
      } else av.style.background = R.colorOf(post.handle);
      return av;
    };
    // Age text next to the handle.
    BASE.timeText = (R, post) => (S.D.timeFormat === 'plain' ? post.time : S.D.timeFormat === 'ago' ? `${post.time} ago` : `· ${post.time}`);
    // Name, handle and age of a post (or of a quoted post).
    BASE.metaText = (R, meta, post) => {
      const { util } = R;
      util.el('span', 'as-name', meta, post.name);
      util.el('span', 'as-handle', meta, post.handle);
      util.el('span', 'as-time', meta, S.P.timeText(R, post));
    };
    BASE.moreButton = (R, meta) => {
      const more = R.util.el('button', 'as-more', meta);
      more.type = 'button';
      more.title = 'More';
      more.setAttribute('aria-label', 'More');
      more.dataset.role = 'more';
      more.innerHTML = S.P.svg(S.ICON.more);
      return more;
    };
    // The post's text; a long text is cut to post.short with a "Show more" link.
    BASE.text = (R, main, post, p, m, parts, row) => {
      const { util } = R;
      const tx = util.el('div', 'as-text', main);
      parts.text = tx;
      if (post.short && !m.expanded.includes(p)) {
        S.P.body(R, tx, post.short, post, true);
        const sm = S.P.showMore(R, { row, main, tx }, p);
        parts.showmore = sm;
      } else S.P.body(R, tx, post.text, post, false);
    };
    BASE.body = (R, tx, text, post, short) => richText(R.util, tx, text);
    BASE.showMore = (R, hosts, p) => {
      const sm = R.util.el('span', 'as-showmore', hosts.tx, 'Show more');
      sm.dataset.role = 'showmore';
      sm.addEventListener('click', () => { R.up({ expand: p }); R.paint(); });
      return sm;
    };
    BASE.afterText = () => {};
    // Where the photos, link card and quote go (default: the post's main column).
  }

  function installPostMedia(BASE, S) {
    const { initials } = env.templateLib('use-social-feed/_assets');
    BASE.mediaHost = (R, main) => main;
    BASE.media = (R, host, post, p) => {
      const { util } = R;
      if (post.media && post.media.kind === 'photo') {
        const g = util.el('div', 'as-photos', host);
        const n = post.media.n;
        g.style.gridTemplateColumns = n === 1 ? '1fr' : '1fr 1fr';
        g.style.gridTemplateRows = n > 2 ? '1fr 1fr' : '1fr';
        for (let k = 0; k < n; k++) {
          const ph = util.el('div', 'as-photo', g);
          if (n === 3 && k === 0) ph.style.gridRow = 'span 2';
          S.P.photoTile(R, ph, post, k, n, p);
          ph.title = post.media.alt;
          if (k === 0) util.el('span', 'as-alt', ph, 'ALT');
        }
      } else if (post.media && post.media.kind === 'link') {
        const c = util.el('div', 'as-link' + (R.tallLinks ? ' tall' : ''), host);
        S.P.linkImage(R, util.el('div', 'as-link-img', c), post, p);
        const t = util.el('div', 'as-link-t', c);
        util.el('small', '', t, post.media.domain);
        util.el('b', '', t, post.media.title);
      }
      if (post.quote) S.P.quote(R, host, post, p);
    };
    BASE.photoTile = (R, ph, post, k, n) => {
      if (S.PHOTO_SHEET) {
        ph.style.backgroundImage = `url(${S.PHOTO_SHEET})`;
        ph.style.backgroundSize = '300% auto';
        ph.style.backgroundPosition = (k % 2 ? '100%' : '0%') + ' 50%';
      } else ph.innerHTML = S.P.photoSvg(post.media.hue, k, n);
    };
    BASE.linkImage = (R, el, post) => {
      if (S.PHOTO_SHEET) {
        el.style.backgroundImage = `url(${S.PHOTO_SHEET})`;
        el.style.backgroundSize = '300% auto';
        el.style.backgroundPosition = '0% 50%';
      } else el.innerHTML = S.P.photoSvg(post.media.hue, 1);
    };
    BASE.photoSvg = (hue, k) => {
      const h2 = (hue + 35 + k * 20) % 360;
      return `<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g${hue}${k}" x1="0" y1="0" x2="0" y2="1">`
        + `<stop offset="0" stop-color="hsl(${hue},55%,72%)"/><stop offset="1" stop-color="hsl(${h2},45%,48%)"/></linearGradient></defs>`
        + `<rect width="100" height="60" fill="url(#g${hue}${k})"/><circle cx="${72 - k * 9}" cy="18" r="7" fill="hsl(${(hue + 180) % 360},70%,88%)" opacity=".85"/>`
        + `<path d="M0 60 L${22 + k * 6} ${30 - k * 2} L${44 + k * 3} 46 L${64 - k * 4} 26 L100 54 V60Z" fill="hsl(${h2},35%,30%)" opacity=".75"/></svg>`;
    };
    BASE.quote = (R, host, post) => {
      const { util } = R;
      const qc = util.el('div', 'as-quote', host);
      const qm = util.el('div', 'as-meta', qc);
      const qa = util.el('div', 'as-av', qm, initials(post.quote.name));
      qa.style.background = R.colorOf(post.quote.handle);
      util.el('span', 'as-name', qm, post.quote.name);
      util.el('span', 'as-handle', qm, post.quote.handle);
      S.P.body(R, util.el('div', 'as-text', qc), post.quote.text);
    };
    BASE.afterMedia = () => {};
    // The four toggle buttons.
  }

  function installPostActions(BASE, S) {
    BASE.actions = (R, main, post, p, parts, row) => {
      const { util, F } = R;
      const acts = util.el('div', 'as-acts', main);
      parts.acts = {};
      parts.counts = {};
      for (const b of F.helpers.BUTTONS) {
        S.P.beforeAct(R, acts, b, p, post, parts);
        const btn = util.el('button', `as-act ${b}`, acts);
        btn.type = 'button';
        btn.title = F.helpers.LABELS[b];
        btn.setAttribute('aria-label', F.helpers.LABELS[b]);
        btn.dataset.role = b;
        btn.innerHTML = S.P.actIcon(b);
        S.P.actLabel(R, btn, b, p, post, parts);
        const key = F.helpers.keyOf(p, b);
        btn.addEventListener('click', () => { R.up({ toggle: key }); R.paint(); });
        parts.acts[b] = btn;
      }
      S.P.actsMade(R, acts, post, p, parts, row);
      return acts;
    };
    BASE.beforeAct = () => {};
    BASE.actIcon = (b) => S.P.svg(S.ICON[b]);
    // Text or count inside a toggle button: a text label on some seeds, else the count.
    BASE.actLabel = (R, btn, b, p, post, parts) => {
      if (R.labels) {
        if (S.D.labelClass) btn.classList.add('has-label');
        R.util.el('span', '', btn, S.D.actLabels[b] || R.F.helpers.LABELS[b]);
      } else if (b !== 'share') parts.counts[b] = R.util.el('span', '', btn);
    };
    BASE.actsMade = () => {};
    BASE.hover = (R, row, p) => {
      row.addEventListener('pointerenter', () => { if (R.ctx.model.hover !== p) R.up({ hover: p }); R.markHover(); });
      row.addEventListener('pointerleave', () => { if (R.ctx.model.hover === p) R.up({ hover: null }); R.markHover(); });
    };
    // The More menu is an overlay of the column (outside the scrolling pane).
    BASE.menuKeys = (R) => R.order;
    BASE.menuItem = (R, panel, k, post) => {
      const el = R.util.el('div', 'as-mi' + (k === 'report' || k === 'block' ? ' warn' : ''), panel);
      S.P.menuItemMade(R, el, k, post);
      el.dataset.role = 'menuitem';
      el.innerHTML = S.P.svg(S.ICON[k]);
      R.util.el('span', '', el, R.F.helpers.menuLabel(k, post.handle));
      return el;
    };
    BASE.menuItemMade = () => {};
    BASE.menu = (R, p, post, parts, more, m) => {
      const { util } = R;
      const panel = util.el('div', 'as-menu', R.col);
      panel.dataset.role = 'menu';
      panel.hidden = true;
      const items = S.P.menuKeys(R).map((k) => ({ key: k, el: S.P.menuItem(R, panel, k, post) }));
      parts.panel = panel;
      parts.menu = env.ui.menu(more, {
        root: panel,
        items,
        value: m.menu === p ? [] : null,
        open: 'click',
        keyboard: true,
        label: `menu${p}`,
        show(el, visible) {
          el.hidden = !visible;
          if (visible) S.P.placeMenu(R, el, more);
        },
        onChange(path) {
          if (path === null) { if (R.ctx.model.menu === p) R.up({ more: null }); } else if (R.ctx.model.menu !== p) R.up({ more: p });
          R.paintMenus();
        },
        onSelect(key) { R.up({ item: [p, key] }); R.paint(); },
      });
    };
    BASE.postDone = () => {};
    // Left edge of the menu panel in column px: c = column box, t = trigger box, w = panel width.
    BASE.menuLeft = (R, c, t, w) => Math.round(Math.max(8, t.right - c.left - w + 4));
    BASE.placeMenu = (R, panel, trigger) => {
      const c = R.col.getBoundingClientRect();
      const t = trigger.getBoundingClientRect();
      const b = R.box.getBoundingClientRect();
      const w = panel.offsetWidth;
      const h = panel.offsetHeight;
      panel.style.left = S.P.menuLeft(R, c, t, w) + 'px';
      const below = t.bottom + 4;
      let top;
      if (S.D.menuBounds === 'column') {
        const bottom = Math.min(b.bottom, c.bottom);
        top = below + h <= bottom - 4 ? below : Math.max(c.top + 4, Math.min(t.top - 4 - h, bottom - h - 4));
      } else top = below + h <= b.bottom - 4 ? below : Math.max(b.top + 4, t.top - 4 - h);
      panel.style.top = Math.round(top - c.top) + 'px';
    };

    BASE.buildPost = (R, feed, p, m) => {
      const { util, spec, F } = R;
      const post = spec.posts[p];
      const ci = F.helpers.collapsedBy(spec, m, p);
      if (ci >= 0) return S.P.goneRow(R, feed, p, m, ci);
      const parts = {};
      const row = S.P.postRow(R, feed, p, post, m);
      S.P.rowMade(R, row, post, p, m);
      S.P.avatar(R, row, post, p, m);
      const main = util.el('div', 'as-main', row);
      parts.main = main;
      const meta = util.el('div', 'as-meta', main);
      S.P.metaText(R, meta, post, p);
      const more = S.P.moreButton(R, meta, post, p);
      parts.more = more;
      S.P.text(R, main, post, p, m, parts, row);
      S.P.afterText(R, main, post, p, parts, row, m);
      S.P.media(R, S.P.mediaHost(R, main, row, post, p, parts), post, p);
      S.P.afterMedia(R, main, post, p, parts, row, m);
      S.P.actions(R, main, post, p, parts, row);
      S.P.hover(R, row, p);
      S.P.menu(R, p, post, parts, more, m);
      S.P.postDone(R, row, post, p, parts, m);
      return [row, parts];
    };

  }

  env.template('use-social-feed/_posts', () => ({ installPostText, installPostMedia, installPostActions }), { uses: ['use-social-feed/_assets'] });
})();
