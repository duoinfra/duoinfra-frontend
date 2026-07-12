import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './Detail.module.css'

const MOCK = {
  '-1': { id: '-1', name: 'ubuntu-demo', status: 'running', cpu: 2, memory: 2048, ip: '220.117.221.158', port: 10001, sshUser: 'root', containerId: 'demo1234abcd5678', createdAt: '2025-07-12 10:00' },
  '1': { id: '1', name: 'ubuntu-01', status: 'running', cpu: 2, memory: 2048, ip: '220.117.221.158', port: 10001, sshUser: 'root', containerId: 'abc123def456', createdAt: '2025-07-01 14:23' },
  '2': { id: '2', name: 'ubuntu-02', status: 'running', cpu: 1, memory: 512, ip: '220.117.221.158', port: 10002, sshUser: 'root', containerId: 'bcd234ef5678', createdAt: '2025-07-03 09:10' },
  '3': { id: '3', name: 'ubuntu-03', status: 'stopped', cpu: 4, memory: 4096, ip: '220.117.221.158', port: 10003, sshUser: 'root', containerId: 'cde345fg6789', createdAt: '2025-06-28 17:45' },
}

function useMetrics(active) {
  const [metrics, setMetrics] = useState({
    cpu: 42,
    memory: 67,
    networkIn: 12.4,
    networkOut: 5.8,
    history: Array.from({ length: 20 }, (_, i) => ({
      cpu: 30 + Math.random() * 30,
      mem: 60 + Math.random() * 15,
    })),
  })

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      setMetrics(prev => {
        const newCpu = Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10))
        const newMem = Math.max(20, Math.min(90, prev.memory + (Math.random() - 0.5) * 4))
        return {
          cpu: Math.round(newCpu),
          memory: Math.round(newMem),
          networkIn: +(Math.random() * 20).toFixed(1),
          networkOut: +(Math.random() * 10).toFixed(1),
          history: [...prev.history.slice(1), { cpu: newCpu, mem: newMem }],
        }
      })
    }, 1500)
    return () => clearInterval(id)
  }, [active])

  return metrics
}

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
  const server = MOCK[id]
  const isRunning = server?.status === 'running'
  const metrics = useMetrics(isRunning)

  if (!server) return <div className={styles.error}>서버를 찾을 수 없습니다.</div>

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link to="/overview" className={styles.back}>← 대시보드</Link>
        </div>

        <header className={styles.header}>
          <div>
            <h1 className={styles.name}>{server.name}</h1>
            <span className={styles.badge} style={{ background: isRunning ? '#16a34a' : '#6b7280' }}>
              {isRunning ? '실행 중' : '중지됨'}
            </span>
          </div>
        </header>

        {/* 실시간 메트릭 */}
        {isRunning && (
          <section className={styles.metricsSection}>
            <div className={styles.metricsHeader}>
              <h2 className={styles.cardTitle}>실시간 메트릭</h2>
              <span className={styles.liveTag}>● LIVE</span>
            </div>
            <div className={styles.metricsGrid}>
              <MetricCard
                label="CPU 사용률"
                value={`${metrics.cpu}%`}
                color="#4f6ef7"
                warn={metrics.cpu > 80}
                sparkData={metrics.history.map(h => h.cpu)}
              />
              <MetricCard
                label="메모리 사용률"
                value={`${metrics.memory}%`}
                color="#f59e0b"
                warn={metrics.memory > 85}
                sparkData={metrics.history.map(h => h.mem)}
              />
              <MetricCard
                label="네트워크 인바운드"
                value={`${metrics.networkIn} MB/s`}
                color="#10b981"
                noGraph
              />
              <MetricCard
                label="네트워크 아웃바운드"
                value={`${metrics.networkOut} MB/s`}
                color="#8b5cf6"
                noGraph
              />
            </div>
          </section>
        )}

        <div className={styles.grid}>
          <InfoCard title="기본 정보">
            <Row label="컨테이너 ID" value={server.containerId} mono />
            <Row label="생성일" value={server.createdAt} />
            <Row label="상태" value={isRunning ? '실행 중' : '중지됨'} />
          </InfoCard>

          <InfoCard title="사양">
            <Row label="CPU" value={`${server.cpu} vCPU`} />
            <Row label="메모리" value={`${server.memory} MB`} />
          </InfoCard>

          <InfoCard title="SSH 접속 정보">
            <Row label="호스트" value={server.ip} mono />
            <Row label="포트" value={String(server.port)} mono />
            <Row label="사용자" value={server.sshUser} mono />
            <div className={styles.sshCmd}>
              <span className={styles.sshLabel}>접속 명령어</span>
              <code className={styles.code}>
                ssh -p {server.port} {server.sshUser}@{server.ip}
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
