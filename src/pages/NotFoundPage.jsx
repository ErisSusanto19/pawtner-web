import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NotFoundIlustration from '@/assets/undraw_page-not-found_6wni.svg'

const NotFoundPage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center max-w-lg">
                
                <div className="px-4">
                    <img 
                        src={NotFoundIlustration} 
                        alt="Not Found" 
                        className="w-full h-auto max-w-sm mx-auto" 
                    />
                </div>

                <p className="text-base font-semibold text-[#545F71]">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Page not found
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="inline-flex items-center rounded-md bg-[#545F71] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#545F71] transition-all"
                    >
                        <ArrowLeft className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Go back home
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default NotFoundPage