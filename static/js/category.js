(()=>{
    const category = {
        initialise(){
            
            this.cacheElements();
            // this.generateCategoryList();
            console.log(categoryData)
        },

        cacheElements(){
            this.$categoryList = document.querySelector('#category-list');
        },

        generateCategoryList(){
            
            const categoryList = (this.categoryData).map((category) => {
                return `<li>${category}</li>`
            }).join('');

            this.$categoryList.innerHTML = categoryList;
        },

    };

    category.initialise();

})();