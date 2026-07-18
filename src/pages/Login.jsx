import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Auth.module.css'
import { login } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/overview')
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo} />
        <h1 className={styles.title}>로그인</h1>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>이메일</label>
        <input
          className={styles.input}
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <label className={styles.label}>비밀번호</label>
        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className={styles.primaryBtn} type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <p className={styles.footer}>
          계정이 없으신가요?{' '}
          <Link to="/signup" className={styles.link}>회원가입</Link>
        </p>
      </form>
    </div>
  )
}
