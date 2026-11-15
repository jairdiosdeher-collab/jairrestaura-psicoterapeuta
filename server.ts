import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateStructuredCaseReflection,
  getActiveModelName,
  isGeminiConfigured,
} from './src/services/ai/serverAi.ts';
import { detectClinicalRisk } from './src/services/privacy/privacyGuard.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'jairrestaura' });
  });

  app.get('/api/ai-status', (_req, res) => {
    const configured = isGeminiConfigured();
    res.json({
      configured,
      model: configured ? getActiveModelName() : 'No configurado',
      message: configured
        ? 'Asistente reflexivo de IA disponible bajo confirmación explícita de anonimización.'
        : 'El servicio de IA no está configurado en el servidor. Todos los módulos educativos, simulador y herramientas locales funcionan con normalidad.',
    });
  });

  app.post('/api/case-assistant/analyze', async (req, res) => {
    try {
      const body = (req.body ?? {}) as {
        caseText?: unknown;
        therapistNotes?: unknown;
        approachPreference?: unknown;
        privacyConfirmed?: unknown;
      };

      if (body.privacyConfirmed !== true) {
        return res.status(400).json({
          status: 'error',
          errorMessage:
            'Es obligatorio confirmar la revisión de privacidad y anonimización antes de enviar texto al asistente.',
        });
      }

      const caseText = typeof body.caseText === 'string' ? body.caseText.trim() : '';
      const therapistNotes =
        typeof body.therapistNotes === 'string' ? body.therapistNotes.trim() : '';
      const approachPreference =
        typeof body.approachPreference === 'string'
          ? body.approachPreference.trim()
          : 'Integrador';

      if (caseText.length < 20) {
        return res.status(400).json({
          status: 'error',
          errorMessage:
            'Describe brevemente la situación ficticia o anonimizada (mínimo 20 caracteres) para poder estructurar la reflexión.',
        });
      }

      if (caseText.length > 8000 || therapistNotes.length > 3000) {
        return res.status(400).json({
          status: 'error',
          errorMessage:
            'El texto excede la longitud máxima recomendada. Envía únicamente el resumen mínimo necesario y sin datos identificables.',
        });
      }

      const risk = detectClinicalRisk(`${caseText}\n${therapistNotes}`);
      if (risk.requiresPrioritySafetyProtocol) {
        return res.status(200).json({
          status: 'safety_escalation',
          safetyTriggered: true,
          safetyReasons: risk.matchedSignals,
          safetyGuidance: risk.guidance,
          epistemicNotice:
            'Se ha activado el Protocolo de Seguridad Clínica. La plataforma no gestiona emergencias ni sustituye protocolos institucionales o servicios presenciales de urgencia.',
        });
      }

      if (!isGeminiConfigured()) {
        return res.status(503).json({
          status: 'error',
          errorMessage:
            'El motor de IA no está configurado actualmente en este entorno. Puedes utilizar la Hoja Reflexiva Local de 12 dimensiones o los casos del simulador sin conexión.',
        });
      }

      const analysis = await generateStructuredCaseReflection({
        caseText,
        therapistNotes,
        approachPreference,
      });

      return res.json({
        status: 'ok',
        safetyTriggered: false,
        analysis,
        modelName: getActiveModelName(),
        epistemicNotice:
          'Este análisis constituye un apoyo educativo y reflexivo. Distingue hechos de hipótesis tentativas, no genera diagnósticos definitivos ni sustituye el juicio clínico ni la supervisión profesional.',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'AI_NOT_CONFIGURED') {
        return res.status(503).json({
          status: 'error',
          errorMessage:
            'El servicio de IA no se encuentra configurado. Todos los módulos locales permanecen operativos.',
        });
      }
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({
          status: 'error',
          errorMessage:
            'Se alcanzó temporalmente el límite de solicitudes del servicio de IA. Intenta nuevamente en unos momentos o usa la Hoja Reflexiva Local.',
        });
      }
      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
        return res.status(503).json({
          status: 'error',
          errorMessage:
            'La configuración del servicio de IA requiere revisión en el servidor. Los recursos educativos locales continúan funcionando sin interrupciones.',
        });
      }
      return res.status(500).json({
        status: 'error',
        errorMessage:
          'No se pudo procesar la reflexión asistida en este momento. La aplicación sigue operativa y puedes trabajar con la guía local.',
      });
    }
  });

  return app;
}

async function startServer() {
  const app = createApp();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JAIRRESTAURA server listening on http://0.0.0.0:${PORT}`);
  });
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isMainModule) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
