import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center gap-1">
      <Loader2 className="animate-spin" /> Loading...
    </div>
  );
};

export default Loading;
