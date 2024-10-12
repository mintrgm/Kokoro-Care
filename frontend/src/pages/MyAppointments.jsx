import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {

  // dummy data
  const {doctors} = useContext(AppContext)
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {doctors && doctors.slice(0,4).map((doc, index) => (
          <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:gap-6 py-2 border-b'>
            <div>
              <img src={doc.image} alt={doc.name} />
            </div>
            <div>
              <p>{doc.name}</p>
              <p>{doc.speciality}</p>
              <p>Address:</p>
              <p>{doc.address.line1}</p>
              <p>{doc.address.line2}</p>
              <p><span>Date & Time: </span> 11 Nov 2024 | 11:30 AM</p>              
            </div>
            <div>
              <button>Pay Online</button>
              <button>Cancel Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments