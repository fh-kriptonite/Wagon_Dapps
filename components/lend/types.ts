export interface Pool {
  lendingCurrency: string;
  pairingCurrency: string;
  stabletoPairRate: string;
  targetLoan: string;
  targetInterestPerPayment: string;
  loanTerm: string;
  collectionTermEnd: string;
  termStart: string;
  paymentFrequency: string;
  status: string;
  borrower: string;
  latestRepayment: string;
}

export interface PoolJson {
  name: string;
  sub_name: string;
  description: string;
  image: string;
  properties: {
    network: string;
    website: string;
    currency: string;
    currency_logo: string;
    principal: number;
    interest: number;
    rating: string;
    term: string;
    APY: number;
    secured_by: string;
    highlights: Array<{
      title: string;
      description: string;
    }>;
    repayment_structure: string;
    term_start: string;
    term_end: string;
    payment_freuency: string;
    total_payment: number;
    type: string;
    borrower: string;
    lender: string;
    custody: {
      custodian: string;
      assets: string[];
    };
  };
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
} 

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
  asset_id: number;
  asset_created_at: string;
  asset_type: string;
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