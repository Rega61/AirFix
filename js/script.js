// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";

// -----------------------------
// Configuración Firebase
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBjR7pnvulb1niEe_nFf8nWGT6YZ4ckue4",
  authDomain: "airfix-control.firebaseapp.com",
  projectId: "airfix-control",
  storageBucket: "airfix-control.firebasestorage.app",
  messagingSenderId: "111362837485",
  appId: "1:111362837485:web:7e1d29a0e834bd5e2235e4",
  measurementId: "G-HNTWQJ7V8L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// -----------------------------
// Mostrar módulo
// -----------------------------
function mostrarModulo(modulo) {
  const secciones = document.querySelectorAll('main section');
  secciones.forEach(sec => sec.style.display = 'none');
  const selected = document.getElementById(`modulo-${modulo}`);
  if(selected) selected.style.display = 'block';
}
document.querySelectorAll('nav a[data-modulo]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    mostrarModulo(a.dataset.modulo);
  });
});

// -----------------------------
// Funciones Firestore genéricas
// -----------------------------
async function agregarDocumento(coleccion, datos) {
  try { await addDoc(collection(db, coleccion), datos); }
  catch(err){ console.error(`Error agregando ${coleccion}:`, err); }
}

async function leerDocumentos(coleccion) {
  const snapshot = await getDocs(collection(db, coleccion));
  const documentos = [];
  snapshot.forEach(doc => { documentos.push({ id: doc.id, ...doc.data() }); });
  return documentos;
}

async function borrarDocumento(coleccion, id) {
  try { await deleteDoc(doc(db, coleccion, id)); }
  catch(err){ console.error(`Error borrando ${coleccion}:`, err); }
}

// -----------------------------
// MÓDULO STOCK
// -----------------------------
const formStock = document.getElementById('formStock');
const tablaStock = document.querySelector('#tablaStock tbody');
formStock.addEventListener('submit', async e => {
  e.preventDefault();
  const producto = {
    marca: document.getElementById('marca').value,
    modelo: document.getElementById('modelo').value,
    imei: document.getElementById('imei').value,
    precio: Number(document.getElementById('precio').value)
  };
  await agregarDocumento('stock', producto);
  formStock.reset();
  mostrarStock();
});
async function mostrarStock() {
  const productos = await leerDocumentos('stock');
  tablaStock.innerHTML = '';
  productos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.marca}</td><td>${p.modelo}</td><td>${p.imei}</td><td>${p.precio}</td>
    <td><button onclick="borrarStock('${p.id}')">Eliminar</button></td>`;
    tablaStock.appendChild(tr);
  });
}
window.borrarStock = async (id)=>{await borrarDocumento('stock',id); mostrarStock();};

// -----------------------------
// MÓDULO CAJA
// -----------------------------
const formCaja = document.getElementById('formCaja');
const tablaCaja = document.querySelector('#tablaCaja tbody');
const totalIngresos = document.getElementById('totalIngresos');
const totalEgresos = document.getElementById('totalEgresos');
const balance = document.getElementById('balance');
formCaja.addEventListener('submit', async e=>{
  e.preventDefault();
  const movimiento = {
    tipo: document.getElementById('tipo').value,
    descripcion: document.getElementById('descripcion').value,
    monto: parseFloat(document.getElementById('monto').value),
    fecha: new Date().toISOString()
  };
  await agregarDocumento('caja', movimiento);
  formCaja.reset();
  mostrarCaja();
});
async function mostrarCaja(){
  const movimientos = await leerDocumentos('caja');
  tablaCaja.innerHTML = '';
  let ingresos = 0, egresos = 0;
  movimientos.forEach(m=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${m.tipo}</td><td>${m.descripcion}</td><td>${m.monto}</td>
      <td><button onclick="borrarCaja('${m.id}')">Eliminar</button></td>`;
    tablaCaja.appendChild(tr);
    if(m.tipo==='ingreso') ingresos+=m.monto; else egresos+=m.monto;
  });
  totalIngresos.textContent = `$${ingresos}`;
  totalEgresos.textContent = `$${egresos}`;
  balance.textContent = `$${ingresos-egresos}`;
}
window.borrarCaja = async id=>{await borrarDocumento('caja',id); mostrarCaja();};

// -----------------------------
// MÓDULO DEUDORES
// -----------------------------
const formDeudor=document.getElementById('formDeudor');
const tablaDeudores=document.querySelector('#tablaDeudores tbody');
formDeudor.addEventListener('submit',async e=>{
  e.preventDefault();
  const deudor={nombre:document.getElementById('nombreDeudor').value,
                monto:Number(document.getElementById('montoDeuda').value),
                motivo:document.getElementById('motivoDeuda').value,
                estado:'Pendiente'};
  await agregarDocumento('deudores',deudor);
  formDeudor.reset();
  mostrarDeudores();
});
async function mostrarDeudores(){
  const deudores=await leerDocumentos('deudores');
  tablaDeudores.innerHTML='';
  deudores.forEach(d=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${d.nombre}</td><td>${d.monto}</td><td>${d.motivo}</td><td>${d.estado}</td>
      <td><button onclick="borrarDeudor('${d.id}')">Eliminar</button></td>`;
    tablaDeudores.appendChild(tr);
  });
}
window.borrarDeudor=async id=>{await borrarDocumento('deudores',id); mostrarDeudores();};

// -----------------------------
// MÓDULO CLIENTES
// -----------------------------
const formCliente=document.getElementById('formCliente');
const tablaClientes=document.querySelector('#tablaClientes tbody');
formCliente.addEventListener('submit',async e=>{
  e.preventDefault();
  const cliente={nombre:document.getElementById('nombreCliente').value,
                 dni:document.getElementById('dniCliente').value,
                 telefono:document.getElementById('telefonoCliente').value,
                 email:document.getElementById('emailCliente').value,
                 direccion:document.getElementById('direccionCliente').value};
  await agregarDocumento('clientes',cliente);
  formCliente.reset();
  mostrarClientes();
});
async function mostrarClientes(){
  const clientes=await leerDocumentos('clientes');
  tablaClientes.innerHTML='';
  clientes.forEach(c=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${c.nombre}</td><td>${c.dni}</td><td>${c.telefono}</td><td>${c.email}</td><td>${c.direccion}</td>
      <td><button onclick="borrarCliente('${c.id}')">Eliminar</button></td>`;
    tablaClientes.appendChild(tr);
  });
}
window.borrarCliente=async id=>{await borrarDocumento('clientes',id); mostrarClientes();};

