/*
 * mock-inbox: a frozen, eval-only replica of a generic webmail product as an organisation hosts it (a
 * university or company portal around a mail client). Held out: never trained on (see README.md).
 *
 * Chrome (sampled per episode from ctx.rng):
 *   theme          light (60%), dark (30%) or high contrast (10%), with an accent from the theme's set and
 *                  one of four font stacks
 *   portal bar     organisation mark and name, optional portal nav (Home, Mail, Calendar, ...), an inert
 *                  portal search box, 0-2 inert decoy buttons, an avatar; labels sometimes in another
 *                  language (de, fr, es, pt, nl, it) while the instruction stays English
 *   breadcrumb     "Home > Mail > Inbox" under the portal bar on tall viewports (inert)
 *   app strip      a narrow left strip of portal apps (Mail, Calendar, People, Files, Tasks; inert)
 *   instruction    ctx.display: header (a task strip under the portal bar), panel (a side card, left or
 *                  right), toast (a card at the bottom left with a close button) or hidden
 *   end control    placement: portal bar button, task-strip button (header display), side-panel button
 *                  (panel display), footer button, footer text link, check icon button, floating button;
 *                  none when ctx.finish. Labels from a webmail-safe list (never Send, Save, Undo, Delete,
 *                  Archive or Move: those are mail actions), 15% localised.
 *   decoys         inert buttons log 'decoy'; one in two episodes also has a "tip" card whose button
 *                  carries the end control's label but only logs (label collision)
 *   footer         copyright, policy links, last sign-in line (inert), when the viewport is tall enough
 *   stage          stage.dataset.align (left | center | right) and .valign (top | middle) tell widgets where
 *                  to place their app
 * Overlays (overlay(ctx)): cookie bar, sign-in toast (expires), help-desk chat bubble, storage promo
 * modal, maintenance banner; each returns its dismiss control.
 */
