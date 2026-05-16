// Expresiones regulares
const REGEX = {
    // Solo letras, espacios, puntos y guiones. Minimo 3 caracteres
    name: /^[a-zA-ZáéíóúñÑüÜ\s\.\-]{3,}$/,
    
    // Email: formato estandar usuario@dominio.com
    email: /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/,
    
    // Telefono: minimo 8 digitos
    phone: /^[\d\s\-\(\)]{8,}$/,
    
    // Fecha: formato YYYY-MM-DD
    date: /^\d{4}-\d{2}-\d{2}$/,
    
    // Hora: formato HH:MM
    time: /^(0[9-9]|1[0-9]):[0-5][0-9]$/
};

// Validacion especifica para horario (9:00 a 17:00)
function isValidTimeRange(time) {
    if (!time) return false;
    const [hour, minute] = time.split(':').map(Number);
    if (hour < 9 || hour > 17) return false;
    if (hour === 17 && minute > 0) return false;
    return true;
}

// Validacion de fecha (no pasado, maximo 3 meses)
function isValidDateRange(dateString) {
    if (!dateString) return false;
    const selected = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setHours(23, 59, 59, 999);
    return selected >= today && selected <= maxDate;
}

// Validar nombre con regex
function validateName(name) {
    if (!name || name.trim() === "") return false;
    return REGEX.name.test(name.trim());
}

// Validar email con regex
function validateEmail(email) {
    if (!email) return false;
    return REGEX.email.test(email.trim());
}

// Validar telefono con regex
function validatePhone(phone) {
    if (!phone) return false;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 8 && digitsOnly.length <= 10;
}

// Validar fecha (formato + rango)
function validateDate(date) {
    if (!date) return false;
    if (!REGEX.date.test(date)) return false;
    return isValidDateRange(date);
}

// Validar hora (formato + rango)
function validateTime(time) {
    if (!time) return false;
    if (!REGEX.time.test(time)) return false;
    return isValidTimeRange(time);
}

// Mostrar/ocultar mensajes de error
function showError(inputId, errorId, isValid, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    
    if (!input || !errorDiv) return;
    
    if (!isValid) {
        input.classList.add('invalid-input');
        errorDiv.textContent = message;
        errorDiv.classList.add('visible');
    } else {
        input.classList.remove('invalid-input');
        errorDiv.textContent = '';
        errorDiv.classList.remove('visible');
    }
}

// Validar campo en tiempo real
function setupRealtimeValidation() {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const isValid = validateName(nameInput.value);
            showError('fullName', 'nameError', isValid, 'Nombre invalido (solo letras, minimo 3)');
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const isValid = validateEmail(emailInput.value);
            showError('email', 'emailError', isValid, 'Correo invalido (ej: nombre@dominio.com)');
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            const isValid = validatePhone(phoneInput.value);
            showError('phone', 'phoneError', isValid, 'Telefono invalido (minimo 8 digitos)');
        });
    }
    
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            const isValid = validateDate(dateInput.value);
            showError('appointmentDate', 'dateError', isValid, 'Fecha invalida (hoy + 3 meses)');
        });
    }
    
    if (timeSelect) {
        timeSelect.addEventListener('change', () => {
            const isValid = validateTime(timeSelect.value);
            showError('appointmentTime', 'timeError', isValid, 'Horario invalido (9:00-17:00)');
        });
    }
}

// Generar opciones de hora (9:00 a 17:00)
function populateTimeOptions() {
    const timeSelect = document.getElementById('appointmentTime');
    if (!timeSelect) return;
    
    timeSelect.innerHTML = '<option value="">-- Selecciona hora --</option>';
    
    for (let hour = 9; hour <= 16; hour++) {
        for (let minute of [0]) {
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            const timeValue = `${hourStr}:${minuteStr}`;
            const option = document.createElement('option');
            option.value = timeValue;
            option.textContent = timeValue;
            timeSelect.appendChild(option);
        }
    }
    
    const lastOption = document.createElement('option');
    lastOption.value = "17:00";
    lastOption.textContent = "17:00";
    timeSelect.appendChild(lastOption);
}

// Configurar limites del datepicker (hoy a 3 meses)
function setDatePickerLimits() {
    const datePicker = document.getElementById('appointmentDate');
    if (!datePicker) return;
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    datePicker.min = `${yyyy}-${mm}-${dd}`;
    
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxY = maxDate.getFullYear();
    const maxM = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxD = String(maxDate.getDate()).padStart(2, '0');
    datePicker.max = `${maxY}-${maxM}-${maxD}`;
}

// Manejar envio del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isDateValid = validateDate(date);
    const isTimeValid = validateTime(time);
    
    showError('fullName', 'nameError', isNameValid, 'Nombre invalido (solo letras, minimo 3)');
    showError('email', 'emailError', isEmailValid, 'Correo invalido');
    showError('phone', 'phoneError', isPhoneValid, 'Telefono invalido (minimo 8 digitos)');
    showError('appointmentDate', 'dateError', isDateValid, 'Fecha invalida (hoy + 3 meses)');
    showError('appointmentTime', 'timeError', isTimeValid, 'Horario invalido (9:00-17:00)');
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isDateValid || !isTimeValid) {
        alert("Por favor, corrige los errores antes de continuar.");
        return;
    }
    
    alert(`Cita agendada con exito!\n\nPaciente: ${name}\nCorreo: ${email}\nTelefono: ${phone}\nFecha: ${date}\nHora: ${time}\n\nTe esperamos en nuestra clinica.`);
    
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    
    document.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    document.querySelectorAll('.invalid-input').forEach(el => {
        el.classList.remove('invalid-input');
    });
}

// Inicializar todo cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    populateTimeOptions();
    setDatePickerLimits();
    setupRealtimeValidation();
    
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});