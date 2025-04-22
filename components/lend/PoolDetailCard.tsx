import { MdSecurity } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import LoadingPoolDetailCard from './LoadingPoolDetailCard';
import ReactMarkdown from 'react-markdown';

interface Highlight {
    title: string;
    description: string;
}

interface PoolJson {
    properties: {
        network: string;
        currency_logo: string;
        type: string;
        website: string;
        highlights: Highlight[];
    };
    image: string;
    name: string;
    sub_name: string;
    description: string;
}

interface PoolDetailCardProps {
    poolJson: PoolJson | null;
}

export default function PoolDetailCard({ poolJson }: PoolDetailCardProps) {
    return (
        <>
            {
                poolJson == null
                ? <LoadingPoolDetailCard/>
                : <div className='card !p-0 overflow-hidden'>
                    {
                        (poolJson.properties.network == "offchain") &&
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-full text-sm font-semibold text-center p-2 text-white">
                            Institutional Investment
                        </div>
                    }
                    <div className="p-4 md:p-6 space-y-6">
                        {/* Header Section */}
                        <div className='flex flex-col md:flex-row items-start gap-4 md:gap-6'>
                            {/* Logo Section */}
                            <div className="flex-none card relative !p-3 bg-white shadow-sm">
                                <img 
                                    src={poolJson?.image} 
                                    className="h-24 w-24 md:h-32 md:w-32 object-contain" 
                                    alt="Project Logo" 
                                />
                            </div>
                        
                            {/* Info Section */}
                            <div className='flex flex-col gap-3 md:gap-4 flex-1'>
                                <div className="space-y-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{poolJson?.name}</h2>
                                    <h5 className="text-sm md:text-base italic text-gray-500">{poolJson?.sub_name}</h5>
                                </div>

                                {/* Badges Section */}
                                <div className='flex flex-wrap gap-2'>
                                    {
                                        (poolJson.properties.network == "offchain")
                                        ? <div className='flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200'>
                                            <p className='text-xs font-medium text-gray-700'>Off Chain</p>
                                        </div>
                                        : <div className="flex gap-2">
                                            <img src="/network/logo-bnb.png" className="h-8 md:h-10" alt="Stable coin Logo" />  
                                            <img src={poolJson?.properties.currency_logo} className="h-8 md:h-10" alt="Stable coin Logo" />  
                                        </div>
                                    }

                                    <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100'>
                                        <MdSecurity size={14} className="text-blue-500" />
                                        <p className='text-xs font-medium text-blue-700'>Secured <span className='font-semibold'>{poolJson?.properties.type}</span></p>
                                    </div>
                                </div>

                                {/* Website Link */}
                                <div className="flex items-center gap-2">
                                    <FaTruck size={16} className="text-gray-400"/>
                                    <a 
                                        href={poolJson?.properties.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                    >
                                        {poolJson?.properties.website}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-sm md:prose-base max-w-none space-y-2">
                            <ReactMarkdown>{poolJson?.description}</ReactMarkdown>
                        </div>

                        {/* Highlights Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {
                                poolJson.properties.highlights.map((highlight, index) => (
                                    <div 
                                        className='p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-sm' 
                                        key={`highlight-${index}`}
                                    >
                                        <h3 className='text-sm md:text-base font-semibold text-blue-900'>{highlight.title}</h3>
                                        <p className='text-sm text-blue-800 mt-2'>{highlight.description}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    );
} 