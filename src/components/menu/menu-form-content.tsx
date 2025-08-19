import { Switch } from '@mui/material';
import Image from 'next/image';
import type { CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Upload from '@/components/upload/upload';
import type { ZodCateringMenuSchema } from '@/lib/zod-schema/schema';

const MenuFormContent = ({
  action,
  form,
  onSubmit,
  categories,
  isSubmitting,
  resource,
  setResource,
}: {
  action: 'Add' | 'Edit';
  form: UseFormReturn<z.infer<typeof ZodCateringMenuSchema>>;
  onSubmit: (values: z.infer<typeof ZodCateringMenuSchema>) => void;
  categories: { name: string; _id: string }[];
  isSubmitting: boolean;
  resource?: string | CloudinaryUploadWidgetInfo | undefined;
  setResource: React.Dispatch<
    React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
  >;
}) => {
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">{action} new catering menu</CardTitle>
        <div>
          <Label htmlFor="disable">Disable</Label>
          <Switch
            checked={form.watch('disabled')}
            id="disable"
            onChange={(e) => form.setValue('disabled', e.target.checked)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant &#040;if applicable&#041;</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Basmathi, Kaima" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Image</FormLabel>
                <div className="flex items-center gap-2">
                  <Upload
                    defaultSource="local"
                    folder="catering_menu"
                    setResource={setResource}
                  >
                    <Button size="sm" type="button">
                      Upload Image
                    </Button>
                  </Upload>
                  {resource && (
                    <Image
                      alt="menu image"
                      height={40}
                      src={(resource as CloudinaryUploadWidgetInfo).secure_url}
                      width={40}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 font-medium text-lg">Small Size</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="smallServingSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serving Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5 PPL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smallPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 55.00"
                          {...field}
                          min={0}
                          step={0.01}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 font-medium text-lg">Medium Size</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mediumServingSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serving Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10 PPL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mediumPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 99.00"
                          {...field}
                          min={0}
                          step={0.01}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 font-medium text-lg">Full Deep Size</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="largeServingSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serving Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 15 PPL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="largePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 125.00"
                          {...field}
                          min={0}
                          step={0.01}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? `${action}ing...` : `${action} Menu Item`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MenuFormContent;
