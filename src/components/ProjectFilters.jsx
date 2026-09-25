const FILTER_FIELDS = [
  { taxonomy: 'property-developer', label: 'Select Builder', icon: '▦' },
  { taxonomy: 'location', label: 'Select Location', icon: '◉' },
  { taxonomy: 'property-type', label: 'Property Type', icon: '⌂' },
  { taxonomy: 'property-status', label: 'Project Status', icon: '▤' },
  { taxonomy: 'price-range', label: 'Price Range', icon: '◈' },
  { taxonomy: 'beds', label: 'Bedrooms', icon: '▭' },
]

export default function ProjectFilters({ termsByTaxonomy, selected, onChange, onSubmit, onClear, statusTerms }) {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {FILTER_FIELDS.map(({ taxonomy, label, icon }) => (
            <label
              key={taxonomy}
              className="flex items-center gap-3 border border-neutral-200 px-4 py-3 text-sm text-neutral-500"
            >
              <span className="text-neutral-400">{icon}</span>
              <select
                value={selected[taxonomy] || ''}
                onChange={(e) => onChange(taxonomy, e.target.value)}
                className="w-full min-w-0 bg-transparent text-sm text-neutral-500 focus:outline-none"
              >
                <option value="">{label}</option>
                {(termsByTaxonomy[taxonomy] || []).map((term) => (
                  <option key={term.id} value={term.slug}>
                    {term.name}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <button
            type="submit"
            className="flex items-center justify-center gap-4 whitespace-nowrap bg-neutral-900 px-6 py-3 text-sm text-white hover:bg-neutral-800"
          >
            Search →
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-neutral-500">Quick Filters:</span>
          {(statusTerms || []).map((term) => (
            <button
              key={term.id}
              type="button"
              onClick={() => onChange('property-status', term.slug, true)}
              className={`rounded-full px-4 py-2 text-xs ${
                selected['property-status'] === term.slug
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-stone-100 text-neutral-700 hover:bg-stone-200'
              }`}
            >
              {term.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900"
        >
          ↻ Clear Filters
        </button>
      </div>
    </div>
  )
}
