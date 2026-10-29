/*
 * mock-settings: a FROZEN, EVAL-ONLY replica of a generic SaaS account / workspace settings page
 * (split heldout: registered only under <task>.heldout and <task>.mock-settings, never sampled for
 * training). No real brand: the product and workspace names are invented, the logo is a plain monogram.
 *
 * Page frame (all sampled per episode from ctx.rng):
 *   top bar      monogram + workspace switcher (inert), global search pill (inert, "Ctrl K"), plan badge,
 *                help and notification icon buttons, avatar (all inert, they only log)
 *   settings nav left column with "Account" and "Workspace" groups (Profile, Preferences, Notifications,
 *                Security / General, Members, Billing, Integrations, API keys); full (labels), icon rail or
 *                none; the item matching the page is highlighted; inert. Sometimes a "setup guide" card.
 *   page head    breadcrumb (Settings > group > page) and the page title; secondary decoy buttons
 *   footer       optional: version, legal links (inert)
 *   instruction  ctx.display: 'header' (an info strip under the top bar), 'panel' (a "Your task" card left or
 *                right of the page when the viewport is >= 1260 px wide), 'toast' (a fixed note at the
 *                bottom when the viewport is >= 700 px tall), 'hidden' (goal text only)
 *   end control  (none in finish mode) placement: page head button, top-bar text button, top-bar icon
 *                button, footer button, footer text link, bottom of the settings nav, or a docked button
 *                under the page; label from END_LABELS (never Save/Apply, which belong to the settings
 *                forms) or a settings-flavoured one ("Close settings", "Back to app"); ~10% non-English.
 *   decoys       0-2 secondary page-head buttons, and ONE decoy whose label equals the end control's (in the
 *                setup-guide card, the footer, the page head or the top bar, never next to the end control);
 *                every decoy only logs
 *   theme        light, slate (dark top bar), dark, dim, high-contrast; accent colour; font family stack
 *                (Inter/Helvetica-like, Segoe-like or Lato) with a monospace stack for ids; radius; density
 *   locale       ~12% of episodes render the frame (nav, crumbs, end label) in de/fr/es/pt/it/nl/ja; the
 *                instruction stays English. If the kit passes ctx.lang / ctx.locale it is honoured.
 *   stage        alignment sampled (centre, start, end) on both axes; widgets size themselves from ctx.size
 * overlay(ctx) draws cookie (bottom-left consent card), toast (top-right dark toast, expires), chat (support
 * bubble bottom-right), promo (upgrade modal over a scrim), banner (top announcement bar).
 * Changing anything here changes the frozen eval: re-baseline the eval numbers (see README.md).
 */
