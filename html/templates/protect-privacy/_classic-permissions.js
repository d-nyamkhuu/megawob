/* protect-privacy/classic: permissions parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-permissions', () => ({
    install(BASE, state) {
      BASE.chips = (m) => {
        for (const p of state.spec.asks) if (m.perm[p] !== 'ask') state.P.element('span', 'sp-pchip', state.permChips, `${state.D.permissionIcons[p]} ${m.perm[p] === 'allow' ? 'on' : 'blocked'}`);
      };

      BASE.page = (main, m) => {
        const pg = state.P.element('div', 'sp-stagepg', main);
        const needs = state.spec.needs;
        const blocked = needs.filter((p) => m.perm[p] === 'block');
        if (m.done) {
          const msg = { meet: 'You joined the call', scan: 'Scanner ready: hold your ID card in the frame', track: 'Showing your location on the map',
            memo: 'Recording…', remind: 'Reminders are on', paste: 'Pasted from clipboard', friends: 'Finding friends from your contacts…' }[state.spec.site];
          state.P.element('div', 'sp-ok', pg, `✓ ${msg}`);
        }
        if (needs.includes('camera')) state.P.element('div', `sp-cam${m.perm.camera === 'allow' ? ' on' : ''}`, pg, m.perm.camera === 'allow' ? '' : 'Camera is off');
        else state.P.element('div', 'sp-cam', pg, `${state.D.permissionIcons[needs[0]]} ${state.spec.task[0].toUpperCase()}${state.spec.task.slice(1)}`).style.background = 'color-mix(in srgb, var(--fg) 12%, var(--panel))';
        state.P.element('div', 'sp-h2', pg, { meet: 'Ready to join?', scan: 'Scan your ID', track: 'Track your delivery', memo: 'Leave a voice note', remind: 'Appointment reminders',
          paste: 'Paste your text', friends: 'Find your friends' }[state.spec.site]);
        if (state.spec.gate && m.perm[state.spec.gate] !== 'allow') state.P.element('div', 'sp-warn', pg, `To continue, allow ${state.orgName} to access your ${state.fam.PERM_LABEL[state.spec.gate]}.`);
        if (blocked.length) state.P.element('div', 'sp-warn', pg, `${blocked.map((p) => state.fam.PERM_LABEL[p]).join(' and ')} ${blocked.length > 1 ? 'are' : 'is'} blocked for this site. Use the site settings in the address bar to allow ${blocked.length > 1 ? 'them' : 'it'}.`);
        const ready = state.fam.ready(m, state.spec) && !state.fam.prompt(m, state.spec);
        state.P.key(state.P.element('button', `sp-btn pri${ready ? '' : ' dis'}`, pg, state.spec.action), 'action');
      };

      BASE.prompt = (m, p) => {
        if (p && !m.panel) {
          const bub = state.P.element('div', 'sp-bubble', state.app);
          state.P.element('div', 'q', bub, `${state.spec.host} wants to`);
          const w = state.P.element('div', 'what', bub);
          state.P.element('span', '', w, state.D.permissionIcons[p]); state.P.element('span', '', w, state.D.permissionAsks[p]);
          const row = state.P.element('div', 'row', bub);
          const permission = env.content.PERMISSIONS.find((x) => x.id === p) || { trap: 'Allow', safe: 'Block' };
          state.P.key(state.P.element('button', 'sp-btn', row, permission.safe), 'prompt:block');
          state.P.key(state.P.element('button', 'sp-btn', row, permission.trap), 'prompt:allow');
        }
      };

      BASE.settings = (m) => {
        if (m.panel) {
          state.lock.classList.add('on');
          const ss = state.P.element('div', 'sp-ss', state.app);
          state.P.element('div', '', ss, state.spec.host).style.fontWeight = '650';
          state.P.element('div', 'sp-muted', ss, '#lock Connection is secure').style.cssText = 'font-size:12px;margin:2px 0 8px';
          for (const q of state.spec.asks) { state.P.permissionRow(ss, q, m); }
          state.P.element('div', 'sp-sep', ss);
          state.P.element('div', 'sp-muted', ss, 'Cookies and site data · Site settings').style.fontSize = '12px';
        } else state.lock.classList.remove('on');
      };

      BASE.permissionRow = (ss, q, m) => {
        const r = state.P.element('div', 'sp-ssrow', ss);
        state.P.element('span', '', r, state.D.permissionIcons[q]);
        state.P.element('span', 'lb', r, state.fam.PERM_LABEL[q]);
        const seg = state.P.element('span', 'sp-seg', r);
        state.P.key(state.P.element('span', m.perm[q] === 'allow' ? 'on' : '', seg, 'Allow'), `set:${q}:allow`);
        state.P.key(state.P.element('span', m.perm[q] === 'block' ? 'on' : '', seg, 'Block'), `set:${q}:block`);
      };

      BASE.view = (m) => {
        state.P.chips(m);
        const main = state.P.element('div', 'sp-main', state.app);
        state.P.siteHead(main, ['Help', state.U.first]);
        state.P.page(main, m);
        const p = state.fam.prompt(m, state.spec);
        state.P.prompt(m, p);
        state.P.settings(m);
      };
    },
  }));
})();
