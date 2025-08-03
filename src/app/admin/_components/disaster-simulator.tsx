// src/app/admin/_components/disaster-simulator.tsx
"use client";

import { useState } from 'react';
import { Bot, Zap, Loader2, Users, Truck, Stethoscope, Building, Siren, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { simulateDisaster, type SimulateDisasterOutput } from '@/ai/flows/simulate-disaster';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export function DisasterSimulator() {
  const [disasterType, setDisasterType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulateDisasterOutput | null>(null);
  const { toast } = useToast();

  const handleSimulate = async () => {
    if (!disasterType || !location) {
      toast({
        title: 'Missing Information',
        description: 'Please select a disaster type and enter a location.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSimulationResult(null);
    try {
      const result = await simulateDisaster({
        disasterType,
        location,
      });
      setSimulationResult(result);
      toast({
        title: 'Simulation Complete',
        description: `Generated a response plan for a ${disasterType} in ${location}.`,
      });
    } catch (error) {
      console.error('Simulation failed:', error);
      toast({
        title: 'Simulation Failed',
        description: 'Could not generate a simulation at this time. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ResourceItem = ({ icon, name, count }: { icon: React.ReactNode, name: string, count: number }) => (
    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
      <div className="text-primary">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">Count: {count}</p>
      </div>
    </div>
  );
  
  const iconMap: { [key: string]: React.ReactNode } = {
    'Personnel': <Users className="h-6 w-6" />,
    'Heavy Equipment': <Truck className="h-6 w-6" />,
    'Medical Units': <Stethoscope className="h-6 w-6" />,
     'Emergency Shelters': <Building className="h-6 w-6" />,
    'Command Vehicles': <Siren className="h-6 w-6" />,
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline">Disaster Response Simulator</CardTitle>
            <CardDescription>Generate an AI-powered response plan for various disaster scenarios.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setDisasterType} value={disasterType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Disaster Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Urban Flood">Urban Flood</SelectItem>
              <SelectItem value="Earthquake">Earthquake (Magnitude 7.2)</SelectItem>
              <SelectItem value="Cyclone">Cyclone (Category 4)</SelectItem>
              <SelectItem value="Forest Fire">Forest Fire</SelectItem>
              <SelectItem value="Chemical Spill">Industrial Chemical Spill</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            placeholder="Enter Location (e.g., 'Chennai, Tamil Nadu')" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="md:col-span-2"
          />
        </div>
        <Button onClick={handleSimulate} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Bot className="mr-2" />}
          Generate Response Plan
        </Button>

        {simulationResult && (
          <div className="pt-6 border-t space-y-4 animate-in fade-in-50 duration-500">
            <h3 className="text-xl font-bold font-headline text-center">Simulation for {simulationResult.scenario.disasterType} in {simulationResult.scenario.location}</h3>
            
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">Affected Zones</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {simulationResult.affectedZones.map((zone, i) => (
                       <li key={i}><strong>{zone.name}:</strong> Impact level {zone.impactLevel}/10. Located near {zone.lat.toFixed(4)}, {zone.lon.toFixed(4)}.</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">Resource Allocation</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {simulationResult.resourceAllocation.map((res, i) => (
                    <ResourceItem key={i} icon={iconMap[res.type] || <Siren className="h-6 w-6"/>} name={res.type} count={res.count} />
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">Action Plan</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {simulationResult.actionPlan.map((phase, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-primary">{phase.phaseName} (Duration: {phase.duration})</h4>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                            {phase.steps.map((step, j) => <li key={j}>{step}</li>)}
                        </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
