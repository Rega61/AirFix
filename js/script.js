// === FIREBASE CONFIG === //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjR7pnvulb1niEe_nFf8nWGT6YZ4ckue4",
  authDomain: "airfix-control.firebaseapp.com",
  projectId: "airfix-control",
  storageBucket: "airfix-control.firebasestorage.app",
  messagingSenderId: "111362837485",
  appId: "1:111362837485:web:7e1d29a0e834bd5e2235e4",
  measurementId: "G-HNTWQJ7V8L"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === FUNCIONES GENERALES DE MÓDULOS === //
function mostrarModulo(modulo) {
  const modulos = ["stock", "caja", "reparaciones", "clientes", "deudores", "ventas", "reportes"];
  modulos.forEach(m => {
    const seccion = document.getElementById(`modulo-${m}`);
    if (seccion) seccion.style.display = "none";
  });

  const activo = document.getElementById(`modulo-${modulo}`);
  if (activo) {
    activo.style.display = "block";
    if (modulo === "reportes") mostrarReportes();
  }
}

// ================= STOCK ================= //
async function agregarStock(marca, modelo, imei, precio) {
  await addDoc(collection(db, "stock"), { marca, modelo, imei, precio });
  renderStock();
}

async function eliminarStock(id) {
  await deleteDoc(doc(db, "stock", id));
  renderStock();
}

async function renderStock() {
  const tablaStock = document.querySelector("#tablaStock tbody");
  tablaStock.innerHTML = "";
  const snapshot = await getDocs(collection(db, "stock"));
  snapshot.forEach(docu => {
    const cel = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cel.marca}</td>
      <td>${cel.modelo}</td>
      <td>${cel.imei}</td>
      <td>$${cel.precio}</td>
      <td><button onclick="eliminarStock('${docu.id}')">❌ Eliminar</button></td>
    `;
    tablaStock.appendChild(fila);
  });
}

// Formulario Stock
document.addEventListener("DOMContentLoaded", () => {
  const formStock = document.getElementById("formStock");
  if (formStock) {
    formStock.addEventListener("submit", async (e) => {
      e.preventDefault();
      const marca = document.getElementById("marca").value;
      const modelo = document.getElementById("modelo").value;
      const imei = document.getElementById("imei").value;
      const precio = parseFloat(document.getElementById("precio").value);
      await agregarStock(marca, modelo, imei, precio);
      formStock.reset();
    });
  }
  renderStock();
});

// ================= CAJA ================= //
async function agregarMovimiento(tipo, descripcion, monto) {
  await addDoc(collection(db, "caja"), { tipo, descripcion, monto });
  renderCaja();
}

async function eliminarMovimiento(id) {
  await deleteDoc(doc(db, "caja", id));
  renderCaja();
}

async function renderCaja() {
  const tablaCaja = document.querySelector("#tablaCaja tbody");
  tablaCaja.innerHTML = "";
  let totalIngresos = 0, totalEgresos = 0;

  const snapshot = await getDocs(collection(db, "caja"));
  snapshot.forEach(docu => {
    const mov = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${mov.tipo}</td>
      <td>${mov.descripcion}</td>
      <td>$${mov.monto}</td>
      <td><button onclick="eliminarMovimiento('${docu.id}')">❌ Eliminar</button></td>
    `;
    tablaCaja.appendChild(fila);
    if (mov.tipo === "ingreso") totalIngresos += mov.monto;
    else totalEgresos += mov.monto;
  });

  document.getElementById("totalIngresos").innerText = `$${totalIngresos}`;
  document.getElementById("totalEgresos").innerText = `$${totalEgresos}`;
  document.getElementById("balance").innerText = `$${totalIngresos - totalEgresos}`;
}

// Formulario Caja
document.addEventListener("DOMContentLoaded", () => {
  const formCaja = document.getElementById("formCaja");
  if (formCaja) {
    formCaja.addEventListener("submit", async (e) => {
      e.preventDefault();
      const tipo = document.getElementById("tipo").value;
      const descripcion = document.getElementById("descripcion").value;
      const monto = parseFloat(document.getElementById("monto").value);
      await agregarMovimiento(tipo, descripcion, monto);
      formCaja.reset();
    });
  }
  renderCaja();
});

// ================= REPARACIONES ================= //
async function agregarReparacion(cliente, telefono, marca, modelo, imei, falla, estado) {
  await addDoc(collection(db, "reparaciones"), { cliente, telefono, marca, modelo, imei, falla, estado });
  renderReparaciones();
}

async function eliminarReparacion(id) {
  await deleteDoc(doc(db, "reparaciones", id));
  renderReparaciones();
}

async function cambiarEstadoReparacion(id, nuevoEstado) {
  const ref = doc(db, "reparaciones", id);
  await updateDoc(ref, { estado: nuevoEstado });
  renderReparaciones();
}

async function renderReparaciones() {
  const tabla = document.querySelector("#tablaReparaciones tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db, "reparaciones"));
  snapshot.forEach(docu => {
    const rep = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${rep.cliente}</td>
      <td>${rep.telefono}</td>
      <td>${rep.marca} ${rep.modelo}</td>
      <td>${rep.imei}</td>
      <td>${rep.falla}</td>
      <td>
        <select onchange="cambiarEstadoReparacion('${docu.id}', this.value)">
          <option value="pendiente" ${rep.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="en proceso" ${rep.estado === "en proceso" ? "selected" : ""}>En proceso</option>
          <option value="finalizado" ${rep.estado === "finalizado" ? "selected" : ""}>Finalizado</option>
          <option value="entregado" ${rep.estado === "entregado" ? "selected" : ""}>Entregado</option>
        </select>
      </td>
      <td><button onclick="eliminarReparacion('${docu.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

// Formulario Reparaciones
document.addEventListener("DOMContentLoaded", () => {
  const formRep = document.getElementById("formReparacion");
  if (formRep) {
    formRep.addEventListener("submit", async (e) => {
      e.preventDefault();
      const cliente = document.getElementById("cliente").value;
      const telefono = document.getElementById("telefono").value;
      const marca = document.getElementById("marcaRep").value;
      const modelo = document.getElementById("modeloRep").value;
      const imei = document.getElementById("imeiRep").value;
      const falla = document.getElementById("falla").value;
      const estado = document.getElementById("estado").value;
      await agregarReparacion(cliente, telefono, marca, modelo, imei, falla, estado);
      formRep.reset();
    });
  }
  renderReparaciones();
});

// ================= CLIENTES ================= //
async function agregarCliente(nombre, dni, telefono, email, direccion) {
  await addDoc(collection(db, "clientes"), { nombre, dni, telefono, email, direccion });
  renderClientes();
}

async function eliminarCliente(id) {
  await deleteDoc(doc(db, "clientes", id));
  renderClientes();
}

async function renderClientes() {
  const tabla = document.querySelector("#tablaClientes tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db, "clientes"));
  snapshot.forEach(docu => {
    const cli = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cli.nombre}</td>
      <td>${cli.dni}</td>
      <td>${cli.telefono}</td>
      <td>${cli.email}</td>
      <td>${cli.direccion}</td>
      <td><button onclick="eliminarCliente('${docu.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

// Formulario Clientes
document.addEventListener("DOMContentLoaded", () => {
  const formCli = document.getElementById("formCliente");
  if (formCli) {
    formCli.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombreCliente").value;
      const dni = document.getElementById("dniCliente").value;
      const telefono = document.getElementById("telefonoCliente").value;
      const email = document.getElementById("emailCliente").value;
      const direccion = document.getElementById("direccionCliente").value;
      await agregarCliente(nombre, dni, telefono, email, direccion);
      formCli.reset();
    });
  }
  renderClientes();
});

// ================= DEUDORES ================= //
async function agregarDeudor(nombre, monto, motivo) {
  await addDoc(collection(db, "deudores"), { nombre, monto, motivo, estado: "Pendiente" });
  renderDeudores();
}

async function eliminarDeudor(id) {
  await deleteDoc(doc(db, "deudores", id));
  renderDeudores();
}

async function marcarPagadoDeudor(id) {
  const ref = doc(db, "deudores", id);
  await updateDoc(ref, { estado: "Pagado" });
  renderDeudores();
}

async function renderDeudores() {
  const tabla = document.querySelector("#tablaDeudores tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db, "deudores"));
  snapshot.forEach(docu => {
    const deu = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${deu.nombre}</td>
      <td>$${deu.monto}</td>
      <td>${deu.motivo}</td>
      <td>${deu.estado}</td>
      <td>
        <button onclick="marcarPagadoDeudor('${docu.id}')">✔️ Pagado</button>
        <button onclick="eliminarDeudor('${docu.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Formulario Deudores
document.addEventListener("DOMContentLoaded", () => {
  const formDeu = document.getElementById("formDeudor");
  if (formDeu) {
    formDeu.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombreDeudor").value;
      const monto = parseFloat(document.getElementById("montoDeuda").value);
      const motivo = document.getElementById("motivoDeuda").value;
      await agregarDeudor(nombre, monto, motivo);
      formDeu.reset();
    });
  }
  renderDeudores();
});

// ================= VENTAS ================= //
async function agregarVenta(producto, cliente, monto, metodo, fecha) {
  await addDoc(collection(db, "ventas"), { producto, cliente, monto, metodo, fecha });
  renderVentas();
}

async function eliminarVenta(id) {
  await deleteDoc(doc(db, "ventas", id));
  renderVentas();
}

async function renderVentas() {
  const tabla = document.querySelector("#tablaVentas tbody");
  tabla.innerHTML = "";
  const snapshot = await getDocs(collection(db, "ventas"));
  snapshot.forEach(docu => {
    const ven = docu.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${ven.producto}</td>
      <td>${ven.cliente}</td>
      <td>$${ven.monto}</td>
      <td>${ven.metodo}</td>
      <td>${ven.fecha}</td>
      <td>
        <button onclick="alert('Ticket:\\nCliente: ${ven.cliente}\\nProducto: ${ven.producto}\\nMonto: $${ven.monto}\\nPago: ${ven.metodo}\\nFecha: ${ven.fecha}')">🧾 Ticket</button>
        <button onclick="eliminarVenta('${docu.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Formulario Ventas
document.addEventListener("DOMContentLoaded", () => {
  const formVen = document.getElementById("formVenta");
  if (formVen) {
    formVen.addEventListener("submit", async (e) => {
      e.preventDefault();
      const producto = document.getElementById("productoVenta").value;
      const cliente = document.getElementById("clienteVenta").value;
      const monto = parseFloat(document.getElementById("montoVenta").value);
      const metodo = document.getElementById("metodoPago").value;
      const fecha = new Date().toLocaleString();
      await agregarVenta(producto, cliente, monto, metodo, fecha);
      formVen.reset();
    });
  }
  renderVentas();
});

// ================= REPORTES ================= //
async function mostrarReportes() {
  const ventasSnapshot = await getDocs(collection(db, "ventas"));
  const cajaSnapshot = await getDocs(collection(db, "caja"));

  // Ventas por producto
  const ventasPorProducto = {};
  ventasSnapshot.forEach(docu => {
    const v = docu.data();
    ventasPorProducto[v.producto] = (ventasPorProducto[v.producto] || 0) + v.monto;
  });

  const ctxVentas = document.getElementById('graficoVentas').getContext('2d');
  new Chart(ctxVentas, {
    type: 'bar',
    data: {
      labels: Object.keys(ventasPorProducto),
      datasets: [{
        label: 'Monto vendido ($)',
        data: Object.values(ventasPorProducto),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: { responsive: true }
  });

  // Caja Ingresos vs Egresos
  let ingresos = 0, egresos = 0;
  cajaSnapshot.forEach(docu => {
    const c = docu.data();
    if (c.tipo === "ingreso") ingresos += c.monto;
    else egresos += c.monto;
  });

  const ctxCaja = document.getElementById('graficoCaja').getContext('2d');
  new Chart(ctxCaja, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos', 'Egresos'],
      datasets: [{ data: [ingresos, egresos], backgroundColor: ['#4caf50', '#f44336'] }]
    },
    options: { responsive: true }
  });
}
