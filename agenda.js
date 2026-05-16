//Cargar la API de Google Maps (asegúrate de reemplazar TU_API_KEY) -->
src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&callback=initMap" async defer></src=>
        
// Variable global para el mapa
let map;
let marker;

// Función que inicializa el mapa (será llamada por la API de Google Maps)
function initMap() {
// Coordenadas de ejemplo: Clínica de fisioterapia en Madrid (Puerta del Sol área)
// Puedes cambiar lat/lng por la dirección real de tu consulta.
const clinicLocation = { lat: 40.416775, lng: -3.703790 }; // Ejemplo: Madrid, Puerta del Sol
            
map = new google.maps.Map(document.getElementById("map"), {
center: clinicLocation,
zoom: 15,
mapTypeControl: true,
streetViewControl: true,
fullscreenControl: true,
styles: [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
    },
],
});
            
marker = new google.maps.Marker({
position: clinicLocation,
map: map,
title: "Fisioterapia Integral · Tu centro de bienestar",
animation: google.maps.Animation.DROP,
});
            
// Añadir un InfoWindow con más detalles
const infoWindow = new google.maps.InfoWindow({
content: `<div style="font-family:system-ui;padding:5px;"><strong>🏥 Clínica de Fisioterapia</strong><br>Calle Ejemplo 123, Madrid<br>📞 Llámanos al +34 912 345 678</div>`,
});
            
marker.addListener("click", () => {
infoWindow.open(map, marker);
});
            
// Opcional: centrar bien si el contenedor tiene un tamaño dinámico
google.maps.event.addDomListener(window, "resize", () => {
map.setCenter(clinicLocation);
});
}
        
// Fallback en caso de que la API no cargue (por si la key es inválida o hay error)
function mapError() {
    document.getElementById("map").innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#e9f0ee;color:#2c5a55;padding:20px;text-align:center;">⚠️ No se pudo cargar el mapa. Por favor, verifica tu conexión o la clave de API de Google Maps.</div>';
}

