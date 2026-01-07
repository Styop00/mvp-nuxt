import type Users from "~/interfaces/users/users";

export default interface Message {
    id: number
    typeId: number;
    html: string;
    userId: number;
    toId: number;
    restriction: number;
    notificationTime: string;
    email: string;
    subject: string;
    sent: string;
    writer?: Users;
    attachments?: Array<{id: number, messageId: number, filePath: string}>;
}