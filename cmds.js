

const model = require('./model');
const {log, biglog, errorlog, colorize} = require('./out');

exports.helpCmd = rl => {
            log("Comandos:");
	    	log("h/help - Muestra esta ayuda.");
	    	log("list: mostrar los quizzes existentes.");
	    	log("show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
	    	log("add: añadir un nuevo quiz interactivamente.");
	    	log("delete <id> - Borrar el quiz indicado");
	    	log("edit <id> - Editar el quiz indicado.");
	    	log("test <id> - probar el quiz indicado");
	    	log("p/play - jugar a preguntar aleatoriamente todos los quizzes");
	    	log("credits: créditos");
	    	log("c/quit: salir del programa.");
	    rl.prompt();
};	

exports.quitCmd = rl => {
	rl.close(); 
};

exports.addCmd = rl => {
	
	rl.question(colorize('Introduzca una pregunta:', 'red'), question =>{
		rl.question(colorize('Introduzca la respuesta', 'red'), answer =>{
			model.add(question,answer);
			log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
		rl.prompt();
		});
	});

	
};

exports.listCmd = rl => {
	
	model.getAll().forEach((quiz, id) => {

		log(` [${ colorize(id, 'magenta') }]: ${quiz.question}`);

	});
	rl.prompt();
};

exports.showCmd = (rl,id) => {

	if(typeof id === "undefined") {
		errorlog(`falta el parámetro id. `);
	}
	else {
		try{
			const quiz = model.getByIndex(id);
			log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		}
		catch (error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.testCmd = (rl,id) => {
	
	if (typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
		rl.prompt();
	}
	else {
		try{
			const quiz = model.getByIndex(id);
			rl.question(colorize(`${quiz.question}? `, 'red'), answer =>{
				answer = answer.trim();
				answer = answer.toLowerCase();
				if(answer == quiz.answer){
					log(`Su respuesta es correcta`);
					biglog('Correcta', 'green');
					rl.prompt();
				}
				else {
					log(`Su respuesta es incorrecta`);
					biglog('Incorrecta', 'red');
					rl.prompt();
				};
			});	
		}
		catch(error){
			errorlog(error.message);
			rl.prompt();
		}	
	
				
	};

	rl.prompt(); 

};

exports.playCmd = rl => {


	
	let score = 0;
	
	let toBeResolved = [];
	
	model.getAll().forEach((quiz, id) => {
	toBeResolved.push(id);
	});
	
	const playOne = () => {
	if(toBeResolved.length===0){
		log('Ya no quedan más preguntas!','yellow'); 
		log('Fin del examen. Número de aciertos','yellow'); 
		biglog(score,'yellow');
		rl.prompt();
	}else{
		let idArray = Math.floor(toBeResolved.length*Math.random());
		let idQ = toBeResolved[idArray];
		
		toBeResolved.splice(idArray,1);
		
		let quizi = model.getByIndex(idQ);
		rl.question(` ${colorize(quizi.question, 'red')}${colorize('?','red')}`,answer => {
			if(quizi.answer.toLowerCase() === answer.toLowerCase().trim()){
				score++;
				log(`\n correcta - Llevas acertadas ${score} preguntas \n `, 'magenta');
				
				playOne();
			}else{
				log(` ${colorize('incorrecta - Fin del examen. Has acertado:', 'magenta')} `);
				biglog(score,'blue');
				rl.prompt();
			};

		});

	}
}

playOne();

};



exports.deleteCmd = (rl,id) => {
	
	if(typeof id === "undefined") {
		errorlog(`falta el parámetro id. `);
	}
	else {
		try{
			model.deleteByIndex(id);

		}
		catch (error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.editCmd = (rl,id) => {
	
	if (typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
		rl.prompt();
	}
	else {
		try{
			const quiz = model.getByIndex(id);
		
			 process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
					model.update(id, question, answer);
					log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por : ${question} ${colorize('=>', 'magenta')} ${answer}`);
					rl.prompt();
				});
			});
		}
		catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
};

exports.creditsCmd = rl => {
	log("Autor de la práctica");
    log("Jorge Fernández Macho")
    rl.prompt();
};