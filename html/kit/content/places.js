/*
 * kit/content/places.js: cities (real, with IATA codes and standard UTC offsets), countries, streets, postal
 * addresses per locale, venues, stations, fictional airlines. API: see the header of kit/content/core.js.
 * Time zones are standard (non-daylight-saving) offsets.
 */
(function () {
  'use strict';
  const C = env.content;
  const L = C.lines;

  // code | English name | local name (only where a supported locale writes it differently)
  const COUNTRIES = C.rows(`
    US | United States | United States
    CA | Canada
    MX | Mexico | México
    BR | Brazil | Brasil
    AR | Argentina
    CL | Chile
    PE | Peru | Perú
    CO | Colombia
    EC | Ecuador
    UY | Uruguay
    PY | Paraguay
    BO | Bolivia
    VE | Venezuela
    PA | Panama | Panamá
    CR | Costa Rica
    CU | Cuba
    DO | Dominican Republic | República Dominicana
    PR | Puerto Rico
    JM | Jamaica
    GT | Guatemala
    SV | El Salvador
    NI | Nicaragua
    GB | United Kingdom
    IE | Ireland
    FR | France
    DE | Germany | Deutschland
    ES | Spain | España
    PT | Portugal
    IT | Italy | Italia
    NL | Netherlands | Nederland
    BE | Belgium
    LU | Luxembourg
    CH | Switzerland
    AT | Austria
    CZ | Czechia
    SK | Slovakia
    HU | Hungary
    PL | Poland | Polska
    DK | Denmark
    NO | Norway
    SE | Sweden
    FI | Finland
    IS | Iceland
    EE | Estonia
    LV | Latvia
    LT | Lithuania
    GR | Greece
    TR | Türkiye
    RO | Romania
    BG | Bulgaria
    RS | Serbia
    HR | Croatia
    SI | Slovenia
    BA | Bosnia and Herzegovina
    MK | North Macedonia
    AL | Albania
    UA | Ukraine
    GE | Georgia
    AM | Armenia
    AZ | Azerbaijan
    MT | Malta
    CY | Cyprus
    RU | Russia
    AE | United Arab Emirates
    QA | Qatar
    BH | Bahrain
    KW | Kuwait
    OM | Oman
    SA | Saudi Arabia
    JO | Jordan
    LB | Lebanon
    IL | Israel
    IR | Iran
    EG | Egypt
    MA | Morocco
    TN | Tunisia
    DZ | Algeria
    NG | Nigeria
    GH | Ghana
    SN | Senegal
    CI | Côte d'Ivoire
    CM | Cameroon
    KE | Kenya
    ET | Ethiopia
    TZ | Tanzania
    UG | Uganda
    RW | Rwanda
    ZA | South Africa
    NA | Namibia
    BW | Botswana
    ZM | Zambia
    ZW | Zimbabwe
    MZ | Mozambique
    MG | Madagascar
    MU | Mauritius
    AO | Angola
    CD | DR Congo
    IN | India
    PK | Pakistan
    BD | Bangladesh
    LK | Sri Lanka
    NP | Nepal
    MV | Maldives
    CN | China | 中国
    HK | Hong Kong
    MO | Macau
    TW | Taiwan
    JP | Japan | 日本
    KR | South Korea
    MN | Mongolia
    KZ | Kazakhstan
    UZ | Uzbekistan
    KG | Kyrgyzstan
    SG | Singapore
    MY | Malaysia
    TH | Thailand
    VN | Vietnam
    KH | Cambodia
    LA | Laos
    MM | Myanmar
    PH | Philippines
    ID | Indonesia
    BN | Brunei
    AU | Australia
    NZ | New Zealand
    FJ | Fiji
    PF | French Polynesia
    WS | Samoa
    NC | New Caledonia
    BZ | Belize
    HN | Honduras
    HT | Haiti | Haïti
    BS | Bahamas
    BB | Barbados
    DM | Dominica
    GD | Grenada
    LC | Saint Lucia
    GY | Guyana
    SR | Suriname
    AD | Andorra
    LI | Liechtenstein
    MC | Monaco
    SM | San Marino
    ME | Montenegro
    MD | Moldova
    BY | Belarus
    BJ | Benin
    TG | Togo
    BF | Burkina Faso
    CV | Cabo Verde
    SC | Seychelles
    MW | Malawi
    LS | Lesotho
    SZ | Eswatini
    GA | Gabon
    BT | Bhutan
    TJ | Tajikistan
    TM | Turkmenistan
    PG | Papua New Guinea
    SB | Solomon Islands
    VU | Vanuatu
    TO | Tonga
    KI | Kiribati
    TV | Tuvalu
    GM | Gambia
    SL | Sierra Leone
    LR | Liberia
    GN | Guinea
    MR | Mauritania
    NE | Niger
    TD | Chad
    BI | Burundi
    DJ | Djibouti
    KM | Comoros
    VA | Vatican City
    PW | Palau
    MH | Marshall Islands
    FM | Micronesia
    NR | Nauru
    CK | Cook Islands
  `).map(([code, name, local]) => (local ? { name, code, local } : { name, code }));
  const countryByCode = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

  // city | country | region | tz | iata | postcode prefix | local name
  const RAW_CITIES = `
    New York | US | NY | UTC-5 | JFK | 100
    Boston | US | MA | UTC-5 | BOS | 021
    Miami | US | FL | UTC-5 | MIA | 331
    Atlanta | US | GA | UTC-5 | ATL | 303
    Philadelphia | US | PA | UTC-5 | PHL | 191
    Detroit | US | MI | UTC-5 | DTW | 482
    Charlotte | US | NC | UTC-5 | CLT | 282
    Raleigh | US | NC | UTC-5 | RDU | 276
    Pittsburgh | US | PA | UTC-5 | PIT | 152
    Cleveland | US | OH | UTC-5 | CLE | 441
    Columbus | US | OH | UTC-5 | CMH | 432
    Indianapolis | US | IN | UTC-5 | IND | 462
    Baltimore | US | MD | UTC-5 | BWI | 212
    Washington | US | DC | UTC-5 | DCA | 200
    Tampa | US | FL | UTC-5 | TPA | 336
    Orlando | US | FL | UTC-5 | MCO | 328
    Jacksonville | US | FL | UTC-5 | JAX | 322
    Buffalo | US | NY | UTC-5 | BUF | 142
    Richmond | US | VA | UTC-5 | RIC | 232
    Chicago | US | IL | UTC-6 | ORD | 606
    Dallas | US | TX | UTC-6 | DFW | 752
    Houston | US | TX | UTC-6 | IAH | 770
    Minneapolis | US | MN | UTC-6 | MSP | 554
    Austin | US | TX | UTC-6 | AUS | 787
    Nashville | US | TN | UTC-6 | BNA | 372
    New Orleans | US | LA | UTC-6 | MSY | 701
    St. Louis | US | MO | UTC-6 | STL | 631
    Kansas City | US | MO | UTC-6 | MCI | 641
    Milwaukee | US | WI | UTC-6 | MKE | 532
    San Antonio | US | TX | UTC-6 | SAT | 782
    Oklahoma City | US | OK | UTC-6 | OKC | 731
    Memphis | US | TN | UTC-6 | MEM | 381
    Omaha | US | NE | UTC-6 | OMA | 681
    Denver | US | CO | UTC-7 | DEN | 802
    Phoenix | US | AZ | UTC-7 | PHX | 850
    Salt Lake City | US | UT | UTC-7 | SLC | 841
    Albuquerque | US | NM | UTC-7 | ABQ | 871
    Tucson | US | AZ | UTC-7 | TUS | 857
    Boise | US | ID | UTC-7 | BOI | 837
    Los Angeles | US | CA | UTC-8 | LAX | 900
    San Francisco | US | CA | UTC-8 | SFO | 941
    Seattle | US | WA | UTC-8 | SEA | 981
    San Diego | US | CA | UTC-8 | SAN | 921
    Portland | US | OR | UTC-8 | PDX | 972
    Las Vegas | US | NV | UTC-8 | LAS | 891
    Sacramento | US | CA | UTC-8 | SMF | 958
    San Jose | US | CA | UTC-8 | SJC | 951
    Anchorage | US | AK | UTC-9 | ANC | 995
    Honolulu | US | HI | UTC-10 | HNL | 968
    Toronto | CA | ON | UTC-5 | YYZ | M
    Montreal | CA | QC | UTC-5 | YUL | H | Montréal
    Ottawa | CA | ON | UTC-5 | YOW | K
    Quebec City | CA | QC | UTC-5 | YQB | G | Québec
    Vancouver | CA | BC | UTC-8 | YVR | V
    Calgary | CA | AB | UTC-7 | YYC | T
    Edmonton | CA | AB | UTC-7 | YEG | T
    Winnipeg | CA | MB | UTC-6 | YWG | R
    Halifax | CA | NS | UTC-4 | YHZ | B
    Mexico City | MX | CDMX | UTC-6 | MEX | 0 | Ciudad de México
    Guadalajara | MX | Jal. | UTC-6 | GDL | 44
    Monterrey | MX | N.L. | UTC-6 | MTY | 64
    Cancún | MX | Q.R. | UTC-5 | CUN | 77
    Oaxaca | MX | Oax. | UTC-6 | OAX | 68
    São Paulo | BR | SP | UTC-3 | GRU | 01
    Rio de Janeiro | BR | RJ | UTC-3 | GIG | 22
    Brasília | BR | DF | UTC-3 | BSB | 70
    Salvador | BR | BA | UTC-3 | SSA | 40
    Porto Alegre | BR | RS | UTC-3 | POA | 90
    Belo Horizonte | BR | MG | UTC-3 | CNF | 30
    Recife | BR | PE | UTC-3 | REC | 50
    Fortaleza | BR | CE | UTC-3 | FOR | 60
    Curitiba | BR | PR | UTC-3 | CWB | 80
    Manaus | BR | AM | UTC-4 | MAO | 69
    Florianópolis | BR | SC | UTC-3 | FLN | 88
    Buenos Aires | AR | CABA | UTC-3 | EZE
    Córdoba | AR | Córdoba | UTC-3 | COR
    Mendoza | AR | Mendoza | UTC-3 | MDZ
    Santiago | CL | RM | UTC-4 | SCL
    Lima | PE | Lima | UTC-5 | LIM
    Cusco | PE | Cusco | UTC-5 | CUZ
    Bogotá | CO | D.C. | UTC-5 | BOG
    Medellín | CO | Antioquia | UTC-5 | MDE
    Cartagena | CO | Bolívar | UTC-5 | CTG
    Cali | CO | Valle del Cauca | UTC-5 | CLO
    Quito | EC | Pichincha | UTC-5 | UIO
    Guayaquil | EC | Guayas | UTC-5 | GYE
    Montevideo | UY | | UTC-3 | MVD
    Asunción | PY | | UTC-3 | ASU
    La Paz | BO | | UTC-4 | LPB
    Caracas | VE | | UTC-4 | CCS
    Panama City | PA | | UTC-5 | PTY | | Ciudad de Panamá
    San José | CR | | UTC-6 | SJO
    Havana | CU | | UTC-5 | HAV | | La Habana
    Santo Domingo | DO | | UTC-4 | SDQ
    San Juan | PR | | UTC-4 | SJU
    Kingston | JM | | UTC-5 | KIN
    Guatemala City | GT | | UTC-6 | GUA
    San Salvador | SV | | UTC-6 | SAL
    Managua | NI | | UTC-6 | MGA
    London | GB | | UTC+0 | LHR | SW,SE,N,E,W,NW,EC,WC
    Manchester | GB | | UTC+0 | MAN | M
    Edinburgh | GB | | UTC+0 | EDI | EH
    Glasgow | GB | | UTC+0 | GLA | G
    Birmingham | GB | | UTC+0 | BHX | B
    Bristol | GB | | UTC+0 | BRS | BS
    Liverpool | GB | | UTC+0 | LPL | L
    Newcastle upon Tyne | GB | | UTC+0 | NCL | NE
    Leeds | GB | | UTC+0 | LBA | LS
    Belfast | GB | | UTC+0 | BFS | BT
    Cardiff | GB | | UTC+0 | CWL | CF
    Dublin | IE | | UTC+0 | DUB | D
    Cork | IE | | UTC+0 | ORK | T
    Paris | FR | Île-de-France | UTC+1 | CDG | 75
    Lyon | FR | Auvergne-Rhône-Alpes | UTC+1 | LYS | 69
    Marseille | FR | Provence-Alpes-Côte d'Azur | UTC+1 | MRS | 13
    Nice | FR | Provence-Alpes-Côte d'Azur | UTC+1 | NCE | 06
    Toulouse | FR | Occitanie | UTC+1 | TLS | 31
    Bordeaux | FR | Nouvelle-Aquitaine | UTC+1 | BOD | 33
    Nantes | FR | Pays de la Loire | UTC+1 | NTE | 44
    Strasbourg | FR | Grand Est | UTC+1 | SXB | 67
    Lille | FR | Hauts-de-France | UTC+1 | LIL | 59
    Berlin | DE | Berlin | UTC+1 | BER | 10
    Munich | DE | Bayern | UTC+1 | MUC | 80 | München
    Hamburg | DE | Hamburg | UTC+1 | HAM | 20
    Frankfurt | DE | Hessen | UTC+1 | FRA | 60 | Frankfurt am Main
    Cologne | DE | Nordrhein-Westfalen | UTC+1 | CGN | 50 | Köln
    Stuttgart | DE | Baden-Württemberg | UTC+1 | STR | 70
    Düsseldorf | DE | Nordrhein-Westfalen | UTC+1 | DUS | 40
    Leipzig | DE | Sachsen | UTC+1 | LEJ | 04
    Dresden | DE | Sachsen | UTC+1 | DRS | 01
    Nuremberg | DE | Bayern | UTC+1 | NUE | 90 | Nürnberg
    Hanover | DE | Niedersachsen | UTC+1 | HAJ | 30 | Hannover
    Bremen | DE | Bremen | UTC+1 | BRE | 28
    Madrid | ES | Madrid | UTC+1 | MAD | 28
    Barcelona | ES | Barcelona | UTC+1 | BCN | 08
    Valencia | ES | Valencia | UTC+1 | VLC | 46
    Seville | ES | Sevilla | UTC+1 | SVQ | 41 | Sevilla
    Bilbao | ES | Bizkaia | UTC+1 | BIO | 48
    Málaga | ES | Málaga | UTC+1 | AGP | 29
    Palma | ES | Illes Balears | UTC+1 | PMI | 07
    Zaragoza | ES | Zaragoza | UTC+1 | ZAZ | 50
    Las Palmas de Gran Canaria | ES | Las Palmas | UTC+0 | LPA | 35
    Lisbon | PT | | UTC+0 | LIS | 1 | Lisboa
    Porto | PT | | UTC+0 | OPO | 4
    Faro | PT | | UTC+0 | FAO | 8
    Funchal | PT | | UTC+0 | FNC | 9
    Rome | IT | RM | UTC+1 | FCO | 001 | Roma
    Milan | IT | MI | UTC+1 | MXP | 201 | Milano
    Naples | IT | NA | UTC+1 | NAP | 801 | Napoli
    Venice | IT | VE | UTC+1 | VCE | 301 | Venezia
    Florence | IT | FI | UTC+1 | FLR | 501 | Firenze
    Turin | IT | TO | UTC+1 | TRN | 101 | Torino
    Bologna | IT | BO | UTC+1 | BLQ | 401
    Palermo | IT | PA | UTC+1 | PMO | 901
    Catania | IT | CT | UTC+1 | CTA | 951
    Bari | IT | BA | UTC+1 | BRI | 701
    Genoa | IT | GE | UTC+1 | GOA | 161 | Genova
    Amsterdam | NL | | UTC+1 | AMS | 10
    Rotterdam | NL | | UTC+1 | RTM | 30
    Eindhoven | NL | | UTC+1 | EIN | 56
    Brussels | BE | | UTC+1 | BRU | 10
    Antwerp | BE | | UTC+1 | ANR | 20
    Luxembourg | LU | | UTC+1 | LUX
    Zurich | CH | | UTC+1 | ZRH | 80 | Zürich
    Geneva | CH | | UTC+1 | GVA | 12
    Basel | CH | | UTC+1 | BSL | 40
    Vienna | AT | | UTC+1 | VIE | 10 | Wien
    Salzburg | AT | | UTC+1 | SZG | 50
    Graz | AT | | UTC+1 | GRZ | 80
    Innsbruck | AT | | UTC+1 | INN | 60
    Prague | CZ | | UTC+1 | PRG | 1
    Brno | CZ | | UTC+1 | BRQ | 6
    Bratislava | SK | | UTC+1 | BTS | 8
    Budapest | HU | | UTC+1 | BUD | 1
    Warsaw | PL | mazowieckie | UTC+1 | WAW | 00 | Warszawa
    Kraków | PL | małopolskie | UTC+1 | KRK | 31
    Gdańsk | PL | pomorskie | UTC+1 | GDN | 80
    Wrocław | PL | dolnośląskie | UTC+1 | WRO | 50
    Poznań | PL | wielkopolskie | UTC+1 | POZ | 61
    Katowice | PL | śląskie | UTC+1 | KTW | 40
    Łódź | PL | łódzkie | UTC+1 | LCJ | 90
    Copenhagen | DK | | UTC+1 | CPH | 1 | København
    Aarhus | DK | | UTC+1 | AAR | 8
    Oslo | NO | | UTC+1 | OSL | 0
    Bergen | NO | | UTC+1 | BGO | 5
    Trondheim | NO | | UTC+1 | TRD | 7
    Stockholm | SE | | UTC+1 | ARN | 1
    Gothenburg | SE | | UTC+1 | GOT | 4 | Göteborg
    Malmö | SE | | UTC+1 | MMX | 2
    Helsinki | FI | | UTC+2 | HEL | 00
    Tampere | FI | | UTC+2 | TMP | 33
    Reykjavík | IS | | UTC+0 | KEF | 1
    Tallinn | EE | | UTC+2 | TLL | 1
    Riga | LV | | UTC+2 | RIX | 10
    Vilnius | LT | | UTC+2 | VNO | 0
    Athens | GR | | UTC+2 | ATH | 10
    Thessaloniki | GR | | UTC+2 | SKG | 54
    Istanbul | TR | | UTC+3 | IST | 34
    Ankara | TR | | UTC+3 | ESB | 06
    Izmir | TR | | UTC+3 | ADB | 35
    Antalya | TR | | UTC+3 | AYT | 07
    Bucharest | RO | | UTC+2 | OTP | 0
    Cluj-Napoca | RO | | UTC+2 | CLJ | 400
    Sofia | BG | | UTC+2 | SOF | 1
    Belgrade | RS | | UTC+1 | BEG | 11
    Zagreb | HR | | UTC+1 | ZAG | 10
    Split | HR | | UTC+1 | SPU | 21
    Dubrovnik | HR | | UTC+1 | DBV | 20
    Ljubljana | SI | | UTC+1 | LJU | 1
    Sarajevo | BA | | UTC+1 | SJJ | 71
    Skopje | MK | | UTC+1 | SKP | 10
    Tirana | AL | | UTC+1 | TIA | 10
    Kyiv | UA | | UTC+2 | KBP | 0
    Lviv | UA | | UTC+2 | LWO | 79
    Odesa | UA | | UTC+2 | ODS | 65
    Tbilisi | GE | | UTC+4 | TBS | 01
    Yerevan | AM | | UTC+4 | EVN | 00
    Baku | AZ | | UTC+4 | GYD | 10
    Valletta | MT | | UTC+1 | MLA
    Larnaca | CY | | UTC+2 | LCA | 60
    Moscow | RU | | UTC+3 | SVO | 1
    Saint Petersburg | RU | | UTC+3 | LED | 19
    Dubai | AE | | UTC+4 | DXB
    Abu Dhabi | AE | | UTC+4 | AUH
    Doha | QA | | UTC+3 | DOH
    Manama | BH | | UTC+3 | BAH
    Kuwait City | KW | | UTC+3 | KWI
    Muscat | OM | | UTC+4 | MCT
    Riyadh | SA | | UTC+3 | RUH | 1
    Jeddah | SA | | UTC+3 | JED | 2
    Amman | JO | | UTC+3 | AMM | 11
    Beirut | LB | | UTC+2 | BEY
    Tel Aviv | IL | | UTC+2 | TLV | 6
    Tehran | IR | | UTC+3:30 | IKA | 1
    Cairo | EG | | UTC+2 | CAI | 11
    Alexandria | EG | | UTC+2 | HBE | 21
    Casablanca | MA | | UTC+1 | CMN | 20
    Marrakesh | MA | | UTC+1 | RAK | 40
    Tunis | TN | | UTC+1 | TUN | 10
    Algiers | DZ | | UTC+1 | ALG | 16
    Lagos | NG | Lagos | UTC+1 | LOS | 10
    Abuja | NG | FCT | UTC+1 | ABV | 90
    Accra | GH | | UTC+0 | ACC
    Kumasi | GH | | UTC+0 | KMS
    Dakar | SN | | UTC+0 | DSS | 1
    Abidjan | CI | | UTC+0 | ABJ
    Douala | CM | | UTC+1 | DLA
    Nairobi | KE | | UTC+3 | NBO | 00
    Mombasa | KE | | UTC+3 | MBA | 80
    Addis Ababa | ET | | UTC+3 | ADD | 1000
    Dar es Salaam | TZ | | UTC+3 | DAR | 1
    Zanzibar | TZ | | UTC+3 | ZNZ | 7
    Kampala | UG | | UTC+3 | EBB
    Kigali | RW | | UTC+2 | KGL
    Johannesburg | ZA | Gauteng | UTC+2 | JNB | 2
    Cape Town | ZA | Western Cape | UTC+2 | CPT | 8
    Durban | ZA | KwaZulu-Natal | UTC+2 | DUR | 40
    Windhoek | NA | | UTC+2 | WDH
    Gaborone | BW | | UTC+2 | GBE
    Lusaka | ZM | | UTC+2 | LUN | 10
    Harare | ZW | | UTC+2 | HRE
    Maputo | MZ | | UTC+2 | MPM | 11
    Antananarivo | MG | | UTC+3 | TNR | 101
    Port Louis | MU | | UTC+4 | MRU | 11
    Luanda | AO | | UTC+1 | LAD
    Kinshasa | CD | | UTC+1 | FIH
    Delhi | IN | DL | UTC+5:30 | DEL | 110
    Mumbai | IN | MH | UTC+5:30 | BOM | 400
    Bengaluru | IN | KA | UTC+5:30 | BLR | 560
    Chennai | IN | TN | UTC+5:30 | MAA | 600
    Hyderabad | IN | TG | UTC+5:30 | HYD | 500
    Kolkata | IN | WB | UTC+5:30 | CCU | 700
    Ahmedabad | IN | GJ | UTC+5:30 | AMD | 380
    Pune | IN | MH | UTC+5:30 | PNQ | 411
    Kochi | IN | KL | UTC+5:30 | COK | 682
    Jaipur | IN | RJ | UTC+5:30 | JAI | 302
    Lucknow | IN | UP | UTC+5:30 | LKO | 226
    Karachi | PK | Sindh | UTC+5 | KHI | 75
    Lahore | PK | Punjab | UTC+5 | LHE | 54
    Islamabad | PK | ICT | UTC+5 | ISB | 44
    Dhaka | BD | | UTC+6 | DAC | 12
    Chittagong | BD | | UTC+6 | CGP | 4
    Colombo | LK | | UTC+5:30 | CMB | 00
    Kathmandu | NP | | UTC+5:45 | KTM | 44
    Malé | MV | | UTC+5 | MLE | 20
    Beijing | CN | Beijing | UTC+8 | PEK | 100
    Shanghai | CN | Shanghai | UTC+8 | PVG | 200
    Guangzhou | CN | Guangdong | UTC+8 | CAN | 510
    Shenzhen | CN | Guangdong | UTC+8 | SZX | 518
    Chengdu | CN | Sichuan | UTC+8 | CTU | 610
    Xi'an | CN | Shaanxi | UTC+8 | XIY | 710
    Hangzhou | CN | Zhejiang | UTC+8 | HGH | 310
    Wuhan | CN | Hubei | UTC+8 | WUH | 430
    Chongqing | CN | Chongqing | UTC+8 | CKG | 400
    Nanjing | CN | Jiangsu | UTC+8 | NKG | 210
    Kunming | CN | Yunnan | UTC+8 | KMG | 650
    Xiamen | CN | Fujian | UTC+8 | XMN | 361
    Qingdao | CN | Shandong | UTC+8 | TAO | 266
    Harbin | CN | Heilongjiang | UTC+8 | HRB | 150
    Hong Kong | HK | | UTC+8 | HKG
    Macau | MO | | UTC+8 | MFM
    Taipei | TW | | UTC+8 | TPE | 10
    Kaohsiung | TW | | UTC+8 | KHH | 80
    Tokyo | JP | Tokyo | UTC+9 | HND | 1
    Osaka | JP | Osaka | UTC+9 | KIX | 53
    Nagoya | JP | Aichi | UTC+9 | NGO | 46
    Sapporo | JP | Hokkaido | UTC+9 | CTS | 06
    Fukuoka | JP | Fukuoka | UTC+9 | FUK | 81
    Naha | JP | Okinawa | UTC+9 | OKA | 90
    Sendai | JP | Miyagi | UTC+9 | SDJ | 98
    Hiroshima | JP | Hiroshima | UTC+9 | HIJ | 73
    Seoul | KR | | UTC+9 | ICN | 0
    Busan | KR | | UTC+9 | PUS | 4
    Jeju | KR | | UTC+9 | CJU | 63
    Ulaanbaatar | MN | | UTC+8 | UBN | 1
    Almaty | KZ | | UTC+5 | ALA | 050
    Astana | KZ | | UTC+5 | NQZ | 010
    Tashkent | UZ | | UTC+5 | TAS | 100
    Bishkek | KG | | UTC+6 | FRU | 720
    Singapore | SG | | UTC+8 | SIN
    Kuala Lumpur | MY | | UTC+8 | KUL | 50
    Penang | MY | | UTC+8 | PEN | 10
    Kota Kinabalu | MY | | UTC+8 | BKI | 88
    Bangkok | TH | | UTC+7 | BKK | 10
    Phuket | TH | | UTC+7 | HKT | 83
    Chiang Mai | TH | | UTC+7 | CNX | 50
    Ho Chi Minh City | VN | | UTC+7 | SGN | 7
    Hanoi | VN | | UTC+7 | HAN | 1
    Da Nang | VN | | UTC+7 | DAD | 5
    Phnom Penh | KH | | UTC+7 | PNH | 12
    Vientiane | LA | | UTC+7 | VTE | 01
    Yangon | MM | | UTC+6:30 | RGN | 11
    Manila | PH | Metro Manila | UTC+8 | MNL | 1
    Cebu City | PH | Cebu | UTC+8 | CEB | 60
    Davao City | PH | Davao del Sur | UTC+8 | DVO | 80
    Jakarta | ID | DKI Jakarta | UTC+7 | CGK | 1
    Denpasar | ID | Bali | UTC+8 | DPS | 80
    Surabaya | ID | Jawa Timur | UTC+7 | SUB | 60
    Yogyakarta | ID | DI Yogyakarta | UTC+7 | YIA | 55
    Bandar Seri Begawan | BN | | UTC+8 | BWN | BS
    Sydney | AU | NSW | UTC+10 | SYD | 2
    Melbourne | AU | VIC | UTC+10 | MEL | 3
    Brisbane | AU | QLD | UTC+10 | BNE | 40
    Perth | AU | WA | UTC+8 | PER | 60
    Adelaide | AU | SA | UTC+9:30 | ADL | 50
    Canberra | AU | ACT | UTC+10 | CBR | 26
    Hobart | AU | TAS | UTC+10 | HBA | 70
    Darwin | AU | NT | UTC+9:30 | DRW | 08
    Cairns | AU | QLD | UTC+10 | CNS | 48
    Gold Coast | AU | QLD | UTC+10 | OOL | 42
    Auckland | NZ | | UTC+12 | AKL | 1
    Wellington | NZ | | UTC+12 | WLG | 6
    Christchurch | NZ | | UTC+12 | CHC | 8
    Queenstown | NZ | | UTC+12 | ZQN | 93
    Nadi | FJ | | UTC+12 | NAN
    Papeete | PF | | UTC-10 | PPT | 987
    Apia | WS | | UTC+13 | APW
    Nouméa | NC | | UTC+11 | NOU | 988
    Cincinnati | US | OH | UTC-5 | CVG | 452
    Louisville | US | KY | UTC-5 | SDF | 402
    Columbia | US | SC | UTC-5 | CAE | 292
    Charleston | US | SC | UTC-5 | CHS | 294
    Savannah | US | GA | UTC-5 | SAV | 314
    Norfolk | US | VA | UTC-5 | ORF | 235
    Rochester | US | NY | UTC-5 | ROC | 146
    Hartford | US | CT | UTC-5 | BDL | 061
    Providence | US | RI | UTC-5 | PVD | 029
    Burlington | US | VT | UTC-5 | BTV | 054
    Des Moines | US | IA | UTC-6 | DSM | 503
    Wichita | US | KS | UTC-6 | ICT | 672
    Tulsa | US | OK | UTC-6 | TUL | 741
    El Paso | US | TX | UTC-7 | ELP | 799
    Fresno | US | CA | UTC-8 | FAT | 937
    Spokane | US | WA | UTC-8 | GEG | 992
    Saskatoon | CA | SK | UTC-6 | YXE | S
    Regina | CA | SK | UTC-6 | YQR | S
    Moncton | CA | NB | UTC-4 | YQM | E
    Mérida | MX | Yuc. | UTC-6 | MID | 97
    Puebla | MX | Pue. | UTC-6 | PBC | 72
    Puerto Vallarta | MX | Jal. | UTC-6 | PVR | 48
    Belém | BR | PA | UTC-3 | BEL | 66
    Natal | BR | RN | UTC-3 | NAT | 59
    Vitória | BR | ES | UTC-3 | VIX | 29
    Cuiabá | BR | MT | UTC-4 | CGB | 78
    Rosario | AR | Santa Fe | UTC-3 | ROS
    Salta | AR | Salta | UTC-3 | SLA
    Antofagasta | CL | Antofagasta | UTC-4 | ANF
    Arequipa | PE | Arequipa | UTC-5 | AQP
    Barranquilla | CO | Atlántico | UTC-5 | BAQ
    Cuenca | EC | Azuay | UTC-5 | CUE
    Santiago de Cuba | CU |  | UTC-5 | SCU
    Punta Cana | DO |  | UTC-4 | PUJ
    Montego Bay | JM |  | UTC-5 | MBJ
    Nottingham | GB |  | UTC+0 | EMA | NG
    Southampton | GB |  | UTC+0 | SOU | SO
    Exeter | GB |  | UTC+0 | EXT | EX
    Aberdeen | GB |  | UTC+0 | ABZ | AB
    Inverness | GB |  | UTC+0 | INV | IV
    Limerick | IE |  | UTC+0 | SNN | V
    Montpellier | FR | Occitanie | UTC+1 | MPL | 34
    Rennes | FR | Bretagne | UTC+1 | RNS | 35
    Brest | FR | Bretagne | UTC+1 | BES | 29
    Ajaccio | FR | Corse | UTC+1 | AJA | 20
    Alicante | ES | Alicante | UTC+1 | ALC | 03
    Granada | ES | Granada | UTC+1 | GRX | 18
    Santander | ES | Cantabria | UTC+1 | SDR | 39
    Pisa | IT | PI | UTC+1 | PSA | 561
    Verona | IT | VR | UTC+1 | VRN | 371
    Cagliari | IT | CA | UTC+1 | CAG | 091
    Trieste | IT | TS | UTC+1 | TRS | 341
    Groningen | NL |  | UTC+1 | GRQ | 97
    Liège | BE |  | UTC+1 | LGG | 40
    Bern | CH |  | UTC+1 | BRN | 30
    Ostrava | CZ |  | UTC+1 | OSR | 7
    Košice | SK |  | UTC+1 | KSC | 04
    Debrecen | HU |  | UTC+1 | DEB | 4
    Rzeszów | PL | podkarpackie | UTC+1 | RZE | 35
    Aalborg | DK |  | UTC+1 | AAL | 9
    Stavanger | NO |  | UTC+1 | SVG | 4
    Tromsø | NO |  | UTC+1 | TOS | 9
    Umeå | SE |  | UTC+1 | UME | 90
    Turku | FI |  | UTC+2 | TKU | 20
    Akureyri | IS |  | UTC+0 | AEY | 6
    Kaunas | LT |  | UTC+2 | KUN | 44
    Heraklion | GR |  | UTC+2 | HER | 71
    Rhodes | GR |  | UTC+2 | RHO | 85
    Trabzon | TR |  | UTC+3 | TZX | 61
    Timișoara | RO |  | UTC+2 | TSR | 30
    Varna | BG |  | UTC+2 | VAR | 9
    Pula | HR |  | UTC+1 | PUY | 52
    Batumi | GE |  | UTC+4 | BUS | 60
    Paphos | CY |  | UTC+2 | PFO | 80
    Kazan | RU |  | UTC+3 | KZN | 42
    Sharjah | AE |  | UTC+4 | SHJ
    Salalah | OM |  | UTC+4 | SLL
    Dammam | SA |  | UTC+3 | DMM | 3
    Aqaba | JO |  | UTC+3 | AQJ | 77
    Shiraz | IR |  | UTC+3:30 | SYZ | 71
    Luxor | EG |  | UTC+2 | LXR | 85
    Monastir | TN |  | UTC+1 | MIR | 50
    Constantine | DZ |  | UTC+1 | CZL | 25
    Sfax | TN |  | UTC+1 | SFA | 30
    Oran | DZ |  | UTC+1 | ORN | 31
    Kano | NG | Kano | UTC+1 | KAN | 70
    Yaoundé | CM |  | UTC+1 | NSI
    Kisumu | KE |  | UTC+3 | KIS | 40
    Arusha | TZ |  | UTC+3 | ARK | 23
    Bloemfontein | ZA | Free State | UTC+2 | BFN | 93
    Gqeberha | ZA | Eastern Cape | UTC+2 | PLZ | 60
    Walvis Bay | NA |  | UTC+2 | WVB
    Livingstone | ZM |  | UTC+2 | LVI | 20
    Bulawayo | ZW |  | UTC+2 | BUQ
    Toamasina | MG |  | UTC+3 | TMM | 501
    Nagpur | IN | MH | UTC+5:30 | NAG | 440
    Coimbatore | IN | TN | UTC+5:30 | CJB | 641
    Amritsar | IN | PB | UTC+5:30 | ATQ | 143
    Bhubaneswar | IN | OD | UTC+5:30 | BBI | 751
    Varanasi | IN | UP | UTC+5:30 | VNS | 221
    Sylhet | BD |  | UTC+6 | ZYL | 31
    Tianjin | CN | Tianjin | UTC+8 | TSN | 300
    Dalian | CN | Liaoning | UTC+8 | DLC | 116
    Changsha | CN | Hunan | UTC+8 | CSX | 410
    Fuzhou | CN | Fujian | UTC+8 | FOC | 350
    Zhengzhou | CN | Henan | UTC+8 | CGO | 450
    Haikou | CN | Hainan | UTC+8 | HAK | 570
    Taichung | TW |  | UTC+8 | RMQ | 40
    Kagoshima | JP | Kagoshima | UTC+9 | KOJ | 89
    Nagasaki | JP | Nagasaki | UTC+9 | NGS | 85
    Matsuyama | JP | Ehime | UTC+9 | MYJ | 79
    Daegu | KR |  | UTC+9 | TAE | 4
    Shymkent | KZ |  | UTC+5 | CIT | 160
    Samarkand | UZ |  | UTC+5 | SKD | 140
    Osh | KG |  | UTC+6 | OSS | 723
    Kuching | MY |  | UTC+8 | KCH | 93
    Chiang Rai | TH |  | UTC+7 | CEI | 57
    Hat Yai | TH |  | UTC+7 | HDY | 90
    Hue | VN |  | UTC+7 | HUI
    Nha Trang | VN |  | UTC+7 | CXR
    Luang Prabang | LA |  | UTC+7 | LPQ | 06
    Mandalay | MM |  | UTC+6:30 | MDL | 05
    Iloilo City | PH | Iloilo | UTC+8 | ILO | 50
    Puerto Princesa | PH | Palawan | UTC+8 | PPS | 53
    Medan | ID | Sumatera Utara | UTC+7 | KNO | 20
    Semarang | ID | Jawa Tengah | UTC+7 | SRG | 50
    Manado | ID | Sulawesi Utara | UTC+8 | MDC | 95
    Rockhampton | AU | QLD | UTC+10 | ROK | 47
    Townsville | AU | QLD | UTC+10 | TSV | 48
    Launceston | AU | TAS | UTC+10 | LST | 72
    Alice Springs | AU | NT | UTC+9:30 | ASP | 08
    Broome | AU | WA | UTC+8 | BME | 67
    Dunedin | NZ |  | UTC+12 | DUD | 90
    Hamilton | NZ |  | UTC+12 | HLZ | 32
    Rotorua | NZ |  | UTC+12 | ROT | 30
    Nelson | NZ |  | UTC+12 | NSN | 70
    Suva | FJ |  | UTC+12 | SUV
    Santa Cruz de la Sierra | BO |  | UTC-4 | VVI
    Albany | US | NY | UTC-5 | ALB | 122
    Syracuse | US | NY | UTC-5 | SYR | 132
    Bangor | US | ME | UTC-5 | BGR | 044
    Grand Rapids | US | MI | UTC-5 | GRR | 495
    Madison | US | WI | UTC-6 | MSN | 537
    Green Bay | US | WI | UTC-6 | GRB | 543
    Knoxville | US | TN | UTC-5 | TYS | 379
    Chattanooga | US | TN | UTC-5 | CHA | 374
    Lexington | US | KY | UTC-5 | LEX | 405
    Huntsville | US | AL | UTC-6 | HSV | 358
    Mobile | US | AL | UTC-6 | MOB | 366
    Pensacola | US | FL | UTC-6 | PNS | 325
    Tallahassee | US | FL | UTC-5 | TLH | 323
    Fort Myers | US | FL | UTC-5 | RSW | 339
    Fort Lauderdale | US | FL | UTC-5 | FLL | 333
    Asheville | US | NC | UTC-5 | AVL | 288
    Harrisburg | US | PA | UTC-5 | MDT | 171
    Allentown | US | PA | UTC-5 | ABE | 181
    Reno | US | NV | UTC-8 | RNO | 895
    Eugene | US | OR | UTC-8 | EUG | 974
    Medford | US | OR | UTC-8 | MFR | 975
    Billings | US | MT | UTC-7 | BIL | 591
    Missoula | US | MT | UTC-7 | MSO | 598
    Fargo | US | ND | UTC-6 | FAR | 581
    Sioux Falls | US | SD | UTC-6 | FSD | 571
    Little Rock | US | AR | UTC-6 | LIT | 722
    Baton Rouge | US | LA | UTC-6 | BTR | 708
    Colorado Springs | US | CO | UTC-7 | COS | 809
    Fairbanks | US | AK | UTC-9 | FAI | 997
    North Bay | CA | ON | UTC-5 | YYB | P
    Thunder Bay | CA | ON | UTC-5 | YQT | P
    Fredericton | CA | NB | UTC-4 | YFC | E
    Charlottetown | CA | PE | UTC-4 | YYG | C
    Yellowknife | CA | NT | UTC-7 | YZF | X
    Whitehorse | CA | YT | UTC-7 | YXY | Y
    Sudbury | CA | ON | UTC-5 | YSB | P
    Aguascalientes | MX | Ags. | UTC-6 | AGU | 20
    León | MX | Gto. | UTC-6 | BJX | 37
    Culiacán | MX | Sin. | UTC-7 | CUL | 80
    Hermosillo | MX | Son. | UTC-7 | HMO | 83
    Mazatlán | MX | Sin. | UTC-7 | MZT | 82
    Querétaro | MX | Qro. | UTC-6 | QRO | 76
    Veracruz | MX | Ver. | UTC-6 | VER | 91
    Zacatecas | MX | Zac. | UTC-6 | ZCL | 98
    Acapulco | MX | Gro. | UTC-6 | ACA | 39
    Aracaju | BR | SE | UTC-3 | AJU | 49
    João Pessoa | BR | PB | UTC-3 | JPA | 58
    Maceió | BR | AL | UTC-3 | MCZ | 57
    São Luís | BR | MA | UTC-3 | SLZ | 65
    Teresina | BR | PI | UTC-3 | THE | 64
    Foz do Iguaçu | BR | PR | UTC-3 | IGU | 85
    Londrina | BR | PR | UTC-3 | LDB | 86
    Joinville | BR | SC | UTC-3 | JOI | 89
    Uberlândia | BR | MG | UTC-3 | UDI | 38
    Campo Grande | BR | MS | UTC-4 | CGR | 79
    Mar del Plata | AR | Buenos Aires | UTC-3 | MDQ
    Neuquén | AR | Neuquén | UTC-3 | NQN
    Bariloche | AR | Río Negro | UTC-3 | BRC
    Ushuaia | AR | Tierra del Fuego | UTC-3 | USH
    Concepción | CL | Biobío | UTC-4 | CCP
    Puerto Montt | CL | Los Lagos | UTC-4 | PMC
    La Serena | CL | Coquimbo | UTC-4 | LSC
    Trujillo | PE | La Libertad | UTC-5 | TRU
    Iquitos | PE | Loreto | UTC-5 | IQT
    Piura | PE | Piura | UTC-5 | PIU
    Bucaramanga | CO | Santander | UTC-5 | BGA
    Pereira | CO | Risaralda | UTC-5 | PEI
    Santa Marta | CO | Magdalena | UTC-5 | SMR
    Cochabamba | BO |  | UTC-4 | CBB
    Punta del Este | UY |  | UTC-3 | PDP
    Newquay | GB |  | UTC+0 | NQY | TR
    Norwich | GB |  | UTC+0 | NWI | NR
    Dundee | GB |  | UTC+0 | DND | DD
    Derry | GB |  | UTC+0 | LDY | BT
    Waterford | IE |  | UTC+0 | WAT | X
    Perpignan | FR | Occitanie | UTC+1 | PGF | 66
    Bastia | FR | Corse | UTC+1 | BIA | 20
    Erfurt | DE | Thüringen | UTC+1 | ERF | 99
    Almería | ES | Almería | UTC+1 | LEI | 04
    Girona | ES | Girona | UTC+1 | GRO | 17
    Reus | ES | Tarragona | UTC+1 | REU | 43
    Vigo | ES | Pontevedra | UTC+1 | VGO | 36
    A Coruña | ES | A Coruña | UTC+1 | LCG | 15
    Valladolid | ES | Valladolid | UTC+1 | VLL | 47
    Arrecife | ES | Las Palmas | UTC+0 | ACE | 35
    Alghero | IT | SS | UTC+1 | AHO | 070
    Bergamo | IT | BG | UTC+1 | BGY | 241
    Parma | IT | PR | UTC+1 | PMF | 431
    Ancona | IT | AN | UTC+1 | AOI | 601
    Pescara | IT | PE | UTC+1 | PSR | 651
    Brindisi | IT | BR | UTC+1 | BDS | 721
    Maastricht | NL |  | UTC+1 | MST | 62
    Charleroi | BE |  | UTC+1 | CRL | 60
    Ostend | BE |  | UTC+1 | OST | 84 | Oostende
    Linz | AT |  | UTC+1 | LNZ | 40
    Karlovy Vary | CZ |  | UTC+1 | KLV | 36
    Poprad | SK |  | UTC+1 | TAT | 05
    Lublin | PL | lubelskie | UTC+1 | LUZ | 20
    Kristiansand | NO |  | UTC+1 | KRS | 46
    Ålesund | NO |  | UTC+1 | AES | 60
    Bodø | NO |  | UTC+1 | BOO | 80
    Luleå | SE |  | UTC+1 | LLA | 97
    Visby | SE |  | UTC+1 | VBY | 62
    Oulu | FI |  | UTC+2 | OUL | 90
    Rovaniemi | FI |  | UTC+2 | RVN | 96
    Tartu | EE |  | UTC+2 | TAY | 50
    Liepāja | LV |  | UTC+2 | LPX | 34
    Chania | GR |  | UTC+2 | CHQ | 73
    Kalamata | GR |  | UTC+2 | KLX | 24
    Gaziantep | TR |  | UTC+3 | GZT | 27
    Kayseri | TR |  | UTC+3 | ASR | 38
    Diyarbakır | TR |  | UTC+3 | DIY | 21
    Iași | RO |  | UTC+2 | IAS | 70
    Sibiu | RO |  | UTC+2 | SBZ | 55
    Burgas | BG |  | UTC+2 | BOJ | 8
    Niš | RS |  | UTC+1 | INI | 18
    Zadar | HR |  | UTC+1 | ZAD | 23
    Mostar | BA |  | UTC+1 | OMO | 88
    Ohrid | MK |  | UTC+1 | OHD | 60
    Kutaisi | GE |  | UTC+4 | KUT | 46
    Gyumri | AM |  | UTC+4 | LWN | 31
    Ganja | AZ |  | UTC+4 | GNJ | 20
    Al Ain | AE |  | UTC+4 | AAN
    Ras Al Khaimah | AE |  | UTC+4 | RKT
    Medina | SA |  | UTC+3 | MED | 4
    Taif | SA |  | UTC+3 | TIF | 2
    Abha | SA |  | UTC+3 | AHB | 6
    Tabuk | SA |  | UTC+3 | TUU | 4
    Mashhad | IR |  | UTC+3:30 | MHD | 9
    Isfahan | IR |  | UTC+3:30 | IFN | 81
    Tabriz | IR |  | UTC+3:30 | TBZ | 51
    Aswan | EG |  | UTC+2 | ASW | 81
    Hurghada | EG |  | UTC+2 | HRG | 84
    Sharm El Sheikh | EG |  | UTC+2 | SSH | 46
    Agadir | MA |  | UTC+1 | AGA | 80
    Fez | MA |  | UTC+1 | FEZ | 30
    Tangier | MA |  | UTC+1 | TNG | 90
    Rabat | MA |  | UTC+1 | RBA | 10
    Annaba | DZ |  | UTC+1 | AAE | 23
    Tlemcen | DZ |  | UTC+1 | TLM | 13
    Port Harcourt | NG | Rivers | UTC+1 | PHC | 50
    Enugu | NG | Enugu | UTC+1 | ENU | 40
    Tamale | GH |  | UTC+0 | TML
    Takoradi | GH |  | UTC+0 | TKD
    Eldoret | KE |  | UTC+3 | EDL | 30
    Malindi | KE |  | UTC+3 | MYD | 80
    Mwanza | TZ |  | UTC+3 | MWZ | 33
    Bahir Dar | ET |  | UTC+3 | BJR
    Dire Dawa | ET |  | UTC+3 | DIR
    George | ZA | Western Cape | UTC+2 | GRJ | 65
    Kimberley | ZA | Northern Cape | UTC+2 | KIM | 83
    Maun | BW |  | UTC+2 | MUB
    Ndola | ZM |  | UTC+2 | NLA | 50
    Victoria Falls | ZW |  | UTC+2 | VFA
    Beira | MZ |  | UTC+2 | BEW | 21
    Nampula | MZ |  | UTC+2 | APL | 31
    Lubumbashi | CD |  | UTC+2 | FBM
    Indore | IN | MP | UTC+5:30 | IDR | 452
    Bhopal | IN | MP | UTC+5:30 | BHO | 462
    Patna | IN | BR | UTC+5:30 | PAT | 800
    Ranchi | IN | JH | UTC+5:30 | IXR | 834
    Raipur | IN | CG | UTC+5:30 | RPR | 492
    Guwahati | IN | AS | UTC+5:30 | GAU | 781
    Visakhapatnam | IN | AP | UTC+5:30 | VTZ | 530
    Madurai | IN | TN | UTC+5:30 | IXM | 625
    Tiruchirappalli | IN | TN | UTC+5:30 | TRZ | 620
    Mangaluru | IN | KA | UTC+5:30 | IXE | 575
    Jodhpur | IN | RJ | UTC+5:30 | JDH | 342
    Udaipur | IN | RJ | UTC+5:30 | UDR | 313
    Multan | PK | Punjab | UTC+5 | MUX | 60
    Faisalabad | PK | Punjab | UTC+5 | LYP | 38
    Quetta | PK | Balochistan | UTC+5 | UET | 87
    Rajshahi | BD |  | UTC+6 | RJH | 62
    Jaffna | LK |  | UTC+5:30 | JAF | 40
    Shenyang | CN | Liaoning | UTC+8 | SHE | 110
    Changchun | CN | Jilin | UTC+8 | CGQ | 130
    Jinan | CN | Shandong | UTC+8 | TNA | 250
    Hefei | CN | Anhui | UTC+8 | HFE | 230
    Nanchang | CN | Jiangxi | UTC+8 | KHN | 330
    Nanning | CN | Guangxi | UTC+8 | NNG | 530
    Guilin | CN | Guangxi | UTC+8 | KWL | 541
    Guiyang | CN | Guizhou | UTC+8 | KWE | 550
    Lanzhou | CN | Gansu | UTC+8 | LHW | 730
    Taiyuan | CN | Shanxi | UTC+8 | TYN | 030
    Hohhot | CN | Inner Mongolia | UTC+8 | HET | 010
    Sanya | CN | Hainan | UTC+8 | SYX | 572
    Ningbo | CN | Zhejiang | UTC+8 | NGB | 315
    Tainan | TW |  | UTC+8 | TNN | 70
    Hualien | TW |  | UTC+8 | HUN | 97
    Hakodate | JP | Hokkaido | UTC+9 | HKD | 04
    Asahikawa | JP | Hokkaido | UTC+9 | AKJ | 07
    Aomori | JP | Aomori | UTC+9 | AOJ | 03
    Akita | JP | Akita | UTC+9 | AXT | 01
    Niigata | JP | Niigata | UTC+9 | KIJ | 95
    Takamatsu | JP | Kagawa | UTC+9 | TAK | 76
    Kumamoto | JP | Kumamoto | UTC+9 | KMJ | 86
    Miyazaki | JP | Miyazaki | UTC+9 | KMI | 88
    Gwangju | KR |  | UTC+9 | KWJ | 61
    Cheongju | KR |  | UTC+9 | CJJ | 28
    Ulsan | KR |  | UTC+9 | USN | 44
    Ipoh | MY |  | UTC+8 | IPH | 30
    Johor Bahru | MY |  | UTC+8 | JHB | 80
    Kota Bharu | MY |  | UTC+8 | KBR | 15
    Udon Thani | TH |  | UTC+7 | UTH | 41
    Ubon Ratchathani | TH |  | UTC+7 | UBP | 34
    Surat Thani | TH |  | UTC+7 | URT | 84
    Can Tho | VN |  | UTC+7 | VCA
    Da Lat | VN |  | UTC+7 | DLI
    Quy Nhon | VN |  | UTC+7 | UIH
    Siem Reap | KH |  | UTC+7 | SAI
    Sihanoukville | KH |  | UTC+7 | KOS
    Pakse | LA |  | UTC+7 | PKZ | 16
    Zamboanga City | PH |  | UTC+8 | ZAM | 70
    General Santos | PH |  | UTC+8 | GES | 95
    Padang | ID | Sumatera Barat | UTC+7 | PDG | 25
    Pekanbaru | ID | Riau | UTC+7 | PKU | 28
    Ambon | ID | Maluku | UTC+9 | AMQ | 97
    Newcastle | AU | NSW | UTC+10 | NTL | 23
    Albury | AU | NSW | UTC+10 | ABX | 26
    Dubbo | AU | NSW | UTC+10 | DBO | 28
    Wagga Wagga | AU | NSW | UTC+10 | WGA | 26
    Tamworth | AU | NSW | UTC+10 | TMW | 23
    Port Macquarie | AU | NSW | UTC+10 | PQQ | 24
    Coffs Harbour | AU | NSW | UTC+10 | CFS | 24
    Bundaberg | AU | QLD | UTC+10 | BDB | 46
    Mackay | AU | QLD | UTC+10 | MKY | 47
    Geraldton | AU | WA | UTC+8 | GET | 65
    Kalgoorlie | AU | WA | UTC+8 | KGI | 64
    Tauranga | NZ |  | UTC+12 | TRG | 31
    Napier | NZ |  | UTC+12 | NPE | 41
    Palmerston North | NZ |  | UTC+12 | PMR | 44
    Invercargill | NZ |  | UTC+12 | IVC | 98
    Akron | US | OH | UTC-5 | CAK | 443
    Dayton | US | OH | UTC-5 | DAY | 454
    Toledo | US | OH | UTC-5 | TOL | 436
    Flint | US | MI | UTC-5 | FNT | 485
    Lansing | US | MI | UTC-5 | LAN | 489
    Fort Wayne | US | IN | UTC-5 | FWA | 468
    South Bend | US | IN | UTC-5 | SBN | 466
    Peoria | US | IL | UTC-6 | PIA | 616
    Springfield | US | IL | UTC-6 | SPI | 627
    Cedar Rapids | US | IA | UTC-6 | CID | 524
    Sioux City | US | IA | UTC-6 | SUX | 511
    Bismarck | US | ND | UTC-6 | BIS | 585
    Rapid City | US | SD | UTC-7 | RAP | 577
    Lubbock | US | TX | UTC-6 | LBB | 794
    Amarillo | US | TX | UTC-6 | AMA | 791
    Midland | US | TX | UTC-6 | MAF | 797
    Brownsville | US | TX | UTC-6 | BRO | 785
    Corpus Christi | US | TX | UTC-6 | CRP | 784
    Beaumont | US | TX | UTC-6 | BPT | 777
    Lafayette | US | LA | UTC-6 | LFT | 705
    Shreveport | US | LA | UTC-6 | SHV | 711
    Montgomery | US | AL | UTC-6 | MGM | 361
    Dothan | US | AL | UTC-6 | DHN | 363
    Augusta | US | GA | UTC-5 | AGS | 309
    Wilmington | US | NC | UTC-5 | ILM | 284
    Greenville | US | SC | UTC-5 | GSP | 296
    Monterey | US | CA | UTC-8 | MRY | 939
    Santa Barbara | US | CA | UTC-8 | SBA | 931
    Santa Rosa | US | CA | UTC-8 | STS | 954
    San Luis Obispo | US | CA | UTC-8 | SBP | 934
    Windsor | CA | ON | UTC-5 | YQG | N
    Sarnia | CA | ON | UTC-5 | YZR | N
    Timmins | CA | ON | UTC-5 | YTS | P
    Val-d'Or | CA | QC | UTC-5 | YVO | J
    Rouyn-Noranda | CA | QC | UTC-5 | YUY | J
    Sept-Îles | CA | QC | UTC-5 | YZV | G
    Baie-Comeau | CA | QC | UTC-5 | YBC | G
    Sault Ste. Marie | CA | ON | UTC-5 | YAM | P
    Palmas | BR | TO | UTC-3 | PMW | 77
    Macapá | BR | AP | UTC-3 | MCP | 68
    Santarém | BR | PA | UTC-3 | STM | 68
    Maracaibo | VE |  | UTC-4 | MAR
    Porlamar | VE |  | UTC-4 | PMV
    Holguín | CU |  | UTC-5 | HOG
    Santa Clara | CU |  | UTC-5 | SNU
    Santiago de los Caballeros | DO |  | UTC-4 | STI
    Puerto Plata | DO |  | UTC-4 | POP
    David | PA |  | UTC-5 | DAV
    Liberia | CR |  | UTC-6 | LIR
    Ponce | PR |  | UTC-4 | PSE
    Bournemouth | GB |  | UTC+0 | BOH | BH
    Blackpool | GB |  | UTC+0 | BLK | FY
    Darlington | GB |  | UTC+0 | MME | DL
    Carlisle | GB |  | UTC+0 | CAX | CA
    Swansea | GB |  | UTC+0 | SWS | SA
    Sligo | IE |  | UTC+0 | SXL | F
    Pau | FR | Nouvelle-Aquitaine | UTC+1 | PUF | 64
    Nîmes | FR | Occitanie | UTC+1 | FNI | 30
    Metz | FR | Grand Est | UTC+1 | ETZ | 57
    Kassel | DE | Hessen | UTC+1 | KSF | 34
    Memmingen | DE | Bayern | UTC+1 | FMM | 87
    Viseu | PT |  | UTC+0 | VSE | 3
    Rimini | IT | RN | UTC+1 | RMI | 479
    Lugano | CH |  | UTC+1 | LUG | 69
    Haugesund | NO |  | UTC+1 | HAU | 55
    Växjö | SE |  | UTC+1 | VXO | 35
    Kuopio | FI |  | UTC+2 | KUO | 70
    Ioannina | GR |  | UTC+2 | IOA | 45
    Konya | TR |  | UTC+3 | KYA | 42
    Samsun | TR |  | UTC+3 | SZF | 55
    Oradea | RO |  | UTC+2 | OMR | 41
    Rijeka | HR |  | UTC+1 | RJK | 51
    Sohar | OM |  | UTC+4 | OHS
    Hail | SA |  | UTC+3 | HAS | 5
    Yanbu | SA |  | UTC+3 | YNB | 4
    Yazd | IR |  | UTC+3:30 | AZD | 89
    Kerman | IR |  | UTC+3:30 | KER | 76
    Eilat | IL |  | UTC+2 | ETM | 88
    Oujda | MA |  | UTC+1 | OUD | 60
    Tozeur | TN |  | UTC+1 | TOE | 22
    Biskra | DZ |  | UTC+1 | BSK | 07
    Tébessa | DZ |  | UTC+1 | TEE | 12
    Bouaké | CI |  | UTC+0 | BYK
    Saint-Louis | SN |  | UTC+0 | XLS | 32
    Garoua | CM |  | UTC+1 | GOU
    Nanyuki | KE |  | UTC+3 | NYK | 10
    Gondar | ET |  | UTC+3 | GDQ
    Dodoma | TZ |  | UTC+3 | DOD | 41
    Gulu | UG |  | UTC+3 | ULU
    Upington | ZA | Northern Cape | UTC+2 | UTN | 88
    Lüderitz | NA |  | UTC+2 | LUD
    Francistown | BW |  | UTC+2 | FRW
    Solwezi | ZM |  | UTC+2 | SLI
    Mahajanga | MG |  | UTC+3 | MJN | 401
    Huambo | AO |  | UTC+1 | NOV
    Kisangani | CD |  | UTC+2 | FKI
    Surat | IN | GJ | UTC+5:30 | STV | 395
    Rajkot | IN | GJ | UTC+5:30 | HSR | 360
    Vadodara | IN | GJ | UTC+5:30 | BDQ | 390
    Nashik | IN | MH | UTC+5:30 | ISK | 422
    Kolhapur | IN | MH | UTC+5:30 | KLH | 416
    Belagavi | IN | KA | UTC+5:30 | IXG | 590
    Hubballi | IN | KA | UTC+5:30 | HBX | 580
    Mysuru | IN | KA | UTC+5:30 | MYQ | 570
    Vijayawada | IN | AP | UTC+5:30 | VGA | 520
    Tirupati | IN | AP | UTC+5:30 | TIR | 517
    Kozhikode | IN | KL | UTC+5:30 | CCJ | 673
    Kannur | IN | KL | UTC+5:30 | CNN | 670
    Sialkot | PK | Punjab | UTC+5 | SKT | 51
    Sukkur | PK | Sindh | UTC+5 | SUK | 65
    Jashore | BD |  | UTC+6 | JSR | 74
    Cox's Bazar | BD |  | UTC+6 | CXB | 47
    Biratnagar | NP |  | UTC+5:45 | BIR | 56
    Nepalgunj | NP |  | UTC+5:45 | KEP | 21
    Wenzhou | CN | Zhejiang | UTC+8 | WNZ | 325
    Wuxi | CN | Jiangsu | UTC+8 | WUX | 214
    Changzhou | CN | Jiangsu | UTC+8 | CZX | 213
    Yangzhou | CN | Jiangsu | UTC+8 | YTY | 225
    Yantai | CN | Shandong | UTC+8 | YNT | 264
    Weihai | CN | Shandong | UTC+8 | WEH | 264
    Zhuhai | CN | Guangdong | UTC+8 | ZUH | 519
    Luoyang | CN | Henan | UTC+8 | LYA | 471
    Baotou | CN | Inner Mongolia | UTC+8 | BAV | 014
    Kushiro | JP | Hokkaido | UTC+9 | KUH | 08
    Obihiro | JP | Hokkaido | UTC+9 | OBO | 08
    Jinju | KR |  | UTC+9 | HIN | 52
    Wonju | KR |  | UTC+9 | WJU | 26
    Karaganda | KZ |  | UTC+5 | KGF | 100
    Pavlodar | KZ |  | UTC+5 | PWQ | 140
    Bukhara | UZ |  | UTC+5 | BHK | 200
    Alor Setar | MY |  | UTC+8 | AOR | 05
    Kuantan | MY |  | UTC+8 | KUA | 25
    Phitsanulok | TH |  | UTC+7 | PHS | 65
    Lampang | TH |  | UTC+7 | LPT | 52
    Hai Phong | VN |  | UTC+7 | HPH
    Vinh | VN |  | UTC+7 | VII
    Orange | AU | NSW | UTC+10 | OAG | 28
    Bathurst | AU | NSW | UTC+10 | BHS | 27
    Mildura | AU | VIC | UTC+10 | MQL | 35
    Mount Gambier | AU | SA | UTC+9:30 | MGB | 52
    Port Lincoln | AU | SA | UTC+9:30 | PLO | 56
    Whyalla | AU | SA | UTC+9:30 | WYA | 56
    Esperance | AU | WA | UTC+8 | EPR | 64
    Karratha | AU | WA | UTC+8 | KTA | 67
    Gisborne | NZ |  | UTC+12 | GIS | 40
    Whanganui | NZ |  | UTC+12 | WAG | 45
    Timaru | NZ |  | UTC+12 | TIU | 79
    Labasa | FJ |  | UTC+12 | LBS
    Whangārei | NZ |  | UTC+12 | WRE | 01
    Kalamazoo | US | MI | UTC-5 | AZO | 490
    Duluth | US | MN | UTC-6 | DLH | 558
    Waco | US | TX | UTC-6 | ACT | 767
    Santa Fe | US | NM | UTC-7 | SAF | 875
    Yakima | US | WA | UTC-8 | YKM | 989
    Redding | US | CA | UTC-8 | RDD | 960
    Medicine Hat | CA | AB | UTC-7 | YXH | T
    Lethbridge | CA | AB | UTC-7 | YQL | T
    Los Mochis | MX | Sin. | UTC-7 | LMM | 81
    Petrolina | BR | PE | UTC-3 | PNZ | 56
    Maringá | BR | PR | UTC-3 | MGF | 87
    Bahía Blanca | AR | Buenos Aires | UTC-3 | BHI
    Calama | CL | Antofagasta | UTC-4 | CJC
    Vila Real | PT |  | UTC+0 | VRL | 5
    Molde | NO |  | UTC+1 | MOL | 64
    Kalmar | SE |  | UTC+1 | KLR | 39
    Vaasa | FI |  | UTC+2 | VAA | 65
    Kavala | GR |  | UTC+2 | KVA | 65
    Erzurum | TR |  | UTC+3 | ERZ | 25
    Craiova | RO |  | UTC+2 | CRA | 20
    Essaouira | MA |  | UTC+1 | ESU | 44
    Sétif | DZ |  | UTC+1 | QSF | 19
    Mbeya | TZ |  | UTC+3 | MBI | 53
    Toliara | MG |  | UTC+3 | TLE | 601
    Dehradun | IN | UT | UTC+5:30 | DED | 248
    Dibrugarh | IN | AS | UTC+5:30 | DIB | 786
    Yichang | CN | Hubei | UTC+8 | YIH | 443
    Xuzhou | CN | Jiangsu | UTC+8 | XUZ | 221
    Lijiang | CN | Yunnan | UTC+8 | LJG | 674
    Kuala Terengganu | MY |  | UTC+8 | TGG | 20
    Nakhon Si Thammarat | TH |  | UTC+7 | NST | 80
    Buon Ma Thuot | VN |  | UTC+7 | BMV
    Siddharthanagar | NP |  | UTC+5:45 | BWA | 32
    Bendigo | AU | VIC | UTC+10 | BXG | 35
    Toowoomba | AU | QLD | UTC+10 | WTB | 43
    New Plymouth | NZ |  | UTC+12 | NPL | 43
    Blenheim | NZ |  | UTC+12 | BHE | 72
  `;

  const CITIES = C.rows(RAW_CITIES).map(([city, cc, region, tz, iata, pc, local]) => {
    const c = { city, country: countryByCode[cc].name, countryCode: cc, tz, iata };
    if (region) c.region = region;
    if (pc) c.pc = pc;
    if (local) c.local = local;
    return c;
  });

  const STREET_NAMES = L(`
    Maple Avenue
    Oak Street
    Elm Street
    Pine Street
    Cedar Lane
    Birch Road
    Willow Way
    Chestnut Drive
    Walnut Street
    Spruce Court
    Ash Grove
    Hawthorn Close
    Juniper Terrace
    Magnolia Boulevard
    Sycamore Avenue
    Laurel Drive
    Poplar Road
    Hazel Crescent
    Rowan Gardens
    Linden Place
    Main Street
    High Street
    Church Lane
    Station Road
    Mill Lane
    Park Avenue
    Market Street
    Bridge Street
    Queen Street
    King Street
    Victoria Road
    Albert Street
    London Road
    North Street
    South Street
    West Street
    East Avenue
    School Lane
    Green Lane
    Manor Road
    Grange Road
    Kingsway
    Broadway
    Water Street
    River Road
    Lake Shore Drive
    Harbor View
    Bayview Avenue
    Ocean Drive
    Beach Road
    Cliff Road
    Hillside Avenue
    Valley Road
    Meadow Lane
    Orchard Road
    Garden Street
    Field Way
    Forest Drive
    Woodland Avenue
    Brookside Drive
    Springfield Road
    Fairview Avenue
    Highland Avenue
    Sunset Boulevard
    Sunrise Court
    Prospect Street
    Pleasant Street
    Liberty Avenue
    Union Street
    Franklin Avenue
    Lincoln Street
    Jefferson Avenue
    Madison Street
    Monroe Drive
    Jackson Street
    Adams Street
    Grant Avenue
    Wilson Road
    Clinton Street
    Hamilton Road
    College Avenue
    University Drive
    Academy Street
    Hospital Road
    Canal Street
    Wharf Road
    Dock Street
    Ferry Lane
    Quarry Road
    Forge Lane
    Tannery Road
    Foundry Street
    Railway Terrace
    Depot Street
    Old Post Road
    Turnpike Road
    County Road 12
    Route 9
    State Street
    Commerce Drive
    Industrial Parkway
    Technology Way
    Innovation Drive
    Enterprise Avenue
    Corporate Boulevard
    Gateway Plaza
    Central Avenue
    Center Street
    Cross Street
    Crescent Road
    Circle Drive
    Ridge Road
    Summit Avenue
    Mountain View Road
    Canyon Drive
    Mesa Verde Way
    Desert Rose Lane
    Prairie Avenue
    Cottonwood Drive
    Aspen Way
    Sequoia Court
    Redwood Road
    Cypress Avenue
    Palm Drive
    Olive Street
    Vine Street
    Rose Lane
    Lavender Way
    Primrose Hill
    Bluebell Close
    Daisy Street
    Tulip Court
    Ivy Lane
    Heather Drive
    Thistle Way
    Fern Road
    Moss Lane
    Holly Avenue
    Mistletoe Close
    Cherry Tree Lane
    Apple Blossom Way
    Pear Tree Road
    Plum Street
    Quince Court
    Hollow Road
    Fox Run
    Deer Path
    Eagle Crest
    Hawk Ridge
    Robin Lane
    Sparrow Way
    Swallow Street
    Heron Road
    Kingfisher Close
    Owl Hollow Lane
    Badger Lane
    Otter Creek Road
    Beaver Pond Road
    Bear Creek Drive
    Wolf Trail
    Abbey Road
    Cathedral Street
    Chapel Street
    Priory Lane
    Castle Street
    Tower Hill
    Gatehouse Road
    Vicarage Lane
    Rectory Road
    The Green
    The Crescent
    The Avenue
    The Close
    Wellington Street
    Nelson Road
    Trafalgar Square
    Waterloo Road
    Cambridge Street
    Oxford Road
    York Street
    Windsor Avenue
    Richmond Terrace
    Kensington Place
    Dogwood Lane
    Hemlock Road
    Beechwood Drive
    Ironwood Court
    Cloverfield Road
    Elderberry Lane
    Larchmont Avenue
    Snowberry Court
    Marigold Street
    Clover Lane
    Blue Spruce Way
    Stonegate Road
    Millstone Court
    Cobblestone Lane
    Granite Way
    Slate Roof Drive
    Copperfield Road
    Iron Gate Lane
    Palisade Street
    Lantern Way
    Windmill Road
    Clocktower Lane
    Old Orchard Path
    Watermill Lane
    Reservoir Road
    Lockkeepers Way
    Weir Street
    Basin Court
    Tidepool Lane
    Seabreeze Avenue
    Dunegrass Road
    Saltmarsh Way
    Sandbar Court
    Breakwater Drive
    Mariners Walk
    Anchor Lane
    Gullwing Street
    Pelican Way
    Tern Court
    Driftwood Avenue
    Cove Landing
    Soundview Road
    Estuary Lane
    Low Tide Court
    Northwind Road
    Southwind Lane
    Westward Way
    Four Winds Court
    Windward Avenue
    Rainier Path
    Cloudbank Road
    Thunderhead Lane
    Frostline Drive
    Snowcap Avenue
    Icicle Way
    Sundial Street
    Moonrise Lane
    Comet Trail
    Daybreak Road
    Solstice Drive
    Equinox Court
    Storybook Lane
    Fable Court
    Poets Corner
    Tinker Lane
    Wanderers Way
    Pilgrim Street
    Pioneer Trail
    Homestead Road
    Settlers Court
    Frontier Avenue
    Cattle Drive
    Lariat Lane
    Saddleback Road
    Mustang Way
    Rodeo Court
    Pinyon Drive
    Coyote Run
    Jackrabbit Lane
    Roadrunner Way
    Pronghorn Court
    Antelope Trail
    Bison Crossing
    Elk Meadow Road
    Moose Track Lane
    Pheasant Run
    Blue Jay Court
    Finch Way
    Wrenwood Lane
    Crane Landing
    Tamarack Court
    Willowmere Drive
    Pinecone Lane
    Acorn Street
    Hickory Nut Road
    Butternut Court
    Mulberry Walk
    Eucalyptus Way
    Saffron Street
    Coriander Lane
    Cinnamon Road
    Cardamom Drive
    Honeycomb Way
    Buttermilk Lane
    Creamery Road
    Dairymaid Court
    Oatcake Lane
    Wheatland Avenue
    Haystack Court
    Orchard Gate
    Vineyard Walk
    Cider Press Lane
    Cranberry Court
    Blackberry Way
    Raspberry Ridge
    Gooseberry Lane
    Fig Tree Court
    Lemon Grove Road
    Apricot Way
    Coach House Way
    Tollhouse Street
    Postmasters Row
    Weavers Lane
    Potters Court
    Carpenter Street
    Shipwright Road
    Sailmaker Lane
    Ropemaker Court
    Glassblower Way
    Mapmakers Lane
    Clockmakers Row
    Festival Court
    Maypole Street
    Midsummer Lane
    Bonfire Court
    Cascade Way
    Waterfall Lane
    Rillstone Road
    Fernbank Court
    Wildflower Way
    Heatherbell Lane
    Primrose Vale
    Celandine Street
    Foxglove Close
    Honeysuckle Walk
    Sweet Pea Lane
    Blue Iris Road
    Woodpecker Way
    Amberfield Road
    Briar Glen Road
    Cattail Bend
    Junebug Court
    Willowbrook Rise
    Pinehurst Mews
    Stonecrop Way
    Larkspur Heights
    Glenhaven Road
    Foxearth Lane
    Marsh Wren Court
    Coppersmith Row
    Bakersfield Mews
    Ashlar Place
    Pewter Lane
    Gilders Way
    Masons Yard
    Chandlers Court
    Tallow Street
    Raglan Terrace
    Woolwich Road
    Fenchurch Lane
    Kingsbridge Mews
    Westbury Walk
    Hatherley Close
    Bramley Rise
    Ashcombe Gardens
    Dunlin Road
    Lapwing Crescent
    Curlew Walk
    Snipe Meadow
    Osprey Point
    Puffin Passage
    Cormorant Quay
    Gannet Street
    Turnstone Way
    Drift Vale Road
    Fallow Deer Lane
    Hazelwood Mews
    Stillwater Reach
    Mistwood Drive
    Greystone Hollow
    Ravenscar Road
    Poppyseed Lane
    Pennyroyal Court
    Arbutus Lane
    Bayberry Court
    Cloverleaf Mews
    Balsam Fir Road
    Serviceberry Way
    Kestrel Ridge
    Peregrine Walk
    Nightingale Rise
    Goldfinch Court
    Waxwing Lane
    Rookery Road
    Swallowtail Way
    Monarch Meadow
    Katydid Court
    Cicada Lane
    Firefly Terrace
    Milkweed Street
    Goldenrod Place
    Buttercup Rise
    Snowdrop Mews
    Pimpernel Road
    Tansy Court
    Yarrow Lane
    Sorrel Way
    Fennel Street
    Borage Crescent
    Aniseed Court
    Sedgewick Lane
    Tanglewood Rise
    Glenferry Road
    Northbridge Mews
    Longwater Street
    Merefield Court
    Brackenridge Way
    Cairnside Road
    Chalkstream Lane
    Flintlock Court
    Pumice Place
    Riversedge Mews
    Twin Pines Court
    Silverleaf Lane
    Windrush Terrace
    Fernleigh Road
    Cedarfield Mews
    Alderstone Court
    Rosedale Passage
    Treetop Walk
    Oriole Landing
    Wagtail Court
    Grebe Way
    Pipit Lane
    Skylark Mews
    Redstart Road
    Treecreeper Path
    Honeyeater Lane
    Bellflower Mews
    Ragwort Road
    Cowslip Court
    Valerian Way
    Lindenberry Lane
    Huckleberry Rise
    Old Quarry Mews
    Moorland Gate
    Belltower Rise
    Hearthside Lane
    Cresswell Lane
    Fossil Point
    Amberwood Walk
    Kingswell Road
    Holloway Mews
    Tarnside Terrace
    Misty Vale Court
    Briarstone Way
    Sundew Court
    Mallow Street
    Ridgewell Lane
    Glasshouse Row
    Marlstone Place
    Swanpool Road
    Oakhurst Mews
    Redcliff Terrace
    Pinebrook Court
    Foxglade Way
    Morningside Path
    Candleberry Lane
    Heatherdown Mews
    Haresfoot Lane
    Marshgate Court
    Rookwood Terrace
    Brindlewood Rise
    Northmere Place
    Southmere Walk
    Westmere Lane
    Eastmere Court
    Farthing Green
    Old Lantern Row
    Cobbler Yard
    Millpond Mews
    Riversong Way
    Pebblefield Road
    Fernsong Walk
    Brookfield Mews
    Willowfern Court
    Alderwick Road
    Cedarhurst Lane
    Dunestone Drive
    Foxleigh Terrace
    Irongate Mews
    Kirkstone Place
    Larkhill Avenue
    Moorcroft Lane
    Oakenshaw Court
    Pinecroft Rise
    Quarryside Road
    Southgate Mews
    Thornfield Walk
    Ashford Lane
    Bellamy Street
    Cavendish Road
    Dunbar Avenue
    Ellsworth Court
    Fairhaven Drive
    Grafton Place
    Hawley Road
    Ivydale Terrace
    Kendal Street
    Langford Way
    Norwood Avenue
    Ormond Lane
    Pembroke Street
    Radcliffe Road
    Sherwood Court
    Tavistock Place
    Upton Crescent
    Whitby Lane
    Alder Run
    Copper Ridge Way
    Dry Gulch Lane
    Eagle Pass Drive
    Kingfisher Bend
    Lone Pine Trail
    Misty River Way
    North Fork Road
    Overlook Ridge
    Ponderosa Loop
    Yellowstone Way
    Canyon Rim Road
    Eldorado Street
    Mesa Ridge Drive
    Painted Rock Way
    Ranchero Road
    Sagebrush Lane
    Sunflower Mesa
    Three Oaks Court
    Wild Basin Road
    Blackwater Lane
    Fishermans Wharf
    Golden Sands Way
    Inlet View Drive
    Jetty Road
    Kelp Forest Lane
    Lagoon Point Way
    Quayside Avenue
    Reefside Walk
    Seafarer Lane
    Tidewater Place
    Windlass Street
    Bluewater Reach
    Saltwind Terrace
    Schooner Court
    Trawler Way
    Lakeside Landing
    Birchwater Road
    Clearwater Bend
    Deepwater Court
    Eagle Lake Trail
    Fawn Lake Drive
    Lakeshore Mews
    Marshview Avenue
    Pinewater Place
    Quiet Lake Lane
    Silverwater Path
    Stillwater Cove
    Willowbank Road
    Wintermere Court
    Willowfen Way
    Meadowbrook Rise
    Mossy Glen Road
    Briarpatch Path
    Dovecote Lane
    Greenbriar Walk
    Harebell Court
    Moorhen Mews
    Rowanfield Road
    Teasel Way
    Whinchat Place
    Woodlark Rise
    Badgerstone Lane
    Foxglove Vale
    Pine Marten Way
    Red Fox Crossing
    Wildcat Hollow
    Bumblebee Lane
    Dandelion Court
    Grasshopper Way
    Ladybird Terrace
    Mothwing Place
    Toadflax Road
    Woolly Bear Walk
    Bellwort Lane
    Burdock Street
    Calendula Court
    Coreopsis Way
    Delphinium Rise
    Echinacea Road
    Hellebore Place
    Jonquil Street
    Lupine Meadow
    Nasturtium Walk
    Oleander Court
    Petaluma Lane
    Snapdragon Place
    Verbena Terrace
    Wisteria Hollow
    Yew Tree Lane
    Alabaster Court
    Basalt Avenue
    Caraway Street
    Dunwich Road
    Ember Lane
    Fiddlers Green
    Garnet Street
    Hearth Lane
    Ivory Court
    Jade Terrace
    Kiln Street
    Loomis Way
    Mosaic Walk
    Nettleton Road
    Opal Crescent
    Parchment Place
    Quill Lane
    Rookery Walk
    Saffron Hill
    Arborfield Lane
    Ashenbrook Drive
    Bramblewick Road
    Brindle Court
    Brookmere Avenue
    Calderstone Way
    Candleford Mews
    Cedarcombe Road
    Chapelbrook Rise
    Cinder Lane
    Cloverdown Way
    Cotswold Place
    Cranewell Road
    Cresset Lane
    Dalesford Avenue
    Dapplewood Court
    Dawnridge Road
    Deepwood Lane
    Dunmere Street
    Eastfield Rise
    Elderwood Way
    Elmstead Court
    Fairmead Road
    Farley Green
    Ferrybridge Lane
    Foxcombe Rise
    Gable End Road
    Gardeners Walk
    Glenfield Avenue
    Goldcrest Mews
    Granary Lane
    Greengage Court
    Greyfriars Road
    Hazelbank Way
    Hedgeley Close
    Highcroft Place
    Hillcrest Mews
    Hollyhock Lane
    Honeybourne Road
    Ivybridge Walk
    Juniper Downs
    Kestrelwood Lane
    Kingsmead Avenue
    Kingsfold Road
    Larchwood Rise
    Lea Bank Road
    Limekiln Street
    Lowfield Road
    Maplehurst Way
    Marble Arch Lane
    Marlfield Road
    Millbrook Rise
    Moorfield Avenue
    Mossbank Lane
    Newbridge Street
    Newmarket Mews
    Northfield Place
    Oakfield Rise
    Old Mill Yard
    Old Rectory Lane
    Overton Close
    Parkfield Avenue
    Pasture Lane
    Pennywell Road
    Plumtree Close
    Pondside Way
    Priestfield Road
    Ravenstone Road
    Redbourne Lane
    Ridgeway Gardens
    Roundhouse Court
    Sandy Lane
    Sedgefield Road
    Shelterbelt Way
    Shoreham Close
    Silverton Avenue
    Southfield Mews
    Stagwell Road
    Starling Place
    Stonebridge Walk
    Stonemill Lane
    Thornbury Avenue
    Timber Yard Lane
    Topaz Court
    Tudor Rose Way
    Turnmill Street
    Underwood Close
    Vale End Road
    Vesper Road
    Watercress Lane
    Westfield Green
    Wheatcroft Road
    Whitebeam Way
    White Hart Lane
    Windermere Place
    Woodbine Avenue
    Woodchester Lane
    Woodfield Rise
    Woodgate Court
    Woodside Green
    Wycherley Road
    Abbeyfield Road
    Admirals Quay
    Bayswater Road
    Beckett Street
    Belltree Lane
    Blackthorn Rise
    Bramble Rise
    Buckthorn Court
    Burleigh Road
    Canterbury Mews
    Castleford Way
    Chalkhill Road
    Churchfield Lane
    Claygate Street
    Cloverhurst Rise
    Coopers Yard
    Cornmill Lane
    Crownfield Road
    Dunster Place
    Eastbury Avenue
    Eversley Road
    Fallowfield Lane
    Fernwood Place
    Fieldfare Court
    Gardenia Road
    Glenarden Place
    Greenacre Lane
    Haddon Street
    Hawthorn Grove
    Hayward Court
    Hollytree Close
    Horseshoe Mews
    Kingscote Road
    Longford Street
    Lower Green Road
    Marshfield Way
    Millfield Court
    Oakwell Road
    Pavilion Lane
    Riversmeet Road
    Sandstone Way
    Southbank Place
    Stonemasons Road
    Suttonfield Road
    Thorncombe Close
    Tillingham Way
    Wellspring Lane
    Westhaven Road
    Wharfside Court
    Woodlands Rise
  `);

  const STREETS_BY_LOCALE = {
    'de-DE': L(`
      Hauptstraße
      Bahnhofstraße
      Lindenstraße
      Schulstraße
      Gartenstraße
      Bergstraße
      Kirchweg
      Dorfstraße
      Am Markt
      Goethestraße
      Schillerstraße
      Mühlenweg
      Rosenweg
      Birkenallee
      Waldstraße
      Friedrichstraße
      Kastanienallee
      Am Stadtpark
      Uferstraße
      Sonnenstraße
      Wiesenweg
      Ringstraße
      Mozartstraße
      Lessingplatz
      Eichenstraße
      Fichtenweg
      Buchenweg
      Ahornallee
      Talstraße
      Brückenstraße
      Bachweg
      Hafenstraße
      Höhenweg
      Quellenweg
      Heinestraße
      Hansastraße
      Wilhelmstraße
      Kaiserstraße
      Rathausplatz
      Poststraße
      Klosterstraße
      Feldweg
      Amselweg
      Lerchenstraße
      Schwanenstraße
      Neue Gasse
      Im Wiesengrund
      Am Anger
      Blumenstraße
      Adlerstraße
      Seestraße
      Kiefernstraße
      Pappelweg
      Ulmenallee
      Wachtelweg
      Drosselweg
      Finkenstraße
      Schmiedegasse
      Ziegelstraße
      Kanalstraße
      Deichstraße
      Weinbergweg
      Am Weiher
      Am Sportplatz
      Am Mühlbach
      Im Winkel
      Mittelweg
      Fliederweg
      Breite Straße
      Hintere Gasse
      Albertstraße
      Schubertstraße
      Lange Gasse
      Kurze Straße
      Burgstraße
      Schlossallee
      Königsweg
      Bismarckstraße
      Kronenstraße
      Ritterstraße
      Friedhofsweg
      Hirschweg
      Fasanenstraße
      Margeritenweg
      Kirschbaumweg
      Rebenweg
      Kapellenstraße
      Sandweg
      Römerstraße
      Moorweg
      Kreuzweg
      Erlenweg
      Am Sonnenhang
      Daimlerstraße
      Wasserstraße
      Schäfergasse
      Am Rain
      Ebereschenweg
      Dammweg
      Steinweg
      Lärchenstraße
      Alte Straße
      Hügelweg
      Tannenstraße
      Wolfsweg
      Bergmannstraße
      Donaustraße
      Zollstraße
      Löwenstraße
      Glockengasse
      Bleichstraße
      Hirtenweg
      Keltenstraße
    `),
    'fr-FR': L(`
      rue de la République
      rue Victor Hugo
      avenue des Champs
      rue des Lilas
      boulevard Saint-Michel
      rue de la Paix
      rue du Moulin
      place de la Mairie
      rue Pasteur
      avenue Jean Jaurès
      rue des Écoles
      chemin des Vignes
      rue de l'Église
      allée des Tilleuls
      quai des Brumes
      rue du Marché
      impasse des Roses
      rue Voltaire
      avenue de la Gare
      rue des Acacias
      boulevard de la Liberté
      rue Montmartre
      rue du Faubourg
      avenue des Peupliers
      place du Tertre
      rue des Jardins
      boulevard des Italiens
      chemin de la Fontaine
      rue du Vieux-Pont
      allée des Marronniers
      rue de la Source
      place des Arts
      rue des Pêcheurs
      quai de la Loire
      impasse du Lavoir
      rue du Château
      avenue du Parc
      chemin des Prés
      rue des Fleurs
      place de la Victoire
      rue des Carmes
      allée du Verger
      avenue du Bois
      rue de Bretagne
      rue du Temple
      boulevard Haussmann
      place de l'Horloge
      chemin de la Colline
      impasse des Érables
      quai des Augustins
      rue des Fontaines
      passage des Panoramas
      rue du Ruisseau
      cours Lafayette
      square des Batignolles
      rue de Provence
      rue des Remparts
      rue du Calvaire
      place des Halles
      rue des Mimosas
      quai de la Daurade
      avenue de la Villette
      passage du Caire
      rue des Fossés
      rue des Capucines
      place des Dominicains
      chemin des Oliviers
      allée des Platanes
      quai de l'Ourcq
      impasse du Pressoir
      rue des Violettes
      avenue des Sports
      boulevard des Forges
      passage des Écoliers
      rue de la Tour
      route de la Forêt
      rue des Cèdres
      place des Terreaux
      rue du Port
      square de la Roseraie
      passage des Arènes
      cours Mirabeau
      impasse des Chardons
      avenue de la Mer
      rue du Palais
      avenue de Flandre
      rue des Tanneurs
      chemin des Chênes
      rue des Pervenches
      impasse des Glycines
      quai de la Seine
      rue Saint-Pierre
      passage des Abbesses
      cours Jean-Ballard
      rue du Collège
      boulevard du Hainaut
      place des Jacobins
      route du Littoral
      allée des Genêts
      square des Peupliers
      rue des Orfèvres
      place du Palais
      impasse du Clos
      rue du Belvédère
    `),
    'es-ES': L(`
      Calle Mayor
      Calle de Alcalá
      Avenida de la Constitución
      Calle Real
      Plaza de España
      Calle del Sol
      Paseo de la Castellana
      Calle Nueva
      Avenida de América
      Calle de la Paz
      Calle San Juan
      Calle de las Flores
      Ronda de Valencia
      Calle del Carmen
      Calle de Cervantes
      Gran Vía
      Calle del Olmo
      Avenida del Puerto
      Calle Luna
      Travesía del Mar
      Calle de Goya
      Calle de Serrano
      Paseo de la Estación
      Plaza de la Iglesia
      Calle de San Pedro
      Camino del Molino
      Calle del Río
      Avenida de Andalucía
      Calle de la Fuente
      Paseo Marítimo
      Plaza Mayor
      Calle de los Olivos
      Calle de Atocha
      Calle de la Esperanza
      Ronda del Norte
      Cuesta de San Vicente
      Camino de Santiago
      Calle del Prado
      Calle de Fuencarral
      Paseo de Recoletos
      Plaza de la Merced
      Calle de la Magdalena
      Camino de los Pinos
      Calle de la Montera
      Ronda de Toledo
      Calle de San Bernardo
      Paseo de los Álamos
      Avenida del Mediterráneo
      Calle de la Palma
      Plaza del Mercado
      Travesía de la Fuente
      Calle del Arenal
      Camino de las Eras
      Calle de Zurbano
      Paseo de la Florida
      Cuesta de la Vega
      Calle de las Huertas
      Calle de la Cava Baja
      Calle de Embajadores
      Calle de la Morería
      Avenida de los Poblados
      Paseo de la Habana
      Plaza de Oriente
      Calle de la Princesa
      Calle de Ibiza
      Calle de Ponzano
      Calle del Pez
      Camino de la Huerta
      Cuesta de las Descargas
      Plaza de Olavide
      Carretera de Burgos
      Travesía de San Mateo
      Calle de la Cebada
      Paseo de las Delicias
      Ronda de Segovia
      Calle de la Encina
      Avenida de Europa
      Plaza de San Martín
      Paseo de la Alameda
      Calle del Espejo
      Camino de Valverde
      Carretera de la Sierra
      Travesía del Pozo
      Ronda de la Muralla
      Cuesta del Rosario
      Paseo de los Castaños
      Calle de la Alondra
      Plaza de las Tendillas
      Calle del Humilladero
      Avenida del Parque
      Calle de la Estrella
      Calle de San Isidro
      Camino de la Dehesa
      Plaza de la Aduana
      Travesía de las Huertas
    `),
    'pt-BR': L(`
      Rua das Flores
      Avenida Paulista
      Rua XV de Novembro
      Rua Sete de Setembro
      Avenida Brasil
      Rua da Consolação
      Rua dos Andradas
      Avenida Atlântica
      Rua Augusta
      Rua do Comércio
      Rua São Bento
      Avenida Getúlio Vargas
      Rua das Palmeiras
      Rua Tiradentes
      Rua Santa Clara
      Avenida das Américas
      Rua Bela Vista
      Rua dos Ipês
      Travessa do Mercado
      Alameda Santos
      Rua do Sol
      Avenida Independência
      Rua Padre Anchieta
      Rua da Liberdade
      Travessa do Rosário
      Alameda dos Anjos
      Rua Boa Vista
      Avenida Central
      Rua do Lago
      Rua Monte Alegre
      Praça da República
      Rua da Harmonia
      Estrada do Contorno
      Rua das Acácias
      Avenida das Nações
      Beco do Amparo
      Rua Primeiro de Maio
      Travessa da Serra
      Largo da Matriz
      Rua do Bosque
      Rua do Carmo
      Avenida Ipiranga
      Rua Marechal Deodoro
      Rua Joaquim Nabuco
      Rua Dom Pedro II
      Rua dos Pinheiros
      Rua da Praia
      Avenida Afonso Pena
      Rua General Osório
      Travessa do Cedro
      Alameda das Oliveiras
      Praça do Coreto
      Estrada da Cachoeira
      Beco das Pedras
      Largo do Cruzeiro
      Avenida João Pessoa
      Rua das Laranjeiras
      Rua do Arco
      Travessa das Gaivotas
      Rua dos Guimarães
      Avenida do Trabalhador
      Rua Professor Almeida
      Travessa da Fonte
      Praça dos Pioneiros
      Estrada do Engenho
      Beco da Estação
      Largo São Miguel
      Alameda dos Sabiás
      Rua das Orquídeas
      Rua Padre Cícero
      Travessa do Pescador
      Rua Francisco Goulart
      Rua da Figueira
      Estrada das Bromélias
      Beco do Sossego
      Largo das Bandeiras
      Rua Álvares Cabral
      Travessa do Alecrim
      Largo da Estação
      Rua Coronel Pacheco
      Avenida São João
      Rua Antônio Carlos
      Beco da Lapa
      Estrada Velha
      Rua do Riacho
      Alameda dos Guatambus
      Rua da Gameleira
      Rua do Mirante
      Praça da Bandeira
      Rua Cândido Portinari
      Travessa do Açude
      Largo do Pelourinho
      Estrada do Caju
      Rua das Quaresmeiras
    `),
    'it-IT': L(`
      Via Roma
      Via Garibaldi
      Corso Vittorio Emanuele
      Via Dante
      Via Mazzini
      Piazza del Duomo
      Via Verdi
      Via della Repubblica
      Viale dei Mille
      Via San Francesco
      Via Cavour
      Corso Italia
      Via dei Fiori
      Via del Mare
      Vicolo Stretto
      Via Manzoni
      Piazza della Libertà
      Via Marconi
      Viale Europa
      Via delle Vigne
      Via XX Settembre
      Via Leopardi
      Via Alfieri
      Via Giotto
      Via del Carmine
      Via della Torre
      Via del Teatro
      Via Monte Grappa
      Via dei Tigli
      Via dei Platani
      Corso Matteotti
      Corso Umberto I
      Corso Regina Margherita
      Piazza del Popolo
      Piazza San Marco
      Piazza della Scala
      Piazza della Stazione
      Viale Trento
      Viale Trieste
      Largo Augusto
      Via Francesco Petrarca
      Via Galileo Galilei
      Via Cesare Battisti
      Via Vittorio Veneto
      Via San Giovanni
      Via San Lorenzo
      Via della Chiesa
      Via del Portico
      Via delle Rose
      Via dei Cipressi
      Via del Gelsomino
      Via degli Olmi
      Via del Lavoro
      Via del Sole
      Via del Borgo
      Piazza delle Erbe
      Piazza del Municipio
      Piazza San Pietro
      Viale della Vittoria
      Lungomare dei Pini
      Via del Parco
      Via della Fonte
      Via del Ponte
      Via dei Giardini
      Via delle Magnolie
      Via San Michele
      Via Carlo Alberto
      Via Nizza
      Via Torino
      Via Bologna
      Piazza Navona
      Piazza dei Mercanti
      Piazza del Mercato
      Largo della Pace
      Largo San Giorgio
      Vicolo del Forno
      Strada della Rovere
      Salita San Nicola
      Lungomare delle Sirene
      Via della Pineta
      Via Giovanni Pascoli
      Via Santa Lucia
      Via San Giacomo
      Via San Rocco
      Via delle Ginestre
      Via degli Aceri
      Via del Mulino
      Via del Castello
      Via dei Bastioni
      Via della Fiera
      Via del Canale
      Via del Fontanile
      Salita della Rocca
      Piazza dei Signori
      Piazza della Concordia
      Largo delle Colonne
      Vicolo dei Fabbri
    `),
    'nl-NL': L(`
      Keizersgracht
      Prinsengracht
      Hoofdstraat
      Kerkstraat
      Molenweg
      Dorpsstraat
      Stationsweg
      Schoolstraat
      Julianalaan
      Beatrixstraat
      Lindenlaan
      Wilhelminastraat
      Marktplein
      Havenkade
      Dijkweg
      Parkstraat
      Nieuwe Binnenweg
      Oranjestraat
      Tulpstraat
      Zeeweg
      Singel
      Voorstraat
      Langestraat
      Bosweg
      Bergweg
      Kloosterstraat
      Raadhuisstraat
      Kastanjelaan
      Eikenlaan
      Esdoornstraat
      Sparrenlaan
      Rivierdijk
      Veerweg
      Achterweg
      Oosterkade
      Westerstraat
      Zuidwal
      Noorderlaan
      Korenmarkt
      Meidoornlaan
      Koningstraat
      Hogeweg
      Klinkerstraat
      Zandstraat
      Brugstraat
      Brouwersgracht
      Leliestraat
      Rozengracht
      Veldweg
      Akerstraat
      Zonnebloemstraat
      Waterstraat
      Kadeweg
      Burgwal
      Brinkstraat
      Vijverlaan
      Heuvelstraat
      Gruttostraat
      Dreef
      Herenstraat
      Korte Poten
      Lange Houtstraat
      Breestraat
      Piet Heinstraat
      Stadhouderskade
      Amstelstraat
      Weteringschans
      Utrechtsestraat
      Bilderdijkstraat
      Ceintuurbaan
      Overtoom
      Koninginnegracht
      Goudsesingel
      Mathenesserlaan
      Coolsingel
      Biltstraat
      Maliebaan
      Oudegracht
      Neude
      Vismarkt
      Ginnekenweg
      Meent
      Weena
      Lange Voorhout
      Spuistraat
      Houtmarkt
      Vughterstraat
      Kruisstraat
    `),
    'pl-PL': L(`
      ul. Marszałkowska
      ul. Długa
      ul. Kościuszki
      ul. Mickiewicza
      ul. Słowackiego
      ul. Polna
      ul. Leśna
      ul. Ogrodowa
      ul. Lipowa
      al. Jerozolimskie
      ul. Kwiatowa
      ul. Szkolna
      ul. Piłsudskiego
      ul. Sienkiewicza
      ul. Kolejowa
      ul. Wiejska
      ul. Słoneczna
      pl. Grunwaldzki
      ul. Chopina
      ul. Krótka
      ul. Różana
      ul. Brzozowa
      ul. Wiosenna
      ul. Jesienna
      ul. Cicha
      ul. Jasna
      ul. Boczna
      ul. Zamkowa
      ul. Półwiejska
      ul. Świętojańska
      ul. Starowiejska
      ul. Grodzka
      ul. Wrocławska
      ul. Krakowska
      ul. Gdańska
      ul. Łąkowa
      ul. Rzeczna
      ul. Spacerowa
      ul. Podgórna
      ul. Kasztanowa
      ul. Bukowa
      ul. Sarnia
      ul. Północna
      ul. Główna
      ul. Morska
      ul. Wodna
      ul. Fabryczna
      ul. Graniczna
      ul. Torowa
      ul. Jaśminowa
      ul. Szeroka
      ul. Karmelicka
      ul. Piwna
      ul. Targowa
      ul. Rybna
      ul. Dworcowa
      ul. Sadowa
      ul. Ceglana
      ul. Żurawia
      ul. Wąska
      ul. Ratuszowa
      ul. Garncarska
      ul. Browarna
      ul. Młyńska
      ul. Rynkowa
      ul. Księżycowa
      ul. Reymonta
      ul. Paderewskiego
      ul. Piekarska
      ul. Słowiańska
      ul. Łódzka
      ul. Bydgoska
      ul. Klasztorna
      ul. Myśliwska
      ul. Zielona
      ul. Kalinowa
      ul. Szczytowa
      ul. Podwale
      ul. Nadbrzeżna
      ul. Cmentarna
      ul. Rzemieślnicza
      ul. Okrężna
      ul. Składowa
      ul. Zdrojowa
      pl. Wolności
      pl. Zwycięstwa
    `),
    // Ward + neighborhood for Japanese block addresses (chome-ban-go), keyed by city in JA_AREAS below.
    'ja-JP': [],
    'zh-CN': L(`
      Jianguo Road
      Nanjing West Road
      Huaihai Middle Road
      Renmin Avenue
      Zhongshan Road
      Jiefang Road
      Wenhua Road
      Heping Street
      Xinhua Road
      Changan Avenue
      Binjiang Road
      Yan'an East Road
      Tianfu Avenue
      Hubin Road
      Xueyuan Road
      Kexue Avenue
      Dongfeng Road
      Beijing Road
      Jinqiao Road
      Shennan Avenue
      Fuxing Road
      Changjiang Road
      Huanghe Road
      Qingnian Road
      Gongyuan Road
      Longhua Road
      Yucai Road
      Guangming Road
      Taiping Road
      Daxue Road
      Huancheng Road
      Tongxin Road
      Fenghuang Road
      Lianhua Road
      Yuhua Road
      Fumin Road
      Yinhai Road
      Xiangyang Road
      Wuyi Street
      Zhonghua Avenue
      Yong'an Road
      Jiangnan Avenue
      Mingzhu Street
      Yuehai Road
      Hengshan Road
      Linchun Street
      Yongxing Road
      Qingfeng Road
      Shengli Street
      Fenglin Avenue
      Jinxiu Road
      Xiangjiang Street
      Fuchun Road
      Baiyun Avenue
      Zhenxing Road
      Wenchang Street
      Yongfu Road
      Haitang Street
      Qinghe Avenue
      Yingbin Road
      Minzhu Road
      Tiyu Road
      Yulan Street
      Shuguang Road
      Chenggong Road
      Jianshe Road
      Zhongxin Street
      Shuanghe Road
      Shiqiao Road
      Xicheng Road
      Dongcheng Street
      Nanshan Road
      Beihai Road
      Xingfu Street
      Yinxing Road
      Wanshou Road
      Huayuan Road
      Shuanglong Avenue
      Wenchang Road
      Huxin Street
      Xingye Road
      Daming Road
      Shengping Road
      Jinghua Road
      Jiangbei Avenue
      Jiangdong Road
      Haidian Road
      Huangpu Avenue
      Shangcheng Road
      Jinshan Road
      Yuejin Street
      Yingchun Road
      Huimin Street
      Jingang Road
      Xiangtan Road
      Qingyuan Avenue
      Shuangjing Road
      Dongyuan Street
      Huaqing Road
      Yuexiu Road
    `),
  };

  const JA_AREAS = {
    Tokyo: ['Shibuya-ku Jingumae', 'Shibuya-ku Ebisu', 'Shinjuku-ku Nishi-Shinjuku', 'Chiyoda-ku Marunouchi',
      'Chuo-ku Ginza', 'Minato-ku Akasaka', 'Meguro-ku Kamimeguro', 'Setagaya-ku Kitazawa', 'Taito-ku Asakusa',
      'Minato-ku Roppongi', 'Taito-ku Yanaka', 'Shinjuku-ku Kagurazaka', 'Bunkyo-ku Hongo', 'Shibuya-ku Sarugakucho'],
    Osaka: [
      'Kita-ku Umeda', 'Chuo-ku Namba', 'Chuo-ku Honmachi', 'Chuo-ku Shinsaibashisuji', 'Kita-ku Tenjinbashi',
      'Kita-ku Nakanoshima', 'Kita-ku Dojima', 'Kita-ku Tenma', 'Chuo-ku Kitahama', 'Chuo-ku Tanimachi',
      'Chuo-ku Doshomachi', 'Nishi-ku Edobori', 'Nishi-ku Kitahorie', 'Fukushima-ku Noda', 'Fukushima-ku Fukushima',
      'Naniwa-ku Nipponbashi', 'Nishi-ku Kawaguchi', 'Kita-ku Nakatsu', 'Minato-ku Benten', 'Kita-ku Shibata'
    ],
    Nagoya: [
      'Naka-ku Sakae', 'Nakamura-ku Meieki', 'Naka-ku Osu', 'Naka-ku Nishiki', 'Naka-ku Marunouchi', 'Naka-ku Heiwa',
      'Naka-ku Aoi', 'Kita-ku Ozone', 'Naka-ku Masaki'
    ],
    Fukuoka: [
      'Chuo-ku Tenjin', 'Hakata-ku Hakataekimae', 'Chuo-ku Daimyo', 'Chuo-ku Yakuin', 'Chuo-ku Akasaka',
      'Chuo-ku Maizuru', 'Hakata-ku Chiyo', 'Chuo-ku Ropponmatsu', 'Chuo-ku Sakurazaka', 'Hakata-ku Nakasu',
      'Hakata-ku Gionmachi', 'Hakata-ku Sumiyoshi'
    ],
    Sapporo: [
      'Chuo-ku Kita-Sanjo-Nishi', 'Chuo-ku Odori-Nishi', 'Chuo-ku Minami-Yojo-Nishi', 'Toyohira-ku Hiragishi',
      'Toyohira-ku Nakanoshima', 'Toyohira-ku Asahimachi', 'Atsubetsu-ku Kaminopporo', 'Kiyota-ku Utsukushigaoka',
      'Shiroishi-ku Kawashimo'
    ],
    Naha: [
      'Kumoji', 'Makishi', 'Izumizaki', 'Tsuboya', 'Tomari', 'Asato', 'Tsubogawa', 'Matsuyama', 'Maejima', 'Akebono',
      'Furujima', 'Yorimiya'
    ],
    Sendai: ['Aoba-ku Ichibancho', 'Aoba-ku Kokubuncho'],
    Hiroshima: ['Naka-ku Hondori', 'Naka-ku Kamiyacho'],
  };
  STREETS_BY_LOCALE['ja-JP'] = Object.values(JA_AREAS).flat();
  const ZH_DISTRICTS = {
    Beijing: [
      'Chaoyang', 'Haidian', 'Dongcheng', 'Xicheng', 'Fengtai', 'Mentougou', 'Fangshan', 'Tongzhou', 'Changping'
    ], Shanghai: ['Xuhui', 'Pudong New Area', "Jing'an"],
    Guangzhou: ['Tianhe', 'Yuexiu'], Shenzhen: ['Futian', 'Nanshan'], Chengdu: ['Wuhou', 'Jinjiang'],
    "Xi'an": ['Yanta', 'Beilin'], Hangzhou: ['Xihu', 'Shangcheng'], Wuhan: ['Wuchang', 'Jianghan'],
    Chongqing: ['Yuzhong', 'Jiangbei'], Nanjing: ['Gulou', 'Xuanwu'], Kunming: ['Wuhua', 'Panlong'],
    Xiamen: ['Siming', 'Huli'], Qingdao: ['Shinan', 'Laoshan'], Harbin: ['Nangang', 'Daoli'],
  };
  const BR_BAIRROS = ['Centro', 'Jardim Paulista', 'Copacabana', 'Boa Viagem', 'Savassi', 'Moinhos de Vento', 'Batel',
    'Pinheiros', 'Vila Madalena', 'Asa Sul', 'Barra', 'Meireles', 'Botafogo', 'Lourdes'];
  const BUILDING_NAMES = ['Sakura Heights', 'Maison Aoyama', 'Green Court', 'Palace Tower', 'Harmony Residence',
    'Sunny Hills', 'Riverside Mansion', 'Park Side Villa', 'Wrenfield Hall', 'Bellmere Court', 'Mosslight Hall',
    'Cloverbank Hall', 'Rowanmere Heights', 'Kiyora House'];

  const LOCALE_COUNTRY = {
    'en-US': 'US', 'en-GB': 'GB', 'de-DE': 'DE', 'fr-FR': 'FR', 'es-ES': 'ES', 'pt-BR': 'BR', 'it-IT': 'IT',
    'nl-NL': 'NL', 'pl-PL': 'PL', 'ja-JP': 'JP', 'zh-CN': 'CN', 'en-CA': 'CA', 'en-AU': 'AU',
  };

  // Postcode patterns per country: '#' = digit, '@' = letter, anything else literal. A city's postcode
  // prefix (pc) overwrites the leading slots; without one the first digit is non-zero.
  const POSTCODES = {
    US: '#####', CA: '@#@ #@#', DE: '#####', FR: '#####', ES: '#####', IT: '#####', NL: '#### @@', PL: '##-###',
    JP: '###-####', CN: '######', BR: '#####-###', AU: '####', NZ: '####', IE: '@## @###', PT: '####-###',
    SE: '### ##', NO: '####', DK: '####', FI: '#####', CH: '####', AT: '####', BE: '####', CZ: '### ##',
    SK: '### ##', HU: '####', GR: '### ##', TR: '#####', IN: '######', KR: '#####', MX: '#####', RO: '######',
    IS: '###', EE: '#####', LV: 'LV-####', LT: 'LT-#####', BG: '####', RS: '#####', HR: '#####', SI: '####',
    BA: '#####', MK: '####', AL: '####', UA: '#####', RU: '######', SA: '#####', JO: '#####', IL: '#######',
    IR: '##########', EG: '#####', MA: '#####', TN: '####', DZ: '#####', NG: '######', SN: '#####',
    KE: '#####', ET: '####', TZ: '#####', ZA: '####', ZM: '#####', MZ: '####', MG: '###', MU: '#####',
    PK: '#####', BD: '####', LK: '#####', NP: '#####', MV: '#####', TW: '###', MN: '#####', KZ: '######',
    UZ: '######', KG: '######', MY: '#####', TH: '#####', VN: '######', KH: '#####', LA: '#####', MM: '#####',
    PH: '####', ID: '#####', BN: '@@####', PF: '#####', NC: '#####', CY: '####', GE: '####', AM: '####',
    AZ: 'AZ ####', AR: '@####@@@', CL: '#######', PE: '#####', CO: '######', EC: '######', UY: '#####',
    PY: '####', CU: '#####', DO: '#####', PR: '009##', GT: '#####', SV: '####', NI: '#####', CR: '#####',
    VE: '####', SG: '######', LU: 'L-####',
  };
  const PC_LETTERS = 'ABDEFGHJLNPQRSTUWXYZ';

  function postcode(rng, localeId, city) {
    const cc = (city && city.countryCode) || LOCALE_COUNTRY[localeId] || 'US';
    if (cc === 'GB') {
      const areas = ((city && city.pc) || 'SW,SE,N,E,W,NW').split(',');
      const area = rng.pick(areas);
      return `${area}${rng.int(1, area.length > 1 ? 20 : 30)} ${rng.int(0, 9)}${PC_LETTERS[rng.int(0, 19)]}${PC_LETTERS[rng.int(0, 19)]}`;
    }
    const pat = POSTCODES[cc];
    if (!pat) return '';
    const prefix = (city && city.pc) || '';
    let out = '';
    let slot = 0;
    for (const ch of pat) {
      if (ch !== '#' && ch !== '@') { out += ch; continue; }
      if (slot < prefix.length) out += prefix[slot];
      else if (ch === '@') out += PC_LETTERS[rng.int(0, 19)];
      else out += String(slot === 0 ? rng.int(1, 9) : rng.int(0, 9));
      slot++;
    }
    return out;
  }

  function streetNumber(rng) {
    return String(C.weighted(rng, [[rng.int(1, 30), 5], [rng.int(31, 250), 4], [rng.int(251, 9999), 2]]));
  }

  function address(rng, localeId = 'en-US', opts = {}) {
    const cs = { csplit: opts.csplit };
    const cc = LOCALE_COUNTRY[localeId];
    const pool = cc ? CITIES.filter((c) => c.countryCode === cc) : CITIES;
    const city = opts.city || C.pick(rng, pool.length ? pool : CITIES, cs);
    const country = countryByCode[city.countryCode];
    const pc = postcode(rng, localeId, city);
    const num = streetNumber(rng);
    const local = city.local || city.city;
    const unit = rng.bool(0.35);
    const out = { line1: '', city: city.city, postcode: pc, country: country.name, countryCode: city.countryCode };
    if (city.region) out.region = city.region;
    const st = (id) => C.pick(rng, STREETS_BY_LOCALE[id], cs);
    let text;
    switch (localeId) {
      case 'en-GB': {
        out.line1 = `${num} ${C.pick(rng, STREET_NAMES, cs)}`;
        if (unit) out.line2 = rng.pick([`Flat ${rng.int(1, 24)}`, `Flat ${rng.int(1, 9)}${rng.pick(['A', 'B', 'C'])}`, `Unit ${rng.int(1, 40)}`]);
        text = [out.line1, out.line2, city.city.toUpperCase(), pc, 'United Kingdom'];
        break;
      }
      case 'de-DE': {
        out.line1 = `${st('de-DE')} ${num}${rng.bool(0.1) ? 'a' : ''}`;
        if (unit) out.line2 = rng.pick([`${rng.int(1, 5)}. OG`, `Hinterhaus`, `c/o ${C.pick(rng, C.LAST_NAMES || ['Weber'], cs)}`]);
        out.city = local;
        text = [out.line1, out.line2, `${pc} ${local}`, country.local || country.name];
        break;
      }
      case 'fr-FR': {
        out.line1 = `${num}${rng.bool(0.1) ? ' bis' : ''} ${st('fr-FR')}`;
        if (unit) out.line2 = rng.pick([`Bât. ${rng.pick(['A', 'B', 'C'])}`, `Appartement ${rng.int(1, 60)}`, `${rng.int(1, 7)}e étage`]);
        text = [out.line1, out.line2, `${pc} ${city.city.toUpperCase()}`, 'France'];
        break;
      }
      case 'es-ES': {
        out.line1 = `${st('es-ES')}, ${num}${unit ? `, ${rng.int(1, 9)}.º ${rng.pick([
          'A', 'B', 'C', 'D', 'izda.', 'dcha.', 'E', 'F', 'G', 'H'
        ])}` : ''}`;
        out.city = local;
        text = [out.line1, `${pc} ${local}${city.region && city.region !== local ? ` (${city.region})` : ''}`, 'España'];
        break;
      }
      case 'pt-BR': {
        out.line1 = `${st('pt-BR')}, ${num}${unit ? ` - Apto ${rng.int(1, 30)}${rng.int(1, 8)}` : ''}`;
        out.line2 = rng.pick(BR_BAIRROS);
        text = [out.line1, out.line2, `${city.city} - ${city.region}`, `CEP ${pc}`, 'Brasil'];
        break;
      }
      case 'it-IT': {
        out.line1 = `${st('it-IT')}, ${num}`;
        if (unit) out.line2 = rng.pick([`Scala ${rng.pick(['A', 'B', 'C'])}, interno ${rng.int(1, 20)}`, `Piano ${rng.int(1, 6)}`]);
        out.city = local;
        text = [out.line1, out.line2, `${pc} ${local} ${city.region || ''}`.trim(), 'Italia'];
        break;
      }
      case 'nl-NL': {
        out.line1 = `${st('nl-NL')} ${num}${unit ? rng.pick([
          '-A', '-1', '-2', ' bis', ' III', '-B', '-C', '-D', '-E', '-F'
        ]) : ''}`;
        text = [out.line1, `${pc} ${city.city}`, 'Nederland'];
        break;
      }
      case 'pl-PL': {
        out.line1 = `${st('pl-PL')} ${num}${unit ? `/${rng.int(1, 120)}` : ''}`;
        out.city = local;
        text = [out.line1, `${pc} ${local}`, 'Polska'];
        break;
      }
      case 'ja-JP': {
        const block = `${rng.int(1, 6)}-${rng.int(1, 30)}-${rng.int(1, 20)}`;
        out.line1 = `${rng.pick(JA_AREAS[city.city] || STREETS_BY_LOCALE['ja-JP'])} ${block}`;
        if (unit) out.line2 = `${rng.pick(BUILDING_NAMES)} ${rng.int(1, 12)}0${rng.int(1, 9)}`;
        const pref = !city.region || city.region === city.city ? city.city : `${city.region}, ${city.city}`;
        text = [`〒${pc}`, `${pref}, ${out.line1}`, out.line2, 'Japan'];
        break;
      }
      case 'zh-CN': {
        const dist = rng.pick(ZH_DISTRICTS[city.city] || ['Central']);
        out.line1 = `No. ${rng.int(1, 999)} ${st('zh-CN')}, ${dist}${/Area$/.test(dist) ? '' : ' District'}`;
        if (unit) out.line2 = `Building ${rng.int(1, 20)}, Room ${rng.int(1, 30)}0${rng.int(1, 9)}`;
        text = [out.line2, out.line1, `${city.city}${city.region && city.region !== city.city ? `, ${city.region}` : ''} ${pc}`, 'China'];
        break;
      }
      default: {
        out.line1 = `${num} ${C.pick(rng, STREET_NAMES, cs)}`;
        if (unit) out.line2 = rng.pick([`Apt ${rng.int(1, 30)}${rng.pick(['', 'A', 'B', 'C'])}`, `Suite ${rng.int(100, 950)}`, `Unit ${rng.int(1, 40)}`, `#${rng.int(100, 2400)}`]);
        if (city.countryCode === 'US') {
          text = [out.line1, out.line2, `${city.city}, ${city.region} ${pc}`, rng.bool(0.5) ? 'United States' : ''];
        } else {
          text = [out.line1, out.line2, `${city.city}${city.region ? `, ${city.region}` : ''}${pc ? ` ${pc}` : ''}`, country.name];
        }
      }
    }
    out.text = text.filter(Boolean).join('\n');
    return out;
  }

  const VENUES = L(`
    Riverside Amphitheater
    The Lantern Room
    Hall B, Northgate Expo Center
    Grand Harbour Ballroom
    Old Customs House
    Copperline Arena
    Bluebell Community Hall
    The Granary Theatre
    Meridian Conference Center, Room 4
    Willow Park Bandstand
    The Velvet Lounge
    St. Aldric's Church Hall
    Pier 7 Warehouse
    Summit Ridge Lodge
    City Library Auditorium
    The Foundry Workspace
    Kingsway Cinema, Screen 3
    Larkspur Gardens Pavilion
    The Signal Box Bar
    Eastside Sports Complex
    Northfield Stadium
    The Atrium at Fairview Mall
    Moonrise Rooftop Terrace
    Glasshouse Botanical Center
    Mill Street Studios
    The Cellar Jazz Club
    Brookhaven Golf Club
    Seaview Pavilion
    Harrow Lane Gallery
    Ironworks Climbing Gym
    University Hall, Lecture Theatre 2
    Thornbury Manor
    The Book Nook Cafe
    Central Park Ice Rink
    Westbank Farmers Market
    Hillcrest Community Center
    The Courtyard at Old Town
    Granite Peak Ski Lodge
    Saltmarsh Nature Reserve Visitor Center
    The Corner Stage
    Pinecrest Recreation Ground
    Harbour Lights Hotel, Ballroom A
    Riverbend Convention Center
    The Little Theatre
    Ember Hall
    Juniper Room, 2nd Floor
    The Boathouse
    Southside Velodrome
    Lakeside Picnic Area 3
    Starlight Drive-In
    Fernhill School Gymnasium
    The Observatory Dome
    Marigold Banquet Hall
    Tidewater Aquarium Auditorium
    The Old Mill Taproom
    Crescent Moon Yoga Studio
    Orchard Barn
    Gallery 21
    Coliseum Annex
    The Wharf Stage
    Maplewood Bowling Lanes
    Quayside Market Hall
    The Attic Comedy Club
    Cobblestone Square
    Unity Park Main Lawn
    Bramble Hill Vineyard
    Northern Lights Planetarium
    The Studio at Pier 12
    Kestrel Room, Level 5
    Waterfront Promenade Stage
    Heritage Railway Museum
    Ashgrove Tennis Center
    The Canopy Treetop Walk
    Basement Records Listening Room
    Fieldhouse Arena
    The Annex, Building C
    Sunnyvale Dance Hall
    Lighthouse Point Lookout
    The Blue Door Bistro (private room)
    Elmstead Village Green
    Cedarbrook Arts Center
    Room 12, Alderfield Civic Hall
    West Quay Sailing Club
    Briarstone Estate
    Ashford Hill Community Pool
    Morrow Street Music Hall
    The Glass Finch Restaurant
    Redstone County Fairgrounds
    Belmont House, East Wing
    Holloway Marsh Bird Hide
    Ridgeview Conference Suite
    The Gilded Acorn Pub
    Meadowgate Craft Market
    Oriole Creek Nature Center
    Crownfield Concert Pavilion
    The Stables at Wrenwood
    Beacon Hill Ferry Terminal
    Northbank Rowing Club
    Linden Court Function Rooms
    The Hearthside Supper Club
    Cypress Grove Sculpture Park
    Silverstrand Sailing Marina
    Hawthorn Ridge Campground
    Cobalt Room at the Meridian Hotel
    Mossbank Heritage Center
    Foxglove Estate Orangery
    The Rookery Art Space
    Juniper Vale Riding School
    Marshlight Outdoor Cinema
    Eastmere Civic Theater
    The Long Table Workshop
    Bracken Hollow Farmstead
    Rosewater Spa Pavilion
    Cairn House Recording Studio
    Little Fern Children's Museum
    Northpoint Ferry Shed
    The Walled Garden Conservatory
    Orchard Lane Pottery Studio
    Kingswell Town Hall, Upper Chamber
    Saffron Gate Tasting Room
    Frost Hollow Curling Rink
    The Red Kite Coffeehouse
    Westmoor Equestrian Grounds
    Pinehaven Youth Center
    Dunlin Bay Kayak Launch
    The Mariner's Exchange
    Elmbridge Exhibition Hall
    Blue Heron Fishing Pier
    The Kiln Room, Foundry Quarter
    Fairwater Sailing Pavilion
    Old Quarry Amphitheatre
    Dovecote House Gardens
    The Hearthstone Cooking School
    Willowmere Retreat Center
    Cricket Lawn, Ashdown Grounds
    Sable Creek Nature Lodge
    The Garden Gate Supper Room
    Wrenfield Observatory Annex
    Belltower Rehearsal Rooms
    Maple Cross Community Pool
    The Tannery Arts Workshop
    Shoreline Ferry House
    High Meadow Event Barn
    Alder House, West Gallery
    Cattail Creek Visitor Hut
    Hearthwood Folk Hall
    Pebblebrook Miniature Railway
    The Lanternfish Aquarium Gallery
    Rosebank Literary Salon
    Northmoor Archery Club
    The Old Orchard Cider House
    Silverleaf Wellness Pavilion
    Tern Point Bird Sanctuary
    Glenhaven Glassworks Gallery
    Foxrun Orchard Pavilion
    Harbourview Regatta Club
    Mason's Yard Workshop
    Cindercone Mountain Hut
    Bellwether County Museum
    The Crooked Oar Tavern
    Arbor House, Garden Room
    Southbank Glass Pavilion
    Juniper Street Food Hall
    Crownstone Racquet Club
    The Hollow Tree Storyhouse
    Windward Point Lighthouse Museum
    Greystone Lodge, Cedar Suite
    Founder's Field Cricket Ground
    The Marquee at Linton Park
    Little Comet Puppet Theater
    Alderbrook Community Boathouse
    Old Ferry Road Dance Studio
    Merrivale Railway Depot
    Poppyfield Flower Farm
    Stone Arch Cinema, Screen 2
    The Eiderdown Guesthouse
    Westmere Sailing Academy
    Clover Hill Sculpture Garden
    The Inkstone Print Studio
    Northgate Aquatics Pavilion
    Bluebird Hill Music School
    Orchard House, Long Gallery
    Tanglewood Forest Camp
    The Brass Finch Cocktail Bar
    Riversong Canoe Landing
    Redfern Makers Hall
    Cairnside Mountain Shelter
    The Marigold Room at Ashbury House
    Docklands Maritime Archive
    Fernbank Community Orchard
    Highwater Rowing Boathouse
    Clearwater Lakeside Deck
    Moorland Sheepdog Trials Field
    The Nightjar Listening Parlour
    Stonecrop Farm Kitchen
    Eastgate Puppet Workshop
    The Velvet Rope Cabaret Room
    Barleycross Malt House
    Summerhouse at Briar Glen
    Longview Model Railway Club
    The Driftwood Pottery Yard
    Wycliffe Memorial Reading Room
    Crescent Bay Lifeboat Station
    The Fox and Thistle Inn
    Birch Hollow Archery Range
    Aster Lane Photo Studio
    Sandpiper Marsh Boardwalk
    Marlowe House, Music Room
    Redcliff Coastal Discovery Centre
    The Acorn Tree Nursery School
    Highland View Stargazing Field
    Havenbrook Lakeside Pavilion
    The Greenhouse at Larchmont
    Miller's Crossing Antique Market
    Willowbank Kayak Club
    Ravenstone Chamber Music Room
    The Orchard Press Bookshop
    Gull Rock Clifftop Shelter
    Ashfield County Show Ring
    The Beeches Outdoor Classroom
    Clocktower Rooms, Market Square
    The Blue Thimble Sewing School
    Pine Hollow Disc Golf Course
    Marsh End Boathouse Gallery
    Cranberry Point Picnic Shelter
    Hawkridge Paragliding Launch
    Lindenbrook Harvest Barn
    Ashcombe Manor, South Gallery
    The Paper Lantern Theater
    Platform 4, Greywick Station
    Foxglove Hill Community Garden
    The Copper Kettle Supper Room
    Northshore Arts Pavilion
    Hawthorn Vale Scout Hut
    The Old Sawmill Dance Hall
    Brindlewood Country Club
    Cairnfield Heritage Orchard
    Bluewater Marina Workshop
    The Willow Crown Tea Room
    Lantern Hill Outdoor Stage
    Moorfield Memorial Hall
    The Glasshouse at Alderwick
    Peregrine Point Climbing Wall
    Market Street Lecture Rooms
    The Rowan Tree Storytelling Loft
    Blackstone Quarry Visitor Centre
    Willow Creek Canoe Club
    The Orchard Room, Bellamy House
    Harborstone Ice Pavilion
    Larkspur Farm Cider Barn
    Eastmere Rowing Pavilion
    The Quiet Current Spa Garden
    Redwood Vale Scout Camp
    The North Gallery at Wren House
    Sundial Hill Maze
    Bramblewick Folk School
    The Saltbox Supper Club
    Hollis Meadow Fairground
    Kingsford Pottery Kiln
    Riverside Glass Studio
    The Skylark Puppet Stage
    Alderfen Nature Classroom
    Westgate Heritage Depot
    Mosswood Community Kitchen
    The Ebb Tide Reading Room
    Cloverfield Harvest Pavilion
    Cranefield Model Boat Club
    The Lantern Court Ballroom
    Stoneleigh Bee Garden
    Marshview Sailing Shed
    The Old Bell Foundry Gallery
    Juniper Ridge Picnic Lodge
    Tallowbrook Story Garden
    Seabrook Craft Exchange
    Hearthstone Rehearsal Loft
    The Foxglove Cinema, Screen 1
    Glenmoor Field Archery Range
    Moonstone Astronomy Hut
    The Wren and Willow Inn
    Lowbridge Market Pavilion
    Ashdown Glasshouse Studio
    Copperfield Dance Conservatory
    North Quay Maritime Hall
    Dale End Railway Museum
    Seafield Community Boathouse
    Briar Lane Flower Conservatory
    The Moss Lantern Listening Room
    Cedar Vale Riding Arena
    Whistlewood Forest Classroom
    The Saffron Room, Millbrook Hall
    Greyhaven Coastal Museum
    The Orchard Gate Cookery Room
    Foxbridge Garden Theater
    Longmere Lakeside Pavilion
    The Old Ropewalk Workshop
    Pheasant Run Equestrian Centre
    Starling House, West Parlour
    Winding Brook Nature Hide
    The Pebble and Pine Cafe
    Hawthorn Cross Village Hall
    Northfield Kite Meadow
    The Silver Thistle Tasting Cellar
    The Windmill at Cedar Downs
    Cairnwell Glass Pavilion
    Rookwood Estate, Glass Pavilion
    The Lantern Vale Music Room
    Southmere Community Boathouse
    Copperleaf Foundry Gallery
    Highfield Winter Garden
    The Wicker Basket Market Hall
    Mallow Creek Nature Lodge
    Bellstone Chapel Courtyard
    Tideglass Maritime Gallery
    The Orchard Bell Cider Barn
    Westhaven Storytelling Hall
    Marshgate Rowing Pavilion
    Blue Ash Pottery Workshop
    The Crown and Cattail Inn
    Windrush Hill Lookout
    Larkspur House, North Salon
    Stonewater Outdoor Theatre
    The Little Acorn Playhouse
    Ridgeway Railway Carriage Museum
    Midsummer Garden Ballroom
    Dunestone Quarry Arts Yard
    The Bramble Cup Tea Parlour
    Northwind Ski Touring Hut
    Harbour Gate Lifeboat Museum
    Silver Birch Forest School
    The Clockwork Model Gallery
    Pinecone Hill Farm Shop
    Redwing County Cricket Pavilion
    Old Lantern Paper Mill
    Clearbrook Glasshouse Gardens
    The Nuthatch Birding Centre
    Meadowlark Harvest Kitchen
    Eastbank Climbing Pavilion
    Cinder Hill Sculpture Foundry
    The Blue Willow Music Parlour
    Westfield Community Greenhouse
    Ternstone Island Visitor Cabin
    The Rowan House, Library Room
    Cobbler's Lane Craft Studios
    Moonlit Bay Sailing School
    Fox Hollow Cider Press
    The Ashen Oak Banquet Room
    Longwater Fishing Lodge
    Maple Quay Arts Warehouse
    Harebell Hill Picnic Meadow
    The Copper Kestrel Taproom
    Bramble Ford Nature Observatory
    Wellspring Dance Pavilion
    Northmere Heritage Boatyard
    The Plover's Nest Cafe
    Gorsefield Folk Festival Ground
    Cedar Lantern Bathhouse
    Moorstone Garden Maze
    The White Finch Reading Parlour
    Amberley Hill Riding School
    Saltwind Coastal Lookout
    Hearth and Hazel Cookhouse
    Swanbrook Floating Pavilion
    The Old Telegraph Exchange
    Willow Reach Canoe Landing
    Brackenmere Sculpture Meadow
    Greenbank Orchard Classroom
    The Juniper Bell Guest Hall
    Crown and Compass Regatta House
    Little Hollow Puppet Workshop
    Mossy Stone Mountain Shelter
    The Blue Lantern Film Room
    Aldercombe Flower Market
    Riverglass Banquet Pavilion
    The Fable Tree Book Room
    Hawthorn Mill Textile Studio
    Seafern Marine Discovery Hut
    Westbrook Archery Pavilion
    The Mariner's Lantern Restaurant
    Foxden Estate, Walled Court
    Pebble Hill Community Theatre
    Sunrise Ridge Stargazing Lawn
    The Old Threshing Floor
    Cloverbank Nature Hide
    Harper's Reach Sailing Shed
  `);

  const STATIONS = L(`
    Central Station
    Harbourfront
    Union Square
    Airport Terminal 2
    Kingsbridge
    Northgate
    Riverside Park
    Old Town
    University
    Museum District
    Market Street
    City Hall
    Westfield Junction
    Eastbrook
    Southport
    Hillcrest
    Lakeview
    Maple Grove
    Cathedral
    Stadium
    Convention Center
    Chinatown
    Fairview
    Pinecrest
    Ashford Road
    Elm Park
    Victoria Square
    Parliament
    Docklands
    Cannery Row
    Airport Terminal 1
    Ferry Terminal
    Bus Interchange
    Hospital
    Tech Park
    Business District
    Greenway
    Mill Pond
    Crossroads
    Liberty Plaza
    Seaside
    Bayshore
    Canal Street
    Foundry Lane
    Westgate
    Northern Heights
    Southbank
    Garden City
    Spring Valley
    Oakwood
    Willow Creek
    Highland Park
    Prospect Hill
    Brookfield
    Redwood
    Silver Lake
    Copper Hill
    Grand Avenue
    Exhibition Grounds
    Arts Quarter
    Library
    Zoo
    Beach Road
    Racecourse
    King's Cross Road
    Queen's Gate
    Mountview
    Clearwater
    Thornton
    Bellfield
    Marina
    Castle Hill
    Observatory
    Botanical Gardens
    Old Harbour
    New Harbour
    Freight Yard
    Ridgeway
    Meadowbank
    Iron Bridge
    Cedarfield
    North Quay
    Crescent Bay
    Wellington Street
    Granite Falls
    Rosewood Estate
    Civic Auditorium
    The Old Foundry
    Juniper Square
    Meadowlands
    Westhaven
    Pioneer Memorial
    Hawthorne Lane
    Summit Point
    Brookside
    Crown Heights
    Seaview Gardens
    Stonebridge
    Millfield
    Crescent Park
    Redcliff
    Birchwood
    Kingswell
    Harbour Exchange
    Orchard Road
    Westmere
    Glenwood
    Waverley
    The Glasshouse
    Longbridge
    Dunmore
    Briar Hill
    Harbour Island
    South Ridge
    Cypress Creek
    Rosehill
    Cedar Avenue
    Holloway Market
    Northbrook
    Sunnyside
    Bayview Pier
    Grange Road
    Ashfield
    Old Quarry
    Westlake
    Fairhaven
    Windermere
    St James's Square
    Linden Court
    Riverside Exchange
    Broadwater
    Moorland
    Pavilion Gardens
    East Quay
    Kingswood
    Southgate Circus
    The Crescent
    Woodside
    Seaforth
    Highbury Fields
    Newbridge
    Kingsmead
    Elmhurst
    Glenferry
    Beacon Hill
    Waterloo Road
    The Conservatory
    Birch Lane
    Northpoint
    Larkspur
    Kingsway
    Rosebank
    Fernhill
    Westbrook
    Marlowe Street
    Cobalt Works
    The Lantern Room
    Mallowbrook
    Eastfield Common
    Ashbury Cross
    Harbour View Road
    Rosewater Quay
    Old Mill Crossing
    Northmere
    Foxden Crossing
    Tidewater Point
    Station Road
    West Orchard
    Crown Market
    Limestone Square
    Silverwood
    Brambleton
    Eastgate Terrace
    Riverbend
    Stonemill
    Beacon Wharf
    Heatherdown
    The Clocktower
    Southmoor
    Cedarbrook
    Pinehaven
    Windsor Green
    Marshfield
    Briarwood Common
    Hawthorn Bridge
    Foxglove Lane
    The Boathouse
    Lakeside Pavilion
    Greystone Common
    Eastbridge
    Meadowgate
    Saffron Hill
    Highland Quay
    The Paper Mill
    Alderwood
    Parkside Crescent
    Gull Point
    Dunfield Pavilion
    Birchfield
    Brookhaven
    Kingsmere Gardens
    Old Chapel Yard
    Granary Square
    Wrenford
    Mossbank
    Tallow Works
    Tern Harbour
    Ashcombe
    Fairmeadow
    Millstone Road
    Alderfen Gardens
    Eastmere
    Hollowtree
    Southbridge Market
    Willowbank
    The Winter Garden
    Northcliff
    Bellflower Green
    Bracken Hill
    Dovecote Lane
    Saltmarsh Point
    Greyfriar Green
    Stoneleigh
    Orchard Gate
    Riversmeet
    Longmeadow
    Northshore Walk
    The Foundry Hall
    Marlowe Gardens
    Copperfield
    Seabrook
    Highgate Terrace
    Elmbridge
    Eastward Green
    Ashenford
    Grayhaven Station
    Marigold Row
    Northstar Terminal
    Old Glassworks
    Peregrine Square
    Willowmere
    Cinderbrook Depot
    The Mariner's Hall
    Redfern Avenue
    Foxbridge
    Cairnwood
    Ternfield Pier
    Midsummer Lane
    Lantern Hill
    Hearthside Commons
    Quarry End
    Seaglass Point
    Brindleford
    Market Cross
    Stonewell
    Bramble Lane
    Gorsefield Station
    Oriole Gardens
    Hatherley Vale
    Millbrook Crossing
    Crownwell
    Winding Gardens
    Sable Street
    Moorfield Station
    Rosewater Lane
    Dunleigh
    Silvermere
    Tideway Market
    Westward Point
    Birch Hollow
    Larkfield
    Pinebarrow
    Southfield Green
    Rookery Lane
    Calder Square
    Alderwick
    Westerly Park
    Brackenford
    Fountain Court
    Coppergate
    Bluebell Common
    Longwater
    Marlowe Wharf
    Meadowcross
    Highland Gate
    Sedgewick
    The Glass Pavilion
    Wharfside Landing
    Rillstone Lane
    Glenhaven
    Old Stone Yard
    Windward Market
    Bellwether
    The Assembly Rooms
    Foxcombe
    Greenbank Station
    Treetop Gardens
    Cinder Lane
    Thistlewood
    Ferncross
    Coppice End
    Cranewell
    Plover's Rest
    Fallowmere
    Larchwood
    Tarnside
    Redstone Quay
    Ravenscar Halt
    Merefield
    Winterbourne Walk
    Marshgate
    Pheasant Green
    Aldercombe
    Foxhollow
    Bramblewick
    Southmere
    Linden Vale
    Cairnside
    Harebell Square
    Northmill
    Rookhaven
    Gannet Point
    Hushcombe
    Broomfield Rise
    Moorhen Lane
    Frostmere
    Hawkridge
    Thorncombe
    Cresswell Pier
    Hollyhock End
    Bellwater
    Ridgefield Halt
    Culver Street
    Lowmarsh
    Pennyroyal Gardens
    Westmarsh
    Marlfen
    Osprey Quay
    Dalesford
    Limekiln Row
    High Wold
    Broadfen
    Wren's Crossing
    Brindle Heath
    Oatfield
    Moor's End
    Avenlow Green
    Crownley
    Havenbrook
    Sparrowgate
    Hearthfield
    Tidemill
    Gorsebank
    Woollen Mill
    Cragwell
    Windrush Green
    Ferncombe
    Elderstone
    Avenmere
    Old Sluice
    Market Weir
    Honeysuckle Row
    Dunwater
    Cliffsend
    Rathbone Yard
    Sedgefield Moor
    The Reading Room
    The Lantern Court
    The Mosaic Hall
    The Signal House
    The Scriptorium
    The Walled Garden
    The Loom Gallery
    The Coach House
    The Ferry Steps
    The Old Maltings
    The Water Tower
    The Tannery
    The Kiln Yard
  `);

  const AIRLINES = C.rows(`
    Northwind Air | NV
    Bluepeak Airways | BQ
    Kingfisher Air | KF
    Seabright Air | SB
    Meridian Airlines | MD
    Polar Express Air | PX
    Harbor Jet | HJ
    Silverline Air | SV
    Sunfield Airways | SF
    Mistral Aviation | MT
    Redtail Air | RT
    Zephyr Wings | ZW
    Atlas Skyways | AS
    Cobalt Air | CB
    Lodestar Airlines | LD
    Coral Coast Air | CC
    Pinewood Air | PW
    Aurora Atlantic | AA
    Peregrine Air | PG
    Saffron Airways | SN
    Jade Pacific | JP
    Andes Air | AD
    Savanna Air | SA
    Steppe Wind Airlines | SW
    Fjord Air | FJ
    Lagoon Air | LG
    Sahara Sky | SH
    Monsoon Airways | MS
    Tasman Link | TL
    Cascadia Air | CD
    Cloudmere Air | CM
    Goldfinch Airways | GF
    Windward Jet | WJ
    Willowbrook Air | WB
    Nightjar Airlines | NJ
    Opal Route Air | OR
    Rainshadow Air | RS
    Farpoint Airways | FP
    Whitecap Air | WC
    Larkspur Jet | LJ
    Suncrest Airlines | SC
    Driftwood Airways | DW
    Kestrel Coast Air | KC
    Bracken Air | BA
    Starling Skyways | SS
    Redcliff Aviation | RA
    Tidepool Air | TP
    Wildmere Airways | WM
    Marigold Air | MG
    Glasswing Airways | GW
    Cindercone Air | CI
    Evergreen Skies | EG
    Wayfarer Air | WY
    Lumen Airways | LU
    Orchard Jet | OJ
    Duneland Airways | DU
    Islet Air | IA
    Granite Pass Air | GP
    Mosaic Airlines | MO
    Koru Airways | KR
    Rookery Air | RK
    Canyon Gate Air | CG
    Riverspan Airways | RV
    Meadowlark Air | ML
    Southridge Jet | SJ
    Cloudharbor Air | CH
    Sunspoke Airlines | SX
    Brighthollow Air | BX
    Windmere Jet | WE
    Crestfall Airways | CF
    Blueglen Air | BG
    Northstar Passage | NP
    Redstone Air | RE
    Ashgrove Jet | AG
    Plover Skyways | PS
    Moonwake Airlines | MW
    Seaforth Airways | SI
    Golden Vale Air | GV
    Foxglove Airways | FX
    Snowfield Jet | SQ
    Sundial Airlines | SD
    Rainvale Air | RX
    Juniper Vale Air | JV
    Cloudreef Jet | CV
    Rainier Coast Air | RC
    Lakeshore Passage | LP
    Windfall Airways | WF
    Blackstone Jet | BT
    Sunriver Air | UV
    Palisade Airways | PA
    Cinderpath Air | CP
    Horizon Vale Jet | HV
    Wildrose Airlines | WR
    Frostline Air | FL
    Sequoia Skies | QA
    Moorland Jet | MJ
    Sable Ridge Air | ZR
  `).map(([name, code]) => ({ name, code }));

  const flightNumber = (rng) => `${rng.pick(AIRLINES).code} ${rng.bool(0.4) ? rng.int(100, 999) : rng.int(1000, 9999)}`;

  Object.assign(C, {
    COUNTRIES,
    CITIES,
    STREET_NAMES,
    STREETS_BY_LOCALE,
    address,
    postcode,
    VENUES,
    STATIONS,
    AIRLINES,
    flightNumber,
    countryByCode: (code) => countryByCode[code],
  });
})();
