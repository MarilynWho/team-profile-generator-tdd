import { Manager } from "./lib/Manager.js";
import { Engineer } from "./lib/Engineer.js";
import { Intern } from "./lib/Intern.js";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

import render from "./src/page-template.js";

let flag = true;

const collectAnswers = [];

// const engineer1 = new Engineer("Vanya", "1", );
function start() {
    inquirer.prompt(questions["Manager"]).then(function (answers) {
      collectAnswers.push(answers);
    });
}

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

start();
