// MODO OSCURO
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Modo claro' : '🌙 Modo oscuro';
});

// Fade scroll
const faders = document.querySelectorAll('.fade-scroll');
const appearOptions = { threshold: 0.1 };
const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, appearOptions);
faders.forEach(f => appearOnScroll.observe(f));

// FAQ acordeón
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('active'));
});

// Calendario visual simple - punto 10
function renderCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    let html = '<div class="calendar-days">';
    ['Do','Lu','Ma','Mi','Ju','Vi','Sa'].forEach(d => html+=`<div style="font-weight:bold">${d}</div>`);
    for(let i=0;i<firstDay;i++) html+='<div></div>';
    for(let d=1; d<=daysInMonth; d++) {
        let dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        html += `<div class="cal-day" data-fecha="${dateStr}">${d}</div>`;
    }
    html += '</div>';
    document.getElementById('visualCalendar').innerHTML = html;
    document.querySelectorAll('.cal-day[data-fecha]').forEach(el => {
        el.addEventListener('click', () => {
            document.getElementById('fechaCita').value = el.dataset.fecha;
            document.querySelectorAll('.cal-day').forEach(c=>c.classList.remove('selected'));
            el.classList.add('selected');
        });
    });
}
renderCalendar();

// Precio dinámico + cupón + duración + modalidad
const precioDinamicoSpan = document.getElementById('precioDinamico');
const radioUnica = document.querySelector('input[value="unica"]');
const radioPaquete = document.querySelector('input[value="paquete"]');
const duracionSelect = document.getElementById('duracion');
const modalidadSelect = document.getElementById('modalidad');
const cuponInput = document.getElementById('cupon');

function calcularPrecioFinal() {
    let base = document.querySelector('input[name="servicioTipo"]:checked').value === 'unica' ? 450 : 2000;
    let duracionExtra = 0;
    if(duracionSelect.value === '90') duracionExtra = 150;
    let modalidadAjuste = 0;
    if(modalidadSelect.value === 'domicilio') modalidadAjuste = 200;
    if(modalidadSelect.value === 'teleconsulta') modalidadAjuste = -100;
    let total = base + duracionExtra + modalidadAjuste;
    let cupon = cuponInput.value.trim();
    if(cupon === 'BIENVENIDO10') total *= 0.9;
    precioDinamicoSpan.innerHTML = `💰 Total estimado: $${Math.round(total)} MXN`;
    return Math.round(total);
}
document.querySelectorAll('input[name="servicioTipo"], #duracion, #modalidad, #cupon').forEach(el => el.addEventListener('input', calcularPrecioFinal));
calcularPrecioFinal();

// 16. Lógica de paquete con localStorage (sesiones restantes)
let sesionesRestantes = localStorage.getItem('sesionesRestantes') ? parseInt(localStorage.getItem('sesionesRestantes')) : 0;
function actualizarVisualSesiones() {
    let div = document.getElementById('contadorSesiones');
    if(sesionesRestantes > 0) div.innerHTML = `🎯 Te quedan ${sesionesRestantes} sesiones del paquete. ¡Aprovecha! <button id="gastarSesion">Usar una sesión</button>`;
    else div.innerHTML = `💚 Sin paquete activo. Compra el paquete de 5 sesiones por $2000 y ahorra.`;
    const btnUsar = document.getElementById('gastarSesion');
    if(btnUsar) btnUsar.onclick = () => { if(sesionesRestantes>0) { sesionesRestantes--; localStorage.setItem('sesionesRestantes', sesionesRestantes); actualizarVisualSesiones(); alert('Sesión usada, restan: '+sesionesRestantes); } else alert('No tienes sesiones'); };
}
actualizarVisualSesiones();

