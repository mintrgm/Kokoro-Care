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
          <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
            <div>
              <img src={doc.image} alt={doc.name} className='w-32 bg-indigo-50'/>
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{doc.name}</p>
              <p>{doc.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{doc.address.line1}</p>
              <p className='text-xs'>{doc.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span> 11 Nov 2024 | 11:30 AM</p>              
            </div>
            <div>
              {/* empty div to make it 2 columns for mobile view */}
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              <button className='text-sm text-stone-500 text-center 
                sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 '>Pay Online</button>
              <button className='text-sm text-stone-500 text-center
                sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 '>Cancel Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments