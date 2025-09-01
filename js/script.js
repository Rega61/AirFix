// === DATOS LOCALES === //
let stock = [];
let movimientos = [];
let reparaciones = [];
let clientes = [];
let deudores = [];
let ventas = [];

// === MOSTRAR MÓDULO === //
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

// === DOM CONTENT LOADED === //
document.addEventListener("DOMContentLoaded", () => {

  // === FORMULARIO STOCK === //
  const formStock = document.getElementById("formStock");
  const tablaStock = document.querySelector("#tablaStock tbody");
  if (formStock) {
    formStock.addEventListener("submit", (e) => {
      e.preventDefault();
      const marca = document.getElementById("marca").value;
      const modelo = document.getElementById("modelo").value;
      const imei = document.getElementById("imei").value;
      const precio = document.getElementById("precio").value;
      stock.push({ id: Date.now(), marca, modelo, imei, precio });
      formStock.reset();
      renderStock(tablaStock);
    });
  }

  // === FORMULARIO CAJA === //
  const formCaja = document.getElementById("formCaja");
  const tablaCaja = document.querySelector("#tablaCaja tbody");
  if (formCaja) {
    formCaja.addEventListener("submit", (e) => {
      e.preventDefault();
      const tipo = document.getElementById("tipo").value;
      const descripcion = document.getElementById("descripcion").value;
      const monto = parseFloat(document.getElementById("monto").value);
      movimientos.push({ id: Date.now(), tipo, descripcion, monto });
      formCaja.reset();
      renderCaja(tablaCaja);
    });
  }

  // === FORMULARIO REPARACIONES === //
  const formReparacion = document.getElementById("formReparacion");
  const tablaReparaciones = document.querySelector("#tablaReparaciones tbody");
  if (formReparacion) {
    formReparacion.addEventListener("submit", (e) => {
      e.preventDefault();
      const cliente = document.getElementById("cliente").value;
      const telefono = document.getElementById("telefono").value;
      const marca = document.getElementById("marcaRep").value;
      const modelo = document.getElementById("modeloRep").value;
      const imei = document.getElementById("imeiRep").value;
      const falla = document.getElementById("falla").value;
      const estado = document.getElementById("estado").value;
      reparaciones.push({ id: Date.now(), cliente, telefono, marca, modelo, imei, falla, estado });
      formReparacion.reset();
      renderReparaciones(tablaReparaciones);
    });
  }

  // === FORMULARIO CLIENTES === //
  const formCliente = document.getElementById("formCliente");
  const tablaClientes = document.querySelector("#tablaClientes tbody");
  if (formCliente) {
    formCliente.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombreCliente").value;
      const dni = document.getElementById("dniCliente").value;
      const telefono = document.getElementById("telefonoCliente").value;
      const email = document.getElementById("emailCliente").value;
      const direccion = document.getElementById("direccionCliente").value;
      clientes.push({ id: Date.now(), nombre, dni, telefono, email, direccion });
      formCliente.reset();
      renderClientes(tablaClientes);
    });
  }

  // === FORMULARIO DEUDORES === //
  const formDeudor = document.getElementById("formDeudor");
  const tablaDeudores = document.querySelector("#tablaDeudores tbody");
  if (formDeudor) {
    formDeudor.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombreDeudor").value;
      const monto = parseFloat(document.getElementById("montoDeuda").value);
      const motivo = document.getElementById("motivoDeuda").value;
      deudores.push({ id: Date.now(), nombre, monto, motivo, estado: "Pendiente" });
      formDeudor.reset();
      renderDeudores(tablaDeudores);
    });
  }

  // === FORMULARIO VENTAS === //
  const formVenta = document.getElementById("formVenta");
  const tablaVentas = document.querySelector("#tablaVentas tbody");
  if (formVenta) {
    formVenta.addEventListener("submit", (e) => {
      e.preventDefault();
      const producto = document.getElementById("productoVenta").value;
      const cliente = document.getElementById("clienteVenta").value;
      const monto = parseFloat(document.getElementById("montoVenta").value);
      const metodo = document.getElementById("metodoPago").value;
      const fecha = new Date().toLocaleString();
      ventas.push({ id: Date.now(), producto, cliente, monto, metodo, fecha });
      formVenta.reset();
      renderVentas(tablaVentas);
    });
  }

});

