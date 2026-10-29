(function () {
  'use strict';
  function vistaIcon(name) {
    const art = {
      app: `<rect x="1" y="1" width="22" height="22" rx="2" fill="url(#vi-blue)" stroke="#dceeff"/><path d="M3 3H21V21H3Z" fill="none" stroke="#a5c9e8" opacity=".65"/><path d="M13.3 4.5 7.1 11h4L8.9 19 17 10.3h-4.2l2.1-5.8Z" fill="#f0f8ff"/><path d="m6.6 7-2 4 2.1 4M17.3 8.7l2 3.7-2.1 3.6" fill="none" stroke="#b9e1fc" stroke-width="1.2"/>`,
      windows: `<path d="M4.7 4.5C8.7 2.6 11.4 2.8 14.5 4.3L12.1 13C8.9 11.4 6.4 11.3 2.6 13.1Z" fill="url(#vi-red)"/><path d="M15.8 4.9C19 6.5 21.6 6.3 25.4 4.5L23 13.2C19.3 15 16.7 15.3 13.5 13.6Z" fill="url(#vi-green)"/><path d="M2.2 14.5C6 12.7 8.5 12.8 11.7 14.4L9.2 23.3C6 21.7 3.5 21.6-.3 23.4Z" fill="url(#vi-cyan)"/><path d="M13.1 15C16.3 16.6 18.9 16.4 22.6 14.6L20.1 23.5C16.4 25.3 13.8 25.5 10.6 23.9Z" fill="url(#vi-gold)"/>`,
      folder: `<path d="M2 5h7l2 2h11v15H2Z" fill="#e8b345" stroke="#92782e"/><path d="M3 3h6l2 2h9v11H3Z" fill="#fff0a8" stroke="#d1a23b"/><path d="M5 7h15v11H5Z" fill="#e7f7ff"/><path d="M1 9h22l-2 13H3Z" fill="url(#vi-gold)" stroke="#d6a43c"/><path d="M3 10h18" stroke="#fff4bd"/><rect x="7" y="17" width="12" height="6" rx="1" fill="url(#vi-cyan)" stroke="#74a8c5"/><path d="M8 18h10" stroke="#dffbff"/>`,
      mail: `<path d="M7 1h11l4 4v18H7Z" fill="url(#vi-paper)" stroke="#8cacc8"/><path d="M18 1v5h4" fill="#bdd9ef" stroke="#89a9c6"/><path d="M10 8h9M10 11h9M10 14h9M10 17h9M10 20h7" stroke="#87abc9" stroke-width=".8"/><rect x="1" y="7" width="11" height="9" rx="1" fill="url(#vi-blue)" stroke="#6294bc"/><path d="m1.5 7.5 5 4 5-4" fill="none" stroke="#d6f1ff"/><circle cx="5" cy="7" r="2.6" fill="#da684e" stroke="#ffe0d3"/>`,
      media: `<rect x="2" y="2" width="20" height="21" rx="1" fill="url(#vi-paper)" stroke="#7babc7"/><circle cx="12" cy="12.5" r="8" fill="url(#vi-orange)" stroke="#fff3dc"/><path d="m10 7 7 5.5-7 5.5Z" fill="white"/><path d="M3 3h17" stroke="white"/>`,
      network: `<path d="M6 3h16v13H6Z" fill="#294e76" stroke="white" stroke-width="1.3"/><path d="M8 5h12v9H8Z" fill="#87a8bd" opacity=".6"/><path d="M12 16v4h6m-9 1h11M2 7v6m-1-3h3M4 12v6h8" fill="none" stroke="white" stroke-width="1.3"/>`,
      volume: `<path d="M2 9h4l5-5v17l-5-5H2Z" fill="white" stroke="#d7e5f5" stroke-width=".6"/><path d="M14 7q5 5.5 0 11m3-14q8 8.5 0 17m-5-11q2 2.5 0 5" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round"/>`,
      person: `<ellipse cx="12" cy="6.5" rx="4.2" ry="5" fill="currentColor"/><path d="M3 23v-4c0-4 4.5-7 9-7s9 3 9 7v4Z" fill="currentColor"/>`,
      bell: `<path d="M4 16c3-1 2-3 3-8a5 5 0 0 1 10 0c1 5 0 7 3 8v2H4Z" fill="url(#vi-metal)"/><path d="M10 20a2 2 0 0 0 4 0M12 2V.5" fill="none" stroke="#647187" stroke-width="2" stroke-linecap="round"/>`,
      monitor: `<rect x="2" y="2" width="20" height="15" rx="1" fill="#f5f8fc" stroke="#5d6d85" stroke-width="2"/><path d="M5 5h14v9H5Z" fill="url(#vi-metal)"/><path d="M10 18h4v3h4v2H6v-2h4Z" fill="#5d6d85"/>`,
      lock: `<path d="M6 11V7a6 6 0 0 1 12 0v4" fill="none" stroke="#6b7890" stroke-width="2.5"/><rect x="3" y="10" width="18" height="14" rx="2" fill="url(#vi-metal)" stroke="#647087"/>`,
      wrench: `<path d="M21 1a7 7 0 0 0-9 9L2 19a3 3 0 0 0 4 4l10-11a7 7 0 0 0 7-9l-5 5-3-3Z" fill="url(#vi-metal)" stroke="#637189"/><circle cx="4.8" cy="20.5" r="1.1" fill="#f6f8fb"/>`,
      gear: `<defs><linearGradient id="vi-gear-face" x1="0" y1="0" x2=".45" y2="1"><stop stop-color="#d2d6e0"/><stop offset=".32" stop-color="#b3bccd"/><stop offset=".58" stop-color="#8e9cb4"/><stop offset="1" stop-color="#617996"/></linearGradient><radialGradient id="vi-gear-rim"><stop offset=".63" stop-color="#f8fbff"/><stop offset=".68" stop-color="#a4b2c6"/><stop offset="1" stop-color="#647c99"/></radialGradient></defs><path d="m10 1 4 .1.7 3.1 2 .9 2.8-1.6 2.6 3-1.7 2.6.8 2.1 3.1.9-.1 3.8-3.2.7-.9 2 1.6 2.8-3 2.5-2.6-1.7-2.1.8-.9 3.1-3.8-.1-.7-3.2-2-.9-2.8 1.6-2.5-3L3 15.9l-.8-2.1L-.9 13l.1-3.8 3.2-.7.9-2-1.6-2.8 3-2.5 2.6 1.7 2.1-.8Z" transform="translate(1 .75) scale(.92)" fill="#536985" stroke="#566a83" stroke-linejoin="round" stroke-width=".75"/><path d="m10 1 4 .1.7 3.1 2 .9 2.8-1.6 2.6 3-1.7 2.6.8 2.1 3.1.9-.1 3.8-3.2.7-.9 2 1.6 2.8-3 2.5-2.6-1.7-2.1.8-.9 3.1-3.8-.1-.7-3.2-2-.9-2.8 1.6-2.5-3L3 15.9l-.8-2.1L-.9 13l.1-3.8 3.2-.7.9-2-1.6-2.8 3-2.5 2.6 1.7 2.1-.8Z" transform="translate(1 0) scale(.92)" fill="url(#vi-gear-face)" stroke="#69768a" stroke-linejoin="round" stroke-width=".7"/><path d="m10 1 4 .1.7 3.1 2 .9 2.8-1.6 2.6 3-1.7 2.6.8 2.1 3.1.9-.1 3.8-3.2.7-.9 2 1.6 2.8-3 2.5-2.6-1.7-2.1.8-.9 3.1-3.8-.1-.7-3.2-2-.9-2.8 1.6-2.5-3L3 15.9l-.8-2.1L-.9 13l.1-3.8 3.2-.7.9-2-1.6-2.8 3-2.5 2.6 1.7 2.1-.8Z" transform="translate(1.2 .2) scale(.90)" fill="none" stroke="#e6eaf1" stroke-linejoin="round" stroke-width=".24"/><circle cx="12" cy="12" r="5.2" fill="url(#vi-gear-rim)" stroke="#6d7f97" stroke-width=".7"/><circle cx="12" cy="12" r="3.65" fill="#fff" stroke="#b8c5d6" stroke-width=".45"/>`,
    };
    return `<svg class="vista-svg" aria-hidden="true" viewBox="0 0 24 24"><defs><linearGradient id="vi-blue" x2=".8" y2="1"><stop stop-color="#a7d5f1"/><stop offset=".45" stop-color="#3a7aac"/><stop offset="1" stop-color="#205781"/></linearGradient><linearGradient id="vi-metal" x2=".3" y2="1"><stop stop-color="#b0b9c9"/><stop offset=".47" stop-color="#8b95a8"/><stop offset="1" stop-color="#596a84"/></linearGradient><linearGradient id="vi-paper" x2=".6" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a9c9e0"/></linearGradient><linearGradient id="vi-gold" x2=".3" y2="1"><stop stop-color="#ffe8a1"/><stop offset=".45" stop-color="#f6cb58"/><stop offset="1" stop-color="#c88d1b"/></linearGradient><linearGradient id="vi-cyan" x2=".4" y2="1"><stop stop-color="#1264b8"/><stop offset=".5" stop-color="#23b7ed"/><stop offset="1" stop-color="#b7f2fd"/></linearGradient><linearGradient id="vi-green" x2=".5" y2="1"><stop stop-color="#92bb31"/><stop offset=".5" stop-color="#b5d642"/><stop offset="1" stop-color="#417d20"/></linearGradient><linearGradient id="vi-red" x2=".5" y2="1"><stop stop-color="#ffac47"/><stop offset=".4" stop-color="#ed4b24"/><stop offset="1" stop-color="#ae2c18"/></linearGradient><linearGradient id="vi-orange" x2=".5" y2="1"><stop stop-color="#ffc76c"/><stop offset=".5" stop-color="#f3952b"/><stop offset="1" stop-color="#d8640b"/></linearGradient></defs>${art[name] || art.app}</svg>`;
  }
  function setIcon(el, name) {
    el.innerHTML = vistaIcon(name);
    return el;
  }
  // The Preferences screen is part of this workspace, independent of popup perturbations.
  function createPreferences(u) {
    const el = u.el('section', 'reference-overlay promo');
    u.el('h2', '', el, 'Application Preferences');
    u.el('div', 'overlay-copy', el, 'Customize your experience in Social Manager.');
    const gear = setIcon(u.el('span', 'preferences-gear', el), 'gear');
    const cover = u.el('section', 'preferences-cover', el);
    const sidebar = u.el('nav', 'preferences-sidebar', cover);
    for (const [icon, label] of [
      ['gear', 'General'],
      ['bell', 'Notifications'],
      ['monitor', 'Appearance'],
      ['person', 'Accounts'],
      ['lock', 'Privacy'],
      ['wrench', 'Advanced'],
    ]) {
      const row = u.el('div', 'preference-category' + (label === 'General' ? ' on' : ''), sidebar);
      setIcon(u.el('span', 'category-icon', row), icon);
      u.el('span', '', row, label);
    }
    const settings = u.el('div', 'preferences-settings', cover);
    u.el('h3', '', settings, 'General Settings');
    const launch = u.el('div', 'preference-field', settings);
    u.el('span', '', launch, 'Start on launch:');
    u.el('button', 'preference-value', launch, 'Home timeline').type = 'button';
    const checks = u.el('div', 'preference-checks', settings);
    for (const [text, checked] of [
      ['Show unread count in taskbar', true],
      ['Play a sound for new notifications', true],
      ['Minimize to system tray', false],
    ]) {
      const l = u.el('label', '', checks);
      const c = u.el('input', '', l);
      c.type = 'checkbox';
      c.checked = checked;
      l.append(text);
    }
    const locale = u.el('div', 'preferences-locale', settings);
    for (const [label, value] of [
      ['Language', 'English (United States)'],
      ['Time zone', '(UTC-05:00) Eastern Time (US & Canada)'],
      ['Auto-refresh timeline', 'Every 5 minutes'],
    ]) {
      const l = u.el('div', 'preference-field' + (label === 'Auto-refresh timeline' ? ' refresh' : ''), locale);
      u.el('span', '', l, label + ':');
      const val = u.el('button', 'preference-value' + (label === 'Time zone' ? ' wide' : ''), l, value);
      val.type = 'button';
      val.addEventListener('click', () => env.log('decoy', { what: label }));
    }
    const tools = u.el('div', 'preferences-tools', cover);
    for (const label of ['Restore Defaults', 'Apply']) {
      const btn = u.el('button', label === 'Apply' ? 'apply' : '', tools, label);
      btn.type = 'button';
      btn.addEventListener('click', () => env.log('decoy', { what: label }));
    }
    return el;
  }

  // Keep the template's instruction handling inside the original briefing card.
  function moveInstruction(source, note) {
    if (!source) return;
    env.util.el('p', '', note, source.textContent);
    source.remove();
    note.hidden = false;
  }

  const vista = {
    bg: '#c7dced', panel: '#ffffff', fg: '#14376d', accent: '#7db0df',
    font: 'Segoe UI,Tahoma,Arial,sans-serif', line: '#bebebe', muted: '#5e6779',
  };

  env.site({
    name: 'design-use-social-feed-one-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { vista },
      LOW_THEME: vista,
      ACCENTS: [vista.accent],
      LOW_ACCENTS: [vista.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This frame has a permanent left briefing column even at small viewports.
          _c.display = _c.ctx.display;
          document.body.className = 'side-left instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const titlebar = u.el('header', 'design-header', shell);
          setIcon(u.el('span', 'win-ico', titlebar), 'app');
          u.el('div', 'design-brand', titlebar, 'Social Manager');
          const wc = u.el('div', 'win-ctl', titlebar);
          u.el('span', 'wc-min', wc, '▁');
          u.el('span', 'wc-max', wc, '▣');
          u.el('span', 'wc-close', wc, '×');
          const body = u.el('div', 'design-body ref-body', shell);
          const tabs = u.el('nav', 'design-nav', body);
          Object.assign(_c, { shell, body, tabs, header: tabs });
        },
        'frame.nav': () => (_c) => {
          const { util: u, tabs } = _c;
          for (const t of ['Home', 'Tasks', 'Preferences']) {
            u.el('button', 'tab' + (t === 'Preferences' ? ' on' : ''), tabs, t).type = 'button';
          }
          const who = u.el('span', 'who', tabs);
          setIcon(u.el('span', 'who-icon', who), 'person');
          who.append('Signed in as alex.rivera  ▾');
        },
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const { body, header, util: u } = _c;
          const note = u.el('section', 'task-note', body);
          note.dataset.role = 'instruction';
          note.hidden = true;
          u.el('h2', '', note, 'Task');
          moveInstruction(header.querySelector('.ref-instruction'), note);
          Object.assign(_c, { note });
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            moveInstruction(panel.querySelector('.ref-panel-text'), _c.note);
            panel.remove();
          }
          _c.body.classList.remove('ref-panel-right');
        },
        'frame.stage': () => (_c) => {
          const { body, tabs, util: u } = _c;
          const stage = u.el('main', 'stage', body);
          const navButtons = Array.from(tabs.querySelectorAll('.tab'));
          let preferences;
          const selectWorkspace = (showPreferences) => {
            preferences.el.hidden = !showPreferences;
            stage.dataset.workspace = showPreferences ? 'preferences' : 'task';
            const feed = stage.querySelector('.as-page');
            if (feed) feed.inert = showPreferences;
            navButtons.forEach((button, index) => {
              const selected = showPreferences ? index === 2 : index === 1;
              button.classList.toggle('on', selected);
              button.setAttribute('aria-selected', String(selected));
            });
          };
          preferences = { el: createPreferences(u) };
          preferences.el.classList.add('workspace-preferences');
          preferences.el.setAttribute('aria-label', 'Application Preferences');
          stage.append(preferences.el);
          navButtons.forEach((button, index) => button.addEventListener('click', () => selectWorkspace(index === 2)));
          const taskButton = navButtons[1];
          taskButton.setAttribute('aria-label', 'Task');
          stage.socialWorkspace = {
            taskButton,
            mount: () => {
              stage.append(preferences.el);
              selectWorkspace(!preferences.el.hidden);
            },
            get covered() {
              return !preferences.el.hidden;
            },
            reveal: () => selectWorkspace(false),
          };
          // All supported pointer gestures can recover through the visible Task tab.
          taskButton.addEventListener('pointerdown', () => selectWorkspace(false));
          taskButton.addEventListener('pointermove', () => selectWorkspace(false));
          taskButton.addEventListener('wheel', () => selectWorkspace(false));
          selectWorkspace(true);

          Object.assign(_c, { stage });
        },
        'frame.end': (base) => (_c) => {
          const { shell, tabs, util: u, placement, submit, headerTools } = _c;
          const footer = u.el('footer', 'design-footer', shell);
          const srow = u.el('div', 'submit-row', footer);
          const tb = u.el('div', 'taskbar', footer);
          const orb = u.el('span', 'start-orb', tb);
          setIcon(u.el('span', 'windows-flag', orb), 'windows');
          const pins = u.el('div', 'taskbar-pins', tb);
          for (const [cls, icon] of [
            ['folder-icon', 'folder'],
            ['document-icon', 'mail'],
            ['media-icon', 'media'],
          ])
            setIcon(u.el('span', cls, pins), icon);
          const app = u.el('span', 'tb-app', tb);
          setIcon(u.el('span', 'win-ico', app), 'app');
          app.append('Social Manager');
          const tray = u.el('div', 'tb-tray', tb);
          u.el('span', 'tray-arrow', tray, '▴');
          setIcon(u.el('span', 'network-icon', tray), 'network');
          setIcon(u.el('span', 'speaker-icon', tray), 'volume');
          u.el('span', 'tb-clock', tb, '10:24 AM\nTue, Apr 22, 2025');

          // Reuse the template's labels, placement choices, decoys and finish route.
          for (const decoy of document.querySelectorAll('.ref-xtra')) {
            decoy.classList.add('chrome-xtra');
            srow.append(decoy);
          }
          if (submit) {
            const inHeader = placement === 'header' || placement === 'icon';
            submit.classList.add('end-control');
            if (inHeader) {
              submit.classList.add('end-header');
              tabs.append(submit);
            } else {
              if (placement === 'link') submit.classList.add('end-link');
              srow.append(submit);
            }
          }
          headerTools.remove();
          for (const extra of document.querySelectorAll('.ref-foot, .ref-float-dock, .ref-spacer')) extra.remove();
          return base(_c);
        },
      },
    },
  });
})();
