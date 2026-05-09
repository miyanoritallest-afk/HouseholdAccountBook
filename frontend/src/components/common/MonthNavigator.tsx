"use client";

type Props = {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function MonthNavigator({ year, month, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrev}
        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="前月"
      >
        ＜
      </button>
      <span className="min-w-32 text-center text-base font-semibold text-gray-800">
        {year}年{month}月
      </span>
      <button
        onClick={onNext}
        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="翌月"
      >
        ＞
      </button>
    </div>
  );
}
