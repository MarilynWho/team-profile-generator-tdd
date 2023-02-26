import { Manager } from "./lib/Manager.js";
import { Engineer } from "./lib/Engineer.js";
import { Intern } from "./lib/Intern.js";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import * as url from "url";
import Rx from "rx";
import { Observable } from "rxjs";
let emitter;

const prompts = new Observable(function (observer) {
  emitter = observer;
  // need to start with at least one question here
  addQuestions(questions["Manager"]);
});

function addQuestions(array) {
  array.forEach((question) => {
    emitter.next(question);
  });
  emitter.next(questions["AddTeamMember"][0]);
}

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

import render from "./src/page-template.js";

const collectAnswers = [];

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
    console.log(answer);
    if (answer !== "Finish building the team") {
      if (answer == "Engineer" || answer == "Intern") {
        addQuestions(questions[answer]);
      }
    } else {
      emitter.complete();
    }
  },
  (err) => {
    console.warn(err);
  },
  () => {
    console.log("Interactive session is complete. Good bye! 👋\n");
  }
);

function start() {}

start();
