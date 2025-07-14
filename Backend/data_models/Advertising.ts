class Advertising {
    Id: number;
    Content: string;
    ImagePath: string;

    constructor(id: number, content: string, imagePath: string) {
        this.Id = id;
        this.Content = content;
        this.ImagePath = imagePath;
    }
}

export default Advertising;