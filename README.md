# 🎬 Movie Explorer

**Movie Explorer** es una plataforma interactiva para el descubrimiento de series de TV, construida bajo una arquitectura modular y principios de diseño modernos. Este proyecto forma parte de mi formación profesional hacia el desarrollo **Junior Full-Stack**, enfocándome en la integración eficiente de APIs y persistencia de datos en el cliente.

---

## 🚀 Despliegue (Live Demo)
Puedes interactuar con la aplicación en tiempo real a través del siguiente enlace:  
👉 **[Ver Movie Explorer en Vivo](https://maiver4.github.io/Movies-Explorer/)**

---

## 🛠️ Stack Tecnológico
* **Frontend:** JavaScript (ES6+), HTML5, CSS3.
* **Metodología CSS:** *Mobile First* con uso intensivo de **Custom Properties (Tokens)**.
* **API Externa:** Consumo de **TVMaze API** para metadatos de series en tiempo real.
* **Persistencia:** Manejo de `localStorage` para la gestión de estados persistentes.
* **Herramientas de Desarrollo:** * **Git:** Control de versiones bajo el estándar *Conventional Commits*.
    * **Visual Studio Code:** Entorno de desarrollo principal.

---

## 🏗️ Arquitectura y Características
* **Modularidad JavaScript:** Código organizado en módulos independientes (`ui.js`, `persistence.js`, `api.js`) para garantizar escalabilidad.
* **UI/UX Premium:** Interfaz con efectos de *Glassmorphism*, modo oscuro nativo y animaciones fluidas (`cardIn`/`cardOut`).
* **Búsqueda Asíncrona:** Implementación de búsqueda en tiempo real con manejo de estados de carga (*Skeletons*) y estados vacíos (*Empty States*).
* **Grid Adaptable:** Layout responsivo optimizado para resoluciones desde móviles hasta pantallas de 1400px utilizando CSS Grid.

---

## 📂 Estructura del Proyecto
```text
movie-explorer/
├── assets/             # Recursos visuales, logos y stencils
├── scripts/            # Lógica de la aplicación
│   ├── api.js          # Fetching y endpoints de TVMaze
│   ├── persistence.js  # Lógica de persistencia en LocalStorage
│   ├── ui.js           # Renderizado dinámico de componentes
│   └── favorites.js    # Controlador de la vista de colección
├── styles/             # Arquitectura CSS con Variables Globales
├── index.html          # Dashboard principal de búsqueda
├── favorites.html      # Galería de favoritos del usuario
└── show.html           # Vista detallada de la serie

## Integrantes
* **Maicol Vera**
* **Juan Esteban Navarro**
* **Julian Arias**