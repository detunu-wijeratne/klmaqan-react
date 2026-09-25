import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getProjectBySlug,
  getRelatedProjects,
  getFeaturedImage,
  getTermsFor,
  getAcf,
} from '../api/wordpress'
import KeyFeatures from '../components/KeyFeatures'
import PaymentPlanTimeline from '../components/PaymentPlanTimeline'
import RelatedProjects from '../components/RelatedProjects'
import EnquiryForm from '../components/EnquiryForm'

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 7v10" /><path d="M21 10v7" /><path d="M3 14h18" />
      <path d="M5 10h5a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2Z" />
      <path d="M12 10h6a3 3 0 0 1 3 3v1h-9v-4Z" />
    </svg>
  )
}
function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 12h18" /><path d="M5 12v2a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-2" />
      <path d="M7 19v2" /><path d="M17 19v2" /><path d="M6 12V6a3 3 0 0 1 6 0" />
    </svg>
  )
}
function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M8 3H3v5" /><path d="M16 3h5v5" /><path d="M8 21H3v-5" /><path d="M16 21h5v-5" />
    </svg>
  )
}

function formatPricePerSqFt(raw) {
  if (raw === '' || raw == null) return ''
  const numeric = String(raw).trim().replace(/[, ]/g, '')
  if (!Number.isNaN(Number(numeric)) && numeric !== '') {
    return `AED ${Number(numeric).toLocaleString()}`
  }
  return String(raw).trim()
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getProjectBySlug(slug)
      .then(async (data) => {
        if (cancelled) return
        setProject(data)

        const statusTerm = getTermsFor(data, 'property-status')[0]
        try {
          const relatedProjects = await getRelatedProjects({
            statusTermId: statusTerm?.id,
            excludeId: data.id,
          })
          if (!cancelled) setRelated(relatedProjects)
        } catch {
          // related projects are a nice-to-have; ignore failures
        }
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return <div className="px-6 py-24 text-center text-neutral-500">Loading project…</div>
  }

  if (error || !project) {
    return (
      <div className="px-6 py-24 text-center text-neutral-500">
        {error || 'Project not found.'}{' '}
        <Link to="/projects" className="text-amber-700 underline">
          Back to projects
        </Link>
      </div>
    )
  }

  const fields = getAcf(project)
  const developer = getTermsFor(project, 'property-developer').map((t) => t.name).join(', ')
  const projectType = getTermsFor(project, 'property-type').map((t) => t.name).join(', ')
  const image = getFeaturedImage(project) || '/property-placeholder.jpg'
  const pricePerSqFtDisplay = formatPricePerSqFt(fields.price_per_sq_ft)
  const title = project.title?.rendered || ''
  const projectUrl = typeof window !== 'undefined' ? window.location.href : ''

  const hasQuickDetails =
    fields.bedrooms || fields.bathrooms || fields.area_from || pricePerSqFtDisplay

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Gallery (single featured image — replace with an ACF gallery field for more) */}
      <section className="w-full pt-1">
        <img src={image} alt={title} className="h-64 w-full object-cover sm:h-96" />
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto mb-8 w-full max-w-[1600px] px-5 pt-6 sm:px-6 md:px-10">
        <p className="font-manrope text-xs uppercase tracking-[0.22em] text-neutral-400">
          <Link to="/" className="transition-colors hover:text-neutral-900">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <Link to="/projects" className="transition-colors hover:text-neutral-900">
            PROJECTS
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          {title}
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 px-5 pb-14 sm:px-6 md:px-10 lg:grid-cols-12">
        {/* Left content */}
        <div className="lg:col-span-8">
          {/* Hero banner */}
          <div className="relative overflow-hidden">
            <img src={image} alt={title} className="h-56 w-full object-cover sm:h-64" />
            <div className="absolute inset-0 bg-neutral-900 opacity-70" />
            <div className="absolute inset-0 flex items-center justify-between gap-5 px-5 sm:px-8">
              <div>
                <h1 className="font-alata text-3xl text-white md:text-4xl">{title}</h1>
                {fields.property_address && (
                  <p className="mt-2 font-manrope text-sm text-stone-300">{fields.property_address}</p>
                )}
                {fields.property_price && (
                  <p className="mt-3 text-xl text-white sm:text-2xl md:text-3xl">{fields.property_price}</p>
                )}
              </div>
              {developer && (
                <div className="hidden h-28 w-28 flex-col items-center justify-center gap-2 bg-amber-700 text-white sm:flex">
                  <span className="text-2xl">🏢</span>
                  <span className="px-2 text-center text-xs">{developer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick details */}
          {hasQuickDetails && (
            <div className="mt-6 grid grid-cols-2 border border-neutral-200 text-sm sm:grid-cols-4">
              <div className="flex items-center gap-3 border-b border-r border-neutral-200 px-5 py-4 sm:border-b-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-400"><BedIcon /></span>
                {fields.bedrooms ? (
                  <p className="text-neutral-500">
                    <span className="font-medium text-neutral-900">{fields.bedrooms}</span>{' '}
                    {Number(fields.bedrooms) === 1 ? 'Bed' : 'Beds'}
                  </p>
                ) : (
                  <p className="text-neutral-400">—</p>
                )}
              </div>

              <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-4 sm:border-b-0 sm:border-r">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-400"><BathIcon /></span>
                {fields.bathrooms ? (
                  <p className="text-neutral-500">
                    <span className="font-medium text-neutral-900">{fields.bathrooms}</span>{' '}
                    {Number(fields.bathrooms) === 1 ? 'Bath' : 'Baths'}
                  </p>
                ) : (
                  <p className="text-neutral-400">—</p>
                )}
              </div>

              <div className="flex items-center gap-3 border-r border-neutral-200 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-400"><AreaIcon /></span>
                {fields.area_from ? (
                  <p className="text-neutral-500">
                    <span className="font-medium text-neutral-900">{fields.area_from}</span> sq ft
                  </p>
                ) : (
                  <p className="text-neutral-400">—</p>
                )}
              </div>

              <div className="flex items-center gap-3 px-5 py-4">
                {pricePerSqFtDisplay ? (
                  <p className="text-neutral-500">
                    <span className="font-medium text-neutral-900">{pricePerSqFtDisplay}</span>
                    <span className="ml-1 text-xs text-neutral-400">/ sq ft</span>
                  </p>
                ) : (
                  <p className="text-neutral-400">—</p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {project.content?.rendered && (
            <div
              className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600"
              dangerouslySetInnerHTML={{ __html: project.content.rendered }}
            />
          )}

          {/* Project information */}
          <div className="mt-8 flex flex-col">
            {developer && (
              <div className="flex justify-between gap-6 border-b border-neutral-100 py-3">
                <p className="text-sm text-neutral-500">Developer</p>
                <p className="text-right text-sm text-neutral-900">{developer}</p>
              </div>
            )}
            {fields.payment_plan && (
              <div className="flex justify-between gap-6 border-b border-neutral-100 py-3">
                <p className="text-sm text-neutral-500">Payment Plan</p>
                <p className="text-right text-sm text-neutral-900">{fields.payment_plan}</p>
              </div>
            )}
            {projectType && (
              <div className="flex justify-between gap-6 border-b border-neutral-100 py-3">
                <p className="text-sm text-neutral-500">Property Type</p>
                <p className="text-right text-sm text-neutral-900">{projectType}</p>
              </div>
            )}
            {fields.handover && (
              <div className="flex justify-between gap-6 border-b border-neutral-100 py-3">
                <p className="text-sm text-neutral-500">Handover</p>
                <p className="text-right text-sm text-neutral-900">{fields.handover}</p>
              </div>
            )}
          </div>

          <KeyFeatures features={fields.key_features} />

          {/* Map */}
          {fields.google_map_embed && (
            <>
              <h2 className="mt-10 text-xl font-semibold text-neutral-900">Map</h2>
              <div className="relative mt-4 overflow-hidden">
                <iframe
                  src={fields.google_map_embed}
                  className="h-64 w-full border-0 sm:h-72"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${title} Location`}
                />
              </div>
            </>
          )}

          <PaymentPlanTimeline rows={fields.payment_planner} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky-aside">
            <EnquiryForm projectTitle={title} projectUrl={projectUrl} />
          </div>
        </div>
      </div>

      <RelatedProjects projects={related} />
    </div>
  )
}
