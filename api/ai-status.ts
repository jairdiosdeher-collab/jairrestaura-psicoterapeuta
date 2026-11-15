import type { IncomingMessage, ServerResponse } from 'node:http';
import { getAiStatusPayload } from '../src/services/ai/caseAnalysisController.ts';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method && req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ status: 'error', errorMessage: 'Método no permitido' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(getAiStatusPayload()));
}
