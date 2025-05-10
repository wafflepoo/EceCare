import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { formatNumber } from "@/utils";

interface CardProps {
  title: string;
  icon: LucideIcon;
  note: string;
  value: number;
  className?: string;
  iconClassName?: string;
  link: string;
}

const CardIcon = ({ icon: Icon }: { icon: LucideIcon }) => {
  return <Icon />;
};
export const StatCard = ({
  title,
  icon,
  note,
  value,
  className,
  iconClassName,
  link,
}: CardProps) => {
  return (
    <Card className={cn("w-full md:w-[330px] 2xl:w-[250px]", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3 capitalize">
        <h3>{title}</h3>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-normal text-xs bg-transparent p-2 h-0 hover:underline"
        >
          <Link href={link}>See details</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 bg-violet-50-500/15 rounded-full flex items-center justify-center text-violet-600",
              iconClassName
            )}
          >
            <CardIcon icon={icon} />
          </div>

          <h2 className="text-2xl 2xl:text-3xl font-semibold">
            {formatNumber(value)}
          </h2>
        </div>
      </CardContent>

      <CardFooter className="pb-3">
        <p className="text-sm text-gray-500">{note}</p>
      </CardFooter>
    </Card>
  );
};
