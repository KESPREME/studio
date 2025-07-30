
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LocateFixed, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

const reportSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not be longer than 500 characters."
  }),
  urgency: z.enum(["Low", "Moderate", "High"]),
  latitude: z.number({ required_error: 'Location is required.'}),
  longitude: z.number({ required_error: 'Location is required.'}),
  image: z.any().optional(),
})

export function ReportForm() {
  const { toast } = useToast()
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null);


  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: "",
      urgency: "Moderate",
    },
  })

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    setIsSubmitting(true)
    
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to submit a report.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    let imagePath: string | undefined = undefined;

    if (imageFile) {
      const file = imageFile;
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${fileName}`; // No leading slash or 'public'

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        console.error('Supabase upload error:', error);
        toast({
          title: "Image Upload Failed",
          description: `Could not upload your image to storage: ${error.message}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      imagePath = data.path;
    }


    const reportData = {
      description: values.description,
      urgency: values.urgency,
      latitude: values.latitude,
      longitude: values.longitude,
      imageUrl: imagePath, // Save just the path
      reportedBy: user.email,
    };
    
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit report');
      }

      toast({
        title: "Report Submitted!",
        description: "Thank you for helping keep your community safe.",
      })
      
      if(user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      form.reset({
        description: "",
        urgency: "Moderate",
      });
      setImagePreview(null);
      setImageFile(null);

    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit your report. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocation = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude)
        form.setValue("longitude", position.coords.longitude)
        toast({
            title: "Location Acquired",
            description: "Your current location has been set for the report.",
        })
        setIsLocating(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({
            title: "Geolocation Error",
            description: "Could not get your location. Please ensure location services are enabled.",
            variant: "destructive",
        })
        setIsLocating(false)
      }
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file);
      form.setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about the hazard in detail..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible to help us understand the situation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Location</FormLabel>
                <div className="flex flex-col gap-2">
                    <Button type="button" variant="outline" className="w-full" onClick={handleLocation} disabled={isLocating}>
                    {isLocating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LocateFixed className="mr-2 h-4 w-4" />
                    )}
                    {form.watch("latitude") && form.watch("longitude") ? "Location Set" : "Use My Location"}
                    </Button>
                    <FormMessage>{form.formState.errors.latitude?.message || form.formState.errors.longitude?.message}</FormMessage>
                </div>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </FormControl>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary transition-colors">
                        {imagePreview ? (
                            <div className="relative w-full h-40">
                                <Image src={imagePreview} alt="Image preview" fill objectFit="contain" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Upload className="h-8 w-8" />
                                <p>Click to upload an image</p>
                                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                    </div>
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
