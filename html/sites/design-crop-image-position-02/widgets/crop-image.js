// Yosemite crop presentation on the base template's unchanged task mechanics.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-position-02',
  name: 'design',
  split: 'train',
  scenarios: ['position'],
  template: 'crop-image/base',
  design: {
    parts: {
      // Size the actual image before the template constructs its cropbox, so
      // drawing, pointer coordinates and handle placement share one geometry.
      'drawScene@0': (base, S) => function (g, spec, fam, rng) {
        const stage = S.frame.parentElement.parentElement;
        S.W = Math.max(1, Math.floor(stage.clientWidth * .935));
        S.H = Math.max(1, Math.min(Math.round(S.W / 1.52), Math.floor(stage.clientHeight * .78)));
        Object.assign(S.frame.style, { width: S.W + 'px', height: S.H + 'px' });
        g.canvas.width = S.W;
        g.canvas.height = S.H;
        base(g, spec, fam, rng);
        // Keep the real seeded objects, over the photograph's empty wall and
        // tabletop. The former full-photo cover hid the objects the task uses.
        const mask = document.createElement('canvas');
        mask.width = S.W;
        mask.height = S.H;
        const ink = mask.getContext('2d');
        for (const object of spec.objects) {
          const { x, y, w, h } = object.sq;
          const points = fam.shapePoints(object);
          ink.beginPath();
          if (object.kind === 'label') {
            ink.rect(x * S.W, y * S.H, w * S.W, h * S.H);
          } else if (points) {
            points.forEach(([px, py], i) => i ? ink.lineTo(px * S.W, py * S.H) : ink.moveTo(px * S.W, py * S.H));
            ink.closePath();
          } else {
            ink.ellipse((x + w / 2) * S.W, (y + h / 2) * S.H, w * S.W / 2, h * S.H / 2, 0, 0, 2 * Math.PI);
          }
          ink.fill();
        }
        g.globalCompositeOperation = 'destination-in';
        g.drawImage(mask, 0, 0);
        g.globalCompositeOperation = 'source-over';
      },
      'placeIn@0': (base) => function (ctx, wrap, rng, pad) {
        base(ctx, wrap, rng, pad);
        wrap.style.left = Math.round((ctx.size.width - wrap.offsetWidth) / 2) + 'px';
        wrap.style.top = Math.max(8, Math.round(ctx.size.height * .041) - 14) + 'px';
      },
      'ensureStyle@0': (base) => function () {
        base();
        if (document.getElementById('photos-crop-style')) return;
        const style = document.createElement('style');
        style.id = 'photos-crop-style';
        style.textContent = `
        .design.neo-crop .stage .cr-tools { order: 2; align-self: flex-end; }
        .design.neo-crop .stage .cr-frame { box-shadow: 0 1px 3px #0002; background: #c9c5bf url('sites/design-crop-image-position-02/assets/crop-photo.webp') left top / 548.6% 100% no-repeat; }
        .design.neo-crop .stage .cr-frame canvas { filter: drop-shadow(5px 7px 5px #31241988); }
        .design.neo-crop .stage .cr-box { outline: 1px solid rgba(255,255,255,.95) !important; background: transparent; box-shadow: 0 0 0 1px #5556; }
        /* Override the shared 22px handles so adjacent grips cannot cover a corner's center. */
        .design.neo-crop .stage .cr-handle { width: 14px !important; height: 14px !important; margin: -7px 0 0 -7px; background: #fff !important; border: 1px solid #34383d !important; border-radius: 1px; box-shadow: 0 1px 2px #0005; }
        .design.neo-crop .stage .cr-grid::before, .design.neo-crop .stage .cr-grid::after { border-style: solid; }
        .design.neo-crop .stage .cr-dim { opacity: .08; }
        .design.neo-crop .stage .cr-apply { padding: 9px 22px; border: 1px solid #0879e9; border-radius: 6px; background: linear-gradient(#399bff,#0875ef); color: white; font: 16px 'Helvetica Neue',Arial,sans-serif; }
        `;
        document.head.append(style);
      },
    },
  },
});
