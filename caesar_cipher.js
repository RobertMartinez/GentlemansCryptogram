function getValue(){
    var userInput=document.getElementById("messageText").value.toLowerCase();
    var userInputNoSpaces = userInput.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    var inputLetters = userInputNoSpaces.split("");

    var userNote=document.getElementById("letterText").value;
    var noteLetters = userNote.split("");

    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var alphabetLetters = alphabet.split("");
	
    var mostEmbeddedCipher = new Array();
    var shiftAmount = 0;
    var bestShiftAmount = 0;
    var bestCipheredLetters = new Array();
    var bestCipheredWordCount = 0;
    var bestSteganographicNote = "";
    var bestNoteLetters = new Array();
    var bestUsedNoteLetters = new Array();

    for (n=1; n <= 25; n++){
	shiftAmount = n;
	//console.log("Shift Amount: " + shiftAmount);

	var originalMessageLetters = new Array();
	var cipheredLetters = new Array();
	for (i=0; i < inputLetters.length; i++){
	    for (j=0; j < alphabetLetters.length; j++){
		if (inputLetters[i] === " "){
		    cipheredLetters.push("-");
		    originalMessageLetters.push("-");
		    break;
		}else if(inputLetters[i] === alphabetLetters[j]){
		    var caesarShiftAmount = (j + shiftAmount)%26;
		    cipheredLetters.push(alphabetLetters[caesarShiftAmount]);
		    originalMessageLetters.push(alphabetLetters[j]);
		}
	    }
	}
	//console.log("Ciphered Letters: " + cipheredLetters);
	
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
		    steganographicNote += "<strong><font color='2F96B4'>" + noteLetters[k] + "</font></strong>";
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
	
	if (usedCipherLetters.length > mostEmbeddedCipher.length){
	    mostEmbeddedCipher = usedCipherLetters;
	    bestCipheredLetters = cipheredLetters;
	    bestShiftAmount = shiftAmount;
	    bestCipheredWordCount = cipheredWordCount;
	    bestSteganographicNote = steganographicNote;
	    bestNoteLetters = noteLetters;
	    bestUsedNoteLetters = usedNoteLetters;
	    //console.log("Used Cipher Letters: " + usedCipherLetters);
	    //console.log("Most Embedded Cipher: " + mostEmbeddedCipher);
	    //console.log("Shift Amount: " + shiftAmount);
	    //console.log("Best Shift Amount: " + bestShiftAmount);
	    //console.log("Best Ciphered Letters: " + bestCipheredLetters);
	}
	
    }
    
    var uppertable = new Array();
    var lowertable1 = new Array();

    if (mostEmbeddedCipher.length + bestCipheredWordCount < bestCipheredLetters.length){
	for (i=0; i< mostEmbeddedCipher.length + bestCipheredWordCount; i++){
	    uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
	    lowertable1.push("<td><strong><font color='2F96B4'>" + bestCipheredLetters[i] + "</font></strong></td>");
	}
	for (i=mostEmbeddedCipher.length + bestCipheredWordCount; i< originalMessageLetters.length; i++){
	    uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
	    lowertable1.push("<td>" + bestCipheredLetters[i] + "</td>");
	}
	var cipheredOutput3 = "(<font color='2F96B4'>" + mostEmbeddedCipher.length + "</font> of " + (bestCipheredLetters.length - bestCipheredWordCount) + " letters used)";

    }
    if (mostEmbeddedCipher.length + bestCipheredWordCount === bestCipheredLetters.length){
	var orange = bestUsedNoteLetters.length;
	var noteRemainder = bestNoteLetters.slice(orange).join("");
	bestSteganographicNote += noteRemainder;
	for (i=0; i< bestCipheredLetters.length; i++){
	    uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
	    lowertable1.push("<td>" + bestCipheredLetters[i] + "</td>");
	}
	var cipheredOutput3 = "<strong><font color='2F96B4'>" + "The Message Fits!" + "</strong></font>";
    }
	else if (bestUsedNoteLetters.length < bestNoteLetters.length){
	    var orange = bestUsedNoteLetters.length;
	    var noteRemainder = bestNoteLetters.slice(orange).join("");
	    bestSteganographicNote += noteRemainder;
	    for (i=0; i< bestCipheredLetters.length; i++){
		uppertable.push("<td>" + originalMessageLetters[i] + "</td>");
		lowertable1.push("<td>" + bestCipheredLetters[i] + "</td>");
	    }
	    var cipheredOutput3 = "<strong><font color='2F96B4'>" + "The Message Fits!" + "</strong></font>";
	}
    var cipherMessage="<table class='table table-condensed lead' style='border-top: none'><tr>" + uppertable.join("") + "</tr><tr>" + lowertable1.join("") + "</tr></table>";
    var cipheredOutput1 = cipherMessage;
    var cipheredOutput2 = "(Caesar Shifted <font color='2F96B4'>" + bestShiftAmount + "</font> places)";
    //cipheredOutput2 += "</br>(<font color='2F96B4'>" + mostEmbeddedCipher.length + "</font> of " + (bestCipheredLetters.length - bestCipheredWordCount) + " letters used)";
	

    document.getElementById("ciphered-message1").innerHTML = cipheredOutput1;
    document.getElementById("ciphered-message2").innerHTML = cipheredOutput2;
    document.getElementById("ciphered-message3").innerHTML = cipheredOutput3;
    document.getElementById("original-letter").innerHTML = "<div class='well'><p class='lead' style='margin-left:12px; margin-top:8px' align='left'>" + bestSteganographicNote + "</p></div>";

}
   