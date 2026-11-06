// Rebuild both installable packages from the common extension source and shared schema.
const fs=require('node:fs'),path=require('node:path');const root=path.join(__dirname,'..'),src=path.join(root,'extenssion');
fs.copyFileSync(path.join(root,'assets/js/schema.js'),path.join(src,'schema.js'));
const prices=require(path.join(src,'prices.js'));let popup=fs.readFileSync(path.join(src,'popup.js'),'utf8');popup=popup.replace(/  const parsePrice=function[\s\S]*?;\n  const clean=/,'  const parsePrice='+prices.parsePrice.toString()+';\n  const clean=');fs.writeFileSync(path.join(src,'popup.js'),popup);
for(const target of ['firefox','chrome']){const dir=path.join(src,target);fs.mkdirSync(dir,{recursive:true});for(const name of ['popup.html','popup.css','popup.js','schema.js','prices.js','compat.js'])fs.copyFileSync(path.join(src,name),path.join(dir,name));const manifest=JSON.parse(fs.readFileSync(path.join(src,'manifest.'+target+'.json'),'utf8'));fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n')}
console.log('Pacotes Firefox e Chrome atualizados.');
