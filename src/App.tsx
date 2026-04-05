import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { ChatPage } from '@/pages/ChatPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { MessageSquare, FileText, Settings, LogIn, Database, Key, Server, Upload, Search, Bot, CheckCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

function SetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <header className="flex flex-col items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center">社内チャット + RAG</h1>
          <p className="text-base text-gray-500 text-center max-w-md">AIがドキュメントを参照して回答する社内チャットシステム</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">主な機能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">リアルタイムチャット</h3>
                <p className="text-xs text-gray-500 mt-1">Supabase Realtimeによるチャンネルベースの即時通信</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">ドキュメントアップロード</h3>
                <p className="text-xs text-gray-500 mt-1">ファイルを自動でチャンク分割しベクトル化</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">ベクトル検索 (RAG)</h3>
                <p className="text-xs text-gray-500 mt-1">pgvectorで類似度ベースのドキュメント検索</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">AI応答 + ソース引用</h3>
                <p className="text-xs text-gray-500 mt-1">検索結果をコンテキストにAIが回答し出典を表示</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">セットアップ手順</h2>
          <ol className="flex flex-col gap-5">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  Supabase プロジェクト作成
                </h3>
                <p className="text-xs text-gray-500 mt-1">supabase.com でプロジェクトを作成し、pgvector拡張を有効化</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  SQLマイグレーション実行
                </h3>
                <p className="text-xs text-gray-500 mt-1">supabase/migrations/ の3つのSQLファイルをSQL Editorで実行</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-500" />
                  環境変数を設定
                </h3>
                <p className="text-xs text-gray-500 mt-1">.env ファイルに以下を設定:</p>
                <pre className="mt-2 px-3 py-2 rounded-lg bg-gray-900 text-green-400 text-xs font-mono overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-...`}
                </pre>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  起動
                </h3>
                <p className="text-xs text-gray-500 mt-1">npm run dev でフロントエンド + APIサーバーが同時起動します</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">技術スタック</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">React 18</span>
            <span className="px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium border border-cyan-100">Tailwind CSS</span>
            <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">Supabase</span>
            <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">pgvector</span>
            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">Express.js</span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">OpenAI API</span>
            <span className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">React Router</span>
            <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">TypeScript</span>
          </div>
        </section>
      </div>
    </div>
  )
}

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
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

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

  if (!isSupabaseConfigured) return <SetupGuide />

  if (!user) return <AuthPage />

  return <AppLayout />
}
