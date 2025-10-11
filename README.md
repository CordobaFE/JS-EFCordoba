💆‍♂️ Proyecto Final — Circuitos de Masajes “Bambú”

Este proyecto es un simulador interactivo en JavaScript que representa el flujo completo de un sistema de reservas online para un centro de masajes.
Fue desarrollado como proyecto final del curso de JavaScript de Coderhouse.

🧭 Descripción general

El sitio permite a los usuarios:

Explorar los tres servicios disponibles:

Circuito de Renovación

Circuito de Relajación

Circuito de Lujo

Seleccionar la duración del masaje (60, 90 o 120 minutos)

Añadir sesiones al carrito.

Aplicar cupones de descuento.

Completar una reserva simulada con datos personales y selección de terapeuta.

Visualizar un comprobante final con los detalles del turno y el terapeuta elegido.

⚙️ Aspectos técnicos

Datos simulados en JSON (data/masajes.json, data/cupones.json).

Carga asíncrona mediante fetch().

Interfaz dinámica e interactiva generada completamente desde JavaScript.

Librería externa: SweetAlert2
 para todos los modales, reemplazando alert, prompt y confirm.

Persistencia local: el carrito y las reservas se guardan en localStorage.

HTML + CSS + JS estructurados y referenciados correctamente.

Diseño responsive manteniendo el estilo del sitio original del curso de Desarrollo Web.

💡 Cumplimiento de la consigna

✅ Simulador interactivo funcional
✅ Datos remotos (simulados con JSON)
✅ HTML generado dinámicamente desde JS
✅ Librería externa implementada
✅ Lógica de negocio completa (agregar, procesar y confirmar reservas)
✅ Código limpio, comentado y legible
✅ Formulario con precarga de datos
✅ Entrega en formato .zip (ProyectoFinal+Cordoba.zip)

Codigos de Descuento:
| Código         | Descuento | Ejemplo de uso                      |
| -------------- | --------- | ----------------------------------- |
| `MASAJE10`     | 10 %      | Ingresalo para un descuento general |
| `RELAX20`      | 20 %      | Ideal para Circuito de Relajación   |
| `PRIMERVISITA` | 15 %      | Para clientes nuevos                |
