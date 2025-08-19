import { Box, Stack, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import Header from '@/components/dashboard/header';
import EditStoreForm from '@/components/forms/edit-store-form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import connectDB from '@/config/mongoose';
import Store from '@/models/storeModel';

const EditStorePage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const storeId = (await searchParams)?.id as string;
  if (!storeId) {
    return notFound();
  }

  await connectDB();
  const store = await Store.findOne({ _id: storeId });

  if (!store) {
    return notFound();
  }

  return (
    <Box className="flex-grow overflow-auto" component="main">
      <Header />
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: { xs: 1, md: 3 },
          pb: 5,
          pt: { xs: 2, md: 0 },
          mt: { xs: 8, md: 2 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography component="h2" sx={{ mb: 2 }} variant="h6">
            Edit store
          </Typography>
          <div className="container mx-auto">
            <Card className="mx-auto max-w-3xl">
              <CardHeader>
                <CardTitle>Edit Store</CardTitle>
                <CardDescription>
                  Edit the details below to edit a store.
                </CardDescription>
              </CardHeader>
              <EditStoreForm store={JSON.parse(JSON.stringify(store))} />
            </Card>
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditStorePage;
