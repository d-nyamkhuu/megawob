/*
 * templates / use-social-feed / feed: the shared widget code of the design-use-social-feed-* sites (taken from the base widget
 * use-social-feed/feed as design-use-social-feed-menu-08 had it). A site's widgets/use-social-feed.js is only its design:
 *
 *   env.widget({ task: 'use-social-feed', site, name: 'design', split, scenarios: ['menu'], traits?: {...},
 *              template: 'use-social-feed/feed', design: { layout: 'plain', labels: true, parts: { ... } } });
 *
 * Scenarios: one, all, some, menu (the task logic's; the widget draws the same app for each). The app: a three-column
 * social app (icon rail with navigation, the timeline, a "Trends" / "Who to follow" sidebar on wide stages). The
 * column's width and alignment are sampled per episode. The timeline is a fixed-height pane whose native scrollbar
 * is hidden; a custom track + thumb beside it scrolls it (drag the thumb, click the track to page, or use the wheel
 * inside the pane). The page itself never scrolls.
 * Each post: avatar, name, @handle · age, a "More" (⋯) button, text (hashtags and mentions highlighted; long texts
 * truncated with "Show more"), an optional photo grid / link card / quoted post, and four toggle buttons (reply,
 * retweet, like, share) showing counts or, on some seeds, text labels. On hover-bar episodes the action row only
 * shows while the pointer is over the post. Timelines: one "Home" list, or "For you" / "Following" tabs
 * (spec.lists). Infinite feeds end with a "Loading more posts" row; the task's tick() appends posts after the row
 * has been seen. The More menu is an overlay outside the scrolling pane, right-aligned under its button and flipped
 * above it when there is no room below; scrolling the pane closes it. Block / report open a confirm dialog. Muted /
 * blocked / hidden / reported posts collapse into a placeholder row with "Undo"; the last pick shows a toast at the
 * bottom of the timeline (with "Undo" for persistent picks). All model changes go through env.taskDef.helpers.act(); the
 * feed DOM is rebuilt when its structure (tab, loaded rows, expanded or collapsed posts) changes, keeping the scroll
 * offset. Mechanics: env.ui.listbox (+ scrollbar) for the timeline, one env.ui.menu() per post. The page frame is
 * the anchor. Widget CSS is the template's (as-* classes, colors from the site's --panel, --line, --accent, --muted,
 * --fg, --bg); a site restyles it in its site.css and may append CSS through the css token.
 *
 * With design {} the defaults reproduce these real sites exactly, including their scenario presets:
 *   menu  design-use-social-feed-menu-08 (the lineage medoid, unchanged three-column reference app).
 *   one   design-use-social-feed-one-02 (the Office ribbon design, local timeline, photograph tiles and detail panel).
 *         All 12 one sites omit rail/sidebar and use photo sheets and column-bounded menus. The inline action
 *         rules, label classes and detail panel are also the common defaults; the site's CSS is ONE_CSS.
 *   all   design-use-social-feed-all-10 (noticeboard avatars, dated post times and a count in the site's frame).
 *   some  design-use-social-feed-some-04 (photo avatars and action/live-list markers for the site's CSS).
 * The all/some sites otherwise mostly retain the reference layout (8 of 12 each). Their small default-only
 * decorations live in preset part wrappers and can be disabled with variantDecor: false; shared mechanics stay
 * in BASE. Other one sites replace css, labels and avatarSheet when their design differs from the default.
 *
 * design tokens (defaults in TOKENS):
 *   variantDecor   false   enable the named all/some default site's decorations (preset: true); false uses BASE
 *   css            ''      CSS text appended after the template's CSS (the design's own rules)
 *   inlineActs     false   true: append the rules that put the action row inline under the post text
 *   siteCssLast    false   true: move the site's site.css <link> after the widget's <style> (site.css wins ties)
 *   layout         'columns'  'columns': rail + timeline column (width and alignment sampled) + sidebar on wide
 *                          stages; 'plain': only the timeline column (the site's frame supplies the rest, and the
 *                          rng draws of the other layout are not made)
 *   title          'Home'  the timeline header's title
 *   nav            null    rail entries [[icon, label, shownIcon?], ...] (default NAV: home, explore, bell,
 *                          mail, bookmark, user); icon is a key of the icon table, 'bell' also draws the
 *                          notification badge; shownIcon draws another icon in its place
 *   navOn          0       index of the highlighted rail entry
 *   icons          {}      { <name>: '<svg inner markup>' } replaces or adds entries of the icon table (viewBox
 *                          0 0 24 24, stroked in currentColor): reply retweet like share more dm copy embed mute
 *                          block report hide home explore bell mail bookmark user logo
 *   labels         null    true / false: action buttons always show text labels / counts (null: sampled per episode)
 *   labelClass     false   true: a labeled action button also gets the class has-label
 *   detail         false   true: paintStart fills the site's task detail panel (.detail-target-author,
 *                          .detail-post-starts-with, .detail-action, .detail-status) from spec.targets[0]
 *   actLabels      {}      { <button>: 'text' } label text of a button where it differs from the task's LABELS
 *   countZero      false   true: a count of 0 is written ("0") instead of left empty
 *   timeFormat     'dot'   'dot' (· 2h), 'plain' (2h) or 'ago' (2h ago): the age next to the handle
 *   avatarSheet    null    file in the site's assets/ folder, a photo sheet (3 columns x 3 rows): avatars are tiles of
 *                          it instead of initials
 *   avatarTiles    6       how many tiles of the sheet are used (author index modulo this)
 *   photoSheet     null    file in the site's assets/ folder: photo grid tiles and link-card images are crops of it
 *   scrollSet      'none'  'none': a rebuilt feed keeps its pixel offset; 'model': the listbox is also set to the
 *                          model's scroll index on every build; 'first': on the first build only
 *   menuBounds     'box'   'box': the More menu stays inside the timeline pane; 'column': inside the column
 *   menuPlace      'show'  'show': the menu is placed when it opens; 'always': also on every sync while open;
 *                          'unchanged': also when a sync found the menu already in the wanted state
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part; the replacement takes the part's arguments
 * and may call base(...) for the default. S: S.D (tokens), S.P (the parts, overrides included), S.ICON (icon
 * table), S.svg, S.initials, S.richText. R is the render state passed to every part: R.ctx, R.util, R.rng, R.spec,
 * R.size, R.F (the task logic), R.page, R.col, R.head, R.box, R.live, R.tabEls ({ foryou, following }), R.labels,
 * R.handles, R.colorOf(handle), R.order (the menu's item order), R.tallLinks, R.fd (the built feed: { feed, track,
 * thumb, rows: Map(post -> el), parts: Map(post -> { main, more, text, showmore, acts, counts, panel, menu, undo }),
 * lbx, sentinel }), R.up(event), R.paint(), R.report(), R.markHover(), R.paintMenus(), and R.x, a bag for a
 * design's own per-render state. A part runs once per episode (or per post); an override that drops an rng draw
 * changes every seed's episode, so keep the draws unless the page is meant to differ. Hooks default to nothing.
 *
 * Utility part: svg(body, cls = '') -> string wraps icon markup in the default stroked SVG element.
 *
 * Render, in order:
 *   style()                      adds the <style> (once per page)
 *   up(R, event)                 applies a model event (default: ctx.update(F.helpers.act(...)))
 *   begin(R)                     hook: render start, before anything is drawn
 *   page(R) -> el                the page frame (samples font size, post padding, photo height)
 *   layout(R) -> col             rail, timeline column and sidebar (token layout); rail(R, slim) -> width,
 *                                logo(R, rail), navItem(R, rail, [icon, label, shownIcon?], i), sidebar(R)
 *   columnMade(R)                hook: the column exists, the header does not
 *   header(R)                    title and tabs: titled(R) hook after the title; liveTab(R, name) -> el for each
 *                                of the "For you" / "Following" tabs of a two-list episode, decorTabs(R) for the
 *                                decorative tabs of a one-list episode; headed(R) hook after the tabs
 *   frame(R)                     timeline box, toast and confirm dialog: boxMade(R) hook after the box; framed(R)
 *                                hook after the dialog
 *   ready(R)                     hook: labels, handles, colors, menu order are sampled
 * Posts (buildPost(R, feed, p, m) -> [row, parts], in order):
 *   goneRow(R, feed, p, m, ci)   the collapsed placeholder row of a muted / blocked / hidden / reported post
 *   postRow(R, feed, p, post, m) the post's article; rowMade(R, row, post, p, m) hook
 *   avatar(R, row, post, p, m) -> el        initials(R) etc.; token avatarSheet
 *   metaText(R, meta, post, p)   name, handle and age spans (age: timeText(R, post) -> string); moreButton(R, meta,
 *                                post, p) -> button
 *   text(R, main, post, p, m, parts, row)   the text with "Show more": body(R, el, text, post, isShort) writes rich text,
 *                                showMore(R, { row, main, tx }, p) -> el
 *   afterText(R, main, post, p, parts, row, m)   hook
 *   media(R, host, post, p)      photo grid / link card / quote in host = mediaHost(R, main, row, post, p, parts);
 *                                photoTile(R, el, post, k, n), linkImage(R, el, post), photoSvg(hue, k, n),
 *                                quote(R, host, post)
 *   afterMedia(R, main, post, p, parts, row, m)  hook
 *   actions(R, main, post, p, parts, row)   the toggle buttons: beforeAct(R, acts, b, p, post, parts) hook before
 *                                each; actIcon(b) -> svg; actLabel(R, btn, b, p, post, parts) the label or count
 *                                inside; actsMade(R, acts, post, p, parts, row) hook after the row
 *   hover(R, row, p)             binds the hover-bar pointer handlers
 *   menu(R, p, post, parts, more, m)   the More menu: menuKeys(R) -> item keys, menuItem(R, panel, k, post) -> el
 *                                (menuItemMade(R, el, k, post) hook right after the element exists),
 *                                placeMenu(R, panel, trigger) (token menuBounds), menuLeft(R, c, t, w) -> px
 *   postDone(R, row, post, p, parts, m)    hook
 * Feed (build(R, m), rebuilt when the structure changes): buildStart(R, m) hook first;
 *   keepOf(R, m) -> px           the scroll offset kept across a rebuild
 *   scrollbar(R) -> { track, thumb, host, pad }   the custom scrollbar (host: the element the listbox uses as track)
 *   feedMade(R, B, m)            hook: feed and scrollbar exist (B = { feed, track, thumb })
 *   rowAdded(R, feed, row, p, m) hook after each post row; sentinel(R, feed, m) -> el the loading / end row
 *   rowsBuilt(R, B, m)           hook: all rows exist (B also has rows, parts, sentinel)
 *   onScroll(R, feed)            native scroll of the pane (default: R.report())
 *   restoreScroll(R, B, m, keep, first)   sets the pane's offset and the listbox (token scrollSet); B.lbx exists
 *   built(R, B, m)               hook: R.fd is set
 * Layout mirrored into the model (report(R)):
 *   inView(R, p, row, box, top0, h) -> bool   row fully shown in the pane; atEnd(R, sentinelBox, top0, h, paneBox)
 *   -> bool; scrollOf(R) -> number the pane's scroll index; layoutOf(R) -> { scroll, view, atEnd, px }
 * Paint (paint(R), redraws everything from the model):
 *   paintStart(R, m) hook; synced(R, m) hook after a rebuild; paintPost(R, p, parts, m) with paintAct(R, p, parts,
 *   b, on) and countText(R, n, b); painted(R, m) hook after the posts; menuSynced(R, parts, want, changed) (token
 *   menuPlace); paintOverlays(R, m) toast and dialog; paintEnd(R, m) hook before report
 * locateExtra(R, t) -> [x, y] | null   hook: extra oracle targets, asked before the standard ones
 * mounted(R)                      hook: render is done
 * render(ctx) is a part too (rewrite everything) and locate(R, t) the whole target lookup.
 */
