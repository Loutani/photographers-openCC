class MediaFilter {
    constructor(medias, photographer) {
        //media data
        this._medias        = medias

        //photographer data
        this._photographer  = photographer

        //media contaienr
        this.$wrapper       = document.querySelector('.media-filter-container')

        //all media possible direcoty
        this.directoriesName= [
            'Ellie Rose',
            'Marcel',
            'Mimi',
            'Nabeel',
            'Rhode',
            'Tracy',
        ]

        //default directory name
        this._mediasDirectoryName = '';

        //default total likes
        this._totalLikes = 0

        //default select properties
        this._select = {
            opened: false,
            options: [
                'likes', 'date', 'title'
            ],
            selected: 'likes' 
        }

        //initialize light box
        this._lightboxModal = new LightboxModal(this._medias);

    }

    //when yyou press enter on any image of media you show the lightbox
    makeImageShowLightBoxByPressEnter() {

        //get all the images of medias
        document.querySelectorAll('.triger-click').forEach(element => {

            //add event keydown for the image
            element.addEventListener('keydown', event => {

                //show only if the key pressed is Enter
                if(event.key === "Enter") {

                    //get data needed to show light box
                    let mediaId = element.querySelector('img,video').getAttribute('media-id'),
                        mediaIndex = element.getAttribute('tabindex')

                    //show lightbox
                    this._lightboxModal.showLightBox(mediaId, mediaIndex, this._mediasDirectoryName);
                }
            })
        })
    }

    //create total likes HTML content
    createTotalLikes(totalLikes, price) {

        //generate total likes HTML content
        const totalLikesWrapper = `
            <div class="total-likes-container">
                <div>
                    <span class="total-likes">${totalLikes}</span>
                    <span><i class="fas fa-heart"></i></span>
                </div>
                <div>
                    <span>${price} € / jour</span>
                </div>
            </div>
        `;

        //add total likes HTML content to page
        document.body.innerHTML += totalLikesWrapper;
    }

    //define the filters type
    filterBy(filterType, data) {
        data.sort( (a,b) => {
            switch(filterType) {
                //filter by likes
                case 'likes'    : return b.likes - a.likes;
                //filter by date
                case 'date'     : 
                    if(new Date(b.date) > new Date(a.date)) {
                        return 1
                    }

                    if(new Date(b.date) <  new Date(a.date)) {
                        return -1
                    }

                    return 0

                //filter by title
                case 'title'    : 
                    if(a.title > b.title) {
                        return 1
                    }
                    
                    if(a.title < b.title ? -1 : 0) {
                        return -1
                    }

                    return 0
            }
        })

        return data
    }

    //get the total likes
    getTotalLikes() {
        //default is 0
        let totalLikesCount = 0;

        //sum the likes
        this._medias.map(media => {
            totalLikesCount += media.likes
        });

        //return the total likes
        return totalLikesCount
    }

    //create medias
    createMedias() {
        //get photographer name
        const photographerName  =   this.directoriesName.find(
                                        name => this._photographer._name.replace('-', ' ').includes(name)
                                    );

        let tabindex = 4;

        //init media direcoty folder
        this._mediasDirectoryName = photographerName;

        //initialize media content and filter value
        let mediaContent        =   ``,
            filterValue         = this._select.selected;

        //execute filter function by chosen filter type
        this._medias = this.filterBy(filterValue, this._medias);

        //create media content by MediaFactory
        this._medias.map((media, index) => {
            //create media data by constructor
            let mediaData = new Media(media)

            //create media content
            mediaContent += new MediaFactory(mediaData, photographerName, tabindex).render()

            tabindex += 2;

        });
        
        //render the total likes content to page
        this._totalLikes = this.getTotalLikes()

        return mediaContent
    }

    //click on like handler
    clickLikeHandler() {
        //get all the heart icons
        const LikeButtons = document.querySelectorAll('.like-count .fa-heart')

        //add or sub 1 from likes and total likes
        LikeButtons.forEach(likeButton => {
            //add click listener on heart icons
            likeButton.addEventListener('click', e => {
                this.addLikeStyles(e)
            })

            likeButton.addEventListener('keydown', e => {
                if(e.key === "Enter") {
                    this.addLikeStyles(e)
                }
            })
        });

    }

    addLikeStyles(e) {
        const   parentLikeButton = e.target.parentElement,
        likeTotal        = parentLikeButton.querySelector('span')

        if(parentLikeButton.classList.contains('active')) {
            //if we clicked before we sub 1 from like and total likes
            parentLikeButton.classList.remove('active')

            //change like style to like
            e.target.classList.add('far')
            e.target.classList.remove('fas')

            likeTotal.innerText = parseInt(likeTotal.innerText) - 1
            this._totalLikes -= 1
        }else {
            //if we never clicked before we add 1 from like and total likes
            parentLikeButton.classList.add('active')

            //change like style to unlike
            e.target.classList.remove('far')
            e.target.classList.add('fas')

            likeTotal.innerText = parseInt(likeTotal.innerText) + 1
            this._totalLikes += 1
        }

        //show total likes
        document.querySelector('.total-likes').innerHTML = this._totalLikes
    }

    //create filter <select>
    createSelectFilter() {
        let options = ``;

        //create filter
        this._select.options.forEach(option => {
            options += `<option value="${option}" ${this._select.selected === option ? 'selected' : ''} >${option}</option>`
        });

        //return the filter content
        return `
            <div class="select-container">
                <select tabindex="3" id="order-by" title="Order by">
                    ${options}
                </select>
            </div>
        `
    }

    //re-render the medias and it's event's when we change the filter of the medias
    reRenderMedias() {
        //initialize the media content
        document.querySelector('.media-filter-container').innerHTML = '';

        //get current media content
        this.$wrapper = document.querySelector('.media-filter-container');

        //create filter
        this.$wrapper.innerHTML = this.createMediaFilter();

        //add filter change event
        this.selectFilterChange()

        //add click on media handler
        this.clickOnMediaHandler()

        //render the light box
        this._lightboxModal.render()

        //add click on like handler
        this.clickLikeHandler()

        //render the total likes
        document.querySelector('.total-likes').innerHTML = this._totalLikes

        //add press enter key to show light box of image medias
        this.makeImageShowLightBoxByPressEnter()
    }

    //add change event of filter
    selectFilterChange() {
        document.querySelector('select').addEventListener('change', (e) => {

            //get the filter value
            this._select.selected = e.target.value;

            //re-render the medias content
            this.reRenderMedias()
        });
    }


    //return media filter and media content
    createMediaFilter() {
        return `
            <div class="filter">
                <label for="order-by">Trier par</label>
                ${this.createSelectFilter()}
            </div>
            <div class="media-content">
                ${this.createMedias()}
            </div>
        `
    }

    //add click event listener on media
    clickOnMediaHandler() {
        //get all the clickable medias
        const mediasCanBeClicked = document.querySelectorAll('.show-in-light-box')

        //add event listener on all the clickable media
        mediasCanBeClicked.forEach( (media, index) => {
            const mediaId       = media.getAttribute('media-id'),
                  mediaIndex    = index;

            media.addEventListener('click', () => {
                this._lightboxModal.showLightBox(mediaId, mediaIndex, this._mediasDirectoryName);
            });
        })
    }

    //render the media content 
    render() {
        //create media filter and media content
        this.$wrapper.innerHTML = this.createMediaFilter();

        //render total likes
        this.createTotalLikes(this._totalLikes, this._photographer._price);

        //add chage filter event
        this.selectFilterChange()

        //add click on media handler
        this.clickOnMediaHandler()

        //add click on like handler
        this.clickLikeHandler()

        //render the light box
        this._lightboxModal.render()

        //add press enter key to show light box of image medias
        this.makeImageShowLightBoxByPressEnter()
    }
}