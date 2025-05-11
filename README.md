[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Pleo2/retail-control-panel-Venezuela-technicaltest-at-tiendas-daka) [![wakatime](https://wakatime.com/badge/user/dc33b9be-4484-429a-9ab9-f51a80346371/project/3f91aeae-22da-49e1-9830-9f32db9cf5b2.svg)](https://wakatime.com/badge/user/dc33b9be-4484-429a-9ab9-f51a80346371/project/3f91aeae-22da-49e1-9830-9f32db9cf5b2)

# Tablero de Control para Retail (Venezuela) - Prueba Técnica Vue 3

## Objetivo del Proyecto

Este proyecto es una solución a la prueba técnica para desarrollar un tablero de control interactivo para una empresa de retail en Venezuela. La aplicación consume datos de productos de [FakeStoreAPI](https://fakestoreapi.com/) y tasas de cambio de [pyDolarVenezuela](https://pydolarve.org/) para presentar información relevante de manera clara y eficiente, incluyendo precios en USD y VES.

El tablero permite a los usuarios visualizar un listado de productos, aplicar filtros por categoría y rango de precios, y observar estadísticas clave que se actualizan dinámicamente.

## Demo (Opcional)

*(Si despliegas el proyecto en Vercel, Netlify, GitHub Pages, etc., incluye un enlace aquí. Ejemplo:)*
[Enlace a la Demo en Vivo](#) *(Reemplaza # con tu URL real)*

*(También podrías incluir un GIF o una captura de pantalla mostrando la aplicación en acción)*
![Captura de Pantalla de la Aplicación](placeholder-screenshot.png) *(Reemplaza con una imagen real)*

## Funcionalidades Implementadas

Este tablero de control cumple con todos los requisitos solicitados, ofreciendo una experiencia de usuario fluida y moderna:

### 1. Listado de Productos
*   **Consumo de API Externa:** Productos obtenidos dinámicamente de `https://fakestoreapi.com/products`.
*   **Visualización en Cuadrícula Responsiva:** Los productos se muestran en un layout de cuadrícula que se adapta a diferentes tamaños de pantalla (móvil, tablet, escritorio) gracias a Tailwind CSS.
*   **Información Detallada del Producto:** Cada tarjeta de producto muestra:
    *   **Imagen del Producto:** Con **carga diferida (`loading="lazy"`)** para optimizar el rendimiento inicial de la página y manejo de errores de imagen mostrando un placeholder.
    *   **Título y Categoría:** Claramente visibles.
    *   **Precios Duales:**
        *   **Precio en USD:** Mostrado directamente.
        *   **Precio en VES:** Calculado en tiempo real utilizando la tasa de cambio obtenida de `https://pydolarve.org/api/v1/dollar?page=bcv` (monitor BCV).
*   **Formato de Moneda Venezolano:** Los precios en VES se presentan en el formato local (ej: `1.234,50 Bs.`).
*   **Paginación del Lado del Cliente:** Se muestran 5 productos por página, con controles de navegación intuitivos.

### 2. Tablero de Control (Estadísticas Dinámicas)
Ubicado en la parte superior de la interfaz, muestra las siguientes estadísticas, recalculadas en tiempo real según los filtros aplicados:
*   **Total de Productos:** Número total de productos que coinciden con los filtros actuales.
*   **Categorías Únicas:** Cantidad de categorías distintas presentes en la selección filtrada.
*   **Precio Promedio (USD):** Costo promedio en USD de los productos filtrados.

### 3. Filtros Interactivos
Los filtros se aplican **del lado del cliente** sobre el conjunto total de productos para una respuesta instantánea:
*   **Filtro por Categoría:** Permite seleccionar una categoría específica de un dropdown populado dinámicamente desde `https://fakestoreapi.com/products/categories`. También incluye una opción "Todas las categorías".
*   **Filtro por Rango de Precios (USD):** Inputs para definir un precio mínimo y/o máximo.
*   **(Extra)** **Persistencia de Filtro de Categoría:** La categoría seleccionada se guarda en `localStorage` y se recupera al recargar la página, mejorando la experiencia del usuario.

### 4. Requisitos de Código y Técnicos Cumplidos
*   **Vue 3 con Composition API:** El proyecto está construido utilizando la Composition API y la sintaxis `<script setup lang="ts">` para un código más organizado, legible y eficiente.
*   **Manejo de Estados de Carga y Error:** La interfaz de usuario informa claramente al usuario durante la carga de datos y en caso de errores en las llamadas API, utilizando el robusto sistema de gestión de estado del servidor de **TanStack Query (Vue Query)**.
*   **Componentes Modulares:** La aplicación se estructura en componentes bien definidos y reutilizables (Tarjeta de Producto, Paginación, Estadísticas, Filtros).
*   **Librerías Recomendadas:** Se utiliza **Axios** para las solicitudes HTTP y **Tailwind CSS (v4)** para un estilizado rápido, moderno y responsivo.

## Decisiones Técnicas Relevantes y Bondades del Proyecto

La arquitectura y las herramientas seleccionadas para este proyecto se enfocaron en la modernidad, eficiencia, escalabilidad y calidad del código:

*   **Stack Tecnológico Moderno:**
    *   **Vue 3 y Vite:** Para una experiencia de desarrollo rápida y un empaquetado optimizado.
    *   **TypeScript:** Para un desarrollo más robusto, seguro y fácil de mantener, mejorando la calidad del código y la colaboración.
    *   **Bun:** Utilizado como gestor de paquetes y ejecutor de tareas, ofreciendo velocidades significativamente mayores en instalación y ejecución de scripts.
    *   **Tailwind CSS v4:** Proporciona un framework de utilidad de primera clase para construir interfaces personalizadas rápidamente, con un enfoque en el rendimiento y un motor de última generación.
*   **Gestión Avanzada de Estado del Servidor con TanStack Query (Vue Query):**
    *   Simplifica drásticamente el fetching, caching, sincronización y actualización de datos del servidor.
    *   Proporciona manejo out-of-the-box para estados de carga, error, éxito, reintentos, y `stale-while-revalidate`, mejorando la UX y reduciendo el boilerplate.
*   **Arquitectura de Código Organizada (Capa `core`):**
    *   Se implementó una separación de responsabilidades clara con una carpeta `core` que contiene:
        *   `api/`: Instancias de Axios configuradas para cada API externa.
        *   `actions/`: Funciones que encapsulan la lógica de realizar las llamadas API y procesar las respuestas iniciales.
        *   `infrastructure/interfaces/`: Definiciones TypeScript para las respuestas crudas de las API (`*-api.types.ts`) y para los modelos de datos internos de la aplicación (`app.types.ts`).
        *   `infrastructure/mappers/`: Clases responsables de transformar los datos de las respuestas API a los modelos de datos limpios y consistentes que usa la aplicación. Esto desacopla la UI de la estructura de las API externas.
    *   Esta estructura promueve un código más testeable, mantenible y escalable.
*   **Composables para Lógica Reutilizable:**
    *   **Composables de Vue Query:** `useProducts`, `useCategories`, `useExchangeRate` encapsulan la lógica de TanStack Query para cada endpoint.
    *   **`useClientSideFilteringAndPagination`:** Un composable personalizado que centraliza toda la lógica de estado y cómputo para los filtros y la paginación del lado del cliente, incluyendo la interacción con `localStorage`. Esto mantiene el componente `App.vue` más limpio y enfocado en la orquestación.
*   **Componentes Bien Definidos y Reutilizables:** Siguiendo las mejores prácticas de Vue, con props claras y emisión de eventos (`defineModel` para `v-model` simplificado).
*   **Manejo de Errores y Carga Detallado:** La UI no solo muestra un estado de carga genérico, sino que diferencia y puede mostrar mensajes específicos si una de las llamadas API (productos, categorías, tasa de cambio) falla.
*   **Optimización de Rendimiento:**
    *   **Carga Diferida de Imágenes (`loading="lazy"`):** Mejora el tiempo de carga inicial.
    *   **Animación de Carga de Imagen:** Las imágenes de producto tienen una sutil animación de aparición al cargarse, mejorando la percepción visual.
    *   **Filtros y Paginación en Cliente:** Para una respuesta instantánea a las interacciones del usuario, como se solicitó.
*   **Accesibilidad (A11y):** Se han considerado prácticas básicas de accesibilidad:
    *   Uso de HTML semántico.
    *   Labels para inputs de formulario.
    *   Atributos `alt` para imágenes.
    *   Texto `sr-only` para iconografía en botones.
    *   Navegación por teclado funcional.
*   **Formato de Moneda Específico:** Implementación de una utilidad `currencyFormatter.ts` para mostrar precios en VES con el formato venezolano (`1.000,00 Bs.`).
*   **Calidad de Código y Pruebas:**
    *   Uso de ESLint y Prettier para un código consistente y limpio.
    *   Se han desarrollado **tests unitarios** para componentes clave y utilidades utilizando Vitest y Vue Test Utils, demostrando un compromiso con la calidad y la fiabilidad del software.

## Cómo Ejecutar el Proyecto

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Requisitos Previos:**
    *   Node.js (v18 o superior recomendado)
    *   Bun (instalado globalmente: `npm install -g bun`)

2.  **Clonar el Repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO_AQUI>
    cd <NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>
    ```

3.  **Instalar Dependencias:**
    ```bash
    bun install
    ```

4.  **Ejecutar en Modo Desarrollo:**
    ```bash
    bun run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

5.  **(Opcional) Construir para Producción:**
    ```bash
    bun run build
    ```
    Los archivos de producción se generarán en la carpeta `dist/`.

6.  **(Opcional) Ejecutar Tests:**
    ```bash
    bun run test:unit
    ```

## Posibles Mejoras Futuras (Si el tiempo lo permitiera)

*   Implementación de Skeletons Loaders para una mejor experiencia de carga visual.
*   Debouncing en los inputs de filtro de precio si las búsquedas fueran contra una API.
*   Tests E2E con Playwright o Cypress.
*   Internacionalización (i18n) si la aplicación necesitara soportar múltiples idiomas.
*   Optimización avanzada de rendimiento para listas muy grandes (virtual scrolling).
*   Un diseño UI más elaborado o temático.

---
¡Gracias por la oportunidad de realizar esta prueba!
