"use strict";

var serverURL = "/api/values/";

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
            document.getElementById('cas9').innerHTML = request.responseText;

        } else {
            //Оповещаем пользователя о загрузке
            document.getElementById('cas9').innerHTML = "Get change status..." + request.readyState;
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
