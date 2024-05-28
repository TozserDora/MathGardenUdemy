var answer;
var score = 0;
var background = [];

function nextQuestion() {
    const n1 = Math.ceil(Math.random() * 5);
    const n2 = Math.ceil(Math.random() * 4);
    document.getElementById('n1').innerHTML = n1   
    document.getElementById('n2').innerHTML = n2 
    answer = n1 + n2;
}

function checkAnswer() {
    const prediction = predictImage();
    // console.log(`Answer: ${answer}, Prediction: ${prediction}`)

    if (prediction == answer) {
        if (score < 7) {
            score ++;
            background.push(`url('images/background${score}.svg')`)
            document.body.style.backgroundImage = background;
        }
        else {
            alert("Congrats! You have a beautiful garden! You can play again!")
            score = 0;
            background = [];
            document.body.style.backgroundImage = background;
        }        
    }
    else {
        if (score > 0) {
            score --;
            alert("Nope!")
            setTimeout(function(){
                background.pop();
                document.body.style.backgroundImage = background;
            }, 1000);           
        }
    }
    // console.log(score);
}

