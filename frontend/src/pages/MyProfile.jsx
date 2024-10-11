import React, { useState } from 'react'
import {assets} from '../assets/assets'

const MyProfile = () => {

  const [isEdit,setIsEdit] = useState(false)
  const [userData, setUserData] = useState({
    name: "Devendra Singh",
    image: assets.profile_pic,
    email: "codeatfreelance@gmail.com",
    phone: "+91-1234567890",
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London"
    },
    gender: "Male",
    dob: "1988-04-06",
  })
  return (
    <div className='flex flex-col max-w-lg gap-2 text-sm'>
        <img src={userData.image} alt="" className='w-36 rounded'/>
        { isEdit ? 
          <input type="text" value={userData.name} className='bg-gray-100 text-3xl font-medium max-w-60 mt-4'
            onChange={(e)=> setUserData(prev => ({...prev, name: e.target.value}))} /> 
          : <p className='text-3xl font-medium mt-4 text-neutral-800'>{userData.name}</p> 
          }

          <hr className='bg-zinc-400 h-[1px] border-none'/>
          <div>
            <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 '>
              <p className='font-medium'>Email id:</p>
              <p className='text-blue-400'>{userData.email}</p>
              <p className='font-medium'>Phone:</p>
               { isEdit ? 
                <input type="text" value={userData.phone} className='bg-gray-100 max-w-52'
                  onChange={(e)=> setUserData(prev => ({...prev, phone: e.target.value}))} /> 
                : <p className='text-blue-400'>{userData.phone}</p> 
                }
              <p className='font-medium'>Address:</p>
               { isEdit ? 
                <p>
                  <input type="text" value={userData.address.line1} className='bg-gray-100 max-w-52'
                  onChange={(e)=> setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))} /><br />
                  <input type="text" value={userData.address.line2} className='bg-gray-100 max-w-52'
                  onChange={(e)=> setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))} />
                </p>
                : <p className='text-gray-500'>
                  {userData.address.line1}<br />
                  {userData.address.line2}
                </p>
                }
            </div>
          </div>

          <div>
            <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 '>
              <p className='font-medium'>Gender:</p>
              { isEdit ? 
              <select value={userData.gender}
                className='max-w-28 bg-gray-100'
                onChange={(e)=> setUserData(prev => ({...prev, gender: e.target.value}))}>
                <option value="">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p> 
              }
              <p className='font-medium'>Birthday:</p>
              { isEdit ? 
                <input type="date" value={userData.dob} className='max-w-28 bg-gray-100'
                  onChange={(e)=> setUserData(prev => ({...prev, dob: e.target.value}))} /> 
                : <p className='text-gray-400'>{userData.dob}</p> 
                }
            </div>
          </div>
          <div className='mt-10'>
          { isEdit ? 
              <button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" onClick={() => setIsEdit(false)}>Save information</button>
              : <button className="border border-primary px-8 py-2 rounded-full  hover:bg-primary hover:text-white transition-all" onClick={() => setIsEdit(true)}>Edit</button> 
          }
          </div>
    </div>
  )
}

export default MyProfile