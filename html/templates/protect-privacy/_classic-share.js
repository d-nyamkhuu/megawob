/* protect-privacy/classic: share parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-share', () => ({
    install(BASE, state) {
      BASE.document = (m) => {
        const doc = state.P.element('div', 'sp-doc', state.app);
        state.P.documentHeader(doc, m);
        state.P.documentPaper(doc);
      };

      BASE.dialog = (m) => {
        const scrim = state.P.element('div', 'sp-scrim', state.app);
        const dlg = state.P.element('div', 'sp-dlg sp-share', scrim);
        state.P.element('div', 'sp-h2', dlg, `Share "${state.spec.doc}"`);
        const adding = state.P.recipients(dlg, m);
        if (adding) { state.P.sendPanel(dlg, m); return; }
        state.P.people(dlg, m);
        state.P.generalAccess(dlg, m);
        state.P.dialogActions(dlg, m);
      };

      BASE.recipients = (dlg, m) => {
        const adding = m.chips.length > 0;
        const qwrap = state.P.element('div', 'sp-rel', dlg);
        qwrap.style.marginTop = '10px';
        const chips = state.P.element('div', 'sp-chips', qwrap);
        for (const e of m.chips) { state.P.chip(chips, e); }
        const inp = state.P.element('input', '', chips, undefined, { placeholder: adding ? '' : 'Add people, groups, and emails', autocomplete: 'off', spellcheck: 'false' });
        inp.value = m.q;
        state.P.key(inp, 'share-q');
        if (adding) {
          const rb = state.P.element('span', 'sp-rel', chips);
          state.P.key(state.P.element('span', 'sp-rolebtn', rb, `${state.fam.ROLE_LABEL[m.chipRole]} ▾`), 'chiprole-btn');
          if (m.menu === 'chiprole') {
            const mn = state.P.menu(rb, ['viewer', 'commenter', 'editor'].map((r) => ({ k: `chiprole:${r}`, label: state.fam.ROLE_LABEL[r], v: r })), m.chipRole);
            mn.style.right = '0'; mn.style.top = '100%';
          }
        }
        const sugs = state.fam.suggest(state.spec, m.q);
        if (sugs.length) {
          const sl = state.P.element('div', 'sp-sugs', qwrap);
          for (const p of sugs) { state.P.suggestion(sl, p); }
        }
        return adding;
      };

      BASE.sendPanel = (dlg, m) => {
        const out = m.chips.filter((e) => !e.endsWith(`@${state.spec.company.domain}`));
        if (out.length) state.P.element('div', 'sp-warn', dlg, `${out.length === 1 ? out[0] + ' is' : out.length + ' people are'} outside your organization.`).style.marginTop = '10px';
        const nt = state.P.element('div', 'sp-cb', dlg);
        nt.style.marginTop = '10px';
        state.P.element('span', 'sp-box on', nt, '✓'); state.P.element('span', '', nt, 'Notify people');
        const msg = state.P.element('div', 'sp-in', dlg, 'Message');
        msg.style.cssText = 'height:58px;margin-top:6px;padding-top:6px;color:var(--muted)';
        const row = state.P.element('div', '', dlg);
        row.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:12px';
        state.P.key(state.P.element('button', 'sp-btn', row, 'Cancel'), 'share-close');
        state.P.key(state.P.element('button', 'sp-btn pri', row, 'Send'), 'share-send');
      };

      BASE.people = (dlg, m) => {
        state.P.element('div', 'sp-sec', dlg, 'People with access');
        const owner = state.P.element('div', 'sp-person', dlg);
        state.P.avatar(owner, state.U.full);
        const on = state.P.element('div', 'nm', owner); state.P.element('div', '', on, `${state.U.full} (you)`); state.P.element('small', '', on, state.spec.owner);
        state.P.element('span', 'sp-muted', owner, 'Owner').style.fontSize = '12.5px';
        for (const p of m.people) { state.P.person(dlg, p, m); }
      };

      BASE.generalAccess = (dlg, m) => {
        state.P.element('div', 'sp-sec', dlg, 'General access');
        const ga = state.P.element('div', 'sp-person', dlg);
        const gi = state.P.element('span', 'sp-av', ga, m.access === 'anyone' ? '#globe' : '#lock');
        gi.style.background = m.access === 'anyone' ? '#43a047' : '#9aa1ad';
        const gn = state.P.element('div', 'nm', ga);
        const gb = state.P.element('span', 'sp-rel', gn);
        state.P.key(state.P.element('span', 'sp-rolebtn', gb, `${m.access === 'anyone' ? 'Anyone with the link' : 'Restricted'} ▾`), 'access-btn').style.fontWeight = '600';
        if (m.menu === 'access') {
          const mn = state.P.menu(gb, [{ k: 'access:restricted', label: 'Restricted', sub: 'Only people with access can open with the link', v: 'restricted' },
            { k: 'access:anyone', label: 'Anyone with the link', sub: 'Anyone on the internet with the link can view', v: 'anyone' }], m.access);
          mn.style.left = '0'; mn.style.top = '100%';
        }
        state.P.element('small', '', gn, m.access === 'anyone' ? 'Anyone on the internet with the link can view' : 'Only people with access can open with the link');
      };

      BASE.dialogActions = (dlg, m) => {
        const row = state.P.element('div', '', dlg);
        row.style.cssText = 'display:flex;justify-content:space-between;margin-top:14px';
        state.P.element('button', 'sp-btn', row, '#link Copy link');
        state.P.key(state.P.element('button', 'sp-btn pri', row, 'Done'), 'share-close');
      };

      BASE.chip = (chips, e) => {
        const p = state.spec.people.find((x) => x.email === e);
        const c = state.P.element('span', 'sp-chip', chips, p ? `${p.name} <${e}>` : e);
        state.P.key(state.P.element('span', 'x', c, '×'), `chipx:${e}`);
      };

      BASE.suggestion = (sl, p) => {
        const r = state.P.key(state.P.element('div', 'sp-sug', sl), `sug:${p.email}`);
        state.P.avatar(r, p.name);
        const t = state.P.element('div', '', r, p.name);
        state.P.element('small', '', t, p.email);
      };

      BASE.person = (dlg, p, m) => {
        const d = state.spec.people.find((x) => x.email === p.email);
        const row = state.P.element('div', 'sp-person', dlg);
        state.P.avatar(row, d ? d.name : p.email);
        const nm = state.P.element('div', 'nm', row); state.P.element('div', '', nm, d ? d.name : p.email); state.P.element('small', '', nm, p.email);
        const rb = state.P.element('span', 'sp-rel', row);
        state.P.key(state.P.element('span', 'sp-rolebtn', rb, `${state.fam.ROLE_LABEL[p.role]} ▾`), `pmenu:${p.email}`);
        if (m.menu === `p:${p.email}`) {
          const mn = state.P.menu(rb, ['viewer', 'commenter', 'editor'].map((r) => ({ k: `prole:${p.email}:${r}`, label: state.fam.ROLE_LABEL[r], v: r }))
            .concat(['-', { k: `prole:${p.email}:remove`, label: 'Remove access' }]), p.role);
          mn.style.right = '0'; mn.style.top = '100%';
        }
      };

      BASE.documentHeader = (doc, m) => {
        const dh = state.P.element('div', 'sp-doc-h', doc);
        state.P.element('span', 'sp-fav', dh, '≡').style.cssText = 'width:22px;height:22px;font-size:13px';
        state.P.element('span', 't', dh, state.spec.doc);
        state.P.element('span', 'sp-muted', dh, '☆  Saved to Drive').style.fontSize = '12px';
        const sp = state.P.element('span', '', dh); sp.style.flex = '1';
        state.P.avatar(dh, state.U.full, 28);
        const sb = state.P.key(state.P.element('button', 'sp-btn pri', dh, m.access === 'anyone' ? '#globe Share' : '#lock Share'), 'share-open');
        sb.style.borderRadius = '16px';
        const tb = state.P.element('div', 'sp-doc-tools', doc);
        for (const x of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', '|', '100%', 'Normal text', 'Arial', '11']) state.P.element('span', '', tb, x);
      };

      BASE.documentPaper = (doc) => {
        const paper = state.P.element('div', 'sp-paper', doc);
        state.P.element('h3', '', paper, state.spec.doc);
        for (let i = 0; i < 3; i++) state.P.element('p', '', paper, env.content.paragraph(state.rng.fork(`p${i}`), 3));
      };

      BASE.view = (m) => {
        state.P.document(m);
        if (!m.open) return;
        state.P.dialog(m);
      };
    },
  }));
})();
