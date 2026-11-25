/* Creative Studio: local editor, no AI API or credentials. */
(function () {
  'use strict';
  const types = {
    auto:'Choose the most suitable creative direction based on the request. Distinguish photography from graphic design.',
    festival:'Design an editorial-quality festival poster. Use culturally appropriate motifs and a clear hierarchy; reserve clean space for exact event text. Do not invent event details.',
    photo:'Create believable professional photography with natural skin texture, realistic hands and anatomy, plausible lens perspective, motivated lighting and restrained color grading.',
    quote:'Design a refined quote poster with readable typography, generous margins and a respectful original portrait if supplied. Preserve the quotation verbatim.',
    redesign:'Redesign the uploaded artwork while retaining all supplied facts, names and original subject identity. Do not redraw the face unnecessarily.',
    wallpaper:'Create a cohesive wallpaper with strong composition and uncluttered areas for screen icons.',
    social:'Create a polished social media creative with a clear focal point and concise, legible copy.'
  };
  const sizes = {'1:1':[1080,1080],'4:5':[1080,1350],'9:16':[1080,1920],'16:9':[1920,1080],'3:2':[1500,1000]};
  const css = '.cs-overlay{position:fixed;inset:0;z-index:90;background:#f5f2eb;color:#26241e;overflow:auto;overscroll-behavior:contain;font:15px/1.5 system-ui,sans-serif}.cs-overlay *{box-sizing:border-box}.cs-wrap{max-width:1100px;margin:auto;padding:18px 18px 40px}.cs-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #dcd6c9;padding:8px 0 18px}.cs-kicker{font-size:11px;letter-spacing:.17em;text-transform:uppercase;color:#79532d;font-weight:800}.cs-title{font-family:Georgia,serif;font-size:clamp(25px,5vw,40px);line-height:1.15;margin:5px 0}.cs-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-top:18px}.cs-card{background:#fffdfa;border:1px solid #ded8cc;border-radius:18px;padding:18px;min-width:0}.cs-card h2{font-size:19px;margin:0 0 8px}.cs-muted{color:#655e53;font-size:13px;margin:6px 0 12px}.cs-overlay label{display:block;font-weight:650;margin:12px 0 5px;font-size:13px}.cs-overlay input:not([type=checkbox]),.cs-overlay select,.cs-overlay textarea{display:block;width:100%;border:1px solid #c9c1b1;background:#fff;color:#26241e;border-radius:10px;padding:10px;min-height:46px;font:inherit}.cs-overlay textarea{resize:vertical}.cs-overlay button,.cs-overlay a.cs-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 13px;border:1px solid #bdb5a5;border-radius:10px;background:#fff;color:#2c2923;font-weight:700;text-decoration:none;cursor:pointer;text-align:center;font:600 14px system-ui}.cs-overlay button:disabled{opacity:.5;cursor:not-allowed}.cs-overlay .cs-primary{background:#20483d;color:#fff;border-color:#20483d}.cs-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.cs-actions>*{flex:1 1 135px}.cs-pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cs-overlay .cs-check{display:flex;gap:9px;align-items:center;min-height:44px;margin:4px 0}.cs-check input{width:20px;height:20px}.cs-preview{background:#e7e1d5;border-radius:12px;padding:12px;display:grid;place-items:center;min-height:150px;overflow:hidden}.cs-preview [hidden]{display:none!important}.cs-preview canvas{display:block;max-width:100%;max-height:52vh;width:auto;height:auto;object-fit:contain}.cs-status{min-height:22px;font-size:13px;color:#315b48;white-space:pre-wrap;overflow-wrap:anywhere}.cs-overlay :focus-visible{outline:3px solid #a5783c;outline-offset:2px}.cs-history{max-height:160px;overflow:auto;display:grid;gap:5px}.cs-history button{text-align:left;justify-content:flex-start;overflow-wrap:anywhere}.cs-dark .cs-overlay{background:#171916;color:#f6efdf}.cs-dark .cs-card{background:#222720;border-color:#465044}.cs-dark .cs-muted,.cs-dark .cs-kicker{color:#d5c6a8}.cs-dark .cs-head{border-color:#465044}.cs-dark .cs-overlay input:not([type=checkbox]),.cs-dark .cs-overlay select,.cs-dark .cs-overlay textarea,.cs-dark .cs-overlay button:not(.cs-primary),.cs-dark .cs-overlay a.cs-btn{background:#30372e;color:#f6efdf;border-color:#586154}.cs-dark .cs-status{color:#a7d7ba}@media(max-width:760px){.cs-grid{grid-template-columns:1fr}.cs-wrap{padding:12px 12px 28px}.cs-card{padding:14px}}';
  window.openCreativeStudio = function (options) {
    if (!options || !options.isAuthorized()) return;
    if(document.getElementById('creative-studio-root')) return;
    const root = document.createElement('div');
    root.id='creative-studio-root';
    if(document.documentElement.classList.contains('dark')) root.className='cs-dark';
    root.innerHTML = '<style>'+css+'</style><section class="cs-overlay" role="dialog" aria-modal="true" aria-labelledby="cs-heading"><div class="cs-wrap"><header class="cs-head"><div><div class="cs-kicker">ISKCON Hadapsar / Admin tools</div><h1 class="cs-title" id="cs-heading">Creative Studio</h1><div class="cs-muted">Create with ChatGPT. Finish and share here.</div></div><button id="cs-close" type="button" aria-label="Close Creative Studio">Close ×</button></header><div class="cs-grid"><section class="cs-card"><h2>01 / Art direction</h2><p class="cs-muted">Write naturally in any language. The local prompt engine adds task-specific creative instructions. No extra AI API billing.</p><label for="cs-request">Your idea or instructions</label><textarea id="cs-request" rows="4" maxlength="6000" placeholder="e.g. Create a Marathi Ekadashi poster, elegant and realistic"></textarea><div class="cs-pair"><div><label for="cs-type">Creation type</label><select id="cs-type"><option value="auto">Auto select</option><option value="festival">Festival poster</option><option value="photo">Normal / realistic image</option><option value="quote">Daily quote</option><option value="redesign">Photo / poster redesign</option><option value="wallpaper">Wallpaper</option><option value="social">Social creative</option></select></div><div><label for="cs-style">Visual style</label><select id="cs-style"><option>Auto art direction</option><option>Premium editorial</option><option>Natural photography</option><option>Traditional Indian</option><option>Cinematic</option><option>Luxury minimal</option><option>Rich maximalism</option></select></div></div><div class="cs-pair"><div><label for="cs-ratio">Aspect ratio</label><select id="cs-ratio"><option>4:5</option><option>1:1</option><option>9:16</option><option>16:9</option><option>3:2</option></select></div><div><label for="cs-lang">Text language</label><select id="cs-lang"><option>Auto / as requested</option><option>Marathi</option><option>Hindi</option><option>English</option><option>Sanskrit</option><option>No text</option></select></div></div><label class="cs-check"><input id="cs-human" type="checkbox" checked> Natural / human-designed aesthetic</label><label class="cs-check"><input id="cs-face" type="checkbox" checked> Preserve identity in reference images</label><label class="cs-check"><input id="cs-brand" type="checkbox"> ISKCON Hadapsar branding</label><label for="cs-reference">Reference photos / artwork (optional)</label><input id="cs-reference" type="file" accept="image/*" multiple><p class="cs-muted">Attach these originals manually in ChatGPT. They are not uploaded by this panel.</p><div class="cs-actions"><button class="cs-primary" id="cs-build">Optimize prompt</button><button id="cs-copy">Copy prompt</button><a class="cs-btn" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Open ChatGPT ↗</a></div><label for="cs-output">Optimized prompt (editable)</label><textarea id="cs-output" rows="8" placeholder="Your optimized prompt appears here"></textarea><div class="cs-status" id="cs-pstatus" role="status"></div><h2>Recent prompts</h2><div class="cs-history" id="cs-history"></div><p class="cs-muted">Session only. No prompts or photos are sent to this server.</p></section><section class="cs-card"><h2>02 / Finish &amp; share</h2><p class="cs-muted">Save the image from ChatGPT, then import it here. Original images remain on your device.</p><label for="cs-image">Generated image</label><input id="cs-image" type="file" accept="image/*"><div class="cs-pair"><div><label for="cs-logo">Logo (optional)</label><input id="cs-logo" type="file" accept="image/*"></div><div><label for="cs-qr">QR image (optional)</label><input id="cs-qr" type="file" accept="image/*"></div></div><div class="cs-pair"><div><label for="cs-fit">Image fit</label><select id="cs-fit"><option value="contain">Keep entire image</option><option value="cover">Fill / crop</option></select></div><div><label for="cs-quality">Export size</label><select id="cs-quality"><option value="1">HD</option><option value="2">2× HD (larger)</option></select></div></div><label for="cs-footer">Optional footer text</label><input id="cs-footer" maxlength="100" placeholder="ISKCON Hadapsar"><label for="cs-caption">Sharing caption</label><textarea id="cs-caption" rows="3" placeholder="Hare Krishna! 🙏"></textarea><div class="cs-actions"><button id="cs-caption-copy">Copy caption</button></div><div class="cs-preview"><p id="cs-empty" class="cs-muted">Import a generated image to preview it.</p><canvas id="cs-canvas" hidden aria-label="Export image preview"></canvas></div><div class="cs-actions"><button class="cs-primary" id="cs-download" disabled>Download PNG</button><button id="cs-share" disabled>Share image</button></div><div class="cs-status" id="cs-istatus" role="status"></div><p class="cs-muted">Sharing uses your device share sheet when image files are supported. Otherwise download and attach the PNG manually. Check spellings, dates, image identity and QR scan before publishing.</p></section></div></div></section>';
    document.body.appendChild(root);
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const $=id=>root.querySelector('#cs-'+id);
    if(options.language==='mr') $('lang').value='Marathi';
    if(options.language==='hi') $('lang').value='Hindi';
    let active=true, photo=null, logo=null, qr=null, blob=null, revision=0, history=[], timers=[], urls=new Set(), versions={image:0,logo:0,qr:0};
    const trigger=document.activeElement;
    function close(){
      if(!active)return;
      active=false; revision++; observer.disconnect();
      document.removeEventListener('keydown',keys);
      timers.forEach(clearTimeout); urls.forEach(u=>URL.revokeObjectURL(u)); urls.clear();
      photo=logo=qr=blob=null; history=[]; $('canvas').width=1; $('canvas').height=1;
      root.remove(); document.body.style.overflow=previousOverflow;
      if(options.isAuthorized() && trigger && trigger.focus)trigger.focus();
    }
    function keys(e){
      if(e.key==='Escape'){close();return;}
      if(e.key==='Tab'){
        const list=Array.from(root.querySelectorAll('button:not(:disabled),a[href],input,select,textarea'));
        const first=list[0], last=list[list.length-1];
        if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
      }
    }
    document.addEventListener('keydown',keys);
    const observer=new MutationObserver(()=>{if(!options.isAuthorized())close();});
    observer.observe(options.dashboard,{attributes:true,attributeFilter:['style','class']});
    $('close').onclick=close;
    $('close').focus();
    const status=(kind,msg)=>{if(active) $(kind+'status').textContent=msg;};
    function build(){
      if(!active||!options.isAuthorized())return false;
      const request=$('request').value.trim();
      if(!request){status('p','Enter an idea first.');$('request').focus();return false;}
      const refs=Array.from($('reference').files);
      const type=$('type').value;
      const rules=[
        'Act as a senior art director, graphic designer and professional photographer. Generate the requested final image, not a description.',
        'USER CREATIVE BRIEF:\n'+request,
        'CREATIVE DIRECTION: '+types[type]+' Style: '+$('style').value+'. Aspect ratio: '+$('ratio').value+'. Text language: '+$('lang').value+'.',
        'Use an intentional focal point, balanced negative space, professional visual hierarchy and a coherent palette. Adapt these rules to the actual subject rather than forcing a poster layout on a normal image.',
        'Preserve supplied wording, dates, names and religious details. Do not invent quotations or factual information. If essential text is missing, ask before inventing it. Render only the requested text, with correct script and spelling.',
        $('human').checked?'Avoid generic AI aesthetics: plastic skin, waxy faces, excessive HDR, random ornament, fake bokeh, oversaturation, repetitive textures, malformed hands, distorted lettering and unmotivated glow. Prefer authentic textures, restrained retouching, believable shadows and typography crafted for the content.':'',
        $('face').checked?'When reference portraits are attached, preserve identity, facial structure, age, complexion and distinguishing features as closely as possible. Do not change religious clothing or accessories without instruction.':'',
        $('brand').checked?'Use tasteful ISKCON Hadapsar branding only where relevant. Use the actual supplied logo if available; otherwise leave space rather than inventing an official logo.':'',
        refs.length?'Reference images will be attached manually; use them according to the brief.':'',
        'Inspect the composition and text before finalizing. Do not claim exact facial reproduction or perfect spelling if uncertain.'
      ].filter(Boolean);
      $('output').value=rules.join('\n\n');
      history.unshift({request,output:$('output').value});history=history.slice(0,8);
      $('history').replaceChildren();
      history.forEach(h=>{const b=document.createElement('button');b.type='button';b.textContent=h.request.slice(0,100);b.onclick=()=>{$('request').value=h.request;$('output').value=h.output;status('p','Saved prompt restored.');};$('history').appendChild(b);});
      status('p','Prompt ready. Copy it, open ChatGPT, attach references if needed and generate.');
      return true;
    }
    async function copy(field,kind){
      const v=$(field).value.trim();
      if(!v){status(kind,'Nothing to copy yet.');return;}
      try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(v);status(kind,'Copied.');}
      catch(e){$(field).focus();$(field).select();status(kind,'Clipboard unavailable. Select and copy the highlighted text manually.');}
    }
    $('build').onclick=build;
    $('copy').onclick=()=>{if($('output').value.trim()||build())copy('output','p');};
    $('caption-copy').onclick=()=>copy('caption','i');
    async function load(file){
      if(!file || !file.type.startsWith('image/') || file.size>15*1024*1024)throw Error('Choose an image up to 15 MB.');
      const url=URL.createObjectURL(file);urls.add(url);
      try {
        const img=new Image();img.src=url;
        await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('This image format could not be opened. Try PNG or JPEG.'));if(img.complete&&img.naturalWidth)resolve();});
        if(img.naturalWidth*img.naturalHeight>24000000)throw Error('Image is too large. Resize below 24 megapixels first.');
        return img;
      }finally{URL.revokeObjectURL(url);urls.delete(url);}
    }
    function buttons(on){$('download').disabled=!on;$('share').disabled=!on;}
    async function render(){
      if(!active||!options.isAuthorized())return;
      const id=++revision;blob=null;buttons(false);
      if(!photo){$('canvas').hidden=true;$('empty').hidden=false;return;}
      try{
        const canvas=$('canvas');const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable.');
        const base=sizes[$('ratio').value];const scale=Number($('quality').value);
        canvas.width=base[0]*scale;canvas.height=base[1]*scale;
        const w=canvas.width,h=canvas.height;ctx.fillStyle='#171c18';ctx.fillRect(0,0,w,h);
        const factor=Math[$('fit').value==='cover'?'max':'min'](w/photo.naturalWidth,h/photo.naturalHeight);
        const pw=photo.naturalWidth*factor,ph=photo.naturalHeight*factor;
        ctx.drawImage(photo,(w-pw)/2,(h-ph)/2,pw,ph);
        const margin=Math.round(Math.min(w,h)*.035);
        function overlay(img,max,side){
          const k=Math.min(max/img.naturalWidth,max/img.naturalHeight);
          const iw=img.naturalWidth*k,ih=img.naturalHeight*k;
          const x=side==='left'?margin:w-margin-iw;const y=side==='left'?margin:h-margin-ih;
          if(side==='right'){ctx.fillStyle='#fff';ctx.fillRect(x-margin/4,y-margin/4,iw+margin/2,ih+margin/2);}
          ctx.drawImage(img,x,y,iw,ih);
        }
        if(logo)overlay(logo,Math.min(w,h)*.16,'left');
        if(qr)overlay(qr,Math.min(w,h)*.19,'right');
        const footer=$('footer').value.trim();
        if(footer){
          const available=w-2*margin-(qr?Math.min(w,h)*.23:0);
          let fs=Math.round(Math.min(w,h)*.031);
          ctx.font='600 '+fs+'px system-ui, sans-serif';
          while(ctx.measureText(footer).width>available&&fs>12){fs--;ctx.font='600 '+fs+'px system-ui, sans-serif';}
          const tw=Math.min(available,ctx.measureText(footer).width);
          ctx.fillStyle='rgba(0,0,0,.78)';ctx.fillRect(margin,h-margin-fs*1.65,tw+margin/2,fs*1.65);
          ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.fillText(footer,margin+margin/4,h-margin-fs*.82,available-margin/2);
        }
        $('empty').hidden=true;canvas.hidden=false;status('i','Preparing PNG…');
        const result=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
        if(!active||id!==revision)return;
        if(!result)throw Error('PNG export failed. Try HD size.');
        blob=result;buttons(true);status('i',w+' × '+h+' PNG ready.');
      }catch(e){if(active&&id===revision)status('i',e.message||'Could not render image.');}
    }
    for(const id of ['image','logo','qr']){
      $(id).onchange=async()=>{
        const seq=++versions[id];const file=$(id).files[0];
        try{
          const img=file?await load(file):null;
          if(!active||seq!==versions[id])return;
          if(id==='image')photo=img;else if(id==='logo')logo=img;else qr=img;
          render();
        }catch(e){if(active&&seq===versions[id]){if(id==='image')photo=null;else if(id==='logo')logo=null;else qr=null;render();status('i',e.message);}}
      };
    }
    for(const id of ['ratio','fit','quality','footer'])$(id).addEventListener('change',render);
    function filename(){return 'bhakti-studio-'+Date.now()+'.png';}
    $('download').onclick=()=>{
      if(!blob||!options.isAuthorized())return;
      const url=URL.createObjectURL(blob);urls.add(url);const a=document.createElement('a');a.href=url;a.download=filename();root.appendChild(a);a.click();a.remove();
      timers.push(setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},60000));status('i','Download requested.');
    };
    $('share').onclick=async()=>{
      if(!blob||!options.isAuthorized())return;
      try{
        const file=new File([blob],filename(),{type:'image/png'});
        if(!navigator.share||!navigator.canShare||!navigator.canShare({files:[file]})){status('i','This device cannot share image files from the browser. Download the PNG and attach it in WhatsApp.');return;}
        await navigator.share({files:[file],text:$('caption').value.trim()});status('i','Share sheet completed.');
      }catch(e){status('i',e.name==='AbortError'?'Sharing cancelled.':'Sharing failed. Download the PNG and share it manually.');}
    };
  };
})();