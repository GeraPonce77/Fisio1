    // LISTA DE NOMBRES Y COMENTARIOS SIMULADOS 
    const nombres = [
        "María García", "Javier López", "Carmen Ruiz", "David Fernández", "Laura Martínez", 
        "Carlos Sánchez", "Ana Gómez", "Pedro Jiménez", "Elena Díaz", "Sergio Romero",
        "Isabel Torres", "Raúl Navarro", "Patricia Molina", "Alberto Serrano", "Nuria Vázquez"
    ];
    
    const comentariosPositivos = [
        "Excelente atención, muy profesional. Volveré sin duda.",
        "Me ayudó muchísimo con mi dolor lumbar, totalmente recomendable.",
        "El tratamiento fue muy efectivo, noté mejoría desde la primera sesión.",
        "Atención personalizada y cálida. El lugar es muy acogedor.",
        "Gran experiencia, los ejercicios en casa marcaron la diferencia.",
        "El fisioterapeuta explica cada paso, me sentí en buenas manos.",
        "Salí mucho mejor de lo que entré. ¡Increíble!",
        "Muy puntuales y flexibles con los horarios, excelente servicio."
    ];
    
    const comentariosNeutros = [
        "Bien, aunque esperaba algo más de seguimiento.",
        "La clínica está bien ubicada, pero la sala de espera es pequeña.",
        "Tratamiento correcto, sin quejas pero sin entusiasmo.",
        "Aceptable, me alivió pero tuve que pedir otra cita de refuerzo."
    ];
    
    const comentariosNegativos = [
        "No noté mejoría tras varias sesiones, quizá mi lesión era más compleja.",
        "El lugar está bien pero los horarios eran limitados para mí.",
        "Regular, me gustaría más disponibilidad de citas.",
        "No fue lo que esperaba, aunque el trato fue amable."
    ];
    
    // Función para generar calificación aleatoria entera entre 0 y 5
    function getRandomRating() {
        return Math.floor(Math.random() * 6); // 0,1,2,3,4,5
    }
    
    // Función para obtener comentario según la calificación
    function getCommentByRating(rating) {
        if (rating >= 4) {
            return comentariosPositivos[Math.floor(Math.random() * comentariosPositivos.length)];
        } else if (rating === 3) {
            return comentariosNeutros[Math.floor(Math.random() * comentariosNeutros.length)];
        } else {
            return comentariosNegativos[Math.floor(Math.random() * comentariosNegativos.length)];
        }
    }
    
    // Función para generar una reseña aleatoria
    function generateRandomReview() {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const rating = getRandomRating();
        const comentario = getCommentByRating(rating);
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 60)); // reseñas de los últimos 60 días
        const fechaStr = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
        
        return { nombre, rating, comentario, fecha: fechaStr };
    }
    
    // Renderizar estrellas según puntuación (0 a 5)
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '⭐';
            } else {
                stars += '<span class="star-empty">☆</span>';
            }
        }
        return stars;
    }
    
    // Mostrar lista de reseñas y promedio
    let reseñasActuales = []; // almacena las reseñas generadas
    
    function updateReviewsUI() {
        const container = document.getElementById('reviewsContainer');
        const promedioSpan = document.getElementById('promedioContainer');
        
        if (!reseñasActuales.length) {
            container.innerHTML = '<div class="empty-reviews">🌟 Haz clic en "Ver reseñas recientes" para ver opiniones 🌟</div>';
            promedioSpan.innerHTML = '⭐ Promedio: -- (0 reseñas)';
            return;
        }
        
        // Calcular promedio
        let suma = 0;
        reseñasActuales.forEach(r => suma += r.rating);
        const promedio = (suma / reseñasActuales.length).toFixed(1);
        promedioSpan.innerHTML = `⭐ Promedio: ${promedio} (${reseñasActuales.length} reseñas)`;
        
        // Generar HTML
        let html = '';
        reseñasActuales.forEach(review => {
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">${escapeHtml(review.nombre)}</span>
                        <span class="review-stars">${renderStars(review.rating)}</span>
                    </div>
                    <div class="review-comment">“${escapeHtml(review.comentario)}”</div>
                    <div class="review-date">📅 ${review.fecha}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    
    // Función para escapar HTML y evitar inyección
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    }
    
    // Generar entre 3 y 7 reseñas aleatorias (simulando opiniones)
    function generateRandomReviews() {
        const numReviews = Math.floor(Math.random() * 6) + 3; // entre 3 y 8 reseñas
        const nuevasReseñas = [];
        for (let i = 0; i < numReviews; i++) {
            nuevasReseñas.push(generateRandomReview());
        }
        // Ordenar por fecha descendente (más recientes primero)
        nuevasReseñas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        reseñasActuales = nuevasReseñas;
        updateReviewsUI();
    }