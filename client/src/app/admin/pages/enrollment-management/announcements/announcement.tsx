import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from "@/components/ui/form"; // Import the Form wrapper
import InfoIcon from '@/assets/images/info icon.svg';
import { Switch } from '@headlessui/react';
import CustomInput from '@/components/CustomInput';
import { requestData } from '@/lib/dataRequester';

interface FormData {
  subject: string;
  content: string;
}

interface RetrievedDataInterface {
  isActive: boolean;
  subject: string;
  contents: string;
}

interface SendDataResponse {
  message: string;
  timeExecuted: Date;
}

export default function Announcement() {
  const [enabled, setEnabled] = useState(false); // Default switch to enabled (right)

  const form = useForm<FormData>({
    defaultValues: {
      subject: '',
      content: '',
    },
  }); // Using form object for react-hook-form

  const { reset } = form;

  // Holder for the value retrieved from the microservice
  const [announcement, setAnnouncement] = useState<RetrievedDataInterface | null>({
    isActive: false,
    subject: '',
    contents: '',
  });

  useEffect(() => {
    if (announcement) {
      setEnabled(announcement.isActive);
      reset({
        subject: announcement.subject || '',
        content: announcement.contents || '',
      });
    }
  }, [announcement]);

  // method for receiving the data from the server
  const retrieveData = async () => {
    try{
      const res = await requestData<RetrievedDataInterface>({
        url: 'http://localhost:3000/api/announcements/fetch',
        method: 'GET'
      });

      if(res){
        console.log(res);
        setAnnouncement(res);
      }
    }catch(err) {
      if(err instanceof Error) console.error(err.message);
      else console.error(err);
    }
  }

  // execute upon render
  useEffect(() => {
    retrieveData();
  }, []);

  // submits the data to the server
  const onSubmit = async (data: FormData) => {
    try{
      console.log(enabled);
      const res = await requestData<SendDataResponse>({
        url: 'http://localhost:3000/api/announcements/receive',
        method: 'POST',
        body: {
          isActive: enabled,
          subject: data.subject,
          contents: data.content,
        }
      });

      if(res){
        console.log(res);
      }
    }catch(err) {
      if(err instanceof Error) console.error(err.message);
      else console.error(err);
    }
  };

  return (
    <div className="flex flex-col py-4 mt-8 overflow-hidden">
      <div className="flex justify-center items-center">
        <div className="rounded-[10px] max-h-[72px] p-2 bg-amber-100">
          <div className="flex flex-row items-center">
            <img
              src={InfoIcon}
              alt="Information Icon"
              className="w-8 h-8 mr-2"
            />
            <h1 className="text-primary font-semibold">
              Please use this to publish official school announcements.
            </h1>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex justify-center items-center">
        <div className="bg-white shadow-md justify-center items-center rounded-lg p-4 border-2 mt-6 max-w-[800px] w-full">
          <div className="flex flex-row justify-center items-center mb-6 gap-2 mt-4">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`group relative inline-flex h-6 w-11 items-center rounded-full transition duration-300 ${
                enabled ? 'bg-success' : 'bg-primary'
              }`}
            >
              <span
                className={`absolute left-1 size-4 rounded-full bg-white transition-transform duration-300 ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </Switch>
            <span className="text-md text-text font-semibold">Display Announcements</span>
          </div>

          {/* Form Wrapper */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Subject Input using CustomInput */}
              <div className='flex flex-col px-6'>
                <CustomInput
                  control={form.control}
                  name="subject"
                  label="Subject"
                  placeholder="Early Dismissal - October 26th"
                  inputStyle="w-full p-4 mt-1 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px] placeholder:leading-5"
                  labelStyle="block text-sm font-semibold"
                />
              </div>

              {/* Content Input using CustomInput */}
              <div className='flex flex-col px-6'>
                <CustomInput
                    control={form.control}
                    name="content"
                    label="Content"
                    placeholder="Please be advised that there will be an early dismissal on Thursday, October 26th, due to a scheduled faculty meeting. Students will be dismissed at 12:00 PM. Please make arrangements for transportation."
                    inputStyle="w-full p-4 pb-10 mt-1 text-sm rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text- placeholder:whitespace-pre-line placeholder:text-[13px] placeholder:leading-5"
                    labelStyle="block text-sm font-semibold"
                />
                </div>

              {/* Submit Button */}
              <div className="mt-5 flex justify-center flex-col items-center">
                <button 
                  type="submit" 
                  className="bg-accent  py-2 px-4 rounded-[10px]  duration-300 hover:bg-opacity-80 hover:shadow-lg  font-semibold text-white transition ease-in-out hover:bg-primary hover:text-background"
                >
                  Publish Announcement
                </button>
                <p className="text-sm text-text-2 my-2">
                  This will replace the current announcement, if you have any.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
