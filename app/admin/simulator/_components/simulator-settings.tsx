"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

const simulationSchema = z.object({
  disasterType: z.enum(["Earthquake", "Flood", "Wildfire", "Hurricane", "Tornado", "Tsunami"]),
  intensity: z.enum(["Low", "Moderate", "High"]),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

interface SimulatorSettingsProps {
  onStartSimulation: (values: z.infer<typeof simulationSchema>) => void;
  onCalculateResources: () => void;
  isLoading: boolean;
  isSimulating: boolean;
  hasReports: boolean;
}

export function SimulatorSettings({
  onStartSimulation,
  onCalculateResources,
  isLoading,
  isSimulating,
  hasReports,
}: SimulatorSettingsProps) {
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Geocoding function using OpenStreetMap Nominatim API (free)
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error('Error searching location:', error);
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery) {
        searchLocation(locationQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  const selectLocation = (location: any) => {
    const locationName = location.display_name;
    form.setValue('location', locationName);
    setLocationQuery(locationName);
    setLocationSuggestions([]);
  };

  const form = useForm<z.infer<typeof simulationSchema>>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      disasterType: "Earthquake",
      intensity: "Moderate",
      location: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof simulationSchema>) {
    onStartSimulation(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="disasterType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disaster Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a disaster type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Earthquake">Earthquake</SelectItem>
                  <SelectItem value="Flood">Flood</SelectItem>
                  <SelectItem value="Wildfire">Wildfire</SelectItem>
                  <SelectItem value="Hurricane">Hurricane</SelectItem>
                  <SelectItem value="Tornado">Tornado</SelectItem>
                  <SelectItem value="Tsunami">Tsunami</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of disaster for AI-powered simulation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The intensity level affects the number and severity of generated reports.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a location..."
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      if (!e.target.value) {
                        form.setValue('location', '');
                      }
                    }}
                    className="pl-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                  )}
                </div>
              </FormControl>

              {/* Location Suggestions Dropdown */}
              {locationSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => selectLocation(location)}
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {location.display_name.split(',')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {location.display_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <FormDescription>
                Search and select a location for the disaster simulation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Details (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Magnitude 7.2 earthquake in urban area..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide additional context for the AI to generate more realistic scenarios.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="w-full" disabled={isSimulating}>
            {isSimulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Simulation
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCalculateResources}
            disabled={isSimulating || !hasReports}
          >
            Calculate Resources
          </Button>
        </div>
      </form>
    </Form>
  );
}
