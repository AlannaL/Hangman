//IIFE 
(function(){
 	var listOfWords = [],
 	    currentWord = [],
 	    displayWord = [],
 	    wordsPerGame = 5,//switch words per game to 5 instead of 10
 	    limbsArray = ['l1','l2','l3','l4','l5','l6','l7'],
 	    indexWordToGuess = 0,
 	    count = 1,
 	    correct = 0,
 		apiKey="a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
 	    guessed = document.getElementById("guessed-letters"),
 	    message = document.getElementById('message-area'),
 	    wordContainer = document.getElementById("word"),
        guessedString = "",   //to display letters already guessed
        arrLetters = []; //an array to hold the letters already guessed;

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
 	                  
 	     //  console.log("promise end",response);
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

		    xmlhttp.open("GET", "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&excludePartOfSpeech=noun-plural&minCorpusCount=10000&maxCorpusCount=20000&minDictionaryCount=0&maxDictionaryCount=-1&minLength=5&maxLength=7&limit="+wordsPerGame+"&api_key="+apiKey, true);
		    xmlhttp.send();	
		});

				
	}

	function displayCurrentWord(){
		var dashes = Array.apply(null, { length: currentWord.length-2 }) ;
		var addDashes = dashes.map(function(dash){
           return "_";
		});
		 displayWord = []; //resets word to display before adding new word to guess
         displayWord.push(currentWord[0]);
         displayWord = displayWord.concat(addDashes);
         displayWord.push(currentWord[currentWord.length-1]);
        console.log(currentWord);
		wordContainer.innerHTML = displayWord.join(" ");

	}

  
    //For each letter entered
	document.getElementById('letter').onkeyup = function(){
		 var letter = document.getElementById("letter").value;
         console.log(letter);
	   
	    var found = false;
        currentWord.forEach(function(character,index){
           if(index !==0 && index !== (currentWord.length-1) && 
           	  character.toLowerCase() === letter.toLowerCase()){  //for correctly guessed letter
           		displayWord[index] = letter;//add guessed letter in word to display
           		currentWord[index] = "-1";// remove guessed letter from the initial word to guess
           		correct++;  //number of correct letters guessed
           		console.log(correct);
           		found = true; //letter was correctly guessed
           		console.log(currentWord);
           		message.innerHTML = "Correct letter";
           		if (correct == currentWord.length-2){ //the win condition
				  console.log("Won");
				  message.innerHTML = "You won!";
				  //resetWord();
				}

           }
           
		});





 		 	
       document.getElementById('letter').value ="";     //reset input value
       
       //for not correct guess
       if(count < 8 && arrLetters.indexOf(letter) < 0 && !found){//if there are still limbs to display and the letter hasn't already been guessed and is false
           	 displayLimb(count);
           	 count++;
        
        }
        
        //if not end of game for everytime a key is pressed
        if(count < 8){
        	 wordContainer.innerHTML = displayWord.join(" ");    //update the displayed word



	        if (arrLetters.indexOf(letter) != -1){        //if letter has already been guessed
	            message.innerHTML = "That letter has already been guessed";
	        } else {                                     // if a new letter
	          guessedString = guessedString.concat(letter + " ");
	          guessed.innerHTML = guessedString;      //display the guessed letter
	          arrLetters.push(letter);
	          console.log(arrLetters);
	          message.innerHTML = "";
	        }	
        }
        else{// if the user has already missed 7 times  -- start a new game
        	resetWord();//reset all needed variables, labels
        }
     
	}

	function displayLimb(number){
		document.getElementById("l"+number).className = "show";
	}
	function hideLimbs(){
		 limbsArray.forEach(function(limb){
		           document.getElementById(limb).className = "hide";
	     });
	}
	function resetWord(){
		
		if(indexWordToGuess < listOfWords.length-1){
		  // display previous word to guess in full 
		   displayWord =  listOfWords[indexWordToGuess].split(""); 
		   wordContainer.innerHTML = displayWord.join(" "); 
		  	//wait two seconds before moving to the next word in the list
    	   setTimeout(function(){ 
	    	   	reinitializeValues();
				//move to the next word to guess in the list	
			    indexWordToGuess++;	
			    currentWord = listOfWords[indexWordToGuess].split("");
	    	   	displayCurrentWord(); 
    	   }, 2000);
		   

		}
		else{
			reinitializeValues()
			alert("Game over !");
			//TO-DO implement code for display end game dialog for starting a new game again	
		}
	}
	function reinitializeValues(){
		//hide hangman again
			    hideLimbs();
				//resets count of missed letters		
				count =1;
				//reset guessed letters display
				guessedString = "";
				guessed.innerHTML = guessedString; 
				message.innerHTML = guessedString;
				arrLetters = [];
	}
})();