export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  name,
  autoComplete,
  error,
  required: requiredField,
  right,
}) {
  return (
    <label className="block">
      {label ? <span className="block text-sm font-medium text-slate-700">{label} {requiredField ? <span className="text-rose-600">*</span> : null}</span> : null}
      <div className="relative mt-1">
        <input
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none',
            'focus:border-slate-300 focus:ring-2 focus:ring-slate-200',
            error ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200',
            right ? 'pr-12' : '',
          ].join(' ')}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
        {right ? <div className="absolute inset-y-0 right-3 flex items-center">{right}</div> : null}
      </div>
      {error ? <div className="mt-1 text-sm text-rose-700">{error}</div> : null}
    </label>
  );
}
