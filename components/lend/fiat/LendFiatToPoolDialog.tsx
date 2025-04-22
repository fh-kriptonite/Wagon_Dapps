import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { ImCross } from "react-icons/im";
import { inputNumberFilter, numberWithCommas } from "../../../util/stringUtility";
import { formatTime } from '../../../util/lendingUtility';
import { Button, Checkbox } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Pool, PoolJson, PoolFee } from '../types';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
interface Profile {
  id: string;
  wallet_address: string;
  email: string;
  kyc_status: string;
  created_at: string;
  updated_at: string;
  status: number;
}

interface LendFiatToPoolDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  pool: Pool;
  poolJson: PoolJson;
  symbol: string;
  fees: PoolFee | null;
  profile: Profile | null;
  poolId: string;
  handleLend: (data: { amount: number; currency: string; paymentUrl: string }) => void;
}

export default function LendFiatToPoolDialog(props: LendFiatToPoolDialogProps) {
  const { connectedAddress: address } = useConnectedAddress();
  const router = useRouter();
  
  const [stableNumber, setStableNumber] = useState<string>("");
  const [checkedTnc, setCheckedTnc] = useState<boolean>(false);
  const [isLoadingRequestOnRamp, setIsLoadingRequestOnRamp] = useState<boolean>(false);

  const { isOpen, closeModal, pool, poolJson, symbol, profile, fees, poolId, handleLend } = props;

  function resetModal(): void {
    setStableNumber("");
    setCheckedTnc(false);
  }

  function getExpectedInterest(): number {
    if (stableNumber === "") return 0;
    const interestPerTerm = parseFloat(stableNumber) / parseFloat(pool?.targetLoan?.toString() ?? "0") * parseFloat(pool?.targetInterestPerPayment?.toString() ?? "0");
    const protocolFee = interestPerTerm * parseFloat(fees?.protocolFee?.toString() ?? "0") / 10000;

    const interestNetPerTerm = interestPerTerm - protocolFee;

    return interestNetPerTerm * parseFloat(pool?.paymentFrequency?.toString() ?? "0");
  }

  function getPaymentFrequency(): number {
    if (!pool) return 0;
    return parseFloat(pool.paymentFrequency);
  }

  function getAdminFee(): number {
    if (fees == null || stableNumber === "") return 0;
    return (parseFloat(stableNumber) * parseFloat(fees.adminFee.toString()) / 10000);
  }

  function showAdminFee(): boolean {
    if (!fees) return false;
    if (fees.adminFee.toString() === "0") return false;
    return true;
  }

  function getLendToPoolButtonDisabled(): boolean {
    if (isLoadingRequestOnRamp) return true;
    if (!checkedTnc) return true;
    if (stableNumber === "") return true;
    if (parseFloat(stableNumber) <= 0) return true;
    return false;
  }

  function getLendToPoolButtonText(): string {
    if (profile == null) return "Verify Profile Now";
    if (isLoadingRequestOnRamp) return "Lending...";
    return "Lend To Pool";
  }

  async function requestOnramp(stableNumber: string, fee: number): Promise<void> {
    try {
      setIsLoadingRequestOnRamp(true);
      const payload = {
        amount: parseInt(stableNumber),
        fee: fee,
        poolId: parseInt(poolId),
        wallet_address: address
      };

      // Request Account
      const response = await axios.post(
        `${process.env.RAMP_API_URL}/api/ramp/onramp_pool`, 
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.error) {
        throw response.data.error;
      }

      handleLend(response.data.data); 
      setIsLoadingRequestOnRamp(false);
    } catch (error) {
      // Handle error response
      console.error('Error:', error);
      setIsLoadingRequestOnRamp(false);
    }
  }

  function handleLendClick(): void {
    if (profile == null) {
      router.push('/account/profile');
    } else if (profile?.status !== 1) {
      router.push('/account/profile');
    } else {
      // call onramp service
      const fee = getAdminFee();
      requestOnramp(stableNumber, fee);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const rawValue = inputNumberFilter(e.target.value);
    setStableNumber(rawValue);
  }
  
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className='flex justify-between items-center mb-6'>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Lend To Pool
                    </Dialog.Title>
                    <button 
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <ImCross className="w-4 h-4"/>
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className='flex gap-2 items-center justify-between'>
                      <input 
                        type="text"
                        className="text-2xl font-semibold text-gray-900 bg-transparent border-none focus:ring-0 outline-none w-full focus:outline-none flex-1" 
                        value={numberWithCommas(stableNumber)}
                        onChange={handleChange}
                        placeholder="0" 
                        required
                      />
                      <div className="flex items-center gap-2">
                        <img src={poolJson?.properties.currency_logo} className="h-7" alt="IDRT Logo"/>
                        <p className="text-lg text-gray-500">
                          IDR
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 border-t pt-3 mt-2">
                      Minimum Lend: {numberWithCommas(20000)} IDR
                    </p>

                    {showAdminFee() && (
                      <div className='flex gap-2 items-center justify-between text-center border-t pt-3 mt-2'>
                        <p className="text-sm text-gray-600">
                          Admin Fee
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          + {numberWithCommas(getAdminFee(), 2)} {symbol}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-gray-600 border-b pb-2 mb-4">
                      Expectation and pool maturity
                    </p>
                    
                    <div className='flex gap-2 items-center justify-between mb-3'>
                      <p className="text-sm text-gray-600">
                        Loan Term
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatTime(parseFloat(pool?.loanTerm))}
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between mb-3'>
                      <p className="text-sm text-gray-600">
                        Payment Frequency
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {numberWithCommas(getPaymentFrequency())} times
                      </p>
                    </div>

                    <div className='flex gap-2 items-center justify-between'>
                      <p className="text-sm text-gray-600">
                        Expected Interest
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {numberWithCommas(getExpectedInterest(), 2)} IDR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <Checkbox 
                      id="tnc" 
                      checked={checkedTnc} 
                      onChange={() => { setCheckedTnc(!checkedTnc); }}
                    />
                    <p className="text-sm text-gray-600">
                      I confirm acceptance of these 
                      <Link 
                        href="/lendTnc" 
                        passHref 
                        className="text-blue-600 hover:text-blue-700 ml-1" 
                        target="_blank"
                      >
                        terms and conditions
                      </Link>.
                    </p>
                  </div>

                  {(profile == null || profile?.status !== 1) && (
                    <p className='text-sm mt-4 text-red-500 text-center'>
                      Please verify your account by KYC to unlock this service.
                    </p>
                  )}

                  <div className="mt-6">
                    <Button
                      color="dark"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={getLendToPoolButtonDisabled()}
                      onClick={handleLendClick}
                    >
                      {getLendToPoolButtonText()}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 