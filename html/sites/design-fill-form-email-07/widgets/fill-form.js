// Email layout with the site's mail header, reset controls, and compact panel fitting.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-07',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    parts: {
      renderEmail: () => (util, pane, d, rng) => {
        const box = util.el('div', 'ff-mail', pane);
        const bar = util.el('div', 'ff-mailbar', box);
        if (d.style !== 'plain') {
          for (const b of rng.pick([
            ['Reply', 'Forward', 'Archive'],
            ['Reply all', 'Forward', 'Delete'],
            ['Inbox', 'Reply', 'Mark unread'],
          ])) util.el('span', '', bar, b);
        }
        const subject = util.el('div', 'ff-mailsubj', box);
        util.el('b', '', subject, d.subject);
        util.el('span', 'ff-maildate', subject, d.date);
        const from = util.el('div', 'ff-mailfrom', box);
        util.el('div', 'ff-avatar', from, d.initials);
        const who = util.el('div', 'who', from);
        util.el('b', '', who, d.from.name);
        util.el('span', 'ff-address', who, d.from.addr);
        util.el('small', '', who, `To:  ${d.to}`);
        const actions = util.el('div', 'ff-mailactions', from);
        actions.innerHTML =
          '<svg viewBox="0 0 28 28"><path d="m12 7-7 7 7 7M5 14h12q6 0 6 9"/></svg><svg viewBox="0 0 28 28"><path d="m11 7-7 7 7 7m6-14-7 7 7 7M10 14h9q6 0 6 9"/></svg><svg viewBox="0 0 28 28"><circle cx="14" cy="7" r="1.5"/><circle cx="14" cy="14" r="1.5"/><circle cx="14" cy="21" r="1.5"/></svg>';
        const body = util.el('div', 'ff-mailbody', box);
        util.el('p', '', body, d.greeting);
        for (const p of d.paragraphs) util.el('p', '', body, p);
        util.el('p', 'sig', body, d.signature.join('\n'));
        return box;
      },
      fit: (base, S) => (ctx, R) => {
        const { root, docPane, formPane } = R;
        const form = formPane.querySelector('.ff-form');
        const formStyle = getComputedStyle(formPane);
        const formHeight = formPane.clientHeight - parseFloat(formStyle.paddingTop) - parseFloat(formStyle.paddingBottom);
        for (let fs = 21; fs >= 10; fs -= 0.5) {
          form.style.fontSize = fs + 'px';
          if (form.scrollHeight <= formHeight) break;
        }
        const mail = docPane.querySelector('.ff-mail');
        if (mail) {
          const paneStyle = getComputedStyle(docPane);
          const maxH = docPane.clientHeight - parseFloat(paneStyle.paddingTop) - parseFloat(paneStyle.paddingBottom);
          for (let fs = 21; fs >= 10; fs -= 0.5) {
            mail.style.fontSize = fs + 'px';
            if (mail.scrollHeight <= maxH) break;
          }
        }
      },
      clear: (base, S) => () => {
        const { ctx, spec, el } = S.st;
        const fields = { ...ctx.model.fields };
        for (const f of spec.fields) fields[f.id] = f.kind === 'checkbox' ? false : '';
        ctx.update({ ...ctx.model, fields, open: null });
        for (const x of Object.values(el)) {
          if (x.input) {
            x.input.value = '';
            x.input.parentElement.classList.remove('filled');
          } else if (x.dd) {
            x.w.set(null);
            x.show('');
            if (x.w.setOpen) x.w.setOpen(false);
            S.P.showList(x.dd, x.btn, x.list, false);
          } else if (x.radios) {
            x.w.set(null);
            for (const [, radio] of x.radios) radio.checked = false;
          } else if (x.cb) {
            x.w.set([]);
            x.cb.checked = false;
          }
        }
      },
    },
  },
});
