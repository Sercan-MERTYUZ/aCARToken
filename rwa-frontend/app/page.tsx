'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Check
} from 'lucide-react';
import { formatTokenAmount, formatCurrency, formatPercentage } from '@/lib/stellar';
import Link from 'next/link';

export default function Dashboard() {
  const { isConnected, address, checkConnection } = useWalletStore();
  const { 
    assetMetadata, 
    userBalance, 
    isWhitelisted, 
    compliance,
    isLoading,
    fetchContractData,
    fetchUserData 
  } = useContractStore();

  // Check wallet connection and fetch data on mount
  useEffect(() => {
    checkConnection();
    fetchContractData();
  }, [checkConnection, fetchContractData]);

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchUserData]);
  if (!isConnected) {
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
        <Header />        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-8">
            <div className="text-center space-y-4 max-w-2xl bg-background/80 backdrop-blur-sm p-8 rounded-lg">
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                aCARtoken Investment Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Access tokenized automotive assets and mobility solutions
                through compliant blockchain technology on Stellar.
              </p>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <Card className="text-center bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <Building2 className="h-12 w-12 mx-auto text-primary" />
                  <CardTitle className="text-lg">Tokenized Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Invest in premium automotive assets through blockchain tokens
                  </p>
                </CardContent>
              </Card>
                <Card className="text-center bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                  <CardTitle className="text-lg">Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    KYC verification and regulatory compliance built into every transaction
                  </p>
                </CardContent>
              </Card>
                <Card className="text-center bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle className="text-lg">High Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Earn returns through vehicle value appreciation and rental income
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }  return (
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">aCARtoken Dashboard</h1>
          <p className="text-muted-foreground">Your gateway to automotive asset tokenization</p>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Portfolio</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(userBalance || 0)}</div>
              <p className="text-xs text-muted-foreground">Total value of your tokenized vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Listed Vehicles</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetMetadata?.activeAssets || 0}</div>
              <p className="text-xs text-muted-foreground">Active vehicle listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Verification</CardTitle>
              {isWhitelisted ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> :
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              }
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isWhitelisted ? 'Verified' : 'Pending'}
              </div>
              <p className="text-xs text-muted-foreground">Vehicle ownership verification status</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+12.5%</div>
              <p className="text-xs text-muted-foreground">30-day value appreciation</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/marketplace" className="block">
            <Button className="w-full" variant="outline">
              Browse Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link href="/transfer" className="block">
            <Button className="w-full" variant="outline">
              Transfer Tokens
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link href="/tokenize" className="block">
            <Button className="w-full" variant="outline">
              List Your Vehicle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
