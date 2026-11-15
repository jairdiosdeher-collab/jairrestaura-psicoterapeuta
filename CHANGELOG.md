# CHANGELOG – JAIRRESTAURA

## [2.0.0] – Evolución Profesional y Optimización para Vercel

### Arquitectura y Despliegue
- Desacoplamiento completo en 8 capas (A–H), incorporando la interfaz `CaseReflectionProvider` (`src/services/ai/aiProvider.ts`) para permitir intercambiar proveedores de IA sin reconstruir módulos.
- Extracción del controlador compartido `src/services/ai/caseAnalysisController.ts` y creación de funciones serverless compatibles con Vercel en `/api/health.ts`, `/api/ai-status.ts` y `/api/case-assistant/analyze.ts`.
- Creación de `vercel.json` con soporte SPA, cabeceras PWA y `Cache-Control: no-store` en `/api/*`.

### Hoja Reflexiva Local en 12 Dimensiones y Exportación
- Implementación del motor local `src/services/reflection/localReflectionEngine.ts` y catálogo pedagógico `src/data/twelveDimensionsMeta.ts` con descripción breve, preguntas guía, ejemplo ficticio y diferenciación visual en 5 categorías epistémicas (*Hechos aportados*, *Interpretaciones*, *Hipótesis*, *Información pendiente de verificar*, *Recomendaciones educativas*).
- Controles por dimensión (limpiar campo, contador de caracteres), guardado voluntario y recuperación de borrador/archivo en `localStorage`, borrado con confirmación explícita.
- Vista previa Markdown previa a la descarga, fecha de elaboración opcional, advertencia educativa/no diagnóstica/no historia clínica y reglas `@media print` en `src/index.css` para impresión limpia o guardado como PDF.

### CLAROPRIVACIDAD, Seguridad e Indicadores de Estado
- Evolución de la sección explícita **CLAROPRIVACIDAD** con advertencia literal permanente y bloqueo preventivo ante detección local de posibles datos identificables antes de enviar a IA.
- Indicadores permanentes diferenciados en la cabecera: `MODO LOCAL: DISPONIBLE` y `MOTOR IA: CONECTADO / NO CONFIGURADO / NO DISPONIBLE`, con mensaje explícito cuando la IA no está configurada.

### Biblioteca Ampliada (14 Categorías) y PWA Offline
- Ampliación de la Biblioteca Profesional a las 14 categorías requeridas, agregando `reviewDate` y `applicationLimits` visibles en cada artículo sin inventar URLs ni DOIs.
- Incorporación de `public/offline.html` y exclusión explícita de `/api/*` (`NetworkOnly` y `navigateFallbackDenylist`) en el Service Worker PWA.

### Pruebas y Documentación
- Ampliación de la suite Vitest (`tests/safetyAndPrivacy.test.ts` y `tests/apiServer.test.ts`) y actualización de `README.md` y `CHANGELOG.md`.

---

## [1.0.0] – Versión Inicial Funcional (MVP)
- Creación de la plataforma PWA en español con 10 módulos funcionales para psicólogos y psicoterapeutas.
- Integración inicial de Gemini en backend (`server.ts`), protocolo prioritario de seguridad clínica (`detectClinicalRisk`), escáner básico de identificadores (`scanPotentialIdentifiers`), persistencia local y pruebas base con Vitest.
