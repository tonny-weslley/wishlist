const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/assets/js/app.js','utf8'),viewer=fs.readFileSync(__dirname+'/shared.html','utf8');
assert.ok(!html.includes('/api/'));assert.ok(!viewer.includes('/api/'));assert.ok(!html.includes('fetch('));assert.ok(!viewer.includes('fetch('));
const encodeCode=html.slice(html.indexOf('function encodeSnapshot('),html.indexOf('function openShare('));const ctx={TextEncoder,btoa};vm.createContext(ctx);vm.runInContext(encodeCode,ctx);
const snapshot={name:'Música 日本',description:'<img onerror=alert(1)>',items:[{name:'Violão',price:5999.9,currency:'BRL',image:'',url:'https://example.com/p',category:'Música',description:'Acentos çã',done:false}]};
const payload=ctx.encodeSnapshot(snapshot);assert.deepEqual(JSON.parse(Buffer.from(payload,'base64url').toString()),snapshot);
const script=[...viewer.matchAll(/<script[^>]*>(.*?)<\/script>/gs)].at(-1)[1];
function run(hash){const nodes={};function node(){return{children:[],textContent:'',hidden:true,append(...children){this.children.push(...children)},prepend(child){this.children.unshift(child)}}}const document={getElementById:id=>nodes[id]??=node(),createElement:()=>node()};vm.runInNewContext(script,{document,WishlistSchema:require('./assets/js/schema.js'),WishlistPlanning:require('./assets/js/planning.js'),location:{hash},URL,Intl,TextDecoder,Uint8Array,atob,Number,Date});return nodes}
let n=run('#snapshot='+payload);assert.equal(n.name.textContent,snapshot.name);assert.equal(n.items.children.length,1);assert.equal(n.description.textContent,snapshot.description);assert.equal(n.items.children[0].children[0].children[0].textContent,'Sem imagem');
for(const hash of ['','#snapshot=%%%','#snapshot='+Buffer.from('{}').toString('base64url'),'#snapshot='+ctx.encodeSnapshot({...snapshot,items:[{...snapshot.items[0],price:-1}]}),'#snapshot='+'a'.repeat(32001)])assert.equal(run(hash).error.hidden,false);
console.log('Sem APIs, cópia UTF-8, visualizador, links inseguros e dados inválidos: OK');
