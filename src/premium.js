(function(){
  var KEY='bto-demo-v1', D=window.BTO_DEFAULT, ICONS=window.BTO_ICONS;
  var S=load();
  function clone(o){return JSON.parse(JSON.stringify(o))}
  function load(){
    try{var r=localStorage.getItem(KEY); if(r) return JSON.parse(r);}catch(e){}
    return clone(D);
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function toast(t){var el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show')},2200)}
  var HREF={balon:'#/kapadokya',mavi:'#/mavi-yolculuk'};

  function renderAnnounce(){
    var a=document.getElementById('announce');
    a.hidden=!S.announce.on;
    a.innerHTML=esc(S.announce.text)+' <a href="#/iletisim">Bilgi alın</a>';
  }
  function card(t,feature){
    return '<a class="tour'+(feature?' feature':'')+'" data-cat="'+esc(t.cat)+'" href="'+(HREF[t.id]||'#/iletisim')+'">'+
      (t.badge?'<span class="badge">'+esc(t.badge)+'</span>':'')+
      '<div class="art">'+(ICONS[t.icon]||ICONS.globe)+'</div><h3>'+esc(t.title)+'</h3><p>'+esc(t.text)+'</p>'+
      '<span class="more">'+(HREF[t.id]?'Programı inceleyin':'Tarih ve fiyat sorun')+'</span></a>';
  }
  function renderTours(){
    var pub=S.tours.filter(function(t){return t.on});
    var f=document.getElementById('featured');
    if(f) f.innerHTML=pub.slice(0,3).map(function(t,i){return card(t,i===0)}).join('');
    var g=document.getElementById('tourgrid');
    if(g){
      g.innerHTML=pub.map(function(t,i){return card(t,i===0)}).join('')||'<p class="empty">Şu an yayında tur yok.</p>';
      var act=document.querySelector('[data-for="tourgrid"] [aria-pressed="true"]');
      if(act&&act.dataset.cat!=='hepsi') act.click();
    }
  }

  /* --- panel --- */
  function panelTab(name){
    document.querySelectorAll('.panel aside button[data-tab]').forEach(function(b){b.setAttribute('aria-current',b.dataset.tab===name)});
    document.querySelectorAll('.panel-tab').forEach(function(t){t.hidden=t.id!=='pt-'+name});
  }
  function renderPanel(){
    document.getElementById('an-on').checked=S.announce.on;
    document.getElementById('an-text').value=S.announce.text;
    var rows=S.tours.map(function(t,i){
      return '<tr data-i="'+i+'"><td><input type="text" data-k="title" value="'+esc(t.title)+'" aria-label="Tur adı"></td>'+
        '<td>'+esc(CATN[t.cat]||t.cat)+'</td>'+
        '<td><input type="text" data-k="badge" value="'+esc(t.badge||'')+'" placeholder="Örn: Erken rezervasyon" aria-label="Kampanya etiketi"></td>'+
        '<td><label class="switch"><input type="checkbox" data-k="on"'+(t.on?' checked':'')+'> Yayında</label></td>'+
        '<td><button class="del" type="button" data-del="'+i+'">Sil</button></td></tr>';
    }).join('');
    document.getElementById('pt-rows').innerHTML=rows;
    var open=S.leads.filter(function(l){return !l.done}).length;
    document.getElementById('lead-count').textContent=open;
    document.getElementById('lead-count').hidden=!open;
    document.getElementById('leads').innerHTML=S.leads.length? S.leads.slice().reverse().map(function(l){
      var i=S.leads.indexOf(l);
      return '<div class="lead-item'+(l.done?' done':'')+'"><div><b>'+esc(l.ad)+' &nbsp;<a href="tel:'+esc(l.tel)+'">'+esc(l.tel)+'</a></b>'+
        '<div class="meta">'+esc(l.konu)+' &nbsp;|&nbsp; '+esc(l.page)+' &nbsp;|&nbsp; '+esc(l.time)+'</div>'+(l.not?'<div>'+esc(l.not)+'</div>':'')+'</div>'+
        '<label class="switch"><input type="checkbox" data-lead="'+i+'"'+(l.done?' checked':'')+'> Arandı</label></div>';
    }).join('') : '<p class="empty">Henüz talep yok. Sitedeki herhangi bir formu doldurun, talep burada görünür.</p>';
  }
  var CATN={yurtici:'Yurt içi',deniz:'Deniz',yurtdisi:'Yurt dışı'};

  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.matches('.panel aside button[data-tab]')) panelTab(t.dataset.tab);
    if(t.dataset.del!=null){S.tours.splice(+t.dataset.del,1);renderPanel();}
    if(t.id==='p-save'||t.id==='an-save'){collect();save();renderAnnounce();renderTours();renderPanel();toast('Kaydedildi. Değişiklik sitede görünüyor.')}
    if(t.id==='p-reset'){S=clone(D);save();renderAnnounce();renderTours();renderPanel();toast('Örnek içerik geri yüklendi.')}
    if(t.matches('[data-visa]')) showVisa(t);
  });
  document.addEventListener('change',function(e){
    var t=e.target;
    if(t.dataset.lead!=null){S.leads[+t.dataset.lead].done=t.checked;save();renderPanel();}
  });
  function collect(){
    S.announce.on=document.getElementById('an-on').checked;
    S.announce.text=document.getElementById('an-text').value.trim()||D.announce.text;
    document.querySelectorAll('#pt-rows tr').forEach(function(r){
      var o=S.tours[+r.dataset.i]; if(!o) return;
      o.title=r.querySelector('[data-k=title]').value.trim()||o.title;
      o.badge=r.querySelector('[data-k=badge]').value.trim();
      o.on=r.querySelector('[data-k=on]').checked;
    });
  }
  document.addEventListener('submit',function(e){
    if(e.target.id!=='add-tour') return;
    e.preventDefault(); e.stopImmediatePropagation();
    var f=new FormData(e.target);
    collect();
    S.tours.push({id:'t'+Date.now(),icon:f.get('icon'),cat:f.get('cat'),title:f.get('title'),text:f.get('text'),badge:'',on:true});
    e.target.reset(); save(); renderTours(); renderPanel(); toast('Tur eklendi ve yayında.');
  },true);

  window.onLead=function(box,fd){
    var d=new Date(), p=(location.hash.replace('#/','')||'anasayfa');
    S.leads.push({ad:fd.get('ad'),tel:fd.get('tel'),konu:fd.get('konu')||'',not:fd.get('not')||'',page:p,
      time:d.toLocaleDateString('tr-TR')+' '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}),done:false});
    save(); renderPanel();
  };
  window.onRoute=function(){document.querySelectorAll('[data-form].sent').forEach(function(b){b.classList.remove('sent');var f=b.querySelector('form');f&&f.reset()})};

  /* vize */
  function showVisa(b){
    b.parentNode.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    var v=window.BTO_VISA[b.dataset.visa];
    document.getElementById('visa-title').textContent=v.t;
    document.getElementById('visa-items').innerHTML=v.items.map(function(i){return '<li>'+esc(i)+'</li>'}).join('');
  }

  renderAnnounce(); renderTours(); renderPanel(); panelTab('duyuru');
  var first=document.querySelector('[data-visa]'); if(first) showVisa(first);
})();
