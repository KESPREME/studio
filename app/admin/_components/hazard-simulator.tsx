'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type HazardType = 'earthquake' | 'flood' | 'fire' | 'storm' | 'other';

interface HazardSimulation {
  type: HazardType;
  intensity: number;
  location: string;
  radius: number; // in kilometers
  duration: number; // in minutes
}

export function HazardSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<HazardSimulation>({
    type: 'earthquake',
    intensity: 5,
    location: '',
    radius: 10,
    duration: 30,
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSimulation(prev => ({
      ...prev,
      [name]: name === 'intensity' || name === 'radius' || name === 'duration' 
        ? Number(value) 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSimulation(prev => ({
      ...prev,
      [name]: name === 'intensity' || name === 'radius' || name === 'duration' 
        ? Number(value) 
        : value as HazardType
    }));
  };

  const simulateHazard = async () => {
    if (!simulation.location) {
      toast({
        title: 'Error',
        description: 'Please enter a location for the simulation.',
        variant: 'destructive',
      });
      return;
    }

    setIsSimulating(true);
    
    try {
      // Call the API to simulate the hazard
      const response = await fetch('/api/simulate/hazard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simulation),
      });

      if (!response.ok) {
        throw new Error('Failed to simulate hazard');
      }

      const data = await response.json();
      
      toast({
        title: 'Simulation Started',
        description: `Simulated ${simulation.type} at ${simulation.location} affecting a ${simulation.radius}km radius.`,
      });
      
      return data;
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: 'Simulation Failed',
        description: 'Failed to start the simulation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hazard Simulator</CardTitle>
        <CardDescription>
          Simulate different types of hazards to test the system's response.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hazard-type">Hazard Type</Label>
          <Select 
            value={simulation.type} 
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select hazard type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="earthquake">Earthquake</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="storm">Storm</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="intensity">Intensity (1-10)</Label>
          <Input
            id="intensity"
            name="intensity"
            type="number"
            min="1"
            max="10"
            value={simulation.intensity}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (Coordinates or Address)</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., 40.7128,-74.0060 or New York, NY"
            value={simulation.location}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="radius">Affected Radius (km)</Label>
          <Input
            id="radius"
            name="radius"
            type="number"
            min="1"
            value={simulation.radius}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={simulation.duration}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={simulateHazard} 
          disabled={isSimulating}
          className="w-full"
        >
          {isSimulating ? 'Simulating...' : 'Start Simulation'}
        </Button>
      </CardFooter>
    </Card>
  );
}
