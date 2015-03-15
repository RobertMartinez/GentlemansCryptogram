// TODOS
// [] split this file up into different modules
// [] refactor like mad
// [] reduce/eliminate all hardcoded variables
// [] understand how saveSelection and restoreSelection work

//This is used to remove all HTML from the Letter Box so I can then put it into an array and manipulate it
//I don't understand how this function actually works
function strip(html){
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent||tmp.innerText;
}

//This is maybe the most important function in this document. 
//It will take an array of letters and shift all them the same specified amount in a specified direction. 
function caesarShift(shiftAmount, inputLetters, direction){
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var alphabetLetters = alphabet.split("");
  var cipherShiftedLetters = new Array();
  
  for (i=0; i < inputLetters.length; i++){
    for (j=0; j < alphabetLetters.length; j++){
      if (inputLetters[i] === " "){
		    cipherShiftedLetters.push("-");
		    break;
	    }
      else if(inputLetters[i] === alphabetLetters[j]){
		    switch (direction){
      		case "left":
    		    //console.log("Shifting Left");
    		    var caesarShiftAmount = (j - shiftAmount);
    		    if(caesarShiftAmount < 0){
      			  caesarShiftAmount = caesarShiftAmount + 26;
      		    }
    		    cipherShiftedLetters.push(alphabetLetters[caesarShiftAmount]);
    		    break;
      		case "right":
    		    //console.log("Shifting Right");
    		    var caesarShiftAmount = (j + shiftAmount)%26;
    		    cipherShiftedLetters.push(alphabetLetters[caesarShiftAmount]);
    		    break;
      		case "none":	
    		    //console.log("Not Shifting");
    		    cipherShiftedLetters.push(alphabetLetters[j]);
    		    break;
    		}
	    }
    }
  }
  return cipherShiftedLetters;
}

//how on earth is this is a 96 line function?! 
function encipher(inputLetters, noteLetters, direction, actualLetterCount){
  var mostEmbeddedCipher = new Array();
  var bestShiftAmount = 0;
  var bestCipheredLetters = new Array();
  var bestCipheredWordCount = 0;
  var bestSteganographicNote = "";
  var bestNoteLetters = new Array();
  var bestUsedNoteLetters = new Array();

  for (n=1; n <= 25; n++){
  	var shiftAmount = n;
  	console.log("Shift Amount: " + shiftAmount);

  	var cipheredLetters = caesarShift(shiftAmount, inputLetters, direction);
  	var originalMessageLetters = caesarShift(shiftAmount, inputLetters, "none")

  	console.log("Ciphered Letters: " + cipheredLetters);
  	//console.log("originalMessageLetters: " + originalMessageLetters);

  	var steganographicNote = "";
  	var usedCipherLetters = new Array();
  	var usedNoteLetters = new Array();
  	var cipheredWordCount = 0
  	var k=0;
  	for (i=0; i < cipheredLetters.length; i++){
      while (k < noteLetters.length){
  		  if (cipheredLetters[i] === "-"){
  		    cipheredWordCount++;
  		    break;
  		  }else if(noteLetters[k].toLowerCase() === cipheredLetters[i]){
  		    steganographicNote += "<strong><font color='ffc900'>" + noteLetters[k] + "</font></strong>";
  		    usedCipherLetters.push(cipheredLetters[i]);
  		    usedNoteLetters.push(i);
  		    k++;
  		    break;
  		  }else{
  		    steganographicNote += noteLetters[k];
  		    k++;
  		    usedNoteLetters.push(i);
  		  }
      }
  	}

  	//console.log("Used Ciphered Letters: " + usedCipherLetters);
  	console.log("CipheredLetters.length: " +cipheredLetters.length + " , CipheredWordCount: " + cipheredWordCount);

  	if (usedCipherLetters.length > mostEmbeddedCipher.length){
	    mostEmbeddedCipher = usedCipherLetters;
	    bestCipheredLetters = cipheredLetters;
	    bestShiftAmount = shiftAmount;
	    bestCipheredWordCount = cipheredWordCount;
	    bestSteganographicNote = steganographicNote;
	    bestNoteLetters = noteLetters;
	    bestUsedNoteLetters = usedNoteLetters;
  	}
  	if (direction === "none"){
	    bestShiftAmount = 0;
  	}
  }

// Everything from here down creates the html table with row1 being the original message and row2 being enciphered

  var uppertable = new Array();
  var lowertable1 = new Array();

  if (mostEmbeddedCipher.length + bestCipheredWordCount < bestCipheredLetters.length){
    for (i=0; i< mostEmbeddedCipher.length + bestCipheredWordCount; i++){
	    uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
	    lowertable1.push("<td><strong><font color='ffc900'>" + bestCipheredLetters[i] + "</font></strong></td>");
    }
  	for (i=mostEmbeddedCipher.length + bestCipheredWordCount; i< originalMessageLetters.length; i++){
  	    uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
  	    lowertable1.push("<td>" + bestCipheredLetters[i] + "</td>");
  	}
  	var cipheredOutput1 = "<table class='table table-condensed lead' style='border-top: none'><tr>" + uppertable.join("") + "</tr><tr>" + lowertable1.join("") + "</tr></table>";
  	var cipheredOutput2 = "(Caesar Shifted <font color='ffc900'>" + bestShiftAmount + "</font> places)";
  	var cipheredOutput3 = "(<font color='ffc900'>" + mostEmbeddedCipher.length + "</font> of " + (actualLetterCount) + " letters used)";
  }

  if (mostEmbeddedCipher.length + bestCipheredWordCount === bestCipheredLetters.length || bestUsedNoteLetters.length < bestNoteLetters.length){
  	var orange = bestUsedNoteLetters.length;
  	var noteRemainder = bestNoteLetters.slice(orange).join("");
  	bestSteganographicNote += noteRemainder;
  	for (i=0; i< bestCipheredLetters.length; i++){
	    uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
	    lowertable1.push("<td>" + bestCipheredLetters[i] + "</td>");
  	}
  	var cipheredOutput1 = "<table class='table table-condensed lead' style='border-top: none'><tr>" + uppertable.join("") + "</tr><tr>" + lowertable1.join("") + "</tr></table>";
  	var cipheredOutput2 = "(Caesar Shifted <font color='ffc900'>" + bestShiftAmount + "</font> places)";
  	var cipheredOutput3 = "<strong><font color='ffc900'>" + "The Message Fits!" + "</strong></font>";
  }
    	
  document.getElementById("ciphered-message1").innerHTML = cipheredOutput1;
  document.getElementById("ciphered-message2").innerHTML = cipheredOutput2;
  document.getElementById("ciphered-message3").innerHTML = cipheredOutput3;
  document.getElementById("alsoletterText").innerHTML = bestSteganographicNote;
  console.log(bestSteganographicNote);
}

