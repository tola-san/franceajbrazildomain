export interface EmailForm {
     companyName: string
     name: string
     email: string
     phonePrefix: string
     phoneNumber: string
     region: string
     position: string
     subject: string
     message: string
     paymentTerms?: string
     destinationPort?: string
     incoterms?: string
}
