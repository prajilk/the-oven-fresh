import { Box, Stack, Typography } from '@mui/material';
import Header from '@/components/dashboard/header';
import AddStoreForm from '@/components/forms/add-store-form';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const AddStorePage = () => {
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
            Add new store
          </Typography>
          <div className="container mx-auto">
            <Card className="mx-auto max-w-3xl">
              <CardHeader>
                <CardTitle>Create New Store</CardTitle>
                <CardDescription>
                  Fill in the details below to create a new store location.
                </CardDescription>
              </CardHeader>
              <AddStoreForm />
            </Card>
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default AddStorePage;
