var categoryListings = [
   {catName: "Fiction" , subcatList: ['Drama','Literature','Mystery', 'Poetry','Romance'] },
   {catName: "Nonfiction" ,   subcatList: ['Biography', 'Business', 'Education', 'Health', 'Philosophy', 'Self-Help'] },
   {catName: "Miscellaneous" ,   subcatList: ['Cooking','Crafts','Espanol', 'Medicine'] },
]

var sideMenuFun = function(){




   var categoryStr = '<div class="col-sm-2 right-col">'

   categoryListings.forEach(function(obj){

      categoryStr += '               <div class="side-list"><h4><a href="#books/'+ obj.catName+'">'+obj.catName + '</a></h4>'
      categoryStr += '<ul>'
      for(var i = 0; i < obj.subcatList.length; i ++){

         categoryStr += '<li><a href="#books/general-category/'+ obj.subcatList[i] +'">'+ obj.subcatList[i] + '</a></li>'



      }
      categoryStr += '</ul>'
      categoryStr += '</div>'

   })
   contentSelector.innerHTML += categoryStr;
}



var contentSelector = document.querySelector('.content-area')

var BookModel = Backbone.Model.extend({

   parse: function(jsonCollection){

      return jsonCollection.volumeInfo

   }

})

var BookCollection = Backbone.Collection.extend({
   model: BookModel,

   parse: function(jsonModel){

      return jsonModel.items
   },

   url:"",

   initialize: function(rVal){
         this.url = "https://www.googleapis.com/books/v1/volumes?q=subject:" + rVal
   },

})



var AppRouter = Backbone.Router.extend({

   // ROUTE 'NAME': "perform this function"
   routes: {
      // home page route
      "": "showHomePage",
      "books/:generalCat": "showGenCat",
      "books/general-category/:subCat": "showSubCat"


   },

   showHomePage: function(){
      var categoryStr = '<div class="row">'

      categoryListings.forEach(function(obj){

         categoryStr += '               <div class="col-sm-4"><h3><a href="#books/'+ obj.catName+'">'+obj.catName + '</a></h3>'
         categoryStr += '<ul>'
         for(var i = 0; i < obj.subcatList.length; i ++){

            categoryStr += '<li><a href="#books/general-category/'+ obj.subcatList[i] +'">'+ obj.subcatList[i] + '</a></li>'

         }
         categoryStr += '</ul>'
         categoryStr += '</div>'

      })
      contentSelector.innerHTML = categoryStr;

   },



   showGenCat: function(genCat){
      var listStr = "<div class='col-sm-10'>";
          listStr += "<div class='row'>";
          listStr += "<h1>" + genCat + "</h1>";



         //  Constructor for
      var subBookRequest = new BookCollection(genCat)

      subBookRequest.fetch().then(function(){

         subBookRequest.models.forEach(function(mdlObj){
               console.log(mdlObj)
            var bookTitle = mdlObj.get('title')

            // IMAGE BUILDER
            var bookImgLinks = mdlObj.get('imageLinks')
            if(typeof bookImgLinks === "undefined"){

               var bookImage = './images/file-not-found.png'
            }else{ var bookImage = bookImgLinks.thumbnail}

               listStr += '<div class="col-sm-3 text-center book-cont">'
               listStr += '<div class="thumbnail book-thumb">'
               listStr += '<img src="'+ bookImage +'">'
               listStr += '<p>' + bookTitle + '</p>'
               listStr += '</div>'
               listStr += '</div>'

         })
         listStr += '</div>'
         listStr += '</div>'
         contentSelector.innerHTML = listStr
         sideMenuFun();
      })



   },

   showSubCat: function(subCat){
      var listStr = "<div class='col-sm-10'>";
          listStr += "<div class='row'>";
          listStr += "<h1>" + subCat + "</h1>";

      contentSelector.innerHTML = "<h1>" + subCat + '</h1>'

      var subBookRequest = new BookCollection(subCat)

      subBookRequest.fetch().then(function(){

         subBookRequest.models.forEach(function(mdlObj){
               console.log(mdlObj)
            var bookTitle = mdlObj.get('title')

            // IMAGE BUILDER
            var bookImgLinks = mdlObj.get('imageLinks')
            if(typeof bookImgLinks === "undefined"){

               var bookImage = './images/file-not-found.png'
            }else{ var bookImage = bookImgLinks.thumbnail}

               listStr += '<div class="col-xs-3 text-center book-cont">'
               listStr += '<div class="thumbnail book-thumb">'
               listStr += '<img src="'+ bookImage +'">'
               listStr += '<p>' + bookTitle + '</p>'
               listStr += '</div>'
               listStr += '</div>'

         })
         listStr += '</div>'
         listStr += '</div>'
         contentSelector.innerHTML = listStr
         sideMenuFun();
      })

   },


   initialize: function(){

      Backbone.history.start();
   }



})

var myApp = new AppRouter()
