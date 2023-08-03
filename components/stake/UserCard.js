import StakingStatsSummary from "./StakingStatsSummary"
import StakeSection from "./StakeSection";

export default function UserCard(props) {
    return (
        <>
            <div className="card">
                <div className="flex flex-col-reverse lg:flex-row gap-2">
                    <div className="flex-initial lg:w-1/3 lg:pr-4">
                        <StakeSection {...props}/>
                    </div>

                    <div className="grow">
                        <div className="h-full">
                            <StakingStatsSummary  {...props}/>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
  }