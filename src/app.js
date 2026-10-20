/*
 * PARTME / NEURAL MATRIX — Agent Visual Runtime concept (offline-first)
 * Copyright (c) 2026 Partme. Visuals and telemetry are clearly simulated.
 *
 * Architecture: deterministic scenario events → timeline projection → renderer.
 * The graph view knows nothing about any specific Agent backend.
 * A real integration can replace SCENARIOS[*].events with normalized runtime
 * events (see README.md) and keep the rendering pipeline unchanged.
 */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const formatTime = (time) => `${String(Math.floor(Math.max(0,time)/60)).padStart(2,'0')}:${String(Math.floor(Math.max(0,time)%60)).padStart(2,'0')}`;
  const eventBus = new EventTarget();
  let randomState = 638711;
  function seedRandom(seed = 638711) { randomState = seed >>> 0; }
  function random() { randomState ^= randomState << 13; randomState ^= randomState >>> 17; randomState ^= randomState << 5; return (randomState >>> 0) / 4294967296; }
  const rnd = (low, high) => low + random() * (high - low);
  const choice = (arr) => arr[Math.floor(random() * arr.length)];
  const TAU = Math.PI * 2;
  const SHOW_DURATION = 40;
  const DENSITY = {
    high:     {nodes:640,links:3150,filaments:620,dust:1260,streams:710,packets:680},
    balanced: {nodes:440,links:1950,filaments:430,dust:840,streams:490,packets:470},
    lite:     {nodes:230,links:850, filaments:210,dust:440,streams:260,packets:250}
  };
  function initialQuality(){ return innerWidth<720?'lite':innerWidth<1180?'balanced':'high'; }
  const SHOW_SEGMENTS = [
    {start:0,end:16,mode:'mission'},
    {start:16,end:24,mode:'knowledge'},
    {start:24,end:32,mode:'runtime'},
    {start:32,end:40,mode:'mission'}
  ];

  const SCENARIOS = {
    mission: {
      title: 'MULTI-AGENT ORCHESTRATION', subtitle: 'ACTIVE SCENARIO / 001', duration: 68,
      task: '分析需求 → 拆解任务 → 多 Agent 协作交付',
      agents: [
        {name:'Planner Agent', id:'AG-001', route:'Gateway / LLM', ready:1},
        {name:'Research Agent', id:'AG-002', route:'Skills / Search', ready:12},
        {name:'Builder Agent', id:'AG-003', route:'Tools / Code', ready:19},
        {name:'Tool Router', id:'AG-004', route:'MCP / Tools', ready:26},
        {name:'Review Agent', id:'AG-005', route:'Verifier / Eval', ready:42},
        {name:'Memory Agent', id:'AG-006', route:'Knowledge / RAG', ready:34}
      ],
      events: [
        {t:0, phase:'RUNTIME BOOTSTRAP', label:'runtime.initialized', detail:'Fabric event channel established', agent:0},
        {t:4, phase:'TASK ACCEPTED', label:'task.created', detail:'Mission queued for orchestration', agent:0},
        {t:10, phase:'TASK DECOMPOSITION', label:'agent.planning.started', detail:'Planner decomposed mission graph', agent:0},
        {t:16, phase:'AGENT DISPATCH', label:'task.dispatched', detail:'Research + Builder nodes activated', agent:1},
        {t:23, phase:'PARALLEL EXECUTION', label:'agent.parallel.started', detail:'Worker traces running in parallel', agent:2},
        {t:31, phase:'TOOL INVOCATION', label:'tool.invoked', detail:'MCP tool route established', agent:3},
        {t:39, phase:'RESULT SYNTHESIS', label:'knowledge.retrieved', detail:'Evidence merged into context', agent:5},
        {t:49, phase:'QUALITY VERIFICATION', label:'agent.review.started', detail:'Review & validation in progress', agent:4},
        {t:60, phase:'RESULT DELIVERED', label:'task.completed', detail:'Artifacts committed to trace store', agent:0}
      ]
    },
    knowledge: {
      title: 'KNOWLEDGE GALAXY', subtitle: 'ACTIVE SCENARIO / 002', duration: 64,
      task: '上传资料 → 分解知识 → 关联 Wiki 与 QA',
      agents: [
        {name:'Ingest Agent', id:'KG-001', route:'Document / Parse', ready:1},
        {name:'Chunk Agent', id:'KG-002', route:'Semantic / Split', ready:10},
        {name:'Vector Agent', id:'KG-003', route:'Embedding / Store', ready:18},
        {name:'Graph Agent', id:'KG-004', route:'Knowledge / Graph', ready:26},
        {name:'Wiki Composer', id:'KG-005', route:'Generate / Wiki', ready:39},
        {name:'QA Composer', id:'KG-006', route:'Generate / QA', ready:47}
      ],
      events: [
        {t:0, phase:'KNOWLEDGE BOOTSTRAP', label:'pipeline.created', detail:'Knowledge pipeline instantiated', agent:0},
        {t:5, phase:'DOCUMENT INGESTION', label:'document.ingested', detail:'Document stream admitted', agent:0},
        {t:12, phase:'SEMANTIC CHUNKING', label:'document.chunked', detail:'Semantic units extracted', agent:1},
        {t:20, phase:'EMBEDDING GENERATION', label:'embedding.generated', detail:'Vector representation attached', agent:2},
        {t:28, phase:'KNOWLEDGE LINKING', label:'graph.linked', detail:'Entity and concept edges created', agent:3},
        {t:37, phase:'KNOWLEDGE RECONSTRUCTION', label:'graph.clustered', detail:'Related knowledge nodes grouped', agent:3},
        {t:44, phase:'WIKI COMPOSITION', label:'wiki.generated', detail:'Wiki content synthesized', agent:4},
        {t:52, phase:'QA GENERATION', label:'qa.generated', detail:'Question/answer pairs produced', agent:5},
        {t:60, phase:'KNOWLEDGE PUBLISHED', label:'pipeline.completed', detail:'Knowledge artifacts ready for review', agent:0}
      ]
    },
    runtime: {
      title: 'TINYCLAW RUNTIME MESH', subtitle: 'ACTIVE SCENARIO / 003', duration: 66,
      task: 'CLI / Service / Embed → Runtime 事件与调用链',
      agents: [
        {name:'CLI Runtime', id:'RT-001', route:'Rust / CLI', ready:1},
        {name:'Service Node', id:'RT-002', route:'Java / Service', ready:9},
        {name:'Embed Runtime', id:'RT-003', route:'Zig / Embed', ready:18},
        {name:'Agent Gateway', id:'RT-004', route:'Gateway / Models', ready:26},
        {name:'Agent Link', id:'RT-005', route:'Link / Events', ready:36},
        {name:'Trace Collector', id:'RT-006', route:'Trace / OTEL', ready:45}
      ],
      events: [
        {t:0, phase:'RUNTIME DISCOVERY', label:'runtime.discovered', detail:'Available runtime nodes enumerated', agent:0},
        {t:5, phase:'CLI SESSION START', label:'runtime.cli.started', detail:'Local CLI process registered', agent:0},
        {t:12, phase:'SERVICE ATTACH', label:'runtime.service.attached', detail:'Service channel handshaked', agent:1},
        {t:20, phase:'EMBED INITIALIZATION', label:'runtime.embed.ready', detail:'Embedded executor became available', agent:2},
        {t:29, phase:'MODEL ROUTING', label:'gateway.route.selected', detail:'Policy routing completed', agent:3},
        {t:37, phase:'EVENT PROPAGATION', label:'agentlink.event.published', detail:'Ordered event delivery confirmed', agent:4},
        {t:46, phase:'TRACE CORRELATION', label:'trace.span.linked', detail:'End-to-end span tree connected', agent:5},
        {t:55, phase:'HEALTH VALIDATION', label:'health.check.ok', detail:'Runtime nodes are synchronized', agent:1},
        {t:62, phase:'MESH SYNCHRONIZED', label:'runtime.mesh.ready', detail:'Cross-runtime graph converged', agent:4}
      ]
    }
  };

  const els = {
    stage:$('visualStage'), canvas:$('matrixCanvas'), timeline:$('timeline'),
    pauseBtn:$('pauseBtn'), pauseText:$('pauseText'), pauseIcon:$('pauseIcon'), replayBtn:$('replayBtn'), speedBtn:$('speedBtn'),
    eventLog:$('eventLog'), agents:$('agentStatusList'), agentChips:$('agentChips'), signal:$('signalCanvas'),
    missionProgress:$('missionProgress'), progressPercent:$('progressPercent'), progressStatus:$('progressStatus'),
    taskInput:$('taskInput'), taskForm:$('taskForm')
  };
  const state = {
    mode:'mission', seconds:0, showTime:0, playbackMode:'showcase', loops:0,
    playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,
    speed:1, quality:initialQuality(), qualitySetting:'auto', selected:0,
    yaw:-.12, pitch:.07, zoom:1, dragging:false, lastTick:performance.now(),
    graph:null, lastEvent:-1, lastHud:-Infinity, duration:68, hover:-1, internalPause:false,
    lowFpsSeconds:0
  };
  let scene = SCENARIOS[state.mode];

  function toast(msg) {
    const el = $('toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove('show'), 2350);
  }

  // Densified, deterministic nearest-neighbor topology. Grid indexing prevents
  // O(N²) whole-graph sorting and O(E²) duplicate scans at High quality.
  function generateGraph(mode) {
    const seeds={mission:76236,knowledge:92837,runtime:543812};
    seedRandom(seeds[mode]);
    const budget=DENSITY[state.quality];
    const major=[
      {x:-.42,y:.34,z:.48},{x:.36,y:.20,z:.31},{x:-.12,y:-.39,z:.52},
      {x:.51,y:-.25,z:.03},{x:.17,y:.52,z:-.22},{x:-.45,y:-.14,z:-.43}
    ];
    const nodes=[];
    for(let i=0;i<budget.nodes;i++) {
      let x,y,z;
      if(i<6) ({x,y,z}=major[i]);
      else if(mode==='runtime') {
        const layer=Math.floor(random()*5),a=rnd(-Math.PI,Math.PI),r=rnd(.16,.86);
        x=Math.cos(a)*r;y=Math.sin(a)*r;z=(layer-2)*.255+rnd(-.095,.095);
      } else if(mode==='knowledge') {
        const arm=Math.floor(random()*6),t=rnd(0,1),a=t*5+(arm*TAU/6)+rnd(-.32,.32),r=.08+.86*t;
        x=Math.cos(a)*r;y=Math.sin(a)*r;z=rnd(-.62,.62)*(.4+t*.6);
      } else {
        const theta=rnd(-Math.PI,Math.PI),phi=Math.acos(rnd(-1,1)),r=Math.cbrt(random())*.94;
        x=Math.sin(phi)*Math.cos(theta)*r;y=Math.sin(phi)*Math.sin(theta)*r;z=Math.cos(phi)*r;
      }
      nodes.push({x,y,z,id:i,glow:rnd(.42,1),radius:i<6?rnd(3.0,4.1):rnd(.64,1.6),pulse:rnd(0,TAU),cluster:i<6?i:Math.floor(random()*6)});
    }
    const cell=.255;
    const cellKey=(x,y,z)=>`${Math.floor((x+1.2)/cell)},${Math.floor((y+1.2)/cell)},${Math.floor((z+1.2)/cell)}`;
    const grid=new Map();
    for(const n of nodes){const key=cellKey(n.x,n.y,n.z);if(!grid.has(key))grid.set(key,[]);grid.get(key).push(n.id);}
    const candidates=nodes.map(n=>{
      const bx=Math.floor((n.x+1.2)/cell),by=Math.floor((n.y+1.2)/cell),bz=Math.floor((n.z+1.2)/cell);
      let matches=[];
      for(let ix=-2;ix<=2;ix++) for(let iy=-2;iy<=2;iy++) for(let iz=-2;iz<=2;iz++) {
        const bucket=grid.get(`${bx+ix},${by+iy},${bz+iz}`);if(!bucket)continue;
        for(const j of bucket){if(j===n.id)continue;const m=nodes[j];const d=(m.x-n.x)**2+(m.y-n.y)**2+(m.z-n.z)**2;matches.push({j,d});}
      }
      matches.sort((a,b)=>a.d-b.d);
      return matches.slice(0,Math.min(44,matches.length)).map(v=>v.j);
    });
    const edges=[],used=new Set();
    function addEdge(i,j){
      if(i===j||edges.length>=budget.links)return false;
      const key=(Math.min(i,j)*budget.nodes+Math.max(i,j));
      if(used.has(key))return false;
      used.add(key);edges.push({a:i,b:j,depth:rnd(.14,.86),weight:rnd(.26,1),phase:rnd(0,TAU),flow:rnd(.08,.32)});return true;
    }
    for(let i=0;i<budget.nodes;i++) {
      const near=candidates[i];
      if(!near.length)continue;
      const count=i<6?Math.min(28,near.length):Math.min(8,near.length);
      for(let k=0;k<count;k++)addEdge(i,near[Math.floor(rnd(0,Math.min(near.length,k<2?10:31)))]);
    }
    // Fill to a stable target count with nearby candidates, then connect clusters.
    let attempts=0;
    while(edges.length<budget.links&&attempts<budget.links*16){
      const i=Math.floor(random()*budget.nodes),near=candidates[i];
      if(near?.length)addEdge(i,choice(near));
      attempts++;
    }
    for(let i=0;i<budget.nodes/9;i++)addEdge(Math.floor(random()*budget.nodes),Math.floor(random()*budget.nodes));
    const filaments=[];
    for(let i=0;i<budget.filaments;i++) {
      const a=choice(nodes),b=choice(nodes);
      filaments.push({a:a.id,b:b.id,mid:{x:(a.x+b.x)*.48+rnd(-.38,.38),y:(a.y+b.y)*.48+rnd(-.38,.38),z:(a.z+b.z)*.48+rnd(-.3,.3)},phase:rnd(0,TAU),strength:rnd(.18,.95)});
    }
    const dust=[];
    for(let i=0;i<budget.dust;i++)dust.push({x:random(),y:random(),size:rnd(.45,1.7),blink:rnd(0,TAU),depth:random()});
    const streams=[];
    for(let i=0;i<budget.streams;i++)streams.push({y:rnd(-1,1),x:rnd(0,1),length:rnd(.08,.47),speed:rnd(.035,.23),offset:random(),alpha:rnd(.08,.84),thick:rnd(.4,2.1),hue:random(),spark:random()});
    const packets=[];
    for(let i=0;i<budget.packets;i++)packets.push({edge:Math.floor(random()*edges.length),phase:random(),speed:rnd(.16,.94),size:rnd(.8,3.1),tint:random()});
    const orbitGlyphs=[];
    for(let i=0;i<32;i++)orbitGlyphs.push({a:i*TAU/32+rnd(-.025,.025),text:choice(['AUX','IO / 04','0x84','●','RTE','MCP','01','P-7','↗','T-82','0F','TRACE']),bars:Math.floor(rnd(5,22))});
    return {nodes,edges,filaments,dust,streams,packets,orbitGlyphs};
  }

  class MatrixRenderer {
    constructor(canvas) {
      this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.w=0;this.h=0;this.dpr=1;
      this.screenNodes=[];this.pointer={x:-10000,y:-10000};this.cacheCanvas=document.createElement('canvas');this.cacheCtx=this.cacheCanvas.getContext('2d',{alpha:false});this.cacheDirty=true;this.resize();
      new ResizeObserver(()=>this.resize()).observe(els.stage);
    }
    resize() {
      const rect=els.stage.getBoundingClientRect();this.w=Math.max(200,rect.width);this.h=Math.max(280,rect.height);
      this.dpr=Math.min(devicePixelRatio||1,1.7);
      this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);
      this.canvas.style.width=this.w+'px';this.canvas.style.height=this.h+'px';
      this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
      this.cacheCanvas.width=this.canvas.width;this.cacheCanvas.height=this.canvas.height;this.cacheCtx.setTransform(this.dpr,0,0,this.dpr,0,0);this.cacheDirty=true;
      this.updateDimensions();
    }
    updateDimensions() {
      const w=this.w,h=this.h;
      if(w<=700){this.cx=w*.50;this.cy=h*.35;this.radius=Math.min(w*.55,h*.33)*state.zoom;}
      else if(w<=1100){this.cx=w*.425;this.cy=h*.52;this.radius=Math.min(w*.35,h*.49)*state.zoom;}
      else {this.cx=w*.405;this.cy=h*.517;this.radius=Math.min(w*.34,h*.552)*state.zoom;}
      this.focal=1150;
    }
    project(x,y,z) {
      const sy=Math.sin(state.yaw),cy=Math.cos(state.yaw),sp=Math.sin(state.pitch),cp=Math.cos(state.pitch);
      const x1=x*cy-z*sy,z1=x*sy+z*cy;
      const y1=y*cp-z1*sp,z2=y*sp+z1*cp;
      const depth=this.focal/(this.focal+z2*this.radius*.54);
      return {x:this.cx+x1*this.radius*depth,y:this.cy-y1*this.radius*depth,z:z2,depth};
    }
    arcPath(rad,a0=0,a1=Math.PI*2,steps=160,depth=0){
      const ctx=this.ctx;ctx.beginPath();for(let i=0;i<=steps;i++){
        const a=lerp(a0,a1,i/steps);const p=this.project(Math.cos(a)*rad,Math.sin(a)*rad,Math.sin(a*2.3)*depth);
        if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
      }
    }
    render(seconds) {
      this.updateDimensions();
      const ctx=this.ctx,w=this.w,h=this.h,graph=state.graph;
      // Only camera/topology-dependent work is cached. Time-varying strokes,
      // clock-sweep, orbital highlights and active nodes redraw EVERY frame.
      if(this.cacheDirty) {
        const actual=this.ctx;this.ctx=this.cacheCtx;
        this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
        this.ctx.globalCompositeOperation='source-over';this.ctx.globalAlpha=1;this.ctx.shadowBlur=0;
        this.ctx.fillStyle='#03091d';this.ctx.fillRect(0,0,w,h);
        this.backdrop(0);this.dust(0,graph);this.rings(0);
        this.filaments(0,graph);this.edges(0,graph);this.luminousFibrils(0,graph);
        this.ctx=actual;this.cacheDirty=false;
      }
      ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.shadowBlur=0;
      ctx.drawImage(this.cacheCanvas,0,0,w,h);
      this.rotatingCore(seconds);
      this.movingOrbits(seconds);
      this.activeConnections(seconds,graph);
      this.dynamicDust(seconds,graph);
      this.streams(seconds,graph);
      this.packets(seconds,graph);
      this.nodes(seconds,graph);
      this.ringDecor(seconds,graph);
      this.crosshair(seconds);
      // Scene switch flash is smooth but does not mask the underlying network.
      if(state.playbackMode==='showcase')this.transitionFlash(state.showTime);
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.shadowBlur=0;
    }
    transitionFlash(seconds){
      let distance=Math.min(...[0,16,24,32,40].map(t=>Math.abs(t-seconds)));
      if(distance>.42)return;
      const strength=(1-distance/.42)**2*.12;
      const ctx=this.ctx;ctx.globalCompositeOperation='screen';ctx.fillStyle=`rgba(123,193,250,${strength})`;
      ctx.fillRect(0,0,this.w,this.h);
    }
    dynamicDust(seconds,graph){
      const ctx=this.ctx;ctx.globalCompositeOperation='lighter';
      for(let i=0;i<graph.dust.length;i+=7){
        const p=graph.dust[i],blink=Math.pow(Math.max(0,Math.sin(seconds*TAU/SHOW_DURATION*(5+i%7)+p.blink)),7);
        if(blink<.18)continue;
        ctx.fillStyle=`rgba(205,237,254,${blink*.68})`;
        ctx.fillRect(p.x*this.w,p.y*this.h,1.3+p.size,1.3+p.size);
      }
      // A periodic scanner appears above the static HUD grid.
      const scanY=(seconds*this.h/10)%this.h;
      ctx.strokeStyle='rgba(160,213,252,.14)';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(0,scanY);ctx.lineTo(this.w,scanY);ctx.stroke();
    }
    activeConnections(seconds,graph){
      const ctx=this.ctx,points=this.screenNodes,agent=this.activeStage(state.seconds).agent||0;
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<graph.edges.length;i++){
        const e=graph.edges[i];
        if(e.a!==agent&&e.b!==agent&&e.a!==state.selected&&e.b!==state.selected&&i%31!==0)continue;
                const a=points[e.a],b=points[e.b],flash=.5+.5*Math.pow(Math.sin(seconds*TAU/SHOW_DURATION*9+e.phase),2);
        ctx.strokeStyle=`rgba(173,220,253,${(.12+.37*flash)*(i%4===0?1:.72)})`;
        ctx.lineWidth=i%4===0?1.24:.8;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
    rotatingCore(seconds){
      const ctx=this.ctx,t=seconds/SHOW_DURATION,phase=TAU*t;
      ctx.globalCompositeOperation='lighter';
      // Five physical-looking layers: luminous heart, clockwise rotor,
      // counter-rotor, orbit photons, and segmented outer circuit.
      const energy=.86+.14*Math.cos(seconds*TAU/5);
      const halo=ctx.createRadialGradient(this.cx,this.cy,3,this.cx,this.cy,this.radius*.38);
      halo.addColorStop(0,`rgba(214,241,255,${.15*energy})`);
      halo.addColorStop(.23,'rgba(84,173,247,.058)');halo.addColorStop(1,'rgba(84,173,247,0)');
      ctx.fillStyle=halo;ctx.fillRect(this.cx-this.radius*.38,this.cy-this.radius*.38,this.radius*.76,this.radius*.76);
      const layers=[
        {radius:1.062,count:34,sector:.07,rotation:phase,bright:.50},
        {radius:.985,count:40,sector:.058,rotation:-phase*2,bright:.40},
        {radius:.82,count:24,sector:.12,rotation:phase*3,bright:.24},
        {radius:.62,count:18,sector:.16,rotation:-phase,bright:.14}
      ];
      for(let li=0;li<layers.length;li++){
        const l=layers[li];
        for(let i=0;i<l.count;i++){
          const a=(i/l.count)*TAU+l.rotation;
          const glow=(i%7===0?1.7:i%4===0?1.1:.62)*l.bright;
          this.arcPath(l.radius,a,a+l.sector*(i%5===0?1.9:.9),6,.044);
          ctx.strokeStyle=`rgba(${li%2?'110,195,255':'219,243,255'},${glow})`;
          ctx.lineWidth=i%7===0?1.9:.77;
          if(i%13===0){ctx.lineWidth=3.4;ctx.strokeStyle='rgba(113,188,249,.15)';ctx.stroke();
            ctx.strokeStyle='rgba(198,233,254,.84)';ctx.lineWidth=1.9;}
          ctx.stroke();
        }
      }
      for(let i=0;i<56;i++){
        const dir=i%3===0?-2:1,a=i*2.399963+phase*dir;
        const rad=i%4===0?1.066:i%4===1?.99:i%4===2?.82:.62;
        const p=this.project(Math.cos(a)*rad,Math.sin(a)*rad,0);
        const size=i%6===0?2.2:1.05;
        ctx.fillStyle=i%5===0?'rgba(227,255,255,.95)':'rgba(126,195,250,.66)';
        ctx.beginPath();ctx.arc(p.x,p.y,size,0,TAU);ctx.fill();
      }
      // Multi-spoke inner energy rotor: subtly rotates as a single assembly.
      for(let i=0;i<12;i++){
        const a=phase*2+i*TAU/12;
        const p0=this.project(Math.cos(a)*.15,Math.sin(a)*.15,0);
        const p1=this.project(Math.cos(a+.085)*.28,Math.sin(a+.085)*.28,0);
        ctx.strokeStyle=`rgba(160,213,252,${.09+.08*(i%3===0)})`;ctx.lineWidth=.65;
        ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.stroke();
      }
    }

    movingOrbits(seconds) {
      const ctx=this.ctx;ctx.globalCompositeOperation='lighter';
      for(let i=0;i<8;i++) {
        const start=seconds/SHOW_DURATION*TAU*(i%2?-3:2)+i*.89;
        const rad=i%2?1.03:.985;
        this.arcPath(rad,start,start+.065,12,.035);
        ctx.strokeStyle=i%3===0?'rgba(208,238,255,.87)':'rgba(139,202,251,.57)';
        ctx.lineWidth=i%3===0?1.65:1;ctx.stroke();
      }
    }
    backdrop(seconds) {
      const ctx=this.ctx,w=this.w,h=this.h,r=this.radius;
      let g=ctx.createRadialGradient(this.cx,this.cy,r*.05,this.cx,this.cy,r*1.7);
      g.addColorStop(0,'rgba(20,82,152,.14)');g.addColorStop(.44,'rgba(20,80,149,.07)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      ctx.strokeStyle='rgba(136,200,250,.027)';ctx.lineWidth=.6;
      for(let x=0;x<w;x+=42){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=0;y<h;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.strokeStyle='rgba(145,205,251,.07)';ctx.setLineDash([3,10]);ctx.beginPath();ctx.moveTo(0,this.cy);ctx.lineTo(w,this.cy);ctx.moveTo(this.cx,0);ctx.lineTo(this.cx,h);ctx.stroke();ctx.setLineDash([]);
      if(w>800){ctx.fillStyle='rgba(177,222,253,.035)';ctx.font='9px monospace';for(let i=0;i<6;i++){const y=35+i*26;ctx.fillText(`00${i*4+7}  /  INSTRUMENTATION   //  MATRIX LINK REGISTER`,w*.58,y);}}
      let v=ctx.createLinearGradient(0,0,w,0);v.addColorStop(0,'rgba(0,0,0,.25)');v.addColorStop(.5,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.28)');ctx.fillStyle=v;ctx.fillRect(0,0,w,h);
      // Scanning line is intentionally drawn in the dynamic pass.
    }
    dust(seconds,graph) {
      const ctx=this.ctx,w=this.w,h=this.h;
      ctx.globalCompositeOperation='lighter';
      for(const p of graph.dust){ctx.fillStyle=`rgba(152,209,251,${.052+.17*p.depth})`;ctx.fillRect(p.x*w,p.y*h,p.size,p.size);}
    }
    rings(seconds) {
      const ctx=this.ctx;ctx.globalCompositeOperation='lighter';
      for(const [rad,alpha,width] of [[.26,.07,.7],[.53,.095,1],[.72,.12,1],[.89,.24,.8],[.985,.4,1.1],[1.03,.3,1.1],[1.09,.09,.7],[1.18,.07,1]]){
        ctx.strokeStyle=`rgba(161,213,252,${alpha})`;ctx.lineWidth=width;this.arcPath(rad,0,Math.PI*2,160,.06);ctx.stroke();
      }
      // Moving segmented arcs have been relocated to rotatingCore().
      // 3-D inclined orbital trajectory, offset by a subtle phase shift.
      for(let i=0;i<4;i++) {
        const rot=i*Math.PI/4;
        ctx.beginPath();for(let k=0;k<=120;k++) {
          const a=k*Math.PI*2/120;let x=Math.cos(a)*(.76+i*.06),y=Math.sin(a)*(.32+i*.042);
          const xx=x*Math.cos(rot)-y*Math.sin(rot),yy=x*Math.sin(rot)+y*Math.cos(rot);
          const p=this.project(xx,yy,Math.sin(a)*(.4+i*.04));if(!k)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
        }
        ctx.strokeStyle=`rgba(100,181,248,${.13-i*.02})`;ctx.lineWidth=.6;ctx.stroke();
      }
    }
    filaments(seconds,graph) {
      const ctx=this.ctx, pts=graph.nodes;ctx.globalCompositeOperation='lighter';
      for(const f of graph.filaments) {
        const a=pts[f.a],b=pts[f.b],wave=Math.sin(f.phase)*.09;
        const c={x:f.mid.x+wave,y:f.mid.y-wave*.7,z:f.mid.z};const p0=this.project(a.x,a.y,a.z),p1=this.project(b.x,b.y,b.z),p2=this.project(c.x,c.y,c.z);
        const alpha=(.025+f.strength*.105);
        ctx.strokeStyle=`rgba(184,226,253,${alpha})`;ctx.lineWidth=f.strength>.8?.75:.44;
        ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.quadraticCurveTo(p2.x,p2.y,p1.x,p1.y);ctx.stroke();
      }
    }
    edges(seconds,graph) {
      const ctx=this.ctx,nodes=graph.nodes,projections=nodes.map(n=>this.project(n.x,n.y,n.z));this.screenNodes=projections;
      const currentStage=this.activeStage(state.seconds);ctx.globalCompositeOperation='lighter';
      const activeNode=(currentStage.agent||0);const selected=state.selected;
      for(const e of graph.edges) {
        const a=projections[e.a],b=projections[e.b];
        const enhanced=e.a===selected||e.b===selected;
        const energized=e.a===activeNode||e.b===activeNode;
        const alpha=enhanced?.24:energized?.16:.032+e.weight*.105;
        ctx.strokeStyle=enhanced?`rgba(184,226,253,${alpha})`:energized?`rgba(132,198,250,${alpha})`:`rgba(211,237,252,${alpha})`;
        ctx.lineWidth=enhanced?1.1:energized?.78:.5;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
      // Extra white filigree: delicate connections between nearby neural layers.
      const offset=0;
      for(let i=0;i<92;i++) {
        const theta=i*2.39996+offset*.3,rad=.18+.66*Math.abs(Math.sin(i*9.8)),z=(Math.sin(i*6.2+offset)*.44);
        const a=this.project(Math.cos(theta)*rad,Math.sin(theta)*rad,z);
        const b=this.project(Math.cos(theta+.85)*rad*.85,Math.sin(theta+.85)*rad*.85,-z*.82);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(222,249,255,${.025+.065*Math.sin(i*1.2)**2})`;ctx.lineWidth=.6;ctx.stroke();
      }
    }
    luminousFibrils(seconds,graph) {
      const ctx=this.ctx, pts=graph.nodes;
      ctx.globalCompositeOperation='lighter';
      for(let i=0;i<graph.filaments.length;i++) {
        if(i%3===1)continue;
        const f=graph.filaments[i],a=pts[f.a],b=pts[f.b];
        const x=f.mid.x+Math.sin(f.phase)*.08;
        const y=f.mid.y+Math.cos(f.phase)*.09;
        const pa=this.project(a.x,a.y,a.z),pb=this.project(b.x,b.y,b.z),pc=this.project(x,y,f.mid.z);
        const flash=.68+.32*Math.abs(Math.sin(f.phase));
        ctx.strokeStyle=i%11===0?`rgba(228,255,255,${.32*flash})`:`rgba(176,221,253,${f.strength*.19*flash})`;
        ctx.lineWidth=i%11===0?1.25:.69;
        ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.quadraticCurveTo(pc.x,pc.y,pb.x,pb.y);ctx.stroke();
      }
    }
    streams(seconds,graph) {
      if(this.w<600)return;
      const ctx=this.ctx,w=this.w,h=this.h;
      ctx.globalCompositeOperation='lighter';
      const origin=this.cx+this.radius*.89;
      const streamMax=w-origin+400;
      // Sweeping photon pulses. On real data these can map to cross-agent events.
      for(const s of graph.streams) {
        const flow=((s.offset + seconds/SHOW_DURATION*(2+Math.round(s.speed*60)))%1)*streamMax;
        const y=this.cy+s.y*this.radius*.75 + Math.sin(seconds*TAU/SHOW_DURATION*2+s.x*14)*7;
        const start=origin+flow-s.length*this.radius*3.4;
        const end=origin+flow+15;
        if(end<origin-15||start>w+50)continue;
        let hue=s.hue<.26?'223,247,255':s.hue<.58?'75,168,255':s.hue<.83?'142,215,255':'117,235,255';
        const gain=state.mode==='runtime'?1.06:state.mode==='knowledge'?.84:1;
        const alpha=s.alpha*(.52+ .43*Math.sin(seconds*TAU/SHOW_DURATION*7+s.x*16)**2)*gain;
        let color=`rgba(${hue},${alpha*.34})`;
        if(s.spark>.71 || s.length>.38){
          const g=ctx.createLinearGradient(start,y,end,y);
          g.addColorStop(0,`rgba(${hue},0)`);g.addColorStop(.45,`rgba(${hue},${alpha*.34})`);
          g.addColorStop(.89,`rgba(${hue},${alpha})`);g.addColorStop(1,`rgba(${hue},0)`);
          color=g;
        }
        ctx.beginPath();ctx.moveTo(start,y);ctx.lineTo(end,y+s.y*8);ctx.strokeStyle=color;ctx.lineWidth=s.thick;ctx.stroke();
        if(s.spark>.89){ctx.fillStyle=`rgba(${hue},${alpha})`;ctx.fillRect(end-2,y-1,Math.max(1,s.thick*2),Math.max(1,s.thick));}
      }
      // Long soft glow behind the data tunnel and bright emission point.
      const soft=ctx.createRadialGradient(origin+90,this.cy,0,origin+90,this.cy,this.radius*1.0);
      soft.addColorStop(0,'rgba(104,183,249,.077)');soft.addColorStop(1,'rgba(104,183,249,0)');ctx.fillStyle=soft;ctx.fillRect(origin,this.cy-this.radius,Math.max(1,w-origin),this.radius*2);
      for(let i=0;i<28;i++){
        let y=this.cy+Math.sin(i*2.14+seconds*TAU/SHOW_DURATION)*this.radius*.72;
        let x=origin-21+Math.cos(i*3.61)*27;
        ctx.fillStyle=`rgba(200,234,254,${.045+.2*Math.sin(seconds*TAU/SHOW_DURATION*4+i)**2})`;ctx.beginPath();ctx.arc(x,y,1.7,0,Math.PI*2);ctx.fill();
      }
    }
    packets(seconds,graph) {
      const ctx=this.ctx,pts=graph.nodes,edges=graph.edges;ctx.globalCompositeOperation='lighter';
      for(const p of graph.packets) {
        const e=edges[p.edge],a=pts[e.a],b=pts[e.b];if(!e)continue;
        const t=(p.phase+seconds/SHOW_DURATION*(1+Math.round(p.speed*15)))%1;
        const x=lerp(a.x,b.x,t),y=lerp(a.y,b.y,t),z=lerp(a.z,b.z,t);
        const projected=this.project(x,y,z);
        const alpha=.2+.65*Math.sin(t*Math.PI);
        ctx.fillStyle=p.tint<.37?`rgba(225,252,255,${alpha})`:`rgba(136,200,250,${alpha*.64})`;
        ctx.beginPath();ctx.arc(projected.x,projected.y,p.size*.57,0,Math.PI*2);ctx.fill();
      }
      ctx.shadowBlur=0;
    }
    nodes(seconds,graph) {
      const ctx=this.ctx,nodes=graph.nodes,screen=this.screenNodes;
      const current=this.activeStage(state.seconds);const active=current.agent||0;
      ctx.globalCompositeOperation='lighter';
      for(let i=6;i<nodes.length;i++) {
        const n=nodes[i],p=screen[i];        const flash=.45+.55*Math.sin(seconds*TAU/SHOW_DURATION*8+n.pulse)**2;
        const alpha=.24+.62*n.glow*flash;
        ctx.fillStyle=i%7===0?`rgba(167,217,252,${alpha})`:`rgba(199,234,254,${alpha})`;ctx.beginPath();ctx.arc(p.x,p.y,n.radius*.68,0,Math.PI*2);ctx.fill();
        if(i%13===0) {
          ctx.strokeStyle='rgba(161,213,252,.24)';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(p.x,p.y,3.4+n.glow,0,Math.PI*2);ctx.stroke();
        }
      }
      for(let i=0;i<6;i++) {
        const p=screen[i],node=nodes[i];const selected=state.selected===i;const energized=i===active||state.seconds>SCENARIOS[state.mode].agents[i].ready;
        const power=(selected||energized)?1:.38;
                const outer=(selected?13:9)+Math.sin(seconds*TAU/SHOW_DURATION*15+node.pulse)*1.3;
        ctx.strokeStyle=selected?'rgba(202,235,254,.87)':`rgba(142,203,251,${.29+.26*power})`;
        ctx.lineWidth=selected?1.5:.9;ctx.beginPath();ctx.arc(p.x,p.y,outer,0,Math.PI*2);ctx.stroke();
        ctx.strokeStyle=`rgba(152,209,251,${.14+.25*power})`;ctx.beginPath();ctx.arc(p.x,p.y,outer+5.7,-Math.PI/2,-Math.PI/2+Math.PI*(.7+.5*Math.sin(seconds*TAU/SHOW_DURATION*4+i)));ctx.stroke();
        ctx.fillStyle=selected?'rgba(183,225,253,.26)':'rgba(113,188,249,.14)';
        ctx.beginPath();ctx.arc(p.x,p.y,selected?9:6.5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=selected?'#e0fbff':energized?'#b4dffd':'#6e8da8';
        ctx.beginPath();ctx.arc(p.x,p.y,2.9,0,Math.PI*2);ctx.fill();
        // Node anchors and crisp technical labels.
        const right=i%2===1;const dx=right?-21:21,dy=(i%3===0)?-19:18;
        const lineX=p.x+dx,lineY=p.y+dy;
        ctx.strokeStyle=`rgba(158,212,252,${selected?.75:.21})`;ctx.lineWidth=.65;
        ctx.beginPath();ctx.moveTo(p.x+(right?-8:8),p.y);ctx.lineTo(lineX,lineY);ctx.lineTo(lineX+(right?-32:32),lineY);ctx.stroke();
        if(this.w>670){
          ctx.font='9px monospace';ctx.textAlign=right?'right':'left';ctx.fillStyle=selected?'rgba(209,239,255,.95)':'rgba(176,221,253,.62)';
          ctx.fillText(SCENARIOS[state.mode].agents[i].name.toUpperCase(),lineX+(right?-36:36),lineY-4);
          ctx.font='7px monospace';ctx.fillStyle='rgba(119,191,249,.46)';ctx.fillText(SCENARIOS[state.mode].agents[i].id,lineX+(right?-36:36),lineY+6);
        }
      }
    }
    ringDecor(seconds,graph) {
      const ctx=this.ctx;ctx.globalCompositeOperation='lighter';
      for(let i=0;i<250;i++) {
        const a=i*Math.PI*2/250+seconds/SHOW_DURATION*TAU, major=i%10===0;
        const r0=1.037,r1=1.037+(major?.03:.011);
        const p0=this.project(Math.cos(a)*r0,Math.sin(a)*r0,0);
        const p1=this.project(Math.cos(a)*r1,Math.sin(a)*r1,0);
        ctx.strokeStyle=major?'rgba(170,218,252,.60)':'rgba(158,212,252,.26)';ctx.lineWidth=major?1:.6;
        ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.stroke();
      }
      if(this.w>700) {
        ctx.textAlign='center';ctx.font='8px monospace';
        for(const gl of graph.orbitGlyphs) {
          const p=this.project(Math.cos(gl.a)*1.15,Math.sin(gl.a)*1.15,0);
          ctx.fillStyle='rgba(155,210,252,.43)';ctx.fillText(gl.text,p.x,p.y);
          if(gl.bars>12){ctx.fillStyle='rgba(148,207,251,.25)';ctx.fillRect(p.x-8,p.y+4,gl.bars,p.h||1);}
        }
        ctx.font='7px monospace';ctx.fillStyle='rgba(180,223,253,.36)';ctx.textAlign='left';
        for(let i=0;i<26;i++) {
          const a=-1.15+i*.088,p=this.project(Math.cos(a)*.99,Math.sin(a)*.99,.01);
          if(i%3===0)ctx.fillText((Math.round(i*6.42)).toString().padStart(3,'0')+' / '+(i*7+34).toString(16).toUpperCase(),p.x,p.y);
          ctx.fillRect(p.x,p.y+3,(i%7+2)*3,1);
        }
      }
      // Orbit running signal points
      for(let i=0;i<28;i++) {
        const a=seconds*TAU/SHOW_DURATION*(i%2?2:-1)+i*2.3999;
        const p=this.project(Math.cos(a)*.99,Math.sin(a)*.99,0);
        ctx.fillStyle='rgba(75,168,247,.12)';ctx.beginPath();ctx.arc(p.x,p.y,i%3?3.5:5.5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=i%3?'rgba(192,230,254,.68)':'#cbecfe';ctx.beginPath();ctx.arc(p.x,p.y,i%3?1.6:2.6,0,Math.PI*2);ctx.fill();
      }
    }
    crosshair(seconds){
      const ctx=this.ctx;ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='rgba(181,224,253,.13)';ctx.lineWidth=.7;
      const x=this.cx,y=this.cy;
      ctx.beginPath();ctx.moveTo(x-21,y);ctx.lineTo(x-10,y);ctx.moveTo(x+10,y);ctx.lineTo(x+21,y);ctx.moveTo(x,y-21);ctx.lineTo(x,y-10);ctx.moveTo(x,y+10);ctx.lineTo(x,y+21);ctx.stroke();
      ctx.strokeStyle='rgba(177,222,253,.3)';ctx.beginPath();ctx.arc(x,y,6.5+Math.sin(seconds*TAU/5),0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#c3e7fe';ctx.fillRect(x-1,y-1,2,2);
    }
    activeStage(seconds){let result=scene.events[0];for(const e of scene.events)if(seconds>=e.t)result=e;return result;}
    hitTest(x,y) {
      const positions=this.screenNodes;let best=-1,bestDistance=25;
      for(let i=0;i<6;i++) {const p=positions[i];if(!p)continue;const d=Math.hypot(p.x-x,p.y-y);if(d<bestDistance){bestDistance=d;best=i;}}
      return best;
    }
  }
  // Preemptively catch typo in a shadow/alpha expression when building a standalone demo.

  const renderer = new MatrixRenderer(els.canvas);
  const graphCache=new Map();
  function obtainGraph(mode){
    const key=mode+':'+state.quality;
    if(!graphCache.has(key))graphCache.set(key,generateGraph(mode));
    return graphCache.get(key);
  }
  state.graph=obtainGraph(state.mode);
  // Scene selection and timeline projection are independent clocks.
  function setScene(mode) {
    if(!SCENARIOS[mode] || mode===state.mode)return;
    state.mode=mode;scene=SCENARIOS[mode];state.duration=scene.duration;
    state.graph=obtainGraph(mode);renderer.cacheDirty=true;
    state.selected=0;state.lastEvent=-1;
    $('scenarioTitle').textContent=scene.title;
    $('panelEyebrow').textContent=scene.subtitle;
    els.taskInput.value=scene.task;
    document.querySelectorAll('.mode-button').forEach(b=>{
      const active=b.dataset.mode===mode;
      b.classList.toggle('active',active);
      b.setAttribute('aria-pressed',String(active));
    });
  }
  function resolveShowTime(t) {
    const at=((t%SHOW_DURATION)+SHOW_DURATION)%SHOW_DURATION;
    if(at<16)return {mode:'mission',local:at*4,stage:at<8?'BOOT':'PEAK'};
    if(at<24)return {mode:'knowledge',local:(at-16)*7.875,stage:'KNOWLEDGE'};
    if(at<32)return {mode:'runtime',local:(at-24)*8.10,stage:'RUNTIME'};
    return {mode:'mission',local:(40-at)*.2,stage:'CONVERGENCE'};
  }
  function syncShowcase(force=false) {
    const resolved=resolveShowTime(state.showTime);
    const oldSeconds=state.seconds,oldEvent=state.lastEvent;
    setScene(resolved.mode);
    state.seconds=resolved.local;
    const idx=scene.events.reduce((i,e,j)=>state.seconds>=e.t?j:i,0);
    if(idx!==oldEvent&&!force&&state.seconds>=oldSeconds){
      for(let i=Math.max(0,oldEvent+1);i<=idx;i++)sendEvent(scene.events[i]);
    }
    state.lastEvent=idx;
    return resolved;
  }
  function setShowTime(t,force=true) {
    state.showTime=((Number(t)%SHOW_DURATION)+SHOW_DURATION)%SHOW_DURATION;
    syncShowcase(force);updateHud(true);
  }
  function startShowcase(){
    state.playbackMode='showcase';state.showTime=0;state.playing=true;state.loops=0;
    state.speed=1;els.speedBtn.textContent='1.0×';
    state.yaw=-.12;state.pitch=.07;state.zoom=1;renderer.cacheDirty=true;
    syncShowcase(true);updateHud(true);
    updatePlaybackButtons();window.PartmeAudio?.onMode('showcase');
    toast('SHOWCASE / 40 秒自动循环 · SIMULATED');
  }
  function updatePlaybackButtons(){
    const show=$('showcaseBtn');if(!show)return;
    const active=state.playbackMode==='showcase';
    show.classList.toggle('active',active);show.setAttribute('aria-pressed',String(active));
    show.textContent=active?'◉ SHOWCASE / 40S':'▶ SHOWCASE / 40S';
    $('timelineCaption').textContent=active?'SHOWCASE / 40S':'EVENT TIMELINE';
  }

  function sendEvent(e) {
    eventBus.dispatchEvent(new CustomEvent('runtime-event', {detail:{
      schema:'partme.visual.event.v0', eventId:`${state.mode}-${Math.floor(e.t*1000)}`,
      timestamp:e.t, type:e.label, nodeId:scene.agents[e.agent].id,
      payload:{description:e.detail, simulated:true}
    }}));
  }
  function seek(toTime,{force=false}={}) {
    const oldIdx=state.lastEvent;
    state.seconds=clamp(toTime,0,scene.duration);
    const next=scene.events.reduce((i,e,j)=>state.seconds>=e.t?j:i,0);
    state.lastEvent=next;
    // Active connections are rendered dynamically; static cache unchanged.
    if(next>oldIdx && !force)for(let i=Math.max(0,oldIdx+1);i<=next;i++)sendEvent(scene.events[i]);
    updateHud(true);
  }
  function selectAgent(index) {
    state.selected=clamp(index,0,scene.agents.length-1);renderer.cacheDirty=true;
    updateInspector();updateAgents();
    eventBus.dispatchEvent(new CustomEvent('node-selected',{detail:{mode:state.mode,nodeId:scene.agents[state.selected].id}}));
  }
  function updateInspector() {
    const agent=scene.agents[state.selected]||scene.agents[0],sec=state.seconds;
    const activeEvent=[...scene.events].reverse().find(e=>e.agent===state.selected && e.t<=sec);
    const stage=scene.events.reduce((i,e,j)=>sec>=e.t?j:i,0);
    const status=sec<agent.ready?'STANDBY':stage===scene.events.length-1?'COMPLETE':(activeEvent&&sec-activeEvent.t<11?'ACTIVE':sec>agent.ready+22?'COMPLETE':'MONITORING');
    $('inspectorName').innerHTML='';$('inspectorName').append(document.createTextNode(agent.name+' '));
    const go=document.createElement('span');go.textContent='↗';$('inspectorName').append(go);
    $('inspectorType').textContent=(state.mode==='knowledge'?'KNOWLEDGE / ':state.mode==='runtime'?'RUNTIME / ':'ORCHESTRATION / ')+'AGENT';
    $('inspectorState').textContent=status;$('inspectorId').textContent=agent.id;
    $('inspectorRoute').textContent=agent.route;
    $('inspectorEvent').textContent=activeEvent?.label||'node.standby';
    $('inspectorElapsed').textContent=Math.max(0,sec-agent.ready).toFixed(1)+' s';
  }
  function updateAgents() {
    const seq=scene.events.reduce((i,e,j)=>state.seconds>=e.t?j:i,0);
    const current=scene.events[seq].agent;
    els.agents.innerHTML='';els.agentChips.innerHTML='';
    for(let i=0;i<scene.agents.length;i++) {
      const a=scene.agents[i], started=state.seconds>=a.ready,
        done=state.seconds>=scene.events[scene.events.length-1].t || (started&&state.seconds>a.ready+23&&i!==current),
        live=started&&!done;
      const status=done?'DONE':live?'ACTIVE':'STANDBY';
      const progress=started?Math.min(100,Math.max(8,(state.seconds-a.ready)/23*100)):0;
      const row=document.createElement('div');row.className='agent-status-item';row.title=`查看 ${a.name}`;
      row.innerHTML=`<i class="agent-light ${done?'done':live?'live':''}"></i><span class="agent-id">${a.id}</span><span class="agent-name">${a.name}</span><span class="agent-state ${done?'done':live?'live':''}">${status}</span><span class="agent-bar" style="--agent-progress:${progress.toFixed(0)}%"></span>`;
      row.style.cursor='pointer';row.addEventListener('click',()=>selectAgent(i));els.agents.append(row);
      if(i<4){const chip=document.createElement('button');chip.type='button';chip.className='agent-chip'+(started?' active':'');chip.innerHTML='<i></i>' + (state.mode==='mission'?['PLAN','RESEARCH','BUILD','TOOLS'][i]:state.mode==='knowledge'?['INGEST','CHUNK','VECTOR','GRAPH'][i]:['CLI','SERVICE','EMBED','GATEWAY'][i]);chip.title=a.name;chip.addEventListener('click',()=>selectAgent(i));els.agentChips.append(chip);}
    }
    $('agentsActive').textContent=String(scene.agents.filter(a=>state.seconds>=a.ready&&state.seconds<a.ready+23).length).padStart(2,'0')+'/06';
    $('orchestratorStatus').textContent=state.seconds>=scene.events[scene.events.length-1].t?'COMPLETED':state.playing?'SYNCHRONIZED':'PAUSED';
  }
  function updateLog() {
    els.eventLog.innerHTML='';
    const logged=scene.events.filter(e=>e.t<=state.seconds);
    const lines=logged.slice(-7);
    if(lines.length<7){
      const placeholders=7-lines.length;
      for(let i=0;i<placeholders;i++) {
        const line=document.createElement('div');line.className='event-log-line';
        line.innerHTML=`<span class="event-time">--:--</span><span class="event-arrow">›</span><span class="event-text" style="color:#254a80">trace buffer / awaiting event ...</span>`;
        els.eventLog.append(line);
      }
    }
    for(const [i,e] of lines.entries()) {
      const line=document.createElement('div');line.className='event-log-line'+(i===lines.length-1?' latest':'');line.title=`${e.label} — ${e.detail}`;
      line.style.cursor='pointer';line.addEventListener('click',()=>{
        if(state.playbackMode==='showcase'){
          const t=state.mode==='knowledge'?16+(e.t+.04)/7.875:state.mode==='runtime'?24+(e.t+.04)/8.1:(e.t+.04)/4;
          setShowTime(t);
        }else seek(e.t+.04);
        state.playing=false;window.PartmeAudio?.onPlayback(false,0);updatePauseBtn();
      });
      const tm=document.createElement('span');tm.className='event-time';tm.textContent=formatTime(e.t);
      const ar=document.createElement('span');ar.className='event-arrow';ar.textContent='›';
      const msg=document.createElement('span');msg.className='event-text';msg.textContent=e.label;
      line.append(tm,ar,msg);els.eventLog.append(line);
    }
  }
  function updatePauseBtn() {
    els.pauseIcon.textContent=state.playing?'Ⅱ':'▶';
    els.pauseText.textContent=state.playing?'PAUSE':state.playbackMode==='interactive'&&state.seconds>=scene.duration?'REPLAY':'RESUME';
    $('progressStatus').textContent=state.playbackMode==='showcase'?(state.playing?'AUTO LOOP / SIMULATED':'PAUSED / SIMULATED'):state.seconds>=scene.events[scene.events.length-1].t?'COMPLETED / SIMULATED':state.playing?'RUNNING / SIMULATED':'PAUSED / SIMULATED';
  }
  function updateHud(force=false) {
    const now=performance.now();if(!force&&now-state.lastHud<190)return;state.lastHud=now;
    const idx=scene.events.reduce((i,e,j)=>state.seconds>=e.t?j:i,0), phase=scene.events[idx];
    const isShow=state.playbackMode==='showcase';
    const percent=(isShow?state.showTime/SHOW_DURATION:state.seconds/scene.duration)*100;
    if(isShow && state.showTime>=32){$('phaseName').textContent='FABRIC CONVERGENCE';}
    else $('phaseName').textContent=phase.phase;
    $('phaseCode').textContent=`${String(idx+1).padStart(2,'0')} / ${String(scene.events.length).padStart(2,'0')}`;
    $('missionProgress').style.width=percent.toFixed(2)+'%';$('progressPercent').textContent=percent.toFixed(1)+'%';
    els.timeline.value=String(Math.round(percent*10));els.timeline.style.setProperty('--scrub',percent+'%');
    $('timeReadout').textContent=formatTime(isShow?state.showTime:state.seconds);
    $('timeEnd').textContent=formatTime(isShow?SHOW_DURATION:scene.duration);
    $('nodeCount').innerHTML=String(state.graph.nodes.length)+'<span> NODES</span>';
    $('linkDensity').textContent=(state.graph.edges.length/state.graph.nodes.length/5).toFixed(2);
    $('connectionReadout').textContent=String(state.graph.edges.length).padStart(5,'0');
    $('eventReadout').textContent=(12+Math.abs(Math.sin(state.seconds*.35))*26).toFixed(2).padStart(6,'0')+' / S';
    $('frequencyNumber').textContent=String(Math.round(5+3*Math.abs(Math.sin(state.seconds*.11))));
    $('signalText').textContent=phase.detail.toUpperCase().slice(0,37);
    $('traceCounter').textContent=String(32+idx*12).padStart(2,'0');
    $('tokenRate').innerHTML=Math.round(380+1260*(.36+.64*Math.abs(Math.sin(state.seconds*.076+idx*.17)))).toLocaleString()+' <span>tok/s</span>';
    $('latencyRate').innerHTML=Math.round(28+39*Math.abs(Math.sin(state.seconds*.12+.4)))+'<span>ms</span>';
    $('axisX').textContent=(state.yaw>=0?'+':'')+(state.yaw*100).toFixed(1).padStart(5,'0');
    $('axisY').textContent=(state.pitch>=0?'+':'')+(state.pitch*100).toFixed(1).padStart(5,'0');
    $('axisZ').textContent='+'+(state.zoom*8.4).toFixed(1).padStart(5,'0');
    $('loopCount').textContent=String(state.loops).padStart(2,'0');
    $('flowCount').textContent=String(state.graph.packets.length).padStart(3,'0');
    $('linksCount').textContent=String(state.graph.edges.length).padStart(4,'0');
    $('activeStreams').textContent=String(state.graph.streams.length).padStart(3,'0');
    updateAgents();updateLog();updateInspector();updatePauseBtn();drawSignal();
  }
  function drawSignal() {
    const canvas=els.signal,rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    const dpr=Math.min(devicePixelRatio||1,1.7),w=rect.width,h=rect.height;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='rgba(157,211,252,.09)';ctx.lineWidth=.6;
    for(let y=4;y<h;y+=18){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    const series=[{color:'rgba(214,240,255,.82)',width:1.1,phase:.8},{color:'rgba(98,180,248,.78)',width:1,phase:2.4}];
    for(let j=0;j<2;j++) {
      const s=series[j];ctx.beginPath();
      for(let i=0;i<=160;i++) {
        const u=i/160,t=state.seconds-(1-u)*60;
        const y=h*(j===0?.42:.62)+Math.sin(t*(j===0?.62:.38)+s.phase)*h*.125+Math.cos(t*1.79+s.phase)*h*.09+Math.sin(t*2.31)*h*.026;
        if(i===0)ctx.moveTo(0,y);else ctx.lineTo(u*w,y);
      }
      ctx.strokeStyle=s.color;ctx.lineWidth=s.width;ctx.stroke();
    }
    ctx.strokeStyle='rgba(152,209,251,.28)';ctx.beginPath();ctx.moveTo(w-1,0);ctx.lineTo(w-1,h);ctx.stroke();
  }
  function changeMode(mode){
    if(!SCENARIOS[mode])return;
    state.playbackMode='interactive';
    setScene(mode);
    state.selected=0;state.lastEvent=-1;
    state.seconds=1;state.duration=scene.duration;state.playing=true;
    state.zoom=1;state.yaw=-.12;state.pitch=.07;renderer.cacheDirty=true;
    updatePlaybackButtons();updateHud(true);window.PartmeAudio?.onMode('interactive');
    toast(`${mode==='mission'?'任务指挥中心':mode==='knowledge'?'知识星空':'TinyClaw 运行时拓扑'} · 交互模式`);
  }
  document.querySelectorAll('.mode-button').forEach(btn=>btn.addEventListener('click',()=>changeMode(btn.dataset.mode)));
  $('showcaseBtn').addEventListener('click',startShowcase);
  $('qualityBtn').addEventListener('click',()=>{
    const options=['high','balanced','lite'];
    state.qualitySetting=options[(options.indexOf(state.quality)+1)%options.length];
    state.quality=state.qualitySetting;state.graph=obtainGraph(state.mode);
    renderer.cacheDirty=true;$('qualityBtn').textContent='QUALITY / '+state.quality.toUpperCase();
    updateHud(true);toast('画质：'+state.quality.toUpperCase());
  });
  els.pauseBtn.addEventListener('click',()=>{
    if(state.playbackMode==='interactive'&&state.seconds>=scene.duration)seek(0,{force:true});
    state.playing=!state.playing;updatePauseBtn();updateHud(true);
    window.PartmeAudio?.onPlayback(state.playing,state.playbackMode==='showcase'?state.showTime:state.seconds);
  });
  els.replayBtn.addEventListener('click',()=>{
    state.playing=true;state.lastEvent=-1;
    if(state.playbackMode==='showcase')setShowTime(0);
    else seek(0,{force:true});
    window.PartmeAudio?.onSeek(state.playbackMode==='showcase'?state.showTime:state.seconds);
    toast('事件时间轴已重置 · 正在回放');
  });
  const speeds=[1,1.5,2,4];
  els.speedBtn.addEventListener('click',()=>{
    state.speed=speeds[(speeds.indexOf(state.speed)+1)%speeds.length];
    els.speedBtn.textContent=state.speed.toFixed(1)+'×';
    window.PartmeAudio?.setSpeed(state.speed);
    toast('回放速度：'+state.speed.toFixed(1)+'×');
  });
  els.timeline.addEventListener('input',()=>{
    const target=Number(els.timeline.value)/1000;
    if(state.playbackMode==='showcase')setShowTime(target*SHOW_DURATION);
    else {seek(target*scene.duration,{force:true});if(state.seconds>=scene.duration)state.playing=false;}
    window.PartmeAudio?.onSeek(state.playbackMode==='showcase'?state.showTime:state.seconds);
    updatePauseBtn();
  });
  els.taskForm.addEventListener('submit',(event)=>{
    event.preventDefault();const value=els.taskInput.value.trim();
    if(!value){toast('请输入要模拟的任务内容');return;}
    state.playbackMode='interactive';state.playing=true;state.lastEvent=-1;
    seek(0,{force:true});updatePlaybackButtons();
    toast('演示任务已创建 · '+value.slice(0,23));
  });
  $('fullscreenBtn').addEventListener('click',async()=>{
    try {if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}
    catch(e){toast('当前浏览器未开放全屏权限');}
  });
  document.addEventListener('keydown',(e)=>{
    if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;
    if(e.code==='Space'){e.preventDefault();els.pauseBtn.click();}
    if(e.key==='r'||e.key==='R')els.replayBtn.click();
    if(['Digit1','Digit2','Digit3'].includes(e.code))changeMode(['mission','knowledge','runtime'][Number(e.code.slice(-1))-1]);
  });
  // Pointer events belong to the renderer canvas; HUD never blocks node picking.
  const pointer={down:false,x:0,y:0,moved:false,id:null};
  els.canvas.addEventListener('pointerdown',(e)=>{if(e.button!==0&&e.pointerType==='mouse')return;pointer.down=true;pointer.moved=false;pointer.x=e.clientX;pointer.y=e.clientY;pointer.id=e.pointerId;els.canvas.setPointerCapture(e.pointerId);});
  els.canvas.addEventListener('pointermove',(e)=>{
    const rect=els.canvas.getBoundingClientRect();
    if(!pointer.down){const over=renderer.hitTest(e.clientX-rect.left,e.clientY-rect.top);els.canvas.style.cursor=over>=0?'pointer':'grab';return;}
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.abs(dx)+Math.abs(dy)>1.8)pointer.moved=true;
    state.yaw=clamp(state.yaw+dx*.005,-2.8,2.8);state.pitch=clamp(state.pitch+dy*.004,-1.1,1.1);renderer.cacheDirty=true;pointer.x=e.clientX;pointer.y=e.clientY;
  });
  function releasePointer(e) {
    if(!pointer.down)return;
    const rect=els.canvas.getBoundingClientRect();
    if(!pointer.moved){const index=renderer.hitTest(e.clientX-rect.left,e.clientY-rect.top);if(index>=0){selectAgent(index);toast('已选中节点：'+scene.agents[index].name);}}
    pointer.down=false;try{els.canvas.releasePointerCapture(e.pointerId);}catch(_){}
  }
  els.canvas.addEventListener('pointerup',releasePointer);els.canvas.addEventListener('pointercancel',()=>{pointer.down=false;});
  els.canvas.addEventListener('wheel',(e)=>{e.preventDefault();state.zoom=clamp(state.zoom*(e.deltaY>0?.93:1.075),.61,1.45);renderer.cacheDirty=true;}, {passive:false});

  seedRandom(82931);
  const bars=$('miniBars'),frequencies=$('frequencyGraph');
  for(let i=0;i<37;i++) {const b=document.createElement('i');b.style.height=`${rnd(18,100).toFixed(0)}%`;bars.append(b);}
  for(let i=0;i<45;i++) {const b=document.createElement('i');b.style.height=`${(18+Math.sin(i*.7)*26+Math.abs(Math.sin(i*.13))*41).toFixed(0)}%`;frequencies.append(b);}
  window.setInterval(()=>{
    [...bars.children].forEach((b,i)=>{b.style.height=(15+Math.abs(Math.sin(state.seconds*.43+i*.7))*80)+'%';});
  },720);

  let frames=0,lastFPS=performance.now(),lastClockTick=0,fps=0;
  function frame(now){
    const delta=clamp((now-state.lastTick)/1000,0,.12);state.lastTick=now;
    if(state.playing){
      if(state.playbackMode==='showcase'){
        const next=state.showTime+delta*state.speed;
        if(next>=SHOW_DURATION)state.loops+=Math.floor(next/SHOW_DURATION);
        state.showTime=next%SHOW_DURATION;
        syncShowcase();
      } else {
        const previous=state.seconds;
        state.seconds=Math.min(scene.duration,state.seconds+delta*state.speed);
        if(state.seconds>=scene.duration){state.playing=false;toast('模拟任务已完成 · 可拖动时间轴回放');}
        const idx=scene.events.reduce((i,e,j)=>state.seconds>=e.t?j:i,0);
        if(idx>state.lastEvent)for(let i=Math.max(0,state.lastEvent+1);i<=idx;i++)sendEvent(scene.events[i]);
        state.lastEvent=idx;
      }
      updateHud();
    }
    renderer.render(state.playbackMode==='showcase'?state.showTime:state.seconds);
    window.PartmeAudio?.onFrame(state.showTime,state.playbackMode);
    frames++;
    if(now-lastFPS>=1000){
      fps=frames*1000/(now-lastFPS);frames=0;lastFPS=now;
      // Auto mode backs off only if sustained low FPS; manual override wins.
      if(state.qualitySetting==='auto'){
        state.lowFpsSeconds=fps<20?state.lowFpsSeconds+1:Math.max(0,state.lowFpsSeconds-2);
        if(state.lowFpsSeconds>=7 && state.quality!=='lite'){
          state.quality=state.quality==='high'?'balanced':'lite';
          state.graph=obtainGraph(state.mode);renderer.cacheDirty=true;state.lowFpsSeconds=0;
          $('qualityBtn').textContent='QUALITY / '+state.quality.toUpperCase();
        }
      }
    }
    if(now-lastClockTick>=1000){
      $('headerClock').textContent=new Date().toLocaleTimeString('en-GB',{hour12:false});lastClockTick=now;
    }
    requestAnimationFrame(frame);
  }
  $('scenarioTitle').textContent=scene.title;$('panelEyebrow').textContent=scene.subtitle;
  $('headerClock').textContent=new Date().toLocaleTimeString('en-GB',{hour12:false});
  $('qualityBtn').textContent='QUALITY / '+state.quality.toUpperCase();
  syncShowcase(true);updatePlaybackButtons();updateHud(true);
  requestAnimationFrame(frame);
  // Read-only trace projections and deterministic video sample access.
  window.PartmeNeuralMatrix={
    getState:()=>({mode:state.mode,seconds:state.seconds,showTime:state.showTime,playbackMode:state.playbackMode,
      playing:state.playing,speed:state.speed,loops:state.loops,showDuration:SHOW_DURATION,
      selectedNode:scene.agents[state.selected].id,eventsTotal:scene.events.length,simulated:true,fps,
      quality:state.quality,graphStats:{nodes:state.graph.nodes.length,edges:state.graph.edges.length,
      filaments:state.graph.filaments.length,dust:state.graph.dust.length,streams:state.graph.streams.length,packets:state.graph.packets.length},
      ringAngles:{main:TAU*state.showTime/SHOW_DURATION,secondary:-2*TAU*state.showTime/SHOW_DURATION}}),
    changeMode,seek,selectAgent,startShowcase,setShowTime,
    setQuality:(quality)=>{
      if(!DENSITY[quality])return false;
      state.qualitySetting=quality;state.quality=quality;
      state.graph=obtainGraph(state.mode);renderer.cacheDirty=true;
      $('qualityBtn').textContent='QUALITY / '+state.quality.toUpperCase();updateHud(true);return true;
    },
    renderAt:(time)=>{
      state.playing=false;state.playbackMode='showcase';setShowTime(time);
      updatePlaybackButtons();renderer.render(state.showTime);return state.showTime;
    },
    on:(event,listener)=>eventBus.addEventListener(event,listener),
    off:(event,listener)=>eventBus.removeEventListener(event,listener)
  };
})();