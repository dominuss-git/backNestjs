import React from 'react'
import { NavLink } from 'react-router-dom'

export const Department = ({data, numbering}) => {
  let date = new Date(Date(data.date))
  date = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
  let boss = null
  const dep = `/departments/${data.id}`;
  data.users.map((val, i) => {
    if (val.id === Number(data.bossId)) {
      boss = val
      return
    }
  })

  return (
    <NavLink to={dep} className="link">
      <li className="list-group-item d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
          <div className="fw-bold">{data.name}</div>
          <div className="fw-bold">Type : {data.type}</div>
          <div className="fw-bold">Boss : {boss.email}</div>
        </div>
        <div className="fw-bold">{date}&#8195;</div>
        <span className="badge bg-dark rounded-pill">{data.users.length}</span>   
      </li>
    </NavLink>
  )
}