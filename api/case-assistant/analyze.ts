import type { IncomingMessage, ServerResponse } from 'node:http';
import { processCaseAnalysisRequest } from '../../src/services/ai/caseAnalysisController.ts';

interface RequestWithParsedBody extends IncomingMessage {
  body?: unknown;
}

async function readRequestBody(req: RequestWithParsedBody): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    const MAX_BYTES = 64 * 1024;

    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes <= MAX_BYTES) {
        chunks.push(chunk);
      }
    });

    req.on('end', () => {
      if (totalBytes > MAX_BYTES || chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        resolve({});
      }
    });

    req.on('error', () => resolve({}));
  });
}

export default async function handler(req: RequestWithParsedBody, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ status: 'error', errorMessage: 'Método no permitido' }));
    return;
  }

  const parsedBody = await readRequestBody(req);
  const result = await processCaseAnalysisRequest(parsedBody);
  res.statusCode = result.statusCode;
  res.end(JSON.stringify(result.payload));
}
