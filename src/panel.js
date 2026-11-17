/* Premium yönetim paneli */
(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var KEY='bto-panel', pw=sessionStorage.getItem(KEY)||'', state=null;
  var CATN={yurtici:'Yurt içi',deniz:'Deniz',yurtdisi:'Yurt dışı'};
  var IMGS=['kapadokya.svg','mavi-yolculuk.svg','akdeniz.svg','karadeniz.svg','istanbul.svg','kibris.svg','sehir.svg','yol.svg','ucak.svg','ankara.svg'];
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
  function toast(t){var el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show')},2400)}
  function api(path,opt){opt=opt||{};opt.headers=Object.assign({'Content-Type':'application/json',Authorization:'Bearer '+pw},opt.headers||{});
    return fetch(path,opt).then(function(r){return r.json().catch(function(){return {}}).then(function(j){j._status=r.status;return j})})}

  function login(p){
    pw=p; return api('/api/login',{method:'POST'}).then(function(j){
      if(j.ok){sessionStorage.setItem(KEY,pw);$('#login').hidden=true;$('#dash').hidden=false;$('#store-warn').hidden=!!j.store;load();return true}
      sessionStorage.removeItem(KEY);var e=$('#login .form-err');e.textContent=j.message||'Giriş yapılamadı.';e.hidden=false;return false;
    });
  }
  $('#login-f').addEventListener('submit',function(e){e.preventDefault();login(this.elements.pw.value)});
  $('#logout').addEventListener('click',function(){sessionStorage.removeItem(KEY);location.reload()});
  if(pw) login(pw);

  function load(){
    api('/api/leads').then(function(j){renderLeads(j.leads||[], j._status)});
    fetch('/api/content').then(function(r){return r.json()}).catch(function(){return {}}).then(function(j){
      var c=j&&j.content;
      state={announce:(c&&c.announce)||{on:false,text:''},tours:(c&&c.tours&&c.tours.length)?c.tours:JSON.parse(JSON.stringify(window.BTO_DEFAULT_TOURS))};
      renderTours(); $('#an-on').checked=!!state.announce.on; $('#an-text').value=state.announce.text||'';
    });
  }

  function renderLeads(list,status){
    var box=$('#leads');
    if(status===503){box.innerHTML='<p class="muted">Kayıt deposu bağlı değil. Talepler e-postanıza gelir.</p>';return}
    var open=list.filter(function(l){return !l.done}).length, c=$('#lead-count'); c.textContent=open; c.hidden=!open;
    if(!list.length){box.innerHTML='<p class="muted">Henüz talep yok. Sitedeki formlardan gelen istekler burada listelenir.</p>';return}
    box.innerHTML=list.map(function(l){
      var f=l.fields||{}, d=new Date(l.at);
      var det=Object.keys(f).filter(function(k){return ['ad','tel','konu'].indexOf(k)<0}).map(function(k){return esc(f[k])}).join(' · ');
      return '<div class="lead-i'+(l.done?' done':'')+'"><div><b>'+esc(f.ad)+'</b> &nbsp;<a href="tel:'+esc(f.tel)+'">'+esc(f.tel)+'</a>'+
        '<div class="meta">'+esc(f.konu||'')+' | '+esc(l.page)+' | '+d.toLocaleString('tr-TR',{dateStyle:'short',timeStyle:'short'})+'</div>'+(det?'<div>'+det+'</div>':'')+'</div>'+
        '<label class="switch"><input type="checkbox" data-lead="'+esc(l.id)+'"'+(l.done?' checked':'')+'> Arandı</label></div>';
    }).join('');
  }
  $('#leads').addEventListener('change',function(e){
    var id=e.target.dataset.lead; if(!id) return;
    api('/api/leads',{method:'PATCH',body:JSON.stringify({id:id,done:e.target.checked})}).then(function(){e.target.closest('.lead-i').classList.toggle('done',e.target.checked);load()});
  });

  function opt(list,v,lab){return list.map(function(x){return '<option value="'+x+'"'+(x===v?' selected':'')+'>'+(lab?lab[x]:x)+'</option>'}).join('')}
  function renderTours(){
    $('#rows').innerHTML=state.tours.map(function(t,i){
      return '<tr data-i="'+i+'"><td><input type="text" data-k="title" value="'+esc(t.title)+'" aria-label="Tur adı"><input type="text" data-k="loc" value="'+esc(t.loc||'')+'" placeholder="Yer" aria-label="Yer" style="margin-top:6px"></td>'+
        '<td><select data-k="cat" aria-label="Tür">'+opt(Object.keys(CATN),t.cat,CATN)+'</select><select data-k="img" aria-label="Görsel" style="margin-top:6px">'+opt(IMGS,t.img)+'</select></td>'+
        '<td><input type="text" data-k="price" value="'+esc(t.price||'')+'" placeholder="Örn: 4.950 TL" aria-label="Fiyat"></td>'+
        '<td><input type="text" data-k="badge" value="'+esc(t.badge||'')+'" placeholder="Örn: Son 3 yer" aria-label="Kampanya etiketi"></td>'+
        '<td><label class="switch"><input type="checkbox" data-k="on"'+(t.on?' checked':'')+'> Yayında</label></td>'+
        '<td><button class="del" type="button" data-del="'+i+'">Sil</button></td></tr>';
    }).join('');
  }
  function collect(){
    $$('#rows tr').forEach(function(r){var t=state.tours[+r.dataset.i];
      $$('[data-k]',r).forEach(function(el){t[el.dataset.k]=el.type==='checkbox'?el.checked:el.value.trim()})});
    state.announce={on:$('#an-on').checked,text:$('#an-text').value.trim()};
  }
  function save(msg){
    collect();
    api('/api/content',{method:'PUT',body:JSON.stringify(state)}).then(function(j){
      if(j.ok){state=j.content;renderTours();toast(msg||'Kaydedildi. Sitede birazdan görünür.')}
      else toast(j._status===503?'Kayıt deposu bağlı değil, kaydedilemedi.':(j._status===401?'Oturum süresi doldu, tekrar giriş yapın.':'Kaydedilemedi.'));
    });
  }
  $('#rows').addEventListener('click',function(e){var i=e.target.dataset.del; if(i==null) return; collect(); if(confirm('"'+state.tours[+i].title+'" silinsin mi?')){state.tours.splice(+i,1);renderTours()}});
  $('#save').addEventListener('click',function(){save()});
  $('#an-save').addEventListener('click',function(){save('Duyuru kaydedildi.')});
  $('#add').addEventListener('click',function(){collect();state.tours.push({id:'t'+Date.now(),title:'Yeni tur',loc:'',cat:'yurtici',img:'yol.svg',icon:'globe',inc:[],badge:'',price:'',on:false});renderTours();$('#rows tr:last-child input').focus()});
  $('#reset').addEventListener('click',function(){if(confirm('Tüm tur değişiklikleri silinip varsayılan turlar geri yüklensin mi?')){state.tours=JSON.parse(JSON.stringify(window.BTO_DEFAULT_TOURS));renderTours();save('Varsayılan turlar geri yüklendi.')}});
})();
