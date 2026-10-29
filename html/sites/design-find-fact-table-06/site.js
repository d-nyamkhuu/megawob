(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-06',
    'title': 'Personnel Records Lookup - Calibration Utility',
    'instruction': 'top',
    'menu': 'File|Edit|Tools|Help',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-x', top, '✕');
      u.el('span', 'ds-brand', top, C.title);
      const wc = u.el('span', 'ds-wc', top);
      ['_', '□', '✕'].forEach((t) => u.el('i', '', wc, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      function radios(parent, items) {
        items.forEach((t, i) => {
          const r = u.el('div', 'ds-radio', parent);
          u.el('i', i === 0 ? 'on' : '', r);
          u.el('span', '', r, t);
        });
      }
      const left = u.el('aside', 'ds-side ds-left', body);
      u.el('h3', '', left, 'Data Source');
      const lb = u.el('div', 'ds-side-b', left);
      radios(lb, ['Personnel DB', 'Lab Systems', 'Archive']);
      u.el('hr', '', lb);
      u.el('button', 'ds-btn', lb, 'Refresh').type = 'button';
      const ver = u.el('div', 'ds-ver', left);
      u.el('div', '', ver, 'v1.2.3');
      u.el('div', '', ver, 'Linux');
      const content = u.el('div', 'ds-content', body);
      const title = u.el('h2', 'ds-title', content, 'Record Lookup');
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endChoices =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish
        ? null
        : endRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon', 'footer']);
      const endLabel = endText(endRng.pick([...Array(endChoices.length).fill('Submit'), ...endChoices]));
      const endButton = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        if (b.tagName === 'A') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') {
          foot.classList.add('ds-form-footer');
          submit = endButton(foot, 'ds-submit', endLabel);
        } else if (placement === 'link') submit = endButton(foot, 'ds-endlink', endLabel + ' ›');
        else {
          const tools = u.el('span', 'ds-title-tools', title);
          submit = endButton(
            tools,
            placement === 'icon' ? 'ds-submit ds-icon' : 'ds-submit ds-title-submit',
            placement === 'icon' ? '✓' : endLabel,
          );
        }
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const same = (x) => endText(x).trim().toLowerCase() === endLabel.trim().toLowerCase();
        const choices = endChoices.map(endText).filter((x) => !same(x));
        if (choices.length) {
          const collision = endText(collideRng.pick(choices));
          const where = collideRng.pick(['header', 'header', 'footer']);
          const parent = where === 'header' ? u.el('span', 'ds-title-tools', title) : foot;
          const b = u.el('button', where === 'header' ? 'ds-xtra ds-title-xtra' : 'ds-xtra', parent, collision);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
        }
      }
      const right = u.el('aside', 'ds-right', body);
      const t1 = u.el('div', 'ds-side', right);
      u.el('h3', '', t1, 'Tools');
      const tb = u.el('div', 'ds-side-b', t1);
      const icons = [
        '<path fill="#eee" d="M8 6h28v34H8z"/><path d="M12 2v8m6-8v8m6-8v8m6-8v8M12 15h20M12 20h20M12 25h16M12 30h12"/><path fill="#c7c4bc" d="m28 33 12-15 4 4-12 15-6 2z"/>',
        '<rect x="8" y="4" width="30" height="40" rx="2" fill="#dad8d2"/><path fill="#a7bdcf" d="M12 8h22v9H12z"/><path d="M13 22h5v4h-5zM23 22h5v4h-5zM13 30h5v4h-5zM23 30h5v4h-5zM13 38h5v3h-5zM23 38h5v3h-5zM32 22h2v19"/>',
        '<path fill="#777" d="m29 29 14 13-5 5-14-14z"/><circle cx="19" cy="20" r="15" fill="#8d9396"/><circle cx="19" cy="20" r="11" fill="#dae1e5"/><path stroke="#fff" d="M11 20a8 8 0 0 1 9-8"/>',
      ];
      ['Notepad', 'Calculator', 'Look Up'].forEach((label, i) => {
        const r = u.el('div', 'ds-tool', tb);
        const icon = u.el('b', '', r);
        icon.innerHTML =
          '<svg viewBox="0 0 48 50" fill="none" stroke="#191919" stroke-width="2" stroke-linejoin="round">' +
          icons[i] +
          '</svg>';
        u.el('span', '', r, label);
      });
      u.el('hr', '', tb);
      const t2 = u.el('div', 'ds-side', right);
      u.el('h3', '', t2, 'Display');
      const db = u.el('div', 'ds-side-b', t2);
      radios(db, ['Normal', 'High Contrast', 'Monochrome']);
      const st = u.el('div', 'ds-status', document.body);
      u.el('span', '', st, 'Ready.');
      u.el('span', 'ds-clock', st, 'Mon Apr 12 2004   10:24');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
