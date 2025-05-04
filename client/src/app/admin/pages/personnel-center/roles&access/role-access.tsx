import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormResetContext } from "@/app/admin/pages/personnel-center/PersonnelCenter";
import { toast } from "react-hot-toast";

// Zod schema for validation
const schema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  suffix: z.string().optional(),
  birthdate: z.string().min(1, { message: "Birthdate is required" }),
  sex: z.string().min(1, { message: "Sex is required" }),
  phoneNumber: z.string().min(10, { message: "Phone Number must be at least 10 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  username: z.string().min(3, { message: "Username is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  address: z.object({
    houseNumber: z.string().min(1, { message: "House Number is required" }),
    street: z.string().min(1, { message: "Street is required" }),
    district: z.string().min(1, { message: "District is required" }),
    province: z.string().min(1, { message: "Province is required" }),
  }),
  // Add schema for role management
  role: z.object({
    admin: z.boolean().optional(),
    registrar: z.boolean().optional(),
  }).optional(),
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
  }).optional(),
});

type FormData = z.infer<typeof schema>;

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
  selectedPersonnel?: FormData | null;
  onSave?: (data: FormData) => void;
  searchQuery?: string;
}

const RolesAccess: React.FC<RolesAccessProps> = ({ selectedPersonnel, onSave, searchQuery }) => {
  const [activeTab, setActiveTab] = useState("profile-settings");
  const { shouldResetForm, setShouldResetForm } = useContext(FormResetContext);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthdate: "",
      sex: "Male", 
      phoneNumber: "",
      email: "",
      username: "",
      password: "",
      address: {
        houseNumber: "",
        street: "",
        district: "",
        province: ""
      },
      role: {
        admin: false,
        registrar: false
      },
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
                  setValue(`${key}.${nestedKey}.${deepKey}` as any, deepValue);
                });
              } else {
                setValue(`${key}.${nestedKey}` as any, nestedValue);
              }
            });
          }
        } else {
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

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    
    // Show toast notification for successful save
    toast.success("Changes saved successfully!", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#2196F3",
        color: "#fff",
        borderRadius: "10px",
        padding: "16px"
      }
    });

    // Call the onSave prop if provided
    if (onSave) {
      onSave(data);
    }
  };

  // Function to handle password change
  const handlePasswordChange = () => {
    const passwordValue = document.querySelector('input[name="password"]') as HTMLInputElement;
    if (passwordValue && passwordValue.value.length >= 8) {
      toast.success("Password updated successfully", {
        duration: 3000,
        position: "top-right"
      });
    } else {
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
              
              <div className="w-80 ml-30">
                <CustomInput
                  label="Birthdate"
                  placeholder="1990-01-01"
                  type="date"
                  register={register}
                  name="birthdate"
                  errorMessage={errors.birthdate?.message}
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
                  options={["Male", "Female"]}
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
              <div className="w-100 ml-5 pl-2">
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
          </div>

          <div className="mb-6">
            <h2 className="text-accent font-medium text-lg mb-3">Address</h2>
            
            {/* Row 1: House Number, Street, District, Province (4 columns) */}
            <div className="flex mb-4">
              <div className="w-1/3 mr-5 pr-2">
                <CustomInput
                  label="House Number"
                  placeholder="12313"
                  register={register}
                  name="address.houseNumber"
                  errorMessage={errors.address?.houseNumber?.message}
                />
              </div>
              <div className="w-1/2 px-1">
                <CustomInput
                  label="Street"
                  placeholder="Cutie Street"
                  register={register}
                  name="address.street"
                  errorMessage={errors.address?.street?.message}
                />
              </div>
              <div className="w-1/2 mx-5 px-1">
                <CustomInput
                  label="District"
                  placeholder="District 1"
                  register={register}
                  name="address.district"
                  errorMessage={errors.address?.district?.message}
                />
              </div>
              <div className="w-1/3 px-1">
                <CustomInput
                  label="Province"
                  placeholder="District 1"
                  register={register}
                  name="address.province"
                  errorMessage={errors.address?.province?.message}
                />
              </div>
            </div>
          </div>

          <div className="flex mt-10">
            <button
              type="submit"
              className="bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
            >
              Save changes
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
          <div>
            <h2 className="text-accent text-lg font-semibold mb-2">Role List</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <div className="mr-8">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("role.admin")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Admin</label>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("role.registrar")}
                      className="mr-2 h-4 w-4"
                    />
                    <label className="text-sm text-text-2">Registrar</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RolesAccess;