# JAIRRESTAURA – Orientador Inteligente para Psicoterapeutas

**Lema:** *Pensar mejor. Acompañar mejor. Crecer profesionalmente.*

Plataforma web progresiva (PWA), **100 % gratuita, en español y sin registro obligatorio**, diseñada para apoyar la preparación de sesiones, el análisis reflexivo en 12 dimensiones, la formación continua basada en evidencia y el autocuidado de psicólogos y psicoterapeutas.

> **Aviso clínico y ético fundamental:** Esta plataforma es una herramienta educativa y de apoyo reflexivo. No sustituye el juicio clínico, la supervisión profesional, la formación especializada ni la relación terapéutica. No genera diagnósticos definitivos, no prescribe tratamientos ni gestiona emergencias médicas o psiquiátricas.

---

## 1. Principios de Gratuidad y Acceso Universal

- Acceso libre desde el primer momento, **sin registro, cuentas, tarjetas ni planes de pago**.
- Sin dependencia de Firebase, Supabase u otras bases de datos externas obligatorias para las funciones locales.
- **Funcionamiento garantizado sin clave de IA:** si `GEMINI_API_KEY` no está configurada o se alcanza una cuota gratuita del proveedor, la aplicación informa claramente (`Motor IA no configurado. Todas las herramientas locales continúan disponibles.`) y mantiene operativas todas sus herramientas educativas, el simulador y la Hoja Reflexiva Local.

---

## 2. Arquitectura Desacoplada (A–H)

| Capa | Ubicación principal | Responsabilidad |
| --- | --- | --- |
| **A. Interfaz de usuario** | `src/App.tsx`, `src/modules/*`, `src/components/*` | Navegación adaptable, contraste accesible, impresión PDF (`@media print`) e indicadores permanentes (`MODO LOCAL` / `MOTOR IA`). |
| **B. Motor de reflexión local** | `src/services/reflection/localReflectionEngine.ts`, `src/data/twelveDimensionsMeta.ts` | Hoja Reflexiva Local en 12 dimensiones con 5 categorías epistémicas diferenciadas, guía de preguntas, ejemplos ficticios y contadores. |
| **C. Biblioteca educativa local** | `src/data/libraryData.ts`, `approachesData.ts`, `difficultSituationsData.ts`, `simulatorScenariosData.ts` | 14 categorías temáticas independientes de la IA, con objetivos, límites de aplicación, fecha de revisión y referencias verificables. |
| **D. Almacenamiento local opcional** | `src/services/storage/localStore.ts` | Guardado voluntario en `localStorage` para borradores, guías de sesión y bitácora, con borrado total inmediato. |
| **E. Exportación** | `localReflectionEngine.ts`, `localStore.ts`, `src/index.css` | Vista previa en Markdown, copia al portapapeles, descarga `.md` con advertencia educativa/fecha opcional y soporte limpio de impresión/PDF. |
| **F. Conector de IA intercambiable** | `src/services/ai/aiProvider.ts`, `serverAi.ts`, `caseAnalysisController.ts`, `/api/*`, `server.ts` | Interfaz `CaseReflectionProvider` aislada en servidor para sustituir proveedores sin reescribir la interfaz ni exponer claves al navegador. |
| **G. Capa de privacidad (`CLAROPRIVACIDAD`)** | `src/services/privacy/privacyGuard.ts`, `src/modules/privacy/PrivacyModule.tsx` | Escáner local de posibles datos identificables, bloqueo de envío hasta confirmar anonimización y sección explícita **CLAROPRIVACIDAD**. |
| **H. Control de errores y seguridad clínica** | `privacyGuard.ts`, `caseAnalysisController.ts`, `caseAssistantClient.ts` | Protocolo prioritario ante riesgo suicida/autolesión/violencia/abuso y degradación elegante ante errores de red o cuota. |

---

## 3. Módulos y Recursos Incluidos

1. **Panel de Inicio (`dashboard`)**: Acceso directo a módulos, indicador de estado real de modo local y motor IA.
2. **Preparación de Sesiones (`session-planner`)**: Guía editable local con detección de identificadores y exportación `.md`.
3. **Asistente Inteligente de Casos (`case-assistant`)**:
   - **Hoja Reflexiva Local en 12 Dimensiones (100 % offline)**: diferenciación visual en 5 categorías epistémicas (*Hechos aportados*, *Interpretaciones*, *Hipótesis*, *Información pendiente de verificar*, *Recomendaciones educativas*), preguntas guía, ejemplo ficticio, botón limpiar por campo, contador de caracteres, guardado voluntario de borrador/archivo, vista previa Markdown y PDF/impresión.
   - **Asistente Reflexivo de IA (Opcional)**: solo con viñetas ficticias/anonimizadas, bloqueo previo ante identificadores detectados y confirmación explícita de privacidad.
