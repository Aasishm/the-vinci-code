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
      this.name = $nameInputElement.value || 'Guest'
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
        this.updateName().then(() => this.displayMenu()).then(() => {
          let $updateInputElement = document.getElementById('update-input')
          console.log($updateInputElement)
          $updateInputElement.remove()
        })
    }
  }.bind(this);

  displayMenu() {
    this.container.innerHTML = `${this.name}
    <ol>
      <div class='menu-container'>
        <div class='options-container'>
          <li>Start New Game</li>
          <button data-val="1" id='start-button'>Start</button>
        </div>
        <div class='options-container'>
          <li>See Leaderboard</li>
          <button data-val="2">Leaderboard</button>
        </div>
        <div class='options-container'>
          <li>Update Name</li>
          <button data-val="3" id='update-button'>Update</button>
        </div>
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

    let numberButton = document.getElementById('number-button')
    // console.log(numberButton)
    if (numberButton) {
      numberButton.remove()
    }

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
      $numberButton.id = 'number-button'
      $numberButton.addEventListener('click', () => {
        handleLevels()
      })
    })
  }

  updateName() {
    return new Promise((resolve) => {
      let updateNameInput = document.createElement('input')
      updateNameInput.placeholder = 'Enter New Name'
      updateNameInput.type = 'text'
      updateNameInput.id = 'update-input'
      document.body.appendChild(updateNameInput)
      updateNameInput.addEventListener('change', () => {
        this.name = updateNameInput.value || 'Guest'
        resolve()
      })
    })
  }

  getNumbersFromUser() {

    const inputContainer = document.createElement('div')
    document.body.appendChild(inputContainer)

    return new Promise((resolve) => {
      let enteredPromises = []

      const addInputField = (curLevel=0) => {
        let inputField = document.createElement('input')
        inputField.type = 'text'
        inputField.placeholder = 'Enter the value'
        inputContainer.appendChild(inputField)

        enteredPromises.push(new Promise((resolveInput) => {
          inputField.focus()
          inputField.addEventListener('change', () => {
            let enteredValue = inputField.value.trim()
            this.enteredNumbers.push(Number(enteredValue))
            inputContainer.removeChild(inputField)
            if (curLevel + 1 < this.level) {
              addInputField(curLevel + 1)
            }
            else{
              resolveInput()
              resolve()
              document.body.removeChild(inputContainer)
            }
          })
        }))

      }
      
      addInputField()

      Promise.all(enteredPromises).then(() => resolve())
    })
  }

  verifyLevel() {
    for (let i = 0; i < this.level; i++) {
      if (this.enteredNumbers[i] !== this.generatedNumbers[i]) return false;
    }
    return true;
  }

  showResult() {
    return new Promise((resolve) => {
      let result = document.createElement('button')
      result.textContent = `Your score is ${this.level}`
      document.body.appendChild(result)
      result.addEventListener('click', () => {
        document.body.removeChild(result)
        let startButton = document.getElementById('start-button')
        startButton.removeAttribute('disabled')
        let updateButton = document.getElementById('update-button')
        updateButton.removeAttribute('disabled')
        resolve()
      })

    })
  }

  gameLoop() {
    this.generateNumbersForLevel();
    this.displayNumbersForLevel().then(() => {
      this.getNumbersFromUser().then(() => {
        if (this.verifyLevel()) {
          this.updateLevel(this.level + 1);
          this.gameLoop();
        } else {
          this.showResult();
          let startButton = document.getElementById('start-button')
          let updateButton = document.getElementById('update-button')
          startButton.setAttribute('disabled', 'disabled')
          updateButton.setAttribute('disabled', 'disabled')
          // alert(`Your score is: ${this.level}`);
        }
      })
    });
  }
}

let myGameInstance = new Game(myGameContainer);
myGameInstance.start();