// and the award for least DRY code goes to: getLetter(), getMessage(), and disableEnciphering()

function getLetter(){
  var userInput=document.getElementById("messageText");
  var userInputNoSpaces = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  var justLettersWithoutSpaces = userInputNoSpaces.replace(/[^-a-z0-9]/ig,'');
  var actualLetterCount = justLettersWithoutSpaces.length;
  console.log("actualLetterCount: " + actualLetterCount + typeof actualLetterCount);
  var inputLetters = userInputNoSpaces.split("");
  var letterText=document.getElementById("alsoletterText");
  var savedSel = saveSelection(letterText);
  
  noteLetters = strip(letterText.innerHTML).split("");
  console.log("noteLetters: " + noteLetters.length);
  console.log("inputLetters: " + inputLetters.length);
  if (noteLetters.length <= inputLetters.length || inputLetters.length === 0){
  	document.getElementById("ciphered-message1").innerHTML = "Espionage takes a little more effort than that";
  	document.getElementById("ciphered-message2").innerHTML = "</br>";
  	document.getElementById("ciphered-message3").innerHTML = "</br>";
  	document.getElementById("alsoletterText").innerHTML = noteLetters.join("");
  	restoreSelection(letterText, savedSel);
  }else{
  	if (document.getElementById("btn").checked){
      document.getElementById("btn").checked = true;
      console.log(noteLetters);
      console.log(noteLetters.length);
      encipher(inputLetters, noteLetters, "right", actualLetterCount);
      restoreSelection(letterText, savedSel);
  	}else {
      encipher(inputLetters, noteLetters, "none", actualLetterCount);
      document.getElementById("btn").checked = false;
      restoreSelection(letterText, savedSel);
  	}
  }
}


function getMessage(){
  var userInput=document.getElementById("messageText");
  var userInputNoSpaces = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  var justLettersWithoutSpaces = userInputNoSpaces.replace(/[^-a-z0-9]/ig,'');
  var actualLetterCount = justLettersWithoutSpaces.length;
  console.log("actualLetterCount: " + actualLetterCount + typeof actualLetterCount);
  var inputLetters = userInputNoSpaces.split("");
  console.log("inputLetters: " + inputLetters.length);
  var letterText=document.getElementById("alsoletterText");
  var savedSel = saveSelection(userInput);
  
  noteLetters = strip(letterText.innerHTML).split("");
  console.log(noteLetters);
  console.log(noteLetters.length);
  if (noteLetters.length <= inputLetters.length || inputLetters.length === 0){
  	document.getElementById("ciphered-message1").innerHTML = "Espionage takes a little more effort than that";
  	document.getElementById("ciphered-message2").innerHTML = "</br>";
  	document.getElementById("ciphered-message3").innerHTML = "</br>";
  	document.getElementById("alsoletterText").innerHTML = noteLetters.join("");	
  }else{
  	if (document.getElementById("btn").checked){
  	    document.getElementById("btn").checked = true;
  	    console.log(noteLetters);
  	    console.log(noteLetters.length);
  	    encipher(inputLetters, noteLetters, "right", actualLetterCount);
  	    restoreSelection(userInput, savedSel);
  	}else {
  	    encipher(inputLetters, noteLetters, "none", actualLetterCount);
  	    document.getElementById("btn").checked = false;
  	    restoreSelection(userInput, savedSel);
  	}
  }
}

function disableEnciphering(direction){
  var userInput=document.getElementById("messageText");
  var userInputNoSpaces = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  var justLettersWithoutSpaces = userInputNoSpaces.replace(/[^-a-z0-9]/ig,'');
  var actualLetterCount = justLettersWithoutSpaces.length;
  console.log("actualLetterCount: " + actualLetterCount + typeof actualLetterCount);
  var inputLetters = userInputNoSpaces.split("");
  var letterText=document.getElementById("alsoletterText");    
  noteLetters = strip(letterText.innerHTML).split("");
  if (noteLetters.length <= inputLetters.length || inputLetters.length === 0){
  	document.getElementById("ciphered-message1").innerHTML = "Espionage takes a little more effort than that";
  	document.getElementById("ciphered-message2").innerHTML = "</br>";
  	document.getElementById("ciphered-message3").innerHTML = "</br>";
  	document.getElementById("alsoletterText").innerHTML = noteLetters.join("");	
  }else{
	 encipher(inputLetters, noteLetters, direction, actualLetterCount);
  }
}