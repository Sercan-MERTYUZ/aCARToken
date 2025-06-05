'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Car, 
  Truck,
  Bike,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Gauge,
  FileText,
  Coins
} from 'lucide-react';

const ASSET_TYPES = [
  {
    id: 'classic-cars',
    name: 'Classic Cars',
    description: 'Vintage and collectible automobiles',
    icon: Car,
    minValue: 25000,
    examples: ['Classic sports cars', 'Vintage luxury cars', 'Historic vehicles', 'Rare models']
  },
  {
    id: 'fleet-vehicles',
    name: 'Fleet Vehicles',
    description: 'Commercial and rental fleet vehicles',
    icon: Truck,
    minValue: 50000,
    examples: ['Electric vehicle fleets', 'Commercial trucks', 'Rental car fleets', 'Delivery vehicles']
  },
  {
    id: 'micromobility',
    name: 'Micromobility',
    description: 'Urban mobility solutions',
    icon: Bike,
    minValue: 10000,
    examples: ['E-scooter fleets', 'Bike sharing systems', 'Urban mobility services']
  }
];

const STEPS = [
  {
    id: 1,
    name: 'Vehicle Information',
    description: 'Enter basic vehicle details',
    icon: Car
  },
  {
    id: 2,
    name: 'Technical Details',
    description: 'Specifications and condition',
    icon: Gauge
  },
  {
    id: 3,
    name: 'Documentation',
    description: 'Upload required documents',
    icon: FileText
  },
  {
    id: 4,
    name: 'Token Economics',
    description: 'Set token parameters',
    icon: Coins
  },
  {
    id: 5,
    name: 'Review & Publish',
    description: 'Final verification',
    icon: Check
  }
];

interface FormData {
  assetType: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    vin: string;
    currentOwner: string;
    location: string;
  };
  technicalDetails: {
    mileage: string;
    condition: string;
    lastService: string;
    modifications: string;
    specifications: string;
  };
  documentation: {
    registrationDoc: File | null;
    insuranceDoc: File | null;
    serviceHistory: File | null;
    photos: File[];
  };
  tokenEconomics: {
    totalValue: string;
    tokenSupply: string;
    pricePerToken: string;
    minimumInvestment: string;
    tradingLockup: string;
  };
}

