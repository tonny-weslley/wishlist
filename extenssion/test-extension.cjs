const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/popup.js','utf8');
const extractor=source.slice(source.indexOf('function captureProduct()'),source.indexOf('function previewImage()'));
function run({json=[],meta=[],nodes=[],host='example.com',title='Produto',h1='Nome visível',images=[]}={}){
 const document={title,querySelector:s=>h1?{textContent:h1}:null,querySelectorAll:s=>s==='meta'?meta:s==='script[type="application/ld+json"]'?json.map(v=>({textContent:typeof v==='string'?v:JSON.stringify(v)})):s.includes('img')||s==='[itemprop="image"]'?images:nodes};
 return vm.runInNewContext(extractor+';captureProduct()',{document,navigator:{language:'pt-BR'},location:{hostname:host,href:'https://'+host+'/produto#tracking'},URL,getComputedStyle:()=>({visibility:'visible'})});
}
let r=run({json:[{'@graph':[{'@type':'Product',name:'Produto JSON',image:'/foto.jpg',offers:{price:'1.299,90',priceCurrency:'BRL'}}]}]});
assert.equal(r.price,1299.9);assert.equal(r.image,'https://example.com/foto.jpg');assert.equal(r.name,'Nome visível');assert.equal(r.url,'https://example.com/produto');
r=run({json:['invalid'],h1:''});assert.equal(r.price,null);assert.equal(r.name,'Produto');
function node(fraction,cents,parent='Preço total',visible=true){return{getClientRects:()=>visible?[{}]:[],closest:()=>null,querySelector:s=>s.includes('__fraction')?{textContent:fraction}:s.includes('__cents')&&cents?{textContent:cents}:null,getAttribute:()=>null,parentElement:{textContent:parent},textContent:fraction}}
r=run({host:'www.mercadolivre.com.br',nodes:[node('7.499','90')]});assert.equal(r.price,7499.9);assert.equal(r.currency,'BRL');assert.equal(r.candidates.length,1);
r=run({host:'www.mercadolivre.com.br',nodes:[node('749','90','10x sem juros')]});assert.equal(r.price,null);
r=run({nodes:[node('123','45','Preço',false)]});assert.equal(r.price,null);
r=run({json:[{'@type':'Product',offers:{lowPrice:100,priceCurrency:'USD'}}]});assert.equal(r.price,100);assert.match(r.candidates[0].label,/Menor/);
r=run({host:'www.mercadolivre.com.br',nodes:[node('5.999',null)]});assert.equal(r.price,5999);
r=run({host:'www.mercadolivre.com.br',nodes:[node('5.999','90')]});assert.equal(r.price,5999.9);
r=run({host:'www.mercadolivre.com.br',nodes:[node('12.345',null)]});assert.equal(r.price,12345);
r=run({host:'www.mercadolivre.com.br',images:[{getClientRects:()=>[{}],getAttribute:n=>n==='data-zoom'?'https://http2.mlstatic.com/D_NQ_NP_123-O.webp':null}]});assert.equal(r.image,'https://http2.mlstatic.com/D_NQ_NP_123-O.webp');
r=run({host:'www.mercadolivre.com.br',images:[{getClientRects:()=>[{}],currentSrc:'https://http2.mlstatic.com/image.webp',getAttribute:()=>null}]});assert.equal(r.image,'https://http2.mlstatic.com/image.webp');

console.log('Extração de preços e WebP: OK');
