// Design of this site on the use-email/mail template (templates/use-email/mail.js): fluent, a compact list whose
// scroll range is mapped onto the task's row counts, and a settings sheet that hides the task until the Task tab.
// Maps the task's row-based scroll (spec.rows per page) to the compact pane's pixel scroll and back.
(function () {
  'use strict';
  const range = (S) => {
    const { list, rowEls, root } = S.els;
    return {
      pixels: Math.max(0, list.scrollHeight - list.clientHeight),
      rows: Math.max(0, rowEls.size - S.spec.rows),
      rowPx: parseFloat(root.style.getPropertyValue('--rowpx')) || 1,
    };
  };
  const toListScroll = (S, scroll) => {
    const r = range(S);
    return r.rows ? (Math.max(0, Math.min(r.rows, scroll)) * r.pixels) / (r.rows * r.rowPx) : 0;
  };
  const toModelScroll = (S, scroll) => {
    const r = range(S),
      pixels = Math.max(0, Math.min(r.pixels, scroll * r.rowPx));
    return r.pixels && r.rows ? (r.pixels - pixels <= 1 ? r.rows : (pixels * r.rows) / r.pixels) : 0;
  };
  const remember = (S, scroll) => {
    if (Math.abs(scroll - (S.ctx.model.scroll || 0)) > 0.00001) S.ctx.update({ ...S.ctx.model, scroll });
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-12',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      style: 'fluent',
      rowHeight: 72,
      folderList: [],
      fieldColon: true,
      fieldKeyClass: true,
      replyPlaceholder: '',
      paths: {
        appearance: 'M2 3h20v15H2z M8 22h8 M12 18v4',
        notifications: 'M4 17c3-3 2-6 3-10a5 5 0 0 1 10 0c1 4 0 7 3 10H4z M9 20a3 3 0 0 0 6 0',
        composing: 'm3 17 12-12 4 4-12 12-5 1z M14 6l3-3a2 2 0 0 1 3 3l-3 3',
        privacy: 'M3 4l9-3 9 3v7c0 6-9 11-9 11S3 17 3 11z',
        link: 'm10 8 3-3a4 4 0 0 1 6 6l-3 3 M14 16l-3 3a4 4 0 0 1-6-6l3-3 M8 16l8-8',
        list: 'M8 5h13 M8 12h13 M8 19h13 M3 5h1 M3 12h1 M3 19h1',
        attach: 'm8 14 8-8a3 3 0 0 1 4 4L9 21a5 5 0 0 1-7-7L14 2a4 4 0 0 1 6 6L8 20',
        more: 'M4 12h.1 M12 12h.1 M20 12h.1',
        reply: 'M10 5 4 11l6 6 M4 11h9c5 0 8 3 8 8',
        replyall: 'm8 5-6 6 6 6 M14 5l-6 6 6 6 M8 11h7c4 0 7 3 7 8',
      },
      parts: {
        listMade: (base, S) => () => {
          const { list, listWrap } = S.els;
          listWrap.addEventListener(
            'wheel',
            (ev) => {
              if (ev.defaultPrevented) return;
              const r = range(S);
              if (!r.pixels) return;
              ev.preventDefault();
              const top = Math.max(0, Math.min(r.pixels, list.scrollTop + ev.deltaY));
              S.els.lbx.set({ scroll: top / r.rowPx });
              remember(S, toModelScroll(S, top / r.rowPx));
            },
            { passive: false },
          );
          list.addEventListener('scroll', () => remember(S, toModelScroll(S, list.scrollTop / range(S).rowPx)));
        },
        snapped: (base, S) => () => {
          const { el, up, button } = S;
          const { root, reg } = S.els;
          root.classList.add('preferences-active');
          const tabs = el('div', 'workspace-tabs', root);
          const preferences = el('button', 'selected', tabs, 'Preferences'),
            task = el('button', '', tabs, 'Task');
          reg.set('taskTab', task);
          task.addEventListener('click', () => {
            root.classList.remove('preferences-active');
            root.classList.add('task-active');
            task.classList.add('selected');
            preferences.classList.remove('selected');
          });
          preferences.addEventListener('click', () => {
            root.classList.add('preferences-active');
            root.classList.remove('task-active');
            task.classList.remove('selected');
            preferences.classList.add('selected');
          });
          const sheet = el('section', 'preferences-sheet', root);
          el('h2', '', sheet, 'Settings');
          el('p', '', sheet, 'Customize your mail experience.');
          for (const [title, items] of [
            ['Appearance', [['Theme', 'Light'], ['Density', 'Comfortable'], ['Show message previews', true]]],
            ['Notifications', [['New email notifications', true], ['Play a sound', false]]],
            ['Composing', [['Default font', 'Segoe UI'], ['Font size', '11'], ['Always show Cc and Bcc', false]]],
            ['Privacy', [['Block external images', true], ['Report suspicious messages', true]]],
          ]) {
            const fs = el('fieldset', '', sheet);
            el('legend', '', fs, title);
            for (const [name, value] of items) {
              const label = el('label', '', fs);
              el('span', '', label, name);
              const input = el('input', '', label);
              input.type = typeof value === 'boolean' ? 'checkbox' : 'text';
              if (input.type === 'checkbox') input.checked = value;
              else input.value = value;
            }
          }
          const searchBox = el('input', 'search-native', root);
          searchBox.placeholder = 'Search mail';
          searchBox.addEventListener('input', () => up({ query: searchBox.value }));
        },
        rowHeightPx: (base, S) => (avail) =>
          Math.floor(Math.min(avail / Math.min(S.spec.rows, 4), Math.max(48, (S.D.rowHeight * S.ctx.size.width) / 1672))),
        listSize: (base, S) => (avail) => {
          S.els.listWrap.style.flex = 'none';
          S.els.listWrap.style.height = avail + 'px';
        },
        rowHead: (base, S) => (r, e) => S.el('span', 'avatar', r, e.name[0]),
        listboxOptions: (base, S) => (...a) => {
          const o = base(...a);
          o.onScroll = (v) => remember(S, toModelScroll(S, v));
          return o;
        },
        applyScroll: (base, S) => (m) => S.els.lbx.set({ scroll: toListScroll(S, m.scroll || 0) }),
        listKept: (base, S) => (m) => S.els.lbx.set({ scroll: toListScroll(S, m.scroll || 0) }),
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          el('h2', '', meta, e.subject);
          const sender = el('div', 'message-sender', meta);
          el('span', 'avatar', sender, e.name[0]);
          el('strong', 'sender-name', sender, e.name);
          el('span', 'sender-address', sender, ' <' + e.addr + '>');
          el('div', 'message-to', sender, 'To: You' + cc(e));
          el('span', 'message-time', sender, e.time);
        },
        docActions: (base, S) => (d, ...a) => {
          base(d, ...a);
          const more = S.button(d.acts, 'More', null, null, 'more');
          more.addEventListener('click', () => S.els.doc.classList.toggle('show-tools'));
        },
        editorTitle: (base, S) => () => {
          const t = S.el('div', 'window-title composer-reply', S.els.editor);
          t.innerHTML = S.P.icon('reply');
          t.title = 'Reply';
          return t;
        },
        editorRowMade: (base, S) => (row, k, inp, shown) => {
          if (k === 'to') {
            inp.style.width = Math.min(22, (shown.to || '').length + 1) + 'ch';
            S.el('span', 'recipient-address', row, '<' + S.spec.emails[shown.of ?? 0].addr + '>');
          }
        },
        editorFields: (base, S) => (group, shown) => {
          base(group, shown);
          const ccLinks = S.el('div', 'cc-links', group);
          for (const label of ['Cc', 'Bcc']) {
            const b = S.el('button', '', ccLinks, label);
            b.type = 'button';
            b.addEventListener('click', () => S.els.editor.classList.toggle('cc-expanded'));
          }
        },
        editorFormat: () => () => {},
        actionsStart: (base, S) => (acts) => {
          const fmt = S.el('div', 'formatbar', acts);
          for (const [label, ic] of [['B', null], ['I', null], ['U', null], ['Link', 'link'], ['List', 'list'], ['Attach', 'attach']]) {
            const s = S.el('span', 'format-' + label.toLowerCase(), fmt, ic ? '' : label);
            if (ic) s.innerHTML = S.P.icon(ic);
          }
        },
        cancelButton: (base, S) => (acts) => S.button(acts, 'Cancel', 'compose:discard', { discard: true }, 'close', 'discard'),
        locateEarly: (base, S) => (t) => {
          const { root, reg } = S.els;
          if (root.classList.contains('preferences-active') && !t.list && t.thumb === undefined && t.scroll === undefined)
            return S.center(reg.get('taskTab'));
        },
        locateRow: (base, S) => (t) => {
          if (t.row === undefined) return;
          const { rowEls, list, lbx } = S.els;
          const row = rowEls.get(t.row)?.r;
          if (row) {
            const r = row.getBoundingClientRect(),
              v = list.getBoundingClientRect();
            if (r.top < v.top || r.bottom > v.bottom) lbx.scrollTo(t.row, 'center');
          }
          return lbx.locateOption(t.row);
        },
        locateScroll: (base, S) => (t) => {
          if (t.scroll !== undefined) return S.els.lbx.locateThumbFor(toListScroll(S, t.scroll));
        },
      },
    },
  });
})();
