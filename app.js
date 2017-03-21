//IIFE 
(function() {
    var listOfWords = [], //words returned from API
        currentWord = [], //word, array of letters
        answerWord = [], //holds the word for the solution
        displayWord = [], //word on the screen, X----x
        wordsPerGame = 5, //switch words per game to 5 instead of 10
        limbsArray = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'],
        indexWordToGuess = 0,
        count = 1, //the number of wrong guesses
        countMissedWords = 0,
        missedWords = [],
        correct = 0, // the number of correctly guessed letters
        apiKey = "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
        guessed = document.getElementById("guessed-letters"),
        message = document.getElementById('message-area'),
        wordContainer = document.getElementById("word"),
        wordInput = document.getElementById('letter'),
        guessedWords = document.getElementById("guessed-words"),
        guessedNumber = document.getElementById("guessed-number"),
        missedWordsDisplay = document.getElementById("missed-words"),
        missedNumberDisplay = document.getElementById("missed-number"),
        newGameButton = document.getElementById("newGame"),
        winWords = []; //an array to hold correctly guessed words
   		guessedNum = 0, //number of correctly guessed words 
        guessedString = "", //to display letters already guessed
        LIMBS_COUNT = 8, // how many letters the user can guees wrong
        arrLetters = [], //an array to hold the letters already guessed;
        hangman = document.getElementById('hangman'); //hangman id, used for animation

 	window.onload = function(e){  //when page finishes loading
 	   setRandomWords();       
 	};
    window.onbeforeunload = function(e) {
      startNewGame();
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

		    xmlhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&excludePartOfSpeech=noun-plural&minCorpusCount=10000&maxCorpusCount=20000&minDictionaryCount=0&maxDictionaryCount=-1&minLength=5&maxLength=7&limit="+wordsPerGame+"&api_key="+apiKey, true);
		    xmlhttp.send();	
		});		
	}
	function setRandomWords(){
		 getRandomWords().then(function(response){ 
	 	       if(response){                          //response is returned from api
	 	       	  listOfWords = response;
	 	       	  answerWord = listOfWords[0];
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
    wordInput.onkeyup = function() {
        var letter = wordInput.value;
        console.log(letter);

        var found = false;
        currentWord.forEach(function(character, index) {
            if (index !== 0 && index !== (currentWord.length - 1) &&
                character.toLowerCase() === letter.toLowerCase()) { //for correctly guessed letter
                displayWord[index] = letter; //add guessed letter in word to display
                currentWord[index] = "-1"; // remove guessed letter from the initial word to guess
                correct++; //number of correct letters guessed
                found = true; //letter was correctly guessed
                console.log(currentWord); //displays solution for testing purposes
                console.log("Number of correct letters guessed:" + correct);

                if (correct == currentWord.length - 2) { //the win condition, number of correct letters = # of dashes
                    console.log("Won");
                    message.innerHTML = "You won!";
                    guessedNum++;
                    winWords.push(answerWord);
                    console.log("Number of guessed words:" + guessedNum);
                    guessedNumber.innerHTML = guessedNum;
                    guessedWords.innerHTML = winWords.join(", ");
                    resetWord();
                    correct = 0; //reset
                }

            }

        });


        wordInput.value = ""; //reset input value

        //for not correct guess
        if (count < 8 && arrLetters.indexOf(letter) < 0 && !found) { //if there are still limbs to display and the letter hasn't already been guessed and is false
            displayLimb(count);
            count++;

        }

        //if not end of game for everytime a key is pressed
        if (count < LIMBS_COUNT) {
            wordContainer.innerHTML = displayWord.join(" "); //update the displayed word

            if (arrLetters.indexOf(letter) != -1) { //if letter has already been guessed
                message.innerHTML = "That letter has already been guessed";
            } else { // if a new letter
                guessedString = guessedString.concat(letter + " ");
                guessed.innerHTML = guessedString; //display the guessed letter
                arrLetters.push(letter);
                console.log(arrLetters);
                message.innerHTML = "";
            }
        } else if (!wordInput.readOnly) { // if the user has already missed 7 times 
            //counting the missed words and adding their value in an array to display them
            countMissedWords++;
            missedWords.push(listOfWords[indexWordToGuess]);
            updateDisplayMissedWords();
            
            resetWord();
            hangman.className = "transform"; //animates hangman
            
        }


    }

    function displayLimb(number) {
        document.getElementById("l" + number).className = "show";
    }

    function hideLimbs() {
        limbsArray.forEach(function(limb) {
            document.getElementById(limb).className = "hide";
        });
    }

    function resetWord() {

        if (indexWordToGuess < listOfWords.length - 1) {
            // display previous word to guess in full 
            displayWord = listOfWords[indexWordToGuess].split("");
            wordContainer.innerHTML = displayWord.join(" ");
            //deactivate letter input while displaying the full word before going to the next one
            wordInput.readOnly = true;
            //wait two seconds before moving to the next word in the list
            setTimeout(function() {
                reinitializeValues();
                //move to the next word to guess in the list	
                indexWordToGuess++;
                currentWord = listOfWords[indexWordToGuess].split("");
                answerWord = listOfWords[indexWordToGuess];
                displayCurrentWord();
                message.innerHTML = "";
                hangman.classList.remove("transform"); //remove animation class to reset it
                //activate the letter input again
                wordInput.readOnly = false;
            }, 2000);


        } else {

            //display that game has ended and start a new game if user confirms
            swal({
                    title: "Game Over",
                    text: "You have guessed " + guessedNum + " words and missed " + countMissedWords + " words. Do you want to start a new game ?",
                    type: "success",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    showLoaderOnConfirm: true
                },
                function(isConfirm) {
                    if (isConfirm) {
                        
                        startNewGame();
                        newGameButton.style = "visibility: hidden";
                    } else {
                        wordInput.readOnly = true;
                        wordInput.style = "background-color:gray";
                        newGameButton.style = "visibility:visible";
                    }

                });
        }
    }
    newGameButton.onclick = function(e) {
        startNewGame();
    }

    function startNewGame() {
        newGameButton.style = "visibility: hidden";
        wordInput.readOnly = false;
        wordInput.style = "background-color:white";
        reinitializeNewGame();
        setRandomWords();
    }

    function reinitializeNewGame() {
        guessedNum = 0;
        countMissedWords = 0;
        winWords = [];
        missedWords = [];
        missedNumberDisplay.innerHTML = "";
        missedWordsDisplay.innerHTML = "";
        guessedNumber.innerHTML = "";
        guessedWords.innerHTML = "";
        indexWordToGuess = 0;
        wordInput.value ="";
        reinitializeValues();
        hangman.classList.remove("transform"); //remove animation class to reset it
    }

    function updateDisplayMissedWords() {
        missedNumberDisplay.innerHTML = countMissedWords;
        missedWordsDisplay.innerHTML = missedWords.join(", ");
    }

    function reinitializeValues() {
        //hide hangman again
        hideLimbs();
        //reset count of guessed letters
        correct = 0;
        //resets count of missed letters	
        count = 1;
        //reset guesses and message display 
        guessedString = "";
        guessed.innerHTML = "";
        message.innerHTML = "";
        arrLetters = [];

    }
})();
