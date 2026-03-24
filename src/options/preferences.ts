import type { CorrectionMode, UserPreferences } from "../shared/contracts";
import { readPreferences, writePreferences } from "../shared/storage";

export async function loadPreferences(): Promise<UserPreferences> {
  return readPreferences();
}

export async function savePartial(update: Partial<UserPreferences>): Promise<void> {
  await writePreferences(update);
}

export async function saveModePreference(value: CorrectionMode): Promise<void> {
  await writePreferences({ correctionMode: value });
}
