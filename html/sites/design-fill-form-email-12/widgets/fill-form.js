// Email design with required-field stars, source-style email headers, and viewport-scaled form fitting.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-12',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Add Contact',
    parts: {
      showList: (base) => (dd, btn, list, open) => {
        dd.classList.toggle('open', open);
        if (!open) return;
        dd.classList.remove('up');
        const r = btn.getBoundingClientRect();
        const end = env.submitEl ? env.submitEl.getBoundingClientRect() : null;
        const limit = end && r.left < end.right && r.right > end.left
          ? Math.min(window.innerHeight - 6, end.top - 8)
          : window.innerHeight - 6;
        const available = Math.max(r.top - 10, limit - r.bottom - 10, 80);
        list.style.gridTemplateColumns = '1fr';
        for (let columns = 2; list.offsetHeight > available && columns <= 6; columns++)
          list.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
        const h = list.offsetHeight;
        if (r.bottom + 4 + h > limit && r.top - 4 - h > 6) dd.classList.add('up');
      },
      placeholder: (base) => (f) => f.placeholder ||
        (/company/i.test(f.label)
          ? 'Company name'
          : /email/i.test(f.label)
            ? 'Email address'
            : /phone/i.test(f.label)
              ? 'Phone number (optional)'
              : f.label),
      label: (base, S) => (f, lab) => {
        if (/^(first name|last name|company|email)$/i.test(f.label)) {
          const star = S.ctx.util.el('span', 'ff-star', lab, ' *');
          star.setAttribute('aria-hidden', 'true');
        }
      },
      renderEmail: () => (util, pane, d, rng) => {
        const header = (box) => {
          const head = util.el('div', 'ff-emailhead', box);
          for (const [label, value] of [
            ['From:', d.from.addr],
            ['To:', d.to],
            ['Subject:', d.subject],
            ['Date:', d.date],
          ]) {
            util.el('b', '', head, label);
            util.el('span', '', head, value);
          }
        };
        if (d.style === 'plain') {
          const box = util.el('div', 'ff-plainmail ff-paper', pane);
          header(box);
          const body = util.el('div', 'ff-mailbody', box);
          util.el('p', '', body, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', body, p);
          util.el('p', 'sig', body, d.signature.join('\n')).style.marginBottom = '0';
          return box;
        }
        const box = util.el('div', 'ff-mail', pane);
        const bar = util.el('div', 'ff-mailbar', box);
        for (const b of rng.pick([
          ['Reply', 'Forward', 'Archive'],
          ['Reply all', 'Forward', 'Delete'],
          ['Inbox', 'Reply', 'Mark unread'],
        ])) util.el('span', '', bar, b);
        util.el('div', 'ff-mailsubj', box, d.subject);
        const from = util.el('div', 'ff-mailfrom', box);
        util.el('div', 'ff-avatar', from, d.initials);
        const who = util.el('div', 'who', from);
        util.el('b', '', who, d.from.name);
        util.el('span', '', who, ` <${d.from.addr}>`);
        util.el('small', '', who, `to ${d.to}`);
        util.el('div', 'when', from, d.date);
        box.querySelector('.ff-mailsubj').remove();
        from.remove();
        header(box);
        const body = util.el('div', 'ff-mailbody', box);
        util.el('p', '', body, d.greeting);
        for (const p of d.paragraphs) util.el('p', '', body, p);
        util.el('p', 'sig', body, d.signature.join('\n'));
        return box;
      },
      fit: (base, S) => (ctx, R) => {
        const { root, docPane } = R;
        root.style.setProperty('--scene-unit', `${ctx.size.width / 1655}px`);
        root.style.setProperty('--field-count', S.spec.fields.length);
        const mail = docPane.querySelector('.ff-mail, .ff-plainmail');
        if (mail) {
          let fs = Math.min(24, ctx.size.width / 69);
          do {
            mail.style.setProperty('--mail-size', `${fs}px`);
            if (mail.scrollHeight <= docPane.clientHeight - parseFloat(getComputedStyle(docPane).paddingTop)) break;
            fs -= 0.5;
          } while (fs >= 9);
        }
        const clearAll = document.querySelector('.ds-clear');
        if (clearAll) clearAll.onclick = () => S.P.clear();
      },
      clear: (base, S) => () => {
        for (const x of Object.values(S.st.el))
          if (x.input) {
            x.input.value = '';
            x.input.dispatchEvent(new Event('input', { bubbles: true }));
          }
      },
    },
  },
});
