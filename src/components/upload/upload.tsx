'use client';

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
  type CloudinaryUploadWidgetOptions,
} from 'next-cloudinary';

const Upload = ({
  setResource,
  folder,
  children,
  defaultSource = 'camera',
  sources = ['camera', 'local'],
  extraOptions,
}: {
  setResource: React.Dispatch<
    React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
  >;
  folder: string;
  children: React.ReactNode;
  defaultSource?: string;
  sources?: CloudinaryUploadWidgetOptions['sources'];
  extraOptions?: Partial<CloudinaryUploadWidgetInfo>;
}) => {
  return (
    <CldUploadWidget
      onSuccess={(result) => {
        setResource(result?.info); // { public_id, secure_url, etc }
      }}
      options={{
        folder,
        defaultSource,
        sources,
        ...extraOptions,
      }}
      uploadPreset="restaurant_ca"
    >
      {({ open }) => {
        function handleOnClick() {
          setResource(undefined);
          open();
        }
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: <Ignore>
        // biome-ignore lint/a11y/noStaticElementInteractions: <Ignore>
        // biome-ignore lint/a11y/useKeyWithClickEvents: <Ignore>
        return <div onClick={handleOnClick}>{children}</div>;
      }}
    </CldUploadWidget>
  );
};

export default Upload;
