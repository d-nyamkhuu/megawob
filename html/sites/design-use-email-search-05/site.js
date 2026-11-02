// Kinetic cobalt mail workspace.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-search-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        endLabel: (base) => (rng, content) => {
          const label = base(rng, content);
          return rng.fork('kinetic/end-label').bool(0.55) ? 'Continue' : label;
        },
        'frame.end': (base) => (_c) => {
          const result = base(_c);
          const { ctx, util, header, body, rng } = _c;
          document.body.dataset.instruction = _c.display;
          util.el('div', 'kinetic-brand', header, 'MAIL');
          const commands = util.el('div', 'mail-commandbar', header);
          const tools = _c.headerTools;
          header.insertBefore(commands, tools);
          let foot = document.querySelector('.ref-foot');
          if (result.submit) {
            const place = rng.fork('kinetic/end-place').pick(['footer', 'footer', 'header', 'link']);
            const submit = result.submit;
            submit.className = place === 'link' ? 'ref-endlink' : 'ref-submit';
            submit.textContent = submit.getAttribute('aria-label') || _c.label;
            if (place === 'header') tools.append(submit);
            else {
              if (!foot) foot = util.el('footer', 'ref-foot', document.body);
              let bar = foot.querySelector('.ref-tools');
              if (!bar) bar = util.el('div', 'ref-tools', foot);
              bar.append(submit);
            }
          }
          for (const dock of document.querySelectorAll('.ref-float-dock')) if (!dock.children.length) dock.remove();
          if (foot) foot.hidden = !foot.querySelector('button,a');
          body.classList.remove('ref-panel-right');
          document.documentElement.style.setProperty('--chrome-head-h', header.getBoundingClientRect().height + 'px');
          document.documentElement.style.setProperty('--chrome-foot-h', foot && !foot.hidden ? foot.getBoundingClientRect().height + 'px' : '0px');
          return result;
        },
        overlay: (base) => (ctx) => {
          const result = base(ctx);
          if (ctx.kind === 'promo') {
            const box = result.el.querySelector('.ref-ov-box');
            const art = ctx.util.el('div', 'newsletter-icon', box);
            art.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20 32 5l22 15v32H10Z"/><path d="m10 20 22 17 22-17M18 12h28v19"/></svg>';
            const title = ctx.util.el('h2', 'newsletter-title', box, 'Stay in the loop');
            const text = box.querySelector('.ref-ov-text');
            text.textContent = 'Get product updates, tips and news in your inbox.';
            box.prepend(art, title);
            const input = ctx.util.el('input', 'newsletter-email', box);
            input.type = 'email';
            input.placeholder = 'Your email address';
            input.setAttribute('aria-label', 'Your email address');
            box.insertBefore(input, box.querySelector('.ref-ov-row'));
            const primary = box.querySelector('.ref-ov-primary');
            if (primary) primary.textContent = 'Subscribe';
            result.dismiss.textContent = 'No thanks';
            const close = ctx.util.el('button', 'newsletter-close', box, '×');
            close.type = 'button';
            close.setAttribute('aria-label', 'Close');
            close.addEventListener('click', () => ctx.dismiss('close'));
          }
          return result;
        },
      },
    },
  });
})();
