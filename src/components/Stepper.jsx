import React from 'react'
import clsx from 'clsx';
import { Check } from 'lucide-react';

const Stepper = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-xs mx-auto mb-12">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;

          return (
            
            <React.Fragment key={step}>
              
              <div
                className={clsx(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300 flex-shrink-0",
                  isCompleted ? "bg-[#545F71] text-white" : "",
                  isActive ? "bg-[#C3D3E0] text-[#545F71] ring-2 ring-offset-2 ring-offset-white ring-[#545F71]" : "",
                  !isCompleted && !isActive ? "bg-[#E9ECEF] text-[#ADB5BD]" : ""
                )}
              >
                {isCompleted ? <Check size={24} /> : step}
              </div>

              {index < totalSteps - 1 && (
                <div
                  className={clsx(
                    "flex-auto h-0.5 transition-colors duration-300",
                    currentStep > step ? "bg-[#545F71]" : "bg-[#E9ECEF]"
                  )}
                ></div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper