function mostrarModulo(modulo) {
  const contenido = document.getElementById("contenido");
  let html = "";

  switch (modulo) {
    case "stock":
      html = "<h2>📱 Módulo Stock</h2><p>Aquí podrás gestionar celulares, repuestos y accesorios.</p>";
      break;
    case "caja":
      html = "<h2>💰 Módulo Caja</h2><p>Control de ingresos, egresos y flujo de caja.</p>";
      break;
    case "deudores":
      html = "<h2>📋 Módulo Deudores</h2><p>Lista de clientes con deudas pendientes.</p>";
      break;
    case "reparaciones":
      html = "<h2>🔧 Módulo Reparaciones</h2><p>Registro y seguimiento de equipos en reparación.</p>";
      break;
    case "clientes":
      html = "<h2>👤 Módulo Clientes</h2><p>Base de datos de clientes con historial.</p>";
      break;
    case "ventas":
      html = "<h2>🛒 Módulo Ventas</h2><p>Registro de ventas y facturación.</p>";
      break;
    case "reportes":
      html = "<h2>📊 Módulo Reportes</h2><p>Estadísticas de ventas, caja y stock.</p>";
      break;
    case "garantias":
      html = "<h2>📜 Módulo Garantías</h2><p>Control de garantías de equipos vendidos y reparados.</p>";
      break;
    default:
      html = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }

  contenido.innerHTML = html;
}


let stock = [];

function mostrarModulo(modulo) {
  const contenido = document.getElementById("contenido");
  const modStock = document.getElementById("modulo-stock");

  if (modStock) modStock.style.display = "none"; // ocultamos stock

  switch (modulo) {
    case "stock":
      if (modStock) modStock.style.display = "block";
      break;
    default:
      contenido.innerHTML = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }
}

// Manejo del formulario de stock
document.addEventListener("DOMContentLoaded", () => {
  const formStock = document.getElementById("formStock");
  const tablaStock = document.querySelector("#tablaStock tbody");

  if (formStock) {
    formStock.addEventListener("submit", (e) => {
      e.preventDefault();

      const marca = document.getElementById("marca").value;
      const modelo = document.getElementById("modelo").value;
      const imei = document.getElementById("imei").value;
      const precio = document.getElementById("precio").value;

      const celular = { id: Date.now(), marca, modelo, imei, precio };
      stock.push(celular);

      formStock.reset();
      renderStock(tablaStock);
    });
  }
});

// Renderizar tabla de stock
function renderStock(tablaStock) {
  tablaStock.innerHTML = "";
  stock.forEach((celular) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${celular.marca}</td>
      <td>${celular.modelo}</td>
      <td>${celular.imei}</td>
      <td>$${celular.precio}</td>
      <td>
        <button onclick="eliminarCelular(${celular.id})">❌ Eliminar</button>
      </td>
    `;
    tablaStock.appendChild(fila);
  });
}

function eliminarCelular(id) {
  stock = stock.filter(cel => cel.id !== id);
  const tablaStock = document.querySelector("#tablaStock tbody");
  renderStock(tablaStock);
}

let movimientos = [];

function mostrarModulo(modulo) {
  const modStock = document.getElementById("modulo-stock");
  const modCaja = document.getElementById("modulo-caja");
  const contenido = document.getElementById("contenido");

  if (modStock) modStock.style.display = "none";
  if (modCaja) modCaja.style.display = "none";

  switch (modulo) {
    case "stock":
      if (modStock) modStock.style.display = "block";
      break;
    case "caja":
      if (modCaja) modCaja.style.display = "block";
      break;
    default:
      contenido.innerHTML = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }
}

// Manejo de formulario de caja
document.addEventListener("DOMContentLoaded", () => {
  const formCaja = document.getElementById("formCaja");
  const tablaCaja = document.querySelector("#tablaCaja tbody");

  if (formCaja) {
    formCaja.addEventListener("submit", (e) => {
      e.preventDefault();

      const tipo = document.getElementById("tipo").value;
      const descripcion = document.getElementById("descripcion").value;
      const monto = parseFloat(document.getElementById("monto").value);

      const movimiento = { id: Date.now(), tipo, descripcion, monto };
      movimientos.push(movimiento);

      formCaja.reset();
      renderCaja(tablaCaja);
    });
  }
});

// Renderizar tabla de caja y calcular balance
function renderCaja(tablaCaja) {
  tablaCaja.innerHTML = "";

  let totalIngresos = 0;
  let totalEgresos = 0;

  movimientos.forEach((mov) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${mov.tipo}</td>
      <td>${mov.descripcion}</td>
      <td>$${mov.monto}</td>
      <td><button onclick="eliminarMovimiento(${mov.id})">❌ Eliminar</button></td>
    `;
    tablaCaja.appendChild(fila);

    if (mov.tipo === "ingreso") {
      totalIngresos += mov.monto;
    } else {
      totalEgresos += mov.monto;
    }
  });

  document.getElementById("totalIngresos").innerText = `$${totalIngresos}`;
  document.getElementById("totalEgresos").innerText = `$${totalEgresos}`;
  document.getElementById("balance").innerText = `$${totalIngresos - totalEgresos}`;
}

