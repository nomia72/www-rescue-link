/**
 * RescueLink Blockchain Service
 * Handles all Avalanche Fuji testnet interactions.
 *
 * Environment variables (set in Vercel / .env):
 *   VITE_AVALANCHE_FUJI_RPC_URL   – Avalanche Fuji RPC endpoint
 *   VITE_RESCUELINK_CONTRACT_ADDR – Deployed RescueLink contract address
 *
 * Chain ID: 43113 (Avalanche Fuji C-Chain testnet)
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  encodeFunctionData,
  keccak256,
  toBytes,
  type Hex,
} from 'viem';
import { avalancheFuji } from 'viem/chains';

// ─── Config ──────────────────────────────────────────────────────────
// TODO: Replace with real values or set via Vercel env vars
const RPC_URL =
  import.meta.env.VITE_AVALANCHE_FUJI_RPC_URL ??
  'https://api.avax-test.network/ext/bc/C/rpc';

const CONTRACT_ADDRESS: Hex =
  (import.meta.env.VITE_RESCUELINK_CONTRACT_ADDR as Hex) ??
  '0x0000000000000000000000000000000000000000'; // TODO: deploy & paste real address

// ─── ABI ─────────────────────────────────────────────────────────────
export const RESCUELINK_ABI = [
  {
    name: 'createCase',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'caseId', type: 'bytes32' },
      { name: 'metaHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    name: 'addUpdate',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'caseId', type: 'bytes32' },
      { name: 'updateHash', type: 'bytes32' },
      { name: 'updateType', type: 'string' },
    ],
    outputs: [],
  },
  // TODO: future functions
  // confirmService(bytes32 caseId, string serviceType, bytes32 receiptHash)
  // transferCase(bytes32 caseId, address newOwner)
  // redeemPoints(bytes32 redeemHash)
] as const;

// ─── Clients ─────────────────────────────────────────────────────────
export const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(RPC_URL),
});

// ─── Helpers ─────────────────────────────────────────────────────────

/** Deterministic caseId from a unique off-chain identifier */
export function generateCaseId(uniqueString: string): Hex {
  return keccak256(toBytes(uniqueString));
}

/** Hash key metadata fields into a single bytes32 */
export function generateMetaHash(meta: {
  title: string;
  description: string;
  helpTypes: string[];
  contactVisibility: string;
  timestamp: number;
  city?: string;
  animalType?: string;
}): Hex {
  const raw = JSON.stringify(meta);
  return keccak256(toBytes(raw));
}

// ─── Contract interaction ────────────────────────────────────────────

export interface CreateCaseOnChainResult {
  txHash: string;
  caseIdBytes32: Hex;
  metaHashBytes32: Hex;
}

/**
 * Call createCase on-chain via browser wallet (MetaMask / Rabby etc.)
 * Falls back to a mock if no wallet or contract is not deployed yet.
 */
export async function createCaseOnChain(
  caseIdBytes32: Hex,
  metaHashBytes32: Hex,
): Promise<CreateCaseOnChainResult> {
  // If contract address is zero (not deployed), return mock tx
  if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    console.warn('[blockchain] Contract not deployed – returning mock tx hash');
    const mockTx = keccak256(
      toBytes(`mock-tx-${caseIdBytes32}-${Date.now()}`),
    );
    return {
      txHash: mockTx,
      caseIdBytes32,
      metaHashBytes32,
    };
  }

  // Try browser wallet (window.ethereum)
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error(
      'No wallet detected. Install MetaMask or another Avalanche-compatible wallet.',
    );
  }

  await ethereum.request({ method: 'eth_requestAccounts' });

  const walletClient = createWalletClient({
    chain: avalancheFuji,
    transport: http(RPC_URL),
  });

  // Encode call data
  const data = encodeFunctionData({
    abi: RESCUELINK_ABI,
    functionName: 'createCase',
    args: [caseIdBytes32, metaHashBytes32],
  });

  const [account] = await ethereum.request({ method: 'eth_accounts' }) as string[];

  const txHash = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: account,
        to: CONTRACT_ADDRESS,
        data,
        chainId: '0xa869', // 43113
      },
    ],
  });

  return {
    txHash: txHash as string,
    caseIdBytes32,
    metaHashBytes32,
  };
}

// ─── addUpdate on-chain ──────────────────────────────────────────────

export interface AddUpdateOnChainResult {
  txHash: string;
}

/**
 * Call addUpdate on-chain. Falls back to mock if contract not deployed.
 */
export async function addUpdateOnChain(
  caseIdBytes32: Hex,
  updateHashBytes32: Hex,
  updateType: string,
): Promise<AddUpdateOnChainResult> {
  if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    console.warn('[blockchain] Contract not deployed – returning mock update tx');
    const mockTx = keccak256(toBytes(`mock-update-${caseIdBytes32}-${Date.now()}`));
    return { txHash: mockTx };
  }

  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error('No wallet detected.');
  }

  await ethereum.request({ method: 'eth_requestAccounts' });

  const data = encodeFunctionData({
    abi: RESCUELINK_ABI,
    functionName: 'addUpdate',
    args: [caseIdBytes32, updateHashBytes32, updateType],
  });

  const [account] = await ethereum.request({ method: 'eth_accounts' }) as string[];

  const txHash = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [{ from: account, to: CONTRACT_ADDRESS, data, chainId: '0xa869' }],
  });

  return { txHash: txHash as string };
}
