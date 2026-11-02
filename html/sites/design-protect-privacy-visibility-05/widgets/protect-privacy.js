// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-visibility-05',
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
      profile: (base, S) => (feed, model) => {
        feed.style.maxWidth = 'none';
        feed.classList.add('mac-profile');
        base(feed, model);
        const card = feed.querySelector('.sp-post');
        card.classList.add('mac-profile-card');
        const heading = S.ctx.util.el('div', 'mac-compose-heading', card, 'Pebble Chorus Chat');
        card.prepend(heading);
      },
      post: (base, S) => (feed, model, audienceDescriptions) => {
        base(feed, model, audienceDescriptions);
        Object.assign(feed.style, { maxWidth: 'none', minHeight: '0', overflow: 'auto' });
        const card = feed.querySelector('.sp-post');
        if (!card) return;
        card.classList.add('mac-compose');
        card.style.padding = '0';
        const heading = document.createElement('div');
        heading.className = 'mac-compose-heading';
        heading.textContent = 'Pebble Chorus Chat';
        const audienceButton = card.querySelector('[data-k="aud-btn"]');
        const audienceWrap = audienceButton && audienceButton.closest('.sp-rel');
        const description = card.querySelector('.text');
        const commit = card.querySelector('[data-k="post"]')?.parentElement || card.lastElementChild;
        if (audienceWrap && description) {
          card.replaceChildren(heading);
          const columns = document.createElement('div'); columns.className = 'mac-compose-columns';
          const left = document.createElement('div'); left.className = 'mac-compose-left';
          const field = document.createElement('div');
          field.className = 'mac-compose-side';
          const label = document.createElement('div');
          label.className = 'mac-audience-label';
          label.textContent = 'Audience:';
          field.append(label, audienceWrap);
          const choices = document.createElement('div'); choices.className = 'mac-audience-options';
          const symbols = {
            public:'<circle cx="20" cy="20" r="17"/><ellipse cx="20" cy="20" rx="8" ry="17"/><path d="M3 20h34M7 10h26M7 30h26"/>',
            friends:'<circle cx="20" cy="10" r="5"/><circle cx="7" cy="13" r="4"/><circle cx="33" cy="13" r="4"/><path d="M10 35v-7c0-10 20-10 20 0v7zM1 34v-7q0-9 9-8M39 34v-7q0-9-9-8"/>',
            close:'<g fill="black"><circle cx="20" cy="10" r="5"/><circle cx="7" cy="13" r="4"/><circle cx="33" cy="13" r="4"/><path d="M10 35v-7c0-10 20-10 20 0v7zM1 34v-7q0-9 9-8v15zM39 34v-7q0-9-9-8v15z"/></g>',
            only:'<rect x="7" y="17" width="26" height="21"/><path d="M12 17v-7a8 8 0 0 1 16 0v7M20 24v8"/><circle cx="20" cy="25" r="2"/>'
          };
          const audienceRows = [['public','Public'],['friends','Friends'],['close','Close Friends'],['only','Only Me']];
          audienceRows.forEach(([value, text]) => {
            const choice = document.createElement('button'); choice.type = 'button';
            choice.className = `mac-audience-choice${model.aud === value ? ' selected' : ''}`;
            if (model.aud === value) { audienceButton.removeAttribute('data-k'); S.P.key(choice, 'aud-btn'); }
            choice.innerHTML = `<span class="mac-radio"></span><span class="mac-audience-icon"><svg viewBox="0 0 40 40" fill="none" stroke="black" stroke-width="2">${symbols[value]}</svg></span><span>${text}</span>`;
            choice.addEventListener('click', (event) => {
              event.stopPropagation();
              if (model.aud === value) { S.P.dispatch('aud-btn'); return; }
              if (!model.menu) S.P.dispatch('aud-btn');
              S.P.dispatch(`aud:${value}`);
            });
            choices.appendChild(choice);
          });
          if (!S.spec.group) field.appendChild(choices);
          const extras = document.createElement('div');
          extras.className = 'mac-post-extras';
          const preview = document.createElement('div');
          preview.className = 'mac-post-preview';
          preview.setAttribute('aria-hidden', 'true');
          const actions = document.createElement('div');
          actions.className = 'mac-post-actions';
          ['Add Photo…', 'Add File…'].forEach((text, index) => {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = text;
            const icon = index === 0 ? '<rect x="3" y="3" width="26" height="26"/><circle cx="11" cy="10" r="2" fill="black"/><path d="M6 25l6-8 5 4 6-11 4 15z" fill="black"/>' : '<path d="M12 22l12-12c5-5-1-11-6-6L5 17c-9 9 2 20 11 11l12-12M9 22l12-12c2-2 5 1 3 3L12 25c-5 5-12-2-7-7"/>';
            b.innerHTML = `<svg viewBox="0 0 32 32" fill="none" stroke="black" stroke-width="2">${icon}</svg><span>${text}</span>`;
            b.addEventListener('click', () => env.log('decoy', {label:text})); actions.appendChild(b);
          });
          const details = document.createElement('div');
          details.className = 'mac-post-details';
          details.innerHTML = '<div><b>Location:</b><br><span>Riverton</span></div><div><b>Tags:</b><br><span>#weekend&nbsp; #hometown</span></div>';
          extras.append(preview, actions);
          field.appendChild(details);
          left.append(description, extras); columns.append(left, field);
          commit.classList.add('mac-compose-commit');
          card.append(columns, commit);
        }
        const actions = card.querySelector('[data-k="post"]')?.parentElement;
        if (actions) Object.assign(actions.style, { margin: '14px 20px', paddingTop: '12px',
          borderTop: '1px solid #9cc3fa' });
      },
    },
  },
});
