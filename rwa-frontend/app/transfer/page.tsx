'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Car,
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Info,
  Wallet,
  Share2
} from 'lucide-react';
import { formatTokenAmount, isValidStellarAddress, toContractAmount, estimateNetworkFee } from '@/lib/stellar';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TransferPage() {
  const { isConnected, address, connect } = useWalletStore();
  const { 
    userBalance, 
    isWhitelisted, 
    compliance,
    transfer,
    isLoading,
    fetchUserData,
    fetchContractData
  } = useContractStore();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [recipientCompliance, setRecipientCompliance] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load data on mount and when wallet connects
  useEffect(() => {
    fetchContractData();
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchContractData, fetchUserData]);

  // Validate recipient address
  useEffect(() => {
    if (recipient) {
      const valid = isValidStellarAddress(recipient);
      setIsValidRecipient(valid);
      
      if (valid) {
        // In a real app, this would check recipient compliance
        setRecipientCompliance({
          isWhitelisted: true,
          kyc_verified: true,
          jurisdiction: 'US'
        });
      } else {
        setRecipientCompliance(null);
      }
    } else {
      setIsValidRecipient(false);
      setRecipientCompliance(null);
    }
  }, [recipient]);

  const handleMaxAmount = () => {
    setAmount(formatTokenAmount(userBalance));
  };

  const canTransfer = () => {
    if (!isConnected || !address) return false;
    if (!isWhitelisted) return false;
    if (!isValidRecipient) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (parseFloat(amount) > parseFloat(formatTokenAmount(userBalance))) return false;
    return true;
  };

  const handleTransfer = async () => {
    if (!canTransfer() || !address) return;

    try {
      const contractAmount = toContractAmount(amount);
      const success = await transfer(address, recipient, contractAmount);
      
      if (success) {
        toast.success('Transfer completed successfully!');
        setAmount('');
        setRecipient('');
        setShowConfirmation(false);
      } else {
        toast.error('Transfer failed. Please try again.');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed. Please check the details and try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-6">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  You need to connect your Freighter wallet to transfer RWA tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connect} className="w-full">
                  Connect Freighter Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold mb-2">Transfer Tokens</h1>
          <p className="text-muted-foreground">Send your vehicle tokens to another wallet</p>
        </div>
        <Card className="max-w-2xl mx-auto bg-background/80 backdrop-blur-sm border-primary/20">
          {/* Current Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Your Vehicle Portfolio</CardTitle>
              <CardDescription>Available vehicle shares for transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{formatTokenAmount(userBalance)} ACAR</p>
                  <p className="text-sm text-muted-foreground">Automotive Asset Tokens</p>
                </div>
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span>
                  Ownership Status: {' '}
                  <Badge variant={isWhitelisted ? 'default' : 'destructive'}>
                    {isWhitelisted ? 'Verified' : 'Not Verified'}
                  </Badge>
                </span>
                {compliance?.kyc_verified && (
                  <Badge variant="outline" className="text-xs">
                    KYC Complete
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the recipient's information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">New Owner's Address</Label>
                <Input
                  id="recipient"
                  placeholder="Enter Stellar address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className={isValidRecipient ? 'border-green-500' : ''}
                />
                {recipient && !isValidRecipient && (
                  <p className="text-sm text-destructive">Please enter a valid Stellar address</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Share Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ACAR
                  </span>
                </div>
                {userBalance && (
                  <p className="text-sm text-muted-foreground">
                    Available: {formatTokenAmount(userBalance)} ACAR
                  </p>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Share transfers are subject to ownership verification and compliance checks
                </AlertDescription>
              </Alert>

              {/* Transfer Button */}
              <Button 
                onClick={handleTransfer}
                disabled={!canTransfer() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  'Processing Transfer...'
                ) : (
                  <>
                    Transfer Vehicle Shares
                    <Share2 className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Warnings */}
              {!isWhitelisted && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your address is not verified. You cannot transfer shares until ownership verification is complete.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transfer Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Ownership Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Both sender and recipient must have completed ownership verification
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Whitelist Status</p>
                  <p className="text-sm text-muted-foreground">
                    Addresses must be on the approved whitelist for vehicle transfers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Transfer Limits</p>
                  <p className="text-sm text-muted-foreground">
                    Transfers must comply with minimum and maximum share limits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">
                ← Back to Dashboard
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}