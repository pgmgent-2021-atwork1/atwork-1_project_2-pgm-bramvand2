(()=>{
    const EVENTS_API ="https://www.pgm.gent/data/gentsefeesten/events_500.json";
    const CATEGORY_API ="https://www.pgm.gent/data/gentsefeesten/categories.json";

    const app = {
        initialise() {
            console.log('App initialised')
            this.cacheElements();
            this.fetchCategoryData();
            this.searchUrlParams();
        },
        
        cacheElements(){
            this.$eventTeasers = document.querySelector("#event-teasers-list");
            this.$categoryList = document.querySelector('#category-list');
            this.$eventList = document.querySelector('#event-list');
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
                    })
                .catch((error) => console.error(error));
        },       

        updateEventTeasers() {
           let eventsArray = [ 
               this.eventData[(Math.floor(Math.random()*this.eventData.length-1))],
               this.eventData[(Math.floor(Math.random()*this.eventData.length-1))],
               this.eventData[(Math.floor(Math.random()*this.eventData.length-1))],
           ];

           const eventTeasers = eventsArray.map((event) => {
               return `<li class="teaser"> 
               <a href="/dag.html?day=${event.day}&slug=${event.slug}">
               <div class="teaser__container">
                   <div class="teaser__image-wrapper">
                       <img class="teaser__image"src="${event.image !== null ? event.image.thumb : '/static/media/img/jpeg/nie-neute.jpg'}" alt="Foto ${event.title}" loading="lazy" >
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
        },

        generateCategoryList() {
            if(this.$categoryList !== null){
                const categoryList = (this.categoryData).map((category) => {
                return `<li><a href="#anchor__${category}">${category}</a></li>`
            }).join('');

            this.$categoryList.innerHTML = categoryList;
            } else {
                console.log('Category list container not found!')
            };
            
        },

        generateEventList() {
            if(this.$eventList !== null){
                const eventDay = this.searchUrlParams('day');

                const eventList = this.categoryData.map((category)=>{
                    const eventsByDay = this.eventData.filter((event) => {
                        return event.day.indexOf(eventDay) >-1;                               
                    });
                    
                    const catagorizedEvents = eventsByDay.filter((event) => {
                        return event.category.indexOf(category) >-1; 
                    });

                    catagorizedEvents.sort((event1, event2) => {
                        return event1.sort_key.localeCompare(event2.sort_key);
                    });

                    console.log(catagorizedEvents.length > 0)

                    const catagorizedEventsList =
                    catagorizedEvents.map((event) => {                        
                        return `<li class="teaser"> 
                                    <a href="/dag.html?day=${event.day}&slug=${event.slug}">
                                    <div class="teaser__container">
                                        <div class="teaser__image-wrapper">
                                            <img class="teaser__image"src="${event.image !== null ? event.image.thumb : '/static/media/img/jpeg/nie-neute.jpg'}" alt="Foto ${event.title}" loading="lazy" >
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
                console.log('Event list container not found!')
            };
        },
        
    };

    app.initialise();
    console.log('App running!');
})();