/* crop-image/round2.js: the task's judge episodes and round-2 helpers: the goal wording shared with the default scenario
 * (DEFAULT_T), judgeOf / judgeInstruction (ambiguous, impossible, confirm), shrink (silent) and otherTarget (retarget).
 * Attached to lib; logic.js calls through lib at call time. Documented in logic.js's header. */
(function () {
  'use strict';
  const F = () => env.taskOf('crop-image');
  const { COLORS, SHAPES, FACE_NAMES, SIGN_TEXTS, RATIOS, clearRelations, iou, r4, ratioBox } = F().lib;

  // ---------------------------------------------------------------- round 2: judge modes, silent, retarget

  // The default scenario's goal wording (also the judge episodes' unless the scenario words it differently).
  const DEFAULT_T = ['Crop the image tightly around {w}{tol}.', 'Drag the crop handles so the box frames just {w}{tol}.',
    'Crop to {w}{tol}.', 'Adjust the crop box to fit {w} exactly{tol}.', 'Frame only {w} with the crop box{tol}.',
    'Trim the image down to {w}{tol}.', 'Resize the crop area so it contains {w} and nothing more{tol}.',
    'Leave just {w} in the cropped image{tol}.', 'Make {w} fill the entire crop box{tol}.',
    'The crop should meet the outer edges of {w}{tol}.', 'Bring each crop edge flush with {w}{tol}.',
    'Give {w} a snug crop{tol}.', 'Exclude the surroundings while cropping {w}{tol}.',
    'Keep {w} whole and crop away the excess{tol}.', 'Use a minimal crop enclosing {w}{tol}.',
    'Let {w} define the crop boundaries{tol}.', 'Crop with no space around {w}{tol}.',
    'The crop must hug {w} on every side{tol}.', 'Match the crop size and position to {w}{tol}.',
    'Crop away everything past the limits of {w}{tol}.', 'Enclose {w} with no spare crop space{tol}.',
    'A tight view of {w} is the crop goal{tol}.', 'Have the crop trace the bounds of {w}{tol}.',
    'Crop {w} snugly without clipping it{tol}.'];

  const ABSENT_RATIOS = ['5:4', '21:9', '5:3', '7:5'];

  const whatOf = (o) => {
    if (o.kind === 'label') return `the sign that says “${o.text}”`;
    if (o.kind === 'face') return `the ${FACE_NAMES[o.expr]}`;
    return `the ${o.color} ${o.shape}`;
  };
  const wordsOf = (o) => (o.kind === 'label' ? [o.text] : o.kind === 'face' ? [FACE_NAMES[o.expr], `${o.expr} face`, `${o.expr} icon`] : [`${o.color} ${o.shape}`]);

  function judgeOf(jr, spec, mode) {
    if (mode === 'confirm') {
      return { mode, message: spec.apply ? 'The crop box is in place. Should I go ahead and apply the crop?' : 'The crop box is in place. Should I go ahead and submit it?' };
    }
    if (mode === 'impossible') {
      const have = new Set(spec.objects.map((o) => `${o.color} ${o.shape}`));
      if (spec.scenario === 'outline') {
        return { mode, what: ['dashed circle'], text: 'the dashed circle', templates: ['Adjust the crop box to match {w}.', 'Make the crop selection line up with {w}.', 'Crop the image to the region marked by {w}.'],
          message: 'I can\'t do that: there is no dashed circle in the image, only a dashed rectangle.' };
      }
      if (spec.scenario === 'aspect') {
        const ratio = jr.pick(ABSENT_RATIOS);
        const o = spec.objects[spec.goal];
        return { mode, what: [ratio], text: ratio, templates: ['Choose the {w} preset and crop around ' + whatOf(o) + '.', 'Crop ' + whatOf(o) + ' with a {w} aspect ratio.'],
          message: `I can't do that: there is no ${ratio} aspect preset to choose.` };
      }
      let text;
      let what;
      if (spec.scenario === 'content' && jr.bool()) {
        const texts = SIGN_TEXTS.filter((t) => !spec.objects.some((o) => o.text === t));
        const sign = jr.pick(texts);
        text = `the sign that says “${sign}”`;
        what = [sign];
      } else {
        const combos = [];
        for (const c of Object.keys(COLORS)) for (const sh of SHAPES) if (!have.has(`${c} ${sh}`)) combos.push(`${c} ${sh}`);
        const combo = jr.pick(combos);
        text = `the ${combo}`;
        what = [combo];
      }
      return { mode, what, text, templates: DEFAULT_T,
        message: `I can't do that: ${text} is not in the image.` };
    }
    // ambiguous: two objects of the image; the first is the stand-in goal (the sampled one, or any for outline).
    const ia = spec.goal !== null ? spec.goal : 0;
    const ib = jr.pick(spec.objects.map((_, i) => i).filter((i) => i !== ia));
    const a = whatOf(spec.objects[ia]);
    const b = whatOf(spec.objects[ib]);
    const cands = [wordsOf(spec.objects[ia]), wordsOf(spec.objects[ib])];
    const taken = new Set(cands.flat().map((w) => w.toLowerCase()));
    const others = spec.objects.filter((_, i) => i !== ia && i !== ib).map(wordsOf).filter((ws) => !ws.some((w) => taken.has(w.toLowerCase())));
    return { mode, cands, others, text: `${a} or ${b}`, templates: DEFAULT_T, message: `Which one should I crop: ${a} or ${b}?` };
  }

  // The goal in the task's own wording, with the judge episode's text (both candidates, or the missing thing) where the
  // target would be.
  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const core = env.instruct.phrase(rng, j.templates, { w: j.text, tol: '' }, spec.isplit);
    return env.instruct.say(rng, core, { isplit: spec.isplit, terse: `crop: ${j.text.replace(/^the /, '')}`, typo: 0 });
  }

  // Scale a rect about its top-left corner so its width loses d px of an image W px wide (keeps ratio and position).
  function shrink(m, d, W) {
    const w = m.r - m.l;
    const f = Math.max(0.3, 1 - d / W / w);
    return { l: m.l, t: m.t, r: r4(m.l + w * f), b: r4(m.t + (m.b - m.t) * f) };
  }

  // A different target in the same scene; null when none. The result is a full spec copy.
  function otherTarget(spec, model, rng) {
    const tau = F().tolerance(spec).tau;
    const area = spec.area;
    const inA = (b) => !area || (b.l >= area.l && b.t >= area.t && b.r <= area.r && b.b <= area.b);
    const cands = [];
    const v = spec.scenario;
    if (v === 'outline') {
      const T = spec.target;
      const lo = area || { l: 0.03, t: 0.03, r: 0.97, b: 0.97 };
      for (let k = 0; k < 30; k++) {
        const w = rng.float(0.2, Math.min(0.5, lo.r - lo.l - 0.06));
        const h = rng.float(0.25, Math.min(0.55, lo.b - lo.t - 0.06));
        const l = rng.float(lo.l + 0.03, lo.r - w - 0.03);
        const t = rng.float(lo.t + 0.03, lo.b - h - 0.03);
        const target = { l: r4(l), t: r4(t), r: r4(l + w), b: r4(t + h) };
        if (1 - iou(target, T) > 0.5) cands.push({ ...spec, target });
      }
    } else if (v === 'aspect') {
      for (const ratio of RATIOS) {
        spec.objects.forEach((o, i) => {
          const b = ratioBox(o.box, ratio, spec.aspect);
          if (b && inA(b) && !(ratio === spec.ratio && i === spec.goal)) cands.push({ ...spec, ratio, goal: i, target: b });
        });
      }
    } else if (v === 'position') {
      for (const r of clearRelations(spec.objects)) {
        if (r.index !== spec.goal && inA(spec.objects[r.index].box)) cands.push({ ...spec, relation: r.name, goal: r.index, target: { ...spec.objects[r.index].box } });
      }
    } else {
      spec.objects.forEach((o, i) => {
        const okKind = v !== 'content' || o.kind === 'label' || o.kind === 'face';
        if (i !== spec.goal && okKind && inA(o.box)) cands.push({ ...spec, goal: i, target: { ...o.box } });
      });
    }
    const ok = cands.filter((c) => F().error(model, c) > tau);
    return ok.length ? rng.pick(ok) : null;
  }

  Object.assign(F().lib, { DEFAULT_T, judgeOf, judgeInstruction, shrink, otherTarget });
})();
