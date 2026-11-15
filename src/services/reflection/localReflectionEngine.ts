import { TWELVE_DIMENSIONS_META } from '../../data/twelveDimensionsMeta';
import type { CaseAnalysis12Sections } from '../../types';

export interface LocalReflectionSheet {
  id: string;
  title: string;
  approachFocus: string;
  elaborationDate: string;
  includeDateInExport: boolean;
  caseSummary: string;
  fields: Record<keyof CaseAnalysis12Sections, string>;
  updatedAt: string;
}

export function createEmptyReflectionSheet(): LocalReflectionSheet {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `hoja-${Date.now()}`,
    title: '',
    approachFocus: 'Integrador basado en evidencia',
    elaborationDate: today,
    includeDateInExport: true,
    caseSummary: '',
    fields: {
      hechosDescritos: '',
      interpretacionesProfesional: '',
      informacionFalta: '',
      hipotesisTrabajo: '',
      explicacionesAlternativas: '',
      factoresContextualesCulturales: '',
      alianzaTerapeutica: '',
      preguntasExplorar: '',
      objetivosPosibles: '',
      alternativasIntervencion: '',
      riesgosLimites: '',
      temasSupervision: '',
    },
    updatedAt: new Date().toISOString(),
  };
}

export function countCompletedDimensions(sheet: LocalReflectionSheet): number {
  return TWELVE_DIMENSIONS_META.filter((dim) => Boolean((sheet.fields[dim.key] || '').trim())).length;
}

export function buildWorksheetMarkdown(sheet: LocalReflectionSheet): string {
  const lines: string[] = [
    '# JAIRRESTAURA · Hoja Reflexiva Local en 12 Dimensiones',
    '',
    '> **Documento de reflexión educativa y formación continua.**',
    '> **Advertencia:** Este documento NO constituye un diagnóstico clínico, ni una prescripción terapéutica, ni una historia clínica oficial. Está diseñado exclusivamente para trabajo con viñetas ficticias o rigurosamente anonimizadas.',
    '',
    `- **Título de referencia:** ${sheet.title.trim() || 'Hoja reflexiva sin título'}`,
    `- **Lente integradora:** ${sheet.approachFocus || 'Integrador basado en evidencia'}`,
  ];

  if (sheet.includeDateInExport && sheet.elaborationDate) {
    lines.push(`- **Fecha de elaboración:** ${sheet.elaborationDate}`);
  }

  lines.push('');

  if (sheet.caseSummary.trim()) {
    lines.push('## Viñeta ficticia o anonimizada de partida');
    lines.push(sheet.caseSummary.trim());
    lines.push('');
  }

  for (const dim of TWELVE_DIMENSIONS_META) {
    const content = (sheet.fields[dim.key] || '').trim();
    lines.push(`## ${dim.number}. ${dim.title}`);
    lines.push(`*Categoría epistémica: ${dim.epistemicCategory}*`);
    lines.push('');
    lines.push(content || '_Sin anotaciones registradas en esta dimensión._');
    lines.push('');
  }

  lines.push('---');
  lines.push(
    '_Generado localmente en JAIRRESTAURA sin transmisión a servidores externos. Revisa cualquier dato antes de compartir o archivar._'
  );

  return lines.join('\n');
}
