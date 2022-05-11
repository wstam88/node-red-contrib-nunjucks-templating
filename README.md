# node-red-contrib-nunjucks-templating
A rich and powerful templating language for JavaScript right in Node-RED. 
For all of the Nunjucks template features checkout the **[official Nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html)**

## Options
You can define any valid **[Nunjucks options](https://mozilla.github.io/nunjucks/api.html#configure)** in the Node-RED settings.js file.
`nunjucks.options`


## Loading templates
Templates can be defined with the **Nunjucks template** nodes or be loaded from the file system using preconfigured folders for lookup. Loading is done automaticly in the following order: 
1. Defined templates as nodes within the project that matches the name
2. Looking for files in one of the configures folders

This means you don't have to worry about where the template is defined while including it in your templates.

## Template inheritance
`extends` is used to specify template inheritance. The specified template is used as a base template.
See [Template Inheritance](https://mozilla.github.io/nunjucks/templating.html#extends).
![](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/base_template.png)
![Macro usage](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/macro_usage.png)

## Custom filters
You can register filters using the global function ```nj.addFilter```
```global.get('nj.addFilter')('foo', val => return `Foo: ${val}`)```

Now you can use it in all of your templates like: ```{{ 'bar' | foo }}```

Which will output: ```Foo: bar```

## Global context
You can add global variables in multiple ways:
1. Add a section to settings.js like this:
```
...
nunjucks: {
    global: {
        foo: 'bar',
        app: {
            name: 'My Awesome App'
        }
    }
}
...
```
Now you can access it anywhere like so: `{{ app.name }} and {{ foo }}`.

2. Add it within a function node: `global.get('nj.addGlobal')('myVar', 'Some value')`
Access it anywhere in any template or macro: `{{ myVar }}` 

## Macros
"`macro` allows you to define reusable chunks of content. It is similar to a function in a programming language."

Simple place your macros in a Nunjucks template node. The macros can be imported simply by there name. You can have one or more macros in one or more Nunjuck template nodes.

### Defining macros
![Macro definitions](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/macro_definition.png)
 
### Using macros
![Macro usage](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/macro_usage.png)


## Other global functions
* global.get("nj.addFilter");
* global.get("nj.getFilter");
* global.get("nj.addExtension");
* global.get("nj.getExtension");
* global.get("nj.hasExtension");
* global.get("nj.removeExtension");
* global.get("nj.getTemplate");
* global.get("nj.addGlobal");
* global.get("nj.getGlobal");
* global.get("nj.renderString");
