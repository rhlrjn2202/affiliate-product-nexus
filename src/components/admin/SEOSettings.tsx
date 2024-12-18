import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const SEOSettings = () => {
  const [gaTag, setGaTag] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setGaTag(settings.ga_tag || "");
      setMetaTitle(settings.meta_title || "");
      setMetaDescription(settings.meta_description || "");
      setMetaKeywords(settings.meta_keywords || "");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({
          id: 1,
          ga_tag: gaTag,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
        });

      if (error) throw error;
      toast.success("SEO settings updated!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (error: any) {
      toast.error("Failed to update settings: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">SEO Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="analytics">
            <AccordionTrigger>Google Analytics Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Input
                  value={gaTag}
                  onChange={(e) => setGaTag(e.target.value)}
                  placeholder="GA-XXXXXXXXXX"
                  className="max-w-xs"
                />
                <p className="text-sm text-gray-500">Enter your Google Analytics tracking ID</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meta">
            <AccordionTrigger>Meta Tags</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Enter meta title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter meta description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                  <Input
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="Enter meta keywords"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button type="submit">Save All Settings</Button>
      </form>
    </div>
  );
};