/*
 * kit/content/commerce.js: companies, products, dishes, currencies, prices, order/invoice/tracking codes.
 * API: see the header of kit/content/core.js. All names are fictional.
 */
(function () {
  'use strict';
  const C = env.content;
  const L = C.lines;

  const COMPANIES = L(`
    Northwind Logistics
    Bluepeak Labs
    Okafor & Sons
    Halvorsen Group
    Meridian Analytics GmbH
    Saltmarsh Coffee Co.
    Ironbridge Legal LLP
    Copperleaf Studio
    Tallgrass Health
    Kestrel Systems
    Juniper Savings Bank
    Lumenworks
    Brightline Dental
    Quillfeather Press
    Harbor & Pine Outfitters
    Greyhaven Consulting
    Fennimore Architects
    Silverbirch Software
    Redfern Engineering
    Moonlit Bakery
    Cobalt Freight
    Ashgrove Property Management
    Tidewater Marine Supply
    Westbrook Accounting
    Sunfield Farms
    Larkspur Florists
    Pemberton & Clay
    Vantage Point Realty
    Hollowell Insurance
    Driftwood Surf School
    Starling Bikes
    Orchard Lane Grocers
    Mosaic Learning
    Bramble & Rye
    Clearwater Utilities
    Summit Ridge Outdoor
    Nakamura Precision
    Delacroix Atelier
    Rivera Family Dentistry
    Bergström Design
    Mwangi Agritech
    Patel Pharmacy
    Kowalski Brothers Plumbing
    Lindqvist Furniture
    Adeyemi Textiles
    Haddad Imports
    Castillo Construction
    Moreau Wines
    Fischer Elektro
    Tanaka Robotics
    Sorensen Shipping
    Al-Rashid Trading
    Chen & Partners
    Oyelaran Media
    Duarte Ceramics
    Brightwater Pools
    Foxglove Pediatrics
    Hartwell Hardware
    Cinderpath Running Club
    Paperplane Travel
    Glasswing Optics
    Ninebark Landscaping
    Wildflower Yoga
    Granite State Movers
    Old Mill Brewing Company
    Riverstone Clinic
    Elmstead Library Friends
    Kingfisher Air
    Sablewood Interiors
    Tessellate AI
    Pinecrest Veterinary
    Hearthstone Home Care
    Ravenglass Security
    Marigold Catering
    Featherlight Drones
    Ember & Oak Grill
    Seabright Ferries
    Cartwright Auto Repair
    Highline Fitness
    Ostrander Law Office
    Willowbank School
    Thornbury Estates
    Bellweather Research
    Lighthouse Credit Union
    Waverly Print Shop
    Alder & Finch
    Brookside Pet Supply
    Crestview Hotels
    Gallowglass Games
    Velvet Hammer Records
    Bluebonnet Bakeshop
    Ironwood Timber
    Ocelot Payments
    Starboard Analytics
    Twin Rivers Hospital
    Cardinal Courier
    Peregrine Data
    Basalt Mining Corp.
    Opal Coast Resorts
    Linden Street Books
    Gilded Spoon Cafe
    Hawthorne Capital
    Saffron Kitchen
    Polaris Telecom
    Wexford Tailors
    Blue Heron Kayaks
    Sundial Solar
    Grove Street Laundry
    Fairhaven Pediatric Group
    Nightjar Studios
    Arcadia Garden Center
    Ridgeline Roofing
    Corvid Cyber
    Quarry Hill Dairy
    Atlas & Ivy
    Brindle Dog Training
    Cascade Water Co.
    Meadowlark Music
    Bayleaf Bistro
    Firefly Electric
    Halcyon Spa
    Maple & Mortar
    Northstar Robotics
    Oakmont Tutoring
    Pebblebrook Preschool
    Quicksilver Couriers
    Rosewood Hospice
    Sterling & Vane
    Tamarind Thai Kitchen
    Upland Coffee Roasters
    Verdant Labs
    Whistler Ski Rentals
    Yellowbird Taxi
    Zinnia Floral Design
    Amberline Shipping
    Beacon Hill Partners
    Cedar & Sage Apothecary
    Dovetail Joinery
    Everglow Lighting
    Foxhollow Farm
    Goldcrest Jewelers
    Highwater Kayak Tours
    Inkwell Stationers
    Jadeport Trading
    Keystone Masonry
    Lattice Biotech
    Mistral Aviation
    Nettlebed Organics
    Obsidian Games
    Parchment & Quill
    Quayside Fish Market
    Rookery Hostel
    Silverline Rail
    Tarragon Health Foods
    Umbra Photography
    Vireo Software
    Wolfsbane Tattoo
    Xylem Water Tech
    Yarrow Clinic
    Zenith Elevators
    Applewood Smokehouse
    Blackthorn Distillery
    Coral Reef Dive Center
    Dunmore Hardware
    Eastgate Pharmacy
    Fieldstone Bank
    Gristmill Bakery
    Harrowgate Logistics
    Islington Cycle Works
    Jasper & Lowe
    Kinship Family Health
    Lockhart Locksmiths
    Merriweather Events
    Nimbus Cloud Services
    Overbrook Hotel Group
    Pinnacle Physio
    Quarterdeck Seafood
    Rainier Outfitters
    Seaglass Pottery
    Thistle & Thorn
    Undercroft Wine Bar
    Vellum Books
    Wavecrest Swim School
    Yew Tree Vets
    Zephyr Wind Energy
    Bianchi & Figli
    Schulz Bau GmbH
    Lefebvre et Fils
    Van Dijk Bloemen
    Nowak Transport
    Sato Shoten
    Kim's Corner Market
    Nguyen Pho House
    Mensah Consulting
    Diallo Couture
    Hosseini Rugs
    Gupta Electronics
    Reyes Auto Body
    Ivanova Translation Services
    Batbayar Tours
    O'Connor's Pub
    Santos Imobiliária
    Romano Pasta Fresca
    Jansen Fietsen
    Wiśniewska Studio
    Yılmaz Kebab House
    Andersson Snickeri
    Dlamini Solar
    Nakamura Ramen
    Zhang Tea Merchants
    Bluepeak Capital
    Fernhill Academy
    Copper Kettle Diner
    Wren & Ivy Boutique
    Lakeshore Animal Hospital
    Stonebridge Insurance Brokers
    Trillium Home Health
    Uplift Coworking
    Vista Optometry
    Woodward Plumbing & Heating
    Acorn Payroll
    Bridgewell Recruiting
    Clover Credit Union
    Daybreak Bagels
    Echo Valley Ranch
    Fable & Fern
    Glimmer Glass Studio
    Hilltop Hardware
    Indigo Bay Apartments
    Jubilee Party Rentals
    Kettle & Crumb
    Lodestar Navigation
    Mainspring Watch Repair
    Northgate Mall Management
    Orbit Labs
    Prairie Wind Bakery
    Quill & Cask
    Redtail Air Charter
    Signal Hill Radio
    Tinker Toys Workshop
    Urbana Bike Share
    Verity Audit Partners
    Westwind Sailing
    Morrowfield Instruments
    Carmine & Slate
    Borealis Paperworks
    Cypress Gate Security
    Matsuoka Toolworks
    Klein & Morgen Möbel
    Riversong Kayak Supply
    Bellwether Orchard Co.
    Trestlebridge Surveying
    Poppyseed Lunchroom
    Frostline Cold Storage
    Sundown Stagecraft
    Holloway Bicycle Repair
    Kikuya Market
    Briarstone Glassworks
    Crestfall Data Systems
    Rojas Hermanos Maderas
    Greystone Composting
    Mariner's Ledger
    Larkspur Ridge Winery
    Kestrel Creek Nursery
    Voss & Alder Design
    Faraday Field Services
    Little Lantern Toy Co.
    Matsuda Bento Kitchen
    Oriole Fleet Services
    Duskwood Candle Studio
    Palisade Orchard Supply
    Rothwell Bicycle Parts
    Juniper Vale Retreat
    Sable Harbor Boatworks
    Hinterland Geospatial
    Crown & Thimble
    Marlow Creek Apiary
    Vega Instrument Repair
    Bramblegate Records
    Sora Ceramics Workshop
    Ridgeway Glass & Mirror
    Lindenbrook Shuttle
    Falkenstein Werkstatt
    Mica Street Tailoring
    Hearthside Grain Mill
    Clearfork Irrigation
    Nightingale Event Hire
    Yamamoto Lantern Works
    Asterwell Mobility
    Bayside Ledgerworks
    Dappled Finch Foods
    Fablebrook Lodging
    Gossamer Threadworks
    Ivory Tower Archives
    Koru Pacific Imports
    Morroway Transit
    Noble Fir Carpentry
    Ochreline Surveyors
    Peregrine Harbor Tours
    Rillstone Software
    Safflower Textile House
    Tumbleweed Seed Company
    Aldebaran Audio
    Bramwell Cycle Couriers
    Canto Verde Produce
    Goldenrod Signworks
    Hushwood Recording
    Isla Norte Guesthouse
    Loma Vista Ceramics
    Mossbank Data Studio
    Narrowboat Fabrication
    Pavilion Street Cinema
    Sundew Botanical Supply
    Tandem Grove Architects
    Woolwich Clockmakers
    Alderwick Envelope Co.
    Birchline Cold Brew
    Eiderdown Linen House
    Fallow Creek Apiaries
    Glenhaven Ferry Company
    Horizon Loom Collective
    Inlet & Isthmus Maps
    Jubilee Costume House
    Madrigal Music Exchange
    Nacre Coast Shellcraft
    Old Quarry Stoneworks
    Plover Hill Cheese
    Rook & Ribbon Floristry
    Sable Peak Geology
    Arawak Coast Canoe Hire
    Cairngorm Wool Spinners
    Delta Finch Freightways
    Elmbrook Kitchenware
    Fjordline Navigation
    Ginkgo Paper Atelier
    Indigo Current Swimwear
    Juno Park Conservatory
    Kalliope Sound Library
    Lowland Bicycle Co-op
    Nori Bay Ferments
    Olivegate Pantry
    Palisade Trail Maps
    Ravenwood Letterpress
    Ternhaven Birding Tours
    Umber & Wren Fine Goods
    Vesper Grove Retreats
    Aurum Bridge Foundry
    Bluebird Parcel Works
    Dahlia Street Tailors
    Everglen Windowcraft
    Fabletide Story House
    Granary Row Milling
    Ilex Ridge Tree Care
    Orchard Bell Ciderworks
    Quarryside Metalcraft
    Redwood Vale Horse Tack
    Seabank Ropeworks
    Boreal Loomworks
    Cairnside Geotechnics
    Dunewatch Solar Works
    Eastwind Sashimi Bar
    Fennel & Fig Market
    Gable House Restoration
    Icelandic Wool Guild
    Jasperfield Seedlings
    Northgate Orchard Press
    Osprey Bend Boat Rental
    Pineglass Conservatory
    Wicklow Stone & Tile
    Auburn Vale Bookbindery
    Belltower Brassworks
    Grove Lantern Lighting
    Iris Point Photo Lab
    Kobayashi Noodle Works
    Mallowmere Childcare
    Rosehip Ridge Preserves
    Tideland Oyster Company
    Violet Hour Tea Room
    Westmere Woolens
    Yonderfield Aviation
    Bramblewick Bookkeeping
    Dunstan Peak Hydraulics
    Foxtail Field Recording
    Gullwing Glasshouse
    Hinterlake Canoe Club
    Jade Willow Tea House
    Kauri Coast Timbercraft
    Morrowstone Masonry
    Opaline Leatherworks
    Pinebarrel Cider House
    Sable Orchard Milling
    Wattlebird Music Supply
    Yarrowfield Coachworks
    Bramble Creek Hatmakers
    Dovetail Hill Cabinetry
    Islet Bay Spice Works
    Limestone Street Studio
    Narrowleaf Herb Nursery
    Ridgecap Roofing Supply
    Ume Orchard Bento
    Verdigris Metal Studio
    Westhaven Bell Foundry
    Windward Atlas Company
    Yuzu Street Dumplings
    Mossvale Orchard Supply
    Fallowmere Bookbinders
    Rainshadow Apiary
    Hearthway Floorcraft
    Tamarack Valley Coaches
    Blueglass Surveying
    Pine & Purl Yarn Shop
    Redstone Clock Repair
    Willowrun Seed Library
    Silverwell Audio Lab
    Mallowbrook Creamery
    Oaken Door Restoration
    Windlass Harbor Tours
    Eastmere Foundry
    Kitehouse Letterpress
    Wild Rye Fermentation
    Amberwick Brass Studio
    Lowtide Netmakers
    Glenfold Music Lessons
    Saffron Gate Imports
    Stonewake Canoe Company
    Marble Finch Tileworks
    Dunridge Apiary Supply
    Lark & Lintel Builders
    Tanglebay Sea Glass
    Bellflower Seedlings
    Harborstead Rope & Sail
    Fablehouse Puppetmakers
    Westbarrow Dairy
    Juniper Hollow Maps
    Slatewing Drone Repair
    Birch & Brine Soapworks
    Mothlight Camera Repair
    Ashen Vale Coachworks
    Tern Point Bookshop
    Redwillow Pottery Kilns
    Blue Alder Upholstery
    Starling Quay Chandlers
    Sundrift Window Repair
    Coppercap Brewing House
    Loom & Lantern Fabrics
    Hollowmere Stables
    Marshlight Bird Tours
    Quarry Brook Sculpture
    Cedar Vale Honeyworks
    Larkstone Metal Roofing
    Fable & Foundry Toys
    Old Beacon Mapmakers
    Mallow & Moss Florists
    Silverstrand Sailcloth
    Rookwood Piano Tuning
    Red Kite Orchard Cider
    Fernbank Trail Builders
    Wool & Willow Menders
    Crestline Cabinet Works
    High Meadow Seed Co-op
    Tamarisk Paper Studio
    Fjord & Field Woolens
    Eastcliff Stone Masonry
    Plover House Book Arts
    Copperwind Millwrights
    Rill & Reed Basketry
    Willowglass Greenhouses
    Meadowthread Quiltworks
    North Orchard Pressing
    Marsh & Mountain Guides
    Cattail Paper Company
    Briarvale Sawmill
    Ravenhill Leather Goods
    Bright Acre Farmstand
    Tumblebrook Toymakers
    Eider Creek Linenworks
    Cairnfield Trail Supply
    Cloverstone Millinery
    Tideway Cartography
    Foxglove Hill Granary
    Saltmarsh Boat School
    Oriole Street Tailors
    Blue Slate Quarrying
    Northpass Snowshoe Hire
    Old Orchard Clockworks
    Hearthstone Clay Supply
    Bayshore Kite Workshop
    Sagebrush Loom Company
    Oxbow Street Printworks
    Quietwater Canoe Works
    Mica Vale Stonecutters
    Sundown Woodwind Repair
    Rookery Hill Bird Feed
    Ternfield Trail Maps
    Willow & Wattle Baskets
    Harbor Moon Net Loft
    Pine Needle Paper Mill
    Glen Willow Dairy Farm
    Morrow & Mica Lapidary
    Sableline Sail Repair
    Tumblefern Seed Company
    Kobold Creek Woodcraft
    Cliffside Cider Cellars
    Northwood Flute Makers
    Ebbstone Harbor Pilots
    Frost & Fennel Pantry
    Briar Lane Book Repair
    Larkspur Hollow Apiary
    Moorland Music Boxes
    Dunewood Farm Kitchens
    Glenhaven Clock Repair
    Quarry Gate Forge
    Saffron Vale Spice Mill
    Cinderbrook Glasshouse
    Ridge & River Surveyors
    Harbor Oak Boat Repair
    Pine Hearth Stove Works
    Windward Wool Dyehouse
    Old Fern Bicycle Works
    Pewter Finch Foundry
    Redcap Costume Works
    Farside Field Recording
    Tide & Timber Boatworks
    Crescent Bay Shellcraft
    Mossy Lantern Cinema
    Juniper Quill Copyhouse
    Larkwell Mobility Works
    Quarry Lantern Lighting
    Violet Marsh Apiaries
    Yarrow & Slate Masonry
    Driftwell Audio Post
    Hearthglen Quilt Studio
    Islewood Boat Storage
    Linden Quay Fish Market
    Ploverstone Press
    Sablewick Model Railway
    Glenvale Book Arts
    Vellum Grove Book Arts
    Yewfield Seed Company
    Junction House Film Lab
    Mica Harbor Chandlery
    Orchard Gate Farm Stays
    Pinecone Music School
    Quarrybrook Tile Studio
    Ravenstone Rope Makers
    Upstream River Guides
    Vesper Hill Letterpress
    Bluewater Foundry Works
    Elm & Iron Stairworks
    Flint Harbor Navigation
    Hawthorn Row Millinery
    Norridge Snow Gear
    Oyster Bay Net Repair
    Pinecone Ridge Forestry
    Quiet Fern Herb Growers
    Verde Mesa Stonecutting
    Yewstone Clockmakers
    Cairnview Cartography
    Fernhill Grain Roasters
    Oak & Ember Firewood
    Redwing Lantern Repair
    Yonder Peak Ski Tuning
    Eaglewick Model Makers
    Rosebank Seed Savers
    Upland Quill Stationery
    Yarrow Bay Canoe Hire
    Eastbank Textile Repair
    Jadeleaf Garden Nursery
    Redbrook Wool Spinners
    Saltwind Harbor Pilots
    Thistle Vale Upholstery
    Ume Street Noodle Shop
    Violet Crown Stationers
    Windbreak Tree Nursery
    Yondergate Model Trains
    Dunewood Carton Works
    Ebb Harbor Marine Radio
    Glenhaven Puppet Stage
    Hawthorn Vale Luthiers
    Ravenmere Textile Dyers
    Upland Cove Boat School
    Yew & Yonder Publishing
    Inlet Road Music Repair
    Kestrel Coast Ropeworks
    Larchwood Geomatics
    Mallowfield Toy Library
    Oxbow Creek Farmstand
    Pine Vale Scaffolding
    Quillstone Audio Books
    Riversong Loom Repair
    Ume Harbor Tea Room
    Vesper Lane Hatmakers
    Windrow Seed Cleaning
    Eaglepoint Rope Access
    Gullwing Bicycle Studio
    Isle Gate Charter Boats
    Mallow Tree Paper Goods
    Red Fern Music Lessons
    Tanglewood Farm Stays
    Underhill Stone Carving
    Wrenstone Boat Trailers
    Cedarbrook Toy Repair
    Dunlin Vale Wool Dyeing
    Foxbarrow Wool Exchange
    Greycap Telescope Works
    Marlowe Quay Ropewalk
    Narrowfield Dye Garden
    Pinecross Winter Guides
    Sedgewater Bookbindery
    Violetstone Dairy Guild
    Dunridge Paper Lanterns
    Glenbriar Stonecutting
    Hearthmere Seed Library
    Mallowfen Wool Carders
    Oxbow Lantern Archive
    Sablefern Book Repair
    Umefield Botanical Dyes
    Westcairn Trail Markers
    Frostvale Map Engravers
    Gullmere Orchard Press
    Oakenmere Clockworks
    Windrift Lantern Hire
    Ravenwick Harbor Pilots
    Upland Reach Wool Mill
    Wrenfall Seed Cleaning
    Yarrowstone Book Arts
    Dapple Vale Kite Makers
    Fern & Fathom Surveying
    Jade Quill Letterpress
    Morrow Fen Boat Storage
    Quiet Harbor Net Loft
    Redwick Field Recording
    Umberstone Sash Works
    Wattle Cove Sea Charts
    Yewbarrow Farm Kitchens
    Bracken Quay Ropeworks
    Dawnridge Clockmakers
    Eskerbrook Wool Dyers
    Glimmerfen Window Glass
    Inkwake Book Menders
    Tarnside Orchard Cider
    Umebrook Tea Blenders
    Vesper Marsh Map Room
    Cairnside Wool Combers
    Eastward Sound Archive
    Glenmoss Seed Exchange
    Ironvale Garden Gates
    Juniper Bay Sail Repair
    Oxbow Vale Clock Repair
    Redwillow Textile Looms
    Sableford Lantern Glass
    Westmere Field Kitchen
    Amber Quay Tide Clocks
    Elderfen Wool Felting
    Irongate Seed Merchants
    Orchardwick Woodturners
    Quince Bay Map Printing
    Windward Field Geology
    Cairn Harbor Icehouse
    Dunwick Seedling Trays
    Fallow Bay Sailmakers
    Yew Creek Ropewalk
    Dunmere Wool Scouring
    Hollowfern Seed Press
    Narrowbrook Dairy Vats
    Oaken Quay Harbor Maps
    Ridgewater Rowboat Oars
    Saltwick Wind Chimes
    Tanglefen Loom Parts
    Alderwick Toy Soldiers
    Glenwillow Flax Growers
    Inlet Vale Clock Dials
    Juniperstone Map Cases
    Quincewick Orchard Nets
    Underbank Canal Tours
    Yarrowfen Boat Caulking
    Ashwick Pattern Cutters
    Cedar Quay Hull Survey
  `);

  const PRODUCT_CATEGORIES = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'grocery', label: 'Grocery' },
    { id: 'clothing', label: 'Clothing & Shoes' },
    { id: 'home', label: 'Home' },
    { id: 'kitchen', label: 'Kitchen & Dining' },
    { id: 'office', label: 'Office Supplies' },
    { id: 'books', label: 'Books' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'sports', label: 'Sports & Outdoors' },
    { id: 'beauty', label: 'Beauty & Personal Care' },
    { id: 'garden', label: 'Garden' },
    { id: 'pets', label: 'Pet Supplies' },
    { id: 'auto', label: 'Automotive' },
    { id: 'music', label: 'Musical Instruments' },
    { id: 'health', label: 'Health & Household' },
    { id: 'baby', label: 'Baby' },
    { id: 'tools', label: 'Tools & Hardware' },
  ];

  // name | priceMin | priceMax | unit (optional), prices in USD
  const RAW_PRODUCTS = {
    electronics: `
      USB-C Charging Cable 2 m | 6 | 15
      USB-C to Lightning Adapter | 9 | 19
      65 W GaN Wall Charger, 3 Ports | 29 | 55
      Wireless Earbuds with Charging Case | 39 | 129
      Over-Ear Noise Cancelling Headphones | 89 | 299
      Bluetooth Speaker, Waterproof (IPX7) | 29 | 99
      27-inch 4K Monitor | 249 | 449
      24-inch Full HD Monitor | 119 | 189
      Mechanical Keyboard, Brown Switches | 59 | 149
      Wireless Mouse, Silent Click | 12 | 39
      Ergonomic Vertical Mouse | 25 | 59
      1080p Webcam with Privacy Cover | 29 | 79
      Portable SSD 1 TB | 79 | 139
      microSD Card 128 GB | 12 | 29
      USB Flash Drive 64 GB (2-pack) | 11 | 22
      10,000 mAh Power Bank | 19 | 45
      Smart Plug (4-pack) | 24 | 49
      Wi-Fi 6 Mesh Router, 2 Units | 129 | 279
      HDMI 2.1 Cable 3 m | 9 | 24
      7-Port USB 3.0 Hub | 19 | 39
      Laptop Stand, Aluminum | 25 | 59
      Fitness Tracker with Heart Rate Monitor | 39 | 99
      E-Reader 6", Glare-Free | 89 | 149
      Digital Photo Frame 10 inch | 59 | 119
      Robot Vacuum with Docking Station | 179 | 499
      Smart Thermostat, 2nd Gen | 99 | 199
      Dash Cam Front and Rear | 59 | 149
      AA Rechargeable Batteries (8-pack) | 14 | 29
      USB-C to USB-A Adapter (2-pack) | 7 | 16
      Wireless Charging Pad, 15 W | 15 | 39
      Bluetooth Earbuds, Open-Ear Design | 29 | 89
      Wired Studio Headphones, Over-Ear | 39 | 119
      Compact Bluetooth Speaker, 10 W | 19 | 59
      32-inch QHD Monitor | 219 | 399
      Portable Monitor, 15.6-inch Full HD | 119 | 249
      Bluetooth Trackball Mouse | 39 | 89
      USB Condenser Microphone with Stand | 39 | 109
      4K Webcam with Autofocus | 59 | 149
      External Hard Drive 2 TB | 59 | 109
      microSD Card 256 GB | 19 | 49
      USB Flash Drive 128 GB | 12 | 25
      20,000 mAh Power Bank with USB-C | 29 | 69
      Indoor Security Camera, 2K Resolution | 39 | 99
      Wi-Fi 6 Router, Dual-Band | 69 | 159
      DisplayPort Cable 2 m | 8 | 19
      USB-C Docking Station, 8 Ports | 49 | 129
      Adjustable Monitor Arm, Single Screen | 39 | 99
      Smartwatch with GPS | 89 | 249
      E-Reader 7", Warm Light | 119 | 219
      Digital Voice Recorder, 32 GB | 39 | 99
      Air Purifier with App Control | 89 | 229
      Smart LED Bulbs, Color, 4-pack | 24 | 59
      USB-C to HDMI Adapter | 12 | 29
      Laptop Privacy Screen, 14-inch | 29 | 69
      2.1-Channel Soundbar with Subwoofer | 99 | 299
      Mini LED Projector, 1080p | 119 | 349
      Smart TV, 50-inch 4K UHD | 249 | 499
      Indoor HDTV Antenna, Long Range | 18 | 45
      Universal Remote Control | 12 | 29
      Wireless Presentation Clicker | 19 | 49
      Portable CD Player with Bluetooth | 39 | 89
      Turntable with Built-In Speakers | 89 | 199
      Compact Digital Camera, 20 MP | 129 | 299
      Instant Print Camera Bundle | 69 | 149
      LED Ring Light with Phone Holder | 19 | 49
      Tripod, 60-inch with Phone Mount | 18 | 45
      USB Audio Interface, 2 Inputs | 79 | 189
      MIDI Keyboard Controller, 49 Keys | 79 | 199
      Digital Piano, 88 Weighted Keys | 299 | 799
      Bluetooth Transmitter and Receiver | 19 | 49
      Smart Water Leak Sensor, 3-pack | 29 | 69
      Video Doorbell with Chime | 59 | 149
      Cable Management Box with Power Strip | 24 | 59
      Wireless Charging Stand, 3-in-1 | 29 | 89
      Bluetooth Headphones, Foldable On-Ear | 29 | 79
      Desktop Speakers, 2.0 Stereo Pair | 29 | 99
      Ultrawide Monitor, 34-inch WQHD | 299 | 699
      Mechanical Keyboard, Blue Switches | 49 | 129
      Wireless Numeric Keypad | 15 | 39
      USB-C Trackpad, Multi-Touch | 39 | 99
      Document Scanner, Duplex | 129 | 349
      USB-C Capture Card, 4K Input | 49 | 149
      External Blu-ray Drive, USB-C | 69 | 149
      USB-C Flash Drive 256 GB | 19 | 39
      Ethernet Switch, 8-Port Gigabit | 19 | 49
      USB-C KVM Switch, Dual Computer | 59 | 159
      Laptop Cooling Pad with Quiet Fans | 19 | 49
      Smartwatch Charging Dock | 15 | 39
      Compact Projector Screen, 100-inch | 49 | 129
      TV Wall Mount, Full Motion | 29 | 79
      HDMI Switch, 5 Inputs with Remote | 19 | 49
      Film Scanner for 35 mm Slides | 89 | 229
      USB-C to Ethernet Adapter, 2.5 Gbps | 19 | 49
      Smart Door Lock with Keypad | 89 | 229
      Whole-Home Wi-Fi 7 Router | 179 | 399
      Laser Printer, Monochrome | 99 | 249
      Portable Label Maker with Bluetooth | 29 | 79
      Digital Multimeter with Auto-Ranging | 19 | 59
      Electric Guitar Amplifier, 20 W | 79 | 199
      Portable Voice Amplifier with Headset | 29 | 79
      Desktop Audio Mixer, 6 Channels | 69 | 179
      Smart Display with 8-inch Screen | 69 | 149
      Digital Bathroom Scale with Bluetooth | 19 | 49
      Weather Station with Outdoor Sensor | 39 | 109
      Solar-Powered Wildlife Camera | 79 | 199
      USB-C Battery Tester with LCD Screen | 15 | 39
      Compact Thermal Label Printer | 69 | 169
      Digital Binoculars with Recording | 99 | 249
      Smart Ceiling Fan Controller | 29 | 69
      USB-C Portable Blu-ray Burner | 89 | 179
    `,
    grocery: `
      Organic Rolled Oats 1 kg | 3 | 7 | bag
      Extra Virgin Olive Oil 500 ml | 7 | 16 | bottle
      Basmati Rice 2 kg | 5 | 11 | bag
      Whole Bean Coffee, Medium Roast 340 g | 9 | 18 | bag
      Green Tea, 40 Bags | 3 | 8 | box
      Free-Range Eggs, Dozen | 3 | 7 | carton
      Greek Yogurt, Plain 500 g | 3 | 6 | tub
      Sourdough Loaf 800 g | 4 | 8 | each
      Unsalted Butter 250 g | 2 | 5 | pack
      Aged Cheddar 200 g | 4 | 9 | pack
      Bananas, Fair Trade | 0.5 | 1.5 | lb
      Honeycrisp Apples | 1.5 | 3.5 | lb
      Baby Spinach 142 g | 3 | 5 | clamshell
      Cherry Tomatoes 250 g | 2 | 4 | punnet
      Avocados, Ripe (4-pack) | 4 | 7 | pack
      Chickpeas, Canned 400 g | 0.8 | 2 | can
      Penne Rigate 500 g | 1 | 3 | pack
      Marinara Sauce 680 g | 3 | 6 | jar
      Almond Milk, Unsweetened 1 L | 2 | 4 | carton
      Dark Chocolate 70% 100 g | 2 | 5 | bar
      Wildflower Honey 340 g | 5 | 11 | jar
      Sparkling Water, Lime (12 x 355 ml) | 4 | 8 | case
      Peanut Butter, Crunchy 454 g | 3 | 6 | jar
      Frozen Blueberries 600 g | 4 | 8 | bag
      Salted Pistachios 300 g | 6 | 12 | bag
      Chicken Thighs, Boneless | 3 | 6 | lb
      Atlantic Salmon Fillet | 9 | 16 | lb
      Steel-Cut Oats 750 g | 3 | 7 | bag
      Avocado Oil 500 ml | 8 | 17 | bottle
      Jasmine Rice 2 kg | 4 | 10 | bag
      Ground Coffee, Dark Roast 340 g | 8 | 17 | bag
      Chamomile Tea, 30 Bags | 3 | 8 | box
      Large Brown Eggs, Dozen | 3 | 7 | carton
      Cottage Cheese 450 g | 3 | 6 | tub
      Whole Wheat Pita, 6-count | 3 | 6 | pack
      Feta Cheese 200 g | 4 | 9 | pack
      Pears, Bartlett | 1 | 3 | lb
      Navel Oranges | 1 | 2.5 | lb
      Romaine Hearts, 3-count | 3 | 6 | pack
      English Cucumber | 1 | 3 | each
      Red Bell Peppers, 3-pack | 3 | 6 | pack
      Black Beans, Canned 400 g | 0.8 | 2 | can
      Couscous 500 g | 2 | 5 | box
      Pesto Sauce 190 g | 3 | 7 | jar
      Oat Milk, Original 1 L | 2 | 4 | carton
      Milk Chocolate with Sea Salt 100 g | 2 | 5 | bar
      Maple Syrup 250 ml | 6 | 13 | bottle
      Ginger Ale, 6 x 355 ml | 4 | 8 | pack
      Tahini 300 g | 4 | 8 | jar
      Frozen Peas 750 g | 2 | 5 | bag
      Raw Cashews 250 g | 5 | 10 | bag
      Ground Turkey | 4 | 8 | lb
      Pork Tenderloin | 5 | 10 | lb
      Quinoa, Tri-Color 500 g | 4 | 9 | bag
      Coconut Milk, Full-Fat 400 ml | 2 | 4 | can
      Whole Grain Mustard 200 g | 3 | 6 | jar
      Dried Mango Slices 200 g | 4 | 8 | bag
      Leeks, Fresh | 1.5 | 3 | lb
      Sweet Potatoes | 1 | 2.5 | lb
      Shiitake Mushrooms 150 g | 4 | 8 | pack
      Cauliflower, Whole | 3 | 6 | each
      Soba Noodles 300 g | 3 | 6 | pack
      Red Lentils 1 kg | 4 | 8 | bag
      Tomato Paste 156 g | 0.8 | 2 | can
      Rice Vinegar 300 ml | 2 | 5 | bottle
      Coconut Sugar 500 g | 4 | 8 | bag
      Sunflower Seed Butter 350 g | 5 | 9 | jar
      Gouda Cheese 200 g | 4 | 9 | pack
      Ricotta Cheese 425 g | 3 | 7 | tub
      Smoked Tofu 250 g | 3 | 6 | pack
      Ground Beef, Lean | 5 | 9 | lb
      Pork Sausage Links 450 g | 5 | 9 | pack
      Whole Grain Crackers 250 g | 3 | 6 | box
      Dried Cranberries 200 g | 3 | 6 | bag
      Lemonade, Lightly Sweetened 1 L | 3 | 6 | bottle
      Kombucha, Ginger 4 x 330 ml | 7 | 12 | pack
      Frozen Edamame, Shelled 400 g | 3 | 6 | bag
      Canned Pumpkin Puree 425 g | 2 | 4 | can
      Corn Tortillas, 12-count | 2 | 5 | pack
      Extra-Firm Tofu 400 g | 2 | 5 | pack
      Red Grapes, Seedless | 2 | 4 | lb
      Yellow Onions, 3 lb | 3 | 6 | bag
      Carrots, Whole 1 kg | 2 | 4 | bag
      Broccoli Crowns | 2 | 4 | lb
      Zucchini, Fresh | 1 | 3 | lb
      Lemons, 4-count | 2 | 5 | bag
      Pineapple, Whole | 3 | 6 | each
      Plain Bagels, 6-count | 3 | 6 | pack
      Rolled Rye Flakes 500 g | 3 | 7 | bag
      Farro 500 g | 4 | 8 | bag
      Orzo Pasta 500 g | 2 | 4 | pack
      Arrabbiata Pasta Sauce 650 g | 3 | 7 | jar
      Sardines in Olive Oil 120 g | 2 | 5 | can
      Vegetable Broth 946 ml | 2 | 4 | carton
      Canned Artichoke Hearts 400 g | 3 | 6 | can
      Black Sesame Seeds 200 g | 3 | 6 | jar
      Dried Apricots 250 g | 4 | 8 | bag
      Pecan Halves 200 g | 5 | 10 | bag
      Plain Kefir 1 L | 3 | 6 | bottle
      Mozzarella Pearls 200 g | 4 | 8 | tub
      Chicken Breast, Boneless | 4 | 8 | lb
      Beef Stew Meat | 6 | 11 | lb
      Frozen Mango Chunks 500 g | 4 | 8 | bag
      Coconut Water 1 L | 3 | 6 | carton
      Cornmeal 900 g | 2 | 5 | bag
      Pearl Barley 500 g | 2 | 5 | bag
      Sun-Dried Tomatoes 200 g | 4 | 8 | jar
      White Miso Paste 300 g | 4 | 8 | tub
      Cannellini Beans, Canned 400 g | 0.8 | 2 | can
      Buckwheat Groats 500 g | 3 | 7 | bag
      Dried Figs 250 g | 4 | 8 | bag
      Pumpkin Seeds 200 g | 3 | 7 | bag
      Pine Nuts 100 g | 6 | 12 | bag
      Clementines, 2 lb | 3 | 6 | bag
      Red Cabbage, Whole | 2 | 4 | each
      Green Beans, Fresh | 2 | 4 | lb
      Celery Hearts, 2-count | 3 | 6 | pack
      Butternut Squash, Whole | 2 | 5 | each
      Yellow Peaches | 2 | 4 | lb
      Blackberries 170 g | 3 | 6 | clamshell
      Frozen Shrimp, Peeled 450 g | 7 | 13 | bag
      Ground Lamb | 7 | 12 | lb
      Chicken Drumsticks | 2 | 4 | lb
      Provolone Cheese 200 g | 4 | 9 | pack
      Sour Cream 400 g | 2 | 5 | tub
      Cream Cheese 250 g | 2 | 5 | pack
      Honey-Almond Granola 400 g | 5 | 9 | bag
      Puffed Rice Cereal 300 g | 3 | 6 | box
      Whole Wheat Tortillas, 8-count | 3 | 6 | pack
      Coconut Cream 400 ml | 2 | 4 | can
    `,
    clothing: `
      Men's Crew Neck T-Shirt, Cotton | 9 | 25
      Women's Relaxed Fit Hoodie | 29 | 59
      Slim Fit Chinos, Stone | 35 | 69
      High-Rise Straight Jeans | 39 | 89
      Merino Wool Crew Socks (3 pairs) | 18 | 36
      Packable Rain Jacket | 49 | 129
      Quilted Puffer Vest | 45 | 99
      Linen Button-Down Shirt | 35 | 75
      Wrap Midi Dress, Floral | 39 | 89
      Cable Knit Sweater | 45 | 110
      Running Shorts 5" with Liner | 19 | 45
      Leggings with Side Pockets | 22 | 65
      Canvas Low-Top Sneakers | 35 | 75
      Leather Chelsea Boots | 89 | 199
      Trail Running Shoes | 79 | 149
      Wool Beanie | 12 | 29
      Leather Belt, Brown 35 mm | 19 | 49
      Kids' Fleece Jacket | 19 | 39
      Swim Trunks, Quick-Dry | 19 | 45
      Thermal Base Layer Top | 25 | 59
      Pajama Set, Flannel | 29 | 59
      Wide-Brim Sun Hat | 15 | 39
      Waterproof Hiking Boots | 99 | 189
      Silk Scarf 90 x 90 cm | 29 | 79
      Oxford Dress Shoes | 79 | 179
      Women's Ribbed Tank Top | 12 | 29
      Pleated Midi Skirt, Navy | 35 | 79
      Cropped Denim Jacket | 49 | 109
      Cotton Poplin Pajama Shorts | 16 | 35
      Ballet Flats, Suede | 39 | 89
      Leather Crossbody Bag | 59 | 149
      Cotton Baseball Cap | 14 | 32
      Kids' Pull-On Jogger Pants | 18 | 39
      Baby Knit Cardigan | 19 | 42
      Women's Wide-Leg Trousers | 39 | 89
      Men's Linen Drawstring Pants | 35 | 79
      Striped Breton Long-Sleeve Tee | 22 | 49
      Satin Slip Dress, Emerald | 45 | 99
      Fleece-Lined Leggings | 25 | 55
      Leather Loafers, Black | 79 | 169
      Canvas Slip-On Shoes | 29 | 65
      Woven Straw Tote Bag | 25 | 59
      Cashmere Blend V-Neck Sweater | 69 | 159
      Ribbed Knit Gloves | 12 | 28
      Cotton Boxer Briefs (3-pack) | 18 | 39
      Performance Tennis Skirt | 29 | 65
      Men's Quilted Shirt Jacket | 59 | 129
      Men's Oxford Shirt, Light Blue | 39 | 79
      Relaxed Fit Cargo Pants, Olive | 39 | 89
      Denim Shorts, Mid-Rise | 29 | 59
      Ribbed Turtleneck Top | 25 | 55
      Lightweight Bomber Jacket | 49 | 119
      Water-Resistant Windbreaker | 45 | 109
      Wool Blend Peacoat, Navy | 99 | 229
      Corduroy Shirt, Rust | 39 | 79
      Cotton Crewneck Sweatshirt | 25 | 59
      Men's Swim Shorts, Printed | 22 | 49
      Women's Cycling Shorts | 19 | 45
      High-Top Canvas Sneakers | 39 | 79
      Suede Desert Boots | 69 | 139
      Leather Sandals, Two-Strap | 49 | 109
      Mary Jane Flats, Patent | 39 | 89
      Leather Gloves, Lined | 29 | 69
      Woven Leather Wallet | 25 | 59
      Small Quilted Shoulder Bag | 49 | 119
      Baby Cotton Leggings (2-pack) | 14 | 29
      Women's Knit Polo Shirt, Cream | 29 | 65
      Men's Wool Blend Suit Vest | 49 | 109
      Men's Tapered Jogger Pants | 29 | 65
      Chunky Knit Cardigan, Oatmeal | 49 | 109
      Girls' Pleated School Skirt | 18 | 39
      Men's Leather Work Boots | 89 | 189
      Women's Square-Neck Bodysuit | 22 | 49
      Linen Blend Wide-Leg Jumpsuit | 49 | 109
      Quilted Crossbody Belt Bag | 29 | 69
      Kids' Waterproof Rain Pants | 22 | 49
      Women's Wool Blend Cape Coat | 89 | 199
      Ruffle Sleeve Blouse, Ivory | 29 | 65
      Knit Ballet Leg Warmers | 14 | 32
      Women's Pleated Tennis Dress | 39 | 89
      Men's Textured Knit Polo | 29 | 65
      Baby Muslin Romper, 2-pack | 19 | 39
      Suede Ankle Boots, Block Heel | 69 | 149
      Cotton Gauze Beach Cover-Up | 25 | 59
      Men's Thermal Henley Shirt | 25 | 55
      Women's Pleated Wide-Brim Hat | 22 | 49
      Knit Headband, Cable Stitch | 12 | 28
      Kids' Printed Fleece Pajamas | 22 | 45
      Woven Raffia Clutch | 29 | 69
      Women's Cropped Trench Coat | 79 | 169
      Kids' Quilted Liner Jacket | 29 | 59
      Leather Ballet Sneakers | 59 | 129
      Women's Pleated Palazzo Pants | 39 | 89
      Men's Rib-Knit Zip Cardigan | 49 | 109
      Cotton Voile Tunic Blouse | 29 | 65
      Suede Clog Mules | 59 | 129
      Women's Scallop-Edge Knit Vest | 29 | 65
      Men's Relaxed Fit Denim Shirt | 39 | 79
      Printed Chiffon Maxi Skirt | 39 | 89
      Baby Quilted Hooded Romper | 22 | 45
      Leather Driving Moccasins | 79 | 159
      Men's Pinstripe Dress Trousers | 49 | 99
      Kids' Canvas High-Top Shoes | 29 | 59
      Cotton Terry Bathrobe | 35 | 79
      Women's Mesh Ballet Flats | 35 | 75
      Woven Bucket Hat, Wide Brim | 19 | 45
      Leather Saddle Bag | 69 | 159
    `,
    home: `
      Queen Duvet Cover Set, Washed Linen | 79 | 169
      Memory Foam Pillow (2-pack) | 35 | 79
      Blackout Curtains 132 x 213 cm | 25 | 59
      Bath Towel Set, 6 Pieces | 29 | 69
      Cotton Bath Mat | 12 | 29
      LED Desk Lamp with USB Port | 25 | 59
      Floor Lamp, Arc Style | 59 | 149
      Scented Candle, Cedar & Fig 220 g | 14 | 32
      Wall Clock 30 cm, Silent | 19 | 45
      Throw Blanket, Chunky Knit | 29 | 79
      Area Rug 160 x 230 cm | 89 | 249
      Storage Baskets, Woven (Set of 3) | 25 | 55
      Shoe Rack, 4 Tiers | 25 | 59
      Bookshelf, 5 Shelves, Oak Finish | 79 | 179
      Floating Wall Shelves (Set of 2) | 19 | 45
      Picture Frame 8x10, Black | 9 | 22
      Laundry Hamper with Lid | 22 | 49
      Shower Curtain, Waffle Weave | 15 | 35
      Cordless Stick Vacuum | 129 | 349
      Air Purifier with HEPA Filter | 89 | 249
      Ceramic Plant Pot 20 cm | 12 | 29
      Doormat, Coir 45 x 75 cm | 15 | 35
      Bedside Table with Drawer | 49 | 129
      Velvet Accent Chair | 129 | 299
      Full-Length Mirror 150 cm | 59 | 149
      Cotton Percale Sheet Set, Queen | 49 | 119
      Down Alternative Comforter, King | 69 | 159
      Linen Pillowcase Pair | 25 | 59
      Reed Diffuser, Amber 200 ml | 18 | 39
      Ceramic Table Vase 25 cm | 19 | 49
      Rattan Pendant Light Shade | 39 | 99
      Weighted Doorstop, Canvas | 12 | 29
      Folding Step Stool, 2 Steps | 25 | 59
      Over-the-Door Hook Rack, 6 Hooks | 15 | 35
      Cast Iron Dutch Oven 5 qt | 59 | 139
      Acacia Cutting Board 45 cm | 19 | 45
      Cotton Table Runner 180 cm | 15 | 35
      Woven Laundry Basket with Handles | 29 | 69
      Felt Storage Bin, Large | 12 | 29
      Folding Drying Rack, Wall-Mount | 35 | 79
      Handheld Garment Steamer | 29 | 69
      Digital Kitchen Scale, Glass Top | 15 | 35
      Lounge Cushion Covers, Set of 2 | 19 | 45
      Tension Rod, 90-150 cm | 12 | 29
      Upholstered Dining Chair | 49 | 119
      Round Coffee Table, Wood Top | 79 | 189
      Under-Bed Storage Bags (Set of 2) | 19 | 45
      Bathroom Shelf, Freestanding | 25 | 59
      Ceramic Soap Dispenser | 12 | 29
      Enamel Baking Dish, 33 cm | 19 | 49
      Bamboo Serving Tray with Handles | 19 | 45
      Cotton Oven Mitts, Pair | 12 | 29
      Decorative Throw Pillow, 45 cm | 19 | 49
      Wall-Mounted Coat Rack, 5 Hooks | 25 | 59
      Adjustable Bookends, Pair | 12 | 29
      Potted Artificial Fern, 45 cm | 19 | 45
      Solar Pathway Lights, Set of 4 | 25 | 59
      Wool-Felt Dryer Balls, Set of 6 | 12 | 29
      Mattress Protector, Queen | 25 | 59
      Toilet Brush with Holder | 12 | 29
      Wooden Shoe Bench with Cushion | 69 | 159
      Nesting Side Tables, Set of 2 | 59 | 139
      Adjustable Floor Reading Light | 39 | 99
      Pendant Ceiling Light, 3 Bulbs | 59 | 149
      Framed Botanical Print, Set of 3 | 29 | 69
      Jute Basket with Lid, 30 cm | 19 | 45
      Silicone Sink Caddy with Drainage | 12 | 29
      Borosilicate Measuring Cup, 1 L | 12 | 29
      Stainless Steel Colander, 24 cm | 15 | 35
      Nonstick Muffin Pan, 12 Cup | 15 | 35
      Cotton Napkins, Set of 4 | 12 | 29
      Insulated Window Panel, 2 Pieces | 35 | 79
      Reusable Lint Roller with Handle | 9 | 22
      Ceramic Fruit Bowl, 28 cm | 19 | 45
      Bamboo Bath Caddy, Extendable | 25 | 59
      Glass Pendant Light, Globe Shade | 39 | 99
      Wooden Picture Ledge, 60 cm | 19 | 45
      Hanging Shower Organizer, 3 Tiers | 15 | 35
      Wool Area Rug, 120 x 180 cm | 79 | 189
      Wooden Salad Servers, Pair | 12 | 29
      Quilted Mattress Topper, Full | 59 | 139
      Cork Coasters, Set of 6 | 9 | 22
      Folding Patio Side Table, 45 cm | 29 | 69
      Linen Tablecloth, 150 x 250 cm | 29 | 69
      Vacuum Storage Bags, Set of 4 | 15 | 35
      Ceramic Oil Dispenser, 500 ml | 12 | 29
    `,
    kitchen: `
      Stainless Steel Water Bottle 750 ml | 15 | 35
      Cast Iron Skillet 26 cm | 25 | 59
      Nonstick Frying Pan 28 cm | 22 | 55
      Chef's Knife 20 cm | 29 | 129
      Bamboo Cutting Board, Large | 15 | 35
      Glass Food Storage Containers (10-piece) | 25 | 49
      French Press 1 L | 19 | 45
      Pour-Over Coffee Dripper, Ceramic | 15 | 32
      Electric Kettle 1.7 L | 25 | 69
      Stand Mixer 5.5 qt | 199 | 449
      Immersion Blender with Whisk | 29 | 69
      Air Fryer 5.5 L | 69 | 149
      Rice Cooker, 10 Cups | 49 | 129
      Dutch Oven 5.5 qt, Enameled | 59 | 179
      Measuring Cups and Spoons Set | 9 | 22
      Silicone Spatula Set (4 pieces) | 10 | 22
      Dinner Plates, Stoneware (Set of 4) | 29 | 69
      Stemless Wine Glasses (Set of 6) | 19 | 45
      Insulated Lunch Box | 15 | 35
      Spice Rack with 20 Jars | 25 | 49
      Digital Kitchen Scale | 12 | 29
      Reusable Beeswax Wraps (3-pack) | 12 | 24
      Dish Drying Rack, 2-Tier | 25 | 59
      Travel Mug 16 oz, Leakproof | 15 | 32
      Silicone Ice Cube Trays (2-pack) | 9 | 18
      Mandoline Slicer with Guard | 25 | 49
      Electric Citrus Juicer, Compact | 19 | 49
      Acacia Wood Salad Bowl Set | 25 | 59
      Porcelain Serving Platter, Oval | 19 | 45
      Linen Dinner Napkins (Set of 4) | 15 | 35
      Cotton Kitchen Towels (Set of 3) | 9 | 22
      Stainless Steel Colander 24 cm | 12 | 29
      Pasta Maker with Hand Crank | 39 | 99
      Baking Sheet Set (3-piece) | 19 | 45
      Ceramic Pie Dish 23 cm | 15 | 32
      Loaf Pan, Nonstick 9 x 5 in | 10 | 24
      Mortar and Pestle, Granite | 19 | 45
      Pepper Mill, Adjustable Grind | 15 | 39
      Salt and Pepper Shakers, Glass | 9 | 22
      Glass Measuring Jug 1 L | 9 | 22
      Wooden Utensil Set (5 pieces) | 15 | 35
      Stainless Steel Tongs, 30 cm | 9 | 19
      Oven Mitts, Quilted Cotton (Pair) | 12 | 29
      Pot Holders, Woven Cotton (Set of 2) | 9 | 22
      French Rolling Pin, Beechwood | 12 | 29
      Ceramic Butter Dish with Lid | 12 | 29
      Oil and Vinegar Bottles (Set of 2) | 15 | 35
      Bamboo Steamer Basket, 2-Tier | 19 | 45
      Pasta Serving Bowl, Stoneware | 25 | 59
      Reusable Produce Bags (Set of 5) | 9 | 22
      Stainless Steel Potato Masher | 10 | 24
      Espresso Cups, Porcelain (Set of 4) | 19 | 45
      Countertop Compost Bin 5 L | 19 | 45
      Expandable Drawer Organizer, Bamboo | 19 | 49
      Magnetic Knife Holder 40 cm | 19 | 45
      Silicone Baking Mats (Set of 2) | 12 | 29
      Wire Cooling Racks (Set of 2) | 12 | 29
      Stainless Steel Pie Server | 9 | 19
      Ceramic Ramekins (Set of 4) | 12 | 29
      Salad Spinner 4 L | 19 | 45
      Herb Scissors with 5 Blades | 9 | 22
      Four-Sided Cheese Grater | 12 | 29
      Pasta Strainer Spoon, Nylon | 9 | 19
      Ceramic Oil Dispenser 500 ml | 12 | 29
      Reusable Coffee Filters (Set of 2) | 9 | 22
      Cotton Table Runner 180 cm | 15 | 35
      Woven Placemats (Set of 4) | 15 | 35
      Enamel Dutch Oven 4 L | 49 | 129
      Bamboo Sushi Rolling Mat Set | 9 | 22
      Glass Oil Sprayer 200 ml | 12 | 29
      Electric Hand Mixer with Beaters | 25 | 59
      Stoneware Cereal Bowls (Set of 4) | 19 | 45
      Stainless Steel Pizza Cutter Wheel | 9 | 19
      Ceramic Mortar and Pestle Set | 15 | 35
      Bamboo Bread Box with Roll-Top Lid | 29 | 69
      Stainless Steel Wok 32 cm | 29 | 69
      Porcelain Tea Set for Two | 25 | 59
      Adjustable Measuring Spoon Set | 9 | 22
      Glass Pickling Jars (Set of 4) | 15 | 35
      Bamboo Salad Servers (Pair) | 9 | 22
      Electric Milk Frother, Rechargeable | 19 | 45
      Stoneware Ramekin Set with Lids | 15 | 35
      Stainless Steel Ladle 32 cm | 9 | 19
      Silicone Sink Splash Guard | 9 | 22
      Copper Measuring Cups (Set of 4) | 15 | 35
      Ceramic Egg Cups (Set of 4) | 12 | 29
      Insulated Casserole Carrier | 19 | 45
      Wooden Pie Crust Roller, Adjustable | 12 | 29
      Stackable Wire Fruit Basket | 19 | 45
      Ceramic Nonstick Crepe Pan 25 cm | 25 | 59
      Bamboo Steamer Liners (Set of 50) | 9 | 18
      Handheld Milk Frothing Wand | 12 | 29
      Electric Food Chopper 500 ml | 19 | 45
      Insulated French Press 1 L | 29 | 69
      Stainless Steel Bread Knife 25 cm | 19 | 49
      Glass Butter Keeper with Water Seal | 12 | 29
      Stoneware Ramen Bowls (Set of 2) | 19 | 45
      Acacia Wood Cake Stand 30 cm | 25 | 59
      Ceramic Garlic Grater Plate 13 cm | 9 | 22
      Wooden Pastry Brush and Scraper Set | 9 | 22
      Stainless Steel Tea Infuser Basket | 9 | 19
      Insulated Beverage Dispenser 3 L | 29 | 69
      Porcelain Butter Crock with Lid | 15 | 35
      Cast Iron Grill Pan 28 cm | 29 | 69
      Bamboo Drawer Knife Organizer | 19 | 45
      Stainless Steel Egg Slicer | 9 | 19
    `,
    office: `
      A5 Dotted Notebook, Hardcover | 9 | 22
      Gel Pens, 0.5 mm, Black (12-pack) | 8 | 16
      Sticky Notes 76 x 76 mm (12 pads) | 7 | 15
      Printer Paper A4, 500 Sheets | 5 | 11
      Desk Organizer with Drawers | 19 | 45
      Stapler, Heavy Duty | 12 | 29
      Whiteboard 90 x 60 cm | 29 | 69
      Dry-Erase Markers (8 colors) | 7 | 15
      Ergonomic Office Chair, Mesh Back | 149 | 399
      Standing Desk Converter | 129 | 299
      Monitor Riser with Storage | 25 | 49
      Label Maker | 29 | 69
      Paper Shredder, Cross-Cut | 49 | 129
      File Folders, Letter Size (25-pack) | 9 | 19
      Document Scanner, Duplex | 179 | 399
      Laser Printer, Monochrome | 99 | 229
      Desk Pad 80 x 40 cm, Felt | 15 | 35
      Weekly Planner, Undated | 12 | 28
      Highlighters, Pastel (6-pack) | 5 | 12
      Cable Management Box | 15 | 32
      Laminator, A4 | 25 | 59
      Ring Binder 2 inch | 4 | 10
      Fountain Pen, Medium Nib | 19 | 59
      Envelopes C5, Self-Seal (100) | 8 | 16
      Desk Calendar 2026, Spiral Bound | 9 | 19
      Legal Pads, Narrow Ruled (3-pack) | 8 | 18
      Desk Lamp with Adjustable Arm | 25 | 69
      Bookends, Metal (Pair) | 12 | 29
      Clipboard with Storage Compartment | 9 | 22
      Index Cards 3 x 5 in, Ruled (300) | 5 | 12
      Correction Tape Dispensers (4-pack) | 6 | 14
      Desktop File Sorter, Mesh | 15 | 35
      Portfolio Folder, Letter Size | 8 | 19
      USB-C Hub with 4 Ports | 19 | 49
      Laptop Stand, Foldable Aluminum | 25 | 59
      Wireless Keyboard and Mouse Set | 25 | 69
      Webcam Cover Slides (6-pack) | 5 | 12
      Document Tray, Stackable (2-tier) | 12 | 28
      Book Scanner Stand with LED Light | 29 | 79
      Wall-Mount Magazine File, Metal | 15 | 35
      Whiteboard Eraser and Cleaner Kit | 9 | 22
      Desk Mat, Cork (60 x 30 cm) | 12 | 29
      Ballpoint Pens, Blue (10-pack) | 5 | 12
      Portable Document Holder, A4 | 9 | 22
      Pencil Sharpener, Electric | 15 | 35
      Book Light with Clip | 9 | 22
      Wall Calendar, 2027 | 8 | 18
      Business Card Holder, Desktop | 9 | 22
      Letter Tray, Bamboo | 15 | 35
      Scissors, Soft-Grip 8 inch | 6 | 15
      Tracing Paper Pad, A4 (50 sheets) | 9 | 19
      Drafting Compass Set, 8 pieces | 12 | 29
      Paper Cutter with Safety Guard | 19 | 45
      Portable Lap Desk with Cushion | 25 | 59
      USB Desk Fan, Adjustable | 12 | 29
      Under-Desk Footrest, Adjustable | 19 | 49
      Ethernet Cable, 10 ft | 5 | 12
      Surge Protector Strip, 6 Outlets | 12 | 29
      Document Wallet, Expanding (5-pack) | 9 | 19
      Memo Cube, Refill Sheets, 3 inch | 5 | 12
      Rollerball Pens, Fine Tip (8-pack) | 9 | 19
      Copy Paper, Letter Size, 500 Sheets | 5 | 12
      Wireless Numeric Keypad, Compact | 15 | 35
      Pen Cup with Phone Stand | 8 | 18
      Page Magnifier with Ruler | 5 | 12
      Writing Desk Organizer, Bamboo | 19 | 45
      Presentation Easel Pad, 50 Sheets | 12 | 25
      Desk Bell, Stainless Steel | 6 | 15
      Binder Pockets, Clear (12-pack) | 7 | 16
      Calligraphy Practice Pad, A4 | 8 | 18
      Document Frame, A4, Acrylic | 9 | 22
      Desktop Tape Dispenser, Weighted | 8 | 19
      Packing Tape Dispenser with Handle | 9 | 22
      Foldable Book Stand, Adjustable | 12 | 29
      Clipboard, Letter Size, 6-pack | 12 | 25
      Drafting T-Square, 12 inch | 9 | 22
      Pencil Case, Zippered Canvas | 6 | 15
      Mail Sorter, Wall-Mount, 3 Pockets | 15 | 35
      Desktop Book Rack, Adjustable | 15 | 35
      Retractable Badge Reels (5-pack) | 8 | 18
      Correction Pens, Fine Tip (3-pack) | 5 | 12
      Desk Telephone Stand, Adjustable | 12 | 29
      Desk Name Plate, Acrylic | 9 | 22
      Letter Opener, Stainless Steel | 5 | 12
      Rubber Stamp Pad, Black Ink | 5 | 12
      Paper Fasteners, Brass (100-count) | 5 | 12
      Envelope Moistener with Sponge | 4 | 10
      Desktop Hole Punch, 3-Hole | 12 | 28
      Carbonless Invoice Book, 2-Part | 8 | 18
      Receipt Spike, Weighted Base | 9 | 22
      Desktop Mail Scale, Digital | 19 | 49
      Drafting Board, Portable | 29 | 69
    `,
    books: `
      The Salt Road: A Novel (Paperback) | 12 | 18
      Field Guide to Coastal Birds, 2nd Edition | 18 | 32
      Cooking with Fire and Smoke | 22 | 38
      Quiet Hours: Essays on Attention | 15 | 27
      The Lighthouse Keeper's Daughter (Hardcover) | 22 | 30
      Practical Statistics for Everyday Decisions | 29 | 55
      A Short History of Bridges | 18 | 28
      The Weekend Woodworker | 20 | 35
      Learning Spanish in 30 Days, Workbook | 14 | 24
      Midnight at the Harbor Hotel | 10 | 17
      The Gardener's Almanac 2025 | 12 | 20
      Introduction to Linear Algebra, 6th Edition | 59 | 129
      Small Spaces, Big Ideas: Home Design | 25 | 45
      The Map of Lost Rivers | 14 | 26
      Bedtime Stories for Curious Minds | 12 | 22
      Running Your First Marathon | 15 | 25
      The Accidental Detective (Book 3) | 9 | 16
      Mountains of the Moon: A Travel Memoir | 16 | 28
      Python for Data Analysis, Pocket Guide | 25 | 45
      The Art of Slow Bread | 24 | 40
      Twelve Letters from Lisbon | 13 | 22
      Atlas of Ancient Trade Routes | 35 | 65
      Mindful Money: Budgeting Basics | 14 | 24
      The Clockmaker's Apprentice (Audiobook CD) | 25 | 40
      Puzzles & Riddles, Volume 2 | 8 | 14
      Birdsong of the Northern Marshes | 19 | 34
      The Baker's Table: Simple Weekend Recipes | 21 | 36
      Notes from a Small Observatory | 16 | 29
      A History of the City Garden | 17 | 29
      Repairing Wooden Chairs and Stools | 18 | 32
      The Vanishing Room at Bellweather House | 11 | 19
      Seasonal Herbs for the Kitchen Garden | 14 | 23
      Rooms for Reading: A Home Design Guide | 23 | 42
      Where the Juniper Grows | 12 | 24
      Tales for Rainy Afternoons | 11 | 20
      Cycling the Quiet Roads: A Field Guide | 16 | 27
      A Beginner's Guide to Pottery | 20 | 34
      Seven Days in Palermo | 12 | 21
      The Silk Roads of the Western Desert | 32 | 58
      Saving for a Rainy Day: A Household Planner | 12 | 22
      Logic Puzzles for Long Journeys, Volume 3 | 9 | 16
      Field Notes from the Blue Ridge Trail | 17 | 31
      Supper for Two: Seasonal Recipes | 19 | 34
      The Shape of a Sentence: A Writing Guide | 18 | 32
      A Winter at Marrow House (Hardcover) | 23 | 36
      How Maps Changed the World | 24 | 43
      The Little Book of Cloud Watching | 11 | 19
      Handmade Baskets from Reeds and Rushes | 21 | 39
      Japanese for Travelers, Phrasebook | 10 | 18
      The Last Train to Alderwick | 12 | 20
      Wildflowers of the High Plains | 20 | 37
      Color at Home: A Practical Decorating Guide | 22 | 39
      Letters from the Far North | 14 | 25
      The Moonlit Menagerie: Bedtime Tales | 13 | 24
      A Runner's Guide to Trail Racing | 16 | 29
      The Small Batch Preserving Handbook | 20 | 36
      A Year of Sunday Suppers | 23 | 41
      Illustrated Guide to Backyard Insects | 19 | 35
      The Lost Manuscript of Greyhaven | 11 | 19
      Growing Orchids Indoors | 15 | 27
      Theatre Games for Young Actors | 16 | 28
      The Cartographer's Last Summer | 13 | 23
      A Field Guide to Alpine Mushrooms | 21 | 38
      The Everyday Baker's Sourdough Notebook | 17 | 29
      Watercolor Landscapes for Beginners | 19 | 34
      Pocket Atlas of the Night Sky | 16 | 28
      The House on Briar Lane (Paperback) | 12 | 21
      A History of Public Libraries | 22 | 40
      Simple Suppers from the Garden | 18 | 31
      German Verbs in Practice, Workbook | 14 | 25
      The Fox at Winter's Edge | 10 | 18
      A Guide to Identifying Shoreline Shells | 20 | 36
      Letters from a Mountain Station | 15 | 27
      Sketching Trees Throughout the Seasons | 17 | 30
      Italian for the Curious Traveler, Phrasebook | 11 | 19
      A Century of Railway Journeys | 23 | 41
      Small Cakes for Every Occasion | 16 | 29
      The Beginner's Guide to Bird Photography | 25 | 44
      The Orchard at Low Tide | 11 | 19
      Handbook of Native Garden Design | 24 | 42
      A Beginner's Guide to Woodcarving | 18 | 33
      The Glasshouse on Alder Street | 13 | 22
      Everyday French, Intermediate Workbook | 15 | 26
      The Secret of Lantern Cove (Book 1) | 9 | 16
      A Naturalist's Year in the Meadow | 20 | 36
      Cakes and Tarts for Afternoon Tea | 19 | 34
      Drawing Birds in the Field | 17 | 31
      The River Between the Hills: A Novel | 12 | 21
      Practical Astronomy for Backyard Observers | 23 | 41
      The House of Paper Boats | 10 | 18
      A Guide to Restoring Old Maps | 22 | 39
      Portuguese for Weekend Travelers, Phrasebook | 11 | 20
      The Quiet Art of Mending Clothes | 16 | 29
      Tales from the Amber Coast | 14 | 25
      Building a Small Backyard Greenhouse | 21 | 37
      The Museum of Forgotten Things | 13 | 23
      Piano Practice for Adult Beginners | 18 | 32
      A History of Mountain Railways | 24 | 43
      Wild Herbs of the Open Moor | 19 | 34
      The Puzzle Box of Wren House (Book 4) | 10 | 17
      Sketchbook of Northern Seascapes | 20 | 35
    `,
    toys: `
      Wooden Building Blocks, 100 Pieces | 25 | 49
      1000-Piece Jigsaw Puzzle, Harbor at Dusk | 15 | 29
      Remote Control Car, 1:16 Scale | 29 | 69
      Plush Bear 30 cm | 12 | 29
      Magnetic Tiles Set (60 pieces) | 39 | 79
      Kids' Art Easel, Double-Sided | 45 | 99
      Family Board Game: Island Traders | 25 | 45
      Card Game for 2-6 Players | 9 | 19
      Marble Run Starter Set | 29 | 59
      Wooden Train Set, 52 Pieces | 39 | 89
      Science Kit: Crystal Growing | 19 | 35
      Play Kitchen with Accessories | 79 | 179
      Kick Scooter, Adjustable Height | 39 | 89
      Dollhouse, 3 Floors | 79 | 199
      Stacking Rings for Toddlers | 9 | 19
      Bath Toys (Set of 8) | 9 | 19
      Kite, Delta 140 cm | 15 | 35
      Water Blaster (2-pack) | 12 | 25
      Modeling Clay, 24 Colors | 9 | 19
      Chess Set, Folding Wooden Board | 22 | 49
      Building Bricks Space Station, 640 Pieces | 49 | 99
      Coding Robot for Kids 6+ | 59 | 129
      Ride-On Balance Bike 12" | 49 | 99
      Glow-in-the-Dark Star Stickers (200) | 6 | 14
      Wooden Puzzle Map of the World | 19 | 39
      Wooden Marble Maze, Handheld | 12 | 24
      Dinosaur Figure Set (6 Pieces) | 14 | 29
      Watercolor Painting Kit for Kids | 16 | 32
      Foam Glider Plane, 3-Pack | 8 | 16
      Junior Gardening Set with Tools | 18 | 35
      Magnetic Fishing Game | 12 | 24
      Pretend Doctor Play Set, 18 Pieces | 19 | 39
      Large Floor Puzzle, Mountain Wildlife | 18 | 34
      Soft Bowling Set for Indoor Play | 15 | 29
      Wooden Doll Family, 6 Figures | 16 | 32
      Beginner's Tambourine and Rhythm Set | 14 | 28
      Construction Vehicle Set, 5 Pieces | 19 | 39
      Reusable Sticker Activity Book | 9 | 18
      Balance Stepping Stones, Set of 6 | 29 | 59
      Miniature Dollhouse Furniture, 24 Pieces | 22 | 45
      Backyard Ring Toss Game | 15 | 32
      Bead Craft Kit, 500 Pieces | 12 | 25
      Pull-Back Race Cars (4-Pack) | 14 | 29
      Wooden Shape Sorting Cube | 16 | 32
      Cardboard Fort Building Kit | 35 | 69
      Animal Matching Memory Game | 9 | 18
      Kids' Binoculars with Carrying Case | 19 | 39
      Play Tent, Pop-Up with Stars | 29 | 59
      Beginner Yo-Yo Set (2-Pack) | 8 | 16
      Build-Your-Own Windmill Kit | 15 | 29
      Wooden Pinball Game, Desktop Size | 29 | 59
      Stuffed Octopus, 8 Soft Arms | 14 | 28
      Treasure Hunt Game with Clue Cards | 12 | 24
      Outdoor Parachute, 12 Handles | 25 | 49
      Beginner's Sewing Craft Kit for Kids | 18 | 36
      Foam Play Dice, Oversized Set of 3 | 12 | 24
      Wooden Percussion Set with 5 Instruments | 22 | 45
      Toy Cash Register with Play Coins | 19 | 39
      Balancing Cactus Stacking Game | 12 | 24
      Paper Airplane Launcher with 20 Sheets | 15 | 29
      Underwater Explorer Play Set, 8 Figures | 16 | 32
      Large Magnetic Drawing Board | 18 | 35
      Wooden Lacing Beads, 48 Shapes | 12 | 25
      Tabletop Air Hockey Game | 35 | 69
      Fairy Garden Play Set with Mini Figures | 19 | 39
      Soft Foam Archery Set with Target | 22 | 45
      Glow Bowling Pins, Set of 6 | 19 | 35
      Make-Your-Own Kaleidoscope Kit (4-Pack) | 14 | 28
      Wooden Balance Scale with Play Weights | 16 | 32
      Waterproof Sand Molds, 12 Shapes | 8 | 16
      Logic Puzzle Cube Set, 3 Levels | 9 | 19
      Miniature Market Stall Play Set | 29 | 59
      Flying Disc and Catch Ring Set | 15 | 29
      Wooden Castle Building Set, 48 Pieces | 29 | 59
      Jungle Animal Puzzle, Wooden Tray | 12 | 24
      Battery-Powered Bubble Machine | 19 | 39
      Puppet Theater with 4 Hand Puppets | 25 | 49
      Beginner's Telescope with Tripod | 35 | 79
      Mini Golf Putting Set for Indoor Play | 22 | 45
      Felt Food Picnic Set, 20 Pieces | 18 | 36
      Waterproof Beach Ball, 50 cm | 8 | 16
      Wooden Roadway Builder Set, 36 Pieces | 29 | 59
      Dress-Up Cape and Mask Set | 14 | 28
      Magnetic Pattern Puzzle with 40 Tiles | 16 | 32
      Soft Baby Play Blocks, Set of 10 | 15 | 29
      Junior Rock Painting Kit with 12 Stones | 12 | 25
      Pull-Along Wooden Duck | 16 | 32
      Foldable Play Tunnel, 180 cm | 19 | 39
      Tabletop Foosball Game | 39 | 79
      Shadow Puppet Kit with Screen | 22 | 45
      Wooden Animal Stacking Tower | 12 | 24
      DIY Solar System Mobile Kit | 18 | 35
      Giant Soap Bubble Wand Set | 9 | 19
      Pretend Grocery Basket with Play Produce | 16 | 32
      Wooden Labyrinth Game with Tilt Board | 19 | 39
      Outdoor Croquet Set for 4 Players | 25 | 49
      Plush Axolotl, 25 cm | 14 | 29
      Snap-Together Marble Track, 48 Pieces | 22 | 45
      Water Doodle Mat with Reusable Pens | 19 | 39
      Wind-Up Tin Robot Figure | 12 | 24
      Magnetic Fishing Rod and Pond Game | 15 | 29
      Foam Number Puzzle Mat, 36 Tiles | 18 | 35
      Wooden Animal Hospital Play Set | 29 | 59
      DIY Paper Lantern Craft Kit, 6 Designs | 12 | 25
      Ring-Bound Travel Activity Pad for Kids | 8 | 16
      Tabletop Pinball Skill Game | 22 | 45
      Soft Fabric Baby Book with Crinkle Pages | 12 | 24
      Buildable Treehouse Play Set, 320 Pieces | 29 | 59
      Rainbow Ribbon Wands, Set of 4 | 9 | 19
      Indoor Disc Golf Target with 3 Discs | 25 | 49
      Wooden Number Abacus, 100 Beads | 16 | 32
      Plush Hand Puppet, Friendly Fox | 12 | 25
      Beginner's Loom Weaving Kit with Yarn | 18 | 36
      Color-Changing Bubble Solution, 3 Bottles | 9 | 18
      Wooden Gear Builder Board, 24 Pieces | 22 | 45
    `,
    sports: `
      Yoga Mat 6 mm, Non-Slip | 19 | 49
      Adjustable Dumbbells 2 x 12 kg | 99 | 249
      Resistance Bands Set (5 levels) | 12 | 29
      Foam Roller 45 cm | 15 | 35
      Jump Rope, Speed Cable | 8 | 19
      Camping Tent, 2-Person | 79 | 199
      Sleeping Bag, 3-Season (-5 °C) | 49 | 129
      Hiking Backpack 35 L | 59 | 149
      Trekking Poles (Pair) | 29 | 79
      Headlamp 400 Lumens | 15 | 39
      Insulated Camping Mug 350 ml | 12 | 25
      Bike Helmet, MIPS, Size M | 49 | 129
      Bike Lock, U-Lock with Cable | 25 | 59
      Cycling Gloves, Padded | 15 | 35
      Soccer Ball, Size 5 | 15 | 39
      Basketball, Indoor/Outdoor | 19 | 45
      Tennis Racket, 270 g | 49 | 179
      Pickleball Paddle Set (2 paddles, 4 balls) | 35 | 79
      Swim Goggles, Anti-Fog | 9 | 25
      Kettlebell 16 kg | 35 | 69
      Pull-Up Bar, Doorway | 25 | 49
      Fishing Rod and Reel Combo | 39 | 99
      Snorkel Set, Adult | 25 | 59
      Climbing Chalk Bag | 12 | 29
      Insulated Water Bottle 1 L | 19 | 39
      Pilates Ring, 38 cm | 12 | 29
      Exercise Mat, Extra Wide | 25 | 59
      Ankle Weights, Pair, 2 kg | 19 | 39
      Agility Ladder, 4 m | 15 | 35
      Balance Board, Wooden | 29 | 69
      Punching Bag, Freestanding | 99 | 249
      Boxing Gloves, 12 oz | 25 | 69
      Volleyball, Official Size | 19 | 45
      Skateboard, 8-inch Deck | 49 | 129
      Inline Skates, Adjustable Size | 59 | 149
      Snowshoes, 25-inch Pair | 79 | 179
      Trekking Gaiters, Waterproof | 25 | 59
      Portable Camp Stove, 2-Burner | 49 | 119
      Dry Bag, Roll-Top, 20 L | 15 | 39
      Sport Sunglasses, Polarized | 25 | 79
      Foam Exercise Blocks, Pair | 12 | 29
      Kayak Paddle, Adjustable 220 cm | 39 | 99
      Disc Golf Set, 3 Discs | 19 | 45
      Lacrosse Stick, Complete | 49 | 119
      Golf Putter, Right-Handed | 29 | 89
      Training Hurdles, Set of 6 | 19 | 49
      Bocce Ball Set, 8 Balls | 29 | 69
      Climbing Harness, Adjustable | 49 | 119
      Ski Goggles, Anti-Fog Lens | 29 | 79
      Snow Sled, 2-Person | 39 | 89
      Archery Target, Foam, 60 cm | 39 | 99
      Racquetball Racquet, 170 g | 29 | 79
      Baseball Bat, Aluminum, 32 in | 49 | 129
      Cricket Bat, Kashmir Willow | 39 | 99
      Running Hydration Vest, 5 L | 39 | 99
      Sports Duffle Bag, 60 L | 29 | 69
      Outdoor Fitness Timer, Digital | 19 | 49
      Road Bike Floor Pump with Gauge | 25 | 59
      Compact Binoculars, 10x25 | 29 | 79
      Canoe Dry Box, 12 L | 19 | 45
      Portable Disc Cone Set (20) | 15 | 35
      Garden Croquet Set, 6-Player | 39 | 89
      Paddleboard Leash, Coiled 10 ft | 15 | 35
      Foil Kite, 2-Line Stunt | 25 | 59
      Portable Badminton Net, 5 m | 29 | 69
      Golf Chipping Net, 3 Target | 19 | 45
      Cycling Floor Stand, Rear Wheel | 19 | 49
      Snowboard Bag, Padded, 165 cm | 49 | 119
      Water Polo Ball, Size 5 | 25 | 59
      Baseball Base Set, 3 Bases | 19 | 45
      Portable Outdoor Shower, 20 L | 29 | 69
      Compact First Aid Kit, 80-Piece | 12 | 29
      Portable Soccer Goal, 6 ft | 39 | 89
      Thermal Base Layer Set, Adult | 39 | 99
      Foldable Hiking Seat Pad | 8 | 19
      Waterproof Map Case, Neck Strap | 12 | 29
      Canoe Portage Yoke Pad | 19 | 45
      Pool Noodle Set, 6 Pieces | 12 | 29
      Hockey Stick, Composite, 60 in | 49 | 129
    `,
    beauty: `
      Daily Moisturizer SPF 30, 50 ml | 12 | 35
      Gentle Foaming Cleanser 150 ml | 9 | 24
      Vitamin C Serum 30 ml | 15 | 45
      Hyaluronic Acid Serum 30 ml | 12 | 35
      Sheet Masks (Pack of 10) | 12 | 25
      Lip Balm, Unscented (4-pack) | 6 | 12
      Shampoo for Dry Hair 400 ml | 8 | 22
      Conditioner, Argan 400 ml | 8 | 22
      Body Wash, Eucalyptus 500 ml | 6 | 15
      Hand Cream 75 ml | 5 | 15
      Electric Toothbrush with 2 Heads | 39 | 99
      Hair Dryer 1875 W, Ionic | 39 | 129
      Ceramic Hair Straightener 25 mm | 35 | 99
      Mineral Sunscreen SPF 50, 100 ml | 12 | 29
      Eau de Parfum, Citrus Woods 50 ml | 39 | 99
      Nail Polish, Matte Finish | 7 | 16
      Makeup Brush Set, 12 Pieces | 15 | 39
      Mascara, Lengthening | 8 | 25
      Beard Oil 30 ml | 12 | 25
      Safety Razor with 10 Blades | 25 | 49
      Bamboo Hairbrush, Paddle | 9 | 22
      Deodorant, Aluminum-Free 75 g | 6 | 14
      Clay Face Mask 100 g | 12 | 28
      Cuticle Oil Pen | 6 | 14
      Dry Shampoo 200 ml | 7 | 16
      Cleansing Balm 90 g | 12 | 29
      Micellar Water 400 ml | 8 | 19
      Peptide Eye Cream 15 ml | 15 | 42
      Exfoliating Toner, 200 ml | 12 | 32
      Overnight Lip Mask 20 g | 8 | 22
      Pressed Powder Compact | 12 | 32
      Concealer Stick 5 g | 9 | 26
      Blush Palette, 4 Shades | 15 | 38
      Waterproof Eyeliner Pencil | 7 | 18
      False Eyelashes, 3 Pairs | 8 | 20
      Makeup Sponge Set, 4 Pieces | 7 | 18
      Brow Gel, Clear 6 ml | 7 | 19
      Leave-In Conditioner Spray 200 ml | 9 | 25
      Scalp Massager Brush | 6 | 16
      Heat Protectant Spray 250 ml | 9 | 24
      Hair Claw Clips, 6-Pack | 7 | 18
      Foot Cream with Urea 100 ml | 8 | 21
      Body Lotion, Shea Butter 400 ml | 8 | 23
      Bath Salts, Lavender 500 g | 9 | 24
      Reusable Facial Rounds, 12-Pack | 8 | 20
      Pore-Refining Face Primer 30 ml | 12 | 32
      Tinted Lip Oil 6 ml | 8 | 24
      Liquid Foundation, 30 ml | 15 | 42
      Makeup Remover Cloths, 3-Pack | 8 | 19
      Facial Cleansing Brush, Silicone | 12 | 29
      Nourishing Cuticle Cream 30 g | 7 | 18
      Nail File Set, 6 Pieces | 5 | 13
      Hair Styling Wax 100 g | 8 | 21
      Wide-Tooth Comb, Acetate | 7 | 18
      Velvet Hair Scrunchies, 5-Pack | 6 | 15
      Shower Cap, Reusable | 7 | 17
      Foot File with Handle | 8 | 20
      Manual Callus Remover | 7 | 18
      Beard Comb, Wood | 8 | 21
      Travel Toiletry Bottles, 6-Pack | 8 | 19
      Gentle Cleansing Oil 180 ml | 12 | 29
      Niacinamide Face Serum 30 ml | 12 | 34
      Eye Makeup Remover, 150 ml | 8 | 19
      Balancing Face Mist 100 ml | 9 | 24
      Cream Highlighter Stick | 12 | 29
      Brow Pencil with Spoolie | 7 | 19
      Lip Liner Pencil, Nude | 6 | 16
      Eyeshadow Palette, 8 Shades | 15 | 39
      Setting Spray, 100 ml | 9 | 25
      Glass Nail File with Case | 7 | 18
      Nail Buffer Blocks, 4-Pack | 5 | 12
      Nail Clippers, Stainless Steel | 6 | 16
      Silk Sleep Scrunchie, 2-Pack | 9 | 24
      Detangling Hair Brush, Vented | 9 | 24
      Hair Rollers, 12-Piece Set | 8 | 20
      Bath Pillow, Non-Slip | 15 | 39
      Body Scrub, Sugar 300 g | 9 | 24
      Compact Travel Mirror with LED | 12 | 32
      Retinol Night Cream 50 ml | 15 | 42
      Hydrating Face Cleanser, 200 ml | 9 | 23
      BB Cream with SPF 25, 40 ml | 12 | 34
      Cream Blush, Rose 5 g | 8 | 22
      Lipstick, Satin Finish | 9 | 25
      Lip Gloss, Clear 8 ml | 7 | 19
      Individual Eyelash Curler | 8 | 21
      Makeup Spatula and Mixing Palette | 7 | 18
      Travel Makeup Bag, Zip Closure | 12 | 29
      Curl Defining Cream 250 ml | 9 | 25
      Volumizing Mousse 200 ml | 8 | 21
      Clarifying Shampoo 400 ml | 8 | 22
      Hair Turban Towel, Microfiber | 9 | 23
      Scalp Exfoliating Brush | 7 | 18
      Precision Trimmer for Brows | 15 | 39
      Bath Bombs, Assorted (6-pack) | 9 | 22
      Deodorant Cream, Unscented 50 g | 7 | 17
      Manicure Set with Travel Case | 12 | 32
    `,
    garden: `
      Garden Hose 25 m with Spray Nozzle | 29 | 69
      Pruning Shears, Bypass | 15 | 39
      Raised Garden Bed 120 x 60 cm | 49 | 129
      Potting Mix 40 L | 9 | 19
      Tomato Seeds, Heirloom Mix (50 seeds) | 3 | 7
      Herb Seed Collection, 8 Varieties | 9 | 19
      Watering Can 7 L | 12 | 29
      Solar Path Lights (8-pack) | 25 | 59
      Bird Feeder, Hanging | 15 | 39
      Compost Bin 300 L | 45 | 99
      Lawn Mower, Cordless 40 V | 199 | 449
      Leaf Blower, Battery | 79 | 179
      Garden Kneeler and Seat | 25 | 49
      Gardening Gloves, Nitrile (3 pairs) | 9 | 19
      Patio Umbrella 2.7 m | 59 | 149
      Outdoor String Lights 15 m | 25 | 59
      Hanging Planter, Macrame | 12 | 25
      Slow-Release Fertilizer 2 kg | 12 | 25
      Rain Gauge | 6 | 15
      Folding Garden Chair (Set of 2) | 49 | 119
      Bulb Planter, Steel | 12 | 25
      Wheelbarrow 100 L | 69 | 149
      Soaker Hose 15 m | 19 | 39
      Lavender Plant, 2 L Pot | 9 | 19
      Hedge Trimmer, Cordless 18 V | 79 | 169
      Garden Trowel, Stainless Steel | 8 | 19
      Drip Irrigation Kit, 20 m | 25 | 59
      Greenhouse, Walk-In 4-Tier | 69 | 159
      Rose Plant, 3 L Pot | 12 | 29
      Garden Cart, Folding 80 L | 39 | 89
      Coconut Coir Bricks (5-pack) | 9 | 19
      Lawn Edging, Flexible 10 m | 15 | 35
      Birdbath, Pedestal 75 cm | 39 | 99
      Electric Tillers, 1500 W | 129 | 279
      Seed Starting Tray with 72 Cells | 9 | 22
      Plant Supports, Metal (10-pack) | 12 | 29
      Garden Sprayer, Pump 5 L | 19 | 39
      Outdoor Storage Box 300 L | 59 | 139
      Rain Barrel 200 L with Tap | 69 | 149
      Pruning Saw, Folding 18 cm | 12 | 29
      Pea Gravel, 20 kg | 7 | 15
      Wall-Mounted Hose Reel | 39 | 89
      Greenhouse Shade Cloth 2 x 5 m | 15 | 35
      Garden Arch, Metal 2.2 m | 49 | 119
      Peony Plant, 2 L Pot | 12 | 29
      Lawn Aerator, Manual | 25 | 59
      Compost Thermometer 50 cm | 12 | 29
      Outdoor Potting Bench, Fir Wood | 89 | 199
      Garden Twine, Jute 100 m | 5 | 12
      Garden Fork, Forged Steel | 12 | 29
      Planting Dibber, Ash Wood | 8 | 18
      Garden Soil pH Tester | 12 | 29
      Birdhouse, Wooden 25 cm | 19 | 45
      Garden Pond Liner 3 x 4 m | 39 | 89
      Green Roof Planter Tray (4-pack) | 25 | 59
      Grafting Tape, Biodegradable 100 m | 6 | 14
      Garden Shredder, Electric 2500 W | 149 | 329
      Patio Cleaning Brush, Stiff Bristle | 9 | 22
      Tree Watering Bag, 75 L | 12 | 29
      Garden Netting, Fine Mesh 4 x 10 m | 15 | 35
      Cedar Planter Box 80 cm | 39 | 89
      Hand Weeder, Long-Handle | 12 | 29
      Outdoor Faucet Cover, Insulated | 7 | 16
      Insect Hotel, 30 cm | 19 | 45
      Landscape Fabric, 1 x 20 m | 15 | 35
      Berry Bush, 2 L Pot | 12 | 29
      Lawn Roller, Water-Fillable 50 cm | 49 | 119
      Outdoor Plant Mister, 1 L | 9 | 22
      Garden Rake, Bow Head 14 Tines | 19 | 39
      Seed Spreader, Handheld | 12 | 29
      Potato Grow Bags (3-pack) | 15 | 35
      Lopper, Telescopic Bypass 70 cm | 25 | 59
      Garden Kneeling Pad, Foam | 8 | 18
      Plant Labels, Slate (20-pack) | 9 | 19
      Bird Feeder Pole with Ground Spike | 25 | 59
      Mason Bee House, Wood and Bamboo | 15 | 35
      Hummingbird Feeder, 500 ml | 12 | 29
      Window Box Planter, 60 cm | 15 | 35
      Pond Skimmer Net, Telescopic | 12 | 29
      Outdoor Compost Caddy, 10 L | 19 | 39
      Frost Protection Fleece, 1.5 x 10 m | 9 | 22
      Lawn Repair Seed Mix, 1 kg | 12 | 25
      Wildflower Seed Mix, 500 g | 15 | 35
      Garden Sieve, Galvanized 35 cm | 15 | 35
      Tree Pruning Pole Saw, 3 m | 39 | 89
      Outdoor Thermometer, Wall-Mounted | 9 | 22
      Seedling Heat Mat, 25 x 50 cm | 19 | 39
      Plant Potting Scoop, Aluminum | 8 | 18
      Greenhouse Vent Opener, Automatic | 25 | 59
      Outdoor Firewood Rack, Steel 1.2 m | 39 | 89
      Bird Netting, Heavy-Duty 4 x 10 m | 12 | 29
      Garden Shovel, Round-Point Steel | 19 | 45
      Watering Wand, 60 cm | 12 | 29
      Decorative Garden Windmill, 1.5 m | 25 | 59
      Lawn Scarifier, Manual 32 cm | 39 | 89
      Tree Tie Kit with Adjustable Straps | 8 | 18
      Outdoor Solar Lantern, Hanging | 15 | 39
      Garden Soil Thermometer, 20 cm | 9 | 19
      Potato Harvesting Fork, 4 Tines | 19 | 45
      Greenhouse Staging Shelf, 90 cm | 29 | 69
      Seedling Dibble Board, 10-Hole | 9 | 19
      Garden Water Timer, Mechanical | 19 | 45
      Bird Feeder Tray, Ground-Mounted | 15 | 35
    `,
    pets: `
      Dry Dog Food, Chicken & Rice 12 kg | 39 | 79
      Grain-Free Cat Food 3 kg | 19 | 39
      Wet Cat Food Variety Pack (24 x 85 g) | 19 | 35
      Dog Leash 1.8 m, Reflective | 12 | 29
      Adjustable Dog Harness, Medium | 19 | 45
      Orthopedic Dog Bed, Large | 49 | 129
      Cat Scratching Post 80 cm | 25 | 59
      Clumping Cat Litter 10 L | 9 | 19
      Dog Chew Toys (5-pack) | 12 | 25
      Interactive Feather Wand | 6 | 15
      Stainless Steel Pet Bowls (Set of 2) | 12 | 25
      Pet Carrier, Airline Approved | 35 | 79
      Aquarium Starter Kit 60 L | 79 | 179
      Fish Flakes 100 g | 5 | 12
      Bird Seed Mix 2 kg | 8 | 16
      Dog Poop Bags (360 count) | 9 | 19
      Grooming Brush, Deshedding | 12 | 29
      Automatic Pet Feeder | 49 | 119
      Hamster Cage with Wheel | 39 | 89
      Dental Chews for Dogs (30 count) | 15 | 29
      Flea and Tick Collar | 15 | 45
      Cat Tunnel, Crinkle, 3-Way | 12 | 25
      Dog Raincoat, Size M | 19 | 39
      Salmon Training Treats 200 g | 6 | 12
      Puppy Training Pads (50 count) | 15 | 29
      Freeze-Dried Beef Liver Treats 100 g | 9 | 19
      Retractable Dog Leash 5 m | 15 | 35
      Dog Crate, Folding, 91 cm | 49 | 99
      Cat Food, Indoor Formula 4 kg | 25 | 49
      Wet Dog Food, Beef 12 x 400 g | 19 | 39
      Covered Cat Litter Box | 25 | 59
      Sisal Cat Scratching Mat | 9 | 19
      Catnip Spray 60 ml | 6 | 12
      Pet Water Fountain 2 L | 25 | 59
      Aquarium Filter, 100 L | 19 | 39
      Tropical Fish Pellets 250 g | 8 | 16
      Aquarium Gravel, Natural 5 kg | 9 | 19
      Parakeet Perch and Swing Set | 12 | 25
      Nesting Box for Small Birds | 15 | 35
      Rabbit Hay Rack, Metal | 9 | 19
      Small Animal Bedding, Paper 40 L | 15 | 29
      Guinea Pig Pellets 2 kg | 9 | 19
      Reptile Heat Lamp with Clamp | 19 | 39
      Pet Nail Clippers, Small and Large | 8 | 16
      Car Seat Cover for Dogs | 25 | 59
      Padded Cat Window Perch | 19 | 39
      Dog Seat Belt Tether | 8 | 16
      Ceramic Water Bowl, Wide Base | 12 | 25
      Puppy Teething Ring, Rubber | 6 | 15
      Dog Training Clicker (2-pack) | 5 | 12
      Aquarium Air Pump, Dual Outlet | 15 | 35
      Shrimp Pellets for Aquariums 100 g | 6 | 12
      Bird Cage Cover, Medium | 12 | 29
      Cockatiel Foraging Toy, Woven | 9 | 19
      Rabbit Litter Pan, Corner Fit | 8 | 19
      Timothy Hay for Small Pets 1 kg | 8 | 16
      Guinea Pig Hideout, Wooden | 15 | 35
      Lizard Feeding Tongs, Stainless Steel | 6 | 15
      Dog Toothbrush and Paste Set | 9 | 19
      Cat Grooming Mitt, Washable | 6 | 15
      Portable Pet Water Bottle 500 ml | 9 | 19
      Soft-Sided Pet Playpen, Foldable | 35 | 79
      Washable Dog Pee Pad, Large | 12 | 25
      Paw Cleaning Cup, Medium | 9 | 19
      Cat Litter Scoop with Holder | 6 | 15
      Aquarium Plant Set, 6 Pieces | 12 | 29
      Dog Puzzle Feeder, Level 2 | 19 | 39
      Puppy Kibble, Chicken 5 kg | 19 | 39
      Senior Cat Food, Turkey 2 kg | 15 | 29
      Dental Water Additive for Dogs 500 ml | 9 | 19
      Catnip Toy Mice (4-pack) | 6 | 15
      Window Bird Feeder, Clear | 12 | 25
      Finch Seed Blend 1 kg | 6 | 12
      Aquarium LED Light, 45 cm | 25 | 59
      Aquarium Heater, Adjustable 100 W | 15 | 35
      Betta Fish Leaf Hammock | 5 | 12
      Reptile Hiding Cave, Medium | 12 | 25
      Turtle Dock, Floating | 15 | 35
      Rabbit Exercise Tunnel, Fabric | 12 | 25
      Hamster Exercise Wheel, Silent 20 cm | 19 | 39
      Chinchilla Dust Bath House | 19 | 39
      Dog Treat Pouch with Waist Clip | 9 | 19
      Reflective Dog Collar, Adjustable | 8 | 19
      Self-Cleaning Slicker Brush | 12 | 25
      Waterproof Dog Booties (4-pack) | 19 | 39
      Odor-Control Litter Deodorizer 500 g | 6 | 15
      Puppy Playpen, Modular 8-Panel | 39 | 89
      Cat Window Hammock, Suction Mount | 19 | 39
      Bird Bath, Cage-Mounted | 8 | 19
      Canister Filter for Aquariums 200 L | 39 | 89
      Reptile Feeding Dish, Rock Texture | 8 | 19
      Rabbit Grooming Comb, Fine-Tooth | 6 | 15
      Cat Grass Growing Kit | 9 | 19
      Aquarium Background, Black 60 cm | 6 | 15
      Small Pet Harness and Lead Set | 12 | 25
      Dog Cooling Mat, Large | 19 | 45
      Cat Food Puzzle Ball | 8 | 19
      Pond Fish Food Sticks 1 kg | 12 | 25
      Bird Cage Seed Catcher, Large | 9 | 19
      Dog Waste Scoop with Rake | 12 | 29
      Ceramic Reptile Heat Emitter 100 W | 15 | 35
      Aquarium Magnet Glass Cleaner | 8 | 19
      Cat Carrier Backpack, Ventilated | 35 | 79
      Pet First Aid Kit, Compact | 15 | 35
    `,
    auto: `
      Car Phone Mount, Dashboard | 12 | 29
      Tire Pressure Gauge, Digital | 9 | 22
      Portable Jump Starter 1000 A | 59 | 129
      Microfiber Cleaning Cloths (12-pack) | 9 | 19
      Windshield Washer Fluid 4 L | 4 | 9
      Wiper Blades 24" + 18" | 19 | 45
      Car Seat Covers, Front Pair | 29 | 79
      All-Weather Floor Mats (4 pieces) | 39 | 99
      Trunk Organizer, Collapsible | 19 | 39
      Engine Oil 5W-30, 5 L | 25 | 49
      Tire Inflator, 12 V | 29 | 69
      Car Wash Shampoo 1 L | 8 | 18
      LED Headlight Bulbs H7 (Pair) | 29 | 69
      Emergency Roadside Kit | 35 | 79
      Steering Wheel Cover | 12 | 29
      Sunshade for Windshield | 12 | 29
      Dual USB Car Charger 36 W | 12 | 25
      Ice Scraper with Brush | 8 | 19
      Bike Rack, Hitch Mounted (2 Bikes) | 149 | 349
      Air Freshener, Vent Clip (4-pack) | 6 | 14
      OBD-II Diagnostic Scanner | 25 | 79
      Snow Chains, Size 9 (Pair) | 39 | 99
      Leather Conditioner 500 ml | 12 | 25
      Dash Camera, Front and Rear | 49 | 139
      Roof Cargo Carrier, Soft-Sided | 79 | 189
      12 V Battery Maintainer | 25 | 69
      Cordless Car Vacuum | 29 | 89
      Backup Camera Kit, Wireless | 39 | 99
      Trailer Hitch Lock | 19 | 39
      Motorcycle Cover, Waterproof | 25 | 59
      Cargo Net for Trunk | 12 | 25
      Seat Gap Fillers, Pair | 12 | 25
      Windshield Repair Kit | 9 | 19
      Roof Cross Bars, Adjustable Pair | 79 | 179
      Heavy-Duty Tow Strap 6 m | 19 | 45
      Wheel Chocks (Pair) | 15 | 35
      Fuel Transfer Pump, 12 V | 19 | 49
      Car Paint Touch-Up Kit | 12 | 29
      Scratch Remover Compound 250 ml | 9 | 19
      Portable Power Inverter 300 W | 29 | 69
      License Plate Frames (2-pack) | 8 | 19
      Automotive Brake Fluid Tester | 12 | 29
      Window Tint Film, Pre-Cut Set | 19 | 49
      Motorcycle Helmet Lock | 12 | 29
      Windshield Sun Visor Organizer | 9 | 19
      Synthetic Gear Oil 1 L | 12 | 29
      Ratchet Tie-Down Straps (4-pack) | 19 | 39
      Socket Wrench Set, 40-Piece | 25 | 59
      Car Battery Terminal Cleaner | 6 | 14
      Fuel Stabilizer 250 ml | 8 | 18
      Motorcycle Handlebar Grips, Pair | 12 | 29
      Car Door Edge Guards (4-pack) | 9 | 19
      Coolant Tester, Antifreeze | 9 | 22
      Portable Car Refrigerator 20 L | 149 | 299
      Windshield Cover for Snow and Ice | 15 | 35
      Car Polishing Machine, Dual Action | 79 | 169
      Underbody Rustproofing Spray 500 ml | 12 | 25
      Car Roof Bike Carrier, Upright | 49 | 119
      Trailer Wiring Harness, 4-Way | 12 | 29
      Automotive Trim Removal Tool Set | 9 | 22
      Car Window Shades, Rear Pair | 12 | 25
      Motorcycle Chain Cleaning Brush | 6 | 14
      Portable Garage Creeper, Folding | 39 | 89
      Hydraulic Floor Jack, 2-Ton | 79 | 169
      Jack Stands, 3-Ton (Pair) | 39 | 89
      Spark Plug Socket Set, 14-Piece | 19 | 45
      Oil Drain Pan, 10 L | 12 | 29
      Oil Filter Wrench Set | 12 | 29
      Jumper Cables, 4 m | 19 | 39
      Brake Pad Spreader Tool | 12 | 29
      Motorcycle Stand, Rear Wheel | 49 | 119
      Motorcycle Tank Bag, Magnetic | 29 | 69
      Car Glass Cleaner 500 ml | 6 | 14
      Upholstery Cleaning Foam 500 ml | 8 | 18
      Clay Bar Kit for Car Paint | 12 | 29
      Tire Repair Plug Kit | 9 | 19
      Car Seat Lumbar Cushion | 19 | 45
      Motorcycle Handlebar Phone Mount | 19 | 49
      Exhaust Hanger Removal Pliers | 19 | 45
      Car Door Lock Actuator, Front Left | 25 | 59
      Automotive Hail Protection Cover | 49 | 119
      Car Air Filter, Panel Style | 12 | 29
      Portable Tire Bead Sealer 500 ml | 9 | 22
      Automotive Wire Crimping Tool Kit | 19 | 45
      Rearview Mirror, Clip-On Wide Angle | 9 | 19
      Car Roof Cargo Bag, Waterproof | 39 | 89
      Automotive Vacuum Hose Assortment | 12 | 29
      Car Cooling Seat Cushion, 12 V | 29 | 69
      Wheel Lug Nut Socket Set, 5-Piece | 19 | 45
      Motorcycle Fork Seal Driver Set | 25 | 59
      Car Door Weatherstripping, 5 m Roll | 12 | 25
      Radiator Pressure Tester Kit | 39 | 99
      Trailer Coupler Lock, Adjustable | 19 | 45
      Car Alternator Belt Tension Gauge | 19 | 49
      Automotive Oil Funnel Set, 4-Piece | 9 | 22
      Truck Mud Flaps, Universal Pair | 19 | 45
    `,
    music: `
      Acoustic Guitar, Dreadnought | 149 | 399
      Electric Guitar Starter Pack | 199 | 449
      Guitar Strings, Light Gauge 10-47 | 6 | 14
      Clip-On Tuner | 9 | 22
      Capo, Quick Release | 9 | 19
      Digital Piano, 88 Weighted Keys | 399 | 899
      Keyboard Stand, X-Style | 25 | 49
      Ukulele, Concert Size | 49 | 129
      Violin Outfit 4/4 with Case | 129 | 349
      Drumsticks 5A, Maple (Pair) | 8 | 15
      Electronic Drum Kit | 299 | 699
      Studio Monitor Headphones | 79 | 199
      USB Audio Interface, 2 In / 2 Out | 89 | 199
      Condenser Microphone with Stand | 69 | 179
      Music Stand, Folding | 15 | 35
      Guitar Strap, Leather | 19 | 45
      Metronome, Mechanical | 25 | 49
      Harmonica in C | 19 | 45
      Cajón Drum Box | 79 | 179
      Instrument Cable 3 m | 12 | 25
      Piano Bench, Adjustable | 49 | 119
      Guitar Pick Variety Pack (24) | 6 | 12
      Bluetooth Page Turner Pedal | 49 | 99
      Electric Bass Guitar, 4-String | 179 | 449
      Banjo, 5-String | 149 | 399
      Mandolin, A-Style | 89 | 249
      Classical Guitar, Nylon String | 99 | 279
      Flute, Student Model | 99 | 249
      Clarinet, Bb with Case | 119 | 299
      Trumpet, Student Model | 129 | 349
      Alto Saxophone Outfit | 299 | 799
      Handpan, 9 Notes | 249 | 699
      Bongo Drums, Pair | 39 | 99
      Steel Tongue Drum, 10-inch | 39 | 109
      Melodica, 32-Key | 29 | 69
      Digital Synthesizer, 49-Key | 249 | 699
      MIDI Keyboard Controller, 25-Key | 49 | 129
      Audio Mixer, 8-Channel | 89 | 249
      Microphone Pop Filter, Dual-Layer | 12 | 29
      Desktop Microphone Boom Arm | 29 | 79
      Analog Delay Guitar Pedal | 49 | 149
      Pedalboard with Carry Bag | 39 | 99
      Studio Monitor Isolation Pads | 19 | 49
      Acoustic Guitar Humidifier | 9 | 22
      Sheet Music Folder, 40 Pockets | 12 | 29
      Electronic Wind Instrument | 199 | 599
      Acoustic Guitar, Parlor Size | 129 | 349
      Bass Guitar Strings, Medium Gauge | 15 | 35
      Guitar Wall Hanger, Padded | 12 | 29
      Slide Whistle, Metal | 6 | 15
      Digital Piano, 61-Key Portable | 199 | 499
      Sustain Pedal for Keyboard | 15 | 39
      Ukulele, Baritone Size | 69 | 179
      Violin Shoulder Rest, Adjustable | 15 | 39
      Cymbal Set, 14-inch Hi-Hat | 99 | 249
      Practice Drum Pad with Stand | 29 | 69
      USB Condenser Microphone | 39 | 99
      Microphone Shock Mount | 19 | 45
      Orchestral Music Stand Light | 12 | 29
      Guitar Slide, Brass | 9 | 22
      Digital Metronome with Clip | 12 | 29
      Harmonica, Chromatic 12-Hole | 49 | 129
      Frame Drum, 16-inch | 39 | 99
      Accordion, 32-Key | 249 | 699
      Viola Outfit, 15-inch with Case | 179 | 449
      Portable Recorder, 4-Track | 99 | 249
      Resonator Guitar, Round Neck | 199 | 549
      Electric Violin Outfit with Bow | 149 | 399
      Concertina, 20-Button | 129 | 349
      Ocarina, 12-Hole Ceramic | 19 | 49
      Shaker Egg Set (6) | 8 | 19
      Djembe, 12-inch Rope-Tuned | 89 | 229
      Crotales, 8-Note Set | 79 | 199
      Bass Drum Pedal, Single Chain | 49 | 129
      Drum Throne, Padded Round Seat | 39 | 99
      Guitar Fretboard Tool Kit | 19 | 45
      Guitar Soundhole Pickup | 29 | 79
      Piano Dust Cover, Full Size | 25 | 59
      Microphone Cable 10 m, XLR | 19 | 45
      Dynamic Vocal Microphone | 39 | 99
      Portable PA Speaker, 8-inch | 149 | 399
      Studio Monitor Stands, Pair | 79 | 199
      Acoustic Foam Panels, 12-Pack | 39 | 99
      Violin Mute, Practice Rubber | 6 | 15
      Trumpet Mouthpiece, Medium Cup | 29 | 79
      Trombone, Student Model | 199 | 499
      Piccolo, Silver-Plated | 199 | 599
      Timpani Mallets (Pair) | 19 | 49
      Tabla Set with Cushions | 149 | 399
      Kalimba, 17-Key Solid Wood | 19 | 49
      Jaw Harp, Steel | 9 | 22
      Lyre Harp, 16-String | 79 | 199
      Washboard, Wooden with Thimbles | 29 | 69
      Cabasa, Medium | 19 | 45
      Rainstick, 24-inch | 15 | 39
      Udu Drum, Clay | 49 | 129
      Baritone Horn, Student Model | 299 | 799
      Guitar Looper Pedal | 79 | 199
      Direct Injection Box, Passive | 29 | 69
      Guitar String Winder with Cutter | 6 | 15
      Violin Bow, Carbon Fiber | 39 | 99
      Mountain Dulcimer, 4-String | 89 | 249
    `,
    health: `
      Digital Thermometer | 9 | 19
      Blood Pressure Monitor, Upper Arm | 35 | 79
      First Aid Kit, 120 Pieces | 19 | 39
      Vitamin D3 1000 IU (180 softgels) | 9 | 19
      Multivitamin for Adults (90 tablets) | 12 | 29
      Omega-3 Fish Oil (120 capsules) | 15 | 32
      Hand Sanitizer 500 ml | 4 | 9
      Disposable Face Masks (50-pack) | 7 | 15
      Heating Pad, Electric | 25 | 49
      Ice Pack, Reusable | 8 | 16
      Bathroom Scale, Body Composition | 25 | 59
      Pill Organizer, 7-Day AM/PM | 6 | 14
      Laundry Detergent, Fragrance-Free 2 L | 9 | 19
      Dishwasher Tablets (60 count) | 12 | 24
      Paper Towels (6 rolls) | 8 | 16
      Toilet Paper, 3-Ply (24 rolls) | 15 | 29
      All-Purpose Cleaner 750 ml | 3 | 7
      Trash Bags 50 L (40 count) | 8 | 16
      Humidifier, Cool Mist 4 L | 35 | 79
      Electrolyte Drink Mix (20 sticks) | 12 | 25
      Compression Socks, 15-20 mmHg | 15 | 35
      Reading Glasses +1.5 (3-pack) | 15 | 29
      Pulse Oximeter, Fingertip | 19 | 45
      Sleep Mask, Contoured | 9 | 22
      Digital Ear Thermometer | 12 | 29
      Nebulizer, Portable Compressor | 39 | 89
      Glucose Meter Starter Kit | 15 | 35
      Reusable Hot Water Bottle | 9 | 19
      Gauze Pads, Sterile (25-pack) | 6 | 14
      Antiseptic Wipes (100 count) | 6 | 13
      Cotton Swabs (500 count) | 3 | 8
      Nitrile Exam Gloves (100-pack) | 9 | 19
      Saline Nasal Spray 100 ml | 5 | 12
      Foam Earplugs (30 pairs) | 5 | 12
      Reusable Knee Support Sleeve | 12 | 29
      Wrist Brace with Splint | 15 | 35
      Shower Chair, Adjustable | 39 | 89
      Walking Cane, Folding | 19 | 45
      Bedside Humidifier Filter (2-pack) | 9 | 22
      Bath Mat, Non-Slip | 12 | 29
      Electric Toothbrush, Rechargeable | 19 | 49
      Dental Floss Picks (150 count) | 4 | 9
      Alcohol-Free Mouthwash 1 L | 5 | 12
      Water Flosser, Countertop | 39 | 89
      Orthotic Shoe Insoles, Trim-to-Fit | 12 | 29
      Ankle Support Wrap, Adjustable | 12 | 29
      Elastic Bandage Wrap 7.5 cm | 4 | 9
      Medical Paper Tape 2.5 cm | 3 | 7
      Disposable Underpads (25 count) | 12 | 29
      Adult Protective Underwear (12-pack) | 15 | 35
      Emergency Thermal Blanket (2-pack) | 5 | 12
      Bed Wedge Pillow | 25 | 59
      Lumbar Support Cushion | 19 | 45
      Fiber Supplement Powder 300 g | 12 | 25
      Vitamin C 500 mg (100 tablets) | 8 | 18
      Antacid Chewable Tablets (60 count) | 5 | 12
      Sterile Eye Wash 500 ml | 6 | 14
      Pill Crusher with Storage Compartment | 5 | 12
      Foot Care Pumice Stone Set | 6 | 14
      Disinfecting Surface Wipes (80 count) | 5 | 12
      Foaming Hand Soap Refill 1 L | 4 | 9
      Shower Grab Bar, 30 cm | 19 | 45
      Raised Toilet Seat with Handles | 39 | 89
      Reacher Grabber Tool, 81 cm | 12 | 29
      Yoga Mat, 6 mm | 15 | 35
      Textured Foam Roller, 45 cm | 12 | 29
      Resistance Band Set, 5 Levels | 12 | 29
      Nasal Rinse Bottle Kit | 9 | 22
      Contact Lens Solution 355 ml | 5 | 12
      Denture Cleaning Tablets (120 count) | 6 | 14
      Tongue Scraper, Stainless Steel | 4 | 9
      Wide-Jaw Nail Clippers | 6 | 14
      Gel Seat Cushion, Coccyx | 25 | 59
      Transfer Belt with 6 Handles | 19 | 45
      Medication Reminder Clock | 19 | 45
      Nursing Pillow, Crescent Shape | 25 | 59
      Baby Nasal Aspirator, Manual | 6 | 14
      Baby Bath Thermometer, Floating | 8 | 18
      Foam Dressing Pads, Sterile (10-pack) | 8 | 18
      Digital Body Fat Caliper | 6 | 14
      Air Mattress Overlay, Twin Size | 39 | 89
      Bed Rail Assist Handle | 39 | 89
      Reusable Ice Bag with Screw Cap | 9 | 22
      Heating Neck Wrap, Microwavable | 12 | 29
      Shampoo Basin, Inflatable | 19 | 45
      Portable Bidet Bottle, Squeeze Type | 9 | 22
    `,
    baby: `
      Diapers Size 3 (124 count) | 29 | 49
      Baby Wipes, Unscented (6 x 72) | 12 | 24
      Convertible Car Seat | 149 | 349
      Lightweight Stroller | 99 | 299
      Baby Carrier, Ergonomic | 49 | 149
      Swaddle Blankets, Muslin (3-pack) | 19 | 45
      Anti-Colic Baby Bottles 260 ml (4-pack) | 19 | 39
      Silicone Bib with Food Catcher | 8 | 16
      Baby Monitor with Camera | 59 | 169
      Crib Sheets, Organic Cotton (2-pack) | 19 | 39
      Teething Ring Set | 7 | 15
      High Chair, Foldable | 59 | 149
      Changing Pad with Cover | 25 | 49
      Baby Bath Tub, Foldable | 19 | 45
      Diaper Bag Backpack | 35 | 79
      Night Light with White Noise | 19 | 45
      Infant Bodysuits 0-3 Months (5-pack) | 15 | 32
      Soft Activity Book | 9 | 19
      Baby Nail Clipper Set | 6 | 14
      Play Mat, Foam Tiles | 29 | 69
      Sippy Cup with Handles 240 ml | 7 | 15
      Baby Sunscreen SPF 50, 75 ml | 9 | 18
      Stroller Organizer with Cup Holders | 15 | 32
      Portable Play Yard | 59 | 149
      Bottle Drying Rack with Drip Tray | 12 | 28
      Disposable Changing Liners (50 count) | 8 | 18
      Baby Gate, Pressure-Mounted | 29 | 69
      Breast Milk Storage Bags (100 count) | 9 | 19
      Nursing Pillow with Removable Cover | 25 | 55
      Baby Laundry Hamper, Collapsible | 15 | 35
      Stroller Rain Cover | 15 | 32
      Cabinet Safety Locks (10-pack) | 8 | 18
      Soft Corner Guards (8-pack) | 7 | 15
      Pacifier Set with Case (2-pack) | 8 | 18
      Pacifier Clips (2-pack) | 7 | 16
      Crib Mobile with Hanging Toys | 25 | 59
      Reusable Swim Diaper | 12 | 25
      Baby Socks, Non-Slip (6-pack) | 8 | 18
      Infant Winter Bunting | 29 | 69
      Foldable Baby Bath Seat | 19 | 39
      Bottle Insulated Travel Tote | 15 | 32
      Soft Baby Shoes, 0-6 Months | 12 | 29
      Portable Diaper Changing Clutch | 15 | 35
      Baby Food Freezer Tray with Lid | 8 | 19
      Wooden Baby Rattle | 6 | 14
      Portable Bottle Warmer | 25 | 59
      Bottle Brush Set with Stand | 8 | 18
      Baby Food Maker, Steam and Blend | 49 | 119
      Silicone Suction Plate and Spoon Set | 12 | 25
      Toddler Snack Cup, Spill-Resistant | 8 | 16
      Nursing Cover, Lightweight | 15 | 32
      Bottle Cooler Bag (4 bottles) | 19 | 39
      Crib Mattress Protector, Waterproof | 15 | 35
      Baby Wardrobe Hangers (20-pack) | 8 | 16
      Growth Chart, Wall-Mounted | 9 | 19
      Baby Keepsake Box | 19 | 45
      Wooden Shape Sorter | 15 | 32
      Stacking Cups (8-piece) | 6 | 14
      Baby Play Gym with Detachable Toys | 29 | 69
      Toddler Step Stool, Non-Slip | 15 | 35
      Baby Sun Hat, Adjustable | 9 | 19
      Fleece Baby Blanket 75 x 100 cm | 12 | 28
      Baby Leggings 6-12 Months (2-pack) | 12 | 25
      Baby Food Pouch Spoons (3-pack) | 7 | 15
      Portable Diaper Pail | 29 | 59
      Diaper Pail Refills (4-pack) | 12 | 25
      Infant Car Seat Mirror | 12 | 28
      Stroller Footmuff, Fleece-Lined | 29 | 69
      Baby Play Tunnel, Pop-Up | 19 | 39
      Baby Bib, Long-Sleeve (2-pack) | 12 | 25
      Car Window Sun Shades (2-pack) | 9 | 19
      Baby Laundry Wash Bag (2-pack) | 7 | 15
      Activity Cube with Spinning Gears | 19 | 45
      Wooden Peg Puzzle, Farm Animals | 9 | 19
      Diaper Caddy Organizer, Felt | 15 | 32
      Manual Baby Food Grinder | 19 | 39
      Crib Sheet Fasteners (4-pack) | 6 | 14
      Baby Bath Rinse Cup with Soft Edge | 7 | 15
      Outlet Covers, Baby Safety (36-pack) | 6 | 14
      Toddler Rain Boots, 12-18 Months | 15 | 32
      Baby Shower Cap with Soft Rim | 7 | 15
      Baby Playpen Floor Mat, Foldable | 25 | 59
      Baby Room Thermometer, Digital | 12 | 29
      Infant Bath Towel with Hood | 12 | 28
      Reusable Nursing Pads (8-pack) | 9 | 19
      Baby Food Bib, Waterproof (3-pack) | 8 | 18
      Stroller Cup Holder, Universal Fit | 9 | 22
      Baby Teething Mitt, Textured | 7 | 15
      Infant Mittens (3-pair set) | 6 | 14
      Crib Rail Cover, Padded (2-pack) | 15 | 32
      Baby Shower Gift Wrap Set | 9 | 19
      Toddler Art Smock, Long-Sleeve | 12 | 25
      Soft Blocks, Fabric (6-piece) | 15 | 32
      Toddler Bed Rail, Adjustable | 19 | 45
      Baby Bottle Drying Mat, Foldable | 8 | 18
      Toddler Backpack, Mini | 15 | 35
      Baby Hairbrush and Comb Set | 6 | 14
      Stroller Handlebar Organizer Pouch | 12 | 28
      Infant Sleep Sack, Lightweight | 19 | 45
      Baby Room Blackout Curtains, Pair | 25 | 59
    `,
    tools: `
      Cordless Drill/Driver 18 V | 69 | 179
      Drill Bit Set, 50 Pieces | 19 | 45
      Claw Hammer 16 oz | 12 | 29
      Screwdriver Set, 12 Pieces | 15 | 35
      Tape Measure 5 m | 8 | 19
      Spirit Level 60 cm | 12 | 29
      Utility Knife with 10 Blades | 8 | 18
      Adjustable Wrench 250 mm | 12 | 25
      Socket Set 1/4" & 3/8", 46 Pieces | 29 | 69
      Stud Finder | 19 | 39
      Work Gloves, Leather | 12 | 25
      Safety Glasses, Clear | 6 | 14
      Step Ladder, 3 Steps | 39 | 89
      Toolbox 19 inch | 19 | 45
      Wood Glue 250 ml | 5 | 10
      Sandpaper Assortment (30 sheets) | 9 | 18
      Paint Roller Kit | 12 | 25
      Interior Wall Paint, Eggshell 1 gal | 29 | 55
      Extension Cord 10 m | 15 | 35
      Wall Anchors and Screws Kit | 9 | 19
      Pliers Set, 3 Pieces | 19 | 39
      Cordless Impact Driver 18 V | 89 | 199
      Hacksaw 300 mm | 12 | 25
      Caulk Gun, Dripless | 9 | 22
      Random Orbit Sander 5 inch | 29 | 79
      Bench Vise 4 inch | 39 | 99
      Folding Workbench | 49 | 119
      Router Bit Set, 15 Pieces | 25 | 59
      Chisel Set, 4 Pieces | 19 | 45
      Metal File Set, 5 Pieces | 12 | 29
      Pruning Shears 8 inch | 12 | 29
      Pipe Wrench 300 mm | 19 | 45
      Hex Key Set, 30 Pieces | 9 | 22
      Manual Staple Gun | 15 | 35
      Hand Saw 500 mm | 12 | 29
      Digital Multimeter | 19 | 49
      Hearing Protection Earmuffs | 15 | 35
      Knee Pads, Pair | 19 | 45
      Door Hinge Set, 4 Pieces | 12 | 29
      Cabinet Handle Set, 10 Pieces | 15 | 35
      Deck Screws 75 mm (100 pieces) | 9 | 19
      PVC Pipe Cutter 42 mm | 19 | 45
      Tile Spacer Set 3 mm (200 pieces) | 5 | 12
      Paint Scraper with 5 Blades | 8 | 18
      Combination Square 300 mm | 12 | 29
      Bolt Cutter 450 mm | 25 | 59
      Lawn and Leaf Rake, Steel | 15 | 35
      Garden Trowel with Wood Handle | 6 | 14
      Pipe Deburring Tool | 9 | 22
      Locking Pliers 250 mm | 12 | 29
      Heat Gun, Dual Temperature | 25 | 59
      Soldering Iron Kit, 60 W | 19 | 49
      Cable Stapler | 15 | 35
      Wire Stripper and Cutter | 9 | 22
      Rivet Gun with Assorted Rivets | 19 | 45
      Workbench Pegboard Tool Organizer | 25 | 59
      Roofing Nail Puller | 15 | 35
      Concrete Mixing Paddle 100 mm | 12 | 29
      Tile Nippers 200 mm | 12 | 29
      Hand Plane 230 mm | 19 | 45
      Combination Wrench Set, 10 Pieces | 25 | 59
      Air Hose 10 m | 19 | 45
      Magnetic Parts Tray, 150 mm | 6 | 14
      Flush Cut Pull Saw 240 mm | 19 | 45
      Folding Pruning Saw 180 mm | 12 | 29
      Paint Edger with Guide Wheels | 8 | 18
      Drywall Taping Knife 250 mm | 9 | 22
      Pipe Clamp, 600 mm | 12 | 29
      Metal Snips, Straight Cut | 15 | 35
      Diamond Tile Blade 115 mm | 12 | 29
      Torque Wrench 1/2 inch Drive | 39 | 99
      Wood Chisel 25 mm | 9 | 22
      Magnetic Screwdriver Bit Holder | 6 | 14
      Garden Hand Fork with Ash Handle | 8 | 18
      Cable Ties Assortment (200 pieces) | 5 | 12
      Measuring Wheel, 100 m | 25 | 59
      Lineman Pliers 200 mm | 12 | 29
      Drywall Saw with Pointed Tip | 8 | 18
      Paint Tray and Liner Set | 6 | 14
      Bench Brush with Wooden Handle | 5 | 12
      Pry Bar Set, 3 Pieces | 15 | 35
      Faucet Installation Tool | 9 | 22
      Manual Log Splitter Wedge | 19 | 45
      Angle Grinder 115 mm | 39 | 99
      Jigsaw 600 W | 39 | 89
      Bench Grinder 150 mm | 49 | 119
      Brad Nailer 18 Gauge | 39 | 99
      Laser Distance Meter 40 m | 19 | 49
      Digital Caliper 150 mm | 15 | 39
      Feeler Gauge Set, 32 Blades | 6 | 14
      Bar Clamp Set, 4 Pieces | 19 | 45
      Diamond Hole Saw Kit, 6 Pieces | 19 | 45
      Tap and Die Set, 40 Pieces | 29 | 69
      Adjustable Basin Wrench | 12 | 29
      Telescoping Inspection Mirror | 8 | 18
      Pruning Loppers 600 mm | 15 | 35
    `,
  };

  const PRODUCTS = [];
  for (const [category, block] of Object.entries(RAW_PRODUCTS)) {
    for (const [name, lo, hi, unit] of C.rows(block)) {
      const p = { name, category, priceMin: Number(lo), priceMax: Number(hi) };
      if (unit) p.unit = unit;
      PRODUCTS.push(p);
    }
  }

  // Dish options presets.
  const OPT = {
    size: { name: 'Size', values: ['Small', 'Regular', 'Large'] },
    spice: { name: 'Spice level', values: ['Mild', 'Medium', 'Hot', 'Extra hot'] },
    protein: { name: 'Protein', values: ['Chicken', 'Beef', 'Tofu', 'Shrimp'] },
    crust: { name: 'Crust', values: ['Thin', 'Classic', 'Stuffed'] },
    doneness: { name: 'Cooked', values: ['Medium rare', 'Medium', 'Well done'] },
    bread: { name: 'Bread', values: ['White', 'Whole wheat', 'Sourdough', 'Gluten-free'] },
    side: { name: 'Side', values: ['Fries', 'Side salad', 'Sweet potato fries', 'Coleslaw'] },
    milk: { name: 'Milk', values: ['Whole', 'Skim', 'Oat', 'Almond', 'Soy'] },
    dressing: { name: 'Dressing', values: ['Vinaigrette', 'Ranch', 'Caesar', 'On the side'] },
    rice: { name: 'Rice', values: ['Steamed', 'Brown', 'Fried', 'No rice'] },
    ice: { name: 'Ice', values: ['Regular ice', 'Light ice', 'No ice'] },
    sweet: { name: 'Sweetness', values: ['0%', '25%', '50%', '100%'] },
  };

  // name | category | price | option presets (comma separated, optional)
  const DISHES = C.rows(`
    Crispy Calamari | Starters | 11.5
    Garlic Bread with Mozzarella | Starters | 6.5
    Spring Rolls (4 pcs) | Starters | 7
    Chicken Wings (8 pcs) | Starters | 12 | spice
    Hummus with Warm Pita | Starters | 8
    Edamame with Sea Salt | Starters | 5.5
    Bruschetta al Pomodoro | Starters | 8.5
    Loaded Nachos | Starters | 10.5 | spice
    Vegetable Samosas (3 pcs) | Starters | 6.5
    Pork Gyoza (6 pcs) | Starters | 8
    Mozzarella Sticks | Starters | 8
    Tomato Basil Soup | Soups | 6 | size
    French Onion Soup | Soups | 7.5
    Chicken Noodle Soup | Soups | 6.5 | size
    Miso Soup | Soups | 3.5
    Tom Yum Goong | Soups | 9.5 | spice
    Lentil and Spinach Soup | Soups | 6
    Clam Chowder | Soups | 8 | size
    Caesar Salad | Salads | 10 | protein
    Greek Salad with Feta | Salads | 10.5 | dressing
    Quinoa Power Bowl | Salads | 12.5 | protein
    Caprese Salad | Salads | 9.5
    Cobb Salad | Salads | 13 | dressing
    Thai Papaya Salad | Salads | 9 | spice
    Roasted Beet and Goat Cheese Salad | Salads | 11
    Margherita Pizza | Pizza | 13 | size,crust
    Pepperoni Pizza | Pizza | 15 | size,crust
    Four Cheese Pizza | Pizza | 15.5 | size,crust
    BBQ Chicken Pizza | Pizza | 16 | size,crust
    Mushroom and Truffle Pizza | Pizza | 17 | size,crust
    Hawaiian Pizza | Pizza | 15 | size,crust
    Veggie Supreme Pizza | Pizza | 15 | size,crust
    Spicy Salami and Honey Pizza | Pizza | 16.5 | size,crust
    Classic Cheeseburger | Burgers | 13 | doneness,side
    Bacon Smash Burger | Burgers | 14.5 | doneness,side
    Mushroom Swiss Burger | Burgers | 14 | doneness,side
    Crispy Chicken Sandwich | Burgers | 12.5 | side,spice
    Black Bean Veggie Burger | Burgers | 12 | side
    Double Patty Burger | Burgers | 16 | doneness,side
    Lamb Burger with Tzatziki | Burgers | 15 | doneness,side
    Pad Thai | Noodles | 13.5 | protein,spice
    Beef Pho | Noodles | 13 | size
    Chicken Ramen | Noodles | 14 | spice
    Tonkotsu Ramen | Noodles | 15
    Dan Dan Noodles | Noodles | 12 | spice
    Spaghetti Carbonara | Noodles | 14.5
    Penne Arrabbiata | Noodles | 12.5 | spice
    Fettuccine Alfredo | Noodles | 14 | protein
    Lasagna Bolognese | Noodles | 15.5
    Shrimp Linguine | Noodles | 17
    Yaki Udon | Noodles | 13 | protein
    Chicken Teriyaki Bowl | Rice bowls | 13 | rice
    Bibimbap | Rice bowls | 14 | protein,spice
    Poke Bowl, Salmon | Rice bowls | 15.5 | rice
    Poke Bowl, Tuna | Rice bowls | 16 | rice
    Burrito Bowl | Rice bowls | 12.5 | protein,spice
    Katsu Curry Rice | Rice bowls | 14
    Nasi Goreng | Rice bowls | 13 | spice
    Mushroom Risotto | Rice bowls | 15
    Paella Valenciana | Rice bowls | 19
    Chicken Tikka Masala | Curries | 15 | spice,rice
    Butter Chicken | Curries | 15 | spice,rice
    Lamb Rogan Josh | Curries | 17 | spice,rice
    Chana Masala | Curries | 12 | spice,rice
    Palak Paneer | Curries | 13.5 | spice,rice
    Thai Green Curry | Curries | 14 | protein,spice
    Massaman Curry | Curries | 14.5 | protein
    Japanese Beef Curry | Curries | 14
    Dal Makhani | Curries | 11.5 | rice
    Salmon Nigiri (2 pcs) | Sushi | 6
    California Roll (8 pcs) | Sushi | 9
    Spicy Tuna Roll (8 pcs) | Sushi | 10.5
    Dragon Roll | Sushi | 15
    Vegetable Maki (6 pcs) | Sushi | 7
    Sashimi Platter (12 pcs) | Sushi | 24
    Rainbow Roll | Sushi | 16
    Carnitas Tacos (3) | Tacos | 11.5 | spice
    Fish Tacos (3) | Tacos | 12.5 | spice
    Al Pastor Tacos (3) | Tacos | 11.5 | spice
    Mushroom Tacos (3) | Tacos | 10.5 | spice
    Chicken Quesadilla | Tacos | 11
    Beef Burrito | Tacos | 12.5 | spice
    Chicken Enchiladas | Tacos | 13.5 | spice
    Club Sandwich | Sandwiches | 12 | bread,side
    Turkey and Avocado Wrap | Sandwiches | 11 | side
    Grilled Cheese and Tomato | Sandwiches | 9 | bread
    BLT on Sourdough | Sandwiches | 10.5 | side
    Falafel Wrap | Sandwiches | 10 | spice
    Chicken Shawarma Plate | Sandwiches | 13.5 | spice
    Philly Cheesesteak | Sandwiches | 14 | side
    Banh Mi, Lemongrass Pork | Sandwiches | 11 | spice
    Grilled Salmon with Lemon Butter | Mains | 22
    Ribeye Steak 300 g | Mains | 32 | doneness,side
    Roast Chicken, Half | Mains | 19 | side
    Fish and Chips | Mains | 16.5
    Beef Bourguignon | Mains | 23
    Shepherd's Pie | Mains | 16
    Eggplant Parmigiana | Mains | 15.5
    Pork Schnitzel with Potato Salad | Mains | 18.5
    Moussaka | Mains | 17
    Stuffed Bell Peppers | Mains | 14.5
    Seared Tofu with Bok Choy | Mains | 14
    French Fries | Sides | 4.5 | size
    Sweet Potato Fries | Sides | 5.5 | size
    Onion Rings | Sides | 5.5
    Steamed Jasmine Rice | Sides | 3
    Garlic Naan | Sides | 3.5
    Roasted Seasonal Vegetables | Sides | 5.5
    Mashed Potatoes | Sides | 4.5
    Mac and Cheese | Sides | 6
    Kimchi | Sides | 4
    Side Salad | Sides | 4.5 | dressing
    Tiramisu | Desserts | 7.5
    Chocolate Lava Cake | Desserts | 8
    New York Cheesecake | Desserts | 7.5
    Mango Sticky Rice | Desserts | 7
    Crème Brûlée | Desserts | 8
    Apple Crumble with Custard | Desserts | 7
    Matcha Ice Cream (2 scoops) | Desserts | 5.5
    Churros with Chocolate Sauce | Desserts | 6.5
    Baklava (3 pcs) | Desserts | 6
    Lemon Tart | Desserts | 6.5
    Fresh Fruit Cup | Desserts | 5
    Espresso | Drinks | 2.8
    Flat White | Drinks | 4.2 | milk
    Cappuccino | Drinks | 4 | size,milk
    Iced Latte | Drinks | 4.8 | size,milk,ice
    Matcha Latte | Drinks | 5 | milk,sweet
    Fresh Orange Juice | Drinks | 4.5 | size
    Lemonade, Homemade | Drinks | 3.8 | ice
    Mango Lassi | Drinks | 4.5
    Bubble Milk Tea | Drinks | 5.5 | size,sweet,ice
    Iced Tea, Peach | Drinks | 3.5 | ice,sweet
    Sparkling Water 500 ml | Drinks | 2.5
    Cola 330 ml | Drinks | 2.5
    Hot Chocolate | Drinks | 4 | milk
    Berry Smoothie | Drinks | 6 | size
    Avocado Toast with Poached Egg | Breakfast | 11
    Buttermilk Pancakes (3) | Breakfast | 10
    Eggs Benedict | Breakfast | 13
    Shakshuka | Breakfast | 12
    Granola with Yogurt and Berries | Breakfast | 8.5
    Full Breakfast Plate | Breakfast | 15 | bread
    Breakfast Burrito | Breakfast | 10.5 | spice
    Belgian Waffle with Strawberries | Breakfast | 10
    Croissant, Butter | Breakfast | 3.5
    Veggie Omelette | Breakfast | 11 | bread
    Baked Feta with Olives | Starters | 9
    Coconut Shrimp (6 pcs) | Starters | 12.5
    Stuffed Mushrooms (5 pcs) | Starters | 8.5
    Charred Shishito Peppers | Starters | 7
    Beef Satay Skewers (4) | Starters | 10.5
    Whipped Ricotta with Honey | Starters | 8
    Crispy Pork Belly Bites | Starters | 11
    Aloo Tikki (4 pcs) | Starters | 7.5
    Smoked Salmon Crostini | Starters | 10
    Crab Cakes (2) | Starters | 14
    Roasted Pumpkin Soup | Soups | 6.5 | size
    Broccoli Cheddar Soup | Soups | 7
    Beef Barley Soup | Soups | 8 | size
    Coconut Carrot Ginger Soup | Soups | 6.5
    Seafood Bisque | Soups | 9
    Wild Mushroom Soup | Soups | 7.5
    Cucumber Dill Soup | Soups | 6
    Minestrone with White Beans | Soups | 7
    Watermelon and Feta Salad | Salads | 10.5
    Pear and Walnut Salad | Salads | 12
    Nicoise Salad | Salads | 14
    Avocado and Citrus Salad | Salads | 11
    Grilled Halloumi Salad | Salads | 13
    Shaved Brussels Sprout Salad | Salads | 11.5
    Prosciutto and Fig Pizza | Pizza | 17 | size,crust
    Roasted Eggplant Pizza | Pizza | 15.5 | size,crust
    Chicken Pesto Pizza | Pizza | 16.5 | size,crust
    Pastrami Burger | Burgers | 15 | doneness,side
    Crispy Fish Sandwich | Burgers | 13 | side
    Soba Noodles with Sesame Vegetables | Noodles | 12
    Bucatini with Sausage Ragu | Noodles | 16
    Gnocchi with Sage Brown Butter | Noodles | 15
    Cold Sesame Noodles | Noodles | 11
    Cavatappi with Roasted Tomato Cream | Noodles | 14
    Teriyaki Tofu Bowl | Rice bowls | 12.5 | rice
    Chicken Katsu Donburi | Rice bowls | 14
    Cajun Jambalaya Bowl | Rice bowls | 15 | spice
    Pork Belly Bibimbap | Rice bowls | 16 | spice
    Coconut Lentil Curry | Curries | 12 | spice,rice
    Goan Fish Curry | Curries | 17 | spice,rice
    Beef Madras | Curries | 16 | spice,rice
    Prawn Korma | Curries | 17 | spice,rice
    Chicken Vindaloo | Curries | 15.5 | spice,rice
    Kerala Vegetable Stew | Curries | 13.5 | rice
    Ebi Tempura Roll (8 pcs) | Sushi | 13
    Cucumber Avocado Roll (6 pcs) | Sushi | 7.5
    Yellowtail Scallion Roll (8 pcs) | Sushi | 12
    Inari Sushi (2 pcs) | Sushi | 6.5
    Unagi Nigiri (2 pcs) | Sushi | 8
    Spicy Crab Hand Roll | Sushi | 9.5
    Lobster Roll (8 pcs) | Sushi | 19
    Barbacoa Tacos (3) | Tacos | 13.5 | spice
    Baja Shrimp Tacos (3) | Tacos | 14 | spice
    Pork Belly Tacos (3) | Tacos | 13 | spice
    Duck Confit Tacos (3) | Tacos | 15 | spice
    Carne Asada Burrito | Tacos | 14 | spice
    Chorizo and Potato Tacos (3) | Tacos | 12 | spice
    Smoked Turkey Club Wrap | Sandwiches | 12 | side
    Tuna Melt on Rye | Sandwiches | 11.5 | bread
    Roasted Vegetable Panini | Sandwiches | 11 | side
    Cuban Pressed Sandwich | Sandwiches | 13.5 | side
    Roasted Cauliflower Steak | Mains | 16
    Veal Marsala | Mains | 24 | doneness,side
    Baked Arctic Char with Dill | Mains | 23
    Crispy Polenta Cakes | Sides | 5.5
    Charred Broccolini | Sides | 6
    Cornbread with Honey Butter | Sides | 4.5
    Couscous with Herbs | Sides | 4
    Grilled Asparagus | Sides | 6.5
    Parmesan Truffle Tots | Sides | 6
    Roasted Garlic Cauliflower | Sides | 5.5
    Cucumber Yogurt | Sides | 4.5
    Pickled Vegetables | Sides | 3.5
    Herbed Barley Pilaf | Sides | 4.5
    Panna Cotta with Berry Compote | Desserts | 7
    Sticky Toffee Pudding | Desserts | 8
    Pistachio Rosewater Cake | Desserts | 7.5
    Peach Cobbler with Vanilla Cream | Desserts | 7.5
    Coconut Rice Pudding | Desserts | 6
    Profiteroles with Pastry Cream | Desserts | 8.5
    Black Sesame Mochi (3 pcs) | Desserts | 6.5
    Raspberry Mousse | Desserts | 7
    Cardamom Poached Pear | Desserts | 7.5
    Americano | Drinks | 3
    Turmeric Ginger Tea | Drinks | 3.5
    Cold Brew Coffee | Drinks | 4.5
    Vanilla Bean Frappé | Drinks | 5.5 | size,milk
    Hibiscus Iced Tea | Drinks | 3.8 | ice,sweet
    Cucumber Mint Cooler | Drinks | 4.5 | ice
    Pomegranate Spritzer | Drinks | 4.8
    Chai Latte | Drinks | 4.8 | milk,sweet
    Watermelon Juice | Drinks | 4.5 | size
    Pineapple Coconut Smoothie | Drinks | 6.5 | size
    Grapefruit Soda | Drinks | 3.5
    Steamed Milk with Cinnamon | Drinks | 3.5 | milk
    Cornmeal Porridge with Maple | Breakfast | 8
    Smoked Salmon Bagel | Breakfast | 12 | bread
    Huevos Rancheros | Breakfast | 12.5 | spice
    Lemon Ricotta Pancakes | Breakfast | 11
    French Toast with Pears | Breakfast | 10.5
    Savory Oatmeal with Mushrooms | Breakfast | 9
    Ham and Gruyère Croissant | Breakfast | 7.5
    Crispy Zucchini Fritters | Starters | 8
    Grilled Peach and Burrata Salad | Salads | 12.5
    Whipped Feta with Roasted Tomatoes | Starters | 9
    Crispy Rice Cakes with Chili Jam | Starters | 8
    Smoked Haddock Croquettes (4) | Starters | 10.5
    Grilled Octopus with Lemon | Starters | 14
    Pimento Cheese with Crackers | Starters | 8.5
    Chicken Satay with Peanut Sauce | Starters | 10
    Fried Green Tomatoes | Starters | 7.5
    Burrata with Stone Fruit | Starters | 12
    Sweet Corn Chowder | Soups | 7
    Roasted Cauliflower Soup | Soups | 7.5 | size
    Chicken and Rice Soup | Soups | 7
    Borscht with Sour Cream | Soups | 8
    Smoky Black Bean Soup | Soups | 7.5 | size
    Avgolemono Soup | Soups | 8.5
    Cream of Asparagus Soup | Soups | 7
    Seaweed and Tofu Soup | Soups | 5.5
    Shaved Fennel and Orange Salad | Salads | 11
    Roasted Carrot and Lentil Salad | Salads | 12
    Grilled Shrimp and Avocado Salad | Salads | 15
    Spinach Salad with Warm Bacon | Salads | 12.5
    Cabbage Salad with Sesame Dressing | Salads | 9.5
    Tomato and White Bean Salad | Salads | 10.5
    Smoked Brisket Pizza | Pizza | 18.5 | size,crust
    Pulled Pork Burger | Burgers | 14.5 | side
    Lentil Walnut Burger | Burgers | 12.5 | side
    Prawn and Crab Burger | Burgers | 17 | side
    Herb Crusted Veggie Burger | Burgers | 12.5 | side
    Crispy Duck Noodle Soup | Noodles | 15 | spice
    Lemon Chicken Orzo | Noodles | 13.5
    Garlic Shrimp Soba | Noodles | 16 | spice
    Baked Ziti with Ricotta | Noodles | 14.5
    Pad See Ew | Noodles | 13.5 | protein,spice
    Linguine with Clams and Parsley | Noodles | 17
    Spicy Miso Udon | Noodles | 14.5 | spice
    Ricotta Ravioli with Tomato Sauce | Noodles | 15
    Crispy Duck Rice Bowl | Rice bowls | 16 | rice
    Ginger Pork Rice Bowl | Rice bowls | 14 | rice
    Teriyaki Salmon Donburi | Rice bowls | 17 | rice
    Paneer Makhani | Curries | 14 | spice,rice
    Salmon Avocado Roll (8 pcs) | Sushi | 12
    Tamago Nigiri (2 pcs) | Sushi | 6
    Scallop Nigiri (2 pcs) | Sushi | 9
    Philadelphia Roll (8 pcs) | Sushi | 11
    Sweet Potato Tempura Roll (8 pcs) | Sushi | 9
    Hamachi Jalapeño Roll | Sushi | 14
    Eel Cucumber Roll (8 pcs) | Sushi | 13
    Chirashi Sushi Bowl | Sushi | 19
    Salmon Skin Hand Roll | Sushi | 8.5
    Birria Tacos (3) | Tacos | 14 | spice
    Crispy Chicken Tacos (3) | Tacos | 12.5 | spice
    Roasted Poblano and Corn Tacos (3) | Tacos | 11
    Chorizo Breakfast Tacos (3) | Tacos | 11
    Lobster Salad Roll | Sandwiches | 19
    Pastrami on Marble Rye | Sandwiches | 13 | side
    Shrimp Po' Boy | Sandwiches | 15 | side,spice
    Curried Chickpea Pita | Sandwiches | 10.5 | spice
    Chicken Piccata with Capers | Mains | 19 | side
    Maple Glazed Ham Steak | Mains | 18.5 | side
    Crispy Smashed Potatoes | Sides | 5
    Brown Butter Carrots | Sides | 5.5
    Creamed Spinach | Sides | 5.5
    Corn Pudding | Sides | 5
    Polenta with Parmesan | Sides | 5.5
    Braised Red Cabbage | Sides | 4.5
    Fried Plantains | Sides | 5
    Lemon Orzo Pilaf | Sides | 4.5
    Grilled Zucchini with Mint | Sides | 5.5
    Roasted Beets with Orange | Sides | 5
    Dulce de Leche Flan | Desserts | 7
    Chocolate Hazelnut Tart | Desserts | 8.5
    Lime Coconut Bars | Desserts | 6.5
    Blueberry Bread Pudding | Desserts | 7.5
    Pear Frangipane Tart | Desserts | 8
    Cardamom Rice Custard | Desserts | 6.5
    Strawberry Shortcake | Desserts | 7.5
    Chocolate Dipped Orange Cake | Desserts | 7
    Honey Yogurt Panna Cotta | Desserts | 7.5
    Maple Oat Latte | Drinks | 4.8 | milk
    Rosemary Grapefruit Fizz | Drinks | 5
    Iced Hibiscus Limeade | Drinks | 4 | ice,sweet
    Black Sesame Milk | Drinks | 4.5 | milk,sweet
    Ginger Peach Kombucha | Drinks | 5
    Vanilla Rooibos Tea | Drinks | 3.5
    Blood Orange Soda | Drinks | 4
    Salted Caramel Mocha | Drinks | 5 | milk
    Coconut Matcha Tonic | Drinks | 5.5 | ice,sweet
    Smoked Salmon Potato Rösti | Breakfast | 12.5
    Apple Cinnamon French Toast | Breakfast | 10.5
    Chia Pudding with Mango | Breakfast | 8.5
    Mushroom and Fontina Strata | Breakfast | 10
    Buckwheat Crepes with Banana | Breakfast | 10.5
    Breakfast Polenta with Fried Egg | Breakfast | 9.5
    Pear and Almond Baked Oatmeal | Breakfast | 8.5
    Crispy Artichoke Hearts | Starters | 9 | spice
    Seared Scallops with Corn Purée | Starters | 15
    Lamb Kofta with Mint Yogurt | Starters | 11
    Caramelized Onion Tartlets (3) | Starters | 8.5
    Crispy Oyster Mushrooms | Starters | 9.5
    Baked Brie with Fig Jam | Starters | 12
    Shrimp Toast with Sesame | Starters | 10.5
    Marinated White Beans with Herbs | Starters | 7
    Grilled Eggplant Dip with Pita | Starters | 8.5
    Roasted Parsnip Soup | Soups | 7 | size
    Turkey and Wild Rice Soup | Soups | 8.5 | size
    Chilled Tomato Gazpacho | Soups | 6.5
    Sweet Potato Coconut Soup | Soups | 7.5 | spice
    Chicken Tortilla Soup | Soups | 8 | spice
    Leek and Potato Soup | Soups | 7
    White Bean and Kale Soup | Soups | 7.5
    Roasted Delicata Squash Salad | Salads | 12.5
    Crab and Grapefruit Salad | Salads | 16
    Heritage Tomato Salad with Basil Oil | Salads | 10
    Warm Lentil Salad with Goat Cheese | Salads | 12.5
    Crispy Duck and Cabbage Salad | Salads | 15
    Bacon and Leek Pizza | Pizza | 16.5 | size,crust
    Pesto Potato Pizza | Pizza | 15 | size,crust
    Crispy Eggplant Burger | Burgers | 12.5 | side
    Smoked Salmon Burger | Burgers | 15 | side
    Cajun Shrimp Burger | Burgers | 16 | side,spice
    Orecchiette with Broccoli Rabe | Noodles | 15
    Thai Basil Chicken Noodles | Noodles | 14 | spice
    Lobster Macaroni | Noodles | 19
    Pumpkin Sage Tortellini | Noodles | 16
    Lemon Dill Salmon Orzo | Noodles | 16
    Beef Chow Fun | Noodles | 15 | spice
    Miso Butter Mushroom Bowl | Rice bowls | 14 | rice
    Crispy Pork Katsu Bowl | Rice bowls | 15 | rice
    Coconut Shrimp Rice Bowl | Rice bowls | 16 | rice
    Pork Adobo Rice Bowl | Rice bowls | 15 | rice
    Kashmiri Chicken Curry | Curries | 16 | spice,rice
    Beef Keema with Peas | Curries | 15.5 | spice,rice
    Matar Paneer | Curries | 13.5 | spice,rice
    Korean Curry Chicken | Curries | 15.5 | spice,rice
    Seared Tuna Tataki (6 pcs) | Sushi | 14
    Shrimp Tempura Nigiri (2 pcs) | Sushi | 8
    Avocado Cucumber Hand Roll | Sushi | 8
    Salmon Oshizushi (6 pcs) | Sushi | 13
    Fried Tofu Inari (3 pcs) | Sushi | 8.5
    Yellowtail Citrus Sashimi (6 pcs) | Sushi | 16
    Eel Avocado Hand Roll | Sushi | 10
    Spicy Salmon Crunch Roll (8 pcs) | Sushi | 13
    Cochinita Pibil Tacos (3) | Tacos | 13 | spice
    Grilled Swordfish Tacos (3) | Tacos | 15 | spice
    Braised Short Rib Tacos (3) | Tacos | 15 | spice
    Crispy Cauliflower Tacos (3) | Tacos | 11 | spice
    Pork Carnitas Burrito Bowl | Tacos | 13 | spice
    Beef Barbacoa Quesadilla | Tacos | 13.5
    Sweet Corn and Zucchini Tacos (3) | Tacos | 10.5
    Duck Mole Enchiladas | Tacos | 15 | spice
    Crab Cake Sandwich | Sandwiches | 16 | side
    Roast Lamb Pita with Cucumber | Sandwiches | 14
    Crispy Tofu Banh Mi | Sandwiches | 11 | spice
    Grilled Sausage Hoagie | Sandwiches | 13 | side
    Cider Glazed Pork Belly | Mains | 22 | side
    Roasted Cauliflower and Lentil Loaf | Mains | 16
    Crispy Sage Gnocchi Bites | Sides | 6
    Baked Sweet Potato with Chive Butter | Sides | 5.5
    Braised Fennel with Orange | Sides | 5.5
    Wild Rice with Cranberries | Sides | 5
    Crispy Brussels Sprouts with Lemon | Sides | 6
    Charred Acorn Squash with Sage | Sides | 5.5
    Green Beans with Toasted Almonds | Sides | 5.5
    Buttermilk Biscuits (2) | Sides | 4
    Saffron Couscous | Sides | 5.5
    Orange Blossom Semolina Cake | Desserts | 7.5
    Blackberry Cobbler with Cream | Desserts | 8
    Espresso Panna Cotta | Desserts | 7.5
    Maple Pecan Pie | Desserts | 7
    Lemon Posset with Shortbread | Desserts | 7.5
    Rhubarb Almond Crisp | Desserts | 7
    Chocolate Tahini Brownie | Desserts | 7
    Cherry Clafoutis | Desserts | 8
    Vanilla Bean Rice Pudding | Desserts | 6.5
    Pistachio Affogato | Desserts | 7
    Lavender Honey Latte | Drinks | 4.8 | milk
    Tamarind Lime Soda | Drinks | 4.5
    Iced Yuzu Green Tea | Drinks | 4 | ice,sweet
    Spiced Apple Cider | Drinks | 3.8
    Coconut Water with Lime | Drinks | 3.5
    Toasted Marshmallow Cocoa | Drinks | 4.5 | milk
    Pear Ginger Smoothie | Drinks | 6 | size
    Blackberry Sage Iced Tea | Drinks | 4 | ice,sweet
    Savory Mushroom Crepes | Breakfast | 10.5
    Orange Poppy Seed French Toast | Breakfast | 10.5
    Brioche French Toast with Plums | Breakfast | 11
    Blueberry Lemon Scones (2) | Breakfast | 6.5
    Crispy Parmesan Artichokes | Starters | 9.5
    Duck Spring Rolls with Plum Sauce | Starters | 11
    Smoked Eggplant with Pomegranate | Starters | 9
    Seared Tuna Bites with Sesame | Starters | 13.5
    Potato and Pea Samosa Chaat | Starters | 8.5
    Baked Goat Cheese with Thyme | Starters | 10
    Crispy Calabrian Chickpeas | Starters | 7
    Lobster Stuffed Mushrooms | Starters | 15
    Grilled Halloumi with Hot Honey | Starters | 10.5
    Pork and Chive Dumplings (6 pcs) | Starters | 9
    Roasted Celery Root Soup | Soups | 7
    Shrimp and Corn Bisque | Soups | 9.5
    Chilled Cucumber Avocado Soup | Soups | 7.5
    Smoked Tomato Soup | Soups | 7 | size
    Chicken Pozole Verde | Soups | 9 | spice
    Barley and Root Vegetable Soup | Soups | 7.5
    Creamy Parsnip and Pear Soup | Soups | 8
    Ginger Pork and Cabbage Soup | Soups | 8.5 | spice
    Roasted Plum and Ricotta Salad | Salads | 12
    Grilled Octopus and Potato Salad | Salads | 15
    Wild Rice Salad with Cranberries | Salads | 11.5
    Shaved Kohlrabi and Apple Salad | Salads | 10
    Roasted Mushroom and Barley Salad | Salads | 12.5
    Smoked Duck and Cherry Salad | Salads | 15
    Citrus Shrimp Salad with Fennel | Salads | 14.5
    Roasted Garlic Turkey Burger | Burgers | 14 | side
    Chicken Chow Mein | Noodles | 13.5 | protein
    Spinach and Ricotta Manicotti | Noodles | 14.5
    Pork and Kimchi Japchae | Noodles | 15 | spice
    Miso Glazed Cod Bowl | Rice bowls | 17 | rice
    Toro Nigiri (2 pcs) | Sushi | 11
    Kampyo Roll (6 pcs) | Sushi | 7
    Salmon Tempura Roll (8 pcs) | Sushi | 13.5
    Octopus Nigiri (2 pcs) | Sushi | 8.5
    King Crab Temaki | Sushi | 12
    Tofu Skin Roll with Pickled Radish | Sushi | 9
    Scallop and Yuzu Roll (8 pcs) | Sushi | 15
    Mackerel Sashimi (6 pcs) | Sushi | 14
    Pork Chile Verde Tacos (3) | Tacos | 13 | spice
    Grilled Mahi Mahi Tacos (3) | Tacos | 15 | spice
    Roasted Sweet Corn Quesadilla | Tacos | 10.5
    Duck Carnitas Tostadas (2) | Tacos | 15 | spice
    Crispy Shrimp Flautas (4) | Tacos | 14 | spice
    Baked Haddock with Herbed Breadcrumbs | Mains | 19
    Eggplant and Chickpea Tagine | Mains | 17 | spice
    Crispy Chickpea Fritters | Sides | 5
    Roasted Delicata Squash with Maple | Sides | 6
    Herbed Spaetzle | Sides | 5.5
    Sautéed Kale with Garlic | Sides | 5
    Baked Parmesan Polenta | Sides | 5.5
    Crispy Rice with Scallions | Sides | 4.5
    Roasted Turnips with Brown Butter | Sides | 5
    Braised White Beans with Sage | Sides | 5
    Grilled Flatbread with Za'atar | Sides | 4.5
    Buttered Pearl Couscous | Sides | 4.5
    Caramel Apple Galette | Desserts | 8
    Lemon Poppy Seed Cake | Desserts | 7
    Chocolate Orange Pots de Crème | Desserts | 8
    Raspberry Almond Financier | Desserts | 6.5
    Honeycomb Semifreddo | Desserts | 8
    Apricot Pistachio Tart | Desserts | 8
    Ginger Pear Cake | Desserts | 7.5
    Black Forest Mousse Cake | Desserts | 8.5
    Prickly Pear Lemonade | Drinks | 4.5 | ice,sweet
    Cinnamon Orange Black Tea | Drinks | 3.5
    Passion Fruit Green Tea | Drinks | 4.2 | ice,sweet
    Roasted Barley Tea | Drinks | 3
    Ginger Lime Sparkler | Drinks | 4.5
    Cherry Vanilla Smoothie | Drinks | 6 | size
    Cocoa Mint Steamer | Drinks | 4.5 | milk
    Tart Cherry Spritz | Drinks | 4.8
    Baked Eggs with Spinach and Feta | Breakfast | 11
    Pear Ginger Overnight Oats | Breakfast | 8.5
    Ricotta Stuffed French Toast | Breakfast | 11.5
    Smoked Trout and Potato Hash | Breakfast | 13
    Cinnamon Raisin Baked Oatmeal | Breakfast | 8.5
    Roasted Fennel and White Bean Soup | Soups | 7.5
    Coffee Rubbed Pork Shoulder | Mains | 22 | side
    Crispy Leek and Potato Cakes | Sides | 5.5
  `).map(([name, category, price, opts]) => {
    const d = { name, category, price: Number(price) };
    if (opts) d.options = opts.split(',').map((k) => OPT[k.trim()]);
    return d;
  });

  // perUSD is an approximate, fixed rate used only to make prices look plausible in each currency.
  const CURRENCIES = [
    { code: 'USD', symbol: '$', decimals: 2, name: 'US Dollar', perUSD: 1, locale: 'en-US' },
    { code: 'EUR', symbol: '€', decimals: 2, name: 'Euro', perUSD: 0.92, locale: 'de-DE' },
    { code: 'GBP', symbol: '£', decimals: 2, name: 'British Pound', perUSD: 0.79, locale: 'en-GB' },
    { code: 'JPY', symbol: '¥', decimals: 0, name: 'Japanese Yen', perUSD: 150, locale: 'ja-JP' },
    { code: 'CNY', symbol: '¥', decimals: 2, name: 'Chinese Yuan', perUSD: 7.2, locale: 'zh-CN' },
    { code: 'BRL', symbol: 'R$', decimals: 2, name: 'Brazilian Real', perUSD: 5.2, locale: 'pt-BR' },
    { code: 'PLN', symbol: 'zł', decimals: 2, name: 'Polish Złoty', perUSD: 4.0, locale: 'pl-PL' },
    { code: 'CHF', symbol: 'CHF', decimals: 2, name: 'Swiss Franc', perUSD: 0.88, locale: 'de-DE' },
    { code: 'CAD', symbol: 'CA$', decimals: 2, name: 'Canadian Dollar', perUSD: 1.36, locale: 'en-US' },
    { code: 'AUD', symbol: 'A$', decimals: 2, name: 'Australian Dollar', perUSD: 1.52, locale: 'en-US' },
    { code: 'INR', symbol: '₹', decimals: 2, name: 'Indian Rupee', perUSD: 83, locale: 'en-US' },
    { code: 'KRW', symbol: '₩', decimals: 0, name: 'South Korean Won', perUSD: 1350, locale: 'en-US' },
    { code: 'SEK', symbol: 'kr', decimals: 2, name: 'Swedish Krona', perUSD: 10.5, locale: 'de-DE' },
    { code: 'MXN', symbol: 'MX$', decimals: 2, name: 'Mexican Peso', perUSD: 17.5, locale: 'en-US' },
    { code: 'MNT', symbol: '₮', decimals: 0, name: 'Mongolian Tögrög', perUSD: 3400, locale: 'en-US' },
    { code: 'ZAR', symbol: 'R', decimals: 2, name: 'South African Rand', perUSD: 18.5, locale: 'en-US' },
  ];
  const currency = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

  function niceAmount(rng, x, decimals) {
    if (decimals === 0) {
      // Round to a 'retail' step for large-unit currencies (¥1,480, ₩12,900).
      const step = x >= 100000 ? 1000 : x >= 10000 ? 100 : x >= 1000 ? 10 : 1;
      const big = step * 10;
      const v = Math.floor(x / big) * big + rng.pick([0, 0, 5, 8, 9]) * step;
      return v > 0 ? v : big;
    }
    const whole = Math.max(0, Math.floor(x));
    const cents = rng.pick([0.99, 0.99, 0.95, 0.49, 0.5, 0.0, 0.0, 0.25, 0.79, 0.89]);
    const v = whole + cents;
    return Math.round((v > 0 ? v : 0.99) * 100) / 100;
  }

  function price(rng, product, code = 'USD') {
    const cur = currency(code);
    const lo = product && product.priceMin != null ? product.priceMin : product && product.price != null ? product.price * 0.9 : 5;
    const hi = product && product.priceMax != null ? product.priceMax : product && product.price != null ? product.price * 1.1 : 50;
    const usd = lo + (hi - lo) * rng.float();
    const amount = niceAmount(rng, usd * cur.perUSD, cur.decimals);
    const text = C.formatMoney ? C.formatMoney(amount, cur.code, cur.locale)
      : `${cur.symbol}${amount.toFixed(cur.decimals)}`;
    return { amount, currency: cur.code, text };
  }

  function orderId(rng) {
    const d = (n) => C.digits(rng, n);
    return rng.pick([
      () => `#${rng.int(10000, 99999)}`,
      () => `ORD-${rng.int(2019, 2027)}-${d(6)}`,
      () => `${rng.int(100, 999)}-${d(7)}-${d(7)}`,
      () => `W${d(9)}`,
      () => `#${C.letters(rng, 2)}${d(5)}`,
      () => `${rng.int(1000000, 9999999)}`,
      () => `SO-${d(5)}`,
      () => `#${rng.int(1000, 9999)}-${rng.int(1000, 9999)}`,
    ])();
  }

  function invoiceId(rng) {
    const y = rng.int(2019, 2027);
    const d = (n) => C.digits(rng, n);
    return rng.pick([
      () => `INV-${y}-${d(4)}`,
      () => `INV${d(5)}`,
      () => `${y}/${d(4)}`,
      () => `F-${y}-${d(4)}`,
      () => `${C.letters(rng, 3)}-${d(6)}`,
      () => `${y}${String(rng.int(1, 12)).padStart(2, '0')}-${d(3)}`,
    ])();
  }

  function sku(rng) {
    return rng.pick([
      () => `${C.letters(rng, 3)}-${C.digits(rng, 4)}-${rng.pick(['XS', 'S', 'M', 'L', 'XL', 'BK', 'WH', 'GR', 'NV', '01', '02'])}`,
      () => `SKU ${C.digits(rng, 5)}-${C.digits(rng, 2)}`,
      () => `${C.digits(rng, 3)}.${C.digits(rng, 3)}.${C.digits(rng, 2)}`,
      () => `${C.letters(rng, 2)}${C.digits(rng, 6)}`,
    ])();
  }

  function trackingCode(rng) {
    return rng.pick([
      // UPU S10 style: 2 letters, 9 digits, country code.
      () => `${C.letters(rng, 2)}${C.digits(rng, 9)}${rng.pick(['US', 'GB', 'DE', 'FR', 'NL', 'JP', 'CN', 'BR', 'PL'])}`,
      () => `TRK${C.digits(rng, 12)}`,
      () => `${C.digits(rng, 4)} ${C.digits(rng, 4)} ${C.digits(rng, 4)}`,
      () => `${C.digits(rng, 22)}`,
      () => `${C.alnum(rng, 3)}-${C.alnum(rng, 6)}`,
    ])();
  }

  const COUPON_CODES = L(`
    WELCOME10
    SPRING15
    SUMMER20
    FALL25
    WINTER30
    FREESHIP
    SAVE5NOW
    NEWYEAR24
    BACK2SCHOOL
    FIRSTORDER
    TAKE15OFF
    FLASH40
    WEEKEND10
    LOYAL20
    BUNDLE3
    HOLIDAY50
    THANKYOU10
    STUDENT15
    BIRTHDAY
    REFER20
    CYBER25
    MIDYEAR
    EARLYBIRD
    COMEBACK15
    APPONLY10
    VIP2025
    GREEN10
    LASTCALL
    TREATYOURSELF
    HELLO5
    MEGA35
    SHIPFREE50
    PAYDAY12
    COFFEE2FOR1
    BRUNCH20
    FAMILY4
    PETS10
    GARDEN15
    READMORE
    PLAYDAY
    FITNESS20
    BEAUTY10
    TOOLS15
    BABY10
    AUTO8
    MUSIC12
    OFFICE10
    KITCHEN20
    CLEARANCE
    OUTLET30
    FRIENDS15
    SECONDCHANCE
    STAYCOOL
    SNOWDAY
    SUNNY10
    NIGHTOWL
    LUNCH5
    DINNER15
    STOCKUP
    MEMBER25
    OFFER10
    DEAL15
    SAVE20TODAY
    EXTRA25
    BONUS30
    PICKUPFREE
    ORDER5
    AUTUMN24
    COZYHOME
    JUSTBECAUSE
    TAKE20OFF
    QUICKDEAL
    MONDAY12
    CARTSAVE15
    PAIRUP
    GIFTSEASON
    CHEERS10
    CAMPUS20
    CAKEBREAK
    SHARE25
    ONLINE30
    HALFWAY
    MORNINGBIRD
    EASYPICK10
    MOBILE15
    OCEAN10
    LIMITEDRUN
    HEYTHERE5
    BIGTICKET40
    PACKED15
    NOONDEAL12
    PICNIC20
    CREW4
    HOBBY10
    PLANT15
    PAGETURNER
    ARCADE10
    WELLNESS20
    GLOW15
    WORKSHOP10
    TINY10
    ROADTRIP8
    MELODY15
    DESKSET10
    PANTRY20
    REDTAGSALE
    WAREHOUSE25
    NEIGHBORS15
    GOODFORTUNE
    BREEZYDAY
    EMBER10
    STARLIGHT
    LATEBIRD
    MIDDAY5
    SUPPER20
    BULKBUY
    INSIDER30
    COASTLINE
    HOMETOWN10
    HAPPYPATH
    WINDDOWN20
    SWEETSPOT
    DAYTRIP15
    GOODASGOLD
    KEEPSAKE
    MAKETIME20
    SNAPSHOT15
    SOFTLANDING
    HOMESTRETCH
    KINDRED10
    OPENROAD
    CLOUDNINE25
    LITTLEWINS
    FINDYOURFUN
    WEEKDAYPICK
    GATHERROUND
    TIDYUP10
    SLOWCOOKER
    SUNDAYRESET
    FARANDWIDE
    FRESHLOOK
    WANDERMORE
    HIDDENPERK
    AFTERHOURS
    EASYDOESIT
    GOLDENHOUR
    COLORFULDAY
    WELLPICKED
    EVERYDAYJOY
    RAINCHECK
    TRAILMIX
    PAPERTRAIL
    GAMEON
    CRAFTNIGHT
    FRESHBATCH
    CITYLIGHTS
    BLUEHORIZON
    TUCKEDIN
    MAKEITCOUNT
    LOCALFINDS
    CURIOSITY
    TRAILBLAZER
    LETSGO15
    MIXMATCH
    EASYGOING
    TOPSHELF
    NEWFAVORITE
    SMALLBATCH
    BASKETBOOST
    GROCERY10
    SKIPTHELINE
    TWOFORTEA
    WARMWEATHER
    COOKOUT15
    SCHOOLBREAK
    SPRINGCLEAN
    FIRSTPICK
    NEATFINDS
    GOODCOMPANY
    GATHERMORE
    HOSTING10
    MOVIENIGHT
    GAMEPLAN15
    HIKINGDAY
    TRAVELLIGHT
    ROADREADY
    PETPAMPER
    GROWWITHUS
    CRAFTMORE
    STUDIO15
    BOOKNOOK
    QUIETMOMENT
    DAILYRITUAL
    COLORPOP10
    STYLEUPDATE
    SUNDAYTABLE
    EARLYSTART
    NIGHTIN20
    MADEFORMORE
    WELLWORN
    WATERFRONT
    MOUNTAINAIR
    COZYSEASON
    FESTIVEFIND
    WRAPITUP
    GIFTWRAP10
    CELEBRATE15
    JUSTARRIVED
    NEWSEASON
    SUNLITROOM
    KICKOFF10
    PATIOREADY
    CANDLELIT
    INKWELL15
    TERRACOTTA
    CITRUSKICK
    POCKETFUL10
    STARGAZER
    FIELDDAY
    MAPLELANE
    TINROOF
    PEPPERMINT
    HONEYCRISP
    BRASSBUTTON
    SEASALT15
    WILDFLOWER
    THREADCOUNT
    HARBORVIEW
    SUNROOM
    CASTIRON10
    BREADBOARD
    SLOWMORNING
    MAKERSPACE
    DESERTBLOOM
    GOLDLEAF
    FIRESIDE
    MARGINALIA
    VELLUM10
    FOUNTAINPEN
    INKANDIDEAS
    CROSSWORD
    JIGSAW15
    PUZZLENIGHT
    RIVERSTONE
    BICYCLE8
    CAMPFIRE
    MOONPHASE
    SKETCHBOOK
    WATERCOLOR
    CORKSCREW
    BENTOBOX
    PAPERCRANE
    LINEN14
    SOAPSTONE
    TILEWORK
    LOOMROOM
    STITCHIN
    YARNBARN
    FOLIO
    TOTEALLY
    SCOOPSHOP
    NOODLEBOWL
    CITRUSZEST
    MOSAIC10
  `);

  function couponCode(rng) {
    const word = rng.pick([
      'SAVE', 'DEAL', 'TAKE', 'GET', 'SHOP', 'HELLO', 'EXTRA', 'BONUS', 'CODE', 'PROMO', 'GIFT', 'YAY', 'FIND',
      'CLUB', 'MORE', 'NICE', 'PERK', 'PICK', 'TREAT', 'ENJOY', 'FRESH', 'SPARK'
    ]);
    return rng.pick([
      () => `${word}${rng.pick([5, 10, 15, 20, 25, 30, 40, 50])}`,
      () => `${C.alnum(rng, 4)}-${C.alnum(rng, 4)}`,
      () => `${word}-${C.alnum(rng, 5)}`,
      () => `${rng.pick(['SPRING', 'SUMMER', 'FALL', 'WINTER'])}${rng.int(19, 27)}`,
      () => C.alnum(rng, 8),
    ])();
  }

  const giftCardCode = (rng) => `${C.alnum(rng, 4)}-${C.alnum(rng, 4)}-${C.alnum(rng, 4)}-${C.alnum(rng, 4)}`;

  const SHIPPING_METHODS = [
    { id: 'standard', name: 'Standard Shipping', days: [5, 7], price: 4.99 },
    { id: 'economy', name: 'Economy (no tracking)', days: [7, 12], price: 2.99 },
    { id: 'free', name: 'Free Shipping on orders over $50', days: [6, 9], price: 0 },
    { id: 'express', name: 'Express Delivery', days: [2, 3], price: 12.99 },
    { id: 'nextday', name: 'Next-Day Delivery (order by 2 pm)', days: [1, 1], price: 19.99 },
    { id: 'sameday', name: 'Same-Day Courier', days: [0, 0], price: 24.99 },
    { id: 'pickup', name: 'Store Pickup', days: [0, 1], price: 0 },
    { id: 'locker', name: 'Parcel Locker Pickup', days: [2, 4], price: 2.49 },
    { id: 'twoday', name: '2-Day Shipping', days: [2, 2], price: 8.99 },
    { id: 'freight', name: 'Freight (large items, curbside)', days: [7, 14], price: 79 },
    { id: 'intl-std', name: 'International Standard', days: [10, 21], price: 14.99 },
    { id: 'intl-exp', name: 'International Express', days: [3, 6], price: 39.99 },
  ];

  const PAYMENT_METHODS = L(`
    Credit or debit card
    Bank transfer
    Pay on delivery
    Gift card
    Store credit
    Pay in 4 installments
    Mobile wallet
    Invoice (pay within 30 days)
    Digital wallet
    Direct debit (SEPA)
    Cash at checkout
    Personal check
    Money order
    Loyalty points
    Meal vouchers
    Payroll deduction
    Layaway (pay before pickup)
    SNAP benefits (EBT)
    WIC benefits (eWIC)
  `);

  const ORDER_STATUSES = L(`
    Pending
    Processing
    Awaiting payment
    Paid
    Packed
    Shipped
    Out for delivery
    Delivered
    Ready for pickup
    On hold
    Cancelled
    Refunded
    Partially refunded
    Returned
    Backordered
  `);

  function luhnDigit(s) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
      let d = Number(s[s.length - 1 - i]);
      if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    return String((10 - (sum % 10)) % 10);
  }
  function cardNumber(rng) {
    const body = `4000${C.digits(rng, 11)}`;
    const n = body + luhnDigit(body);
    return n.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  Object.assign(C, {
    COMPANIES,
    PRODUCT_CATEGORIES,
    PRODUCTS,
    DISHES,
    currency,
    price,
    orderId,
    invoiceId,
    sku,
    trackingCode,
    COUPON_CODES,
    couponCode,
    giftCardCode,
    SHIPPING_METHODS,
    PAYMENT_METHODS,
    ORDER_STATUSES,
    cardNumber,
  });
})();
