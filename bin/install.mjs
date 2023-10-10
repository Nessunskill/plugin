#!/usr/bin/env node
import { promisify } from "util";
import cp from "child_process";
const inquirer = require('inquirer');
import path from "path";
import fs, { existsSync, mkdirSync } from "fs";
// cli spinners
import ora from "ora";

// convert libs to promises
const exec = promisify(cp.exec);
const rm = promisify(fs.rm);

if (process.argv.length < 3) {
    console.log("You have to provide a name to your plugin.");
    console.log("For example :");
    console.log("    npx @brizy/plugin my-plugin");
    process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
// TODO: change to your boilerplate repo
const git_repo = "https://github.com/Nessunskill/plugin.git";

// create project directory
if (fs.existsSync(projectPath)) {
    console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
    process.exit(1);
}
else {
    fs.mkdirSync(projectPath);
}

try {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'language',
                message: 'Выберите язык для вашего проекта:',
                choices: ['JavaScript', 'TypeScript'],
            },
            // Другие вопросы и опции, которые вас интересуют
        ])
        .then((answers) => {
            // Обработка ответов пользователя
            const { language } = answers;
            console.log(`Вы выбрали язык: ${language}`);

            // Здесь можно выполнить настройку проекта на основе ответов пользователя,
            // например, скопировать соответствующий шаблон проекта

            // После этого можно выполнить команду для инициализации проекта

            console.log(`Стандартный вывод: ${stdout}`);
            console.error(`Ошибка вывода: ${stderr}`);
        });

    const gitSpinner = ora("Downloading files...").start();
    // clone the repo into the project folder -> creates the new boilerplate
    await exec(`git clone --depth 1 ${git_repo} ${projectPath} --quiet`);
    gitSpinner.succeed();

    // remove my git history
    const rmGit = rm(path.join(projectPath, ".git"), { recursive: true, force: true });
    // remove the installation file
    const rmBin = rm(path.join(projectPath, "bin"), { recursive: true, force: true });
    await Promise.all([rmGit, rmBin]);

    process.chdir(projectPath);
    // remove the packages needed for cli
    await exec("npm uninstall ora cli-spinners");

    const npmSpinner = ora("Installing dependencies...").start();
    await exec("npm install");
    npmSpinner.succeed();

    console.log("The installation is done!");
    console.log("You can now run your plugin with:");
    console.log(`    npm run dev`);

} catch (error) {
    // clean up in case of error, so the user does not have to do it manually
    fs.rmSync(projectPath, { recursive: true, force: true });
    console.log(error);
}
