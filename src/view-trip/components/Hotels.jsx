import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

function Hotels({ trip }) {
  return (
    <div>
      <h2 className='font-bold text-xl mt-5 text-neutral-900 dark:text-white transition-colors'>Hotel Recommendation</h2>

      <div className='grid grid-cols-2 my-5 md:grid-cols-3 xl:grid-cols-3 gap-5'>
        {trip?.tripData?.hotels?.map((hotel, index) => (
          <HotelCardItem hotel={hotel} />
        ))}
      </div>

    </div>
  )
}

export default Hotels