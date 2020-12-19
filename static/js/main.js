(()=>{
    const EVENTS_API ="https://www.pgm.gent/data/gentsefeesten/events_500.json";
    const CATEGORY_API ="https://www.pgm.gent/data/gentsefeesten/categories.json";

    const app = {
        initialise() {
            console.log('App initialised');
            this.cacheElements();
            this.fetchCategoryData();
            this.searchUrlParams();
            this.onClickToggleList(this.$toggleViewButtonList);
            this.onClickToggleGrid(this.$toggleViewButtonGrid);
            this.currentDate();
        },
        
        cacheElements(){
            this.$eventTeasers = document.querySelector("#event-teasers-list");
            this.$categoryList = document.querySelector('#category-list');
            this.$eventList = document.querySelector('#event-list');
            this.$toggleViewButtonList = document.querySelector('.view-select__button--list');            
            this.$toggleViewButtonGrid = document.querySelector('.view-select__button--grid');            
            this.$eventDetail = document.querySelector('.event-detail');
            this.$eventDetailImage = document.querySelector('.event-detail__image-wrapper');
            this.$eventDetailTitle = document.querySelector('.event-detail__title');
            this.$eventDetailSchedule = document.querySelector('.event-detail__schedule');
            this.$eventDetailLocation = document.querySelector('.event-detail__location');       
            this.$eventDetailSynopsis = document.querySelector('.event-detail__synopsis');
            this.$eventDetailUrl = document.querySelector('.event-detail__url');
            this.$eventDetailOrganizer = document.querySelector('.event-detail__organizer');
            this.$eventDetailCategories = document.querySelector('.event-detail__categories');
            this.$organizerEventsTitle = document.querySelector('.organizer-events__header');
            this.$organizersEventList = document.querySelector('#organizer-events__list')
            console.log('Elements cached!');
        },

        searchUrlParams(parameter){
            this.$searchUrl = window.location.search;
            this.$urlParams = new URLSearchParams(this.$searchUrl);
            this.$searchedUrlParam = this.$urlParams.get(parameter);
            return this.$searchedUrlParam;
        },
        
        fetchCategoryData() {
            fetch(CATEGORY_API, {})
                .then((response) => response.json())
                .then((json) => {
                    this.categoryData = json;
                    this.fetchEventData();
                    this.generateCategoryList();
                    })
                .catch((error) => console.error(error));
        },

        fetchEventData() {
            fetch(EVENTS_API, {})
                .then((response) => response.json())
                .then((json) => {
                    this.eventData = json;
                    this.updateEventTeasers();
                    this.generateEventList();
                    this.updateEventDetail();
                    })
                .catch((error) => console.error(error));
        },       

        updateEventTeasers() {
            if(this.$eventTeasers !== null){
                let eventsArray = [ 
                    this.eventData[(Math.floor(Math.random()*this.eventData.length-1))],
                    this.eventData[(Math.floor(Math.random()*this.eventData.length-1))],
                    this.eventData[(Math.floor(Math.random()*this.eventData.length-1))],
                ];

                const eventTeasers = eventsArray.map((event) => {
                    return `<li class="teaser"> 
                    <a href="/detail.html?day=${event.day}&slug=${event.slug}">
                    <div class="teaser__container">
                        <div class="teaser__image-wrapper">
                            <img class="teaser__image"src="${event.image !== null ? event.image.thumb : 'static/media/img/jpeg/nie-neute.jpg'}" alt="Foto ${event.title}" loading="lazy" >
                        </div>
                        <span class="teaser__date">${(event.day_of_week).substring(0, 2)} ${event.day} ${event.start} u.</span>
                    </div>
                    <h3>${event.title}</h3>
                    <p>${event.location}</p>
                    </a>
                </li>`
                }).join('');
                
                this.$eventTeasers.innerHTML = eventTeasers;
                console.log('Event teasers updated!');
            }           
        },

        generateCategoryList() {
            if(this.$categoryList !== null){
                const categoryList = (this.categoryData).map((category) => {
                return `<li><a href="#anchor__${category}">${category}</a></li>`
            }).join('');

            this.$categoryList.innerHTML = categoryList;
            } else {
                console.log('Category list container not found!');
            };
            
        },

        generateEventList() {
            if(this.$eventList !== null){
                const eventDay = this.searchUrlParams('day');
                const eventList = this.categoryData.map((category)=>{
                    const eventsByDay = this.eventData.filter((event) => {
                        return event.day === eventDay;                               
                    });
                    
                    const catagorizedEvents = eventsByDay.filter((event) => {
                        return event.category.indexOf(category) >-1; 
                    });

                    catagorizedEvents.sort((event1, event2) => {
                        return event1.sort_key.localeCompare(event2.sort_key);
                    });

                    console.log(catagorizedEvents.length > 0);

                    const catagorizedEventsList =
                    catagorizedEvents.map((event) => {                        
                        return `<li class="teaser"> 
                                    <a href="/detail.html?day=${event.day}&slug=${event.slug}">
                                    <div class="teaser__container">
                                        <div class="teaser__image-wrapper">
                                            <img class="teaser__image"src="${event.image !== null ? event.image.thumb : 'static/media/img/jpeg/nie-neute.jpg'}" alt="Foto ${event.title}" loading="lazy" >
                                        </div>
                                        <span class="teaser__date">${(event.day_of_week).substring(0, 2)} ${event.day} ${event.start} u.</span>
                                    </div>
                                    <h3>${event.title}</h3>
                                    <p>${event.location}</p>
                                    </a>
                                </li>`
                    }).join('');

                    if(catagorizedEvents.length > 0) {
                        return `
                        <li class="event-teasers__container centered">
                            <div class="category-title__wrapper">
                                <h2 id="anchor__${category}" class="category-title">${category}</h2>
                                <button class="category-top__button">
                                    <a href="#anchor__category-top">
                                        <svg width="32" height="32"><path d="M13.682 11.791l-6.617 6.296L4 15.171 15.74 4 28 15.665l-2.935 2.793-7.113-6.768v16.311h-4.269z"/></svg>
                                    </a>
                                </button>
                            </div>
                            
                            <ul class="event-teasers">
                                ${catagorizedEventsList}
                            </ul>
                        </li>`
                    };
                }).join('');
                this.$eventList.innerHTML = eventList;
            } else {
                console.log('Event list container not found!');
            };
            
        },

        onClickToggleList (button) {
            if(button !== null){
                button.addEventListener('click', () =>{
                    if(this.$eventList.classList.contains('teaser--list') !== true){
                        this.$eventList.classList.add('teaser--list');
                    };

                    this.$toggleViewButtonGrid.classList.remove('active');
                    this.$toggleViewButtonList.classList.add('active');
                    console.log(this.$toggleViewButtonGrid.classList);
                    
                });

            };
        },

        onClickToggleGrid (button) {
            if(button !== null ){
                button.addEventListener('click', () =>{
                    if(this.$eventList.classList.contains('teaser--list')){
                        this.$eventList.classList.remove('teaser--list');
                    }; 

                    if(this.$toggleViewButtonList.classList.contains('active')){
                        this.$toggleViewButtonList.classList.remove('active');
                        this.$toggleViewButtonGrid.classList.add('active');

                    };
                    
                });

            };
        },

        currentDate () {
            const eventDate = '#day' + this.searchUrlParams('day');
            const $pageDate = document.querySelector(eventDate);
            $pageDate.classList.add('current-date');
        },

        updateEventDetail(){
            if(this.$eventDetail !== null){
                const urlDay = this.searchUrlParams('day');
                const urlSlug = this.searchUrlParams('slug');

                const eventDetail = this.eventData.find((event) => {
                    console.log(event.organizer)
                    return event.day === urlDay && event.slug === urlSlug;            
                });
                
                this.$eventDetailImage.innerHTML = `<img class="event-detail__image" src="${eventDetail.image !== null ? eventDetail.image.full : 'static/media/img/jpeg/nie-neute.jpg'}" alt="Foto ${eventDetail.title}" loading="lazy" >`;
                this.$eventDetailTitle.innerHTML = eventDetail.title;
                this.$eventDetailSchedule.innerHTML = `${eventDetail.day_of_week} ${eventDetail.day} juli - ${eventDetail.start} > ${eventDetail.end}`;
                this.$eventDetailLocation.innerHTML = eventDetail.location;
                this.$eventDetailSynopsis.innerHTML = eventDetail.description !== undefined ? eventDetail.description : `Geen beschrijving gevonden.` ;
                if(eventDetail.url !== null){
                    this.$eventDetailUrl.innerHTML = `<a class="link--underlined" href="${ eventDetail.url}">${ eventDetail.url}</a>`;
                }else{
                    this.$eventDetailUrl.innerHTML = `/`
                };
                this.$eventDetailOrganizer.innerHTML = eventDetail.organizer;
                this.$eventDetailCategories.innerHTML = eventDetail.category.join(' ');
                this.$organizerEventsTitle.innerHTML = `Andere evenementen van ${eventDetail.organizer}`
                this.updateOrganizerEventList(eventDetail.organizer);
                
                console.log('Event detail updated!');
            } else {
                console.log('Event detail container not found!')
            };

        },

        updateOrganizerEventList (organizer){
            console.log(organizer);
            const filteredEvents = this.eventData.filter((event) => {
                return event.organizer.indexOf(organizer) > -1;
            });

            
            const eventsList = filteredEvents.map((event) => {
                return `<li class="teaser"> 
                <a href="/detail.html?day=${event.day}&slug=${event.slug}">
                <div class="teaser__container">
                    <div class="teaser__image-wrapper">
                        <img class="teaser__image"src="${event.image !== null ? event.image.thumb : 'static/media/img/jpeg/nie-neute.jpg'}" alt="Foto ${event.title}" loading="lazy" >
                    </div>
                    <span class="teaser__date">${(event.day_of_week).substring(0, 2)} ${event.day} ${event.start} u.</span>
                </div>
                <h3>${event.title}</h3>
                <p>${event.location}</p>
                </a>
            </li>`
            }).join('');
           
            this.$organizersEventList.innerHTML = eventsList;
        },


        
    };

    

    app.initialise();
    console.log('App running!');
})();