const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean,
    });

    this.option('skip-exit-message', {
      desc: 'Skips the exit message',
      type: Boolean,
    });
  }

  initializing() {
    if (!this.options['skip-welcome-message']) {
      this._welcomeMessage();
    }

    this.props = {};
    // set pkg key equal to package.json
    this.props.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'title',
      message: 'Title:',
      default: this.props.pkg.name,
    }, {
      type: 'input',
      name: 'subtitle',
      message: 'Subtitle / catchphrase:',
      default: this.props.pkg.description,
    }, {
      type: 'editor',
      name: 'description',
      message: 'Description:',
      default:
`
# Please enter the description for your project. Note - lines starting
# with '#' will be ignored.`,
      filter: this._removeEditorComments,
    }, {
      type: 'editor',
      name: 'features',
      message: 'Features:',
      default:
`
# Please enter the features for your project, one feature per line.
# Note - lines starting with '#' will be ignored.`,
      filter: this._removeEditorComments,
    }, {
      type: 'editor',
      name: 'links',
      message: 'Relevant Links:',
      default:
`
# Please enter the links for your project, one 'link_name: url' combo
# per line. Note - lines starting with '#' will be ignored.`,
      filter: this._parseLinksList,
    },
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
    const exitMessage = `
You're all set! Your project's static site can be found at:
  ${chalk.bold(this.destinationRoot('docs'))}
    `;

    if (!this.options['skip-exit-message']) {
      this.log(exitMessage);
    }
  }

  _welcomeMessage() {
    const message =
`This generator probably isn\'t right for your needs.
But that\'s none of my business.`;
    this.log(yosay(message));
  }

  _removeEditorComments(answer) {
    return new Promise((resolve, reject) => {
      let actualLines = [];
      let tmpLinesArr = [];
      try {
        // split on newlines - .split('\n')
        tmpLinesArr = answer.split('\n');
        tmpLinesArr = tmpLinesArr.map((line) => line.trim());
        actualLines = 
          tmpLinesArr.filter((line) => { line && line.charAt(0) !== '#' });
        resolve(actualLines);
      } catch (err) {
        reject(err);
      }
    });
  }

  _parseFeaturesList(answer) {
    return new Promise((resolve, reject) => {
      let features = [];
      try {
        // Split features by newline, removing values that are "null"
        // refs: https://stackoverflow.com/a/2843625
        features = answer.split('\n').filter((val) => val);
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
        const linksArr = answer.split('\n').filter((val) => val); // ==> Array ["github: https://github.com", "npm: https://npmjs.com"]
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
