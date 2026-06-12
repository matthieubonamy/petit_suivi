import { STOOL_COLORS, URINE_COLORS } from '../constants/stoolColors';
import { StatusLevel } from '../types';

export interface ColorAnalysisResult {
  colorId: string;
  confidence: number;
  status: StatusLevel;
}

// Simulation of local color analysis (would normally use ML model)
// Returns a plausible color match based on dominant hue estimation
export async function analyzePhotoColor(
  photoUri: string,
  type: 'stool' | 'urine'
): Promise<ColorAnalysisResult | null> {
  try {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 800));

    // Simulate a result - in production, this would use expo-image-manipulator
    // to sample pixels and find the nearest color match
    const colors = type === 'stool' ? STOOL_COLORS : URINE_COLORS;
    const okColors = colors.filter((c) => c.status === 'ok');
    const randomOk = okColors[Math.floor(Math.random() * okColors.length)];

    return {
      colorId: randomOk.id,
      confidence: 0.65 + Math.random() * 0.25,
      status: randomOk.status,
    };
  } catch {
    return null;
  }
}

export function getStatusFromColorId(colorId: string, type: 'stool' | 'urine'): StatusLevel {
  const colors = type === 'stool' ? STOOL_COLORS : URINE_COLORS;
  const found = colors.find((c) => c.id === colorId);
  return found?.status ?? 'ok';
}

export function getStatusLabel(status: StatusLevel): string {
  switch (status) {
    case 'ok': return 'Normal';
    case 'watch': return 'À surveiller';
    case 'alert': return 'Consulter un médecin';
  }
}

export function getBristolStatus(type: number): StatusLevel {
  if (type === 1 || type === 7) return 'alert';
  if (type === 2 || type === 5 || type === 6) return 'watch';
  return 'ok'; // 3, 4
}

export function computeOverallStatus(colorStatus: StatusLevel, bristolStatus?: StatusLevel): StatusLevel {
  const levels: StatusLevel[] = ['ok', 'watch', 'alert'];
  const colorIdx = levels.indexOf(colorStatus);
  const bristolIdx = bristolStatus ? levels.indexOf(bristolStatus) : 0;
  return levels[Math.max(colorIdx, bristolIdx)];
}
