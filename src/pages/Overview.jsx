import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './Overview.module.css'
import { getDashboardStats, getServers } from '../api'

const STATUS_COLOR = { RUNNING: '#16a34a', STOPPED: '#6b7280' }
const STATUS_LABEL = { RUNNING: '실행 중', STOPPED: '중지됨' }

export default function Overview() {
  const [stats, setStats] = useState(null)
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getServers()])
      .then(([s, sv]) => { setStats(s); setServers(sv) })
      .finally(() => setLoading(false))
  }, [])

  const running = servers.filter(s => s.status === 'RUNNING').length
  const traffic = stats?.traffic ?? []
  const usage = stats?.usage ?? { cpu: 0, memory: 0, disk: 0 }
  const maxTraffic = Math.max(...traffic.flatMap(d => [d.inbound, d.outbound]), 1)

  const usageStats = [
    { label: 'CPU 평균 사용률', value: usage.cpu, color: '#4f6ef7' },
    { label: '메모리 사용률', value: usage.memory, color: '#f59e0b' },
    { label: '디스크 사용률', value: usage.disk, color: '#10b981' },
  ]

  const currentMonth = traffic[traffic.length - 1]

  if (loading) return <div style={{ padding: 40 }}>불러오는 중...</div>

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>대시보드</h1>
          <Link to="/create" className={styles.createBtn}>+ 서버 생성</Link>
        </header>

        <div className={styles.cards}>
          <StatCard label="전체 서버" value={servers.length} />
          <StatCard label="실행 중" value={running} accent />
          <StatCard label="중지됨" value={servers.length - running} />
        </div>

        <div className={styles.dashboardRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.sectionTitle}>월별 트래픽</h2>
              <div className={styles.legend}>
                <span className={styles.legendDot} style={{ background: '#4f6ef7' }} />인바운드
                <span className={styles.legendDot} style={{ background: '#e2e8f0', border: '1px solid #94a3b8' }} />아웃바운드
              </div>
            </div>
            <div className={styles.barChart}>
              {traffic.map(d => (
                <div key={d.month} className={styles.barGroup}>
                  <div className={styles.bars}>
                    <div className={styles.bar} style={{ height: `${(d.inbound / maxTraffic) * 100}%`, background: '#4f6ef7' }} />
                    <div className={styles.bar} style={{ height: `${(d.outbound / maxTraffic) * 100}%`, background: '#cbd5e1' }} />
                  </div>
                  <span className={styles.barLabel}>{d.month?.slice(5)}</span>
                </div>
              ))}
            </div>
            {currentMonth && (
              <div className={styles.trafficSummary}>
                <span>인바운드 <strong>{currentMonth.inbound.toFixed(1)} MB</strong></span>
                <span>아웃바운드 <strong>{currentMonth.outbound.toFixed(1)} MB</strong></span>
              </div>
            )}
          </div>

          <div className={styles.usageCard}>
            <h2 className={styles.sectionTitle}>전체 사용량</h2>
            <div className={styles.usageList}>
              {usageStats.map(s => (
                <div key={s.label} className={styles.usageItem}>
                  <div className={styles.usageTop}>
                    <span className={styles.usageLabel}>{s.label}</span>
                    <span className={styles.usageValue} style={{ color: s.color }}>{s.value.toFixed(1)}%</span>
                  </div>
                  <div className={styles.progressBg}>
                    <div className={styles.progressFill} style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>내 서버</h2>
          {servers.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>생성된 서버가 없습니다.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>상태</th>
                  <th>CPU</th>
                  <th>메모리</th>
                  <th>접속 정보</th>
                </tr>
              </thead>
              <tbody>
                {servers.map(s => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/servers/${s.id}`} className={styles.serverLink}>
                        <span className={styles.badge} style={{ background: STATUS_COLOR[s.status] ?? '#6b7280' }}>
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                      </Link>
                    </td>
                    <td>{s.cpu} vCPU</td>
                    <td>{s.memory} MB</td>
                    <td className={styles.mono}>{s.host}:{s.sshPort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={accent ? { color: '#16a34a' } : undefined}>{value}</span>
    </div>
  )
}

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>duoinfra</div>
      <ul className={styles.navList}>
        <li><Link to="/overview" className={`${styles.navItem} ${styles.active}`}>대시보드</Link></li>
        <li><Link to="/create" className={styles.navItem}>서버 생성</Link></li>
      </ul>
    </nav>
  )
}
