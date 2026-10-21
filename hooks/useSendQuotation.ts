import { EmailForm } from '@/types/contact'
import { SendQuotationBody } from '@/types/quotation'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const sendQuotation = async (data: SendQuotationBody) => {
     const res = await fetch('/api/v2/send-quotation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
     })

     if (!res.ok) {
          const error = await res.json()
          throw new Error(error?.error || 'Failed to send quotation. please try again!!')
     }
     
     return res.json()
}

export default function useSendQuotation() {
  return useMutation({
    mutationFn: sendQuotation,
    onSuccess: () => {
      toast.success('Send quotation has been successfully!',{
        icon: "👏",
        position: 'top-right'
      })
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message || 'Failed sending quotation. please try again !!')
    },
  })
}
