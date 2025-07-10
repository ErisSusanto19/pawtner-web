import { LoaderCircle } from 'lucide-react'

const PageLoader = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <LoaderCircle className="animate-spin text-[#495057] mx-auto" size={40} />
                <p className="text-[#495057] text-lg font-medium">{ message }</p>
            </div>
        </div>
    )
}

export default PageLoader