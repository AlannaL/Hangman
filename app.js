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
 	       }
 	       else{
 	       	  alert("Please come back later!");
 	       }
 	                  
 	       console.log("promise end",response);
 		}).catch(function(error){
 			console.err("There was an error in retrieving random words");
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
		wordContainer.innerHTML = currentWord;

	}
})();