import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Auth.module.css'
import { signup } from '../api'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
    { key: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com' },
    { key: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호' },
    { key: 'confirm', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호 재입력' },
  ]

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo} />
        <h1 className={styles.title}>회원가입</h1>

        {error && <p className={styles.error}>{error}</p>}

        {fields.map(f => (
          <div key={f.key}>
            <label className={styles.label}>{f.label}</label>
            <input
              className={styles.input}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              required
            />
          </div>
        ))}

        <button className={styles.primaryBtn} type="submit" style={{ marginTop: 12 }} disabled={loading}>
          {loading ? '가입 중...' : '가입하기'}
        </button>

        <p className={styles.footer}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className={styles.link}>로그인</Link>
        </p>
      </form>
    </div>
  )
}
