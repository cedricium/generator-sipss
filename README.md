# generator-sipps

> Yeoman generator for scaffolding a SIde-Project Static Site (sipss).

\<insert screenshot here>

## Installation

First you need install [yeoman](http://yeoman.io/).

```sh
npm install -g yo
```

Then install the sipss generator.

```sh
npm install -g yo generator-sipss
```

## Usage

Generate your project's site and follow the prompts.

```sh
$ yo sipss
```

Once finished, you're all set! 🎉

`sipss` scaffolds a static site for an existing project, one usually hosted on GitHub. It will create a `/docs` folder containing the site files and resources which then enables you to host your project's newly-created site by enabling GitHub pages from the `/docs` folder in the `master` branch.

For more information on how to setup GitHub pages using this method, [refer to GitHub's documentation](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch).

## License

[MIT License](LICENSE.md)