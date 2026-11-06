(function(root){
'use strict';
// The same lock is shared by all app tabs on this origin. No stale writer can overwrite a newer revision.
class WishlistRepository{
 constructor(storage,locks,key,decode){this.storage=storage;this.locks=locks;this.key=key;this.decode=decode;this.base=null;this.blocked=false;this.lastGood=null}
 load(){try{this.base=this.storage.getItem(this.key);const data=this.base?this.decode(JSON.parse(this.base)):{version:2,items:[],lists:[]};this.lastGood=JSON.stringify(data);this.blocked=false;return data}catch(error){this.blocked=true;throw error}}
 async commit(value,{recover=false}={}){if(this.blocked&&!recover)throw Error('O cadastro não pôde ser lido. Exporte o original e restaure um backup.');if(!this.locks?.request)throw Error('Use Firefox ou Chrome atualizado em HTTPS ou localhost para salvar com segurança.');const data=this.decode(value),json=JSON.stringify(data);if(new TextEncoder().encode(json).length>WishlistSchema.limits.backupBytes)throw Error('Cadastro excede 10 MB. Exporte um backup e reduza os dados.');return this.locks.request('wishlist-write:'+this.key,async()=>{const disk=this.storage.getItem(this.key);if(disk!==this.base){const error=Error('Outra aba alterou o cadastro. Os dados foram atualizados; confira e salve novamente.');error.code='CONFLICT';throw error}this.storage.setItem(this.key,json);this.base=json;this.lastGood=json;this.blocked=false;return data})}
}
root.WishlistRepository=WishlistRepository;if(typeof module!=='undefined')module.exports=WishlistRepository;
})(typeof globalThis!=='undefined'?globalThis:this);
