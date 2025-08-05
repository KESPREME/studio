
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LocateFixed, Loader2, Upload, MapPin, Camera, AlertTriangle, CheckCircle, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/animated-button"
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
  const [locationFound, setLocationFound] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);


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
      const fileName = `${user.email.split('@')[0]}_${Date.now()}_${file.name}`;
      const filePath = `${fileName}`; 

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
      imageUrl: imagePath, // Store the path, not the full URL
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
        setLocationFound(true)
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


  const formVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const urgencyColors = {
    Low: "from-green-500 to-emerald-600",
    Moderate: "from-yellow-500 to-orange-600",
    High: "from-red-500 to-rose-600"
  };

  return (
    <div className="p-6 space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <motion.div
            key={step}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white'
                : 'border-slate-300 dark:border-slate-600 text-slate-400'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: step * 0.1 }}
          >
            {currentStep > step ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <span className="font-semibold">{step}</span>
            )}
          </motion.div>
        ))}
      </div>

      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
            <motion.div
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      Describe the Hazard
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the hazard, emergency, or safety concern in detail. Include what you see, where it is, and any immediate dangers..."
                        className="resize-y min-h-[120px] border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-600 dark:text-slate-400">
                      Provide as much detail as possible to help emergency responders understand the situation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        Urgency Level
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-2 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 rounded-xl h-12">
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low" className="focus:bg-green-50 dark:focus:bg-green-950">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                              Low Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="Moderate" className="focus:bg-yellow-50 dark:focus:bg-yellow-950">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600"></div>
                              Moderate Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="High" className="focus:bg-red-50 dark:focus:bg-red-950">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600"></div>
                              High Priority
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
              >
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    Location
                  </FormLabel>
                  <div className="flex flex-col gap-2">
                    <AnimatedButton
                      type="button"
                      variant={locationFound ? "default" : "outline"}
                      className="w-full h-12"
                      onClick={handleLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : locationFound ? (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <LocateFixed className="mr-2 h-4 w-4" />
                      )}
                      {locationFound ? "Location Set" : isLocating ? "Getting Location..." : "Use My Location"}
                    </AnimatedButton>
                    <FormMessage>{form.formState.errors.latitude?.message || form.formState.errors.longitude?.message}</FormMessage>
                  </div>
                </FormItem>
              </motion.div>
            </div>

            <motion.div
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-3 text-lg font-semibold mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      Photo Evidence (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <motion.div
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-950/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20"
                        whileHover={{
                          borderColor: "rgb(168 85 247)",
                          boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.2), 0 4px 6px -2px rgba(168, 85, 247, 0.1)"
                        }}
                        whileTap={{ scale: 0.995 }}
                      >
                        <AnimatePresence mode="wait">
                          {imagePreview ? (
                            <motion.div
                              key="preview"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative"
                            >
                              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image src={imagePreview} alt="Image preview" fill style={{objectFit: 'cover'}} className="rounded-lg" />
                              </div>
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setImagePreview(null);
                                  setImageFile(null);
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <X className="h-4 w-4" />
                              </motion.button>
                              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Click to change image</p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="upload"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-400"
                            >
                              <div className="p-4 bg-purple-500/20 rounded-full">
                                <Upload className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Upload a Photo</p>
                                <p className="text-sm">Help responders by showing the hazard</p>
                                <p className="text-xs mt-1 text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              variants={fieldVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <AnimatedButton
                type="submit"
                variant="gradient"
                className="w-full h-14 text-lg font-semibold"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {!isSubmitting && <AlertTriangle className="mr-2 h-5 w-5" />}
                {isSubmitting ? "Submitting Report..." : "Submit Emergency Report"}
              </AnimatedButton>
            </motion.div>
        </motion.form>
      </Form>
    </div>
  )
}
