# 🪞 Reflejo — Experiencia interpretativa impulsada por IA

**Reflejo** es un sistema interactivo que transforma respuestas abiertas en una narrativa interpretativa estructurada.

No es una simple integración con OpenAI.
Es un **pipeline controlado** que valida, filtra y construye significado a partir del lenguaje humano.

---

## 🎯 ¿Por qué existe este proyecto?

La mayoría de aplicaciones con IA hoy:

* confían ciegamente en el input del usuario
* no validan la salida del modelo
* dependen de múltiples llamadas fragmentadas
* no controlan la estructura del resultado

**Reflejo fue diseñado para corregir esto.**

---

## 🧠 Idea central

En lugar de preguntar:

> “¿qué responde la IA?”

Reflejo plantea:

> “¿qué podemos interpretar de forma confiable a partir de lo que el usuario realmente dijo?”

---

## ⚙️ Arquitectura del sistema

El sistema está diseñado como un:

> **pipeline determinístico sobre un modelo probabilístico**

---

### 1. Flujo de entrada controlado

* Sistema de preguntas guiadas
* Estado global centralizado
* Navegación lineal (sin retroceso)

👉 Evita datasets inconsistentes

---

### 2. Doble capa de validación

* Validación en frontend
* Validación en backend (Zod)

👉 Solo se procesa información válida

---

### 3. Estrategia de una sola llamada a IA

```ts
const response = await client.chat.completions.create(...)
```

✔ Mantiene coherencia
✔ Reduce costos
✔ Evita fragmentación del análisis

---

### 4. Parseo estricto de salida (CRÍTICO)

La respuesta de la IA **no se usa directamente**.

```ts
function isValidAnalysis(data: unknown): data is ParsedAnalysis
```

✔ Tipado estricto
✔ Validación estructural
✔ Prevención de fallos

---

### 5. Evaluación de calidad semántica

Cada respuesta del usuario se clasifica como:

* significativa
* descartada
* motivo del descarte

Esto permite:

* medir calidad del input
* filtrar ruido
* decidir si hay suficiente información

---

### 6. Construcción de perfil

```ts
buildProfile(parsedAnalysis)
```

Se normaliza:

* contenido limpio
* patrones detectados
* rasgos sugeridos

---

### 7. Generación de narrativa

```ts
buildNarrative(profile)
```

Resultado:

* hook inicial
* lectura principal
* interpretación profunda

---

## 🎬 Capa de experiencia (diferencial clave)

Reflejo no solo analiza — **construye experiencia**.

---

### 🎙️ Narrativa con audio

* Lectura automática del resultado

---

### 🎧 Modo “karaoke” (innovación UX)

* División de narrativa en bloques
* Sincronización temporal
* Resaltado progresivo del texto

👉 Convierte el resultado en una experiencia guiada
👉 No es solo texto, es interacción 

---

## 🔄 Flujo completo

1. Usuario responde preguntas
2. Se valida el input
3. Se envía una sola solicitud al backend
4. La IA responde con JSON estructurado
5. Se valida la estructura
6. Se evalúa calidad de respuestas
7. Se construye perfil
8. Se genera narrativa
9. Se renderiza:

   * narrativa
   * métricas
   * audio sincronizado

---

## 🧩 Tecnologías

### Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* API Routes (Next.js)

### IA

* OpenAI SDK
* Prompting estructurado

### Validación

* Zod

---

## 🧪 Decisiones técnicas clave

### ✔ Pipeline controlado

La IA no decide la lógica, solo provee datos.

---

### ✔ Una sola llamada a IA

Evita:

* inconsistencias
* sobrecostos
* pérdida de contexto

---

### ✔ Parseo defensivo

Evita:

* errores en producción
* respuestas inválidas
* fallos silenciosos

---

### ✔ Evaluación del input

Permite:

* mejorar precisión
* evitar basura en el análisis

---

### ✔ UX como parte del sistema

La experiencia (audio + animación) es parte de la arquitectura.

---

## 🔐 Seguridad

* API Key protegida en `.env.local`
* Validación obligatoria en backend
* No se confía en el input del cliente
* No se confía en la salida de la IA

---

## 🚀 Instalación

```bash
npm install
npm run dev
```

---

## 🔐 Variables de entorno

```env
OPENAI_API_KEY=tu_api_key
OPENAI_MODEL=gpt-4.1-mini
```

---

## 📌 Estado del proyecto

✔ Pipeline completo implementado
✔ Integración IA funcional
✔ Flujo end-to-end estable
✔ Experiencia interactiva terminada

---

## 💡 ¿Qué demuestra este proyecto?

* Diseño de sistemas con IA
* Control de datos en entornos probabilísticos
* Arquitectura fullstack
* Validación robusta
* Pensamiento de producto
* Experiencia de usuario avanzada

---

## 👨‍💻 Autor

**Mateo Bernal**

---

## ⚠️ Disclaimer

Este proyecto es de entretenimiento.
No realiza diagnósticos psicológicos ni clínicos.