(function () {
  'use strict';

  const THEMES = {
    light: {
      vars: { bg: '#eef2f8', page: '#f6f8fc', panel: '#ffffff', fg: '#1f1f1f', muted: '#5e6470', line: '#dfe3ea',
        hover: 'rgba(32,33,36,.06)', soft: '#eaf0fb', shadow: 'rgba(32,40,60,.16)', portal: '#ffffff', unreadbg: '#ffffff', readbg: '#f2f6fc' },
      accents: [['#0b57d0', '#ffffff'], ['#0f6cbd', '#ffffff'], ['#b3261e', '#ffffff'], ['#0b7a55', '#ffffff'], ['#6a3fb5', '#ffffff'], ['#a64d00', '#ffffff']],
    },
    dark: {
      vars: { bg: '#0e1014', page: '#14171c', panel: '#1d2027', fg: '#e6e8ec', muted: '#a3a9b4', line: '#353a45',
        hover: 'rgba(255,255,255,.07)', soft: '#26303f', shadow: 'rgba(0,0,0,.5)', portal: '#181b21', unreadbg: '#232731', readbg: '#1b1e25' },
      accents: [['#8ab4f8', '#0b1d3a'], ['#79c0ff', '#06223b'], ['#f2b8b5', '#3a0b08'], ['#7dd3a8', '#06301d'], ['#c8b6ff', '#22124a']],
    },
    contrast: {
      vars: { bg: '#000000', page: '#000000', panel: '#000000', fg: '#ffffff', muted: '#e2e2e2', line: '#ffffff',
        hover: 'rgba(255,255,255,.16)', soft: '#1a1a1a', shadow: 'rgba(0,0,0,0)', portal: '#000000', unreadbg: '#000000', readbg: '#0d0d0d' },
      accents: [['#ffd400', '#000000'], ['#00e5ff', '#000000']],
    },
  };
  const FONTS = [
    '"Segoe UI", "Liberation Sans", Arial, sans-serif',
    'Roboto, "Helvetica Neue", Arial, "Liberation Sans", sans-serif',
    'Lato, "Segoe UI", "DejaVu Sans", sans-serif',
    '"DejaVu Sans", Verdana, "Liberation Sans", sans-serif',
  ];
  const ORGS = ['Northfield University', 'Cedar Valley Schools', 'Harbor & Pine', 'Lumen Health', 'Brightwater Council',
    'Atlas Freight', 'Riverside College', 'Meridian Labs', 'Kestrel Insurance', 'Oakmont Library', 'Bluefin Studios',
    'Summit County', 'Greywell Partners', 'Larch Institute'];
  // Chrome strings per language. The instruction itself is always English.
  const STR = {
    en: { nav: ['Home', 'Mail', 'Calendar', 'Directory', 'Files', 'Help desk', 'Intranet', 'Timesheets'], search: 'Search the portal',
      end: ['Done', 'Submit', 'Finish', "I'm done", 'Complete', 'Finish task', 'Mark complete', 'All set', 'Submit answer', 'Finalize'],
      decoys: ['Help', 'Feedback', 'What\'s new', 'Keyboard shortcuts', 'Settings', 'Report a problem', 'Language', 'Change theme', 'Notifications'],
      task: ['Your task', 'Task', 'Instructions', 'To do'], crumbs: ['Home', 'Mail'], foot: ['Terms', 'Privacy', 'Accessibility', 'Status'],
      signin: 'Last sign-in: today from this device', tip: ['Tip: sort with labels to keep your inbox tidy.', 'New: offline access is available.', 'Tip: star messages to find them fast.'] },
    de: { nav: ['Start', 'Mail', 'Kalender', 'Verzeichnis', 'Dateien', 'Support'], search: 'Portal durchsuchen', end: ['Fertig', 'Abschließen', 'Erledigt'],
      decoys: ['Hilfe', 'Feedback', 'Einstellungen', 'Neuigkeiten'], task: ['Aufgabe'], crumbs: ['Start', 'Mail'], foot: ['Nutzungsbedingungen', 'Datenschutz', 'Barrierefreiheit'],
      signin: 'Letzte Anmeldung: heute', tip: ['Tipp: Labels halten den Posteingang übersichtlich.'] },
    fr: { nav: ['Accueil', 'Messagerie', 'Agenda', 'Annuaire', 'Fichiers', 'Assistance'], search: 'Rechercher', end: ['Terminé', 'Valider', 'Terminer'],
      decoys: ['Aide', 'Avis', 'Paramètres', 'Nouveautés'], task: ['Tâche'], crumbs: ['Accueil', 'Messagerie'], foot: ['Conditions', 'Confidentialité', 'Accessibilité'],
      signin: "Dernière connexion : aujourd'hui", tip: ['Astuce : les libellés gardent la boîte de réception en ordre.'] },
    es: { nav: ['Inicio', 'Correo', 'Calendario', 'Directorio', 'Archivos', 'Soporte'], search: 'Buscar en el portal', end: ['Listo', 'Terminar', 'Finalizar'],
      decoys: ['Ayuda', 'Comentarios', 'Configuración', 'Novedades'], task: ['Tarea'], crumbs: ['Inicio', 'Correo'], foot: ['Términos', 'Privacidad', 'Accesibilidad'],
      signin: 'Último acceso: hoy', tip: ['Consejo: usa etiquetas para ordenar tu correo.'] },
    pt: { nav: ['Início', 'E-mail', 'Agenda', 'Diretório', 'Arquivos', 'Suporte'], search: 'Pesquisar no portal', end: ['Concluir', 'Pronto', 'Finalizar'],
      decoys: ['Ajuda', 'Feedback', 'Configurações', 'Novidades'], task: ['Tarefa'], crumbs: ['Início', 'E-mail'], foot: ['Termos', 'Privacidade', 'Acessibilidade'],
      signin: 'Último acesso: hoje', tip: ['Dica: use marcadores para organizar a caixa de entrada.'] },
    nl: { nav: ['Start', 'Mail', 'Agenda', 'Adresboek', 'Bestanden', 'Helpdesk'], search: 'Zoeken in portaal', end: ['Klaar', 'Voltooien', 'Afronden'],
      decoys: ['Help', 'Feedback', 'Instellingen', 'Nieuw'], task: ['Taak'], crumbs: ['Start', 'Mail'], foot: ['Voorwaarden', 'Privacy', 'Toegankelijkheid'],
      signin: 'Laatst aangemeld: vandaag', tip: ['Tip: labels houden je inbox overzichtelijk.'] },
    it: { nav: ['Home', 'Posta', 'Calendario', 'Rubrica', 'File', 'Assistenza'], search: 'Cerca nel portale', end: ['Fatto', 'Completa', 'Fine'],
      decoys: ['Aiuto', 'Feedback', 'Impostazioni', 'Novità'], task: ['Attività'], crumbs: ['Home', 'Posta'], foot: ['Termini', 'Privacy', 'Accessibilità'],
      signin: 'Ultimo accesso: oggi', tip: ['Suggerimento: usa le etichette per ordinare la posta.'] },
  };
  const APPS = [['Mail', 'M3 6h18v12H3z M3 6l9 7 9-7'], ['Calendar', 'M4 5h16v15H4z M4 9h16 M8 3v4 M16 3v4'],
    ['People', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6 M16 5.5a3 3 0 0 1 0 5.6 M18 14.5c1.8.8 3 2.8 3 5.5'],
    ['Files', 'M4 4h6l2 2h8v13H4z'], ['Tasks', 'M5 12l3 3 6-7 M4 4h16v16H4z'], ['Notes', 'M6 3h9l4 4v14H6z M14 3v5h5']];
  const icon = (d, size = 20) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

  const OVERLAY = {
    cookie: ['We use cookies to keep you signed in and to measure how the portal is used.',
      'This portal stores small files on your device. Choose which optional cookies we may set.',
      'Cookies help us remember your mailbox settings and keep your account secure.'],
    toast: [['New sign-in', 'Your account was just used on a new device.'], ['Mailbox synced', 'All folders are up to date.'],
      ['Offline mail', 'Offline access is ready on this computer.'], ['Calendar', 'Team sync starts in 10 minutes.']],
    chat: [['Help desk', 'Hi! Having trouble with your mailbox? Ask us here.'], ['IT support', 'Your new mailbox is ready. Questions? Chat with us.'],
      ['Portal assistant', 'Need help finding a message? I can help.']],
    promo: [['Storage almost full', 'You have used 92% of your mailbox storage. Get more space to keep receiving mail.', 'Get more storage'],
      ['Try the new inbox', 'A cleaner layout, smarter search and fewer clicks. Switch any time.', 'Try it now'],
      ['Turn on desktop notifications', 'Get notified about new mail even when this tab is in the background.', 'Turn on']],
    banner: ['Scheduled maintenance tonight 22:00-23:00. Mail may be slow.', 'Your password expires in 5 days. Change it in account settings.',
      'Mailbox storage is 87% full.', 'You are signed in to a shared mailbox.'],
  };

  function pickTheme(rng) {
    const r = rng.next();
    return r < 0.6 ? 'light' : r < 0.9 ? 'dark' : 'contrast';
  }

  env.site({
    name: 'mock-inbox',
    styles: ['site.css'],
    scripts: [],

    frame(ctx) {
      const { rng, util } = ctx;
      const root = document.documentElement;
      const themeName = pickTheme(rng);
      const theme = THEMES[themeName];
      for (const [k, v] of Object.entries(theme.vars)) root.style.setProperty(`--${k}`, v);
      const [accent, accentFg] = rng.pick(theme.accents);
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent-fg', accentFg);
      root.style.setProperty('--font', rng.pick(FONTS));
      root.dataset.theme = themeName;

      const lang = rng.bool(0.15) ? rng.pick(['de', 'fr', 'es', 'pt', 'nl', 'it']) : 'en';
      const S = STR[lang];
      const W = window.innerWidth;
      const H = window.innerHeight;
      const tall = H >= 700;
      const display = ctx.display || 'header';
      const org = rng.pick(ORGS);
      document.body.className = '';
      document.body.classList.add('ri-body');

      // End control: placement and label.
      const places = ['portal', 'portal', 'footer', 'link', 'icon', 'floating'];
      if (display === 'header') places.push('strip', 'strip');
      if (display === 'panel') places.push('panel', 'panel');
      let placement = ctx.finish ? null : rng.pick(places);
      const label = rng.pick(S.end);
      const footer = display !== 'toast' && (placement === 'footer' || placement === 'link' || (tall && rng.bool(0.5)));
      const collide = rng.bool(0.5); // a tip card whose button carries the end label but only logs
      const decoys = rng.sample(S.decoys, rng.int(0, 2));
      const appStrip = rng.bool(0.45) && !(display === 'panel' && W < 1260);
      const navOn = W >= 1180 && rng.bool(0.6);
      const searchOn = W >= 1100 && rng.bool(0.5);
      const crumbs = tall && display !== 'toast' && rng.bool(0.4);

      const decoyBtn = (parent, text, cls = 'ri-xtra') => {
        const b = util.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { label: text }); });
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = util.el(cls.includes('ri-endlink') ? 'a' : 'button', cls, parent);
        if (b.tagName === 'A') b.href = '#';
        else b.type = 'button';
        if (text === null) b.innerHTML = icon('M5 12.5l4.5 4.5L19 7.5', 20);
        else b.textContent = text;
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      let submit = null;

      // ---- portal bar
      const bar = util.el('header', 'ri-portal', document.body);
      const mark = util.el('div', 'ri-mark', bar);
      const logo = util.el('span', 'ri-logo', mark, org.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase());
      logo.setAttribute('aria-hidden', 'true');
      util.el('span', 'ri-org', mark, W >= 1150 || !navOn ? org : org.split(' ')[0]);
      mark.dataset.role = 'brand';
      if (navOn) {
        const nav = util.el('nav', 'ri-nav', bar);
        const items = S.nav.slice(0, rng.int(4, Math.min(6, S.nav.length)));
        items.forEach((t, k) => {
          const a = util.el('a', 'ri-navlink' + (k === 1 ? ' on' : ''), nav, t);
          a.href = '#';
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: t }); });
        });
      }
      util.el('div', 'ri-grow', bar);
      if (searchOn) {
        const s = util.el('label', 'ri-psearch', bar);
        s.innerHTML = icon('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M16.5 16.5L21 21', 16);
        const inp = util.el('input', '', s);
        inp.type = 'text';
        inp.readOnly = true;
        inp.tabIndex = -1;
        inp.placeholder = S.search;
        inp.dataset.role = 'xtra';
        inp.addEventListener('click', () => env.log('decoy', { what: 'portal-search' }));
      }
      const tools = util.el('div', 'ri-tools', bar);
      for (const d of decoys) decoyBtn(tools, d);
      if (placement === 'portal') submit = endBtn(tools, 'ri-end', label);
      if (placement === 'icon') submit = endBtn(tools, 'ri-end ri-endicon', null);
      const av = util.el('div', 'ri-avatar', bar, rng.pick(['AK', 'JL', 'MR', 'SP', 'TC', 'NW', 'EB']));
      av.dataset.role = 'avatar';
      av.addEventListener('click', () => env.log('decoy', { what: 'avatar' }));

      if (crumbs) {
        const c = util.el('div', 'ri-crumbs', document.body);
        for (const t of S.crumbs.concat(['Inbox'])) {
          const a = util.el('a', '', c, t);
          a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'breadcrumb', label: t }); });
        }
      }

      if (display === 'header') {
        const strip = util.el('div', 'ri-strip', document.body);
        const flag = util.el('span', 'ri-flag', strip);
        flag.innerHTML = icon('M5 21V4 M5 4h11l-2 4 2 4H5', 16);
        util.el('div', 'ri-instruction', strip, ctx.instruction);
        if (placement === 'strip') submit = endBtn(strip, 'ri-end', label);
      }

      // ---- body: app strip, side panel, stage
      const body = util.el('div', 'ri-main', document.body);
      if (appStrip) {
        const st = util.el('aside', 'ri-apps', body);
        APPS.slice(0, rng.int(4, APPS.length)).forEach(([t, d], k) => {
          const b = util.el('button', 'ri-app' + (k === 0 ? ' on' : ''), st);
          b.type = 'button';
          b.innerHTML = icon(d, 19);
          util.el('span', '', b, t);
          b.title = t;
          b.dataset.role = 'nav';
          b.addEventListener('click', () => env.log('decoy', { what: 'app', label: t }));
        });
      }
      let panel = null;
      if (display === 'panel') {
        panel = util.el('aside', 'ri-panel', body);
        if (W < 1200) panel.classList.add('narrow');
        util.el('div', 'ri-panel-title', panel, rng.pick(S.task));
        util.el('div', 'ri-panel-text', panel, ctx.instruction);
        if (placement === 'panel') submit = endBtn(util.el('div', 'ri-panel-row', panel), 'ri-end', label);
        if (rng.bool(0.5)) body.classList.add('panel-right');
      }
      const stage = util.el('main', 'ri-stage', body);
      stage.dataset.align = rng.pick(['center', 'center', 'left', 'right']);
      stage.dataset.valign = rng.pick(['middle', 'top', 'top']);

      // Label-collision decoy: a tip card whose button repeats the end control's label (logs only).
      if (collide && (panel || footer)) {
        const host = panel || null;
        const tip = util.el('div', 'ri-tip', host || document.body);
        if (!host) tip.classList.add('ri-tip-foot');
        util.el('span', '', tip, rng.pick(S.tip));
        decoyBtn(tip, label, 'ri-xtra ri-tipbtn').dataset.collides = '1';
        if (!host) tip.dataset.pending = '1';
      }

      if (display === 'toast') {
        document.body.classList.add('ri-has-note');
        const note = util.el('div', 'ri-note', document.body);
        util.el('div', 'ri-note-title', note, rng.pick(S.task));
        util.el('div', 'ri-note-text', note, ctx.instruction);
        const x = util.el('button', 'ri-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }

      if (footer) {
        const f = util.el('footer', 'ri-foot', document.body);
        util.el('span', 'ri-copy', f, `© 2024 ${org}`);
        for (const t of S.foot.slice(0, rng.int(2, S.foot.length))) {
          const a = util.el('a', 'ri-flink', f, t);
          a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'footer', label: t }); });
        }
        const tip = document.querySelector('.ri-tip[data-pending]');
        if (tip) {
          delete tip.dataset.pending;
          f.append(tip);
        } else if (W >= 1200) util.el('span', 'ri-signin', f, S.signin);
        util.el('div', 'ri-grow', f);
        if (placement === 'footer') submit = endBtn(f, 'ri-end', label);
        if (placement === 'link') submit = endBtn(f, 'ri-endlink', `${label} ›`);
      } else {
        const tip = document.querySelector('.ri-tip[data-pending]');
        if (tip) tip.remove();
      }
      if (placement === 'floating') {
        // Reserve the button's space so it never covers the app.
        const dock = util.el('div', 'ri-fab-dock', document.body);
        submit = endBtn(dock, 'ri-end ri-fab', label);
      }
      if (!ctx.finish && !submit) {
        // Placement fell through (e.g. footer without room): use the portal bar.
        submit = endBtn(tools, 'ri-end', label);
      }
      return { stage, submit };
    },

    overlay(ctx) {
      const { rng, util, kind } = ctx;
      const el = util.el('div', `ri-ov ri-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const btn = (parent, text, how, cls = '') => {
        const b = util.el('button', 'ri-ov-btn ' + cls, parent, text);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label: text })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        util.el('div', 'ri-ov-text', el, rng.pick(OVERLAY.cookie));
        const row = util.el('div', 'ri-ov-row', el);
        if (rng.bool(0.5)) btn(row, 'Manage', null);
        btn(row, rng.pick(['Reject optional', 'Necessary only']), 'reject');
        dismiss = btn(row, rng.pick(['Accept all', 'Accept', 'OK']), 'accept', 'primary');
      } else if (kind === 'toast' || kind === 'chat') {
        const [title, text] = rng.pick(OVERLAY[kind]);
        const ic = util.el('div', 'ri-ov-ic', el);
        ic.innerHTML = kind === 'toast' ? icon('M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z', 18) : icon('M4 5h16v11H9l-5 4z', 18);
        const tx = util.el('div', 'ri-ov-tx', el);
        util.el('b', '', tx, title);
        util.el('div', 'ri-ov-text', tx, text);
        dismiss = btn(el, '×', 'close', 'x');
        dismiss.setAttribute('aria-label', 'Close');
      } else if (kind === 'promo') {
        const [title, text, cta] = rng.pick(OVERLAY.promo);
        const box = util.el('div', 'ri-ov-box', el);
        util.el('h3', '', box, title);
        util.el('div', 'ri-ov-text', box, text);
        const row = util.el('div', 'ri-ov-row', box);
        dismiss = btn(row, rng.pick(['No thanks', 'Not now', 'Maybe later']), 'close');
        btn(row, cta, null, 'primary');
      } else {
        const ic = util.el('div', 'ri-ov-ic', el);
        ic.innerHTML = icon('M12 4l9 16H3z M12 10v4 M12 17v.5', 17);
        util.el('div', 'ri-ov-text', el, rng.pick(OVERLAY.banner));
        dismiss = btn(el, 'Dismiss', 'close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
  });
})();
