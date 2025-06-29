import Input from '../../../components/Input'
import TextArea from '../../../components/TextArea'
import FileUpload from '../../../components/FileUpload'
import { UserRound } from 'lucide-react'

const RegisterStep1 = ({register, errors, getValues, watch, setValue}) => {

    return (
        <div className="space-y-6">
            <div className="flex">
                <UserRound size={20} className="text-[#545F71] font-bold"/>
                <p className="text-[#545F71] font-medium ml-2">Personal Information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div className="md:col-span-1">
                    <FileUpload
                        name="imageUrl"
                        label="Profile Picture"
                        accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        errors={errors}
                        // rules={{ required: 'Profile picture is required.' }}
                    />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <Input 
                        id="fullName" 
                        label="Full Name" 
                        type="text" 
                        register={register} 
                        errors={errors}
                        rules={{
                            required: {value: true, message: "Name is required"}, 
                        }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                            id="email" 
                            label="Email" 
                            type="email" 
                            register={register} 
                            errors={errors}
                            rules={{
                                required: {value: true, message: "Email is required"}, 
                                pattern: {value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Please use a valid email address"}
                            }}
                        />

                        <Input 
                            id="phone" 
                            label="Phone" 
                            type="tel" 
                            register={register} 
                            errors={errors}
                        />
                    </div>
                </div>
            </div>

            <TextArea 
                id="address" 
                label="Address" 
                rows={3} 
                register={register} 
                errors={errors}
            />

            <div className='flex space-x-4'>
                <Input 
                    id="password" 
                    label="Password" 
                    type="password" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, message: "Password is required"}, 
                        minLength: {value: 6, message: "Password must be at least 6 characters long"}
                    }}
                />

                <Input 
                    id="confirmPassword" 
                    label="Confirm Password" 
                    type="password" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, massage: "Please confirm your password"},
                        validate: (value) => value === getValues("password") || "Passwords don't match"
                    }}
                />
            </div>
        </div>
    )
}

export default RegisterStep1