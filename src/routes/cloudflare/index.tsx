import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getCacheKV, getD1Database, putCacheKV, recordMediaR2 } from "~/services/utils";

export const useGetKV = routeLoader$(async ({ platform }) => {
  const key = 'kv_test_key';
  const value = {
    message: 'Hello from Cloudflare KV',
  };

  const cacheTTL = 1800;

  //Check if resource is cached
  const cachedValue = await getCacheKV(platform, key);
  if (cachedValue) {
    console.log('Retrieved from cache (log on server)');
    return JSON.parse(cachedValue);
  }

  //Cache the resource
  await putCacheKV(platform, key, JSON.stringify(value), cacheTTL);

  return null;
});

export const useGetD1 = routeLoader$(async ({ platform }) => {
  const table = 'Customers';

  //Get the resource from D1
  const d1Value = await getD1Database(platform, table);
  if (d1Value) {
    console.log('Retrieved from D1 (log on server)');
    return d1Value;
  }

  return null;
});

export const usePutR2 = routeLoader$(async ({ platform }) => {
  const imageUrl = 'https://cf-assets.www.cloudflare.com/slt3lc6tev37/6EYsdkdfBcHtgPmgp3YtkD/0b203affd2053988264b9253b13de6b3/logo-thumbnail.png';
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const r2Value = await recordMediaR2(platform, 'logo-thumbnail.png', blob);
  if (r2Value) {
    console.log('Recorded to R2 (log on server)');
    return r2Value;
  }

  return null;
});

export default component$(() => {

  const resource = useGetKV();
  console.log('Retrieved from cache (log on client)', resource.value);

  const d1Resource = useGetD1();
  console.log('Retrieved from D1 (log on server or client)', d1Resource.value);

  const r2Resource = usePutR2();
  console.log('Recorded to R2 (log on server or client)', r2Resource.value);

  return (
    <div>
      <p>Cloudflare KV Test</p>
      <p>Value:</p>
      <pre>{JSON.stringify(resource.value)}</pre>

      <br />

      <p>Cloudflare D1 Test</p>
      <p>Value:</p>
      <pre>{JSON.stringify(d1Resource.value)}</pre>
      <p>Results:</p>
      <pre>{JSON.stringify(d1Resource.value?.results)}</pre>

      <br />
      
      <p>Cloudflare R2 Test</p>
      <p>Value:</p>
      <pre>{JSON.stringify(r2Resource.value)}</pre>
      
      <br />

      <img
        src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/6EYsdkdfBcHtgPmgp3YtkD/0b203affd2053988264b9253b13de6b3/logo-thumbnail.png"
        alt="Cloudflare Logo"
        width="120"
        height="120"
      />
    </div>
    
  );

});