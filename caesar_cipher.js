function saveSelection(containerEl) {
    var charIndex = 0, start = 0, end = 0, foundStart = false, stop = {};
    var sel = rangy.getSelection(), range;

    function traverseTextNodes(node, range) {
        if (node.nodeType == 3) {
            if (!foundStart && node == range.startContainer) {
                start = charIndex + range.startOffset;
                foundStart = true;
            }
            if (foundStart && node == range.endContainer) {
                end = charIndex + range.endOffset;
                throw stop;
            }
            charIndex += node.length;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i], range);
            }
        }
    }
    
    if (sel.rangeCount) {
        try {
            traverseTextNodes(containerEl, sel.getRangeAt(0));
        } catch (ex) {
            if (ex != stop) {
                throw ex;
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function restoreSelection(containerEl, savedSel) {
    var charIndex = 0, range = rangy.createRange(), foundStart = false, stop = {};
    range.collapseToPoint(containerEl, 0);
    
    function traverseTextNodes(node) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                throw stop;
            }
            charIndex = nextCharIndex;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i]);
            }
        }
    }
    
    try {
        traverseTextNodes(containerEl);
    } catch (ex) {
        if (ex == stop) {
            rangy.getSelection().setSingleRange(range);
        } else {
            throw ex;
        }
    }
}

function strip(html)
    {
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent||tmp.innerText;
    }

function encipher(inputLetters, noteLetters){

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
	console.log("Shift Amount: " + shiftAmount);

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
	console.log("Ciphered Letters: " + cipheredLetters);
	
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
	var cipheredOutput1 = "<table class='table table-condensed lead' style='border-top: none'><tr>" + uppertable.join("") + "</tr><tr>" + lowertable1.join("") + "</tr></table>";
	var cipheredOutput2 = "(Caesar Shifted <font color='2F96B4'>" + bestShiftAmount + "</font> places)";
	var cipheredOutput3 = "(<font color='2F96B4'>" + mostEmbeddedCipher.length + "</font> of " + (bestCipheredLetters.length - bestCipheredWordCount) + " letters used)";

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
	var cipheredOutput2 = "(Caesar Shifted <font color='2F96B4'>" + bestShiftAmount + "</font> places)";
	var cipheredOutput3 = "<strong><font color='2F96B4'>" + "The Message Fits!" + "</strong></font>";
    }
    	
    document.getElementById("ciphered-message1").innerHTML = cipheredOutput1;
    document.getElementById("ciphered-message2").innerHTML = cipheredOutput2;
    document.getElementById("ciphered-message3").innerHTML = cipheredOutput3;
    document.getElementById("alsoletterText").innerHTML = bestSteganographicNote;
    console.log(bestSteganographicNote);
}

function getLetter(){
    var userInput=document.getElementById("messageText");
    var userInputNoSpaces = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
	console.log(noteLetters);
	console.log(noteLetters.length);
	encipher(inputLetters, noteLetters);
	restoreSelection(letterText, savedSel);
    }
}


function getMessage(){
    var userInput=document.getElementById("messageText");
    var userInputNoSpaces = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    var inputLetters = userInputNoSpaces.split("");
    console.log("inputLetters: " + inputLetters.length);
    var letterText=document.getElementById("alsoletterText");
    var savedSel = saveSelection(userInput);
    noteLetters = strip(letterText.innerHTML).split("");
    console.log(noteLetters);
    console.log(noteLetters.length);

    if (inputLetters.length === 0){
	document.getElementById("ciphered-message1").innerHTML = "Enter Your Secret Message";
	document.getElementById("ciphered-message2").innerHTML = "</br>";
	document.getElementById("ciphered-message3").innerHTML = "</br>";
	document.getElementById("alsoletterText").innerHTML = noteLetters.join("");
	
    }else if (noteLetters.length <= inputLetters.length){
	document.getElementById("ciphered-message1").innerHTML = "Espionage takes a little more effort than that";
	document.getElementById("ciphered-message2").innerHTML = "</br>";
	document.getElementById("ciphered-message3").innerHTML = "</br>";
    }else{
	encipher(inputLetters, noteLetters);
	restoreSelection(userInput, savedSel);
    }
}

function caesarShiftLeft(shiftAmount, inputLetters){
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var alphabetLetters = alphabet.split("");
    var cipherShiftedLetters = new Array();
    for (i=0; i < inputLetters.length; i++){
	for (j=0; j < alphabetLetters.length; j++){
	    if (inputLetters[i] === " "){
		cipherShiftedLetters.push("");
		break;
	    }else if(inputLetters[i] === alphabetLetters[j]){
		var caesarShiftAmount = (j - shiftAmount);
		if(caesarShiftAmount < 0){
		    caesarShiftAmount = caesarShiftAmount + 26;
		}
		cipherShiftedLetters.push(alphabetLetters[caesarShiftAmount]);
	    }
	}
    }
    return cipherShiftedLetters;
}

