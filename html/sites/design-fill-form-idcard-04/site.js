(function () {
  'use strict';
  const C = { site: 'design-fill-form-idcard-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const header = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-brand', header, 'DOCUMENT-TO-FORM LITE');
      const help = u.el('div', 'ds-help', header);
      help.innerHTML = '<span class="ds-info">i</span><span>Date format: YYYY-MM-DD</span>';
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display;
      let note = null;
      if (mode === 'header') {
        note = u.el('div', 'ds-note ds-note-header', content, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        note = u.el('aside', 'ds-note ds-note-panel', main, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      stage.style.position = 'relative';
      const sourceHead = u.el('div', 'ds-source-head', stage);
      sourceHead.setAttribute('aria-hidden', 'true');
      sourceHead.style.cssText =
        'position:absolute;z-index:40;left:44%;right:0;top:0;height:132px;pointer-events:none;background:linear-gradient(135deg,#dce2e9,#f0f2f4);';
      const sourceTitle = u.el('div', '', sourceHead, 'SOURCE DOCUMENT');
      sourceTitle.style.cssText =
        "position:absolute;left:32px;top:21px;color:#101944;font-family:'Arial Narrow','Roboto Condensed',Impact,sans-serif;font-size:42px;line-height:1;font-weight:800;letter-spacing:-.5px;white-space:nowrap;";
      const tools = u.el('div', '', sourceHead);
      tools.style.cssText =
        'position:absolute;right:20px;top:12px;height:46px;display:flex;align-items:center;color:#172440;font:15px Arial,sans-serif;';
      const group = u.el('div', '', tools);
      group.style.cssText =
        'height:46px;display:flex;align-items:center;background:#f8f9fb;border-radius:9px;overflow:hidden;';
      for (const [text, width] of [
        ['−', 42],
        ['100%', 54],
        ['+', 42],
      ]) {
        const item = u.el('span', '', group, text);
        item.style.cssText = `width:${width}px;height:46px;display:grid;place-items:center;color:#172440;font:16px Arial,sans-serif;`;
      }
      const refresh = u.el('span', '', tools, '↻');
      refresh.style.cssText =
        'width:58px;height:40px;margin-left:22px;border-left:1px solid #aeb9c8;display:grid;place-items:center;color:#25354e;font:34px/1 Arial,sans-serif;';
      if (mode === 'toast') {
        note = u.el('div', 'ds-note ds-note-toast', content, ctx.instruction);
      }
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const label = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const preferred = labels.find((x) => label(x).toLowerCase() === 'save') || labels[0];
      const endLabel = label(
        endR.bool(0.5)
          ? preferred
          : endR.pick(
              labels.filter((x) => label(x).toLowerCase() !== 'save').length
                ? labels.filter((x) => label(x).toLowerCase() !== 'save')
                : labels,
            ),
      );
      const place = ctx.finish ? null : endLabel === label(preferred) ? 'form' : 'footer';
      const footer = u.el('footer', 'ds-footer', content);
      if (!ctx.finish) {
        submit = u.el('button', 'ds-submit', footer, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
        if (endR.bool(0.3)) {
          const d = u.el('button', 'ds-xtra', footer, 'Finish task');
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: 'Finish task', collide: true }));
        }
      }
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