function eliminarMovimiento(id) {
  movimientos = movimientos.filter(mov => mov.id !== id);
  const tablaCaja = document.querySelector("#tablaCaja tbody");
  renderCaja(tablaCaja);
}

let reparaciones = [];

function mostrarModulo(modulo) {
  const modStock = document.getElementById("modulo-stock");
  const modCaja = document.getElementById("modulo-caja");
  const modReparaciones = document.getElementById("modulo-reparaciones");
  const contenido = document.getElementById("contenido");

  if (modStock) modStock.style.display = "none";
  if (modCaja) modCaja.style.display = "none";
  if (modReparaciones) modReparaciones.style.display = "none";

  switch (modulo) {
    case "stock":
      if (modStock) modStock.style.display = "block";
      break;
    case "caja":
      if (modCaja) modCaja.style.display = "block";
      break;
    case "reparaciones":
      if (modReparaciones) modReparaciones.style.display = "block";
      break;
    default:
      contenido.innerHTML = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }
}

// Manejo de formulario de reparaciones
document.addEventListener("DOMContentLoaded", () => {
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

      const reparacion = { 
        id: Date.now(), 
        cliente, 
        telefono, 
        marca, 
        modelo, 
        imei, 
        falla, 
        estado 
      };

      reparaciones.push(reparacion);
      formReparacion.reset();
      renderReparaciones(tablaReparaciones);
    });
  }
});

// Renderizar tabla de reparaciones
function renderReparaciones(tablaReparaciones) {
  tablaReparaciones.innerHTML = "";

  reparaciones.forEach((rep) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${rep.cliente}</td>
      <td>${rep.telefono}</td>
      <td>${rep.marca} ${rep.modelo}</td>
      <td>${rep.imei}</td>
      <td>${rep.falla}</td>
      <td>
        <select onchange="cambiarEstado(${rep.id}, this.value)">
          <option value="pendiente" ${rep.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="en proceso" ${rep.estado === "en proceso" ? "selected" : ""}>En proceso</option>
          <option value="finalizado" ${rep.estado === "finalizado" ? "selected" : ""}>Finalizado</option>
          <option value="entregado" ${rep.estado === "entregado" ? "selected" : ""}>Entregado</option>
        </select>
      </td>
      <td>
        <button onclick="eliminarReparacion(${rep.id})">❌ Eliminar</button>
      </td>
    `;
    tablaReparaciones.appendChild(fila);
  });
}

// Cambiar estado de reparación
function cambiarEstado(id, nuevoEstado) {
  const rep = reparaciones.find(r => r.id === id);
  if (rep) {
    rep.estado = nuevoEstado;
  }
}

// Eliminar reparación
function eliminarReparacion(id) {
  reparaciones = reparaciones.filter(rep => rep.id !== id);
  const tablaReparaciones = document.querySelector("#tablaReparaciones tbody");
  renderReparaciones(tablaReparaciones);
}

let clientes = [];

function mostrarModulo(modulo) {
  const modStock = document.getElementById("modulo-stock");
  const modCaja = document.getElementById("modulo-caja");
  const modReparaciones = document.getElementById("modulo-reparaciones");
  const modClientes = document.getElementById("modulo-clientes");
  const contenido = document.getElementById("contenido");

  if (modStock) modStock.style.display = "none";
  if (modCaja) modCaja.style.display = "none";
  if (modReparaciones) modReparaciones.style.display = "none";
  if (modClientes) modClientes.style.display = "none";

  switch (modulo) {
    case "stock":
      if (modStock) modStock.style.display = "block";
      break;
    case "caja":
      if (modCaja) modCaja.style.display = "block";
      break;
    case "reparaciones":
      if (modReparaciones) modReparaciones.style.display = "block";
      break;
    case "clientes":
      if (modClientes) modClientes.style.display = "block";
      break;
    default:
      contenido.innerHTML = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }
}

// Manejo de formulario de clientes
document.addEventListener("DOMContentLoaded", () => {
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

      const cliente = {
        id: Date.now(),
        nombre,
        dni,
        telefono,
        email,
        direccion
      };

      clientes.push(cliente);
      formCliente.reset();
      renderClientes(tablaClientes);
    });
  }
});

// Renderizar tabla de clientes
function renderClientes(tablaClientes) {
  tablaClientes.innerHTML = "";

  clientes.forEach((cli) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cli.nombre}</td>
      <td>${cli.dni}</td>
      <td>${cli.telefono}</td>
      <td>${cli.email}</td>
      <td>${cli.direccion}</td>
      <td><button onclick="eliminarCliente(${cli.id})">❌ Eliminar</button></td>
    `;
    tablaClientes.appendChild(fila);
  });
}

