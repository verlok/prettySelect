# PrettySelect

A beautifier which makes select elements pretty, without jQuery.

This is a porting to ES6 and no-jQuery from [jQuery PrettySelect](https://github.com/kajyr/jquery-prettyselect), which uses CoffeeScript and jQuery.

## Usage
```javascript
$('select').prettyselect();
```

The select element is still present and hidden ( and works as the Model for the Html View), hence can be used to bind events or listen changes.

## Options

### onlyValuedOptions

_(default: false)_

It is possible to avoid selecting ```<option>``` elements that don't have the value attribute 

```javascript
var myPs = new PrettySelect({
	onlyValuedOptions: true
});
```

### Class Names

It is possible to change the basic class names used by the plugin.

```javascript
var myPs = new PrettySelect({
	wrapClass: 'prettyselect-wrap',
	labelClass: 'prettyselect-label',
	dropClass: 'prettyselect-drop'
});
```

### Placeholder

It is possible to specify one of the ```<option>``` elements as the ```placeholder```, with the data-placeholder attribute. This element would not be selectable and will disappear after the user makes the first selection

```html
<select name="" id="">
	<option value="1" data-placeholder>a</option>
	<option value="2">b</option>
	<option value="3">c</option>
</select>
```

### Disabling

After instantiation, it is possible to disable the select with the 'disable' command. The clicks on this element shoud not trigger changes

```javascript
var myPs = new PrettySelect();
myPs.disable();
```

To undo disabling, there's the enable command

```javascript
var myPs = new PrettySelect();
myPs.enable();
```