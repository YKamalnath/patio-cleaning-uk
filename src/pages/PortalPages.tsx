import { useState } from 'react'
import { ApiError, apiPost } from '../lib/api'
import { clearSession, setSession, type AuthUser } from '../lib/authStorage'
import type { IconType } from 'react-icons'
import {
  FiArrowUpRight,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiEye,
  FiGrid,
  FiImage,
  FiLock,
  FiLogOut,
  FiMessageSquare,
  FiMenu,
  FiMonitor,
  FiPercent,
  FiPlus,
  FiSave,
  FiSearch,
  FiSettings,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import { Link, NavLink, useNavigate } from 'react-router-dom'

type SidebarItem = {
  label: string
  icon: IconType
  href: string
  /** e.g. clear auth when logging out */
  onNavigate?: () => void
}

type TableAction = {
  label: string
  icon: IconType
  tone: 'neutral' | 'danger'
}

const adminSidebar: SidebarItem[] = [
  { label: 'Dashboard', icon: FiGrid, href: '/admin/dashboard' },
  { label: 'Customer Management', icon: FiUsers, href: '/admin/customers' },
  { label: 'Booking Management', icon: FiCalendar, href: '/admin/bookings' },
  { label: 'Quote Management', icon: FiMessageSquare, href: '/admin/quotes' },
  { label: 'Gallery Management', icon: FiImage, href: '/admin/gallery' },
  { label: 'Settings', icon: FiSettings, href: '/admin/settings' },
  { label: 'View Website', icon: FiMonitor, href: '/' },
]

const customerSidebar: SidebarItem[] = [
  { label: 'Dashboard', icon: FiGrid, href: '/customer/dashboard' },
  { label: 'My Bookings', icon: FiCalendar, href: '/customer/bookings' },
  { label: 'My Quotes', icon: FiMessageSquare, href: '/customer/quotes' },
  { label: 'Settings', icon: FiSettings, href: '/customer/settings' },
  { label: 'Logout', icon: FiLogOut, href: '/portal/login', onNavigate: () => clearSession() },
]

const tableActions: TableAction[] = [
  { label: 'View', icon: FiEye, tone: 'neutral' },
  { label: 'Edit', icon: FiEdit3, tone: 'neutral' },
  { label: 'Delete', icon: FiTrash2, tone: 'danger' },
]

function authWrapper(children: React.ReactNode) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-emerald-500/30 blur-[120px]" />
        <div className="absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-cyan-500/30 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-6">
        <div className="grid min-h-[700px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 md:grid-cols-[1.08fr_0.92fr]">
          <div className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-emerald-400/20 via-slate-900 to-cyan-400/20 p-10 md:flex">
            <div>
              <span className="inline-flex rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.22em] text-emerald-200">
                Premium Patio Suite
              </span>
              <h1 className="mt-7 max-w-md text-4xl font-semibold leading-tight text-white">
                Manage bookings, quotes, and clients with a clean premium dashboard.
              </h1>
              <p className="mt-5 max-w-md text-sm text-slate-200/80">
                Designed for speed, clarity, and trust. Built to make your business operations effortless.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-200">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <FiCheckCircle className="text-emerald-300" />
                <span>Secure authentication and role-based dashboards</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <FiBarChart2 className="text-cyan-300" />
                <span>Operational insights for customers, bookings, and quotes</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 md:p-10">{children}</div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, trend }: { label: string; value: string; icon: IconType; trend: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-lg bg-slate-900 p-2 text-white">
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-emerald-600">{trend}</p>
    </article>
  )
}

