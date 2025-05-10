import { SettingsQuickLinks } from "@/components/settings/quick-link-settings";
import { ServiceSettings } from "@/components/settings/services-settings";
import { Card } from "@/components/ui/card";
import { SearchParamsProps } from "@/types";

const SystemSettingPage = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const cat = (searchParams?.cat || "services") as String;

  return (
    <div className="p-6 flex flex-col lg:flex-row w-full min-h-screen gap-10">
      <div className="w-full lg:w-[70%] flex flex-col gap-4">
        <Card className="shadow-none rounded-xl">
          {cat === "services" && <ServiceSettings />}
        </Card>
      </div>
      <div className="w-full space-y-6">
        <SettingsQuickLinks />
      </div>
    </div>
  );
};

export default SystemSettingPage;
