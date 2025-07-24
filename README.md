# Digital Enabler Project template

![REPO-TYPE](https://img.shields.io/badge/repo--type-template-blue?style=for-the-badge&logo=github)

This repository is a **template** intended to be used to create new repositories belonging to the [Digital Enabler](https://digitalenabler.eng.it) ecosystem platform.

## Getting Started

This repo has the following structure:

```
+--- .circleci
|     +--- config.yml
|     +--- policy.json
+--- .editorconfig
+--- .gitignore
+--- CONTRIBUTING.md
+--- docker
|     +--- docker-compose.yml
|     +--- Dockerfile
+--- README.md
+--- src
```

The **READMETEMPLATE** is a template for writing the README of the application. It contains several section that the developer should fill-in and populate accordingly to the project specific characteristics.

The **README** is this file and, once the new project is created, it must be replaced with the actual README of your application (written starting from the upmentioned READMETEMPLATE).

The **CONTRIBUTING** is a file describing the contribution guideline athat all the contributors to the DigitalEnabler project must adhere.

The **.gitignore** is a default gitignore that covers the 90% of the standard IDE and languages. Of course, once the new project is created, it can be changed accordingly to the project specific needs.

The **.editorconfig** is the file that contains all the code base style guidelines (indentation depth, parentesis positioning, etc..) the code bases must adhere to. It is, for now, more focused on JAVA language.

The **src** folder is intended for the actual source-code of the application you will write. In this template it's (obviously) empty.

The **docker** folder contains empty *Dockerfile* and an empty *docker-compose.yml* file. They must be fulfilled accordingly to project specific characteristics.
The Dockerfile will be used for automatically building the distributable docker image. The docker-compose is, instead, intended only for local development purposes.

The **.circleci** folder contains three files:
- config.yaml
- settings.xml
- sonar.sh

Normally the devops developer has only to change the config.yaml accordingly to the **CirceCI** pipeline he wants to implement.

### Usage

To use this template you have only to click on the **Use this template** green button.

You will have only to:

- Choose the *Repository name* you prefer
- Optionally write a small description
- Choose if the new repository will be public or private

**Important note:** Remember to **NOT** include all branches.

## Authors

* **Antonino Sirchia** - *Initial work* - [sirnino](https://github.com/sirnino)

See also the list of [contributors](contributors) who participated in this project.
