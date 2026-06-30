export function renderAnimation(spec) {
  const sceneMeta = spec.scenes.map(({ id, start, duration, layout }) => ({ id, start, duration, layout }));
  return `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><script>
window.__timelines=window.__timelines||{};const sceneMeta=${JSON.stringify(sceneMeta)};const compositionId=${JSON.stringify(spec.meta.compositionId)};gsap.defaults({overwrite:"auto"});const tl=gsap.timeline({paused:true});
sceneMeta.forEach((scene,index)=>{const selector="#"+scene.id,start=scene.start,duration=scene.duration,end=start+duration;if(index>0)tl.set(selector,{opacity:1,y:0,filter:"blur(0px)"},start);
tl.from(selector+" .shape-one",{scale:0,rotate:-18,transformOrigin:"50% 50%",duration:.8,ease:"back.out(1.7)",immediateRender:false},start+.12);
tl.from(selector+" .shape-two",{scale:0,rotate:24,transformOrigin:"50% 50%",duration:.8,ease:"back.out(1.4)",immediateRender:false},start+.2);
tl.from(selector+" .shape-three",{scaleX:0,transformOrigin:"0% 50%",duration:.7,ease:"power4.out",immediateRender:false},start+.26);
tl.from(selector+" .kicker",{y:22,opacity:0,duration:.44,ease:"power3.out",immediateRender:false},start+.22);
tl.from(selector+" .title",{y:54,opacity:0,duration:.7,ease:"expo.out",immediateRender:false},start+.32);
tl.from(selector+" .lead",{y:34,opacity:0,duration:.55,ease:"power3.out",immediateRender:false},start+.54);
tl.from(selector+" .visual-stack, "+selector+" .metric-panel, "+selector+" .closing-panel",{y:38,scale:.985,opacity:0,duration:.72,ease:"power4.out",immediateRender:false},start+.42);
tl.from(selector+" .motif-piece",{scale:0,rotate:-8,transformOrigin:"50% 50%",stagger:.08,duration:.52,ease:"back.out(1.8)",immediateRender:false},start+.7);
tl.from(selector+" .info-card, "+selector+" .step-card, "+selector+" .metric-row",{y:46,opacity:0,stagger:.09,duration:.62,ease:"power4.out",immediateRender:false},start+.68);
tl.from(selector+" .caption",{y:24,opacity:0,duration:.45,ease:"power2.out",immediateRender:false},start+.92);
tl.to(selector+" .orbit-a",{rotate:360,duration,ease:"none"},start);tl.to(selector+" .orbit-b",{rotate:-260,duration,ease:"none"},start);tl.to(selector+" .shape-one",{x:22,y:-18,scale:1.04,duration,ease:"sine.inOut"},start);tl.to(selector+" .shape-two",{x:-18,y:18,rotate:28,duration,ease:"sine.inOut"},start);tl.to(selector+" .marquee-track",{xPercent:-28,duration,ease:"none"},start);tl.to(selector+" .pulse",{scale:1.018,duration:Math.max(1.8,duration/2),repeat:1,yoyo:true,ease:"sine.inOut"},start+.25);
if(index<sceneMeta.length-1)tl.to(selector,{opacity:0,y:-22,filter:"blur(8px)",duration:.55,ease:"power2.inOut"},Math.max(start+.1,end-.55));});
window.__timelines[compositionId]=tl;window.__captionTick=function(time){document.querySelectorAll(".timed-captions").forEach(box=>{const scene=box.closest(".scene");if(!scene)return;const sceneStart=Number(scene.dataset.start||0);const local=time-sceneStart;let active=false;box.querySelectorAll("span").forEach(span=>{const on=local>=Number(span.dataset.start)&&local<=Number(span.dataset.end);span.style.display=on?"block":"none";if(on)active=true;});box.style.display=active?"flex":"none";});};</script>`;
}
