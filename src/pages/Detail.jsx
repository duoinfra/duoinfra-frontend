import { useParams, Link } from 'react-router-dom'
import styles from './Detail.module.css'

const MOCK = {
  '1': { id: '1', name: 'ubuntu-01', status: 'running', cpu: 2, memory: 2048, ip: '220.117.221.158', port: 10001, sshUser: 'root', containerId: 'abc123def456', createdAt: '2025-07-01 14:23' },
  '2': { id: '2', name: 'ubuntu-02', status: 'running', cpu: 1, memory: 512, ip: '220.117.221.158', port: 10002, sshUser: 'root', containerId: 'bcd234ef5678', createdAt: '2025-07-03 09:10' },
  '3': { id: '3', name: 'ubuntu-03', status: 'stopped', cpu: 4, memory: 4096, ip: '220.117.221.158', port: 10003, sshUser: 'root', containerId: 'cde345fg6789', createdAt: '2025-06-28 17:45' },
}

export default function Detail() {
  const { id } = useParams()
  const server = MOCK[id]

  if (!server) return <div className={styles.error}>서버를 찾을 수 없습니다.</div>

  const isRunning = server.status === 'running'

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
