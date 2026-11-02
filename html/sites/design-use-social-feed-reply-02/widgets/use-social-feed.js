// Design on templates/use-social-feed/feed.js: the template's pilot for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-reply-02',
  name: 'design',
  split: 'train',
  scenarios: ['reply'],
  template: 'use-social-feed/feed',
  design: {
    scrollSet: 'first',
    parts: {
      painted: (base) => (R, m) => {
        base(R, m);
        const paths = [
          '<path d="M20.5 10.5c0 4.3-4 7.5-9 7.5l-5 3v-4C3.7 15.8 2 13.4 2 10.5 2 6.3 6 3 11.2 3s9.3 3.3 9.3 7.5Z"/>',
          '<path d="M3 16V4m-3 4 3-4 4 4M3 4h8a3 3 0 0 1 3 3v3m7-2v12m-4-4 4 4 3-4m-3 4h-8a3 3 0 0 1-3-3v-3"/>',
          '<path d="M12 21S2 14.8 2 8.1C2 2.5 9 1.3 12 6c3-4.7 10-3.5 10 2.1C22 14.8 12 21 12 21Z"/>',
          '<path d="M12 16V2m-6 6 6-6 6 6M3 13v8h18v-8"/>'
        ];
        for (const post of R.page.querySelectorAll('.as-post')) {
          const acts = post.querySelectorAll('.as-act');
          acts.forEach((act, i) => {
            const svg = act.querySelector('svg');
            if (!svg || i > 3) return;
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '1.5');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.innerHTML = paths[i];
          });
          const actions = post.querySelector('.as-acts');
          const menu = post.querySelector('.as-more');
          if (actions && menu && !actions.querySelector('.riso-action-more')) {
            const more = R.util.el('button', 'riso-action-more', actions, '•••');
            more.type = 'button';
            more.setAttribute('aria-label', 'More');
            more.title = 'More';
            more.addEventListener('click', () => menu.click());
          }
        }
        let sentNotice = R.page.querySelector('.riso-sent');
        R.x.replyUndo = null;
        if (m.sent && m.sent.length) {
          if (!sentNotice) {
            sentNotice = R.util.el('div', 'riso-sent', R.col);
            R.col.insertBefore(sentNotice, R.box);
            R.util.el('span', '', sentNotice, 'Reply sent');
            const undo = R.util.el('button', '', sentNotice, 'Undo');
            undo.type = 'button';
            undo.addEventListener('click', () => { R.up({ unsend: true }); R.paint(); });
          }
          R.x.replyUndo = sentNotice.querySelector('button');
        } else if (sentNotice) sentNotice.remove();
        const draft = m.draft;
        for (const old of R.page.querySelectorAll('.riso-composer')) {
          if (!draft || old.dataset.post !== String(draft.post)) old.remove();
        }
        R.x.replyField = null;
        R.x.replySend = null;
        if (!draft || !R.fd || !R.fd.parts.has(draft.post)) { R.x.composerPost = null; R.report(); return; }
        const part = R.fd.parts.get(draft.post);
        let box = part.main.querySelector('.riso-composer');
        if (!box) {
          box = R.util.el('div', 'riso-composer', part.main);
          box.dataset.post = String(draft.post);
          const label = R.util.el('div', 'riso-recipient', box);
          label.append('Replying to ');
          R.util.el('strong', '', label, R.spec.posts[draft.post].handle);
          const row = R.util.el('div', 'riso-composer-row', box);
          const field = R.util.el('textarea', 'riso-draft', row);
          field.setAttribute('aria-label', 'Reply');
          field.addEventListener('input', () => { R.up({ draft: field.value }); R.paint(); });
          const send = R.util.el('button', 'riso-send', row, 'Send reply');
          send.type = 'button';
          send.addEventListener('click', () => { R.up({ send: true }); R.paint(); });
        }
        const field = box.querySelector('.riso-draft');
        if (field.value !== draft.text) field.value = draft.text;
        R.x.replyField = field;
        R.x.replySend = box.querySelector('.riso-send');
        if (R.x.composerPost !== draft.post) {
          const row = box.closest('.as-post');
          R.fd.feed.scrollTop += row.getBoundingClientRect().top - R.fd.feed.getBoundingClientRect().top;
          R.x.composerPost = draft.post;
        }
        R.report();
      },
      locateExtra: (base) => (R, target) => {
        const el = target.field === 'draft' ? R.x.replyField : target.send ? R.x.replySend : target.undo === 'toast' ? R.x.replyUndo : null;
        return el ? R.util.center(el) : base(R, target);
      },
    },
  },
});
