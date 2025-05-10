
import { AppointmentActionOptions } from "@/components/appointment-actions";
import { AppointmentStatusIndicator } from "@/components/appointment-status-indicator";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { ViewAppointment } from "@/components/view-appointment";
import { checkRole, getRole } from "@/utils/roles";
import { DATA_LIMIT } from "@/utils/seetings";
import { getPatientAppointments } from "@/utils/services/appointment";
import { auth } from "@clerk/nextjs/server";
import { Appointment, Doctor, Patient } from "@prisma/client";
import { format } from "date-fns";
import { BriefcaseBusiness } from "lucide-react";
import React from "react";
import { Pagination } from "@/components/pagination";
import { AppointmentContainer } from "@/components/appointment-container";
import { Role } from "@prisma/client";



const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    key: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Status",
    key: "status",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

interface DataProps extends Appointment {
  patient: Patient;
  doctor: Doctor;
}

const Appointments = async (props: {
  searchParams?: Promise<{ [key: string]: string | undefined }> ;
}) => {
  const searchParams = await props.searchParams;
  const userRole = await getRole();  // userRole is now of type Role
  console.log("User Role: ", userRole);  // Log user role to debug

  const { userId } = await auth();
  console.log("User ID: ", userId);  // Log user ID to debug

  const isPatient = await checkRole("PATIENT");
  console.log("Is Patient: ", isPatient);  // Log if the user is a patient

  const page = (searchParams?.p || "1") as string;
  const searchQuery = searchParams?.q || "";
  const id = searchParams?.id || undefined;

  let queryId: string | undefined;

console.log("Checking user role conditions...");
if (
  (userRole === Role.ADMIN || userRole === Role.DOCTOR) &&
  id !== null && id !== undefined
) {
  console.log("User is Admin or Doctor with ID. Setting queryId to: ", id);
  queryId = id;
} else if ((userRole === Role.DOCTOR || userRole === Role.PATIENT) && userId !== null && userId !== undefined) {
  console.log("User is Doctor or Patient. Setting queryId to userId: ", userId);
  queryId = userId;
} else if (userRole === Role.NURSE) {
  console.log("User is Nurse. Setting queryId to undefined.");
  queryId = undefined;
}


  // Fetch patient appointments
  const { data, totalPages, totalRecord, currentPage } =
    await getPatientAppointments({
      page,
      search: searchQuery,
      id: queryId!,
    });

  console.log("Fetched Data: ", data);  // Log fetched data to inspect

  if (!data) return null;

  const renderItem = (item: DataProps) => {
    const patient_name = `${item?.patient?.first_name} ${item?.patient?.last_name}`;
    console.log("Rendering appointment for patient: ", patient_name);

    // Check if video link exists and log it
    if (item.video_link) {
      console.log(`Appointment for patient ${patient_name} has a video link: ${item.video_link}`);
    } else {
      console.log(`Appointment for patient ${patient_name} does not have a video link.`);
    }

    return (
      <tr
        key={item?.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item?.patient?.img!}
            name={patient_name}
            bgColor={item?.patient?.colorCode!}
          />
          <div>
            <h3 className="font-semibold uppercase">{patient_name}</h3>
            <span className="text-xs md:text-sm capitalize">
              {item?.patient?.gender.toLowerCase()}
            </span>
          </div>
        </td>

        <td className="hidden md:table-cell">
          {format(item?.appointment_date, "yyyy-MM-dd")}
        </td>
        <td className="hidden md:table-cell">{item.time}</td>

        <td className="hidden  items-center py-2  md:table-cell">
          <div className="flex items-center  gap-2 md:gap-4">
            <ProfileImage
              url={item.doctor?.img!}
              name={item.doctor?.name}
              bgColor={item?.doctor?.colorCode!}
              textClassName="text-black"
            />

            <div>
              <h3 className="font-semibold uppercase">{item.doctor?.name}</h3>
              <span className="text-xs md:text-sm capitalize">
                {item.doctor?.specialization}
              </span>
            </div>
          </div>
        </td>

        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item.status!} />
        </td>
        <td>
          <div className="flex items-center gap-2">
            <ViewAppointment id={item?.id.toString()} />
            <AppointmentActionOptions
              userId={userId!}
              patientId={item?.patient_id}
              doctorId={item?.doctor_id}
              status={item?.status}
              appointmentId={item.id}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total appointments
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />

          {isPatient && <AppointmentContainer id={userId!} />}
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderItem} data={data} />

        {data?.length > 0 && (
          <Pagination
            totalRecords={totalRecord!}
            currentPage={currentPage!}
            totalPages={totalPages!}
            limit={DATA_LIMIT}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
