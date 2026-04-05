import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ChatPage } from '@/pages/ChatPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { MessageSquare, FileText, Settings, LogIn } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">社内チャット + RAG</h1>
          <p className="text-sm text-gray-500 text-center">AIがドキュメントを参照して回答する社内チャット</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-gray-600 mb-1">メールアドレス</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium text-gray-600 mb-1">パスワード</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="6文字以上"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {loading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError('') }}
          className="w-full mt-4 text-xs text-blue-600 hover:text-blue-800 text-center"
        >
          {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントを作成する'}
        </button>
      </div>
    </div>
  )
}

function AppLayout() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-gray-50">
        <nav className="flex items-center gap-1 px-4 py-2 bg-white border-b border-gray-200 shrink-0">
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50" : "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"}
          >
            <MessageSquare className="w-4 h-4" />
            チャット
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) => isActive ? "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50" : "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"}
          >
            <FileText className="w-4 h-4" />
            ドキュメント
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => isActive ? "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 ml-auto" : "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors ml-auto"}
          >
            <Settings className="w-4 h-4" />
            設定
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <AuthPage />

  return <AppLayout />
}
