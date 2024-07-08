import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getCacheKV, putCacheKV } from "~/services/utils";

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

export default component$(() => {

  const resource = useGetKV();
  console.log('Retrieved from cache (log on client)', resource.value);

  return (
    <div>
      <p>Cloudflare KV Test</p>
      <p>Value:</p>
      <pre>{JSON.stringify(resource.value)}</pre>
    </div>
  );

});