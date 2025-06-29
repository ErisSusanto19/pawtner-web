import Input from '../../../components/Input'
import TextArea from '../../../components/TextArea'
import clsx from 'clsx'
import { Building2 } from 'lucide-react'

const bussinessTypeOptions = [
    {value: "VETERINARY_CLINIC", label: "Veterinary Clinic"},
    {value: "PET_SHOP", label: "Pet Shop"},
    {value: "GROOMING_SALON", label: "Grooming Salon"},
    {value: "BOARDING_DAYCARE", label: "Boarding Daycare"},
    {value: "HYBRID", label: "Hybrid"},
]

const RegisterStep2 = ({register, errors}) => {
    return (
        <div className="space-y-6">
            <div className="flex">
                <Building2 size={20} className="text-[#545F71] font-bold"/>
                <p className="text-[#545F71] font-medium ml-2">Bussiness Information</p>
            </div>

            <Input 
                id="bussinessName" 
                label="Bussiness Name" 
                type="text" 
                register={register} 
                errors={errors}
                rules={{
                    required: {value: true, message: "Bussiness name is required"}, 
                }}
            />

            <div className="w-full">
                <label htmlFor="bussinessType" className="block text-sm text-gray-900 font-medium mb-2">Bussiness Type</label>
                <select 
                    id="bussinessType" 
                    name="bussinessType"
                    {...register("bussinessType", {
                        required: {value: true, message: "Bussiness type is required"}
                    })}
                    className={clsx(
                        "block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                        errors["bussinessType"] && "ring-rose-500",
                    )}
                >
                    <option value="" disabled>Select a type</option>

                    {bussinessTypeOptions.map(el => (
                        <option key={el.value} value={el.value}>{el.label}</option>
                    ))}

                </select>

                {errors["bussinessType"] && (
                    <p className="text-rose-500 text-sm mt-1">
                        {errors["bussinessType"].message}
                    </p>
                )}
            </div>

            <TextArea 
                id="bussinessDescription" 
                label="Bussiness Description" 
                rows={3} 
                register={register} 
                errors={errors}
            />

            <div className="flex space-x-4">
                <Input 
                    id="bussinessEmail" 
                    label="Bussiness Email" 
                    type="email" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, message: "Bussiness email is required"}, 
                        pattern: {value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Please use a valid email address"}
                    }}
                />

                <Input 
                    id="bussinessPhone" 
                    label="Bussiness Phone" 
                    type="tel" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, message: "Bussiness email is required"},
                        pattern: {value: /^(\+62|62|0)8[0-9]{8,15}$/, message: "Please use a valid phone number"}
                    }}
                />
            </div>

            <TextArea 
                id="bussinessAddress"
                label="Bussiness Address" 
                rows={3}
                register={register} 
                errors={errors}
            />
        </div>
    )
}

export default RegisterStep2