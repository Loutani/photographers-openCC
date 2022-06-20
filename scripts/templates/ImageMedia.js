class ImageMedia {
    constructor(media, photographerName) {
        this._media = media
        this._photographerName = photographerName
    }

    render() {
        return `
                <div>
                    <div class="over-flow-the-image">
                        <img alt="${this._media._title}" title="${this._media._title}" class="show-in-light-box" media-id="${this._media._id}" src="assets/media/${this._photographerName}/${this._media._image}" />
                    </div>
                    
                    <div class="likes-title-photographer">
                        <p>${this._media._title}</p>
                        <p class="like-count">
                            <span>${this._media._likes}</span>
                            <i aria-label="likes" class="fas fa-heart solid"></i>
                            <i aria-label="likes" class="fal fa-heart light"></i>
                        </p>
                    </div>
                </div>
            `
    }
}