import { createClient } from "@/lib/supabase/server";
import { InfoForm } from "./InfoForm";

export default async function MyInfoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="w-full max-w-2xl space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
          MY INFO
        </h1>
      </div>

      {/* Interactive Form Component: "CONTACT DETAILS" & "ABOUT YOU" */}
      <div className="pt-2">
        <InfoForm initialData={profile || {}} email={user?.email || ""} />
      </div>

    </div>
  );
}
