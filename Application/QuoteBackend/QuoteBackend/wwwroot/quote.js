"use strict";

var serverURL = "/api/values/";
var serverAnswer = {
  quotes: "null",
  categories: "null"
};


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
        //Надо сдеать обработчик
        if (request.readyState == 4) {
            //Передаем управление обработчику пользователя
            serverAnswer = JSON.parse(request.responseText,function(key, value) {
                if (key == 'CreateDate') return new Date(value);
                return value;
              });


            if(serverAnswer.quotes.length > 0){
              data.quotesIsExist = true;
            }

            data.quotes = serverAnswer.quotes;
            data.categories = serverAnswer.categories;


        } else {
            //Оповещаем пользователя о загрузке
            // document.getElementById('cas9').innerHTML = "Get change status..." + request.readyState;
        }

    }

    request.open("GET", serverURL);
    request.send(null);

}

function PostAction(sendData) {

    var request = GetXMLHttpRequest();

    if (!request) {
        return;
    }

    request.onreadystatechange = function () {

        //Надо сдеать обработчик

        if (request.readyState == 4) {
            //Передаем управление обработчику пользователя
            document.getElementById('cas9').innerHTML = "POST well done!";

        } else {
            //Оповещаем пользователя о загрузке
            document.getElementById('cas9').innerHTML = "POST change status..." + request.readyState;
        }

    }

    request.open("POST", serverURL);
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    jsonString = "'" + JSON.stringify(sendData) + "'";
    request.send(jsonString);

}

function PutRequest(id, sendData) {

  var request = GetXMLHttpRequest();

  if (!request) {
      return;
  }

  request.onreadystatechange = function () {
      //Допилить
      if (request.readyState == 4) {
          //Передаем управление обработчику пользователя
          document.getElementById('cas9').innerHTML = "PUT well done!";

      } else {
          //Оповещаем пользователя о загрузке
          document.getElementById('cas9').innerHTML = "PUT change status..." + request.readyState;
      }

  }

  request.open("PUT", serverURL + id);
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  jsonString = "'" + JSON.stringify(sendData) + "'";
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
          document.getElementById('cas9').innerHTML = "DELETE well done!";

      } else {
          //Оповещаем пользователя о загрузке
          document.getElementById('cas9').innerHTML = "DELETE change status..." + request.readyState;
      }

  }

  request.open("DELETE", serverURL + id);
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  request.send(null);

}

// -----------------------------------------------------------------------------------------------------

GetRequest();

var data = {};
data.quotesIsExist = false;
data.quotes = null;
data.categories = null;

var vm = new Vue({
  el: '#quotes-wrap',
  data : data
});

Vue.component("quote-block",{
  props: ['quote'],
  template:`
    <section class="quote">
      <span class="quote-id section-second-text">#<span>{{quote.QuoteId}}</span>
      </span>
      <span class="quote-separator section-second-text">|</span>
      <span class="quote-category section-second-text">{{quote.Category}}</span>
      <span class="quote-img-buttons-wrap">
        <img class="quote-img-button" src="img/edit.png" alt="Edit"
        onmouseout="this.src='img/edit.png'"
        onmouseover="this.src='img/edit-hover.png'"
        ondragstart="return false"><img
        class="quote-img-button" src="img/delete.png" alt="Delete"
        onmouseout="this.src='img/delete.png'"
        onmouseover="this.src='img/delete-hover.png'"
        ondragstart="return false">
      </span>
      <blockquote class="quote-text section-primary-text">
        "<span>{{quote.Text}}</span>"
      </blockquote>
      <span class="quote-date section-second-text">{{quote.CreateDate.getDate()}}/{{quote.CreateDate.getMonth() + 1}}/{{quote.CreateDate.getFullYear()}}</span>
      <span class="quote-author section-primary-text">{{quote.Author}}</span>
    </section>
  `

});
