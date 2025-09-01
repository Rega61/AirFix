// ==========================
// Inicializar Firebase
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyBjR7pnvulb1niEe_nFf8nWGT6YZ4ckue4",
  authDomain: "airfix-control.firebaseapp.com",
  projectId: "airfix-control",
  storageBucket: "airfix-control.appspot.com",
  messagingSenderId: "111362837485",
  appId: "1:111362837485:web:7e1d29a0e834bd5e2235e4",
  measurementId: "G-HNTWQJ7V8L"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================
// Variables locales
// ==========================
let stock = [];
let movimientos = [];
let clientes = [];
let reparaciones = [];
let deudores = [];
let ventas = [];

// ==========================
// Mostrar módulo
// ==========================
function mostrarModulo(modulo) {
  const modulos = ["stock","caja","reparaciones","clientes","deudores","ventas","reportes"];
  modulos.forEach(m => {
    const sec = document.getElementById(`modulo-${m}`);
    if (sec) sec.style.display = "none";
  });

  const activo = document.getElementById(`modulo-${modulo}`);
  if (activo) {
    activo.style.display = "block";
    if (modulo === "reportes") mostrarReportes();
  }
}

// ==========================
// ==========================
// ======= STOCK ============
// ==========================
async function cargarStock() {
  try {
    const snapshot = await db.collection("stock").get();
    stock = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderStock(document.querySelector("#tablaStock tbody"));
  } catch (error) {
    console.error("Error cargando stock:", error);
  }
}

async function agregarStock(celular) {
  try {
    await db.collection("stock").add(celular);
  } catch (error) {
    console.error("Error agregando stock:", error);
  }
}

async function eliminarStockFirestore(id) {
  try {
    await db.collection("stock").doc(id).delete();
    stock = stock.filter(c => c.id !== id);
    renderStock(document.querySelector("#tablaStock tbody"));
  } catch (error) {
    console.error("Error eliminando stock:", error);
  }
}

