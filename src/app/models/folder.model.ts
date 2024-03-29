import { DocumentData } from "./document.model";

export interface FolderData {
  id : string,
  loginId : string,
  customerAmsidnr : string,
  ownerFolderId : string,
  folderName : string,
  createTime : string,
  createdAt : string,
  subFolders : FolderData[],
  docs: DocumentData[],
  isFavorite: number,
  favoriteId?: number,

  swipedLeft?:boolean;
  isSelected:boolean
}