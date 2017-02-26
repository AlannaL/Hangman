//IIFE 
(function(){
 	var listOfWords = [],
 	    currentWord = [],
 		apiKey="a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

 	window.onload = function(e){
 	    getRandomWords().then(function(response){
 	       if(response){
 	       	  listOfWords = response;
 	          currentWord = listOfWords[0].split("");	
 	          displayCurrentWord();
 	       }
 	       else{
 	       	  alert("Please come back later!");
 	       }
 	                  
 	       console.log("promise end",response);
 		}).catch(function(error){
 			console.log("There was an error in retrieving random words");
 		});
       
 	};

	function getRandomWords(){
		return new Promise(function(resolve, reject){
		    //We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
		    //In this example, we use setTimeout(...) to simulate async code. 
		    //In reality, you will probabally using something like XHR or an HTML5 API.
		    var listOfWords = [];

			 var xmlhttp = new XMLHttpRequest();

		    xmlhttp.onreadystatechange = function() {
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
		// currentWordText = first + [e,r_,_,] + lastLetter
		wordContainer.innerHTML = currentWord[0]+ addDashes.join(" ")+currentWord[currentWord.length-1];

	}

	document.getElementById('letter').onkeyup = function(){
		 var letter = document.getElementById("letter").value;
         console.log(letter);
        var wordContainer = document.getElementById("word");
        var regex  = new  RegEx(letter, "g");
        
        var newWordDisplay = currentWord.substring(1,currentWord.length-2).join("").replace(regex, "_");
        // currentWordText = first + [e,r_,_,] + lastLetter
        wordContainer.innerHTML = currentWord[0]+ newWordDisplay+currentWord[currentWord.length-1];
  

	}
})();