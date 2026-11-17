(function(){
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('menu');
  if(btn&&nav){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  }
  document.addEventListener('submit',function(e){
    var box=e.target.closest('[data-form]'); if(!box) return;
    e.preventDefault();
    if(window.onLead){ try{ window.onLead(box, new FormData(e.target)); }catch(err){} }
    box.classList.add('sent');
    var ok=box.querySelector('.form-ok'); if(ok){ok.setAttribute('tabindex','-1');ok.focus()}
  });
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.2});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});
  window.BTO_reveal=function(root){(root||document).querySelectorAll('.reveal:not(.in)').forEach(function(el){el.classList.add('in')})};
})();
