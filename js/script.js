// script.js
// ==========================
// IMPORTS FIREBASE MODULAR
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ==========================
// CONFIG FIREBASE
// ==========================
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
const db = getFirestore(app);

// ==========================
// MOSTRAR MÓDULOS
// ==========================
function mostrarModulo(modulo) {
  const modulos = ["stock","caja","reparaciones","clientes","deudores","ventas","reportes"];
  modulos.forEach(m => {
    const sec = document.getElementById(`modulo-${m}`);
    if(sec) sec.style.display = "none";
  });
  const activo = document.getElementById(`modulo-${modulo}`);
  if(activo) activo.style.display = "block";
}

// ==========================
// STOCK
// ==========================
async function cargarStock() {
  const tabla = document.querySelector("#tablaStock tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db,"stock"));
  snapshot.forEach(docSnap => {
    const cel = {id: docSnap.id, ...docSnap.data()};
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cel.marca}</td>
      <td>${cel.modelo}</td>
      <td>${cel.imei}</td>
      <td>$${cel.precio}</td>
      <td><button onclick="eliminarStock('${cel.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarStock = async (id) => {
  await deleteDoc(doc(db,"stock",id));
  await cargarStock();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formStock");
  if(form){
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const celular = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        imei: document.getElementById("imei").value,
        precio: parseFloat(document.getElementById("precio").value)
      };
      await addDoc(collection(db,"stock"), celular);
      form.reset();
      await cargarStock();
    });
    cargarStock();
  }
});

// ==========================
// CAJA
// ==========================
async function cargarCaja() {
  const tabla = document.querySelector("#tablaCaja tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db,"caja"));
  let totalIngresos = 0, totalEgresos = 0;
  snapshot.forEach(docSnap => {
    const mov = {id: docSnap.id, ...docSnap.data()};
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${mov.tipo}</td>
      <td>${mov.descripcion}</td>
      <td>$${mov.monto}</td>
      <td><button onclick="eliminarCaja('${mov.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
    if(mov.tipo === "ingreso") totalIngresos += mov.monto;
    else totalEgresos += mov.monto;
  });
  document.getElementById("totalIngresos").innerText = `$${totalIngresos}`;
  document.getElementById("totalEgresos").innerText = `$${totalEgresos}`;
  document.getElementById("balance").innerText = `$${totalIngresos - totalEgresos}`;
}

window.eliminarCaja = async (id) => {
  await deleteDoc(doc(db,"caja",id));
  await cargarCaja();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCaja");
  if(form){
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const mov = {
        tipo: document.getElementById("tipo").value,
        descripcion: document.getElementById("descripcion").value,
        monto: parseFloat(document.getElementById("monto").value)
      };
      await addDoc(collection(db,"caja"), mov);
      form.reset();
      await cargarCaja();
    });
    cargarCaja();
  }
});

// ==========================
// CLIENTES
// ==========================
async function cargarClientes() {
  const tabla = document.querySelector("#tablaClientes tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db,"clientes"));
  snapshot.forEach(docSnap=>{
    const cli = {id: docSnap.id, ...docSnap.data()};
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cli.nombre}</td>
      <td>${cli.dni}</td>
      <td>${cli.telefono}</td>
      <td>${cli.email}</td>
      <td>${cli.direccion}</td>
      <td><button onclick="eliminarCliente('${cli.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarCliente = async (id)=>{
  await deleteDoc(doc(db,"clientes",id));
  await cargarClientes();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("formCliente");
  if(form){
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const cli = {
        nombre: document.getElementById("nombreCliente").value,
        dni: document.getElementById("dniCliente").value,
        telefono: document.getElementById("telefonoCliente").value,
        email: document.getElementById("emailCliente").value,
        direccion: document.getElementById("direccionCliente").value
      };
      await addDoc(collection(db,"clientes"),cli);
      form.reset();
      await cargarClientes();
    });
    cargarClientes();
  }
});

