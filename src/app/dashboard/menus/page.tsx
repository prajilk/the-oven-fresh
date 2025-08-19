import { Box, Divider, Stack } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import Header from '@/components/dashboard/header';
import CateringCategoryTable from '@/components/data-table/categories-table';
import CateringMenuTable from '@/components/data-table/catering/menu-table';
import ServerWrapper from '@/components/server-wrapper';
import TiffinMenuList from '@/components/tiffin/menu-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCateringCategoryServer } from '@/lib/api/category/get-catering-category';
import { getCateringMenuServer } from '@/lib/api/menu/get-catering-menu';
import { getTiffinMenuServer } from '@/lib/api/menu/get-tiffin-menu';

const MenusPage = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        // position: "relative",
      }}
    >
      <Header />
      <Stack
        spacing={2}
        sx={{
          mx: { xs: 1.5, md: 3 },
          pb: 5,
          pt: { xs: 2, md: 0 },
          mt: { xs: 8, md: 2 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { sm: '100%', md: '1700px' },
          }}
        >
          <Tabs defaultValue="catering">
            <TabsList>
              <TabsTrigger value="catering">Catering</TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
              <TabsTrigger value="tiffin">Tiffin</TabsTrigger>
            </TabsList>
            <div className="pt-3">
              <Divider />
            </div>
            <TabsContent value="catering">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center gap-1 py-10">
                    <Loader2 className="animate-spin" /> Loading...
                  </div>
                }
              >
                <ServerWrapper
                  queryFn={() => getCateringMenuServer()}
                  queryKey={['menu', 'catering']}
                >
                  <CateringMenuTable />
                </ServerWrapper>
              </Suspense>
            </TabsContent>
            <TabsContent value="category">
              <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                  queryFn={getCateringCategoryServer}
                  queryKey={['menu', 'category']}
                >
                  <CateringCategoryTable />
                </ServerWrapper>
              </Suspense>
            </TabsContent>
            <TabsContent value="tiffin">
              <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                  queryFn={getTiffinMenuServer}
                  queryKey={['menu', 'tiffin']}
                >
                  <TiffinMenuList />
                </ServerWrapper>
              </Suspense>
            </TabsContent>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default MenusPage;
