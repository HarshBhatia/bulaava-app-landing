
//require penthouse package to generate critical css path
const Q = require("q");

//require penthouse package to generate critical css path
const penthouse = require("penthouse");

//require libraries
const path = require("path");
const fs = require("fs");
const __baseDir = "./";
const __baseOutput = path.resolve(__baseDir, "css/critical");
const __baseUrl = "http://bulaava.in/";

//default configuration for penthouse
var config = {
  css : path.resolve(__baseDir, "css/main.css"),
  strict: false,
  timeout: 30000,
};

//allow for lots of event listeners
process.setMaxListeners(0);

/**
 * The main function to execute
 *
 * @method main
 * @return {Promise} The promise object
 */
var main = function() {

  /**
   * Generate the critical css
   *
   * @method generateCriticalCss
   * @param url {string} The url to retrieve
   * @param output {string} The file path to output the css to
   * @return {Promise} The promise object
   */
  var generateCriticalCss = function(url, output) {
    //create promise
    var deferred = Q.defer();

    //configure url
    config.url = url;

    //execute penthouse request
    penthouse(config, function(error, criticalCss) {
      //check for an error
      if (error) {
        //log
        console.error(error);

        //reject promise
        return deferred.reject(new Error(error));
      }

      //log
      console.log("Critical path css saved to: %s.", output);

      //write critical css to output file
      fs.writeFileSync(output, criticalCss);

      //resolve promise
      deferred.resolve(1);
    });

    return deferred.promise;
  };

  //ensure the base output directory exists
  if (!fs.existsSync(__baseOutput)){
    fs.mkdirSync(__baseOutput);
    console.log("Creating output directory: %s", __baseOutput);
  }

  var output = path.resolve(__baseOutput, "index.css");
  return generateCriticalCss(__baseUrl, output);
};

//let's do it!
if (require.main === module) {
  //main();
  main().then(function() {
    process.exit(0);
  }).catch(function(error) {
    console.log(error);
    process.exit(1);
  });
}