import React, { useEffect, useState } from "react";
import AccessManagementPanel from "@/app/admin/pages/personnel-center/roles&access/role-access";
import HistoryLogsPanel from "@/app/admin/pages/personnel-center/history&logs/history-logs";
import { Search, Plus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { requestData } from "@/lib/dataRequester";

export const FormResetContext = React.createContext({
  shouldResetForm: false,
  setShouldResetForm: (value: boolean) => {}
});

interface Personnel {
  userId: number;
  name: string;
  role: string;
}

const PersonnelCenter: React.FC = () => {
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("roles-access");
  const [userFilter, setUserFilter] = useState<string>("");
  const [isAddingNewPersonnel, setIsAddingNewPersonnel] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Update the handleAddNewPersonnel function
  const handleAddNewPersonnel = () => {
    setSelectedPersonnel(null);
    setShouldResetForm(true);
    setIsAddingNewPersonnel(true);  // Add this line
    if (activeTab !== "roles-access") setActiveTab("roles-access");
    toast.success("New personnel form opened", { duration: 2000, position: "top-right" });
  };

  const handlePersonnelRowClick = (person: Personnel) => {
    setSelectedPersonnel(person);
    toast.success("Personnel selected", { duration: 2000, position: "top-right" });
  };

  const handleSavePersonnel = async () => {
    await retrievePersonnels();
    toast.success("Personnel saved successfully", { duration: 2000, position: "top-right" });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (e.target.value && !endDate) {
      const today = new Date().toISOString().split('T')[0];
      setEndDate(today);
  }

  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (e.target.value && !startDate) {
      setStartDate(e.target.value);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilter(e.target.value);
  };

  const retrievePersonnels = async () => {
    try {
      console.log('retrieving personels')
      const response = await requestData<Personnel[]>({
        url: "http://localhost:3000/api/employee-list/retrieve",
        method: "GET",
      });

      if (response) {
        setPersonnel(response);
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");

      console.error(err);
    }
  }

  useEffect(() => {
    retrievePersonnels();
  }, []);

  const filteredPersonnel = personnel.filter((person) => {
    const query = searchQuery.toLowerCase();
    return (
      person.name.toLowerCase().includes(query) ||
      person.role.toLowerCase().includes(query)
    );
  });

  const renderContent = () => {
    if (activeTab === "roles-access") {
      return (
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-1/3 p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 bg-white rounded-md border-2 p-2">
                <button
                  className={`cursor-pointer rounded-[10px] px-4 py-2 transition ease-in-out duration-300 hover:bg-accent hover:text-background ${
                    activeTab === "roles-access" ? "bg-accent font-semibold text-background" : "bg-background text-text-2"
                  }`}
                  onClick={() => setActiveTab("roles-access")}
                >
                  Roles & Access
                </button>
                <button
                  className={`cursor-pointer rounded-[10px] px-4 py-2 transition ease-in-out duration-300 hover:bg-accent hover:text-background ${
                    activeTab === "history-logs" ? "bg-accent font-semibold text-background" : "bg-background text-text-2"
                  }`}
                  onClick={() => setActiveTab("history-logs")}
                >
                  History & Logs
                </button>
              </div>
              <button
                className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-accent transition"
                onClick={handleAddNewPersonnel}
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="mb-4">
              <div className="relative bg-white">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="w-full p-2 pl-10 border rounded-lg"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="w-full h-125 bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white text-primary">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonnel.map((person) => (
                    <tr
                      key={person.userId}
                      onClick={() => handlePersonnelRowClick(person)}
                      className="hover:bg-blue-100 cursor-pointer"
                    >
                      <td className="px-4 py-2">{person.userId}</td>
                      <td className="px-4 py-2">{person.name}</td>
                      <td className="px-4 py-2">
                        {person.role == 'admin' && <span className="text-gray-800">Admin</span>}
                        {person.role == 'registrar' && <span className="text-gray-800">Registrar</span>}
                      </td>
                    </tr>
                  ))}
                  {filteredPersonnel.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">No personnel found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 p-5 overflow-auto">
            <FormResetContext.Provider value={{ shouldResetForm, setShouldResetForm }}>
            <AccessManagementPanel
              selectedPersonnel={selectedPersonnel}
              onSave={handleSavePersonnel}
              searchQuery={searchQuery}
              isAddingNewPersonnel={isAddingNewPersonnel}
              setIsAddingNewPersonnel={setIsAddingNewPersonnel}
            />
            </FormResetContext.Provider>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col w-full p-4 h-screen bg-container-bg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2 bg-white rounded-md border-2 p-2">
            <button
              className={`cursor-pointer rounded-[10px] px-4 py-2 transition ease-in-out duration-300 hover:bg-accent hover:text-background ${
                activeTab === "roles-access" ? "bg-accent font-semibold text-background" : "bg-background text-text-2"
              }`}
              onClick={() => setActiveTab("roles-access")}
            >
              Roles & Access
            </button>
            <button
              className={`cursor-pointer rounded-[10px] px-4 py-2 transition ease-in-out duration-300 hover:bg-accent hover:text-background ${
                activeTab === "history-logs" ? "bg-accent font-semibold text-background" : "bg-background text-text-2"
              }`}
              onClick={() => setActiveTab("history-logs")}
            >
              History & Logs
            </button>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            {/* Role Filter */}
            <div className="flex flex-col min-w-[180px]">
              <label htmlFor="role-filter" className="text-xs font-medium text-gray-500 mb-1">
                Filter by Role
              </label>
              <select
                id="role-filter"
                className="w-full border border-gray-200 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                value={userFilter}
                onChange={handleUserFilterChange}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="registrar">Registrar</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="date"
                    className="border border-gray-200 bg-white rounded-md px-3 py-2 text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={startDate}
                    onChange={handleStartDateChange}
                    placeholder="Start Date"
                  />
                </div>
                <span className="text-gray-400">to</span>
                <div className="relative">
                  <input
                    type="date"
                    className="border border-gray-200 bg-white rounded-md px-3 py-2 text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={endDate}
                    onChange={handleEndDateChange}
                    placeholder="End Date"
                    min={startDate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <HistoryLogsPanel
          userFilter={userFilter}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {renderContent()}
    </>
  );
};
export default PersonnelCenter;
