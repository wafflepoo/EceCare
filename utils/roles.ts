import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

// Define the expected structure of the session claims
interface SessionClaims {
  metadata: {
    role?: string;
  };
  publicMetadata: {
    role?: string;
  };
}

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();

  // Ensure we are properly checking the role from metadata
  const currentRole = sessionClaims?.metadata?.role?.toLowerCase?.() ?? "patient";
  return currentRole === role.toLowerCase();
};




export const getRole = async (): Promise<Roles> => {
  const { sessionClaims } = await auth();

  // Type assertion to ensure TypeScript understands the structure
  const metadata = sessionClaims?.metadata as { role?: string };
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string };

  // Debug logs for better insight into the session structure
  console.log("📦 Metadata:", metadata);
  console.log("👤 Role récupéré:", metadata?.role);
  

  // Use role from metadata or publicMetadata, default to "patient"
  const role = metadata?.role?.toLowerCase() ?? publicMetadata?.role?.toLowerCase() ?? "patient";


  
  
  return role as Roles;


  

};
