//Everything from here down deals with deciphering for the Caesar Shift cipher

//This function takes a string (a word) and sees if it fits in another string (a cipher) starting at a given position (the starting position)
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
    // console.log("Array length is: " + array.length + " i is: " + i + " array[i][0] is: " + array[i][0] + " and array[i+1][0] is: " + array[i-1][0]);
    if (array[i][0] === array[i-1][0]){
      // console.log("array[i][0].length is: " + array[i].length + " and array[i+1][0].length is: " + array[i-1].length);
      if (array[i].length > array[i-1].length){
        // console.log("My array was: " + array);
        array.splice(i-1, 1)
        // console.log("My array now is: " + array);
      }else if (array[i].length < array[i-1].length){
        // console.log("My array was: " + array);
        array.splice(i, 1)
        // console.log("My array now is: " + array);
      }
    }
  }
}
 


function decipher(){
  var userInput=document.getElementById("cipherText");
  var inputLetters = userInput.value.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/[^-a-z0-9]/ig,'').split("");
  var finalResult = new Array();
  var matchedList = new Array();
  
  for (n=1; n <= 26; n++){
    var shiftAmount = n;
    var result = ["Shifted " + shiftAmount + " places: "];
    console.log("SHIFT AMOUNT: " + shiftAmount);

    var cipheredLetters = caesarShift(shiftAmount, inputLetters, "left");
    console.log("Cipher Letters: " + cipheredLetters.join(""));
    //  console.log("------------------------------DECIPHER STARTS HERE--------------------------------");
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
          }else{
            m++;
          }
        }
        y++;        
      }else{
        break;
      }
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
              result.push("<font color='ffc900'> " + cipheredLetters.slice(matchedList[p][0], matchedList[p][matchedList[p].length - 1] + 1 ).join("") + " </font>");
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
          }else{
            p++;
          }          
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
   