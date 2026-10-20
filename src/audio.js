/* Partme Neural Matrix V3 — 40-second looping original scores.
   Click-to-enable required by browser autoplay restrictions. */
(() => {
 'use strict';
 const button=document.getElementById('audioBtn');
 const styleButton=document.getElementById('audioStyleBtn');
 const tracks={ambient:document.getElementById('bgMusic'),pulse:document.getElementById('bgMusicPulse')};
 if(!button||!styleButton||!tracks.ambient||!tracks.pulse)return;
 let enabled=false,score='ambient',music=tracks.ambient,lastSync=0;
 tracks.ambient.volume=.71;tracks.pulse.volume=.84;
 function time(){const s=window.PartmeNeuralMatrix?.getState();return s?.playbackMode==='showcase'?(s.showTime||0):(s.seconds||0)}
 function sync(){music.currentTime=((time()%40)+40)%40}
 function status(){button.textContent=enabled?'♫ SOUND ON':'♫ SOUND OFF';button.classList.toggle('enabled',enabled);button.setAttribute('aria-pressed',String(enabled));styleButton.textContent=score==='ambient'?'♬ AMBIENT':'♬ PULSE';styleButton.setAttribute('aria-label',score==='ambient'?'当前企业氛围，可切换到未来脉冲':'当前未来脉冲，可切换到企业氛围');styleButton.dataset.score=score}
 async function start(){enabled=true;sync();music.playbackRate=window.PartmeNeuralMatrix?.getState().speed||1;try{if(window.PartmeNeuralMatrix?.getState().playing)await music.play();status()}catch(e){enabled=false;music.pause();status();console.warn('Audio playback requires a click:',e)}}
 button.addEventListener('click',()=>{if(enabled){enabled=false;music.pause();status()}else start()});
 styleButton.addEventListener('click',async()=>{const wasPlaying=enabled&&!music.paused;music.pause();score=score==='ambient'?'pulse':'ambient';music=tracks[score];music.playbackRate=window.PartmeNeuralMatrix?.getState().speed||1;sync();status();if(wasPlaying)try{await music.play()}catch(e){enabled=false;status()}});
 window.PartmeAudio={
  getState:()=>({enabled,score,paused:music.paused,position:music.currentTime,volume:music.volume}),
  onMode(mode){if(!enabled)return;if(mode==='showcase'&&window.PartmeNeuralMatrix?.getState().playing){sync();music.play().catch(()=>{})}else music.pause()},
  onPlayback(playing,t){if(!enabled)return;if(playing){music.currentTime=((t%40)+40)%40;music.play().catch(()=>{})}else music.pause()},
  onSeek(t){if(enabled)music.currentTime=((t%40)+40)%40},
  setSpeed(rate){tracks.ambient.playbackRate=tracks.pulse.playbackRate=rate},
  onFrame(t,mode){if(!enabled||mode!=='showcase'||music.paused)return;const now=performance.now();if(now-lastSync<2500)return;lastSync=now;const delta=Math.abs(music.currentTime-t);if(Math.min(delta,40-delta)>.24)music.currentTime=((t%40)+40)%40}
 };
 status();
})();
