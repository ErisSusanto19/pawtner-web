import Input from '../../../components/Input'
import DayRow from '../../../components/DayRow'
import FileUpload from '../../../components/FileUpload'
import clsx from 'clsx'
import { ShieldCheck } from 'lucide-react'
import AgreementCheckbox from '../../../components/AgreementCheckbox'

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const RegisterStep3 = ({register, errors, watch, getValues, setValue}) => {
    const hasEmergencyServices = watch("hasEmergencyServices")

    return (
        <div className="space-y-6">
            <div className="flex">
                <ShieldCheck size={20} className="text-[#545F71] font-bold"/>
                <p className="text-[#545F71] font-medium ml-2">Bussiness Detail & Verification</p>
            </div>

            <div className="w-full">
                <label htmlFor="operationHours" className="block text-sm text-gray-900 font-medium mb-2">Operation Hours</label>
                <div className="p-4 border rounded-md border-[#545F71] space-y-3">
                    {daysOfWeek.map(day => (
                        <DayRow
                            key={day}
                            day={day}
                            register={register}
                            watch={watch}
                            getValues={getValues}
                            errors={errors}
                        />
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center">
                    <input
                        id="hasEmergencyServices"
                        name="hasEmergencyServices"
                        type="checkbox"
                        {...register("hasEmergencyServices")}
                        className={clsx(
                            "border h-4 w-4 mt-0.5 rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                            errors["hasEmergencyServices"] && "ring-rose-500",
                        )}
                    />
                    <label htmlFor="hasEmergencyServices" className="block text-sm text-gray-900 font-medium ml-2">
                        Offers an on-call emergency phone service
                    </label>
                </div>
                <p className="text-sm text-gray-500">
                    Customers will be able to contact you outside normal business hours.
                </p>
            </div>

            {hasEmergencyServices && (
                <Input
                    id="emergencyPhone" 
                    label="Emergency Phone" 
                    type="tel" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: hasEmergencyServices? "Emergency phone is required" : false,
                        pattern: {value: /^(\+62|62|0)8[0-9]{8,15}$/, message: "Please use a valid phone number"}
                    }}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUpload
                    name="businessImageUrl"
                    label="Business Profile Photo"
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] }}
                    rules={{}}
                />
                <FileUpload
                    name="certificateImageUrl"
                    label="Business Certificate"
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    accept={{ 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
                    rules={{}}
                />
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-4">
                <AgreementCheckbox
                    id="termsAccepted"
                    label="I agree to the"
                    linkText="Terms of Service"
                    linkHref="/terms-of-service"
                    register={register}
                    errors={errors}
                    rules={{
                        required: 'You must accept the Terms of Service to continue.'
                    }}
                />
                
                <AgreementCheckbox
                    id="privacyAccepted"
                    label="I agree to the"
                    linkText="Privacy Policy"
                    linkHref="/privacy-policy"
                    register={register}
                    errors={errors}
                    rules={{
                        required: 'You must accept the Privacy Policy to continue.'
                    }}
                />
            </div>
        </div>
    )
}

export default RegisterStep3