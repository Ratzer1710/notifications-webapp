export class Notification {
    title: string;
    body: string;
    channels: Array<unknown>;
    datetime: string;

    constructor(title: string, body: string, channels: Array<unknown>, datetime: string) {
        this.title = title;
        this.body = body;
        this.channels = channels;
        this.datetime = datetime;
    }
}