'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { editCateringMenuAction } from '@/actions/edit-catering-menu-action';
import { ZodCateringMenuSchema } from '@/lib/zod-schema/schema';
import type { CateringMenuDocument } from '@/models/types/catering-menu';
import MenuFormContent from '../menu/menu-form-content';

export default function MenuForm({
  categories,
  menu,
}: {
  categories: { name: string; _id: string }[];
  menu: CateringMenuDocument;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resource, setResource] = useState<
    string | CloudinaryUploadWidgetInfo | undefined
  >();

  const form = useForm<z.infer<typeof ZodCateringMenuSchema>>({
    resolver: zodResolver(ZodCateringMenuSchema),
    defaultValues: {
      category: menu.category.toString() || '',
      name: menu.name || '',
      variant: menu.variant || '',
      smallPrice: menu.smallPrice?.toString() || '',
      mediumPrice: menu.mediumPrice?.toString() || '',
      largePrice: menu.largePrice?.toString() || '',
      smallServingSize: menu.smallServingSize || '',
      mediumServingSize: menu.mediumServingSize || '',
      largeServingSize: menu.largeServingSize || '',
      disabled: menu.disabled,
    },
  });

  function onSubmit(values: z.infer<typeof ZodCateringMenuSchema>) {
    setIsSubmitting(true);
    try {
      const promise = async () => {
        const result = await editCateringMenuAction(
          menu._id,
          values,
          menu.image,
          menu.publicId,
          resource
        );
        setIsSubmitting(false);
        if (result.success) {
          return result;
        }
        throw result;
      };
      toast.promise(promise(), {
        loading: 'Updating menu item...',
        success: () => 'The menu item has been updated successfully.',
        error: ({ error }) =>
          error ? error : 'Failed to update menu item. Please try again.',
      });
    } catch {
      toast.error('Failed to update menu item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MenuFormContent
      action="Edit"
      categories={categories}
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      resource={resource}
      setResource={setResource}
    />
  );
}
