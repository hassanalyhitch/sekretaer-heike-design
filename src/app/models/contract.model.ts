import { DocumentData } from "./document.model";

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
    docs: DocumentData[],
    name: string,
    productSek: string,
    tarif: string,
    isFav: any
    favoriteId: string
  },
  isSelected: boolean
}
