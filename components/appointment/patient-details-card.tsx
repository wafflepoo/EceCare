import { Patient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { calculateAge } from "@/utils";
import { Calendar, Home, Info, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

export const PatientDetailsCard = ({ data }: { data: Patient }) => {
  return (
    <Card className="shadow-none bg-white">
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <div className="relative size-20 xl:size-24 rounded-full overflow-hidden">
          <Image
            src={data.img || "/user.jpg"}
            alt={data?.first_name}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            {data?.first_name} {data?.last_name}
          </h2>
          <p className="text-sm text-gray-500">
            {data?.email} - {data?.phone}
          </p>
          <p className="text-sm text-gray-500">
            {data?.gender} - {calculateAge(data?.date_of_birth)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="mt-4 space-y-4">
        <div className="flex items-start gap-3">
          <Calendar size={22} className="text-0gray-400" />
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-base font-medium text-muted-foreground">
              {format(new Date(data?.date_of_birth), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Home size={22} className="text-0gray-400" />
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-base font-medium text-muted-foreground">
              {data?.address}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail size={22} className="text-0gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-base font-medium text-muted-foreground">
              {data?.email}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone size={22} className="text-0gray-400" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-base font-medium text-muted-foreground">
              {data?.phone}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Info size={22} className="text-0gray-400" />
          <div>
            <p className="text-sm text-gray-500">Physician</p>
            <p className="text-base font-medium text-muted-foreground">
              Dr Codewave, MBBS, FCPS
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div>
            <p className="text-sm text-gray-500">Active Conditions</p>
            <p className="text-base font-medium text-muted-foreground">
              {data?.medical_conditions}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div>
            <p className="text-sm text-gray-500">Allergies</p>
            <p className="text-base font-medium text-muted-foreground">
              {data?.allergies}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
