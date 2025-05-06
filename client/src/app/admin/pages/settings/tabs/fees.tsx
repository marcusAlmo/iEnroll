// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// // import TestData from "@/test/fees.json";

// const feesSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   amount: z.number().min(1, "Amount is required"),
//   feeMandatory: z.boolean(),
// });

// type FeesSettings = z.infer<typeof feesSchema>;

// type Fees = {
//   key: string;
//   value: {
//     amount: number;
//     feeName: string;
//     isMandatory: boolean;
//   };
// };

// const Fees: React.FC = () => {
//   const [selectedType, setSelectedType] = useState<string | null>(null);
//   const [isMandatory, setIsMandatory] = useState<boolean | null>(null);
//   const [data, setData] = useState<Fees[]>([]);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm<FeesSettings>({
//     resolver: zodResolver(feesSchema),
//     defaultValues: {
//       title: "",
//       amount: 0.0,
//       feeMandatory: false,
//     },
//   });

//   const onSubmit = (data: FeesSettings) => {
//     console.log(data);
//   }

//   const handleMandatoryChange = (value: boolean) => {
//     setIsMandatory(value); // Update local state for styling
//     setValue("feeMandatory", value); // Sync with form data
//   };

//   return (
//     <div className="flex flex-row w-full">
//       {/* Connection Type Buttons */}
//       <div className="flex w-3/12 flex-col bg-background p-5 text-start gap-y-2">
//         {data &&
//           data.map((item) => (
//             <button
//               key={item.key}
//               className={`px-5 py-2 text-start font-semibold transition-all duration-300 ease-in-out ${
//                 selectedType === item.key
//                   ? "w-full rounded-[10px] bg-container-1 text-start text-secondary"
//                   : "bg-background"
//               }`}
//               onClick={() => console.log(item, "item")}
//             >
//               {item.value.feeName}
//             </button>
//           ))}
//       </div>

//       {/* Connection Type Settings */}
//       <div className="h-[725px] w-full border-l-2 bg-background p-10">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Title Field */}
//           <div className="mb-5">
//             <label className="block text-gray-700 font-bold mb-2">Title:</label>
//             <input
//               {...register("title")}
//               className="w-full rounded-[10px] bg-container-1 px-3 py-2"
//               disabled={true}
//             />
//             {errors.title && (
//               <p className="text-red-500">{errors.title.message}</p>
//             )}
//           </div>

//           {/* Rate */}
//           <div className="mb-5">
//             <label className="block text-gray-700 font-bold mb-2">Rate:</label>
//             <input
//               type="number"
//               {...register("amount", { valueAsNumber: true })}
//               className="w-full rounded-[10px] bg-container-1 px-3 py-2"
//               // disabled={!isCreatingNew && !selectedType}
//             />
//             {errors.amount && (
//               <p className="text-red-500">{errors.amount.message}</p>
//             )}
//           </div>

//           {/* Will the fee be mandatory */}
//           <div className="mb-5">
//             <label className="block text-gray-700 font-bold mb-2">
//               Will the fee be mandatory:
//             </label>
//             <div className="flex gap-2">
//               <Button
//                 type="button"
//                 onClick={() => handleMandatoryChange(true)}
//                 className={`rounded-[10px] px-4 py-2 
//                     ${
//                       isMandatory === true
//                         ? "bg-secondary text-white"
//                         : "bg-container-1 text-gray-700"
//                     }
//                     ${
//                       !isCreatingNew && !selectedType
//                         ? ""
//                         : "hover:bg-secondary hover:text-white transition-colors duration-300"
//                     }
//                   `}
//                 // disabled={!isCreatingNew && !selectedType}
//               >
//                 Yes
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => handleMandatoryChange(false)}
//                 className={`rounded-[10px] px-4 py-2
//                     ${
//                       isMandatory === false
//                         ? "bg-secondary text-white"
//                         : "bg-container-1 text-gray-700"
//                     }
//                     ${
//                       !isCreatingNew && !selectedType
//                         ? ""
//                         : "hover:bg-secondary hover:text-white transition-colors duration-300"
//                     }
//                   `}
//                 disabled={!isCreatingNew && !selectedType}
//               >
//                 No
//               </Button>
//             </div>
//           </div>

