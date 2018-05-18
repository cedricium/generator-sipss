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
      message: 'Project title:',
      default: this.appname,
    }, {
      type: 'input',
      name: 'subtitle',
      message: 'Project subtitle:',
      default: this.props.project.description,
    }, {
      type: 'editor',
      name: 'description',
      message: 'Project description:',
      default: 'amo-cli lets you easily browse and search for Mozilla add-ons (such as extensions, themes, etc.) right from your terminal.'
    }, {
      type: 'editor',
      name: 'features',
      message: 'Project features:',
      default: `cool #1\ncool #2\ncool #3`,
      filter: this._parseFeaturesList,
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
      this.destinationPath('docs/index.html'),
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
};
