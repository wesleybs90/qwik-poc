import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getCacheKV, getD1Database, putCacheKV } from "~/services/utils";

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
  const table = 'table_test';

  //Get the resource from D1
  const d1Value = await getD1Database(platform, table);
  if (d1Value) {
    console.log('Retrieved from D1 (log on server)');
    return d1Value;
  }

  return null;
});

export default component$(() => {

  const resource = useGetKV();
  console.log('Retrieved from cache (log on client)', resource.value);

  const d1Resource = useGetD1();
  console.log('Retrieved from D1 (log on client)', d1Resource.value);

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
    </div>

    
  );

});