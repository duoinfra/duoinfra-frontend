import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import styles from './Detail.module.css'
import { getServer, getMetrics, deleteServer } from '../api'

function Sparkline({ data, color, height = 60 }) {
  const w = 300, h = height
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / 100) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={styles.sparkline} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        fillOpacity="0.1"
        stroke="none"
      />
    </svg>
  )
}

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [server, setServer] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [cpuHistory, setCpuHistory] = useState(Array(20).fill(0))
  const [memHistory, setMemHistory] = useState(Array(20).fill(0))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    getServer(id)
      .then(setServer)
      .catch(() => setError('서버를 찾을 수 없습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!server || server.status !== 'RUNNING') return

    const fetchMetrics = () => {
      getMetrics(id).then(m => {
        setMetrics(m)
        setCpuHistory(prev => [...prev.slice(1), m.cpu])
        setMemHistory(prev => [...prev.slice(1), m.memory])
      }).catch(() => {})
    }

    fetchMetrics()
    intervalRef.current = setInterval(fetchMetrics, 5000)
    return () => clearInterval(intervalRef.current)
  }, [server, id])

  const handleDelete = async () => {
    if (!confirm('서버를 삭제하시겠습니까?')) return
    try {
      await deleteServer(id)
      navigate('/overview')
    } catch (err) {
      alert(err.message || '삭제에 실패했습니다.')
    }
  }

  if (loading) return <div style={{ padding: 40 }}>불러오는 중...</div>
  if (error) return <div className={styles.error}>{error}</div>

  const isRunning = server.status === 'RUNNING'

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link to="/overview" className={styles.back}>← 대시보드</Link>
        </div>

        <header className={styles.header}>
          <div>
            <h1 className={styles.name}>{server.containerId.slice(0, 12)}</h1>
            <span className={styles.badge} style={{ background: isRunning ? '#16a34a' : '#6b7280' }}>
              {isRunning ? '실행 중' : '중지됨'}
            </span>
          </div>
          <button
            onClick={handleDelete}
            style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', borderRadius: 4, fontSize: 13 }}
          >
            서버 삭제
          </button>
        </header>

        {isRunning && metrics && (
          <section className={styles.metricsSection}>
            <div className={styles.metricsHeader}>
              <h2 className={styles.cardTitle}>실시간 메트릭</h2>
              <span className={styles.liveTag}>● LIVE</span>
            </div>
            <div className={styles.metricsGrid}>
              <MetricCard
                label="CPU 사용률"
                value={`${metrics.cpu.toFixed(1)}%`}
                color="#4f6ef7"
                warn={metrics.cpu > 80}
                sparkData={cpuHistory}
              />
              <MetricCard
                label="메모리 사용률"
                value={`${metrics.memory.toFixed(1)}%`}
                color="#f59e0b"
                warn={metrics.memory > 85}
                sparkData={memHistory}
              />
              <MetricCard
                label="네트워크 인바운드"
                value={`${metrics.networkIn.toFixed(2)} MB`}
                color="#10b981"
                noGraph
              />
              <MetricCard
                label="네트워크 아웃바운드"
                value={`${metrics.networkOut.toFixed(2)} MB`}
                color="#8b5cf6"
                noGraph
              />
            </div>
          </section>
        )}

        <div className={styles.grid}>
          <InfoCard title="기본 정보">
            <Row label="컨테이너 ID" value={server.containerId} mono />
            <Row label="생성일" value={new Date(server.createdAt).toLocaleString('ko-KR')} />
            <Row label="상태" value={isRunning ? '실행 중' : '중지됨'} />
          </InfoCard>

          <InfoCard title="사양">
            <Row label="CPU" value={`${server.cpu} vCPU`} />
            <Row label="메모리" value={`${server.memory} MB`} />
          </InfoCard>

          <InfoCard title="SSH 접속 정보">
            <Row label="호스트" value={server.host} mono />
            <Row label="포트" value={String(server.sshPort)} mono />
            <Row label="사용자" value={server.sshUsername} mono />
            <Row label="비밀번호" value={server.sshPassword} mono />
            <div className={styles.sshCmd}>
              <span className={styles.sshLabel}>접속 명령어</span>
              <code className={styles.code}>
                ssh -p {server.sshPort} {server.sshUsername}@{server.host}
              </code>
            </div>
          </InfoCard>
        </div>
      </main>
    </div>
  )
}

function MetricCard({ label, value, color, warn, sparkData, noGraph }) {
  return (
    <div className={`${styles.metricCard} ${warn ? styles.metricWarn : ''}`}>
      <div className={styles.metricTop}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValue} style={{ color }}>{value}</span>
      </div>
      {!noGraph && sparkData && (
        <Sparkline data={sparkData} color={color} />
      )}
    </div>
  )
}

function InfoCard({ title, children }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {children}
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={`${styles.rowValue} ${mono ? styles.mono : ''}`}>{value}</span>
    </div>
  )
}

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>duoinfra</div>
      <ul className={styles.navList}>
        <li><Link to="/overview" className={styles.navItem}>대시보드</Link></li>
        <li><Link to="/create" className={styles.navItem}>서버 생성</Link></li>
      </ul>
    </nav>
  )
}
