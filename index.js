const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const axios = require("axios");

const writeFile = util.promisify(fs.writeFile);

main();

function main() {
  prompUser()
    .then(answers => fetchGithubUserData(answers.username))
    .then(user_data => {
      const markdown = renderReadmeMarkdown(user_data);
      return writeFile("output/readme.md", markdown);
    })
    .then(() => console.log("created readme"))
    .catch(error => {
      console.log(error)
      console.log("Could not create file.");
      process.exit(1);
    });
}

function prompUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "What is your GitHub username?"
    }
  ]);
}

function fetchGithubUserData(username) {
  const url = `https://api.github.com/users/${username}`;

  // use axios to fetch GitHub user data
  return axios.get(url).then(response => response.data);
}

function renderReadmeMarkdown(github_user) {
  const { avatar_url, login } = github_user; // use object destructuring

  // return markdown with an image
  return `# Profile!

![${login} avatar](${avatar_url})
`;
}
