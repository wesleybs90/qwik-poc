import type { KVNamespace, D1Database } from '@cloudflare/workers-types';

export const getCacheKV = async (platform: QwikCityPlatform, key: string): Promise<string | null> => {
  if (platform.env) {
    const KV =  platform.env[import.meta.env.VITE_KV_VARIABLE] as KVNamespace;
		const cachedValue = await KV.get(key);

    return cachedValue;
  }

  return null;
}

export const putCacheKV = async (platform: QwikCityPlatform, key: string, value: string, secondsFromNow: number ): Promise<void> => {
  if (platform.env) {
    const KV =  platform.env[import.meta.env.VITE_KV_VARIABLE] as KVNamespace;
		await KV.put(key, value, { expirationTtl: secondsFromNow });
  }
}

export const getD1Database = async (platform: QwikCityPlatform, tableName: string): Promise<any> => {
  if (platform.env) {
    const D1 =  platform.env[import.meta.env.VITE_D1_VARIABLE] as D1Database;
    const ps = D1.prepare(`SELECT * from ${tableName}`);
    const data = await ps.all();

    return data;
  }
}

export const putD1Database = async (platform: QwikCityPlatform, tableName: string): Promise<any> => {
  if (platform.env) {
    const D1 =  platform.env[import.meta.env.VITE_D1_VARIABLE] as D1Database;
    const ps = D1.prepare(`INSERT INTO ${tableName} (id, name) VALUES (2, Name2)`);
    const data = await ps.all();

    return data;
  }
}