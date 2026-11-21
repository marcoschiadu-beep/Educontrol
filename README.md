# EduControl — Sistema de Gestión Académica

Aplicación web para administrar estudiantes, asignaturas y calificaciones mediante operaciones CRUD.

## Tecnologías
- HTML5
- CSS3
- JavaScript puro (Vanilla JavaScript)
- localStorage

## Cómo ejecutar
1. Descarga o clona este repositorio.
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html` con Live Server, o ábrelo directamente en el navegador.
4. Los datos se guardan en el almacenamiento local del navegador.

## Funcionalidades
- Dashboard con estadísticas.
- CRUD de estudiantes y búsqueda.
- CRUD de asignaturas.
- CRUD de calificaciones (rango de 0.0 a 5.0).
- Confirmación antes de eliminar.
- Validación de formularios.
- Persistencia mediante localStorage.
- Diseño adaptable.


## Prompts utilizados durante el desarrollo

Para desarrollar EduControl se utilizó ChatGPT como herramienta de apoyo durante la planificación y programación de la aplicación.

### Prompt 1. Planificación y arquitectura

**Objetivo:** Definir la estructura, funcionalidades y tecnologías del proyecto.

**Prompt utilizado:**

Actúa como un ingeniero de software senior especializado en desarrollo web.

Quiero desarrollar una aplicación web llamada EduControl, un Sistema de Gestión Académica con un diseño minimalista, moderno y profesional.

El objetivo es administrar estudiantes, asignaturas y calificaciones mediante operaciones CRUD.

Define la arquitectura del proyecto, la responsabilidad de cada archivo, las entidades y sus atributos, las relaciones entre ellas y un plan de desarrollo por etapas.

No generes todavía todo el código. Quiero desarrollar el proyecto progresivamente y comprender cada parte.

**Resultado:** Se definió la planificación inicial y la estructura del proyecto.

### Prompt 2. Desarrollo de la aplicación

**Objetivo:** Generar el código fuente de la aplicación.

**Prompt utilizado:**

Actúa como un desarrollador web senior. Necesito crear una aplicación web funcional llamada EduControl, un Sistema de Gestión Académica.

Utiliza únicamente HTML5, CSS3 y JavaScript puro, sin frameworks ni dependencias externas.

Quiero una aplicación minimalista, moderna y profesional, con fondo blanco, detalles azules, tarjetas estadísticas, menú lateral y tablas organizadas.

Implementa un Dashboard, CRUD completo de estudiantes, asignaturas y calificaciones, búsqueda de estudiantes, almacenamiento mediante localStorage, confirmaciones antes de eliminar, validación de formularios y diseño responsive.

Separa el código en index.html, styles.css y app.js. Utiliza funciones organizadas, nombres descriptivos, comentarios y registros de demostración únicamente cuando el almacenamiento esté vacío.

Entrega el código completo de cada archivo, sin pseudocódigo, y explica cómo ejecutar y probar la aplicación en Visual Studio Code.

**Resultado:** Se generó la aplicación web funcional con sus módulos académicos y operaciones CRUD.

### Prompt 3. Verificación del funcionamiento

**Objetivo:** Comprobar que las funcionalidades desarrolladas trabajaran correctamente.

**Actividades realizadas:**

- Ejecutar la aplicación en el navegador.
- Registrar y consultar estudiantes.
- Buscar y editar registros.
- Eliminar registros con confirmación.
- Registrar asignaturas y calificaciones.
- Comprobar la persistencia de los datos utilizando localStorage.

**Resultado:** Se comprobó el funcionamiento de los módulos principales antes de publicar el proyecto en GitHub.


## Capturas
<img width="1917" height="875" alt="Captura de pantalla 2026-11-20 210751" src="https://github.com/user-attachments/assets/16af1d88-6ea0-411d-89d6-5eb287db425b" />
<img width="1917" height="868" alt="Captura de pantalla 2026-11-20 210724" src="https://github.com/user-attachments/assets/54545b0d-43da-4e2d-98d4-75b5b20ae225" />
<img width="1917" height="875" alt="Captura de pantalla 2026-11-20 210715" src="https://github.com/user-attachments/assets/3a5b9989-9c16-4e18-84a2-7dbc8a5d1234" />
<img width="1901" height="882" alt="Captura de pantalla 2026-11-20 210703" src="https://github.com/user-attachments/assets/cc0e75d9-0e25-429f-a668-0d29bdbc4b47" />


## Nota
Los registros de demostración se insertan únicamente la primera vez que se abre la aplicación en un navegador sin datos guardados.