function eliminarCliente(id) {
  clientes = clientes.filter(cli => cli.id !== id);
  const tablaClientes = document.querySelector("#tablaClientes tbody");
  renderClientes(tablaClientes);
}

let deudores = [];

function mostrarModulo(modulo) {
  const modStock = document.getElementById("modulo-stock");
  const modCaja = document.getElementById("modulo-caja");
  const modReparaciones = document.getElementById("modulo-reparaciones");
  const modClientes = document.getElementById("modulo-clientes");
  const modDeudores = document.getElementById("modulo-deudores");
  const contenido = document.getElementById("contenido");

  if (modStock) modStock.style.display = "none";
  if (modCaja) modCaja.style.display = "none";
  if (modReparaciones) modReparaciones.style.display = "none";
  if (modClientes) modClientes.style.display = "none";
  if (modDeudores) modDeudores.style.display = "none";

  switch (modulo) {
    case "stock":
      if (modStock) modStock.style.display = "block";
      break;
    case "caja":
      if (modCaja) modCaja.style.display = "block";
      break;
    case "reparaciones":
      if (modReparaciones) modReparaciones.style.display = "block";
      break;
    case "clientes":
      if (modClientes) modClientes.style.display = "block";
      break;
    case "deudores":
      if (modDeudores) modDeudores.style.display = "block";
      break;
    default:
      contenido.innerHTML = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }
}

// Manejo del formulario de deudores
document.addEventListener("DOMContentLoaded", () => {
  const formDeudor = document.getElementById("formDeudor");
  const tablaDeudores = document.querySelector("#tablaDeudores tbody");

  if (formDeudor) {
    formDeudor.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombreDeudor").value;
      const monto = parseFloat(document.getElementById("montoDeuda").value);
      const motivo = document.getElementById("motivoDeuda").value;

      const deuda = {
        id: Date.now(),
        nombre,
        monto,
        motivo,
        estado: "Pendiente"
      };

      deudores.push(deuda);
      formDeudor.reset();
      renderDeudores(tablaDeudores);
    });
  }
});

