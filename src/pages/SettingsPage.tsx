import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Settings, User, LogOut } from 'lucide-react'

export function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email || '')

      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()

      if (data) setDisplayName(data.display_name)
    }

    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">設定</h1>
            <p className="text-sm text-gray-500">プロフィールとアカウント設定</p>
          </div>
        </header>

        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-800">プロフィール</h2>
          </div>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1">メールアドレス</label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm border border-gray-200"
              />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-xs font-medium text-gray-500 mb-1">表示名</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 text-sm border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              {saved && <span className="text-xs text-green-600 font-medium">保存しました</span>}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">アカウント</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        </section>
      </div>
    </div>
  )
}
