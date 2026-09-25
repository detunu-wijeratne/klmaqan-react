export default function KeyFeatures({ features }) {
  const rows = (features || []).filter((f) => f.features)
  if (rows.length === 0) return null

  return (
    <>
      <h2 className="mt-8 text-xl font-semibold text-neutral-900">Key Features</h2>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-600">
        {rows.map((row, i) => (
          <span key={i} className="flex items-center gap-2">
            {row.icon && <i className={`${row.icon} text-amber-700`} aria-hidden="true" />}
            {row.features}
          </span>
        ))}
      </div>
    </>
  )
}
