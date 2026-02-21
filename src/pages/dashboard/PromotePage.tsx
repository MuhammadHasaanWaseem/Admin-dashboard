import { useState, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import { uploadPromoImage } from "@/lib/promoStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ImagePlus, X, Link, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PromotePage = () => {
  const { promotions, addPromotion } = useData();
  const [organizer, setOrganizer] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePromotions = promotions.filter(p => p.status === "active");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!organizer.trim()) e.organizer = "Organizer is required";
    if (!eventDetails.trim()) e.eventDetails = "Event details are required";
    if (url.trim() && !/^https?:\/\/.+/.test(url.trim())) e.url = "Enter a valid URL (https://...)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploaded = await uploadPromoImage(imageFile);
        if (!uploaded) {
          toast.error("Image upload failed. Try again.");
          return;
        }
        imageUrl = uploaded;
      }
      await addPromotion({
        organizer: organizer.trim(),
        eventDetails: eventDetails.trim(),
        additionalInfo: additionalInfo.trim(),
        url: url.trim() || undefined,
        imageUrl,
      });
      setOrganizer(""); setEventDetails(""); setAdditionalInfo(""); setUrl("");
      removeImage();
      toast.success("Promotion added successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Promote</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and manage promotions · <span className="text-primary font-medium">{activePromotions.length} active</span></p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Create Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Future Organizer</Label>
                <Input value={organizer} onChange={e => setOrganizer(e.target.value)} placeholder="Organizer name" />
                {errors.organizer && <p className="text-destructive text-xs">{errors.organizer}</p>}
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="pl-10" />
                </div>
                {errors.url && <p className="text-destructive text-xs">{errors.url}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Event Details</Label>
              <Textarea value={eventDetails} onChange={e => setEventDetails(e.target.value)} placeholder="Describe the event..." rows={3} />
              {errors.eventDetails && <p className="text-destructive text-xs">{errors.eventDetails}</p>}
            </div>
            <div className="space-y-2">
              <Label>Additional Information</Label>
              <Textarea value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} placeholder="Any other relevant details..." rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Promotional Image</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {!imagePreview ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-accent/30 transition-colors">
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload an image</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
                </button>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/70 flex items-center justify-center hover:bg-foreground/90 transition-colors">
                    <X className="w-4 h-4 text-background" />
                  </button>
                </div>
              )}
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Submit Promotion
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotePage;
