// This design adds the Daily Chronicle source art and fits the contact form below the modal controls.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-07',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Enter Contact Information',
    parts: {
      cardContact: (base) => (util, card, d) => {
        base(util, card, d);
        const labels = card.querySelectorAll('.ff-ctable > .ff-doclabel');
        [...d.rows, ...d.extras].forEach((row, i) => {
          if (!/e.?mail/i.test(row.label)) return;
          const label = labels[i];
          label.classList.add('ff-mail-icon');
          label.title = row.label;
          label.setAttribute('aria-label', row.label);
          label.innerHTML =
            '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M1 1h30v22H1z M2 2l14 12L30 2 M2 22l10-10 M30 22L20 12" fill="none" stroke="#b00" stroke-width="2"/></svg>';
        });
      },
      renderCard: (base) => (util, pane, d, rng) => {
        const card = base(util, pane, d, rng);
        const art = util.el('aside', 'ff-news-art');
        art.innerHTML =
          '<svg viewBox="0 0 330 205" aria-hidden="true"><g transform="translate(15 26) rotate(-9 150 75)" stroke="#858585" stroke-width="1.2" fill="#fafaf8"><path d="M17 29 L270 17 L288 136 Q282 154 36 153 Q10 145 6 45 Z"/><path d="M12 35 L273 24 L291 136 Q284 161 39 160 Q12 155 9 43"/><path d="M23 22 L277 16 L293 134 Q288 158 44 153 Q30 152 24 137 Z"/><path d="M33 16 L284 11 L300 127 Q294 151 50 148 Q40 146 37 130 Z"/><path d="M44 11 L291 7 L307 120 Q306 141 65 145 Q51 141 49 128 Z"/><path d="M49 12 L56 128 Q64 148 68 128 L54 17 M56 16 L68 125 Q72 140 73 123 L61 16" fill="none"/><text x="68" y="58" fill="#696969" stroke="none" font-family="Georgia,serif" font-weight="bold" font-size="26" textLength="215" lengthAdjust="spacingAndGlyphs">The Daily Chronicle</text><path d="M67 22h210 M68 27h85 M226 27h51 M70 66h211 M72 72h211" fill="none"/><path d="M75 80h87v43H81z" fill="#cececa"/><path d="M82 117l20-17 13 9 12-22 31 28 M83 119l38-11 37 14" fill="none"/><g fill="none" stroke-width=".8">' +
          Array.from(
            { length: 13 },
            (_, i) => '<path d="M172 ' + (80 + i * 4) + 'h49 M229 ' + (80 + i * 4) + 'h56"/>',
          ).join('') +
          '<path d="M82 130h204 M84 134h200 M88 138h183"/></g></g><g stroke="#ccc" stroke-width=".7"><path d="M19 186h270 M7 180h302 M12 175h298 M30 190h225 M34 169h261"/></g></svg>';
        util.el('div', 'ff-news-tag', art, 'Community news\nthat matters.');
        card.insertBefore(art, card.firstChild);
        return card;
      },
      arranged: () => (ctx, R) => {
        const form = R.formPane.querySelector('.ff-form');
        const brief = ctx.stage.parentElement.querySelector('.ds-brief');
        if (brief) {
          form.querySelector('h2').after(brief);
          brief.classList.add('in-form');
        }
        const footer = ctx.stage.parentElement.querySelector('.ds-footer');
        if (footer) {
          form.append(footer);
          footer.classList.add('in-form');
        }
      },
      fit: () => (ctx, R) => {
        const { root, docPane, formPane } = R;
        const form = formPane.querySelector('.ff-form');
        let fs = Math.min(28, (ctx.size.width / 1672) * 28);
        const maxH = Math.min(ctx.size.height, ctx.stage.clientHeight) - 12;
        for (; fs >= 8; fs -= 0.5) {
          root.style.fontSize = fs + 'px';
          if (form.offsetHeight + parseFloat(getComputedStyle(formPane).paddingTop) <= maxH) break;
        }
        let docFs = parseFloat(getComputedStyle(docPane).fontSize);
        while (root.offsetHeight > maxH && docFs > 8) {
          docFs = Math.max(8, docFs - 0.5);
          docPane.style.fontSize = docFs + 'px';
        }
      },
    },
  },
});