(function () {
  'use strict';

  const THEMES = {
    light: {
      bg: '#f6f6f7',
      panel: '#ffffff',
      fg: '#18181b',
      muted: '#6b6b76',
      line: '#e4e4e7',
      soft: '#f4f4f5',
      nav: '#fafafa',
      top: '#ffffff',
      topfg: '#18181b',
      topline: '#e4e4e7',
      danger: '#dc2626',
      ok: '#15803d',
      dark: 0,
    },
    slate: {
      bg: '#f1f5f9',
      panel: '#ffffff',
      fg: '#0f172a',
      muted: '#64748b',
      line: '#e2e8f0',
      soft: '#f1f5f9',
      nav: '#f8fafc',
      top: '#0f172a',
      topfg: '#e2e8f0',
      topline: '#1e293b',
      danger: '#dc2626',
      ok: '#15803d',
      dark: 0,
    },
    dark: {
      bg: '#0e1014',
      panel: '#16191f',
      fg: '#e7e9ee',
      muted: '#959cab',
      line: '#2a2f3a',
      soft: '#1d2129',
      nav: '#121419',
      top: '#121419',
      topfg: '#e7e9ee',
      topline: '#262b35',
      danger: '#f87171',
      ok: '#4ade80',
      dark: 1,
    },
    dim: {
      bg: '#1e2129',
      panel: '#262a33',
      fg: '#dfe3ea',
      muted: '#a0a7b4',
      line: '#3a3f4b',
      soft: '#2d313b',
      nav: '#22252d',
      top: '#22252d',
      topfg: '#dfe3ea',
      topline: '#3a3f4b',
      danger: '#fb7185',
      ok: '#86efac',
      dark: 1,
    },
    contrast: {
      bg: '#ffffff',
      panel: '#ffffff',
      fg: '#000000',
      muted: '#2b2b2b',
      line: '#000000',
      soft: '#f2f2f2',
      nav: '#ffffff',
      top: '#000000',
      topfg: '#ffffff',
      topline: '#000000',
      danger: '#b00020',
      ok: '#006400',
      dark: 0,
    },
  };
  const THEME_W = [
    ['light', 0.38],
    ['slate', 0.2],
    ['dark', 0.26],
    ['dim', 0.09],
    ['contrast', 0.07],
  ];
  const ACCENTS = ['#4f46e5', '#2563eb', '#7c3aed', '#0d9488', '#16a34a', '#db2777', '#ea580c', '#0891b2'];
  const FONTS = [
    '"Inter", "Helvetica Neue", "Nimbus Sans", "Liberation Sans", Arial, sans-serif',
    '"Segoe UI", "DejaVu Sans", "Liberation Sans", sans-serif',
    '"Lato", "Helvetica Neue", "Liberation Sans", Arial, sans-serif',
    '"SF Pro Text", -apple-system, "Nimbus Sans", "Liberation Sans", sans-serif',
  ];
  const MONO = '"SF Mono", "JetBrains Mono", "DejaVu Sans Mono", "Liberation Mono", monospace';

  const PRODUCTS = [
    'Fieldnote',
    'Lumen',
    'Tallyhand',
    'Orbitdesk',
    'Quillpost',
    'Stackwise',
    'Brightloop',
    'Northbeam',
    'Pinewire',
    'Cobalt Desk',
    'Harbor',
    'Sprocket',
    'Kitebase',
    'Ledgerly',
    'Moss',
    'Parcelhub',
  ];
  const WORKSPACES = [
    'Acme Studio',
    'Okafor & Sons',
    'Blue Heron Labs',
    'Marlow Design',
    'Team Atlas',
    'Kestrel Ops',
    'Juniper Health',
    'Riverside Co-op',
    'Northwind Retail',
    'Tessellate',
    'Halcyon Media',
    'Personal',
  ];
  const PLANS = ['Free plan', 'Pro trial · 9 days left', 'Team plan', 'Business', 'Starter'];
  const NAV = {
    account: ['Profile', 'Preferences', 'Notifications', 'Security'],
    workspace: ['General', 'Members', 'Billing', 'Integrations', 'API keys'],
  };
  const NAV_ICON = {
    Profile: 'user',
    Preferences: 'sliders',
    Notifications: 'bell',
    Security: 'shield',
    General: 'gear',
    Members: 'users',
    Billing: 'card',
    Integrations: 'plug',
    'API keys': 'key',
  };
  // Chrome translations (the instruction stays English).
  const TR = {
    'de-DE': {
      Settings: 'Einstellungen',
      Account: 'Konto',
      Workspace: 'Arbeitsbereich',
      Profile: 'Profil',
      Preferences: 'Präferenzen',
      Notifications: 'Benachrichtigungen',
      Security: 'Sicherheit',
      General: 'Allgemein',
      Members: 'Mitglieder',
      Billing: 'Abrechnung',
      Integrations: 'Integrationen',
      'API keys': 'API-Schlüssel',
      Search: 'Suchen',
      Help: 'Hilfe',
    },
    'fr-FR': {
      Settings: 'Paramètres',
      Account: 'Compte',
      Workspace: 'Espace de travail',
      Profile: 'Profil',
      Preferences: 'Préférences',
      Notifications: 'Notifications',
      Security: 'Sécurité',
      General: 'Général',
      Members: 'Membres',
      Billing: 'Facturation',
      Integrations: 'Intégrations',
      'API keys': 'Clés API',
      Search: 'Rechercher',
      Help: 'Aide',
    },
    'es-ES': {
      Settings: 'Configuración',
      Account: 'Cuenta',
      Workspace: 'Espacio de trabajo',
      Profile: 'Perfil',
      Preferences: 'Preferencias',
      Notifications: 'Notificaciones',
      Security: 'Seguridad',
      General: 'General',
      Members: 'Miembros',
      Billing: 'Facturación',
      Integrations: 'Integraciones',
      'API keys': 'Claves de API',
      Search: 'Buscar',
      Help: 'Ayuda',
    },
    'pt-BR': {
      Settings: 'Configurações',
      Account: 'Conta',
      Workspace: 'Espaço de trabalho',
      Profile: 'Perfil',
      Preferences: 'Preferências',
      Notifications: 'Notificações',
      Security: 'Segurança',
      General: 'Geral',
      Members: 'Membros',
      Billing: 'Cobrança',
      Integrations: 'Integrações',
      'API keys': 'Chaves de API',
      Search: 'Pesquisar',
      Help: 'Ajuda',
    },
    'it-IT': {
      Settings: 'Impostazioni',
      Account: 'Account',
      Workspace: 'Area di lavoro',
      Profile: 'Profilo',
      Preferences: 'Preferenze',
      Notifications: 'Notifiche',
      Security: 'Sicurezza',
      General: 'Generale',
      Members: 'Membri',
      Billing: 'Fatturazione',
      Integrations: 'Integrazioni',
      'API keys': 'Chiavi API',
      Search: 'Cerca',
      Help: 'Aiuto',
    },
    'nl-NL': {
      Settings: 'Instellingen',
      Account: 'Account',
      Workspace: 'Werkruimte',
      Profile: 'Profiel',
      Preferences: 'Voorkeuren',
      Notifications: 'Meldingen',
      Security: 'Beveiliging',
      General: 'Algemeen',
      Members: 'Leden',
      Billing: 'Facturering',
      Integrations: 'Integraties',
      'API keys': 'API-sleutels',
      Search: 'Zoeken',
      Help: 'Help',
    },
    'ja-JP': {
      Settings: '設定',
      Account: 'アカウント',
      Workspace: 'ワークスペース',
      Profile: 'プロフィール',
      Preferences: '環境設定',
      Notifications: '通知',
      Security: 'セキュリティ',
      General: '一般',
      Members: 'メンバー',
      Billing: '請求',
      Integrations: '連携',
      'API keys': 'APIキー',
      Search: '検索',
      Help: 'ヘルプ',
    },
  };
  const LOCAL_END = {
    'de-DE': ['Fertig', 'Abschließen'],
    'fr-FR': ['Terminé', 'Terminer'],
    'es-ES': ['Hecho', 'Finalizar'],
    'pt-BR': ['Concluído', 'Concluir'],
    'it-IT': ['Fatto', 'Termina'],
    'nl-NL': ['Klaar', 'Voltooien'],
    'ja-JP': ['完了', '終了'],
    'pl-PL': ['Gotowe', 'Zakończ'],
    'zh-CN': ['完成', '结束'],
  };
  const END_LOCAL = [
    'Done',
    'Done',
    'Finish',
    'Close settings',
    'Back to app',
    'Exit settings',
    "I'm done",
    'Complete',
    'Submit',
    'Continue',
    'OK',
  ];
  const DECOYS = [
    'View audit log',
    'Share',
    'Export',
    'Docs',
    'Feedback',
    'Invite people',
    'Help',
    'Changelog',
    'Contact support',
  ];
  const FOOT = [
    '© 2024 {p} Inc. · Privacy · Terms',
    'v{v} · All systems operational',
    'Need help? Visit the help center or contact your admin.',
    'Changes may take a few minutes to sync to other devices.',
    '{p} · Status · Docs · Privacy',
  ];
  const PANEL_TITLES = ['Your task', 'Task', 'Instructions', 'What to do'];

  const ICONS = {
    search: '<path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm9 3-4.3-4.3"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6"/><path d="M12 17h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    sliders:
      '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    users:
      '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.8 5"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 9.2-9.2M17 6l3 3M14.5 8.5l2 2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    chev: '<path d="m7 10 5 5 5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M15 6l-6 6 6 6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  };
  const icon = (name, size = 18, sw = 1.8) =>
    `<svg class="rs-ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  const bank = (C, key, fb) => (C && Array.isArray(C[key]) && C[key].length ? C[key].map(labelOf) : fb);
  function weighted(rng, parts) {
    let x = rng.next() * parts.reduce((a, [, w]) => a + w, 0);
    for (const [k, w] of parts) if ((x -= w) < 0) return k;
    return parts[parts.length - 1][0];
  }

  // The page the settings screen shows, from the task (and scenario) the episode renders.
  function pageFor(rng, task, scenario) {
    if (task === 'change-settings') return rng.pick(['Preferences', 'General', 'Preferences', 'Notifications']);
    if (task === 'choose-option') {
      if (scenario === 'toggles' || scenario === 'tree' || scenario === 'checkbox')
        return rng.pick(['Notifications', 'Preferences']);
      if (scenario === 'dependent' || scenario === 'radio') return rng.pick(['General', 'Billing', 'Preferences']);
      return rng.pick(['Preferences', 'General']);
    }
    if (task === 'type-text') {
      if (scenario === 'password' || scenario === 'login') return 'Security';
      if (scenario === 'copy' || scenario === 'textarea') return rng.pick(['Billing', 'General']);
      return rng.pick(['Profile', 'Profile', 'General']);
    }
    return 'General';
  }

  env.site({
    name: 'mock-settings',
    styles: ['site.css'],
    scripts: [],

    frame(ctx) {
      const { rng, util } = ctx;
      const C = ctx.content || env.content || {};
      const el = util.el;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const root = document.documentElement;

      // ---- theme, font, density
      let themeName = weighted(rng, THEME_W);
      if (ctx.theme && THEMES[ctx.theme]) themeName = ctx.theme;
      const th = THEMES[themeName];
      for (const [k, v] of Object.entries(th)) if (k !== 'dark') root.style.setProperty(`--${k}`, v);
      const accent = themeName === 'contrast' ? rng.pick(['#0000cc', '#000000', '#5b00b5']) : rng.pick(ACCENTS);
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--font', rng.pick(FONTS));
      root.style.setProperty('--mono', MONO);
      root.style.setProperty('--r', rng.pick([4, 6, 8, 8, 10]) + 'px');
      root.dataset.theme = themeName;
      root.dataset.mode = th.dark ? 'dark' : 'light';
      root.dataset.density = rng.bool(0.3) ? 'compact' : 'comfy';

      // ---- language of the frame
      const forced = ctx.lang || ctx.locale;
      const loc = forced && forced !== 'en-US' ? forced : rng.bool(0.12) ? rng.pick(Object.keys(TR)) : 'en-US';
      const tr = (s) => (TR[loc] && TR[loc][s]) || s;

      // ---- instruction display and layout budget
      let display = ctx.display || 'header';
      if (display === 'panel' && W < 1260) display = 'header';
      if (display === 'toast' && H < 700) display = 'header';
      document.body.classList.toggle('rs-has-note', display === 'toast');
      const panelW = 252;
      let navMode =
        W >= 1180
          ? weighted(rng, [
              ['full', 0.7],
              ['rail', 0.15],
              ['none', 0.15],
            ])
          : weighted(rng, [
              ['full', 0.4],
              ['rail', 0.35],
              ['none', 0.25],
            ]);
      if (display === 'panel' && navMode === 'full' && W - panelW - 220 < 760)
        navMode = rng.bool(0.5) ? 'rail' : 'none';

      const page = pageFor(rng, ctx.task, ctx.scenario);
      const group = NAV.account.includes(page) ? 'Account' : 'Workspace';
      const product = rng.pick(PRODUCTS);
      const workspace =
        C.COMPANIES && rng.bool(0.5)
          ? rng.pick(C.COMPANIES.map(labelOf).filter((s) => s.length <= 22))
          : rng.pick(WORKSPACES);

      // ---- end control
      const endPool = bank(C, 'END_LABELS', END_LOCAL)
        .filter((l) => !/save|apply|send|next/i.test(l))
        .concat(END_LOCAL);
      let label = rng.pick(endPool);
      if (loc !== 'en-US' && LOCAL_END[loc] && rng.bool(0.8)) label = rng.pick(LOCAL_END[loc]);
      else if (rng.bool(0.06)) label = rng.pick(LOCAL_END[rng.pick(Object.keys(LOCAL_END))]);
      const places = ['pagehead', 'pagehead', 'topbar', 'icon', 'footer', 'link', 'dock'];
      if (navMode === 'full') places.push('nav');
      let placement = ctx.finish ? null : rng.pick(places);
      const footer = placement === 'footer' || placement === 'link' || (H >= 700 && rng.bool(0.35));

      // ---- inert helpers
      const inert = (node, what, text) => {
        node.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what, label: text || node.textContent.trim() });
        });
        return node;
      };
      const button = (parent, cls, text, what) => {
        const b = el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        return inert(b, what || 'button', text);
      };
      const endBtn = (parent, cls, text, html) => {
        const b = el(cls.includes('rs-endlink') ? 'a' : 'button', cls, parent);
        if (html) b.innerHTML = html;
        else b.textContent = text;
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;

      // ---- top bar
      const top = el('header', 'rs-top', document.body);
      const brand = el('div', 'rs-brand', top);
      inert(brand, 'workspace-switcher', workspace);
      const mono = el(
        'span',
        'rs-mono',
        brand,
        workspace
          .replace(/[^A-Za-z]/g, '')
          .slice(0, 1)
          .toUpperCase() || 'W',
      );
      mono.style.background = rng.pick(['#f59e0b', '#10b981', '#6366f1', '#ef4444', '#0ea5e9', '#a855f7']);
      const bt = el('span', 'rs-brand-t', brand);
      el('b', '', bt, workspace);
      if (W >= 1100) el('small', '', bt, product);
      brand.insertAdjacentHTML('beforeend', icon('chev', 14));
      if (W >= 1100 || rng.bool(0.5)) {
        const s = el('div', 'rs-gsearch', top);
        s.innerHTML = `${icon('search', 15)}<span>${tr('Search')}…</span><kbd>Ctrl K</kbd>`;
        inert(s, 'global-search', 'Search');
      }
      el('div', 'rs-grow', top);
      const tools = el('div', 'rs-toptools', top);
      if (W >= 1180 && rng.bool(0.5)) inert(el('span', 'rs-plan', tools, rng.pick(PLANS)), 'plan');
      const ib = (name, tip) => {
        const b = el('button', 'rs-ib', tools);
        b.type = 'button';
        b.innerHTML = icon(name, 18);
        b.title = tip;
        b.setAttribute('aria-label', tip);
        b.dataset.role = 'xtra';
        return inert(b, 'icon', tip);
      };
      ib('help', tr('Help'));
      const bell = ib('bell', 'Notifications');
      if (rng.bool(0.6)) el('i', 'rs-dot', bell);
      if (placement === 'topbar') submit = endBtn(tools, 'rs-btn rs-primary rs-topend', label);
      if (placement === 'icon') submit = endBtn(tools, 'rs-ib rs-iconend', null, icon('check', 20, 2.4));
      const who = C.personName ? C.personName(rng.fork('who')) : { first: 'Alex', last: 'Kim' };
      const av = el('button', 'rs-avatar', tools, `${who.first[0]}${who.last[0]}`.toUpperCase());
      av.type = 'button';
      av.style.background = rng.pick(['#7c3aed', '#0e7490', '#b45309', '#be123c', '#15803d', '#475569']);
      av.title = `${who.first} ${who.last}`;
      inert(av, 'avatar');

      // ---- instruction strip
      if (display === 'header') {
        const strip = el('div', 'rs-task', document.body);
        strip.dataset.role = 'instruction';
        strip.insertAdjacentHTML('beforeend', icon('info', 17));
        el('div', 'rs-task-text', strip, ctx.instruction);
      }

      // ---- body: nav | (panel) | main | (panel)
      const body = el('div', 'rs-body', document.body);
      let collide = null; // where the colliding decoy may go
      if (navMode !== 'none') {
        const nav = el('nav', `rs-nav ${navMode}`, body);
        if (navMode === 'full') el('div', 'rs-nav-h', nav, tr('Settings'));
        const groups = rng.bool(0.5) ? ['account', 'workspace'] : ['workspace', 'account'];
        for (const g of groups) {
          if (navMode === 'full') el('div', 'rs-nav-g', nav, tr(g === 'account' ? 'Account' : 'Workspace'));
          else el('div', 'rs-nav-sep', nav);
          const items = NAV[g].filter((x) => x === page || rng.bool(0.8));
          for (const it of items) {
            const a = el('a', `rs-nav-i${it === page ? ' on' : ''}`, nav);
            a.href = '#';
            a.dataset.role = 'nav';
            a.innerHTML = icon(NAV_ICON[it] || 'gear', 17);
            if (navMode === 'full') el('span', '', a, tr(it));
            else a.title = tr(it);
            inert(a, 'nav', it);
          }
        }
        if (navMode === 'full') {
          el('div', 'rs-grow', nav);
          if (H >= 700 && rng.bool(0.55) && placement !== 'nav') collide = { kind: 'guide', parent: nav };
          if (placement === 'nav') {
            const box = el('div', 'rs-nav-end', nav);
            submit = endBtn(
              box,
              rng.bool(0.5) ? 'rs-btn rs-primary rs-wide' : 'rs-btn rs-wide',
              null,
              `${icon('arrow', 15)}<span>${label}</span>`,
            );
          }
        }
      }
      const panelSide = rng.bool(0.6) ? 'right' : 'left';
      const mkPanel = () => {
        const p = el('aside', 'rs-panel', body);
        p.dataset.role = 'instruction';
        const h = el('div', 'rs-panel-h', p);
        h.innerHTML = icon('spark', 15);
        el('span', '', h, rng.pick(PANEL_TITLES));
        el('div', 'rs-panel-t', p, ctx.instruction);
      };
      if (display === 'panel' && panelSide === 'left') mkPanel();
      const main = el('div', 'rs-main', body);
      if (display === 'panel' && panelSide === 'right') mkPanel();

      // page head
      const head = el('div', `rs-head${H < 700 ? ' tight' : ''}`, main);
      const ht = el('div', 'rs-head-t', head);
      const crumb = el('div', 'rs-crumb', ht);
      for (const [i, c] of [tr('Settings'), tr(group), tr(page)].entries()) {
        if (i) el('span', 'rs-crumb-sep', crumb, '/');
        const a = el(i < 2 ? 'a' : 'span', i < 2 ? 'rs-crumb-a' : 'rs-crumb-cur', crumb, c);
        if (i < 2) {
          a.href = '#';
          inert(a, 'breadcrumb', c);
        }
      }
      if (H >= 700 || rng.bool(0.4)) el('h1', 'rs-h1', ht, tr(page));
      const headTools = el('div', 'rs-head-tools', head);
      const decoys = rng.sample(
        DECOYS.concat(bank(C, 'DECOY_LABELS', []).filter((d) => d.length <= 16)),
        rng.int(0, W >= 1180 ? 2 : 1),
      );
      for (const d of decoys) button(headTools, 'rs-btn rs-ghost', d, 'head');
      if (placement === 'pagehead') submit = endBtn(headTools, 'rs-btn rs-primary', label);

      const stage = el('main', 'rs-stage', main);
      stage.style.justifyContent = rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.alignItems = rng.pick(['center', 'flex-start', 'flex-start', 'flex-end']);

      if (placement === 'dock') {
        const dock = el('div', `rs-dock ${rng.pick(['r', 'r', 'l', 'c'])}`, main);
        submit = endBtn(dock, 'rs-btn rs-primary rs-docked', label);
      }
      let foot = null;
      if (footer) {
        foot = el('footer', 'rs-foot', main);
        const t = rng
          .pick(FOOT)
          .replace('{p}', product)
          .replace('{v}', `${rng.int(2, 9)}.${rng.int(0, 30)}.${rng.int(0, 9)}`);
        inert(el('span', 'rs-foot-t', foot, t), 'footer');
        const ft = el('div', 'rs-foot-tools', foot);
        if (placement === 'footer') submit = endBtn(ft, 'rs-btn rs-primary', label);
        if (placement === 'link') submit = endBtn(ft, 'rs-endlink', `${label} ›`);
      }

      // ---- the decoy whose label collides with the end control (never beside it)
      const clabel = ctx.finish ? rng.pick(endPool) : label;
      if (collide && collide.kind === 'guide') {
        const card = el('div', 'rs-guide', collide.parent);
        el('b', '', card, rng.pick(['Finish setting up', 'Setup guide', 'Getting started']));
        const n = rng.int(2, 4);
        el('div', 'rs-guide-t', card, `${n} of 5 steps complete`);
        const bar = el('div', 'rs-guide-bar', card);
        el('i', '', bar).style.width = `${n * 20}%`;
        button(card, 'rs-btn rs-ghost rs-sm', clabel, 'collision');
      } else if (foot && placement !== 'footer' && placement !== 'link') {
        button(foot.lastChild, 'rs-btn rs-ghost rs-sm', clabel, 'collision');
      } else if (placement !== 'pagehead') {
        button(headTools, 'rs-btn rs-ghost', clabel, 'collision');
      } else if (placement === 'pagehead') {
        // the end control is in the page head: the look-alike sits in the top bar's tools
        const b = el('button', 'rs-btn rs-topghost', null, clabel);
        b.type = 'button';
        b.dataset.role = 'xtra';
        inert(b, 'collision', clabel);
        tools.insertBefore(b, tools.firstChild);
      }

      // ---- toast instruction
      if (display === 'toast') {
        const note = el('div', `rs-note ${rng.bool(0.5) ? 'l' : 'r'}`, document.body);
        note.dataset.role = 'instruction';
        note.insertAdjacentHTML('beforeend', icon('info', 18));
        el('div', 'rs-note-t', note, ctx.instruction);
        const x = el('button', 'rs-note-x', note);
        x.type = 'button';
        x.innerHTML = icon('x', 16);
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => {
          note.style.visibility = 'hidden';
          env.log('note-close');
        });
        // a scrolling page gets room below its end, so a control docked at the end can scroll clear of the toast
        if (ctx.scrollable) el('div', 'rs-note-room', document.body).style.height = Math.ceil(note.getBoundingClientRect().height) + 24 + 'px';
      }

      // Scrollable pages: the stage is at least the visible area under the frame.
      if (ctx.scrollable) {
        const below = [...main.children]
          .filter((c) => c !== stage && c !== head)
          .reduce((a, c) => a + c.getBoundingClientRect().height, 0);
        const st = stage.getBoundingClientRect().top + window.scrollY;
        stage.style.minHeight = Math.max(300, Math.floor(H - st - below - (display === 'toast' ? 84 : 0))) + 'px';
      }
      return { stage, submit };
    },

    overlay(ctx) {
      const { rng, util, kind } = ctx;
      const el = util.el;
      const B = ctx.content && ctx.content.BANNER_TEXTS;
      const fromBank = B && B[kind === 'banner' ? 'notice' : kind];
      const entry = fromBank && fromBank.length ? rng.pick(fromBank) : null;
      const FALL = {
        cookie: 'We use cookies to keep you signed in and to understand how the app is used.',
        toast: 'Your export is ready to download.',
        chat: 'Hi there! Questions about your workspace settings? We are here to help.',
        promo: 'Upgrade to the Business plan for SSO, audit logs and priority support.',
        banner: 'Scheduled maintenance on Sunday 02:00-03:00 UTC. Some settings may be read-only.',
      };
      const text = entry ? entry.text || String(entry) : FALL[kind] || FALL.toast;
      const btns = entry && entry.buttons && entry.buttons.length ? entry.buttons : null;
      const ov = el('div', `rs-ov rs-ov-${kind}`, document.body);
      ov.dataset.role = 'overlay';
      const b = (parent, cls, label, how) => {
        const x = el('button', cls, parent, label);
        x.type = 'button';
        x.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return x;
      };
      let dismiss;
      if (kind === 'cookie') {
        el('b', 'rs-ov-h', ov, rng.pick(['Cookie preferences', 'Your privacy', 'We use cookies']));
        el('div', 'rs-ov-t', ov, text);
        const row = el('div', 'rs-ov-row', ov);
        b(row, 'rs-btn rs-ghost rs-sm', btns && btns[2] ? btns[2] : 'Customize', null);
        if (rng.bool(0.6)) b(row, 'rs-btn rs-sm', btns && btns[1] ? btns[1] : 'Reject all', 'reject');
        dismiss = b(row, 'rs-btn rs-primary rs-sm', btns ? btns[0] : 'Accept all', 'accept');
      } else if (kind === 'toast') {
        ov.insertAdjacentHTML('beforeend', icon('check', 18, 2.2));
        el('div', 'rs-ov-t', ov, text);
        dismiss = b(ov, 'rs-ov-x', '', 'close');
        dismiss.innerHTML = icon('x', 15);
        dismiss.setAttribute('aria-label', 'Dismiss');
      } else if (kind === 'chat') {
        const h = el('div', 'rs-ov-chat-h', ov);
        el('span', 'rs-ov-chat-av', h, rng.pick(['R', 'S', 'M', 'J']));
        el('b', '', h, rng.pick(['Support', 'Help desk', 'Customer success']));
        dismiss = b(h, 'rs-ov-x', '', 'close');
        dismiss.innerHTML = icon('x', 15);
        dismiss.setAttribute('aria-label', 'Close chat');
        el('div', 'rs-ov-t', ov, text);
        const r = el('div', 'rs-ov-reply', ov, rng.pick(['Write a reply…', 'Type your message…']));
        r.addEventListener('click', () => env.log('overlay-click', { label: 'reply' }));
      } else if (kind === 'promo') {
        const box = el('div', 'rs-ov-box', ov);
        const x = b(box, 'rs-ov-x rs-ov-corner', '', null);
        x.innerHTML = icon('x', 16);
        el('div', 'rs-ov-badge', box, rng.pick(['New', 'Limited offer', 'Upgrade']));
        el(
          'b',
          'rs-ov-h',
          box,
          rng.pick(['Unlock more with Business', 'Your team is growing', 'Try advanced security']),
        );
        el('div', 'rs-ov-t', box, text);
        const row = el('div', 'rs-ov-row', box);
        dismiss = b(
          row,
          'rs-btn rs-ghost',
          btns && btns[1] ? btns[1] : rng.pick(['Maybe later', 'No thanks', 'Not now']),
          'close',
        );
        b(row, 'rs-btn rs-primary', btns ? btns[0] : 'Upgrade', null);
      } else {
        ov.insertAdjacentHTML('beforeend', icon('info', 17));
        el('div', 'rs-ov-t', ov, text);
        const lm = el('a', 'rs-ov-link', ov, 'Learn more');
        lm.href = '#';
        lm.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('overlay-click', { label: 'Learn more' });
        });
        dismiss = b(ov, 'rs-btn rs-sm rs-ov-dis', 'Dismiss', 'close');
      }
      return { el: ov, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
  });
})();
