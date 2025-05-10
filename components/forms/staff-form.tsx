"use client";

import { DoctorSchema, StaffSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Form } from "../ui/form";
import { CustomInput, SwitchInput } from "../custom-input";
import { SPECIALIZATION } from "@/utils/seetings";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { createNewDoctor, createNewStaff } from "@/app/actions/admin";

const TYPES = [
  { label: "Nurse", value: "NURSE" },
  { label: "Laboratory", value: "LAB_TECHNICIAN" },
];

export const StaffForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "NURSE",
      address: "",
      department: "",
      img: "",
      password: "",
      license_number: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof StaffSchema>) => {
    try {
      setIsLoading(true);
      const resp = await createNewStaff(values);

      if (resp.success) {
        toast.success("Staff added successfully!");

        form.reset();
        router.refresh();
      } else if (resp.error) {
        toast.error(resp.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus size={20} />
          New Staff
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-xl rounded-r-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Add New Staff</SheetTitle>
        </SheetHeader>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 mt-5 2xl:mt-10"
            >
              <CustomInput
                type="radio"
                selectList={TYPES}
                control={form.control}
                name="role"
                label="Type"
                placeholder=""
                defaultValue="NURSE"
              />

              <CustomInput
                type="input"
                control={form.control}
                name="name"
                placeholder="Staff name"
                label="Full Name"
              />

              <div className="flex items-center gap-2">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="email"
                  placeholder="john@example.com"
                  label="Email Address"
                />

                <CustomInput
                  type="input"
                  control={form.control}
                  name="phone"
                  placeholder="9225600735"
                  label="Contact Number"
                />
              </div>

              <CustomInput
                type="input"
                control={form.control}
                name="license_number"
                placeholder="License Number"
                label="License Number"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="department"
                placeholder="Children's ward"
                label="Department"
              />

              <CustomInput
                type="input"
                control={form.control}
                name="address"
                placeholder="1479 Street, Apt 1839-G, NY"
                label="Address"
              />

              <CustomInput
                type="input"
                control={form.control}
                name="password"
                placeholder=""
                label="Password"
                inputType="password"
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
