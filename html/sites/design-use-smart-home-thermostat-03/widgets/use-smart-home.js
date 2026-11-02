// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-thermostat-03',
  name: 'design',
  split: 'train',
  scenarios: ['thermostat'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0, minWidth: 100, minHeight: 100,
    temperatureDiameter: 280, readoutSize: 68,
    fontFamily: '"DejaVu Sans", "Lucida Sans Unicode", sans-serif',
    parts: {
      top: (base, S) => R => R.e('h2', 'ol-temperature-title', R.app, R.s.room + ' – Temperature Control'),
      navigation: () => () => {},
      sidebar: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      shell: (base, S) => R => R.e('div', 'ol-temperature-shell', R.app),
      body: (base, S) => (R, shell) => ({
        main: R.e('div', 'ol-temperature-main', shell),
        aside: R.e('div', 'ol-temperature-aside', shell),
      }),
      roomContext: () => () => {},
      rotary: (base, S) => (R, control, hue) => {
        base(R, control, hue);
        const fit = R.fitRing;
        R.fitRing = () => {
          const area=R.main.querySelector('.ah-ring-area');
          const diameter=Math.max(100,Math.min(S.D.temperatureDiameter,R.main.clientWidth/1.4,(R.main.clientHeight-48)/1.4));
          area.style.width=(diameter+22)+'px';
          area.style.height=(diameter*1.4)+'px';
          area.style.flex='none';
          fit();
          R.main.querySelector('.ah-digits').style.fontSize=Math.min(68,diameter*.25)+'px';
        };
      },
      ring: (base, S) => (R, area, hue, diameter) => {
        const parts = base(R, area, hue, diameter);
        const { ring, readout, detail } = parts;
        ring.querySelector('.ah-ring-inner > .ah-muted').remove();
        const svg = R.util.svg('svg', {viewBox:'0 0 360 360', class:'ol-dial-face', 'aria-hidden':'true'}, ring);
        const defs=R.util.svg('defs',{},svg);
        const gradient=R.util.svg('linearGradient',{id:'ol-metal',x1:0,y1:0,x2:0,y2:1},defs);
        R.util.svg('stop',{offset:0,'stop-color':'#e1e3e5'},gradient);
        R.util.svg('stop',{offset:1,'stop-color':'#b8bdc1'},gradient);
        const cold=R.util.svg('linearGradient',{id:'ol-cold',x1:0,y1:1,x2:0,y2:0},defs);
        R.util.svg('stop',{offset:0,'stop-color':'#4c79c8'},cold);
        R.util.svg('stop',{offset:.55,'stop-color':'#5b83c8'},cold);
        R.util.svg('stop',{offset:1,'stop-color':'#999c9e'},cold);
        const warm=R.util.svg('linearGradient',{id:'ol-warm',x1:0,y1:0,x2:0,y2:1},defs);
        R.util.svg('stop',{offset:0,'stop-color':'#b99092'},warm);
        R.util.svg('stop',{offset:.6,'stop-color':'#ac5656'},warm);
        R.util.svg('stop',{offset:1,'stop-color':'#9d393b'},warm);
        R.util.svg('circle', {cx:180,cy:180,r:178,fill:'url(#ol-metal)',stroke:'#292f33','stroke-width':1.5}, svg);
        R.util.svg('circle', {cx:180,cy:180,r:176,fill:'none',stroke:'#f2f3f4','stroke-width':1.5}, svg);
        R.util.svg('path', {d:'M 89 271 A 129 129 0 0 1 180 51',fill:'none',stroke:'url(#ol-cold)','stroke-width':19}, svg);
        R.util.svg('path', {d:'M 180 51 A 129 129 0 0 1 271 271',fill:'none',stroke:'url(#ol-warm)','stroke-width':19}, svg);
        for (let i=0;i<=32;i++) {
          const a=(225+i*8.4375)*Math.PI/180, major=i%8===0;
          const p=r=>[180+Math.sin(a)*r,180-Math.cos(a)*r];
          const p1=p(i===0||i===32?117:major?145:160),p2=p(major?178:174);
          R.util.svg('line',{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:'#292f33','stroke-width':major?1.8:1.1},svg);
          if(major) {
            const xy=p(194);
            R.util.svg('text',{x:xy[0],y:xy[1]+6,'text-anchor':'middle',fill:'#10131c','font-size':18},svg).textContent=String(Math.round(R.s.min+(R.s.max-R.s.min)*i/32));
          }
        }
        R.paints.push(m => { detail.textContent='Setpoint'; });
        return parts;
      },
      renderThermostat: (base, S) => R => {
        const {e,main,aside,s,paints,buttons}=R;
        S.P.rotary(R, 'temperature', false);
        e('div','ol-temperature-limit',main, 'Limit: ' + s.min + '° – ' + s.max + '°C');
        const modeBox=e('div','ol-mode-box',aside);
        e('h3','',modeBox,'Mode');
        ['heat','cool'].forEach(mode => {
          const b=S.P.button(R,modeBox,mode==='heat'?'Heat':'Cool','mode:'+mode,()=>S.P.patch(R,{mode}));
          b.classList.add('ol-mode', 'ol-mode-'+mode);
          const dot=e('i','ol-mode-dot',null); b.prepend(dot);
        });
        const info=e('div','ol-room-information',aside);
        e('h3','',info,'Room Information');
        [['Room temperature','Current Temperature'],['Humidity','Humidity'],['System status','Status']].forEach(([key,label])=>{
          const row=e('div','ol-room-row',info);e('span','',row,label);R.facts[key]=e('strong','',row);
        });
        paints.push(m=>{
          ['heat','cool'].forEach(mode=>{buttons['mode:'+mode].classList.toggle('on',m.mode===mode);buttons['mode:'+mode].setAttribute('aria-pressed',String(m.mode===mode));});
          main.querySelector('.ah-digits').innerHTML=m.temp+'°<small>C</small>';
          main.querySelector('.ah-ring-inner > .ah-muted').textContent='Setpoint';
        });
      },
    },
  },
});