// VALIDACIONES DEL FORMULARIO (copia robusta igual a la anterior) 
    function hasForbiddenSpecialChars(str) {
        const forbiddenRegex = /[@#$%&*+={}\[\]|\\/:;"'<>,`~]/;
        return forbiddenRegex.test(str);
    }

    function validateName(name) {
        if (!name || name.trim() === "") return false;
        if (hasForbiddenSpecialChars(name)) return false;
        const allowedPattern = /^[a-zA-ZáéíóúñÑüÜ\s\.\-]+$/;
        if (!allowedPattern.test(name)) return false;
        return true;
    }

    function validateEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    function validatePhone(phone) {
        if (!phone) return false;
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        const digitsOnly = cleaned.replace(/\D/g, '');
        if (digitsOnly.length < 8 || digitsOnly.length > 15) return false;
        return /^\d+$/.test(digitsOnly);
    }

    function validateDate(dateString) {
        if (!dateString) return false;
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        maxDate.setHours(23, 59, 59, 999);
        if (selectedDate < today) return false;
        if (selectedDate > maxDate) return false;
        return true;
    }

    function validateTime(timeValue) {
        if (!timeValue) return false;
        const [hour, minute] = timeValue.split(':').map(Number);
        if (isNaN(hour)) return false;
        if (hour < 9 || hour > 19) return false;
        if (hour === 19 && minute > 0) return false;
        return true;
    }

    function populateTimeOptions() {
        const timeSelect = document.getElementById('appointmentTime');
        if (!timeSelect) return;
        timeSelect.innerHTML = '<option value="">-- Selecciona hora --</option>';
        const startHour = 9;
        const endHour = 19;
        for (let h = startHour; h <= endHour; h++) {
            if (h === endHour) {
                const option19 = document.createElement('option');
                option19.value = "19:00";
                option19.textContent = "19:00";
                timeSelect.appendChild(option19);
                break;
            }
            for (let m of [0, 30]) {
                let hourStr = h.toString().padStart(2, '0');
                let minuteStr = m.toString().padStart(2, '0');
                let timeValue = `${hourStr}:${minuteStr}`;
                if (h === 18 && m === 30) {
                    let option = document.createElement('option');
                    option.value = timeValue;
                    option.textContent = timeValue;
                    timeSelect.appendChild(option);
                } else if (h < 18) {
                    let option = document.createElement('option');
                    option.value = timeValue;
                    option.textContent = timeValue;
                    timeSelect.appendChild(option);
                } else if (h === 18 && m === 0) {
                    let option = document.createElement('option');
                    option.value = timeValue;
                    option.textContent = timeValue;
                    timeSelect.appendChild(option);
                }
            }
        }
        // Asegurar que 19:00 aparezca
        let exists1900 = false;
        for(let i=0; i<timeSelect.options.length; i++) {
            if(timeSelect.options[i].value === "19:00") exists1900=true;
        }
        if(!exists1900) {
            let opt = document.createElement('option');
            opt.value="19:00";
            opt.textContent="19:00";
            timeSelect.appendChild(opt);
        }
    }

    function toggleInputError(inputElement, errorElement, isValid) {
        if (!isValid) {
            inputElement.classList.add('invalid-input');
            errorElement.classList.add('visible');
        } else {
            inputElement.classList.remove('invalid-input');
            errorElement.classList.remove('visible');
        }
    }

    function setupRealTimeValidation() {
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('appointmentDate');
        const timeSelect = document.getElementById('appointmentTime');
        
        const nameErr = document.getElementById('nameError');
        const emailErr = document.getElementById('emailError');
        const phoneErr = document.getElementById('phoneError');
        const dateErr = document.getElementById('dateError');
        const timeErr = document.getElementById('timeError');

        nameInput.addEventListener('input', () => toggleInputError(nameInput, nameErr, validateName(nameInput.value)));
        emailInput.addEventListener('input', () => toggleInputError(emailInput, emailErr, validateEmail(emailInput.value)));
        phoneInput.addEventListener('input', () => toggleInputError(phoneInput, phoneErr, validatePhone(phoneInput.value)));
        dateInput.addEventListener('change', () => toggleInputError(dateInput, dateErr, validateDate(dateInput.value)));
        timeSelect.addEventListener('change', () => toggleInputError(timeSelect, timeErr, validateTime(timeSelect.value)));
    }

    function setDatePickerLimits() {
        const datePicker = document.getElementById('appointmentDate');
        if (!datePicker) return;
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const minDate = `${yyyy}-${mm}-${dd}`;
        const maxDateObj = new Date();
        maxDateObj.setMonth(maxDateObj.getMonth() + 3);
        const maxY = maxDateObj.getFullYear();
        const maxM = String(maxDateObj.getMonth() + 1).padStart(2, '0');
        const maxD = String(maxDateObj.getDate()).padStart(2, '0');
        const maxDate = `${maxY}-${maxM}-${maxD}`;
        datePicker.setAttribute('min', minDate);
        datePicker.setAttribute('max', maxDate);
    }

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
        
        const nameErr = document.getElementById('nameError');
        const emailErr = document.getElementById('emailError');
        const phoneErr = document.getElementById('phoneError');
        const dateErr = document.getElementById('dateError');
        const timeErr = document.getElementById('timeError');
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('appointmentDate');
        const timeSelect = document.getElementById('appointmentTime');
        
        toggleInputError(nameInput, nameErr, isNameValid);
        toggleInputError(emailInput, emailErr, isEmailValid);
        toggleInputError(phoneInput, phoneErr, isPhoneValid);
        toggleInputError(dateInput, dateErr, isDateValid);
        toggleInputError(timeSelect, timeErr, isTimeValid);
        
        if (!isNameValid || !isEmailValid || !isPhoneValid || !isDateValid || !isTimeValid) {
            alert("❌ Por favor, revisa los campos.\n- Nombre sin caracteres especiales (@, #, $, etc.)\n- Correo electrónico válido\n- Teléfono con al menos 8 dígitos\n- Fecha válida (hoy + 3 meses)\n- Horario entre 9:00 y 19:00");
            return;
        }
        
        alert(`✅ ¡Cita agendada con éxito!\n\n📌 Paciente: ${name.trim()}\n📧 Correo: ${email.trim()}\n📞 Teléfono: ${phone.trim()}\n📅 Fecha: ${date}\n⏰ Horario: ${time}\n\nNos vemos en nuestra clínica (revisa el mapa).`);
        
        document.getElementById('appointmentForm').reset();
        document.querySelectorAll('.invalid-input').forEach(el => el.classList.remove('invalid-input'));
        document.querySelectorAll('.error-msg.visible').forEach(el => el.classList.remove('visible'));
        populateTimeOptions();
        setDatePickerLimits();
        const datePickerReset = document.getElementById('appointmentDate');
        if(datePickerReset) datePickerReset.value = '';
        const timeSelReset = document.getElementById('appointmentTime');
        if(timeSelReset) timeSelReset.value = '';
    }
    
    // Inicializar todo una vez cargado el DOM
    document.addEventListener('DOMContentLoaded', () => {
        populateTimeOptions();
        setDatePickerLimits();
        setupRealTimeValidation();
        const form = document.getElementById('appointmentForm');
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Capturar error de carga de mapa y mostrar mensaje amigable
    window.mapError = mapError;
    // Si la API falla por clave incorrecta, intentaremos mostrar mensaje manual.
    setTimeout(() => {
        const mapDiv = document.getElementById('map');
        if(mapDiv && mapDiv.innerHTML.trim() === '' && typeof google === 'undefined') {
            mapDiv.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f0f4f2;color:#a03d2f;">⚠️ Error de conexión con Google Maps. Revisa la API Key.</div>';
        }
    }, 3000);