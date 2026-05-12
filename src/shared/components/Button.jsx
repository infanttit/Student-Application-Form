export default function Button({ children, type = 'button', onClick, disabled, variant = 'primary' }) {
  const base =
    'inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30';
  const styles =
    variant === 'secondary'
      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200'
      : 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {children}
    </button>
  );
}
