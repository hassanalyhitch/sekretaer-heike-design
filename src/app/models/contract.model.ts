export interface ContractData {
  id: number,
  details: {
    Amsidnr: string,
    CustomerAmsidnr: string,
    InsuranceId: string,
    ContractNumber: string,
    Company: string,
    StartDate: string,
    EndDate: string,
    YearlyPayment: string,
    Paymethod: string,
    Branch: string,
    Risk: string,
    docs: {
      category: string,
      docid: string,
      name: string,
      createdAt: string
    }[],
    isFav: any
  },
  isSelected: boolean
}
