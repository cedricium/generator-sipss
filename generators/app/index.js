const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  initializing() {
    this._welcomeMessage();
    this.props = {};
    // set project key equal to package.json
    this.props.project = this._readPackageJSON(this.destinationPath('package.json'));
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'title',
      message: 'Title:',
      default: this.appname,
    }, {
      type: 'input',
      name: 'subtitle',
      message: 'Subtitle / catchphrase:',
      default: this.props.project.description,
    }, {
      type: 'editor',
      name: 'description',
      message: 'Description:',
    }, {
      type: 'editor',
      name: 'features',
      message: 'Features:',
      filter: this._parseFeaturesList,
    }, {
      type: 'editor',
      name: 'links',
      message: 'Relevant Links:',
      filter: this._parseLinksList
    }
  ]).then((answers) => {
    // assign answers to props object to be used later
    Object.keys(answers).forEach((val) => {
      this.props[val] = answers[val];
    });
  });
  }

  writing() {
    // copy template dir to dest dir swapping out templates with prompt answers
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath('docs'),
      this.props
    );
  }

  end() {
    this.log(`\nYou're all set! Your project's static site can be found at:
    ${this.destinationRoot('docs')}\n`);
  }

  _welcomeMessage() {
    this.log(yosay('This generator probably isn\'t right for your needs. But that\'s none of my business.'));
  }

  _readPackageJSON(file) {
    return this.fs.readJSON(file);
  }

  _parseFeaturesList(answer) {
    return new Promise((resolve, reject) => {
      let features = [];
      try {
        // Split features by newline, removing values that are "null"
        // refs: https://stackoverflow.com/a/2843625
        features = answer.split('\n').filter(val => val);
        resolve(features);
      } catch (err) {
        reject(err);
      }
    });
  }

  _parseLinksList(answer) {
    return new Promise((resolve, reject) => {
      let parsedLinks = [];
      try {
        const linksArr = answer.split('\n').filter(val => val); // ==> Array ["github: https://github.com", "npm: https://npmjs.com"]
        linksArr.forEach((link) => {
          let splitLink = link.split(': '); // ==> Array ["github", "https://github.com"]
          let linkObj = {name: splitLink[0], url: splitLink[1]}; // ==> Object { name: "github", url: "https://github.com" }
          parsedLinks.push(linkObj);
        });
        resolve(parsedLinks);
      } catch (err) {
        reject(err);
      }
    });
  }
};
