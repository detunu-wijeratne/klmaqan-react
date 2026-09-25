import { useEffect, useState, useCallback } from 'react'
import { getAllProjectFilterTerms, getProjects } from '../api/wordpress'
import ProjectFilters from '../components/ProjectFilters'
import ProjectCard from '../components/ProjectCard'

const EMPTY_FILTERS = {
  'property-developer': '',
  location: '',
  'property-type': '',
  'property-status': '',
  'price-range': '',
  beds: '',
}

export default function ProjectsPage() {
  const [termsByTaxonomy, setTermsByTaxonomy] = useState({})
  const [selected, setSelected] = useState(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load filter term lists once.
  useEffect(() => {
    getAllProjectFilterTerms()
      .then(setTermsByTaxonomy)
      .catch((err) => setError(err.message))
  }, [])

  const loadProjects = useCallback(
    async (filters) => {
      setLoading(true)
      setError('')
      try {
        const data = await getProjects({ filters, termLookup: termsByTaxonomy })
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [termsByTaxonomy]
  )

  // Re-fetch whenever term lookup first becomes available, or filters are applied.
  useEffect(() => {
    if (Object.keys(termsByTaxonomy).length > 0) {
      loadProjects(appliedFilters)
    }
  }, [termsByTaxonomy, appliedFilters, loadProjects])

  function handleFilterChange(taxonomy, value, applyImmediately = false) {
    setSelected((prev) => {
      const next = { ...prev, [taxonomy]: value }
      if (applyImmediately) setAppliedFilters(next)
      return next
    })
  }

  function handleSubmit() {
    setAppliedFilters(selected)
  }

  function handleClear() {
    setSelected(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
  }

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* Hero */}
      <section className="relative flex min-h-96 w-full flex-col justify-center overflow-hidden pt-32 pb-20 md:pt-50 md:pb-30">
        <img
          src="/statics/project.png"
          alt="Modern villa at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-[1] bg-neutral-900 opacity-40" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-[linear-gradient(to_top,#171717_0%,rgb(23_23_23/0.6)_50%,transparent_100%)]" />

        <div className="relative z-10 px-6 md:px-10">
          <p className="text-sm tracking-[0.3em] text-amber-100">PROJECTS</p>
          <h1 className="mt-6 max-w-2xl font-alata text-3xl font-medium uppercase leading-tight tracking-wide text-stone-300 sm:text-4xl md:text-5xl">
            Explore Dubai's Leading
            <br />
            Property Projects
          </h1>
          <p className="mt-6 max-w-2xl font-manrope text-base leading-tight tracking-wide text-stone-300">
            Discover a curated selection of off-plan and ready developments across Dubai. Explore
            available options and find opportunities that align with your budget and long-term goals.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white px-6 pt-8 md:px-10">
        <ProjectFilters
          termsByTaxonomy={termsByTaxonomy}
          selected={selected}
          onChange={handleFilterChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
          statusTerms={termsByTaxonomy['property-status']}
        />
      </section>

      {/* Cards */}
      <section className="bg-white px-6 pb-24 pt-8 md:px-10">
        <div className="mx-auto w-full max-w-[1600px]">
          {error && <p className="text-sm text-red-600">{error}</p>}

          {loading ? (
            <p className="text-neutral-500">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-neutral-500">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
