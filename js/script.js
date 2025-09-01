// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjR7pnvulb1niEe_nFf8nWGT6YZ4ckue4",
  authDomain: "airfix-control.firebaseapp.com",
  projectId: "airfix-control",
  storageBucket: "airfix-control.firebasestorage.app",
  messagingSenderId: "111362837485",
  appId: "1:111362837485:web:7e1d29a0e834bd5e2235e4",
  measurementId: "G-HNTWQJ7V8L"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Función para mostrar módulos
function mostrarModulo(modulo) {
  const secciones = document.querySelectorAll('main section');
  secciones.forEach(sec => sec.style.display = 'none');
  
  const selected = document.getElementById(`modulo-${modulo}`);
  if (selected) selected.style.display = 'block';
}

// Asignamos click a los enlaces del nav
document.querySelectorAll('nav a[data-modulo]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const modulo = a.dataset.modulo;
    mostrarModulo(modulo);
  });
});

// ----------------------
// FORMULARIO STOCK
// ----------------------
const formStock = document.getElementById('formStock');
const tablaStock = document.querySelector('#tablaStock tbody');

formStock.addEventListener('submit', async e => {
  e.preventDefault();
  
  const marca = document.getElementById('marca').value;
  const modelo = document.getElementById('modelo').value;
  const imei = document.getElementById('imei').value;
  const precio = document.getElementById('precio').value;

  try {
    await addDoc(collection(db, 'stock'), { marca, modelo, imei, precio });
    tablaStock.innerHTML += `
      <tr>
        <td>${marca}</td>
        <td>${modelo}</td>
        <td>${imei}</td>
        <td>${precio}</td>
        <td><button onclick="this.closest('tr').remove()">Eliminar</button></td>
      </tr>
    `;
    formStock.reset();
  } catch(err) {
    console.error("Error agregando stock:", err);
  }
});

// ----------------------
// FORMULARIO CAJA
// ----------------------
const formCaja = document.getElementById('formCaja');
const tablaCaja = document.querySelector('#tablaCaja tbody');
const totalIngresos = document.getElementById('totalIngresos');
const totalEgresos = document.getElementById('totalEgresos');
const balance = document.getElementById('balance');

let ingresos = 0;
let egresos = 0;

formCaja.addEventListener('submit', e => {
  e.preventDefault();
  const tipo = document.getElementById('tipo').value;
  const descripcion = document.getElementById('descripcion').value;
  const monto = parseFloat(document.getElementById('monto').value);

  tablaCaja.innerHTML += `
    <tr>
      <td>${tipo}</td>
      <td>${descripcion}</td>
      <td>${monto}</td>
      <td><button onclick="this.closest('tr').remove(); actualizarCaja()">Eliminar</button></td>
    </tr>
  `;

  if(tipo === 'ingreso') ingresos += monto;
  else egresos += monto;

  actualizarCaja();
  formCaja.reset();
});

function actualizarCaja() {
  ingresos = 0;
  egresos = 0;
  tablaCaja.querySelectorAll('tr').forEach(tr => {
    const tipo = tr.children[0].textContent;
    const monto = parseFloat(tr.children[2].textContent);
    if(tipo === 'ingreso') ingresos += monto;
    else egresos += monto;
  });
  totalIngresos.textContent = `$${ingresos}`;
  totalEgresos.textContent = `$${egresos}`;
  balance.textContent = `$${ingresos - egresos}`;
}

// ----------------------
// FORMULARIO DEUDORES
// ----------------------
const formDeudor = document.getElementById('formDeudor');
const tablaDeudores = document.querySelector('#tablaDeudores tbody');

formDeudor.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombreDeudor').value;
  const monto = document.getElementById('montoDeuda').value;
  const motivo = document.getElementById('motivoDeuda').value;

  tablaDeudores.innerHTML += `
    <tr>
      <td>${nombre}</td>
      <td>${monto}</td>
      <td>${motivo}</td>
      <td>Pendiente</td>
      <td><button onclick="this.closest('tr').remove()">Eliminar</button></td>
    </tr>
  `;
  formDeudor.reset();
});

// ----------------------
// FORMULARIO CLIENTES
// ----------------------
const formCliente = document.getElementById('formCliente');
const tablaClientes = document.querySelector('#tablaClientes tbody');

formCliente.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = document.getElementById('nombreCliente').value;
  const dni = document.getElementById('dniCliente').value;
  const telefono = document.getElementById('telefonoCliente').value;
  const email = document.getElementById('emailCliente').value;
  const direccion = document.getElementById('direccionCliente').value;

  tablaClientes.innerHTML += `
    <tr>
      <td>${nombre}</td>
      <td>${dni}</td>
      <td>${telefono}</td>
      <td>${email}</td>
      <td>${direccion}</td>
      <td><button onclick="this.closest('tr').remove()">Eliminar</button></td>
    </tr>
  `;
  formCliente.reset();
});

// ----------------------
// FORMULARIO VENTAS
// ----------------------
const formVenta = document.getElementById('formVenta');
const tablaVentas = document.querySelector('#tablaVentas tbody');

formVenta.addEventListener('submit', e => {
  e.preventDefault();
  const producto = document.getElementById('productoVenta').value;
  const cliente = document.getElementById('clienteVenta').value;
  const monto = document.getElementById('montoVenta').value;
  const metodo = document.getElementById('metodoPago').value;
  const fecha = new Date().toLocaleDateString();

  tablaVentas.innerHTML += `
    <tr>
      <td>${producto}</td>
      <td>${cliente}</td>
      <td>${monto}</td>
      <td>${metodo}</td>
      <td>${fecha}</td>
      <td><button onclick="this.closest('tr').remove()">Eliminar</button></td>
    </tr>
  `;
  formVenta.reset();
});

export { mostrarModulo };
