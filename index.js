/* Importing all the necessary modules */
import { Manager } from "./lib/Manager.js";
import { Engineer } from "./lib/Engineer.js";
import { Intern } from "./lib/Intern.js";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import * as url from "url";
import { generate, Observable } from "rxjs";
import render from "./src/page-template.js";

/* Initialising all global variables */
// emitter to add questions into it dinamically
let emitter;
// storage for all the answers and all the end objects
let allAnswers = [];
let allObjects = [];
// storage for the type of Object we are collecting data at the moment
let objectType;
// get url for work directory
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// add output folder
const OUTPUT_DIR = path.resolve(__dirname, "output");
// final path for our output file
const outputPath = path.join(OUTPUT_DIR, "team.html");
// create Observable variable which will observe and trigger action
// when we will add to emitter
const prompts = new Observable(function (observer) {
  emitter = observer;
  // need to start with at least one question here
  addQuestions(questions["Manager"]);
  objectType = "Manager";
});

// all the questions for our program
const questions = {
  Manager: [
    {
      type: "input",
      message: "Enter team manager's name",
      name: "name",
    },
    {
      type: "input",
      message: "Enter team manager's ID",
      name: "id",
    },
    {
      type: "input",
      message: "Enter team manager's email",
      name: "email",
    },
    {
      type: "input",
      message: "Enter team manager's Office number",
      name: "officeNumber",
    },
  ],
  Engineer: [
    {
      type: "input",
      message: "Enter Engineer's name",
      name: "name",
    },
    {
      type: "input",
      message: "Enter Engineer's ID",
      name: "id",
    },
    {
      type: "input",
      message: "Enter Engineer's email",
      name: "email",
    },
    {
      type: "input",
      message: "Enter Engineer's Github username",
      name: "gitHub",
    },
  ],
  Intern: [
    {
      type: "input",
      message: "Enter intern's name",
      name: "name",
    },
    {
      type: "input",
      message: "Enter intern's ID",
      name: "id",
    },
    {
      type: "input",
      message: "Enter intern's email",
      name: "email",
    },
    {
      type: "input",
      message: "Enter intern's school",
      name: "school",
    },
  ],
  AddTeamMember: [
    {
      type: "list",
      message: "Add an:",
      name: "nextMember",
      choices: ["Engineer", "Intern", "Finish building the team"],
    },
  ],
};

// create inquirer prompt and give it questions, we will add
// questions to it dinamically, we are subscribed for updates from Observable
inquirer.prompt(prompts).ui.process.subscribe(
  ({ answer }) => {
    // if user chooses to end program, we create last object
    if (answer == "Finish building the team") {
      generateObject(allAnswers);
      // and render the page
      renderTheHTMLpage();
      // then we end prompt
      emitter.complete();
    } else {
      // add answer to the array of answers
      allAnswers.push(answer);
      // if we user chooses Engineer or Intern
      // then all questions for previous member of the team are answered
      if (answer == "Engineer" || answer == "Intern") {
        // so we can generate object from them
        generateObject(allAnswers);
        // and clear answers for the next member
        allAnswers = [];
        // set object type for the next member of the tem
        // to keep track which object we need to create
        objectType = answer;
        // add questions to the prompts object
        addQuestions(questions[answer]);
      }
    }
  },
  // here we discribe how to handle errors
  (err) => {
    console.warn(err);
  },
  // here is how to end prompt, when we reach end of questions object
  () => {
    console.log("Interactive session is complete. Good bye! 👋\n");
  }
);

// to add questions we get an array of all the questions for one member of team object
function addQuestions(array) {
  // for each question we add it to emitter, one by one
  array.forEach((question) => {
    emitter.next(question);
  });
  // then add question if user wants to add another team member
  emitter.next(questions["AddTeamMember"][0]);
}

// generates objects depending on which type of object we want to create
// adds it to the array of all our objects
function generateObject(array) {
  if (objectType == "Manager") {
    allObjects.push(new Manager(...array));
  } else if (objectType == "Intern") {
    allObjects.push(new Intern(...array));
  } else {
    allObjects.push(new Engineer(...array));
  }
}

// renders HTML with pattern described in page-template.js
function renderTheHTMLpage() {
  const finalHTML = render(allObjects);
  // lets write the result into a file
  writeFile(finalHTML);
}

// deals with writing into the file
function writeFile(contents) {
  // if output directory does not exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    // create directory
    fs.mkdir(OUTPUT_DIR, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  // write file into directory
  fs.writeFile(outputPath, contents, (err) => {
    err ? console.log(err) : console.log("Generating new file!");
  });
}
