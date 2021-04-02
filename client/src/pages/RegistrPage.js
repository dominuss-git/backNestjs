import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Loader } from '../components/Loader'

export const RegistrPage = () => {
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
        <span 
          className="input-group-text" 
          id="basic-addon1">Name</span
        >
        <input 
          type="text"  
          className="form-control" 
          placeholder="Name" 
          name='name'
          aria-label="Name" 
          aria-describedby="basic-addon1" 
        />
        <span className="input-group-text" id="basic-addon1">Surname</span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Surname" 
          name="surname"
          aria-label="Surname" 
          aria-describedby="basic-addon1" 
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
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">Street</span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Street" 
          name="street"
          aria-label="Street" 
          aria-describedby="basic-addon1" 
          onChange={changeHandler}
          />
          <span 
            className="input-group-text" 
            id="basic-addon1"
          >Home</span>
          <input 
            type="number" 
            className="form-control" 
            placeholder="Home" 
            name="home"
            aria-label="Home" 
            aria-describedby="basic-addon1" 
            onChange={changeHandler}
            />
          <span 
            className="input-group-text w-" 
            id="basic-addon1"
          >Flat</span>
          <input 
            type="number" 
            className="form-control w-5" 
            placeholder="Flat" 
            name="Flat"
            aria-label="Flat" 
            aria-describedby="basic-addon1" 
            onChange={changeHandler}
            />
      </div>
    </form>
  )
}