/* ============================================================
 * MODO OSCURO - Persistente en TODAS las páginas
 * ============================================================ */

function aplicarModoOscuro() {
    const boton = document.getElementById('darkModeToggle');
    const modoOscuroActivado = localStorage.getItem('darkMode') === 'enabled';
    
    if (modoOscuroActivado) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    if (boton) {
        if (modoOscuroActivado) {
            boton.textContent = '☀️ Modo día';
        } else {
            boton.textContent = '🌙 Modo noche';
        }
    }
}

function inicializarBotonModoOscuro() {
    const boton = document.getElementById('darkModeToggle');
    if (!boton) return;
    
    const nuevoBoton = boton.cloneNode(true);
    boton.parentNode.replaceChild(nuevoBoton, boton);
    
    nuevoBoton.addEventListener('click', function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            localStorage.setItem('darkMode', 'disabled');
            document.body.classList.remove('dark-mode');
            nuevoBoton.textContent = '🌙 Modo noche';
        } else {
            localStorage.setItem('darkMode', 'enabled');
            document.body.classList.add('dark-mode');
            nuevoBoton.textContent = '☀️ Modo día';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    aplicarModoOscuro();
    inicializarBotonModoOscuro();
});

/* ============================================================
 * LANDING PAGE - LALO Y GERA FISIOTERAPIA
 * Programación Orientada a Objetos: Clase Carrito
 * ============================================================ */

class Carrito {
    constructor() {
        this.items = this.cargarDeLocalStorage();
        this.cuponAplicado = null;
        this.actualizarContador();
    }

    cargarDeLocalStorage() {
        const guardado = localStorage.getItem('carritoLaloYGera');
        return guardado ? JSON.parse(guardado) : [];
    }

    guardarEnLocalStorage() {
        localStorage.setItem('carritoLaloYGera', JSON.stringify(this.items));
    }

    agregarItem(id, nombre, precio, cantidad = 1) {
        const existente = this.items.find(item => item.id === id);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            this.items.push({ id, nombre, precio, cantidad });
        }
        this.guardarEnLocalStorage();
        this.actualizarContador();
        this.mostrarNotificacion(`✅ ${nombre} agregado al carrito`);
        return true;
    }

    eliminarItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarEnLocalStorage();
        this.actualizarContador();
        this.mostrarNotificacion(`🗑️ Producto eliminado del carrito`);
    }

    actualizarContador() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
            cartCount.textContent = totalItems;
        }
    }

    mostrarNotificacion(mensaje) {
        console.log(mensaje);
    }
}

// Inicializar carrito
const carrito = new Carrito();