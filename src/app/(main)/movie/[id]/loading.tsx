export default function Loading() {
    return (
        <div className='h-screen w-full flex flex-col '>
            <style>
                {`
                @keyframes slide{
                    0%{transform:translateX(-100%)}
                    100%{transform:translateX(300%)}
                }
                .animate-slide-infinite{
                animation:slide 1.5s ease-in-out infinite}`}
            </style>
            <div className='flex-1 flex flex-col items-center justify-center'>
                {/* Spinner */}
                <div className='relative flex items-center justify-center w-16 h-16'>
                    <div className='absolute inset-0 border border-slate-800 rounded-full border-dashed animate-[spin_4s_linear_infinite] ' />
                    <div className='absolute inset-2 border-t border-t-white border-l border-l-transparent border-r border-r-transparent border-b border-b-transparent rounded-full animate-[spin_4s_linear_infinite]' />
                    <div className='w-1.5 h-1.5 bg-white rounded-full animate-pulse' />
                </div>
                <h2 className='text-gray-200 text-xl font-bold mb-1'>Loading...</h2>
                <span className='text-gray-400 text-sm font-semibold mb-8'>Preparing your view</span>

                <div className='h-[2px] w-48 bg-slate-800/60 overflow-hidden relative'>
                    <div className='absolute top-0 left-0 h-full bg-white w-1/3 animate-slide-infinite'></div>
                </div>
            </div>
        </div>
    )
}