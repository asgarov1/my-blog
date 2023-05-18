# EsLint Custom Rules

---

## Prerequisites
 
Installed eslint -> If you don't have eslint installed, install it globally: 
`sudo npm install -g eslint`


## To turn on ESLint integration in Intellij
- go to Settings (`Ctrl + Alt + S`)
- Languages and Frameworks  -> Code Tools -> JavaScript -> Code Quality Tools -> ESlint -> Enable `Automatic ESlint configuration`
- create `.eslintrc.json` in Project root folder
- Paste following content to turn on eslint for typescript:
```json
{
  "root": true,
  "ignorePatterns": [
    "projects/*/"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.json",
          "e2e/tsconfig.json"
        ],
        "createDefaultProgram": true,
        "ecmaVersion": 6
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:@typescript-eslint/recommended"
      ],
      "rules": {
        "@angular-eslint/component-selector": [
          "error",
          {
            "prefix": "app",
            "style": "kebab-case",
            "type": "element"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "style": "camelCase",
            "type": "attribute"
          }
        ]
      }
    },
    {
      "files": [
        "*.js"
      ],
      "parserOptions": {
        "ecmaVersion": 6
      }
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "rules": {}
    }
  ]
}

```
- Install referenced plugins
```
npm install @angular-eslint/eslint-plugin@latest \
@angular-eslint/eslint-plugin-template@latest \
@angular-eslint/template-parser@latest --save-dev
```
- With any given file open, in the bottom panel navigate to "Problems"

## Creating custom rules in ESlint
- In the root directory of your project create a directory that starts with `eslint-plugin-`:
(e.g. `eslint-plugin-my-custom-plugin`)
- Inside of it create `index.js` file:
```javascript
module.exports = {
  rules: {
    'rule1': require('./rules/custom-rule.js').rule1,
  }
};
```
We are going to be creating this rule shortly.
- and `package.json` file:
```json
{
  "name": "eslint-plugin-my-custom-plugin",
  "version": "1.0.0",
  "main": "index.js"
}
```
- and directory `rules`
- inside of `rules` directory create a js file which will contain the logic for your custom rule 
e.g. `custom-rule.js`
- in this file you can create as many rule objects as you like, in the following fashion:
```javascript
exports.rule1 = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hard-coded credentials',
      category: 'Security',
      recommended: true,
      url: "https://sonarsource.atlassian.net/browse/RSPEC-2068",
    },
    fixable: 'code',
    schema: [],
    messages: {
      hardcodedCredentials: 'Hard-coded credentials are security-sensitive. See [RSPEC-2068](https://sonarsource.atlassian.net/browse/RSPEC-2068) for more information.',
    },
  },
  create: function (context) {
    const suspiciousVariables = ['password', 'secret', 'token', 'apiKey', 'api_key', 'accessKey', 'access_key'];

    function checkNode(node) {
      if (node.type === 'VariableDeclarator' && node.init && node.init.type === 'Literal') {
        const variableName = node.id.name.toLowerCase();
        const variableValue = node.init.value;

        if (suspiciousVariables.some(function (v) {
          return variableName.includes(v);
        }) && typeof variableValue === 'string') {
          context.report({
            node: node,
            messageId: 'hardcodedCredentials',
            fix: function (fixer) {
              return fixer.insertTextBefore(node.parent,
                `/* TODO: Remove hardcoded credentials and use a secure storage solution */\n`);
            }
          });
        }
      }
    }

    return {
      VariableDeclarator: checkNode,
    };
  },
};
```
-update .eslintrc.json to include custom rules, end result should look like this:
```json
{
  "root": true,
  "ignorePatterns": [
    "projects/*/"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.json",
          "e2e/tsconfig.json"
        ],
        "createDefaultProgram": true,
        "ecmaVersion": 6
      },
      "plugins": [
        "my-custom-plugin"
      ],
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:@typescript-eslint/recommended"
      ],
      "rules": {
        "@angular-eslint/component-selector": [
          "error",
          {
            "prefix": "app",
            "style": "kebab-case",
            "type": "element"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "style": "camelCase",
            "type": "attribute"
          }
        ],
        "my-custom-plugin/rule1": "error",
        "my-custom-plugin/rule2": "warn"
      }
    },
    {
      "files": [
        "*.js"
      ],
      "parserOptions": {
        "ecmaVersion": 6
      },
      "plugins": [
        "my-custom-plugin"
      ],
      "rules": {
        "my-custom-plugin/rule1": "error",
        "my-custom-plugin/rule2": "warn"
      }
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "rules": {}
    }
  ]
}
```
- Add custom-rule module as a dependency to your package.json by adding the following 2 
dependencies (make sure directory name matches how you called your plugin directory, in my example 
`eslint-plugin-my-custom-plugin`:
```json
    "eslint-plugin-my-custom-plugin": "file:eslint-plugin-my-custom-plugin",
    "esm": "^3.2.25"
```
- run `npm install`

Now just type declare some variable with the name of `password` and see the eslint plugin underline it as problem:

<img src="assets/images/eslint.png">
