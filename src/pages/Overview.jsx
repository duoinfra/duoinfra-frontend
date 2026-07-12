import { Link } from 'react-router-dom'
import styles from './Overview.module.css'

const MOCK_SERVERS = [
  { id: '1', name: 'ubuntu-01', status: 'running', cpu: '2 vCPU', memory: '2048 MB', ip: '220.117.221.158', port: 10001 },
  { id: '2', name: 'ubuntu-02', status: 'running', cpu: '1 vCPU', memory: '512 MB', ip: '220.117.221.158', port: 10002 },
  { id: '3', name: 'ubuntu-03', status: 'stopped', cpu: '4 vCPU', memory: '4096 MB', ip: '220.117.221.158', port: 10003 },
]

const STATUS_COLOR = { running: '#16a34a', stopped: '#6b7280' }

export default function Overview() {
  const running = MOCK_SERVERS.filter(s => s.status === 'running').length

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>대시보드</h1>
          <Link to="/create" className={styles.createBtn}>+ 서버 생성</Link>
        </header>

        <div className={styles.cards}>
          <StatCard label="전체 서버" value={MOCK_SERVERS.length} />
          <StatCard label="실행 중" value={running} accent />
          <StatCard label="중지됨" value={MOCK_SERVERS.length - running} />
        </div>

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
