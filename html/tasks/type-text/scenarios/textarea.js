/* type-text/scenarios/textarea.js: textarea scenario sampling. */
(function () {
  'use strict';

  const { C, plainField, makeField, SAVE_LABELS } = env.taskOf('type-text').lib;

  env.scenario('type-text', {
    name: 'textarea',
    sample(g, spec) {
      const r = g.rng;
      const kind = r.pick(['address', 'list', 'notes']);
      let lines;
      let label;
      if (kind === 'address') {
        lines = g.addr.text.split('\n').map((s) => s.trim()).filter(Boolean);
        lines = lines.slice(0, g.level === 'easy' ? 2 : g.level === 'medium' ? 3 : g.ood ? 6 : 4);
        label = r.pick([
          'Shipping address', 'Mailing address', 'Delivery address', 'Postal address', 'Mail destination'
        ]);
      } else if (kind === 'list') {
        const pool = C.PRODUCTS.map((p) => p.name).filter((s) => s.length <= 32 && !/"/.test(s));
        const nl = g.level === 'easy' ? 2 : g.level === 'medium' ? 3 : g.ood ? r.int(5, 7) : r.int(3, 4);
        lines = C.sample(g.rng, pool, nl, g);
        label = r.pick([
          'Packing list', 'Items to order', 'Shopping list', 'Equipment needed', 'Requested goods', 'Product names',
          'Order contents'
        ]);
      } else {
        const notes = ['Leave the parcel at the back door.', 'Ring the bell twice.', 'Call me when you arrive.',
          'The gate code is 4512.', 'Please do not bend.', 'Deliver after 5 pm.', 'Use the side entrance.',
          'Dog in the yard, he is friendly.', 'Hand it to the reception desk.', 'Second floor, first door on the left.',
          'Fragile: glass inside.', 'No signature needed.', 'Please leave it with the neighbor.',
          'The porch light is out.', 'Please tuck it under the bench.', 'Use the front porch, please.',
          'The buzzer is marked 12B.', 'Please leave it by the flowerpot.', 'The driveway is shared.',
          'Park beside the blue gate.', 'Please keep the package dry.', 'Leave it inside the mudroom.',
          'The side gate is unlocked.', 'Please knock softly.', 'The mailbox is near the steps.',
          'Use the lower entrance.', 'Please leave it on the patio.', 'The door sticks a little.',
          'Our office closes at six.', 'Please avoid the wet paint.', 'Leave it beside the garden shed.',
          'The porch steps are uneven.', 'Please use the rear walkway.', 'The lobby door opens inward.',
          'Please leave it near the bench.', 'A delivery shelf is by the door.', 'The path is lit at night.',
          'Please keep it out of the sun.', 'The bell is beside the garage.', 'Leave it behind the planter.',
          'The entrance faces the courtyard.', 'Please place it on the chair.', 'The front path is being repaired.',
          'Use the door by the carport.', 'Please leave it in the porch box.', 'The walkway is on the right.',
          'The entry is around the corner.', 'Please set it beside the steps.', 'The porch has a red mat.',
          'Leave it by the parcel bin.', 'The entrance is through the archway.', 'Please leave it near the side door.',
          'Please use the gravel path.', 'The steps lead to the basement door.', 'Deliver to unit 4 at the rear.',
          'The doorbell is not working.', 'A red lantern marks the entrance.', 'Please place it beneath the awning.',
          'The courtyard gate is usually open.', 'Leave it with the building manager.',
          'Please avoid blocking the doorway.', 'Use the path beside the hedge.', 'The shed door is around back.',
          'The stairs are behind the garage.', 'Please leave it at the west entrance.',
          'The loading door is beside the ramp.', 'Use the covered walkway to the lobby.',
          'The courtyard has two entrances.', 'Please keep the parcel upright.', 'A narrow ramp reaches the entrance.',
          'Leave it beside the watering can.', 'The side path ends at our door.',
          'The porch door is usually unlocked.', 'Please leave it inside the entryway.',
          'Our building has green shutters.', 'A short path leads to the back door.', 'The lobby is open until dusk.',
          'Deliver to the small rear cottage.', 'The gate opens toward the street.',
          'Please set it on the covered deck.', 'Use the walkway along the brick wall.',
          'The entrance is below the stairs.', 'There is a package nook by the lobby.',
          'The door on the alley side is ours.', 'The porch is around the left side.',
          'The front door is under the balcony.', 'Leave it near the stone birdbath.',
          'Use the far courtyard entrance.', 'Please leave it by the oak barrel.', 'The side door has a brass handle.',
          'Deliver before the morning meeting.', 'Use the path past the lilac bushes.',
          'Please place it on the bottom step.', 'Cottage sits beyond the stone wall.',
          'Leave it under the porch swing.', 'Our entrance has a blue tile.', 'The back lane leads to our garage.',
          'Keep it clear of the sprinklers.', 'Please leave it outside the sunroom.',
          'The garden gate has a wooden latch.', 'Please set it on the hall table.',
          'The lift opens beside the mail room.', 'Leave it near the tall oak tree.', 'Use the bakery lane entrance.',
          'Keep it clear of the radiator.', 'The door is under the glass canopy.', 'Leave it on the covered landing.',
          'Path starts at the stone fountain.', 'Please deliver to the upper cottage.',
          'Our gate is opposite the old well.', 'Leave it in the screened porch.',
          'Rear steps lead to the kitchen door.', 'Set it beside the boot rack.', 'Entrance is by the bike shed.',
          'Deliver once the courtyard is quiet.', 'Leave the parcel by the brass bell.', 'Use the orchard path.',
          'Reception is near the stairs.', 'Keep it under the shaded alcove.', 'House number is on the garden wall.',
          'Please leave it on the entry bench.', 'Use the gate beside the willow tree.',
          'Parcel locker is in the lobby.', 'Deliver to the east garden door.', 'Leave it under the stairwell.',
          'Front entrance is by the pergola.'];
        lines = r.sample(notes, g.level ? 2 : g.ood ? 4 : r.int(2, 3));
        label = r.pick([
          'Delivery instructions', 'Notes for the courier', 'Special instructions', 'Notes', 'Receiving information'
        ]);
      }
      const target = lines.join('\n');
      const rows = Math.max(3, Math.min(6, lines.length + 1));
      const counter = r.bool(0.4);
      const ta = plainField('notes', label, r.pick([
        '', 'One item per line', 'Type here', 'Copy lines', 'As given', 'Contents'
      ]), target, 'textarea', false,
        { rows, aliases: { address: ['address box', 'address field'], list: ['list box', 'list'], notes: ['notes box', 'notes field'] }[kind], kindOf: kind,
          ...(counter ? { maxLength: Math.max(120, Math.ceil((target.length + 30) / 10) * 10), counter: true } : {}) });
      spec.lines = lines;
      spec.fields = [ta];
      if (r.bool(0.5) && !g.level) {
        const name = makeField(g, 'name', r.pick(['first', 'last', 'company', 'email']));
        spec.fields = r.bool(0.7) ? [name, ta] : [ta, name];
      }
      spec.ask = spec.fields.map((f) => f.id);
      spec.title = kind === 'address' ? r.pick([
        'Shipping', 'Where should we send it?', 'Delivery details', 'Destination', 'Where will it arrive?',
        'Mailing location'
      ])
        : kind === 'list' ? r.pick([
          'New request', 'Order form', 'Supply request', 'Your items', 'Product list', 'Supply intake'
        ]) : r.pick(['Delivery options', 'Add a note', 'Courier notes']);
      spec.save = r.bool(0.35);
      if (spec.save) spec.saveLabel = r.pick(SAVE_LABELS);
      spec.enter = false;
    },
  });
})();
