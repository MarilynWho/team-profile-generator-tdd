import { Manager } from "./lib/Manager.js";
import { Engineer } from "./lib/Engineer.js";
import { Intern } from "./lib/Intern.js";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import * as url from "url";
import { generate, Observable } from "rxjs";
import render from "./src/page-template.js";

let emitter;
let allAnswers = [];
let objectType;
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const prompts = new Observable(function (observer) {
  emitter = observer;
  // need to start with at least one question here
  addQuestions(questions["Manager"]);
  objectType = "Manager";
});
let allObjects = [];

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

inquirer.prompt(prompts).ui.process.subscribe(
  ({ answer }) => {
    if (answer == "Finish building the team") {
      generateObject(allAnswers);
      renderTheHTMLpage();
      emitter.complete();
    } else {
      allAnswers.push(answer);
      if (answer == "Engineer" || answer == "Intern") {
        generateObject(allAnswers);
        allAnswers = [];
        objectType = answer;
        addQuestions(questions[answer]);
      }
    }
  },
  (err) => {
    console.warn(err);
  },
  () => {
    console.log("Interactive session is complete. Good bye! 👋\n");
  }
);

function addQuestions(array) {
  array.forEach((question) => {
    emitter.next(question);
  });
  emitter.next(questions["AddTeamMember"][0]);
}

function generateObject(array) {
  if (objectType == "Manager") {
    allObjects.push(new Manager(...array));
  } else if (objectType == "Intern") {
    allObjects.push(new Intern(...array));
  } else {
    allObjects.push(new Engineer(...array));
  }
}

function renderTheHTMLpage() {
  const finalHTML = render(allObjects);
  console.log(finalHTML);
  writeFile(finalHTML);
}

function writeFile(contents) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdir(OUTPUT_DIR, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  fs.writeFile(outputPath, contents, (err) => {
    err ? console.log(err) : console.log("Generating new file!");
  });
}
