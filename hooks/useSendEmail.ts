import { EmailForm } from '@/types/contact'
import { addToast } from '@heroui/toast'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const sendEmail = async (data: EmailForm) => {
     const res = await fetch('/api/v2/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
     })

     if (!res.ok) {
          const error = await res.json()
          throw new Error(error?.error || 'Failed to send email')
     }

     return res.json()
}

export default function useSendEmail() {
     return useMutation({
          mutationFn: sendEmail,
          onError: (error: unknown) => {
               addToast({
                    title: (error as Error)?.message || 'Error sending email',
                    description: 'Something went wrong while submitting your request. Please try again later.',
                    color: 'danger',
                    classNames:{
                      base: "border-danger bg-[#FEE7EF] p-3 rounded-[20px]  max-w-xl",
                       title: "text-base font-mono text-primary line-clamp-1",
                       description: "text-black",
                      icon: "text-danger",
                      closeIcon: "bg-[#FEE7EF]"
                    }
               })
               toast.error((error as Error)?.message || 'Error sending email')
          },
     })
}
