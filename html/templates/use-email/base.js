// use-email/base: the base site's use-email widgets (mail, ads, classic) as a template. This file is their
// source. The design-* sites that started from a copy of them, and the composite sites that embed them, are designs on
// it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/use-email.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/use-email.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
// Focused layout hooks (default behavior is the reference mail/ads/classic):
// mailGeometry(ctx, ads), classicGeometry(ctx): dimensions and original layout RNG draws, returned as named fields;
// wrap mailGeometry to change its result. CLASSIC_SIZES: the classic client's widest window and row heights.
// mailTopActions(ctx, {app, topEl, composeInSide, newBtn, on, button, reg}) -> state: top controls (default null).
// mailPaintTop(ctx, state, model): update those controls (none). reg.fixed may register their plan targets.
// mailSidebar(ctx, side) -> state; mailPaintSidebar(ctx, state, model): sidebar decorations (default none/null).
// mailListHeading(ctx, lb): content before the list (none); mailTime(email): row timestamp (email.time).
// mailBlank(): empty-reader text; mailShowBack(stack): whether to draw Back (stack).
// mailSized(ctx, listbox): after CSS row sizing, before model layout sync (none).
// classicListPaint(ctx, {app, lbox}, state, model) -> state; classicListMounted(ctx, {app, lbox}) -> state:
// optional cloned list decoration, before reader paint / after initial paint (identity / null).
// The renderer, event handling and pure locate stay shared; designs override only these focused differences.
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  function reference(site, __parts) {
    const captured = [];
    let scopeNow = null;
    const __has = (key) => { UNITS.add(key); return key in __parts; };
    const env = new Proxy(window.env, {
      get: (t, k) => (k === 'widget' ? (d) => {
        for (const key of Object.keys(__parts)) {
          const dot = key.indexOf('.');
          if (!key.startsWith('stmt') && !key.startsWith('+') && dot > 0 && key.slice(0, dot) === d.name) d[key.slice(dot + 1)] = __parts[key](d[key.slice(dot + 1)], scopeNow);
        }
        captured.push(d);
      } : Reflect.get(t, k)),
    });
    const scriptOf = { src: new URL(`sites/${site}/widgets/use-email.js`, HTML).href };
    /*
     * reference / use-email / mail: a web mail client sized from ctx.size and placed at a sampled position
     * (width share, left / center / right, top / middle). Every interaction goes through
     * env.taskDef.helpers.act(model, spec, action), so the widget and the oracle share one state machine.
     *   top bar       brand, "Compose" button, a working search box (filters the list as you type; x clears),
     *                 avatar
     *   sidebar       folders: Inbox, Starred, Important, (Sent, Drafts: decorative), Archive, Trash and the
     *                 custom folders; clicking one shows it (counts follow the model). Narrow apps get an icon
     *                 rail (letter badges for custom folders, names as tooltips).
     *   list          header: select-all checkbox, folder title and "1-6 of 23"; while rows are ticked it turns
     *                 into the bulk toolbar (Archive, Delete, Mark read, Mark unread, Star). spec.rows rows of
     *                 equal height are visible (tall: three lines; medium: two; compact: one line); each row has
     *                 a checkbox (Shift-click ticks a range), star and important toggles, sender (bold while
     *                 unread), a paperclip + type badge for attachments, time, subject, snippet and archive /
     *                 delete icons (hover-revealed in some episodes). Long lists scroll inside the list
     *                 (native overflow, so the wheel works; a custom track + thumb drags it).
     *   message view  toolbar from taskDef.helpers.toolbarOps (Archive, Delete or Restore / Move to Inbox, Move to
     *                 (popup of custom folders), Mark unread, Star, Important; labels when wide, icons with
     *                 tooltips when narrow), subject, sender with address, "to me" and Cc, attachment chips,
     *                 the body (scrolls in its pane), notes for sent replies, Reply / Reply all / Forward.
     *   compose       To, Cc, Subject (editable for a new message), body, Send and Discard.
     *   layouts       split (list beside the message) or stack (list-then-detail, a back arrow returns to the
     *                 list), chosen from the width (and 20% of wide episodes); the choice and the row height
     *                 are mirrored into the model (stack, rowPx) for the oracle.
     *   dialogs       delete confirmation (spec.confirm) over the app; the Undo toast lives in the status bar
     *                 at the bottom, so it never covers anything.
     * The app frame is the only anchor.
     * Widgets (one state machine, taskDef.helpers.act; every one supports every scenario, undo included)
     *   mail     the client above. A Spam folder appears in the sidebar when spec.spam (toolbar: Not spam / Report spam).
     *   ads      the same client with inert ad slots (clicks do nothing): a banner under the top bar (not on stages
     *            under 560 px tall), 1-2 sponsored rows
     *            pinned above the list (not list rows, they never scroll or open), a column of ad cards right of the
     *            message on wide frames, Compose heading the sidebar. The list is wider, rows sometimes compact.
     *   classic  an Outlook-2003-like client with three panes: folder tree (Inbox, Drafts, Sent Items, Archive, Junk
     *            E-mail, Deleted Items, custom folders, Search Folders) | dense table list (flag, read icon, clip, From,
     *            Subject, Received) over the reading pane (header block with From / To / Cc / Files, body; the compose
     *            form takes the pane), title bar and decorative menu bar (search box on the right), a toolbar of
     *            labelled actions (New, Reply, Reply to All, Forward, Delete, Archive, Move to + folder popup, Junk,
     *            Restore / Move to Inbox / Not Junk, Unread, Read, Flag, Important) that acts on the ticked rows or else
     *            the open message and is dimmed when not applicable, a status bar with the Undo toast, a Yes / No delete
     *            dialog. A plain row click selects (and reads) one row, Ctrl-click / Shift-click add rows; the flag column
     *            is the only row icon; the Delete key trashes the open message. Declares traits { rowIcons: ['star'],
     *            select: 'modifier', keys: true }; plan targets { check } (Ctrl-click on the row) and { bulk } (toolbar).
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get sentText() { return sentText; },
        get CSS() { return CSS; },
        get svg() { return svg; },
        get I() { return I; },
        get AV() { return AV; },
        get BRANDS() { return BRANDS; },
        get GROUP_BADGE() { return GROUP_BADGE; },
        get hashColor() { return hashColor; },
        get initials() { return initials; },
        get ADS() { return ADS; },
        get ALL() { return ALL; },
        get view() { return view; }, set view(v) { view = v; },
        get listening() { return listening; }, set listening(v) { listening = v; },
        get ensureStyle() { return ensureStyle; },
        get buildBanner() { return buildBanner; },
        get buildSponsored() { return buildSponsored; },
        get buildAdColumn() { return buildAdColumn; },
        get build() { return build; },
        get buildClassic() { return buildClassic; },
        get mailGeometry() { return mailGeometry; },
        get classicGeometry() { return classicGeometry; },
        get CLASSIC_SIZES() { return CLASSIC_SIZES; },
        get mailTopActions() { return mailTopActions; },
        get mailPaintTop() { return mailPaintTop; },
        get mailSidebar() { return mailSidebar; },
        get mailPaintSidebar() { return mailPaintSidebar; },
        get mailListHeading() { return mailListHeading; },
        get mailTime() { return mailTime; },
        get mailBlank() { return mailBlank; },
        get mailShowBack() { return mailShowBack; },
        get mailSized() { return mailSized; },
        get classicListPaint() { return classicListPaint; },
        get classicListMounted() { return classicListMounted; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('buildBanner')) buildBanner = __parts['buildBanner'](buildBanner, __scope);
      if (__has('buildSponsored')) buildSponsored = __parts['buildSponsored'](buildSponsored, __scope);
      if (__has('buildAdColumn')) buildAdColumn = __parts['buildAdColumn'](buildAdColumn, __scope);
      if (__has('build')) build = __parts['build'](build, __scope);
      if (__has('buildClassic')) buildClassic = __parts['buildClassic'](buildClassic, __scope);
      if (__has('mailGeometry')) mailGeometry = __parts['mailGeometry'](mailGeometry, __scope);
      if (__has('classicGeometry')) classicGeometry = __parts['classicGeometry'](classicGeometry, __scope);
      if (__has('mailTopActions')) mailTopActions = __parts['mailTopActions'](mailTopActions, __scope);
      if (__has('mailPaintTop')) mailPaintTop = __parts['mailPaintTop'](mailPaintTop, __scope);
      if (__has('mailSidebar')) mailSidebar = __parts['mailSidebar'](mailSidebar, __scope);
      if (__has('mailPaintSidebar')) mailPaintSidebar = __parts['mailPaintSidebar'](mailPaintSidebar, __scope);
      if (__has('mailListHeading')) mailListHeading = __parts['mailListHeading'](mailListHeading, __scope);
      if (__has('mailTime')) mailTime = __parts['mailTime'](mailTime, __scope);
      if (__has('mailBlank')) mailBlank = __parts['mailBlank'](mailBlank, __scope);
      if (__has('mailShowBack')) mailShowBack = __parts['mailShowBack'](mailShowBack, __scope);
      if (__has('mailSized')) mailSized = __parts['mailSized'](mailSized, __scope);
      if (__has('classicListPaint')) classicListPaint = __parts['classicListPaint'](classicListPaint, __scope);
      if (__has('classicListMounted')) classicListMounted = __parts['classicListMounted'](classicListMounted, __scope);

      // The status-bar text of a sent message: a new message names its recipient and subject.
      const sentText = __has('sentText') ? __parts['sentText'](undefined, __scope) : { sentText: (t) => (t.msg && t.msg.mode === 'new'
        ? `Message sent to ${String(t.msg.to || '').trim() || '(no recipient)'}: “${String(t.msg.subject || '').trim()}”.` : 'Message sent.') }.sentText;

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('use-email/_base-style').CSS);

      const svg = __has('svg') ? __parts['svg'](undefined, __scope) : { svg: (body, extra = '') => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>` }.svg;
      const I = __has('I') ? __parts['I'](undefined, __scope) : ({
        logo: svg('<rect x="2" y="4" width="16" height="12" rx="2.2"/><path d="M2.6 5l7.4 6 7.4-6"/>'),
        search: svg('<circle cx="8.6" cy="8.6" r="5.2"/><path d="M12.6 12.6l4.4 4.4"/>'),
        pen: svg('<path d="M13.5 3.5l3 3L7 16H4v-3z"/><path d="M11.5 5.5l3 3"/>'),
        inbox: svg('<path d="M2.5 11.5l2.2-6.6a1.2 1.2 0 0 1 1.1-.8h8.4a1.2 1.2 0 0 1 1.1.8l2.2 6.6v4.3a.9.9 0 0 1-.9.9H3.4a.9.9 0 0 1-.9-.9z"/><path d="M2.6 11.5h4.3l1.2 2h3.8l1.2-2h4.3"/>'),
        star: svg('<path d="M10 2.6l2.25 4.7 5.15.65-3.78 3.55.97 5.1L10 14.1l-4.6 2.5.98-5.1L2.6 7.95l5.15-.65z"/>'),
        imp: svg('<path d="M3 5.2h10.2l4 4.8-4 4.8H3l3.4-4.8z"/>'),
        sent: svg('<path d="M17.5 2.5L8.6 11.4M17.5 2.5l-5.6 15-3.3-6.1-6.1-3.3z"/>'),
        draft: svg('<path d="M4.5 2.5h7.5l3.5 3.5v11.5h-11z"/><path d="M11.8 2.6V6.2h3.6M7 10h6M7 13h4.5"/>'),
        archive: svg('<rect x="2.5" y="3.5" width="15" height="4" rx="1"/><path d="M3.8 7.5v8.2a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1V7.5M8 11h4"/>'),
        trash: svg('<path d="M3.6 5.6h12.8M8 5.6V3.6h4v2M5.2 5.6l.9 11h7.8l.9-11M8.3 8.6v5.2M11.7 8.6v5.2"/>'),
        folder: svg('<path d="M2.5 5.5a1 1 0 0 1 1-1h4l1.6 1.8h7.4a1 1 0 0 1 1 1v8.2a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/>'),
        moveTo: svg('<path d="M2.5 5.5a1 1 0 0 1 1-1h4l1.6 1.8h7.4a1 1 0 0 1 1 1v8.2a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M8 11.5h5M11 9.5l2 2-2 2"/>'),
        restore: svg('<path d="M4 9.5a6 6 0 1 1 1.8 4.3"/><path d="M3.6 5.2v4.5h4.5"/>'),
        unread: svg('<rect x="2.5" y="4.5" width="15" height="11" rx="1.8"/><path d="M3 5.5l7 5.5 7-5.5"/><circle cx="16" cy="4.5" r="2.4" fill="currentColor" stroke="none"/>'),
        read: svg('<path d="M2.5 8.5l7.5-5 7.5 5v7.3a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M3 9l7 5 7-5"/>'),
        reply: svg('<path d="M8 4.5L3 9.5l5 5"/><path d="M3.4 9.5h8.1c3 0 5 2 5 5.3v.7"/>'),
        replyAll: svg('<path d="M10 4.5l-5 5 5 5"/><path d="M6 4.5l-5 5 5 5"/><path d="M5.4 9.5h6.1c3 0 5 2 5 5.3v.7"/>'),
        forward: svg('<path d="M12 4.5l5 5-5 5"/><path d="M16.6 9.5H8.5c-3 0-5 2-5 5.3v.7"/>'),
        back: svg('<path d="M12.5 4l-6 6 6 6"/>'),
        check: svg('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
        clip: svg('<path d="M14.5 9.5l-5.3 5.3a3.2 3.2 0 0 1-4.5-4.5l6-6a2.1 2.1 0 0 1 3 3l-5.8 5.8a1 1 0 0 1-1.5-1.5l5-5"/>'),
        file: svg('<path d="M5 2.5h6.5l3.5 3.5v11.5H5z"/><path d="M11.3 2.6V6.2h3.6"/>'),
        image: svg('<rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><circle cx="7" cy="8" r="1.5"/><path d="M3 15l4.5-4.5 3 3 2.5-2.5 4 4"/>'),
        spam: svg('<path d="M10 2.5l7 3v5c0 3.6-2.7 6.2-7 7.5-4.3-1.3-7-3.9-7-7.5v-5z"/><path d="M10 7v4M10 13.2v.3"/>'),
      });
      const AV = __has('AV') ? __parts['AV'](undefined, __scope) : (['#e8590c', '#2b8a3e', '#1971c2', '#9c36b5', '#c2255c', '#0c8599', '#5f3dc4', '#a61e4d', '#2f9e44', '#e67700']);
      const BRANDS = __has('BRANDS') ? __parts['BRANDS'](undefined, __scope) : (['Mailbox', 'Postal', 'Inkwell', 'Swiftmail', 'Letterbox', 'Courier', 'Quillpost', 'Pinemail', 'Harbor Mail', 'Nimbus']);
      const GROUP_BADGE = __has('GROUP_BADGE') ? __parts['GROUP_BADGE'](undefined, __scope) : ({ pdf: 'PDF', doc: 'DOC', sheet: 'XLS', slides: 'PPT', image: 'IMG', zip: 'ZIP', video: 'MP4', audio: 'M4A' });
      const hashColor = __has('hashColor') ? __parts['hashColor'](undefined, __scope) : { hashColor: (name) => {
        let h = 0;
        for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        return AV[h % AV.length];
      } }.hashColor;
      const initials = __has('initials') ? __parts['initials'](undefined, __scope) : { initials: (name) => name.split(/\s+/).map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase() }.initials;

      function ensureStyle() {
        if (document.getElementById('am-style')) return;
        const s = document.createElement('style');
        s.id = 'am-style';
        s.textContent = CSS;
        document.head.append(s);
      }


      // ---- ads widget: inert sponsored content (clicks do nothing; the mail model is never touched)
      const ADS = __has('ADS') ? __parts['ADS'](undefined, __scope) : ([
        { brand: 'Vaultline VPN', art: 'V', color: '#1c7ed6', head: 'Browse privately, from $2.49 a month', body: 'Two months free on a yearly plan. Works on every device you own.', cta: 'Get deal' },
        { brand: 'Pinecrest Bank', art: 'P', color: '#2b8a3e', head: 'A savings account that pays 4.1% APY', body: 'No fees and no minimum balance. Open it in five minutes.', cta: 'Open now' },
        { brand: 'StayNear Hotels', art: 'S', color: '#d9480f', head: 'Weekend rooms up to 40% off this month', body: 'Free cancellation on most stays. Members get an extra 10% off.', cta: 'See rooms' },
        { brand: 'Lumen Learning', art: 'L', color: '#7048e8', head: 'Learn a language in 15 minutes a day', body: 'Try the first unit free, then pick a plan that fits you.', cta: 'Start free' },
        { brand: 'Cobalt Insurance', art: 'C', color: '#0b7285', head: 'Switch and save on car insurance', body: 'Drivers who switched saved $412 a year on average.', cta: 'Get a quote' },
        { brand: 'Fernwood Meals', art: 'F', color: '#c2255c', head: 'Fresh recipes delivered to your door', body: 'Pick your meals each week and skip any time. $60 off the first box.', cta: 'Claim offer' },
        { brand: 'Orbit Phones', art: 'O', color: '#364fc7', head: 'Trade in your old phone for up to $600', body: 'Free shipping both ways and a same-day credit on your account.', cta: 'Trade in' },
      ]);
      function buildBanner(util, app, r, h) {
        const a = r.pick(ADS);
        const bar = util.el('div', 'am-adbar', app);
        bar.style.height = h + 'px';
        bar.dataset.role = 'ad';
        util.el('span', 'tag', bar, 'Ad');
        util.el('span', 'art', bar, a.art).style.background = a.color;
        const tx = util.el('span', 'tx', bar);
        util.el('b', '', tx, a.brand);
        tx.append(a.head);
        util.el('button', 'cta', bar, a.cta).style.background = a.color;
      }
      function buildSponsored(util, pane, r, k, rowH) {
        for (const a of r.sample(ADS, k)) {
          const row = util.el('div', 'am-sp', pane);
          row.style.height = rowH + 'px';
          row.dataset.role = 'ad';
          util.el('span', 'tag', row, 'Ad');
          const tx = util.el('div', 'tx', row);
          const t1 = util.el('div', 't1', tx);
          util.el('span', '', t1, a.brand);
          util.el('span', '', t1, a.head);
          util.el('div', 't2', tx, a.body);
          util.el('span', 'go', row, a.cta);
        }
      }
      function buildAdColumn(util, main, r, h) {
        const col = util.el('aside', 'am-adcol', main);
        col.dataset.role = 'ad';
        for (const a of r.sample(ADS, h >= 470 ? 2 : 1)) {
          const c = util.el('div', 'am-adcard', col);
          util.el('div', 'art', c, a.art).style.background = a.color;
          util.el('span', 'tag', c, 'Ad');
          util.el('b', '', c, a.brand);
          util.el('p', '', c, a.head);
          util.el('button', 'cta', c, a.cta).style.background = a.color;
        }
      }

      let view = __has('view') ? __parts['view'](undefined, __scope) : (null); // live episode: { locate(t), sync(m), outside(e) }
      let listening = __has('listening') ? __parts['listening'](undefined, __scope) : (false);

      // Layout of the mail and ads clients: sizes and the seeded layout draws (rng fork 'layout', returned as lr for
      // the draws build() makes after it). A design that lays the window out differently wraps this unit,
      // (base) => (ctx, ads) => ({ ...base(ctx, ads), ...changes }), so the template's draws stay in step.
      function mailGeometry(ctx, ads) {
        const { rng, spec } = ctx;
        const W = ctx.size.width;
        const H = ctx.size.height;
        const lr = rng.fork('layout');
        const mx = 10;
        let appW = Math.min(1280, Math.floor(W - 2 * mx));
        if (appW > 780) appW = Math.max(780, Math.round(appW * lr.float(0.86, 1)));
        const rail = appW < 820 || lr.bool(0.15);
        const sideW = rail ? 58 : appW >= 1100 ? 184 : 164;
        const mainW = appW - sideW - 1;
        // ads: a banner under the top bar, sponsored rows pinned above the list, a column of ads right of the message.
        const stack = mainW < 700 || lr.bool(0.2);
        const adCol = ads && !stack && mainW >= 940;
        const adColW = adCol ? 176 : 0;
        const listW = stack ? mainW : ads ? Math.round(Math.max(400, Math.min(540, (mainW - adColW) * lr.float(0.54, 0.6))))
          : Math.round(Math.max(340, Math.min(520, mainW * lr.float(0.44, 0.52))));
        const readW = stack ? mainW : mainW - listW - adColW;
        const tight = ads && H < 560; // short stage: no banner, one sponsored row
        const bannerH = ads && !tight ? 50 : 0;
        const sponsorK = ads ? (lr.bool(0.4) && !tight ? 2 : 1) : 0;
        const chromeH = 50 + 34 + 46 + 2 + bannerH; // top bar, toolbar, list header, borders and banner
        const rowH = Math.max(40, Math.min(lr.int(84, 104), Math.floor((H - 2 * mx - chromeH) / (spec.rows + sponsorK))));
        const appH = chromeH + (spec.rows + sponsorK) * rowH;
        const rowKind = rowH >= 76 ? 'tall' : rowH >= 56 ? 'medium' : 'compact';
        const align = lr.pick(['center', 'center', 'left', 'right']);
        const left = align === 'left' ? mx : align === 'right' ? W - mx - appW : (W - appW) / 2;
        const top = lr.bool(0.5) ? (H - appH) / 2 : Math.min(mx, (H - appH) / 2);
        return { appW, appH, rail, sideW, stack, adCol, bannerH, sponsorK, chromeH, listW, readW, rowH, rowKind, left, top, lr };
      }

      // Sizes of the classic client: widest window, row heights to pick from and the smallest row.
      const CLASSIC_SIZES = __has('CLASSIC_SIZES') ? __parts['CLASSIC_SIZES'](undefined, __scope) : ({ maxWidth: 1280, rowHeights: [22, 24, 26], minRow: 20 });

      function classicGeometry(ctx) {
        const { rng, spec } = ctx;
        const W = ctx.size.width;
        const H = ctx.size.height;
        const lr = rng.fork('layout');
        const mx = 8;
        const appW = Math.min(CLASSIC_SIZES.maxWidth, Math.floor(W - 2 * mx));
        const treeW = appW >= 1100 ? 196 : appW >= 900 ? 170 : 148;
        const appH = H - 2 * mx;
        const fixedH = 24 + 22 + 36 + 22 + 22 + 6 + 3 * 2 + 20; // title, menu, toolbar, status, colhead + gaps
        const rowH = Math.max(CLASSIC_SIZES.minRow, Math.min(lr.pick(CLASSIC_SIZES.rowHeights), Math.floor((appH - fixedH - 190) / spec.rows)));
        const left = lr.pick(['l', 'c', 'c']) === 'l' ? mx : Math.round((W - appW) / 2);
        return { appW, treeW, appH, rowH, left, mx };
      }

      // Hooks a design fills in; the defaults draw the reference clients (nothing extra, null state).
      function mailTopActions(ctx, nodes) { return null; }
      function mailPaintTop(ctx, state, model) {}
      function mailSidebar(ctx, side) { return null; }
      function mailPaintSidebar(ctx, state, model) {}
      function mailListHeading(ctx, lb) {}
      function mailTime(email) { return email.time; }
      function mailBlank() { return 'Select a message to read'; }
      function mailShowBack(stack) { return stack; }
      function mailSized(ctx, listbox) {}
      function classicListPaint(ctx, nodes, state, model) { return state; }
      function classicListMounted(ctx, nodes) { return null; }

      function build(ctx, style) {
        return env.templateLib('use-email/_base-modern').build(ctx, style, __scope);
      }

      // ---- classic: three panes (folder tree | message list over the reading pane), menu bar, toolbar.
      // Clicking a row selects it (reading pane); Ctrl-click / Shift-click add rows to the selection; the toolbar
      // acts on the ticked rows, else on the open message; the Delete key trashes the open message; only the
      // flag column is a row icon.
      function buildClassic(ctx) {
        return env.templateLib('use-email/_base-classic').buildClassic(ctx, __scope);
      }

      const ALL = __has('ALL') ? __parts['ALL'](undefined, __scope) : (['delete', 'star', 'important', 'reply', 'forward', 'star-reply', 'nl',
        'archive', 'move', 'unread', 'bulk', 'reply-all', 'compose', 'search', 'attachment', 'undo']);

      // 'mail' is the plain client; 'ads' is the same state machine with inert ad slots around the list.
      if (__has('stmt0.0')) __parts['stmt0.0'](undefined, __scope);
      else for (const [name, style] of [['mail', 'mail'], ['ads', 'ads'], ['classic', 'classic']]) {
        env.widget({
          task: 'use-email',
          site: 'base',
          name,
          split: 'train',
          scenarios: ALL,
          // classic: a plain click selects one row (Ctrl-click adds), only the flag column is a row icon, Delete key
          traits: style === 'classic' ? { rowIcons: ['star'], select: 'modifier', keys: true, search: true } : { search: true },

          render(ctx) {
            ensureStyle();
            if (!listening) {
              listening = true;
              document.addEventListener('pointerdown', (e) => view && view.outside(e), true);
              document.addEventListener('keydown', (e) => view && view.key && view.key(e));
            }
            view = style === 'classic' ? buildClassic(ctx) : build(ctx, style);
            return { anchors: [view.app], sync: (m) => view.sync(m) };
          },

          locate(t) {
            const p = view && view.locate(t);
            if (!p) throw new Error(`use-email/${name} cannot locate ${JSON.stringify(t)}`);
            return p;
          },
        });
      }
    })();

    return captured;
  }
  env.template('use-email/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`use-email/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('use-email/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`use-email/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`use-email/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['use-email/_base-style', 'use-email/_base-modern', 'use-email/_base-classic'] });
})();