function renderStock(tablaStock) {
  tablaStock.innerHTML = "";
  stock.forEach(cel => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cel.marca}</td>
      <td>${cel.modelo}</td>
      <td>${cel.imei}</td>
      <td>$${cel.precio}</td>
      <td>
        <button onclick="eliminarStockFirestore('${cel.id}')">❌ Eliminar</button>
      </td>
    `;
    tablaStock.appendChild(fila);
  });
}

// ==========================
// ======= CAJA ============
// ==========================
async function cargarCaja() {
  try {
    const snapshot = await db.collection("caja").get();
    movimientos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderCaja(document.querySelector("#tablaCaja tbody"));
  } catch (error) {
    console.error("Error cargando caja:", error);
  }
}

async function agregarMovimientoCaja(mov) {
  try {
    await db.collection("caja").add(mov);
  } catch (error) {
    console.error("Error agregando movimiento:", error);
  }
}

async function eliminarMovimientoFirestore(id) {
  try {
    await db.collection("caja").doc(id).delete();
    movimientos = movimientos.filter(m => m.id !== id);
    renderCaja(document.querySelector("#tablaCaja tbody"));
  } catch (error) {
    console.error("Error eliminando movimiento:", error);
  }
}

function renderCaja(tabla) {
  tabla.innerHTML = "";
  let totalIngresos = 0;
  let totalEgresos = 0;

  movimientos.forEach(mov => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${mov.tipo}</td>
      <td>${mov.descripcion}</td>
      <td>$${mov.monto}</td>
      <td><button onclick="eliminarMovimientoFirestore('${mov.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);

    if (mov.tipo === "ingreso") totalIngresos += mov.monto;
    else totalEgresos += mov.monto;
  });

  document.getElementById("totalIngresos").innerText = `$${totalIngresos}`;
  document.getElementById("totalEgresos").innerText = `$${totalEgresos}`;
  document.getElementById("balance").innerText = `$${totalIngresos - totalEgresos}`;
}

// ==========================
// ======= CLIENTES =========
// ==========================
async function cargarClientes() {
  try {
    const snapshot = await db.collection("clientes").get();
    clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderClientes(document.querySelector("#tablaClientes tbody"));
  } catch (error) {
    console.error("Error cargando clientes:", error);
  }
}

async function agregarClienteFirestore(cliente) {
  try {
    await db.collection("clientes").add(cliente);
  } catch (error) {
    console.error("Error agregando cliente:", error);
  }
}

async function eliminarClienteFirestore(id) {
  try {
    await db.collection("clientes").doc(id).delete();
    clientes = clientes.filter(c => c.id !== id);
    renderClientes(document.querySelector("#tablaClientes tbody"));
  } catch (error) {
    console.error("Error eliminando cliente:", error);
  }
}

function renderClientes(tabla) {
  tabla.innerHTML = "";
  clientes.forEach(cli => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cli.nombre}</td>
      <td>${cli.dni}</td>
      <td>${cli.telefono}</td>
      <td>${cli.email}</td>
      <td>${cli.direccion}</td>
      <td><button onclick="eliminarClienteFirestore('${cli.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

// ==========================
// ======= REPARACIONES =====
// ==========================
async function cargarReparaciones() {
  try {
    const snapshot = await db.collection("reparaciones").get();
    reparaciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderReparaciones(document.querySelector("#tablaReparaciones tbody"));
  } catch (error) {
    console.error("Error cargando reparaciones:", error);
  }
}

async function agregarReparacionFirestore(rep) {
  try {
    await db.collection("reparaciones").add(rep);
  } catch (error) {
    console.error("Error agregando reparación:", error);
  }
}

async function eliminarReparacionFirestore(id) {
  try {
    await db.collection("reparaciones").doc(id).delete();
    reparaciones = reparaciones.filter(r => r.id !== id);
    renderReparaciones(document.querySelector("#tablaReparaciones tbody"));
  } catch (error) {
    console.error("Error eliminando reparación:", error);
  }
}

function renderReparaciones(tabla) {
  tabla.innerHTML = "";
  reparaciones.forEach(rep => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${rep.cliente}</td>
      <td>${rep.telefono}</td>
      <td>${rep.marca} ${rep.modelo}</td>
      <td>${rep.imei}</td>
      <td>${rep.falla}</td>
      <td>
        <select onchange="cambiarEstadoFirestore('${rep.id}', this.value)">
          <option value="pendiente" ${rep.estado==='pendiente'?'selected':''}>Pendiente</option>
          <option value="en proceso" ${rep.estado==='en proceso'?'selected':''}>En proceso</option>
          <option value="finalizado" ${rep.estado==='finalizado'?'selected':''}>Finalizado</option>
          <option value="entregado" ${rep.estado==='entregado'?'selected':''}>Entregado</option>
        </select>
      </td>
      <td><button onclick="eliminarReparacionFirestore('${rep.id}')">❌ Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

async function cambiarEstadoFirestore(id, nuevoEstado) {
  try {
    await db.collection("reparaciones").doc(id).update({ estado: nuevoEstado });
    const rep = reparaciones.find(r => r.id===id);
    if (rep) rep.estado = nuevoEstado;
  } catch (error) {
    console.error("Error cambiando estado:", error);
  }
}

// ==========================
// ======= DEUDORES =========
// ==========================
async function cargarDeudores() {
  try {
    const snapshot = await db.collection("deudores").get();
    deudores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderDeudores(document.querySelector("#tablaDeudores tbody"));
  } catch (error) {
    console.error("Error cargando deudores:", error);
  }
}

async function agregarDeudorFirestore(d) {
  try {
    await db.collection("deudores").add(d);
  } catch (error) {
    console.error("Error agregando deudor:", error);
  }
}

async function eliminarDeudorFirestore(id) {
  try {
    await db.collection("deudores").doc(id).delete();
    deudores = deudores.filter(d => d.id!==id);
    renderDeudores(document.querySelector("#tablaDeudores tbody"));
  } catch (error) {
    console.error("Error eliminando deudor:", error);
  }
}

async function marcarPagadoFirestore(id) {
  try {
    await db.collection("deudores").doc(id).update({ estado: "Pagado" });
    const d = deudores.find(d => d.id===id);
    if (d) d.estado = "Pagado";
    renderDeudores(document.querySelector("#tablaDeudores tbody"));
  } catch (error) {
    console.error("Error marcando pagado:", error);
  }
}

function renderDeudores(tabla) {
  tabla.innerHTML = "";
  deudores.forEach(d => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${d.nombre}</td>
      <td>$${d.monto}</td>
      <td>${d.motivo}</td>
      <td>${d.estado}</td>
      <td>
        <button onclick="marcarPagadoFirestore('${d.id}')">✔️ Pagado</button>
        <button onclick="eliminarDeudorFirestore('${d.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// ==========================
// ======= VENTAS =========
// ==========================
async function cargarVentas() {
  try {
    const snapshot = await db.collection("ventas").get();
    ventas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderVentas(document.querySelector("#tablaVentas tbody"));
  } catch (error) {
    console.error("Error cargando ventas:", error);
  }
}

async function agregarVentaFirestore(v) {
  try {
    await db.collection("ventas").add(v);
  } catch (error) {
    console.error("Error agregando venta:", error);
  }
}

async function eliminarVentaFirestore(id) {
  try {
    await db.collection("ventas").doc(id).delete();
    ventas = ventas.filter(v => v.id!==id);
    renderVentas(document.querySelector("#tablaVentas tbody"));
  } catch (error) {
    console.error("Error eliminando venta:", error);
  }
}

function renderVentas(tabla) {
  tabla.innerHTML = "";
  ventas.forEach(v => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${v.producto}</td>
      <td>${v.cliente}</td>
      <td>$${v.monto}</td>
      <td>${v.metodo}</td>
      <td>${v.fecha}</td>
      <td>
        <button onclick="alert('Ticket:\\nCliente: ${v.cliente}\\nProducto: ${v.producto}\\nMonto: $${v.monto}\\nPago: ${v.metodo}\\nFecha: ${v.fecha}')">🧾 Ticket</button>
        <button onclick="eliminarVentaFirestore('${v.id}')">❌ Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// ==========================
// ======= REPORTES =========
// ==========================
function mostrarReportes() {
  // Ventas por producto
  const ventasPorProducto = {};
  ventas.forEach(v => ventasPorProducto[v.producto] = (ventasPorProducto[v.producto]||0) + v.monto);

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

  // Caja
  const ingresos = movimientos.filter(m => m.tipo==='ingreso').reduce((a,b)=>a+b.monto,0);
  const egresos = movimientos.filter(m => m.tipo==='egreso').reduce((a,b)=>a+b.monto,0);

  const ctxCaja = document.getElementById('graficoCaja').getContext('2d');
  new Chart(ctxCaja, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos','Egresos'],
      datasets: [{ data: [ingresos,egresos], backgroundColor:['#4caf50','#f44336'] }]
    },
    options: { responsive: true }
  });
}

// ==========================
// Cargar todos los módulos al iniciar
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  cargarStock();
  cargarCaja();
  cargarClientes();
  cargarReparaciones();
  cargarDeudores();
  cargarVentas();

  // Formularios
  const formStock = document.getElementById("formStock");
  if (formStock) formStock.addEventListener("submit", async e => {
    e.preventDefault();
    const celular = {
      marca: document.getElementById("marca").value,
      modelo: document.getElementById("modelo").value,
      imei: document.getElementById("imei").value,
      precio: parseFloat(document.getElementById("precio").value)
    };
    await agregarStock(celular);
    formStock.reset();
    await cargarStock();
  });

  const formCaja = document.getElementById("formCaja");
  if (formCaja) formCaja.addEventListener("submit", async e => {
    e.preventDefault();
    const mov = {
      tipo: document.getElementById("tipo").value,
      descripcion: document.getElementById("descripcion").value,
      monto: parseFloat(document.getElementById("monto").value)
    };
    await agregarMovimientoCaja(mov);
    formCaja.reset();
    await cargarCaja();
  });

  const formCliente = document.getElementById("formCliente");
  if (formCliente) formCliente.addEventListener("submit", async e => {
    e.preventDefault();
    const cli = {
      nombre: document.getElementById("nombreCliente").value,
      dni: document.getElementById("dniCliente").value,
      telefono: document.getElementById("telefonoCliente").value,
      email: document.getElementById("emailCliente").value,
      direccion: document.getElementById("direccionCliente").value
    };
    await agregarClienteFirestore(cli);
    formCliente.reset();
    await cargarClientes();
  });

  const formReparacion = document.getElementById("formReparacion");
  if (formReparacion) formReparacion.addEventListener("submit", async e => {
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
    await agregarReparacionFirestore(rep);
    formReparacion.reset();
    await cargarReparaciones();
  });

  const formDeudor = document.getElementById("formDeudor");
  if (formDeudor) formDeudor.addEventListener("submit", async e => {
    e.preventDefault();
    const d = {
      nombre: document.getElementById("nombreDeudor").value,
      monto: parseFloat(document.getElementById("montoDeuda").value),
      motivo: document.getElementById("motivoDeuda").value,
      estado: "Pendiente"
    };
    await agregarDeudorFirestore(d);
    formDeudor.reset();
    await cargarDeudores();
  });

  const formVenta = document.getElementById("formVenta");
  if (formVenta) formVenta.addEventListener("submit", async e => {
    e.preventDefault();
    const v = {
      producto: document.getElementById("productoVenta").value,
      cliente: document.getElementById("clienteVenta").value,
      monto: parseFloat(document.getElementById("montoVenta").value),
      metodo: document.getElementById("metodoPago").value,
      fecha: new Date().toLocaleString()
    };
    await agregarVentaFirestore(v);
    formVenta.reset();
    await cargarVentas();
  });
});
