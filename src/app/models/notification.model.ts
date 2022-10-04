export interface NotificationData{
  notificationId: string,
  customerLoginId: string,
  customerAmsidnr: string,
  createdAt: string,
  readTime: string,
  infoText: string,
  infoHeadline: string,
  isRead: any,
  links:
    {
      assocType: string,
      assocId: string
    }[]
  
}