// 11. Confirmación por correo (simulación + mailto)
function enviarCorreoConfirmacion(datos) {
    let asunto = `Cita Lalo y Gera - ${datos.nombre}`;
    let cuerpo = `Hola ${datos.nombre}, tu cita ha sido agendada:\nServicio: ${datos.servicio}\nFecha: ${datos.fecha} ${datos.hora}\nTotal: ${datos.total} MXN\nTeléfono: ${datos.telefono}\nCorreo: ${datos.email}`;
    window.location.href = `mailto:${datos.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    setTimeout(() => alert("Se abrirá tu cliente de correo para enviar la confirmación."), 500);
}

// 19 Panel administrativo simple (localStorage)
function guardarCitaEnStorage(cita) {
    let citas = JSON.parse(localStorage.getItem('citas_laloygera') || '[]');
    citas.push(cita);
    localStorage.setItem('citas_laloygera', JSON.stringify(citas));
    console.log("Cita guardada en storage (Admin visual)");
}
// Mostrar en consola o se puede agregar una tabla. Añado un botón de "Ver admin" en footer
const adminBtn = document.createElement('button');
adminBtn.textContent = '📋 Panel Admin (Ver citas)';
adminBtn.style.position ='fixed'; adminBtn.style.bottom='80px'; adminBtn.style.right='20px'; adminBtn.style.zIndex='999'; adminBtn.style.background='#1f8a64'; adminBtn.style.color='white'; adminBtn.style.border='none'; adminBtn.style.padding='8px 12px'; adminBtn.style.borderRadius='30px';
document.body.appendChild(adminBtn);
adminBtn.onclick = () => {
    let citas = JSON.parse(localStorage.getItem('citas_laloygera') || '[]');
    if(citas.length===0) alert("No hay citas registradas");
    else alert("Citas registradas:\n"+citas.map(c=>`${c.nombre} - ${c.fecha} ${c.hora} - ${c.servicio} $${c.total}`).join('\n'));
};

// 20. Simulación recordatorio (se puede agregar notificación)
function recordatorioSimulado() {
    if("Notification" in window && Notification.permission === "granted") new Notification("Lalo y Gera", { body: "No olvides tus ejercicios y tu próxima cita." });
}
if(Notification.permission !== "denied") Notification.requestPermission();

// Botón agendar (Validaciones + simulación y email)
document.getElementById('btnAgendar').addEventListener('click', (e) => {
    e.preventDefault();
    let nombre = document.getElementById('nombre').value.trim();
    let telefono = document.getElementById('telefono').value.trim();
    let email = document.getElementById('email').value.trim();
    let fecha = document.getElementById('fechaCita').value;
    let hora = document.getElementById('horaCita').value;
    let servicioTipo = document.querySelector('input[name="servicioTipo"]:checked').value;
    let duracion = duracionSelect.value;
    let modalidad = modalidadSelect.value;
    let cuponUsado = cuponInput.value.trim();
    let total = calcularPrecioFinal();

    if(!nombre || !telefono || !email || !fecha || !hora) {
        document.getElementById('feedbackMsg').style.display='block';
        document.getElementById('feedbackMsg').innerHTML='❌ Completa todos los campos obligatorios';
        setTimeout(()=>document.getElementById('feedbackMsg').style.display='none',3000);
        return;
    }
    let servicioNombre = servicioTipo === 'unica' ? 'Cita única' : 'Paquete 5 sesiones';
    if(servicioTipo === 'paquete' && sesionesRestantes===0) {
        sesionesRestantes = 5;
        localStorage.setItem('sesionesRestantes', sesionesRestantes);
        actualizarVisualSesiones();
        alert("¡Paquete adquirido! Tienes 5 sesiones disponibles.");
    }
    let citaData = { nombre, telefono, email, fecha, hora, servicio: servicioNombre, duracion, modalidad, cupon:cuponUsado, total, timestamp: new Date().toISOString() };
    guardarCitaEnStorage(citaData);
    document.getElementById('feedbackMsg').style.display='block';
    document.getElementById('feedbackMsg').innerHTML=`✅ Cita confirmada para ${nombre} (${servicioNombre}) - Total $${total}. Revisa tu correo.`;
    setTimeout(()=>document.getElementById('feedbackMsg').style.display='none',5000);
    enviarCorreoConfirmacion(citaData);
    // limpiar opcional
    if(servicioTipo === 'paquete') actualizarVisualSesiones();
});

// 17. Animación ya incluida fade-scroll
// 18 redes sociales ok
// Se añadió duración (12), modalidad (13) y cupón (14)

// Recordatorio automático de ejemplo cada 30s (simula SMS/WA)
setInterval(() => {
    if(localStorage.getItem('citas_laloygera') && JSON.parse(localStorage.getItem('citas_laloygera')).length>0){
        console.log("Recordatorio: siguiente cita próximamente (simulación)");
    }
}, 30000);