4. **Alianza Terapéutica (`therapeutic-alliance`)**: 9 dimensiones reflexivas y pautas de reparación de rupturas.
5. **Enfoques Terapéuticos Integradores (`approaches`)**: 6 enfoques con límites, precauciones y comparador.
6. **Narrativa y Escucha Terapéutica (`narrative`)**: Banco de preguntas, taller de re-autoría, 4 metáforas y ejercicios.
7. **Situaciones Difíciles (`difficult-situations`)**: 9 escenarios clínicos sin etiquetas estigmatizantes y apuntes locales.
8. **Autocuidado y Prevención del Agotamiento (`self-care`)**: Autoexamen no diagnóstico, plan de límites y temporizador de pausa de 2 minutos.
9. **Bitácora Profesional (`professional-journal`)**: Diario privado local con exportación y borrado total.
10. **Simulador de Casos Ficticios (`case-simulator`)**: Escenarios ramificados sin conexión y retroalimentación pedagógica.
11. **Biblioteca Profesional (`library`)**: **14 categorías** completas, fecha de revisión, límites de aplicación y citas verificables.
12. **CLAROPRIVACIDAD (`privacy`)**: Transparencia completa sobre datos locales, envío opcional a IA, riesgo de no anonimizar, cookies/analítica (inexistentes) y borrado total.

---

## 4. Guía de Instalación Local

### Requisitos previos
- Node.js 20 o superior (probado en Node 22).
- `npm` incluido con Node.js.

### Pasos
```bash
npm install
cp .env.example .env   # Opcional: añade GEMINI_API_KEY solo si deseas habilitar el motor IA
npm run dev            # Inicia Express + Vite en http://localhost:3000
```

### Comandos disponibles
```bash
npm run lint           # Verificación de tipos TypeScript (tsc --noEmit)
npm run test           # Pruebas automatizadas con Vitest
npm run build          # Compilación de producción + generación del Service Worker PWA
npm run start          # Servidor Node en producción (dist/ + /api/*)
```

---

## 5. Guía de Despliegue Gratuito en Vercel

El proyecto está preparado para desplegarse en el plan gratuito (*Hobby*) de Vercel:

1. Sube el repositorio a GitHub/GitLab/Bitbucket (verifica que `.env` **no** esté incluido; `.gitignore` ya lo excluye).
2. En Vercel, importa el proyecto con el preset **Vite** (configurado también en `vercel.json`):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Serverless Functions:** Vercel detectará automáticamente `/api/health.ts`, `/api/ai-status.ts` y `/api/case-assistant/analyze.ts`.
3. **Configuración opcional de IA en Vercel:**
   - Si deseas activar el asistente de IA, agrega `GEMINI_API_KEY` en **Project Settings → Environment Variables** (nunca uses el prefijo `VITE_`).
   - Si despliegas **sin** `GEMINI_API_KEY`, la plataforma abrirá con normalidad mostrando `MOTOR IA: NO CONFIGURADO` y todas las herramientas locales, biblioteca y simulador seguirán plenamente disponibles.
4. **Nota honesta sobre límites gratuitos:** Los proveedores externos de IA pueden aplicar límites diarios o por minuto en sus niveles gratuitos; cuando ocurra, JAIRRESTAURA informa al usuario sin bloquear ninguna herramienta local.

---

## 6. Política de Privacidad (`CLAROPRIVACIDAD`) y Límites Clínicos

> *«Utiliza exclusivamente viñetas ficticias o rigurosamente anonimizadas. No introduzcas historias clínicas, nombres, documentos ni información que permita identificar pacientes.»*

- **Lo que permanece en tu dispositivo:** notas locales, borradores de la Hoja Reflexiva Local, guías de sesión, bitácora y plan de autocuidado (`localStorage`).
- **Lo que se envía únicamente si pulsas enviar a IA:** el texto del caso ficticio/anonimizado y notas adicionales tras aceptar la ventana de confirmación.
- **Lo que nunca almacenamos en servidor:** no existe base de datos remota, cuentas de usuario, cookies publicitarias ni rastreadores analíticos; el servidor tampoco registra texto clínico en logs ante errores.
- **PWA y caché:** el Service Worker (`vite-plugin-pwa`) almacena en caché los recursos de la interfaz para uso sin conexión (`public/offline.html` como respaldo), mientras que `/api/*` utiliza explícitamente `NetworkOnly` y `Cache-Control: no-store` para no guardar respuestas de casos en caché.

---

## 7. Verificación y Pruebas

- **Pruebas automatizadas ejecutadas localmente (`npm test`, `npm run lint`, `npm run build`):** validan lógica de seguridad clínica, escáner de identificadores, 12 dimensiones, exportación Markdown, almacenamiento local, 14 categorías de biblioteca, interfaz de proveedor IA y endpoints `/api/*`.
- **Verificación manual pendiente tras despliegue:** instalación PWA en dispositivo móvil real (Android Chrome / iOS Safari), comportamiento offline real tras carga inicial y prueba de extremo a extremo en URL pública de Vercel con y sin `GEMINI_API_KEY`.
