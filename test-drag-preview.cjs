const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/assets/js/products.js','utf8')+'\n'+fs.readFileSync(__dirname+'/assets/js/app.js','utf8');const code=html.slice(html.indexOf('function itemsByIds('),html.indexOf("$('#panel').addEventListener('keydown'"));
function harness(scope='__general__',offset=0){const events={},items=[{id:'a',name:'A'},{id:'b',name:'B'},{id:'c',name:'C'}],local={itemIds:['a','b','c']},cards=[];let saves=0,renders=0;const grid={classList:{add(){}},contains:node=>node===grid||cards.includes(node),getBoundingClientRect:()=>({left:0,right:330,top:0,bottom:200})};
 for(const [index,item] of items.entries()){const badge={textContent:'#'+(index+1)};const card={dataset:{itemId:item.id},style:{},classList:{add(){},remove(){}},getBoundingClientRect:()=>({left:Number(card.style.order??index)*110,top:0,width:100,height:200}),querySelector:()=>badge,setAttribute(){},closest(selector){return selector==='.item-card'?card:null},badge};cards.push(card)}
 const panel={addEventListener:(name,fn)=>events[name]=fn},count={textContent:''};const ctx={window:{scrollX:0,scrollY:offset,matchMedia:()=>({matches:true}),addEventListener:(n,f)=>events[n]=f},document:{querySelectorAll:()=>cards},$:selector=>selector==='#panel'?panel:selector==='#products'?grid:count,current:()=>scope==='__general__'?{itemIds:ctx.store.items.map(i=>i.id)}:local,store:{items:items.slice()},selected:scope,dragging:null,suppressClickUntil:0,manualEnabled:()=>true,requestAnimationFrame:f=>f(),save:()=>{saves++;return true},render:()=>{renders++;for(const c of cards)c.style.order='';},toast(){},Date};vm.createContext(ctx);vm.runInContext(code,ctx);
 function event(target,x,y=100){return{target,clientX:x,clientY:y,preventDefault(){},dataTransfer:{setData(){}}}}
 return{ctx,events,cards,local,grid,event,get saves(){return saves},get renders(){return renders}}}
(async()=>{
let h=harness();h.events.dragstart(h.event(h.cards[0],50));h.events.dragover(h.event(h.cards[2],270));assert.equal(h.ctx.dragging.preview.join(),'b,c,a');assert.equal(h.ctx.store.items.map(i=>i.id).join(),'a,b,c');assert.equal(h.saves,0);assert.equal(h.cards[0].style.order,'2');assert.equal(h.cards[1].badge.textContent,'#1');assert.equal(h.cards[2].badge.textContent,'#2');
// Hovering the same slot repeatedly must not make neighbours oscillate.
for(let n=0;n<10;n++)h.events.dragover(h.event(h.grid,270));assert.equal(h.ctx.dragging.preview.join(),'b,c,a');
await h.events.drop(h.event(h.grid,270));assert.equal(h.ctx.store.items.map(i=>i.id).join(),'b,c,a');assert.equal(h.saves,1);
h=harness();h.events.dragstart(h.event(h.cards[0],50));h.events.dragover(h.event(h.cards[2],270));h.events.dragend();assert.equal(h.ctx.store.items.map(i=>i.id).join(),'a,b,c');assert.equal(h.saves,0);assert.equal(h.ctx.dragging,null);
h=harness('list-id');h.events.dragstart(h.event(h.cards[0],50));h.events.dragover(h.event(h.cards[2],270));await h.events.drop(h.event(h.grid,270));assert.equal(h.local.itemIds.join(),'b,c,a');assert.equal(h.ctx.store.items.map(i=>i.id).join(),'a,b,c');
h=harness();h.events.dragstart(h.event(h.cards[0],50));h.events.dragover(h.event(h.cards[2],270));await h.events.drop(h.event({},500));assert.equal(h.saves,0);assert.equal(h.ctx.dragging,null);
h=harness();h.events.dragstart(h.event(h.cards[0],50));h.events.dragover(h.event(h.cards[2],270));h.events.resize();assert.equal(h.saves,0);assert.equal(h.ctx.dragging,null);
h=harness('__general__',500);h.events.dragstart(h.event(h.cards[0],50));h.events.dragover(h.event(h.cards[2],270));assert.equal(h.ctx.dragging.preview.join(),'b,c,a');
console.log('Prévia antes de soltar, deslocamento dos vizinhos, estabilidade, confirmação, cancelamento e prioridades independentes: OK');

})().catch(e=>{console.error(e);process.exitCode=1});
