import { Navigate } from 'react-router'
import { useScreenSize } from '../contexts/ScreenSizeContext';
import Image from '../assets/school.png';

// Test data
import schools from '../test/data/partner-schools.json';

const MeetOurPartners = () => {
  const { mobile } = useScreenSize();

  if (!mobile) return <Navigate to="/iEnroll" />;

  // If mobile, display the following JSX
  return (
    <div className="mt-8 flex flex-col items-center gap-y-4">
      <img 
        src={Image}
        alt="School facade"
        width={250}
      />
      <h2 className="w-[80%] text-center text-2xl font-semibold text-accent mb-4">Meet our beloved school partners</h2>
      
      <div className="flex justify-center">
        <ul className="list-disc list-inside text-text-2 text-sm">
          {schools.map((school) => (
            <li key={school.id}>
              {school.name}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default MeetOurPartners
