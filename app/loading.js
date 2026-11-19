export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border border-brand-500/30" />
        <div className="orbit-ring absolute inset-0">
          <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 shadow-[0_0_16px_var(--color-brand-400)]" />
        </div>
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-brand-400 to-brand-800 shadow-[0_0_30px_-4px_var(--color-brand-500)]" />
      </div>
    </div>
  );
}
