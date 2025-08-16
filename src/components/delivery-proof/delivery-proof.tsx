"use client";

import { useDeliveryProofs } from "@/api-hooks/delivery-proof";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import ProofCard from "./proof-card";
import { useRef, useState } from "react";
import LoadingButton from "../ui/loading-button";
import { Show } from "../show";
import { Button } from "../ui/button";

const DeliveryProof = () => {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    function handleSearch() {
        setSearch(inputRef.current?.value || "");
    }

    const {
        data: deliveryProofs,
        isFetchingNextPage,
        isPending,
        isError,
        fetchNextPage,
    } = useDeliveryProofs(search);

    if (isError)
        return (
            <div className="text-center py-20">Error: Unable to load data</div>
        );
    if (!deliveryProofs && !isPending)
        return <div className="text-center py-20">No data available!</div>;
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Delivery Proofs</h1>
                <p className="text-muted-foreground">
                    View and manage delivery proofs for all orders
                </p>
            </div>
            <div className="flex gap-3 items-center">
                <div className="relative my-5">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by order ID"
                        className="pl-8 max-w-sm bg-white"
                        ref={inputRef}
                    />
                </div>
                <Button onClick={handleSearch}>Search</Button>
            </div>
            <span className="text-sm text-muted-foreground mb-3">
                Total {deliveryProofs?.pages[0]?.length || 0} delivery proofs
                listed.
            </span>
            <Show>
                <Show.When isTrue={isPending}>
                    <div className="text-center py-20 flex justify-center items-center gap-1">
                        <Loader2 className="animate-spin" />
                        Loading...
                    </div>
                </Show.When>
                <Show.Else>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                        {deliveryProofs?.pages[0]?.length === 0 ? (
                            <div className="sm:col-span-3 lg:col-span-4 text-center py-10">
                                No orders found!
                            </div>
                        ) : (
                            deliveryProofs?.pages.map((page) => {
                                return page?.map((order) => (
                                    <ProofCard order={order} key={order._id} />
                                ));
                            })
                        )}
                    </div>
                </Show.Else>
            </Show>
            <div className="flex justify-center mt-5 mb-10">
                <LoadingButton
                    isLoading={isFetchingNextPage}
                    disabled={
                        isFetchingNextPage ||
                        isPending ||
                        deliveryProofs?.pages.at(-1)?.length !== 0 ||
                        deliveryProofs.pages[0]?.length === 0
                    }
                    onClick={() => fetchNextPage()}
                    className="w-fit"
                >
                    View more
                </LoadingButton>
            </div>
        </>
    );
};

export default DeliveryProof;
