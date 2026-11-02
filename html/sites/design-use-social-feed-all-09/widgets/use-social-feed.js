// This design keeps the Lisa noticeboard portraits, instruction copy, and original feed scroll behavior.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-all-09',
    name: 'design',
    split: 'train',
    scenarios: ['all'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      icons: {
        like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
      },
      parts: {
        page: (base) => (R) => {
          const briefing = document.querySelector('.brief-copy');
          if (briefing) {
            const verb = R.F.helpers.LABELS[R.spec.action] || 'Act on';
            const target = R.spec.select.kind === 'user' ? 'from ' + R.spec.select.handle : 'that match the instruction';
            briefing.textContent = `Scan the posts on the right. ${verb} each post ${target}. Ignore posts that do not match. When you have acted on all matching posts, click the Submit button below.`;
          }
          return base(R);
        },
        headed: () => (R) => {
          const people = R.util.el('span', 'lisa-people');
          people.innerHTML = '<svg viewBox="492 122 47 32"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg>';
          const title = R.head.querySelector('b');
          R.head.insertBefore(people, title ? title.nextSibling : R.head.firstChild);
        },
        avatar: (base) => (R, row, post, p, m) => {
          const av = base(R, row, post, p, m);
          av.classList.remove('flower', 'cat');
          const portraitY = [185, 287, 394, 503, 608][p % 5];
          av.innerHTML = `<svg viewBox="511 ${portraitY} 68 72"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg>`;
          return av;
        },
        actsMade: (base) => (R, acts, post, p, parts, row) => {
          base(R, acts, post, p, parts, row);
          for (const b of R.F.helpers.BUTTONS) parts.acts[b].classList.toggle('secondary', b !== R.spec.action);
        },
        restoreScroll: () => (R, B, m, keep, first) => {
          B.lbx.set({});
          B.feed.scrollTop = first
            ? Math.max(0, B.feed.scrollHeight - B.feed.clientHeight) * (Number(m.scroll) || 0)
            : keep;
          B.thumb.classList.toggle('long-thumb', B.thumb.getBoundingClientRect().height > 140);
        },
      },
    },
  });
})();
