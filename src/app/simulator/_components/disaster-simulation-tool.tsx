// src/app/simulator/_components/disaster-simulation-tool.tsx
"use client";

import { useState } from 'react';
import { Bot, Zap, Loader2, Users, Truck, Stethoscope, Building, Siren, ChevronDown, ChevronRight, AreaChart, StepForward, ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { simulateDisaster, type SimulateDisasterOutput } from '@/ai/flows/simulate-disaster';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SimulatorMap from './simulator-map';


export function DisasterSimulationTool() {
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
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
      <div className="flex-shrink-0 text-primary">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">Recommended Count: {count}</p>
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
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="font-headline text-3xl">Disaster Response Simulator</CardTitle>
                    <CardDescription>Generate an AI-powered response plan for various disaster scenarios.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
            <Select onValueChange={setDisasterType} value={disasterType}>
                <SelectTrigger className="font-semibold">
                <SelectValue placeholder="Select Disaster Type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Urban Flood">Urban Flood</SelectItem>
                <SelectItem value="Earthquake">Earthquake (Magnitude 7.2)</SelectItem>
                <SelectItem value="Cyclone">Cyclone (Category 4)</SelectItem>
                <SelectItem value="Forest Fire">Forest Fire</SelectItem>
                <SelectItem value="Industrial Chemical Spill">Industrial Chemical Spill</SelectItem>
                </SelectContent>
            </Select>
            <Input 
                placeholder="Enter Location (e.g., 'Mumbai, Maharashtra')" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="md:col-span-2 font-semibold"
            />
            </div>
            <Button onClick={handleSimulate} disabled={isLoading} className="w-full text-lg py-6">
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Bot className="mr-2" />}
            Run Simulation
            </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
          <div className="text-center p-12">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-semibold">Generating complex simulation... this may take a moment.</p>
          </div>
      )}

      {simulationResult && (
        <div className="pt-6 space-y-8 animate-in fade-in-50 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Simulation Results: {simulationResult.scenario.disasterType} in {simulationResult.scenario.location}</CardTitle>
                    <CardDescription>{simulationResult.scenario.description}</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <AreaChart className="h-6 w-6 text-primary"/>
                        <CardTitle className="font-headline">Impact Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full rounded-md overflow-hidden border shadow-inner">
                           <SimulatorMap result={simulationResult} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <ListChecks className="h-6 w-6 text-primary"/>
                        <CardTitle className="font-headline">Resource Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {simulationResult.resourceAllocation.map((res, i) => (
                            <ResourceItem key={i} icon={iconMap[res.type] || <Siren className="h-6 w-6"/>} name={res.type} count={res.count} />
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <StepForward className="h-6 w-6 text-primary"/>
                        <CardTitle className="font-headline">Phased Action Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                            {simulationResult.actionPlan.map((phase, i) => (
                                <AccordionItem value={`item-${i}`} key={i}>
                                    <AccordionTrigger className="text-base font-semibold">{phase.phaseName} ({phase.duration})</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc pl-5 mt-1 space-y-2 text-muted-foreground">
                                            {phase.steps.map((step, j) => <li key={j}>{step}</li>)}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
