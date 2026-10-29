/* Heritage Photos: a leather-and-paper design on the shared site frame. */
(function () {
  'use strict';
  let photoImage = null;
  let photoCanvas = null;
  function landscape(parent) {
    // Rasterize the cover crop once at its displayed pixel size. Chromium's
    // adaptive <img> downsampling can otherwise change pixels between resets.
    if (!photoImage) {
      photoImage = new Image();
      photoImage.decoding = 'sync';
      photoImage.loading = 'eager';
      photoImage.src = 'sites/design-set-slider-log-05/assets/mountain-lake.webp';
      photoImage.alt = 'Mountain lake, preserved in sepia';
    }
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    if (!photoCanvas || photoCanvas.width !== width || photoCanvas.height !== height) {
      photoCanvas = document.createElement('canvas');
      photoCanvas.width = width;
      photoCanvas.height = height;
      photoCanvas.className = 'photo-canvas';
      photoCanvas.setAttribute('role', 'img');
      photoCanvas.setAttribute('aria-label', photoImage.alt);
      const canvas = photoCanvas;
      const paint = () => {
        const c = canvas.getContext('2d');
        const scale = Math.max(width / photoImage.naturalWidth, height / photoImage.naturalHeight);
        const sw = width / scale;
        const sh = height / scale;
        c.imageSmoothingEnabled = true;
        c.imageSmoothingQuality = 'high';
        c.drawImage(
          photoImage,
          (photoImage.naturalWidth - sw) / 2,
          (photoImage.naturalHeight - sh) / 2,
          sw,
          sh,
          0,
          0,
          width,
          height,
        );
      };
      if (photoImage.complete && photoImage.naturalWidth) paint();
      else photoImage.addEventListener('load', paint, { once: true });
    }
    parent.appendChild(photoCanvas);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'note-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'We value your feedback',
      cookie: 'Your privacy matters',
      toast: 'Organizer notice',
      promo: 'Upgrade your albums',
      banner: 'Organizer notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'note-x', el, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'note-text', el, '1. How easy was it to adjust your photo?');
      const choices = u.el('div', 'note-choices', el);
      ['Very easy', 'Somewhat easy', 'Difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio';
        radio.name = 'ease';
        radio.value = label;
        u.el('span', '', row, label);
      });
    } else {
      u.el(
        'p',
        'note-text',
        el,
        {
          cookie: 'This organizer can remember your display preferences.',
          toast: 'Your photo is ready for adjustments.',
          promo: 'Try printing your albums as hardcover books.',
          banner: 'Your photo library is available offline.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'note-close',
      el,
      survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  // Keep the template's instruction behavior; only dress and position its elements.
  function dressInstruction(_c, instruction, text) {
    if (!instruction) return;
    instruction.className = 'instruction instruction-' + _c.display;
    instruction.dataset.role = 'instruction';
    if (!text) {
      instruction.textContent = '';
      text = _c.util.el('div', '', instruction, _c.ctx.instruction);
    }
    text.className = 'instruction-text';
    const parts = text.textContent.split(/([“\"][^”\"]+[”\"])/);
    text.textContent = '';
    for (const part of parts) {
      if (/^[“\"]/.test(part)) _c.util.el('strong', '', text, part);
      else text.appendChild(document.createTextNode(part));
    }
    _c.instruction = instruction;
    _c.instructionText = text;
  }

  const parts = {
    'frame.layout': () => (_c) => {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // This design has a dedicated task page even at the smallest viewport.
      const display = ctx.display || 'header';
      document.body.className = `organizer instruction-${display}`;
      Object.assign(_c, { W, H, display, roomy: W >= 1260, tall: H >= 700 });
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      util.el('div', 'stitch', document.body);
      const left = util.el('section', 'page page-left', document.body);
      const header = util.el('header', 'page-head', left);
      util.el('h1', '', header, 'Heritage Photos');
      util.el('span', 'tagline', header, 'Organize  •  Enhance  •  Preserve');
      const photo = util.el('div', 'photo', left);
      landscape(photo);
      util.el('div', 'spine', document.body);
      const right = util.el('aside', 'page page-right', document.body);
      util.el('h2', 'task-title', right, 'Adjustment Task');
      Object.assign(_c, { left, right, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      dressInstruction(_c, _c.header.querySelector('.ref-instruction'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.right;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.right.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').remove();
        dressInstruction(_c, panel, panel.querySelector('.ref-panel-text'));
      }
      const notes = _c.util.el('div', 'notes', _c.right);
      _c.util.el('span', 'pin', notes);
      _c.util.el('div', 'notes-title', notes, 'Notes');
      _c.util.el('p', '', notes,
        'Each adjustment has its own scale. Tick marks show the available values; the number beside a control shows its current setting.');
    },
    'frame.stage': () => (_c) => {
      const { left, util } = _c;
      const panel = util.el('div', 'adjust-panel', left);
      util.el('h2', '', panel, 'Adjustments');
      const stage = util.el('main', 'adjust-stage', panel);
      stage.dataset.role = 'stage';
      const info = util.el('footer', 'file-strip', left);
      util.el('span', 'fname', info, 'DSC_0147.jpg');
      util.el('span', 'fmeta', info, '3264 × 2176   |   2.4 MB');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (!note) return;
      _c.right.appendChild(note);
      dressInstruction(_c, note, note.querySelector('.ref-note-text'));
      const close = note.querySelector('.ref-note-x');
      close.className = 'instruction-close';
      close.textContent = _c.closeLabel;
      note.setAttribute('role', 'status');
    },
    'frame.end': (base) => (_c) => {
      const { headerTools, instruction, instructionText, placement, right, submit, util } = _c;
      // The template owns control creation, labels, decoys and finish mode.
      // Move those controls into the book's task page without adding generic chrome.
      const decoys = [...document.querySelectorAll('[data-role="xtra"]')];
      if (decoys.length) {
        const row = util.el('div', 'organizer-actions', right);
        for (const decoy of decoys) {
          decoy.classList.add('end-xtra');
          row.appendChild(decoy);
        }
      }
      if (submit) {
        right.appendChild(submit);
        submit.classList.add('submit', 'end-' + (placement === 'link' ? 'link' : placement === 'footer' ? 'footer' : 'reference'));
      }
      headerTools.remove();
      document.querySelector('.ref-foot')?.remove();
      document.querySelector('.ref-float-dock')?.remove();
      if (instruction) {
        // Fit the note before the widget measures its fixed anchors.
        let fontSize = parseFloat(getComputedStyle(instruction).fontSize);
        while (instructionText.scrollHeight > instructionText.clientHeight + 1 && fontSize > 12) {
          fontSize -= 0.5;
          instruction.style.fontSize = fontSize + 'px';
        }
      }
      return base(_c);
    },
    // These paper dialogs are specific to the organizer's visual style.
    overlay: () => drawOverlay,
  };

  const paper = { bg: '#f2ecdf', panel: '#f8f3e7', fg: '#2b2723', muted: '#6b625a', line: '#d5cbb6' };
  env.site({
    name: 'design-set-slider-log-05',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-hooks.css'],
    design: {
      THEMES: { heritage: paper },
      LOW_THEME: paper,
      ACCENTS: ['#3267a0'],
      LOW_ACCENTS: ['#3267a0'],
      LANGS: ['en'],
      parts,
    },
  });
})();
