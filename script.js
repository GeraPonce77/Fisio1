/* ============================================================
 * LANDING PAGE - LALO Y GERA FISIOTERAPIA
 * Programación Orientada a Objetos: Clase Carrito
 * Formulario con validación y eventos
 * ============================================================ */

// ========== CLASE CARRITO (POO) ==========
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

    elim