import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { login } from '../redux/actions/login.actions'

export const LoginPage = () => {
  const dispatch = useDispatch()
  const message = useMessage()
  const {request} = useHttp()
  let loading = useSelector(state => state.app.loading)

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  
  if (loading) {
    return <Loader />
  }

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }


  const onLogin = () => {
    const data = {
      message : 'hello'
    }
    message(data.message)
    // const data = await request('http:/localhost/5000/login', 'POST', {...form})
  }

  return (
    <form className="mt-5 pt-5 w-30">
      <span className="form-label pb-5 bolder fs-2" id="basic-addon1">Authentification</span>
      <div className="input-group mb-3 mt-5">
        <span className="input-group-text" id="basic-addon1">email</span>
        <input 
          type="email" 
          className="form-control" 
          placeholder="Email" 
          name="email"
          aria-label="Email" 
          aria-describedby="basic-addon1"
          onChange={changeHandler} 
          />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Password</span>
        <input 
          type="password" 
          className="form-control" 
          placeholder="Password" 
          name="password"
          aria-label="Password" 
          aria-describedby="basic-addon1" 
          onChange={changeHandler}
          />
      </div>
      <div 
        className="btn-group d-flex justify-start w-75" 
        role="group" 
        aria-label="Basic outlined example"
        >
        <button 
          type="button"
          className="btn btn-primary"
          onClick={onLogin}
          >Sign in</button>
        <button 
          type="button" 
          className="btn btn-dark"
          >Sign up</button>
      </div>
    </form>
  )
}