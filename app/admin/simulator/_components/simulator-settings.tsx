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

  // Simple dropdown toggle
  const [showDropdown, setShowDropdown] = useState(false);

  // Geocoding function using OpenStreetMap Nominatim API (free)
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DisasterSimulator/1.0'
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Search results:', data); // Debug log
      setLocationSuggestions(Array.isArray(data) ? data : []);
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
        console.log('Searching for:', locationQuery); // Debug log
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
    setShowDropdown(false);
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
    <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <style jsx>{`
          .stagger-1 { animation-delay: 100ms; }
          .stagger-2 { animation-delay: 200ms; }
          .stagger-3 { animation-delay: 300ms; }
          .stagger-4 { animation-delay: 400ms; }
        `}</style>
        <FormField
          control={form.control}
          name="disasterType"
          render={({ field }) => (
            <FormItem className="group animate-slide-in-up stagger-1 relative z-10">
              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 mb-2 block">Disaster Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20">
                    <SelectValue placeholder="Select a disaster type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-slate-700/50 shadow-2xl z-[10000]">
                  <SelectItem value="Earthquake" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200 cursor-pointer">🌍 Earthquake</SelectItem>
                  <SelectItem value="Flood" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer">🌊 Flood</SelectItem>
                  <SelectItem value="Wildfire" className="hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200 cursor-pointer">🔥 Wildfire</SelectItem>
                  <SelectItem value="Hurricane" className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 cursor-pointer">🌀 Hurricane</SelectItem>
                  <SelectItem value="Tornado" className="hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors duration-200 cursor-pointer">🌪️ Tornado</SelectItem>
                  <SelectItem value="Tsunami" className="hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors duration-200 cursor-pointer">🌊 Tsunami</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300 mt-1">
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
            <FormItem className="group animate-slide-in-up stagger-2 relative z-10">
              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-2 block">Intensity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20">
                    <SelectValue placeholder="Select intensity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-slate-700/50 shadow-2xl z-[10000]">
                  <SelectItem value="Low" className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 cursor-pointer">🟢 Low</SelectItem>
                  <SelectItem value="Moderate" className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200 cursor-pointer">🟡 Moderate</SelectItem>
                  <SelectItem value="High" className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer">🔴 High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300 mt-1">
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
            <FormItem className="group animate-slide-in-up stagger-3 relative z-20">
              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-2 block">Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors duration-300 z-10" />
                  <Input
                    placeholder="Search for a location..."
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      if (!e.target.value) {
                        field.onChange('');
                        setShowDropdown(false);
                      } else {
                        setShowDropdown(true);
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowDropdown(false);
                      }
                    }}
                    className="pl-10 pr-10 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-emerald-500 z-10" />
                  )}
                </div>
              </FormControl>

              {/* Location suggestions dropdown */}
              {showDropdown && (locationSuggestions.length > 0 || locationQuery.length > 2) && (
                <div className="absolute z-[10001] w-full mt-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-600 rounded-lg shadow-2xl max-h-60 overflow-auto backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                  {locationSuggestions.length > 0 ? locationSuggestions.map((location, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 cursor-pointer flex items-center gap-3 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                      onClick={() => selectLocation(location)}
                    >
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {location.display_name?.split(',')[0] || 'Unknown'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {location.display_name || 'No address'}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {isSearching ? 'Searching...' : `Type to search for "${locationQuery}"`}
                    </div>
                  )}
                </div>
              )}

              <FormDescription className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300 mt-1">
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
            <FormItem className="group animate-slide-in-up stagger-4 relative z-10">
              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 mb-2 block">Additional Details (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Magnitude 7.2 earthquake affecting metro stations and hospitals, or Flash flood with 3-hour rainfall causing bridge collapse..."
                  {...field}
                  className="hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                />
              </FormControl>
              <FormDescription className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300 mt-1">
                Provide additional context for the AI to analyze and incorporate into the simulation. Details like magnitude, affected infrastructure, or specific conditions will influence the generated reports and response plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 mt-8">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            disabled={isSimulating}
          >
            <span className="inline-flex items-center gap-2">
              {isSimulating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSimulating ? (
                <span className="animate-pulse">🚀 Generating Simulation...</span>
              ) : (
                <span>🎯 Start Simulation</span>
              )}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            onClick={onCalculateResources}
            disabled={isSimulating || !hasReports}
          >
            <span className="inline-flex items-center gap-2">
              📊 Calculate Resources
            </span>
          </Button>
        </div>
      </form>
    </Form>


    </div>
  );
}
