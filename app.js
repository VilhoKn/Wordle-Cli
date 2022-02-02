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
		this.words = data.split("\n")
		this.word = this.words[Math.floor(Math.random() * this.words.length)]
		this.maxTries = 6
		this.tries = 0
		this.status = 0
		this.results = []
	}

	get characters(){
		return this.word.split("")
	}

	
	start(){
		console.clear()
		console.log(this.word)
		console.log(chalk.green("Welcome to Wordle Cli!"))
		console.log(chalk.green("Type in 5 letter words and try to guess the secret word!"))
		console.log(chalk.yellow('Type "Q" at any point to quit the game'))
		while(this.tries < this.maxTries){
			const input = prompt(chalk.cyan("What word are you guessing? : ")).toLocaleLowerCase()
			console.clear()
			console.log(this.word)

			if (input === "q") {this.status = 1; break;}
			if (input.length !== 5) {console.log(chalk.redBright("The word needs to be 5 letters long!")); continue;}
			if (!this.words.includes(input)) {console.log(chalk.redBright("The word is not recognised!")); continue;}

			const characters = input.split("")
			const matching = {}
			const repeating = {}
			for(let i=0;i<input.length;i++){repeating[characters[i]] = 0;}
			for(let i=0;i<input.length;i++){
				const currentChar = characters[i]
				if (currentChar === this.characters[i]){
					matching[i] = "green"
					repeating[currentChar] ++
				}
			}
			for(let i=0;i<input.length;i++){
				const currentChar = characters[i]
				if(this.characters.includes(currentChar) && repeating[currentChar] <= characters.count(currentChar)){
					if(!Object.keys(matching).includes(i.toString())){
						matching[i] = "yellow"
						repeating[currentChar] ++
					}
				}
			}
			for(let i=0;i<input.length;i++){
				const currentChar = characters[i]
				if(!Object.keys(matching).includes(i.toString())){
					matching[i] = "black"
				}
			}
			const keys = Object.keys(matching)
			let result = ""
			for(let i=0;i<keys.length;i++){
				const currentColor = matching[i]
				const currentChar = characters[i].toUpperCase()
				const charString = " " + currentChar + " "
				switch(currentColor){
					case "green":
						result += ` ${chalk.bgGreen(charString)} `
						break;
					case "yellow":
						result += ` ${chalk.bgYellow(charString)} `
						break;
					case "black":
						result += ` ${chalk.bgBlack(charString)} `
						break;
				}
			}
			this.results.push(result)
			const resultString = this.results.join("\n")
			console.log(resultString)
			this.tries++
			if (this.word === input){
				this.status = 2
				break;
			}
		}
		console.clear()
		let triesValue = this.tries
		switch (this.status){
			case 0:
				console.log(chalk.redBright(`You lost! The word was ${this.word}!`))
				break;
			case 1:
				console.log(chalk.green("Bye Bye!"))
				break;
			case 2:
				switch(this.tries){
					case 1:
						triesValue += "st"
						break;
					case 2:
						triesValue += "nd"
						break;
					case 3:
						triesValue += "rd"
						break;
					default:
						triesValue += "th"
						break;
				}
				const resultString = this.results.join("\n")
				console.log(resultString)
				console.log(chalk.green(`You won! The word was ${this.word}! You got the word on your ${triesValue} try!`))
				break;
		}
	}

}

const game = new Wordle()
game.start()
