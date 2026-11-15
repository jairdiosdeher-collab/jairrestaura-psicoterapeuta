# JAIRRESTAURA – Orientador Inteligente para Psicoterapeutas

**Lema:** *Pensar mejor. Acompañar mejor. Crecer profesionalmente.*

Aplicación web progresiva (PWA), gratuita, en español y sin registro obligatorio, diseñada para apoyar la preparación de sesiones, la reflexión clínica integradora, el aprendizaje basado en evidencia y el autocuidado de psicólogos y psicoterapeutas.

> **Aviso clínico y ético fundamental:** Esta plataforma es una herramienta educativa y de apoyo reflexivo. No sustituye el juicio clínico, la supervisión profesional, la formación especializada ni la relación terapéutica. No genera diagnósticos definitivos, no prescribe tratamientos ni gestiona emergencias médicas o psiquiátricas.

---

## Arquitectura Técnica

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4.
- **PWA / Offline:** `vite-plugin-pwa` con `manifest`, Service Worker auto-actualizable, caché offline de recursos educativos y botón de instalación integrado (`PWAInstallButton` + soporte guiado para iOS Safari).
- **Backend independiente de IA:** Servidor Express (`server.ts`) que monta Vite en desarrollo y sirve la compilación estática en producción, manteniendo `GEMINI_API_KEY` estrictamente en servidor.
- **Motor de IA responsable:** `@google/genai` (`gemini-4-hydrogen`) con salida estructurada en 12 dimensiones que separa explícitamente hechos descritos, interpretaciones, información faltante, hipótesis tentativas y recomendaciones educativas.
- **Privacidad por diseño:**
  - Acceso directo sin cuentas, contraseñas ni recopilación de datos personales.
  - Detección local y en servidor de señales de riesgo clínico prioritario (`detectClinicalRisk`) que detiene el flujo ordinario y despliega el Protocolo de Seguridad Clínica.
  - Escáner local de posibles identificadores (`scanPotentialIdentifiers`) en formularios y bitácora.
  - Modal obligatorio de confirmación de anonimización antes de enviar cualquier texto al endpoint `/api/case-assistant/analyze`.
  - Persistencia local exclusiva en `localStorage` con exportación (`.md` / `.json`) y borrado total inmediato.

---

## Módulos Implementados

1. **Preparación de Sesiones (`session-planner`):** Guía editable, preguntas abiertas sugeridas, detector de identificadores, copia y exportación `.md`.
2. **Asistente Inteligente de Casos (`case-assistant`):** Reflexión estructurada en 12 dimensiones con IA + Hoja Reflexiva Local disponible sin conexión o cuando la IA no está configurada.
3. **Alianza Terapéutica (`therapeutic-alliance`):** 9 dimensiones reflexivas centradas en colaboración y reparación de rupturas sin culpabilizar al paciente.
4. **Enfoques Terapéuticos Integradores (`approaches`):** 6 tradiciones clínicas con limitaciones, precauciones, referencias verificables y comparador de compatibilidad.
5. **Narrativa y Escucha Terapéutica (`narrative`):** Banco de preguntas reflexivas, taller de re-autoría, 4 metáforas originales y ejercicios de escucha activa.
6. **Situaciones Difíciles (`difficult-situations`):** 9 escenarios clínicos sin etiquetas estigmatizantes y espacio de apuntes locales.
7. **Autocuidado y Prevención del Agotamiento (`self-care`):** Autoexamen no diagnóstico, plan personal de límites y temporizador de pausa de 2 minutos entre sesiones.
8. **Bitácora Profesional (`professional-journal`):** Diario privado de 7 preguntas con búsqueda, filtro de supervisión, exportación y borrado total.
9. **Simulador de Casos Ficticios (`case-simulator`):** Escenarios ramificados 100% funcionales sin IA ni conexión, con retroalimentación pedagógica inmediata.
10. **Biblioteca Profesional (`library`):** 9 artículos originales clasificados por tipo de evidencia y referencias verificables.

---

## Variables de Entorno

Define tus variables en `.env` tomando como referencia `.env.example` (nunca subas secretos a GitHub):

```bash
GEMINI_API_KEY="tu_clave_de_gemini_en_servidor"
PORT=3000
```

Si `GEMINI_API_KEY` no está configurada, los 9 módulos educativos/locales y la Hoja Reflexiva Local del Módulo 2 continúan operando al 100%.

---

## Comandos Principales

```bash
npm install        # Instalar dependencias
npm run dev        # Ejecutar servidor Express + Vite en desarrollo (puerto 3000)
npm run lint       # Verificación de tipos TypeScript (tsc --noEmit)
npm run test       # Ejecutar suite de pruebas automatizadas (Vitest)
npm run build      # Compilar aplicación para producción
npm run start      # Iniciar servidor en producción
```

---

## Despliegue Compatible con Vercel / Node

- **Node / Cloud Run:** `npm run build` seguido de `npm run start` (`node server.ts`).
- **Vercel:** Configura `GEMINI_API_KEY` en las variables de entorno del proyecto en Vercel y expón `server.ts` o funciones serverless para `/api/ai-status` y `/api/case-assistant/analyze` junto con la salida estática `dist/` generada por `vite build`.
