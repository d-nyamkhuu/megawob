env.widget({
  task: 'use-travel',
  site: 'design-use-travel-hotels-03',
  name: 'design',
  split: 'train',
  scenarios: ['hotels'],
  template: 'use-travel/portal',
  design: {
    brand: 'TravelNow',
    appLabel: 'TravelNow hotel search',
    titles: {hotels: 'Find Your Stay'},
    inset: '8px', radius: '4px', fontSize: '14px', fontFamily: 'Arial, sans-serif',
    workspaceWidth: 4000, compactWidth: 780, railWidth: '294px', summaryRailWidth: '380px',
    accent: '#a7e735', panel: '#fffefa', foreground: '#111820', muted: '#59616a', line: '#d9d8d3',
    positive: '#4a9c11', starColor: '#f2a900',
    parts: {
      frame(base) {
        return function(ctx) {
          base(ctx);
          const app = document.querySelector('.at-app');
          const route = app && app.querySelector('.at-route');
          if (!app || !route) return;
          const old = route.querySelector('.at-tripbrief');
          const destination = old?.children[0]?.querySelector('strong')?.textContent || 'Your destination';
          const travelers = old?.children[1]?.querySelector('strong')?.textContent || '2 adults';
          const rooms = old?.children[2]?.querySelector('strong')?.textContent || '1 room';
          route.replaceChildren();
          const heading=document.createElement('div'); heading.className='tn-search-heading';
          const h=document.createElement('strong'); h.textContent='Find Your Stay'; heading.append(h);
          const sub=document.createElement('span'); sub.textContent='Hotels, homes and more around the world'; heading.append(sub);
          route.append(heading);
          const fields=document.createElement('div'); fields.className='tn-search-fields'; route.append(fields);
          const field=(label,value,cls='')=>{const box=document.createElement('div');box.className=`tn-search-field ${cls}`.trim();const small=document.createElement('small');small.textContent=label;const val=document.createElement('span');val.textContent=value;box.append(small,val);fields.append(box);};
          field('Destination',destination,'tn-destination');
          field('Check-in','Select date');
          field('Check-out','Select date');
          field('Guests',`${travelers}, ${rooms}`);
          const search=document.createElement('div');search.className='tn-search-button';search.textContent='Search';fields.append(search);
          const guide=document.createElement('aside');guide.className='tn-guide';
          const hero=document.createElement('div');hero.className='tn-guide-hero';
          const city=document.createElement('strong');city.textContent=destination.split(',')[0];
          const desc=document.createElement('span');desc.textContent='A vibrant city of modern skylines, culture and cuisine.';hero.append(city,desc);guide.append(hero);
          if(!/kuala lumpur/i.test(destination)) {
            hero.style.backgroundImage="linear-gradient(0deg,#10191dcc,transparent 55%),url('sites/design-use-travel-hotels-03/assets/hotel-contact-sheet.webp')";
            hero.style.backgroundSize='cover,200% 200%'; hero.style.backgroundPosition='center,100% 100%';
          }
          const why=document.createElement('section');why.className='tn-guide-why';
          const wh=document.createElement('h3');wh.textContent='Why book with TravelNow?';why.append(wh);
          for(const text of ['Wide selection of trusted hotels','Competitive prices','Real guest reviews','Flexible booking options']){const p=document.createElement('p');p.textContent=text;why.append(p);}guide.append(why);
          const tips=document.createElement('section');tips.className='tn-guide-tips';
          const th=document.createElement('h3');th.textContent=`${destination.split(',')[0]} travel tips`;tips.append(th);
          for(const [icon,title,text] of [['▦','Explore top areas','Discover neighbourhoods, landmarks and local transport near your stay.'],['♜','Local cuisine','Try regional specialties and explore the city’s dining scene.'],['▤','Getting around','Find convenient public transport and taxi options around the city.'],['▣','Top attractions','Explore popular sights, historic areas and cultural landmarks.']]){const row=document.createElement('div');row.className='tn-tip';const mark=document.createElement('b');mark.textContent=icon;const copy=document.createElement('div');const name=document.createElement('strong');name.textContent=title;const body=document.createElement('span');body.textContent=text;copy.append(name,body);row.append(mark,copy);tips.append(row);}guide.append(tips);
          document.querySelector('.ref-body')?.append(guide);
        };
      },
      hotelArt(base) {
        return function(parent,id,save) {
          const art=base(parent,id,save);
          const svg=art.querySelector('svg'); if(svg)svg.remove();
          let hash=0;for(const c of String(id))hash=(hash*31+c.charCodeAt(0))>>>0;
          art.classList.add('tn-hotel-photo');
          art.style.backgroundImage="url('sites/design-use-travel-hotels-03/assets/hotel-contact-sheet.webp')";
          art.style.backgroundSize='200% 200%';
          art.style.backgroundPosition=[['0%','0%'],['100%','0%'],['0%','100%'],['100%','100%']][hash%4].join(' ');
          return art;
        };
      },
    },
  },
});
