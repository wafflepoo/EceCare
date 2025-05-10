"use client";

import { addVitalSigns } from "@/app/actions/appointment";
import { VitalSignsSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomInput } from "../custom-input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";

interface AddVitalSignsProps {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medicalId?: string;
}

export type VitalSignsFormData = z.infer<typeof VitalSignsSchema>;

export const AddVitalSigns = ({
  patientId,
  doctorId,
  appointmentId,
  medicalId,
}: AddVitalSignsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<VitalSignsFormData>({
    resolver: zodResolver(VitalSignsSchema),
    defaultValues: {
      patient_id: patientId,
      medical_id: medicalId,
      body_temperature: undefined,
      heartRate: undefined,
      systolic: undefined,
      diastolic: undefined,
      respiratory_rate: undefined,
      oxygen_saturation: undefined,
      weight: undefined,
      height: undefined,
    },
  });

  const handleOnSubmit = async (data: VitalSignsFormData) => {
    try {
      setIsLoading(true);

      const res = await addVitalSigns(data, appointmentId, doctorId);

      if (res.success) {
        router.refresh();
        toast.success(res.msg);
        form.reset();
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add vital signs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-sm font-normal">
            <Plus size={22} className="text-gray-500" /> Add Vital Signs
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vital Signs</DialogTitle>
            <DialogDescription>
              Add vital signs for the patient
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="body_temperature"
                  label="Body Temperature (°C)"
                  placeholder="eg.:37.5"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="heartRate"
                  placeholder="eg: 54-123"
                  label="Heart Rate (BPM)"
                />
              </div>

              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="systolic"
                  placeholder="eg: 120"
                  label="Systolic BP"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="diastolic"
                  placeholder="eg: 80"
                  label="Diastolic BP"
                />
              </div>

              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="weight"
                  placeholder="eg.: 80"
                  label="Weight (Kg)"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="height"
                  placeholder="eg.: 175"
                  label="Height (Cm)"
                />
              </div>

              <div className="flex items-center gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="respiratory_rate"
                  placeholder="Optional"
                  label="Respiratory Rate"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="oxygen_saturation"
                  placeholder="Optional"
                  label="Oxygen Saturation"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
