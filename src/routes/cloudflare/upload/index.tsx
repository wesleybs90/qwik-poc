import { component$, useSignal } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';
import { recordMediaR2 } from '~/services/utils';
 
export const useUploadFile = routeAction$(async ({ file }, { platform }) => {

  const r2Value = await recordMediaR2(platform, 'test-file-name.jpg', file);
  if (r2Value) {
    console.log('Recorded to R2 (log on server)');
  }
    
  return {
    success: true,
  };
});
 
export default component$(() => {
  const action = useUploadFile();
  const fileUploadRef = useSignal<HTMLInputElement | undefined>();
  return (
    <section>
      <input type="file" ref={fileUploadRef}/>
      <button
        onClick$={async () => {
          
          const file = fileUploadRef.value?.files?.[0];
 
          if (file){
            const formData = new FormData();
            formData.append('file', file);
            const { value } = await action.submit(formData);
            console.log(value);
          }
        }}
      >
        Upload file
      </button>
      
    </section>
  );
});
 