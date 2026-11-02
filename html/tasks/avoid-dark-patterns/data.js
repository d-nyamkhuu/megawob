/* avoid-dark-patterns/data.js: fictional sampling banks, shared through the task's lib. */
(function () {
  'use strict';
  const C = env.content;

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December'];

  // ---------------------------------------------------------------- task-local content (fictional)

  const brands = (text) => C.rows(text).map(([name, domain, kind]) => ({ name, domain, kind }));
  const SHOPS = brands(`
    Larkspur Goods | larkspurgoods.com
    Pebble & Pine | pebbleandpine.shop
    Nordwick Outfitters | nordwickoutfitters.com
    Bluefin Electronics | bluefinelectronics.com
    Marigold Home | marigoldhome.co
    Copperleaf Market | copperleafmarket.com
    Fenwick & Bell | fenwickbell.com
    Halcyon Supply | halcyonsupply.store
    Tallowby | tallowby.com
    Quarry Lane | quarrylane.shop
    Wrenfield Mart | wrenfieldmart.com
    Brackenridge Co. | brackenridgeco.com
    Mossvale Mercantile | mossvalemercantile.com
    Cinder & Loom | cinderandloom.shop
    Sunward Foundry | sunwardfoundry.store
    Poppyglass Home | poppyglasshome.com
    Westmere Provisions | westmereprovisions.com
    Glimmerbay Market | glimmerbaymarket.com
    Ashcombe Supply | ashcombesupply.store
    Orchard & Ore | orchardandore.com
    Briarwell Living | briarwellliving.shop
    Covefern Collective | coveferncollective.com
    Dovetail Depot | dovetaildepot.co
    Mallowridge | mallowridge.com
    Sablebrook General | sablebrookgeneral.shop
    Fablewick Finds | fablewickfinds.com
    Elmshore Trading | elmshoretrading.store
    Kindred Basin | kindredbasin.co
    Holloway Hearth | hollowayhearth.com
    Lumenfield Market | lumenfieldmarket.store
    Northglass Goods | northglassgoods.com
    Willowmere Supply | willowmeresupply.shop
    Foxglove Foundry | foxglovefoundry.store
    Merriton Market | merritonmarket.com
    Cloverbank House | cloverbankhouse.co
    Pinebarrow Goods | pinebarrowgoods.shop
    Dappled Finch | dappledfinch.com
    Marlow & Mica | marlowandmica.co
    Redfern Provisions | redfernprovisions.com
    Bluebell Forge | bluebellforge.store
    Windrow Mercantile | windrowmercantile.com
    Frostmere Home | frostmerehome.co
    Alderwick Supply | alderwicksupply.com
    Hearthstone & Harbor | hearthstoneharbor.com
    Kestrel Row | kestrelrow.co
    Brindlebrook Goods | brindlebrookgoods.com
    Pemberley Market | pemberleymarket.com
    Lowland Lantern | lowlandlantern.co
    Mirthwood Home | mirthwoodhome.com
    Gannet Ridge | gannetridge.shop
    Rookery & Reed | rookeryandreed.com
    Amberfield Trading | amberfieldtrading.store
    Lindencrest House | lindencresthouse.com
    Baskettide | baskettide.co
    Moorland & Mill | moorlandandmill.com
    Everwillow Finds | everwillowfinds.shop
    Cresset Cove | cressetcove.com
    Bramblewick Depot | bramblewickdepot.store
    Silverthatch Living | silverthatchliving.com
    Ravenhollow Goods | ravenhollowgoods.co
    Cedarspun Market | cedarspunmarket.com
    Peregrine Hollow | peregrinehollow.shop
    Tansybrook Home | tansybrookhome.store
    Hawthorn Quay | hawthornquay.co
    Fallowmere Supply | fallowmeresupply.com
    Belltower & Birch | belltowerandbirch.shop
    Sundew General | sundewgeneral.com
    Ashenbrook Market | ashenbrookmarket.store
    Larkettle Goods | larkettlegoods.com
    Meadowglass House | meadowglasshouse.shop
    Dunewick Trading | dunewicktrading.co
    Rosedale Foundry | rosedalefoundry.store
    Bramblefern Living | bramblefernliving.com
    Morrowfield Depot | morrowfielddepot.co
    Kindlewick House | kindlewickhouse.co
    Ironwell Exchange | ironwellexchange.com
    Plover & Post | ploverandpost.shop
    Cobalt Orchard | cobaltorchard.store
    Thistlebrook Supply | thistlebrooksupply.com
    Morrow & Slate | morrowandslate.co
    Lanternwake Market | lanternwakemarket.com
    Cairn & Canvas | cairnandcanvas.shop
    Umberlane Market | umberlanemarket.com
    Gilded Oar | gildedoar.co
    Hearthrun Trading | hearthruntrading.store
    Tarnwell Depot | tarnwelldepot.com
    Parchment & Pinecone | parchmentpinecone.co
    Duskvale Provisions | duskvaleprovisions.com
    Copper Finch House | copperfinchhouse.shop
    Glasswing & Grain | glasswingandgrain.com
    Saffron Quay | saffronquay.co
    Woolen Harbor | woolenharbor.com
    Inkberry & Iron | inkberryandiron.shop
    Nettle & Nook | nettleandnook.com
    Hollowmere Trading | hollowmeretrading.store
    Foxmere Outfitters | foxmereoutfitters.co
    Rivermark Finds | rivermarkfinds.com
    Cask & Thimble | caskandthimble.shop
    Marlowe Crossing | marlowecrossing.com
    Stonecrop Market | stonecropmarket.co
    Blue Hour Goods | bluehourgoods.store
    Ashlar & Finch | ashlarandfinch.co
    Fabletide House | fabletidehouse.shop
    Oriole Basin | oriolebasingoods.com
    Siltstone Living | siltstoneliving.store
    Needlefern Depot | needleferndepot.co
  `);
  const AIRLINES = brands(`
    Skylark Fares | skylarkfares.com
    Cormorant Air | cormorantair.com
    Paloma Routes | palomaroutes.travel
    Bluepeak Airways | bluepeakair.com
    Seabright Air | seabrightair.com
    Kestrel Jet | kestreljet.com
    Northwind Air | northwindair.com
    Ospreyway | ospreyway.com
    Tidewing Airlines | tidewing.com
    Calder Air | calderair.com
    Velkin Air | vel.example.com
    Oltava Airways | olt.example.org
    Nembrel Jet | nem.example.net
    Arvane Fares | arv.example.com
    Pellun Air | pel.example.org
    Zevra Routes | zev.example.net
    Cloudfen | cloudfen.example.com
    Orvick Airlines | orv.example.org
    Mistquay Air | mist.example.net
    Dawncoil Jet | dawn.example.com
    Asterwake Air | ast.example.org
    Yarrowlift | yarrow.example.net
    Copperkite | cpkite.example.com
    Tovren Airways | tov.example.org
    Glimmer Flights | glim.example.net
    Brindal Air | bri.example.com
    Updraft Vale | upvale.example.org
    Air Merrow | merrow.example.net
    Vireo Passage | vir.example.com
    Fencrest Jet | fen.example.org
    Halveth Air | halv.example.com
    Istren Flights | istr.example.org
    Floreth Fares | flo.example.net
    Brume Airways | bru.example.com
    Talvo Flights | tal.example.org
    Ombrita Air | ombr.example.net
    Quenlor Air | quen.example.com
    Saffrel Routes | saff.example.org
    Dovrik Jet | dovr.example.net
    Vesperglide | vesp.example.com
  `);
  const HOTEL_SITES = brands(`
    Bramble Stays | bramblestays.com
    Tern Hotels | ternhotels.com
    Hearthside Inns | hearthsideinns.com
    Roamwell | roamwell.travel
    Lodgewren | lodgewren.com
    Harbor & Hearth | harborandhearth.com
    Staybright | staybright.com
    Wayfarer Rooms | wayfarerrooms.com
    Quill & Key Hotels | quillandkey.com
    Driftline Stays | driftlinestays.com
    Vellun Stays | vln.example.com
    Tassel Inns | tas.example.org
    Roomquay | roomquay.example.net
    Bell & Bolster | bb.example.com
    Sleepcairn | cairn.example.org
    Olven Hotels | olven.example.net
    Acorn Atrium | acorn.example.com
    Latch & Linen | latch.example.org
    Mossglade Rooms | moss.example.net
    Dovren Lodge | dovren.example.com
    Guestwillow | gwillow.example.org
    The Pillow Map | pmap.example.com
    Fern Alcove | alcove.example.org
    Emberbay Inns | ember.example.net
    Bedfolio | bedfolio.example.com
    Cedarplume | cedar.example.org
    Hushport Hotels | hush.example.net
    Tapestry Keys | tpkey.example.com
    Wander Niche | niche.example.org
    Sovrel Rooms | sovrel.example.com
    Keybasket | keyb.example.org
    Resthollow | rest.example.net
    Gablet Hotels | gablet.example.com
    Fable & Quilt | fabq.example.org
    Duskettle Inns | dusk.example.net
    Thatch Atlas | thatch.example.com
    Ambric Suites | ambr.example.org
    Portico Nest | port.example.net
    Rillora Stays | rill.example.com
    Ulmora Hotels | ulmor.example.org
  `);
  const TICKETERS = brands(`
    Gilded Tickets | gildedtickets.com
    Encore Box | encorebox.live
    Marquee Pass | marqueepass.com
    Turnstile Hub | turnstilehub.com
    Lanternseat | lanternseat.com
    Stagecoach Tix | stagecoachtix.com
    Bandstand | bandstand.events
    Footlight Box Office | footlightbox.com
    Encore Row | encorerow.com
    Seatwise | seatwise.events
    Rafter Tickets | raf.example.com
    Showthimble | thim.example.net
    Clapfolio | clap.example.com
    Fanfare Gate | fan.example.org
    Velvet Stub | vstub.example.net
    Gallery Tix | gal.example.com
    Cuecairn | cue.example.org
    Rivet Box Office | riv.example.net
    Torchbill | torch.example.com
    Usher Grove | usher.example.org
    Applause Quay | aq.example.com
    Frontispot | fspot.example.net
    Chorus Entry | cho.example.com
    Admitberry | aberry.example.net
    Spotlight Ledger | splt.example.com
    Festival Fold | fest.example.org
    Balconybud | balc.example.com
    Ticket Sprig | tspr.example.org
    Curtain Kite | ckit.example.com
    Rostrum Tix | ros.example.org
    Pitlane Pass | pitl.example.net
    Arena Latch | arl.example.org
    Playbill Elm | pelm.example.net
    Ovello Passes | ovel.example.com
    Recital Hub | rech.example.org
    Entry Loom | ent.example.net
    Confetti Box | cbox.example.com
    Drumbeat Door | drum.example.org
  `);
  const FOOD = brands(`
    Forkful | forkful.app
    Dishlark | dishlark.com
    Basket Runner | basketrunner.com
    Tablehop | tablehop.app
    Munchwise | munchwise.com
    Ladle & Go | ladleandgo.com
    Spoonbridge | spoonbridge.app
    Pantry Pronto | pantrypronto.com
    Crumbcourier | crumbcourier.com
    Hotplate Express | hotplateexpress.com
    Wokwhisk | wok.example.com
    Tiffinbee | tif.example.org
    Zestparcel | zest.example.com
    Nibblecart | nib.example.org
    Chowcairn | chw.example.net
    Tuck & Tote | tuk.example.com
    Brothbug | brt.example.org
    Pita Pacer | pit.example.net
    Ramenramble | ram.example.com
    Skilletbag | skb.example.org
    Supper Finch | sfn.example.net
    Peapouch | pea.example.org
    Grubquay | gqy.example.net
    Morsel Map | mmap.example.org
    Snackferry | fry.example.net
    Savory Satchel | sav.example.com
    Mealspindle | mspin.example.org
    Dumplume | dmpl.example.com
    Bunbadger | bun.example.org
    Fennel Run | fen.example.net
    Saffrover | sfr.example.com
    Chutney Cab | ctc.example.org
    Toast Trolley | tst.example.net
    Curry Knap | ckn.example.com
    Rye Relay | rye.example.org
    Flask Feast | ff.example.net
    Biteburrow | bbr.example.com
    Nosh Otter | nos.example.org
    Plate Moth | pm.example.net
    Crate & Cumin | crc.example.com
  `);
  const RENTALS = brands(`
    Roadmint Rentals | roadmint.com
    Axle & Co. | axleandco.com
    Junction Car Hire | junctioncarhire.com
    Milepost Rentals | milepostrentals.com
    Kerbside Cars | kerbsidecars.com
    Highgear Hire | highgearhire.com
    Overland Rent | overlandrent.com
    Trailhead Cars | trailheadcars.com
    Spoke Rentals | spokerentals.com
    Pinewheel Car Rental | pinewheel.com
    Tarmac Tern | tarma.example.com
    Veldrin Car Hire | veld.example.org
    Clutch & Compass | clu.example.com
    Bendbrook Cars | bend.example.org
    Motor Nook | mnook.example.com
    Maplehub Rentals | maple.example.org
    Cairnway Hire | cway.example.net
    Rovefen Cars | rfen.example.com
    Glovebox Grove | gbox.example.org
    Verge Fleet | verge.example.net
    Laneby Car Rental | lby.example.com
    Odomint Hire | odomint.example.org
    Roundtrip Reed | rtreed.example.net
    Coppercab Rentals | ccab.example.com
    Fendrel Motors | fendrel.example.net
    Vellum Van Hire | vvhire.example.org
    Dashvale Hire | dashv.example.com
    Bonnet & Birch | bonn.example.net
    Turnvale Rent | turn.example.com
    Brasskey Motors | brass.example.org
    Varnel Rentals | varn.example.net
    Parkspur Cars | park.example.com
    Ridgepin Car Hire | rdgp.example.org
    Enrel Van Hire | enrl.example.net
    Cobblecruise Cars | cobb.example.com
    Thornrim Rental | thorn.example.net
    Lowbeam Car Hire | lowb.example.com
    Carriage Fern | crfn.example.org
  `);
  const SUBS = C.rows(`
    Lumenreel | lumenreel.tv | video | Premium | 15.99 | Standard with ads | 6.99
    Cadence Music | cadencemusic.app | music | Individual | 10.99 | Lite | 4.99
    Stridewell | stridewell.fit | fitness | Coach | 19.99 | Basic | 7.99
    Pressroom Daily | pressroomdaily.com | news | All Access | 12.00 | Digital Basic | 4.00
    Hearthbox Meals | hearthbox.com | meals | Family Box | 69.99 | Two-person Box | 39.99
    Cloudlark Storage | cloudlark.io | storage | 2 TB | 9.99 | 200 GB | 2.99
    Brightpage Books | brightpage.club | books | Unlimited | 11.99 | 2 books a month | 6.99
    Swiftbarrow Plus | swiftbarrow.com | delivery | Plus | 8.99 | Saver | 3.99
    Lingoleaf | lingoleaf.app | language | Super | 12.99 | Plus | 6.99
    Pixelbloom Studio | pixelbloom.design | design | Pro | 14.99 | Starter | 5.99
    Hushwell | hushwell.app | wellness | Premium | 9.99 | Essentials | 3.99
    Ironwood Games Pass | ironwoodpass.games | games | Ultimate | 16.99 | Core | 9.99
    Tempofern | tempofern.example.org | music | Full Library | 11.49 | Radio Mix | 4.49
    Mistvault | mistvault.example.net | storage | 3 TB | 13.99 | 500 GB | 4.99
    Tintgrove | tintgrove.example.com | design | Studio Suite | 22.00 | Sketch Tools | 8.00
    Ladlecrate | ladlecrate.example.org | meals | Twelve Bowls | 64.00 | Six Bowls | 36.00
    Orbitslate | orbitslate.example.org | astronomy | Deep Sky | 10.99 | Night Sky | 3.99
    Musecairn | musecairn.example.com | art | Gallery Pass | 15.00 | Monthly Exhibit | 5.00
  `).map(([name, domain, kind, plan, price, lower, lowerPrice]) => ({ name, domain, kind, plan, price: Number(price),
    lower, lowerPrice: Number(lowerPrice) }));
  const DESIGN_APPS = C.rows(`
    Pixelbloom Studio | pixelbloom.design | 14.99
    Inkhaven Design | inkhaven.app | 11.99
    Mosaic Draw | mosaicdraw.com | 9.99
    Paperkite Studio | paperkite.studio | 12.99
    Glyphworks | glyphworks.io | 8.99
    Easelpoint | easelpoint.com | 10.99
    Brumlet Studio | brumlet.studio | 12.99
    Ochrindle Draw | ochrindle.design | 9.99
    Velquill Design | velquill.design | 14.99
    Dapplequay | dapplequay.io | 10.99
    Wispfolio Draw | wispfolio.com | 8.99
    Chromafer Studio | chromafer.studio | 11.99
    Stencilark | stencilark.com | 9.99
    Dabblenook Design | dabblenook.io | 12.99
    Umbristle Draw | umbristle.app | 8.99
    Tesselune Studio | tesselune.com | 14.99
    Swatchfen | swatchfen.studio | 10.99
    Cindervell Art | cindervell.app | 11.99
    Artlewick Studio | artlewick.design | 9.99
    Plumigraph | plumigraph.design | 12.99
    Zestframe Draw | zestframe.app | 8.99
    Nibblequay | nibblequay.com | 10.99
  `).map(([name, domain, price]) => ({ name, domain, kind: 'design', price: Number(price) }));
  const NEWS = brands(`
    The Daily Lantern | dailylantern.news
    Harbor Herald | harborherald.com
    Northern Ledger | northernledger.net
    Cobblewire | cobblewire.org
    The Morning Compass | morningcompass.com
    Fieldnote Weekly | fieldnoteweekly.com
    Saltbox Kitchen | saltboxkitchen.com
    Skyward Weather | skywardweather.com
    The Kettlebrook Courier | kettlebrookcourier.com
    Brightwater Gazette | brightwatergazette.com
    Tinker's Bench | tinkersbench.blog
    The Mallowfen Post | mallowfenpost.com
    Rillwick Review | rillwickreview.net
    Amberfen Journal | amberfenjournal.com
    The Winding Dispatch | windingdispatch.news
    Brindlewick Times | brindlewicktimes.com
    Mossquay Chronicle | mossquaychronicle.net
    Noonfell Bell | noonfellbell.news
    Cairnwick Record | cairnwickrecord.com
    Westervale Observer | westervale.net
    Flintmeadow Report | flintmeadowreport.com
    Sablefen Standard | sablefenstandard.net
    The Larchford Voice | larchfordvoice.com
    Dunebarrow Digest | dunebarrowdigest.com
    Asterquay Dispatch | asterquaydispatch.net
    The Rivet Voice | rivetvoice.news
    Wrenmarsh Journal | wrenmarshjournal.org
    Ploverfell Press | ploverfellpress.com
    Brambletarn Record | brambletarnrecord.net
    The Vellumvale | vellumvale.news
    Gorsebridge Weekly | gorsebridgeweekly.com
    Mica Vale Times | micavaletimes.com
    Quilltarn | quilltarn.news
    Copperhollow Post | copperhollowpost.com
    Crumbfen Table | crumbfentable.com
    The Apron Almanac | apronalmanac.com
    Tarnpot Kitchen | tarnpotkitchen.com
    Cloudtarn Outlook | cloudtarnoutlook.com
    Rainspindle | rainspindle.net
    The Windward Watch | windwardwatch.com
    Bobbinquay | bobbinquay.blog
    Workshop Wren | workshopwren.blog
    Thimblefen Notes | thimblefennotes.com
  `);
  const FILE_SITES = brands(`
    FileHarbor | fileharbor.net | host
    Grabbit Files | grabbitfiles.com | host
    SwiftShare | swiftshare.io | host
    DocDepot | docdepot.net | host
    Driverloft | driverloft.com | driver
    Patchbay Drivers | patchbaydrivers.com | driver
    Hoplink | hoplink.cc | link
    Tinytrail | tinytrail.link | link
    Freewarely | freewarely.com | host
    Boxdrop Files | boxdropfiles.com | host
    Cratewren | cratewren.net | host
    Blobtarn Files | blobtarnfiles.com | host
    Stashquay | stashquay.io | host
    Bitburrow Files | bitburrowfiles.com | host
    Folderfen | folderfen.com | host
    Stackmoth Files | stackmothfiles.net | host
    Bundlewick | bundlewick.com | host
    Cachebrim | cachebrim.io | host
    Packetnook | packetnook.net | host
    Flitcrate Files | flitcratefiles.com | host
    Vaultglen Files | vaultglenfiles.com | host
    Tuckbyte Hub | tuckbytehub.io | host
    Spooltern Files | spoolternfiles.net | host
    Loftpacket | loftpacket.com | host
    Fetchbasket | fetchbasket.com | host
    Chipwren Drivers | chipwrendrivers.com | driver
    Rigfen Drivers | rigfendrivers.net | driver
    Portmoth | portmoth.com | driver
    Devicequay | devicequay.net | driver
    Busbrindle | busbrindle.com | driver
    Kernelcove | kernelcove.io | driver
    Jumplebit | jumplebit.net | link
    Urlwisp | urlwisp.link | link
    Snipquay | snipquay.net | link
    Pathmote | pathmote.com | link
    Ziprill | ziprill.cc | link
    Leaptwig | leaptwig.link | link
  `);
  const APPS = C.rows(`
    Simmer | recipes | Weeknight, Favourites, Meal prep, Sunday baking
    Sprig Notes | notes | Work, Ideas, Travel, Reading list
    Stridewell | fitness | My plan, Favourites, Recovery days, Race prep
    Folio Reader | reading | Read later, Work, Weekend, Long reads
    Trailmark | hikes | Bucket list, Easy walks, With kids, Autumn
    Pocket Atlas | places | Trip ideas, Lisbon, Date night, Brunch spots
    Tunewell | music | Road trip, Focus, Workout, Sleepy
    Gardenly | garden | Balcony, Shade plants, Herbs, Spring planting
    Ladlemint | recipes | Quick bites, One pot, Batch cook, Sweet treats
    Crumbrel Pot | recipes | Brunch, Lunch box, Suppers, Party food
    Pantrille | recipes | Soups, Meatless, Family meals, Try soon
    Quillmoss | notes | Home tasks, Projects, Archive, Idea bank
    Jottlebay | notes | This week, Meetings, Reference, Personal
    Memorill Pad | notes | Daily log, Study log, Drafts, Reminders
    Pacebrim | fitness | Sprints, Gym days, Outdoors, Next goals
    Repwren Fit | fitness | Sessions, Progress, Technique, At home
    Flexmora | fitness | Daily mix, Training, Low impact, Challenges
    Leafquill | reading | Essays, Stories, Culture, New picks
    Talecrag Ink | reading | History, Science, Profiles, Revisit
    Readmoth | reading | Curious, Deep dives, Bookmarked, At lunch
    Ridgewhorl | hikes | Riverside, Day trips, Hill paths, Quiet
    Fernrover | hikes | Local loops, Waterfalls, Big climbs, Woodlands
    Ramblemint | hikes | Half day, Lookouts, Lake paths, Open moor
    Roamquill | places | Near home, City breaks, Cafes, Hidden gems
    Wanderfen | places | Rainy days, Markets, Late nights, Museums
    Nookrover | places | With friends, Coastal, Food stops, Viewpoints
    Melodrift | music | Evenings, Upbeat, Instrumental, Slow tunes
    Riffmoss Mix | music | New finds, Old gems, Unwind, Party mix
    Chordfen | music | Live sets, Soft sounds, Sing along, Commute
    Petalrill | garden | Seedlings, Containers, Summer beds, Cuttings
    Budmorrow | garden | Sunny spots, Climbers, Trees, Potting bench
    Frondella | garden | Indoor pots, Flowers, Cool season, Sowing
  `).map(([name, kind, cols]) => ({ name, kind, cols: cols.split(',').map((s) => s.trim()) }));
  const APP_ITEMS = {
    notes: C.lines(`
      Quarterly planning checklist
      Packing list for the coast
      Book club questions
      Ideas for the garden shed
      Gift ideas for Dana
      Kitchen renovation budget
      Interview prep notes
      Friday workshop agenda
      Map of the attic boxes
      Questions for the landlord
      Team handover reminders
      Pottery class observations
      Birthday picnic plans
      Spare room paint samples
      New staff welcome guide
      Neighbourhood swap dates
      Desk organiser sketches
      Family story fragments
      Weekend volunteer rota
      Rainy day outing shortlist
      Museum visit reflections
      Balcony measurements log
      Studio chat minutes
      Borrowed tools to return
      Choir rehearsal dates
      Short story opening lines
      Pet sitter instructions
      School drawing archive
    `),
    fitness: C.lines(`
      20-minute HIIT
      Morning mobility flow
      5 km tempo run
      Core strength in 15
      Easy recovery ride
      Upper body dumbbells
      Beginner yoga stretch
      15-minute pool laps
      Lower body bands
      10-minute rowing
      Kettlebell circuit
      12 stair sets
      Balance and footwork
      25-minute dance
      Pilates mat sequence
      Uphill treadmill
      Stability ball work
      Jump rope practice
      Outdoor boot camp
      15-minute pedal ride
      Trail running skills
      Bench step training
      Agility ladder drills
      Partner circuit class
      Shadowboxing rounds
      Medicine ball throws
      Sandbag carries
      Dead hang practice
    `),
    hikes: C.lines(`
      Fern Gully Loop
      Ridgeback Summit Trail
      Old Mill Riverside Walk
      Larchwood Falls Path
      Coastal Cliffs Circuit
      Heron Lake Boardwalk
      Alder Hollow Footpath
      Pebblestone Tor Ascent
      Whispering Dune Walk
      Silver Moss Causeway
      Bramble Heath Circuit
      Cinder Creek Crossing
      Fox Den Woodland Way
      Winding Reed Towpath
      Crescent Bluff Trail
      Pinecone Pass Ramble
      Golden Fen Boardwalk
      Badger Vale Traverse
      Moonstone Arch Track
      Wren Meadow Circuit
      Tumbledown Tarn Loop
      Hidden Quarry Pathway
      Juniper Gorge Descent
      Heather Crown Ascent
    `),
    places: C.lines(`
      Café Paloma
      The Glasshouse Bakery
      Lighthouse Viewpoint
      Corner Noodle Bar
      Riverside Flea Market
      Bluebell Botanical Garden
      Mothwing Pottery Room
      Quillstone Clock Tower
      Amber Finch Bookshop
      Mallow Quay Aquarium
      Buttonbox Bistro
      Copper Moth Gallery
      Dappled Oak Pavilion
      Cloudberry Pie Shop
      Silver Acorn Arcade
      Painted Courtyard
      Bramblewick Cider Barn
      Wren Hollow Tearoom
      Glimmerbell Museum
      Little Otter Square
      Café Lantern Loft
      Clover Loom Workshop
    `),
    music: C.lines(`
      Late Night Lo-fi
      Morning Acoustic
      Sunset Drive
      Rainy Day Jazz
      Indie Gold
      Deep Focus Piano
      Velvet Funk Set
      Ocean Ambient
      Garage Grooves
      Starlit Strings
      Desert Blues Mix
      Vinyl Disco Gems
      Candlelit Cello
      Synth Horizons
      Bluegrass Porch
      Sunday Soul Set
      Drum Breaks
      Silver Flute
      Bossa Breeze
      Chamber Glow
      Dub Echoes Mix
      Folk Tapestries
      Mellow Marimba
    `),
    garden: C.lines(`
      Lemon thyme
      Climbing jasmine
      Hosta 'Blue Angel'
      Dwarf apple tree
      Sweet basil
      Lavender 'Hidcote'
      Japanese maple
      Bleeding heart
      English bluebell
      African marigold
      Common foxglove
      Sweet woodruff
      Creeping phlox
      Japanese anemone
      Hardy geranium
      Peacock orchid
      Flowering currant
      Golden oregano
      Salvia 'Caradonna'
      Lily 'Stargazer'
      Rose 'Iceberg'
    `),
  };
  const EVENTS = C.lines(`
    The Lanternfish Quartet: Live
    Harbor Lights Comedy Night
    Northside Jazz Festival
    Midsummer Ballet Gala
    Paper Kites Reunion Tour
    Stonebridge Indie Weekend
    The Cobalt Hour (live podcast)
    City Chamber Orchestra: Spring Season
    Glasshouse Theatre: The Tempest
    Velvet Circuit Arena Tour
    Riverbend Food & Music Fair
    Moonrise Planetarium Show
    The Weatherwell Sessions
    Juniper Street Songbook
    Orchard House Opera: The Glass Violin
    Wildflower Folk Festival
    Midnight Radio: A Musical Revue
    The Brass Lanterns on Tour
    Fablewood Puppet Theatre
    Tidepool Electronic Arts Festival
    The Curious Case of the Clockmaker
    Secondhand Stories: Live on Stage
    Copperfield Circus Spectacular
    The Long Weekend Comedy Revue
    Northern Lines: A Choral Evening
    Marigold Street Arts Walk
    The Paper Moon Magic Show
    Fireside Bluegrass Gathering
    Pinecone Players Present The Rivals
    The Winding Road Tribute Show
    Lantern Parade and Winter Market
    A Night at the Old Observatory
    Mosaic World Music Celebration
    The Velvet Marionette: Shadow Play
    Rooftop Rhythm Dance Party
    Hearthside Tales Storytelling Night
    The Great Lakes Folk Revue
    Silver Thread Chamber Ensemble
    Back Porch Song Circle
    Brightwater Fringe Festival
    The Midnight Garden Masquerade
    The Last Stop Laugh Lounge
    Crescent City Brass Parade
    A Map of Small Wonders
    Foxglove String Quartet
    Neon Orchard Dance Festival
    Cloudbreak Surf and Sound
    Cabinet of Curiosities: Live
    The Junebug Jubilee
    Winterglass Contemporary Dance
    Good Company Improv Night
    The Atlas of Lost Songs
    Redwood Mountain Bluegrass
    Saffron Sky World Dance
    The Unlikely Detectives
    Starling Street Art Fair
    A Choir of Borrowed Voices
    The Gilded Acorn Vaudeville
    Cinderblock Comedy Showcase
    Old Mill Roots Revival
    Aurora Folk Dance Ensemble
    The Great Umbrella Parade
    Blackbird String Sessions
    Afterglow Synthwave Social
    Meadowlark Opera: The Moon Orchard
    Saltwater Song Festival
    Velour & Vinyl Cabaret
    Painted Skies: A Choral Journey
    The Lantern Room Improv Festival
    Mothwing Puppet Cabaret
    Tumbleweed Comedy Hour
    Ironwood Players: Twelfth Night
    Blue Hour New Music Showcase
    Carnival of Small Machines
    The Unfinished Waltz
    Honeycomb Festival of Stories
    Sideways Stories: Sketch Comedy
    Night Train Swing Orchestra
    The Riddle House Theatre Experience
    Wildwood Cello Collective
    The Painted Drum: Global Rhythms
    Small Hours: Short Plays
    The Red Sash Dance Company
    The Glasswing Ballet
    Beneath the Painted Floor
    The Art of Falling: Acrobatic Theatre
    A Festival of Tiny Films
    The Gingham Jubilee
    Kites Above the Commons
    The Clockwork Aviary
    The Singing Bridge Choral Project
    Velvet Rope Vaudeville
    Bluebird Ballroom Revue
    The Midnight Matinee: Short Films
    Marshlight Storytelling Festival
    The Great Pancake Race Revue
  `);
  const HOTELS = C.lines(`
    Harborview Hotel
    The Linden House
    Saltmarsh Inn
    Copper Kettle Lodge
    Hotel Amberley
    The Foundry Rooms
    Seaglass Resort
    Willowmere Suites
    The Old Post Hotel
    Cliffside Lodge
    Quillmere Hotel
    Wrenwick Park Hotel
    Tansybell House
    The Map Room Inn
    Mosswhistle Lodge
    Amberfen Suites
    The Acorn Lantern
    Fablecrest Hotel
    Dunemallow Rooms
    Hotel Briarcombe
    Thimblebay Hotel
    Quincegate Lodge
    Woolmere Resort
    Cloverquay Hotel
    The Sable Rooms
    Frostpetal Lodge
    Brindlefen Lodge
    Larkettle Suites
    The Rowan Hearth
    Hotel Mirthwell
    Glimmeroak House
    Pinequill Retreat
    The Dappled Bell
    Nettlebrook Inn
    Sparrowfen Hotel
    The Umber Lantern
    Hushmeadow Lodge
    Rookthatch Suites
    Hotel Russetfen
  `);
  const CARS = C.lines(`
    Compact (Economy hatchback)
    Midsize sedan
    Compact SUV
    Electric compact
    Estate car
    7-seat people carrier
    Convertible coupe
    Double-cab pickup
  `);
  const SOFTWARE = C.rows(`
    Inkwell Editor 4.2 | 38.6 MB | software
    Tallyho Budget Tracker 2.1 | 21.4 MB | software
    Lumen Photo Viewer 7 | 54.0 MB | software
    PDF Tidy 3.5 | 12.9 MB | software
    Archivist Zip Tool 9.1 | 4.7 MB | software
    Stardust Planetarium 1.8 | 112 MB | software
    Wireframe Sketch Pad 5 | 77.3 MB | software
    Field Recorder 2.4 | 16.2 MB | software
    Pipletide Puzzles 1 | 24.8 MB | software
    Quillfen Font Browser 2 | 8.4 MB | software
    Tintwisp Palette 3.1 | 6.2 MB | software
    Keyburrow Typing 4 | 31.5 MB | software
    Namepebble Renamer 2 | 5.1 MB | software
    Sumwren Checksums 1.3 | 940 KB | software
    Markthatch Preview 2 | 14.7 MB | software
    Beatmallow Sequencer 3 | 62.4 MB | software
    Captioncove Sync 1.8 | 9.3 MB | software
    Pixelrook Screen Ruler 2 | 780 KB | software
    Tickfern Timer 1.2 | 3.8 MB | software
    Unitmoth Converter 4 | 2.6 MB | software
    Pantryquill Recipes 3 | 18.5 MB | software
    Leafcairn Reader 2.7 | 27.6 MB | software
    Rookbloom Chess 1.4 | 42.1 MB | software
    Thoughtwisp Mind Maps 2 | 22.7 MB | software
    Diskwren Space Map 1 | 7.6 MB | software
    Twinthimble Compare 3 | 11.8 MB | software
    Logthrush Analyzer 2 | 13.4 MB | software
    Pageburrow Wiki 1.5 | 19.2 MB | software
    Slidebracken Slides 4 | 48.3 MB | software
    Framefable Animator 2 | 86.5 MB | software
    Cloudquince Weather 1 | 4.2 MB | software
    Pathplover Routes 3 | 35.9 MB | software
  `);
  const DOCS = C.rows(`
    Community garden handbook.pdf | 2.4 MB | doc
    Marathon training plan.pdf | 860 KB | doc
    Thesis template (APA).docx | 312 KB | doc
    Household budget 2026.xlsx | 96 KB | doc
    Wedding seating chart.pdf | 1.1 MB | doc
    Beginner sourdough guide.pdf | 3.8 MB | doc
    Road trip playlist.zip | 41 MB | doc
    Course syllabus, autumn term.pdf | 540 KB | doc
    Play rehearsal list.docx | 184 KB | doc
    Family recipe collection.pdf | 4.2 MB | doc
    Camping equipment checklist.pdf | 620 KB | doc
    History photo archive.zip | 58 MB | doc
    Pottery class exercises.pdf | 2.8 MB | doc
    Choir concert programme.pdf | 910 KB | doc
    Volunteer shift schedule.xlsx | 84 KB | doc
    Apartment inventory form.docx | 228 KB | doc
    Origami folding patterns.pdf | 3.1 MB | doc
    Short story anthology.pdf | 5.6 MB | doc
    Village walking tour map.pdf | 1.9 MB | doc
    Astronomy club minutes.docx | 146 KB | doc
    Quilt block patterns.zip | 12 MB | doc
    Language practice cards.pdf | 840 KB | doc
    Bicycle repair log.xlsx | 168 KB | doc
    Museum activity pack.pdf | 2.3 MB | doc
    Theatre lighting cue sheet.xlsx | 92 KB | doc
    Watercolour sample sheets.pdf | 6.4 MB | doc
    Festival costume sketches.zip | 24 MB | doc
    Board game score sheets.pdf | 480 KB | doc
    Poetry reading notes.docx | 156 KB | doc
  `);
  const DRIVERS = C.rows(`
    Inkjet printer driver (series 4500) | 88.1 MB | driver
    Wireless mouse configuration utility | 23.5 MB | driver
    USB audio interface driver 3.2 | 61.0 MB | driver
    Drawing tablet driver 6.4 | 140 MB | driver
    Label printer driver LP-300 | 34.2 MB | driver
    Webcam HD utility 2.0 | 47.8 MB | driver
    Flatbed scanner driver FS-6200 | 72.4 MB | driver
    Mechanical keyboard utility 1.7 | 18.6 MB | driver
    Ethernet adapter driver 4.1 | 12.8 MB | driver
    Game controller setup utility | 31.5 MB | driver
    Fingerprint reader driver 2.6 | 18.4 MB | driver
    Document camera utility 3.0 | 54.7 MB | driver
    Braille display driver BD-40 | 16.2 MB | driver
    Optical disc drive utility | 15.1 MB | driver
    Temperature sensor driver 2.5 | 102 MB | driver
    Video capture device driver 5.3 | 118 MB | driver
    Serial port adapter driver 1.4 | 2.8 MB | driver
    Digital microscope utility 2 | 44.3 MB | driver
    Barcode reader configuration tool | 22.6 MB | driver
    USB hub firmware utility 2.1 | 17.3 MB | driver
    USB foot pedal driver FP-1600 | 8.4 MB | driver
    Slide projector setup utility | 26.3 MB | driver
    Embroidery machine driver 2.8 | 11.8 MB | driver
  `);
  const AD_BUTTONS = C.lines(`
    DOWNLOAD
    Download Now
    Start Download
    Continue
    Download (Fast)
    Play Now
    Free Download
    Get File
    Install App
    Unlock Access
    Run Now
  `);
  const AD_PRODUCTS = C.rows(`
    FastLoader Download Manager | Up to 10x faster downloads
    PC Speed Booster Pro | Your PC may be slow. Scan now
    SafeSurf VPN | Protect your downloads today
    DriverFix Ultimate | 7 outdated drivers found
    Mighty Converter | Convert any file in one click
    Clean Sweep 2026 | Remove junk files instantly
    Zippindle Fetcher | Keep every download on track
    Velquill Media Kit | Play your favourite formats
    Nimbrell Archive | Unpack archives in seconds
    Tarnodle Backup | Keep a copy of every file
    Briskettle Space | Find large files at a glance
    Mivvle Screen Capture | Record your screen with ease
    Quorble Font Studio | Give your text a fresh look
    Plinkova Audio Mixer | Make every track sound great
    Wispindle Photo Repair | Bring faded photos to life
    Vellnook Organiser | Tidy your desktop in minutes
    Fennuble Links | Store links in one folder
    Pebbrix Document Kit | Create polished pages easily
    Dovvlet Vault | Keep your logins all together
    Crumblet File Search | Find that missing file today
    Glissora Subtitle Kit | Add captions to your videos
    Rillvane Print Preview | Check pages before printing
    Mossindle Note Cards | Turn ideas into tidy notes
    Twillora Themes | Add colour to your workspace
  `);

  // Trick-question checkbox wording: sem 'in' (ticked = receive) / 'out' (ticked = do not receive).
  const TRICK = C.rows(`
    Send me {s} | in
    Leave this box ticked to keep receiving {s} | in
    I do not want to opt out of {s} | in
    Untick this box if you would rather not receive {s} | in
    I don't want to miss out on {s} | in
    Do not send me {s} | out
    Tick this box if you would prefer not to receive {s} | out
    Tick to opt out of {s} | out
    I do not wish to receive {s} | out
    Uncheck this box if you would like to receive {s} | out
    A checked box authorises {s} | in
    I consent to receiving {s} | in
    {s} may be sent while this is checked | in
    Checking here withdraws permission for {s} | out
    {s} must stop when this box is checked | out
    A tick here cancels delivery of {s} | out
  `).map(([text, sem]) => ({ text, sem }));
  const SUBJECTS = C.rows(`
    marketing emails | marketing emails
    offers from selected partners | partner offers
    text message promotions | promotional texts
    personalised ads based on my activity | personalised ads
    the weekly newsletter | the newsletter
    calls from our sales team | sales calls
    product updates by email | product update emails
    special offers by post | postal offers
    app push promotions | app push ads
    browser push promotions | browser push ads
    marketing messages by fax | fax marketing
    promotions during live chat | chat promotions
    untargeted video adverts | untargeted video ads
    generic audio promotions | untargeted audio ads
    adverts on paper receipts | receipt ads
    generic social inbox ads | social inbox ads
    untargeted search ads | generic search ads
  `).map(([s, noun]) => ({ s, noun }));

  const CONSENT_OK = new Set(['Send me offers from selected partners', 'Share my purchase history to personalise ads',
    'Allow partners to contact me by phone', 'Sign me up for the weekly newsletter',
    'Use my data to train recommendation models']);

  Object.assign(env.taskOf('avoid-dark-patterns').lib, { MONTHS, SHOPS, AIRLINES, HOTEL_SITES, TICKETERS, FOOD, RENTALS, SUBS, DESIGN_APPS, NEWS, FILE_SITES, APPS, APP_ITEMS, EVENTS, HOTELS, CARS, SOFTWARE, DOCS, DRIVERS, AD_BUTTONS, AD_PRODUCTS, TRICK, SUBJECTS, CONSENT_OK });
})();
