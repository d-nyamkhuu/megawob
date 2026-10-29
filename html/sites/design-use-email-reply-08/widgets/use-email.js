// Civic mail with compact rows, inbox arrows, a custom reply scrollbar and draft controls.
env.widget({
  task: 'use-email',
  site: 'design-use-email-reply-08',
  name: 'design',
  split: 'train',
  scenarios: ['reply'],
  template: 'use-email/mail',
  design: {
    rowHeight: 40,
    replyTitle: 'Reply to: ',
    replyPlaceholder: '',
    cancelLabel: 'Discard',
    parts: {
      listMade: (base, S) => () => {
        base();
        const { list, track } = S.els;
        for (const [cls, label, dy, glyph] of [
          ['up', 'Scroll inbox up', -40, '▲'],
          ['down', 'Scroll inbox down', 40, '▼'],
        ]) {
          const arrow = S.el('button', 'scroll-arrow ' + cls, track, glyph);
          arrow.type = 'button';
          arrow.setAttribute('aria-label', label);
          arrow.addEventListener('click', () => {
            list.scrollTop += dy;
          });
        }
      },
      listboxOptions: (base) => (...args) => {
        const options = base(...args);
        options.scrollbar.pad = 26;
        return options;
      },
      editorBody: (base, S) => (shown) => {
        const { el } = S;
        const { editor, fields, reg } = S.els;
        const taWrap = el('div', 'ta-wrap', editor);
        const area = el('textarea', '', taWrap);
        const taBar = el('div', 'ta-bar', taWrap);
        const scrollUp = el('button', 'ta-up', taBar),
          scrollThumb = el('button', 'ta-thumb', taBar),
          scrollDown = el('button', 'ta-down', taBar);
        for (const [b, label] of [
          [scrollUp, 'Scroll reply up'],
          [scrollThumb, 'Reply scrollbar'],
          [scrollDown, 'Scroll reply down'],
        ]) {
          b.type = 'button';
          b.setAttribute('aria-label', label);
        }
        scrollUp.addEventListener('click', () => {
          area.scrollTop -= 40;
        });
        scrollDown.addEventListener('click', () => {
          area.scrollTop += 40;
        });
        const drawScroll = () => {
          const travel = Math.max(0, taBar.clientHeight - 64),
            fraction = Math.min(1, area.clientHeight / Math.max(1, area.scrollHeight));
          const h = Math.max(18, travel * (fraction === 1 ? 0.75 : fraction));
          scrollThumb.style.height = h + 'px';
          scrollThumb.style.top =
            32 + ((travel - h) * area.scrollTop) / Math.max(1, area.scrollHeight - area.clientHeight) + 'px';
        };
        area.addEventListener('scroll', drawScroll);
        area.addEventListener('input', drawScroll);
        scrollThumb.addEventListener('pointerdown', (ev) => {
          const start = ev.clientY,
            base = area.scrollTop;
          scrollThumb.setPointerCapture(ev.pointerId);
          const move = (e) => {
            area.scrollTop = base + ((e.clientY - start) * area.scrollHeight) / Math.max(1, taBar.clientHeight - 64);
          };
          const end = () => {
            scrollThumb.removeEventListener('pointermove', move);
            scrollThumb.removeEventListener('pointerup', end);
          };
          scrollThumb.addEventListener('pointermove', move);
          scrollThumb.addEventListener('pointerup', end);
        });
        area.placeholder = shown.mode === 'forward' ? S.D.forwardPlaceholder : S.D.replyPlaceholder;
        area.spellcheck = false;
        fields.body = env.ui.textField(area, {
          value: shown.body || '',
          label: 'body',
          onInput: (v) => S.field('body', v),
        });
        reg.set('field:body', area);
        return area;
      },
      cancelMade: (base, S) => (acts, shown) => {
        base(acts, shown);
        S.button(acts, 'Save Draft', 'compose:draft', () => ({}), null, 'draft');
      },
    },
  },
});
