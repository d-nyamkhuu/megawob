// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-visibility-01',
  name: 'design',
  split: 'train',
  scenarios: ['visibility'],
  template: 'protect-privacy/classic',
  design: {
    widthScale: 1,
    heightScale: 1,
    font: '13px/1.35 Arial,Helvetica,sans-serif',
    radius: '0',
    parts: {
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        return { ...geo, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height };
      },
      frame: (base) => (ctx) => {
        const win = base(ctx);
        win.style.boxSizing = 'border-box';
        return win;
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.querySelector('.sp-tabs').remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.querySelector('.sp-bar').remove();
      },
      navigation: (base) => (soc) => {
        base(soc);
        const rail = soc.querySelector('.sp-soc-nav');
        if (rail) rail.remove();
        Object.assign(soc.style, { padding: '0', gap: '0' });
      },
      profile: (base) => (feed, model) => {
        feed.style.maxWidth = 'none';
        base(feed, model);
      },
      post: (base, S) => (feed, model, audienceDescriptions) => {
        base(feed, model, audienceDescriptions);
        Object.assign(feed.style, { maxWidth: 'none', minHeight: '0', overflow: 'auto' });
        const card = feed.querySelector('.sp-post');
        if (!card) return;
        card.classList.add('zephyr-compose-card');
        card.style.padding = '0';
        const heading = document.createElement('div');
        heading.className = 'zephyr-task-heading';
        heading.textContent = 'Post a Video to Zephyr Streaming';
        card.prepend(heading);

        const author = card.firstElementChild.nextElementSibling;
        if (author) {
          author.classList.add('zephyr-author-row');
          author.style.padding = '8px 20px';
        }
        const audienceButton = card.querySelector('[data-k="aud-btn"]');
        const audienceWrap = audienceButton && audienceButton.closest('.sp-rel');
        const description = card.querySelector('.text');
        if (description) {
          Object.assign(description.style, { minHeight: `${Math.min(145, S.ctx.size.height * 0.24)}px`,
            margin: '0 20px 14px', padding: '11px 12px' });
          const label = document.createElement('div');
          label.className = 'zephyr-form-label';
          label.textContent = 'Description';
          description.before(label);
        }
        if (audienceWrap && description) {
          Object.assign(audienceButton.style, { minWidth: `${Math.min(294, S.ctx.size.width - 64)}px`,
            minHeight: '40px', justifyContent: 'space-between', padding: '5px 12px' });
          const field = document.createElement('div');
          field.className = 'zephyr-audience-field';
          const label = document.createElement('div');
          label.className = 'zephyr-form-label';
          label.textContent = 'Audience';
          field.append(label, audienceWrap);
          const help = document.createElement('div');
          help.className = 'zephyr-audience-help';
          help.textContent = model.aud === 'public'
            ? `Anyone on ${S.spec.org.name} can find and watch this video.`
            : audienceDescriptions[model.aud] || '';
          field.append(help);
          description.after(field);
        }
        const actions = card.querySelector('[data-k="post"]')?.parentElement;
        if (actions) Object.assign(actions.style, { margin: '14px 20px', paddingTop: '12px',
          borderTop: '1px solid #9cc3fa' });
      },
    },
  },
});
