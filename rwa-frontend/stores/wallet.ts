import { create } from 'zustand';
import { WalletState } from '@/lib/types';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  WatchWalletChanges
} from '@stellar/freighter-api';

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: 'testnet' | 'mainnet') => Promise<void>;
  refreshBalance: () => Promise<void>;
  checkConnection: () => Promise<void>;
  startWalletWatcher: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Wallet watcher instance
let walletWatcher: WatchWalletChanges | null = null;

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  isConnected: false,
  address: null,
  publicKey: null,
  balance: '0',
  network: 'testnet',
  isLoading: false,
  error: null,

  // Clear error state
  clearError: () => set({ error: null }),

  // Connect wallet
  connect: async () => {
    set({ isLoading: true, error: null });

    try {
      const accessResult = await requestAccess();
      if (!accessResult) {
        throw new Error('Wallet access denied');
      }

      const addressResult = await getAddress();
      if (addressResult.error || !addressResult.address) {
        throw new Error('Failed to get wallet address');
      }
      const address = addressResult.address;
      const networkDetails = await getNetworkDetails();
      const network = networkDetails.network === 'TESTNET' ? 'testnet' : 'mainnet';

      set({
        isConnected: true,
        address,
        network,
        isLoading: false
      });

      // Start watching for wallet changes
      get().startWalletWatcher();
      
      console.log('Wallet connected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      console.error('Wallet connection error:', errorMessage);
      
      set({
        isConnected: false,
        address: null,
        isLoading: false,
        error: errorMessage
      });
    }
  },

  // Disconnect wallet
  disconnect: () => {
    // Stop watching for changes
    if (walletWatcher) {
      walletWatcher.stop();
      walletWatcher = null;
    }

    set({
      isConnected: false,
      address: null,
      publicKey: null,
      balance: '0',
      error: null
    });
    console.log('Wallet disconnected');
  },

  // Switch network (Note: This requires user to manually switch in Freighter)
  switchNetwork: async (network: 'testnet' | 'mainnet') => {
    set({ isLoading: true, error: null });
    
    try {
      // Get current network from Freighter
      const networkResult = await getNetwork();
      
      if (networkResult.error) {
        throw new Error(networkResult.error);
      }

      // Check if we're already on the desired network
      const currentNetwork = networkResult.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      
      if (currentNetwork === network) {
        set({ isLoading: false });
        return;
      }

      // We can't programmatically switch networks in Freighter
      // So we'll show an error message asking the user to switch manually
      const targetNetwork = network === 'mainnet' ? 'Mainnet (PUBLIC)' : 'Testnet';
      throw new Error(
        `Please switch to ${targetNetwork} in your Freighter wallet settings, then reconnect.`
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network switch failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
    }
  },

  // Refresh XLM balance
  refreshBalance: async () => {
    const { address, isConnected } = get();
    
    if (!isConnected || !address) {
      return;
    }

    try {
      console.log(`Refreshing balance for ${address}...`);
      
      // In production, you would fetch the actual balance from Horizon
      // For now, we'll use a mock balance
      const mockBalance = '100.0000000';
      set({ balance: mockBalance });
      
      console.log('Balance refreshed');
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      // Don't set error state for balance refresh failures
    }
  },

  // Check if wallet is still connected
  checkConnection: async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return;
      }

      // Check if Freighter is still connected
      const connectionResult = await isConnected();
      
      if (connectionResult.error || !connectionResult.isConnected) {
        get().disconnect();
        return;
      }

      // If we think we're connected but don't have an address, try to get it
      const { isConnected: storeConnected, address } = get();
      if (storeConnected && !address) {
        const addressResult = await getAddress();
        if (addressResult.error || !addressResult.address) {
          get().disconnect();
          return;
        }
        
        set({ 
          address: addressResult.address, 
          publicKey: addressResult.address 
        });
      }
      
      console.log('Connection check completed');
    } catch (error) {
      console.error('Connection check failed:', error);
      get().disconnect();
    }
  },

  // Start wallet watcher (internal method)
  startWalletWatcher: () => {
    if (walletWatcher) {
      walletWatcher.stop();
    }

    walletWatcher = new WatchWalletChanges(3000); // Check every 3 seconds
    
    walletWatcher.watch((changes) => {
      const { address: currentAddress, network: currentNetwork } = get();
      
      // Check if address changed
      if (changes.address !== currentAddress) {
        if (changes.address) {
          set({
            address: changes.address,
            publicKey: changes.address,
            isConnected: true
          });
          console.log('Wallet address changed:', changes.address);
        } else {
          get().disconnect();
        }
      }

      // Check if network changed
      const mappedNetwork = changes.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      if (mappedNetwork !== currentNetwork) {
        set({ network: mappedNetwork });
        console.log('Network changed:', changes.network);
      }
    });
  }
}));