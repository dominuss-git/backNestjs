import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Department } from '../components/Department'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { getDepsAction } from '../redux/actions/dep.actions'

export const DepartmentsPage = () => {
  const dispatch = useDispatch()
  let deps = useSelector(state => state.dep.deps)
  const message = useMessage()
  const {request, loading} = useHttp()
  const [form, setForm] = useState()

  const getDeps = async () => {
    const data = await request('/department', 'GET')
    if (data.status === 200) {
      dispatch(getDepsAction(data.body))
    }
  }

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const createHandler = async () => {
    const data = await request('/department/create', 'POST', {...form})
    
    if (data.status === 400) {
      let mes = ''
      for (let mem of data.body.message) {
        mes += mem + ', '
      }
      message(mes)
    } else if (data.status === 200) {
      message(data.body.message)
    }
  }

  useEffect(() => {
    if (!deps && !loading) {
      getDeps()
    }
    console.log(deps)

  }, [deps, loading])

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="d-flex flex-row justify-content-between">
      <ol className="list-group list-group-numbered me-5">
        {!!deps && deps.map((val, i) => {
          return (
            <Department data={val} numbering={i} key={i}/>
          )
        })}
      </ol>
      <form className="col g-3 d-flex flex-column">
        <div className="col-auto mb-3">
          <label for="inputPassword2" className="visually-hidden dark">Boss email</label>
          <input 
            type="email" 
            className="form-control" 
            name="bossEmail"
            id="inputPassword2" 
            placeholder="Boss email" 
            onChange={changeHandler}
            />
        </div>
        <div className="col-auto mb-3">
          <label 
            for="type" 
            className="visually-hidden dark"
            >Type</label>
          <input 
            type="text" 
            className="form-control" 
            id="type" 
            name="type"
            placeholder="Type" 
            onChange={changeHandler}
            />
        </div>
        <div className="col-auto mb-3">
          <label for="name" className="visually-hidden dark">Name</label>
          <input 
            type="text" 
            className="form-control" 
            name="name"
            id="name" 
            placeholder="Name" 
            onChange={changeHandler}
            />
        </div>
        <div className="col-auto align-self-start">
          <button 
            type="submit" 
            className="btn btn-dark mb-3"
            onClick={createHandler}
            >Create</button>
        </div>
      </form>
    </div>
  )
}