import { Box, Stack } from '@mui/material';
import Header from '@/components/dashboard/header';
import MenuForm from '@/components/forms/add-menu-form';
import connectDB from '@/config/mongoose';
import CateringCategory from '@/models/cateringCategoryModel';

const AddMenuPage = async () => {
  await connectDB();
  const categories = await CateringCategory.find({});

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
          <MenuForm categories={JSON.parse(JSON.stringify(categories)) || []} />
        </Box>
      </Stack>
    </Box>
  );
};

export default AddMenuPage;
