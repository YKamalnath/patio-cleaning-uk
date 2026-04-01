import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ApiError, apiDelete, apiGet, apiPatch, apiPost } from '../lib/api'
import { clearSession, getStoredUser, getToken, setSession, type AuthUser } from '../lib/authStorage'
import type { IconType } from 'react-icons'
import {
  FiArrowUpRight,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
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
  FiSave,
  FiSearch,
  FiSettings,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
  FiPlus,
} from 'react-icons/fi'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { services as serviceOptions } from '../data/siteData'

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
  rowKeys,
  emptyMessage,
  onRowAction,
  onAddNew,
  addNewLabel,
}: {
  title: string
  columns: string[]
  rows: string[][]
  actions?: TableAction[]
  /** Stable row keys (e.g. database ids). Falls back to row content + index. */
  rowKeys?: string[]
  emptyMessage?: string
  /** When set, action buttons invoke this with the action label and row index. */
  onRowAction?: (actionLabel: string, rowIndex: number) => void
  onAddNew?: () => void
  addNewLabel?: string
}) {
  const colSpan = columns.length + (actions ? 1 : 0)
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {onAddNew ? (
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FiPlus size={16} />
            {addNewLabel ?? 'Add New'}
          </button>
        ) : null}
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="rounded-xl bg-slate-50 px-3 py-10 text-center text-slate-500">
                  {emptyMessage ?? 'No records.'}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowKeys?.[rowIndex] ?? `${row.join('|')}-${rowIndex}`}
                  className="rounded-xl bg-slate-50 text-slate-700"
                >
                  {row.map((value, cellIndex) => (
                    <td key={`${rowKeys?.[rowIndex] ?? rowIndex}-${cellIndex}`} className="px-3 py-3">
                      {value}
                    </td>
                  ))}
                  {actions ? (
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => {
                          const toneClass = action.tone === 'danger' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          return (
                            <button
                              key={action.label}
                              type="button"
                              onClick={() => onRowAction?.(action.label, rowIndex)}
                              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${toneClass}`}
                            >
                              <action.icon size={12} />
                              {action.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
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
  const navigate = useNavigate();

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
              <button
                onClick={() => navigate(0)}
                className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Page Refresh
              </button>
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

type PortalMeUser = {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  notifyNewBookingEmails?: boolean
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
  const [phone, setPhone] = useState('')
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
        { name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined },
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 7000 000000"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300"
        />
        <span className="mt-1 block text-xs text-slate-500">Optional — saved on your account.</span>
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

type CustomerListItem = {
  _id: string
  name: string
  email: string
  createdAt: string
}

type CustomerDetail = {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

function formatRegisteredDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function formatDisplayDate(iso: string | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function formatStatusLabel(status: string) {
  if (!status) return '—'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatShortRef(id: string, prefix: string) {
  if (!id || id.length < 4) return `#${prefix}…`
  return `#${prefix}-${id.slice(-6).toUpperCase()}`
}

function formatGbp(amount: number | undefined) {
  if (amount == null || Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
}

type CustomerBookingRecord = {
  _id: string
  serviceType: string
  area?: string
  preferredDate: string
  timeSlot?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt?: string
}

type CustomerQuoteRecord = {
  _id: string
  contactName: string
  email: string
  phone?: string
  postcode?: string
  serviceSummary: string
  message?: string
  status: 'pending' | 'quoted' | 'declined' | 'accepted'
  quotedAmount?: number
  adminNotes?: string
  createdAt: string
}

type PopulatedCustomerRef = { _id?: string; name?: string; email?: string }

type AdminBookingRecord = {
  _id: string
  customer?: PopulatedCustomerRef | string
  serviceType: string
  area?: string
  preferredDate: string
  timeSlot?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt?: string
}

type AdminQuoteRecord = {
  _id: string
  customer?: PopulatedCustomerRef | string
  contactName: string
  email: string
  phone?: string
  postcode?: string
  serviceSummary: string
  message?: string
  status: 'pending' | 'quoted' | 'declined' | 'accepted'
  quotedAmount?: number
  adminNotes?: string
  createdAt?: string
}

function customerDisplayLabel(customer: PopulatedCustomerRef | string | undefined): string {
  if (!customer) return '—'
  if (typeof customer === 'string') return 'Linked customer'
  const name = customer.name?.trim()
  const email = customer.email?.trim()
  if (name && email) return `${name} · ${email}`
  return name || email || '—'
}

function dateInputFromIso(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isoFromDateInput(value: string): string {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return new Date(value).toISOString()
  return new Date(y, m - 1, d, 12, 0, 0, 0).toISOString()
}

export function AdminCustomersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const limit = 20
  const [customers, setCustomers] = useState<CustomerListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [viewCustomerId, setViewCustomerId] = useState<string | null>(null)
  const [viewCustomer, setViewCustomer] = useState<CustomerDetail | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewError, setViewError] = useState<string | null>(null)

  const [editCustomer, setEditCustomer] = useState<CustomerListItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deleteCustomer, setDeleteCustomer] = useState<CustomerListItem | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadCustomers = useCallback(async () => {
    const token = getToken()
    const user = getStoredUser()
    if (!token || user?.role !== 'admin') {
      setError(null)
      setLoading(false)
      setCustomers([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet<{ customers: CustomerListItem[] }>(
        `/api/admin/customers?page=${page}&limit=${limit}`,
        token,
      )
      setCustomers(res.data.customers ?? [])
      const meta = res.meta
      if (meta?.pages != null) setTotalPages(Math.max(1, meta.pages))
      if (meta?.total != null) setTotal(meta.total)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load customers.'
      setError(msg)
      setCustomers([])
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [page, navigate])

  useEffect(() => {
    void loadCustomers()
  }, [loadCustomers])

  useEffect(() => {
    if (!viewCustomerId) {
      setViewCustomer(null)
      setViewError(null)
      setViewLoading(false)
      return
    }
    const token = getToken()
    if (!token) return
    let cancelled = false
    setViewLoading(true)
    setViewError(null)
    setViewCustomer(null)
    void (async () => {
      try {
        const res = await apiGet<{ customer: CustomerDetail }>(`/api/admin/customers/${viewCustomerId}`, token)
        if (!cancelled) {
          setViewCustomer(res.data.customer)
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : 'Could not load customer.'
          setViewError(msg)
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            navigate('/portal/login', { replace: true })
          }
        }
      } finally {
        if (!cancelled) setViewLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [viewCustomerId, navigate])

  const token = getToken()
  const user = getStoredUser()
  const unauthorized = !token || user?.role !== 'admin'

  const rows: string[][] = customers.map((c) => [c.name, c.email, formatRegisteredDate(c.createdAt)])
  const rowKeys = customers.map((c) => c._id)

  const handleRowAction = useCallback(
    (actionLabel: string, rowIndex: number) => {
      const row = customers[rowIndex]
      if (!row) return
      if (actionLabel === 'View') {
        setViewCustomerId(row._id)
        return
      }
      if (actionLabel === 'Edit') {
        setEditCustomer(row)
        setEditName(row.name)
        setEditEmail(row.email)
        setEditError(null)
        return
      }
      if (actionLabel === 'Delete') {
        setDeleteCustomer(row)
        setDeleteError(null)
      }
    },
    [customers],
  )

  const closeViewModal = () => {
    setViewCustomerId(null)
    setViewCustomer(null)
    setViewError(null)
  }

  const submitEdit = async () => {
    if (!editCustomer) return
    const t = getToken()
    if (!t) return
    const name = editName.trim()
    const email = editEmail.trim()
    if (!name || !email) {
      const msg = 'Name and email are required.'
      setEditError(msg)
      toast.error(msg)
      return
    }
    setEditSaving(true)
    setEditError(null)
    try {
      await apiPatch<{ customer: CustomerListItem }>(
        `/api/admin/customers/${editCustomer._id}`,
        { name, email },
        t,
      )
      setEditCustomer(null)
      toast.success('Customer updated successfully.')
      await loadCustomers()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update customer.'
      setEditError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setEditSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteCustomer) return
    const t = getToken()
    if (!t) return
    setDeleteBusy(true)
    setDeleteError(null)
    try {
      await apiDelete<{ id: string }>(`/api/admin/customers/${deleteCustomer._id}`, t)
      const deletedName = deleteCustomer.name
      setDeleteCustomer(null)
      if (viewCustomerId === deleteCustomer._id) closeViewModal()
      toast.success(`Customer “${deletedName}” was deleted.`)
      await loadCustomers()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not delete customer.'
      setDeleteError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <SidebarLayout title="Customer Management" role="Admin Portal" items={adminSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Admin sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Sign in with an admin account to view registered customers.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : null}

      {!unauthorized && error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}
        </div>
      ) : null}

      {!unauthorized && loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading customers…
        </section>
      ) : null}

      {!unauthorized && !loading ? (
        <>
          <DataTable
            title="Registered customers"
            columns={['Name', 'Email', 'Registered']}
            rows={rows}
            rowKeys={rowKeys}
            emptyMessage="No customers in the database yet. New accounts will appear here after registration."
            actions={tableActions}
            onRowAction={handleRowAction}
          />
          {total > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <span>
                Showing {customers.length} of {total} customer{total === 1 ? '' : 's'}
                {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : null}
              </span>
              {totalPages > 1 ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      {viewCustomerId ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-view-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="customer-view-title" className="text-lg font-semibold text-slate-900">
                Customer details
              </h3>
              <button
                type="button"
                onClick={closeViewModal}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            {viewLoading ? (
              <p className="mt-6 text-sm text-slate-500">Loading…</p>
            ) : viewError ? (
              <p className="mt-4 text-sm text-rose-700" role="alert">
                {viewError}
              </p>
            ) : viewCustomer ? (
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
                  <dd className="mt-1 text-slate-900">{viewCustomer.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                  <dd className="mt-1 break-all text-slate-900">{viewCustomer.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
                  <dd className="mt-1 capitalize text-slate-900">{viewCustomer.role}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registered</dt>
                  <dd className="mt-1 text-slate-900">{formatRegisteredDate(viewCustomer.createdAt)}</dd>
                </div>
              </dl>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeViewModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editCustomer ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-edit-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="customer-edit-title" className="text-lg font-semibold text-slate-900">
                Edit customer
              </h3>
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">Update name or email. Password changes are not handled here.</p>
            <div className="mt-5 grid gap-4">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Name</span>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  autoComplete="name"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Email</span>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  autoComplete="email"
                />
              </label>
            </div>
            {editError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {editError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                disabled={editSaving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitEdit()}
                disabled={editSaving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {editSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteCustomer ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-delete-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="customer-delete-title" className="text-lg font-semibold text-slate-900">
              Delete customer
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Permanently remove <span className="font-semibold text-slate-900">{deleteCustomer.name}</span> ({deleteCustomer.email})?
              This cannot be undone.
            </p>
            {deleteError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCustomer(null)}
                disabled={deleteBusy}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleteBusy}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleteBusy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  )
}

export function AdminBookingsPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [viewBookingId, setViewBookingId] = useState<string | null>(null)
  const [viewBooking, setViewBooking] = useState<AdminBookingRecord | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewError, setViewError] = useState<string | null>(null)

  const [editBooking, setEditBooking] = useState<AdminBookingRecord | null>(null)
  const [editStatus, setEditStatus] = useState<AdminBookingRecord['status']>('pending')
  const [editServiceType, setEditServiceType] = useState('')
  const [editPreferredDate, setEditPreferredDate] = useState('')
  const [editTimeSlot, setEditTimeSlot] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deleteBooking, setDeleteBooking] = useState<AdminBookingRecord | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadBookings = useCallback(async () => {
    const token = getToken()
    const user = getStoredUser()
    if (!token || user?.role !== 'admin') {
      setError(null)
      setLoading(false)
      setBookings([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''
      const res = await apiGet<{ bookings: AdminBookingRecord[] }>(`/api/admin/bookings${q}`, token)
      setBookings(res.data.bookings ?? [])
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load bookings.'
      setError(msg)
      setBookings([])
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter, navigate])

  useEffect(() => {
    void loadBookings()
  }, [loadBookings])

  useEffect(() => {
    if (!viewBookingId) {
      setViewBooking(null)
      setViewError(null)
      setViewLoading(false)
      return
    }
    const token = getToken()
    if (!token) return
    let cancelled = false
    setViewLoading(true)
    setViewError(null)
    setViewBooking(null)
    void (async () => {
      try {
        const res = await apiGet<{ booking: AdminBookingRecord }>(`/api/admin/bookings/${viewBookingId}`, token)
        if (!cancelled) setViewBooking(res.data.booking)
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : 'Could not load booking.'
          setViewError(msg)
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            navigate('/portal/login', { replace: true })
          }
        }
      } finally {
        if (!cancelled) setViewLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [viewBookingId, navigate])

  const token = getToken()
  const user = getStoredUser()
  const unauthorized = !token || user?.role !== 'admin'

  const bookingRows: string[][] = bookings.map((b) => [
    formatShortRef(b._id, 'BK'),
    customerDisplayLabel(
      typeof b.customer === 'object' && b.customer != null ? b.customer : undefined,
    ),
    b.serviceType,
    formatDisplayDate(b.preferredDate),
    formatStatusLabel(b.status),
  ])
  const bookingRowKeys = bookings.map((b) => b._id)

  const openEdit = (b: AdminBookingRecord) => {
    setEditBooking(b)
    setEditStatus(b.status)
    setEditServiceType(b.serviceType)
    setEditPreferredDate(dateInputFromIso(b.preferredDate))
    setEditTimeSlot(b.timeSlot ?? '')
    setEditNotes(b.notes ?? '')
    setEditError(null)
  }

  const submitBookingEdit = async () => {
    if (!editBooking) return
    const t = getToken()
    if (!t) return
    const serviceType = editServiceType.trim()
    if (!serviceType || !editPreferredDate) {
      const msg = 'Service type and preferred date are required.'
      setEditError(msg)
      toast.error(msg)
      return
    }
    setEditSaving(true)
    setEditError(null)
    try {
      await apiPatch<{ booking: AdminBookingRecord }>(
        `/api/admin/bookings/${editBooking._id}`,
        {
          status: editStatus,
          serviceType,
          preferredDate: isoFromDateInput(editPreferredDate),
          notes: editNotes.trim() || undefined,
          timeSlot: editTimeSlot.trim() || undefined,
        },
        t,
      )
      setEditBooking(null)
      toast.success('Booking updated.')
      await loadBookings()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update booking.'
      setEditError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setEditSaving(false)
    }
  }

  const confirmBookingDelete = async () => {
    if (!deleteBooking) return
    const t = getToken()
    if (!t) return
    setDeleteBusy(true)
    setDeleteError(null)
    try {
      await apiDelete<{ id: string }>(`/api/admin/bookings/${deleteBooking._id}`, t)
      const ref = formatShortRef(deleteBooking._id, 'BK')
      setDeleteBooking(null)
      if (viewBookingId === deleteBooking._id) {
        setViewBookingId(null)
        setViewBooking(null)
      }
      toast.success(`Booking ${ref} was deleted.`)
      await loadBookings()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not delete booking.'
      setDeleteError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setDeleteBusy(false)
    }
  }

  const handleBookingRowAction = useCallback(
    (actionLabel: string, rowIndex: number) => {
      const row = bookings[rowIndex]
      if (!row) return
      if (actionLabel === 'View') {
        setViewBookingId(row._id)
        return
      }
      if (actionLabel === 'Edit') {
        openEdit(row)
        return
      }
      if (actionLabel === 'Delete') {
        setDeleteBooking(row)
        setDeleteError(null)
      }
    },
    [bookings],
  )

  return (
    <SidebarLayout title="Booking Management" role="Admin Portal" items={adminSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Admin sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Sign in with an admin account to manage bookings.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : null}

      {!unauthorized && error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}
        </div>
      ) : null}

      {!unauthorized && loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading bookings…
        </section>
      ) : null}

      {!unauthorized && !loading ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-600">
              {bookings.length} booking{bookings.length === 1 ? '' : 's'}
              {statusFilter ? ` · filtered by ${formatStatusLabel(statusFilter)}` : ''}
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="whitespace-nowrap">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <DataTable
            title="All bookings"
            columns={['Reference', 'Customer', 'Service', 'Preferred date', 'Status']}
            rows={bookingRows}
            rowKeys={bookingRowKeys}
            emptyMessage="No bookings yet. Customer bookings will appear here once submitted."
            actions={tableActions}
            onRowAction={handleBookingRowAction}
          />
        </>
      ) : null}

      {viewBookingId ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-view-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="booking-view-title" className="text-lg font-semibold text-slate-900">
                Booking details
              </h3>
              <button
                type="button"
                onClick={() => {
                  setViewBookingId(null)
                  setViewBooking(null)
                  setViewError(null)
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            {viewLoading ? (
              <p className="mt-6 text-sm text-slate-500">Loading…</p>
            ) : viewError ? (
              <p className="mt-4 text-sm text-rose-700" role="alert">
                {viewError}
              </p>
            ) : viewBooking ? (
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference</dt>
                  <dd className="mt-1 font-mono text-slate-900">{formatShortRef(viewBooking._id, 'BK')}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</dt>
                  <dd className="mt-1 text-slate-900">
                    {customerDisplayLabel(
                      typeof viewBooking.customer === 'object' && viewBooking.customer != null
                        ? viewBooking.customer
                        : undefined,
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service</dt>
                  <dd className="mt-1 text-slate-900">{viewBooking.serviceType}</dd>
                </div>
                {viewBooking.area ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Area</dt>
                    <dd className="mt-1 text-slate-900">{viewBooking.area}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferred date</dt>
                  <dd className="mt-1 text-slate-900">{formatDisplayDate(viewBooking.preferredDate)}</dd>
                </div>
                {viewBooking.timeSlot ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time slot</dt>
                    <dd className="mt-1 text-slate-900">{viewBooking.timeSlot}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
                  <dd className="mt-1 text-slate-900">{formatStatusLabel(viewBooking.status)}</dd>
                </div>
                {viewBooking.notes ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">{viewBooking.notes}</dd>
                  </div>
                ) : null}
                {viewBooking.createdAt ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</dt>
                    <dd className="mt-1 text-slate-900">{formatRegisteredDate(viewBooking.createdAt)}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewBookingId(null)
                  setViewBooking(null)
                  setViewError(null)
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editBooking ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-edit-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="booking-edit-title" className="text-lg font-semibold text-slate-900">
                Edit booking
              </h3>
              <button
                type="button"
                onClick={() => setEditBooking(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="mt-1 font-mono text-xs text-slate-500">{formatShortRef(editBooking._id, 'BK')}</p>
            <div className="mt-5 grid gap-4">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Status</span>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AdminBookingRecord['status'])}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Service type</span>
                <input
                  list="admin-booking-service-suggestions"
                  value={editServiceType}
                  onChange={(e) => setEditServiceType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
                <datalist id="admin-booking-service-suggestions">
                  {serviceOptions.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Preferred date</span>
                <input
                  type="date"
                  value={editPreferredDate}
                  onChange={(e) => setEditPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Time slot (optional)</span>
                <input
                  value={editTimeSlot}
                  onChange={(e) => setEditTimeSlot(e.target.value)}
                  placeholder="e.g. Morning"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Notes (optional)</span>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>
            {editError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {editError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditBooking(null)}
                disabled={editSaving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitBookingEdit()}
                disabled={editSaving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {editSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteBooking ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-delete-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="booking-delete-title" className="text-lg font-semibold text-slate-900">
              Delete booking
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Permanently remove booking <span className="font-mono font-semibold">{formatShortRef(deleteBooking._id, 'BK')}</span> for{' '}
              <span className="font-semibold">{deleteBooking.serviceType}</span>? This cannot be undone.
            </p>
            {deleteError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteBooking(null)}
                disabled={deleteBusy}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmBookingDelete()}
                disabled={deleteBusy}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleteBusy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  )
}

export function AdminQuotesPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [quotes, setQuotes] = useState<AdminQuoteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [viewQuoteId, setViewQuoteId] = useState<string | null>(null)
  const [viewQuote, setViewQuote] = useState<AdminQuoteRecord | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewError, setViewError] = useState<string | null>(null)

  const [editQuote, setEditQuote] = useState<AdminQuoteRecord | null>(null)
  const [editStatus, setEditStatus] = useState<AdminQuoteRecord['status']>('pending')
  const [editQuotedAmount, setEditQuotedAmount] = useState('')
  const [editAdminNotes, setEditAdminNotes] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deleteQuote, setDeleteQuote] = useState<AdminQuoteRecord | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadQuotes = useCallback(async () => {
    const token = getToken()
    const user = getStoredUser()
    if (!token || user?.role !== 'admin') {
      setError(null)
      setLoading(false)
      setQuotes([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''
      const res = await apiGet<{ quotes: AdminQuoteRecord[] }>(`/api/admin/quotes${q}`, token)
      setQuotes(res.data.quotes ?? [])
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load quotes.'
      setError(msg)
      setQuotes([])
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter, navigate])

  useEffect(() => {
    void loadQuotes()
  }, [loadQuotes])

  useEffect(() => {
    if (!viewQuoteId) {
      setViewQuote(null)
      setViewError(null)
      setViewLoading(false)
      return
    }
    const token = getToken()
    if (!token) return
    let cancelled = false
    setViewLoading(true)
    setViewError(null)
    setViewQuote(null)
    void (async () => {
      try {
        const res = await apiGet<{ quote: AdminQuoteRecord }>(`/api/admin/quotes/${viewQuoteId}`, token)
        if (!cancelled) setViewQuote(res.data.quote)
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : 'Could not load quote.'
          setViewError(msg)
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            navigate('/portal/login', { replace: true })
          }
        }
      } finally {
        if (!cancelled) setViewLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [viewQuoteId, navigate])

  const token = getToken()
  const user = getStoredUser()
  const unauthorized = !token || user?.role !== 'admin'

  const quoteRows: string[][] = quotes.map((q) => [
    formatShortRef(q._id, 'QT'),
    q.contactName,
    q.serviceSummary.length > 48 ? `${q.serviceSummary.slice(0, 48)}…` : q.serviceSummary,
    formatGbp(q.quotedAmount),
    formatStatusLabel(q.status),
  ])
  const quoteRowKeys = quotes.map((q) => q._id)

  const openQuoteEdit = (q: AdminQuoteRecord) => {
    setEditQuote(q)
    setEditStatus(q.status)
    setEditQuotedAmount(q.quotedAmount != null ? String(q.quotedAmount) : '')
    setEditAdminNotes(q.adminNotes ?? '')
    setEditError(null)
  }

  const submitQuoteEdit = async () => {
    if (!editQuote) return
    const t = getToken()
    if (!t) return
    const amountStr = editQuotedAmount.trim()
    let quotedAmount: number | undefined
    if (amountStr !== '') {
      const n = Number(amountStr)
      if (Number.isNaN(n) || n < 0) {
        const msg = 'Quoted amount must be a valid non-negative number.'
        setEditError(msg)
        toast.error(msg)
        return
      }
      quotedAmount = n
    }
    setEditSaving(true)
    setEditError(null)
    try {
      const body: Record<string, unknown> = {
        status: editStatus,
        adminNotes: editAdminNotes.trim() || undefined,
      }
      if (quotedAmount !== undefined) body.quotedAmount = quotedAmount
      await apiPatch<{ quote: AdminQuoteRecord }>(`/api/admin/quotes/${editQuote._id}`, body, t)
      setEditQuote(null)
      toast.success('Quote updated.')
      await loadQuotes()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update quote.'
      setEditError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setEditSaving(false)
    }
  }

  const confirmQuoteDelete = async () => {
    if (!deleteQuote) return
    const t = getToken()
    if (!t) return
    setDeleteBusy(true)
    setDeleteError(null)
    try {
      await apiDelete<{ id: string }>(`/api/admin/quotes/${deleteQuote._id}`, t)
      const ref = formatShortRef(deleteQuote._id, 'QT')
      setDeleteQuote(null)
      if (viewQuoteId === deleteQuote._id) {
        setViewQuoteId(null)
        setViewQuote(null)
      }
      toast.success(`Quote ${ref} was deleted.`)
      await loadQuotes()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not delete quote.'
      setDeleteError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setDeleteBusy(false)
    }
  }

  const handleQuoteRowAction = useCallback(
    (actionLabel: string, rowIndex: number) => {
      const row = quotes[rowIndex]
      if (!row) return
      if (actionLabel === 'View') {
        setViewQuoteId(row._id)
        return
      }
      if (actionLabel === 'Edit') {
        openQuoteEdit(row)
        return
      }
      if (actionLabel === 'Delete') {
        setDeleteQuote(row)
        setDeleteError(null)
      }
    },
    [quotes],
  )

  return (
    <SidebarLayout title="Quote Management" role="Admin Portal" items={adminSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Admin sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Sign in with an admin account to manage quote requests.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : null}

      {!unauthorized && error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}
        </div>
      ) : null}

      {!unauthorized && loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading quotes…
        </section>
      ) : null}

      {!unauthorized && !loading ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-600">
              {quotes.length} quote request{quotes.length === 1 ? '' : 's'}
              {statusFilter ? ` · filtered by ${formatStatusLabel(statusFilter)}` : ''}
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="whitespace-nowrap">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </label>
          </div>
          <DataTable
            title="Quote requests"
            columns={['Reference', 'Contact', 'Service summary', 'Quoted', 'Status']}
            rows={quoteRows}
            rowKeys={quoteRowKeys}
            emptyMessage="No quote requests yet. Submissions from customers will appear here."
            actions={tableActions}
            onRowAction={handleQuoteRowAction}
          />
        </>
      ) : null}

      {viewQuoteId ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-view-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="quote-view-title" className="text-lg font-semibold text-slate-900">
                Quote request
              </h3>
              <button
                type="button"
                onClick={() => {
                  setViewQuoteId(null)
                  setViewQuote(null)
                  setViewError(null)
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            {viewLoading ? (
              <p className="mt-6 text-sm text-slate-500">Loading…</p>
            ) : viewError ? (
              <p className="mt-4 text-sm text-rose-700" role="alert">
                {viewError}
              </p>
            ) : viewQuote ? (
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference</dt>
                  <dd className="mt-1 font-mono text-slate-900">{formatShortRef(viewQuote._id, 'QT')}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account</dt>
                  <dd className="mt-1 text-slate-900">
                    {customerDisplayLabel(
                      typeof viewQuote.customer === 'object' && viewQuote.customer != null ? viewQuote.customer : undefined,
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</dt>
                  <dd className="mt-1 text-slate-900">{viewQuote.contactName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                  <dd className="mt-1 break-all text-slate-900">{viewQuote.email}</dd>
                </div>
                {viewQuote.phone ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</dt>
                    <dd className="mt-1 text-slate-900">{viewQuote.phone}</dd>
                  </div>
                ) : null}
                {viewQuote.postcode ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Postcode</dt>
                    <dd className="mt-1 text-slate-900">{viewQuote.postcode}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service summary</dt>
                  <dd className="mt-1 text-slate-900">{viewQuote.serviceSummary}</dd>
                </div>
                {viewQuote.message ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">{viewQuote.message}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
                  <dd className="mt-1 text-slate-900">{formatStatusLabel(viewQuote.status)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quoted amount</dt>
                  <dd className="mt-1 text-slate-900">{formatGbp(viewQuote.quotedAmount)}</dd>
                </div>
                {viewQuote.adminNotes ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin notes</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">{viewQuote.adminNotes}</dd>
                  </div>
                ) : null}
                {viewQuote.createdAt ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted</dt>
                    <dd className="mt-1 text-slate-900">{formatRegisteredDate(viewQuote.createdAt)}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewQuoteId(null)
                  setViewQuote(null)
                  setViewError(null)
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editQuote ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-edit-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="quote-edit-title" className="text-lg font-semibold text-slate-900">
                Update quote
              </h3>
              <button
                type="button"
                onClick={() => setEditQuote(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {editQuote.contactName} · {editQuote.serviceSummary.slice(0, 60)}
              {editQuote.serviceSummary.length > 60 ? '…' : ''}
            </p>
            <div className="mt-5 grid gap-4">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Status</span>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AdminQuoteRecord['status'])}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                  <option value="pending">Pending</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Quoted amount (GBP)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={editQuotedAmount}
                  onChange={(e) => setEditQuotedAmount(e.target.value)}
                  placeholder="Leave blank to keep the current amount"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Admin notes</span>
                <textarea
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes (not shown to customer in this app)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>
            {editError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {editError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditQuote(null)}
                disabled={editSaving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitQuoteEdit()}
                disabled={editSaving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {editSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteQuote ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-delete-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="quote-delete-title" className="text-lg font-semibold text-slate-900">
              Delete quote request
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Permanently remove quote <span className="font-mono font-semibold">{formatShortRef(deleteQuote._id, 'QT')}</span> from{' '}
              <span className="font-semibold">{deleteQuote.contactName}</span>? This cannot be undone.
            </p>
            {deleteError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteQuote(null)}
                disabled={deleteBusy}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmQuoteDelete()}
                disabled={deleteBusy}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleteBusy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
  const navigate = useNavigate()
  const token = getToken()
  const stored = getStoredUser()
  const unauthorized = !token || stored?.role !== 'admin'

  const [meLoading, setMeLoading] = useState(true)
  const [meError, setMeError] = useState<string | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileFormError, setProfileFormError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notifyNewBookings, setNotifyNewBookings] = useState(true)
  const [securityBusy, setSecurityBusy] = useState(false)
  const [securityFormError, setSecurityFormError] = useState<string | null>(null)

  const loadMe = useCallback(async () => {
    const t = getToken()
    const u = getStoredUser()
    if (!t || u?.role !== 'admin') {
      setMeLoading(false)
      setMeError(null)
      return
    }
    setMeLoading(true)
    setMeError(null)
    try {
      const res = await apiGet<{ user: PortalMeUser }>('/api/auth/me', t)
      const user = res.data.user
      setProfileName(user.name ?? '')
      setProfileEmail(user.email ?? '')
      setNotifyNewBookings(user.notifyNewBookingEmails !== false)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load your profile.'
      setMeError(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setMeLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    void loadMe()
  }, [loadMe])

  const saveProfile = async () => {
    const t = getToken()
    if (!t) return
    const name = profileName.trim()
    const email = profileEmail.trim()
    if (!name || !email) {
      const msg = 'Name and email are required.'
      setProfileFormError(msg)
      toast.error(msg)
      return
    }
    setProfileBusy(true)
    setProfileFormError(null)
    try {
      const res = await apiPatch<{ user: PortalMeUser }>('/api/auth/profile', { name, email }, t)
      const user = res.data.user
      setSession(t, mapUser(user))
      toast.success(res.message || 'Profile saved.')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not save profile.'
      setProfileFormError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setProfileBusy(false)
    }
  }

  const saveSecurityAndPrefs = async () => {
    const t = getToken()
    if (!t) return
    setSecurityFormError(null)

    const pwdTouched = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0
    if (pwdTouched) {
      if (!currentPassword || !newPassword) {
        const msg = 'Enter your current password and a new password, or leave all password fields empty.'
        setSecurityFormError(msg)
        toast.error(msg)
        return
      }
      if (newPassword !== confirmPassword) {
        const msg = 'New password and confirmation do not match.'
        setSecurityFormError(msg)
        toast.error(msg)
        return
      }
      if (newPassword.length < 8) {
        const msg = 'New password must be at least 8 characters.'
        setSecurityFormError(msg)
        toast.error(msg)
        return
      }
    }

    setSecurityBusy(true)
    try {
      const prefRes = await apiPatch<{ user: PortalMeUser }>(
        '/api/auth/preferences',
        { notifyNewBookingEmails: notifyNewBookings },
        t,
      )
      const user = prefRes.data.user
      setNotifyNewBookings(user.notifyNewBookingEmails !== false)
      toast.success(prefRes.message || 'Preferences saved.')

      if (pwdTouched) {
        const pwdRes = await apiPost('/api/auth/change-password', { currentPassword, newPassword }, t)
        toast.success(pwdRes.message || 'Password updated.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update security settings.'
      setSecurityFormError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setSecurityBusy(false)
    }
  }

  return (
    <SidebarLayout title="Admin Settings" role="Admin Portal" items={adminSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Log in with an admin account to manage settings.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : meLoading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading settings…</p>
      ) : meError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <p className="font-medium">{meError}</p>
          <button
            type="button"
            onClick={() => void loadMe()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try again
          </button>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Update Admin Profile</h3>
            <p className="mt-1 text-sm text-slate-500">These details are stored in your account.</p>
            <div className="mt-4 grid gap-3">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Full Name</span>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Email</span>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              {profileFormError ? (
                <p className="text-sm text-rose-700" role="alert">
                  {profileFormError}
                </p>
              ) : null}
              <button
                type="button"
                disabled={profileBusy}
                onClick={() => void saveProfile()}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <FiSave size={15} />
                {profileBusy ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Security and notifications</h3>
            <p className="mt-1 text-sm text-slate-500">Change your password and control booking alert preferences.</p>
            <div className="mt-4 grid gap-3">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Confirm New Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={notifyNewBookings}
                  onChange={(e) => setNotifyNewBookings(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Email notifications for new bookings
              </label>
              {securityFormError ? (
                <p className="text-sm text-rose-700" role="alert">
                  {securityFormError}
                </p>
              ) : null}
              <button
                type="button"
                disabled={securityBusy}
                onClick={() => void saveSecurityAndPrefs()}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                <FiSave size={15} />
                {securityBusy ? 'Saving…' : 'Update Settings'}
              </button>
            </div>
          </article>
        </section>
      )}
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
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<CustomerBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newServiceType, setNewServiceType] = useState(serviceOptions[0] ?? '')
  const [newPreferredDate, setNewPreferredDate] = useState('')
  const [newArea, setNewArea] = useState('')
  const [newTimeSlot, setNewTimeSlot] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [submitBusy, setSubmitBusy] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const token = getToken()
  const user = getStoredUser()
  const unauthorized = !token || user?.role !== 'customer'

  const loadBookings = useCallback(async () => {
    const t = getToken()
    const u = getStoredUser()
    if (!t || u?.role !== 'customer') {
      setBookings([])
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet<{ bookings: CustomerBookingRecord[] }>('/api/customer/bookings', t)
      setBookings(res.data.bookings ?? [])
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load bookings.'
      setError(msg)
      setBookings([])
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    void loadBookings()
  }, [loadBookings])

  const openNewModal = () => {
    setNewServiceType(serviceOptions[0] ?? '')
    setNewPreferredDate('')
    setNewArea('')
    setNewTimeSlot('')
    setNewNotes('')
    setSubmitError(null)
    setShowNewModal(true)
  }

  const submitNewBooking = async () => {
    const t = getToken()
    if (!t) return
    const serviceType = newServiceType.trim()
    if (!serviceType || !newPreferredDate) {
      const msg = 'Service type and preferred date are required.'
      setSubmitError(msg)
      toast.error(msg)
      return
    }
    const preferredDate = new Date(newPreferredDate).toISOString()
    setSubmitBusy(true)
    setSubmitError(null)
    try {
      await apiPost<{ booking: CustomerBookingRecord }>(
        '/api/customer/bookings',
        {
          serviceType,
          preferredDate,
          area: newArea.trim() || undefined,
          timeSlot: newTimeSlot.trim() || undefined,
          notes: newNotes.trim() || undefined,
        },
        t,
      )
      setShowNewModal(false)
      toast.success('Booking request submitted.')
      await loadBookings()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not create booking.'
      setSubmitError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setSubmitBusy(false)
    }
  }

  const rows: string[][] = bookings.map((b) => [
    formatShortRef(b._id, 'BK'),
    formatDisplayDate(b.preferredDate),
    b.serviceType,
    b.area?.trim() ? b.area : '—',
    b.timeSlot?.trim() ? b.timeSlot : '—',
    formatStatusLabel(b.status),
  ])
  const rowKeys = bookings.map((b) => b._id)

  return (
    <SidebarLayout title="My Bookings" role="Customer Portal" items={customerSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Log in with your customer account to view and manage bookings.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : loading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading bookings…</p>
      ) : error ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <p className="font-medium">{error}</p>
          <button
            type="button"
            onClick={() => void loadBookings()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try again
          </button>
        </section>
      ) : (
        <DataTable
          title="My Bookings"
          columns={['Reference', 'Preferred date', 'Service', 'Area', 'Time', 'Status']}
          rows={rows}
          rowKeys={rowKeys}
          emptyMessage="You have no bookings yet. Add a new booking request to get started."
          onAddNew={openNewModal}
          addNewLabel="New booking"
        />
      )}

      {showNewModal ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-booking-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="new-booking-title" className="text-lg font-semibold text-slate-900">
              New booking request
            </h3>
            <p className="mt-1 text-sm text-slate-600">We will confirm your slot by email or phone.</p>
            <div className="mt-4 grid gap-3">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Service type</span>
                <select
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-400"
                >
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Preferred date</span>
                <input
                  type="date"
                  value={newPreferredDate}
                  onChange={(e) => setNewPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Area / address (optional)</span>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="e.g. Postcode or area"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Preferred time (optional)</span>
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="e.g. Morning, after 2pm"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Notes (optional)</span>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  placeholder="Access, parking, surface type…"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>
            {submitError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {submitError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                disabled={submitBusy}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitNewBooking()}
                disabled={submitBusy}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {submitBusy ? 'Submitting…' : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  )
}

export function CustomerQuotesPage() {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState<CustomerQuoteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showNewModal, setShowNewModal] = useState(false)
  const stored = getStoredUser()
  const [qName, setQName] = useState(stored?.name ?? '')
  const [qEmail, setQEmail] = useState(stored?.email ?? '')
  const [qPhone, setQPhone] = useState('')
  const [qPostcode, setQPostcode] = useState('')
  const [qSummary, setQSummary] = useState('')
  const [qMessage, setQMessage] = useState('')
  const [submitBusy, setSubmitBusy] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const token = getToken()
  const user = getStoredUser()
  const unauthorized = !token || user?.role !== 'customer'

  const loadQuotes = useCallback(async () => {
    const t = getToken()
    const u = getStoredUser()
    if (!t || u?.role !== 'customer') {
      setQuotes([])
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''
      const res = await apiGet<{ quotes: CustomerQuoteRecord[] }>(`/api/customer/quotes${qs}`, t)
      setQuotes(res.data.quotes ?? [])
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load quotes.'
      setError(msg)
      setQuotes([])
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [navigate, statusFilter])

  useEffect(() => {
    void loadQuotes()
  }, [loadQuotes])

  const openNewModal = () => {
    const u = getStoredUser()
    setQName(u?.name ?? '')
    setQEmail(u?.email ?? '')
    setQPhone('')
    setQPostcode('')
    setQSummary('')
    setQMessage('')
    setSubmitError(null)
    setShowNewModal(true)
  }

  const submitNewQuote = async () => {
    const t = getToken()
    if (!t) return
    const contactName = qName.trim()
    const email = qEmail.trim()
    const serviceSummary = qSummary.trim()
    if (!contactName || !email || !serviceSummary) {
      const msg = 'Name, email, and a short service summary are required.'
      setSubmitError(msg)
      toast.error(msg)
      return
    }
    setSubmitBusy(true)
    setSubmitError(null)
    try {
      await apiPost<{ quote: CustomerQuoteRecord }>(
        '/api/customer/quotes',
        {
          contactName,
          email,
          phone: qPhone.trim() || undefined,
          postcode: qPostcode.trim() || undefined,
          serviceSummary,
          message: qMessage.trim() || undefined,
        },
        t,
      )
      setShowNewModal(false)
      toast.success('Quote request submitted.')
      await loadQuotes()
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not submit quote.'
      setSubmitError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setSubmitBusy(false)
    }
  }

  const rows: string[][] = quotes.map((q) => [
    formatShortRef(q._id, 'QT'),
    q.serviceSummary.length > 48 ? `${q.serviceSummary.slice(0, 48)}…` : q.serviceSummary,
    formatDisplayDate(q.createdAt),
    formatStatusLabel(q.status),
    q.status === 'quoted' ? formatGbp(q.quotedAmount) : '—',
  ])
  const rowKeys = quotes.map((q) => q._id)

  return (
    <SidebarLayout title="My Quotes" role="Customer Portal" items={customerSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Log in with your customer account to view quote requests.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Track quote requests and amounts we have sent you.</p>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <span className="whitespace-nowrap font-medium text-slate-600">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </label>
          </div>
          {loading ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading quotes…</p>
          ) : error ? (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
              <p className="font-medium">{error}</p>
              <button
                type="button"
                onClick={() => void loadQuotes()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Try again
              </button>
            </section>
          ) : (
            <DataTable
              title="My quotes"
              columns={['Reference', 'Service summary', 'Submitted', 'Status', 'Quoted amount']}
              rows={rows}
              rowKeys={rowKeys}
              emptyMessage="You have no quote requests yet. Submit a new request for a tailored estimate."
              onAddNew={openNewModal}
              addNewLabel="New quote"
            />
          )}
        </>
      )}

      {showNewModal ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-quote-title"
        >
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="new-quote-title" className="text-lg font-semibold text-slate-900">
              Request a quote
            </h3>
            <p className="mt-1 text-sm text-slate-600">Describe the job and we will respond with pricing.</p>
            <div className="mt-4 grid gap-3">
              <label>
                <span className="mb-1 block text-sm text-slate-600">Your name</span>
                <input
                  type="text"
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Email</span>
                <input
                  type="email"
                  value={qEmail}
                  onChange={(e) => setQEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Phone (optional)</span>
                <input
                  type="text"
                  value={qPhone}
                  onChange={(e) => setQPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Postcode (optional)</span>
                <input
                  type="text"
                  value={qPostcode}
                  onChange={(e) => setQPostcode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Service summary</span>
                <input
                  type="text"
                  value={qSummary}
                  onChange={(e) => setQSummary(e.target.value)}
                  placeholder="e.g. Patio clean, approx 25 sqm"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label>
                <span className="mb-1 block text-sm text-slate-600">Message (optional)</span>
                <textarea
                  value={qMessage}
                  onChange={(e) => setQMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>
            {submitError ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {submitError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                disabled={submitBusy}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitNewQuote()}
                disabled={submitBusy}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitBusy ? 'Submitting…' : 'Submit quote request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SidebarLayout>
  )
}

export function CustomerSettingsPage() {
  const navigate = useNavigate()
  const token = getToken()
  const stored = getStoredUser()
  const unauthorized = !token || stored?.role !== 'customer'

  const [meLoading, setMeLoading] = useState(true)
  const [meError, setMeError] = useState<string | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileFormError, setProfileFormError] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [passwordFormError, setPasswordFormError] = useState<string | null>(null)

  const loadMe = useCallback(async () => {
    const t = getToken()
    const u = getStoredUser()
    if (!t || u?.role !== 'customer') {
      setMeLoading(false)
      setMeError(null)
      return
    }
    setMeLoading(true)
    setMeError(null)
    try {
      const res = await apiGet<{ user: PortalMeUser }>('/api/auth/me', t)
      const user = res.data.user
      setProfileName(user.name ?? '')
      setProfileEmail(user.email ?? '')
      setProfilePhone(user.phone ?? '')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not load your profile.'
      setMeError(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setMeLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    void loadMe()
  }, [loadMe])

  const saveProfile = async () => {
    const t = getToken()
    if (!t) return
    const name = profileName.trim()
    const email = profileEmail.trim()
    const phone = profilePhone.trim()
    if (!name || !email) {
      const msg = 'Name and email are required.'
      setProfileFormError(msg)
      toast.error(msg)
      return
    }
    setProfileBusy(true)
    setProfileFormError(null)
    try {
      const res = await apiPatch<{ user: PortalMeUser }>('/api/auth/profile', { name, email, phone }, t)
      const user = res.data.user
      setProfilePhone(user.phone ?? '')
      setSession(t, mapUser(user))
      toast.success(res.message || 'Profile saved.')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not save profile.'
      setProfileFormError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setProfileBusy(false)
    }
  }

  const savePassword = async () => {
    const t = getToken()
    if (!t) return
    if (!currentPassword || !newPassword) {
      const msg = 'Enter your current password and a new password.'
      setPasswordFormError(msg)
      toast.error(msg)
      return
    }
    if (newPassword !== confirmPassword) {
      const msg = 'New password and confirmation do not match.'
      setPasswordFormError(msg)
      toast.error(msg)
      return
    }
    if (newPassword.length < 8) {
      const msg = 'New password must be at least 8 characters.'
      setPasswordFormError(msg)
      toast.error(msg)
      return
    }
    setPasswordBusy(true)
    setPasswordFormError(null)
    try {
      const res = await apiPost('/api/auth/change-password', { currentPassword, newPassword }, t)
      toast.success(res.message || 'Password updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not update password.'
      setPasswordFormError(msg)
      toast.error(msg)
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        navigate('/portal/login', { replace: true })
      }
    } finally {
      setPasswordBusy(false)
    }
  }

  return (
    <SidebarLayout title="Customer Settings" role="Customer Portal" items={customerSidebar}>
      {unauthorized ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="font-medium">Sign-in required</p>
          <p className="mt-1 text-sm text-amber-800">Log in with your customer account to manage settings.</p>
          <Link
            to="/portal/login"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to login
          </Link>
        </section>
      ) : meLoading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">Loading settings…</p>
      ) : meError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <p className="font-medium">{meError}</p>
          <button
            type="button"
            onClick={() => void loadMe()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try again
          </button>
        </section>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Update Profile</h3>
              <p className="mt-1 text-sm text-slate-500">Name, email and phone are stored on your account.</p>
              <div className="mt-4 grid gap-3">
                <label>
                  <span className="mb-1 block text-sm text-slate-600">Full Name</span>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-sm text-slate-600">Email</span>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-sm text-slate-600">Phone</span>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                {profileFormError ? (
                  <p className="text-sm text-rose-700" role="alert">
                    {profileFormError}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={profileBusy}
                  onClick={() => void saveProfile()}
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <FiSave size={15} />
                  {profileBusy ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
              <p className="mt-1 text-sm text-slate-500">Use at least 8 characters for your new password.</p>
              <div className="mt-4 grid gap-3">
                <label>
                  <span className="mb-1 block text-sm text-slate-600">Current Password</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-sm text-slate-600">New Password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-sm text-slate-600">Confirm New Password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                {passwordFormError ? (
                  <p className="text-sm text-rose-700" role="alert">
                    {passwordFormError}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={passwordBusy}
                  onClick={() => void savePassword()}
                  className="mt-1 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  <FiLock size={15} />
                  {passwordBusy ? 'Updating…' : 'Update Password'}
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
        </>
      )}
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
