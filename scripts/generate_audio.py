"""Partme V3 original 40-second / 96 BPM enterprise soundtracks.
Sound design: evolving harmonic pads, soft sub harmonics, sparse glass plucks,
subtle airy transition sweeps. No stock/licensed material and no hard retro bleeps.
"""
from pathlib import Path
import numpy as np, subprocess, wave
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/assets';OUT.mkdir(parents=True,exist_ok=True)
FS=32000;D=40;N=FS*D
T=np.arange(N,dtype=np.float64)/FS
RNG=np.random.default_rng(741)
BEAT=.625
TWOPI=2*np.pi

def hz(m):return 440*2**((m-69)/12)
def periodic_hz(h):return round(h*D)/D
def oscill(f,ph=0):return np.sin(TWOPI*periodic_hz(f)*T+ph).astype('float32')
def smooth(x):x=np.clip(x,0,1);return x*x*(3-2*x)
def chord_weight(i):
 center=5+10*i
 d=abs(((T-center+20)%40)-20)
 return smooth((6.6-d)/1.8).astype('float32')
chords=[[54,57,61,64,68,73],[50,54,57,61,64,69],[45,52,57,61,64,71],[52,56,59,63,66,71]]
roots=[42,38,45,40]

def result():return np.zeros((2,N),dtype='float32')
def add(buffer,sound,amount,pan=0):
 buffer[0]+=sound*amount*np.sqrt((1-pan)/2)
 buffer[1]+=sound*amount*np.sqrt((1+pan)/2)
def pluck(out,step,notes,level):
 note=notes[[0,2,4,3,5,2,1,4,3,5,4,2,0,3,2,4][step%16]]
 f=hz(note)
 length=int(.68*FS);tt=np.arange(length)/FS
 env=(1-np.exp(-tt*150))*np.exp(-tt*5.5)
 s=env*(.84*np.sin(TWOPI*f*tt)+.12*np.sin(TWOPI*2.001*f*tt+.7))
 idx=(round(step*BEAT*FS)+np.arange(length))%N
 p=(-.62 if step%2 else .62)
 out[0,idx]+=(s*level*np.sqrt((1-p)/2)).astype('float32')
 out[1,idx]+=(s*level*np.sqrt((1+p)/2)).astype('float32')

def do(mode):
 x=result()
 for i,notes in enumerate(chords):
  w=chord_weight(i)
  for j,m in enumerate(notes):
   f=hz(m)
   padwave=(.74*oscill(f,.24*j)+.17*oscill(f*2,.42)+.09*oscill(f*1.003,1.4*j))*w
   trem=1+.08*np.sin(TWOPI*(j%3+2)/40*T+j*1.33)
   add(x,padwave*trem,(.030 if j<3 else .022)*(1 if mode=='ambient' else .78),(-.4 if j%2 else .40))
  root=hz(roots[i]);sub=(.86*oscill(root)+.11*oscill(root*2))*w
  add(x,sub,.047 if mode=='ambient' else .037)
 sp=result()
 for j in range(64):
  if mode=='ambient' and j%4 not in (0,2):continue
  pluck(sp,j,chords[(j//16)%4],(.012 if mode=='ambient' else .020))
 # original periodic echo and musical space (no imported samples)
 for delay,amt in [(.23,.25),(.49,.14),(.79,.11)]:
  off=int(delay*FS)
  x[0]+=amt*np.roll(sp[1],off)
  x[1]+=amt*np.roll(sp[0],off)
 x+=sp
 # unobtrusive air, filtered deterministic texture
 noise=RNG.standard_normal(N).astype('float32')
 from scipy.signal import butter,sosfilt
 noise=sosfilt(butter(2,[550,1850],fs=FS,btype='bandpass',output='sos'),noise)
 for i in range(4):
  delta=(T-(i*10+8.35)+40)%40
  d=np.minimum(delta,40-delta)
  env=np.exp(-(d/1.0)**2).astype('float32')
  add(x,noise*env,.018 if mode=='ambient' else .023, -.22 if i%2 else .22)
 if mode=='pulse':
  # soft sub rhythmic movement; round, not 8-bit or ticking game SFX.
  for beat in range(64):
   size=int(.37*FS);tt=np.arange(size)/FS
   phase=TWOPI*(54*tt+1.4*(1-np.exp(-tt*18)))
   s=(np.sin(phase)*(1-np.exp(-tt*56))*np.exp(-tt*12))
   vol=.05 if beat%4==0 else .012
   ids=(round(beat*BEAT*FS)+np.arange(size))%N
   x[0,ids]+=(s*vol*.707).astype('float32')
   x[1,ids]+=(s*vol*.707).astype('float32')
 x=np.tanh(x*2.65).astype('float32')
 peak=np.max(abs(x));x*=.83/max(peak,.83)
 # click-free endpoints; no noticeable drop as both tracks have constant pads.
 seam=int(.024*FS)
 ramp=np.linspace(0,1,seam,dtype='float32')
 for c in range(2):
  x[c,:seam]*=ramp
  x[c,-seam:]*=ramp[::-1]
 data=(x.T*32767).astype('<i2')
 wav=OUT/f'partme-{mode}-40s.wav';mp3=OUT/f'partme-{mode}-40s.mp3'
 with wave.open(str(wav),'wb') as f:
  f.setnchannels(2);f.setsampwidth(2);f.setframerate(FS);f.writeframes(data.tobytes())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','192k',str(mp3)],check=True)
 print(mode,round(float(np.max(abs(x))),3),round(float(np.sqrt(np.mean(x*x))),4),mp3.stat().st_size)
if __name__=='__main__':do('ambient');do('pulse')
