/**
 * Copia de seguridad manual del estado de la partida: descarga e importación de
 * un archivo JSON. Seguro definitivo contra pérdida de datos en mesa.
 *
 * Vive en la capa de componentes (importa el store), separado de
 * `lib/persistence.ts` (que no debe importar el store, para evitar ciclos).
 */
import { useGameStore } from '@/store/gameStore';
import {
  extractSaveState,
  serializeSaveState,
  parseSavePayload,
  saveGame,
} from '@/lib/persistence';

/** Descarga el estado actual de la partida como archivo JSON. */
export function downloadBackup(): void {
  if (typeof window === 'undefined') return;
  const json = serializeSaveState(extractSaveState(useGameStore.getState()));
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  a.href = url;
  a.download = `ti4-partida-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Restaura una partida desde el texto de un archivo exportado. Valida la
 * estructura; devuelve true si se importó correctamente.
 */
export async function importBackupFile(file: File): Promise<boolean> {
  const text = await file.text();
  const state = parseSavePayload(text);
  if (!state) return false;
  useGameStore.getState().hydrateFromSave(state);
  saveGame(state);
  return true;
}
