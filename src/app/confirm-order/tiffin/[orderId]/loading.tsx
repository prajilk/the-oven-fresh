import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex items-center gap-1">
        <Loader2 className="animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