function wordTest(word, cipher, cipherStartingPosition){
    var matchedWordCount = 0;
    var matchedWords = new Array();
    var j = 0;
    //console.log("---------------------------------------WORD TEST STARTS HERE--------------------------------   " + word);		
    //console.log("cipherStartingPosition is: " + cipherStartingPosition);
    if (cipherStartingPosition + word.length <= cipher.length){
	for (i=cipherStartingPosition; i <= cipherStartingPosition + word.length; i++){
	    //console.log("i: " + i);
	    while (j < word.length){
		if (cipher[i] === word[j]){
		    matchedWordCount++;
		    matchedWords.push(i);
		    //console.log(cipher[i] + " , " + word[j] + " , " + matchedWordCount + " , " + matchedWords);
		    j++;
		    break;
		}else{
		    matchedWordCount = 0;
		    matchedWords = [];
		    j = 0;
		    //console.log("No Case 1");
		    return false;}
	    }
	}
    }
    //console.log(matchedWordCount + " , " + word.length);
    if (matchedWordCount === word.length){
	console.log("---------------------------------------------------------------------------------------------- " + word + " is a match!");
	return matchedWords;
    }else{
	//console.log("No Case 2");
	return false;
    }
}

function sortfunctionByRoots(a, b){
    //console.log("A is: " + a[0] + " and B is: " + b[0] + " and the difference is: " + (a[0] - b[0]));
    return b.length - a.length;
	}
englishWords.sort(sortfunctionByRoots);
//console.log(englishWords);


//this is doing something, if I type "we" after "type your message here" I get a funny recalculation of found words
function removeRoots(array){
	    for (i=1; i < array.length; i++){
	//	console.log("Array length is: " + array.length + " i is: " + i + " array[i][0] is: " + array[i][0] + " and array[i+1][0] is: " + array[i-1][0]);
		if (array[i][0] === array[i-1][0]){
	//	console.log("array[i][0].length is: " + array[i].length + " and array[i+1][0].length is: " + array[i-1].length);
		    if (array[i].length > array[i-1].length){
	//		console.log("My array was: " + array);
			array.splice(i-1, 1)
	//		console.log("My array now is: " + array);
		    }else if (array[i].length < array[i-1].length){
	//		console.log("My array was: " + array);
			array.splice(i, 1)
	//		console.log("My array now is: " + array);
		    }
		}
	    }
}
 
function decipher(){
    var userInput=document.getElementById("cipherText");
    var inputLetters = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '').split("");
    var finalResult = new Array();
    var matchedList = new Array();
    
    for (n=1; n <= 26; n++){
	var shiftAmount = n;
	var result = ["Shifted " + shiftAmount + " places: "];
	console.log("SHIFT AMOUNT: " + shiftAmount);
	
	var cipheredLetters = caesarShiftLeft(shiftAmount, inputLetters);
	console.log("Cipher Letters: " + cipheredLetters.join(""));
//	console.log("------------------------------DECIPHER STARTS HERE-------------------------------");
	var y = 0;
	var m = 0;
	while(y <= cipheredLetters.length){
	    console.log("y = " + y + " , " + cipheredLetters[y]);
	    if (y < cipheredLetters.length){
		while(m < englishWords.length){
		    //console.log("englishWords[m]: " + englishWords[m] + " , first letter: " + englishWords[m][0] + " , cipher letter " + cipheredLetters[y] + " , place in cipher: " + y);
		    if(englishWords[m][0] === cipheredLetters[y] && wordTest(englishWords[m], cipheredLetters, y)){   
			matchedList.push(wordTest(englishWords[m], cipheredLetters, y));
			y = y + englishWords[m].length - 1;
			//console.log("y is jumping ahead to: " + y);
			m = 0;
			break;
			//console.log("M is: " + m + " and the word is: " + englishWords[m]);
		    }else if (m === englishWords.length - 1){
			m = 0;
			break;
		    }else{m++;}
		}
		y++;
	    
	    }else{break;}
	}
	
	function sortfunction(a, b){
	    //console.log("A is: " + a + " and B is: " + b);
	    return a[0] - b[0];
	}
	    
	matchedList.sort(sortfunction);
	removeRoots(matchedList);

	console.log("Matched List Array Sorted: " + matchedList);
	var r = 0;
	var p = 0;
	if(matchedList.length > 0){
	    //console.log("matched list length: " + matchedList.length);
	    while (r < cipheredLetters.length){
		
		if ( p < matchedList.length){
		    //console.log("r: " + r + " , and matchedList[p][0] is: " + matchedList[p][0]);
		    if (matchedList[p][0] >= r ){
			//console.log("r: " + r + " , and matchedList[p][0] is: " + matchedList[p][0]);
			if (r === matchedList[p][0]){
			    result.push("<font color='2F96B4'> " + cipheredLetters.slice(matchedList[p][0], matchedList[p][matchedList[p].length - 1] + 1 ).join("") + " </font>");
			    console.log("The word is: " + cipheredLetters.slice(matchedList[p][0], matchedList[p][matchedList[p].length - 1] + 1 ).join(""));
		 	    r = matchedList[p][matchedList[p].length - 1] + 1;
			    p++;
			    //console.log("r: " + r + " , and P is: " + p);
			}
			else{
			    //console.log(r);
			    result.push(cipheredLetters[r]);
			    r++;
			}
		    }else{p++;}
		    
		}else{
		    //console.log(r);
		    result.push(cipheredLetters[r]);
		    r++;
		}
	    }
		console.log("Result: " + result.join(""));
	    }else{
		result.push(cipheredLetters.join(""));
	}
	result.push("</br>");
	finalResult.push(result.join(""));
	matchedList = [];
}
    for (h=0; h< finalResult.length; h++){
	console.log(finalResult[h].length);
    }
    document.getElementById("deciphered-message").innerHTML = "<div class='well' align='center'><p class='lead' style='margin-left:12px; margin-top:8px' align='left'>" + finalResult.join("") + "</p></div>";
}
   
