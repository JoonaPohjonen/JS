var ourRequest = new XMLHttpRequest();

var token;
var username;
var user_id;
var perusid;
var number;




// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

/*
var testForm = document.getElementById('myForm');
testForm.onsubmit = function(event) {
  event.preventDefault();

  ourRequest.open('POST', 'https://media.mw.metropolia.fi/wbma/media', true);                       //myös tämä koodi toimii täysin jos haluaa ladata tiedostoja palvelimelle
  token = sessionStorage.getItem('token');
  ourRequest.setRequestHeader("x-access-token", token);

  var formData = new FormData(document.getElementById('myForm'));
  ourRequest.send(formData);

  console.log(ourRequest.response);
};
*/


window.addEventListener("load", function() {
  function sendData() {
    var FD = new FormData(form);
    ourRequest.addEventListener("load", function(event) {

    });
    ourRequest.open("POST", "https://media.mw.metropolia.fi/wbma/media");
    token = sessionStorage.getItem('token');
    ourRequest.setRequestHeader("x-access-token", token);
    ourRequest.onload = function() {
      var ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
      alert('The file has been loaded to the bottom of the page!');
      var iidee = Object.values(ourData)[1];                                                                        //get media file id
      tekisjo(iidee);
    };
    ourRequest.send(FD);
  }
  var form = document.getElementById("myForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    sendData();
  });
});



function sisaan() {
  var nimi = document.getElementById("sissoo").value;
  var salis = document.getElementById("password").value;
  var eemaili = document.getElementById("email").value;
  fetch('https://media.mw.metropolia.fi/wbma/users', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: nimi,
      password: salis,
      email: eemaili
    })
  });
  console.log("Loit käyttäjän");
  alert('Loit käyttäjän. Voit nyt kirjautua sisään.');
}

function loggain() {
  var nimi = document.getElementById("loggaa").value;
  var salis = document.getElementById("salasana").value;
  ourRequest.open("POST", "https://media.mw.metropolia.fi/wbma/login", true);
  ourRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ourRequest.send("username="+nimi+"&password="+salis);                                                         //passing parameters on post request
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);

    token = Object.values(ourData)[1];
    username = Object.values(ourData)[2].username;
    user_id = Object.values(ourData)[2].user_id;
    console.log(token);

    if(Object.values(ourData)[0] === "Logged in successfully") {
      console.log('onnistuit kirjautumaan sisään');
      sessionStorage.setItem('token', token);                                                             //set session storage itemiin token jotta se säilyy sivuvaihdoksen yhteydessä, muttei tab vaihdon yhteydessä. sivun sulkeminen resetoi
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('user_id', user_id);
      // window.location.replace("index.html");
      modal.style.display = "none";
      document.getElementById('onon').style.display = "none";

      document.getElementById('kokeilu').style.display = "block";

      document.getElementById('otherprofile').style.display = "block";
      document.getElementById('otherprofile').innerHTML = 'Logged in as: '+username;

    } else {
      console.log('yritä uudestaan');
    }
  }
}

function tarkista() {
  token = sessionStorage.getItem('token');
  username = sessionStorage.getItem('username');
  if(token !== null) {
    modal.style.display = "none";
    document.getElementById('onon').style.display = "none";

    document.getElementById('kokeilu').style.display = "block";

    document.getElementById('otherprofile').style.display = "block";
    document.getElementById('otherprofile').innerHTML = 'Logged in as: '+username;
  } else {
    console.log('et ole vielä kirjautunut sisään');
  }
  viimeiset();
}


function viimeiset() {
  ourRequest.open('GET', 'https://media.mw.metropolia.fi/wbma/media');
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);

    var i;
    for(i = 0; i < 20; i++) {
      console.log(ourData[i]);

      console.log(ourData[i].user_id);
      var pe = document.createElement('a');
      var rauha = JSON.stringify(ourData[i].user_id);

      pe.setAttribute('href', 'profile.html');
      pe.setAttribute('id', rauha);
      pe.setAttribute('class', 'kopiot');


      pe.innerHTML = 'user: '+rauha+' latasi tiedoston:';
      document.body.appendChild(pe);
      pe.onmouseover = function() {
        tallennetaan(this.id);
      };

      var pp = document.createElement('p');
      pp.setAttribute('id', 'on'+number);
      pp.setAttribute('class', 'kolmannet');
      var nauha = JSON.stringify(ourData[i]);
      pp.innerHTML = nauha;
      document.body.appendChild(pp);
    }
  };
  ourRequest.send();
}



function ladataan() {
  ourRequest.open('GET', 'https://media.mw.metropolia.fi/wbma/media/all');
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);
    console.log(ourData.file_count.total);
    number = ourData.file_count.total;
    sessionStorage.setItem('number', number);
  };
  ourRequest.send();
}

function tulostus() {
  number = sessionStorage.getItem('number');
  var i = 0;
  while(i < number) {
    ourRequest.open('GET', 'https://media.mw.metropolia.fi/wbma/media/'+number, true);
    ourRequest.onload = function() {
      var ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
      var pp = document.createElement('p');
      pp.setAttribute('id', 'on'+number);
      var nauha = JSON.stringify(ourData);
      pp.innerHTML = nauha;
      document.getElementById('nimi'+number).appendChild(pp);
    };
    ourRequest.send();
    number--;
  }
}


