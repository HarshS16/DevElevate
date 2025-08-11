import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Button } from '../components/ui/Button'

export function ProfilePage() {
  const [form, setForm] = useState({ name: '', linkedinProfileUrl: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.users.getProfile()
        const { name = '', linkedinProfileUrl = '' } = res.data || {}
        setForm({ name, linkedinProfileUrl })
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const onSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      await api.users.updateProfile(form)
      setSuccess('Profile updated successfully')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              type="url"
              value={form.linkedinProfileUrl}
              onChange={(e) => setForm((f) => ({ ...f, linkedinProfileUrl: e.target.value }))}
              placeholder="https://www.linkedin.com/in/your-handle"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <Button onClick={onSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}

