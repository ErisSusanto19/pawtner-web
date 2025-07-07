import React, { useState } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const ForgotPasswordModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
                    aria-label="Close modal"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <h3 className="text-lg font-bold text-gray-800 mb-2">Reset Password</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Enter the email address associated with your account, and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        id="resetEmail"
                        label="Email Address"
                        type="email"
                        register={register}
                        errors={errors}
                        rules={{
                            required: 'Email is required.',
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Please enter a valid email address.',
                            },
                        }}
                    />
                    <Button buttonType="submit" fullWidth disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPasswordModal