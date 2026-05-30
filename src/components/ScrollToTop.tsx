import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-white shadow-blue-btn transition-all duration-300 hover:scale-110 hover:bg-brand-primaryLight ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <FiArrowUp className="h-5 w-5" />
    </button>
  )
}
