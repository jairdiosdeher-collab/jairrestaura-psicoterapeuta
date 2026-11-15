export interface PiiFinding {
  kind: 'correo' | 'telefono' | 'documento' | 'nombre_probable' | 'direccion';
  label: string;
  excerpt: string;
}

export interface ClinicalRiskAssessment {
  requiresPrioritySafetyProtocol: boolean;
  matchedSignals: string[];
  guidance: string[];
}

const RISK_PATTERNS: { label: string; regex: RegExp }[] = [
  {
    label: 'Ideación o conducta suicida',
    regex: /\b(suicid[a-záéíóú]*|quitarse la vida|quitarme la vida|matarse|matarme|no quiero vivir|deseo morir|autolesi[oó]n|cortarse|hacerse da[ñn]o|sobredosis)\b/i,
  },
  {
    label: 'Riesgo de violencia o daño grave a terceros',
    regex: /\b(homicid[a-záéíóú]*|matar a|da[ñn]ar a alguien|arma de fuego|amenaza de muerte|agresi[oó]n f[ií]sica grave|ataque violento)\b/i,
  },
  {
    label: 'Sospecha de abuso o maltrato activo',
    regex: /\b(abuso sexual|abuso infantil|maltrato infantil|violencia intrafamiliar activa|golpea a su|agrede a un menor|explotaci[oó]n)\b/i,
  },
  {
    label: 'Crisis aguda o pérdida de contacto con la realidad con peligro',
    regex: /\b(emergencia psiqui[aá]trica|riesgo inminente|peligro inmediato|crisis aguda grave|intento reciente)\b/i,
  },
];

export const SAFETY_PROTOCOL_GUIDANCE: string[] = [
  'Esta situación incluye señales de posible riesgo inmediato, violencia, abuso o crisis prioritaria y no debe tratarse como una consulta educativa ordinaria.',
  'Active de inmediato los protocolos institucionales, éticos y legales vigentes en su jurisdicción y lugar de trabajo.',
  'Priorice la valoración clínica presencial o directa por profesionales competentes y coordine con servicios de emergencia o redes de protección cuando corresponda.',
  'Esta plataforma de apoyo reflexivo no ofrece garantías de seguridad, no evalúa riesgo letal en tiempo real ni sustituye el juicio clínico ni la atención de urgencias.',
  'Documente las actuaciones de protección conforme a la normativa profesional aplicable y consulte con supervisión o equipo interdisciplinario.',
];

export function detectClinicalRisk(text: string): ClinicalRiskAssessment {
  const normalized = (text || '').trim();
  if (!normalized) {
    return {
      requiresPrioritySafetyProtocol: false,
      matchedSignals: [],
      guidance: [],
    };
  }

  const matchedSignals: string[] = [];
  for (const item of RISK_PATTERNS) {
    if (item.regex.test(normalized)) {
      matchedSignals.push(item.label);
    }
  }

  return {
    requiresPrioritySafetyProtocol: matchedSignals.length > 0,
    matchedSignals,
    guidance: matchedSignals.length > 0 ? SAFETY_PROTOCOL_GUIDANCE : [],
  };
}

export function scanPotentialIdentifiers(text: string): PiiFinding[] {
  const findings: PiiFinding[] = [];
  const source = text || '';
  if (!source.trim()) return findings;

  const emailMatch = source.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatch) {
    findings.push({
      kind: 'correo',
      label: 'Posible correo electrónico',
      excerpt: emailMatch[0],
    });
  }

  const phoneMatch = source.match(/(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)\d{3,4}[\s.-]?\d{3,4}/g);
  if (phoneMatch) {
    const candidate = phoneMatch.find((m) => m.replace(/\D/g, '').length >= 7);
    if (candidate) {
      findings.push({
        kind: 'telefono',
        label: 'Posible número telefónico',
        excerpt: candidate.trim(),
      });
    }
  }

  const idMatch = source.match(/\b(?:c\.?c\.?|dni|rut|pasaporte|historia|hc|exp\.?)\s*[:#-]?\s*[a-zA-Z0-9.-]{5,}\b/i);
  if (idMatch) {
    findings.push({
      kind: 'documento',
      label: 'Posible número de documento o expediente',
      excerpt: idMatch[0],
    });
  }

  const namedPersonMatch = source.match(
    /\b(?:[Pp]aciente|PACIENTE|[Ss]r\.?|[Ss]ra\.?|[Dd]on|[Dd]oña|[Ll]lamad[oa]|[Nn]ombre)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,})?/g
  );
  if (namedPersonMatch) {
    findings.push({
      kind: 'nombre_probable',
      label: 'Posible nombre o referencia nominal',
      excerpt: namedPersonMatch[0],
    });
  }

  const addressMatch = source.match(/\b(?:calle|carrera|av\.|avenida|cra\.|mz\.|barrio|colonia)\s+[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ#°.\-\s]{4,28}/i);
  if (addressMatch) {
    findings.push({
      kind: 'direccion',
      label: 'Posible dirección o ubicación específica',
      excerpt: addressMatch[0].trim(),
    });
  }

  return findings;
}
