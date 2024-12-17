import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AnalyticsSettings = () => {
  const [gaTag, setGaTag] = useState("");
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ id: 1, ga_tag: gaTag });

      if (error) throw error;
      toast.success("Analytics settings updated!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (error: any) {
      toast.error("Failed to update settings: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Google Analytics Settings</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={gaTag || settings?.ga_tag || ""}
          onChange={(e) => setGaTag(e.target.value)}
          placeholder="GA-XXXXXXXXXX"
          className="max-w-xs"
        />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};