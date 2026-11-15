import http from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../server';
import { getActiveCaseProvider } from '../src/services/ai/aiProvider';

let server: http.Server;
let baseUrl = '';
const originalApiKey = process.env.GEMINI_API_KEY;

beforeAll(async () => {
  process.env.GEMINI_API_KEY = '';
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  process.env.GEMINI_API_KEY = originalApiKey;
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('API del backend, proveedor desacoplado y protecciones de privacidad/seguridad', () => {
  it('expone una interfaz intercambiable de proveedor de IA que detecta ausencia de configuración', () => {
    const provider = getActiveCaseProvider();
    expect(provider.id).toBe('gemini');
    expect(provider.isConfigured()).toBe(false);
  });

  it('responde correctamente en /api/health y no expone claves en /api/ai-status', async () => {
    const health = await fetch(`${baseUrl}/api/health`);
    expect(health.status).toBe(200);
    expect(health.headers.get('cache-control')).toBe('no-store');
    expect(await health.json()).toEqual({ ok: true, service: 'jairrestaura' });

    const aiStatus = await fetch(`${baseUrl}/api/ai-status`);
    expect(aiStatus.status).toBe(200);
    const statusText = await aiStatus.text();
    expect(statusText).not.toContain('GEMINI_API_KEY');
    const parsed = JSON.parse(statusText) as { configured: boolean; message: string };
    expect(parsed.configured).toBe(false);
    expect(parsed.message).toContain('Motor IA no configurado');
  });

  it('rechaza envíos al asistente si no existe confirmación explícita de privacidad', async () => {
    const res = await fetch(`${baseUrl}/api/case-assistant/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseText: 'Situación ficticia suficientemente extensa para probar validación de privacidad.',
        privacyConfirmed: false,
      }),
    });
    expect(res.status).toBe(400);
    const data = (await res.json()) as { status: string; errorMessage: string };
    expect(data.status).toBe('error');
    expect(data.errorMessage).toContain('privacidad');
  });

  it('detiene el flujo ordinario y activa escalamiento de seguridad ante riesgo inmediato', async () => {
    const res = await fetch(`${baseUrl}/api/case-assistant/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseText:
          'Viñeta ficticia: persona expresa que desea quitarse la vida esta noche y tiene un plan.',
        privacyConfirmed: true,
      }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      status: string;
      safetyTriggered: boolean;
      safetyGuidance: string[];
    };
    expect(data.status).toBe('safety_escalation');
    expect(data.safetyTriggered).toBe(true);
    expect(data.safetyGuidance.length).toBeGreaterThan(0);
  });

  it('maneja con elegancia la ausencia de configuración IA sin bloquear la aplicación', async () => {
    const res = await fetch(`${baseUrl}/api/case-assistant/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseText:
          'Caso ficticio anonimizado: persona adulta con dificultad para organizar descansos y límites laborales.',
        privacyConfirmed: true,
      }),
    });
    expect(res.status).toBe(503);
    const data = (await res.json()) as { status: string; errorMessage: string };
    expect(data.status).toBe('error');
    expect(data.errorMessage).toContain('Motor IA no configurado');
    expect(data.errorMessage).toContain('Hoja Reflexiva Local');
  });
});
