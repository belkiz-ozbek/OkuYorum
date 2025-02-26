import { useState } from 'react'
import { motion } from 'framer-motion'

type ValidationErrors = {
  [key: string]: string
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateBookInfo = (bookTitle: string, author: string, quantity: number) => {
    const errors: ValidationErrors = {}

    if (!bookTitle.trim()) {
      errors.bookTitle = "Kitap adı gereklidir"
    }
    if (!author.trim()) {
      errors.author = "Yazar adı gereklidir"
    }
    if (quantity < 1) {
      errors.quantity = "En az 1 kitap bağışlamalısınız"
    }
    if (quantity > 100) {
      errors.quantity = "Maksimum 100 kitap bağışlayabilirsiniz"
    }

    return errors
  }

  const validateRecipientInfo = (
    donationType: string,
    institutionName: string,
    location: { lat: number; lng: number },
    address: string
  ) => {
    const errors: ValidationErrors = {}

    if (donationType === "schools" || donationType === "libraries") {
      if (!institutionName.trim()) {
        errors.institutionName = "Kurum adı gereklidir"
      }
      if (location.lat === 0 && location.lng === 0) {
        errors.location = "Lütfen haritadan konum seçin"
      }
    }

    if (donationType === "individual" && !address.trim()) {
      errors.address = "Adres gereklidir"
    }

    return errors
  }

  const clearErrors = () => {
    setErrors({})
  }

  return {
    errors,
    setErrors,
    validateBookInfo,
    validateRecipientInfo,
    clearErrors
  }
}