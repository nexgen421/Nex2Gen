import React from 'react'
import moment from 'moment';

const Clock = () => {
  return (
    <div className='mt-5'>
        <h1 className='text-lg font-semibold'>Date</h1>
        <p>{moment(new Date(Date.now())).format("Do MMMM YYYY")}</p>
    </div>
  )
}

export default Clock;