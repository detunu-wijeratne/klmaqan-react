const BASE_URL = import.meta.env.VITE_WP_BASE_URL || 'https://klmaqan.w3icon.com'
const WP_API = `${BASE_URL}/wp-json/wp/v2`

/**
 * Taxonomy slugs used by the "project" post type. These double as the
 * REST query param names WordPress registers automatically for any
 * taxonomy with show_in_rest => true attached to the post type.
 */
export const PROJECT_TAXONOMIES = [
  'property-developer',
  'location',
  'property-type',
  'property-status',
  'price-range',
  'beds',
]

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

/** Fetch all terms for a given taxonomy (used to populate filter dropdowns). */
export async function getTaxonomyTerms(taxonomy) {
  const url = `${WP_API}/${taxonomy}?per_page=100&hide_empty=true&orderby=name&order=asc`
  return fetchJson(url)
}

/**
 * Fetch all filter dropdown terms in parallel.
 * Returns { 'property-developer': [...], location: [...], ... }
 */
export async function getAllProjectFilterTerms() {
  const results = await Promise.all(
    PROJECT_TAXONOMIES.map((tax) => getTaxonomyTerms(tax).catch(() => []))
  )
  return Object.fromEntries(PROJECT_TAXONOMIES.map((tax, i) => [tax, results[i]]))
}

/**
 * Fetch projects, optionally filtered by taxonomy term slugs.
 * `filters` shape: { 'property-developer': 'emmar', location: 'downtown-dubai', ... }
 * `termLookup` is the object returned by getAllProjectFilterTerms(), used to
 * resolve a selected slug to the term ID the REST API filter params expect.
 */
export async function getProjects({ filters = {}, termLookup = null } = {}) {
  const params = new URLSearchParams()
  params.set('per_page', '100')
  params.set('orderby', 'date')
  params.set('order', 'desc')

  if (termLookup) {
    for (const taxonomy of PROJECT_TAXONOMIES) {
      const slug = filters[taxonomy]
      if (!slug) continue
      const terms = termLookup[taxonomy] || []
      const match = terms.find((t) => t.slug === slug)
      if (match) {
        params.set(taxonomy, String(match.id))
      }
    }
  }

  const url = `${WP_API}/projects?${params.toString()}`
  return fetchJson(url)
}

/** Fetch a single project by slug (what the React route /project/:slug uses). */
export async function getProjectBySlug(slug) {
  const url = `${WP_API}/projects?slug=${encodeURIComponent(slug)}`
  const results = await fetchJson(url)
  if (!results.length) {
    throw new Error('Project not found')
  }
  return results[0]
}

/** Fetch related projects (same property-status, excluding current post). */
export async function getRelatedProjects({ statusTermId, excludeId, perPage = 3 }) {
  const params = new URLSearchParams()
  params.set('per_page', String(perPage))
  params.set('exclude', String(excludeId))
  if (statusTermId) {
    params.set('property-status', String(statusTermId))
  }
  const url = `${WP_API}/projects?${params.toString()}`
  return fetchJson(url)
}

/** Submit the enquiry form to the custom endpoint registered in wordpress/klmaqan-headless-api.php */
export async function submitEnquiry(payload) {
  const url = `${BASE_URL}/wp-json/klmaqan/v1/enquiry`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.message || 'Could not send your enquiry.')
  }
  return body
}

/** Helpers that read off the actual shape your site returns. */
export function getFeaturedImage(project) {
  return project?.featured_image || null
}

export function getTermsFor(project, taxonomy) {
  return project?.project_taxonomies?.[taxonomy] || []
}

export function getAcf(project) {
  return project?.acf || {}
}
