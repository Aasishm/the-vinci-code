import "./styles.css";
/*
1. Get the user's name
2. Show a menu
3. Menu items:
  a. Start New Game
  b. See Leaderboard
  c. Update Name
*/
const myGameContainer = document.getElementById("game");
const $formElement = document.querySelector("form")
const $nameInputElement = $formElement.querySelector("input")

class Game {
  constructor(container) {
    this.container = container;
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  start() {
    $formElement.addEventListener('submit',(e) => {
      e.preventDefault()
      this.name = $nameInputElement.value
      console.log(this.name)
      $nameInputElement.value = ''
      $nameInputElement.focus()
      this.displayMenu()
    })
  }

  handleMenuClick = function (event) {
    switch (event.target.dataset?.val) {
      case "1":
        this.updateLevel(1);
        this.gameLoop();
        break;
      case "2":
        console.log("Will Show Leaderboard Now...");
        break;
      case "3":
        this.name = prompt("Enter name to be updated:") || "Guest";
        this.displayMenu();
    }
  }.bind(this);

  displayMenu() {
    this.container.innerHTML = `Welcome ${this.name},
    <ol>
      <div class='options-container'>
        <li>Start New Game</li>
        <button data-val="1">Start</button>
      </div>
      <div class='options-container'>
        <li>See Leaderboard</li>
        <button data-val="2">Leaderboard</button>
      </div>
      <div class='options-container'>
        <li>Update Name</li>
        <button data-val="3">Update</button>
      </div>
    </ol>`;
    this.container.removeEventListener("click", this.handleMenuClick);
    this.container.addEventListener("click", this.handleMenuClick);
  }

  updateLevel(level = 1) {
    this.generatedNumbers = [];
    this.enteredNumbers = [];
    this.level = level;
  }

  generateNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      this.generatedNumbers.push(this.randomNumber());
    }
  }

  displayNumbersForLevel(curLevel=0) {
    return new Promise((resolve) => {
      const handleLevels = () => {
        curLevel++
        $numberButton.remove()
        setTimeout(() => {
          if (curLevel < this.level){
            this.displayNumbersForLevel(curLevel).then(() => resolve())
          }
          else {
            resolve()
          }
        }, 0)
      }
      var numberElement = `<button id='button-${curLevel}'>${this.generatedNumbers[curLevel]}</button>`
      this.container.insertAdjacentHTML('afterend', numberElement)
      var $numberButton = document.getElementById('button-' + curLevel)
      $numberButton.addEventListener('click', () => {
        handleLevels()
      })
    })
  }

  getNumbersFromUser() {
    return new Promise((resolve) => {
      let enteredPromises = []
      let inputContainer = document.createElement('div')
      document.body.appendChild(inputContainer)
      for (let i = 0; i < this.level; i++) {
        let inputField = document.createElement('input')
        inputField.type = 'text'
        inputField.placeholder = 'Enter the value'
        inputContainer.appendChild(inputField)
        // let enteredValue = prompt(
        //   "Enter values in order one at a time: (press enter after every value)",
        // );
        // if (enteredValue === "" || enteredValue === null) {
        //   enteredValue = NaN;
        // }
        // this.enteredNumbers.push(Number(enteredValue));
        enteredPromises.push(new Promise((resolveInput) => {
          inputField.addEventListener('change', () => {
            let enteredValue = inputField.value.trim()
            this.enteredNumbers.push(Number(enteredValue))
            inputContainer.removeChild(inputField)
            // document.body.removeChild(inputContainer)
            resolveInput()
          })
        }))
      }
      Promise.all(enteredPromises).then(() => {
        // inputContainer.remove()
        document.body.removeChild(inputContainer)
        resolve()
      })
    })
  }

  verifyLevel() {
    for (let i = 0; i < this.level; i++) {
      if (this.enteredNumbers[i] !== this.generatedNumbers[i]) return false;
    }
    return true;
  }

  gameLoop() {
    this.generateNumbersForLevel();
    this.displayNumbersForLevel().then(() => {
      this.getNumbersFromUser().then(() => {
        if (this.verifyLevel()) {
          this.updateLevel(this.level + 1);
          this.gameLoop();
        } else {
          alert(`Your score is: ${this.level}`);
        }
      })
    });
  }
}

let myGameInstance = new Game(myGameContainer);
myGameInstance.start();