import { useState, useCallback } from 'react'

/**
 * Custom hook for managing form state with validation
 * @param initialData Initial form data
 * @param initialErrors Initial error state
 * @returns Form state management functions
 */
export const useFormState = <T extends Record<string, any>, E extends Record<string, string>>(
  initialData: T,
  initialErrors: E
) => {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<E>(initialErrors)

  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))

      // Clear error when field is updated
      if (errors[field as keyof E]) {
        setErrors(prev => ({ ...prev, [field]: '' as any }))
      }
    },
    [errors]
  )

  const setFieldError = useCallback((field: keyof E, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData(initialData)
    setErrors(initialErrors)
  }, [initialData, initialErrors])

  const setFormErrors = useCallback((newErrors: Partial<E>) => {
    setErrors(prev => ({ ...prev, ...newErrors }))
  }, [])

  return {
    formData,
    errors,
    updateField,
    setFieldError,
    resetForm,
    setFormErrors,
    setFormData
  }
}
