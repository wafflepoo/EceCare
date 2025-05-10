"use client";

import { DiagnosisSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CardDescription, CardHeader } from "../ui/card";
import { Form } from "../ui/form";
import { CustomInput } from "../custom-input";
import { toast } from "sonner";
import { addDiagnosis } from "@/app/actions/medical";

interface AddDiagnosisProps {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medicalId: string;
}

export type DiagnosisFormData = z.infer<typeof DiagnosisSchema>;
export const AddDiagnosis = ({
  patientId,
  doctorId,
  appointmentId,
  medicalId,
}: AddDiagnosisProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<DiagnosisFormData>({
    resolver: zodResolver(DiagnosisSchema),
    defaultValues: {
      patient_id: patientId,
      medical_id: medicalId,
      doctor_id: doctorId,
      symptoms: "",
      diagnosis: "",
      notes: "",
      prescribed_medications: "",
      follow_up_plan: "",
    },
  });

  const handleOnSubmit = async (data: DiagnosisFormData) => {
    try {
      setLoading(true);

      const res = await addDiagnosis(data, appointmentId);

      if (res.success) {
        toast.success(res.message);
        router.refresh();
        form.reset();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add diagnosis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            size={"lg"}
            className="bg-blue-600 text-white mt-4"
          >
            <Plus size={22} className="text-white" />
            Add Diagnosis
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[60%] 2xl:max-w-[40%] max-h-[90vh] overflow-y-auto">

          <CardHeader className="px-0">
            <DialogTitle>Add New Diagnosis</DialogTitle>
            <CardDescription>
              Ensure accurate findings are presented and corrected accordingly
              to ensure that they are correct for your application and that they
              do not result in an error.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="symptoms"
                  label="Symptoms"
                  placeholder="Enter symptoms here ..."
                />
              </div>

              <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="diagnosis"
                  placeholder="Enter diagnosis here ..."
                  label="Diagnosis (Findings)"
                />
              </div>
              <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="prescribed_medications"
                  placeholder="Enter principles here ..."
                  label="Prescriptions for this patient"
                />
              </div>

              <div className="flex items-center gap-4">
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="notes"
                  placeholder="Optional note"
                  label="Additional Notes for this treatment"
                />
                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="follow_up_plan"
                  placeholder="Optional"
                  label="Follow Up Plan"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 w-full"
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