// Renderizar tabla de deudores
function renderDeudores(tablaDeudores) {
  tablaDeudores.innerHTML = "";

  deudores.forEach((deu) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${deu.nombre}</td>
      <td>$${deu.monto}</td>
      <td>${deu.motivo}</td>
      <td>${deu.estado}</td>
      <td>
        <button onclick="marcarPagado(${deu.id})">✔️ Pagado</button>
        <button onclick="eliminarDeuda(${deu.id})">❌ Eliminar</button>
      </td>
    `;
    tablaDeudores.appendChild(fila);
  });
}

// Marcar deuda como pagada
function marcarPagado(id) {
  const deuda = deudores.find(d => d.id === id);
  if (deuda) {
    deuda.estado = "Pagado";
  }
  const tablaDeudores = document.querySelector("#tablaDeudores tbody");
  renderDeudores(tablaDeudores);
}

// Eliminar deuda
function eliminarDeuda(id) {
  deudores = deudores.filter(deu => deu.id !== id);
  const tablaDeudores = document.querySelector("#tablaDeudores tbody");
  renderDeudores(tablaDeudores);
}


let ventas = [];

function mostrarModulo(modulo) {
  const modStock = document.getElementById("modulo-stock");
  const modCaja = document.getElementById("modulo-caja");
  const modReparaciones = document.getElementById("modulo-reparaciones");
  const modClientes = document.getElementById("modulo-clientes");
  const modDeudores = document.getElementById("modulo-deudores");
  const modVentas = document.getElementById("modulo-ventas");
  const contenido = document.getElementById("contenido");

  if (modStock) modStock.style.display = "none";
  if (modCaja) modCaja.style.display = "none";
  if (modReparaciones) modReparaciones.style.display = "none";
  if (modClientes) modClientes.style.display = "none";
  if (modDeudores) modDeudores.style.display = "none";
  if (modVentas) modVentas.style.display = "none";

  switch (modulo) {
    case "stock": modStock.style.display = "block"; break;
    case "caja": modCaja.style.display = "block"; break;
    case "reparaciones": modReparaciones.style.display = "block"; break;
    case "clientes": modClientes.style.display = "block"; break;
    case "deudores": modDeudores.style.display = "block"; break;
    case "ventas": modVentas.style.display = "block"; break;
    default:
      contenido.innerHTML = "<h2>Bienvenido al sistema</h2><p>Selecciona un módulo del menú superior para comenzar.</p>";
  }
}

// Manejo del formulario de ventas
document.addEventListener("DOMContentLoaded", () => {
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

      const venta = {
        id: Date.now(),
        producto,
        cliente,
        monto,
        metodo,
        fecha
      };

      ventas.push(venta);
      formVenta.reset();
      renderVentas(tablaVentas);
    });
  }
});

// Renderizar tabla de ventas
function renderVentas(tablaVentas) {
  tablaVentas.innerHTML = "";

  ventas.forEach((ven) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${ven.producto}</td>
      <td>${ven.cliente}</td>
      <td>$${ven.monto}</td>
      <td>${ven.metodo}</td>
      <td>${ven.fecha}</td>
      <td>
        <button onclick="generarTicket(${ven.id})">🧾 Ticket</button>
        <button onclick="eliminarVenta(${ven.id})">❌ Eliminar</button>
      </td>
    `;
    tablaVentas.appendChild(fila);
  });
}

// Generar ticket (alert simple por ahora)
function generarTicket(id) {
  const venta = ventas.find(v => v.id === id);
  if (venta) {
    alert(`🧾 Ticket\nCliente: ${venta.cliente}\nProducto: ${venta.producto}\nMonto: $${venta.monto}\nPago: ${venta.metodo}\nFecha: ${venta.fecha}`);
  }
}

// Eliminar venta
function eliminarVenta(id) {
  ventas = ventas.filter(v => v.id !== id);
  const tablaVentas = document.querySelector("#tablaVentas tbody");
  renderVentas(tablaVentas);
}


// === MÓDULO REPORTES === //
function mostrarReportes() {
  const ventasPorProducto = {};
  ventas.forEach(v => {
    ventasPorProducto[v.producto] = (ventasPorProducto[v.producto] || 0) + v.monto;
  });

  // === Gráfico de Ventas por Producto === //
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

  // === Gráfico de Caja (Ingresos vs Egresos) === //
  const ingresos = caja.filter(t => t.tipo === "Ingreso").reduce((acc, t) => acc + t.monto, 0);
  const egresos = caja.filter(t => t.tipo === "Egreso").reduce((acc, t) => acc + t.monto, 0);

  const ctxCaja = document.getElementById('graficoCaja').getContext('2d');
  new Chart(ctxCaja, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos', 'Egresos'],
      datasets: [{
        data: [ingresos, egresos],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: { responsive: true }
  });
}

// Modificar mostrarModulo para que active reportes
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
