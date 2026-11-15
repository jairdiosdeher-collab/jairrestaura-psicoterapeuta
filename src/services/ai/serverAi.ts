import type { CaseAnalysis12Sections } from '../../types/index.ts';
import { getActiveCaseProvider } from './aiProvider.ts';

export function isGeminiConfigured(): boolean {
  return getActiveCaseProvider().isConfigured();
}

export function getActiveModelName(): string {
  return getActiveCaseProvider().modelName;
}

export async function generateStructuredCaseReflection(params: {
  caseText: string;
  therapistNotes: string;
  approachPreference: string;
}): Promise<CaseAnalysis12Sections> {
  const provider = getActiveCaseProvider();
  return provider.analyzeCase(params);
}
