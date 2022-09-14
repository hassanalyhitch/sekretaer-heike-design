
export interface FolderData {
  id : string,
  loginId : string,
  customerAmsidnr : string,
  ownerFolderId : string,
  folderName : string,
  createTime : string,
  createdAt : string,
  subFolders : any[],
  docs: any[],

  isSelected:boolean
}