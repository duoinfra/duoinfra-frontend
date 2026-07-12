import { Link } from 'react-router-dom'
import styles from './Overview.module.css'

const MOCK_SERVERS = [
  { id: '1', name: 'ubuntu-01', status: 'running', cpu: '2 vCPU', memory: '2048 MB', ip: '220.117.221.158', port: 10001 },
  { id: '2', name: 'ubuntu-02', status: 'running', cpu: '1 vCPU', memory: '512 MB', ip: '220.117.221.158', port: 10002 },
  { id: '3', name: 'ubuntu-03', status: 'stopped', cpu: '4 vCPU', memory: '4096 MB', ip: '220.117.221.158', port: 10003 },
]

const STATUS_COLOR = { running: '#16a34a', stopped: '#6b7280' }

const MONTHLY_TRAFFIC = [
  { month: '2월', inbound: 120, outbound: 80 },
  { month: '3월', inbound: 180, outbound: 140 },
  { month: '4월', inbound: 150, outbound: 110 },
  { month: '5월', inbound: 220, outbound: 170 },
  { month: '6월', inbound: 310, outbound: 240 },
  { month: '7월', inbound: 260, outbound: 190 },
]

const USAGE_STATS = [
  { label: 'CPU 평균 사용률', value: 42, unit: '%', color: '#4f6ef7' },
  { label: '메모리 사용률', value: 67, unit: '%', color: '#f59e0b' },
  { label: '디스크 사용률', value: 31, unit: '%', color: '#10b981' },
]

export default function Overview() {
  const running = MOCK_SERVERS.filter(s => s.status === 'running').length
  const maxTraffic = Math.max(...MONTHLY_TRAFFIC.flatMap(d => [d.inbound, d.outbound]))

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>대시보드</h1>
          <Link to="/create" className={styles.createBtn}>+ 서버 생성</Link>
        </header>

        {/* 상태 카드 */}
        <div className={styles.cards}>
          <StatCard label="전체 서버" value={MOCK_SERVERS.length} />
          <StatCard label="실행 중" value={running} accent />
          <StatCard label="중지됨" value={MOCK_SERVERS.length - running} />
        </div>

        {/* 이번달 트래픽 + 전체 사용량 */}
        <div className={styles.dashboardRow}>
          {/* 트래픽 차트 */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.sectionTitle}>이번달 트래픽</h2>
              <div className={styles.legend}>
                <span className={styles.legendDot} style={{ background: '#4f6ef7' }} />인바운드
                <span className={styles.legendDot} style={{ background: '#e2e8f0', border: '1px solid #94a3b8' }} />아웃바운드
              </div>
            </div>
            <div className={styles.barChart}>
              {MONTHLY_TRAFFIC.map(d => (
                <div key={d.month} className={styles.barGroup}>
                  <div className={styles.bars}>
                    <div className={styles.bar} style={{ height: `${(d.inbound / maxTraffic) * 100}%`, background: '#4f6ef7' }} />
                    <div className={styles.bar} style={{ height: `${(d.outbound / maxTraffic) * 100}%`, background: '#cbd5e1' }} />
                  </div>
                  <span className={styles.barLabel}>{d.month}</span>
                </div>
              ))}
            </div>
            <div className={styles.trafficSummary}>
              <span>인바운드 <strong>260 GB</strong></span>
              <span>아웃바운드 <strong>190 GB</strong></span>
            </div>
          </div>

          {/* 전체 사용량 */}
          <div className={styles.usageCard}>
            <h2 className={styles.sectionTitle}>전체 사용량</h2>
            <div className={styles.usageList}>
              {USAGE_STATS.map(s => (
                <div key={s.label} className={styles.usageItem}>
                  <div className={styles.usageTop}>
                    <span className={styles.usageLabel}>{s.label}</span>
                    <span className={styles.usageValue} style={{ color: s.color }}>{s.value}{s.unit}</span>
                  </div>
                  <div className={styles.progressBg}>
                    <div className={styles.progressFill} style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.usagePeriod}>기준: 2025년 7월</div>
          </div>
        </div>

        {/* 서버 목록 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>내 서버</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>상태</th>
                <th>CPU</th>
                <th>메모리</th>
                <th>접속 정보</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SERVERS.map(s => (
                <tr key={s.id}>
                  <td><Link to={`/servers/${s.id}`} className={styles.serverLink}>{s.name}</Link></td>
                  <td>
                    <span className={styles.badge} style={{ background: STATUS_COLOR[s.status] }}>
                      {s.status === 'running' ? '실행 중' : '중지됨'}
                    </span>
                  </td>
                  <td>{s.cpu}</td>
                  <td>{s.memory}</td>
                  <td className={styles.mono}>{s.ip}:{s.port}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
