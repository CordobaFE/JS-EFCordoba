
(async function(){
  const RUTA_MASAJES = '../data/masajes.json';
  const RUTA_CUPONES = '../data/cupones.json';
  let masajes = [];
  let cupones = [];
  let carrito = JSON.parse(localStorage.getItem('carrito_bambu')||'[]');
  let descuento = 0;
  let codigoCupon = null;
  const fmt = n => Number(n).toLocaleString('es-AR',{minimumFractionDigits:0});
  async function cargar(){
    const r1 = await fetch(RUTA_MASAJES); masajes = await r1.json();
    const r2 = await fetch(RUTA_CUPONES); cupones = await r2.json();
  }
  function subtotal(){ return carrito.reduce((a,b)=>a+b.precio*b.cantidad,0); }
  function aplicarCupon(codigo){
    if(!codigo){ descuento=0; codigoCupon=null; return true; }
    const c = cupones.find(x=>x.codigo.toUpperCase()===codigo.toUpperCase());
    if(!c){ descuento=0; codigoCupon=null; return false; }
    descuento = Math.round(subtotal()*c.porcentaje/100); codigoCupon = c.codigo; return true;
  }
  function agregar(prodId, minutos, precio, cantidad){
    const vid = prodId+'-'+minutos;
    const p = masajes.find(m=>m.id===prodId);
    const e = carrito.find(x=>x.variantId===vid);
    if(e) e.cantidad += cantidad; else carrito.push({variantId:vid, productoId:prodId, nombre:p.nombre, duracion:minutos, precio, cantidad});
    localStorage.setItem('carrito_bambu', JSON.stringify(carrito));
    Swal.fire({icon:'success',title:'Agregado',text:`${p.nombre} ${minutos} min agregado`,timer:1000,showConfirmButton:false});
  }
  async function abrirSelector(){
    const opcionesProd = masajes.map(m=>`<option value="${m.id}">${m.nombre}</option>`).join('');
    return Swal.fire({
      title:'Agregar al carrito',
      html:`<label>Masaje</label><select id="p" class="swal2-input">${opcionesProd}</select>
            <label>Duración</label><select id="v" class="swal2-input"></select>
            <label>Cantidad</label><input id="c" type="number" class="swal2-input" value="1" min="1">`,
      didOpen:()=>{
        const pSel = document.getElementById('p');
        const vSel = document.getElementById('v');
        function fill(){
          const prod = masajes.find(x=>x.id===Number(pSel.value));
          vSel.innerHTML = prod.duraciones.map(d=>`<option value="${d.minutos}" data-precio="${d.precio}">${d.minutos} min - $${fmt(d.precio)}</option>`).join('');
        }
        pSel.addEventListener('change', fill); fill();
      },
      showCancelButton:true,
      preConfirm:()=>{
        const p = Number(document.getElementById('p').value);
        const min = Number(document.getElementById('v').value);
        const precio = Number(document.getElementById('v').selectedOptions[0].dataset.precio);
        const cant = Math.max(1, Number(document.getElementById('c').value)||1);
        return {p, min, precio, cant};
      }
    });
  }
  async function abrirCarrito(){
    const sub = subtotal();
    const tot = Math.max(0, sub - descuento);
    const items = carrito.length? carrito.map(it=>`<div><strong>${it.nombre}</strong> <small>${it.duracion} min • ${it.cantidad} x $${fmt(it.precio)}</small></div>`).join('') : '<p class="muted">Carrito vacío</p>';
    const { value: act } = await Swal.fire({
      title:'Carrito',
      html:`<div style="text-align:left">${items}</div><hr>
            <input id="cup" class="swal2-input" placeholder="Cupón (opcional)">
            <div style="text-align:left">Subtotal: $${fmt(sub)}</div>
            <div style="text-align:left">Descuento: $${fmt(descuento)}</div>
            <div style="text-align:left"><strong>Total: $${fmt(tot)}</strong></div>`,
      showCancelButton:true,
      confirmButtonText:'Reservar'
    });
    if(!act) return;
    const code = document.getElementById('cup').value.trim();
    if(code){
      const ok = aplicarCupon(code);
      if(!ok) return Swal.fire('Cupón inválido','Revisá el código','error');
    }
    await abrirReserva();
  }
  async function abrirReserva(){
    if(!carrito.length) return Swal.fire('Carrito vacío','','info');
    const sub = subtotal();
    const tot = Math.max(0, sub - descuento);
    const { value: f } = await Swal.fire({
      title:'Completar Reserva',
      html:`<input id="n" class="swal2-input" placeholder="Nombre" value="Franco Córdoba"><input id="e" class="swal2-input" placeholder="Email" value="franco@example.com"><input id="t" class="swal2-input" placeholder="Teléfono" value="+54 9 11 0000-0000"><label style="display:block;text-align:left">Fecha</label><input id="fe" type="date" class="swal2-input"><label style="display:block;text-align:left">Hora</label><input id="ho" type="time" class="swal2-input"><label style="display:block;text-align:left">Terapeuta</label><select id="swal-terapeuta" class="swal2-input"><option value="Cualquiera" selected>Cualquiera</option><option value="Yenny">Yenny</option><option value="Melina">Melina</option><option value="Franco">Franco</option></select><div style="text-align:left">Total: <strong>$${fmt(tot)}</strong></div>`,
      showCancelButton:true,
      preConfirm:()=>({nombre:document.getElementById('n').value.trim(), email:document.getElementById('e').value.trim(), telefono:document.getElementById('t').value.trim(), fecha:document.getElementById('fe').value, hora:document.getElementById('ho').value, terapeuta:document.getElementById('swal-terapeuta').value})
    });
    if(!f) return;
    if(!f.nombre || !f.email || !f.fecha || !f.hora) return Swal.fire('Faltan datos','Completá nombre, email, fecha y hora','warning');
    const reservas = JSON.parse(localStorage.getItem('reservas_bambu')||'[]');
    reservas.push({id:Date.now(), cliente:f, carrito, subtotal:sub, descuento, total:tot, terapeuta:f.terapeuta, createdAt:new Date().toISOString()});
    localStorage.setItem('reservas_bambu', JSON.stringify(reservas));
    carrito = []; descuento = 0; codigoCupon=null;
    localStorage.setItem('carrito_bambu', JSON.stringify(carrito));
    actualizarFlotante();
    Swal.fire('Reserva confirmada', `Terapeuta: <strong>${f.terapeuta || 'Cualquiera'}</strong><br/>Turno: ${f.fecha} a las ${f.hora}<br/>Total: $${fmt(tot)}`, 'success');
  }
  function actualizarFlotante(){
    let btn = document.getElementById('bambu-cart');
    if(!btn){
      btn = document.createElement('button');
      btn.id='bambu-cart';
      Object.assign(btn.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:'9999',padding:'12px 14px',borderRadius:'10px',background:'#0b6',color:'#fff',border:'none',cursor:'pointer'});
      btn.addEventListener('click', abrirCarrito);
      document.body.appendChild(btn);
    }
    const count = carrito.reduce((a,b)=>a+b.cantidad,0);
    const sub = subtotal();
    btn.textContent = `Carrito (${count}) $${fmt(sub)}`;
  }
  await cargar();
  actualizarFlotante();
  document.querySelectorAll('.btn-reservar').forEach(btn=>{
    btn.addEventListener('click', async (e)=>{
      e.preventDefault();
      const r = await abrirSelector();
      if(r && r.value){
        agregar(r.value.p, r.value.min, r.value.precio, r.value.cant);
        actualizarFlotante();
      }
    });
  });
})();