(function () {
  'use strict';

  env.template('use-social-feed/feed', (design, def) => {
    const { svg, initials, richText, TOKENS, SCENARIOS, ICONS, NAV, assetUrl, AV_COLORS, MENU_ORDERS } = env.templateLib('use-social-feed/_assets');
    const { installChrome, installFrame } = env.templateLib('use-social-feed/_frame');
    const { installPostText, installPostMedia, installPostActions } = env.templateLib('use-social-feed/_posts');
    const { installTimeline } = env.templateLib('use-social-feed/_timeline');
    const { installPaint } = env.templateLib('use-social-feed/_paint');
    let D, P; // tokens and parts, resolved below
    let ICON, NAV_ITEMS, AVATAR_SHEET, PHOTO_SHEET;
    let st = null; // live episode: { locate(t) }
    const BASE = {};
    const S = { get D() { return D; }, get P() { return P; }, get ICON() { return ICON; },
      get NAV_ITEMS() { return NAV_ITEMS; }, get AVATAR_SHEET() { return AVATAR_SHEET; },
      get PHOTO_SHEET() { return PHOTO_SHEET; }, svg, initials, richText };

    installChrome(BASE, S);
    installFrame(BASE, S);
    installPostText(BASE, S);
    installPostMedia(BASE, S);
    installPostActions(BASE, S);
    const { structKey, markHover } = installTimeline(BASE, S);
    const { paintMenus } = installPaint(BASE, S, structKey);

    // ---------------------------------------------------------------- locate

    BASE.locateExtra = () => null;
    BASE.locate = (R, t) => {
      const { util } = R;
      const { fd } = R;
      const pt = (p) => fd.parts.get(p);
      const c = (el) => (el ? util.center(el) : null);
      const extra = P.locateExtra(R, t);
      if (extra) return extra;
      if (t.action) return pt(t.action[0]) && pt(t.action[0]).acts ? c(pt(t.action[0]).acts[t.action[1]]) : null;
      if (t.more !== undefined) return pt(t.more) && pt(t.more).more ? c(pt(t.more).more) : null;
      if (t.item !== undefined) return R.ctx.model.menu === null || !pt(R.ctx.model.menu) ? null : pt(R.ctx.model.menu).menu.locate(t.item);
      if (t.confirm) return c(t.confirm === 'ok' ? R.okB : R.cancelB);
      if (t.undo === 'toast') return c(R.toastUndo);
      if (t.undo !== undefined) return pt(t.undo) ? c(pt(t.undo).undo) : null;
      if (t.showmore !== undefined) return pt(t.showmore) ? c(pt(t.showmore).showmore) : null;
      if (t.tab) return c(R.tabEls[t.tab]);
      if (t.post !== undefined) {
        const p = pt(t.post);
        if (!p || !p.text) return null;
        const r = p.text.getBoundingClientRect();
        return [r.left + Math.min(60, r.width / 3), r.top + Math.min(10, r.height / 2)];
      }
      if (t.feed) {
        const r = fd.feed.getBoundingClientRect();
        return [r.left + r.width * 0.5, r.top + r.height * 0.45];
      }
      if (t.thumb !== undefined) return fd.lbx.locateThumb();
      if (t.scroll !== undefined) return fd.lbx.locateThumbFor(t.scroll);
      return null;
    };
    BASE.mounted = () => {};

    // ---------------------------------------------------------------- render

    BASE.render = (ctx) => {
      const { util, rng, spec, size } = ctx;
      const F = env.taskDef;
      const R = { ctx, util, rng, spec, size, F, x: {}, tabEls: {}, fd: null, builtKey: null };
      R.up = (ev) => P.up(R, ev);
      R.paint = () => P.paint(R);
      R.report = (...a) => P.report(R, ...a);
      R.markHover = () => markHover(R);
      R.paintMenus = () => paintMenus(R);
      P.begin(R);

      R.page = P.page(R);
      R.col = P.layout(R);
      P.columnMade(R);
      P.header(R);
      P.frame(R);
      P.framed(R);

      R.labels = D.labels === null ? rng.bool(0.3) : D.labels;
      R.handles = [...new Set(spec.posts.map((p) => p.handle).concat(spec.posts.filter((p) => p.quote).map((p) => p.quote.handle)))];
      R.colors = rng.shuffle(AV_COLORS);
      R.colorOf = (h) => R.colors[R.handles.indexOf(h) % R.colors.length];
      R.order = rng.pick(MENU_ORDERS);
      R.tallLinks = rng.bool(0.4);
      P.ready(R);

      P.build(R, ctx.model);
      R.paint();

      st = { locate: (t) => P.locate(R, t) };
      P.mounted(R);
      return { anchors: [R.page], sync: () => R.paint() };
    };

    ({ D, P } = env.templateDesign('use-social-feed/feed', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    ICON = { ...ICONS, ...D.icons };
    NAV_ITEMS = D.nav || NAV;
    AVATAR_SHEET = D.avatarSheet && assetUrl(def.site, D.avatarSheet);
    PHOTO_SHEET = D.photoSheet && assetUrl(def.site, D.photoSheet);

    return {
      render(ctx) {
        P.style();
        return P.render(ctx);
      },

      locate(t) {
        const p = st && st.locate(t);
        if (!p) throw new Error(`use-social-feed/feed cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  }, { uses: ['use-social-feed/_assets', 'use-social-feed/_frame', 'use-social-feed/_posts', 'use-social-feed/_timeline', 'use-social-feed/_paint'] });
})();
