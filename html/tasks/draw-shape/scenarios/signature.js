/*
 * draw / signature: sign in the box of a document and press Accept.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { addPath, C, dist, errorOf, ideal, pt, ptsTargets, r4, resample, segmentsCross, T } = fam.lib;

  // A signature loops back across itself at least this often (a zigzag, however many teeth, never does).
  const SIG_LOOPS = 2;

  // Crossings of a polyline with itself (segment pairs that are not neighbours); the line is thinned past 1,500 points.
  function selfCrossings(r0) {
    const r = r0.length > 1500 ? r0.filter((_, i) => i % Math.ceil(r0.length / 1500) === 0) : r0;
    let n = 0;
    for (let i = 0; i < r.length - 1; i++) {
      for (let j = i + 3; j < r.length - 1; j++) if (segmentsCross(r[i], r[i + 1], r[j], r[j + 1])) n++;
    }
    return n;
  }

  // Signature quality: ink inside the box, horizontal span, y reversals, loops (self-crossings), ink outside.
  function sigQuality(strokes, box) {
    const m = 0.004;
    const inside = (p) => p[0] >= box.x - m && p[0] <= box.x + box.w + m && p[1] >= box.y - m && p[1] <= box.y + box.h + m;
    let Lin = 0;
    let Lout = 0;
    let x0 = Infinity;
    let x1 = -Infinity;
    let turns = 0;
    let loops = 0;
    for (const s of strokes || []) {
      if (!s || s.length < 2) continue;
      for (let i = 1; i < s.length; i++) {
        const L = dist(s[i - 1], s[i]);
        if (inside(s[i - 1]) && inside(s[i])) Lin += L;
        else Lout += L;
      }
      for (const p of s) if (inside(p)) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); }
      loops += selfCrossings(resample(s.filter(inside), 0.004));
      const r = resample(s.filter(inside), 0.01);
      let sign = 0;
      for (let i = 1; i < r.length; i++) {
        const dy = r[i][1] - r[i - 1][1];
        if (Math.abs(dy) < 0.002) continue;
        const sg = Math.sign(dy);
        if (sign && sg !== sign) turns++;
        sign = sg;
      }
    }
    const ink = Math.min(1, Lin / (0.6 * box.w));
    const span = x1 > x0 ? Math.min(1, (x1 - x0) / (0.4 * box.w)) : 0;
    const tf = Math.min(1, turns / 3);
    const lp = Math.min(1, loops / SIG_LOOPS);
    return { short: 1 - ink * span * tf * lp, outside: Math.min(1, Lout / (0.15 * box.w)), ink, span, turns, loops };
  }

  // The oracle's signature always loops: the sideways wobble (slant) must reverse the pen's x motion, which needs
  // slant * 2 pi * loops above the 0.72 drift per unit t (1.5 x that, so every loop is wide enough to be seen).
  function sigShape(loops, slant, phase) {
    return { loops, slant: r4(Math.max(slant, (1.5 * 0.72) / (2 * Math.PI * loops))), phase: r4(phase) };
  }

  function sampleSignature(rng, opts, F) {
    const w = rng.float(Math.min(0.6, F.w - 0.17), Math.min(0.9, F.w - 0.17));
    const h = rng.float(0.17, 0.25);
    const x = F.x + rng.float(0.08, F.w - 0.08 - w);
    const y = F.y + rng.float(0.5 * F.h, 0.95 * F.h - h);
    const cr = rng.fork('content');
    const cs = { csplit: opts.csplit };
    const signer = C.personName(cr, cs).full;
    const sentences = C.sample(cr, C.SENTENCE_GROUPS.policy, 2, cs);
    const titles = ['Service Agreement', 'Consent Form', 'Delivery Confirmation', 'Rental Agreement', 'Purchase Order',
      'Equipment Loan Form', 'Volunteer Waiver', 'Membership Application', 'Expense Approval', 'Non-Disclosure Agreement',
      'Entry Request', 'Asset Use Record', 'Property Receipt', 'Work Order Form', 'Activity Record',
      'Visitor Registration', 'Training Acknowledgment', 'Change Request Form', 'Event Registration Form',
      'Data Access Form', 'Travel Request', 'Room Booking Form', 'Key Custody Record', 'Repair Approval Form',
      'Project Proposal Form', 'Course Enrollment Form', 'Donation Pledge', 'Media Release Form',
      'Award Nomination Form', 'Site Visit Log', 'Shift Assignment Form', 'Inventory Count', 'Equipment Check Form',
      'Meeting Attendance', 'Materials Request', 'Workshop Sign-In', 'Project Handover Log', 'Volunteer Schedule',
      'Package Receipt', 'Room Access Record'];
    return {
      box: { x: r4(x), y: r4(y), w: r4(w), h: r4(h) },
      signer,
      doc: { title: C.pick(cr, titles, cs), lines: sentences },
      sig: sigShape(rng.int(3, 5), rng.float(0.02, 0.05), rng.float(0, 1.5)),
    };
  }

  function signaturePts(spec) {
    const { x, y, w, h } = spec.box;
    const { loops, slant, phase } = spec.sig;
    return Array.from({ length: 64 }, (_, i) => {
      const t = i / 63;
      const s = Math.sin(2 * Math.PI * loops * t + phase);
      const px = x + w * (0.12 + 0.72 * t) - slant * w * Math.cos(2 * Math.PI * loops * t + phase);
      const py = y + h * 0.5 - 0.3 * h * s * (0.65 + 0.35 * Math.sin(Math.PI * t));
      return pt([px, py]);
    });
  }

  const TAU_SIGNATURE = 0.05;

  env.scenario('draw-shape', {
    name: 'signature',
    placed: true,
    easyPartial: true,
    sample(rng, { o, F }) {
      return sampleSignature(rng, o, F);
    },
    tolerance() {
      return { tau: TAU_SIGNATURE, sigma: 0.3 };
    },
    ideal(spec) {
      return signaturePts(spec);
    },
    init(spec, rng, mode) {
      const k = ideal(spec);
      if (mode === 'partial') return { strokes: [k], accepted: false };
      if (mode === 'wrong') {
        const { x, y, w, h } = spec.box;
        const above = y > 0.3;
        const line = Array.from({ length: 10 }, (_, i) => pt([x + w * (0.1 + 0.08 * i), above ? y + h * 0.6 - 0.05 * i : y + h * 0.4 + 0.05 * i]));
        return { strokes: [line], accepted: true };
      }
      return { strokes: [], accepted: false };
    },
    error(model, spec) {
      const q = sigQuality(model.strokes, spec.box);
      return 0.6 * Math.max(q.short, q.outside) + 0.4 * (model.accepted ? 0 : 1);
    },
    solve(spec) {
      return { strokes: [signaturePts(spec)], accepted: true };
    },
    plan(model, spec) {
      const q = sigQuality(model.strokes, spec.box);
      const has = (model.strokes || []).length > 0;
      if ((has || model.accepted) && (q.outside > 0.05 || (model.accepted && q.short > 0.05))) return { click: { control: 'clear' } };
      if (q.short > 0.05) return { path: ptsTargets(signaturePts(spec)) };
      if (!model.accepted) return { click: { control: 'accept' } };
      return null;
    },
    figurePts(spec) {
      return [[spec.box.x, spec.box.y], [spec.box.x + spec.box.w, spec.box.y + spec.box.h]];
    },
    instruction(spec, rng, say, tolP) {
      const who = rng.bool(0.4) ? ` as ${spec.signer}` : '';
      const lp = rng.pick([' that loops back across itself at least twice', ' that has at least two loops in it']);
      const core = T(rng, spec, [
        'Sign in the signature box{who} with a signature{lp}, then accept the signature.',
        'Add your signature{who}{lp} inside the box and accept it.',
        'Draw a signature{lp} in the "Sign here" field{who} and confirm it with Accept.',
        'Sign the {doc}{who}: write a signature{lp} in the box, then accept it.',
        'Put a handwritten signature{lp} in the box{who} and press Accept.',
        'Please sign the form{who}. Keep the signature{lp} inside the box and accept it when it looks right.',
        'Scribble a signature{lp} in the field{who}, staying inside its border, then accept.',
        'To sign{who}, draw a signature{lp} inside the signature box, then use Accept.',
        'First, sign{who} using a signature{lp} within the box. Next, accept it.',
        'Your signature{lp} must stay inside the box. Sign{who}, then accept it.',
        'Before accepting it, sign{who} in the signature box using a signature{lp}.',
        'Complete the {doc}{who} with a signature{lp} inside the box, then accept it.',
        'Keep all ink in the box as you sign{who} with a signature{lp}, and then accept it.',
        'Sign{who} in the "Sign here" field. Once your signature{lp} is ready, accept it.',
        'Signing{who} takes two steps: draw a signature{lp} inside the box, then accept.',
        'Accept a signature{lp} only after drawing it inside the box to sign{who}.',
        'For your signature{lp}, use the "Sign here" box. Sign{who} and accept it.',
      ], { who, doc: spec.doc.title, lp });
      return say(core, 'sign + accept', ['sign inside the box', 'accept the signature']);
    },
    facts(model, spec, out) {
      out.push({ label: 'Signer', value: spec.signer, labels: ['Signed by', 'Name'] });
      out.push({ label: 'Document', value: spec.doc.title, labels: ['Form', 'Document title'] });
    },
    parts(model, spec) {
      return [{ name: 'Signature', value: (model.strokes || []).length, aliases: ['Ink', 'Signature box'] },
        { name: 'Accept', value: !!model.accepted, aliases: ['Acceptance'] }];
    },
    silent(next, prev, spec, rng, cands) {
      const C = env.util.clone;
      const p = prev || {};
      if (next.accepted && !p.accepted) cands.push(() => ({ ...C(next), accepted: false }));
    },
    simulate(m, spec, step) {
      if (step.path) addPath(m, step);
      else if (step.click.control === 'clear') { m.strokes = []; m.accepted = false; }
      else if (step.click.control === 'accept') { if (m.strokes.length) m.accepted = true; }
      return m;
    },
    check(fails) {
      const ss = fam.sample(new env.Rng(7), { scenarios: fam.scenarios, scenario: 'signature' });
      if (errorOf({ strokes: [signaturePts(ss)], accepted: false }, ss) <= TAU_SIGNATURE) fails.push('signature: unaccepted passes');
      const line = [[ss.box.x + 0.05, ss.box.y + ss.box.h / 2], [ss.box.x + ss.box.w - 0.05, ss.box.y + ss.box.h / 2]];
      if (errorOf({ strokes: [line], accepted: true }, ss) <= TAU_SIGNATURE) fails.push('signature: straight line passes');
      // a zigzag (any number of teeth) is not a signature; the oracle's signature (loops) is, at every seed
      for (const teeth of [3, 6, 12]) {
        const zig = Array.from({ length: 2 * teeth + 1 }, (_, i) => [ss.box.x + ss.box.w * (0.08 + 0.84 * i / (2 * teeth)), ss.box.y + ss.box.h * (i % 2 ? 0.8 : 0.2)]);
        if (errorOf({ strokes: [zig], accepted: true }, ss) <= TAU_SIGNATURE) fails.push(`signature: ${teeth}-tooth zigzag passes`);
      }
      for (let k = 0; k < 40; k++) {
        const sg = fam.sample(new env.Rng(8100 + k), { scenarios: fam.scenarios, scenario: 'signature' });
        if (errorOf({ strokes: [signaturePts(sg)], accepted: true }, sg) > TAU_SIGNATURE * 0.5) fails.push(`signature seed ${k}: the oracle's signature errs ${errorOf({ strokes: [signaturePts(sg)], accepted: true }, sg)}`);
      }
    },
  });
  Object.assign(fam.helpers, { sigQuality });
})();