// -----------------------------
// MÓDULO VENTAS
// -----------------------------
const formVenta=document.getElementById('formVenta');
const tablaVentas=document.querySelector('#tablaVentas tbody');
formVenta.addEventListener('submit',async e=>{
  e.preventDefault();
  const venta={producto:document.getElementById('productoVenta').value,
               cliente:document.getElementById('clienteVenta').value,
               monto:Number(document.getElementById('montoVenta').value),
               metodoPago:document.getElementById('metodoPago').value,
               fecha:new Date().toISOString()};
  await agregarDocumento('ventas',venta);
  formVenta.reset();
  mostrarVentas();
});
async function mostrarVentas(){
  const ventas=await leerDocumentos('ventas');
  tablaVentas.innerHTML='';
  ventas.forEach(v=>{
    const fecha=new Date(v.fecha).toLocaleDateString();
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${v.producto}</td><td>${v.cliente}</td><td>${v.monto}</td><td>${v.metodoPago}</td>
      <td>${fecha}</td><td><button onclick="borrarVenta('${v.id}')">Eliminar</button></td>`;
    tablaVentas.appendChild(tr);
  });
}
window.borrarVenta=async id=>{await borrarDocumento('ventas',id); mostrarVentas();};

// -----------------------------
// MÓDULO REPARACIONES
// -----------------------------
const formReparacion=document.getElementById('formReparacion');
const tablaReparaciones=document.querySelector('#tablaReparaciones tbody');
formReparacion.addEventListener('submit',async e=>{
  e.preventDefault();
  const rep={cliente:document.getElementById('cliente').value,
             telefono:document.getElementById('telefono').value,
             marca:document.getElementById('marcaRep').value,
             modelo:document.getElementById('modeloRep').value,
             imei:document.getElementById('imeiRep').value,
             falla:document.getElementById('falla').value,
             estado:document.getElementById('estado').value};
  await agregarDocumento('reparaciones',rep);
  formReparacion.reset();
  mostrarReparaciones();
});
async function mostrarReparaciones(){
  const reps=await leerDocumentos('reparaciones');
  tablaReparaciones.innerHTML='';
  reps.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.cliente}</td><td>${r.telefono}</td><td>${r.marca} ${r.modelo}</td>
      <td>${r.imei}</td><td>${r.falla}</td><td>${r.estado}</td>
      <td><button onclick="borrarReparacion('${r.id}')">Eliminar</button></td>`;
    tablaReparaciones.appendChild(tr);
  });
}
window.borrarReparacion=async id=>{await borrarDocumento('reparaciones',id); mostrarReparaciones();};

// -----------------------------
// MÓDULO REPORTES
// -----------------------------
const ctxVentas=document.getElementById('graficoVentas').getContext('2d');
const ctxCaja=document.getElementById('graficoCaja').getContext('2d');
let chartVentas, chartCaja;

async function actualizarReportes(){
  // Ventas por producto
  const ventas=await leerDocumentos('ventas');
  const productos={}, ingresos=[], labels=[];
  ventas.forEach(v=>{
    if(productos[v.producto]) productos[v.producto]+=v.monto;
    else productos[v.producto]=v.monto;
  });
  Object.keys(productos).forEach(p=>{
    labels.push(p);
    ingresos.push(productos[p]);
  });
  if(chartVentas) chartVentas.destroy();
  chartVentas=new Chart(ctxVentas,{type:'bar',data:{labels, datasets:[{label:'Ventas por producto', data:ingresos, backgroundColor:'#4caf50'}]}});
  
  // Flujo de caja
  const movimientos=await leerDocumentos('caja');
  const labelsCaja=[], ingresosCaja=[], egresosCaja=[];
  movimientos.forEach(m=>{
    labelsCaja.push(new Date(m.fecha).toLocaleDateString());
    ingresosCaja.push(m.tipo==='ingreso'?m.monto:0);
    egresosCaja.push(m.tipo==='egreso'?m.monto:0);
  });
  if(chartCaja) chartCaja.destroy();
  chartCaja=new Chart(ctxCaja,{
    type:'line',
    data:{
      labels:labelsCaja,
      datasets:[
        {label:'Ingresos', data:ingresosCaja, borderColor:'#4caf50', fill:false},
        {label:'Egresos', data:egresosCaja, borderColor:'#f44336', fill:false}
      ]
    }
  });
}

// -----------------------------
// CARGAR TODOS LOS DATOS AL INICIO
// -----------------------------
window.addEventListener('DOMContentLoaded',()=>{
  mostrarStock();
  mostrarCaja();
  mostrarDeudores();
  mostrarClientes();
  mostrarVentas();
  mostrarReparaciones();
  actualizarReportes();
});

export { mostrarModulo };
