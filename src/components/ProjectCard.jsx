import { Link } from 'react-router-dom'
import { getFeaturedImage, getTermsFor, getAcf } from '../api/wordpress'

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 7v10" />
      <path d="M21 10v7" />
      <path d="M3 14h18" />
      <path d="M5 10h5a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2Z" />
      <path d="M12 10h6a3 3 0 0 1 3 3v1h-9v-4Z" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 12h18" />
      <path d="M5 12v2a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-2" />
      <path d="M7 19v2" />
      <path d="M17 19v2" />
      <path d="M6 12V6a3 3 0 0 1 6 0" />
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M8 3H3v5" />
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M16 21h5v-5" />
    </svg>
  )
}

export default function ProjectCard({ project }) {
  const fields = getAcf(project)
  const image = getFeaturedImage(project) || '/property-placeholder.jpg'
  const status = getTermsFor(project, 'property-status')[0]
  const type = getTermsFor(project, 'property-type')[0]
  const builder = getTermsFor(project, 'property-developer')[0]
  const href = `/project/${project.slug}`

  return (
    <article className="border border-neutral-200">
      <div className="relative">
        <Link to={href} aria-label={project.title?.rendered} className="block">
          <div
            role="img"
            aria-label={project.title?.rendered}
            style={{ backgroundImage: `url('${image}')` }}
            className="h-52 w-full bg-stone-200 bg-cover bg-center"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {status && (
            <span className="bg-neutral-900 px-3 py-1 text-xs tracking-wide text-white">
              {status.name}
            </span>
          )}
          {type && (
            <span className="bg-white px-3 py-1 text-xs text-neutral-700">{type.name}</span>
          )}
          {builder && (
            <span className="bg-white px-3 py-1 text-xs text-neutral-700">{builder.name}</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg text-neutral-900">
            <Link to={href} className="transition-colors hover:text-amber-700">
              <span dangerouslySetInnerHTML={{ __html: project.title?.rendered }} />
            </Link>
          </h3>
          {fields.property_price && (
            <p className="shrink-0 text-sm text-neutral-900">{fields.property_price}</p>
          )}
        </div>

        {fields.property_address && (
          <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
            <span aria-hidden="true">📍</span>
            <span>{fields.property_address}</span>
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
          {fields.bedrooms !== '' && fields.bedrooms != null && (
            <span className="flex items-center gap-2">
              <span className="text-neutral-400"><BedIcon /></span>
              {fields.bedrooms} Beds
            </span>
          )}
          {fields.bathrooms !== '' && fields.bathrooms != null && (
            <span className="flex items-center gap-2">
              <span className="text-neutral-400"><BathIcon /></span>
              {fields.bathrooms} Baths
            </span>
          )}
          {fields.area_from !== '' && fields.area_from != null && (
            <span className="flex items-center gap-2">
              <span className="text-neutral-400"><AreaIcon /></span>
              {fields.area_from} sq ft
            </span>
          )}
        </div>

        <Link
          to={href}
          className="mt-4 block w-full bg-amber-700 px-5 py-3 text-center text-sm tracking-widest text-white transition-colors hover:bg-amber-800"
        >
          ENQUIRE NOW
        </Link>
      </div>
    </article>
  )
}
