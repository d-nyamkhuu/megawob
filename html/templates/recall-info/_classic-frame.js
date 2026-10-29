/* recall-info/_classic-frame: shared classic frame parts; overrides still resolve through S.P. */
(function () {
  'use strict';

  function parts(S, { el }, CSS) {
    const BASE = {};
    BASE.styles = (ctx) => {
      let css = CSS;
      for (const key of ['panel', 'fg', 'line', 'accent', 'muted', 'bg']) css = css.split(`var(--${key})`).join(S.D[key]);
      css = css.replace('border-radius: 12px;', `border-radius: ${S.D.frameRadius};`)
        .replace('font-size: 14px; }', `font-size: ${S.D.fontSize}; }`)
        .replace('border-radius: 6px;\n    background:', `border-radius: ${S.D.inputRadius};\n    background:`);
      css = css.replace('height: 32px;', `height: ${S.D.rowHeight}px;`).replace('height: 30px;', `height: ${S.D.footerHeight}px;`);
      ctx.css('ur-style', css);
    };

    // Usable part of the stage (stage-local px): the whole stage minus a floating end control inside it.
    BASE.usable = (ctx) => {
      const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
      const st = ctx.stage.getBoundingClientRect();
      const sub = env.submitEl && env.submitEl.getBoundingClientRect();
      if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
        const cutH = st.bottom - sub.top + 10;
        const cutW = st.right - sub.left + 10;
        if (cutH * box.w <= cutW * box.h) box.h -= cutH;
        else box.w -= cutW;
      }
      return box;
    };

    // The app frame: placed after its content height is known (placeFrame).
    BASE.frame = (ctx, title) => {
      const { rng } = ctx;
      const app = el('div', 'ur-app' + (rng.bool(0.25) ? ' flat' : ''), ctx.stage);
      app.dataset.role = 'recall';
      S.P.bar(ctx, app, title);
      const work = S.P.work(ctx, app);
      return { app, work };
    };

    BASE.placeFrame = (ctx, app, W, H) => {
      const box = S.P.usable(ctx);
      const w = Math.round(Math.min(W, box.w - 16));
      const h = Math.round(Math.min(H, box.h - 12));
      app.style.width = `${w}px`;
      app.style.height = `${h}px`;
      const align = ctx.rng.pick(S.D.alignments);
      const left = align === 'start' ? 8 : align === 'end' ? box.w - w - 8 : (box.w - w) / 2;
      app.style.left = `${Math.round(box.x + Math.max(0, left))}px`;
      app.style.top = `${Math.round(box.y + Math.max(0, (box.h - h) / 2))}px`;
    };

    // Natural height of the work area (app as tall as its content).
    BASE.naturalHeight = (app, work) => {
      app.style.height = 'auto';
      work.style.flex = 'none';
      const h = app.offsetHeight;
      work.style.flex = '';
      return h;
    };

    BASE.bar = (ctx, app, title) => {
      const bar = el('div', 'ur-bar', app);
      el('span', 'ur-mark', bar);
      el('span', 'ur-appname', bar, title);
      el('span', 'ur-user', bar, ctx.rng.pick(S.D.users));
    };

    BASE.work = (ctx, app) => {
      const work = el('div', 'ur-work', app);
      return work;
    };

    BASE.decorated = () => {};
    return BASE;
  }

  env.template('recall-info/_classic-frame', () => ({ parts }));
})();
