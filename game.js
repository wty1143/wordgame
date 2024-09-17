
function speak(str) {
    
    var msg = new SpeechSynthesisUtterance(str);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

  

function GameCntl($scope, $timeout) {
    $scope.clue = "_ar";
    $scope.word = "car";
    $scope.letter = "c";
    $scope.index = 0;
    $scope.right_indicator = false;
    $scope.wrong_indicator = false;
    $scope.number_right = 0;
    $scope.timeout = 0;
    $scope.mode = "any";

    $scope.checkImageExists = function(word) {
        var img = new Image();
        img.src = 'img/' + word + '.jpg';
        img.onload = function() {
            // Image exists, display it
            $scope.imageExists = true;
            $scope.$apply();
        };
        img.onerror = function() {
        // Image does not exist, try .png
          img.src = 'img/' + word + '.png';
          img.onload = function() {
            // Image exists, display it
            $scope.imageExists = true;
            $scope.$apply();
          };
          img.onerror = function() {
            // Image does not exist, handle error
            $scope.imageExists = false;
            $scope.$apply();
          };
        };
      };

    // Function to pick random letters for choices
    function pickRandomChoices(word, index) {
        const choices = [word[index].toUpperCase()];
        let usedLetters = choices;
        console.log("Using letters" + word[index].toUpperCase())
        while (choices.length < 5) {
            console.log("choices.length" + choices.length)
            const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            if (!usedLetters.includes(randomLetter)) {
                choices.push(randomLetter);
                // usedLetters.push(randomLetter);
                console.log("Add letters" + randomLetter)
            }
        }
        // Shuffle the choices
        choices.sort(() => Math.random() - 0.5);
        return choices;
    }
    
    $scope.setmode = function(m) {
        $scope.mode = m;
        $scope.next();
    }
    
    $scope.next = function() {
        
        $scope.timeout = 0;
        
        // Pick a random word
        $scope.word = words[Math.floor(Math.random()*words.length)];
        
        $scope.checkImageExists($scope.word);

        // Select a letter
        if($scope.mode == "any") {
            $scope.index = Math.floor(Math.random()*$scope.word.length);
        } else {
            $scope.index = 0;
        }
        
        $scope.letter = $scope.word[$scope.index];
        const choices = pickRandomChoices($scope.word, $scope.index);
        $scope.choices = choices;

        $scope.resetclue();
        // Update clue and button text
        $scope.clue = $scope.word.substr(0, $scope.index) + '_' + $scope.word.substr($scope.index + 1);
            $("#choice1").text(choices[0]);
            $("#choice2").text(choices[1]);
            $("#choice3").text(choices[2]);
            $("#choice4").text(choices[3]);
            $("#choice5").text(choices[4]);
        };
    
    $scope.resetclue = function() {
        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;
        
        $scope.clue = $scope.word.substr(0, $scope.index) + '_'
        + $scope.word.substr($scope.index + 1);
        
        speak($scope.word);
    };
    
    $scope.keyup = function(e) {
        // If they already got it right, ignore input
        if($scope.right_indicator) {
            return;
        }

        console.log('keyup ' + e.keyCode);

        c = String.fromCharCode(e.keyCode);
        
        // Ignore key presses outside of A-Z
        if(c < 'A' || c > 'Z') {
            return;
        }

        console.log($scope.clue);
        
        if(c == $scope.letter.toUpperCase()) {
            $scope.correct();
        } else if(c == ' ') {
            $scope.next();
        } else {
            $scope.incorrect(c);
        }
    };

    // We then use $scope.$apply to update the Angular scope with the new clue value. This ensures that the change is reflected in the HTML view.
    function checkAnswer(choice) {
        console.log(choice + " clicked");
        console.log("Answer: " + $scope.word[$scope.index])
        const newClue = $scope.word.substr(0, $scope.index) + choice.toLowerCase() + $scope.word.substr($scope.index + 1);
        $scope.$apply(function () {
            $scope.clue = newClue;
        });
        if (choice === $scope.word[$scope.index].toUpperCase()) {
            $scope.correct();
        } else {
            $scope.incorrect(choice);
        }
    }

    // Handle button clicks
    $("#choice1").click(function () {
        console.log("choice1 clicked");
        checkAnswer($scope.choices[0]);
    });

    $("#choice2").click(function () {
        console.log("choice2 clicked");
        checkAnswer($scope.choices[1]);
    });

    $("#choice3").click(function () {
        console.log("choice3 clicked");
        checkAnswer($scope.choices[2]);
    });

    $("#choice4").click(function () {
        console.log("choice4 clicked");
        checkAnswer($scope.choices[3]);
    });

    $("#choice5").click(function () {
        console.log("choice5 clicked");
        checkAnswer($scope.choices[4]);
    });

    $scope.correct = function() {
        
        $scope.number_right += 1;
        
        $scope.$apply(function () {
            $scope.right_indicator = true;
            $scope.wrong_indicator = false;
        });
        
        $scope.clue = $scope.word.substr(0, $scope.index) + $scope.letter
        + $scope.word.substr($scope.index + 1);
        
        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.next, 2000);
        
        $('#jpId').jPlayer("play");
    };
    
    $scope.incorrect = function(c) {
        console.log("incorrect input: " + c);

        $scope.$apply(function () {
            $scope.right_indicator = false;
            $scope.wrong_indicator = true;
        });
        // $scope.right_indicator = false;
        // $scope.wrong_indicator = true;
        
        $scope.clue = $scope.word.substr(0, $scope.index) + c.toLowerCase()
        + $scope.word.substr($scope.index + 1);

        
        
        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.resetclue, 2000);
        
        speak($scope.clue + "?");
    };
    
    $scope.next();
}