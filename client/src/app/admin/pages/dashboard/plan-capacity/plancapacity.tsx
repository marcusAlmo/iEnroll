import React from 'react'


export default function plancapacity() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-primary '>
        <div className="border-2 shadow-md rounded-lg py-8 px-4 flex justify-center items-center bg-green-100 border-success">
            <p className="w-44 text-success text-center">
                Check your plan health. This will help you determine if your plan is nearing its limit.
            </p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>1000</span>/15,000</p>
            <p className='text-2xl font-semibold'>Download Capacity</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>24</span>/30</p>
            <p className='text-2xl font-semibold'>Remaining Days</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>1450</span>/3000</p>
            <p className='text-2xl font-semibold'>Enrollment Capacity</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>1000</span>/15,000</p>
            <p className='text-2xl font-semibold'>Upload Capacity</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>2</span>/3</p>
            <p className='text-2xl font-semibold'>Admin Count</p>
        </div>
    </div>
  )
}
