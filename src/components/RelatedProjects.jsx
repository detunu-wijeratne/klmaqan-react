import { Link } from 'react-router-dom'
import ProjectCard from './ProjectCard'

export default function RelatedProjects({ projects }) {
  if (!projects || projects.length === 0) return null

  return (
    <section className="bg-white px-5 pb-16 pt-14 sm:px-6 md:px-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <h2 className="text-xl font-semibold text-neutral-900">Similar Projects</h2>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-4 bg-stone-200 px-8 py-4 text-sm text-neutral-800 hover:bg-stone-300"
          >
            Explore More →
          </Link>
        </div>
      </div>
    </section>
  )
}
