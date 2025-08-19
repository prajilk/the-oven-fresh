'use client';

import { Loader2, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDeliveryProofs } from '@/api-hooks/delivery-proof';
import { Input } from '@/components/ui/input';
import { Show } from '../show';
import { Button } from '../ui/button';
import LoadingButton from '../ui/loading-button';
import ProofCard from './proof-card';

const DeliveryProof = () => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleSearch() {
    setSearch(inputRef.current?.value || '');
  }

  const {
    data: deliveryProofs,
    isFetchingNextPage,
    isPending,
    isError,
    fetchNextPage,
  } = useDeliveryProofs(search);

  if (isError) {
    return <div className="py-20 text-center">Error: Unable to load data</div>;
  }
  if (!(deliveryProofs || isPending)) {
    return <div className="py-20 text-center">No data available!</div>;
  }

  return (
    <>
      <div>
        <h1 className="font-bold text-2xl">Delivery Proofs</h1>
        <p className="text-muted-foreground">
          View and manage delivery proofs for all orders
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative my-5">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="max-w-sm bg-white pl-8"
            placeholder="Search by order ID"
            ref={inputRef}
            type="search"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <span className="mb-3 text-muted-foreground text-sm">
        Total {deliveryProofs?.pages[0]?.length || 0} delivery proofs listed.
      </span>
      <Show>
        <Show.When isTrue={isPending}>
          <div className="flex items-center justify-center gap-1 py-20 text-center">
            <Loader2 className="animate-spin" />
            Loading...
          </div>
        </Show.When>
        <Show.Else>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {deliveryProofs?.pages[0]?.length === 0 ? (
              <div className="py-10 text-center sm:col-span-3 lg:col-span-4">
                No orders found!
              </div>
            ) : (
              deliveryProofs?.pages.map((page) => {
                return page?.map((order) => (
                  <ProofCard key={order._id} order={order} />
                ));
              })
            )}
          </div>
        </Show.Else>
      </Show>
      <div className="mt-5 mb-10 flex justify-center">
        <LoadingButton
          className="w-fit"
          disabled={
            isFetchingNextPage ||
            isPending ||
            deliveryProofs?.pages.at(-1)?.length !== 0 ||
            deliveryProofs.pages[0]?.length === 0
          }
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          View more
        </LoadingButton>
      </div>
    </>
  );
};

export default DeliveryProof;
