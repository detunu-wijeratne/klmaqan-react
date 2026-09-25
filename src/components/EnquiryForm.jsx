import { useState } from 'react'
import { submitEnquiry } from '../api/wordpress'

export default function EnquiryForm({ projectTitle, projectUrl }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await submitEnquiry({
        ...form,
        project_title: projectTitle,
        project_url: projectUrl,
      })
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-neutral-200 bg-stone-50 p-6 text-sm text-neutral-700">
        Thanks — your enquiry about <strong>{projectTitle}</strong> has been sent. A member of our team
        will be in touch shortly.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-neutral-200 bg-white p-6">
      <h3 className="text-lg text-neutral-900">Enquire about {projectTitle}</h3>

      <input
        type="text"
        required
        placeholder="Full name"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        className="border border-neutral-200 px-4 py-3 text-sm focus:border-amber-700 focus:outline-none"
      />
      <input
        type="email"
        required
        placeholder="Email address"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        className="border border-neutral-200 px-4 py-3 text-sm focus:border-amber-700 focus:outline-none"
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
        className="border border-neutral-200 px-4 py-3 text-sm focus:border-amber-700 focus:outline-none"
      />
      <textarea
        rows={4}
        placeholder="Message (optional)"
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        className="border border-neutral-200 px-4 py-3 text-sm focus:border-amber-700 focus:outline-none"
      />

      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-amber-700 px-5 py-3 text-center text-sm tracking-widest text-white transition-colors hover:bg-amber-800 disabled:opacity-60"
      >
        {status === 'sending' ? 'SENDING…' : 'ENQUIRE NOW'}
      </button>
    </form>
  )
}
