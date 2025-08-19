import { Box, Stack } from '@mui/material';
import { notFound } from 'next/navigation';
import Header from '@/components/dashboard/header';
import MenuForm from '@/components/forms/edit-menu-form';
import connectDB from '@/config/mongoose';
import CateringCategory from '@/models/cateringCategoryModel';
import CateringMenu from '@/models/cateringMenuModel';

const EditMenuPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const menuId = (await searchParams)?.id as string;
  if (!menuId) {
    return notFound();
  }

  await connectDB();

  const [menu, categories] = await Promise.all([
    CateringMenu.findOne({
      _id: menuId,
    }),
    CateringCategory.find({}),
  ]);

  if (!menu) {
    return notFound();
  }

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
          mx: { xs: 1, md: 3 },
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
          <MenuForm
            categories={JSON.parse(JSON.stringify(categories)) || []}
            menu={JSON.parse(JSON.stringify(menu))}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EditMenuPage;
