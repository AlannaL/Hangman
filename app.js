//IIFE 
(function(){
 	var listOfWords = [],
 	    currentWord = [],
 	    displayWord = [],
 		apiKey="a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

 	window.onload = function(e){  //when page finishes loading
 	    getRandomWords().then(function(response){ 
 	       if(response){                          //response is returned from api
 	       	  listOfWords = response;
 	          currentWord = listOfWords[0].split(""); // current word is array of letters
 	          displayCurrentWord();
 	       }
 	       else{
 	       	  alert("Please come back later!");  //if no response from api
 	       }
 	                  
 	       console.log("promise end",response);
 		}).catch(function(error){
 			console.log("There was an error in retrieving random words",error);
 		});
       
 	};

	function getRandomWords(){
		return new Promise(function(resolve, reject){
		    //We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
		    //In this example, we use setTimeout(...) to simulate async code. 
		    //In reality, you will probabally using something like XHR or an HTML5 API.
		    var listOfWords = [];

			 var xmlhttp = new XMLHttpRequest();

		    xmlhttp.onreadystatechange = function() {   // ths makes a call to the api
		        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
		           if (xmlhttp.status == 200) {
		              listOfWords = JSON.parse(xmlhttp.responseText).map(function(word){return word.word});
		              resolve(listOfWords)
		           }
		           else if (xmlhttp.status == 400) {
		              console.log('There was an error 400');
		              reject("no response");
		           }
		           else {
		           	  console.log('something else other than 200 was returned');
		           	  reject("no response");
		             
		           }
		        }
		    };

		    xmlhttp.open("GET", "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&excludePartOfSpeech=noun-plural&minCorpusCount=10000&maxCorpusCount=20000&minDictionaryCount=0&maxDictionaryCount=-1&minLength=5&maxLength=7&limit=10&api_key="+apiKey, true);
		    xmlhttp.send();	
		});

				
	}

	function displayCurrentWord(){
		var wordContainer = document.getElementById("word");
		var dashes = Array.apply(null, { length: currentWord.length-2 }) ;
		var addDashes = dashes.map(function(dash){
           return "_";
		});
         displayWord.push(currentWord[0]);
         displayWord = displayWord.concat(addDashes);
         displayWord.push(currentWord[currentWord.length-1]);

		// currentWordText = first + [e,r_,_,] + lastLetter
		wordContainer.innerHTML = displayWord.join(" ");

	}

    var guessed = document.getElementById("guessed-letters");
    var guessedString = "";   //to display letters already guessed
    var arrLetters = []; //an array to hold the letters already guessed

	document.getElementById('letter').onkeyup = function(){
		 var letter = document.getElementById("letter").value;
         console.log(letter);
	    var wordContainer = document.getElementById("word");
        currentWord.forEach(function(character,index){
           if(index !==0 && index !== (currentWord.length-1) && 
           	  character.toLowerCase() === letter.toLowerCase()){
           		displayWord[index] = letter;
           		currentWord[index] = "-1"; 
           }
		});
       document.getElementById('letter').value ="";     //reset input value
       var message = document.getElementById('message-area'); // reset message area
        wordContainer.innerHTML = displayWord.join(" ");    //update the displayed word
        if (arrLetters.indexOf(letter) != -1){        //if letter has already been guessed
            message.innerHTML = "That letter has already been guessed";
        } else {                                     // if a new letter
          guessedString = guessedString.concat(letter);
          guessed.innerHTML = guessedString;      //display the guessed letter
          arrLetters.push(letter);
          console.log(arrLetters);
          message.innerHTML = "";
        }

  

	}
})();