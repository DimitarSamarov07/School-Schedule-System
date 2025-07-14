import ReturningId from "./ReturningId.js";

class AdvertisingResponse extends ReturningId{
    Content: string;
    ImagePath: string;

    constructor(id: number, content: string, imagePath: string) {
        super(id);
        this.Content = content;
        this.ImagePath = imagePath;
    }
}

export default AdvertisingResponse;