import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";
import Image from "next/image";
import { Gender } from "@prisma/client";

export const ProfileImage = ({
  url,
  name,
  className,
  textClassName,
  bgColor,
  gender,
}: {
  url?: string;
  name: string;
  className?: string;
  textClassName?: string;
  bgColor?: string;
  gender?: Gender;
}) => {
  if (url) {
    return (
      <div className="flex flex-col items-center">
        <Image
          src={url}
          alt={name}
          height={40}
          width={40}
          className={cn(
            "w-10 h-10 rounded-full object-cover",
            className
          )}
        />
        {gender && (
          <span className="text-xs text-gray-500 mt-1">
            {gender === "FEMALE" ? "♀ Female" : "♂ Male"}
          </span>
        )}
      </div>
    );
  }

  if (name) {
    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full text-white text-base items-center justify-center font-light flex",
            className
          )}
          style={{
            backgroundColor:
              gender === "FEMALE"
                ? "#ec4899"
                : gender === "MALE"
                ? "#2563eb"
                : bgColor || "#6b7280",
          }}
        >
          <p className={textClassName}>{getInitials(name)}</p>
        </div>
        {gender && (
          <span className="text-xs text-gray-500 mt-1">
            {gender === "FEMALE" ? "♀ Female" : "♂ Male"}
          </span>
        )}
      </div>
    );
  }

  return null;
};
