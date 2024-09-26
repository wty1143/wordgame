
function speak(str) {

    var msg = new SpeechSynthesisUtterance(str);
    msg.rate = 0.75;
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
    $scope.mode = "double";
    $scope.number_total = words.length;
    $scope.usedWords = [];

    function countVowels(str) {
        const matches = str.match(/[aeiouy]/gi); 
        return matches ? matches.length : 0;
    }

    function pickRandomDoubleChoices(word, index){
        const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
        const choices = [word[index].toLowerCase()+word[index+1].toLowerCase()];
        
        if (word[index+1].toLowerCase() == 'm'){
            choices.push(word[index].toLowerCase()+'n')
        }
        if (word[index+1].toLowerCase() == 'n'){
            choices.push(word[index].toLowerCase()+'m')
        }
        if (word[index].toLowerCase() == 'a'){
            choices.push('e'+word[index+1].toLowerCase())
        }
        if (word[index].toLowerCase() == 'e'){
            choices.push('a'+word[index+1].toLowerCase())
        }

        let usedLetters = choices;
        while (choices.length < 5) {
            if (vowels.includes(word[index].toLowerCase())){
                r1 = vowels[Math.floor(Math.random() * vowels.length)];
            }else{
                r1 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            }
            r2 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            if (!usedLetters.includes(r1+r2)) {
                choices.push(r1+r2);
            }
        }
        choices.sort(() => Math.random() - 0.5);
        return choices;
    }

    // Function to pick random letters for choices
    function pickRandomChoices(word, index) {
        const choices = [word[index].toLowerCase()];
        let usedLetters = choices;
        console.log("Using letters" + word[index].toLowerCase())
        while (choices.length < 5) {
            console.log("choices.length" + choices.length)
            const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
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

    // https://www.jqueryscript.net/time-clock/Cool-Mechanical-Scoreboard-Style-Countdown-Plugin-For-jQuery-Countdown.html
    $scope.timer=$(function(){
        $(".digits").countdown({
          image: "js/img/digits.png",
          format: "mmss",
          startTime: "1500",
          digitWidth: 67,
          digitHeight: 90
        });
    });

    $scope.setmode = function(m) {
        $scope.mode = m;
        $scope.next();
    }

    $scope.next = function() {

        $scope.timeout = 0;
        if ($scope.usedWords.length === words.length) {
            $scope.usedWords = []; // 清空 usedWords 陣列
            $('#game-container').hide();
            $('#choice-container').hide();
            $scope.$apply(function () {
                $scope.EndPage = true;
                $('.demo').fireworks({
                    sound: true,
                    opacity:0.9,
                    width: '100%',
                    height: '100%'
                });
            });
            return false;
        }
    
        // 選擇一個新的隨機單字，直到找到一個還沒使用過的
        const availableWords = words.filter(word => !$scope.usedWords.includes(word));
        $scope.word = availableWords[Math.floor(Math.random() * availableWords.length)];
    
        // 將新單字加入已使用列表
        $scope.usedWords.push($scope.word);
        
        // Pick a random word 這樣可能會挑到一樣的
        //$scope.word = words[Math.floor(Math.random()*words.length)];

        // Select a letter
        if($scope.mode == "any") {
            $scope.index = Math.floor(Math.random()*$scope.word.length);
            // Avoid picking up whitespace
            while ($scope.word[$scope.index] == ' '){
                $scope.index = Math.floor(Math.random()*$scope.word.length);
            }

            $scope.answer = $scope.word[$scope.index];
            choices = pickRandomChoices($scope.word, $scope.index);
            $scope.choices = choices;

        } else if ($scope.mode == "double") {

            const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
            if (countVowels($scope.word) == 1 && vowels.includes($scope.word[$scope.word.length-1])){
                $scope.index = Math.floor(Math.random()*($scope.word.length-1));
            }else{
                $scope.index = Math.floor(Math.random()*($scope.word.length-1));
                while ($scope.word[$scope.index] == ' ' || $scope.word[$scope.index+1] == ' ' || !vowels.includes($scope.word[$scope.index])){
                    $scope.index = Math.floor(Math.random()*($scope.word.length-1));
                }
            }

            $scope.answer = $scope.word.substr($scope.index, 2);
            console.log("[next] scope.answer: " + $scope.answer);
            choices = pickRandomDoubleChoices($scope.word, $scope.index);
            $scope.choices = choices;

        }

        console.log("[next] scope.answer: " + $scope.answer);

        $scope.resetclue();
        // Update clue and button text
        // $scope.clue = $scope.word.substr(0, $scope.index) + '_' + $scope.word.substr($scope.index + 1);

        $("#choice1").text(choices[0]);
        $("#choice2").text(choices[1]);
        $("#choice3").text(choices[2]);
        $("#choice4").text(choices[3]);
        $("#choice5").text(choices[4]);

        $scope.startTime = new Date();
    };

    $scope.resetclue = function() {
        $scope.timeout = 0;
        $scope.right_indicator = false;
        $scope.wrong_indicator = false;

        if ($scope.mode == "any"){
            $scope.clue = $scope.word.substr(0, $scope.index) + '_'
            + $scope.word.substr($scope.index + 1);
        }else if ($scope.mode == "double"){
            $scope.clue = $scope.word.substr(0, $scope.index) + '_ _'
            + $scope.word.substr($scope.index + 2);
        }

        speak($scope.word);
    };

    // $scope.keyup = function(e) {
    //     // If they already got it right, ignore input
    //     if($scope.right_indicator) {
    //         return;
    //     }

    //     console.log('keyup ' + e.keyCode);

    //     c = String.fromCharCode(e.keyCode);

    //     // Ignore key presses outside of A-Z
    //     if(c < 'A' || c > 'Z') {
    //         return;
    //     }

    //     console.log($scope.clue);

    //     if(c == $scope.letter.toLowerCase()) {
    //         $scope.correct();
    //     } else if(c == ' ') {
    //         $scope.next();
    //     } else {
    //         $scope.incorrect(c);
    //     }
    // };

    // We then use $scope.$apply to update the Angular scope with the new clue value. This ensures that the change is reflected in the HTML view.
    function checkAnswer(choice) {
        let endTime = new Date();
        let elapsedTime = (endTime - $scope.startTime) / 1000;
        if (elapsedTime > 8){
            $scope.usedWords = $scope.usedWords.filter(word => word !== $scope.word);
        }

        console.log(choice + " clicked");
        console.log("Answer: " + $scope.answer)
        if ($scope.mode == "any"){
            newClue = $scope.word.substr(0, $scope.index) + choice.toLowerCase() + $scope.word.substr($scope.index + 1);
        }else {
            newClue = $scope.word.substr(0, $scope.index) + choice.toLowerCase() + $scope.word.substr($scope.index + 2);
        }
        $scope.$apply(function () {
            $scope.clue = newClue;
        });

        if (choice === $scope.answer.toLowerCase()) {
            $scope.correct();
        } else {
            $scope.incorrect(choice);
        }
    }

    // Handle speaker button
    $('#speakButton').click(function () {
        console.log("speaker clicked");
        var msg = new SpeechSynthesisUtterance($scope.word);
        msg.rate = 0.5;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    });

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

        // $scope.number_right += 1;
        $scope.number_right = $scope.usedWords.length;

        $scope.$apply(function () {
            $scope.right_indicator = true;
            $scope.wrong_indicator = false;
        });

        // $scope.clue = $scope.word.substr(0, $scope.index) + $scope.letter
        // + $scope.word.substr($scope.index + 1);

        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.next, 1000);

        $('#jpId').jPlayer("play");
    };

    $scope.incorrect = function(c) {
        console.log("incorrect input: " + c);

        $scope.$apply(function () {
            $scope.right_indicator = false;
            $scope.wrong_indicator = true;
        });

        // $scope.clue = $scope.word.substr(0, $scope.index) + c.toLowerCase()
        // + $scope.word.substr($scope.index + 1);

        if($scope.timeout != 0) {
            $timeout.cancel($scope.timeout);
        }
        $scope.timeout = $timeout($scope.resetclue, 1000);

        speak($scope.clue + "?");

        $scope.usedWords = $scope.usedWords.filter(word => word !== $scope.word);
    };

    $scope.next();
}