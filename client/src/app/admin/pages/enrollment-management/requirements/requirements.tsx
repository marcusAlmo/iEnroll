import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, ChevronDown, Check, X } from 'lucide-react';

// Type definitions
interface Requirement {
  id: string;
  name: string;
  type: 'Input Field' | 'Image' | 'Documents';
  acceptedTypes: string[];
  required: boolean;
}

interface GradeOption {
  id: string;
  label: string;
  selected: boolean;
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

  // Function to add a toast
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, type, message }]);
  };

  // Function to remove a toast
  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // State for grade options
  const [grades, setGrades] = useState<GradeOption[]>([
    { id: '1', label: 'Grade 1', selected: true },
    { id: '2', label: 'Grade 2', selected: false },
    { id: '3', label: 'Grade 3', selected: false },
    { id: '4', label: 'Grade 4', selected: false },
    { id: '5', label: 'Grade 5', selected: false },
    { id: '6', label: 'Grade 6', selected: false },
    { id: '7', label: 'Grade 7', selected: false },
    { id: '8', label: 'Grade 8', selected: false },
    { id: '9', label: 'Grade 9', selected: false },
    { id: '10', label: 'Grade 10', selected: false },
    { id: '11', label: 'Grade 11', selected: false }
  ]);

  // State for requirements and their mapping to grades
  const [gradeRequirements, setGradeRequirements] = useState<{[gradeId: string]: Requirement[]}>({
    '1': [
      {
        id: '1',
        name: 'First Name',
        type: 'Input Field',
        acceptedTypes: ['Number'],
        required: true
      }
    ]
  });
  
  // State to track active grade ID
  const [activeGradeId, setActiveGradeId] = useState<string>('1');
  
  // State to track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get the current requirements for the active grade
  const requirements = gradeRequirements[activeGradeId] || [];

  // Handle grade level selection
  const handleGradeLevelClick = (gradeId: string, gradeLabel: string) => {
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
    
    // Initialize the requirements array for this grade if it doesn't exist yet
    if (!gradeRequirements[gradeId]) {
      setGradeRequirements({
        ...gradeRequirements,
        [gradeId]: []
      });
    }
  };

  // Add a new requirement
  const addRequirement = () => {
    const currentRequirements = gradeRequirements[activeGradeId] || [];
    const newRequirement: Requirement = {
      id: (currentRequirements.length + 1).toString(),
      name: '',
      type: 'Input Field',
      acceptedTypes: ['Number'],
      required: false
    };
    
    setGradeRequirements({
      ...gradeRequirements,
      [activeGradeId]: [...currentRequirements, newRequirement]
    });
    
    setHasUnsavedChanges(true);
  };

  // Delete a requirement
  const deleteRequirement = (id: string) => {
    const updatedRequirements = requirements.filter(req => req.id !== id);
    setGradeRequirements({
      ...gradeRequirements,
      [activeGradeId]: updatedRequirements
    });
    
    setHasUnsavedChanges(true);
  };

  // Update requirement field
  const updateRequirement = (id: string, field: keyof Requirement, value: any) => {
    const updatedRequirements = requirements.map(req => 
      req.id === id ? { ...req, [field]: value } : req
    );
    
    setGradeRequirements({
      ...gradeRequirements,
      [activeGradeId]: updatedRequirements
    });
    
    setHasUnsavedChanges(true);
  };

  // Handle form submission
  const saveRequirements = async () => {
    try {
      // Begin saving - update status
      setIsLoading(true);

      // Validate data before saving
      const gradesToSave = Object.keys(gradeRequirements);
      if (gradesToSave.length === 0) {
        throw new Error('No requirements to save');
      }
      
      // Check if there are any empty requirement names
      let hasEmptyNames = false;
      Object.values(gradeRequirements).forEach(reqs => {
        reqs.forEach(req => {
          if (!req.name.trim()) {
            hasEmptyNames = true;
          }
        });
      });
      
      if (hasEmptyNames) {
        throw new Error('All requirements must have a name');
      }

      // Create the data object to send to API
      const dataToSave = {
        grades: grades.filter(g => Object.keys(gradeRequirements).includes(g.id)),
        requirements: gradeRequirements
      };
      
      console.log('Saving requirements:', dataToSave);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an actual API call
      // const response = await fetch('/api/requirements', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dataToSave)
      // });
      
      // if (!response.ok) throw new Error('Failed to save requirements');

      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      setIsLoading(false);

      // Show success toast
      addToast('success', 'Requirements saved successfully!');
      
    } catch (error) {
      setIsLoading(false);
      
      // Show error toast
      addToast('error', error instanceof Error ? error.message : 'Failed to save requirements');
    }
  };

  // Get available accepted types based on type
  const getAcceptedTypeOptionsForDropdown = (type: string): DropdownOption[] => {
    switch (type) {
      case 'Input Field':
        return [
          { value: 'Number', label: 'Number' },
          { value: 'Text', label: 'Text' }
        ];
      case 'Image':
        return [
          { value: 'PNG', label: 'PNG' },
          { value: 'JPEG', label: 'JPEG' }
        ];
      case 'Documents':
        return [
          { value: 'PDF', label: 'PDF' }
        ];
      default:
        return [];
    }
  };
  
  // Type options for dropdown
  const typeOptions: DropdownOption[] = [
    { value: 'Input Field', label: 'Input Field' },
    { value: 'Image', label: 'Image' },
    { value: 'Documents', label: 'Documents' }
  ];

  return (
    <div className="bg-gray-100 p-4">
      {/* Toast Container - Moved to top-right */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="flex gap-4 max-w-6xl mx-auto">
        {/* Grade selection panel - New layout from GradeLevels component */}
        <div className="bg-white rounded-lg shadow w-1/3 h-[480px]">
          <div className="border-r-2 border-gray-200 px-3 py-3 h-full">
            <h2 className="text-gray-700 font-semibold mt-5 ml-5 text-base">GRADE LEVELS</h2>
            <ul className="mt-4">
              {grades.map((grade) => (
                <li
                  key={grade.id}
                  className={`text-gray-800 flex cursor-pointer flex-col ml-5 gap-y-2 rounded-full px-3 py-1 text-md hover:scale-105 hover:bg-blue-100 transition-all ${
                    activeGradeId === grade.id ? "bg-accent text-white font-semibold" : ""
                  }`}
                  onClick={() => handleGradeLevelClick(grade.id, grade.label)}
                >
                  {grade.label}
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
              <div className="w-36 font-semibold text-gray-900">Accepted types</div>
              <div className="w-20 font-semibold text-gray-900 text-center">Required</div>
            </div>

            {requirements.map(req => (
              <div key={req.id} className="flex items-center gap-4 mb-3">
                <div className="w-10 flex justify-center">
                  <button 
                    className="p-3 text-red-600 border-1 h-10 w-11  border-gray-500 bg-gray-100 rounded-md hover:bg-gray-300"
                    onClick={() => deleteRequirement(req.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={req.name}
                    onChange={e => updateRequirement(req.id, 'name', e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border-1 border-gray-500 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <div className="w-36">
                  <Dropdown
                    options={typeOptions}
                    value={req.type}
                    onChange={(value) => updateRequirement(req.id, 'type', value)}
                    className="w-full"
                  />
                </div>
                <div className="w-36 ">
                  <Dropdown
                    options={getAcceptedTypeOptionsForDropdown(req.type)}
                    value={req.acceptedTypes[0] || ""}
                    onChange={(value) => updateRequirement(req.id, 'acceptedTypes', [value])}
                    className="w-full  "
                  />
                </div>
                <div className="w-20 flex justify-center">
                  <div className={`w-10 h-10 rounded-md border-1 border-gray-500 flex items-center justify-center ${req.required ? 'bg-gray-200 border-gray-300' : 'border-gray-300'}`}>
                    {req.required && <Check size={20} className="text-gray-500" />}
                    <input
                      type="checkbox"
                      checked={req.required}
                      onChange={e => updateRequirement(req.id, 'required', e.target.checked)}
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
            <span>add another section</span>
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