const fs = require("fs")
const prompt = require("prompt-sync")()
const chalk = require("chalk")

Array.prototype.count = function(item){ 
	let appearance = 0;
	this.forEach(index=>{
		if (index === item)
			appearance++
	});
	return appearance;
}

class Wordle {

	constructor(){
		const data = fs.readFileSync(`./files/words.txt`, {encoding: "utf-8"})
		this.words = data.split("\r\n")
		this.word = this.words[Math.floor(Math.random() * this.words.length)]
		this.characters = this.word.split("")
		this.maxTries = 6
		this.tries = 0
		this.status = 0
		this.results = []
	}
	
	start(){
		console.log(chalk.green("Welcome to Wordle Cli!"))
		console.log(chalk.green("Type in 5 letter words and try to guess the secret word!"))
		console.log(chalk.yellow('Type "Q" at any point to quit the game'))
		while(this.tries < this.maxTries){
			const input = prompt(chalk.cyan("What word are you guessing? : ")).toLocaleLowerCase()
			//console.clear()

			if (input === "q") {this.status = 1; break;}
			if (input.length !== 5) {console.log(chalk.redBright("The word needs to be 5 letters long!")); continue;}
			//if (!this.words.includes(input)) {console.log(chalk.redBright("The word is not recognised!")); continue;}

			console.log(this.word)
			console.log(this.characters)
			const characters = input.split("")
			const matching = {}
			const repeating = []
			for(let i=0;i<input.length;i++){
				const currentChar = characters[i]
				if (currentChar === this.characters[i]){
					matching[i] = "green"; if(this.characters.count(currentChar) === 1) {
						repeating.push(currentChar)
					}
				}
				else if ((this.characters.includes(currentChar) && !repeating.includes(currentChar)) && this.characters.count(currentChar) !== 1) {
					matching[i] = "yellow"; repeating.push(currentChar)
				}
				else {
					matching[i] = "black"
				}
			}
			const keys = Object.keys(matching)
			let result = ""
			for(let i=0;i<keys.length;i++){
				const currentColor = matching[i]
				const currentChar = this.characters[i]
				switch(currentColor){
					case "green":
						result += chalk.bgGreen(currentChar)
						break;
					case "yellow":
						result += chalk.bgYellow(currentChar)
						break;
					case "black":
						result += chalk.bgBlack(currentChar)
						break;
				}
			}
			this.tries++
			if (this.word === input){
				this.status = 2
				break;
			}
		}
		switch (this.status){
			case 0:
				console.log(chalk.redBright())
				break;
			case 1:
				break;
			case 2:
				break;
		}
	}

}

const game = new Wordle()
game.start()
