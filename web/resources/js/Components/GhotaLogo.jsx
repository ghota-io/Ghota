export default function GhotaLogo({ className = '', white = false }) {
    const textColor = white ? 'text-white' : 'text-gray-900 dark:text-white'

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {white ? (
                <img src="/assets/logo/LogoSM_White_Transparent_100_Cropped.png" alt="Ghota" className="h-5 w-auto" />
            ) : (
                <>
                    <img src="/assets/logo/LogoSM_White_Transparent_100_Cropped.png" alt="Ghota" className="h-5 w-auto hidden dark:block" />
                    <img src="/assets/logo/LogoSM_Black_Transparent_100_Cropped.png" alt="Ghota" className="h-5 w-auto dark:hidden" />
                </>
            )}
            <span className={`font-['Poppins'] text-2xl font-bold tracking-tight ${textColor}`}>Ghota</span>
        </div>
    )
}
