import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, ChevronDown, Check, X } from 'lucide-react';
import { requestData } from '@/lib/dataRequester';
import { toast } from 'react-toastify';

// Type definitions based on your data structure
interface Requirement {
  requirementId: number;
  name: string;
  type: string;
  dataType: string;
  isRequired: boolean;
  description: string;
}

interface GradeLevel {
  gradeSectionProgramId: number;
  gradeLevelOfferedId: number;
  gradeLevel: string;
  gradeLevelCode: string;
  requirements: Requirement[];
}

// Toast notification interface
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Enhanced Dropdown component
interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface RequirementChanges {
  modified: Requirement[];
  added: Requirement[];
}

const Dropdown: React.FC<DropdownProps> = ({ 
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        className="w-full flex items-center justify-between border-1 border-gray-500 bg-gray-50 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <ul className="py-1" role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 ${
                  value === option.value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                }`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={value === option.value}
              >
                <div className="flex items-center">
                  <span className={`block truncate ${value === option.value ? 'font-medium' : 'font-normal'}`}>
                    {option.label}
                  </span>
                </div>

                {value === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Toast component
const Toast: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose, toast.id]);

  const getBgColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-100 border-green-500 text-green-800';
      case 'error': return 'bg-red-100 border-red-500 text-red-800';
      case 'info': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className={`${getBgColor()} border-l-4 p-4 rounded shadow-md flex justify-between items-center mb-2 animate-fade-in`}>
      <p className="font-medium">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="ml-4">
        <X size={18} className="hover:text-gray-600" />
      </button>
    </div>
  );
};

// Toast container component - Moved to top-right
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

const Requirements = () => {
  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [changes, setChanges] = useState<RequirementChanges>({
    modified: [],
    added: []
  });

  // Function to add a toast
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, type, message }]);
  };

  // Function to remove a toast
  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // State for grade levels from your data
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  
  // State to track active grade level ID
  const [activeGradeId, setActiveGradeId] = useState<number>(4); // Default to Grade 11
  
  // State to track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const retrieveRequirements = async () => {
    try {
      setIsLoading(true);
      
      const response = await requestData<GradeLevel[]>({
        url: 'http://localhost:3000/api/requirements/retrieve',
        method: 'GET',
      });

      if (response) {
        setGradeLevels(response);
        if (response.length > 0) {
          setActiveGradeId(response[0].gradeLevelOfferedId);
        }
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('An error occurred');

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveRequirements();
  }, []);
  
  // Get the current requirements for the active grade
  const activeGrade = gradeLevels.find(grade => grade.gradeLevelOfferedId === activeGradeId);
  const requirements = activeGrade?.requirements || [];

  // Handle grade level selection
  const handleGradeLevelClick = (gradeId: number) => {
    // Check if there are unsaved changes and confirm before changing grades
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        "You have unsaved changes. Are you sure you want to switch grades without saving?"
      );
      if (!confirmChange) {
        return; // Don't change grades if the user cancels
      }
    }
    
    // Update active grade ID
    setActiveGradeId(gradeId);
  };

  // Add a new requirement
  const addRequirement = () => {
    const newRequirement: Requirement = {
      requirementId: 0, // 0 indicates a new, unsaved requirement
      name: '',
      type: 'document',
      dataType: 'document',
      isRequired: false,
      description: ''
    };
    
    setGradeLevels(prevLevels => 
      prevLevels.map(grade => 
        grade.gradeLevelOfferedId === activeGradeId
          ? {
              ...grade,
              requirements: [...grade.requirements, {...newRequirement}] // Create new object
            }
          : grade
      )
    );
  
    // Track the addition separately
    setChanges(prev => ({
      ...prev,
      added: [...prev.added, {...newRequirement}] // Create new object
    }));
    
    setHasUnsavedChanges(true);
  };

  const deleteRequirementOnServer = async (requirementId: number) => {
    console.log('requirementId: ', requirementId);
    try {
      console.log(`Deleting requirement with ID: ${requirementId} from server`);
      const response = await requestData<{message: string}>({
        url: `http://localhost:3000/api/requirements/delete/${requirementId}`,
        method: 'DELETE',
      });
      
      if (response){
        //await retrieveRequirements();
        toast.success(response.message);
        return true;
      }
      //addToast('success', 'Requirement deleted successfully');
      //return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Failed to delete requirement');
      
      console.error('Failed to delete requirement:', error);
      //addToast('error', 'Failed to delete requirement');
      return false;
    }
  };

  // Delete a requirement
  const deleteRequirement = async (index: number) => {
    const requirement = requirements[index];
    
    if (requirement.requirementId) {
      // Requirement exists on server - delete immediately
      const success = await deleteRequirementOnServer(requirement.requirementId);
      
      if (!success) {
        // If deletion failed, don't remove from local state
        return;
      }
    }
  
    // Remove from local state whether it was a server item or local-only
    setGradeLevels(prevLevels => 
      prevLevels.map(grade => 
        grade.gradeLevelOfferedId === activeGradeId
          ? {
              ...grade,
              requirements: grade.requirements.filter((_, i) => i !== index)
            }
          : grade
      )
    );
  
    setHasUnsavedChanges(true);
  };

  // Update requirement field
  // eslint-disable-next-line
  const updateRequirement = (index: number, field: keyof Requirement, value: any) => {
    const requirement = requirements[index];
    const updatedRequirement = { ...requirement, [field]: value };
  
    // Update local state
    setGradeLevels(prevLevels => 
      prevLevels.map(grade => 
        grade.gradeLevelOfferedId === activeGradeId
          ? {
              ...grade,
              requirements: grade.requirements.map((req, i) => 
                i === index ? updatedRequirement : req
              )
            }
          : grade
      )
    );
  
    // Track changes
    if (requirement.requirementId) {
      // Existing requirement being modified
      setChanges(prev => {
        const existingModified = prev.modified.find(r => r.requirementId === requirement.requirementId);
        return {
          ...prev,
          modified: existingModified
            ? prev.modified.map(r => r.requirementId === requirement.requirementId ? updatedRequirement : r)
            : [...prev.modified, updatedRequirement]
        };
      });
    } else {
      // New requirement being modified before saving
      setChanges(prev => {
        const existingAddedIndex = prev.added.findIndex(r => 
          r === requirement || // Compare references
          (r.name === requirement.name && r.description === requirement.description) // Fallback comparison
        );
        
        if (existingAddedIndex >= 0) {
          const updatedAdded = [...prev.added];
          updatedAdded[existingAddedIndex] = updatedRequirement;
          return {
            ...prev,
            added: updatedAdded
          };
        }
        
        return prev;
      });
    }
  
    setHasUnsavedChanges(true);
  };

  const processNewData = () => {
    const selectedGradeSectionProgram = gradeLevels.find(grade => grade.gradeLevelOfferedId === activeGradeId);
    console.log('requirements: ', requirements);
    console.log('gradeSectionProgramId: ', selectedGradeSectionProgram);
    console.log('changes: ', changes);
    console.log('gradeLevels: ', gradeLevels);

    if (selectedGradeSectionProgram){
      const requirementsData = {
        gradeSectionProgramId: selectedGradeSectionProgram.gradeSectionProgramId,
        requirements: changes.added.map(newReq => ({
          name: newReq.name,
          type: newReq.type,
          dataType: newReq.dataType,
          isRequired: newReq.isRequired,
          description: newReq.description
        })),
      };
      console.log('requirementsData: ', requirementsData);

      return requirementsData;
    }

    return null;
  }

  const createRequirements = async () => {
    try {
      const requirementsData = processNewData();
      
      if (!requirementsData) {
        toast.error('No requirements to create');
        return;
      }

      console.log('requirementsData: ', requirementsData);
      
      const response = await requestData<{message: string}>({
        url: 'http://localhost:3000/api/requirements/process-received-requirements',
        method: 'POST',
        body: requirementsData
      });

      if (response){
        toast.success(response.message);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('Failed to create requirements');

      console.error('Failed to create requirements:', error);
    }
  }

  // Handle form submission
  const saveRequirements = async () => {
    try {
      setIsLoading(true);
      
      console.log('Changes to be saved:', {
        modifications: changes.modified,
        additions: changes.added
      });
  
      // Validate data
      const hasEmptyNames = gradeLevels.some(grade => 
        grade.requirements.some(req => !req.name.trim())
      );
  
      if (hasEmptyNames) throw new Error('All requirements must have a name');
  
      const hasEmptyDescriptions = gradeLevels.some(grade => 
        grade.requirements.some(req => !req.description.trim())
      );
  
      if (hasEmptyDescriptions) throw new Error('All requirements must have a description');
      
      // Process additions
      if (changes.added.length > 0) {
        console.log('Adding requirements:', changes.added);
        await createRequirements();
        
        // Refresh requirements after successful additions
        await retrieveRequirements();
      }
  
      // Process modifications
      if (changes.modified.length > 0) {
        await updateData(changes.modified);
      }
  
      // Reset changes after successful save
      setChanges({
        modified: [],
        added: []
      });
      
      setHasUnsavedChanges(false);
      setIsLoading(false);
      addToast('success', 'Requirements saved successfully!');
      
    } catch (error) {
      setIsLoading(false);
      addToast('error', error instanceof Error ? error.message : 'Failed to save requirements');
    }
  };

  const updateData = async (data: Requirement[]) => {
    try {
      const finalData = {
        data: data,
      };
      const response = await requestData<{message: string}>({
        url: 'http://localhost:3000/api/requirements/update',
        method: 'PUT',
        body: finalData,
      });

      if (response) {
        toast.success('Requirements updated successfully');
        return response;
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('An error occurred');
      console.log(error);
    }
  }

  // Type options for dropdown
  const typeOptions: DropdownOption[] = [
    { value: 'document', label: 'Document' },
    { value: 'image', label: 'Image' },
    { value: 'text', label: 'Text' }
  ];

  // Data type options for dropdown
  const dataTypeOptions: DropdownOption[] = [
    { value: 'document', label: 'Document' },
    { value: 'image', label: 'Image' },
    { value: 'text', label: 'Text' }
  ];

  return (
    <div className="bg-gray-100 p-4">
      {/* Toast Container - Moved to top-right */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="flex gap-4 max-w-6xl mx-auto">
        {/* Grade selection panel */}
        <div className="bg-white rounded-lg shadow w-1/3 h-[480px]">
          <div className="border-r-2 border-gray-200 px-3 py-3 h-full">
            <h2 className="text-gray-700 font-semibold mt-5 ml-5 text-base">GRADE LEVELS</h2>
            <ul className="mt-4">
              {gradeLevels.map((grade) => (
                <li
                  key={grade.gradeLevelOfferedId}
                  className={`text-gray-800 flex cursor-pointer flex-col ml-5 gap-y-2 rounded-full px-3 py-1 text-md hover:scale-105 hover:bg-blue-100 transition-all ${
                    activeGradeId === grade.gradeLevelOfferedId ? "bg-accent text-white font-semibold" : ""
                  }`}
                  onClick={() => handleGradeLevelClick(grade.gradeLevelOfferedId)}
                >
                  {grade.gradeLevel}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Requirements configuration panel */}
        <div className="bg-white rounded-lg shadow w-2/3 p-4">
          <div className="mb-4">
            <div className="flex items-center gap-4 px-2 mt-5 mb-2">
              <div className="w-10"></div>
              <div className="flex-1 font-semibold text-gray-900">Requirement Name</div>
              <div className="w-36 font-semibold text-gray-900">Type</div>
              <div className="w-36 font-semibold text-gray-900">Data Type</div>
              <div className="w-20 font-semibold text-gray-900 text-center">Required</div>
            </div>

            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-4 mb-3">
                <div className="w-10 flex justify-center">
                  <button 
                    className="p-3 text-red-600 border-1 h-10 w-11 border-gray-500 bg-gray-100 rounded-md hover:bg-gray-300"
                    onClick={async () => await deleteRequirement(index)}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={req.name}
                    onChange={e => updateRequirement(index, 'name', e.target.value)}
                    placeholder="Enter name (e.g. BC, F137)"
                    className="w-full px-3 py-2 border-1 border-gray-500 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                  <input
                    type="text"
                    value={req.description}
                    onChange={e => updateRequirement(index, 'description', e.target.value)}
                    placeholder="Enter description"
                    className="w-full mt-1 px-3 py-2 border-1 border-gray-500 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <div className="w-36">
                  <Dropdown
                    options={typeOptions}
                    value={req.type}
                    onChange={(value) => updateRequirement(index, 'type', value)}
                    className="w-full"
                  />
                </div>
                <div className="w-36">
                  <Dropdown
                    options={dataTypeOptions}
                    value={req.dataType}
                    onChange={(value) => updateRequirement(index, 'dataType', value)}
                    className="w-full"
                  />
                </div>
                <div className="w-20 flex justify-center">
                  <div className={`w-10 h-10 rounded-md border-1 border-gray-500 flex items-center justify-center ${req.isRequired ? 'bg-gray-200 border-gray-300' : 'border-gray-300'}`}>
                    {req.isRequired && <Check size={20} className="text-gray-500" />}
                    <input
                      type="checkbox"
                      checked={req.isRequired}
                      onChange={e => updateRequirement(index, 'isRequired', e.target.checked)}
                      className="opacity-0 absolute w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="w-full py-3 flex items-center justify-center  bg-gray-100 hover:bg-gray-200 rounded-md mb-4 border-2 border-gray-400 text-gray-700"
            onClick={addRequirement}
          >
            <PlusCircle size={20} className="mr-2 text-blue-500" />
            <span>add another requirement</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <button
          onClick={saveRequirements}
          disabled={isLoading || !hasUnsavedChanges}
          className={`px-6 py-3 rounded-md font-medium flex items-center ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : !hasUnsavedChanges
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-accent hover:bg-primary text-white'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Requirements'
          )}
        </button>
      </div>
    </div>
  );
};

export default Requirements;