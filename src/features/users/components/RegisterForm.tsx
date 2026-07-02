'use client'

import { useState, useRef } from 'react'
import { register } from '@/features/users/actions/register'

export default function RegisterForm({ zones = [] }: { zones?: string[] }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, setIsPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const totalSteps = 2

  const handleNext = () => {
    if (formRef.current) {
      const stepInputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `#step-${currentStep} input, #step-${currentStep} select, #step-${currentStep} textarea`
      )

      let isValid = true
      stepInputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity()
          isValid = false
        }
      })

      if (!isValid) return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="relative z-10 w-full max-w-[480px] px-margin-mobile">
      {/* Logo / Header */}
      <div className="text-center mb-8">
        <h1 className="font-headline-md text-headline-md text-primary mb-2">SkillSwap</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Join the digital town square.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_0_rgba(45,106,79,0.08)] p-8">
        {/* Progress Indicator */}
        <div className="mb-8 relative">
          <div className="flex justify-between font-label-sm text-label-sm mb-2 px-1">
            <span className={currentStep >= 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}>1. Account</span>
            <span className={currentStep >= 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}>2. Profile & Zone</span>
          </div>
          <div className="h-3 w-full bg-secondary-fixed rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full relative"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            >
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-on-primary font-bold">↺</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return
              e.preventDefault()
              if (currentStep < totalSteps) {
                handleNext()
              }
            }
          }}
          action={async (formData) => {
            setIsPending(true)
            await register(formData)
            setIsPending(false)
          }}
          className="flex flex-col"
        >
          {/* Step 1: Account */}
          <div id="step-1" className={`flex-col gap-6 ${currentStep === 1 ? 'flex' : 'hidden'}`}>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Full Name</label>
              <input name="full_name" className="input-field" placeholder="Jane Doe" required type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Email Address</label>
              <input name="email" className="input-field" placeholder="jane@example.com" required type="email" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Password</label>
              <input name="password" className="input-field" placeholder="••••••••" required type="password" minLength={8} />
            </div>
          </div>

          {/* Step 2: Profile */}
          <div id="step-2" className={`flex-col gap-6 ${currentStep === 2 ? 'flex' : 'hidden'}`}>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Short Bio</label>
              <textarea name="bio" className="input-field resize-none h-24" placeholder="Tell your neighbors a bit about yourself..." required></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Community Zone</label>
              <select name="community_zone" className="input-field" required defaultValue="">
                <option disabled value="">Select your neighborhood...</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone.toLowerCase().replace(/\s+/g, '-')}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Phone Number (Optional)</label>
              <input name="phone_number" className="input-field" placeholder="(555) 000-0000" type="tel" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-surface-variant">
            {currentStep > 1 ? (
              <button type="button" onClick={handleBack} className="btn-ghost">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                Back
              </button>
            ) : (
              <div className="w-24"></div>
            )}

            {currentStep < totalSteps ? (
              <button type="button" onClick={handleNext} className="btn-primary w-full sm:w-auto">
                Continue
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            ) : (
              <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto disabled:opacity-70">
                {isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>sync</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Join Community
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="text-center mt-6">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Already a neighbor? <a href="/login" className="text-primary font-bold hover:underline">Log in here</a>
        </p>
      </div>
    </div>
  )
}
