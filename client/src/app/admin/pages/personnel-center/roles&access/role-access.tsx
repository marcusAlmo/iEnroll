import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormResetContext } from "@/app/admin/pages/personnel-center/PersonnelCenter";
import { toast } from "react-hot-toast";
import { requestData } from "@/lib/dataRequester";

// Zod schema for validation
const schema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  suffix: z.string().optional(),
  sex: z.string().min(1, { message: "Sex is required" }),
  phoneNumber: z.string().min(10, { message: "Phone Number must be at least 10 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  username: z.string().min(3, { message: "Username is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).nullable(),
  // Add schema for role management
  role: z.enum(['admin', 'registrar']).optional(),
  accessPermissions: z.object({
    dashboard: z.object({
      view: z.boolean().optional(),
      canMakeChanges: z.boolean().optional(),
    }),
    enrollmentReview: z.object({
      view: z.boolean().optional(),
      canMakeChanges: z.boolean().optional(),
    }),
    enrollmentManagement: z.object({
      view: z.boolean().optional(),
      canMakeChanges: z.boolean().optional(),
    }),
    personnelCenter: z.object({
      view: z.boolean().optional(),
      canMakeChanges: z.boolean().optional(),
    }),
    settings: z.object({
      view: z.boolean().optional(),
      canMakeChanges: z.boolean().optional(),
    }),
  }),
});

interface Personnel {
  userId: number;
  name: string;
  role: string;
}

type FormData = z.infer<typeof schema>;
type ServerPersonnelResponse = {
  profileSettings: {
    personalInformation: {
      fName: string;
      mName: string;
      lName: string;
      suffix: string;
      gender: string;
    };
    contactInformation: {
      phone: string;
    };
  };
  accountSettings: {
    username: string;
    email: string;
  };
  roleManagement: {
    role: 'admin' | 'registrar';
    dashboardAccess: 'other' | 'view' | 'edit';
    enrollmentReview: 'other' | 'view' | 'edit';
    enrollmentManagement: 'other' | 'view' | 'edit';
    personnelCenter: 'other' | 'view' | 'edit';
    systemSettings: 'other' | 'view' | 'edit';
  };
};

