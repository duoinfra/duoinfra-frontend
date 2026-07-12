import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Create.module.css'

const CPU_OPTIONS = [1, 2, 4, 8]
const MEMORY_OPTIONS = [512, 1024, 2048, 4096, 8192]

export default function Create() {
  const navigate = useNavigate()
  const [cpu, setCpu] = useState(1)
  const [memory, setMemory] = useState(512)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpu, memory }),
      })
      if (res.ok) {
        navigate('/overview')
      }
    } catch {
      // demo: just navigate
      navigate('/overview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link to="/overview" className={styles.back}>← 대시보드</Link>
        </div>

        <h1 className={styles.pageTitle}>새 서버 생성</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>이미지</h2>
            <div className={styles.imageOption}>
              <div className={styles.imageCard + ' ' + styles.selected}>
                <span className={styles.imageName}>Ubuntu 22.04 LTS</span>
                <span className={styles.imageTag}>권장</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>CPU</h2>
            <div className={styles.optionGroup}>
              {CPU_OPTIONS.map(v => (
                <button
                  key={v}
                  type="button"
                  className={`${styles.optionBtn} ${cpu === v ? styles.optionSelected : ''}`}
                  onClick={() => setCpu(v)}
                >
                  {v} vCPU
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>메모리</h2>
            <div className={styles.optionGroup}>
              {MEMORY_OPTIONS.map(v => (
                <button
                  key={v}
                  type="button"
                  className={`${styles.optionBtn} ${memory === v ? styles.optionSelected : ''}`}
                  onClick={() => setMemory(v)}
                >
                  {v >= 1024 ? `${v / 1024} GB` : `${v} MB`}
                </button>
              ))}
            </div>
          </section>

          <div className={styles.summary}>
            <span>선택: Ubuntu 22.04 · {cpu} vCPU · {memory >= 1024 ? `${memory / 1024} GB` : `${memory} MB`}</span>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? '생성 중...' : '서버 생성'}
          </button>
        </form>
      </main>
    </div>
  )
}

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>duoinfra</div>
      <ul className={styles.navList}>
        <li><Link to="/overview" className={styles.navItem}>대시보드</Link></li>
        <li><Link to="/create" className={`${styles.navItem} ${styles.active}`}>서버 생성</Link></li>
      </ul>
    </nav>
  )
}
