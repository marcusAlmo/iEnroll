import { requestData } from '@/lib/dataRequester';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';


interface PlanCapacityData {
    downloadUploadCapacity: {
        downloadCount: { total: number, max: number },
        uploadCount: { total: number, max: number }
    },
    adminCount: { total: number, max: number },
    studentEnrollmentCapacity: { total: number, max: number },
    remainingDays: { total: number, max: number }
}

const PlanCapacity: React.FC = () => {
  const [data, setData] = useState<PlanCapacityData>({
    downloadUploadCapacity: {
        downloadCount: { total: 0, max: 0 },
        uploadCount: { total: 0, max: 0 }
    },
    adminCount: { total: 0, max: 0 },
    studentEnrollmentCapacity: { total: 0, max: 0 },
    remainingDays: { total: 0, max: 0 }
  });
  const hasFetched = useRef(false);

  const fetchData = async () => {
    try{
        const response = await requestData<PlanCapacityData>({
            url: 'http://localhost:3000/api/metrics/plan-capacity/collection',
            method: 'GET'
        });

        if(response){
            setData(response)
        }
    }catch(err){
        if(err instanceof Error) toast.error(err.message);
        else console.error(err);
    }
  }

  useEffect(() => {
    if (hasFetched.current) return; // prevent double fetch
    hasFetched.current = true;
    fetchData();
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-primary '>
        <div className="border-2 shadow-md rounded-lg py-8 px-4 flex justify-center items-center  bg-green-100 border-success">
            <p className="w-44 text-success text-center">
                Check your plan health. This will help you determine if your plan is nearing its limit.
            </p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>{
                data.downloadUploadCapacity.downloadCount.total
            }</span>/{
                data.downloadUploadCapacity.downloadCount.max
            }</p>
            <p className='text-2xl font-semibold'>Download Capacity</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>{
                data.remainingDays.total
            }</span>/{
                data.remainingDays.max
            }</p>
            <p className='text-2xl font-semibold'>Remaining Days</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-9 mt-9">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>{
                data.studentEnrollmentCapacity.total
            }</span>/{
                data.studentEnrollmentCapacity.max
            }</p>
            <p className='text-2xl font-semibold'>Enrollment Capacity</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8 mt-9">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>{
                data.downloadUploadCapacity.uploadCount.total
            }</span>/{
                data.downloadUploadCapacity.uploadCount.max
            }</p>
            <p className='text-2xl font-semibold'>Upload Capacity</p>
        </div>
        <div className="border-2 border-text-2 text-center shadow-md bg-background rounded-lg py-8 mt-9">
            <p className='text-text-2'><span className='text-6xl font-bold text-primary'>{
                data.adminCount.total
            }</span>/{
                data.adminCount.max
            }</p>
            <p className='text-2xl font-semibold'>Admin Count</p>
        </div>
    </div>
  );
};

export default PlanCapacity;