const CustomInput = ({
  label,
  placeholder,
  type = "text",
  register,
  name,
  errorMessage,
  inputStyle = "w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]",
  labelStyle = "block text-sm font-semibold"
}: {
  label: string;
  placeholder: string;
  type?: string;
  register: any;
  name: string;
  errorMessage?: string;
  inputStyle?: string;
  labelStyle?: string;
}) => (
  <div>
    <label className={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className={inputStyle}
    />
    {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
  </div>
);

const SelectInput = ({
  label,
  options,
  register,
  name,
  errorMessage,
  selectStyle = "w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]",
  labelStyle = "block text-sm font-semibold"
}: {
  label: string;
  options: string[];
  register: any;
  name: string;
  errorMessage?: string;
  selectStyle?: string;
  labelStyle?: string;
}) => (
  <div>
    <label className={labelStyle}>{label}</label>
    <select 
      {...register(name)} 
      className={selectStyle}
    >
      {options.map((option, idx) => (
        <option key={idx}>{option}</option>
      ))}
    </select>
    {errorMessage && <p className="text-red-500 text-xs mt-1 break-words max-w-full">{errorMessage}</p>}
  </div>
);

interface RolesAccessProps {
  selectedPersonnel?: Personnel | null;
  onSave: () => void;
  searchQuery?: string;
  isAddingNewPersonnel: boolean;
  setIsAddingNewPersonnel: (value: boolean) => void;
}

const RolesAccess: React.FC<RolesAccessProps> = ({ selectedPersonnel, onSave, searchQuery, isAddingNewPersonnel, setIsAddingNewPersonnel }) => {
  const [activeTab, setActiveTab] = useState("profile-settings");
  const { shouldResetForm, setShouldResetForm } = useContext(FormResetContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      sex: "male",
      phoneNumber: "",
      email: "",
      username: "",
      password: null,
      role: undefined,
      accessPermissions: {
        dashboard: { view: false, canMakeChanges: false },
        enrollmentReview: { view: false, canMakeChanges: false },
        enrollmentManagement: { view: false, canMakeChanges: false },
        personnelCenter: { view: false, canMakeChanges: false },
        settings: { view: false, canMakeChanges: false }
      }
    }
  });

  // Effect to reset the form when shouldResetForm changes to true
  useEffect(() => {
    if (shouldResetForm) {
      reset();
      setActiveTab("profile-settings");
      setShouldResetForm(false);
      
      // Show toast notification
      toast.success("You can now add new personnel details", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
          borderRadius: "10px",
          padding: "16px"
        }
      });
    }
  }, [shouldResetForm, reset, setShouldResetForm]);

  const mapAccessTypeToForm = (accessType: string) => {
    switch (accessType) {
      case 'other':
        return { view: false, canMakeChanges: false };
      case 'read':
        return { view: true, canMakeChanges: false };
      case 'modify':
        return { view: true, canMakeChanges: true };
      default:
        return { view: false, canMakeChanges: false };
    }
  };

  const fetchPersonnelInfo = async (userId: number) => {
    try {
      console.log(selectedPersonnel)
      console.log(userId)
      const data = await requestData<ServerPersonnelResponse>({
        url: `http://localhost:3000/api/profile-settings/get-employee-info/${userId}`,
        method: 'GET'
      });

      if (data) {
        setValue('firstName', data.profileSettings.personalInformation.fName);
        setValue('middleName', data.profileSettings.personalInformation.mName);
        setValue('lastName', data.profileSettings.personalInformation.lName);
        setValue('suffix', data.profileSettings.personalInformation.suffix);
        setValue('sex', data.profileSettings.personalInformation.gender);
        setValue('phoneNumber', data.profileSettings.contactInformation.phone);        
        setValue('username', data.accountSettings.username);
        setValue('email', data.accountSettings.email);

        // Map role
        setValue('role', data.roleManagement.role);

        setValue('accessPermissions.dashboard', 
          mapAccessTypeToForm(data.roleManagement.dashboardAccess));
        setValue('accessPermissions.enrollmentReview', 
          mapAccessTypeToForm(data.roleManagement.enrollmentReview));
        setValue('accessPermissions.enrollmentManagement', 
          mapAccessTypeToForm(data.roleManagement.enrollmentManagement));
        setValue('accessPermissions.personnelCenter', 
          mapAccessTypeToForm(data.roleManagement.personnelCenter));
        setValue('accessPermissions.settings', 
          mapAccessTypeToForm(data.roleManagement.systemSettings));

        toast.success("Personnel data loaded");
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An error occurred while fetching personnel info");

      console.log(err);
    }
  }

  useEffect(() => {
    if (selectedPersonnel?.userId) {
      fetchPersonnelInfo(selectedPersonnel.userId);
    }
  }, [selectedPersonnel, setValue]);

  // Effect to populate form with selected personnel data
  useEffect(() => {
    if (selectedPersonnel) {
      // Using setValue for each field
      Object.entries(selectedPersonnel).forEach(([key, value]) => {
        if (key === 'address' || key === 'role' || key === 'accessPermissions') {
          // For nested objects, set each field individually
          if (value && typeof value === 'object') {
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (typeof nestedValue === 'object') {
                // For deeply nested objects like accessPermissions.dashboard
                Object.entries(nestedValue).forEach(([deepKey, deepValue]) => {
                  // eslint-disable-next-line
                  setValue(`${key}.${nestedKey}.${deepKey}` as any, deepValue);
                });
              } else {
                // eslint-disable-next-line
                setValue(`${key}.${nestedKey}` as any, nestedValue);
              }
            });
          }
        } else {
          // eslint-disable-next-line
          setValue(key as any, value);
        }
      });

      toast.success("Personnel data loaded", {
        duration: 2000,
        position: "top-right"
      });
    }
  }, [selectedPersonnel, setValue]);

  // Effect to handle search
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      // This would typically call a backend API to search
      // For now, just showing a toast to indicate search is working
      toast(`Searching for: ${searchQuery}`, {
        duration: 2000,
        position: "top-right"
      });
    }
  }, [searchQuery]);

  // detects when user clicked the add new employee
  useEffect(() => {
    if (isAddingNewPersonnel) {
      reset();
    }
  }, [isAddingNewPersonnel, reset]);


  const profileSettingSubmit = async (data: FormData) => {
    const response = await requestData<{ message: string }>({
      url: `http://localhost:3000/api/profile-settings/update-employee-info/${selectedPersonnel?.userId}`,
      method: 'PUT',
      body: {
        fName: data.firstName,
        mName: data.middleName,
        lName: data.lastName,
        suffix: data.suffix,
        gender: data.sex,
        phone: data.phoneNumber
      }
    });

    if (response) toast.success(response.message);
  }

  const accountSettingSubmit = async (data: FormData) => {
    const response = await requestData<{ message: string }>({
      url: `http://localhost:3000/api/account-settings/update-account-settings/${selectedPersonnel?.userId}`,
      method: 'PUT',
      body: {
        username: data.username,
        email: data.email
      }
    });

    if (response) toast.success(response.message);
  }

  const roleManagementSubmit = async (data: FormData) => {
    let dashboardAccess: string = '';
    let enrollmentManagementAccess: string = '';
    let enrollmentReviewAccess: string = '';
    let personnelCenterAccess: string = '';
    let systemSettingsAccess: string = '';

    if (data.accessPermissions.dashboard.canMakeChanges) dashboardAccess = 'modify';
    else dashboardAccess = 'read';

    if (data.accessPermissions.enrollmentManagement.canMakeChanges) enrollmentManagementAccess = 'modify';
    else enrollmentManagementAccess = 'read';

    if (data.accessPermissions.enrollmentReview.canMakeChanges) enrollmentReviewAccess = 'modify';
    else enrollmentReviewAccess = 'read';

    if (data.accessPermissions.personnelCenter.canMakeChanges) personnelCenterAccess = 'modify';
    else personnelCenterAccess = 'read';

    if (data.accessPermissions.settings.canMakeChanges) systemSettingsAccess = 'modify';
    else systemSettingsAccess = 'read';

    const response = await requestData<{ message: string }>({
      url: `http://localhost:3000/api/role-management/update-role-management/${selectedPersonnel?.userId}`,
      method: 'PUT',
      body: {
        role: data.role,
        dashboardAccess: dashboardAccess,
        enrollmentManagement: enrollmentManagementAccess,
        enrollmentReview: enrollmentReviewAccess,
        personnelCenter: personnelCenterAccess,
        systemSettings: systemSettingsAccess
      }
    });

    if (response) toast.success(response.message);
  }

  const updatePassword = async (password: string) => {
    const response = await requestData<{ message: string }>({
      url: `http://localhost:3000/api/account-settings/update-password/${selectedPersonnel?.userId}`,
      method: 'PUT',
      body: {
        password
      }
    });

    if (response) toast.success(response.message);
  }

  const createNewAccount = async (data: FormData) => {
    // Handle new personnel creation
    const response = await requestData<{ message: string }>({
      url: "http://localhost:3000/api/profile-settings/create-employee",
      method: "POST",
      body: {
        username: data.username,
        email: data.email,
        password: data.password,
        fName: data.firstName,
        mName: data.middleName,
        lName: data.lastName,
        suffix: data.suffix,
        gender: data.sex,
        phone: data.phoneNumber,
      }
    });

    if (response) {
      toast.success("New personnel created successfully");
      reset();
      setIsAddingNewPersonnel(false);
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (isAddingNewPersonnel) {
        await createNewAccount(data);
      } else {
        // Existing update logic
        if (activeTab === "profile-settings") {
          await profileSettingSubmit(data);
        } else if (activeTab === "account-settings") {
          await accountSettingSubmit(data);
        } else if (activeTab === "role-management") {
          await roleManagementSubmit(data);
        }
      }
      onSave();
    } catch (error) {
      toast.error("Failed to save");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  // Function to handle password change
  const handlePasswordChange = () => {
    const passwordValue = document.querySelector('input[name="password"]') as HTMLInputElement;
    console.log(passwordValue.value)
    if (passwordValue && passwordValue.value.length >= 8)
      updatePassword(passwordValue.value);
    else {
      toast.error("Password must be at least 8 characters", {
        duration: 3000,
        position: "top-right"
      });
    }
  };

  return (
    <div className="bg-white min-h-full rounded-lg shadow p-6">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`${activeTab === "profile-settings" 
            ? "bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background" 
            : "bg-background py-2 px-6 rounded-[10px] text-text-2 transition duration-300 hover:bg-accent hover:text-background"}`}
          onClick={() => setActiveTab("profile-settings")}
        >
          Profile Settings
        </button>
        <button
          className={`${activeTab === "account-settings" 
            ? "bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background" 
            : "bg-background py-2 px-6 rounded-[10px] text-text-2 transition duration-300 hover:bg-accent hover:text-background"}`}
          onClick={() => setActiveTab("account-settings")}
        >
          Account Settings
        </button>
        <button
          className={`${activeTab === "role-management" 
            ? "bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background" 
            : "bg-background py-2 px-6 rounded-[10px] text-text-2 transition duration-300 hover:bg-accent hover:text-background"}`}
          onClick={() => setActiveTab("role-management")}
        >
          Role Management
        </button>
      </div>

      {/* Form Content for Profile Settings */}
      {activeTab === "profile-settings" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 mt-4">
            {isAddingNewPersonnel && (
              <div className="mb-6">
                <h2 className="text-accent font-medium text-lg mb-3">Account Information</h2>
                <div className="flex mb-4">
                  <div className="w-80 pr-2">
                    <CustomInput
                      label="Username"
                      placeholder="Enter username"
                      register={register}
                      name="username"
                      errorMessage={errors.username?.message}
                    />
                  </div>
                  <div className="w-80 ml-5 px-2">
                    <CustomInput
                      label="Email"
                      placeholder="Enter email"
                      type="email"
                      register={register}
                      name="email"
                      errorMessage={errors.email?.message}
                    />
                  </div>
                </div>
                <div className="w-80 pr-2">
                  <CustomInput
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    register={register}
                    name="password"
                    errorMessage={errors.password?.message}
                  />
                </div>
              </div>
            )}
            <h2 className="text-accent font-medium text-lg mb-3">Personal Information</h2>
            
            {/* Row 1: First Name, Middle Name, Birthdate (with gap) */}
            <div className="flex mb-4">
              <div className="w-80 pr-2">
                <CustomInput
                  label="First Name"
                  placeholder="Jack Daniels"
                  register={register}
                  name="firstName"
                  errorMessage={errors.firstName?.message}
                />
              </div>
              <div className="w-80 ml-5 px-2">
                <CustomInput
                  label="Middle Name (optional)"
                  placeholder="Jack Daniels"
                  register={register}
                  name="middleName"
                />
              </div>
            </div>
            
            {/* Row 2: Last Name, Suffix, Sex at Birth (with gap) */}
            <div className="flex mb-4">
              <div className="w-80 pr-2">
                <CustomInput
                  label="Last Name"
                  placeholder="Jack Daniels"
                  register={register}
                  name="lastName"
                  errorMessage={errors.lastName?.message}
                />
              </div>
              <div className="w-80 ml-5 px-2">
                <CustomInput
                  label="Suffix (optional)"
                  placeholder="Jack Daniels"
                  register={register}
                  name="suffix"
                />
              </div>
              <div className="w-80 ml-30">
                <SelectInput
                  label="Sex at Birth"
                  options={["male", "female"]}
                  register={register}
                  name="sex"
                  errorMessage={errors.sex?.message}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-accent font-medium text-lg mb-3">Contact Information</h2>

            {/* Row 1: Phone Number, Email (2 columns) */}
            <div className="flex mb-4">
              <div className="w-67 pr-2">
                <CustomInput
                  label="Phone Number"
                  placeholder="0912 567 7890"
                  register={register}
                  name="phoneNumber"
                  errorMessage={errors.phoneNumber?.message}
                />
              </div>
            </div>
          </div>

          {!isAddingNewPersonnel && (
            <>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            </>
          )}

          <div className="flex mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          </div>
        </form>
      )}  

      {/* Form Content for Account Settings */}
      {activeTab === "account-settings" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-accent font-semibold text-lg mb-3">Update Username & Email</h2>
          </div>
          <div className="flex grid-cols-2 mb-4">
            <div className="w-80 pr-2">
              <CustomInput
                label="Username"
                placeholder="jackDaniel"
                register={register}
                name="username"
                errorMessage={errors.username?.message}
              />
            </div>
            <div className="w-100 pl-2">
              <CustomInput
                label="Email"
                placeholder="jackDanielSanMiguel@gmail.com"
                type="email"
                register={register}
                name="email"
                errorMessage={errors.email?.message}
              />
            </div>
          </div>
          
          <div className="mt-6 mb-4">
            <h2 className="text-accent font-semibold text-lg mb-3">Update Password</h2>
            <div className="flex grid-cols-2">
              <div className="w-82 pr-4">
                <CustomInput
                  label=""
                  placeholder="*********"
                  type="password"
                  register={register}
                  name="password"
                  errorMessage={errors.password?.message}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="bg-success py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex mt-67">
            <button
              type="submit"
              className="bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
            >
              Save changes
            </button>
          </div>
        </form>
      )}

      {/* Form Content for Role Management */}
      {activeTab === "role-management" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Access List Section */}
          <div className="mb-8">
            <h2 className="text-accent text-lg font-semibold mb-2">Access List</h2>
            <div className="bg-gray-50 p-3 rounded-md">
              {/* Row 1: Dashboard, Enrollment Review, Enrollment Management */}
              <div className="flex mb-4">
                {/* Dashboard Column */}
                <div className="w-1/3 px-2">
                  <div className="mb-1 font-semibold text-primary">Dashboard</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.dashboard.view")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">View</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.dashboard.canMakeChanges")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Can make changes</label>
                  </div>
                </div>

                {/* Enrollment Review Column */}
                <div className="w-1/3 px-2">
                  <div className="mb-1 font-semibold text-primary">Enrollment Review</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.enrollmentReview.view")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">View</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.enrollmentReview.canMakeChanges")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Can make changes</label>
                  </div>
                </div>

                {/* Enrollment Management Column */}
                <div className="w-1/3 px-2">
                  <div className="mb-1 font-semibold text-primary">Enrollment Management</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.enrollmentManagement.view")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">View</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.enrollmentManagement.canMakeChanges")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Can make changes</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Personnel Center, Settings */}
            <div className="bg-gray-50 p-3 rounded-md mt-10">
              <div className="flex">
                {/* Personnel Center Column */}
                <div className="w-1/3 px-2">
                  <div className="mb-1 tex-xs font-semibold text-primary">Personnel Center</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.personnelCenter.view")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">View</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.personnelCenter.canMakeChanges")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Can make changes</label>
                  </div>
                </div>

                {/* Settings Column */}
                <div className="w-1/3 px-2">
                  <div className="mb-1 font-semibold text-primary">Settings</div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.settings.view")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">View</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("accessPermissions.settings.canMakeChanges")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Can make changes</label>
                  </div>
                </div>

                {/* Empty Column to maintain layout */}
                <div className="w-1/3 px-2"></div>
              </div>
            </div>
          </div>

          {/* Role List Section */}
          {/* Role List Section */}
          <div>
            <h2 className="text-accent text-lg font-semibold mb-2">Role List</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <div className="mr-8">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="role-admin"
                      value="admin"
                      {...register("role")}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="role-admin" className="text-sm text-text-2">
                      Admin
                    </label>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="role-registrar"
                      value="registrar"
                      {...register("role")}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="role-registrar" className="text-sm text-text-2">
                      Registrar
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RolesAccess;