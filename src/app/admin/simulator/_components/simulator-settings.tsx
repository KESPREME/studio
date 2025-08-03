"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "@/hooks/use-toast";

const simulationSchema = z.object({
  disasterType: z.enum(["Earthquake", "Flood", "Wildfire"]),
  intensity: z.enum(["Low", "Moderate", "High"]),
});

interface SimulatorSettingsProps {
  onStartSimulation: (values: z.infer<typeof simulationSchema>) => void;
  onCalculateResources: () => void;
  isSimulating: boolean;
  hasReports: boolean;
}

export function SimulatorSettings({
  onStartSimulation,
  onCalculateResources,
  isSimulating,
  hasReports,
}: SimulatorSettingsProps) {
  const form = useForm<z.infer<typeof simulationSchema>>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      disasterType: "Earthquake",
      intensity: "Moderate",
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
                </SelectContent>
              </Select>
              <FormDescription>
                The type of disaster to simulate.
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
                    <SelectValue placeholder="Select an intensity level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The intensity of the disaster. This will affect the number and severity of generated reports.
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