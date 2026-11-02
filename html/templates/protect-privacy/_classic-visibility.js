/* protect-privacy/classic: visibility parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-visibility', () => ({
    install(BASE, state) {
      BASE.navigation = (soc) => {
        if (!state.narrow) {
          const nav = state.P.element('div', 'sp-soc-nav', soc);
          const nh = state.P.element('div', '', nav); nh.style.cssText = 'display:flex;align-items:center;gap:8px;color:var(--fg);font-weight:700';
          state.P.element('span', 'sp-logo', nh, state.orgName[0]); state.P.element('span', '', nh, state.orgName);
          for (const x of ['Home', 'Profile', 'Friends', 'Groups', 'Settings']) state.P.element('div', (state.spec.mode === 'post' ? x === (state.spec.group ? 'Groups' : 'Home') : x === 'Settings') ? 'cur' : '', nav, x);
        }
      };

      BASE.post = (feed, m, AUD_SUB) => {
        const card = state.P.element('div', 'sp-card sp-post', feed);
        const top = state.P.element('div', '', card); top.style.cssText = 'display:flex;align-items:center;gap:10px';
        state.P.avatar(top, state.U.full, 36);
        const nm = state.P.element('div', '', top); state.P.element('div', '', nm, state.U.full).style.fontWeight = '650';
        const ab = state.P.element('span', 'sp-rel', nm);
        if (state.spec.group) state.P.element('span', 'sp-audbtn lk', ab, `#globe Public group · ${state.spec.group}`);
        else {
          state.P.key(state.P.element('span', 'sp-audbtn', ab, `${state.D.audienceIcons[m.aud]} ${state.fam.AUD_LABEL[m.aud]} ▾`), 'aud-btn');
          if (m.menu) {
            const mn = state.P.menu(ab, state.fam.AUD.map((a) => ({ k: `aud:${a}`, label: `${state.D.audienceIcons[a]} ${state.fam.AUD_LABEL[a]}`, sub: AUD_SUB[a], v: a })), m.aud);
            mn.style.left = '0'; mn.style.top = '100%';
          }
        }
        if (state.spec.group) state.P.element('div', 'sp-muted', card, 'Posts in this group are public. Anyone can see who is in the group and what they post.').style.cssText = 'font-size:11.5px;margin-top:6px';
        state.P.element('div', 'text', card, state.spec.text);
        const row = state.P.element('div', '', card); row.style.cssText = 'display:flex;align-items:center;gap:12px';
        state.P.element('span', 'sp-muted', row, 'Photo · Feeling · Check in').style.flex = '1';
        if (!m.posted) state.P.key(state.P.element('button', 'sp-btn pri', row, 'Post'), 'post');
        else state.P.element('span', 'sp-ok', row, `${state.D.audienceIcons[m.aud]} Posted · ${state.fam.AUD_LABEL[m.aud]}`);
        state.P.friendPost(feed);
      };

      BASE.profile = (feed, m) => {
        const card = state.P.element('div', 'sp-card sp-post', feed);
        state.P.element('div', 'sp-h2', card, 'Profile details');
        state.P.element('div', 'sp-muted', card, 'Choose who can see each detail on your profile.').style.marginBottom = '6px';
        for (const f of state.spec.fields) { state.P.profileRow(card, f, m); }
        if (state.spec.lockedField) state.P.element('div', 'sp-muted', card, `#lock Your ${state.spec.fields.find((f) => f.id === state.spec.lockedField).label.toLowerCase()} is public on verified creator accounts.`).style.cssText = 'font-size:11.5px;margin-top:6px';
        const row = state.P.element('div', '', card); row.style.cssText = 'display:flex;align-items:center;gap:10px;margin-top:12px';
        state.P.key(state.P.element('button', 'sp-btn pri', row, 'Save'), 'save');
        state.P.element('button', 'sp-btn', row, 'Cancel');
        if (m.saved) state.P.element('span', 'sp-ok', row, 'Profile updated');
      };

      BASE.friendPost = (feed) => {
        const other = state.P.element('div', 'sp-card sp-post', feed);
        const ot = state.P.element('div', '', other); ot.style.cssText = 'display:flex;align-items:center;gap:10px';
        const on = env.content.personName(state.rng.fork('friend'));
        state.P.avatar(ot, on.full, 32); state.P.element('b', '', ot, on.full); state.P.element('span', 'sp-muted', ot, '#people 2h');
        state.P.element('div', '', other, env.content.pick(state.rng.fork('ft'), env.content.POST_TEXTS)).style.marginTop = '8px';
      };

      BASE.profileRow = (card, f, m) => {
        const r = state.P.element('div', 'sp-prow', card);
        state.P.element('span', 'lb', r, f.label);
        state.P.element('span', 'v', r, f.value);
        const ab = state.P.element('span', 'sp-rel', r);
        const locked = state.spec.lockedField === f.id;
        const b = state.P.element('span', `sp-audbtn${locked ? ' lk' : ''}`, ab, locked ? '#lock Public' : `${state.D.audienceIcons[m.aud[f.id]]} ${state.fam.AUD_LABEL[m.aud[f.id]]} ▾`);
        if (!locked) state.P.key(b, `aud-btn:${f.id}`);
        if (m.menu === f.id) {
          const mn = state.P.menu(ab, state.fam.AUD.map((a) => ({ k: `aud:${f.id}:${a}`, label: `${state.D.audienceIcons[a]} ${state.fam.AUD_LABEL[a]}`, v: a })), m.aud[f.id]);
          mn.style.right = '0'; mn.style.top = '100%';
        }
      };

      BASE.view = (m) => {
        const soc = state.P.element('div', 'sp-soc', state.app);
        state.P.navigation(soc);
        const feed = state.P.element('div', 'sp-feed', soc);
        const AUD_SUB = { public: 'Anyone on or off ' + state.orgName, friends: 'Your friends on ' + state.orgName, close: 'Only your close friends list', only: 'Only you can see this' };
        if (state.spec.mode === 'post') { state.P.post(feed, m, AUD_SUB); return; }

        state.P.profile(feed, m);
      };
    },
  }));
})();
