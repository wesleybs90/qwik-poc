import { component$, useSignal } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';
import { recordMediaR2 } from '~/services/utils';
 
export const useUploadFile = routeAction$(async ({ file, fileName, fileType }, { platform }) => {

  if (!file || !fileName || !fileType) {
    return {
      success: false,
      error: 'File, fileName, and fileType are required.',
    };
  }

  const fileNameWithType = `${new Date().toISOString()}-${fileName}`;

  const r2Value = await recordMediaR2(platform, fileNameWithType, file);
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
          const fileName = file?.name;
          const fileType = file?.type;

          if (!file || !fileName || !fileType) {
            console.error('File, fileName, and fileType are required.');
            return;
          }
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileName', fileName);
          formData.append('fileType', fileType);
          const { value } = await action.submit(formData);
          console.log(value);

          if (value.success) {
            console.log('File uploaded successfully');
          } else {
            console.error('File upload failed:', value.error);
          }

        }}
      >
        Upload file
      </button>
      
    </section>
  );
});
 