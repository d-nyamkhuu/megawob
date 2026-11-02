// Design on templates/handle-text/base.js: the base site's handle-text widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-edit-02',
  name: 'design',
  split: 'train',
  scenarios: ['edit'],
  template: 'handle-text/base',
  design: {
    parts: {
      'fieldRow': (base, S) => function fieldRow(ctx, parent, f, inline, id, onInput, value) {
        const { env } = S;
        const { util } = ctx;
        const row = util.el('div', 'ut-fieldrow' + (inline ? ' inline' : ''), parent);
        const label = util.el('label', 'ut-label', row, f.label);
        const input = util.el(f.multiline ? 'textarea' : 'input', 'ut-input', row);
        if (!f.multiline) input.type = 'text';
        input.id = `ut-${id}`;
        label.htmlFor = input.id;
        input.name = id;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
        input.dataset.role = 'field';
        if (f.placeholder) input.placeholder = f.placeholder;
        const api = env.ui.textField(input, { value, label: id, onInput });
        return { row, input, api };
      },
      'buildEdit': (base, S) => function buildEdit(ctx, look) {
        const { caretPoint, env, fieldRow, frame, liveSel, modelSel, sameSel, sourceBox, statusBar } = S;
        const { spec, util } = ctx;
        const { card, body } = frame(ctx, look, look.pick(['compose', 'editor', 'draft.txt', 'message']), look.pick([null, 'Edit', 'Draft']));
        card.classList.add('ut-edit');
        S.st.copyModel = true;
        const mode = spec.mode;
        // Record context is read-only; the task's labeled fields and values remain seeded.
        if (!spec.fields.some(f => f.label.toLowerCase() === 'title')) {
          const titleRow = util.el('div', 'record-title-row', body);
          util.el('div', 'record-field-label', titleRow, 'Title');
          util.el('div', 'record-title-value', titleRow, 'Riverside Park Upgrade Plan');
        }
        util.el('p', 'ut-sub', body, { insert: 'Click where the text should go, then type.', cut: 'Ctrl+X cuts, Ctrl+V pastes.',
          undo: 'Ctrl+Z undoes the last change.', 'paste-at': 'Ctrl+C copies, Ctrl+V pastes at the caret.' }[mode]);
        if (mode === 'paste-at') {
          const note = util.el('div', 'ut-note', body);
          util.el('div', 'ut-src-title', note, `${spec.snippet.title} · ${spec.snippet.label}`);
          S.st.editBox = true;
          S.st.sels = [];
          const { text, sel } = sourceBox(ctx, note, { text: spec.snippet.text }, 0, (on) => focusTo(on ? 'box' : null), (v) => {
            const s = modelSel(v ? { box: 0, ...v } : liveSel());
            const mm = S.st.ctx.model;
            if (!sameSel(s, mm.sel)) S.st.ctx.update({ ...mm, sel: s });
          });
          text.style.width = 'auto';
          S.st.sels.push(sel);
          S.st.snippet = text;
        }
        const longest = Math.max(...spec.fields.map((f) => Math.max(f.value.length, f.target.length)));
        const inputs = spec.fields.map((f, i) => {
          const fr = fieldRow(ctx, body, { label: f.label, multiline: mode === 'undo', placeholder: i === 1 ? look.pick(['Paste here', '', 'Empty']) : '' }, false, `edit${i}`, (v) => onInput(i, v), ctx.model.values[i]);
          if (i === 0 && f.label.toLowerCase() !== 'title') fr.row.classList.add('primary-edit-field');
          fr.input.style.width = `${Math.min(S.st.maxW - 40, Math.max(300, longest * 8.6 + 60))}px`;
          fr.input.addEventListener('focus', () => focusTo(`f${i}`));
          fr.input.addEventListener('blur', () => focusTo(null));
          for (const ev of ['mouseup', 'keyup', 'select', 'click']) fr.input.addEventListener(ev, () => mirrorSel(i));
          return fr;
        });
        S.st.inputs = inputs;
        const details = util.el('section', 'project-details', body);
        util.el('div', 'record-field-label', details, spec.fields.some(f => f.label.toLowerCase() === 'details') ? 'Project Details' : 'Details');
        const pane = util.el('div', 'project-details-pane', details);
        pane.innerHTML = '<h2>Project Overview</h2><p>The Riverside Park Upgrade Plan focuses on creating a more inclusive, sustainable and enjoyable<br class="wide-break"> space for everyone in our community. The project will include:</p><ul><li>Expanded walking and cycling paths</li><li>Improved accessibility throughout the park</li><li>New playground and fitness areas</li><li>Additional seating, lighting and wayfinding</li><li>Native landscaping and environmental improvements</li></ul><h2>Community Engagement</h2><p>We will continue to work with local residents, community groups and city stakeholders throughout<br class="wide-break"> the planning and construction phases. Public feedback will help shape the final design and ensure<br class="wide-break"> the park meets the needs of all users.</p><h2>Next Steps</h2><p>Coordinate the design review, gather community feedback and develop the construction schedule.</p>';
        pane.insertAdjacentHTML('beforeend', '<h2>Project Schedule</h2><p>Community consultation and design development will be followed by a phased construction programme. The park will remain accessible wherever possible throughout the work.</p><p>Progress updates will be shared with residents and community partners as each phase is completed. The team will review the final plans with accessibility advisors before construction begins.</p>');
        const detailTrack = util.el('div', 'details-scroll-track', details);
        const detailThumb = util.el('div', 'details-scroll-thumb', detailTrack);
        detailTrack.setAttribute('aria-hidden', 'true');
        const syncDetailsScroll = () => {
          const height = detailTrack.clientHeight - 14;
          const thumbHeight = Math.max(35, height * pane.clientHeight / pane.scrollHeight);
          detailThumb.style.height = thumbHeight + 'px';
          detailThumb.style.top = (7 + (height - thumbHeight) * pane.scrollTop / Math.max(1, pane.scrollHeight - pane.clientHeight)) + 'px';
        };
        pane.addEventListener('scroll', syncDetailsScroll);
        detailTrack.addEventListener('pointerdown', e => {
          const rect = detailTrack.getBoundingClientRect();
          pane.scrollTop = Math.max(0, (e.clientY - rect.top - 7) / Math.max(1, rect.height - 14)) * (pane.scrollHeight - pane.clientHeight);
          syncDetailsScroll();
        });
        syncDetailsScroll();
        // Undo history of field 0 (the page's own; the browser's is not used).
        if (mode === 'undo') {
          inputs[0].input.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
              e.preventDefault();
              const m = S.st.ctx.model;
              if (!m.history.length) return;
              const history = m.history.slice();
              const prev = history.pop();
              env.log('undo', { what: 'edit0' });
              inputs[0].api.set(prev);
              S.st.ctx.update({ ...m, values: [prev], history, caret: prev.length });
            }
          });
        }
        function onInput(i, v) {
          const m = S.st.ctx.model;
          if (m.values[i] === v) return;
          const values = m.values.slice();
          values[i] = v;
          const patch = { values, caret: inputs[i].input.selectionStart, sel: null };
          if (mode === 'undo' && i === 0) patch.history = m.history.concat([m.values[0]]).slice(-30);
          S.st.ctx.update({ ...m, ...patch });
        }
        function focusTo(f) {
          const m = S.st.ctx.model;
          if (m.focus !== f) S.st.ctx.update({ ...m, focus: f, ...(f && f[0] === 'f' ? { caret: inputs[Number(f.slice(1))].input.selectionStart } : {}) });
        }
        function mirrorSel(i) {
          const el = inputs[i].input;
          if (document.activeElement !== el) return;
          const m = S.st.ctx.model;
          const a = el.selectionStart;
          const b = el.selectionEnd;
          const sel = b > a ? { field: i, start: a, end: b } : null;
          if (m.caret !== a || !sameSel(sel, m.sel) || m.focus !== `f${i}`) S.st.ctx.update({ ...m, caret: a, sel, focus: `f${i}` });
        }
        S.st.onSelection = () => {
          const ae = document.activeElement;
          const i = inputs.findIndex((x) => x.input === ae);
          if (i >= 0) mirrorSel(i);
        };
        statusBar(card, util, [`${spec.fields.length} field${spec.fields.length > 1 ? 's' : ''}`, look.pick(['Plain text', 'UTF-8', 'Autosave off'])]);
        return {
          card,
          loc(t) {
            if (t.efield !== undefined) return inputs[t.efield].api.locate();
            if (t.caret) return caretPoint(inputs[t.caret[0]].input, t.caret[1]);
            if (t.snippet) return util.center(S.st.snippet);
            return null;
          },
          sync(m) { inputs.forEach((x, i) => { if (x.input.value !== m.values[i]) x.api.set(m.values[i]); }); },
        };
      },
    },
  },
});
