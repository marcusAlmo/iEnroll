/**
 * @file EnrollmentSchedule.tsx
 * @description Component for managing enrollment schedules for different grade levels.
 * Allows administrators to create, edit, and manage enrollment time slots.
 */

import { useState, useMemo } from 'react'
import scheduleData from './test/scheduleSample.json'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faTrash,
  faTimes,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

/**
 * Represents a time range with start and end times
 * @interface TimeRange
 */
interface TimeRange {
  startTime: string
  endTime: string
}

/**
 * Represents an enrollment schedule for a specific date
 * @interface Schedule
 */
interface Schedule {
  id: string
  date: string
  timeRanges: TimeRange[]
  status: 'active' | 'paused'
  allowSectionSelection: boolean
  applications?: number // Number of students who have applied
}

/**
 * Main component for managing enrollment schedules
 * @component
 * @returns {JSX.Element} The enrollment schedule management interface
 */
export default function EnrollmentSchedule() {
  // State management
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ startTime: '', endTime: '' }])
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
  const [timeErrors, setTimeErrors] = useState<{[key: number]: string}>({})

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
   * Memoized data for the selected grade level
   * @type {Object}
   */
  const selectedGradeData = useMemo(() => {
    return scheduleData.gradeLevels.find(g => g.gradeLevel === selectedGrade)
  }, [selectedGrade])

  /**
   * Memoized schedule being edited
   * @type {Schedule | null}
   */
  const editingSchedule = useMemo(() => {
    return editingScheduleId ? schedules.find(s => s.id === editingScheduleId) : null
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
           hasValidationErrors
  }, [selectedDate, timeRanges, hasValidationErrors])

  /**
   * Handles grade level selection
   * @param {string} gradeLevel - The selected grade level
   */
  const handleGradeSelect = (gradeLevel: string) => {
    setSelectedGrade(gradeLevel)
    if (selectedGradeData) {
      const typedSchedules: Schedule[] = selectedGradeData.schedules.map(schedule => ({
        ...schedule,
        status: schedule.status as 'active' | 'paused'
      }))
      setSchedules(typedSchedules)
      toast.success(`Loaded schedules for ${gradeLevel}`)
    } else {
      setSchedules([])
      toast.error('No schedules found for this grade level')
    }
  }

  const handleAddTimeSlot = () => {
    setShowAddModal(true)
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId)
    if (!schedule) return

    if (schedule.applications && schedule.applications > 0) {
      setSchedules(schedules.map(s => 
        s.id === scheduleId 
          ? { ...s, status: 'paused' }
          : s
      ))
      toast.warning('Schedule paused due to existing applications')
    } else {
      setSchedules(schedules.filter(s => s.id !== scheduleId))
      toast.success('Schedule deleted successfully')
    }
  }

  const handleToggleStatus = (scheduleId: string) => {
    setSchedules(schedules.map(s => 
      s.id === scheduleId 
        ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
        : s
    ))
    const schedule = schedules.find(s => s.id === scheduleId)
    if (schedule) {
      toast.info(`Schedule ${schedule.status === 'active' ? 'paused' : 'activated'}`)
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
   * Handles saving a time slot (individual schedule)
   */
  const handleSaveTimeSlot = () => {
    if (isSaveDisabled) {
      toast.error('Please fill in all required fields and fix validation errors')
      return
    }

    const newSchedule: Schedule = {
      id: editingScheduleId || `${selectedGrade}-schedule-${Date.now()}`,
      date: selectedDate!.toISOString().split('T')[0],
      timeRanges,
      status: 'active',
      allowSectionSelection: true,
      applications: editingSchedule?.applications || 0
    }

    if (editingScheduleId) {
      setSchedules(schedules.map(s => 
        s.id === editingScheduleId ? newSchedule : s
      ))
      toast.success('Time slot updated successfully')
    } else {
      setSchedules([...schedules, newSchedule])
      toast.success('New time slot created successfully')
    }

    setShowAddModal(false)
    setSelectedDate(null)
    setTimeRanges([{ startTime: '', endTime: '' }])
    setEditingScheduleId(null)
    setTimeErrors({})
  }

  /**
   * Handles saving the entire enrollment schedule
   */
  const handleSaveEnrollmentSchedule = () => {
    if (!selectedGrade) {
      toast.error('Please select a grade level first')
      return
    }

    if (schedules.length === 0) {
      toast.error('Please add at least one time slot')
      return
    }

    // Here you would typically make an API call to save the entire schedule
    console.log('Saving entire enrollment schedule:', {
      grade: selectedGrade,
      schedules: schedules
    })

    toast.success('Enrollment schedule published successfully')
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
        <div className='bg-background h-[480px] rounded-[10px] shadow-md p-4'>
          <div className='flex flex-col gap-3'>
            {scheduleData.gradeLevels.map((grade) => (
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
      <div className='w-7/12 flex flex-col gap-2'>
        <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
          <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 2:</span> Indicate enrollment date and time
        </div>
        <div className='bg-background h-[480px] rounded-[10px] shadow-md p-4 overflow-y-aut overflow-x-auto'>
          {selectedGrade ? (
            <div className='flex flex-col gap-6'>
              {schedules.map((schedule) => (
                <div key={schedule.id} className='flex flex-col gap-2'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2'>
                      <button 
                        onClick={() => handleToggleStatus(schedule.id)}
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
                      <button className='button-transitio rounded-md bg-text-2/10 px-3 py-1 hover:bg-text-2/30'>
                        {new Date(schedule.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </button>
                      {schedule.timeRanges.map((time, timeIndex) => (
                        <div key={timeIndex} className='flex items-center gap-2'>
                          <button className='button-transitio rounded-md bg-text-2/10 px-3 py-1 hover:bg-text-2/30n'>
                            {time.startTime}
                          </button>
                          <span>-</span>
                          <button className='button-transitio rounded-md bg-text-2/10 px-3 py-1 hover:bg-text-2/30'>
                            {time.endTime}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className='flex items-center gap-2'>
                      <button 
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center relative group cursor-pointer button-transition ${
                          (schedule.applications && schedule.applications > 0) 
                            ? 'bg-red-50 text-red-300 cursor-not-allowed' 
                            : 'bg-danger/20 text-red-500 hover:bg-danger/30'
                        }`}
                        disabled={Boolean(schedule.applications && schedule.applications > 0)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        {/* {schedule.applications && schedule.applications > 0 && (
                          <div className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                            Cannot delete: Has applications
                          </div>
                        )} */}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleAddTimeSlot}
                className='flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-text-2 hover:bg-text-2/20 hover:border-gray-400 transition-colors button-transition cursor-pointer'
              >
                <FontAwesomeIcon 
                  className='text-accent text-xl'
                  icon={faPlusCircle} />
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
      <div className='w-3/12 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
            <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 3:</span> Allow students to choose a section
          </div>
          <div className='bg-background rounded-[10px] shadow-md p-4'> 
            <div className='flex items-center gap-2 text-text'>
              <input type="checkbox" className='form-checkbox h-4 w-4 cursor-pointer button-transition' />
              <span>Allow section selection</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
            <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 4:</span> See the number of slots
          </div>
          <div className='bg-background rounded-[10px] shadow-md p-4 h-[233px] overflow-y-auto'>
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
                    scheduleData.schoolCapacity.remainingSlots,
                    scheduleData.schoolCapacity.totalCapacity
                  )
                }`}>
                  {scheduleData.schoolCapacity.remainingSlots} slots
                </div>
              </div>
              <div className='flex flex-col text-center'>
                <div className='text-sm text-text'>Total School Capacity</div>
                <div className='text-lg font-semibold text-primary bg-accent/20 rounded-[10px] py-1'>
                  {scheduleData.schoolCapacity.totalCapacity} slots
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='rounded-[10px] bg-[#EFAA15]/20 px-2 py-2 text-sm font-semibold text-primary'>
            <span className='mr-2 rounded-[15px] bg-white px-2 py-1 font-bold'>Step 5:</span> Publish enrollment schedule
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
            <div className='flex gap-6'>
              <div className=''>
                <div className='flex-1'>
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
                </div>
                <div className='flex gap-2 mt-4'>
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
              <div className='flex-1'>
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
