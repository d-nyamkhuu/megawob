/* type-text/scenarios/copy.js: copy scenario sampling. */
(function () {
  'use strict';

  const { plainField, email, C, phone, KINDS, makeField, SAVE_LABELS } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'copy',
    sample(g, spec) {
      const r = g.rng;
      const pair = r.pick(['address', 'email', 'holder', 'reference', 'phone', 'company']);
      let from;
      let to;
      if (pair === 'address') {
        const lines = (g.addr.text || `${g.addr.line1}\n${g.addr.city}`).split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 4);
        const v = lines.join('\n');
        from = plainField('from', r.pick(['Shipping address', 'Delivery address']), '', v, 'textarea', false, { rows: Math.max(3, lines.length), aliases: ['shipping address', 'delivery address'] });
        to = plainField('to', r.pick(['Billing address', 'Invoice address']), '', v, 'textarea', false, { rows: Math.max(3, lines.length), aliases: ['billing address', 'invoice address'] });
      } else if (pair === 'email') {
        const v = email(g, g.person);
        from = plainField('from', r.pick(['Email', 'Email address']), '', v, 'text', false, { aliases: ['email address', 'email'], check: 'email' });
        to = plainField('to', r.pick([
          'Confirm email', 'Repeat email address', 'Confirm email address', 'Email second entry', 'Enter email again'
        ]), '', v, 'text', false, { aliases: ['confirmation field', 'confirm email box'], check: 'email' });
      } else if (pair === 'holder') {
        const v = `${g.person.first} ${g.person.last}`;
        from = plainField('from', r.pick(['Account holder', 'Full name']), '', v, 'text', false, { aliases: ['account holder', 'full name'] });
        to = plainField('to', r.pick(['Name on card', 'Cardholder name']), '', v, 'text', false, { aliases: ['name on the card', 'cardholder name'] });
      } else if (pair === 'reference') {
        const v = C.orderId(r);
        from = plainField('from', r.pick(['Order reference', 'Order number']), '', v, 'text', false, { aliases: ['order reference', 'order number'] });
        to = plainField('to', r.pick(['Payment reference', 'Transfer reference']), '', v, 'text', false, { aliases: ['payment reference', 'reference for the payment'] });
      } else if (pair === 'phone') {
        const v = phone(g);
        from = plainField('from', r.pick(['Mobile', 'Phone']), '', v, 'text', false, { aliases: ['mobile number', 'phone number'] });
        to = plainField('to', r.pick(['Phone for delivery updates', 'SMS number']), '', v, 'text', false, { aliases: ['delivery phone', 'number for text updates'] });
      } else {
        const v = C.pick(g.rng, C.COMPANIES, g);
        from = plainField('from', r.pick(['Company', 'Organization']), '', v, 'text', false, { aliases: ['company name', 'organization'] });
        to = plainField('to', r.pick(['Invoice to (company)', 'Bill to company']), '', v, 'text', false, { aliases: ['invoice company', 'bill-to company'] });
      }
      spec.copy = { from: 'from', to: 'to' };
      const fields = [from];
      const same = { address: ['street', 'city', 'zip'], email: ['email'], holder: ['first', 'last'], reference: ['order'],
        phone: ['phone'], company: ['company'] }[pair];
      const ctxKinds = Object.keys(KINDS).filter((k) => !['card', 'display', 'headline', ...same].includes(k));
      if (r.bool(0.6)) fields.push(makeField(g, 'other', r.pick(ctxKinds)));
      fields.push(to);
      spec.extraAsk = r.bool(0.35) && fields.length > 2 && g.level !== 'easy';
      spec.fields = fields;
      spec.ask = spec.extraAsk ? ['to', 'other'] : ['to'];
      spec.title = r.pick([
        'Checkout', 'Payment details', 'Account details', 'Billing', 'Confirm your details', 'Profile overview',
        'Form summary', 'Account setup', 'General info'
      ]);
      spec.save = r.bool(0.35);
      if (spec.save) spec.saveLabel = r.pick(SAVE_LABELS);
      spec.enter = spec.save && to.type !== 'textarea' && r.bool(0.4);
    },
  });
})();
