export interface PoolFee {
  borrowerFee: bigint;
  adminFee: bigint;
  protocolFee: bigint;
  lateFee: bigint;
  lateDuration: bigint;
  gracePeriodDuration: bigint;
} 

export interface Shipment {
  id: number;
  created_at: string;
  date: string;
  truck: Asset;
  truck_id: number;
  from: string;
  to: string;
  weight: number;
  distance: number;
  [key: string]: any;
} 

export interface Asset {
  id: number;
  created_at: string;
  type: string;
  status: string;
  image_url: string;
  [key: string]: any;
} 

// First, let's define the contract interfaces since they're used in multiple places
interface Contract {
  id: number;
  network: string;
  network_id: number;
  name: string;
  address: string;
  type: string;
  decimals: number | null;
  created_at: string;
  updated_at: string;
}

interface TokenContract extends Contract {
  decimals: number; // Override to make decimals required for token contracts
}

// Define the highlight interface
interface Highlight {
  id: number;
  pool_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Define the pool asset interface
interface PoolAsset {
  id: number;
  pool_id: number;
  asset: string;
  created_at: string;
  updated_at: string;
}

// Define the pool detail interface
interface PoolDetail {
  id: number;
  pool_id: number;
  name: string;
  sub_name: string;
  description: string;
  image: string;
  website: string;
  currency: string;
  currency_logo: string;
  principal: string;
  term: string;
  apy: string;
  repayment_structure: string;
  term_start: string;
  term_end: string;
  payment_frequency: string;
  type: string;
  borrower: string;
  lender: string;
  custodian: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
}

// Main Pool interface
export interface Pool {
  id: number;
  pool_id: number;
  lending_currency: number;
  pairing_currency: number;
  stable_to_pair_rate: number;
  target_loan: string;
  target_interest_per_payment: string;
  loan_term: number;
  collection_term_end: number;
  payment_frequency: number;
  borrower: string;
  contract_id: number;
  status: number;
  term_start: Date;
  latest_repayment: number;
  block: number;
  transaction_hash: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  
  // Nested objects
  lending_contract: TokenContract;
  pairing_contract: TokenContract;
  detail: PoolDetail;
  highlights: Highlight[];
  poolAssets: PoolAsset[];
  contract: Contract;
} 

export interface UserPool {
  balance: string;
  id: number;
  lender_address: string;
  pool: Pool;
}

export interface ActivePool {
  collectedPrincipal: bigint;
  interestPerPayment: bigint;
  defaultAmountToDisburse: bigint;
}