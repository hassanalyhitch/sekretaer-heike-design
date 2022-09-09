export interface NotificationData{
  notificationId: string,
  customerLoginId: string,
  customerAmsidnr: string,
  createdAt: string,
  readTime: string,
  infoText: string,
  infoHeadline: string,
  isRead: number,
  links:
    {
      assocType: string,
      assocId: string
    }[]
  
}