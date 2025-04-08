interface PoolCardComingSoonProps {
  poolId: string;
}

export default function PoolCardComingSoon({ poolId }: PoolCardComingSoonProps) {
  return (
    <div className="card w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"/>
            <div className="flex flex-col">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"/>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"/>
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"/>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse"/>
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"/>
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"/>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"/>
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"/>
        </div>
      </div>
    </div>
  );
} 