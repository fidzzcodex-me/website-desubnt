export default function FeatureRow({ icon, title, description, tag }) {
  return (
    <div className="flex flex-col gap-3 border-t border-ink-100 py-6 first:border-t-0 sm:flex-row sm:items-start sm:gap-6">
      <div className="flex w-48 shrink-0 items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <i className={`fa-solid ${icon} text-sm`} />
        </span>
        <span className="text-sm font-semibold text-ink-900">{title}</span>
      </div>
      <div className="flex flex-1 items-start justify-between gap-4">
        <p className="text-sm leading-relaxed text-ink-500">{description}</p>
        {tag && (
          <span className="data-label shrink-0 rounded-md bg-ink-100 px-2 py-1 text-[11px] text-ink-700">
            {tag}
          </span>
        )}
      </div>
    </div>
  )
}
