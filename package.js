Package.describe({
  summary: "UX/UI framework from Twitter with less " + '\n add @import "bootstrap.less"; to your less file'
});

Package.on_use(function (api) {
  api.add_files('less/bootstrap.less', 'server');
  api.add_files('js/bootstrap.js', 'client');
  api.add_files('img/glyphicons-halflings.png', 'client');
  api.add_files('img/glyphicons-halflings-white.png', 'client');



});

var less = require('less');
var fs = require('fs');
var path = require('path');
var bootstrap = "";
Package.register_extension(
  "less", function (bundle, source_path, serve_path, where) {
    serve_path = serve_path + '.css';
    console.log(source_path);
    if(source_path.indexOf("bootstrap.less")>-1){
      bootstrap = String(fs.readFileSync(source_path));
      return;
    }
    var contents = String(fs.readFileSync(source_path));
  
 
    contents = contents.replace('@import "bootstrap.less";',bootstrap)
    try {
      
       var myRegexp = /@import "([\w'-/.]*)";/g;
        var match = myRegexp.exec(contents);
        while (match != null) {
            var pat = path.join(path.dirname(source_path),match[1]);
            contents = contents.replace(match[0], '@amport "' + pat +'";');
            match = myRegexp.exec(contents);
            //temp.push(pat);
        }
        contents = contents.replace(/@amport/g,'@import');
      less.render(contents.toString('utf8'), function (err, css) {
         console.log(css);
        // XXX why is this a callback? it's not async.
        if (err) {
          bundle.error(source_path + ": Less compiler error: " + err.message);
          return;
        }

        bundle.add_resource({
          type: "css",
          path: serve_path,
          data: new Buffer(css),
          where: where
        });
      });
    } catch (e) {
      // less.render() is supposed to report any errors via its
      // callback. But sometimes, it throws them instead. This is
      // probably a bug in less. Be prepared for either behavior.
      bundle.error(source_path + ": Less compiler error: " + e.message);
    }
  }
);


Package.on_test(function (api) {
  api.add_files('less/bootstrap.less', 'server');
  api.add_files(['tests/bootstrap_less_tests.less', 'tests/bootstrap_less_tests.js'], 'client');
});
