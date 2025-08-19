import AddCustomItemDialog from '@/components/dialog/add-custom-item-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CateringMenuDocumentPopulate } from '@/models/types/catering-menu';
import MenuItemCard from './menu-item-card';

type VisualMenuSelectorProps = {
  menuItems: CateringMenuDocumentPopulate[];
};

export function VisualMenuSelector({ menuItems }: VisualMenuSelectorProps) {
  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category.name))
  );

  // Get category-specific items
  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category.name === category);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between px-3.5 pt-3.5 md:px-6 md:pt-6">
        <div>
          <CardTitle className="text-lg">Menu Items</CardTitle>
          <CardDescription>
            Select items from our menu to add to the order
          </CardDescription>
        </div>
        <AddCustomItemDialog />
      </CardHeader>
      <CardContent className="px-3.5 pb-3.5 md:px-6 md:pb-6">
        <Tabs className="w-full" defaultValue={categories[0]}>
          <TabsList className="scrollbar-hide mb-4 flex justify-start overflow-x-scroll">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {getItemsByCategory(category).length > 0 ? (
                  getItemsByCategory(category).map((item) => (
                    <MenuItemCard item={item} key={item._id} />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No items found in this category.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
