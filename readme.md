# bower-dependency-tree

A command-line tool for displaying [Bower](http://bower.io/) dependency tree. 

> Circular dependencies are shown in red, version conflicts in yellow and packages "to be installed" in green.  

![sample output](https://cloud.githubusercontent.com/assets/370176/8443885/8f3a2512-1f3f-11e5-9889-6bc7b6094fb0.png)

## Installation

```sh
npm install -g bower-dependency-tree
```

## Usage

```
Usage: bower-dependency-tree <options> <endpoint>

Options:
  --log-level, -l  Log level (set it to "debug" for more verbose logs)  [default: "info"]
  --production     Skip devDependencies  [default: false]
  --grep           Hide branches of the tree not having a specific dependency
  --depth          Scanning depth (not limited by default)  [default: -1]
  --help, -h       

Examples:
  bower-dependency-tree                 # "expand" bower.json
  bower-dependency-tree composer#2.4.0  # print dependency tree of composer#2.4.0
```

## License

[MIT License](https://github.com/shyiko/bower-dependency-tree/blob/master/mit.license)

