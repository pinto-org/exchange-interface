import { EnvDexSettings } from '.';

export const ProdSettings: EnvDexSettings = {
  PRODUCTION: true,
  WELLS_ORIGIN_BLOCK: parseInt(import.meta.env.VITE_WELLS_ORIGIN_BLOCK) || 22622227,
  LOAD_HISTORY_FROM_GRAPH: !!parseInt(import.meta.env.VITE_LOAD_HISTORY_FROM_GRAPH) || true
};