export default function Tokenize() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    assetType: '',
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      vin: '',
      currentOwner: '',
      location: ''
    },
    technicalDetails: {
      mileage: '',
      condition: '',
      lastService: '',
      modifications: '',
      specifications: ''
    },
    documentation: {
      registrationDoc: null,
      insuranceDoc: null,
      serviceHistory: null,
      photos: []
    },
    tokenEconomics: {
      totalValue: '',
      tokenSupply: '',
      pricePerToken: '',
      minimumInvestment: '',
      tradingLockup: ''
    }
  });

  const updateFormData = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' && prev[section] !== null ? prev[section] : {}),
        [field]: value
      }
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Vehicle Information</h2>
              <p className="text-muted-foreground">Enter the basic details of your vehicle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input 
                  id="make"
                  value={formData.vehicleInfo.make}
                  onChange={(e) => updateFormData('vehicleInfo', 'make', e.target.value)}
                  placeholder="e.g., Ford, BMW, Mercedes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input 
                  id="model"
                  value={formData.vehicleInfo.model}
                  onChange={(e) => updateFormData('vehicleInfo', 'model', e.target.value)}
                  placeholder="e.g., Mustang, M3, S-Class"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year"
                  value={formData.vehicleInfo.year}
                  onChange={(e) => updateFormData('vehicleInfo', 'year', e.target.value)}
                  placeholder="e.g., 1967"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN Number</Label>
                <Input 
                  id="vin"
                  value={formData.vehicleInfo.vin}
                  onChange={(e) => updateFormData('vehicleInfo', 'vin', e.target.value)}
                  placeholder="Vehicle Identification Number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={formData.vehicleInfo.location}
                  onChange={(e) => updateFormData('vehicleInfo', 'location', e.target.value)}
                  placeholder="Current location of the vehicle"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Technical Details</h2>
              <p className="text-muted-foreground">Provide detailed technical information about the vehicle</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input 
                  id="mileage"
                  value={formData.technicalDetails.mileage}
                  onChange={(e) => updateFormData('technicalDetails', 'mileage', e.target.value)}
                  placeholder="Current mileage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Input 
                  id="condition"
                  value={formData.technicalDetails.condition}
                  onChange={(e) => updateFormData('technicalDetails', 'condition', e.target.value)}
                  placeholder="Overall condition"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastService">Last Service Date</Label>
                <Input 
                  id="lastService"
                  type="date"
                  value={formData.technicalDetails.lastService}
                  onChange={(e) => updateFormData('technicalDetails', 'lastService', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Technical Specifications</Label>
                <Textarea 
                  id="specifications"
                  value={formData.technicalDetails.specifications}
                  onChange={(e) => updateFormData('technicalDetails', 'specifications', e.target.value)}
                  placeholder="Engine details, transmission, special features, etc."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modifications">Modifications</Label>
                <Textarea 
                  id="modifications"
                  value={formData.technicalDetails.modifications}
                  onChange={(e) => updateFormData('technicalDetails', 'modifications', e.target.value)}
                  placeholder="List any modifications or upgrades"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Documentation</h2>
              <p className="text-muted-foreground">Upload required documentation and photos</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>Please upload the following documents in PDF format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vehicle Registration</Label>
                    <Input type="file" accept=".pdf" onChange={(e) => updateFormData('documentation', 'registrationDoc', e.target.files?.[0])} />
                  </div>

                  <div className="space-y-2">
                    <Label>Insurance Documents</Label>
                    <Input type="file" accept=".pdf" onChange={(e) => updateFormData('documentation', 'insuranceDoc', e.target.files?.[0])} />
                  </div>

                  <div className="space-y-2">
                    <Label>Service History</Label>
                    <Input type="file" accept=".pdf" onChange={(e) => updateFormData('documentation', 'serviceHistory', e.target.files?.[0])} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Photos</CardTitle>
                  <CardDescription>Upload high-quality photos of your vehicle (max 10)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => updateFormData('documentation', 'photos', Array.from(e.target.files || []))} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Token Economics</h2>
              <p className="text-muted-foreground">Configure the tokenization parameters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalValue">Total Asset Value (USD)</Label>
                <Input 
                  id="totalValue"
                  type="number"
                  value={formData.tokenEconomics.totalValue}
                  onChange={(e) => updateFormData('tokenEconomics', 'totalValue', e.target.value)}
                  placeholder="e.g., 100000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSupply">Total Token Supply</Label>
                <Input 
                  id="tokenSupply"
                  type="number"
                  value={formData.tokenEconomics.tokenSupply}
                  onChange={(e) => updateFormData('tokenEconomics', 'tokenSupply', e.target.value)}
                  placeholder="e.g., 1000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerToken">Price per Token (USD)</Label>
                <Input 
                  id="pricePerToken"
                  type="number"
                  value={formData.tokenEconomics.pricePerToken}
                  onChange={(e) => updateFormData('tokenEconomics', 'pricePerToken', e.target.value)}
                  placeholder="e.g., 0.10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumInvestment">Minimum Investment (USD)</Label>
                <Input 
                  id="minimumInvestment"
                  type="number"
                  value={formData.tokenEconomics.minimumInvestment}
                  onChange={(e) => updateFormData('tokenEconomics', 'minimumInvestment', e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradingLockup">Trading Lockup Period (days)</Label>
                <Input 
                  id="tradingLockup"
                  type="number"
                  value={formData.tokenEconomics.tradingLockup}
                  onChange={(e) => updateFormData('tokenEconomics', 'tradingLockup', e.target.value)}
                  placeholder="e.g., 90"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Review & Publish</h2>
              <p className="text-muted-foreground">Review your vehicle listing before publication</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Make</dt>
                      <dd className="font-medium">{formData.vehicleInfo.make}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Model</dt>
                      <dd className="font-medium">{formData.vehicleInfo.model}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Year</dt>
                      <dd className="font-medium">{formData.vehicleInfo.year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">VIN</dt>
                      <dd className="font-medium">{formData.vehicleInfo.vin}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Mileage</dt>
                      <dd className="font-medium">{formData.technicalDetails.mileage}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Condition</dt>
                      <dd className="font-medium">{formData.technicalDetails.condition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Last Service</dt>
                      <dd className="font-medium">{formData.technicalDetails.lastService}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Economics</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Total Value</dt>
                      <dd className="font-medium">${formData.tokenEconomics.totalValue}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Token Supply</dt>
                      <dd className="font-medium">{formData.tokenEconomics.tokenSupply}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Price per Token</dt>
                      <dd className="font-medium">${formData.tokenEconomics.pricePerToken}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Minimum Investment</dt>
                      <dd className="font-medium">${formData.tokenEconomics.minimumInvestment}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="w-full md:w-auto">
                Publish Listing
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/backgrnd.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-background/80 backdrop-blur-sm p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">Tokenize Your Vehicle</h1>
          <p className="text-muted-foreground">Convert your vehicle into blockchain tokens</p>
        </div>
        <Card className="max-w-2xl mx-auto bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {step < STEPS.length && (
            <Button
              onClick={() => setStep(step + 1)}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}