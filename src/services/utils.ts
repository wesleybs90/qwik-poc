import type { KVNamespace } from '@cloudflare/workers-types';

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