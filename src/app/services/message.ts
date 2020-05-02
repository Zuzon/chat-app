export interface Message {
    type: 'validation' | 'message' | 'register';
    success?: boolean;
    message: string | ChatMessage | ChatMessage[];
}

export interface ChatMessage {
    date: Date;
    author: string;
    content: string;
}
