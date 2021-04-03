import {useState, useCallback, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginR, logoutR } from '../redux/actions/login.actions'

const storageName = 'userData'

export const useAuth = () => {
  const token = useSelector(state => state.login.token)
  const userId = useSelector(state => state.login.id)
  const [status, setStatus] = useState(false)
  const dispatch = useDispatch()

  const login = useCallback((jwtToken, id) => {
    console.log(jwtToken, id)
    dispatch(loginR({token : jwtToken, id: id}))

    localStorage.setItem(storageName, JSON.stringify({
      userId : id, token : jwtToken
    }))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(storageName)
    dispatch(logoutR())
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))
    console.log(data)
    if(data && data.token) {
      login(data.token, data.id)
    }
    setStatus(true)
  },[login])

  return { login, logout, token, userId, status }
}