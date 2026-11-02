/*
 * mock-checkout: a frozen, eval-only replica of a generic web-shop checkout (held out, never trained on;
 * see README.md). The frame is the stripped-down shell real stores show around their checkout: an
 * optional announcement strip, a header with a lock mark and "Secure checkout", a few inert links, a fake
 * search box and an account avatar, an optional breadcrumb, a help sidebar on wide screens, and a footer
 * with policy links and plain-text payment / trust notes. No real brands, logos or trademarks.
 *
 * Per episode (ctx.rng): theme (light, dark or high-contrast), accent, body and heading font families,
 * corner radius; where the instruction shows (ctx.display: header | panel | toast | hidden; panel falls
 * back to header below 1260 px width, toast below 700 px height); the end control's placement (header
 * button, header icon button, footer button, footer text link, floating pill) and label (about 1 in 8
 * non-English); inert decoys, one of which sometimes repeats the end control's label (it only logs);
 * filler (announcement strip, nav links, search box, avatar, breadcrumb, help sidebar, footer); stage
 * alignment. ctx.finish: no end control (submit: null). overlay(ctx) draws all five perturbation kinds.
 */
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#f6f6f4', panel: '#ffffff', fg: '#1b1d21', muted: '#646a73', line: '#dfe1e5', soft: '#f1f2f4', strip: '#1b1d21', stripfg: '#f6f6f4' },
    dark: { bg: '#121417', panel: '#1b1e23', fg: '#eceef1', muted: '#9aa1ab', line: '#30353d', soft: '#23272e', strip: '#2a2f37', stripfg: '#eceef1' },
    contrast: { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#2b2b2b', line: '#000000', soft: '#f2f2f2', strip: '#000000', stripfg: '#ffffff' },
  };
  const ACCENTS = {
    light: ['#1b1d21', '#1f5fcf', '#0d7a50', '#b0254f', '#b8470d', '#0f6f6a'],
    dark: ['#6ea8ff', '#43c08a', '#f07aa0', '#f59f5b', '#4fc7c0', '#e8e8e8'],
    contrast: ['#0033cc', '#000000', '#8a0000'],
  };
  const FONTS = ['"Helvetica Neue", Helvetica, Arial, sans-serif', 'Lato, "Helvetica Neue", Arial, sans-serif',
    '"DejaVu Sans", Verdana, Geneva, sans-serif', '"Liberation Sans", Arial, sans-serif'];
  const HEAD_FONTS = ['inherit', 'inherit', 'Georgia, "DejaVu Serif", "Times New Roman", serif', '"URW Gothic", "Century Gothic", "Avenir", sans-serif'];
  const END_LABELS = ['Done', 'Finish', 'Continue', "I'm done", 'Complete', 'Submit', 'Confirm', 'All set', 'OK'];
  const LOCALE_END = { 'de-DE': 'Fertig', 'fr-FR': 'Terminer', 'es-ES': 'Listo', 'pt-BR': 'Concluir', 'it-IT': 'Fatto',
    'nl-NL': 'Klaar', 'pl-PL': 'Gotowe', 'ja-JP': '完了', 'zh-CN': '完成' };
  const DECOYS = ['Help', 'Contact us', 'Live chat', 'Returns', 'Size guide', 'Gift cards', 'Store locator', 'Save cart'];
  const NAV = ['Shop all', 'New in', 'Deals', 'Gift cards', 'Help', 'Stores', 'Sustainability', 'Journal'];
  const HEAD_TITLES = ['Secure checkout', 'Checkout', 'Secure checkout', 'Your order', 'Safe checkout'];
  const STRIP = ['Free standard shipping on orders over 50', 'Easy 30-day returns on most items',
    'Order by 2 pm for same-day dispatch', 'Members get early access to seasonal sales', 'Gift wrapping available at checkout'];
  const FOOT_LINKS = ['Shipping policy', 'Returns & refunds', 'Privacy policy', 'Terms of service', 'Contact', 'Accessibility', 'Cookie settings'];
  const TRUST = ['Payments are encrypted and processed securely.', 'We never store your full card number.',
    'Questions? Our support team answers within one business day.', 'All prices include applicable taxes unless stated otherwise.'];
  const PAY_WORDS = ['Credit card', 'Debit card', 'Bank transfer', 'Pay later', 'Gift card', 'Store credit'];
  const CRUMBS = [['Home', 'Bag', 'Checkout'], ['Shop', 'Cart', 'Checkout'], ['Home', 'Checkout']];

  const OVERLAY_TEXT = {
    cookie: ['We use cookies to keep your bag, remember your preferences and measure how our store is used.',
      'This store uses essential cookies and, with your consent, analytics cookies.',
      'Cookies help us remember what is in your cart. Choose which optional cookies we may set.'],
    toast: ['Prices updated for your region.', 'An item in your bag is selling fast.', 'Your session was restored.',
      'Saved addresses loaded.', 'Free shipping unlocked on this order.'],
    chat: ['Questions about your order? We are online now.', 'Need help choosing a delivery option? Chat with us.',
      'Hi! I can help with sizing, shipping or returns.'],
    promo: ['Get 10% off your next order when you join our email list.', 'Become a member: free shipping on every order.',
      'Add a gift card and save 15% today.'],
    banner: ['Holiday deliveries: order by Dec 18 for delivery before the holidays.', 'Some carriers are experiencing delays in your area.',
      'You are shopping as a guest. Sign in to use saved addresses.'],
  };

  const LOCK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="2.5" y="7" width="11" height="7.5" rx="1.6" fill="currentColor"/></svg>';
  const CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SEARCH = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const CHAT = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  function endLabel(rng) {
    if (rng.bool(0.12)) return LOCALE_END[rng.pick(Object.keys(LOCALE_END))];
    return rng.pick(END_LABELS);
  }

  env.site({
    name: 'mock-checkout',
    styles: ['site.css'],
    scripts: [],

    frame(ctx) {
      const { rng, util, content } = ctx;
      const tr = rng.fork('theme');
      const theme = tr.pick(['light', 'light', 'light', 'dark', 'dark', 'contrast']);
      const root = document.documentElement;
      for (const [k, v] of Object.entries(THEMES[theme])) root.style.setProperty(`--${k}`, v);
      const accent = tr.pick(ACCENTS[theme]);
      root.style.setProperty('--accent', accent);
      // Text on accent-filled buttons: light accents (dark theme) need dark text.
      root.style.setProperty('--onaccent', theme === 'dark' && accent !== '#e8e8e8' ? '#0d0f12' : theme === 'dark' ? '#111' : '#ffffff');
      root.style.setProperty('--font', tr.pick(FONTS));
      root.style.setProperty('--hfont', tr.pick(HEAD_FONTS));
      root.style.setProperty('--r', tr.pick(['4px', '6px', '8px', '10px']));
      root.dataset.theme = theme;
      root.dataset.rcTheme = theme;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.classList.toggle('rc-has-note', display === 'toast');

      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'icon', 'footer', 'link', 'floating']);
      const wantFooter = placement === 'footer' || placement === 'link' || (tall && rng.bool(0.45));
      const strip = H >= 760 && display !== 'toast' && rng.bool(0.4);
      const nav = W >= 1180 && display !== 'header' && rng.bool(0.6);
      const search = W >= 1120 && rng.bool(0.4) && display !== 'header';
      const avatar = rng.bool(0.6);
      const crumbs = H >= 760 && rng.bool(0.3);
      const sidebar = roomy && display !== 'panel' && rng.bool(0.3);
      const label = endLabel(rng);
      const decoys = rng.sample(DECOYS, rng.int(0, 2));
      // A decoy that reads exactly like the end control but only logs (where the end control is not).
      const twin = !!placement && rng.bool(0.45);
      const twinAt = !twin ? null : placement === 'header' ? (wantFooter ? 'footer' : null)
        : placement === 'icon' ? (wantFooter ? 'footer' : 'header') : 'header';

      const decoyBtn = (parent, text, cls = 'rc-xtra') => {
        const b = util.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text }));
        return b;
      };
      const inertLink = (parent, text, cls, what) => {
        const a = util.el('a', cls, parent, text);
        a.href = '#';
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what, label: text }); });
        return a;
      };
      const endBtn = (parent, cls, text) => {
        const link = cls.includes('rc-endlink');
        const b = util.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };

      if (strip) {
        const s = util.el('div', 'rc-strip', document.body);
        s.dataset.role = 'announcement';
        util.el('span', '', s, rng.pick(STRIP));
      }

      const header = util.el('header', 'rc-head', document.body);
      const mark = util.el('div', 'rc-mark', header);
      mark.dataset.role = 'brand';
      util.el('span', 'rc-lock', mark).innerHTML = LOCK;
      util.el('span', 'rc-mark-t', mark, rng.pick(HEAD_TITLES));
      if (nav) {
        const n = util.el('nav', 'rc-nav', header);
        for (const item of rng.sample(NAV, rng.int(3, 4))) inertLink(n, item, 'rc-navlink', 'nav');
      }
      if (display === 'header') util.el('div', 'rc-instruction', header, ctx.instruction);
      else util.el('div', 'rc-spacer', header);
      if (search) {
        const sb = util.el('div', 'rc-search', header);
        sb.dataset.role = 'search';
        sb.innerHTML = SEARCH;
        util.el('span', '', sb, rng.pick(['Search the store', 'Search products', 'Search']));
        sb.addEventListener('click', () => env.log('decoy', { what: 'search' }));
      }
      const tools = util.el('div', 'rc-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(tools, d);
      if (twinAt === 'header') decoyBtn(tools, label, 'rc-xtra rc-twin');
      let submit = null;
      if (placement === 'header') submit = endBtn(tools, 'rc-submit', label);
      if (placement === 'icon') {
        submit = endBtn(tools, 'rc-submit rc-icon', '');
        submit.innerHTML = CHECK;
      }
      if (avatar) {
        const pn = content && content.personName ? content.personName(rng.fork('avatar')).full : 'Alex Morgan';
        const av = util.el('button', 'rc-avatar', tools, initials(pn));
        av.type = 'button';
        av.dataset.role = 'avatar';
        av.title = pn;
        av.addEventListener('click', () => env.log('decoy', { what: 'avatar' }));
      }

      if (crumbs) {
        const c = util.el('div', 'rc-crumbs', document.body);
        c.dataset.role = 'breadcrumb';
        const trail = rng.pick(CRUMBS);
        trail.forEach((t, i) => {
          if (i) util.el('span', 'rc-sep', c, '›');
          if (i < trail.length - 1) inertLink(c, t, 'rc-crumb', 'breadcrumb');
          else util.el('span', 'rc-crumb cur', c, t);
        });
      }

      const body = util.el('div', 'rc-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'rc-side', body);
        util.el('div', 'rc-side-h', side, rng.pick(['Need help?', 'Customer care', 'Questions?']));
        util.el('div', 'rc-side-t', side, rng.pick(['Mon-Fri 8:00-20:00', 'Every day 9:00-18:00', '24/7 by chat']));
        for (const item of rng.sample(['Shipping times', 'Returns', 'Order status', 'Payment options', 'Contact us'], rng.int(3, 4))) {
          inertLink(side, item, 'rc-sidelink', 'sidebar');
        }
        const chat = util.el('button', 'rc-xtra rc-side-chat', side);
        chat.type = 'button';
        chat.dataset.role = 'xtra';
        chat.innerHTML = CHAT;
        util.el('span', '', chat, 'Chat with us');
        chat.addEventListener('click', () => env.log('decoy', { what: 'chat' }));
      }
      if (display === 'panel') {
        const panel = util.el('aside', 'rc-panel', body);
        util.el('div', 'rc-panel-h', panel, rng.pick(['Your task', 'To do', 'Instructions', 'What to do']));
        util.el('div', 'rc-panel-t', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('rc-panel-left');
      }
      const stage = util.el('main', 'rc-stage', body);
      stage.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.alignItems = rng.pick(['center', 'flex-start', 'flex-start', 'flex-end']);

      if (display === 'toast') {
        const note = util.el('div', 'rc-note', document.body);
        util.el('div', 'rc-note-h', note, 'Task');
        util.el('div', 'rc-note-t', note, ctx.instruction);
        const x = util.el('button', 'rc-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        // The note is fixed over the bottom-left corner: leave room under the page for its real height.
        body.style.paddingBottom = `${Math.ceil(note.getBoundingClientRect().height) + 26}px`;
      }

      if (wantFooter) {
        const foot = util.el('footer', 'rc-foot', document.body);
        const links = util.el('div', 'rc-foot-links', foot);
        for (const l of rng.sample(FOOT_LINKS, W >= 1280 ? 4 : 3)) inertLink(links, l, 'rc-footlink', 'footer');
        const note = util.el('div', 'rc-foot-note', foot);
        if (rng.bool(0.5)) {
          note.append(rng.sample(PAY_WORDS, 3).join(' · '));
        } else {
          util.el('span', 'rc-lock sm', note).innerHTML = LOCK;
          note.append(rng.pick(TRUST));
        }
        const ftools = util.el('div', 'rc-tools', foot);
        if (decoys.length > 1) decoyBtn(ftools, decoys[1]);
        if (twinAt === 'footer') decoyBtn(ftools, label, 'rc-xtra rc-twin');
        if (placement === 'footer') submit = endBtn(ftools, 'rc-submit', label);
        if (placement === 'link') submit = endBtn(ftools, 'rc-endlink', `${label} ›`);
      }
      if (placement === 'floating') {
        const dock = util.el('div', 'rc-dock', document.body);
        submit = endBtn(dock, 'rc-submit rc-float', label);
      }
      return { stage, submit };
    },

    overlay(ctx) {
      const { rng, util, kind } = ctx;
      const el = util.el('div', `rc-ov rc-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const text = rng.pick(OVERLAY_TEXT[kind] || OVERLAY_TEXT.toast);
      const btn = (parent, label, how, cls = 'rc-ov-btn') => {
        const b = util.el('button', cls, parent, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        util.el('div', 'rc-ov-h', el, rng.pick(['Your privacy', 'Cookies', 'Cookie preferences']));
        util.el('div', 'rc-ov-text', el, text);
        const row = util.el('div', 'rc-ov-row', el);
        if (rng.bool(0.5)) btn(row, 'Manage preferences', null, 'rc-ov-btn ghost');
        btn(row, rng.pick(['Reject optional', 'Essential only']), 'reject');
        dismiss = btn(row, rng.pick(['Accept all', 'Accept cookies', 'Allow all']), 'accept', 'rc-ov-btn primary');
      } else if (kind === 'promo') {
        const box = util.el('div', 'rc-ov-box', el);
        const x = btn(box, '×', 'close', 'rc-ov-x');
        x.setAttribute('aria-label', 'Close');
        util.el('div', 'rc-ov-kicker', box, rng.pick(['Members only', 'Special offer', 'Before you go']));
        util.el('div', 'rc-ov-big', box, text);
        const row = util.el('div', 'rc-ov-col', box);
        btn(row, rng.pick(['Get my code', 'Join now', 'Add gift card']), null, 'rc-ov-btn primary wide');
        const no = btn(row, rng.pick(['No thanks', 'Continue to checkout', 'Maybe later']), 'close', 'rc-ov-btn link');
        dismiss = rng.bool(0.5) ? no : x;
      } else if (kind === 'banner') {
        util.el('span', 'rc-ov-text', el, text);
        dismiss = btn(el, rng.pick(['Dismiss', 'OK', 'Close']), 'close');
      } else if (kind === 'chat') {
        const head = util.el('div', 'rc-ov-chat-h', el);
        util.el('span', 'rc-ov-dot', head);
        util.el('b', '', head, rng.pick(['Support', 'Customer care', 'Store help']));
        dismiss = btn(head, '×', 'close', 'rc-ov-x');
        dismiss.setAttribute('aria-label', 'Close chat');
        util.el('div', 'rc-ov-text', el, text);
        btn(el, rng.pick(['Start chat', 'Reply']), null, 'rc-ov-btn ghost');
      } else {
        util.el('span', 'rc-ov-icon', el).innerHTML = CHECK;
        util.el('div', 'rc-ov-text', el, text);
        dismiss = btn(el, '×', 'close', 'rc-ov-x');
        dismiss.setAttribute('aria-label', 'Close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
  });
})();
