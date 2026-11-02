/* protect-privacy/classic: frame parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-frame', () => ({
    install(BASE, state) {
      BASE.fit = (ctx) => {
        const W = ctx.size.width;
        const H = ctx.size.height;
        const M = state.D.margin;
        const fullW = Math.max(state.D.minWindow, W - 2 * M);
        const fullH = Math.max(state.D.minWindow, H - 2 * M);
        const winW = Math.round(fullW < state.D.widthBreak ? fullW : Math.max(state.D.widthMin, Math.min(state.D.widthMax, fullW * state.rng.float(state.D.widthScale, 1))));
        const winH = Math.round(fullH < state.D.heightBreak ? fullH : Math.max(state.D.heightMin, Math.min(state.D.heightMax, fullH * state.rng.float(state.D.heightScale, 1))));
        const ax = state.rng.pick(['left', 'center', 'center', 'right']);
        return { M, fullW, fullH, winW, winH, ax };
      };
      BASE.frame = (ctx) => {
        const { M, fullW, fullH, winW, winH, ax } = state.geo;
        state.win = state.P.element('div', 'sp-win', ctx.stage);
        state.win.style.width = `${winW}px`;
        state.win.style.height = `${winH}px`;
        state.win.style.left = `${M + (ax === 'left' ? 0 : ax === 'right' ? fullW - winW : Math.round((fullW - winW) / 2))}px`;
        state.win.style.top = `${M + Math.round((fullH - winH) / 2)}px`;
        state.narrow = winW < state.D.widthBreak;
        state.sideW = state.narrow ? state.D.sideNarrow : state.D.sideWide;
        return state.win;
      };
      BASE.tabs = (ctx) => {
        const tabs = state.P.element('div', 'sp-tabs', state.win);
        const dots = state.P.element('div', 'sp-dots', tabs);
        state.P.element('i', '', dots); state.P.element('i', '', dots); state.P.element('i', '', dots);
        const tabTitle = {
          wrongfield: `${state.spec.title || ''} · ${state.orgName}`, share: `${state.spec.doc || ''} - ${state.orgName}`, overshare: state.spec.mode === 'email' ? `Inbox - ${state.U.email}` : `Help center · ${state.orgName}`,
          redact: `${state.spec.file || ''} - ${state.orgName} PDF`, permissions: state.orgName, autofill: `Checkout · ${state.orgName}`, export: `${state.spec.table || ''} · ${state.orgName}`,
          visibility: state.orgName, retention: `Data & privacy · ${state.orgName}`,
        }[state.spec.scenario];
        const tab = state.P.element('div', 'sp-tab', tabs);
        state.P.element('span', 'sp-fav', tab, state.orgName[0]);
        state.P.element('span', '', tab, tabTitle);
        if (state.rng.bool(0.6)) { const t2 = state.P.element('div', 'sp-tab off', tabs); state.P.element('span', 'sp-fav', t2, 'Q').style.background = state.D.inactiveTabColor; state.P.element('span', '', t2, state.rng.pick(state.D.otherTabs)); }
      };
      BASE.address = (ctx) => {
        const bar = state.P.element('div', 'sp-bar', state.win);
        state.P.element('span', 'sp-nav', bar, '‹'); state.P.element('span', 'sp-nav', bar, '›'); state.P.element('span', 'sp-nav', bar, '↻');
        const omni = state.P.element('div', 'sp-omni', bar);
        state.lock = state.P.element('span', 'sp-lock', omni);
        state.lock.innerHTML = state.spec.scenario === 'permissions' ? state.D.settingsIcon : state.D.lockIcon;
        if (state.spec.scenario === 'permissions') state.P.key(state.lock, 'lock');
        const host = state.spec.scenario === 'permissions' ? state.spec.host : state.spec.scenario === 'share' ? `docs.${state.spec.org.domain}` : state.spec.scenario === 'overshare' && state.spec.mode === 'email' ? 'mail.quillpost.com' : state.spec.org.domain;
        const path = {
          wrongfield: `/${state.spec.form}`, share: `/d/${(state.spec.doc || '').length.toString(36)}x${state.rng.int(1000, 9999)}/edit`, overshare: state.spec.mode === 'email' ? '/inbox' : '/help/chat',
          redact: `/pdf/${state.spec.file}`, permissions: state.spec.path, autofill: '/checkout/shipping', export: `/crm/${(state.spec.table || '').toLowerCase()}`,
          visibility: state.spec.mode === 'post' ? '/home' : '/settings/profile', retention: '/account/privacy',
        }[state.spec.scenario];
        const url = state.P.element('span', 'sp-url', omni);
        url.append('https://');
        state.P.element('b', '', url, host);
        url.append(path);
        state.permChips = state.P.element('span', '', omni);
        state.permChips.style.display = 'flex'; state.permChips.style.gap = '4px'; state.permChips.style.marginLeft = 'auto';
        state.P.element('span', 'sp-ext', bar);
      };
      BASE.layout = (ctx) => {
        state.app = state.P.element('div', 'sp-app', state.win);
        return state.app;
      };
    },
  }));
})();
