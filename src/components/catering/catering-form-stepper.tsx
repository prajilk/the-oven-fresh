'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import type { QueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type { z } from 'zod';
import { useCreateCateringOrder } from '@/api-hooks/catering/create-order';
import { useCateringMenu } from '@/api-hooks/catering/get-catering-menu';
import { ZodCateringSchema } from '@/lib/zod-schema/schema';
import type { RootState } from '@/store';
import { clearCustomItemState } from '@/store/slices/catering-custom-item-slice';
import { clearState } from '@/store/slices/catering-item-slice';
import { clearState as clearOrderState } from '@/store/slices/catering-order-slice';
import CateringForm from '../forms/catering-form';
import Whatsapp from '../icons/whatsapp';
import { Button } from '../ui/button';
import LoadingButton from '../ui/loading-button';
import FinalSummary from './final-summary/final-summary';
import SelectItems from './select-items';

const steps = ['Select Items', 'Enter address', 'Order summery'];

export default function CateringFormStepper() {
  const form = useForm<z.infer<typeof ZodCateringSchema>>({
    resolver: zodResolver(ZodCateringSchema),
    defaultValues: {
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      payment_method: 'cash',
      note: '',
      order_type: 'delivery',
      customerDetails: {
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        aptSuiteUnit: '',
      },
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const order = useSelector((state: RootState) => state.cateringOrder);
  const orderItems = useSelector((state: RootState) => state.cateringItem);
  const customItems = useSelector(
    (state: RootState) => state.cateringCustomItem
  );

  const dispatch = useDispatch();

  function onSuccess(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: ['order', 'catering'] });
    toast.success('Order created successfully!');
    setActiveStep(0);
    resetForm();
  }

  // React queries
  const mutation = useCreateCateringOrder(onSuccess);
  const { data: menu, isPending } = useCateringMenu('false');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = (sentToWhatsapp?: boolean) => {
    if (orderItems.length === 0 && customItems.length === 0) {
      toast.error('Please add items to the order.');
      return;
    }
    const data = {
      ...order,
      customerDetails: {
        ...order.customerDetails,
        address: order.customerDetails.address.address,
        lat: Number(order.customerDetails.lat || 0),
        lng: Number(order.customerDetails.lng || 0),
        aptSuiteUnit: order.customerDetails.aptSuiteUnit,
      },
      items: orderItems.map((item) => ({
        itemId: item._id,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        size: item.size,
      })),
      customItems: customItems.map((item) => ({
        name: item.name,
        size: item.size,
        priceAtOrder: item.priceAtOrder,
      })),
      deliveryDate: new Date(order.deliveryDate),
    };
    const result = ZodCateringSchema.safeParse(data);

    if (result.success) {
      mutation.mutate({
        values: {
          ...data,
        },
        sentToWhatsapp,
      });
    }
    if (result.error) {
      toast.error('Please fill all the form fields!');
    }
  };

  function resetForm() {
    form.reset();
    dispatch(clearState());
    dispatch(clearCustomItemState());
    dispatch(clearOrderState());
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} className="[svg_text]:text-red-500">
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel
                classes={{
                  iconContainer: '[&svg>text]:text-red-500',
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          className="mr-1"
          disabled={activeStep === 0}
          onClick={handleBack}
          size={'sm'}
          type="button"
          variant="outline"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep >= steps.length - 1 ? (
          <>
            <LoadingButton
              className="mr-2 flex items-center gap-2 border-green-200 text-green-500 hover:bg-green-100 hover:text-green-500"
              disabled={isPending || menu?.length === 0}
              isLoading={mutation.isPending}
              onClick={() => handleSubmit(true)}
              size={'sm'}
              variant="outline"
            >
              <Whatsapp />
              Confirm order
            </LoadingButton>
            <LoadingButton
              disabled={isPending || menu?.length === 0}
              isLoading={mutation.isPending}
              onClick={() => handleSubmit(false)}
              size={'sm'}
            >
              Confirm order
            </LoadingButton>
          </>
        ) : (
          <Button
            disabled={isPending || menu?.length === 0}
            onClick={handleNext}
            size={'sm'}
            type="button"
          >
            Next <ChevronRight className="size-4" />
          </Button>
        )}
      </Box>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              pt: 2,
            }}
          >
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset} type="button">
              Reset
            </Button>
          </Box>
        </>
      ) : (
        <>
          {activeStep === 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <CateringForm form={form} />
            </Box>
          )}
          {activeStep === 1 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <SelectItems data={menu} isPending={isPending} />
            </Box>
          )}
          {activeStep === 2 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <FinalSummary form={form} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
