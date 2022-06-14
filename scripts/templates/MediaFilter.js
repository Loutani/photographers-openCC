class MediaFilter {
    constructor(medias, photographer) {
        this._medias        = medias
        this._photographer  = photographer
        this.$wrapper       = document.querySelector('.media-filter-container')
    }

    createMedias() {
        let mediaContent = ``;

        this._medias.map(media => {
            let mediaData = new Media(media)
            mediaContent += new MediaFactory(mediaData, this._photographer._name).render()
        });

        return mediaContent
    }

    createMediaFilter() {
        return `
            <div class="filter">
                <p>Trier par<p>
            </div>
            <div class="media-content">
                ${this.createMedias()}
            </div>
        `
    }

    render() {
        this.$wrapper.innerHTML = this.createMediaFilter();
    }
}