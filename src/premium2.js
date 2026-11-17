/* Premium: kayan görseller, arama kutusu, panelden gelen içerik */
(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* kayan görseller */
  var slides=$$('.hero .slide'), dots=$$('.hero .dots button'), h=$('#hero-h'), i=0, timer;
  function show(n){i=(n+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('on',k===i)});dots.forEach(function(d,k){d.setAttribute('aria-current',String(k===i))})}
  function play(){if(reduce||slides.length<2)return;clearInterval(timer);timer=setInterval(function(){show(i+1)},6000)}
  dots.forEach(function(d,k){d.addEventListener('click',function(){show(k);play()})});
  var hero=$('.hero'); if(hero){hero.addEventListener('mouseenter',function(){clearInterval(timer)});hero.addEventListener('mouseleave',play)}
  play();

  /* arama kutusu: seçimleri özetleyip fiyat formuna taşı */
  $$('.sform').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var parts=[], q=new URLSearchParams();
      q.set('konu',f.dataset.konu);
      [].forEach.call(f.elements,function(el){
        if(!el.name||el.type==='hidden'||el.type==='submit'||!el.value) return;
        var lab=el.closest('label'); var t=lab?lab.querySelector('span').textContent:el.name;
        parts.push(t+': '+el.value);
        if(el.name==='nereye'||el.name==='tarih') q.set(el.name,el.value);
      });
      q.set('not',parts.join(', '));
      if(window.BTO_PREVIEW){var tf=document.querySelector('#talep form');if(tf){tf.elements.konu.value=f.dataset.konu;tf.elements.not.value=q.get('not');if(q.get('nereye'))tf.elements.nereye.value=q.get('nereye');if(q.get('tarih'))tf.elements.tarih.value=q.get('tarih')}location.hash='talep';return}
      location.href='/iletisim/?'+q.toString()+'#talep';
    });
  });

  /* panelden gelen içerik */
  var CATN={yurtici:'Yurt içi',deniz:'Deniz',yurtdisi:'Yurt dışı'};
  var PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>';
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
  function href(t){return t.href||('/iletisim/?konu=Tur&not='+encodeURIComponent(t.title)+'#talep')}
  function card(t){
    var price=t.price?'<small>kişi başı, başlayan</small><b>'+esc(t.price)+'</b>':'<small>Fiyat</small><b class="ask">Size özel teklif</b>';
    return '<a class="card" data-cat="'+esc(t.cat)+'" href="'+esc(href(t))+'"><div class="ph"><img src="/img/'+esc(t.img||'yol.svg')+'" alt="" loading="lazy" width="600" height="450">'+
      (t.badge?'<span class="badge">'+esc(t.badge)+'</span>':'')+'<span class="cat">'+(CATN[t.cat]||'')+'</span></div><div class="bd"><span class="loc">'+PIN+esc(t.loc||'')+'</span>'+
      '<h3>'+esc(t.title)+'</h3><div class="inc">'+(t.inc||[]).map(function(x){return '<span>'+esc(x)+'</span>'}).join('')+'</div>'+
      '<div class="ft"><div class="pr">'+price+'</div><span class="btn btn-primary btn-sm">İncele</span></div></div></a>';
  }
  function apply(c){
    var a=$('#announce');
    if(a&&c.announce&&c.announce.on&&c.announce.text){a.innerHTML=esc(c.announce.text)+' <a href="/iletisim/#talep">Bilgi alın</a>';a.hidden=false}
    if(!c.tours||!c.tours.length) return;
    var pub=c.tours.filter(function(t){return t.on});
    var f=$('#featured'); if(f) f.innerHTML=pub.slice(0,8).map(card).join('');
    var g=$('#tourgrid'); if(g){g.innerHTML=pub.map(card).join('');var act=$('[data-filter="tourgrid"] [aria-pressed="true"]');if(act&&act.dataset.cat!=='hepsi')act.click()}
  }
  if($('#announce')&&!$('#dash')){
    fetch('/api/content').then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.content)apply(j.content)}).catch(function(){});
  }
})();
