(function(){
  document.documentElement.classList.remove('no-js');
  var pages=[].slice.call(document.querySelectorAll('[data-page]'));
  var base=document.title;
  function go(){
    var h=location.hash||'#/', key=h.replace(/^#\/?/,'').split('/')[0]||'home';
    if(!pages.some(function(p){return p.dataset.page===key})) key='home';
    pages.forEach(function(p){p.classList.toggle('on',p.dataset.page===key)});
    document.querySelectorAll('.nav a').forEach(function(a){
      var k=a.getAttribute('href').replace(/^#\/?/,'')||'home';
      if(k===key) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    var cur=pages.filter(function(p){return p.dataset.page===key})[0];
    document.title=(cur&&cur.dataset.title? cur.dataset.title+' | ':'')+base;
    window.scrollTo(0,0);
    if(window.onRoute) window.onRoute(key);
    setTimeout(function(){window.BTO_reveal&&BTO_reveal(cur)},50);
  }
  window.addEventListener('hashchange',go); go();
  document.addEventListener('click',function(e){
    var b=e.target.closest('.chips button'); if(!b) return;
    var wrap=b.parentNode; if(!wrap.dataset.for) return; var grid=document.getElementById(wrap.dataset.for), c=b.dataset.cat;
    wrap.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    [].forEach.call(grid.children,function(t){t.hidden=!(c==='hepsi'||(' '+t.dataset.cat+' ').indexOf(' '+c+' ')>-1)});
  });
})();
