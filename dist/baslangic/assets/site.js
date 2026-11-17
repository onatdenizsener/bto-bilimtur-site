/* BTO ortak site betiği: menü, formlar, filtreler */
(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var WA=document.documentElement.dataset.wa||'';

  /* menü */
  var btn=$('.menu-btn'), nav=$('#menu');
  if(btn&&nav){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(o))});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus()}});
  }

  /* adres çubuğundaki ?konu=..&not=.. bilgileriyle formu doldur (arama kutusundan gelince) */
  try{
    var q=new URLSearchParams(location.search);
    $$('[data-form] form').forEach(function(f){
      q.forEach(function(v,k){var el=f.elements[k]; if(!el) return;
        if(el.tagName==='SELECT'){ if(![].some.call(el.options,function(o){return o.text===v})){var o=document.createElement('option');o.text=v;el.add(o,0)} el.value=v; }
        else el.value=v;});
    });
  }catch(e){}

  /* formlar */
  var started=Date.now();
  function msg(code,server){
    if(server) return server;
    if(code==='missing') return 'Adınızı ve telefon numaranızı yazın.';
    if(code==='kvkk') return 'Devam etmek için aydınlatma metnini onaylayın.';
    return null;
  }
  document.addEventListener('submit',function(e){
    var box=e.target.closest('[data-form]'); if(!box) return;
    e.preventDefault();
    var f=e.target, err=$('.form-err',box), b=$('button[type=submit]',f);
    var data={}; new FormData(f).forEach(function(v,k){data[k]=v});
    data.kvkk=f.elements.kvkk&&f.elements.kvkk.checked; data.t=started; data.page=location.pathname;
    var tel=String(data.tel||'').replace(/[^\d+]/g,'');
    var local=!data.ad?'missing':(tel.length<10?'missing':(!data.kvkk?'kvkk':null));
    if(local){err.textContent=msg(local);err.hidden=false;(local==='kvkk'?f.elements.kvkk:(!data.ad?f.elements.ad:f.elements.tel)).focus();return}
    err.hidden=true;
    if(window.BTO_PREVIEW){f.hidden=true;var tt=$('.form-title',box);if(tt)tt.hidden=true;var ok0=$('.form-ok',box);ok0.innerHTML='<b>Önizleme: form çalışıyor.</b> Yayındaki sitede bu talep firmaya e-postayla gider'+(document.body.dataset.tier==='premium'?' ve yönetim paneline düşer.':'.');ok0.hidden=false;ok0.focus();return}
    b.disabled=true; var label=b.textContent; b.textContent='Gönderiliyor…';
    fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok&&j.ok,j:j}})})
      .catch(function(){return {ok:false,j:{}}})
      .then(function(res){
        b.disabled=false; b.textContent=label;
        if(res.ok){f.hidden=true;$('.form-title',box)&&($('.form-title',box).hidden=true);var ok=$('.form-ok',box);ok.hidden=false;ok.focus();return}
        var text=msg(res.j.error,res.j.message);
        if(!text){
          var wa='https://wa.me/'+WA+'?text='+encodeURIComponent('Merhaba, '+(data.konu||'')+' için bilgi almak istiyorum. '+(data.not||'')+' ('+data.ad+')');
          err.innerHTML='Talebiniz şu an gönderilemedi. Bize <a href="'+wa+'">WhatsApp\'tan yazın</a> ya da <a href="tel:'+document.documentElement.dataset.tel+'">arayın</a>.';
        } else err.textContent=text;
        err.hidden=false;
      });
  });

  /* filtre düğmeleri */
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-filter] button'); if(!b) return;
    var wrap=b.closest('[data-filter]'), grid=document.getElementById(wrap.dataset.filter), c=b.dataset.cat;
    $$('button',wrap).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
    [].forEach.call(grid.children,function(t){t.hidden=!(c==='hepsi'||(' '+(t.dataset.cat||'')+' ').indexOf(' '+c+' ')>-1)});
  });

  /* vize seçici */
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-visa]'); if(!b||!window.BTO_VISA) return;
    $$('[data-visa]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
    var v=BTO_VISA[b.dataset.visa]; $('#visa-title').textContent=v.t;
    $('#visa-items').innerHTML=v.items.map(function(i){var li=document.createElement('li');li.textContent=i;return li.outerHTML}).join('');
  });
  var fv=$('[data-visa]'); if(fv&&window.BTO_VISA) fv.click();

  /* sekmeler (arama kutusu) */
  document.addEventListener('click',function(e){
    var t=e.target.closest('[role=tab]'); if(!t) return;
    var list=t.closest('[role=tablist]');
    $$('[role=tab]',list).forEach(function(x){var on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});
  });
  document.addEventListener('keydown',function(e){
    var t=e.target.closest&&e.target.closest('[role=tab]'); if(!t||(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')) return;
    var tabs=$$('[role=tab]',t.closest('[role=tablist]')), i=tabs.indexOf(t)+(e.key==='ArrowRight'?1:-1);
    var n=tabs[(i+tabs.length)%tabs.length]; n.click(); n.focus();
  });

  /* görününce beliren başlıklar */
  var els=$$('.reveal');
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.15});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});
})();

