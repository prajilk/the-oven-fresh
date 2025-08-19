import { Unplug } from 'lucide-react';

const FailedFetch = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <div className="w-fit rounded-full bg-gray-100 p-3">
        <Unplug className="animate-pulse" size={60} />
      </div>
      <span className="font-medium text-xl">Failed to fetch data</span>
    </div>
  );
};

export default FailedFetch;