// ==========================
// DEUDORES
// ==========================
async function cargarDeudores() {
  const tabla = document.querySelector("#tablaDeudores tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db,"deudores"));
  snapshot.forEach(docSnap=>{
    const d = {id: docSnap.id, ...docSnap.data()};
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${d.nombre}</td>
      <td>$${d.monto}</td>
      <td>${d.motivo}</td>
      <td>${d.estado}</td>
      <td>
        <button onclick="marcarPagado('${d.id}')">✔️ Pagado</button>
        <button onclick="eliminarDeudor('${d.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.marcarPagado = async (id)=>{
  const ref = doc(db,"deudores",id);
  await updateDoc(ref, {estado:"Pagado"});
  await cargarDeudores();
}

window.eliminarDeudor = async (id)=>{
  await deleteDoc(doc(db,"deudores",id));
  await cargarDeudores();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("formDeudor");
  if(form){
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const deuda = {
        nombre: document.getElementById("nombreDeudor").value,
        monto: parseFloat(document.getElementById("montoDeuda").value),
        motivo: document.getElementById("motivoDeuda").value,
        estado: "Pendiente"
      };
      await addDoc(collection(db,"deudores"),deuda);
      form.reset();
      await cargarDeudores();
    });
    cargarDeudores();
  }
});

// ==========================
// REPARACIONES
// ==========================
async function cargarReparaciones() {
  const tabla = document.querySelector("#tablaReparaciones tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db,"reparaciones"));
  snapshot.forEach(docSnap=>{
    const rep = {id: docSnap.id, ...docSnap.data()};
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${rep.cliente}</td>
      <td>${rep.telefono}</td>
      <td>${rep.marca} ${rep.modelo}</td>
      <td>${rep.imei}</td>
      <td>${rep.falla}</td>
      <td>
        <select onchange="cambiarEstadoReparacion('${rep.id}',this.value)">
          <option value="pendiente" ${rep.estado==="pendiente"?"selected":""}>Pendiente</option>
          <option value="en proceso" ${rep.estado==="en proceso"?"selected":""}>En proceso</option>
          <option value="finalizado" ${rep.estado==="finalizado"?"selected":""}>Finalizado</option>
          <option value="entregado" ${rep.estado==="entregado"?"selected":""}>Entregado</option>
        </select>
      </td>
      <td>
        <button onclick="eliminarReparacion('${rep.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.cambiarEstadoReparacion = async (id,estado)=>{
  await updateDoc(doc(db,"reparaciones",id),{estado});
  await cargarReparaciones();
}

window.eliminarReparacion = async (id)=>{
  await deleteDoc(doc(db,"reparaciones",id));
  await cargarReparaciones();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("formReparacion");
  if(form){
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const rep = {
        cliente: document.getElementById("cliente").value,
        telefono: document.getElementById("telefono").value,
        marca: document.getElementById("marcaRep").value,
        modelo: document.getElementById("modeloRep").value,
        imei: document.getElementById("imeiRep").value,
        falla: document.getElementById("falla").value,
        estado: document.getElementById("estado").value
      };
      await addDoc(collection(db,"reparaciones"),rep);
      form.reset();
      await cargarReparaciones();
    });
    cargarReparaciones();
  }
});

// ==========================
// VENTAS
// ==========================
async function cargarVentas() {
  const tabla = document.querySelector("#tablaVentas tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db,"ventas"));
  snapshot.forEach(docSnap=>{
    const v = {id: docSnap.id, ...docSnap.data()};
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${v.producto}</td>
      <td>${v.cliente}</td>
      <td>$${v.monto}</td>
      <td>${v.metodo}</td>
      <td>${v.fecha}</td>
      <td>
        <button onclick="eliminarVenta('${v.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarVenta = async (id)=>{
  await deleteDoc(doc(db,"ventas",id));
  await cargarVentas();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("formVenta");
  if(form){
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const venta = {
        producto: document.getElementById("productoVenta").value,
        cliente: document.getElementById("clienteVenta").value,
        monto: parseFloat(document.getElementById("montoVenta").value),
        metodo: document.getElementById("metodoPago").value,
        fecha: new Date().toLocaleString()
      };
      await addDoc(collection(db,"ventas"),venta);
      form.reset();
      await cargarVentas();
    });
    cargarVentas();
  }
});
