export class NewContractClass{
  private  BranchId:string;
  private  createdAt:string;

constructor(BranchId:string,createdAt:string)
{
this.BranchId = BranchId;
this.createdAt = createdAt;
}

getBranch():string{
    return this.BranchId;
}

getDate():string{
    return this.createdAt;
}

}
