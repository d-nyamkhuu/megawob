/*
 * kit/content/text.js: sentences by domain, paragraphs, topics, headlines, email subjects and bodies, link texts,
 * social posts, file names. API: see the header of kit/content/core.js. Original text; every company, product
 * and person named here is fictional.
 */
(function () {
  'use strict';
  const C = env.content;
  const L = C.lines;

  const SENTENCE_GROUPS = {
    support: L(`
      Thanks for reaching out, and sorry for the trouble with your order.
      I've reset your password; you should receive a confirmation email within the next 10 minutes.
      Could you send us a screenshot of the error message you're seeing?
      Your refund of $42.18 was issued today and may take 3-5 business days to appear on your statement.
      We're aware of the login issue affecting some users and our engineers are working on a fix.
      Please try clearing your browser cache and signing in again.
      I've escalated your ticket (#58213) to our billing team, who will reply by Friday.
      The replacement part shipped this morning via Express Delivery.
      Unfortunately, items marked "Final Sale" can't be returned or exchanged.
      Is there anything else I can help you with today?
      Your subscription will renew automatically on 14 March unless you cancel before then.
      I can see two charges on your account, but one of them is a temporary authorization that will drop off.
      To update your shipping address, go to Account > Addresses and click Edit next to the default address.
      The warranty covers manufacturing defects for 24 months from the date of purchase.
      Our support hours are Monday to Friday, 8 am to 6 pm (CET).
      We've added a 15% credit to your account as an apology for the delay.
      Could you confirm the email address you used when you placed the order?
      The tracking page hasn't updated since Tuesday, so I've opened an inquiry with the carrier.
      If the app keeps crashing, please uninstall it, restart your phone and reinstall version 4.2.1.
      Good news: the item you asked about is back in stock at our Leeds store.
      I'm sorry, but we can't change the delivery date once the parcel has left our warehouse.
      You can download your invoice from the Orders page; look for the PDF icon on the right.
      We've merged your two accounts, and all of your saved items are now under one login.
      Two-factor authentication is now enabled, so you'll be asked for a code each time you sign in from a new device.
      Our records show the package was delivered at 2:14 pm and left at the front door.
      Please allow up to 48 hours for the changes to take effect.
      I've forwarded your feedback to the product team; they review every suggestion.
      If you still don't see the email, check your spam or promotions folder.
      The coupon WELCOME10 is only valid on first orders over $30.
      Your appointment has been moved to Thursday, 9 May at 10:30.
      Thanks for your patience while we looked into this.
      That feature isn't available on the Basic plan, but you can try it free for 14 days on Pro.
      Please don't share your verification code with anyone, including our staff.
      We'll send a prepaid return label to the address on file.
      The outage started at 09:42 UTC and was fully resolved by 11:05 UTC.
      I've cancelled the duplicate order, so you'll only be charged once.
      For security reasons, we can only discuss account details with the account holder.
      Your ticket has been closed, but you can reopen it by replying to this message within 7 days.
      Sorry, our chat agents are all busy right now; your position in the queue is 4.
      Can you tell me which browser and version you're using?
      The sizing chart is under the product photos; the medium fits chest sizes 96-101 cm.
      We received your returned item on 3 June and the inspection is complete.
      I've added a note to your account so the next agent can see the whole history.
      Your loyalty points (1,250) will expire at the end of the month.
      A technician will call you between 1 pm and 5 pm to schedule the visit.
      It looks like the payment was declined by your bank; please contact them or try another card.
      Happy to help, and have a great weekend!
      We've extended your trial by another 7 days so you have time to test the export feature.
      Please reply with your order number and the serial number printed on the back of the device.
      This is a known issue in version 3.8 and is fixed in the update released yesterday.
      Your account is active again, and you can sign in with your existing password.
      Could you let me know whether the warning appears before or after you save the form?
      The color you selected is temporarily unavailable, but the other options are ready to ship.
      A copy of the receipt is attached to this message for your records.
      Please make sure the charging cable is firmly connected at both ends before trying again.
      The return window for this order ends on 22 August.
      Your parcel is being held at the collection point until Saturday evening.
      The new contact number is saved, and future delivery updates will go there.
      Could you share the approximate time the issue first started?
      Your saved preferences will carry over when you move to the new plan.
      The address entered on the order is missing an apartment or unit number.
      I can confirm that your cancellation request was received before the renewal date.
      If the page looks incomplete, try opening it in a private browsing window.
      We can reserve the item for you until close of business tomorrow.
      The latest update is available in your account under Help > Requests.
      The parcel was returned to us because the delivery address could not be verified.
      Please attach a photo of the label on the underside so we can identify the model.
      Your order is packed and waiting for the next scheduled pickup.
      The change is saved, though it may take a few minutes to appear on every device.
      You can pause notifications for this conversation in your communication settings.
      The requested file is larger than the current upload limit of 20 MB.
      Our team can arrange a callback during your preferred time window.
      Your membership remains active through the last day of this month.
      Could you check whether the indicator light flashes when the unit is plugged in?
      The exchange request is approved, and the return details are on their way.
      This service is currently unavailable in your region.
      Your delivery instructions have been passed to the local driver.
      Please wait a moment for the confirmation screen to finish loading before trying again.
      The case number for this conversation is 73106.
      Your account email is confirmed, so you can now receive status updates.
      The settings page now includes an option to change the display language.
      Thanks for flagging the missing page; our content team is checking the guide.
      The booking is confirmed for 16 September, and the details are in your inbox.
      Your message reached us outside our usual hours, and an agent will follow up tomorrow.
      I checked the order history, and the two parcels are scheduled to arrive separately.
      The file is ready to download from the link in your original confirmation message.
      Could you share the name of the page where the problem appears?
      The parcel is still at the regional sorting center, and the carrier expects to scan it overnight.
      We found the missing points and added them to your rewards balance.
      Please sign out of the desktop app before installing the latest update.
      The access invitation is valid until the end of the day on 6 July.
      Your request is with our returns team, and we'll send the next steps by email.
      The monthly statement is available in your account's Documents section.
      The new keyboard layout will appear after you restart the app.
      We've removed the old device from your trusted devices list.
      Your parcel can be collected with the pickup code in the delivery message.
      The discount was applied to the item price, but not to the delivery fee.
      Could you tell me the file format and the size of the document you're uploading?
      We have updated the name on your booking to match the details you provided.
      The service desk will be closed on 1 May for a scheduled company day.
      Your saved draft is still available in the Messages section.
      The label was created this afternoon, and the carrier will collect the parcel on its next route.
      I can resend the setup guide to the email address on your profile.
      The blue cover is sold separately and isn't included with the standard set.
      We've corrected the spelling in your delivery instructions.
      Please keep the original packaging until the replacement arrives.
      The request is waiting for one more detail before our team can continue.
      Your access link has expired, so I've sent you a fresh one.
      The latest version supports importing files with up to 500 rows.
      We couldn't locate a reservation under that phone number; do you have the confirmation code?
      The gift message was added to your order before it left the warehouse.
      Your selected pickup location is closed today, so the parcel will be available tomorrow.
      The account was created with a different email address than the one in your message.
      We've updated the estimated arrival date to 18 October.
      Please include the first three characters of the reference when you reply.
      The guide includes a short section on restoring your previous settings.
      I can arrange for the team to review the duplicate profile and get back to you.
      The final page of the form was left incomplete, so the request did not reach us.
      Your store credit can be used on any item in the current collection.
      The replacement is ready, and we've reserved it under your case number.
      We don't have a confirmed date for the next restock yet.
      Could you let me know if the issue happens on every page or only this one?
      The address book can store up to five delivery locations.
      Your reservation includes two seats, and both names are listed in the confirmation.
      We received the attachment, but its pages appear to be out of order.
      The handoff to our specialist team is complete, and they'll contact you in this thread.
      The parcel label shows a different unit number from the one in your account.
      We've added the missing chapter to the online guide.
      Your change request was recorded at 4:26 pm local time.
      Please keep the case number in the subject line so we can find the conversation quickly.
      The remaining balance will be shown on the final step of the booking.
      You can find the connection guide in the Help section under Getting Started.
      Could you try the same steps in another browser and let me know what happens?
      The saved card ending in 1842 has been removed from your account.
      Please leave the device connected to power while the software update installs.
      The return was approved, and the refund will be processed once the parcel reaches our depot.
      Your booking is now under the correct date, and the original confirmation remains valid.
      The account lock will clear automatically in about 20 minutes.
      Could you send the exact wording shown on the screen when the connection drops?
      The replacement filter is on back order, and we expect another shipment next week.
      Your team invitation was sent again to the address you provided.
      The delivery fee was refunded separately, so it may appear as a second transaction.
      Please make sure the file name does not contain a slash or other special character.
      The parcel is ready at the locker, and the access code is in your text message.
      Your request has been assigned to a specialist who handles account access.
      The room change is confirmed, and the updated details are in your booking summary.
      Could you confirm whether the cable is connected to the port marked IN?
      Your package is scheduled for delivery tomorrow, although the time window is not yet available.
      The transfer completed successfully, and the files should now appear in the shared folder.
      Please check that your device has at least 2 GB of free storage before updating.
      Your seat assignment has changed to row 8, seat 14.
      The credit note is ready in the billing section of your profile.
      The parcel was scanned at the local depot just after midnight.
      Could you tell me whether the sound cuts out on headphones as well as the built-in speaker?
      Your membership card is available in the app under Profile.
      The saved search is working again, and its alerts will resume with the next update.
      Our records show that the return label was downloaded yesterday.
      The workshop starts at 2 pm, and check-in opens 15 minutes beforehand.
      Please wait until the progress bar reaches the end before disconnecting the drive.
      The new delivery window is 10 am to 2 pm on Friday.
      Could you let me know which steps you took just before the page stopped responding?
      Your replacement charger is included in the same parcel as the other items.
      The service visit is confirmed, and the technician has your building access instructions.
      The duplicate profile is now closed, and its saved preferences were moved to your main account.
      The invoice was sent to the billing contact listed on your workspace.
      Your parcel is waiting for collection at the depot on Willow Street.
      Could you tell me what happens when you select the saved template?
      We corrected the duplicate entry, and your original notes are still intact.
      The access request is pending approval from your workspace administrator.
      Your replacement lid is available, and we've waived the standard shipping fee.
      Please check that the date range includes the day you want to view.
      The reservation was released after we didn't receive confirmation by the deadline.
      I've changed the language on your profile to Spanish.
      We can keep this request open while you gather the remaining details.
      The order was split into two shipments because one item was coming from another warehouse.
      Could you share the exact name of the folder where you expected to find the file?
      Your receipt is available as a downloadable file in the order confirmation.
      The scheduled maintenance will begin after midnight in your local time zone.
      We've linked the new household member to your existing account.
      Please make sure the attachment is saved locally before you upload it again.
      The parcel could not be handed over because the building entrance was locked.
      Your draft response was saved automatically when you left the page.
      I can see the reservation, but the guest count is still listed as one.
      The replacement strap is being prepared and should leave our workshop shortly.
      Could you confirm whether the account belongs to an individual or a shared team?
      Your recent changes are visible in the activity history under Settings.
      The collection point will hold the package for three more days.
      We've removed the outdated photo from your public profile.
      Please provide the first and last page numbers shown in the document.
      The voucher remains valid through the date printed in your original message.
      Our records show that the delivery preference was changed after the parcel was dispatched.
      You can add another participant from the meeting details page.
      The profile is set to show your initials whenever an image is not available.
      Your request for a copy of the archived conversation is now with our records team.
      Could you tell me whether the downloaded file opens in another application?
      The item arrived without its instruction sheet, and we've arranged to send one separately.
      The profile photo is being reviewed and should appear once the check is complete.
      Your pickup reservation is valid for the afternoon session on 12 November.
      We've restored the folder to the shared space, including its subfolders.
      Please confirm the postcode so I can check the available delivery routes.
      The account owner can transfer the project to another member from the team settings.
      Your saved payment method is still available for future orders.
      The audio guide can be downloaded in advance for use without a connection.
      The return parcel has reached our depot, and the contents are being checked today.
      Could you let me know whether the message appears in the desktop or mobile app?
      The seat is held for you until 6 pm while we update the booking details.
      We've changed the contact preference to text messages for delivery notices.
      The estimate includes assembly, but it does not include removal of the old unit.
      Your request was received, though the attachment did not come through with it.
      Please leave the original reference on the package so our receiving team can route it.
      The saved filter was shared with everyone who has access to this board.
      We found your missing notebook in the room and have placed it at reception.
      The change takes effect at the start of your next billing period.
      Could you send a screen recording that shows the issue from the first step?
    `),
    product: L(`
      Made from brushed stainless steel, this bottle keeps drinks cold for 24 hours and hot for 12.
      The lightweight frame weighs just 1.2 kg and folds flat for storage.
      Machine washable at 30 °C; tumble dry on low.
      Includes a USB-C cable, a quick-start guide and a 2-year limited warranty.
      Available in five colors: Slate, Sand, Moss, Clay and Midnight.
      The memory foam cushion adapts to your shape and springs back in seconds.
      Water-resistant to 50 meters, so you can wear it in the pool or the shower.
      Each candle is hand-poured in small batches and burns for about 45 hours.
      The 6.1-inch display is bright enough to read in direct sunlight.
      Battery life is rated at up to 30 hours with noise cancellation turned off.
      Dishwasher safe (top rack only).
      Our best-selling hoodie is now made with 60% recycled polyester.
      The adjustable strap fits wrists from 14 to 21 cm.
      Assembly takes roughly 20 minutes and requires only the included Allen key.
      Rated 4.7 out of 5 by more than 2,300 customers.
      Pre-seasoned cast iron gets better with every use.
      The kit contains 48 colored pencils, a sharpener and a canvas roll case.
      Not suitable for children under 3 years: contains small parts.
      Each pack holds 12 bars, individually wrapped for lunch boxes.
      The breathable mesh upper keeps your feet cool on long runs.
      Fits most laptops up to 15.6 inches.
      Our coffee is roasted every Tuesday and shipped within 48 hours.
      The tent sets up in under five minutes with color-coded poles.
      Free from parabens, sulfates and synthetic fragrance.
      Supports fast charging at up to 65 W.
      Compatible with all standard 35 mm curtain rods.
      This edition includes a new foreword and 16 pages of color photographs.
      Hand wash only; do not bleach.
      The ceramic coating is free of PFOA and safe for metal utensils.
      Choose between a matte or gloss finish at checkout.
      Dimensions: 120 x 60 x 75 cm (W x D x H).
      Each order ships in plastic-free, fully recyclable packaging.
      The quiet motor runs at under 40 dB on the lowest setting.
      Ideal for small balconies, the planter holds up to 8 liters of soil.
      Crafted from solid oak with a natural oil finish.
      Includes three interchangeable heads for different hair types.
      The sensor detects motion up to 8 meters away.
      Load capacity: 150 kg per shelf when properly anchored to the wall.
      Pairs with up to three devices and switches between them with one tap.
      Our signature blend combines notes of cedar, fig and black pepper.
      Grows to a height of 60-90 cm and flowers from June to September.
      Sold individually; the stand shown in the photo is not included.
      The board game supports 2 to 6 players and takes about 45 minutes per round.
      Gift wrapping is available for an extra $4.95.
      Every purchase helps plant one tree through our reforestation partner.
      The jacket packs into its own pocket for easy travel.
      Contains 30 servings per container.
      With 12 programs and a delay timer of up to 24 hours, dinner is ready when you are.
      Limited edition: only 500 pieces were made.
      Please note that colors may vary slightly from what you see on screen.
      Size up if you prefer a relaxed fit.
      A soft cotton lining makes this travel pouch gentle on delicate accessories.
      The compact scale measures ingredients in grams, ounces and milliliters.
      Designed with a wide base, this bowl stays steady while you mix.
      The set includes four stackable containers and matching snap-on lids.
      The recycled paper pages are smooth enough for fountain pens.
      This 750-piece puzzle features a hand-drawn map of a quiet coastal town.
      The grippy silicone feet help keep the cutting board in place.
      A hinged lid opens smoothly with one hand and locks shut for transport.
      Each refill lasts up to six months with typical daily use.
      The removable insert keeps small tools organized inside the case.
      A curved handle makes the pitcher comfortable to pour from.
      The tabletop easel adjusts to three angles for drawing or display.
      Made with a solid brass clasp and a durable woven cord.
      The slim profile fits easily into a jacket pocket or small bag.
      A built-in level helps you hang the frame straight on the first try.
      The non-slip backing keeps this runner in place on smooth floors.
      This variety pack includes six flavors, with two of each.
      The wide opening makes the jar easy to fill and clean.
      Soft felt pads protect floors from scratches when you move the chair.
      The zippered compartment keeps travel documents together and easy to find.
      A clear window lets you check the contents without opening the box.
      The raised edge catches crumbs and helps keep the countertop tidy.
      Printed on thick, uncoated stock with a subtle natural texture.
      The flexible gooseneck bends into position and stays where you put it.
      A magnetic closure keeps the notebook securely shut in your bag.
      The lightweight watering can holds 1.8 liters and has a balanced handle.
      The compact design leaves room for other essentials in a crowded drawer.
      A removable mesh pocket separates damp items from the rest of your gear.
      The broad brush head covers more surface with each pass.
      The wooden pieces store inside the tin between games.
      A simple twist adjusts the hinge tension to suit your preference.
      The cotton canvas softens with use while holding its shape.
      This set comes with two sizes of clips for papers and cables.
      The textured surface provides a secure grip, even with wet hands.
      Four adjustable feet help level the table on uneven ground.
      A built-in loop makes the cover easy to remove for washing.
      The fine tip draws clean lines for labels, sketches and notes.
      The woven basket folds flat when you need to save space.
      An insulated sleeve helps maintain the temperature of your lunch.
      The smooth wooden handle is shaped for a comfortable grip.
      A small side pocket holds a key, card or other handy essentials.
      Finished with a water-based sealant that brings out the natural grain.
      The recipe cards are printed on wipe-clean stock for kitchen use.
      A detachable shoulder strap gives you another way to carry the case.
      The set includes eight reusable clips in two neutral colors.
      The rounded corners give the tray a clean look and make it easy to handle.
      The enamel finish resists chips and wipes clean with a damp cloth.
      A roomy main compartment holds a change of clothes and a pair of shoes.
      The linen blend drapes softly and lets air circulate on warm nights.
      Use the marked guides to trim each sheet neatly to size.
      A reinforced base helps the storage bin keep its shape when full.
      A low-profile design slides beneath most sofas and beds.
      The stainless steel filter lifts out easily for rinsing after brewing.
      The padded headband adjusts smoothly for a comfortable fit.
      A hinged stand props the tablet upright in portrait or landscape mode.
      The glaze pools in subtle shades around the edges of each handmade cup.
      An extra-wide mouth makes it easy to add ice and refill on the go.
      The reversible quilt offers a different color on each side.
      A drawstring top keeps contents secure while leaving the bag easy to open.
      The small footprint fits neatly beside a sink or on a narrow shelf.
      A spring-loaded clip holds recipe pages open while you cook.
      The natural cork surface is gentle on blades and easy to wipe down.
      The wool blend adds warmth without making the socks feel bulky.
      A pair of side handles makes the storage crate simple to lift.
      Each sheet tears cleanly along the perforated edge.
      The clear acrylic stand displays photos without distracting from the image.
      A deep pocket on the front keeps frequently used items within reach.
      The frosted finish softens the light while preserving a bright glow.
      This set of six glasses nests securely in the included cardboard divider.
      A firm inner panel helps the toiletry case stand upright on the counter.
      The curved backrest supports a relaxed posture at the breakfast table.
      A row of interior pockets keeps brushes, pencils and small tools sorted.
      The ribbed knit adds stretch and texture to this everyday beanie.
      A sturdy frame and locking wheels make the cart easy to move between rooms.
      The shallow profile makes this dish convenient for serving olives or snacks.
      A soft brushed surface gives the blanket a cozy feel without extra weight.
      The paper labels peel away cleanly and leave no sticky residue.
      A wide brim helps shade your face during sunny afternoons outdoors.
      The ceramic base has room for several stems and a little water.
      A double row of stitching reinforces the handles for everyday carrying.
      The smooth zipper opens from either end for quick access to the contents.
      A removable tray keeps jewelry separate and easy to sort.
      The brushed finish gives the metal hooks a warm, understated look.
      Each wooden hanger has a notched shoulder to hold straps in place.
      A flexible divider lets you customize the layout of the storage box.
      The cotton table runner adds a simple accent to everyday meals.
      A nonslip rim helps keep the mixing bowl steady on the counter.
      The dial turns in precise increments to set the timer for up to 60 minutes.
      A discreet loop on the back makes the wall hanging easy to mount.
      The washable cover slips off quickly when it is time for a refresh.
      A small vent in the lid lets steam escape while food rests.
      The rounded shape makes the soap dish comfortable to hold and easy to clean.
      This pack contains twelve blank cards for notes, tags or small invitations.
      A hidden magnet keeps the measuring spoons together in the kitchen drawer.
      The fold-out handle makes this lantern easy to carry or hang from a branch.
      The wool felt desk mat creates a soft surface for writing and working.
      The shallow wooden frame gives the mirror a clean, understated border.
      The curved stainless steel blades slice through herbs without crushing them.
      The softly tinted glass catches the light and adds color to a windowsill.
      A padded sleeve protects the instrument while leaving room for sheet music.
      The four-leg base keeps the side table steady on carpet and hardwood.
      A compact brush fits into the handle for quick cleaning after use.
      A row of brass hooks provides a handy place for coats and tote bags.
      The cotton cover can be removed and replaced with a fresh one in seconds.
      A small notch in the rim lets you pour neatly without removing the strainer.
      The nested bowls take up little cupboard space when the meal is finished.
      A pair of elastic loops keeps cables neatly gathered in the travel pouch.
      A removable chalkboard panel makes it easy to update the label by hand.
      This collection of pressed leaves is arranged between clear glass panels.
      A locking clasp keeps the keepsake box closed during a move or trip.
      A gently sloped spout gives the watering bottle a steady, controlled pour.
      The ribbed glass shade creates a warm pattern across the wall when lit.
      A row of stitched channels keeps the quilt filling evenly in place.
      The hand-finished edge gives this leather bookmark a distinctive shape.
      A low wooden rail keeps books upright while leaving their covers on display.
      The soft-touch finish makes the reusable lunch cutlery comfortable to hold.
      The lightweight aluminum poles pack down into a compact carry sleeve.
      A curved ceramic handle leaves plenty of room for fingers when serving.
      The double-sided print offers a different botanical pattern on each side.
      The padded floor cushion adds a comfortable perch for reading or play.
      A sturdy paperboard spine lets the recipe binder open flat on the counter.
      The narrow neck makes this bud vase a natural fit for a single stem.
      A woven cotton loop makes the hand towel easy to hang within reach.
      The compact sewing kit includes thread in twelve colors and a pair of snips.
      A flexible silicone collar helps protect the bottle from scuffs and bumps.
      A smooth inner lining helps the fabric pouch slide easily into a handbag.
      The sturdy metal ring makes it easy to clip the key holder onto a belt loop.
      A delicate speckled pattern runs through the glaze of each breakfast bowl.
      A brushed aluminum frame gives the desk lamp a light, balanced feel.
      The hinged storage lid doubles as a serving board for casual meals.
      A fine mesh screen catches tea leaves while allowing water to circulate.
      The soft jersey fabric has a little stretch for comfortable everyday wear.
      A set of numbered tabs helps keep the recipe collection in order.
      The low-glare face makes the wall clock easy to read across the room.
      Each wooden puzzle piece is cut to fit snugly against its neighbors.
      A wide fabric handle makes the cooler easy to carry when fully packed.
      The refill pouch uses less packaging and pours cleanly into the dispenser.
      A simple latch keeps the folding screen securely in place when open.
      The polished edge gives the stone tabletop a smooth, finished appearance.
      A removable drip tray catches excess water beneath the drying rack.
      A pair of hidden pockets keeps the picnic blanket folded neatly for storage.
      The offset handle leaves enough clearance to stir comfortably in a deep pot.
      Each wooden bead is sanded smooth and finished with plant-based oil.
      A sturdy canvas bottom helps the laundry hamper stand upright between loads.
      The translucent measuring cup has clear markings at every 50 milliliters.
      A soft rubber edge helps the window squeegee glide without leaving streaks.
      A perforated metal back lets warm air move around the stored shoes.
      The covered button adds a neat finish to the upholstered seat.
      A built-in pencil groove keeps drawing tools from rolling off the desktop.
      The wide elastic band holds the journal closed while traveling.
      A pair of locking tabs keeps the storage lid firmly attached to its base.
      The textured ceramic surface gives the fruit bowl a subtle handmade look.
      A foldable base makes the tabletop screen easy to store after use.
      A detachable funnel makes it easier to fill narrow bottles without spills.
      The padded cover softens the sound of keys while protecting the instrument.
      A clear protective layer helps the placemat resist everyday spills.
      The angled handle gives the garden fork extra room for a comfortable grip.
      A small ceramic dish keeps rings and earrings together beside the sink.
      A weighted base keeps the reading lamp steady when its arm is repositioned.
      A sturdy wooden dowel keeps the hanging organizer level against the wall.
      A soft cotton pocket on the front holds a small book or folded map.
      A broad foot pedal opens the waste bin without using your hands.
      The natural wood grain makes each picture ledge slightly different.
      A removable cushion adds extra comfort to the bench during long meals.
      The padded grips make the hand weights comfortable to hold during a workout.
      A narrow divider keeps folded letters upright inside the desk organizer.
      The sturdy frame supports a full stack of folded towels without wobbling.
      A small hanging loop makes the scrub brush easy to dry between uses.
      The smooth ceramic surface releases baked food easily after soaking.
      A set of colored wooden markers helps players keep track of their turns.
      The soft woven strap adjusts to keep the camera pouch close at hand.
    `),
    news: L(`
      The city council approved the new cycling lanes in a 7-2 vote on Tuesday night.
      Officials expect construction on the Riverside bridge to finish by late autumn.
      Local schools will open two hours late tomorrow because of heavy snow.
      The museum's spring exhibition drew more than 40,000 visitors in its first month.
      Fuel prices fell for the third week in a row, according to the regional transport authority.
      Volunteers collected 1.8 tonnes of litter during Saturday's beach clean-up.
      The library will extend its weekend opening hours starting 1 September.
      A new direct rail service between Lyon and Turin begins in December.
      Researchers at the university published the results in a peer-reviewed journal last week.
      Residents are asked to conserve water until the reservoir levels recover.
      The farmers' market moves to Cobblestone Square for the summer season.
      Ticket sales for the jazz festival opened at 10 am and sold out in under an hour.
      The mayor said the budget would prioritize housing, transit and parks.
      Temperatures are forecast to reach 34 °C on Thursday, with thunderstorms in the evening.
      The airport handled a record 2.3 million passengers in July.
      Northwind Logistics announced it will open a distribution center outside Rotterdam next year.
      The regional orchestra will perform a free concert in Willow Park on Sunday.
      A section of Main Street will be closed to traffic from 8 pm to 5 am for resurfacing.
      Unemployment in the region dipped to 4.1%, the lowest level in a decade.
      The local football club confirmed the signing of a 19-year-old midfielder.
      Hospitals report a rise in seasonal flu cases and urge residents to get vaccinated.
      The ferry service to the islands has been suspended due to high winds.
      Bluepeak Labs said its new battery design could cut charging times by a third.
      Police are asking witnesses to come forward after a minor collision on Station Road.
      The annual marathon will reroute three bus lines on Sunday morning.
      The council plans to plant 5,000 trees across the city by 2030.
      Shoppers spent 6% more online this holiday season than last year.
      A heritage group is campaigning to restore the old customs house on the waterfront.
      The new pedestrian bridge opens to the public on 21 June.
      Electricity bills are expected to rise slightly in the next quarter.
      Students from Fernhill Academy won first place in the national robotics contest.
      A rare snowy owl was spotted near the nature reserve this weekend.
      Construction of 320 affordable homes will begin on the former rail yard in spring.
      The central bank left interest rates unchanged at 3.25%.
      Organizers say the food festival will feature more than 80 local vendors.
      The highway authority warned of delays of up to 40 minutes near junction 12.
      A new exhibition on ancient trade routes opens at the city museum on Friday.
      The startup raised $18 million in its latest funding round.
      Health officials confirmed that tap water is safe to drink again.
      The zoo welcomed two red panda cubs, its first births of the species in 15 years.
      Voter turnout reached 68%, up from 61% in the previous election.
      The tech conference returns to the convention center from 3 to 5 October.
      Heavy rain caused flooding on several roads in the eastern districts.
      The theater company announced its new season, opening with a comedy in September.
      Commuters can now pay for buses and trams with a contactless card.
      Local bakeries say the price of flour has doubled since last spring.
      A community garden on Elm Street will host free workshops every Saturday.
      Scientists recorded the warmest February on record for the region.
      The new swimming pool is expected to open before the summer holidays.
      Saltmarsh Coffee Co. will close its original shop after 22 years in business.
      A restored clock tower will chime again for the first time in nearly three decades.
      The county's new mobile library will visit six villages on a fortnightly route.
      The first batch of this year's apples arrived at the market a week earlier than usual.
      A sculpture trail featuring 12 works by local artists opens along the canal on Saturday.
      The community theater is seeking volunteers to help build sets for its winter production.
      A new night shelter will offer 28 beds during cold weather alerts.
      A team of students designed a low-cost sensor to monitor soil moisture in school gardens.
      Organizers added an extra performance after the town's summer play sold out in two days.
      A new ferry timetable adds an early crossing for residents traveling to the mainland.
      Local growers expect this year's lavender harvest to be the largest since 2018.
      The railway station has installed covered bicycle parking for 60 commuters.
      The annual lantern parade will follow a new route through the market district this year.
      A flood-monitoring station is now sending live river levels to emergency crews.
      More than 300 people joined the opening walk along the newly marked woodland loop.
      A second weekly produce market will launch in the square beginning in May.
      The observatory will host a public viewing night when the meteor shower reaches its peak.
      Road crews completed repairs to the hillside route three days ahead of schedule.
      The regional museum received a collection of maps donated by a local family.
      A new apprenticeship program will place 16 trainees with workshops across the district.
      The town's ice rink will extend evening sessions during the school holiday.
      Gardeners recorded a rise in native bee sightings after planting new wildflower borders.
      The annual book exchange will accept donations at the community hall through 14 March.
      An upgraded flood barrier passed its first test during heavy rainfall overnight.
      The old mill is set to become a shared workspace after renovation begins this summer.
      Weekend bus fares will be reduced for passengers traveling within the county center.
      The riverside path now has signs showing walking times to nearby parks and landmarks.
      A local choir will perform songs from four centuries at its free winter concert.
      The council has approved plans for a covered play area beside the east neighborhood hall.
      Researchers tracked the migration of swifts using tiny tags fitted at the nature center.
      The market square fountain has returned to service after a pump replacement.
      Organizers expect 5,000 visitors at this year's regional flower show.
      The county's emergency text alert system now covers every household in the valley.
      Two historic rowing boats are being restored for display at the maritime center.
      A volunteer survey counted 46 bird species during one morning at the wetlands reserve.
      The regional science fair awarded its top prize to a team studying local water quality.
      The coastal observatory will reopen its renovated visitor gallery on Saturday.
      A new footbridge over Willow Creek has shortened the walk between two village schools.
      The district's summer reading challenge has attracted more than 600 participants so far.
      A trial on Quarry Road will give buses priority at the junction during evening rush hour.
      Residents can reserve plots at the new allotment site opening beside Brookfield Lane.
      A flock of flamingos stopped at the marsh for a day during its northbound migration.
      A new bookshop has opened in the former post office on Market Lane.
      The council will test quieter delivery hours in the town center for six weeks.
      A greenhouse built by students will supply fresh herbs to the school kitchen.
      The regional chess final drew 112 players to the civic center over the weekend.
      Work has begun on restoring the stone steps that lead to the hilltop lookout.
      A traveling planetarium will visit five primary schools before the end of term.
      The town's autumn fair will include a produce auction for the first time this year.
      A new platform lift has made the upper gallery at the courthouse accessible to visitors.
      The local history society is asking residents to share photographs of the old bus depot.
      More than 200 runners took part in the first dawn race around Alder Lake.
      The railway operator will add extra carriages for the weekend harvest festival.
      A former fire station is being converted into rehearsal rooms for local music groups.
      The northern district's repair hotline received 1,400 reports during its first month.
      A new boardwalk now connects the bird hide with the reserve's eastern entrance.
      A team of volunteers has mapped every public bench along the greenway.
      The old courthouse garden will host outdoor film screenings on four Fridays in August.
      The county's first electric maintenance van has entered service with the parks team.
      A collection of painted shop signs from the 1930s is on view at the local history center.
      The makers' fair has added a second day after exhibitor spaces filled within a week.
      A new pedestrian crossing outside Oakfield Station will begin operating next month.
      The town's junior rowing team brought home three medals from the regional regatta.
      A restored greenhouse at Fernbank Gardens will open for guided tours this weekend.
      The mobile cinema will screen classic adventure films in six village halls this winter.
      Local beekeepers reported a strong honey harvest following a mild start to spring.
      A section of the canal towpath will close for two weeks while new drainage is installed.
      The nature reserve has added a viewing platform overlooking the restored reed beds.
      The council's new grants will support small projects that improve shared outdoor spaces.
      The hilltop cable car will run an extra hour each evening during the school break.
      The hillside footpath reopened after crews reinforced a section damaged by winter storms.
      A new evening shuttle will connect the hospital district with the central bus station.
      The annual seed swap brought gardeners from 18 villages to the Grange Hall on Saturday.
      A survey found that more residents are using the riverside trail for their daily commute.
      The town's brass band will mark its 90th year with a concert in the old assembly room.
      A pair of peregrine falcons has nested on the bell tower for the third spring in a row.
      The county's largest solar canopy is now generating power above the depot car park.
      The heritage railway will add steam journeys on three Sundays during the summer.
      A new public fountain on Lantern Street uses rainwater collected from nearby rooftops.
      A nesting box project has added 40 new homes for swallows around the village green.
      The county fair will introduce a quiet hour for visitors who prefer a calmer setting.
      A bus shelter with a living roof has been installed beside the community sports ground.
      More than 90 cyclists joined the annual ride from the seafront to the hilltop reservoir.
      The regional youth orchestra is inviting applicants for its summer music camp.
      Residents planted 700 bulbs along the station approach as part of a neighborhood project.
      The council approved a small grant for repairs to the roof of the community hall.
      The annual lantern workshop has moved to the forge building to accommodate more families.
      A new bird count recorded 23 species in the restored marsh during its first weekend.
      The train operator will provide extra space for bicycles on services to the summer fair.
      A row of empty shops on Birch Street will become studios for local craftspeople.
      The town's winter market will feature a produce stall run by the school gardening club.
      The sports ground has opened two new courts for community badminton sessions.
      A map of public drinking fountains is now available at the visitor information desk.
      A beaver family has been seen near the northern bend of the protected wetlands.
      A four-mile walking route now links the villages of Brackenford, Lowmere and Pennwick.
      A landslide has closed the ridge road while crews assess damage to the hillside.
      A new cold-storage facility will help nearby farms keep berries fresh after harvest.
      Fire crews contained a grass fire near the bypass before it reached nearby homes.
      The regional airport will add a morning flight to the northern coast starting in March.
      A rare fossil found by a beachcomber is now on display at the coastal heritage gallery.
      The annual open studios weekend will feature work by 54 artists across the valley.
      Several morning trains were delayed after a signal fault near the northern junction.
      The county's annual cheese judging drew entries from 26 dairies and small farms.
      A covered waiting area has opened at the ferry terminal following a year of construction.
      The village's weekly market will move indoors during renovations to the covered arcade.
      A new footpath through the orchard gives visitors access to the historic stone press.
      The county has begun mapping dark-sky areas to guide future outdoor lighting projects.
    `),
    policy: L(`
      By creating an account, you agree to our Terms of Service and Privacy Policy.
      We collect only the data needed to provide and improve the service.
      You may request a copy of your personal data at any time.
      Orders can be cancelled free of charge within 24 hours of purchase.
      Returns are accepted within 30 days of delivery, provided items are unused and in their original packaging.
      Refunds are issued to the original payment method.
      We use cookies to remember your preferences and to understand how the site is used.
      You can withdraw your consent at any time in Cookie Settings.
      Prices include VAT where applicable; shipping costs are shown at checkout.
      This offer cannot be combined with other promotions or discount codes.
      Accounts inactive for more than 24 months may be deleted after notice.
      We will never sell your personal information to third parties.
      Users must be at least 16 years old to register.
      Subscription fees are billed in advance and are non-refundable, except where required by law.
      You are responsible for keeping your password confidential.
      We may update these terms from time to time; continued use of the service means you accept the changes.
      Content you upload remains yours, but you grant us a license to display it within the service.
      Delivery times are estimates and are not guaranteed.
      Personal data is stored on servers located in the European Union.
      You can opt out of marketing emails using the link at the bottom of each message.
      Promotional credit expires 90 days after it is issued.
      We reserve the right to refuse or cancel orders that appear fraudulent.
      These terms are governed by the laws of the Netherlands.
      For questions about this policy, contact privacy@example.com.
      Gift cards cannot be exchanged for cash.
      A cancellation fee of 50% applies to bookings cancelled less than 48 hours before arrival.
      Personal information is retained only as long as necessary for the purposes described above.
      We use encryption in transit and at rest to protect your information.
      Third-party links are provided for convenience; we are not responsible for their content.
      Free shipping applies to standard delivery within the mainland only.
      Abuse of the referral program may result in account suspension.
      Check-in is from 3 pm and check-out is by 11 am.
      Pets are welcome in designated rooms for an additional fee of €15 per night.
      Items damaged in transit must be reported within 48 hours of delivery.
      The warranty does not cover damage caused by accidents, misuse or unauthorized repairs.
      Smoking is not permitted anywhere on the premises.
      You may not use automated tools to access the service without written permission.
      If any provision of these terms is found invalid, the remaining provisions remain in effect.
      Children's data is processed only with verified parental consent.
      Booking confirmations are sent by email within 15 minutes.
      Late payments may incur interest at 1.5% per month.
      We comply with all applicable data protection laws, including the GDPR.
      Event tickets are non-transferable unless stated otherwise.
      Membership renews automatically each year on the anniversary of your sign-up date.
      Analytics cookies are disabled until you accept them.
      Minimum order value for delivery is $15.
      Last updated: 12 January 2025.
      Requests to delete your account are processed within 30 days.
      Please read these terms carefully before using the service.
      Any disputes will first be resolved through good-faith negotiation.
      We retain server logs for up to 30 days to investigate service disruptions.
      You can change your notification preferences from your account settings.
      Changes to a booking are subject to availability and any fare difference.
      Returned items must include all accessories and a proof of purchase.
      A receipt will be sent to the email address provided at checkout.
      The advertised rate is available for stays booked before 30 June.
      We may temporarily limit access while carrying out scheduled maintenance.
      Please allow up to five business days for a returned payment to appear.
      Each household may claim one welcome voucher.
      Discounts apply to eligible items only and exclude delivery charges.
      Reservations are held for 15 minutes after the scheduled arrival time.
      Lost property is kept at reception for up to 60 days.
      Shared facilities are available to registered members during opening hours.
      Children under 12 must be accompanied by an adult in the pool area.
      Bicycles may be stored in the covered area beside the main entrance.
      Food and drinks are not permitted inside the exhibition rooms.
      Visitors are asked to leave large bags in the lockers provided.
      Photography is permitted unless a display is marked otherwise.
      The reading room is closed on public holidays.
      Library materials may be renewed twice unless another reader has requested them.
      Overdue items incur a daily fee of 20 cents per item.
      Residents can borrow up to eight books at a time.
      Workshop places are reserved in the order registrations are received.
      A guardian must sign the registration form for participants under 18.
      Cancellations received less than 24 hours before a class are not eligible for a refund.
      Please bring your own materials unless the course description says they are included.
      The organizer may cancel a session if fewer than six people register.
      Certificates are issued to participants who attend every session.
      Applications must be received by 5 pm on the closing date.
      Incomplete applications may be returned for correction before review.
      Decisions are usually communicated within six weeks of the deadline.
      Applicants may appeal a decision within 14 days of receiving notice.
      Confidential documents are accessible only to staff assigned to the case.
      Records are reviewed annually and archived according to the retention schedule.
      Visitors must sign in at the front desk and wear a temporary badge.
      Contractors are required to follow the site safety rules while on the premises.
      Equipment may not be removed from the building without written authorization.
      Report any damage to shared property to the facilities team as soon as possible.
      Waste should be sorted into the labeled recycling and general bins.
      The outdoor courtyard closes during severe weather.
      Service animals are permitted in all public areas.
      Bags may be inspected at the entrance as a condition of admission.
      The venue reserves the right to refuse entry to anyone without a valid ticket.
      Tickets must be retained until the end of the performance.
      Re-entry is not permitted after leaving the auditorium.
      Late arrivals may be seated during a suitable pause in the program.
      Members may hold one active room reservation at a time.
      The displayed schedule may change when a session runs longer than planned.
      Please keep conversations quiet in areas marked for study.
      Personal belongings left unattended may be moved to the lost property office.
      The service may remove material that violates these community guidelines.
      Posts must relate to the topic of the discussion they appear in.
      Repeated unwanted messages may lead to a temporary restriction on messaging.
      Users can block accounts they do not wish to hear from.
      Do not share another member's contact details without their permission.
      Uploaded photographs must be ones you have permission to share.
      Profile names may not impersonate another user or an official service account.
      Moderators may hide a post while they review a reported concern.
      Appeals of moderation decisions are reviewed by a different moderator where possible.
      Accounts used to evade a previous restriction may be closed.
      Keep discussions respectful, even when members disagree.
      Promotional posts are allowed only in the designated community area.
      Members may edit their own posts for up to one hour after publication.
      The service may limit the number of invitations sent in a single day.
      Private messages are visible only to their sender and recipient unless reported.
      Please do not post passwords, access codes or other security credentials.
      Content flagged by several users may be temporarily hidden pending review.
      A moderator may remove duplicate listings to keep the directory clear.
      Reviews must describe an experience with the place or service being rated.
      Business owners may respond to reviews once per listing.
      Ratings cannot be changed after the listing has been archived.
      Reservations must be made in the name of the person who will attend.
      A booking may be transferred to another guest up to 24 hours before arrival.
      Room keys must be returned to the desk before departure.
      Guests may use the shared kitchen until 9 pm each day.
      The meeting room is available in 30-minute booking periods.
      Tables in the common area cannot be reserved in advance.
      Please return borrowed equipment to the labeled storage cabinet.
      Visitors must be accompanied by their host beyond the reception area.
      The building access card must be returned when membership ends.
      A lost access card should be reported to reception immediately.
      Food deliveries should be collected from the entrance lobby.
      The workshop begins promptly, and late participants may join at the next break.
      Participants may request an attendance record from the course coordinator.
      Materials provided for a class are for use during that session only.
      Registration is complete once the confirmation message has been received.
      Waitlisted participants are contacted if a place becomes available.
      A participant may nominate a substitute by notifying the organizer in advance.
      Please use the marked paths when crossing the grounds.
      Children must remain with their supervising adult throughout the visit.
      The garden gates are locked at closing time each evening.
      Items found on the premises are held for 30 days before being donated.
      Requests for accessible seating should be made when booking.
      The venue may pause entry while an emergency drill is underway.
      A notice will be posted at the entrance whenever an area is temporarily unavailable.
      Members are asked to update their address within 14 days of moving.
      Please return borrowed umbrellas to the stand beside the reception desk.
      The archive accepts research appointments on weekdays between 9 am and 4 pm.
      A staff member must be present when visitors enter the equipment room.
      Shared workstations are cleared of personal files at the end of each day.
      Guests may reserve the rooftop terrace for up to two hours.
      The first aid kit is kept in the cabinet marked with a green symbol.
      Please label food stored in the shared refrigerator with your name and date.
      Deliveries that cannot fit in the parcel locker are held at reception until closing.
      The quiet room is available to visitors who need a short break from busy areas.
      Members are responsible for returning borrowed keys before the end of their visit.
      Personal scooters must be parked in the rack outside the west entrance.
      The organization does not accept cash payments at its information desk.
      A valid membership card is required to borrow audiovisual equipment.
      Please leave the reception counter clear for visitors waiting to be served.
      The noticeboard is reserved for announcements approved by the site coordinator.
      Children may use the play area only while a supervising adult remains nearby.
      A signed equipment checklist is required before a group uses the studio.
      The community hall must be vacated by 10 pm on weekdays.
      Reusable containers are available at the café counter while supplies last.
      Visitors should use the side entrance when the main doors are being serviced.
      The organization may reschedule an appointment when a staff member is unavailable.
      Members can request a printed copy of the current house rules at reception.
      Please return newspapers to the reading rack after use.
      Vehicles left in the loading zone may be moved to keep the access route clear.
      A room booking is released if the group has not arrived within 20 minutes.
      The gallery shop accepts returns of unused items within seven days with a receipt.
      Staff may ask visitors to lower the volume of personal audio devices.
      Meeting organizers are responsible for leaving the room ready for the next group.
      The outdoor seating area is available on a first-come, first-served basis.
      Please notify the front desk if you find a door that does not close properly.
      Banners may be displayed in the lobby for no longer than one week.
      Members may borrow one portable charger at a time from the service desk.
      The language exchange welcomes participants at any level of experience.
      A parent or guardian must remain on site during children's activities.
      The organization keeps a record of items loaned to partner groups.
      Groups larger than ten people should arrange their visit in advance.
      Shared tools must be cleaned and returned to their marked places after use.
      The reception desk can store small parcels for registered members until 6 pm.
      Visitors are asked to use the lower path when the upper walkway is closed.
      Each room has a posted capacity that must not be exceeded.
      Members may reserve a locker for the duration of their visit.
      The public noticeboard is cleared on the first Monday of each month.
      Please collect printed materials before leaving the workshop area.
      An interpreter can be requested when an appointment is arranged.
      The venue publishes opening hours on the information board by the entrance.
      Any changes to a scheduled tour are shared with registered participants by email.
      A replacement receipt can be requested from the service desk within 90 days of purchase.
      Membership cards are personal and may not be loaned to another visitor.
      The monthly newsletter is sent only to members who have opted in.
      Please notify the organizer if you will arrive with a group larger than six people.
      A reserved seat is held until ten minutes before the start of the event.
      Visitors may bring sealed water bottles into the lecture hall.
      The coat room closes 30 minutes after the final event of the day.
      Any item left in a locker overnight will be transferred to reception.
      Requests to correct contact details are handled within five working days.
      We use your postal address only to send materials you have requested.
      Session recordings are available to registered participants for seven days.
      Copies of event handouts may be shared for personal study with attribution.
      The facility does not provide storage for items larger than a standard suitcase.
      Please keep the fire doors clear at all times.
      Portable speakers may be used outdoors at a volume that does not disturb nearby visitors.
      The organization may close a room temporarily to prepare it for a scheduled activity.
      A separate reservation is needed for each piece of equipment in the media room.
      Equipment loans must be collected and returned during staffed hours.
      Requests for a booking change should include the original confirmation number.
      A booking is confirmed only after the organizer sends a written confirmation.
      Waitlist positions are assigned according to the time each request is received.
      The registration desk opens 30 minutes before the first scheduled session.
      Participants are responsible for checking the published schedule before travelling.
      Children may not be left unattended in the lobby or garden.
      The play area is closed during private events in the community hall.
      Please keep bicycles out of the entrance and emergency access lanes.
      The charging station is available for personal devices during opening hours.
      Visitors may not connect personal equipment to the venue network without staff approval.
      Printed notices must include the name of the group that posted them.
      Temporary displays may remain in the foyer for up to five business days.
      The venue cannot guarantee seating for guests who arrive after a session begins.
      A host must meet invited guests at reception before they enter staff areas.
      Guests using the shared kitchen are asked to clean the counter after preparing food.
      Refrigerator contents are removed each Friday evening.
      The lending collection is closed for inventory on the last weekday of each quarter.
      Materials requested from the archive are prepared for collection within three working days.
      Researchers may take notes in the archive but may not mark original materials.
      A visitor pass must be displayed visibly while inside the building.
      Groups using the rehearsal room must finish packing away by their booked end time.
      The studio floor should be left free of tape and other temporary markings.
      Please report a spill to the nearest staff member so the area can be cleaned promptly.
      The courtyard fountain is switched off during scheduled maintenance.
      Reusable cups must be returned to the collection point beside the café.
      The café accepts pre-orders for groups of eight or more with one day's notice.
      Gift vouchers are valid for one year from the date of purchase.
      A damaged parcel should be photographed before its packaging is discarded.
      Customers may request delivery instructions to be added to an existing order.
      The community directory lists organizations that have confirmed their details this year.
      The noticeboard does not accept advertisements for services offered outside the community.
    `),
    howto: L(`
      Open Settings and select Notifications from the menu on the left.
      Click the gear icon in the top-right corner, then choose Account.
      Drag the file into the upload area, or click Browse to choose it from your computer.
      Preheat the oven to 200 °C and line a baking tray with parchment paper.
      Unplug the device and wait 30 seconds before plugging it back in.
      Enter the six-digit code we sent to your phone.
      Select the rows you want to export, then click Export > CSV.
      Turn the dial clockwise until the indicator points to 3.
      Tighten each bolt by hand first, then give it a quarter turn with the wrench.
      Press and hold the power button for 10 seconds to reset the speaker.
      Fill in your billing details and click Continue to payment.
      Use the slider to adjust the brightness until the text is easy to read.
      To add a team member, go to Admin > Users and click Invite.
      Rinse the rice twice in cold water before cooking.
      Copy the link and paste it into your browser's address bar.
      Right-click the folder and choose Rename.
      Water the seedlings every two days, keeping the soil moist but not soggy.
      Scan the QR code on the back of the box with your phone's camera.
      Type at least three characters to see suggestions.
      Choose a delivery slot, then review your order on the summary page.
      Mix the flour, salt and yeast in a large bowl, then add 350 ml of warm water.
      Sand the surface with 120-grit paper before applying the first coat.
      Make sure the toggle next to Auto-save is switched on.
      Click and drag the corner of the image to resize it.
      Remove the battery cover by sliding it downward.
      If the light blinks orange, the filter needs to be replaced.
      Sort the list by date by clicking the column header.
      Enable two-factor authentication under Security > Sign-in options.
      Let the dough rest for at least one hour, or until it doubles in size.
      Hold Shift while clicking to select a range of items.
      Under Privacy, switch off Show my profile in search results.
      Measure twice and cut once.
      Attach the shelf brackets 40 cm apart, using a level to keep them straight.
      Go back to the previous step if you need to change the date.
      Simmer for 20 minutes, stirring occasionally.
      From the dashboard, pick the project you want to archive and click the three-dot menu.
      Paste your API key into the field and press Save.
      Switch the device into pairing mode by holding both volume buttons.
      Fold the towel in thirds lengthwise, then roll it from one end.
      Restart the app after installing the update.
      Pull the tab to release the filter tray.
      Set the timer for 25 minutes and focus on a single task.
      Hover over a chart bar to see the exact value.
      Double-click the cell to edit its contents.
      Once you're done, click Finish to close the wizard.
      Wipe the lens with a dry microfiber cloth; never use glass cleaner.
      Highlight the text you want to quote, then click the quotation mark button.
      Plant the bulbs 10 cm deep with the pointed end facing up.
      Check the box to confirm you have read the agreement.
      Allow the paint to dry for four hours before adding a second coat.
      Open the calendar view and use the arrows to move between months.
      Place the lid on the pot slightly ajar to let steam escape.
      Connect the smaller end of the cable to the port marked IN.
      Peel the protective film from one corner and pull it back slowly.
      To change your password, open Profile > Security and enter your current one.
      Whisk the eggs until the yolks and whites are fully combined.
      Keep the door closed while the washing cycle is running.
      Fold the map along its existing creases before putting it away.
      Use a soft brush to remove dust from the keyboard between the keys.
      Add the newest items to the top of the list by selecting Sort descending.
      Place the plant near a bright window, away from direct afternoon sun.
      Press the arrow beside the search field to view your recent searches.
      Thread the cord through the two eyelets, then tie a loose knot at the end.
      Pour the mixture into the pan and spread it evenly with a spatula.
      Turn off the water supply before disconnecting the hose.
      Select a language from the drop-down menu to update the display.
      Store the open packet in an airtight container in a cool, dry place.
      Use the ruler tool to measure the distance between the two points.
      Slide the drawer back onto its rails until it clicks into place.
      For a smoother finish, apply the second layer in the opposite direction.
      Tap the calendar icon to choose a different start date.
      Keep the charging cable away from the edge of the desk.
      Remove excess soil from the roots before placing the plant in its new pot.
      Press Tab to move the cursor to the next field.
      Bake until the edges are golden and the center feels firm to the touch.
      To share a folder, open its access menu and choose Copy invitation link.
      Place a damp cloth over the dough while it rests.
      Turn the handle counterclockwise to loosen the clamp.
      Use a funnel to pour the liquid into the narrow-necked bottle.
      Move the marker on the map to update the pickup location.
      Save your changes as a draft if you plan to finish them later.
      Keep the screws in a small dish so they do not get lost.
      Cut the fabric along the chalk line, leaving a 2 cm seam allowance.
      Connect the printer to the same network as the computer.
      After watering, empty any excess water from the saucer beneath the pot.
      Click the small arrow beside the filename to reveal more options.
      Let the pan cool completely before washing it.
      Enter the room number in the field below the building name.
      Use a damp sponge to smooth the grout before it begins to set.
      Rotate the handle until the latch sits flush with the frame.
      To restore a deleted note, open Recently removed and choose Restore.
      Stir the sauce over low heat until it thickens slightly.
      Hang the picture from the center hook to keep it level.
      Choose Landscape under Page layout to print the wider table.
      Wrap the remaining dough and refrigerate it for up to two days.
      Place the mat beneath the chair to protect the floor.
      Remove the cap before inserting the cartridge into the holder.
      Click outside the text box to save the label.
      Rake the leaves into a loose pile before bagging them.
      Open the side panel to compare the current version with the saved copy.
      Lower the oven rack one position before placing the dish inside.
      Press the small release button while pulling the connector straight out.
      Choose a file format from the menu before downloading the report.
      Knead the dough on a lightly floured surface until it feels smooth.
      Turn the key gently until the lock bolt slides back.
      Use the search filters to narrow the results by owner and status.
      Lay the tiles out dry to check the pattern before adding adhesive.
      Add the chopped onions to the skillet and cook until translucent.
      Move the cursor to the paragraph you want to indent, then use the toolbar.
      Hang the wet shirt on a wide hanger to help it keep its shape.
      Pour a little water into the kettle and swirl it to rinse the inside.
      Select the pages you want to include before opening the print preview.
      Place the seed tray on a warm surface and cover it loosely with clear film.
      Loosen the ribbon by pulling each loop outward one at a time.
      Use the zoom controls to fit the full document within the window.
      Stir the oats into the simmering milk and cook until creamy.
      Set the tripod on firm ground and extend each leg evenly.
      Brush loose crumbs from the table before wiping it with a clean cloth.
      Choose a folder for the exported file in the location picker.
      Pin the hem in place before sewing along the folded edge.
      Wash the fresh herbs and pat them dry with a kitchen towel.
      Tap the plus sign beside the section name to add another item.
      Place a sheet of parchment between the stacked cookies to keep them separate.
      Turn the knob until the water reaches a gentle simmer.
      Use the preview pane to check how the cropped image will look.
      Stack the boards on level supports so air can circulate beneath them.
      Fold the napkin in half diagonally and bring the two corners together.
      Enter a short description in the field below the item title.
      Scrape the paint from the brush onto the edge of the can before rinsing it.
      Spread the beans in a single layer so they roast evenly.
      Hold the frame against the wall and mark the screw holes with a pencil.
      Select the thumbnail to open a larger view of the attachment.
      Add the lemon zest after removing the pan from the heat.
      Gather the loose strands and tuck them beneath the wrapped section.
      Pull the cover toward you until both side clips release.
      Set the table saw fence to the width marked on the plan.
      Drag the handle at the top of the selection to rotate the shape.
      Leave the jar on the counter until its contents reach room temperature.
      Trim the stems at an angle before arranging the flowers in a vase.
      Choose a name for the new collection and add a brief description.
      Dab the stain with a clean cloth, working from the outside toward the center.
      Add the broth gradually while stirring to keep the mixture smooth.
      Place the book flat beneath a heavier volume while the cover dries.
      Use the alignment guides to center the icon on the page.
      Turn each piece over halfway through baking for an even color.
      Press the fabric flat along the crease before pinning the layers together.
      Move the window by dragging its title bar to a clear area of the screen.
      Rinse the brush under running water until it no longer releases color.
      Add the remaining ingredients and fold them in with a wide spoon.
      Open the saved design from the Recent files panel to continue editing.
      Turn the page over and align its edge with the guide before scanning.
      Place the colander in the sink before draining the pasta.
      Press the seam allowance open with a warm iron before joining the panels.
      Choose Compact view to fit more rows on the screen.
      Add a pinch of salt to the boiling water before lowering in the noodles.
      Trace the template onto the cardboard with a sharp pencil.
      Lift the lever fully before sliding the paper stack into the tray.
      Arrange the cut stems by height before tying them together with twine.
      Select the sound preview to hear the clip before adding it to the timeline.
      Leave a small gap between the boards to allow for expansion.
      Beat the butter and sugar until the mixture looks pale and fluffy.
      Click the lock beside the layer name to prevent accidental edits.
      Wipe the tiles dry with a lint-free cloth after cleaning.
      Place the smaller bowl inside the larger one to make a simple water bath.
      Set the page margin to Narrow to make room for the extra column.
      Fold the paper in half and crease it firmly with the back of a spoon.
      Brush a thin coat of oil over the grates before heating them.
      Move the selected row by dragging its handle to the desired position.
      Turn the cushion cover inside out before stitching the open edge.
      Enter the full address in the location field to see it on the map.
      Cover the bowl with a plate while the vegetables steam.
      Use a clamp to hold the two pieces together while the glue dries.
      Open the overflow menu beside the workspace name to change its color.
      Shake the container gently to distribute the seeds across the soil.
      Place the rack over a baking sheet to catch any drips.
      Select a row and use the arrow keys to move it up or down.
      Cut the ribbon ends at an angle to keep them from fraying.
      Pour the brewed tea through a fine strainer before serving.
      Turn the canvas until its top edge is parallel with the ruler.
      Spread a layer of mulch around the base, leaving the stems uncovered.
      Place the printed sheets face down in the feeder tray.
      Mark the center of each panel before drilling the pilot holes.
      Add the chopped parsley just before taking the soup off the stove.
      Open the color picker and select a shade from the swatch grid.
      Press the crease with your thumb to keep the folded edge crisp.
      Arrange the chairs in a circle with equal space between each one.
      Use the handle on the divider to resize the two panes.
      Rinse the lentils in a mesh sieve until the water runs clear.
      Place the larger pieces at the bottom of the box to create a stable base.
      Thread the needle from front to back and pull the yarn through gently.
      Switch to grid view to compare the spacing between the cards.
      Set the cut flowers in fresh water as soon as you bring them indoors.
      Cover the exposed edge with painter's tape before applying the finish.
      Slide the tab to the left to reveal the full list of options.
      Pin the pattern paper to the fabric at each corner before cutting.
      Place a wooden spoon across the pot to keep the lid slightly open.
      Select the duplicate page option to make a copy of the current layout.
      Open the help panel to see a guide for the current screen.
      Set the document to read-only before sharing it with the group.
      Turn the knob slowly until the needle rests within the marked band.
      Dip the cut end of each stem in water before arranging the branches.
      Place the tray on the middle rack so the contents heat evenly.
      Use a lint roller to lift loose fibers from the coat.
      Choose a display name that will be visible to other workspace members.
      Press the corner of the label firmly to remove any trapped air.
      Fill the basin with lukewarm water before adding the soap flakes.
      Use the handles on either side of the crop to adjust its proportions.
      Set the book upright with its spine facing outward on the shelf.
      Add the grated cheese in small handfuls and stir until melted.
      Tap the folder path at the top of the window to copy its location.
      Cut a shallow notch in the end of the dowel to mark its orientation.
      Keep the seedlings under a clear cover until their first leaves appear.
      Move the finished cards into an envelope after the ink has dried.
      Place the measuring cup on a flat surface before checking the level.
      Turn on snapping to line the new shape up with nearby objects.
      Brush the crumbs from the filter before putting it back in the appliance.
      Layer the sliced fruit in a shallow dish and pour the syrup over it.
      Pull the elastic evenly around the corners to secure the fitted sheet.
      Select the text color control and choose a tone with strong contrast.
      Clamp the guide to the board before making the straight cut.
      Let the cleaned jars drain upside down on a fresh towel.
      Drag the divider downward to give the preview more room.
      Spread the compost around the planting hole and mix it into the soil.
      Hold the paper against the window to check that the folds line up.
      Place a small piece of tape over the loose end to keep the roll neat.
      Add the washed beans to the pot once the water reaches a boil.
      Open the details panel to see when the item was last changed.
      Use a pastry brush to coat the tops with a little melted butter.
      Press the fabric ruler along the edge before marking the hem.
      Set the headphones on the stand with the ear cups facing inward.
      Pour the remaining liquid into the sink through a mesh strainer.
      Choose a preview size that lets you inspect the fine details.
      Tuck the paper corners beneath the book to keep the page flat.
      Turn the small wheel until the two marks are aligned.
      Arrange the folded towels by size before placing them in the drawer.
      Add the dry yeast to the warm water and wait for a light foam.
      Use a shallow container to catch the rinse water beneath the rack.
      Cut a strip of cardboard to support the shape while it dries.
      Spread the paste across the back of the paper with smooth strokes.
      Select the first item, then hold Control while choosing the others.
      Lay the clean cloth over the bowl to keep dust away as it cools.
      Place the watering can beside the pots so it is easy to find.
      Scrub the pan with a nylon pad until the browned bits lift away.
      Open the page settings to change the spacing between lines.
      Tie the bundle with two loose loops so it can be adjusted later.
      Turn the loose ring until its opening faces the back of the frame.
    `),
    meeting: L(`
      Action item: Priya to share the revised timeline by Wednesday.
      We agreed to push the launch to 18 November to allow more testing.
      Attendees: Marcus, Elif, Daniel, Sofía and Kenji (notes by Hannah).
      The Q3 budget is 8% over plan, mostly because of contractor costs.
      Next sync is Thursday at 15:00; the agenda will go out the day before.
      Open question: do we need legal review before the pricing page goes live?
      Decision: we'll keep the free tier but cap it at three projects.
      Daniel walked us through the new onboarding flow; feedback was mostly positive.
      Blockers: the staging environment has been down since Monday.
      Let's revisit the hiring plan after the board meeting on the 12th.
      Customer interviews showed that most users never open the reports tab.
      Elif will draft the announcement and circulate it for comments.
      We're tracking 14 open bugs, three of which are high priority.
      Marketing wants the final screenshots by end of day Friday.
      Retro: deployment went smoothly, but the on-call handoff was unclear.
      Kenji suggested splitting the epic into two smaller milestones.
      Agreed to move the weekly stand-up from Monday to Tuesday mornings.
      The vendor contract renews on 1 April; Sofía will negotiate the terms.
      Revenue for October came in at $1.42M, 5% above forecast.
      Parking lot: dark mode, keyboard shortcuts, CSV import.
      No objections to the proposed holiday schedule.
      We need a volunteer to own the migration runbook.
      Support tickets dropped 22% after the help center redesign.
      Follow-up: confirm room booking for the offsite in Lisbon.
      The design review is postponed until the user research is complete.
      Marcus raised concerns about the data retention period; we'll check with legal.
      Target for the beta is 200 active teams by the end of the quarter.
      Hannah shared a draft of the survey; please add comments directly in the doc.
      Everyone should complete the security training by 30 June.
      Status: green on scope, amber on timeline, red on staffing.
      We'll run an A/B test on the checkout button copy for two weeks.
      The finance team needs updated headcount numbers before Friday.
      Quick update from the platform team: the new API is in internal testing.
      Agreed that the dashboard should load in under two seconds.
      Daniel will investigate why the nightly export failed twice last week.
      Budget approval is expected after the steering committee on 4 March.
      Please log your hours in the timesheet by Monday noon.
      The partner workshop in Nairobi is confirmed for 9-10 September.
      We discussed three options and chose option B for its lower risk.
      Recording and slides are in the shared folder.
      Next steps: finalize scope, estimate effort, share with stakeholders.
      Sofía noted that two enterprise customers asked for single sign-on.
      Meeting ended early; remaining items moved to next week.
      The office move is scheduled for the weekend of 22-23 February.
      Let's aim to reduce onboarding time from 14 days to 7.
      Please add your discussion topics to the agenda by Monday afternoon.
      Decision: the pilot will include two support teams and run for six weeks.
      Aisha will send the revised mockups before the product review.
      The launch checklist is missing an owner for customer communications.
      We have room for one more topic in tomorrow's planning session.
      The accessibility audit found several labels that need clearer wording.
      No changes to the release date; the remaining work fits the current schedule.
      Open question: should archived projects appear in the search results?
      Ravi will compare the two proposals and bring a recommendation next week.
      The training session now starts at 13:30 to accommodate the support shift.
      Please review the draft notes and flag any corrections by noon.
      We agreed to keep the current navigation until the next usability round.
      The quarterly planning session will cover staffing, milestones and key risks.
      Nora volunteered to coordinate the handoff with the operations team.
      Reminder: send the workshop materials to participants by Thursday morning.
      The customer advisory call surfaced a request for clearer export options.
      We should reserve ten minutes at the end for unresolved questions.
      The proposal needs one more pass for plain language before circulation.
      Attendance was lower than expected, so we'll repeat the demo next month.
      The team chose a gradual rollout to make support coverage easier to plan.
      Please bring the latest usage figures to the review on Friday.
      The room booking was extended by half an hour for the final discussion.
      I shared the updated project brief in the meeting notes folder.
      A short break is planned between the two afternoon sessions.
      The incident review focused on alert delays and gaps in the escalation path.
      We can start the second workstream once the requirements are signed off.
      The group requested a clearer comparison of the three onboarding concepts.
      Mina will check whether the translation review can finish before launch.
      The next steering meeting will include a brief update on hiring progress.
      We moved the retrospective to 2 December because several people are away.
      The draft policy is ready for comments from the regional leads.
      The workshop ended with agreement on four priorities for the coming month.
      A follow-up session will be scheduled after the survey results are available.
      The support team needs a week to prepare the updated response guide.
      Today's review covered the open dependencies and confirmed the owners.
      The agenda now includes a short demonstration of the revised reporting flow.
      Thanks to everyone who sent notes ahead of the planning call.
      The kickoff moved to 9:00 so the field team can join before heading out.
      Inez will circulate the updated risk register after she checks the owners.
      We need a clearer estimate for the remaining localization work.
      The room is booked under the project name, not the department name.
      Omar is collecting questions for the guest speaker ahead of the session.
      The draft roadmap groups the work into three phases through next spring.
      Please leave a few minutes for the new hire introductions at the start.
      We will compare the support coverage options during Friday's operations call.
      The revised milestones give the documentation team another week to finish.
      A projector adapter is available at the front desk if anyone needs one.
      The review surfaced two dependencies that were missing from the tracker.
      Could someone capture the decisions while I share the updated prototype?
      The team agreed to test the new intake questions with a small group first.
      Lena will confirm whether the regional leads can attend the second session.
      The afternoon workshop will begin with a recap of the discovery findings.
      We need to decide who will maintain the shared glossary after launch.
      The room layout has been changed to make space for the remote participants.
      Several teams asked for more time to review the draft operating guide.
      The supplier update is still pending, so that item may need to move.
      The planning call is open to anyone working on the data migration.
      We agreed to document the assumptions behind the proposed rollout sequence.
      Please send the room access instructions to anyone joining us in person.
      We should invite the documentation team before settling the support workflow.
      The group narrowed the shortlist to two approaches for the pilot.
      A quiet room has been reserved for anyone joining between other sessions.
      The next review will focus on edge cases in the account setup process.
      The checklist now includes a step for verifying the translated help pages.
      We need to align the event schedule with the training team's availability.
      The team requested a clearer owner for each item in the transition plan.
      A short recap will be sent to colleagues who could not attend today.
      We set aside time to review the unanswered questions from the intake session.
      The draft timeline includes a buffer for the final content review.
      Please bring examples of the confusing labels to the usability discussion.
      The group plans to revisit the naming options after the next research round.
      We will share the updated decision log with the wider project group.
      Aisha will coordinate the handover notes with the incoming project lead.
      The client feedback session is now scheduled for 11:00 on Thursday.
      Please send the revised agenda to the regional team before lunch.
      We will keep the first ten minutes open for announcements.
      The demo account is ready, and the access details are in the calendar invite.
      Could someone share the notes from yesterday's vendor call?
      The team agreed to review the draft staffing plan in small groups.
      Our next check-in will be held in the west training room.
      Please add the outstanding questions to the shared document before the call.
      The user research team needs another day to prepare the interview clips.
      We moved the showcase to Friday so the field staff can attend.
      Sana will gather input from the regional coordinators before the next review.
      We should confirm the interpretation schedule with the event organizer.
      The draft presentation is ready, but the final two slides still need owners.
      Several participants asked for a written summary of the new process.
      The morning session will start with a brief review of last week's actions.
      Please include the warehouse team in the invitation for the handoff meeting.
      The group wants to see a sample report before approving the new format.
      A second facilitator will join to help manage questions during the workshop.
      We will revisit the open resource requests at the end of the call.
      The team has agreed on a shared definition for a completed review.
      Could you reserve the small conference room for the follow-up session?
      The new schedule leaves a full week for teams to prepare their materials.
      We need feedback from the service desk before finalizing the support plan.
      Please send the updated participant list to the event coordinator.
      We will record the walkthrough for colleagues who are traveling this week.
      The review panel asked for a shorter summary of the implementation options.
      A few people will join late after the morning site briefing.
      Our planning meeting now includes a review of the draft communications plan.
      Please check that the meeting link works for everyone joining remotely.
      The final agenda item will be a round of updates from each workstream.
      No decision was made on the naming proposal, so we will gather more feedback.
      The operations lead will bring an updated map of the service regions.
      We can shorten the status round if the requirements discussion runs long.
      The draft facilitator guide is ready for review by the workshop hosts.
      Several attendees requested a brief pause between the presentations.
      Please flag any missing owners in the action tracker before our next sync.
      The team will compare the two session formats after the pilot is complete.
      We set a date for the review once the revised materials are ready.
      Can we leave the final decision on the vendor schedule until Thursday?
      The client asked for a brief recap of the changes since our last call.
      Please bring the printed floor plans to the facilities walkthrough.
      We have moved the team check-in to the smaller room on the second floor.
      The draft service map needs a review from someone who knows the rural routes.
      Could you add the recording link to the notes after the session?
      We will use the first breakout group to examine the intake process.
      Please send any questions about the revised schedule before the rehearsal.
      The group agreed to keep the pilot limited to one location for now.
      A sound check will take place fifteen minutes before the public briefing.
      The content team is waiting for final wording from the regional offices.
      We should compare the training calendar with the planned service changes.
      Nadia will bring a sample of the new labels to the review.
      The steering group asked for a clearer explanation of the handoff dates.
      Please mark any sections of the draft guide that need a local example.
      We reserved the library room for the community feedback session.
      The team will map the approval steps before discussing the new request form.
      No one has volunteered to introduce the guest speaker at the opening.
      The latest survey responses are ready to review in the shared workspace.
      Could we move the equipment check to the start of the afternoon block?
      Please keep the first draft of the schedule open during the discussion.
      The field notes point to a few steps that are missing from the current guide.
      We agreed to invite the archive team to the next planning session.
      The room has a fixed layout, so we will need to use the side tables.
      Rafi will check which staff members can cover the evening demonstration.
      Please share the updated contact sheet with the meeting host.
      We will collect written feedback at the end of the walkthrough.
      The second session will focus on how requests move between departments.
      A spare set of markers is in the cabinet beside the whiteboard.
      The workshop team has drafted a new exercise for the afternoon session.
      Could someone bring the sample forms from the storage room?
      We need to settle the order of the speakers before the program is circulated.
      The project leads will explain how the new review cycle affects current work.
      A few agenda items may need to be shortened to leave time for questions.
      The group asked for a plain-language version of the updated procedure.
      Please let the host know if you need a printed copy of the briefing pack.
    `),
    chat: L(`
      hey, are you around for a quick call?
      Running 5 min late, start without me!
      Can someone send me the link to the deck?
      lol that's exactly what I said yesterday
      Just pushed the fix, can you check if it works on your side?
      Lunch at 12:30? I'm thinking the Thai place on Market Street.
      Thanks!! That was super helpful.
      Did anyone else get logged out just now?
      ok sounds good, let's do that
      I'll be offline from 3 to 4 for a dentist appointment.
      Who's bringing snacks to the team meeting tomorrow?
      Sorry, missed your message, was in back-to-back meetings all morning.
      Happy birthday, Amara! Hope you have an amazing day.
      Quick question: is the deadline still Friday or did it move?
      Can you review my PR when you have a sec?
      The printer on the 3rd floor is jammed again.
      Nice work on the presentation today!
      brb, grabbing a coffee first
      Just landed in Madrid, will be online in an hour.
      Has the client signed the contract yet?
      I'm working from home today because of the train strike.
      Do we have a template for the monthly report?
      Wait, which version are we shipping?
      Heads up: the parking garage closes early on Friday.
      Anyone up for a walk at 4?
      I think the numbers in row 12 are off by one.
      Great, thanks for the update.
      Let me check and get back to you.
      can you share your screen?
      Meeting moved to room 4B.
      The new intern starts on Monday, please say hi!
      I'm stuck on the login page, any ideas?
      Agreed, let's go with the blue one.
      Reminder: timesheets are due today.
      Is it just me or is the Wi-Fi really slow?
      Ha, I'll take that as a yes.
      Sending the files now, they're about 300 MB.
      Can we push our 1:1 to tomorrow?
      Congrats on the promotion, well deserved!
      Where did we land on the venue for the party?
      Back online now, what did I miss?
      Not sure, maybe ask Lukas?
      Thanks for covering for me yesterday.
      Do you have the Wi-Fi password for the guest network?
      It's raining here in Glasgow, as usual.
      That bug only happens on the mobile browser, right?
      I'll grab the meeting room, see you there.
      Can you resend the invite? It disappeared from my calendar.
      Yes! Finally got the build to pass.
      Good morning everyone, happy Monday :)
      Are we still on for the planning session this afternoon?
      I found the extra cables in the supply cabinet.
      Running a little behind, the bus is crawling today.
      What time are we ordering lunch tomorrow?
      That screenshot explains it perfectly, thank you!
      I can take the first shift if nobody else has claimed it.
      Does anyone remember where we saved the workshop notes?
      Want to compare notes before we send the recap?
      The color looks much better on the larger screen.
      I might need to leave ten minutes early for an appointment.
      Has the package for the new keyboards arrived yet?
      Nice, that gives us enough time to make a few changes.
      Could you add me to the thread about the launch checklist?
      I brought extra fruit if anyone wants some.
      Do we have a spare adapter for the projector?
      I'll be at the library desk near the windows.
      That was a surprisingly good playlist for a rainy day.
      I can cover the inbox while you're out this afternoon.
      Please send me the room number when you get a chance.
      The updated map is easier to follow now.
      Anyone know if the cafe downstairs is open today?
      Let's save a few minutes at the end for questions.
      The elevator is working again, finally.
      Can we move the check-in to Thursday morning?
      I think I left my water bottle by the printer.
      The volunteer list is almost full, just two spots left.
      That reminder came at exactly the right time.
      I'm heading out for a short walk, back in fifteen.
      Would you rather meet in person or keep it on video?
      The new seating chart has me next to the window, nice!
      I have a quiet room booked if anyone needs a place to focus.
      Can you forward the photo from yesterday's event?
      We should probably bring an extra extension cord.
      Sorry for the late reply, I was away from my desk.
      The first version is ready whenever you want to review it.
      I put the spare badges in the top drawer.
      The delivery window changed to sometime after 2.
      That little shortcut saved me a lot of time.
      I'll post the notes once I finish cleaning them up.
      Is the side entrance open before the main doors?
      Thanks for staying late to help wrap everything up!
      The room booking still shows the old start time on my end.
      Anyone know who picked up the blue notebook from reception?
      That was my mistake, I sent the earlier draft by accident.
      I'll take a look after I finish this call.
      The little meeting room is free until 2 if we need it.
      Did the labels for the storage boxes ever turn up?
      I can swap shifts with you on Wednesday if that helps.
      The new route is much quieter in the morning.
      Please save me a seat near the aisle if you get there first.
      The soup special was excellent, just saying.
      My headphones are on the shelf by the whiteboard.
      We have plenty of markers in the cabinet now.
      Does anyone want the last piece of banana bread?
      The hallway display is showing last month's announcements.
      All set here, the replacement cable fixed it.
      I may be a few minutes late because the shuttle is delayed.
      Can someone let me know when the parcel arrives?
      The new labels are easier to read from across the room.
      I found a quiet corner upstairs for the afternoon.
      That was a fun surprise, thanks for organizing it!
      Are the chairs from the training room being returned today?
      I left a copy of the agenda beside the sign-in sheet.
      We should bring the sample boards back before we leave.
      Just checking whether you saw the revised schedule.
      The door code worked for me this morning.
      I can stay a little longer to help pack up.
      The rain stopped right as I got to the station.
      I put the extra copies on the table outside the room.
      Can we keep the last ten minutes open for a quick recap?
      The window seat is available if anyone wants to switch.
      This version has the larger map and the clearer captions.
      I'll bring a few spare pens for the workshop.
      The parcel was delivered to the front desk under my name.
      The print room is out of the heavier paper, just a heads up.
      Thanks for leaving the lights on, I was able to finish up.
      I found your scarf hanging by the coat rack.
      Does the courtyard gate stay open after sunset?
      I can bring the return forms when I come by later.
      We still have a little time before the next group arrives.
      I can send a quick summary before everyone signs off.
      The screen share is frozen on my end, can you still hear me?
      I think the cafe has oat milk again, just saw a new carton.
      I saved a clean copy in case we want to compare versions.
      The train is moving again, should be there shortly.
      Does anyone have a charger I could borrow until lunch?
      I finally figured out why the lamp kept flickering.
      No rush on the reply, I know today is packed.
      The package is on the bench by the side entrance.
      Just heard back, they can meet any time after two.
      I brought the wrong notebook, but the notes are on my phone.
      The new sign is facing the wrong way near the stairs.
      Would you mind saving me a copy of the handout?
      I'm taking the long way around because the path is blocked.
      That was a clever fix, everything lines up now.
      Who left a bright yellow umbrella by the coat hooks?
      The soup place on the corner has a new lunch menu.
      My calendar finally synced, the updated time is showing now.
      The package label has the wrong room number on it.
      Thanks for the heads up, I would have missed that otherwise.
      Anyone want to join me for a loop around the block?
      I found the spare key in the envelope by the reception book.
      The afternoon light is making it hard to read this screen.
      Could we pause for a minute while I reconnect my audio?
      I'll leave the extra cups beside the kettle.
      The new shelves arrived, but they need a bit of assembly.
      I can trade you the window seat for the one near the outlet.
      The hallway is clear now, they moved the boxes upstairs.
      Does anyone know when the next shuttle leaves?
      Could someone hold the door while I bring these folders in?
      The caption on the first slide still has the old date.
      I found a table with enough space for all the sample books.
      We can take turns reading through the list if that helps.
      I left the reusable bags in the cupboard beside the sink.
      The kettle is on if anyone wants tea.
      Could somebody check whether the back gate latched properly?
      The new delivery shelf is already much easier to use.
      I keep forgetting how quiet the building gets after five.
      That was a good catch about the missing page.
      Are we still sharing the taxi to the station?
      I finally found the note I thought I had lost.
      The clouds cleared just in time for the walk home.
      Would anyone be interested in swapping book recommendations?
      I can bring the paper cups from the kitchen cupboard.
      The stairs are less crowded if you use the west entrance.
      I just noticed the clock in the lobby is five minutes fast.
      Can someone remind me which shelf has the spare folders?
      I heard the rehearsal from upstairs and it sounded great.
      This is the first time all week my desk has been clear.
      The route along the canal is lovely in the evening.
      I found a set of keys beside the notice board.
      Does the book club still meet in the upstairs lounge?
      The new cushions make that bench much more comfortable.
      I can pick up a few oranges on my way in.
      The wind kept turning my map around on the walk over.
      That story from the weekend made me laugh again.
      The north stairwell has a nice view of the courtyard.
      I brought a deck of cards for the train ride.
      The little fountain is running again by the entrance.
      I think the blue folder belongs with the archive boxes.
      The evening class let out early, so I have time to spare.
      Does anyone know if the market is open on Sundays?
      The smell of fresh bread is drifting up from the lobby.
      I can water the plants while you are away next week.
      We found an extra seat near the back of the room.
      I left my reusable bottle on the shelf beside the mugs.
      I have a spare scarf in my bag if the evening gets chilly.
      I finally learned the shortcut through the covered passage.
      The tiny bookstore has started putting chairs outside.
      I can bring the folding stools when I come by.
      The clouds made the sunset look almost pink tonight.
      Does anyone want to split a basket of peaches?
      I found the missing puzzle piece under the window ledge.
    `),
    travel: L(`
      Your flight NV 2318 to Lisbon departs from Gate B14 at 07:45.
      Boarding closes 20 minutes before departure.
      Check-in opens 24 hours before your flight.
      The hotel is a 10-minute walk from Central Station.
      Breakfast is served daily from 7 to 10:30 in the garden restaurant.
      Free cancellation until 23:59 on 14 August.
      Each passenger may bring one carry-on bag up to 8 kg.
      The train to Kyoto leaves every 15 minutes from platform 3.
      Please arrive at the port at least 45 minutes before the ferry departs.
      Your rental car can be collected from the arrivals hall, desk 6.
      The museum is closed on Mondays and on public holidays.
      A city pass includes unlimited public transport for 72 hours.
      Room upgrades are subject to availability at check-in.
      The guided walking tour starts at the fountain in the main square.
      Seats 12A and 12B have been reserved for you.
      Your booking reference is K7Q2ZP.
      Airport shuttles run every 30 minutes from 5 am to midnight.
      Bring a valid passport with at least six months of validity remaining.
      The campsite has hot showers, a small shop and Wi-Fi near reception.
      Tickets for the cable car can be bought at the base station or online.
      The night bus N12 stops right outside the hostel.
      Late check-out until 2 pm is available for €25.
      Mountain huts must be booked in advance during July and August.
      The flight time from Singapore to Sydney is about 7 hours 40 minutes.
      Your gate has changed to C7.
      Due to weather, flight KF 482 is delayed by approximately 50 minutes.
      Luggage storage is available at the station for 6 per bag per day.
      The beach is a short drive from the villa, and parking is free.
      Children under 4 travel free on all regional trains.
      Snorkeling equipment is included in the boat tour.
      Visitors must reserve a time slot to enter the palace gardens.
      The hotel offers a free shuttle to the conference center.
      The scenic route adds about an hour but passes three lakes.
      Local buses accept exact change only.
      Your e-ticket has been sent to the email address you provided.
      The tour is offered in English, Spanish and Japanese.
      Platform 9 is at the far end of the station, past the ticket hall.
      Tap water is safe to drink throughout the city.
      Night trains have sleeper cabins for two or four people.
      Your seat on the 08:12 to Edinburgh is in coach D.
      Please present this voucher at the front desk on arrival.
      The trail is 11 km long with an elevation gain of 640 m.
      Hotel tax of 3.50 per person per night is payable on site.
      Arrive early to get a spot at the sunset viewpoint.
      Our office in Nairobi can arrange airport pickup on request.
      Your return flight from Porto is scheduled to leave at 18:20.
      The island ferry runs less frequently on Sundays.
      A table for two is reserved at the harbor café for 7 pm.
      The north entrance to the park is closed while the path is repaired.
      A local guide will meet the group beside the old clock tower.
      The last metro leaves the airport station just after midnight.
      Please keep your luggage tag until your bags are returned.
      The guesthouse has a shared kitchen and a quiet courtyard.
      A light rain jacket is useful on the coastal trail.
      The regional pass covers buses, trams and suburban trains.
      Your cabin is on the upper deck, near the rear staircase.
      The market is busiest before noon, when the fishing boats come in.
      A short tunnel connects the terminal with the train station.
      The boat trip may be postponed if the sea becomes rough.
      Fresh towels are available from the shelf beside reception.
      There is a water fountain beside the trailhead.
      The overnight coach has reclining seats and individual reading lights.
      A small fee is charged for bicycles on the morning train.
      The visitor center opens at 9 and closes at 5.
      The footpath to the lighthouse takes about 35 minutes each way.
      Please leave your room key in the wooden box when checking out.
      The campsite is shaded by pine trees and sits beside a shallow stream.
      A quiet carriage is available in the middle of the train.
      The village bakery sells warm bread from 6:30 each morning.
      Carry a little cash for the ferry kiosk on the smaller islands.
      The valley road is narrow, so allow extra time for the drive.
      Your museum pass is valid for three consecutive days.
      The garden entrance is through the stone arch across from the library.
      A luggage trolley can be borrowed near the station information desk.
      The walking route follows the river for most of its length.
      There are lockers beside the pool, but bring your own small lock.
      The apartment overlooks the plaza and has a small balcony.
      A shuttle departs from the west side of the terminal every hour.
      The mountain road may close overnight after heavy snowfall.
      The tour includes a stop at the hilltop ruins and the nearby orchard.
      Please store food in the sealed boxes provided at the campsite.
      The beach path is uneven and may be difficult with a stroller.
      Your connecting train leaves from platform 6 at 13:05.
      A map of the walking routes is available in the lobby.
      The guest rooms face the garden, away from the main road.
      You can refill your bottle at the spring beside the picnic area.
      The return bus stops at the same square where the tour begins.
      The observatory is open to visitors on clear evenings.
      The 06:40 express reaches the coast in just under two hours.
      A narrow footbridge links the old town with the riverside market.
      Please leave bicycles in the rack beside the south entrance.
      The ferry ticket office opens half an hour before the first sailing.
      Our room overlooks the station square and the morning flower stalls.
      A family ticket covers two adults and up to three children.
      The ridge path is exposed, so check the forecast before setting out.
      You can hire a rowboat from the landing near the willow trees.
      Guests may borrow umbrellas from the stand beside the lobby.
      The last cable car descends from the summit at 6:15 pm.
      A short boardwalk crosses the marsh to the bird hide.
      Your table is booked in the terrace dining room for 8 pm.
      The ferry crossing takes about 35 minutes in calm conditions.
      Please use the north platform for trains heading toward the valley.
      The campground has a separate area for tents and camper vans.
      A paper map is included with every ticket at the visitor desk.
      The coastal path passes a pebble beach and two old watchtowers.
      There is room for one large suitcase in the overhead rack.
      The inn serves a simple supper each evening except Tuesday.
      A local minibus connects the harbor with the hilltop villages.
      The rooftop terrace is open to guests from sunrise until dusk.
      Keep to the marked trail where it crosses the grazing fields.
      The ferry to the outer island leaves from pier 4.
      A foot passenger ticket does not include a reserved seat.
      The waterfall is most impressive after a night of rain.
      Please return borrowed hiking poles to the shelf by the door.
      The historic quarter is easiest to explore on foot.
      A small café beside the platform sells coffee and fresh pastries.
      The bus journey to the lake takes around 55 minutes.
      Children can borrow life jackets at the sailing club desk.
      The garden path is lit after dark and leads back to the lodge.
      Your luggage will be transferred directly to the next hotel.
      Local ferries use the smaller landing when the tide is low.
      The castle tour begins beneath the archway at the main courtyard.
      There is a covered waiting area outside the coach station.
      The island road ends at a quiet cove with a public footpath.
      Please show your reservation at the desk beside the entrance.
      The afternoon train has extra space for skis and snowboards.
      The hostel kitchen is open to guests until 10 pm.
      A stone staircase leads from the station to the upper village.
      The visitor center lends binoculars for walks through the reserve.
      A sunrise departure gives you the best light over the bay.
      The morning ferry is usually quieter than the afternoon sailing.
      Your reservation includes two nights in a room facing the courtyard.
      Bikes can be rented from the kiosk beside the canal.
      Please label each bag with your name and destination.
      The museum audio guide is available in four languages.
      A narrow lane behind the cathedral leads to the riverside gardens.
      The family room has a bunk bed and a separate sitting area.
      The boat leaves from the floating dock at the end of the pier.
      A weekly market fills the square every Thursday morning.
      The airport is connected to downtown by a direct rail service.
      You can reserve a picnic basket when you book the vineyard tour.
      The guest lodge provides blankets for evenings around the fire pit.
      The southern trail offers broad views across the salt marsh.
      Your transfer driver will wait by the arrivals board with a name card.
      Most shops in the old quarter close for a few hours after lunch.
      The upper deck has open seating and a small covered section.
      The pass is valid on all boats between the mainland and the islands.
      There is a complimentary storage room for bags before check-in.
      The guided tour finishes at the courtyard beside the pottery studio.
      A wooden bridge crosses the stream just beyond the picnic shelter.
      Your room is ready, and the key is waiting at the reception desk.
      The local train stops at every village between the two lakes.
      The campsite reception can lend you a lantern after sunset.
      The aquarium is busiest on rainy afternoons and school holidays.
      A paved cycle lane runs along the canal all the way to the old mill.
      The west beach has gentle waves and a lifeguard station in summer.
      The ferry lounge has large windows overlooking the channel.
      Guests can book a place on the evening storytelling walk.
      A covered arcade links the market square with the bus terminal.
      A row of small guest rooms faces the orchard and the distant hills.
      The boat operator provides a dry bag for cameras and phones.
      A local bus runs between the pier and the hilltop fort every hour.
      The western gate is the closest entrance to the sculpture garden.
      The final stretch to the summit follows a set of broad stone steps.
      The 16:25 train to Marseille is running five minutes late.
      A day ticket is valid until the final service tonight.
      We found a quiet guest room above the village square.
      The footpath turns inland just beyond the driftwood fence.
      Please keep your boarding pass handy at the security checkpoint.
      The harbor bus meets each ferry and waits for arriving passengers.
      A few coins are useful for the public toilets near the beach.
      The cabin window looks out over the wooded side of the lake.
      The eastern gallery is closed while new exhibits are being installed.
      Our guide recommended taking the old quarry road back to town.
      The return leg follows a different path through the cedar grove.
      You can leave your larger bags at the staffed cloakroom.
      The boat has indoor seating on the lower level.
      A narrow staircase leads from the courtyard to the rooftop rooms.
      The first shuttle of the day leaves at 4:50 am.
      Please check the departure board for the latest platform assignment.
      We booked a table at the inn after the walking tour.
      The pass includes entry to the fort and the maritime museum.
      A short climb brings you to a bench overlooking the inlet.
      The bus driver can announce the stop if you ask when boarding.
      The room has a kettle, two cups and a view of the courtyard.
      High tide covers part of the beach below the sea wall.
      A small foot ferry links the two sides of the estuary.
      Our campsite pitch is close to the washroom block and water tap.
      Bring a reusable bag for produce from the morning market.
      The scenic railway winds through a series of tunnels above the gorge.
      A local boatman offers short trips around the sheltered bay.
      The trail surface becomes sandy after the second wooden gate.
      Your room reservation includes fresh fruit and tea each morning.
      The art museum is free to enter on the first Sunday of the month.
      A sheltered picnic spot sits beneath the beech trees near the pond.
      The last ferry leaves the mainland at 9:40 pm.
      The visitor desk has printed timetables for the surrounding villages.
      A gravel lane connects the orchard cottages with the main road.
      The station has step-free access from the street entrance.
      The guided cave visit lasts about 40 minutes.
      A short footpath leads from the inn to the old stone bridge.
      Please collect your room key from the lockbox beside the side door.
      Our train tickets include a reserved seat in the second carriage.
      The lookout tower closes during strong winds.
    `),
    finance: L(`
      Your statement for March is now available.
      A payment of $1,250.00 to Ashgrove Property Management is scheduled for 1 May.
      Your card ending in 4821 was used for a purchase of 89.90 at Hartwell Hardware.
      The invoice INV-2024-0193 is due in 14 days.
      Transfers made after 5 pm are processed on the next business day.
      Your savings account earned 12.47 in interest this month.
      We noticed an unusual sign-in from a new device; was this you?
      Quarterly revenue grew 9% year over year to $48.6 million.
      Operating expenses rose mainly because of higher shipping costs.
      Set a monthly budget to get alerts when you're close to your limit.
      The exchange rate used for this transaction was 1 EUR = 1.08 USD.
      Direct debit mandates can be cancelled from the Payments tab.
      Your credit limit has been increased to 5,000.
      Please upload a copy of your ID to verify your identity.
      The tax year ends on 5 April.
      A late fee of 25 has been added to your account.
      Your pension contribution for this period is 4% of your gross salary.
      Dividends will be paid on 28 June to shareholders of record on 14 June.
      Total spent on groceries this month: 412.60, down 8% from last month.
      Expense reports must include itemized receipts for amounts over 75.
      You have 3 pending transactions totaling 156.20.
      Gross margin improved to 41.2% from 38.7% a year earlier.
      Your payroll is scheduled to run on the 25th of each month.
      To dispute a charge, select it in your transaction history and tap Report a problem.
      The board approved a share buyback of up to $20 million.
      Interest is charged at 18.9% APR on balances not paid in full.
      Cash flow from operations was positive for the fourth consecutive quarter.
      Your account balance is below the minimum required to avoid a monthly fee.
      Reimbursements are paid with the next salary run.
      The audit is expected to be completed by the end of February.
      Round-ups saved you 23.40 this week.
      Recurring payments can be paused for up to 60 days.
      All figures are unaudited and in thousands of euros.
      The loan term is 36 months with a fixed rate of 6.4%.
      Your virtual card is ready to use for online purchases.
      International transfers can take up to 3 business days.
      Northwind Logistics reported a net loss of $2.1 million for the quarter.
      Please approve the purchase order before the vendor's deadline on Friday.
      Your annual statement summarizes all fees and interest for the year.
      The new pricing takes effect on 1 January for all existing customers.
      Funds are protected up to 100,000 per depositor.
      Capital expenditure is forecast at 12% of revenue next year.
      Budget owners should review their cost centers before the quarter closes.
      Your refund has been credited to your account.
      This payment is still processing and may take a few minutes to appear.
      Your February statement includes a summary of deposits and withdrawals.
      A transfer of 640.00 to Rowan Street Studios was completed today.
      The debit card ending in 7316 expires in November.
      Invoice QF-5831 includes a balance of 2,480.00 due on 18 July.
      Your scheduled payment will be collected from the account ending in 1904.
      The current balance in your travel fund is 875.25.
      A login verification code was sent to your registered phone number.
      The team recorded lower consulting costs during the reporting period.
      You can set spending categories to organize your monthly transactions.
      This conversion was calculated at 1 GBP = 1.27 USD.
      Standing orders are listed under the account's payment settings.
      Your available credit is now 3,200.
      We need a recent proof of address to complete the account review.
      Your business tax return is due by 31 October.
      A returned payment resulted in a 15 fee on the account.
      The employer matched 3% of eligible contributions this year.
      Shareholders will receive a distribution on 12 September.
      Dining purchases total 286.40 so far this month.
      There are 5 card transactions awaiting final settlement.
      The company reported a gross profit margin of 36.5% for the quarter.
      Salary payments are expected to reach employee accounts tomorrow.
      The company issued 120,000 new shares under its employee plan.
      The promotional rate applies to new purchases through 30 June.
      The outstanding amount accrues interest at 7.2% per year.
      Cash reserves covered operating costs for the past three months.
      The reserve fund was valued at 62,000 at quarter close.
      Approved travel claims are included in the next reimbursement batch.
      The external review of the accounts is scheduled to finish in March.
      You moved 18.75 into savings through automatic round-ups.
      This subscription payment will resume on 1 August.
      Figures in the report are presented in local currency unless stated otherwise.
      The remaining principal on your loan is 8,460.32.
      A digital card number is available for purchases made by phone.
      Your international payment has been received by the beneficiary's bank.
      The supplier payment is due before the end of the month.
      Your year-end summary lists interest earned and account charges.
      Updated account terms will apply from 15 September.
      Eligible deposits are covered by the national deposit protection scheme.
      The department plans to replace two delivery vehicles next year.
      A cash deposit of 420.00 was recorded at the branch this morning.
      A cash withdrawal of 180.00 was made at an ATM near the station.
      The invoice total includes 62.40 in applicable taxes.
      Your transfer limit resets at midnight.
      A deposit from Cedar Lane Catering arrived this afternoon.
      The finance committee will meet to review the revised forecast.
      Your mortgage payment is scheduled for the 10th.
      A duplicate charge of 34.95 was reversed yesterday.
      The fund's net asset value reached 14.82 per unit.
      Your account has been linked to the new payroll provider.
      The supplier sent a corrected invoice with updated billing details.
      A balance of 920.00 remains on the equipment lease.
      The company set aside 75,000 for expected warranty claims.
      Your savings goal is 68% complete.
      A wire transfer fee of 12.00 was included in the total.
      The monthly close is underway, and department results will follow.
      Your contactless payment of 23.60 was approved.
      The bond matures on 30 November and pays interest twice a year.
      A revised estimate puts annual software costs at 18,400.
      Your cash ISA rate is fixed until the end of the term.
      The vendor's banking details were verified before payment.
      Operating income reached 3.7 million in the first half.
      Your latest payslip shows a net payment of 2,184.76.
      A charitable contribution of 50.00 appears in your account activity.
      The treasury team converted 250,000 CAD into euros.
      Your fixed-term deposit ends on 22 December.
      The company recorded an impairment charge of 310,000 this quarter.
      A receipt for the conference registration fee is attached to the claim.
      Your overdraft facility is available until 30 April.
      The portfolio returned 4.1% over the six-month period.
      A payment of 96.00 from Maple Court Residents Association is due tomorrow.
      The revised budget allocates 14% of spending to staff training.
      Your account's interest rate changed to 2.85% on 1 October.
      The cash register report shows a shortfall of 8.25.
      A credit note for 740.00 was applied to the outstanding invoice.
      The company recognized deferred revenue of 1.6 million this quarter.
      Your rent payment was received in full on 3 May.
      The next valuation review is planned for the first week of June.
      A foreign currency charge of 7.18 was added to the card transaction.
      The finance office received the signed expense declaration.
      The annual report lists total assets of 8.4 million.
      Your regular deposit of 125.00 was added to the savings account.
      The lender confirmed receipt of the final installment.
      The project ended 22,000 under its approved budget.
      A statement fee of 2.50 was charged to the account.
      Your April statement shows deposits of 3,840.00 and withdrawals of 2,916.45.
      Interest on the certificate will be credited when the term ends.
      The remaining balance on purchase order 68314 is 7,250.00.
      A supplier discount reduced the materials bill by 460.00.
      Your account statement is available as a downloadable PDF.
      The company expects to collect 82% of outstanding invoices within 30 days.
      Please confirm the billing address before the next invoice is issued.
      The quarterly forecast includes a 5.6% increase in administrative costs.
      A contribution of 300.00 was added to your retirement account.
      The payment reference for this transfer is TR-806291.
      Revenue from the eastern region exceeded its quarterly target by 4%.
      Your direct deposit of 2,760.00 arrived in the account this morning.
      The finance director signed off on the revised department allocations.
      A service charge of 6.00 appears on the latest account statement.
      The invoice due date was extended to 16 August at the customer's request.
      The company plans to issue its annual results on 19 March.
      Your cash withdrawal exceeded the daily limit and was declined.
      The closing exchange rate was 0.92 euros per pound.
      An overpayment of 48.25 will be returned to the original payment method.
      The accounts team matched 94% of supplier invoices to purchase orders.
      A new beneficiary has been added to your list of saved payees.
      The project budget includes 32,500 for equipment and installation.
      The next dividend payment is estimated at 0.42 per share.
      A bank reconciliation identified three deposits that need further review.
      Your card payment of 61.35 at the market was declined.
      The company holds 2.3 million in short-term investments.
      Please review the revised invoice before it is sent to the client.
      A transfer of 2,000.00 is scheduled to reach the recipient on Tuesday.
      The finance team closed the books for the six months ending in June.
      Your available overdraft is 1,500.00, subject to account terms.
      The lease agreement requires an initial deposit of 900.00.
      A pending refund of 72.10 should appear within five business days.
      The department spent 1,180 less than its approved travel allocation.
      A tax withholding of 215.40 was deducted from this month's payment.
      The company set a target of reducing inventory costs by 7% this year.
      Your statement includes a 14.00 charge for the replacement card.
      The balance sheet records property and equipment at 6.8 million.
      A scheduled contribution of 85.00 will be taken from your account tomorrow.
      The finance office is collecting forecasts for the next planning cycle.
      The outstanding receivable from Larkfield Events is 3,640.00.
      A payment of 510.00 was returned because the account details were incomplete.
      The annual budget reserves 24,000 for maintenance and repairs.
      Your statement date has moved to the final calendar day of each month.
      The merchant has confirmed that the 42.80 card payment was cancelled.
      Your cash deposit is available to spend from the next working day.
      A transfer to your new payee is subject to a 24-hour security check.
      The account received a payment of 1,075.00 from the local council today.
      The monthly account fee will be waived when deposits exceed 1,000.00.
      A purchase of 76.40 at the garden centre is pending authorization.
      Your savings account balance reached the target you set in January.
      A returned cheque for 640.00 has been added to your account activity.
      The next scheduled collection is set for 7 November.
      Your payment was sent using the reference shown on the confirmation screen.
      A cash machine withdrawal of 60.00 was recorded at 09:14.
      The fee for sending this payment was shown before you confirmed the transfer.
      Please check that the supplier's account number matches the latest invoice.
      Your loan application is awaiting proof of the deposit source.
      The remaining allowance on your business card is 1,240.00.
      A 3.2% rise in unit sales helped offset lower average prices.
      The revised forecast assumes energy costs will remain steady through winter.
      A one-time restructuring cost affected the division's operating result.
      The company reported 680,000 in cash and cash equivalents at quarter end.
      The latest results show a 2.1 million increase in customer deposits.
      Management deferred the equipment purchase until the next budget period.
      The annual accounts include a breakdown of revenue by service category.
      The company recognized a foreign exchange gain of 18,600 during the quarter.
      The board will consider the proposed financing plan at its next meeting.
      A decline in raw material prices lowered the cost of goods sold.
      The lender released the final portion of the renovation loan this morning.
      The finance team is reconciling supplier credits against open balances.
      A reserve of 46,000 was recorded for expected contract costs.
      The report compares actual spending with the plan approved in April.
    `),
    science: L(`
      Bees can recognize human faces, at least in the lab.
      The deepest point in the ocean is nearly 11,000 meters below sea level.
      Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.
      Octopuses have three hearts and blue blood.
      A single teaspoon of healthy soil can contain more microorganisms than there are people on Earth.
      The study followed 1,240 participants over a period of six years.
      Water expands by about 9% when it freezes.
      Some species of bamboo can grow almost a meter in a single day.
      The results suggest that regular walking may improve sleep quality.
      Venus rotates so slowly that a day there is longer than its year.
      Researchers used satellite images to count penguin colonies in Antarctica.
      Our brains use roughly 20% of the body's energy at rest.
      The new telescope can detect galaxies formed less than 400 million years after the Big Bang.
      Sound travels about four times faster in water than in air.
      Honey stored in a sealed jar can last for decades.
      The sample size was small, so the authors call for further research.
      Tardigrades can survive temperatures close to absolute zero.
      Coral reefs cover less than 1% of the ocean floor but support about a quarter of marine species.
      A lightning bolt can heat the air around it to roughly 30,000 °C.
      The experiment was repeated three times with similar results.
      Migratory birds may use Earth's magnetic field to navigate.
      Adults have 206 bones, while newborns have closer to 300.
      Rainforests produce a large share of the planet's oxygen but also consume much of it.
      Scientists recorded the earthquake at magnitude 5.8, with an epicenter 40 km offshore.
      Plants can communicate stress through chemical signals in the air.
      The Moon is moving away from Earth by about 3.8 cm each year.
      Data were collected between March 2021 and October 2023.
      Some frogs can freeze solid in winter and thaw out in spring.
      A day on Mars lasts 24 hours and 39 minutes.
      Elephants communicate using low-frequency sounds that travel several kilometers.
      The model predicts a 1.5 °C rise under the moderate scenario.
      Glaciers in the region have lost about a third of their volume since 1980.
      The paper has not yet been peer reviewed.
      Fungal networks connect the roots of many trees in a forest.
      Sharks existed before trees did.
      Error bars show 95% confidence intervals.
      The probe will reach Jupiter's orbit in 2031.
      Cats spend roughly two-thirds of their lives asleep.
      Ocean currents carry heat from the tropics toward the poles.
      This species was first described in 1897 from a single specimen.
      A typical cumulus cloud weighs about as much as a hundred elephants.
      The vaccine trial enrolled volunteers in four countries.
      Leaves change color in autumn as chlorophyll breaks down.
      An average human sheds around 40,000 skin cells every minute.
      Further measurements are planned for the summer field season.
      A teaspoon of seawater contains millions of microscopic organisms.
      The researchers measured seedling growth every two days for a month.
      Some desert plants open their pores at night to reduce water loss.
      A hummingbird's wings can beat dozens of times per second.
      The mineral's crystal structure changes when pressure rises above 10 gigapascals.
      Auroras form when charged particles from space interact with gases in the upper atmosphere.
      A group of dolphins is known as a pod.
      The observatory recorded a faint signal from a star 500 light-years away.
      Many volcanic rocks contain tiny bubbles left by escaping gas.
      The team compared soil samples from 18 sites along the river.
      A group of flamingos is called a flamboyance.
      Some bacteria produce light through a chemical reaction inside their cells.
      The average distance between Earth and the Moon is about 384,400 kilometers.
      Researchers mapped the cave system using laser measurements.
      A mature oak tree can support hundreds of species of insects and other animals.
      The first fossil evidence of feathers dates back more than 150 million years.
      Humidity affects how quickly water evaporates from a surface.
      The telescope's mirror is 6.5 meters across.
      Certain ants cultivate fungi as a food source.
      A solar eclipse occurs when the Moon passes between Earth and the Sun.
      The survey found that the lake's water level rose by 14 centimeters over the winter.
      Some lizards can detach their tails to escape predators.
      A newborn blue whale can gain nearly 90 kilograms in a day.
      The researchers stored the ice cores at minus 20 °C until analysis.
      A star's color can provide clues about its surface temperature.
      Most of the mass in the Solar System is concentrated in the Sun.
      The river deposits fine layers of sediment along its banks during floods.
      Several species of bats use echolocation to find insects in darkness.
      The instrument detected traces of methane in the atmosphere.
      Some seeds remain dormant in the soil for many years before they sprout.
      The team collected air samples at five heights above the forest canopy.
      A prism separates white light into a spectrum of colors.
      The Northern Hemisphere experiences summer when it is tilted toward the Sun.
      A spider's silk can be stronger than steel of the same thickness.
      The fossil was embedded in limestone formed in a shallow sea.
      Many penguin species take turns incubating their eggs.
      Radio waves can travel through the vacuum of space.
      A teaspoon of neutron star material would weigh billions of tons on Earth.
      The study tracked changes in the glacier's edge using aerial photographs.
      Some mushrooms release spores that travel on air currents.
      A teaspoon of lunar soil contains grains shaped by billions of years of tiny impacts.
      Some sea turtles can sense Earth's magnetic field during long migrations.
      The fastest ocean currents can move water at several meters per second.
      Researchers used tree rings to estimate how much rain fell centuries ago.
      A mature saguaro cactus can store hundreds of liters of water after a storm.
      The boiling point of water decreases as air pressure falls at higher elevations.
      A handful of snow may contain dust and pollen carried from distant regions.
      The new sensor recorded temperature changes every ten seconds beneath the ice.
      Certain orchids mimic the scent of insects to attract pollinators.
      The Andromeda Galaxy is gradually moving toward the Milky Way.
      A sound's pitch depends on the frequency of its vibrations.
      Some deep-sea fish produce their own light to attract prey.
      The researchers found mineral grains that formed more than 3 billion years ago.
      Mosses can absorb water directly through their leaves and stems.
      A rainbow appears when sunlight bends and reflects inside water droplets.
      The observatory will monitor the star for signs of recurring brightness changes.
      Many snakes use heat-sensitive pits to detect warm-bodied animals nearby.
      The oldest known ice in the core dates back roughly 800,000 years.
      A lunar day lasts about 29.5 Earth days from one noon to the next.
      The team measured how quickly the river carried sediment after heavy rainfall.
      Some conifers keep their needles for several years before replacing them.
      A black hole's gravity is so strong that light cannot escape beyond its event horizon.
      The researchers tracked whale calls with underwater microphones along the coast.
      Quartz crystals can generate an electrical charge when squeezed.
      Insects use tiny hairs on their bodies to sense movements in the air.
      The experiment showed that salt lowers the temperature at which water freezes.
      A comet's tail points away from the Sun, pushed by sunlight and solar particles.
      The field team cataloged 86 species of moss on the north-facing slope.
      Some plants release chemicals that attract insects that prey on leaf-eating pests.
      Earth's inner core is a solid sphere made mostly of iron and nickel.
      The researchers found that river water became clearer after the wetlands were restored.
      Certain lichen species can survive for months without rain.
      The camera captured the shadow of a passing planet crossing its star.
      A kilogram of feathers and a kilogram of lead have the same mass.
      The lab grew crystals from a solution that slowly evaporated over several weeks.
      Some seabirds can drink seawater and remove excess salt through special glands.
      The tectonic plates beneath the ocean move only a few centimeters each year.
      Scientists used pollen preserved in peat to reconstruct past vegetation.
      The first images revealed branching channels beneath the ice sheet.
      When a metal is heated, its atoms vibrate more and it usually expands.
      Many moths navigate at night by using the Moon as a reference point.
      The researchers compared rainfall records from 32 weather stations across the valley.
      The researchers placed motion sensors on the seabed to record passing ships.
      Some desert beetles collect water from fog on the ridges of their shells.
      A year on Mercury lasts just 88 Earth days.
      The team analyzed sediment layers from the lake's deepest basin.
      The laboratory kept the samples in darkness to prevent changes caused by light.
      A drop of blood contains millions of red blood cells.
      The northern lights can appear in shades of green, red, and violet.
      Scientists estimate that Earth is about 4.5 billion years old.
      The researchers tagged 24 seals to follow their movements through the bay.
      Some desert ants navigate by counting their steps as they search for food.
      A sheet of graphene is only one atom thick.
      The fossilized footprints suggest that the animals crossed the muddy plain together.
      A planet's atmosphere can bend and scatter light from its host star.
      The team found that the cave's temperature stayed nearly constant throughout the year.
      Certain butterflies taste with sensors on their feet.
      The largest living structure on Earth is Australia's Great Barrier Reef.
      The experiment tested how different wavelengths of light affected algae growth.
      Some alpine flowers grow close to the ground to avoid strong winds.
      The spacecraft used a gravity assist from Venus to change its path around the Sun.
      A woodpecker's tongue can wrap around the back of its skull.
      Researchers compared the sound of healthy reefs with recordings from damaged sites.
      The Earth's atmosphere becomes thinner with increasing altitude.
      Some salamanders can regrow parts of their limbs after an injury.
      The mineral zircon can preserve evidence of conditions on early Earth.
      The survey measured the thickness of the ice at more than 200 locations.
      A group of stars held together by gravity is called a cluster.
      The researchers added a harmless dye to trace water flowing through the wetland.
      Certain desert spiders build silk-lined burrows that help them conserve moisture.
      The speed of light in a vacuum is about 300,000 kilometers per second.
      The team used acoustic sensors to map a colony of bats inside the cave.
      Many shorebirds time their migrations to coincide with seasonal food supplies.
      A layer of volcanic ash can preserve footprints for thousands of years.
      The sample was warmed gradually while its electrical resistance was recorded.
      Some marine worms build tubes from sand grains and bits of shell.
      A solar day on Mercury lasts longer than its year.
      Researchers drilled a narrow core to study the forest's buried soil layers.
      The body's balance system relies on fluid-filled canals inside the inner ear.
      Certain grasses release seeds when raindrops strike their seed heads.
      The telescope detected water vapor around a young star.
      A gecko's feet can cling to smooth surfaces using millions of microscopic hairs.
      The study compared nesting success at beaches with different levels of nighttime light.
      The Moon has quakes caused in part by tidal forces from Earth.
      Some desert plants can wait years for enough rain before flowering.
      The apparent twinkle of stars is caused by turbulent layers of Earth's atmosphere.
      A mantis shrimp can detect polarized light that humans cannot see.
      The largest known volcano in the Solar System lies on Mars.
      At high altitude, cooking takes longer because water boils at a lower temperature.
      A single strand of human hair can support the weight of a small apple.
      The Antarctic ice sheet holds about 70% of Earth's fresh water.
      Some frogs communicate by sending vibrations through leaves.
      A teaspoon of ordinary sand may contain thousands of grains of different minerals.
      The first plants to colonize bare rock help create soil for later species.
      A planet's rings can be made from ice, dust, and fragments of rock.
      The human eye can distinguish millions of color variations under good lighting.
      Some whales use distinctive calls that can be recognized across an ocean basin.
      The oldest living trees can be more than 4,000 years old.
      A solar panel produces electricity when light knocks electrons loose in its material.
      The enzyme in pineapple juice can break down some proteins.
      The deepest roots of some trees reach more than 60 meters underground.
      A lunar crater can remain visible for billions of years because the Moon has little weather.
      The first plants grown in lunar soil needed added nutrients to thrive.
      Certain spiders can travel through the air by releasing long strands of silk.
      The north magnetic pole has shifted its position over time.
      Some seeds need exposure to fire before they can germinate.
      A prism bends different wavelengths of light by different amounts.
      The speed at which sound travels depends on the material it moves through.
      Many plants grow toward light through a process called phototropism.
      A single strand of DNA can contain billions of chemical building blocks.
      Some marine snails incorporate iron minerals into the armor around their bodies.
      A planet's seasons depend on the tilt of its axis as well as its orbit.
      The first living organisms on Earth appeared billions of years ago.
      A cocoon keeps a developing caterpillar protected during its transformation.
      Researchers used acoustic recordings to estimate how many frogs lived in the marsh.
      Some clouds form when moist air rises and cools to its dew point.
      The human body produces vitamin D when skin is exposed to sunlight.
      A tiny change in ocean acidity can affect how some shellfish build their shells.
      The largest known seed comes from a palm native to the Seychelles.
      A neutron star can spin hundreds of times each second.
      Some flowers warm themselves to attract pollinating insects on cold nights.
      The color of a mineral's powder can differ from the color of its outer surface.
      A river can carve a canyon gradually as water carries away rock and sediment.
      Researchers placed cameras near the nesting site to record nocturnal visits.
      The Sun's magnetic field reverses direction roughly every eleven years.
    `),
    community: L(`
      Welcome to the forum! Please read the pinned post before starting a new thread.
      Has anyone tried growing tomatoes on a north-facing balcony?
      Selling a barely used kids' bike, 16-inch wheels, $40 or best offer.
      Lost cat near Pine Street: grey tabby, answers to Biscuit, very shy.
      The neighborhood clean-up is this Saturday at 9 am; gloves and bags provided.
      Can anyone recommend a reliable plumber in the Eastbrook area?
      Book club meets on the first Tuesday of every month at the library.
      Found a set of keys on a blue lanyard outside the bakery.
      Thanks to everyone who came to the bake sale; we raised 1,320 for the school library.
      The community pool opens for the season on Memorial Day weekend.
      Free piano to a good home; you'll need to arrange pickup.
      Is the farmers' market still on if it rains?
      Our choir is looking for tenors and basses, no audition needed.
      Reminder: recycling collection moves to Wednesday this week due to the holiday.
      Looking for a running buddy for early mornings around the lake.
      Does anyone know why the streetlights on Maple Avenue are out?
      The youth soccer league is registering players aged 6 to 14 until 15 March.
      Please slow down near the school; there are lots of little ones crossing.
      Swap meet next Sunday: bring clothes, books and toys you no longer need.
      Our dog-walking group meets at the park entrance at 7:30.
      Can I compost citrus peels, or is that a bad idea?
      Huge thanks to the volunteers who repainted the playground.
      Anyone else hearing loud construction noise at night?
      Moving sale this weekend, everything must go: sofa, desk, plants.
      The library's repair cafe fixed 37 items last month.
      Looking to borrow a ladder for an afternoon; happy to return the favor.
      The open mic night at the Corner Stage is back every Thursday.
      Please keep dogs on a leash in the wildlife area.
      Does anyone have a spare moving box or two?
      The community fridge on Elm Street was restocked this morning.
      New here: just moved from Porto and looking for a good Portuguese bakery.
      The petition to keep the post office open has 1,800 signatures so far.
      Kids' coding club starts again after the summer break.
      Has anyone tried the new ramen place near the station? Worth it?
      Tip: the hardware store gives a 10% discount to garden club members.
      We're organizing a carpool to the regional parade; reply if you need a seat.
      Water will be shut off on Oak Street from 10 am to 2 pm for repairs.
      I can teach basic Spanish in exchange for help with my garden.
      Please return borrowed tools to the shed by Sunday evening.
      Lost and found: one child's glove (red) at the playground.
      The new bike lane on Bridge Street is finally finished!
      Anyone want to split a bulk order of seed potatoes?
      Our street party is confirmed for 6 July; the road will be closed from noon.
      Reminder to vote in the residents' association election by Friday.
      Thank you all for the warm welcome!
      The little free pantry beside the bus stop has been moved under the awning.
      Does anyone have a recommendation for a quiet place to study nearby?
      I found a pair of glasses on the path behind the community center.
      The allotment group has a few spare plots available for new gardeners.
      Thanks to Mara and the crew for clearing branches after yesterday's storm.
      Does the number 8 bus still stop outside the recreation hall on Sundays?
      The mural on Cedar Lane is getting a fresh coat of paint next weekend.
      Does anyone know when the playground splash pad will reopen?
      I have extra zucchini from the garden if anyone would like some.
      The walking group is taking a new route along the canal this Friday.
      A blue umbrella was left in the meeting room after the talk last night.
      Our block is putting together a small seed swap in the courtyard on 12 April.
      The repair cafe could use someone who knows how to mend torn clothes.
      Has anyone seen a brown rabbit near the allotments this morning?
      We raised enough at the yard sale to replace the benches by the pond.
      A free beginner pottery session is happening at the arts room next month.
      Please leave the gate by the dog exercise field closed after you pass through.
      The book exchange shelf is now in the lobby of the health center.
      Join us for a litter pick along the creek path on Sunday morning.
      Someone left a lunch bag on the number 4 bus, and it is with the driver.
      Our school garden needs cardboard boxes for the compost beds.
      The lantern walk will start at the fountain just after sunset on Friday.
      Does anyone have a contact for the person who runs the Saturday chess table?
      The neighborhood newsletter is looking for short stories about local history.
      A family is giving away a sturdy dining table; collection from West End only.
      The outdoor film night has been moved indoors because of the rain forecast.
      Please keep the lane beside the market clear for deliveries before 8 am.
      The community center is hosting a clothing mending circle every second Monday.
      I can lend a child-sized life jacket for the rowing club's open day.
      The pond cleanup team spotted three new ducklings this morning.
      Does anyone know where to donate unopened art supplies locally?
      The bus shelter on Willow Road has a new timetable posted inside.
      Free herb seedlings will be available outside the library on Saturday.
      The chess club welcomes beginners and meets in the cafe room after school.
      A small brown dog was seen wandering near the soccer field without a collar.
      Thanks to everyone who helped set up the winter coat exchange yesterday.
      Does anyone have a spare ticket for the neighborhood history walk on Saturday?
      The west branch library has extended its opening hours on Thursday evenings.
      Has anyone found a silver water bottle near the basketball court?
      We need a few more helpers to serve tea at the school fair next weekend.
      The riverside path is open again after the fallen tree was cleared away.
      Does the community hall have a ramp at the side entrance?
      The evening language exchange is moving to the cafe room for the winter.
      The lost scarf by the post box is now at the front desk of the recreation hall.
      A beginner birdwatching walk will leave from the old footbridge at 8 am Sunday.
      Can someone recommend a good route for a stroller walk around the park?
      The small reading room needs donations of large-print books and magazines.
      Please use the side entrance this week while the main doors are being painted.
      A set of watercolor paints was found on the benches beside the fountain.
      The community center is starting a monthly board game afternoon for all ages.
      The footpath behind the allotments is muddy, so sturdy shoes are a good idea.
      Has the noticeboard outside the market been moved somewhere else?
      The community orchard will have a pruning day next week, with tools provided.
      Please return the folding chairs to the storage closet after tonight's meeting.
      The neighborhood walking group is collecting suggestions for accessible routes.
      A pair of blue mittens was left in the lobby after the children's concert.
      Our annual talent show is looking for short acts from local residents.
      Would anyone like to help paint signs for the spring fair this weekend?
      The community garden's rain barrel is full again after last night's shower.
      A free sewing machine is available to borrow from the tool library.
      The youth room is collecting gently used puzzles for its rainy day shelf.
      We are collecting spare blankets for the animal shelter's winter drive.
      A set of watercolor brushes was left in the arts room after the class.
      Anyone interested in joining a beginner's birding group at the marsh reserve?
      The Saturday market is adding a table for local artists starting next week.
      Please take care around the footbridge while the handrail is being repaired.
      A neighbor has a few extra jars of tomato relish to share after the harvest.
      Does anyone have a recommendation for a tailor who can alter a curtain?
      Found: a knitted green hat on the bench beside the fountain this morning.
      Would anyone be able to lend us a projector for the neighborhood film night?
      We are setting up a quiet corner with puzzles at the community fair this year.
      The old oak by the bus stop has a new information sign about local birds.
      Has anyone seen a set of blue ear defenders near the play area?
      The riverside bird count starts at dawn on Saturday, and newcomers are welcome.
      Our shared garden has a few bundles of mint ready for anyone who can use them.
      The makerspace has set aside an hour each month for quiet, drop-in projects.
      A notice about the free tax help session is posted by the laundromat entrance.
      Has anyone borrowed the folding screen from the rehearsal room recently?
      Someone left a striped tote bag under the seats at the community theater.
      The community garden's new noticeboard has a section for sharing surplus seeds.
      A box of unused greeting cards is free for anyone who can put them to good use.
      The courtyard noticeboard now has a section for offering rides to local events.
      Does anyone know where the spare keys for the music room are usually kept?
    `),
  };
  const SENTENCES = Object.values(SENTENCE_GROUPS).flat();
  const DOMAINS = Object.keys(SENTENCE_GROUPS);

  function paragraph(rng, n = 4, opts = {}) {
    const domain = opts.domain && SENTENCE_GROUPS[opts.domain] ? opts.domain : rng.pick(DOMAINS);
    return C.sample(rng, SENTENCE_GROUPS[domain], n, opts).join(' ');
  }
  function paragraphs(rng, k = 3, opts = {}) {
    const domain = opts.domain && SENTENCE_GROUPS[opts.domain] ? opts.domain : rng.pick(DOMAINS);
    const pool = C.sample(rng, SENTENCE_GROUPS[domain], 999, opts);
    const out = [];
    let i = 0;
    for (let p = 0; p < k; p++) {
      const n = rng.int(opts.min || 2, opts.max || 5);
      if (i + n > pool.length) i = 0;
      out.push(pool.slice(i, i + n).join(' '));
      i += n;
    }
    return out;
  }

  const TOPICS = L(`
    Remote work
    Personal finance
    Home gardening
    Electric vehicles
    Urban cycling
    Healthy breakfast ideas
    Photography basics
    Learning a new language
    Small business marketing
    Cloud security
    Mental health at work
    Budget travel in Europe
    Sourdough baking
    Running for beginners
    Climate adaptation
    Public transport
    Board games
    Home renovation
    Interior design on a budget
    Data privacy
    Customer service
    Productivity tools
    Job interviews
    Writing a resume
    Parenting toddlers
    Pet adoption
    Dog training
    Camping gear
    Hiking trails
    Birdwatching
    Astronomy for amateurs
    Renewable energy
    Smart home devices
    Online shopping
    Recycling and waste
    Zero-waste living
    Meal prep
    Vegetarian cooking
    Coffee brewing
    Tea culture
    Wine regions
    Street food
    Music production
    Learning guitar
    Classical music
    Film festivals
    Podcasting
    Book clubs
    Creative writing
    Poetry
    Local history
    Museums and galleries
    Architecture
    Public libraries
    Volunteering
    Neighborhood events
    Housing market
    Renting tips
    Mortgage basics
    Retirement planning
    Investing for beginners
    Taxes for freelancers
    Startup funding
    Project management
    Team meetings
    Software testing
    Web accessibility
    Mobile apps
    Machine learning
    Open data
    Cybersecurity awareness
    Password managers
    Video games
    Esports
    Football season
    Tennis
    Swimming technique
    Yoga and stretching
    Sleep hygiene
    Nutrition labels
    First aid
    Seasonal allergies
    Winter driving
    Car maintenance
    Bike repair
    Sewing and mending
    Knitting
    Pottery
    Woodworking
    3D printing
    Space exploration
    Ocean conservation
    Wildlife photography
    Weather forecasts
    Language exchange
    Studying abroad
    Online courses
    Exam preparation
    Wedding planning
    Moving to a new city
    Watercolor painting
    Digital illustration
    Typography
    Hand lettering
    Printmaking techniques
    Origami
    Calligraphy
    Glassblowing
    Leather crafting
    Quilting traditions
    Embroidery patterns
    Jewelry making
    Floral arrangement
    Landscape design
    Composting at home
    Rainwater harvesting
    Beekeeping basics
    Aquarium care
    Fermentation at home
    Regional pasta dishes
    Farmers market finds
    Food preservation
    Picnic planning
    Table settings
    Kitchen organization
    Foraging traditions
    Culinary herbs
    Cheese making
    Chocolate tasting
    Family recipes
    Food truck culture
    Accessible travel
    Rail journeys
    National parks
    Coastal walks
    Historic walking tours
    Travel journaling
    Packing light
    Small town tourism
    Public art
    Community theater
    Improvisational comedy
    Animation history
    Documentary filmmaking
    Sound design
    Dance choreography
    Folk music traditions
    Jazz improvisation
    Concert photography
    Independent publishing
    Graphic novels
    Literary translation
    Reading challenges
    Storytelling traditions
    Memoir writing
    Science communication
    Museum conservation
    Ancient civilizations
    Cultural anthropology
    World languages
    Sign language basics
    Study habits
    Memory techniques
    Classroom activities
    Science fair projects
    Mathematical puzzles
    Digital note-taking
    Spreadsheet skills
    Data visualization
    Interface design
    Robotics projects
    Satellite imagery
    Digital archiving
    Internet history
    Computer hardware
    Video editing
    Live streaming
    Virtual reality
    Indie game development
    Puzzle design
    Tabletop roleplaying
    Toy collecting
    Vintage clothing
    Wardrobe planning
    Urban forestry
    Community radio
    Local geology
    Home energy efficiency
    Balcony gardening
    Native plant gardens
    Container gardening
    Orchard care
    Seed saving
    Strength training
    Pilates for beginners
    Tai chi practice
    Indoor climbing
    Kayaking routes
    Canoe camping
    Sailing basics
    Rock pool exploration
    Stargazing equipment
    Meteor showers
    Volcano monitoring
    Earthquake science
    Fossil hunting
    Mineral collecting
    Butterfly gardening
    Backyard wildlife
    Animal behavior
    Horse care
    Cat enrichment
    Urban beekeeping
    Herbal tea blends
    Seasonal cooking
    Vegetable carving
    Lunchbox ideas
    Slow cooking
    Grilling techniques
    Regional soups
    Bread baking methods
    Coffee roasting
    Nonalcoholic drinks
    Food photography
    Restaurant design
    Kitchen safety
    Home brewing traditions
    Family budgeting habits
    Saving for a purchase
    Understanding insurance
    Consumer rights
    Freelance portfolios
    Small shop displays
    Business networking
    Workplace communication
    Remote team rituals
    Career changes
    Apprenticeship pathways
    Technical writing
    Copyediting styles
    Fact checking methods
    Community newsletters
    Oral history projects
    Family archives
    Historic maps
    Cemetery symbolism
    Local folklore
    Traditional festivals
    Craft markets
    Mural painting
    Stage lighting
    Puppetry
    Choral singing
    Opera appreciation
    Home recording studios
    Music theory exercises
    Instrument care
    Vinyl record collecting
    Radio drama
    Short film production
    Screenwriting structure
    Costume design
    Set building
    Stop motion animation
    Comic strip creation
    Bookbinding
    Zine making
    Paper marbling
    Natural dyeing
    Loom weaving
    Basket weaving
    Soap carving
    Model building
    Miniature painting
    Map making
    Garden pond care
    Houseplant propagation
    Indoor herb gardens
    Green roofs
    Wetland restoration
    River cleanup projects
    Urban sketching
    Botanical illustration
    Ceramic glazing
    Tidal calendars
    Glacier landscapes
    Desert ecology
    Prairie restoration
    Forest bathing
    Tree identification
    Pollinator corridors
    Raised bed planning
    Shoreline erosion
    Watershed stewardship
    Solar cooking
    Repair cafe workshops
    Clothing care labels
    Shoe repair techniques
    Natural fiber crafts
    Wood carving motifs
    Furniture restoration
    Marquetry patterns
    Candle making
    Paper sculpture
    Book arts workshops
    Portrait composition
    Color mixing studies
    Landscape photography
    Night sky photography
    Field recording walks
    Fiddle traditions
    Hand percussion rhythms
    Music festival planning
    Opera costume archives
    Theater set painting
    Radio interviewing
    Essay writing prompts
    Fantasy mapmaking
    Literary magazines
    Regional dialects
    Language revitalization
    Braille literacy
    Library programming
    After school clubs
    Outdoor education
    Peer tutoring methods
    Laboratory notebooks
    Cloud classification
    Coastal geology
    Cave formations
    Volcanic soils
    Paleobotany discoveries
    Freshwater wetlands
    Insect migration routes
    Animal tracking signs
    Equine trail etiquette
    Handmade pasta shapes
    Cooking over campfires
    Tea ceremony utensils
    Bread scoring patterns
    Food co-op operations
    Community kitchens
    Home cafe menus
    Travel sketchbooks
    Ferry route planning
    Mountain hut stays
    Canal boat journeys
    Night train experiences
    Salt marsh ecology
    Chess composition
    Civic wayfinding
    Ice core research
    Public fountain design
    Rain garden planning
    Native seed libraries
    Fire lookout history
    Cave rescue equipment
    Mountain pass geology
    Coral reef restoration
    Seagrass meadow surveys
    Kelp forest ecology
    Estuary bird counts
    Pond life observation
    Snowpack measurements
    Lighthouse lens history
    Canal lock engineering
    Historic mill machinery
    Rural water systems
    School garden projects
    Food pantry logistics
    Farm share coordination
    Greenhouse ventilation
    Pruning fruit trees
    Hedgerow planting
    Urban soil testing
    Invasive plant removal
    Stream insect surveys
    Bat house placement
    Owl pellet analysis
    Rock strata field notes
    Mineral crystal shapes
    Lava tube exploration
    Glacier lake formation
    Desert night ecology
    Arctic tundra plants
    Island biogeography
    Coastal dune grasses
    Mangrove root systems
    Shell collecting ethics
    Tide pool field guides
    River meander mapping
    Waterfall hydrology
    Rain gauge networks
    Storm cloud photography
    Aurora observation logs
    Solar eclipse viewing
    Amateur radio antennas
    Shortwave listening
    Signal flag traditions
    Mechanical toy history
    Model railway scenery
    Paper airplane design
    Kite building patterns
    Marble run construction
    Card game mechanics
    Folktale illustration
    Book review exchanges
    Literary walking routes
    Historical photo dating
    Family name research
    Wooden spoon carving
    Natural pigment recipes
    Indigo dye workshops
    Wool carding methods
    Lace making traditions
    Textile repair circles
    Patchwork block designs
    Handmade paper fibers
    Decorative book covers
    Relief print techniques
    Etching studio safety
    Glass mosaic patterns
    Marionette construction
    Circus poster archives
    Festival mask making
    Folk dance notation
  `);

  const HEADLINES = L(`
    City council approves new cycling lanes after heated debate
    Riverside bridge reopens six months ahead of schedule
    Local bakery wins national bread award for second year running
    Heavy snow closes schools across the northern districts
    Five easy ways to cut your energy bill this winter
    Museum's spring exhibition draws record crowds
    Northwind Logistics to open new warehouse, creating 400 jobs
    How a small team built an app used by 2 million people
    Rail strike set to disrupt weekend travel
    Why everyone is suddenly talking about heat pumps
    The 12 best hiking trails within an hour of the city
    Fuel prices fall for third straight week
    Volunteers clear 1.8 tonnes of litter from Seabright beach
    Library extends weekend hours starting in September
    New direct train links Lyon and Turin from December
    Study finds short walks after meals may help blood sugar
    Jazz festival sells out in under an hour
    Mayor unveils budget focused on housing and transit
    Heatwave warning issued as temperatures climb to 34 °C
    Airport handles record 2.3 million passengers in July
    What the new data protection rules mean for your business
    Inside the startup trying to fix grocery waste
    Interest rates held at 3.25% as inflation cools
    The quiet comeback of the paper notebook
    Hospitals urge flu vaccinations as cases rise
    Ferry services suspended amid gale-force winds
    Bluepeak Labs claims breakthrough in battery charging speed
    Marathon day: road closures and bus diversions
    5,000 new trees to be planted by 2030
    Online holiday spending up 6% on last year
    Campaign launched to save historic customs house
    Pedestrian bridge opens to the public on 21 June
    Students from Fernhill Academy win national robotics title
    Rare snowy owl spotted near nature reserve
    320 affordable homes planned for former rail yard
    Food festival returns with more than 80 local vendors
    Expect delays near junction 12 during roadworks
    Ancient trade routes exhibition opens Friday
    Local startup raises $18 million in Series A round
    Tap water declared safe after week-long advisory
    Zoo celebrates birth of two red panda cubs
    Voter turnout hits 68%, highest in two decades
    Tech conference returns to the convention center in October
    Flooding hits eastern districts after record rainfall
    Theater company announces new season lineup
    Contactless payments arrive on buses and trams
    Bakeries feel the pinch as flour prices double
    Community garden offers free Saturday workshops
    Warmest February on record, scientists say
    New swimming pool to open before summer
    Saltmarsh Coffee Co. closes original shop after 22 years
    Review: the Kestrel X2 headphones are quiet, comfortable and pricey
    10 recipes you can make with five ingredients or fewer
    Is a four-day work week right for your team?
    How to spot a phishing email in 30 seconds
    The best budget laptops for students in 2025
    Opinion: our streets should be designed for people, not parking
    Explainer: how does a heat pump actually work?
    Q&A with the architect behind the new waterfront library
    Photos: lantern festival lights up the old town
    Live updates: election night results
    Analysis: what the trade deal means for local farmers
    Five questions to ask before signing a lease
    Weekend guide: markets, music and a midnight bike ride
    Report: commuters lose 92 hours a year to traffic
    The secret life of urban foxes
    A beginner's guide to composting at home
    Why your houseplants keep dying (and how to fix it)
    Inside the race to build better batteries
    From garage to global: the story of Tinker Toys Workshop
    Local hospital opens new children's wing
    Parking fees to rise by 50 cents next month
    Sunday market moves to Cobblestone Square for summer
    City to trial car-free Sundays on the waterfront
    New bus route connects university and hospital
    Record number of applicants for apprenticeship scheme
    Firefighters rescue family's dog from frozen pond
    Teen chess prodigy beats grandmaster in 31 moves
    Wildfire season starts early in the south
    Ten years on: how the flood changed our town
    Startups bet big on vertical farming
    The best free things to do this weekend
    Recall issued for batch of frozen berries
    Why fewer people are buying cars in big cities
    Council votes to keep post office open
    Our verdict on the new electric scooters
    The surprising science of naps
    Inside a day at the city's busiest train station
    Housing prices dip for the first time in three years
    Annual report shows sharp drop in road injuries
    Lost wallet returned with every cent after 14 years
    New study links green spaces to lower stress
    How one school cut food waste by 70%
    What to watch this week: four new series worth your time
    Your guide to the new recycling rules
    Kestrel Systems recalls 12,000 smart plugs over overheating risk
    Ask the expert: how much should I save for retirement?
    The return of the neighborhood video store
    Eight great day trips by train
    Hidden gems: the city's best small museums
    Why sleep matters more than you think
    How to negotiate a pay rise, according to recruiters
    The rise of the repair cafe
    Breaking: power outage affects 30,000 homes
    Updated: main road reopens after earlier crash
    Op-ed: it's time to rethink school start times
    Small towns, big ideas: rural innovators to watch
    Scientists map the seafloor in unprecedented detail
    Local runner completes 100 marathons in 100 days
    Night markets are back, and bigger than ever
    The fight to save the city's last record shop
    Can a robot make a decent cup of coffee?
    What happens to returned online orders?
    Cyclists welcome new protected lanes on Bridge Street
    Is it worth fixing your old phone?
    How the city plans to cope with hotter summers
    Year in review: the stories that defined 2024
    Five charts that explain the housing market
    Your rights when a flight is cancelled
    The 20 most-borrowed library books this year
    Fact check: do electric cars really cost more to insure?
    New exhibition celebrates 150 years of the harbor
    Schools to get free breakfast program from autumn
    Local brewery wins gold at international awards
    A new kind of classroom: learning outdoors
    Restaurant review: Ember & Oak Grill is worth the wait
    Ten tips for a smoother commute
    Train fares to rise by 3.4% in January
    Community fridge project expands to five neighborhoods
    Heritage railway reopens after restoration
    Why this tiny island is betting on wind power
    Readers' letters: on parking, potholes and pigeons
    The art of doing nothing: why boredom is good for you
    Mountain rescue teams report busiest summer yet
    Coastal path closed after landslide
    How to make your home office actually comfortable
    Report: one in four young people want to start a business
    Concert review: the regional orchestra at Willow Park
    Plan approved for new cycle bridge over the canal
    Experts warn of rise in parcel delivery scams
    Weekend weather: sunshine at last
    The best podcasts for your commute
    Inside the lab growing coral to save reefs
    Price of coffee beans hits 13-year high
    Children's hospital receives record donation
    The people keeping the city's clocks on time
    Why are so many shops closing on Main Street?
    Inside the world's quietest room
    Local teacher named regional educator of the year
    Night bus network expanded to cover suburbs
    How to read a nutrition label
    A guide to the new tax-free savings allowance
    These are the most common passwords, and why you shouldn't use them
    Ferry operator orders three electric vessels
    City's first rooftop orchard opens above the central market
    Why the humble lunchbox is making a comeback
    Harbor cranes pause as fog blankets the waterfront
    Local choir turns abandoned station into a concert hall
    New ferry timetable adds late-night crossings
    A field guide to the birds nesting on office rooftops
    Council backs plan to convert empty offices into studios
    Behind the scenes at the town's volunteer-run radio station
    How to plan a low-waste birthday party
    Archaeologists uncover a Roman-era kiln beneath a car park
    Autumn book fair brings independent publishers together
    The little free pantry changing life on Birch Lane
    Scientists track migrating butterflies with tiny tags
    What's inside the region's new flood warning system?
    Opinion: public benches are part of a healthy city
    Photos: fog rolls over the old stone viaduct
    Three overlooked ways to explore the canal district
    Local makers invite visitors into their workshops
    Could rooftop rain barrels help streets stay cooler?
    A century-old map reveals a vanished riverside neighborhood
    Residents turn vacant lot into a pocket park
    The case for keeping handwritten family recipes
    Record turnout for the annual kite festival
    What it takes to restore a stained-glass window
    Small observatory opens its doors for public stargazing
    How a village shop became a lifeline for older residents
    The best places to watch the sunset around the bay
    Work begins on a new wildlife crossing over the ring road
    Local school swaps its bell for a five-minute music break
    A beginner's guide to mending a torn jacket
    Why the old cinema's neon sign still shines
    Farmers test a new way to share equipment
    Three generations keep the town's puppet theater alive
    Spring tide brings rare shells to the northern shore
    Weekend road closures planned for the lantern parade
    The rise of the neighborhood tool library
    How to build a welcoming book club from scratch
    Town hall opens a time capsule sealed in 1976
    A new footpath links the station with the marsh
    Record number of swifts return to nest beneath the eaves
    Inside the workshop that repairs broken umbrellas
    Local chef brings back the lost art of the supper club
    What to know before adopting a rescue greyhound
    The case for taking the scenic route to work
    City's oldest fountain flows again after a decade
    First look: the new galleries at Alder House
    Why small museums are digitizing their collections
    A practical guide to keeping a balcony herb garden
    The island where every street has a different name
    Residents rally to protect the last public tennis court
    Late-season frost damages fruit trees across the valley
    How one community made its own walking map
    New rules for overnight parking take effect Monday
    The strange and wonderful world of seed libraries
    The neighborhood bakery that teaches children to knead
    A century of local weather captured in one family diary
    Which trees thrive in a windswept garden?
    From wool scraps to winter coats: a school sewing project
    The quiet craft of restoring old photographs
    Travel guide: a weekend among the hilltop villages
    Local theater offers relaxed performances for all ages
    A rare comet may be visible after dusk this week
    How street names preserve stories of the past
    What's growing in the community greenhouse this month
    The final whistle at Meadowfield's beloved football ground
    A new sculpture trail winds through the botanical gardens
    Five ideas for making a long train journey fly by
    Village volunteers reopen the footbridge after repairs
    What happened to the town's missing milepost?
    How a retired teacher built a lending library for tools
    A look inside the region's busiest parcel sorting depot
    The river's new floating garden attracts curious visitors
    Morning market moves indoors during winter months
    Could solar canopies transform the station car park?
    An illustrated guide to the clouds above our coast
    The annual duck race raises funds for a new playground
    The best places to hear live folk music this month
    A quiet corner of the city becomes a haven for butterflies
    How to host a neighborhood clothing swap
    A new archive preserves the voices of dock workers
    Farm's open day celebrates the humble potato
    How the town's first women builders shaped its streets
    A guide to the stars visible from your backyard
    A walking tour follows the city's forgotten waterways
    Residents gather to welcome back the traveling fair
    First snow brings a flurry of sleds to the common
    Why the best playgrounds leave room for imagination
    New coastal lookout offers a front-row seat to seabird life
    How a tiny repair shop kept a whole street running
    Farmers' market introduces a monthly seed exchange
    The story behind the mural on Willow Lane
    What to pack for a day exploring the moor
    Town's brass band marks 75 years with a free concert
    A guide to the new walking routes around the reservoir
    Can a shared workshop help local crafts thrive?
    Rain delays the opening of the annual flower show
    The surprising history of the neighborhood's oldest pub
    Inside a lighthouse keeper's restored cottage
    Four easy ways to make a rental feel like home
    Why amateur astronomers are looking toward the moon
    Council seeks ideas for the empty lot on Market Street
    A new ferry connects the mainland to the bird sanctuary
    How to start a family archive without special equipment
    Photos: first light at the highland observatory
    The local game shop where strangers become regulars
    A guide to choosing a bike route for every mood
    Museum asks residents to help identify an unknown portrait
    What the new footbridge means for riverside walkers
    Children design a mural for the refurbished leisure center
    Can a neighborhood map help people feel at home?
    Frost-covered fields create a winter wonderland at dawn
    The tradition of ringing bells on the first day of spring
    How volunteers keep the mountain hut open all year
    A new sculpture brings color to the harbor wall
    Recipe: a warming pear cake from the village archive
    Beneath the high street, a lost passage comes to light
    The case for a slower, more curious family holiday
    Travelers discover a quieter side of the lake district
    How a community workshop gives discarded wood a second life
    New audio trail brings the old fort's history to life
    Residents revive the tradition of a shared harvest supper
    When the tide goes out, the beach reveals its secrets
    A practical guide to painting a room without the fuss
    Small-town bookshop launches a late-night reading series
    The city's first public drinking fountain in a generation
    Why the old railway path is a favorite with new walkers
    Local students build a miniature model of their future town
    Gardeners swap advice at the annual seedling social
    A field notebook from the edge of the desert
    New picnic tables invite visitors to linger by the lake
    How to make a tiny kitchen work harder
    Town's annual scarecrow trail returns with 40 creations
    Art students turn storm-felled timber into public benches
    The unexpected pleasure of traveling without an itinerary
    A night at the observatory: what visitors can expect
    Harbor museum seeks memories of the old ferry route
    Why this year's apple harvest tastes different
    The disappearing craft of carving wooden walking sticks
    Public art project turns a blank wall into a storybook
    Why the town's old water tower is getting a second life
    The volunteers cataloging every tree in the parish
    Why the valley's old stone walls are being rebuilt by hand
    A beginner's guide to making paper from garden clippings
    The tiny railway platform with a surprisingly busy history
    What makes a good neighborhood noticeboard?
    A new cycle repair stand appears outside the market hall
    How to grow salad leaves on a shaded windowsill
    The orchard where visitors can pick their own pears
    A family-run ferry makes its final crossing of the season
    Inside the archive preserving the town's theater posters
    Why roof gardens are attracting more visiting bees
    The school greenhouse supplying herbs to the lunch kitchen
    A guide to spotting seals along the eastern headland
    Residents map the best benches for a rest along the canal
    The old customs ledger revealing a town's trading past
    Weekend workshop teaches the basics of basket weaving
    New bird hide opens beside the reed beds
    How a community choir learned to sing in four languages
    The railway carriage turned into a traveling reading room
    Five quiet walks for a misty morning
    Local potters fire a new kiln built from reclaimed brick
    A pocket guide to the wildflowers of the chalk downs
    The clockmaker who still works by lamplight
    Visitors invited to help restore the walled kitchen garden
    A new footpath traces the route of an old watercourse
    What to look for at the winter makers' market
    The village hall's handmade stage curtain gets a second act
    How a patch of nettles became a home for moths
    The old ferry bell rings again after restoration
    A neighborhood listening project records everyday sounds
    The story of the stone steps beneath the market square
    A guide to finding fossils along the northern cliffs
    Local students design nesting boxes for garden birds
    A former stable becomes a home for traveling exhibitions
    The craft of printing maps one color at a time
    Community allotments open their gates for harvest day
    A new boardwalk makes the marsh accessible year-round
    Which native shrubs can handle a salty coastal breeze?
    Inside the shed where the town's parade floats are made
    The annual lantern walk follows a new route this year
    How a retired carpenter restored the village bandstand
    An illustrated guide to the trees lining the old road
    Local swimmers take on the cross-bay relay
    Why the empty shopfronts are filling with student artwork
    A new noticeboard shares stories from the harbor's past
    The best spots to watch autumn leaves turn along the river
    A beginner's guide to carving a simple wooden spoon
    The community cinema takes its screen to the village green
    How to make a travel journal from everyday scraps
    The family keeping the town's handbell tradition alive
    Market traders prepare for the return of the spring fair
    The small museum asking visitors to bring a favorite object
    A guide to the region's surviving stone bridges
    Local makers turn fishing nets into sturdy garden twine
    Night of storytelling brings the old inn back to life
    The schoolyard pond that became a science classroom
    A new guidebook follows the town's painted shop signs
    How to press leaves without losing their color
    The annual sheepdog trials return to the high meadow
    Inside the studio making marionettes from willow and cloth
    First edition of the neighborhood walking map sells out
    A guide to the quietest corners of the botanical glasshouse
    How a row of rain gardens changed one busy street
    The old boathouse becomes a base for youth sailing lessons
    Local weavers revive a pattern found in a family trunk
    What the tide pools reveal after a storm
    A restored signal box opens as a tiny railway museum
    An unexpected collection of miniature boats goes on display
    A practical guide to keeping muddy boots out of the hallway
    A new mosaic marks the entrance to the riverside path
    Why the old quarry is now a favorite spot for dragonflies
    The volunteers recording names on forgotten gravestones
    How a school project brought the village's lost songs back
    A field guide to the butterflies of the orchard belt
    A guide to making a simple bird feeder from offcuts
    The converted signalman's cottage welcomes its first guests
    A new outdoor classroom takes shape beneath the apple trees
    Why the village's old wells are being carefully documented
    Photos: morning mist settles over the flooded meadows
    Town's amateur film club screens a century of home movies
    How to start a windowsill collection of kitchen herbs
    The quiet work of maintaining a public footpath
    A community darkroom invites beginners to develop film
    New information boards tell the story of the old salt road
    A guide to the best places for a picnic on the ridge
    Local gardeners share cuttings at the annual plant table
    The old fire station finds a new role as a craft studio
    A week of open workshops celebrates the town's makers
    What lies beneath the abandoned orchard's oldest tree?
    The family archive filled with postcards from every decade
    A new bench honors the people who built the harbor wall
    How to identify common birds by their calls
    A guide to visiting the region's working farms
    The restored bandstand hosts its first Sunday concert
    Why the village's painted eggs appear each spring
    A new viewing platform offers a close look at the heronry
    Five ways to explore the hills by local bus
    The village shop's recipe book becomes a local bestseller
    A forgotten footbridge reopens after a careful repair
    A guide to the sounds of a summer evening outdoors
    How one street turned its front gardens into a flower trail
    The old quarry pond draws a new generation of naturalists
    Local artists paint the seasons on the railway underpass
    A practical guide to making a simple home weather diary
    How the old mill race shaped the lanes around the village
    A guide to the region's small independent galleries
    Local bus drivers share favorite views from their routes
    New benches make the hillside path easier to enjoy
    The craft fair where every stall is run by a local maker
    The community orchestra rehearses in a former schoolhouse
    Photos: a clear night reveals the Milky Way above the moor
    A guide to exploring the old harbor on foot
    Local children create a map of places that make them happy
    How a village bakery made room for a tiny book exchange
    A beginner's guide to sketching the landscape outdoors
    Residents help restore the path to the ruined watchtower
    The rare craft of making a traditional willow fish trap
    Ask the archivist: how do you care for old family letters?
    How local boatbuilders choose timber that lasts
    The best small gifts to bring back from a day trip
    New community kitchen opens in the former railway offices
    A guide to the wild herbs growing along the coast
    Small theater brings a play to the village green
    Why the town's old clock tower keeps losing five minutes
    Residents launch a monthly repair morning at the library
    The best routes for a gentle cycle through the countryside
    Inside the greenhouse saving rare local apple varieties
    How to make a simple sketchbook from recycled paper
    The school choir records songs remembered by grandparents
    What a century of postcards reveals about the seaside town
    Local volunteers create a map of accessible woodland paths
    The old courthouse opens as a home for artists
    Five ways to make the most of a rainy afternoon outdoors
    A pocket guide to the moths visiting your porch light
    How a forgotten orchard became a place for outdoor learning
    The quiet appeal of collecting vintage travel posters
    A guide to the region's most welcoming picnic shelters
    Could a shared freezer help cut food waste on one street?
    Photos: the first crocuses appear beside the canal
    A new walking tour follows the route of the old tramway
    Local students restore a faded mural at the bus station
    The annual wool fair returns with demonstrations and music
    How to keep a small pond clear through the summer
    A baker's notebook offers clues to a century-old recipe
    The community woodshop opens for its first public tour
    What makes the marsh a stopping point for migrating geese?
    A guide to finding quiet places to read around town
    The hilltop wind shelter gets a handmade timber roof
    Local gardeners trial flowers that thrive in sandy soil
    A weekend of open doors at the district's historic homes
    The last hand-cranked ice cream maker in the valley
    The unexpected history of the town's narrowest lane
    New seating makes the riverside steps a place to linger
    A beginner's guide to making a nature journal with children
    Local makers host a show of objects made from sea glass
    Which birds return first when the estuary begins to thaw?
    The former post office becomes a shared space for clubs
    A practical guide to planning a day out without a car
    Why the old school bell rings once each year
    A guide to the region's best places to see spring lambs
    A new board game brings local history to family nights
    How a collection of old keys found its way to the museum
    The community's first night of short films sells every seat
    A field guide to the lichens growing on old stone walls
    Five simple ways to make a garden welcoming to hedgehogs
    An afternoon train offers a new view of the northern farms
    Local artists turn a former shop into a shared print studio
    The story behind the painted number on the harbor steps
    A guide to visiting the county's smallest nature reserves
    Why the town's annual cheese roll brings neighbors together
    How to make a sturdy notebook cover from leftover fabric
    The river cleanup that began with one borrowed wheelbarrow
    A new rooftop apiary gives visitors a closer look at bees
    The old village sign is recast using a century-old mold
    Can a row of fruit trees soften the edge of the ring road?
    How to identify the plants growing between paving stones
    A new wildlife hide opens beside the old quarry lake
    Local children revive the tradition of May morning singing
    What the village's oldest garden can teach new growers
    A guide to the town's surviving Victorian shopfronts
    The annual pebble painting trail returns to the beach
    Inside the studio where paper flowers bloom all year
    A former dairy becomes a base for local walking groups
    Why a simple hand-drawn map is still useful to travelers
    The small harbor where boats are repaired with care
    Residents gather to share stories of the old bus route
    A practical guide to making a window box for shade
    The community theater's backstage tour is back this month
    New signs mark a safer route between two village schools
    Local historians uncover the story of a vanished bandstand
    A guide to the best viewpoints along the old ridge road
    A restored grain store opens for music and craft workshops
    What to bring to your first community gardening session
    The river path's new benches were made by local apprentices
    A family of woodcarvers keeps a regional pattern alive
    The town's annual hat parade welcomes its youngest makers
    A guide to exploring the coast by local ferry
    How to make a simple paper lantern for a winter walk
    The old quarry trail opens after months of careful work
    A beginner's guide to identifying trees by their buds
    The annual scarecrow supper returns to the village orchard
    The art of folding a map for a day in the hills
    A quiet garden tucked behind the town's former fire station
    Local children build homes for solitary bees from offcuts
    The story of the ferry ticket found inside an old coat
    Five places to watch the tide change along the bay
    A weekend workshop introduces the basics of stained glass
    How a shared pantry brought three streets closer together
    New route links the marsh footpath with the hilltop trail
    A guide to the old recipes served at the harvest table
    What grows well in a garden exposed to strong winds?
    A new community dark sky event begins at the reservoir
    The craft of restoring old wooden toys by hand
    Students create a sound map of the town's busiest square
    A row of tiny book boxes appears along the river path
    The people behind the annual lantern boat procession
    A guide to the region's historic railway waiting rooms
    Why the village keeps a guest book at its highest viewpoint
    A new walking route follows the old boundary stones
    What to look for in a traditional thatched roof
    The neighborhood's first shared tool shed opens on Saturday
    How to press garden flowers into a simple greeting card
    The town's lost fountain turns up in a family photograph
    The old mill pond hosts its first community boat day
    The weekly market adds a stall for homegrown cut flowers
    Why the village's old bus shelter has become a landmark
    The coastal path's missing mile marker is finally replaced
    How a garden club is sharing its favorite local seeds
    The story of the handmade puppets in the school archive
    A guide to the quietest hours at the town museum
    Neighbors turn a steep lane into a seasonal flower walk
    A beginner's guide to planning a neighborhood history walk
    How to choose a sturdy houseplant for a dim corner
    A new community bakery shares its ovens with home cooks
    Readers' photos: gardens at the height of summer
    A practical guide to planning a first overnight hike
    The coastal school teaching children to read the shoreline
    A guide to the wild bees nesting in garden walls
    Opinion: the best public spaces make room for lingering
    What happens during a night of moth watching?
    A new map highlights the region's accessible picnic spots
    How a patch of scrub became a classroom for local schools
    The curious history of the town's first public telephone
    Gardeners compare notes at the annual tomato tasting
    A practical guide to photographing birds from your window
    Residents revive the custom of singing on the village green
    Five small museums worth a visit on a quiet afternoon
    A new reading room opens in the former riverside boathouse
    The art of making a useful notebook from a single sheet
    Why the valley's hay meadows are being cut by hand
    The lantern parade gets a new set of hand-painted floats
    What the old quarry's fossils tell us about a vanished sea
    The volunteer who knows every gate along the coastal path
    A beginner's guide to making a small woven wall hanging
    The annual hilltop picnic brings back the brass band
    How to plan a day of sketching in the open air
    New exhibition explores the history of home kitchens
    A guide to finding old millstones hidden in the countryside
    A community project gives discarded bicycles a second life
    How to build a simple insect hotel from fallen branches
    What to notice on a walk through the old cemetery
    The craft of shaping a traditional clay roof tile
    A guide to the best places for a quiet lunch outdoors
    The annual wool spinning day brings wheels to the town hall
    A night walk reveals the hidden life of the hedgerows
    New benches invite visitors to linger beside the old lock
    Five ways to make a garden path welcoming in every season
    What grows beneath the canopy of the ancient beech wood?
    A practical guide to making your own simple bookplate
    Inside the tiny workshop making wooden whistles by hand
    The community radio hour dedicated to local oral histories
    A new trail follows the route of the vanished canal branch
    An illustrated guide to the shells found after a low tide
    A family collection of hand-painted tiles goes on display
    What visitors can learn from the marks on a stone bridge
    A guide to the region's surviving public wells
    The lost art of making a comfortable rush-seated chair
    Local musicians record the melodies played at harvest time
    How to make a simple nature display with finds from a walk
    A new market day brings growers to the village schoolyard
    The story of the bell that once called workers to the river
    A quiet route through the town's most colorful courtyards
    The coastal watch volunteers keeping a log of passing boats
    The annual harvest table returns to the covered market
    A guide to the traditional patterns found on local pottery
    Why the abandoned greenhouse is blooming again
    The neighbors preserving a patch of rare meadow grass
    How to plan a weekend of slow travel by regional bus
    The old weighbridge gets a new role as an outdoor exhibit
    A children's map traces the route from home to the river
    What to bring to a dawn chorus walk in the pine woods
    The story of the village's hand-carved weather symbols
    The annual storytelling supper returns to the old granary
    A beginner's guide to making a colorful patchwork cushion
    A guide to the region's quietest stretches of riverbank
    The town's annual open garden weekend adds a twilight tour
    A guide to making a simple sundial for a sunny windowsill
    How a shared allotment brings new neighbors together
    A practical guide to choosing paper for a homemade journal
  `);

  const EMAIL_SUBJECTS = L(`
    Re: Q3 budget review - updated numbers
    Your order #48213 has shipped
    Invoice INV-2024-0193 from Ashgrove Property Management
    Meeting notes: product sync (Tue)
    Welcome to Bluepeak Labs!
    Reminder: dentist appointment tomorrow at 10:30
    Fwd: Contract draft v3
    Action required: verify your email address
    Your password was changed
    Lunch on Friday?
    [Team] Holiday schedule for December
    Re: Re: Offsite venue options
    Your receipt from Saltmarsh Coffee Co.
    New sign-in from an unrecognized device
    Weekly report - week 42
    Can you review this by EOD?
    Out of office: back on Monday
    Your subscription renews in 7 days
    Interview invitation: Senior Product Designer
    Thanks for your application
    Delivery attempted - reschedule your delivery
    Re: Question about my last invoice
    Draft agenda for the board meeting
    Photos from Saturday
    Happy birthday, Amara!
    Fwd: Parking permit renewal
    Quick question about the launch date
    [Action needed] Approve purchase order PO-7731
    Your trip to Lisbon: booking confirmed
    Your boarding pass for flight NV 2318
    Price drop on an item in your wishlist
    Your monthly statement is ready
    Payment received - thank you!
    Payment failed: please update your card
    Re: Apartment viewing on Thursday
    Security alert: new device added to your account
    Feedback request: how did we do?
    Your return has been processed
    Rescheduled: Design review moved to 3 pm
    Invitation: Quarterly all-hands @ Thu 15:00
    Updated invitation: 1:1 with Priya
    Canceled: Team lunch
    Accepted: Project kickoff
    Re: Hiring plan for Q1
    The slides you asked for
    Minutes from the residents' meeting
    Your library books are due soon
    Last chance: 30% off ends tonight
    Final notice: invoice overdue
    Re: Bug report - export fails on large files
    Volunteer schedule for the bake sale
    [repo] 3 new comments on your pull request
    Your weekly summary: 12 tasks completed
    Request for quote - 500 units
    Follow-up from yesterday's call
    Introducing our new pricing
    Important changes to our Terms of Service
    Your account will be closed in 30 days
    Re: Can we move our call?
    Confirm your subscription
    Webinar recording: Getting started with dashboards
    You've been added to the Marketing workspace
    Re: Re: Re: Logo feedback
    Expense report approved
    Expense report rejected - missing receipt
    Training reminder: security awareness due 30 June
    Your table for 4 is confirmed
    Order #A7-55102: ready for pickup
    Shipping update: your package is out for delivery
    Your package was delivered
    We received your request (Ticket #58213)
    Re: Ticket #58213 - refund status
    Welcome aboard! Your first week at Northwind
    Payslip for March 2025
    Tax documents now available
    Re: School trip permission form
    Parent-teacher meeting: sign-up open
    Book club: next month's pick
    Garden club newsletter - April
    Your free trial ends tomorrow
    Thank you for your donation
    Your feedback helps us improve
    Re: Kitchen renovation quote
    Annual leave request - 12 to 16 August
    Approved: annual leave request
    Shared with you: "Roadmap 2025"
    Comment on "Budget v4.xlsx"
    Reminder: timesheets due today
    Re: Car service booking
    Your MOT is due next month
    Rent increase notice
    Lease renewal documents
    Lost and found: blue umbrella
    FYI: server maintenance this weekend
    Incident report: login outage 09:42 UTC
    Post-mortem: payment gateway timeout
    Release notes v4.2.1
    New feature: dark mode is here
    Re: Partnership opportunity
    Speaker invitation: City Tech Conference 2025
    Your ticket for the jazz festival
    Change to your flight schedule
    Your hotel stay: please complete online check-in
    How was your stay at Harbour Lights Hotel?
    Re: Missing item in my order
    Store credit added to your account
    Gift card from Daniel
    You have a new message from Kenji
    Weekend plans?
    Re: Dinner at ours on Saturday
    Recipe you asked for
    Moving update + new address
    Congrats on the new job!
    Re: Thank you!
    Proposal: website redesign
    Signed contract attached
    Please sign: NDA for Tessellate AI
    Reminder: Board meeting materials
    Re: Holiday party venue
    Seating chart for the wedding
    Fwd: Fwd: funny photo from the trip
    Updated floor plan
    Your appointment is confirmed
    Your prescription is ready for collection
    Test results available in your patient portal
    Re: Invoice discrepancy (INV00482)
    Credit note CN-2025-0042
    Purchase order PO-7731 - approved
    Shipping delay on order #50677
    Back in stock: Trail Running Shoes
    Your review has been published
    Someone replied to your post
    Weekly digest: 5 new posts in Neighborhood Watch
    Job alert: 8 new Data Analyst roles
    Re: Reference request
    Offer letter - please review
    Background check complete
    Onboarding checklist
    IT: your laptop is ready for pickup
    Password expires in 5 days
    Re: VPN not connecting
    New voicemail from +44 20 7946 0123
    Missed call from Lukas
    Re: Translation for the brochure
    Your print order is on its way
    Quarterly newsletter: what's new at Copperleaf Studio
    Survey: 2 minutes to tell us what you think
    Re: Data request under GDPR
    Your data export is ready
    Account recovery code
    Two-factor authentication enabled
    Verify your new phone number
    Re: Wi-Fi in the meeting rooms
    Fire drill on Wednesday at 11:00
    Office closed on Monday (public holiday)
    Re: Parking spaces next quarter
    Your refund of $42.18 is on its way
    Order cancelled: #48217
    Re: Question about sizing
    Thanks for shopping with us
    Your cart is waiting for you
    Re: Catering for the workshop
    Agenda: Partner workshop Nairobi, 9-10 Sept
    Visa letter for your trip
    Re: Flight options for the offsite
    Hotel block reserved
    Re: Room booking for the 12th
    Reminder: submit your talk abstract by Friday
    Paper accepted - camera-ready due 15 May
    Reviewer comments on your manuscript
    Grant application: next steps
    Lab meeting moved to Thursday
    Re: Dataset access
    Your library card has been renewed
    Course enrollment confirmed: Spanish B1
    Assignment 3 feedback
    Exam timetable published
    Re: Group project roles
    Graduation ceremony details
    Alumni newsletter - Autumn edition
    Re: Donation receipt for tax purposes
    Your energy usage this month
    Planned water outage on Oak Street
    Bin collection changes over the holidays
    Your council tax bill
    Re: Noise complaint
    Neighborhood clean-up this Saturday
    Re: Borrowing your ladder
    New comment on your listing: kids' bike
    Your item sold!
    Re: Is the sofa still available?
    Invoice for October consulting work
    Re: Rate card 2025
    Timesheet reminder
    Re: Logo files (final, final)
    Brand guidelines v2
    Re: Launch checklist
    Your domain renews soon
    SSL certificate expiring in 14 days
    Re: Can we hop on a quick call?
    Notes from our chat
    Re: Sorry I missed you today
    Re: revised estimates for the garden project
    Statement for your studio account
    Notes from Monday's planning session
    Welcome to the neighborhood association
    Reminder: library event starts at 6 pm
    Fwd: updated floor plan for the kitchen
    Please confirm your attendance by Wednesday
    Your recovery email was updated
    Coffee after the school run?
    [Workshop] Materials for Thursday's session
    Re: Summer picnic location
    Your cabin booking is confirmed
    New login attempt blocked
    Monthly activity report - September
    Could you send the latest draft?
    Away from my desk until Thursday
    Your membership card is ready
    Application received - thank you
    Re: Question about the service charge
    Outline for the community meeting
    Snapshots from the trail
    Congratulations on your new home!
    Fwd: vehicle registration renewal
    A thought about the newsletter
    [Please review] Supply request SR-2046
    Your weekend itinerary is attached
    Travel details for train 704
    A lower fare for your saved route
    Your quarterly account summary
    We have received your transfer
    Action needed: payment method declined
    Re: Viewing the cottage next week
    Tell us about your recent visit
    Your exchange has been completed
    Moved: planning session now at 11 am
    Invitation: department update on Tuesday
    Updated: catch-up with the project group
    Canceled: Saturday's walking tour
    Accepted: neighborhood grant review
    Re: Staffing coverage for July
    The reference guide is attached
    Notes from the co-op meeting
    Your borrowed tools are due back
    Final day to reserve your place
    Reminder: outstanding balance on account 7716
    Re: Search results page not loading
    Helpers needed for the spring fair
    [workspace] Mara added a note to the project
    Estimate request - custom shelving
    Checking in after our conversation
    A first look at the autumn collection
    Updates to our privacy notice
    Your profile is scheduled for deactivation
    Re: Could we start a little later?
    Finish setting up your account
    On-demand session: organizing shared files
    You now have access to the Fieldwork group
    Travel expenses processed
    Travel expenses need more detail
    Your table reservation is confirmed
    Order 64018 is ready at the counter
    Your parcel has left the sorting center
    Delivery completed this afternoon
    We opened a case for your inquiry (Ref 73104)
    Re: Case 73104 - replacement request
    Welcome to the team - getting started
    Year-end forms are available
    Re: Permission slip for the museum visit
    Volunteer slots for the class trip
    Reading circle: schedule for next month
    Community garden notes - June
    Your introductory period ends next week
    We appreciate your support
    A quick question about your experience
    Re: Estimate for the hallway repairs
    Time-off request for 3-7 November
    Approved: request for time away
    Shared folder: "Workshop plans"
    A comment was added to "Roster.xlsx"
    Re: Bicycle tune-up appointment
    Your inspection is due in six weeks
    Notice about the building's service fee
    Renewal packet for your rental agreement
    Found: a set of keys near the front gate
    FYI: water service interruption overnight
    Service update: card payments unavailable
    Review summary: scheduled maintenance
    Version 2.8 is now available
    New option: save drafts automatically
    Re: Joint exhibit proposal
    Your pass for the lantern walk
    Your departure time has changed
    Complete your guest details before arrival
    How did you enjoy your cabin stay?
    Re: One item missing from the shipment
    A credit has been applied to your balance
    A thank-you gift from the team
    A note from your project group
    Any plans for the long weekend?
    Re: Potluck at our place next Sunday
    The lentil stew recipe you wanted
    Best wishes for your first day
    Re: I appreciate your help
    Proposal: community archive website
    The agreement is signed and attached
    Signature requested: equipment loan form
    Reminder: agenda pack for the steering group
    Re: End-of-year gathering arrangements
    Table plan for the anniversary dinner
    Fwd: the view from the lookout
    Revised site sketch attached
    Your fitting appointment is booked
    Your framed print is ready
    Re: Difference on statement 88316
    Adjustment note AD-3186
    Supply request SR-2046 approved
    Unexpected delay for shipment 64018
    Available again: canvas daypack
    Your comment is now visible
    A neighbor responded to your message
    New openings in the research assistant team
    Re: Could you be a reference for me?
    Employment agreement ready for review
    Screening documents received
    First-week checklist for new starters
    Facilities: your desk key is ready
    Your access code will expire soon
    Re: Remote access keeps dropping
    A new voice message is available
    A call was missed from an unknown number
    Re: Proofreading the event leaflet
    Your poster prints are on the way
    Quarterly update from the community workshop
    Poll: choose a date for the open house
    Re: Request for account information
    Your archive download is ready
    Temporary sign-in code enclosed
    Extra sign-in verification is active
    Confirm the contact number on your profile
    Re: Projector setup in room Cedar
    Building evacuation practice: Friday at 10
    Reception will close early on Thursday
    Re: Storage lockers for next season
    Your reimbursement of 28.60 has been issued
    Reservation canceled: table for four
    Re: Jacket size exchange
    Thanks for placing an order
    You left a few things in your basket
    Re: Snacks for the evening class
    Schedule: regional planning session, 4-5 June
    Travel support letter attached
    Re: Rail choices for the team retreat
    Guest rooms held for the conference
    Re: Reserve the studio for the 18th
    Your paper is shortlisted for the showcase
    Notes from the editorial review
    Project huddle moved to Friday
    Re: Shared folder permissions
    Your borrowing limit has been renewed
    Enrollment confirmed: beginner pottery
    Feedback on your second assignment
    Assessment dates are now posted
    Re: Who is covering the presentation?
    End-of-term celebration details
    Former members' update - Winter issue
    Re: Confirmation of your contribution
    Your household power summary is ready
    Street sweeping on Willow Lane next week
    Recycling pickup changes for the holiday week
    Your municipal services statement
    Re: Request about the late-night noise
    Help plant trees at the riverside this Sunday
    Re: Could I borrow your folding table?
    A question about your listing: floor lamp
    Your handmade bowl found a new home
    Re: Is the desk still for sale?
    October invoice for design services
    Re: Updated hourly schedule
    Please send this month's work log
    Re: Artwork files for the second pass
    Visual standards: revised color sheet
    Re: Checklist before the public launch
    Your web address renewal is coming up
    Site security key expires in two weeks
    Re: Are you free for a short conversation?
    Summary and next steps from today
    Re: Sorry we couldn't connect earlier
    A seat has opened up in the evening class
    Could you cover the first hour tomorrow?
    Re: notes for the handover
    The keys are under the flowerpot
    Are we still on for the walk?
    A photo from the station platform
    Thanks for watering the plants
    Re: Who has the spare charger?
    Found your scarf in the hall
    The book you lent me is finished
    Can you bring the blue folder?
    Tea and cake after the recital
    Re: Sunday dinner headcount
    I left the parcel with reception
    Your old photos are ready to collect
    A small change to our plans
    Did you get home safely?
    The spare room is all yours
    Re: the sound from upstairs
    Could you feed the cat this weekend?
    We made it to the coast
    Your recipe was a hit
    A few things for the market
    Re: keys for the back entrance
    The seedlings are coming along
    Would you like the extra tickets?
    Thanks for the lift this morning
    I've attached the revised rota
    Who can take the late shift?
    Re: draft notes from the workshop
    Please add your section to the report
    The new starter guide is ready
    Can we split the demo into two parts?
    Decision log from today's review
    Updated inventory for the storeroom
    Re: access to the test environment
    Pairing session moved to Room 6
    The printer on level two is back online
    Please label the sample boxes
    Weekly queue snapshot attached
    Could someone check the loading bay?
    Your equipment request is on hold
    Reminder: clear your lockers by Friday
    The rehearsal room is reserved
    Re: volunteer induction materials
    Tomorrow's setup begins at 8:15
    Please return the visitor badges
    A draft of the annual plan
    Your workshop certificate is attached
    The new timetable starts next week
    We need two more helpers at the desk
    Your parcel locker code is enclosed
    Your order is ready for dispatch
    A new date for your repair visit
    Re: receipt for the replacement part
    Your loyalty points statement is ready
    The tailor has finished your coat
    We couldn't match your delivery address
    Your refill pack is ready to collect
    A size guide for the wool jumper
    Re: question about the spare parts
    Your exchange parcel has been logged
    The repair estimate is attached
    Your rental equipment is due back
    A receipt for your market stall
    We've set aside the item you reserved
    Re: request to split the shipment
    Your membership is active through June
    The craft kit you ordered is here
    A reminder about your collection window
    Your return label is attached
    Your new glasses case is in the post
    An update on your repair ticket
    The bakery order is confirmed
    Re: missing piece from the set
    The replacement is on its way
    A note about tomorrow's delivery window
    Your seat assignment has changed
    Platform change for the 18:20 service
    Re: getting from the airport to town
    Your coach leaves from bay 7
    A stop has been added to your route
    The ferry crossing is running late
    Your luggage tag was found
    Map and trail notes for the weekend
    Check-in opens at the lodge at 3
    The walking route is closed near the bridge
    A room has opened for your dates
    Re: travel plans for the school break
    Your museum pass is attached
    Shuttle pickup point has moved
    The final stop is now Riverside
    Your bicycle is booked on the train
    A weather update for your campsite
    Fwd: directions to the new venue
    Your tour group meets by the fountain
    The cabin has a wood stove
    A quieter room is available on request
    Your payment went through this morning
    A duplicate charge has been reversed
    Re: receipt for the pottery class
    Your account balance is up to date
    A statement for your equipment rental
    We couldn't process your latest transfer
    Your deposit has been returned
    Please check the details on your receipt
    The invoice is attached for your records
    A reminder about your installment date
    Your card is ready at the front desk
    Re: updated quote for the fence
    The grant paperwork needs one more page
    Your donation matched by a local sponsor
    A confirmation for your class fee
    We've corrected the amount on your bill
    The deposit deadline is next Friday
    Your travel claim is ready for review
    A copy of your payment receipt
    Re: billing address on file
    Your renewal is complete
    New messages are waiting in your inbox
    A weekly look at your saved searches
    Your reading list has been updated
    Re: notification settings for the group
    Someone mentioned you in a discussion
    Your shared album is ready
    A new file was added to the archive
    Your access request is awaiting review
    A copy of the recording is available
    The community calendar has a new event
    Your draft was saved successfully
    New activity in the study circle
    Re: invitation to the local forum
    Your profile picture was updated
    A reminder from the family calendar
    The shared map has been updated
    Your saved article is now available offline
    A new edition of the neighborhood journal
    The board game group meets tonight
    Workshop photos are ready to view
    Your registration is on the guest list
    Re: message from the reading group
    The hall will open at half past six
    Bring a mug to the repair cafe
    A few seats remain for the choir night
    Your place at the makers' table is held
    The orchard needs volunteers on Sunday
    The lantern route has been marked
    A reminder for the community meal
    Re: stall assignments for the book fair
    The lost property box is at reception
    Join us for an evening of short films
    The craft room is open this afternoon
    A new date for the neighborhood swap
    Your name is on the garden waiting list
    The walking group meets by the old mill
    Thanks for helping at the seed exchange
    A note about the shared workshop
    The hall kitchen will be unavailable
    The picnic shelter is reserved for you
    Re: details for the open studio
    The spring concert program is attached
    Reminder: bring your own gardening gloves
    A place is available on the pottery course
    The club newsletter is ready to read
    The chess tables are set up in the library
    Your child left a lunchbox at school
    A note from the classroom about tomorrow
    The science fair schedule is attached
    Re: costume pieces for the play
    The reading log is due next Tuesday
    A place opened on the bus for the outing
    The class photo order form is ready
    Reminder: bring a labeled water bottle
    The music room will be closed after lunch
    Your project display is ready to collect
    After-school club starts in the new room
    The lost mitten is at the school office
    A change to the pick-up point
    Re: permission for the nature walk
    The term's activity calendar is attached
    Library reading challenge: final week
    Your instrument case is in the music room
    A reminder about the uniform exchange
    The field trip group meets at the main gate
    Re: book fair volunteer slots
    Your application is in the review queue
    The second interview will be a group session
    Re: availability for the evening shift
    Please choose a slot for the skills exercise
    The selection panel has finished its review
    An update on your workshop proposal
    Re: images for the exhibition labels
    The equipment list for fieldwork
    Your paper copy is ready at the desk
    The sound check is scheduled for 4 pm
    We found a typo on the first page
    The shared drive is nearing its storage limit
    Your account recovery options were checked
    The household router restarted at 2 am
    Your new access badge has been issued
    Re: revised agenda for the site visit
    Your parcel is with the building manager
    The minutes from the access committee
    Re: the revised permissions matrix
    Fwd: notes from the riverside walk
    The new rota begins on 6 October
    Your membership renewal is due in November
    Re: draft caption for the exhibition
    The caretaker found a green notebook
    Your weekly hours are ready for approval
    The autumn term reading list
    Your train ticket is attached
    The courtyard tap is working again
    We have reserved the side room for you
    Please add your initials to the equipment log
    Re: lunch arrangements for visiting tutors
    Could you check the measurements once more?
    The rehearsal recording is attached
    Fwd: map for the allotment meeting
    The parcel locker is temporarily unavailable
    Your place on the evening tour is confirmed
    The repair workshop starts at 9:30
    The weekly meal plan is ready
    Can we move the book swap to Sunday?
    We have updated your delivery preference
    Re: quote for the noticeboard frame
    Please return the archive key by noon
    Your new timetable is attached
    The watercolour set has arrived
    The next neighborhood walk follows the canal
    Reminder: upload the workshop handout by noon
    The sewing circle meets in the upper hall
    Re: room layout for the training day
    The clean table coverings are in the pantry
    A reminder to bring the signed form
    Your place in the beginners' class is held
    Your equipment checkout has been recorded
    The replacement hinge has been dispatched
    A volunteer is needed for the early shift
    Fwd: route notes for the coastal path
    Please confirm which frame size you need
    Your class materials are ready in the cabinet
    Re: please review the updated test cases
    The gallery closes early this Thursday
    Your parcel is ready at the corner shop
    A reminder about the costume fitting
    Your garden plot number has been assigned
    The archive index is ready to download
    The new key cabinet is beside reception
    The west path is closed during resurfacing
    Fwd: directions to the back entrance
    Re: the revised delivery instructions
    Can you take notes at the planning circle?
    The repair team will arrive after lunch
    Your borrowed easel is due back Monday
    The printed program has a new cover
    A box of donated books is waiting downstairs
    Your order has been split into two parcels
    Could we meet beside the old fountain?
    We need your preferred delivery day
    Your parcel was accepted at the local depot
    Fwd: draft labels for the display cases
    The print room is open until 5 today
    Your order can be collected after 2 pm
    New comments on the draft release plan
    Please bring the fabric samples along
    The club has added a second practice session
    Re: revised list of tools for the shed
    Can you help set up the chairs at 6?
    Your booklet is waiting in the foyer cabinet
    Re: access request for the shared folder
    Fwd: photograph from the allotment show
    Re: who is bringing the projector screen?
    A new date for the stained glass session
    The old footbridge is open again
    The monthly usage summary is available
    A reminder about the fabric sale
    Re: revised notes from the heritage group
    Can you bring the spare table lamps?
    A short guide to the new compost bays
    Your saved search has a new match
    Fwd: travel plan for the visiting choir
    Please keep the side door clear on Friday
    A copy of the maintenance schedule
    The ceramics sale opens to members first
    Your repair appointment is now on Wednesday
    The replacement part has cleared inspection
    Could you bring the extension lead?
    Your package is on the upstairs landing
    Re: the second draft of the welcome leaflet
    The community kitchen needs clean jars
    Please check the name cards for spelling
    Please confirm the number of copies required
    The west classroom is reserved for practice
    The path lighting will be tested at dusk
    Re: room keys for the craft weekend
    A copy of the revised event timetable
    Could you water the glasshouse plants?
    A note about next week's lunch club
    The sound system will be collected tomorrow
    The secondhand book table needs volunteers
    The outdoor stage is booked for Saturday
    Re: target dates for the workshop series
    The visitor badges are at the welcome table
    Can you bring the long measuring tape?
    Re: final wording for the exhibit panel
    The evening ferry will stop at North Quay
    A fresh copy of the club directory
    Your pickup window is between 2 and 4 pm
    The spare parts for your repair have arrived
    A note about the community noticeboard
    Fwd: seating plan for the school concert
    Your new apron is hanging in the studio
    Could you bring the donation boxes inside?
    A copy of the visitor guide is attached
    Please return the hall key after the event
    Your pottery pieces are ready after firing
    A reminder about the brass band rehearsal
    Fwd: directions for the walking tour
    Your document is ready for a final review
    Can we meet under the covered walkway?
    The costume rail is in the green room
    A new location for the monthly craft circle
    Please bring the signed equipment agreement
    New activity in the equipment register
    Fwd: notes for the afternoon tea
    The south entrance will be open from 8
    Could you bring a few clean paint pots?
    The boat club launch is delayed by an hour
    The notice about roadworks is attached
    We received the signed delivery docket
    A reminder to collect the borrowed cushions
    A set of keys was handed in at the desk
    The community supper will begin at 6:45
    Your repair is finished and ready for pickup
    The studio will open an hour later tomorrow
    The replacement entry fob is at reception
    A note about the east courtyard
    Re: arrangements for the visiting artist
    Your account settings have been saved
    The hall piano has been tuned
    Could someone take the welcome desk at noon?
    The repair class has changed its tutor
    A reminder about the community film night
    Re: updated guest list for the reception
    The quarterly inventory sheet is ready
    The market stall map is ready
    The craft fair setup begins at 7:45
    Your borrowed camera is at the office
    The next poetry circle is meeting outdoors
    A revised estimate for the display cases
    The wooden signs need a coat of varnish
    Fwd: rehearsal order for the concert
    A reminder to bring your membership card
    Re: export file for the visitor survey
    Your table is reserved near the stage
    Can you return the borrowed handcart?
    The reading room is reserved until 4
    Please bring the spare cushions to the hall
    A note about the visiting school group
    Re: delivery of the folding screens
    Your repair visit is booked for the morning
    The craft cupboard is open for stocktake
    Could you help carry the display boards?
    The evening talk begins in the upstairs room
    Re: where to store the extra benches
    Your copy of the revised handbook is ready
    The rehearsal has moved to the old schoolroom
    The welcome table needs a fresh sign
    Fwd: updated list of market vendors
    The west wing will be open for visitors
    The next repair session is fully booked
    Re: print size for the exhibition map
    The garden club's seed catalog is ready
    Re: revised floor plan for the reading room
    New sign-in code requested for your account
    Re: the replacement latch for the greenhouse
    Your parcel is delayed at the regional hub
    Re: access to the archive catalogue
    Please save a place for the visiting group
    Your course materials have been posted
    A new message was added to the family thread
    Your return parcel has reached the warehouse
    The caretaker will be on site from 9
    Re: updated estimate for the window frames
    The guest speaker's notes are attached
    Your train is now departing from platform 4
    The shared calendar has been corrected
    Who can help with the afternoon collection?
    Your replacement item has arrived at the shop
    Please review the draft volunteer handbook
    The east gate will remain locked tomorrow
    Re: the garden boundary measurements
    Your receipt for the evening class is ready
    The book van will visit the village on Friday
    Could you confirm the room setup for Monday?
    A new version of the supply list is available
    Your parcel has been redirected to the locker
    Fwd: menu options for the school gathering
    Re: feedback on the storage plan
    A copy of the updated access map
    The evening workshop has a few places left
    Your account email address was changed
    The final draft of the neighborhood guide
    Re: collection of the borrowed sound mixer
    A seat is available on the return coach
    Your payment confirmation is attached
    The new volunteer directory is ready
    A reminder about tomorrow's equipment count
    Re: revised pickup time for the cabinets
    Your membership card was found in the foyer
    The rehearsal room will be warm by 5
    A change to the return route for the walk
    Please return the borrowed field guide
    The new class list is posted by reception
    A copy of your updated rental statement
    Re: lighting plan for the winter concert
    Your saved route has a service update
    A reminder to collect your framed certificate
    The hall's side entrance is open tonight
    Your transfer has been received in full
    Re: notes from the courtyard inspection
    The new members' guide is ready to share
    Please leave the parcel behind the front desk
    Your order is packed and awaiting pickup
    A place has opened on the weekend course
    The next stop on your shuttle is the museum
    Re: projector cable for the training room
    A draft poster for the open day
    Could you cover reception before lunch?
    The archive room will close at 3 today
    Your repair booking has been moved to Friday
    The photo proofs are ready for your approval
    Please bring the key register to the meeting
    Fwd: revised route for the school visit
    Your account statement is ready to download
    Re: materials for the spring exhibition
    The kitchen team needs an extra pair of hands
    Your reservation includes a late checkout
    Please confirm your place on the guided tour
    The sewing room has a new access code
    Re: who is collecting the banner stands?
    Your exchange request is now complete
    A reminder to label the food containers
    The club has published its winter program
    Your application documents are ready to view
    Re: travel details for the visiting team
    A message from the course coordinator
    The new rehearsal timetable starts on Monday
    Please bring the return forms to the office
    The allotment gate lock has been replaced
    Your visitor pass is valid until 6 pm
    A copy of the revised storage inventory
    Could you help sort the donated costumes?
    The final proof of the community leaflet
    Re: deposit for the room hire
    Your account recovery email was confirmed
    A reminder to bring your own serving spoon
    The parcel counter closes early on Saturday
    Your class has moved to the upper studio
    Please check the updated bus departure point
    The community bus is taking a different route
    Re: the sound system hire agreement
    Your ticket has been added to the event app
    A new copy of the emergency contact sheet
    Could you return the spare key this week?
    Your transfer receipt is ready
    The ceramics workshop is now fully booked
    Please send the final copy count by Thursday
    The north garden path is open again
    Re: where to place the coat racks
    A reminder about your upcoming pickup slot
    Fwd: map of the temporary parking area
    Your booking has been extended by one night
    A new schedule for the volunteer drivers
    Re: approval for the equipment loan
    The auditorium doors open at half past seven
    Please bring the archive boxes to room 2
    Your replacement key is ready at the desk
    The workshop handouts have been printed
    A message was left at the front office
    Your statement includes the latest adjustment
    Re: changes to the delivery access route
    The next language exchange is on Thursday
    Your seat is reserved in the front section
    Fwd: updated list of classroom helpers
    The garden tools are ready for the inventory
    Re: draft schedule for the open afternoon
    The last coach leaves at 9:20
    A copy of the signed room hire form
    Can someone bring the spare extension cords?
    The community orchestra has added a matinee
    A reminder about the borrowed display cases
    The east meeting room is free after 2
    Re: collection of the repaired bench
    A fresh batch of name tags is at reception
    Could you bring the painted sign indoors?
    Your departure gate has been updated
    The final list of workshop participants
    Fwd: photograph of the finished mural
    The building manager found a parcel for you
    Please check the revised rehearsal order
    Your service request has been assigned
    Re: timing for the delivery team
    A copy of the updated club rules
    Your booking details are attached
    A reminder to bring the spare tablecloths
    Fwd: floor plan for the pop-up exhibit
    The upper gallery is closed for setup
    A volunteer shift is open on Sunday morning
    Please return the borrowed measuring wheel
    Fwd: supply notes for the craft weekend
    A revised copy of the room allocation chart
    Your account alert preferences were updated
    Can you bring the tea urn to the hall?
    The registration desk opens at 8:30
    Your latest order confirmation is attached
    The school office has your lost lunch bag
    Please review the draft walking tour notes
    Your coach ticket has been reissued
    A copy of the updated catering numbers
  `);

  const EMAIL_KINDS = ['meeting', 'order', 'invoice', 'followup', 'intro', 'request', 'thanks', 'reminder', 'update', 'personal'];

  const GREETINGS = ['Hi {to},', 'Hello {to},', 'Dear {to},', 'Hey {to},', 'Good morning {to},', 'Hi {to} -', '{to},',
    'Hi there,', 'Hello,', 'Dear {toFull},', 'Hi all,', 'Afternoon {to},', 'Good evening {to},', 'Good day, {to},',
    'Dear colleagues,', 'Dear team,', 'Hi folks,', 'Good afternoon,', 'Greetings,', 'Welcome, {to},'];
  const OPENERS = ['Hope you are well.', 'I hope your week is going well.', 'Thanks for getting back to me so quickly.',
    'Just a quick note.', 'Following up on our conversation yesterday.', 'I hope you had a good weekend.',
    'Sorry for the slow reply.', 'Thanks for your message.', '', '', '', 'I wanted to share a brief update.',
    'Thank you for taking the time to write.', 'I appreciate you reaching out.', 'Here is a little more context.',
    'I wanted to check in with you.', 'Thanks for your patience with this.', 'I enjoyed our conversation.',
    'I am glad we could connect.', 'Thanks for taking a look at this.', 'I wanted to follow up with a note.',
    'Good to hear from you.', 'Thanks for the thoughtful note.', 'I appreciate the update.'];
  const BODIES = {
    meeting: [
      "Could we meet on {date} to go over the {topic} plan? I'm free at 10:00 or any time after 14:30.",
      "I've booked the small meeting room for {date}. The agenda is short: status, risks and next steps.",
      "Would {date} work for a quick sync? I'd like to walk you through the numbers before we share them with {company}.",
      "Let's move our call to {date}, same time. I'll send an updated invite.",
    ],
    order: [
      "Your order {orderId} for the {product} has been confirmed. The total charged was {amount}.",
      "Good news: the {product} you ordered is on its way and should arrive by {date}. Tracking number: {tracking}.",
      "We're sorry, but the {product} is temporarily out of stock. We expect new stock on {date} and will ship your order then.",
      "Thank you for shopping with {company}. We've received your return of the {product}; a refund of {amount} will follow.",
      "We've reserved the {product} for order {orderId}. Payment of {amount} is complete; our team will pack it next.",
      "Order {orderId} is ready for dispatch with the {product}. The enclosed receipt records a payment of {amount}.",
      "The carrier has collected the {product}. Delivery is expected on {date}; use {tracking} to check its progress.",
      "The {product} is at the nearby depot for delivery by {date}. The parcel can be traced with {tracking}.",
      "Our supplier has delayed the {product} shipment until {date}. Your order is waiting for that warehouse delivery.",
      "We've set aside incoming stock of the {product} for you. It should reach our main warehouse on {date}.",
      "{company} has completed the return inspection for the {product}. Your refund of {amount} is now being processed.",
      "The refund of {amount} for the returned {product} has been issued by {company}. It may take a few days to appear.",
      "The {product} was damaged in transit and is coming back. A replacement will leave our warehouse on {date}.",
      "We couldn't deliver the {product} today. The carrier will try again on {date}; your tracking reference is {tracking}.",
      "The {product} is awaiting inspection at {company}. If the return is accepted, we'll refund {amount}.",
      "Payment of {amount} for order {orderId} was declined. We kept the {product} on hold while you check the details.",
    ],
    invoice: [
      "Please find attached invoice {invoiceId} for {amount}, due on {date}.",
      "A friendly reminder that invoice {invoiceId} ({amount}) is now 7 days overdue. Could you let us know when we can expect payment?",
      "We've received your payment of {amount} for invoice {invoiceId}. Thank you!",
      "Attached is the updated invoice. I corrected the quantity on line 3, so the new total is {amount}.",
      "Invoice {invoiceId} is for {amount}, due on {date}. It covers all the agreed work.",
      "Invoice {invoiceId} has a balance of {amount}, payable by {date}. A copy is attached.",
      "A payment of {amount} has no reference. May we apply it to invoice {invoiceId}?",
      "Invoice {invoiceId} still has an unpaid balance of {amount}. Has it reached your billing team?",
      "Your recent payment of {amount} has cleared against invoice {invoiceId}. The balance is now zero.",
      "Invoice {invoiceId} is on hold during our review of the {amount} charge. Please wait to pay.",
      "The discount was missing from the invoice. The attached correction brings the amount due to {amount}.",
      "We agreed to split the {amount} due on invoice {invoiceId}. An installment schedule will follow.",
      "Our records show payment of {amount} was returned. Invoice {invoiceId} remains unpaid.",
      "The due date for invoice {invoiceId}, totaling {amount}, is now {date}, as requested.",
    ],
    followup: [
      "I wanted to follow up on the proposal I sent last week. Have you had a chance to look at it?",
      "Just checking in on the {topic} question. Is there anything else you need from me before {date}?",
      "Circling back on this: we still need a decision on the {product} order by {date}.",
      "As discussed, I've attached the revised draft. The main changes are in sections 2 and 4.",
      "Does the proposal cover what you had in mind? I can add a breakdown of the work if needed.",
      "I've kept the revised draft open for comments. Should I include the examples we talked about?",
      "Will the answer to the {topic} question affect your plans? We can talk it through before {date}.",
      "I found some context on {topic}. Would a short summary help resolve the question by {date}?",
      "The supplier needs our reply on the {product} order by {date}. Are the quantities settled?",
      "Can we make a decision on the {product} order by {date}, or should I ask for more time?",
      "Have you chosen which part of the proposal to start with? I can plan a schedule around it.",
      "I've compared both versions of the draft. Did you mean to leave out the final paragraph?",
      "Who should answer the {topic} question? I'd like to get it to the right person before {date}.",
      "Have you tested the {product} sample? We need to settle the order details before {date}.",
      "Your comments on the draft seem to conflict. Which change should I carry into our next draft?",
    ],
    intro: [
      "I'd like to introduce you to {other}, who leads {topic} at {company}. I think you two should talk.",
      "My name is {from} and I work on the {topic} team at {company}. A colleague suggested I reach out.",
      "We met briefly at the conference in {city}, and I'm following up as promised.",
      "I'm the new account manager for {company}, taking over from {other}.",
      "{other} is exploring {topic} at {company}. I'm putting you both in touch to compare approaches.",
      "I'm connecting you with {other} at {company} to discuss {topic} and share ideas.",
      "I'm {from}, the contact for {topic} at {company}. I'll be gathering feedback from your team.",
      "{from} here from {company}. I'm joining the {topic} work and would value your perspective.",
      "{other} has briefed me on your account at {company}. I'll handle the next review.",
      "I'm covering the {company} account while {other} is away. I'll be your contact this week.",
      "{other} at {company} has offered to run a session on {topic}. I'll leave you to arrange it.",
    ],
    request: [
      "Could you send me the latest version of the {topic} report by {date}?",
      "Would you be able to approve the purchase of a {product} ({amount})? It's for the new team member.",
      "Can you give me access to the shared folder? I can only see last year's files.",
      "We need two volunteers for {date}. Let me know if you can help.",
      "Can you add the latest figures to the {topic} report and send it by {date}?",
      "Please share source notes for the {topic} report by {date}. I need to check a detail.",
      "Please add the new starter to our shared folder so they can read the project notes.",
      "Could you help set up the room on {date}? We need another pair of hands.",
    ],
    thanks: [
      "Thank you so much for your help with the {topic} launch. It wouldn't have happened without you.",
      "Many thanks for the {product}! It arrived today and it's perfect.",
      "Thanks again for hosting us on {date}. Everyone had a great time.",
      "Just wanted to say thank you for the quick turnaround on this.",
      "Your notes on {topic} saved us time. Thanks for making them so clear.",
      "Thanks for spotting the gap in the {topic} plan before we shared it.",
      "The {product} was a thoughtful choice. Thanks for remembering what I needed!",
      "Thanks for sending the {product}. It was packed with care and arrived safely.",
      "Thank you for making room for us on {date}. We felt so welcome.",
      "Thanks for arranging the visit on {date}. The tour was a real highlight.",
      "I appreciate you fitting this in. Thanks for being so flexible.",
      "Thanks for staying late to finish the changes. We met the deadline with time to spare.",
      "Thanks for explaining {topic}. I feel ready to try it on my own.",
      "The {product} arrived just in time for our event. Thanks for sorting that out!",
      "Thanks for lending us the space on {date}. The rehearsal went smoothly.",
      "Thanks for returning the edits fast. I could share the draft this morning.",
    ],
    reminder: [
      "This is a reminder that your appointment is on {date}. Please arrive 10 minutes early.",
      "Friendly reminder: timesheets and expense reports are due on {date}.",
      "Your subscription will renew on {date} for {amount}. No action is needed if you'd like to continue.",
      "Don't forget to bring your ID and the booking reference {code} on {date}.",
      "Please keep {date} free for your appointment. Tell us if you need to reschedule.",
      "Your appointment is set for {date}. Allow time to find parking before you arrive.",
      "Please send missing receipts by {date} so we can close this month's records.",
      "The final draft is due on {date}. Please allow time for a review before sending it.",
      "Your subscription restarts on {date} at {amount}. Check that your details are current.",
      "The renewal charge of {amount} is set for {date}. Let us know about plan changes.",
      "Have booking {code} handy on {date}. Our reception will use it to find your details.",
      "Your booking for {date} uses reference {code}. Please review the arrival details.",
      "Please send agenda items by {date}. We'll use them to plan the next team meeting.",
      "Your subscription ends on {date}. Renew for {amount} to keep access afterward.",
      "Please call if you expect to be late for your appointment on {date}. We can hold your slot.",
    ],
    update: [
      "Quick update: the {topic} project is on track, and we expect to finish by {date}.",
      "We've moved the release to {date} to allow more testing. The scope stays the same.",
      "The {topic} pilot went well: 18 of 20 users said they'd keep using it.",
      "Starting {date}, all requests should go through the new portal instead of email.",
      "The first {topic} review is complete. The remaining work is scheduled for {date}.",
      "We've cleared the last blocker on {topic}. The team will hand it over on {date}.",
      "The release is ready for review on {date}. All planned features passed testing.",
      "The release planned for {date} now includes the revised help pages and examples.",
      "During the {topic} pilot, we found a setup issue. A fix is ready to review.",
      "The {topic} pilot is complete. Feedback will shape the next round of changes.",
      "From {date}, a rotating team will review requests at the start of the day.",
      "We'll use a shared checklist from {date}. It covers every stage of the handover.",
      "We've paused the {topic} work until {date} while we await the supplier's reply.",
      "The release rolls out in stages from {date}. We'll start with a few users.",
      "The {topic} pilot shows we need more time for training. We're adjusting the plan.",
      "From {date}, each request will have an owner who sees it through to completion.",
    ],
    personal: [
      "Are you free on {date}? We're thinking of a picnic in the park if the weather holds.",
      "It was so good to see you last week! Let's not wait another year.",
      "I found the recipe I mentioned: it's the one with lemon and roasted {food}.",
      "We finally moved into the new place in {city}. Come and visit soon!",
      "Would you join us for board games on {date}? Bring a favorite if you have one.",
      "I came across a photo from our last visit. It made me want to catch up again!",
      "Do you have that book we talked about? I'd love to borrow it sometime.",
      "The trick to that dish is to roast the {food} before adding the herbs.",
      "I tried the {food} recipe with a little paprika. Want me to send my notes?",
      "Our boxes have arrived in {city}. We're slowly figuring out where everything goes.",
      "We've got a spare room now in {city}. You'd be very welcome to stay.",
      "We're baking on {date}. Would you like to come over and help decorate?",
      "The {food} dish freezes well. I've saved a portion for you to try next time.",
      "We've found a walking route near our new place in {city}. Fancy joining us?",
      "I heard a song from our old road trip today. Do you still have that playlist?",
      "Want to go for a walk on {date}? We could stop for a cup of tea after.",
    ],
  };
  const CLOSERS = ['Let me know if you have any questions.', 'Thanks in advance.', 'Looking forward to hearing from you.',
    'Happy to discuss.', 'Talk soon.', 'Have a great day!', 'Let me know what you think.', '', '',
    'I appreciate your time.', 'Thanks for the update.', 'Please share your thoughts.', 'Your input is welcome.',
    'Thanks for considering it.', 'I hope this helps.', 'Please keep me posted.', 'I appreciate your perspective.',
    'Thanks for taking a look.', 'I value your feedback.'];
  const SIGNOFFS = ['Best,', 'Best regards,', 'Kind regards,', 'Thanks,', 'Cheers,', 'Many thanks,', 'All the best,',
    'Warmly,', 'Regards,', 'Thank you,', '-', 'Sincerely,', 'Take care,', 'Cordially,', 'Respectfully,', 'Yours,',
    'See you soon,', 'Faithfully,', 'Adieu,', 'Over and out,', 'Peace,', 'More soon,', 'Onward,', 'Stay curious,',
    'Signing off,', 'Yours truly,', 'Warm wishes,', 'Fondly,', 'Be well,', 'Until Monday,', 'Stay safe,',
    'With respect,', 'Cheerio,'];
  const FOODS = ['potatoes', 'carrots', 'chickpeas', 'peppers', 'fennel', 'squash', 'cauliflower'];

  const nameOf = (p, k) => (p == null ? null : typeof p === 'string' ? (k === 'first' ? p.split(' ')[0] : p) : p[k] || p.full);

  function emailBody(rng, ctx = {}) {
    const cs = { csplit: ctx.csplit };
    const sender = ctx.sender || (C.personName ? C.personName(rng, cs) : 'Alex');
    const recipient = ctx.recipient || (C.personName ? C.personName(rng, cs) : 'Sam');
    const kind = ctx.kind && BODIES[ctx.kind] ? ctx.kind : rng.pick(EMAIL_KINDS);
    const product = ctx.product || (C.PRODUCTS ? C.pick(rng, C.PRODUCTS, cs) : { name: 'order' });
    const vars = {
      to: nameOf(recipient, 'first'),
      toFull: nameOf(recipient, 'full'),
      from: nameOf(sender, 'full'),
      other: C.personName ? C.personName(rng, cs).full : 'Jordan Lee',
      product: typeof product === 'string' ? product : product.name,
      date: ctx.date || (C.randomDate && C.formatDate
        ? C.formatDate(C.randomDate(rng, { from: '2024-01-01', to: '2026-12-31' }), ctx.locale || 'en-US', rng.pick(['medium', 'long', 'full']))
        : 'Friday'),
      amount: ctx.amount || (C.price ? C.price(rng, typeof product === 'string' ? null : product).text : '$49.00'),
      company: ctx.company || (C.COMPANIES ? C.pick(rng, C.COMPANIES, cs) : 'the company'),
      topic: (ctx.topic || C.pick(rng, TOPICS, cs)).toLowerCase(),
      orderId: C.orderId ? C.orderId(rng) : '#10001',
      invoiceId: C.invoiceId ? C.invoiceId(rng) : 'INV-0001',
      tracking: C.trackingCode ? C.trackingCode(rng) : 'TRK000000000000',
      code: C.alnum(rng, 6),
      city: C.CITIES ? C.pick(rng, C.CITIES, cs).city : 'Lisbon',
      food: rng.pick(FOODS),
    };
    const parts = [];
    parts.push(C.fill(rng.pick(GREETINGS), vars));
    const opener = rng.pick(OPENERS);
    const mains = rng.sample(BODIES[kind], 1).map((t) => C.fill(t, vars));
    const extraGroup = { order: 'support', meeting: 'meeting', update: 'meeting', personal: 'chat', reminder: 'travel' }[kind];
    if (extraGroup && rng.bool(0.4)) mains.push(C.sample(rng, SENTENCE_GROUPS[extraGroup], 1, cs)[0]);
    parts.push([opener, ...mains].filter(Boolean).join(' '));
    const closer = rng.pick(CLOSERS);
    if (closer) parts.push(closer);
    const signoff = rng.pick(SIGNOFFS);
    const sig = rng.bool(0.6) ? nameOf(sender, 'first') : nameOf(sender, 'full');
    const extra = rng.bool(0.3) && C.JOB_TITLES ? `\n${C.pick(rng, C.JOB_TITLES, cs)}, ${vars.company}` : '';
    parts.push(`${signoff}\n${sig}${extra}`);
    return parts.join('\n\n');
  }

  const LINK_TEXTS = L(`
    Pricing
    Contact support
    Terms of Service
    Privacy Policy
    Cookie settings
    About us
    Careers
    Blog
    Help Center
    FAQ
    Sign in
    Create an account
    Forgot your password?
    Learn more
    Read more
    See all reviews
    View details
    Download the 2024 annual report (PDF, 2.4 MB)
    Download the app
    Get started for free
    Start your 14-day trial
    Book a demo
    Talk to sales
    Compare plans
    See what's new
    Release notes
    Documentation
    API reference
    Developer guide
    Status page
    Report a bug
    Request a feature
    Community forum
    Accessibility statement
    Sitemap
    Press kit
    Investor relations
    Our story
    Meet the team
    Locations & hours
    Find a store near you
    Track your order
    Returns & exchanges
    Shipping information
    Size guide
    Gift cards
    Student discount
    Refer a friend, get $10
    Shop all sale items
    New arrivals
    Best sellers
    Back to top
    Back to results
    Previous page
    Next page
    Page 2
    Show 25 more
    Load more comments (14)
    Edit profile
    Manage subscription
    Billing history
    Update payment method
    Change email address
    Notification preferences
    Unsubscribe
    Update your preferences
    View in browser
    Open in new tab
    Copy link
    Share this article
    Print this page
    Email this recipe
    Jump to recipe
    Skip to main content
    Skip navigation
    Read the full story
    Continue reading
    Watch the video (3:42)
    Listen to the episode
    Subscribe to our newsletter
    Follow us
    View all 128 products
    See the full schedule
    Get directions
    Call 555-0142
    Email us
    Chat with an agent
    Leave feedback
    Write a review
    Rate this article
    Was this helpful?
    Still need help?
    Contact the organizer
    Add to calendar (.ics)
    View on map
    Book now
    Check availability
    Reserve a table
    Order online
    See the menu
    Allergen information
    Nutrition facts
    Download the menu (PDF)
    Catering inquiries
    Join the waitlist
    Apply now
    View open positions
    Internship program
    Benefits & perks
    Diversity report 2024
    Sustainability report (PDF, 5.1 MB)
    Modern Slavery Statement
    Imprint
    Legal notice
    Cookie policy
    Do not sell or share my personal information
    Your privacy choices
    Data processing agreement
    Security overview
    Trust center
    System requirements
    Installation guide (v4.2)
    Changelog
    Migration guide: v3 to v4
    Known issues
    Troubleshooting
    Video tutorials
    Webinars
    Case studies
    Customer stories
    Partners
    Become a partner
    Affiliate program
    Integrations
    Marketplace
    Templates
    Examples
    Getting started
    Quick start guide
    Keyboard shortcuts
    What's included?
    Terms & conditions apply
    See offer details
    Price match guarantee
    Financing options
    Warranty information
    Product manual (PDF)
    Safety data sheet
    Recall information
    Spare parts
    Register your product
    Find a retailer
    Wholesale
    Bulk orders
    Request a quote
    Download brochure
    Floor plan (PDF)
    Virtual tour
    Photo gallery (24)
    Upcoming events
    Past events
    Event calendar
    Tickets
    Membership
    Donate
    Volunteer with us
    Annual fund
    Our mission
    Board of directors
    Contact the press office
    Newsroom
    All news
    Archive
    2023
    March 2024
    Older posts
    Newer posts
    Comments (3)
    Reply
    Report this comment
    Permalink
    Edit this page
    View source
    History
    Talk
    Random article
    Recent changes
    Upload file
    Special pages
    Cite this page
    Related articles
    You might also like
    More from this author
    Most popular
    Trending now
    Editor's picks
    Today's deals
    Clearance
    Under $25
    Free shipping on orders over $50
    Shop by category
    Shop by brand
    Women
    Men
    Kids
    Home & Living
    Electronics
    Sports & Outdoors
    Beauty
    Toys & Games
    Books
    Grocery
    Pet supplies
    Garden
    Office
    Automotive
    Health
    Baby
    Tools
    Music
    Manage cookies
    Accept terms
    Read the guidelines
    Code of conduct
    Moderation policy
    Rules
    Community guidelines
    Ask a question
    Browse topics
    Popular tags
    View all categories
    Weather forecast for the weekend
    Traffic updates
    Live scores
    Fixtures and results
    League table
    Opinion
    Letters to the editor
    Obituaries
    Classifieds
    Jobs board
    Real estate listings
    Cars for sale
    Puzzles & crosswords
    Horoscopes
    Recipes
    Travel
    Lifestyle
    Health & fitness
    Science
    Technology
    Business
    Markets
    Politics
    World
    Local
    Sport
    Culture
    Video
    Podcasts
    Newsletters
    E-paper edition
    Contact the newsroom
    Corrections
    Advertise with us
    Accessibility help
    Text-only version
    Change language
    English (UK)
    Deutsch
    Français
    Español
    日本語
    Switch to dark mode
    Log out
    Not you? Switch account
    Need help signing in?
    Resend verification email
    Use a different method
    Use a recovery code
    Trouble with your code?
    Return to sign in
    Terms of Use (updated 12 Jan 2025)
    Open the dashboard →
    View invoice INV-2024-0193
    See 3 more replies
    Show original message
    Download attachment (1.2 MB)
    Open shared folder
    Join meeting
    Copy meeting link
    Dial-in numbers
    Personal information
    Two-step verification
    Active sessions
    Privacy dashboard
    Download your data
    Profile visibility
    Connected accounts
    Your saved items
    Recently viewed
    Purchase history
    Download receipt
    Cancel this order
    Start a return
    Gift receipt
    Delivery options
    Payment methods
    Redeem a gift card
    Enter a discount code
    Delivery and pickup
    Track shipment
    Where is my package?
    Request a replacement
    Return policy
    Packaging information
    Assembly instructions
    Compare these items
    Add to wishlist
    Notify me when available
    Choose a color
    View size chart
    Care instructions
    Reviews by topic
    Newest reviews first
    Ask the seller
    Questions and answers
    Warranty registration
    Extend your warranty
    Visit our showroom
    Store opening times
    Directions by transit
    Parking information
    Make an appointment
    Cancel your booking
    Booking confirmation
    Add a guest
    Special requests
    Group bookings
    Takeout and delivery
    View today's specials
    See the drinks list
    Ingredient details
    Kitchen hours
    Event packages
    Request event pricing
    Venue hire
    Explore the space
    Accessibility details
    Member benefits
    Membership options
    Update contact details
    Manage family members
    Class descriptions
    Register for a class
    Meet the instructors
    Explore learning paths
    Browse all courses
    Enrollment dates
    Check your application
    Scholarship information
    Tuition and fees
    Campus map
    Reserve a study room
    Search the catalog
    Renew borrowed items
    Overdue item policy
    Ask a librarian
    Book a consultation
    Research publications
    Data and methods
    Explore the collection
    Browse by subject
    Object details
    Exhibition guide
    Audio guide
    Artist biographies
    Upcoming exhibitions
    Past exhibitions archive
    School visit information
    Ticketing information
    Donate an object
    Support the collection
    Download the gallery map
    Branch locations
    Community programs
    Room rental information
    Request a room booking
    Neighborhood resources
    Find a service provider
    Volunteer opportunities
    Sign up for a shift
    Ways to give
    Make a one-time gift
    Set up monthly giving
    Fundraising events
    Grant application guide
    Eligibility requirements
    Application deadlines
    Reporting requirements
    Request a transcript
    Browse saved searches
    Create a reading list
    Share with a colleague
    Daily digest settings
    Open the help guide
    Print-friendly view
    Bulk item pickup
    Utility outage map
    Sign up for text alerts
    Update alert preferences
    Transit service changes
    Fare information
    Accessibility on transit
    Lost property form
    Carpool matching
    Trip planner
    Terminal maps
    Flight status
    Suggested itineraries
    Getting around town
    Neighborhood guide
    Travel insurance details
    Weather by month
    Public holiday calendar
    Currency information
    Download offline maps
    Share your itinerary
    Add to trip planner
    View on a larger map
    Scenic routes
    Trail conditions
    Download trail map
    Park rules and permits
    Reserve a campsite
    Cabin information
    Beach conditions
    Pool schedule
    Facility rental request
    Court availability
    League schedules
    Player standings
    Scoreboard archive
    Match highlights
    Replay the final
    Rules of play
    Coach directory
    Venue entry policy
    Find seats
    Parking pass information
    Transit to the arena
    Merchandise guide
    Watch live coverage
    Full interview
    Behind the scenes
    Explore the timeline
    View the infographic
    Download the dataset
    Sources and references
    Fact check this story
    Suggest a topic
    Author archive
    Gift a subscription
    Digital access options
    Student edition
    Explore special reports
    The year in review
    Community announcements
    Public notice archive
    Browse job categories
    Upload your résumé
    Employer information
    Our hiring process
    Pitch a story
    Media contact directory
    Download press images
    Company overview
    Corporate governance
    Financial statements
    Quarterly results
    Annual meeting details
    Whistleblower resources
    Supplier standards
    Partner resources
    Technology alliances
    Reseller information
    Developer portal
    Authentication guide
    Rate limits
    SDK downloads
    Webhook documentation
    Integration status
    Request access
    View your open tickets
    Service health history
    Incident reports
    Report a vulnerability
    Encryption overview
    Compliance documentation
    Terms for developers
    Third-party notices
    Account security
    Sign-in activity
    Backup email address
    Password requirements
    Recovery options
    Session history
    Close all sessions
    Choose a profile photo
    Public profile preview
    Saved addresses
    Time zone settings
    Keyboard navigation help
    Screen reader support
    Text size options
    Download account archive
    Request account deletion
    Invite a collaborator
    Shared access settings
    Set up an authenticator
    Review privacy controls
    Data retention details
    Change your username
    Account recovery guide
    Invoices and receipts
    Payment confirmation
    Tax document archive
    Download order summary
    Request a paper receipt
    Redeem store credit
    Estimate delivery date
    Customs information
    Choose a pickup location
    Delivery area checker
    Proof of delivery
    Report a missing parcel
    Exchange an item
    Print a return label
    Refund status
    Product dimensions
    Care and cleaning guide
    Product comparison chart
    Recently restocked items
    Clear search filters
    Filter by availability
    Featured collections
    Limited-time bundles
    Gift ideas by occasion
    Add gift wrapping
    Download gift voucher
    Redeem voucher online
    Product recall notices
    Assembly video
    Compatibility checker
    Choose a seating area
    House rules for visitors
    Last entry times
    Bag policy
    Quiet space information
    Family facilities
    Group visit arrangements
    Private tour options
    Meet your tour guide
    Download visitor map
    Food and drink policy
    Lost and found contact
    Venue hire packages
    Check your reservation
    Late arrival information
    Dining options on site
    View the garden map
    Learning objectives
    Course materials
    Practice exercises
    Course completion record
    Request a certificate
    Join a study group
    Assignment calendar
    Language level guide
    Transfer credit policy
    Graduation requirements
    Reserve a media booth
    Manuscript finding aid
    Image licensing request
    Conservation work update
    Curator's selection
    Register your interest
    Speaker biographies
    Conference travel guide
    Browse volunteer roles
    Volunteer handbook
    Swap a scheduled shift
    Record volunteer hours
    Apply for a garden plot
    Watering rota
    Native planting guide
    Current trail closures
    Trail difficulty ratings
    Wildlife viewing tips
    Leave no trace guidance
    Fishing access points
    Bike route conditions
    Ski trail report
    Lift operating hours
    Stargazing locations
    Scenic overlook guide
    Team roster and profiles
    League rules explained
    Tournament draw
    Spectator information
    Season pass options
    Browse the audio library
    Meet the production team
    Suggest a guest
    Reading group resources
    Author event schedule
    Library edition details
    Editorial standards
    Send a document securely
    Contact a section editor
    Browse the weekly digest
    Manage topic alerts
    Listen to this article
    Copy citation
    Browse by author name
    Find your local edition
    Watch the full briefing
    Explore the data story
    Leadership biographies
    Board meeting calendar
    Governance policies
    Procurement calendar
    Media usage guidelines
    Workplace culture guide
    Create an access token
    Manage application keys
    SDK compatibility table
    Test data reference
    Sample payload library
    Pagination guide
    Deprecation notices
    Webhook event catalog
    Rotate a secret key
    Share a code example
    Configure team roles
    Data residency options
    Manage consent settings
    Privacy request progress
    View all help topics
    Check a support request
    Ask the community
    New user orientation
    Support hours by region
    Accessibility services
    Account activity log
    Add to compare list
    Address book
    Advanced search
    Analyze your usage
    Archive index
    Ask a subject specialist
    Author guidelines
    Batch download options
    Become a mentor
    Billing questions
    Boarding pass details
    Book a private lesson
    Browse open data
    Browse staff directories
    Building access hours
    Building directory
    Campus dining hours
    Change account owner
    Change display name
    Change mailing address
    Check current wait times
    Check room capacity
    Choose a delivery window
    Claim a lost item
    Clear saved filters
    Climate action plan
    Collection care tips
    Community meeting notes
    Compare available dates
    Compare service levels
    Construction updates
    Contact the archive team
    Contact the local office
    Content reuse request
    Course calendar
    Course refund policy
    Create an event listing
    Create custom alerts
    Current exhibitions
    Current road conditions
    Customize your home page
    Daily opening hours
    Data export options
    Database coverage dates
    Department contacts
    Design resources
    Dining room reservations
    Dispute a charge
    Display preferences
    Download a blank form
    Download a contact card
    Download a transcript
    Email delivery settings
    End of year summary
    Event listing guidelines
    Explore our facilities
    Export your bookmarks
    Facility usage rules
    Family account settings
    File a service complaint
    Find a quiet work area
    Find a public restroom
    Find an open study space
    Find nearby picnic areas
    First time visitor guide
    Food pantry locations
    Get a custom estimate
    Get a reminder by text
    Gift acceptance policy
    Group discount details
    How we use your feedback
    Household waste guide
    Inclusion statement
    Installment plan details
    Internal search tips
    Join the alumni list
    Join the project team
    Keep me signed in
    Last updated documents
    Learning support options
    Library card application
    License and reuse terms
    Local maker directory
    Manage saved searches
    Materials request form
    Meeting room equipment
    Monthly usage report
    New collection arrivals
    Notice of planned works
    Open a service case
    Operating calendar
    Order a replacement card
    Our evaluation approach
    Payment receipt lookup
    Photo credit information
    Plan a group outing
    Plan a research visit
    Preferred contact method
    Press inquiry form
    Public art inventory
    Publish your research
    Reading room regulations
    Renew a library card
    Request a certified copy
    Request an item transfer
    Request building access
    Request digital access
    Request equipment repair
    Request meeting notes
    Request project records
    Research ethics guide
    Researcher registration
    Reserve a locker
    Reserve a parking space
    Room setup options
    Search by neighborhood
    Seasonal access updates
    Section editor directory
    Select a billing contact
    Service area boundaries
    Service request history
    Share access with a team
    Sign up for orientation
    Site visit preparation
    Space use application
    Special event calendar
    Special hours notice
    Survey results archive
    Switch to compact view
    Terms for room use
    Text alert sign-up
    The project in brief
    The research team
    This week's highlights
    Timetable change notices
    Transfer a booking
    Update billing address
    Venue access timetable
    Visit planning checklist
    Volunteer training dates
    Ways to participate
    Webinar materials
    What we collect and why
    Workspace booking guide
    Your account overview
    Your event submissions
    Account setup checklist
    Add a secondary email
    Add a shipping note
    Adjust text spacing
    Annual report highlights
    Ask about a group visit
    Audio player settings
    Available formats
    Back issues by year
    Browse by collection
    Browse by difficulty
    Browse by format
    Browse by location
    Browse by season
    Building floor plans
    Call for proposals
    Campus safety resources
    Caption preferences
    Check baggage allowances
    Check-in instructions
    Claim your digital copy
    Clear your watch history
    Close my profile
    Collection highlights
    Compare route options
    Contributor profile
    Course prerequisites
    Create a family profile
    Create a public event
    Create an email filter
    Current service alerts
    Data dictionary
    Data quality notes
    Day pass information
    Delete a saved address
    Dining dietary options
    Download a coloring page
    Download a consent form
    Download a CSV summary
    Download a sample lesson
    Download a visit planner
    Early entry information
    Edit your event details
    Emergency contact form
    Event exhibitor map
    Explore local landmarks
    Export calendar entries
    Family visit guide
    Find a class by level
    Find a community center
    Find an item by title
    Find a volunteer project
    Get help with captions
    Guide to citing images
    Guide to event check-in
    Guide to online learning
    Guide to public records
    Historical map index
    Import a calendar file
    Information for teachers
    Instructor resources
    Interactive venue map
    Join a neighborhood walk
    Language access plan
    Late fee schedule
    Lesson plan library
    Library hours by branch
    Local history timeline
    Map key and symbols
    Materials fee schedule
    Meeting agenda archive
    Meeting minutes index
    Member directory search
    Methods note
    Monthly program booklet
    Museum object glossary
    Neighborhood contacts
    Notice of data use
    Online event etiquette
    Open data license
    Order a printed catalog
    Outdoor event checklist
    Partner application form
    Photo collection index
    Podcast episode archive
    Post-event materials
    Preferred name settings
    Prepare a class visit
    Prepare a group booking
    Reading list by topic
    Register a new device
    Request a caption file
    Sample assessment rubric
    Sample budget worksheet
    Sample event invitation
    Sample lesson outline
    Sample permission letter
    Sample project timeline
    Search the media archive
    Share a saved route
    Short course catalogue
    Start a new application
    Student handbook
    Table of contents
    The archive in numbers
    The meeting room guide
    The route in detail
    The visitor code
    Trip preparation guide
    Venue capacity by room
    Video caption transcript
    Find an available tutor
  `);

  const POST_TEXTS = L(`
    Just finished my first 10K in under an hour! Legs are jelly but worth it. #running #personalbest
    Anyone know a good place for brunch near Union Square? Asking for a very hungry friend.
    Big thanks to @MarisolR for the help with the move today. I owe you pizza.
    Hot take: pineapple belongs on pizza. Fight me. #pizzadebate
    New blog post: 7 things I learned from building a garden on a 3 m balcony. Link in bio.
    Our team just shipped dark mode! Took longer than planned, but it's finally here. #release
    Rain again in Glasgow. Shocking, I know.
    Reading "The Salt Road" on the train this week and I can't put it down. #bookclub
    Reminder that the library has free museum passes you can borrow. #protip
    Three years at Copperleaf Studio today. Grateful for this team. #workanniversary
    Who else is watching the match tonight? Kickoff at 20:45. #football
    The sunrise over the harbor this morning was unreal. #nofilter
    Finally fixed the squeaky door. I feel like an engineer now.
    Quick poll: tea or coffee first thing in the morning?
    Looking for recommendations: best budget mechanical keyboard for coding?
    Day 42 of learning Spanish. Today I ordered lunch without pointing at the menu. Progress! #languagelearning
    Our bakery turns 5 this weekend! Free cookie with every coffee on Saturday. #smallbusiness
    PSA: the 7:52 train is cancelled, take the 8:10 instead.
    Congrats to @kenji_t on the new job, well deserved!
    Made sourdough for the first time. It's flat, but it's mine. #baking
    If you see a lost grey tabby near Pine Street, his name is Biscuit and he is very shy.
    Two weeks without social media taught me I check my phone 80 times a day. Oops.
    The new bike lane on Bridge Street is a game changer for my commute. #cycling
    Volunteered at the food bank today. If you have a free Saturday, they need help. #community
    Can't believe it's already October. Where did the summer go?
    Just booked tickets to Lisbon for spring! Any must-see spots? #travel
    Proud of my daughter for her first piano recital tonight.
    My plants survived the heatwave. Barely, but they did. #plantparent
    The conference keynote this morning was full of great ideas. Notes coming soon. #techconf
    Pro tip: freeze leftover herbs in olive oil in an ice cube tray.
    Somebody please explain why my code works only on Fridays.
    Today's commute soundtrack: 90s hip hop and rain. Perfect combination.
    We're hiring! Two backend engineers, remote-friendly. DM me for details. #hiring
    Throwback to that hike in the Alps last summer. Can't wait to go back. #tbt
    It's officially soup season. #autumn
    Tried the new ramen place near the station. 10/10, would slurp again.
    Raising money for the children's hospital with a 24-hour gaming stream this weekend. #charity
    Reminder: clocks go back this Sunday. Extra hour of sleep!
    Spent the afternoon fixing bikes at the repair cafe. So satisfying.
    The museum's late-night opening on Fridays is the city's best-kept secret.
    Hello from Nairobi! Workshop day 1 done, great energy in the room.
    If anyone has a spare ladder I could borrow this weekend, I'd be grateful.
    Our cat has decided the laptop is her bed now. Working from the couch, apparently.
    Finally learned how to use keyboard shortcuts properly. Why didn't I do this years ago?
    Thank you all for 1,000 followers! Didn't expect anyone to care about my bread photos.
    The farmers market had the best strawberries today. Summer is here.
    Who's coming to the street party on Saturday? Bring a chair and a dish to share.
    Small win: inbox zero for the first time this year. #productivity
    That moment when the build passes on the first try. Suspicious.
    Just donated blood for the 10th time. It takes 15 minutes, please consider it.
    Happy Friday! What are your weekend plans?
    Anyone else's internet down in the Eastbrook area?
    Good luck to everyone running the marathon tomorrow! #marathon
    I tried a 4-day work week this month. Here's what happened (thread).
    Today I learned that octopuses have three hearts. Science is wild.
    Our team retro had zero complaints about meetings for once. A miracle.
    Lunch break walk in the park. 15 minutes outside makes a huge difference.
    Can we talk about how good the new season of that baking show is?
    My grandmother's lentil soup recipe, finally written down. Sharing in the comments.
    The power is back! Thanks to the crews who worked through the night.
    Anyone have tips for getting a toddler to sleep past 5 am? Asking for myself.
    Just got my first pull request merged into an open source project! #opensource
    The view from the ferry this morning made up for the 6 am alarm.
    Cleaned out the garage and found my old skateboard. Still got it (sort of).
    Our community fridge needs restocking. Fresh fruit and bread especially welcome.
    Happy launch day to the team at @bluepeaklabs!
    Nothing beats a rainy Sunday with a good book and too much tea.
    The kids built a cardboard castle that is now bigger than our living room.
    Took the long way home today just to see the cherry blossoms. #spring
    Any recommendations for a reliable plumber? Our kitchen sink has given up.
    Every year I say I'll start my holiday shopping early. Every year I don't.
    Morning run along the river: 6.2 km, 2 herons, 1 very friendly dog.
    Unpopular opinion: open-plan offices are terrible for focus.
    Thank you @HarborPineOutfitters for replacing my broken tent pole for free!
    Just finished a 1000-piece puzzle. It took three weeks and a lot of patience.
    New photo series: the doors of the old town. #photography
    The local choir is looking for tenors. No audition, just enthusiasm.
    Our team won the pub quiz! Name: "Les Quizerables". I'm not sorry.
    I finally understand what an API is. Thanks @priya_codes for the patient explanation.
    Snow day! The kids are thrilled. I'm working from the kitchen table.
    Remember to check on your elderly neighbors during the cold snap.
    Started a new sketchbook today. Page 1 is always the scariest.
    The best part of traveling is coming home to your own bed.
    5 years sober today. One day at a time.
    Our startup just hit 10,000 users. Two years ago it was just me and a laptop. #startup
    If your package says "delivered" but it isn't there, check with neighbors first. Mine was next door.
    Tomorrow's forecast: 34 °C. Stay hydrated, everyone. #heatwave
    Built a bird feeder with my son this weekend. Two sparrows so far!
    Saw the northern lights last night for the first time. Speechless. #aurora
    Meal prep Sunday: five lunches, zero motivation, one podcast.
    Our dog graduated from puppy school today. He was the worst in class, but we're proud.
    This coffee shop plays only jazz and has great Wi-Fi. My new office.
    Just signed the lease on our first apartment! #newhome
    The repair cafe fixed my 20-year-old radio. Long live repairs!
    Hosting a book swap at the library next Saturday. Bring one, take one.
    I've been told my houseplants need "less love". Ouch.
    Tip for remote workers: get dressed every morning. It actually helps.
    Our school's robotics team is going to nationals! #proudteacher
    Happy 90th birthday to my grandpa, who still beats me at chess.
    Taking a social media break for a couple of weeks. See you in November.
    Finally got around to framing my travel photos. The hallway looks great.
    Anyone else think autumn is the best season? #fall
    Ordered a "small" pizza. It was the size of a car tire. No regrets.
    Thanks to everyone who came out for the beach clean-up. 1.8 tonnes collected! #cleanup
    Spent the morning teaching my mum how to use video calls. Success!
    New recipe on the blog: one-pan lemon chicken with fennel. #easydinner
    Tried bouldering for the first time. My arms have filed a complaint.
    The new library branch is beautiful. Free coworking space too!
    If you're in Lisbon next week, come say hi at our booth at the design fair.
    Our neighborhood group chat has reached peak drama over parking. Popcorn ready.
    Ran into an old friend at the airport after 12 years. Small world.
    Shout-out to the bus driver who waited for me this morning. You're a hero.
    It's my last day at the company today. Thank you for an amazing 6 years. #newchapter
    First day at the new job! Nervous but excited. #firstday
    The secret to good rice is rinsing it. That's it. That's the post.
    Anyone know when the swimming pool reopens after the renovation?
    Our garden produced exactly four tomatoes this year. Delicious, though.
    Reading about the new telescope images. The universe is huge and I am small.
    Today's goal: drink more water than coffee. Currently losing.
    Weekend project: repainting the kitchen. Color name: "Quiet Moss". #diy
    To the person who returned my wallet with everything inside: thank you!
    Happy Pride to all my friends and colleagues!
    I've run every day for 100 days. Rest day tomorrow, I promise.
    Couldn't decide between two colors, so I bought both. Classic me.
    Our office dog Pepper is officially Employee of the Month.
    Highlights from the jazz festival: the trumpet solo at 11 pm was unforgettable. #jazz
    Hot chocolate weather has arrived.
    Morning reminder: you don't have to finish everything today.
    Learning to knit. Currently making a scarf that is mostly holes. #knitting
    Big news: we're opening a second shop in Porto this summer!
    The cherry tree in our yard is in full bloom. Best week of the year.
    Signed up for a pottery class. My first bowl looks like a hat.
    Finally visited the planetarium. Highly recommend the evening show.
    Just realized I've had the same phone case for 6 years. Loyalty.
    Note to self: back up your files. Today was a hard lesson.
    Celebrating 10 years of marriage today with the best person I know.
    Our local football club is top of the league for the first time since 1998! #upthetown
    Everyone in this cafe is on a laptop. Including me. #remotework
    Reviewing my year: 24 books read, 3 countries visited, 1 sourdough starter kept alive.
    Thanks to the nurses at Riverstone Clinic for taking such good care of my dad.
    Here's a photo of a duck wearing a tiny hat. You're welcome.
    The first snowfall of the year always feels magical.
    Fixed my bike chain with nothing but a video tutorial and stubbornness.
    Happy New Year! Wishing everyone health and a little more sleep in 2025.
    Today's small joy: the bakery remembered my order without me saying a word.
    Our street finally got speed bumps after two years of petitions. Democracy works! #localnews
    Packed my bag for the 6 am flight to Seoul and forgot my charger. Classic.
    The farmers at the Saturday market say this is the best apple harvest in a decade. #autumn
    Shout-out to @tidewater_vet for squeezing our sick puppy in at 7 pm. Lifesavers.
    Week 3 of the couch-to-5K plan and I can now run for 8 minutes straight. Small steps!
    Workshop recap: 40 people, 12 prototypes and way too much coffee. #designsprint
    Watching the storm roll in over the bay from my window. Stay safe out there.
    Library haul this week: two mysteries, a cookbook and a book about bridges. #amreading
    Does anyone else rename their files "final_final_v3"? Just me? #officelife
    The new tram line cut my commute from 50 minutes to 20. Worth every month of roadworks.
    First harvest from the balcony garden: 6 cherry tomatoes and one very proud gardener.
    The first warm evening of the year and everyone on our street is eating dinner outside.
    Found a tiny independent bookshop tucked behind the market. Lost an hour in there.
    My new desk plant has one leaf and the confidence of a whole forest.
    The last ferry home was quiet except for one very determined seagull.
    A stranger complimented my scarf and now I'm thinking about it all day.
    Made pancakes for dinner because the week needed a plot twist.
    The community garden has a waiting list, but they let me water the seedlings today.
    I keep a notebook of good shop names I see on walks. Today's winner: The Winding Shelf.
    Took the scenic route to work and arrived in a much better mood.
    Does anyone have a favorite rainy-day board game for a group of six?
    My nephew taught me a card trick and refused to reveal the secret. Fair enough.
    First swim of the season. The water was cold enough to reset my entire personality.
    The corner florist had a bucket of wildflowers for a few coins. Instant kitchen upgrade.
    Spent Saturday sorting the recipe cards my aunt left me. Her handwriting is a puzzle.
    The neighborhood cats have formed a committee and meet on the wall at 4 pm.
    Two hours into a train delay and the snack cart is now the most popular place in town.
    I started carrying a sketchbook on walks. Mostly drawing benches so far.
    We made a blanket fort for movie night and accidentally improved the living room.
    The new public fountain is back on. Children everywhere are delighted.
    Ate lunch in the botanical garden and forgot to check my phone once.
    My first attempt at making jam set perfectly. The kitchen is still sticky.
    The clouds looked like a whole mountain range on the walk home.
    Today I learned our town has a building shaped like a ship. How did I miss that?
    The choir rehearsal next door sounds lovely through the open windows.
    Took my old film camera out for the first time in years. No idea what I captured.
    The best seat on the bus is the one facing backward. I will not be taking questions.
    My niece has decided every puddle is a small lake. She's not wrong.
    New habit: leaving ten minutes early so I can walk the last stop.
    We finally found the source of the mystery tapping in the attic. A loose shutter.
    The park was full of people flying kites this afternoon. The sky looked busy.
    Made a playlist for cleaning and accidentally danced through the whole kitchen.
    Is there a good way to keep basil alive indoors, or is it just here for a short visit?
    The secondhand shop had a box of old postcards. I bought one from 1978 with no message.
    Our local history group found a time capsule under the old school steps.
    The first coffee after a long weekend always tastes especially good.
    I put fresh sheets on the bed and now I have no plans to leave it.
    The bakery's new savory buns are dangerously good. This is a public service announcement.
    Our block's annual plant swap is next Sunday. Bring a cutting, take a cutting.
    The night market had handmade lamps, warm bread and a surprisingly good juggling act.
    I finally learned the names of the trees on my street. Hello, plane trees.
    There's a bench at the top of the hill with the best view of the rooftops.
    I packed lunch in the wrong container and accidentally brought an entire bowl of grapes.
    The kids next door are building a cardboard spaceship. Mission control is very serious.
    Picked up litter along the canal for half an hour. The water looks a little brighter now.
    My first attempt at watercolor clouds looks like several soft potatoes. Progress.
    The farmers market had a musician playing accordion beside the peaches. Perfect Saturday.
    Our old neighborhood map has a street on it that no longer exists. Now I want to know why.
    Can a person own too many mugs? Asking from behind a cupboard full of mugs.
    The laundromat has a shelf of books to borrow while you wait. Found a mystery novel there.
    We watched the moon rise over the rooftops from the apartment stairs.
    A very enthusiastic dog greeted me at the bus stop and improved the entire commute.
    The little footbridge in the park has finally reopened. My walking loop is complete again.
    This morning's fog made the familiar street feel like a place in a story.
    The neighborhood noticeboard has a flyer for a free accordion lesson. Tempting.
    Went to a craft fair and came home with a handmade bowl and no explanation for it.
    The train window turned into a perfect mirror after dark. Quiet ride, good playlist.
    Our street's longest-running debate is whether the big tree is an elm or a beech.
    Made a tiny herb garden from chipped teacups. Mint is already trying to take over.
    The beach was empty except for a dog carrying a stick almost as long as itself.
    Finally finished the jigsaw puzzle on the kitchen table. We can eat there again.
    The old clock in the station is five minutes slow, and somehow that feels comforting.
    I like the quiet ten minutes before the school bell when the whole playground is empty.
    A neighbor left a bag of pears by our door with a note that said, "Too many pears."
    The best part of the picnic was the blanket that did not blow away.
    Tonight's dinner was assembled entirely from leftovers and a little imagination.
    I saw a fox crossing the empty football field just before sunrise.
    Three generations at the same table, all arguing about the correct way to fold a map.
    The post office has a very patient dog who waits outside every afternoon.
    Bought a packet of seeds with no plan for where they'll go. Spring will sort it out.
    The rain stopped just long enough for everyone at the outdoor concert to cheer.
    I have a new favorite walking route and it goes past a very friendly bakery window.
    My headphones died halfway through the commute. Turns out the city has its own soundtrack.
    We planted a row of sunflowers by the fence. The tallest one is already taller than me.
    Saw a handwritten sign that said "Free lemons" and came home with a whole bag.
    The town hall steps are the best place to sit with lunch when the weather cooperates.
    Does anyone know a gentle way to teach a dog to stop barking at its own reflection?
    I finally used the sewing machine I inherited. One cushion cover, several dramatic pauses.
    A kind stranger held the umbrella over both of us while we waited for the crossing light.
    Tonight the apartment smells like toasted sesame and the windows are all fogged up.
    The weekend flea market is a treasure hunt where I never know what I'm looking for.
    My dad sent me a photo of a very lopsided birdhouse he made. The birds have moved in.
    The school garden's first radishes are ready. The students are very proud of them.
    We took the wrong trail and found a waterfall we hadn't planned to see.
    A handwritten menu outside a small cafe convinced me to change my lunch plans.
    Finally learned to whistle with two fingers. The dog is unimpressed.
    The old bridge at dusk looks like it belongs in a painting.
    The library's seed exchange is such a lovely idea. I brought marigolds and took beans.
    Our kitchen timer has a loud bell and an even louder opinion about baking.
    The first strawberry from the garden went straight to the person who planted it.
    Saw a kid teaching their grandparent how to use a skateboard. Excellent teamwork.
    Cloud watching from the roof is my new favorite way to spend a lunch break.
    There are tiny blue tiles along the old alley. I never noticed them before.
    The community orchestra's open rehearsal was warm, slightly chaotic and wonderful.
    Our camping trip had one mosquito, five card games and a spectacular sunrise.
    The little bakery around the corner has started selling yesterday's bread at half price.
    I spent the afternoon making paper boats and testing them in the gutter after the rain.
    A stranger on the tram recommended a walking trail, and now I owe them a thank-you note.
    My desk is covered in sticky notes, but somehow I know where everything is.
    Just watched a spider rebuild its web outside the kitchen window. Impressive engineering.
    The house was quiet for a whole hour and I used it to listen to the rain.
    Our block's potluck had six casseroles and not a single duplicate dessert.
    The climbing roses have reached the balcony rail. I think they're trying to visit.
    The new benches by the river are already popular with lunch-break readers.
    My little cousin asked if the moon follows our car. I still wonder about that too.
    We gathered fallen leaves for a collage and the table is now a colorful mess.
    I made soup from the vegetables left in the fridge. Nothing matched and it was excellent.
    The street musician played the same melody as my favorite lullaby. Had to stop and listen.
    The old greenhouse behind the school is being turned into a place for workshops.
    Woke up early to watch the city buses begin their routes. Quiet streets, bright windows.
    The river path is full of new ducklings. Everyone walking by is moving very slowly.
    A very small child waved at the bus and every passenger waved back.
    I got caught in the rain without a coat, then found a dry awning and a good conversation.
    Weekend plan: visit the little lighthouse and count how many shades of blue the water has.
    The neighborhood repair group fixed my wobbly chair in under ten minutes.
    A bowl of oranges on the table makes the whole kitchen feel more cheerful.
    I tried to teach myself a song on the ukulele. The neighbors are being very kind about it.
    Our local pool has a quiet hour for people who prefer a slower swim. Love that idea.
    Watched the sunset from the top floor of the car park. Unexpectedly excellent view.
    The old market hall is full of echoes before it opens in the morning.
    Today I found a good use for the jar collection: homemade pickles for everyone.
    My morning walk now includes a stop to say hello to the same old oak tree.
    We built a shelf together and only had to take it apart twice.
    The ferry captain pointed out seals along the shore. The whole boat went silent.
    I found a note in a library book that just said, "This was my favorite chapter."
    Our neighborhood is collecting clean jars for the school art room. I have plenty.
    The sunset turned the windows across the street pink for a few minutes.
    Finally made it to the tiny island at the end of the walking trail. Worth the muddy shoes.
    A new walking path opened through the meadow. The wildflowers are already everywhere.
    We made a family calendar with everyone's birthdays and a few made-up holidays.
    There was a double rainbow over the sports field after practice. No one wanted to go home.
    Bought a secondhand armchair that needs work. The project has officially begun.
    The tiny park behind the station is full of people eating lunch in the sun.
    I saved the last slice of cake for tomorrow and felt very responsible.
    The village noticeboard is a better source of weekend plans than any app.
    The first warm breeze came through the window while I was making tea. That'll do.
    The community hall has a piano in the lobby, and someone always seems to be playing it.
    The little bakery on Alder Lane puts a bowl of water out for the neighborhood dogs.
    Spent the morning at the allotment learning which weeds are actually useful.
    Our apartment building now has a shelf for parcels that arrive when nobody's home.
    A tiny brass key turned up in the pocket of my winter coat. Mystery for another day.
    The old theater is showing silent films with a pianist this month. Going Friday.
    I took the stairs instead of the lift and discovered a window overlooking the rooftops.
    A handwritten note at the bus stop says the wild plum tree is ripe. Taking a bag tomorrow.
    Made a tiny doorstop from a leftover piece of fabric. It is doing excellent work.
    The river looked silver this evening, and the geese seemed to know it.
    Our family tried a new board game and spent half the time reading the rules aloud.
    I found a quiet table in the back of the cafe and finished the whole chapter.
    The school art show had a papier-mache whale hanging from the ceiling. Incredible work.
    The clockmaker down the lane lets children watch while he repairs old watches.
    A robin has been visiting the windowsill every morning. I think we have an arrangement.
    I brought a thermos to the park and stayed long enough to watch the light change.
    The local walking map has a path marked through a field of blue flowers. Weekend sorted.
    We made dumplings together and accidentally turned dinner into a three-hour event.
    Found a smooth piece of sea glass on the beach, pale green and almost perfectly round.
    The new crossing has a button that plays a little tune when the lights change.
    The bookshop window has a display of stories set on islands. A very tempting collection.
    We watched a family of swans cross the canal, one very serious cygnet at the back.
    A fresh coat of paint has made the stairwell feel twice as bright.
    I found a recipe tucked into an old cookbook, written in pencil and measured in teacups.
    The village path passes a field where the sheep always look mildly surprised.
    The neighborhood cinema has a shelf of blankets for chilly evening screenings.
    I learned how to mend a sock with a wooden mushroom. Much more satisfying than expected.
    The market stall had a basket of unusual pears, each one shaped like a tiny lamp.
    There's a small observatory on the hill with public viewing after sunset this week.
    Took a different bus home and ended up beside a park I had never seen before.
    The cafe's chalkboard has a new joke every morning. Today's made the barista laugh too.
    Our garden bench wobbles less after a little help from a neighbor and a spare screw.
    The town's old water tower is open for visitors this weekend. The view should be lovely.
    The first page of my travel journal is just a map and a coffee stain. Good start.
    I finally found the missing lid for the big glass jar. A small household victory.
    We took the ferry at sunset and watched the harbor lights come on one by one.
    Someone left a tiny knitted hat on the statue in the square. It fits perfectly.
    The old bakery sign still swings in the wind, even though the shop closed years ago.
    My neighbor lent me a hand drill and gave me a ten-minute lesson on using it safely.
    The first batch of crackers came out uneven, but every single one disappeared.
    I spent lunch sketching the staircase in the old station. It has a lovely curve.
    The allotment group is sharing extra courgettes again. I may need a larger basket.
    We found a tiny pottery studio above the florist and watched the wheel turn for a while.
    The lake path is muddy today, but the ducks seem pleased with the weather.
    My nephew says the clouds look like a parade of elephants. I can see it now.
    Someone painted a bright blue door on the little shed by the playing field.
    I swapped a few herbs with a neighbor and came home with lemon balm and good advice.
    The train station has a new mural showing the town as it looked a hundred years ago.
    I heard a brass band practicing in the park and followed the music without meaning to.
    The old map in the cafe shows a footpath that disappeared before I was born.
    Trying to learn the names of wildflowers on my usual walk. I know three so far.
    A tiny library opened in the former phone box. It already has a queue of books waiting.
    We made a paper star garland for the kitchen and used every scrap of colored paper.
    The canal boats are decorated for the season, each one brighter than the last.
    The corner grocer gave me a paper bag of bruised peaches for making a crumble.
    I sat by the fountain and watched the pigeons negotiate over one very small crumb.
    My old raincoat finally has a new button. It feels ready for another decade.
    The park has a new table for chess, and someone left the pieces neatly arranged.
    We followed a sign for a viewpoint and found a bench facing the whole valley.
    The little bakery makes a different loaf for the weekend. This one has toasted seeds.
    A neighbor's window box is full of tiny yellow flowers. I need to ask what they are.
    Spent the afternoon putting labels on the jars in the pantry. Future me says thanks.
    The community hall is hosting a repair evening for lamps and small appliances.
    A sudden gust sent all the leaves spinning down the street like a parade.
    The library's quiet room has a view of the clock tower and the occasional passing pigeon.
    I made a batch of orange marmalade and gave most of it away before it had cooled.
    The school greenhouse is growing tiny cucumbers on a trellis made from old string.
    Our local craft group is making decorations from fallen branches and scraps of wool.
    The little bridge by the mill is a good place to stop and listen to the water.
    I took a book to the laundrette and finished it before the last cycle was done.
    The market has a stall selling secondhand jigsaw puzzles, all with their pieces counted.
    A bright red kite got stuck in a tree, and three strangers worked together to reach it.
    There's a painted bench at the end of the pier with a name carved into the back.
    The neighborhood has started a monthly soup lunch. Everyone brings a bowl and a spoon.
    I walked past the school at lunchtime and heard a whole playground singing in unison.
    The old bakery's tiled floor is still beautiful, even after all these years.
    A friend showed me how to make a simple paper envelope from a page in an old magazine.
    The community garden has a new sign made from reclaimed wood. It looks right at home.
    The ferry was late, so we watched the gulls circle the fishing boats.
    I finally put the family recipes into one folder. The flour marks are part of the design.
    The small museum has a collection of keys with no labels. I want to know every story.
    The new footpath follows the edge of the orchard. The trees are just beginning to bud.
    Our street's community noticeboard has a recipe for pear cake pinned beside the lost keys.
    The garden shed door sticks unless you lift it slightly. We all know the trick now.
    At the coast today, the tide left perfect ripples in the wet sand.
    The after-school club made a miniature town from cereal boxes. It has a very busy harbor.
    I tried making fresh pasta with a rolling pin and learned a lot about patience.
    Our hallway smells like cinnamon because someone on the floor is baking again.
    I found a wooden ruler in a drawer with the height marks from my childhood on it.
    The garden birds have learned exactly when I put out breakfast. They are punctual.
    We visited the open studios and came home with a small print of the lighthouse.
    The village bakery has a window seat just wide enough for one person and a newspaper.
    My first attempt at a knitted hat is lopsided, but it is warm and technically wearable.
    The park's new pond has stepping stones and a family of frogs already claimed the corner.
    We hosted a neighborhood puzzle afternoon. The sky section took most of the table.
    The little ferry kiosk now sells postcards drawn by local schoolchildren.
    A patch of sun landed on my desk just as I sat down. Excellent timing.
    I found a book of pressed leaves at the secondhand shop. Every page has a different shape.
    Our family made a map of all the places we want to walk this year.
    A neighbor's lemon tree has more fruit than they can use, so the whole building got a bag.
    We made an enormous pot of vegetable stew and filled every spare container in the kitchen.
    The first daffodil opened beside the garden gate. I checked on it twice today.
    Our local walking club has a new route that ends at a farm with a very good tea room.
    I baked a loaf in the shape of a ring and everyone kept asking where the middle went.
    The wind chimes on the balcony sound like small bells whenever the weather changes.
    We found a row of old mosaic tiles under the ivy beside the station wall.
    The neighborhood is collecting spare wool for a blanket project. My yarn basket is ready.
    I watched a heron stand completely still by the canal for nearly ten minutes.
    I brought home a bundle of dried lavender and tucked it into the linen cupboard.
    A small brass plaque appeared beside the old pear tree with its planting year on it.
    The hiking trail has a new rest shelter built from timber cut nearby.
    The postbox has been painted a cheerful green. Even the queue seems happier.
    I found a smooth piece of driftwood shaped exactly like a little boat.
    The town's annual lantern walk follows the river, with handmade lights all the way along.
    I planted nasturtium seeds in an old tin and put it by the sunny window.
    The station cafe has a jar of pencils for people who want to do the crossword.
    We finally hung the family portrait, and the wall looks less empty now.
    The new viewing platform over the wetlands has benches in exactly the right place.
    A neighbor dropped off a basket of plums and a note with their favorite jam recipe.
    I learned a simple tune on the recorder. The cat has chosen to nap in another room.
    I took a beginner astronomy class and can now identify exactly one planet with confidence.
    Spent the morning learning to sharpen kitchen knives. Tomatoes are no longer a challenge.
    The old stone arch by the footpath has a tiny date carved into it: 1846. Who put it there?
    Morning ferry was so quiet I could hear the ropes creak against the dock.
    Does anyone know why the clock in the old arcade has two minute hands?
    A warm loaf cooling on the counter is the best reason to stay in on a windy afternoon.
    I spent an hour repairing a torn tote bag and now feel unusually proud of a straight seam.
    The small pond behind the sports ground is full of dragonflies this afternoon.
    I went to see the amateur astronomy group and got to look at Saturn through a telescope.
    The community hall is offering a free class on making simple book repairs next Thursday.
    A stranger gave me directions using landmarks, and somehow I understood every turn.
    The train platform has a new covered bench. Small upgrade, much appreciated on rainy days.
    I tried making a savory pie with the vegetables in the bottom drawer. Crust won the day.
    A patch of wild mint has taken over the edge of the path. The whole walk smelled fresh.
    We spent the afternoon making a family tree from old photographs and a lot of guesses.
    I had lunch beside the canal and watched a narrowboat carry a very large houseplant.
    My first attempt at making a basket from paper strips is lopsided but surprisingly sturdy.
    The dog walker at the corner knows every dog's name and most of their favorite snacks.
    I found a little brass bell in the garden soil while planting bulbs. No one recognizes it.
    I made a list of all the bridges in town and have already visited four of them.
    The street fair had a booth where children could build tiny boats from corks and string.
    I listened to an interview with a bell maker and now notice bells everywhere.
    A delivery cyclist stopped to help me gather oranges that rolled out of my shopping bag.
    We made a list of songs for the long drive and somehow agreed on every single one.
    I saw a family of ducks queue patiently at the edge of the pond. Everyone else waited too.
    The community kitchen has a shelf of recipe cards that people can take and add to.
    Our local craft group is hosting an evening for anyone who wants to learn basic mending.
    Someone made a miniature knitted scarf for the statue in the square. It looks very warm.
    The town's little ferry has a new timetable board painted by the school art club.
    We tried a new route through the woods and found a clearing full of tiny white flowers.
    The bus stop has a painted roof now, with clouds on one side and stars on the other.
    The sound of someone practicing scales drifted through the courtyard all afternoon.
    I walked into a shop to get a lightbulb and left with a little tin of buttons. It happens.
    The local map has a dotted path to a viewpoint I somehow missed for years.
    The market hall's roof windows make the fruit stalls glow in the late afternoon.
    We celebrated the end of the school term with a picnic and a very competitive sack race.
    The town archive has a display of old theater programs. The costumes look spectacular.
    I found a tiny cafe tucked inside the covered market. The windows look onto a wall of ivy.
    My brother made a birdbath from an old serving dish. The sparrows approved immediately.
    A handwritten note on the gate says the plum tree is free to pick from this weekend.
    The old clock shop has a window display of gears arranged like a little mechanical garden.
    We took a basket to the orchard and came home with enough apples for a week of pies.
    The train guard remembered my stop and gave me a friendly wave as I got off.
    Our pottery class made a set of tiny bowls for the community garden's seed table.
    I found a well-loved deck of cards in the park and left it at the lost-property desk.
    The market's cheese stall had a tiny chalkboard explaining how each variety was made.
    I took a wrong turn and ended up in a courtyard with a fountain shaped like a fish.
    The corner shop has started lending shopping baskets to anyone who forgot theirs.
    A tiny allotment shed has been painted with a mural of vegetables wearing hats.
    The village hall's noticeboard has a new calendar for sharing rides to weekend events.
    A flock of starlings moved across the sky in one enormous shape on my way home.
    I picked up a beginner's guide to weaving and made a coaster that is almost square.
    I took the early bus to the coast and watched the town wake up through the fogged windows.
    A moth got into the hallway and spent ten minutes investigating every ceiling light.
    Does anyone have a favorite way to use up a bowl of ripe pears? Mine are becoming urgent.
    A friend taught me to make dumpling wrappers by hand. The first few looked like tiny maps.
    I tried making a small loaf in the skillet. The crust was uneven and absolutely delicious.
    The old footpath behind the school smells like wet leaves and woodsmoke today.
    I finally learned how to sharpen my garden spade. The soil is much less intimidating now.
    The farm gate was open, so we followed the public path through a field full of buttercups.
    The old harbor crane has been painted a bright red. It is impossible to miss now.
    My boots picked up enough mud on the walk to make the doorstep look like a garden exhibit.
    The old station waiting room has a display of train timetables from a hundred years ago.
    The old clock in the bakery window stopped at 3:17. Nobody seems to mind.
    I picked up a book about local bridges and now have a list of places to walk this month.
    The community kitchen's recipe wall has a handwritten note for a very simple tomato tart.
    Our courtyard has a small patch of strawberries now. The birds noticed before we did.
    I cleaned the old paint brushes and found one that still makes a perfectly straight line.
    The village path runs through a field where the grass is taller than the wooden signposts.
    I sat in the public garden and watched a bee inspect every flower on the lavender bush.
    I found a tiny brass compass in a box of old sewing things. It points north, more or less.
    My niece asked for a map of the garden and drew every worm she has ever seen.
  `);

  const FILE_EXTENSIONS = C.rows(`
    pdf | document | PDF document
    docx | document | Text document (DOCX)
    doc | document | Legacy text document (DOC)
    odt | document | OpenDocument text
    txt | text | Plain text
    md | text | Markdown
    rtf | document | Rich text
    xlsx | spreadsheet | Spreadsheet (XLSX)
    csv | spreadsheet | Comma-separated values
    ods | spreadsheet | OpenDocument spreadsheet
    pptx | presentation | Slide deck (PPTX)
    key | presentation | Slide deck (KEY)
    jpg | image | JPEG image
    png | image | PNG image
    gif | image | GIF image
    svg | image | SVG image
    heic | image | HEIC photo
    webp | image | WebP image
    mp4 | video | MP4 video
    mov | video | MOV video
    mp3 | audio | MP3 audio
    wav | audio | WAV audio
    m4a | audio | M4A audio
    zip | archive | ZIP archive
    tar.gz | archive | Compressed tarball
    7z | archive | 7-Zip archive
    json | data | JSON file
    xml | data | XML file
    ics | data | Calendar file
    vcf | data | Contact card
    eml | data | Email message
    html | web | Web page
    psd | design | Layered image (PSD)
    fig | design | Design file
  `).map(([ext, kind, label]) => ({ ext, kind, label }));

  const DOC_WORDS = ['Report', 'Budget', 'Proposal', 'Contract', 'Minutes', 'Agenda', 'Roadmap', 'Invoice', 'Receipt',
    'Timesheet', 'Resume', 'Cover letter', 'Brochure', 'Floor plan', 'Itinerary', 'Menu', 'Quote', 'Presentation',
    'Notes', 'Checklist', 'Handbook', 'Brief', 'Research', 'Survey results', 'Forecast', 'Inventory', 'Schedule',
    'Statement', 'Specification', 'Draft', 'Q3 review', 'Meeting notes', 'Onboarding', 'Style guide', 'Expenses',
    'Change log', 'Release notes', 'User guide', 'White paper', 'Case study', 'Test plan', 'Risk register',
    'Action items', 'Work order', 'Delivery slip', 'Packing list', 'Warranty card', 'Contact list', 'Training plan',
    'Lesson plan', 'Reading list', 'Newsletter', 'Press release', 'Event program', 'Guest list', 'Site map',
    'Wireframe', 'Design brief', 'Price list', 'Label sheet', 'Memorandum', 'Leave request', 'Call log',
    'Email thread', 'Help article', 'API reference', 'Process map', 'Data flow', 'Bug report', 'Test results',
    'Backup log', 'Storyboard', 'Credit memo', 'Quality plan', 'Press kit', 'Call sheet', 'Seating chart',
    'Shift roster', 'Key log', 'Field notes', 'Lab notebook', 'State diagram', 'Capacity plan', 'Glossary',
    'Class roster', 'Shot list', 'Room layout', 'Visitor pass', 'Room booking', 'Dispatch note', 'Receiving log',
    'Vehicle log'];

  function fileName(rng, ext, opts) {
    const kindPick = C.weighted(rng, [['document', 35], ['spreadsheet', 15], ['image', 20], ['presentation', 8], ['archive', 5],
      ['video', 4], ['audio', 3], ['text', 5], ['data', 3], ['design', 2]]);
    const e = ext || rng.pick(FILE_EXTENSIONS.filter((f) => f.kind === kindPick)).ext;
    const kind = (FILE_EXTENSIONS.find((f) => f.ext === e) || { kind: 'document' }).kind;
    const y = rng.int(2019, 2026);
    const m = String(rng.int(1, 12)).padStart(2, '0');
    const d = String(rng.int(1, 28)).padStart(2, '0');
    const word = C.pick(rng, DOC_WORDS, opts);
    const who = C.LAST_NAMES ? C.ascii(C.pick(rng, C.LAST_NAMES, opts)).replace(/[^A-Za-z]/g, '') : 'Smith';
    const co = C.COMPANIES ? C.pick(rng, C.COMPANIES, opts).split(' ')[0].replace(/[^A-Za-z]/g, '') : 'Acorn';
    if (kind === 'image' && rng.bool(0.6)) {
      return rng.pick([
        () => `IMG_${rng.int(1000, 9999)}.${e}`,
        () => `DSC0${rng.int(1000, 9999)}.${e}`,
        () => `Screenshot ${y}-${m}-${d} at ${rng.int(1, 12)}.${String(rng.int(0, 59)).padStart(2, '0')}.${String(rng.int(0, 59)).padStart(2, '0')}.${e}`,
        () => `PXL_${y}${m}${d}_${C.digits(rng, 9)}.${e}`,
        () => `photo-${rng.int(1, 40)}.${e}`,
      ])();
    }
    if ((kind === 'video' || kind === 'audio') && rng.bool(0.5)) {
      return rng.pick([
        () => `VID_${y}${m}${d}_${C.digits(rng, 6)}.${e}`,
        () => `Recording ${rng.int(1, 30)}.${e}`,
        () => `${word} walkthrough.${e}`,
        () => `voice memo ${m}-${d}.${e}`,
      ])();
    }
    return rng.pick([
      () => `${word.replace(/ /g, '_')}_${y}-${m}_${who}.${e}`,
      () => `${word} v${rng.int(2, 9)}${rng.pick([
        '', ' (final)', ' FINAL', ' - edited', ' (1)', ' copy', '- raw', '- scan', '- print', '(old)', '(temp)',
        '- web'
      ])}.${e}`,
      () => `${y}${m}${d}_${word.toLowerCase().replace(/ /g, '-')}.${e}`,
      () => `${co}_${word.replace(/ /g, '')}_${rng.pick(['Q1', 'Q2', 'Q3', 'Q4', 'FY' + String(y).slice(2), 'H1', 'H2'])}.${e}`,
      () => `${word.toLowerCase()}-${rng.pick(['draft', 'final', 'signed', 'clean', 'redline', 'review'])}.${e}`,
      () => `Untitled ${rng.int(1, 12)}.${e}`,
      () => `${who} ${word.toLowerCase()} ${d}.${m}.${y}.${e}`,
      () => `draft v${rng.int(2, 5)} (final).${e}`,
    ])();
  }

  function fileSize(rng, kind) {
    const ranges = { image: [0.2, 8], video: [12, 900], audio: [1, 40], archive: [0.5, 300], spreadsheet: [0.02, 6],
      presentation: [0.5, 40], text: [0.001, 0.2], data: [0.001, 3] };
    const [lo, hi] = ranges[kind] || [0.05, 12];
    const mb = Math.exp(Math.log(lo) + (Math.log(hi) - Math.log(lo)) * rng.float());
    if (mb < 1) return `${Math.max(1, Math.round(mb * 1024))} KB`;
    if (mb >= 1000) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  }

  Object.assign(C, {
    SENTENCE_GROUPS,
    SENTENCES,
    paragraph,
    paragraphs,
    TOPICS,
    HEADLINES,
    EMAIL_SUBJECTS,
    EMAIL_KINDS,
    emailBody,
    LINK_TEXTS,
    POST_TEXTS,
    FILE_EXTENSIONS,
    fileName,
    fileSize,
  });
})();
