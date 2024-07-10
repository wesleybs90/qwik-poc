import type { KVNamespace, D1Database, D1Result, R2Bucket, R2Object } from '@cloudflare/workers-types';

// Cloudflare KV - get cache data
export const getCacheKV = async (platform: QwikCityPlatform, key: string): Promise<string | null> => {
  if (platform.env) {
    const KV =  platform.env[import.meta.env.VITE_KV_VARIABLE] as KVNamespace;
		const cachedValue = await KV.get(key);

    return cachedValue;
  }

  return null;
}

// Cloudflare KV - put cache data
export const putCacheKV = async (platform: QwikCityPlatform, key: string, value: string, secondsFromNow: number ): Promise<void> => {
  if (platform.env) {
    const KV =  platform.env[import.meta.env.VITE_KV_VARIABLE] as KVNamespace;
		await KV.put(key, value, { expirationTtl: secondsFromNow });
  }
}

// Cloudflare D1 - get data
export const getD1Database = async (platform: QwikCityPlatform, tableName: string): Promise<D1Result | null> => {
  if (platform.env) {
    const D1 =  platform.env[import.meta.env.VITE_D1_VARIABLE] as D1Database;
    const query = D1.prepare(`SELECT * from ${tableName}`);
    const data = await query.all();

    return data;
  }

  return null;
}

// Cloudflare D1 - insert data
export const insertD1Database = async (platform: QwikCityPlatform, tableName: string): Promise<any> => {
  if (platform.env) {
    const D1 =  platform.env[import.meta.env.VITE_D1_VARIABLE] as D1Database;
    const query = D1.prepare(`INSERT INTO ${tableName} (id, name) VALUES (2, Name2)`);
    const data = await query.all();

    return data;
  }
}

// Cloudflare R2 - record media into R2
export const recordMediaR2 = async (platform: QwikCityPlatform, pathAndFileName: string, media: ArrayBuffer): Promise<R2Object | null> => {
  if (platform.env) {
    const R2 =  platform.env[import.meta.env.VITE_R2_VARIABLE] as R2Bucket;
    const mediaValue = await R2.put(pathAndFileName, media);
    return mediaValue;
  }

  return null;
}
