// - [ ] Prompt the user
// - [ ] Fetch GitHub Data
// - [ ] Print GitHub Data
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const axios = require("axios");

const writeFile = util.promisify(fs.writeFile);

// ask user for github username
inquirer
  .prompt([
    {
      type: "input",
      name: "username",
      message: "What is your GitHub username?"
    }
  ])
  .then(answers => {
    const url = `https://api.github.com/users/${answers.username}`;

    // use axios to fetch GitHub user data
    return axios.get(url);
  })
  .then(response => {
    // get the avatur url
    const { avatar_url, login } = response.data;

    // render markdown with an image
    const markdown = `# Profile!

![${login} avatar](${avatar_url})
`
    // save markdown to file
    return writeFile("output/readme.md", markdown);
  })
  .then(() => {
    console.log("created readme")
  })
  .catch(error => {
    console.log("Could not create file.")
    process.exit(1);
  });
