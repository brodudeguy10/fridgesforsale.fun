/* renders the sound bank off the main thread. each sound is posted back
   the moment it's done, highest priority first. */
importScripts('sound-dsp.js', 'sound-bank.js');
self.onmessage = function(e){
  const msg = e.data || {};
  if(msg.cmd !== 'render') return;
  for(const name of msg.names){
    if(!self.VBANK[name]) continue;
    try{
      const r = self.VBANK_RENDER(name);
      const transfer = [];
      const data = r.data.map(d=>{
        if(d.L){ transfer.push(d.L.buffer, d.R.buffer); return { L:d.L, R:d.R }; }
        transfer.push(d.buffer); return d;
      });
      self.postMessage({ name, sr:r.sr, loop:r.loop, stereo:r.stereo, data }, transfer);
    }catch(err){ self.postMessage({ name, error:String(err) }); }
  }
  self.postMessage({ done:true, batch:msg.batch });
};