// === FUNCIONES RENDER === //
function renderStock(tabla) {
  tabla.innerHTML = "";
  stock.forEach(c => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${c.marca}</td><td>${c.modelo}</td><td>${c.imei}</td><td>$${c.precio}</td>
      <td><button onclick="eliminarStock(${c.id})">❌</button></td>
    `;
    tabla.appendChild(fila);
  });
}
function eliminarStock(id) {
  stock = stock.filter(c => c.id !== id);
  renderStock(document.querySelector("#tablaStock tbody"));
}

function renderCaja(tabla) {
  tabla.innerHTML = "";
  let totalIngresos = 0, totalEgresos = 0;
  movimientos.forEach(m => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${m.tipo}</td><td>${m.descripcion}</td><td>$${m.monto}</td><td><button onclick="eliminarMovimiento(${m.id})">❌</button></td>`;
    tabla.appendChild(fila);
    if (m.tipo === "ingreso") totalIngresos += m.monto; else totalEgresos += m.monto;
  });
  document.getElementById("totalIngresos").innerText = `$${totalIngresos}`;
  document.getElementById("totalEgresos").innerText = `$${totalEgresos}`;
  document.getElementById("balance").innerText = `$${totalIngresos - totalEgresos}`;
}
function eliminarMovimiento(id) {
  movimientos = movimientos.filter(m => m.id !== id);
  renderCaja(document.querySelector("#tablaCaja tbody"));
}

function renderReparaciones(tabla) {
  tabla.innerHTML = "";
  reparaciones.forEach(r => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${r.cliente}</td><td>${r.telefono}</td><td>${r.marca} ${r.modelo}</td><td>${r.imei}</td><td>${r.falla}</td>
      <td>
        <select onchange="cambiarEstado(${r.id}, this.value)">
          <option value="pendiente" ${r.estado==="pendiente"?"selected":""}>Pendiente</option>
          <option value="en proceso" ${r.estado==="en proceso"?"selected":""}>En proceso</option>
          <option value="finalizado" ${r.estado==="finalizado"?"selected":""}>Finalizado</option>
          <option value="entregado" ${r.estado==="entregado"?"selected":""}>Entregado</option>
        </select>
      </td>
      <td><button onclick="eliminarReparacion(${r.id})">❌</button></td>
    `;
    tabla.appendChild(fila);
  });
}
function cambiarEstado(id, estado) {
  const r = reparaciones.find(x=>x.id===id);
  if(r) r.estado=estado;
}
function eliminarReparacion(id) {
  reparaciones = reparaciones.filter(r=>r.id!==id);
  renderReparaciones(document.querySelector("#tablaReparaciones tbody"));
}

function renderClientes(tabla) {
  tabla.innerHTML = "";
  clientes.forEach(c => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${c.nombre}</td><td>${c.dni}</td><td>${c.telefono}</td><td>${c.email}</td><td>${c.direccion}</td><td><button onclick="eliminarCliente(${c.id})">❌</button></td>`;
    tabla.appendChild(fila);
  });
}
function eliminarCliente(id) {
  clientes = clientes.filter(c=>c.id!==id);
  renderClientes(document.querySelector("#tablaClientes tbody"));
}

function renderDeudores(tabla) {
  tabla.innerHTML = "";
  deudores.forEach(d => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${d.nombre}</td><td>$${d.monto}</td><td>${d.motivo}</td><td>${d.estado}</td>
      <td><button onclick="marcarPagado(${d.id})">✔️</button> <button onclick="eliminarDeuda(${d.id})">❌</button></td>`;
    tabla.appendChild(fila);
  });
}
function marcarPagado(id) {
  const d = deudores.find(x=>x.id===id);
  if(d) d.estado="Pagado";
  renderDeudores(document.querySelector("#tablaDeudores tbody"));
}
function eliminarDeuda(id) {
  deudores = deudores.filter(x=>x.id!==id);
  renderDeudores(document.querySelector("#tablaDeudores tbody"));
}

function renderVentas(tabla) {
  tabla.innerHTML = "";
  ventas.forEach(v => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${v.producto}</td><td>${v.cliente}</td><td>$${v.monto}</td><td>${v.metodo}</td><td>${v.fecha}</td>
      <td><button onclick="generarTicket(${v.id})">🧾</button> <button onclick="eliminarVenta(${v.id})">❌</button></td>`;
    tabla.appendChild(fila);
  });
}
function generarTicket(id) {
  const v = ventas.find(x=>x.id===id);
  if(v) alert(`🧾 Ticket\nCliente: ${v.cliente}\nProducto: ${v.producto}\nMonto: $${v.monto}\nPago: ${v.metodo}\nFecha: ${v.fecha}`);
}
function eliminarVenta(id) {
  ventas = ventas.filter(x=>x.id!==id);
  renderVentas(document.querySelector("#tablaVentas tbody"));
}

// === MÓDULO REPORTES === //
function mostrarReportes() {
  // Para simplificar: mostrar solo totales
  const totalVentas = ventas.reduce((a,b)=>a+b.monto,0);
  const totalCaja = movimientos.reduce((a,b)=>a+b.monto,0);
  document.getElementById("totalVentas").innerText = `$${totalVentas}`;
  document.getElementById("totalCaja").innerText = `$${totalCaja}`;
}
