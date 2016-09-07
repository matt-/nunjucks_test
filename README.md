# nunjucks XSS test example
This is a POC for an xss from the nunjucks template engine. 

##POC;
1.  git clone https://github.com/matt-/nunjucks_test
1.  npm install
1.  npm start
1.  visit: `http://127.0.0.1:3000/?name[]=<s>matt</s>`

Name in the template shold be escaped but because we force the item into an array encoding is skipped.

##Details;

This applicaiton is running with a nunjucks as the view template and *autoescape* enabled.
```javascript
var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
```

This means all template vars should be auto escaped so in the following example username will be escaped. 

```javascript
app.get('/', function(req, res) {
    res.render('index.html', { username: req.query.name });
});
```

```
<!-- index.html -->
Hello, {{ username | default('bob') }}!
```

Express uses "qs" to parse query paramaters. That means express supports parsing arrays using a [] notation:
`http://127.0.0.1:3000/?name[]=<s>matt</s>`

This results in: 
`req.query.name = ['<s>matt'];`

Note: You would get the same result from body-parser (or simply parsing a user param from json)

However in https://github.com/mozilla/nunjucks/blob/master/src/runtime.js#L209 nunjucks does an explicit check for a string. 

```javascript
function suppressValue(val, autoescape) {
    val = (val !== undefined && val !== null) ? val : '';

    if(autoescape && typeof val === 'string') {
        val = lib.escape(val);
    }

    return val;
}
```

Because we forces the name param to be an array nunjucks skips ptoperly encoding this value.  