function DataTable({
  title,
  columns,
  rows,
  actions,
}: {
  title: string
  columns: string[]
  rows: string[][]
  actions?: TableAction[]
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          <FiPlus size={16} />
          Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 font-semibold">
                  {column}
                </th>
              ))}
              {actions ? <th className="px-3 py-2 font-semibold">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join('-')} className="rounded-xl bg-slate-50 text-slate-700">
                {row.map((value) => (
                  <td key={value} className="px-3 py-3">
                    {value}
                  </td>
                ))}
                {actions ? (
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {actions.map((action) => {
                        const toneClass = action.tone === 'danger' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        return (
                          <button key={action.label} className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${toneClass}`}>
                            <action.icon size={12} />
                            {action.label}
                          </button>
                        )
                      })}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SidebarLayout({
  title,
  role,
  items,
  children,
}: {
  title: string
  role: string
  items: SidebarItem[]
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-slate-100">
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close sidebar menu"
          className="fixed inset-0 z-30 bg-slate-950/55 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}
      <div className="grid min-h-screen w-full min-w-0 grid-cols-1 gap-0 md:grid-cols-[minmax(260px,18rem)_minmax(0,1fr)] xl:grid-cols-[minmax(280px,19rem)_minmax(0,1fr)] 2xl:grid-cols-[minmax(300px,20rem)_minmax(0,1fr)]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[min(100vw-2rem,290px)] border-r border-slate-200 bg-slate-950 px-6 py-7 text-slate-200 transition-transform duration-300 md:static md:w-full md:min-w-0 md:max-w-none md:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between md:hidden">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{role}</p>
              <button type="button" className="rounded-lg border border-white/15 p-1.5 text-slate-100" onClick={() => setMobileMenuOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <p className="hidden text-xs uppercase tracking-[0.2em] text-emerald-300 md:block">{role}</p>
            <h1 className="mt-1 text-lg font-semibold text-white">{title}</h1>
          </div>
          <nav className="mt-7 space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => {
                  item.onNavigate?.()
                  setMobileMenuOpen(false)
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 max-w-full space-y-6 px-4 py-5 sm:px-6 md:px-8 md:py-8 2xl:space-y-8 2xl:px-12 2xl:py-10">
          <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 2xl:p-6">
            <div className="min-w-0 flex-1">
              <button
                type="button"
                className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FiMenu size={16} />
                Menu
              </button>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h2 className="text-2xl font-semibold text-slate-900 2xl:text-3xl">{title}</h2>
            </div>
            <div className="flex w-full min-w-0 flex-shrink-0 flex-wrap items-center gap-3 sm:w-auto sm:justify-end lg:flex-nowrap lg:min-w-[min(100%,20rem)] xl:min-w-0 xl:max-w-[28rem] 2xl:max-w-xl">
              <label className="relative min-w-0 flex-1 sm:min-w-[12rem] sm:flex-initial lg:flex-1 lg:max-w-md 2xl:max-w-lg">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  className="w-full min-w-0 rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400"
                />
              </label>
              <button className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">Quick Add</button>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}

function mapUser(u: { id: string; name: string; email: string; role: string }): AuthUser {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role === 'admin' ? 'admin' : 'customer',
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await apiPost<{ user: { id: string; name: string; email: string; role: string }; token: string }>(
        '/api/auth/login',
        { email: email.trim(), password },
      )
      const { user, token } = res.data
      setSession(token, mapUser(user))
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return authWrapper(
    <form className="w-full max-w-md space-y-5" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Welcome Back</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Sign in to your account</h2>
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100" role="alert">
          {error}
        </p>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Email Address</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@company.com"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-300"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Password</span>
        <div className="relative">
          <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-300"
          />
        </div>
      </label>
      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 text-slate-300">
          <input type="checkbox" className="rounded border-slate-500 bg-transparent" />
          Remember me
        </label>
        <button type="button" className="text-emerald-300 hover:text-emerald-200">
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Login'}
      </button>
      <p className="text-center text-sm text-slate-300">
        New here?{' '}
        <Link to="/portal/register" className="font-semibold text-emerald-300 hover:text-emerald-200">
          Create account
        </Link>
      </p>
    </form>,
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await apiPost<{ user: { id: string; name: string; email: string; role: string }; token: string }>(
        '/api/auth/register',
        { name: name.trim(), email: email.trim(), password },
      )
      const { user, token } = res.data
      setSession(token, mapUser(user))
      navigate('/customer/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return authWrapper(
    <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Create Account</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Register your profile</h2>
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100" role="alert">
          {error}
        </p>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Full Name</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Smith"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Phone Number</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="+44 7000 000000"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300"
        />
        <span className="mt-1 block text-xs text-slate-500">Optional — not stored on the server yet.</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm text-slate-300">Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repeat password"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
      <p className="text-center text-sm text-slate-300">
        Already have an account?{' '}
        <Link to="/portal/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Login
        </Link>
      </p>
    </form>,
  )
}

export function AdminDashboardPage() {
  return (
    <SidebarLayout title="Admin Dashboard" role="Admin Portal" items={adminSidebar}>
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-sm 2xl:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5 2xl:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/90">Daily Operations</p>
            <h3 className="mt-2 text-2xl font-semibold">Your team is performing above target</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              18 jobs are scheduled for today and the morning crew has already completed 7. Keep momentum by prioritizing the
              pending quote requests before 2:00 PM.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Service Quality Score</p>
            <p className="mt-1 text-3xl font-semibold">9.4/10</p>
            <p className="text-xs text-emerald-200">+0.6 from last week</p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-6">
        <StatCard label="Total Customers" value="1,284" icon={FiUsers} trend="+9.2% this month" />
        <StatCard label="Active Bookings" value="86" icon={FiCalendar} trend="+14.3% this week" />
        <StatCard label="Quote Requests" value="43" icon={FiMessageSquare} trend="+4.1% today" />
        <StatCard label="Completion Rate" value="97%" icon={FiPercent} trend="Top 5% in region" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr] 2xl:gap-6">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Weekly Performance Snapshot</h3>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">+12% growth</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Jobs completed vs. newly requested bookings.</p>
          <div className="mt-5 space-y-4">
            {[
              { day: 'Mon', completed: 86, requested: 68 },
              { day: 'Tue', completed: 92, requested: 72 },
              { day: 'Wed', completed: 79, requested: 75 },
              { day: 'Thu', completed: 98, requested: 80 },
              { day: 'Fri', completed: 88, requested: 74 },
            ].map((item) => (
              <div key={item.day} className="grid grid-cols-[42px_1fr_auto] items-center gap-3">
                <span className="text-sm font-medium text-slate-600">{item.day}</span>
                <div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-slate-900" style={{ width: `${item.completed}%` }} />
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.requested}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-500">{item.completed} / {item.requested}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
              Completed
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Requested
            </span>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <h3 className="text-lg font-semibold text-slate-900">Priority Queue</h3>
          <p className="mt-1 text-sm text-slate-500">Action these items to keep service levels high.</p>
          <div className="mt-4 space-y-3">
            {[
              { title: 'Overdue quote approvals', detail: '6 requests waiting over 24h', tone: 'bg-rose-50 text-rose-700' },
              { title: 'Technician assignment', detail: '4 bookings need crew allocation', tone: 'bg-amber-50 text-amber-700' },
              { title: 'Customer follow-up', detail: '9 completed jobs need review request', tone: 'bg-emerald-50 text-emerald-700' },
            ].map((task) => (
              <div key={task.title} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800">{task.title}</p>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${task.tone}`}>Open</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{task.detail}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            Review Priority Queue
          </button>
        </article>
      </section>
      <section className="grid gap-4 lg:grid-cols-3 2xl:gap-6">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <h3 className="text-lg font-semibold text-slate-900">Customer Management</h3>
          <p className="mt-1 text-sm text-slate-500">View, edit, and remove customers from your CRM.</p>
          <Link to="/admin/customers" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Open Customers
            <FiArrowUpRight size={14} />
          </Link>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <h3 className="text-lg font-semibold text-slate-900">Booking Management</h3>
          <p className="mt-1 text-sm text-slate-500">Track booking pipeline and update service statuses.</p>
          <Link to="/admin/bookings" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Open Bookings
            <FiArrowUpRight size={14} />
          </Link>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <h3 className="text-lg font-semibold text-slate-900">Quote Management</h3>
          <p className="mt-1 text-sm text-slate-500">Review quote requests, update statuses, and clean up old entries.</p>
          <Link to="/admin/quotes" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Open Quotes
            <FiArrowUpRight size={14} />
          </Link>
        </article>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_1fr] 2xl:gap-6">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {[
              'Daniel White approved quote #QT-509',
              'Crew B completed booking #BK-1092',
              'New customer Olivia Park created account',
              'Gallery image "driveway-results.jpg" updated',
            ].map((activity, index) => (
              <div key={activity} className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm text-slate-700">{activity}</p>
                  <p className="text-xs text-slate-500">{index + 1} hour ago</p>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm 2xl:p-6">
          <h3 className="text-lg font-semibold text-slate-900">Today at a Glance</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Site Visits</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">18</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Invoices Sent</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">11</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Crew Available</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">6</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Pending Calls</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">3</p>
            </div>
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
            Open Operations Report
            <FiArrowUpRight size={14} />
          </button>
        </article>
      </section>
    </SidebarLayout>
  )
}

export function AdminCustomersPage() {
  return (
    <SidebarLayout title="Customer Management" role="Admin Portal" items={adminSidebar}>
      <DataTable
        title="Customer Management"
        columns={['Name', 'Email', 'Phone', 'Segment']}
        rows={[
          ['Emma Thompson', 'emma@email.com', '+44 7401 892173', 'Residential'],
          ['Daniel White', 'daniel@email.com', '+44 7432 981244', 'Commercial'],
          ['Sophia Green', 'sophia@email.com', '+44 7511 220461', 'Residential'],
        ]}
        actions={tableActions}
      />
    </SidebarLayout>
  )
}

export function AdminBookingsPage() {
  return (
    <SidebarLayout title="Booking Management" role="Admin Portal" items={adminSidebar}>
      <DataTable
        title="Booking Management"
        columns={['Booking ID', 'Customer', 'Service', 'Status']}
        rows={[
          ['#BK-1094', 'Emma Thompson', 'Patio Deep Clean', 'Pending'],
          ['#BK-1093', 'Daniel White', 'Driveway Jet Wash', 'Confirmed'],
          ['#BK-1092', 'Sophia Green', 'Deck Revive Package', 'Completed'],
        ]}
        actions={[
          { label: 'Pending', icon: FiClock, tone: 'neutral' },
          { label: 'Confirmed', icon: FiCheckCircle, tone: 'neutral' },
          { label: 'Delete', icon: FiTrash2, tone: 'danger' },
        ]}
      />
    </SidebarLayout>
  )
}

export function AdminQuotesPage() {
  return (
    <SidebarLayout title="Quote Management" role="Admin Portal" items={adminSidebar}>
      <DataTable
        title="Free Quote Management"
        columns={['Quote ID', 'Customer', 'Service', 'Status']}
        rows={[
          ['#QT-510', 'Olivia Park', 'Stone Seal + Clean', 'Reviewing'],
          ['#QT-509', 'Lucas Reed', 'Garden Slab Refresh', 'Approved'],
          ['#QT-508', 'Ella Brown', 'Patio Restoration', 'Pending'],
        ]}
        actions={[
          { label: 'Update', icon: FiEdit3, tone: 'neutral' },
          { label: 'Delete', icon: FiTrash2, tone: 'danger' },
        ]}
      />
    </SidebarLayout>
  )
}

export function AdminGalleryPage() {
  return (
    <SidebarLayout title="Gallery Management" role="Admin Portal" items={adminSidebar}>
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Media Library</h3>
          <p className="mt-1 text-sm text-slate-500">Add, edit and remove gallery images. Supports Cloudinary or local storage uploads.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {['before-clean.jpg', 'after-clean.jpg', 'driveway-results.jpg', 'stone-restoration.jpg'].map((imageName) => (
              <div key={imageName} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">{imageName}</p>
                  <FiImage className="text-slate-400" />
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100">Edit</button>
                  <button className="rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Upload New Image</h3>
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <FiImage className="mx-auto text-slate-400" size={28} />
            <p className="mt-3 text-sm text-slate-600">Drag and drop files, or click to browse.</p>
            <p className="mt-1 text-xs text-slate-500">Recommended: JPG/PNG up to 10MB</p>
            <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Select Files</button>
          </div>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Storage Provider</span>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400">
                <option>Cloudinary</option>
                <option>Local Storage</option>
              </select>
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
              <FiArrowUpRight size={15} />
              Upload Image
            </button>
          </div>
        </article>
      </section>
    </SidebarLayout>
  )
}

export function AdminSettingsPage() {
  return (
    <SidebarLayout title="Admin Settings" role="Admin Portal" items={adminSidebar}>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Update Admin Profile</h3>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Full Name</span>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" defaultValue="Admin User" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Email</span>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" defaultValue="admin@patio.co.uk" />
            </label>
            <button className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              <FiSave size={15} />
              Save Profile
            </button>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Security and System</h3>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Current Password</span>
              <input type="password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">New Password</span>
              <input type="password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-600">
              <input type="checkbox" defaultChecked />
              Enable email notifications for new bookings
            </label>
            <button className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
              <FiSave size={15} />
              Update Settings
            </button>
          </div>
        </article>
      </section>
    </SidebarLayout>
  )
}

export function CustomerDashboardPage() {
  return (
    <SidebarLayout title="Customer Dashboard" role="Customer Portal" items={customerSidebar}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming Bookings" value="2" icon={FiCalendar} trend="Next visit: Monday" />
        <StatCard label="Open Quotes" value="1" icon={FiMessageSquare} trend="Awaiting approval" />
        <StatCard label="Completed Jobs" value="12" icon={FiCheckCircle} trend="+2 this quarter" />
        <StatCard label="Loyalty Saving" value="£180" icon={FiPercent} trend="Elite member tier" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Book a Service</h3>
          <p className="mt-1 text-sm text-slate-500">Select your date, service type and address to submit a booking request.</p>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Date</span>
              <input type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Address</span>
              <input type="text" placeholder="Enter service address" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Service Type</span>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                <option>Patio Deep Clean</option>
                <option>Driveway Wash</option>
                <option>Decking Restoration</option>
              </select>
            </label>
            <button className="mt-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Submit Booking Request</button>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Request a Free Quote</h3>
          <p className="mt-1 text-sm text-slate-500">Share job details and message for a fast estimate.</p>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Service Details</span>
              <input type="text" placeholder="What service do you need?" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Message</span>
              <textarea
                rows={4}
                placeholder="Add any measurements, condition details, or preferences."
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </label>
            <button className="mt-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">Submit Quote Request</button>
          </div>
        </article>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">My Bookings</h3>
          <p className="mt-1 text-sm text-slate-500">View your booking history and current statuses.</p>
          <Link to="/customer/bookings" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Open My Bookings
            <FiArrowUpRight size={14} />
          </Link>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">My Quotes</h3>
          <p className="mt-1 text-sm text-slate-500">Track quote requests and their approval progress.</p>
          <Link to="/customer/quotes" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Open My Quotes
            <FiArrowUpRight size={14} />
          </Link>
        </article>
      </section>
    </SidebarLayout>
  )
}

export function CustomerBookingsPage() {
  return (
    <SidebarLayout title="My Bookings" role="Customer Portal" items={customerSidebar}>
      <DataTable
        title="My Bookings"
        columns={['Booking ID', 'Date', 'Service', 'Status']}
        rows={[
          ['#BK-1094', '2026-04-01', 'Patio Deep Clean', 'Pending'],
          ['#BK-1071', '2026-03-16', 'Driveway Wash', 'Completed'],
          ['#BK-1036', '2026-01-18', 'Decking Restoration', 'Completed'],
        ]}
      />
    </SidebarLayout>
  )
}

export function CustomerQuotesPage() {
  return (
    <SidebarLayout title="My Quotes" role="Customer Portal" items={customerSidebar}>
      <DataTable
        title="My Quotes"
        columns={['Quote ID', 'Service', 'Submitted', 'Status']}
        rows={[
          ['#QT-510', 'Stone Seal + Clean', '2026-03-25', 'In Review'],
          ['#QT-470', 'Patio Restoration', '2026-02-04', 'Approved'],
          ['#QT-442', 'Driveway Revive', '2026-01-20', 'Rejected'],
        ]}
      />
    </SidebarLayout>
  )
}

export function CustomerSettingsPage() {
  return (
    <SidebarLayout title="Customer Settings" role="Customer Portal" items={customerSidebar}>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Update Profile</h3>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Full Name</span>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" defaultValue="Customer Name" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Email</span>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" defaultValue="customer@email.com" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Phone</span>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" defaultValue="+44 7333 123456" />
            </label>
            <button className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              <FiSave size={15} />
              Save Changes
            </button>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm text-slate-600">Current Password</span>
              <input type="password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">New Password</span>
              <input type="password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <label>
              <span className="mb-1 block text-sm text-slate-600">Confirm New Password</span>
              <input type="password" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </label>
            <button className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
              <FiLock size={15} />
              Update Password
            </button>
          </div>
        </article>
      </section>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">View Website</h3>
        <p className="mt-1 text-sm text-slate-500">Quickly access your public website pages.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Gallery', href: '/gallery' },
            { label: 'Contact', href: '/contact' },
          ].map((linkItem) => (
            <Link key={linkItem.label} to={linkItem.href} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              {linkItem.label}
              <FiArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </article>
    </SidebarLayout>
  )
}

export function PortalLandingPage() {
  return authWrapper(
    <div className="w-full max-w-lg space-y-5 text-center">
      <div className="mx-auto w-fit rounded-full border border-white/15 bg-white/5 p-3 text-white">
        <FiUser size={24} />
      </div>
      <h2 className="text-3xl font-semibold text-white">Premium Client & Admin Portal</h2>
      <p className="text-sm text-slate-300">
        Access bookings, quotes, gallery management, and account settings through a modern premium experience.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/portal/login" className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 font-semibold text-slate-950">
          Login
        </Link>
        <Link to="/portal/register" className="rounded-xl border border-white/20 px-4 py-3 font-semibold text-slate-100 hover:bg-white/10">
          Register
        </Link>
      </div>
    </div>,
  )
}
