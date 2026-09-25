export default function PaymentPlanTimeline({ rows }) {
  if (!rows || rows.length === 0) return null

  return (
    <>
      <h2 className="mt-10 text-xl font-semibold text-neutral-900">Payment Plan</h2>

      <div className="mt-8 w-full">
        <div className="grid grid-cols-[16px_minmax(0,1fr)] gap-6">
          <div />
          <div className="grid grid-cols-2 gap-4 px-5 pb-5">
            <p className="font-manrope text-[10px] font-semibold uppercase tracking-wider text-neutral-800 sm:text-xs">
              Milestone
            </p>
            <p className="font-manrope text-[10px] font-semibold uppercase tracking-wider text-neutral-800 sm:text-xs">
              % of property value to be paid
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute bottom-[35px] left-[5px] top-[35px] w-px bg-[#CDE9DC]" />

          {rows.map((row, index) => {
            let percentage = row.value_of_the_property || ''
            if (percentage && !Number.isNaN(Number(String(percentage).trim()))) {
              percentage = `${String(percentage).trim()}%`
            }
            const rowBg = index % 2 === 0 ? 'rounded-lg bg-[#F8F8F8]' : 'bg-white'

            return (
              <div key={index} className="relative grid grid-cols-[16px_minmax(0,1fr)] items-center gap-6">
                <div className="relative z-10 flex items-center">
                  <span className="block h-[11px] w-[11px] shrink-0 rounded-full bg-[#85CEAA]" />
                </div>

                <div className={`grid min-h-[70px] grid-cols-2 items-center gap-4 px-5 py-4 ${rowBg}`}>
                  <div className="min-w-0">
                    <p className="font-manrope text-sm leading-relaxed text-neutral-800 sm:text-base">
                      {row.milestone}
                      {row.milestone_note && (
                        <span className="text-neutral-500" title={row.milestone_note}>
                          {' '}
                          &bull; {row.milestone_note}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-manrope text-sm font-medium text-neutral-900 sm:text-base">{percentage}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