function omaprofile() {
  username = sessionStorage.getItem('username');
  user_id = sessionStorage.getItem('user_id');

  document.getElementById('profile').innerHTML = 'Logged in as: '+username;

  ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/media/user/"+user_id, true);
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);

    var nauha = JSON.stringify(ourData);
    var pp = document.createElement('p');
    pp.setAttribute('class', 'kolmannet');
    pp.innerHTML = nauha;
    document.body.appendChild(pp);
  };
  ourRequest.send();
}


function korjaus() {
    username = sessionStorage.getItem('username');
    user_id = sessionStorage.getItem('perusid');

    if(username !== null) {

      if (user_id !== null) {
        document.getElementById('profile').innerHTML = 'Logged in as: '+username;

        ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/media/user/" + user_id, true);
        ourRequest.onload = function() {
          var ourData = JSON.parse(ourRequest.responseText);
          console.log(ourData);

          var nauha = JSON.stringify(ourData);
          var pp = document.createElement('p');
          pp.setAttribute('class', 'kolmannet');
          pp.innerHTML = nauha;
          document.body.appendChild(pp);
        };
        ourRequest.send();
      } else {
        console.log('waiting');
      }
    } else {
      if (user_id !== null) {
        document.getElementById('profile').innerHTML = 'Login from home page only';

        ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/media/user/" + user_id, true);
        ourRequest.onload = function() {
          var ourData = JSON.parse(ourRequest.responseText);
          console.log(ourData);

          var nauha = JSON.stringify(ourData);
          var pp = document.createElement('p');
          pp.setAttribute('class', 'kolmannet');
          pp.innerHTML = nauha;
          document.body.appendChild(pp);
        };
        ourRequest.send();
      } else {
        console.log('waiting');
      }
    }
}

function kayttajat() {
  ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/users", true);
  token = sessionStorage.getItem('token');
  ourRequest.setRequestHeader("x-access-token", token);                                                   //passing header information onget request
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);
  };
  ourRequest.send();
}

function tekee(kirjain) {
  ourRequest.open('GET', 'https://media.mw.metropolia.fi/wbma/media/'+kirjain);
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);

    var kuvake = Object.values(ourData)[1];
    asenna(kuvake);
  };
  ourRequest.send();
}

function tekisjo(id) {
  ourRequest.open('GET', 'https://media.mw.metropolia.fi/wbma/media/'+id);
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);
    var numero = Object.values(ourData)[5];                                                                                   //get user id
    checkUser(numero);
    setTimeout(function() {
      var nauha = JSON.stringify(ourData);
      var pp = document.createElement('p');
      pp.setAttribute('class', 'kolmannet');
      pp.innerHTML = nauha;
      document.body.appendChild(pp);
    }, 2000);
  };
  ourRequest.send();
}

function checkUser(id) {
  ourRequest.open('GET', 'https://media.mw.metropolia.fi/wbma/users/'+id);
  token = sessionStorage.getItem('token');
  ourRequest.setRequestHeader("x-access-token", token);
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);
    username = sessionStorage.getItem('username');
    var idnumero = id;
    var naamen = JSON.stringify(Object.values(ourData)[1]);
    var pp = document.createElement('a');
    pp.setAttribute('href', 'profile.html');
    pp.setAttribute('id', idnumero);
    pp.setAttribute('class', 'kopiot');
    pp.onmouseover = function() {
      tallennetaan(idnumero);
    };
    sessionStorage.setItem('kayttaja'+id, naamen);
    pp.innerHTML = 'Käyttäjä '+naamen+' latasi tiedoston:';
    document.body.appendChild(pp);
  };
  ourRequest.send();
}

function tallennetaan(numero) {
  sessionStorage.setItem('perusid', numero);
}

function onkojo() {
  var nimi = document.getElementById("loggaa").value;
  ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/users/username/"+nimi);
  ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData);
  };
  ourRequest.send();
}

function lataa() {
  ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/uploads/b293fd8e298074e60328dff4b4cce026.jpg");
  document.getElementById("your_iFrame").src = "https://media.mw.metropolia.fi/wbma/uploads/b293fd8e298074e60328dff4b4cce026.jpg";
  ourRequest.send();
}

function asenna(annos) {
  ourRequest.open("GET", "https://media.mw.metropolia.fi/wbma/uploads/"+annos);
  var divdiv = document.createElement('div');
  var imgimg = document.createElement('img');
  divdiv.setAttribute('id', 'minundivini');
  imgimg.setAttribute('id', 'minunkuvani');
  document.body.appendChild(divdiv);
  document.getElementById('minundivini').appendChild(imgimg);
  document.getElementById('minunkuvani').src = "https://media.mw.metropolia.fi/wbma/uploads/"+annos;
  document.getElementById("my_iframe").src = "https://media.mw.metropolia.fi/wbma/uploads/"+annos;
  ourRequest.send();
}



function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}