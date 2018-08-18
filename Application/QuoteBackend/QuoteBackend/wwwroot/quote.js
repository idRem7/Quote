"use strict";

var serverURL = "/api/values/";
var serverAnswer = {
  quotes: "null",
  categories: "null"
};

// ------------------------------------------------------------------------------
function GetXMLHttpRequest() {

    var Request = false;

    if (window.XMLHttpRequest) {
        //Gecko-совместимые браузеры, Safari, Konqueror
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        //Internet explorer
        try {
            Request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (CatchException) {
            Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }

    if (!Request) {
        alert("Невозможно создать XMLHttpRequest");
    }

    return Request;

}

function GetRequest() {

    var request = GetXMLHttpRequest();

    if (!request) {
        return;
    }

    request.onreadystatechange = function () {

        if (request.readyState == 4) {

            serverAnswer = JSON.parse(request.responseText, function(key, value) {
                if (key == 'CreateDate') {
                  return new Date(value);
                }
                return value;
              });

            if(serverAnswer.quotes.length > 0){
              data.quotesIsExist = true;
            }else{
              data.quotesIsExist = false;
            }

            data.quotes = serverAnswer.quotes;
            data.categories = serverAnswer.categories;
            newQuoteData.categories = serverAnswer.categories;
            filterData.categories = serverAnswer.categories;

            filterShowArray(data.quotes);

        } else {

        }

    }

    request.open("GET", serverURL);
    request.send(null);

}

function PostRequest(sendData) {

    var request = GetXMLHttpRequest();

    if (!request) {
        return;
    }

    request.onreadystatechange = function () {

        //Надо сдеать обработчик

        if (request.readyState == 4) {
            //Передаем управление обработчику пользователя
            // document.getElementById('cas9').innerHTML = "POST well done!";
            newQuoteData.errorMessage = "Цитата добавлена";
            setTimeout("newQuoteData.errorMessage = '';",2000);
            newQuoteData.author = "";
            newQuoteData.category = 0;
            newQuoteData.text = "";
            GetRequest();

        } else {
            //Оповещаем пользователя о загрузке
            // document.getElementById('cas9').innerHTML = "POST change status..." + request.readyState;
        }

    }

    request.open("POST", serverURL);
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    var jsonString = "'" + JSON.stringify(sendData) + "'";
    request.send(jsonString);

}

function PutRequest(id, sendData, dataLink) {

  var request = GetXMLHttpRequest();

  if (!request) {
      return;
  }

  request.onreadystatechange = function () {
      //Допилить
      if (request.readyState == 4) {
          //Передаем управление обработчику пользователя
          dataLink.isEditing = false;
          GetRequest();

      } else {
          //Оповещаем пользователя о загрузке

      }

  }

  request.open("PUT", serverURL + id);
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  var jsonString = "'" + JSON.stringify(sendData) + "'";
  request.send(jsonString);

}

function DeleteRequest(id) {

  var request = GetXMLHttpRequest();

  if (!request) {
      return;
  }

  request.onreadystatechange = function () {

      if (request.readyState == 4) {
          //Передаем управление обработчику пользователя
          // document.getElementById('cas9').innerHTML = "DELETE well done!";
          GetRequest();

      } else {
          //Оповещаем пользователя о загрузке
          // document.getElementById('cas9').innerHTML = "DELETE change status..." + request.readyState;
      }

  }

  request.open("DELETE", serverURL + id);
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  request.send(null);

}

function refreshTime() {

  var currentTime = new Date();
  clock.time = "";

  clock.time += currentTime.getHours() + ":";

  if(currentTime.getMinutes() < 10){
    clock.time += "0";
  }
  clock.time += currentTime.getMinutes() + ":";

  if(currentTime.getSeconds() < 10){
    clock.time += "0";
  }
  clock.time += currentTime.getSeconds();

}

function filterShowArray(inputArray){

  for(var i = 0; i < inputArray.length; i++){

    if( (filterData.selectCategories.indexOf(inputArray[i].CategoryId) != -1 || filterData.selectCategories.length == 0) &&
      (inputArray[i].Author.indexOf(filterData.selectAuthor) != -1  || filterData.selectAuthor.length == 0) ){

      inputArray[i].isShow = true;

    }else{
        inputArray[i].isShow = false;
    }

  }

  inputArray.push(1);
  inputArray.pop();

}
// ---------------------------------------------------------------------------------------

setInterval(refreshTime, 1000);
GetRequest();

var data = {
  quotesIsExist: false,
  quotes: null,
  categories: null,
  currentEditing: 0
}

var vm = new Vue({
  el: '#quotes-wrap',
  data : data,
  computed:{
    filterQuotes: function(){
      return this.quotes.filter(function(quote){
        return quote.isShow == true;
      });
    }
  }
  // methods: {
  //   filterQuotes: function(){
  //     return this.quotes.filter(function(quote){
  //       return quote.isShow == true;
  //     });
  //   }
  // }
});

var emptyBlock = new Vue({
  el: '#empty-wrap',
  data : data
});

Vue.component("quote-block",{
  data: function (){
    return{
      isEditing: false,
      author: "",
      category: 0,
      text: "",
      errorMessage: "",
      isCorrectData: false
    }
  },
  props: ['quote'],
  methods:{
    deleteQuote: function(){
      DeleteRequest(this.quote.QuoteId);
    },
    editing(){
      this.author = this.quote.Author;
      this.category = this.quote.CategoryId;
      this.text = this.quote.Text;
      this.errorMessage = "";
      this.isEditing = true;
    },
    validateInput: function(){

      this.errorMessage = "";
      this.isCorrectData = true;

      if(this.author.length < 2){
        this.errorMessage += "Слишком короткое имя автора";
        this.isCorrectData = false;
      }

      if(this.author.length > 50){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "Слишком длинное имя автора";
        this.isCorrectData = false;

      }

      if(this.author.indexOf("<") != -1 || this.author.indexOf(">") != -1){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "В имени автора использованы запрещенные символы (< или >)";
        this.isCorrectData = false;

      }

      if(this.text.length < 20){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "Короткий текст цитаты";
        this.isCorrectData = false;

      }

      if(this.text.indexOf("<") != -1 || this.text.indexOf(">") != -1){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "В тексте цитаты использованы запрещенные символы (< или >)";
        this.isCorrectData = false;

      }

      if(this.isCorrectData){

        var newQuoteSend = {
          Text: this.text,
          Author: this.author,
          CategoryId: this.category,
          CreateDate: this.quote.CreateDate.toJSON()
        };

        PutRequest(this.quote.QuoteId ,newQuoteSend, this);

      }

      setTimeout(function(data){
          data.errorMessage = "";
        } ,3000, this);

    }
  },
  template:`
    <section v-if="!isEditing" class="quote">
      <span class="quote-id section-second-text">#<span>{{quote.QuoteId}}</span>
      </span>
      <span class="quote-separator section-second-text">|</span>
      <span class="quote-category section-second-text">{{quote.Category}}</span>
      <span class="quote-img-buttons-wrap">
        <img class="quote-img-button" src="img/edit.png" alt="Edit"
        onmouseout="this.src='img/edit.png'"
        onmouseover="this.src='img/edit-hover.png'"
        ondragstart="return false"
        v-on:click="editing"><img
        v-on:click="deleteQuote"
        class="quote-img-button" src="img/delete.png" alt="Delete"
        onmouseout="this.src='img/delete.png'"
        onmouseover="this.src='img/delete-hover.png'"
        ondragstart="return false">
      </span>
      <blockquote class="quote-text section-primary-text">"<span>{{quote.Text}}</span>"</blockquote>
      <span class="quote-date section-second-text">{{quote.CreateDate.getDate()}}/{{quote.CreateDate.getMonth() + 1}}/{{quote.CreateDate.getFullYear()}}</span>
      <span class="quote-author section-primary-text">{{quote.Author}}</span>
    </section>
    <section v-else class="editing">
      <span class="quote-id section-second-text">#<span>{{quote.QuoteId}}</span>
      </span>
      <span class="quote-separator section-second-text">|</span>
      <select v-model="category" class="editing-category">
          <option v-for="categoryIterator in this.$parent.$data.categories"
            v-bind:value="categoryIterator.CategoryId">{{categoryIterator.Name}}</option>
      </select>
      <span class="quote-img-buttons-wrap">
        <img class="quote-img-button" src="img/done.png" alt="Done"
        onmouseout="this.src='img/done.png'"
        onmouseover="this.src='img/done-hover.png'"
        ondragstart="return false"
        v-on:click=validateInput><img
        class="quote-img-button" src="img/delete.png" alt="Cancel"
        onmouseout="this.src='img/delete.png'"
        onmouseover="this.src='img/delete-hover.png'"
        ondragstart="return false"
        v-on:click="isEditing = false">
      </span>
      <textarea v-model="text" class="editing-text" placeholder="Текст цитаты (минимум 20 знаков, запрещены символы < и >)"></textarea>
      <span class="quote-date section-second-text">{{quote.CreateDate.getDate()}}/{{quote.CreateDate.getMonth() + 1}}/{{quote.CreateDate.getFullYear()}}</span>
      <input v-model="author" class="editing-author" placeholder="Автор (От 2 до 50 знаков)">
      <div v-bind:class="{error: !isCorrectData, done: isCorrectData}" class="editing-error">{{errorMessage}}</div>
    </section>
  `
});

var clock = {
  time: ""
};

var clockElement = new Vue({
  el: '#current-time',
  data: clock
});

var newQuoteData = {
  author: "",
  category: 0,
  text: "",
  errorMessage: "",
  isCorrectData: false,
  categories: null
};

var addQuoteBlock = new Vue({
  el: '#new-quote',
  data: newQuoteData,
  methods:{
    validateInput: function(){

      this.errorMessage = "";
      this.isCorrectData = true;

      if(this.author.length < 2){
        this.errorMessage += "Слишком короткое имя автора";
        this.isCorrectData = false;
      }

      if(this.author.length > 50){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "Слишком длинное имя автора";
        this.isCorrectData = false;

      }

      if(this.author.indexOf("<") != -1 || this.author.indexOf(">") != -1){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "В имени автора использованы запрещенные символы (< или >)";
        this.isCorrectData = false;

      }

      if(this.category == 0){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "Необходимо выбрать категорию";
        this.isCorrectData = false;

      }

      if(this.text.length < 20){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "Короткий текст цитаты";
        this.isCorrectData = false;

      }

      if(this.text.indexOf("<") != -1 || this.text.indexOf(">") != -1){

        if(!this.isCorrectData){
          this.errorMessage += "\n\r";
        }

        this.errorMessage += "В тексте цитаты использованы запрещенные символы (< или >)";
        this.isCorrectData = false;

      }

      if(this.isCorrectData){

        var newQuoteSend = {
          Text: this.text,
          Author: this.author,
          CategoryId: this.category,
          CreateDate: (new Date()).toJSON()
        };

        PostRequest(newQuoteSend);

      }

      setTimeout("newQuoteData.errorMessage = '';",3000);

    }
  }
});

var filterData = {
  categories: null,
  selectCategories: [],
  selectAuthor: ""
};

var filterBlock = new Vue({
  el: '#quotes-filter',
  data: filterData,
  methods:{
    dropFilter: function(){
      this.selectCategories = [];
      this.selectAuthor = "";
      this.applyFilter();
    },
    applyFilter(){
      filterShowArray(data.quotes);
    }
  }
});