//           {/* Submit & Delete Buttons */}
//           <div className="flex justify-between mt-20">
//             <Button
//               type="submit"
//               className="bg-secondary rounded-[10px] text-white text-base"
//               disabled={!isCreatingNew && !selectedType}
//             >
//               {isCreatingNew ? "Save New Item" : "Save Changes"}
//             </Button>
//             {/* <button disabled={!selectedType}>
//               <FontAwesomeIcon
//                 icon={faTrash}
//                 className="rounded-full bg-danger/20 px-2 py-2 text-xl text-danger transition-all duration-300 ease-in-out hover:bg-danger hover:text-background"
//               />
//             </button> */}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Fees;
import { paymentMethod } from "@/app/student/enrollment/enrollment.types";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import CustomDropdown from "@/components/CustomDropdown";
import { Form } from "@/components/ui/form";
import methods from "@/test/data/payment-methods.json";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import banks from "@/test/data/banks.json";
import types from "./method-types.json";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";

const Fees = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  // For tracking which payment is to be edited
  const [selectedPayment, setSelectedPayment] = useState<paymentMethod | null>(null);

  const feesSchema = z.object({
    methodName: z.string().min(1, "Please select a method"),
    methodType: z.string().min(1, "Please select method type"),
    accountNumber: z.string().min(1, "Please enter account number"),
    ownerName: z.string().min(1, "Please enter account owner name")
  });

  const form = useForm<z.infer<typeof feesSchema>>({
    resolver: zodResolver(feesSchema),
    defaultValues: {
      methodName: selectedPayment?.methodName || "",
      methodType: selectedPayment?.methodType || "",
      accountNumber: selectedPayment?.accountNumber.toString() || "",
      ownerName: selectedPayment?.ownerName || ""
    }
  });

  useEffect(() => {
    if (selectedPayment) {
      form.setValue("methodName", selectedPayment.methodName || "");
      form.setValue("methodType", selectedPayment.methodType || "");
      form.setValue("accountNumber", selectedPayment.accountNumber?.toString() || "");
      form.setValue("ownerName", selectedPayment.ownerName || "");
    }
  }, [selectedPayment, form]);

  const handleAddPaymentMethod = () => {
    if (form.formState.isDirty) {
      // If has unsaved changes, prevent add by showing stop modal
      setShowStopModal(true);
    } else {
      if (selectedPayment) {
        setSelectedPayment(null);
        // Reset form
        form.setValue("methodName", "");
        form.setValue("methodType", "");
        form.setValue("accountNumber", "");
        form.setValue("ownerName", "");
      }
      setDisplayForm(true);
    }
    console.log("Add payment method");
  }

  const handleResetForm = () => {
    setSelectedPayment(null);
    // Reset form
    form.setValue("methodName", "");
    form.setValue("methodType", "");
    form.setValue("accountNumber", "");
    form.setValue("ownerName", "");

    setShowStopModal(false);
  }

  const handleEditPaymentMethod = (method: paymentMethod) => {
    // if (form.formState.isDirty) {
    //   setShowStopModal(true);
    // } else {
      setDisplayForm(true);
      setSelectedPayment(method);
    // }
  };

  const onSubmit = (data: z.infer<typeof feesSchema>) => {
    console.log(data);
  }

  // To do:
  // - Add confirm delete payment method

  return (
    <section className="flex flex-row gap-x-5">
      <FontAwesomeIcon 
        icon={faPlusCircle} 
        className="text-accent absolute top-30 left-148 z-10 hover:cursor-pointer"
        style={{ fontSize: 32 }} 
        onClick={handleAddPaymentMethod} 
        title="Add new payment method"
      />

      {/* Display panel */}
      <div className="h-[70vh] p-5 overflow-y-auto rounded-[10px] bg-background shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)] w-[40%]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm text-primary border-b border-gray-300">
              <th className="pb-3 text-left">Payment Method</th>
              <th className="pb-3 text-left">Type</th>
              <th className="pb-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method) => (
              <tr key={method.id} className={`
                ${selectedPayment?.id === method.id ? "bg-gray-300" : ""}
                text-sm text-text
              `}>
                <td className="pl-2 py-2">{method.methodName}</td>
                <td className="pl-2 py-2">{method.methodType}</td>
                <td>
                  <div className="flex flex-row gap-x-4">
                    <div className="hover:cursor-pointer underline font-semibold text-primary" onClick={() => handleEditPaymentMethod(method)}>Edit</div>
                    <div className="hover:cursor-pointer underline font-semibold text-danger" onClick={() => setShowDeleteModal(true)}>Delete</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit panel */}
      <div className="h-[70vh] py-7 px-8 overflow-y-auto rounded-[10px] bg-background shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)] grow">
        {!displayForm 
          ? (
            <div className="w-full h-full flex justify-center items-center text-text-2">No payment method selected</div>
          )
          : (
            <div>
              <div className="w-full h-full text-accent font-semibold mb-8">Payment Method Details</div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-8">
                    <CustomDropdown
                      control={form.control}
                      name="methodName"
                      value={selectedPayment ? selectedPayment.methodName : ""}
                      values={banks}
                      buttonClassName="hover:bg-gray-200 border border-text-2 w-full mr-14 mr-4 rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                      menuClassName="w-full rounded-[10px] bg-white"
                      itemClassName="rounded-[10px] px-4 py-2 transition-all ease-in-out"
                      label="Method Name"
                      labelClassName="text-sm text-text"
                    />

                    <CustomDropdown
                      control={form.control}
                      name="methodType"
                      value={selectedPayment ? selectedPayment.methodType : ""}
                      values={types}
                      buttonClassName="hover:bg-gray-200 border border-text-2 w-full mr-14 mr-4 rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                      menuClassName="w-full rounded-[10px] bg-white"
                      itemClassName="rounded-[10px] px-4 py-2 transition-all ease-in-out"
                      label="Payment Method Type"
                      labelClassName="text-sm text-text"
                    />

                    <CustomInput
                      control={form.control}
                      name="accountNumber"
                      label="Account Number"
                      value={selectedPayment ? selectedPayment.accountNumber : ""}
                      placeholder=""
                      inputStyle="w-full p-4 mt-1 rounded-md border border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px] placeholder:leading-5"
                      labelStyle="block text-sm font-semibold"
                    />

                    <CustomInput
                      control={form.control}
                      name="ownerName"
                      label="Account Owner"
                      value={selectedPayment ? selectedPayment.ownerName : ""}
                      placeholder=""
                      inputStyle="w-full p-4 mt-1 rounded-md border border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px] placeholder:leading-5"
                      labelStyle="block text-sm font-semibold"
                    />
                  </div>

                  <Button
                    className="bg-accent mt-32 hover:cursor-pointer"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Save changes
                  </Button>
                </form>
              </Form>
            </div>
          )
        }
      </div>

      {/* Delete modal */}
      <CustomAlertDialog
        isOpen={showDeleteModal}
        title="Delete this payment method?"
        description="This action cannot be undone. Please check before confirming."
        cancelLabel="Cancel"
        cancelOnClick={() => setShowDeleteModal(false)}
        actionLabel="Delete"
        actionOnClick={() => console.log("Fee")}
      />

      {/* Confirm modal */}
      <CustomAlertDialog
        isOpen={showConfirmModal}
        title="Save changes?"
        description="Please check before confirming."
        cancelLabel="Cancel"
        cancelOnClick={() => setShowConfirmModal(false)}
        actionLabel="Submit"
        actionOnClick={() => console.log("Fee")}
      />

      {/* Confirm modal */}
      <CustomAlertDialog
        isOpen={showStopModal}
        title="You have unsaved changes"
        description="Your progress may be unsaved. Are you sure you want to add a new payment method?"
        cancelLabel="Cancel"
        cancelOnClick={() => setShowStopModal(false)}
        actionLabel="Yes"
        actionOnClick={handleResetForm}
      />
    </section>
  )
}

export default Fees

