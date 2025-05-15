/**
 * @file EnrollmentSchedule.tsx
 * @description Component for managing enrollment schedules for different grade levels.
 * Allows administrators to create, edit, and manage enrollment time slots.
 */

import { useState, useMemo, useEffect } from 'react'
//import scheduleData from './test/scheduleSample.json'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faTrash,
  faTimes,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { requestData } from '@/lib/dataRequester';

/**
 * Represents a time range with start and end times
 * @interface TimeRange
 */
interface TimeRange {
  startTime: string
  endTime: string
}

interface EnrollmentScheduleDataType {
  schoolCapacity: {
    totalCapacity: number;
    remainingSlots: number;
  };
  gradeLevels: GradeLevel[];
};

interface GradeLevel {
  gradeLevel: string;
  allowSectionSelection: boolean
  sections: Section[];
  schedules: ScheduleData[];
};

interface Section {
  sectionName: string;
  sectionCapacity: number;
  maximumApplication: number;
  currentEnrolled: number;
};

interface ScheduleData {
  id: number;
  date: string; // in YYYY-MM-DD format
  timeRanges: TimeRange[];
  applications: number;
  status: string;
  gradeLevel: string;
  maximumApplication: number;
};

const ScheduleItem = ({ 
  schedule, 
  onToggle, 
  onDelete, 
  isExisting 
}: {
  schedule: ScheduleData;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isExisting: boolean;
}) => (
  <div className='flex flex-col gap-2'>
    <div className='flex items-center gap-3'>
      <div className='flex items-center gap-2'>
        <button 
          onClick={() => onToggle(schedule.id.toString())}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer button-transition ${
            schedule.status === 'active' 
              ? 'bg-success/20 text-green-700 hover:bg-success/50' 
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          <FontAwesomeIcon icon={schedule.status === 'active' ? faPause : faPlay} />
        </button>
      </div>
      <div className='flex-1 flex items-center gap-2 text-gray-600'>
        <span className='rounded-md bg-text-2/10 px-3 py-1'>
          {schedule.date}
        </span>
        {schedule.timeRanges.map((time, timeIndex) => (
          <div key={timeIndex} className='flex items-center gap-2'>
            <span className='rounded-md bg-text-2/10 px-3 py-1'>
              {time.startTime}
            </span>
            <span>-</span>
            <span className='rounded-md bg-text-2/10 px-3 py-1'>
              {time.endTime}
            </span>
          </div>
        ))}
        {!isExisting && (
          <span className='text-xs text-green-600 ml-2'>NEW</span>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <button 
          onClick={() => onDelete(schedule.id.toString())}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            schedule.applications > 0 
              ? 'bg-red-50 text-red-300 cursor-not-allowed' 
              : 'bg-danger/20 text-red-500 hover:bg-danger/30'
          }`}
          disabled={schedule.applications > 0}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  </div>
);

/**
 * Main component for managing enrollment schedules
 * @component
 * @returns {JSX.Element} The enrollment schedule management interface
 */
export default function EnrollmentSchedule() {
  // State management
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<ScheduleData[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ startTime: '', endTime: '' }])
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
  const [timeErrors, setTimeErrors] = useState<{[key: number]: string}>({})
  const [maxApplications, setMaxApplications] = useState<number>(0)
  const [maxApplicationsError, setMaxApplicationsError] = useState<string>('')
  const [data, setData] = useState<EnrollmentScheduleDataType>({
    schoolCapacity: {
      totalCapacity: 0,
      remainingSlots: 0,
    },
    gradeLevels: [],
  });
  // Add this new state variable at the top of the component
  const [newSchedules, setNewSchedules] = useState<ScheduleData[]>([])

  // Modify handleSaveTimeSlot to add to newSchedules
  const handleSaveTimeSlot = () => {
    if (isSaveDisabled) {
      toast.error('Please fill in all required fields and fix validation errors')
      return
    }
  
    // Get the local date string (YYYY-MM-DD format)
    const adjustedDate = new Date(selectedDate!);
    adjustedDate.setMinutes(adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset());
    const dateString = adjustedDate.toISOString().split('T')[0];

    const newSchedule: ScheduleData = {
      id: Date.now(),
      date: dateString,
      timeRanges,
      status: 'active',
      applications: 0,
      gradeLevel: selectedGrade!,
      maximumApplication: maxApplications,
    }

    if (editingScheduleId) {
      // Check if editing existing or new schedule
      const isExisting = schedules.some(s => s.id.toString() === editingScheduleId)
      if (isExisting) {
        setSchedules(schedules.map(s => 
          s.id.toString() === editingScheduleId ? newSchedule : s
        ))
      } else {
        setNewSchedules(newSchedules.map(s => 
          s.id.toString() === editingScheduleId ? newSchedule : s
        ))
      }
    } else {
      setNewSchedules([...newSchedules, newSchedule])
    }

    setShowAddModal(false)
    setSelectedDate(null)
    setTimeRanges([{ startTime: '', endTime: '' }])
    setEditingScheduleId(null)
    setTimeErrors({})
  }

  // Modify handleSaveEnrollmentSchedule to only send newSchedules
  const handleSaveEnrollmentSchedule = async () => {
    if (!selectedGrade) {
      toast.error('Please select a grade level first')
      return;
    }

    if (newSchedules.length === 0) {
      toast.error('Please add at least one new time slot')
      return;
    }

    await saveNewSchedToServer(selectedGrade, newSchedules)

    // After successful submission, move new schedules to existing
    setSchedules([...schedules, ...newSchedules])
    setNewSchedules([])
    toast.success('New enrollment schedules published successfully')
  }

  const saveNewSchedToServer = async (
    grade: string,
    schedule: ScheduleData[]
  ) => {
    try {

      const processedSchedule = schedule.map((s) => ({
        DateString: s.date,
        timeRanges: s.timeRanges,
        applicationSlot: s.maximumApplication,
      }));

      const response = await requestData<{ message: string }>({
        url: 'http://localhost:3000/api/enrollment-schedule/store-data',
        method: 'POST',
        body: {
          gradeLevel: grade,
          schedDate: processedSchedule
        }
      });

      if (response) {
        toast.success(response.message);
        setNewSchedules([]);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Failed saving new schedules');

      console.error(error);
    }
  }

  // retrieve schedule data
  const retrieveSchedules = async () => {
    try{
      const response = await requestData<EnrollmentScheduleDataType>({
        url: 'http://localhost:3000/api/enrollment-schedule/get-all-schedules',
        method: 'GET',
      });

      if (response) {
        setData(response);
      }
    } catch(err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Retrieve schedule failed');

      console.error(err);
    }
  }

  useEffect(() => {
    retrieveSchedules();
  }, []);

  /**
   * Memoized time options for the time selection dropdowns
   * @type {string[]}
   */
  const timeOptions = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => {
      const hourStr = hour.toString().padStart(2, '0')
      return [`${hourStr}:00`, `${hourStr}:30`]
    }).flat()
  }, [])

  /**
   * Memoized validation function for time ranges
   * @param {string} startTime - Start time in HH:MM format
   * @param {string} endTime - End time in HH:MM format
   * @returns {boolean} True if the time range is valid
   */
  const validateTimeRange = useMemo(() => (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return true
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      return false
    }
    return true
  }, [])

  /**
   * Validates the maximum applications value
   * @param {number} value - The maximum applications value to validate
   * @returns {boolean} True if the value is valid
   */
  const validateMaxApplications = (value: number) => {
    if (value < 0) {
      setMaxApplicationsError('Maximum applications cannot be negative');
      return false;
    }
    
    if (editingSchedule?.applications && value < editingSchedule.applications) {
      setMaxApplicationsError(`Maximum applications cannot be less than current applications (${editingSchedule.applications})`);
      return false;
    }
  
    // Use remaining slots as the threshold
    if (value > data.schoolCapacity.remainingSlots) {
      setMaxApplicationsError(`Maximum applications cannot exceed remaining school capacity (${data.schoolCapacity.remainingSlots})`);
      return false;
    }
  
    setMaxApplicationsError('');
    return true;
  };

  /**
   * Memoized data for the selected grade level
   * @type {Object}
   */
  const selectedGradeData = useMemo(() => {
    return data.gradeLevels.find(g => g.gradeLevel === selectedGrade)
  }, [selectedGrade, data.gradeLevels])

  /**
   * Memoized schedule being edited
   * @type {Schedule | null}
   */
  const editingSchedule = useMemo(() => {
    return editingScheduleId ? schedules.find(s => s.id === Number(editingScheduleId)) : null
  }, [editingScheduleId, schedules])

  /**
   * Memoized validation state
   * @type {boolean}
   */
  const hasValidationErrors = useMemo(() => {
    return Object.values(timeErrors).some(error => error !== '')
  }, [timeErrors])

  /**
   * Memoized save button disabled state
   * @type {boolean}
   */
  const isSaveDisabled = useMemo(() => {
    return !selectedDate ||
           timeRanges.some(range => !range.startTime || !range.endTime) || 
           hasValidationErrors ||
           maxApplicationsError !== ''
  }, [selectedDate, timeRanges, hasValidationErrors, maxApplicationsError])

  /**
   * Handles grade level selection
   * @param {string} gradeLevel - The selected grade level
   */
  const handleGradeSelect = (gradeLevel: string) => {
    setSelectedGrade(gradeLevel);
    const gradeData = data.gradeLevels.find(g => g.gradeLevel === gradeLevel);
    
    if (gradeData) {
      const typedSchedules: ScheduleData[] = gradeData.schedules.map(schedule => ({
        ...schedule,
        status: schedule.status as 'active' | 'paused'
      }));
      setSchedules(typedSchedules);
      setNewSchedules([]); // Reset new schedules when changing grade
      toast.success(`Loaded schedules for ${gradeLevel}`);
    } else {
      setSchedules([]);
      toast.error('No schedules found for this grade level');
    }
  };

  const handleAddTimeSlot = () => {
    setMaxApplications(0);
    setShowAddModal(true);
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    // Check both existing and new schedules
    const existingSchedule = schedules.find(s => s.id.toString() === scheduleId);
    const newSchedule = newSchedules.find(s => s.id.toString() === scheduleId);

    if (existingSchedule) {
      if (existingSchedule.applications > 0) {
        setSchedules(schedules.map(s =>
          s.id.toString() === scheduleId
            ? { ...s, status: 'paused' }
            : s
        ));
        toast.warning('Schedule paused due to existing applications');
      } else {
        await deleteRecord(Number(scheduleId));
        setSchedules(schedules.filter(s => s.id.toString() !== scheduleId));
      }
    }

    if (newSchedule) {
      // Don't log for new unsaved schedules
      setNewSchedules(newSchedules.filter(s => s.id.toString() !== scheduleId));
      toast.success('New schedule removed successfully');
    }
  };

  const deleteRecord = async (id: number) => {
    try{
      const response = await requestData<{message: string}>({
        url: `http://localhost:3000/api/enrollment-schedule/delete-schedule/${id}`,
        method: 'DELETE'
      });

      if (response){
        await retrieveSchedules();
        toast.success(response.message);
      }
    }catch(err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Delete record failed');

      console.error(err);
    }
  }

  const handleToggleStatus = async (scheduleId: string) => {
    // Check both existing and new schedules
    const isExisting = schedules.some(s => s.id.toString() === scheduleId);
    
    if (isExisting) {
      setSchedules(schedules.map(s => 
        s.id.toString() === scheduleId 
          ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
          : s
      ));
    } else {
      setNewSchedules(newSchedules.map(s => 
        s.id.toString() === scheduleId 
          ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
          : s
      ));
    }
  
    const schedule = [...schedules, ...newSchedules].find(s => s.id.toString() === scheduleId);
    if (schedule) {
      await pauseSchedule(Number(scheduleId), schedule.status === 'active');
      //toast.info(`Schedule ${schedule.status === 'active' ? 'paused' : 'activated'}`);
    }
  };

  const pauseSchedule = async (scheduleId: number, status: boolean) => {
    try{
      const response = await requestData<{message: string}>({
        url: `http://localhost:3000/api/enrollment-schedule/pause-schedule?scheduleId=${scheduleId}&status=${status}`,
        method: 'PUT'
      });

      if (response){
        await retrieveSchedules();
        toast.success(response.message);
      }
    }catch(err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Pause schedule failed');

      console.error(err);
    }
  }

  const handleAllowSectionSelectionChange = async (gradeLevel: string) => {
    // Update the state directly by toggling the current value
    setData(prev => ({
      ...prev,
      gradeLevels: prev.gradeLevels.map(g =>
        g.gradeLevel === gradeLevel
          ? { ...g, allowSectionSelection: !g.allowSectionSelection }
          : g
      ),
    }));

    // Get the updated state to show the correct toast message
    const updatedValue = !selectedGradeData?.allowSectionSelection;
    await changeAllowSelection(gradeLevel);
    toast.info(`Allow section selection ${updatedValue ? 'enabled' : 'disabled'}`);
  };

  const changeAllowSelection = async (gradeLevel: string) => {
    try{
      const response = await requestData<{ message: string}>({
        url: `http://localhost:3000/api/enrollment-schedule/update-allow-selection?gradeLevel=${gradeLevel}`,
        method: 'PUT'
      });

      if(response){
        toast.success(response.message);
      }
    }catch(err) {
      if(err instanceof Error) toast.error(err.message);
      else toast.error('An error has occured');

      console.error(err)
    }
  }

  /**
   * Handles time range changes and validation
   * @param {number} index - Index of the time range being modified
   * @param {'startTime' | 'endTime'} field - Field being modified
   * @param {string} value - New time value
   */
  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newTimeRanges = [...timeRanges]
    newTimeRanges[index][field] = value
    setTimeRanges(newTimeRanges)

    // Validate the time range
    const startTime = field === 'startTime' ? value : newTimeRanges[index].startTime
    const endTime = field === 'endTime' ? value : newTimeRanges[index].endTime

    if (startTime && endTime) {
      const isValid = validateTimeRange(startTime, endTime)
      setTimeErrors(prev => ({
        ...prev,
        [index]: isValid ? '' : 'End time must be after start time'
      }))
    } else {
      setTimeErrors(prev => ({
        ...prev,
        [index]: ''
      }))
    }
  }

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { startTime: '', endTime: '' }])
  }

  const removeTimeRange = (index: number) => {
    if (timeRanges.length > 1) {
      const newTimeRanges = timeRanges.filter((_, i) => i !== index)
      setTimeRanges(newTimeRanges)
    }
  }

  /**
   * Gets the appropriate color class based on capacity
   * @param {number} remaining - Remaining slots
   * @param {number} total - Total capacity
   * @returns {string} Tailwind CSS classes for styling
   */
  const getCapacityColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage >= 50) {
      return 'text-green-600 bg-success/20' // Plenty of slots
    } else if (percentage >= 25) {
      return 'text-yellow-600 bg-warning/20' // Medium capacity
    } else {
      return 'text-red-600 bg-error/20' // Nearly full
    }
  }

  return (
    <div className='flex flex-row gap-4 justify-center pt-7 px-8 w-full'>
      {/* Step 1: Select Grade */}
      <div className='w-2/12 flex flex-col gap-2'>
        <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
          <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 1:</span> Select Grade
        </div>
        <div className='bg-background h-[480px] rounded-[10px] shadow-md p-4 overflow-y-auto'>
          <div className='flex flex-col gap-3'>
            {data.gradeLevels.map((grade) => (
              <div 
                key={grade.gradeLevel}
                className={`flex flex-col gap-2 p-3 border border-text-2 rounded-[10px] hover:bg-text-2/20 cursor-pointer button-transition
                  ${selectedGrade === grade.gradeLevel ? 'border-accent bg-accent/20' : ''}`}
                onClick={() => handleGradeSelect(grade.gradeLevel)}
              >
                <div className='font-semibold'>{grade.gradeLevel}</div>
                <div className='text-sm text-gray-600'>
                  {grade.sections.length} sections • {grade.sections.reduce((acc, section) => acc + section.currentEnrolled, 0)} enrolled
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Step 2: Indicate enrollment date and time */}
      <div className='w-8/12 flex flex-col gap-2'>
        <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
          <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 2:</span> Indicate enrollment date and time
        </div>
        <div className='bg-background h-[480px] rounded-[10px] shadow-md p-4 overflow-y-auto overflow-x-auto'>

          {selectedGrade ? (
            <div className='flex flex-col gap-6'>
            {/* Existing schedules */}
            {schedules.map((schedule) => (
              <ScheduleItem 
                key={schedule.id}
                schedule={schedule}
                onToggle={handleToggleStatus}
                onDelete={handleDeleteSchedule}
                isExisting={true}
              />
            ))}
            
            {/* New schedules */}
            {newSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggle={handleToggleStatus}
                onDelete={handleDeleteSchedule}
                isExisting={false}
              />
            ))}
            
            <button 
              onClick={handleAddTimeSlot}
              className='flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-text-2 hover:bg-text-2/20 hover:border-gray-400 transition-colors button-transition cursor-pointer'
            >
              <FontAwesomeIcon 
                className='text-accent text-xl'
                icon={faPlusCircle} 
              />
              Add new time slot
            </button>
          </div>
          ) : (
            <div className='flex items-center justify-center h-full text-text-2'>
              Select a grade level to manage schedules
            </div>
          )}
        </div>
      </div>
      {/* 
        Step 3: Allow students to choose a section,
        Step 4: See the number of slots
        Step 5: Publish enrollment schedule
      */}
      <div className='w-2/12 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
            <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 3:</span> 
          </div>
          <div className='bg-background rounded-[10px] shadow-md p-4'> 
            <div className='flex items-center gap-2 text-text'>
            <input 
              type="checkbox" 
              checked={selectedGradeData?.allowSectionSelection || false} 
              onChange={() => handleAllowSectionSelectionChange(selectedGradeData?.gradeLevel || '')} 
              className='form-checkbox h-4 w-4 cursor-pointer button-transition' 
            />
              <span>Allow section selection</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
            <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Slots Remaining:</span>
          </div>
          <div className='bg-background rounded-[10px] shadow-md p-4 h-[209px] overflow-y-auto'>
            {selectedGrade && (
              <div className='flex flex-col gap-2 mb-5'>
                <div className='text-sm text-text font-semibold'>Selected Grade ({selectedGrade})</div>
                <div className='flex flex-col gap-1'>
                  {selectedGradeData?.sections.map(section => (
                    <div key={section.sectionName} className='flex justify-between items-center text-sm'>
                      <span className='text-gray-600'>{section.sectionName}</span>
                      <span className='font-medium'>
                        {section.currentEnrolled}/{section.sectionCapacity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className='flex flex-col gap-4 justify-center items-center'>
              <div className='flex flex-col text-center'>
                <div className='text-sm text-text'>Plan Remaining Slots</div>
                <div className={`text-lg font-semibold rounded-[10px] py-1 ${
                  getCapacityColor(
                    data.schoolCapacity.remainingSlots,
                    data.schoolCapacity.totalCapacity
                  )
                }`}>
                  {data.schoolCapacity.remainingSlots} slots
                </div>
              </div>
              <div className='flex flex-col text-center'>
                <div className='text-sm text-text'>Total School Capacity</div>
                <div className='text-lg font-semibold text-primary bg-accent/20 rounded-[10px] py-1'>
                  {data.schoolCapacity.totalCapacity} slots
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
            <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 5:</span> Publish schedule
          </div>
          <div className='bg-background rounded-[10px] shadow-md p-4'>
            <button 
              onClick={handleSaveEnrollmentSchedule}
              className='w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 button-transition cursor-pointer'
            >
              Create Enrollment Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Time Slot Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
          <div className='bg-white rounded-lg p-6 w-auto h-[450px] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold text-primary'>
                {editingScheduleId ? 'Edit Time Slot' : 'Add New Time Slot'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setEditingScheduleId(null)
                  setSelectedDate(null)
                  setTimeRanges([{ startTime: '', endTime: '' }])
                  setTimeErrors({})
                }}
                className='w-8 h-8 rounded-full flex items-center justify-center text-text-2 hover:bg-text-2/20 cursor-pointer button-transition hover:text-danger/70'
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className='flex flex-row w-full gap-6'>
              <div className='w-2/4'>
                <div className='flex-1 w-full'>
                  <h4 className='mb-2 rounded-[10px] bg-text-2/10 px-2 py-1 text-sm font-semibold text-text-2'>Pick a Date</h4>
                  <Calendar
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value)
                      }
                    }}
                    value={selectedDate}
                    minDate={new Date()}
                    className='w-full'
                  />
                  <div className='mt-4'>
                    <h4 className='mb-2 rounded-[10px] bg-text-2/10 px-2 py-1 text-sm font-semibold text-text-2'>Maximum Applications</h4>
                    <div className='flex flex-col gap-2'>
                      <input
                        key={editingScheduleId || 'new'}
                        type="text"
                        value={maxApplications}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value.replace(/[^0-9]/g, ''));
                          setMaxApplications(value);
                          validateMaxApplications(value);
                        }}
                        pattern="[0-9]*"
                        className={`w-full rounded border px-2 py-1 ${
                          maxApplicationsError ? 'border-danger' : 'border-text-2/50'
                        }`}
                        placeholder="Enter maximum applications"
                      />
                      <div className='text-sm text-gray-500'>
                        Remaining school capacity: {data.schoolCapacity.remainingSlots} slots
                      </div>
                      {maxApplicationsError && (
                        <div className='text-danger text-sm'>{maxApplicationsError}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 mt-4 w-full'>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingScheduleId(null)
                      setSelectedDate(null)
                      setTimeRanges([{ startTime: '', endTime: '' }])
                      setTimeErrors({})
                    }}
                    className='px-4 py-2 border rounded-md hover:bg-danger/20 button-transition cursor-pointer'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTimeSlot}
                    className='px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 cursor-pointer button-transition disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={isSaveDisabled}
                  >
                    Save Time Slot
                  </button>
                </div>
              </div>
              <div className='flex-1 w-2/4'>
                <h4 className='mb-2 rounded-[10px] bg-text-2/10 px-2 py-1 text-sm font-semibold text-text-2'>Select Time Ranges</h4>
                <div className='mb-4 rounded-[10px] border border-text-2 px-2 py-2'>
                  {timeRanges.map((range, index) => (
                    <div key={index} className='flex flex-col gap-1 mb-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <select
                          value={range.startTime}
                          onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                          className='cursor-pointer rounded border border-text-2/50 px-2 py-1'
                        >
                          <option value="">Start Time</option>
                          {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <span>to</span>
                        <select
                          value={range.endTime}
                          onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                          className='cursor-pointer rounded border border-text-2/50 px-2 py-1'
                        >
                          <option value="">End Time</option>
                          {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {timeRanges.length > 1 && (
                          <button
                            onClick={() => removeTimeRange(index)}
                            className='text-danger hover:text-danger/50 cursor-pointer button-transition'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {timeErrors[index] && (
                        <div className='text-danger text-xs pl-1'>{timeErrors[index]}</div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addTimeRange}
                    className='button-transition flex cursor-pointer items-center gap-1 rounded-[10px] bg-accent/20 px-2 py-1 text-sm text-primary hover:bg-accent/40'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add another time range
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
