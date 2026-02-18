import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const UpdatesPage = () => {
  const { updates, addUpdate } = useData();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasActive = updates.some(u => u.status === "active");

  const addFeatureField = () => setFeatures(prev => [...prev, ""]);
  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => setFeatures(prev => prev.map((f, idx) => idx === i ? val : f));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!subtitle.trim()) e.subtitle = "Subtitle is required";
    const validFeatures = features.filter(f => f.trim());
    if (validFeatures.length === 0) e.features = "At least one feature is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = addUpdate({ title: title.trim(), subtitle: subtitle.trim(), features: features.filter(f => f.trim()) });
    if (!success) {
      toast.error("Only one active update allowed. End the current one first.");
      return;
    }
    setTitle(""); setSubtitle(""); setFeatures([""]);
    toast.success("Update published successfully!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Updates</h1>
        <p className="text-muted-foreground text-sm mt-1">Publish new updates and features · Only 1 active update at a time</p>
      </div>

      {hasActive && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          An update is currently active. End it from the Update Records tab before adding a new one.
        </div>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Create Update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Update title" disabled={hasActive} />
                {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Brief description" disabled={hasActive} />
                {errors.subtitle && <p className="text-destructive text-xs">{errors.subtitle}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} disabled={hasActive} />
                  {features.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} disabled={hasActive}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.features && <p className="text-destructive text-xs">{errors.features}</p>}
              <Button type="button" variant="outline" size="sm" onClick={addFeatureField} disabled={hasActive}>
                <Plus className="w-3 h-3 mr-1" /> Add Feature
              </Button>
            </div>

            <Button type="submit" disabled={hasActive}>
              <Send className="w-4 h-4 mr-2" /> Publish Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatesPage;
