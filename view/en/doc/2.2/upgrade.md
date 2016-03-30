## Upgrade Guide

This documentation is a guide about how to update ThinkJS from 2.1 to 2.2, look at [here](/doc/2.1/upgrade.html) if you want to update from 2.0 to 2.1.

The version 2.2 is compatible with version 2.01. The new version has appended more functions and changed something lightly, you can reference it's [ChangeLog](/changelog.html) to know what has changed.

### Update ThinkJS Dependency Versions

Change Thinkjs's version to 2.2.x in package.json.

### Add new dependency

Run `npm install source-map-support --save` to install dependency in the project folder.

If it's typescript project, it needs run `npm install source-map --save`.

### Modify compile script

If your project is ES2015+ (not TypeScript), modify `compile` command as following in `package.json`:

```
babel --presets es2015-loose,stage-1 --plugins transform-runtime src/ --out-dir app/ --source-maps
```

### Delete `app/` folder

delete `app/` folder in the project and run `npm start` to restart project.
