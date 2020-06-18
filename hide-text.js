#!/usr/bin/env node

let clipboardy = require('clipboardy');
let inv0 = String.fromCharCode(8203)
let inv1 = String.fromCharCode(8204)
let inv2 = String.fromCharCode(8205)
let args = process.argv.length;

if (args < 3) {
     printHelp();
     process.exit(0);
}

console.log("under construction")
process.exit(1);

if (process.argv[2] === "enc") {
     if (args === 3) {
          console.log("need more arguments!");
          process.exit(1);
     }
     let input = process.argv[3];
     let output = "Hi";
     if (args > 4) {
          output = process.argv[4];
     }
     encrypt(input, output);
}
else if (process.argv[2] === "dec") {
     let input = "";
     if (args === 3) {
          input = clipboardy.readSync();
     }
     else {
          input = process.argv[3];
     }
     decrypt(input);
}
else {
     console.log("invalid command!");
     process.exit(1);
}

function encrypt(input, output) {
     let scr = "";
     for (let i = 0; i < input.length; i++) {
          scr += input.charCodeAt(i).toString(2) + "2";
     }
     scr = scr
          .replace(/0/g, inv0)
          .replace(/1/g, inv1)
          .replace(/2/g, inv2);
     output = output.charAt(0) + scr + output.substring(1);
     clipboardy.writeSync(output);
     console.log("input: " + input);
     console.log("output: " + output);
     console.log("length: " + output.length);
     console.log("Saved to clipboard!");
}

function decrypt(input) {
     let scr = input.substring(1, input.lastIndexOf(inv2));
     scr = scr.split(inv2).join("2").split(inv0).join("0").split(inv1).join("1");
     scr = scr.split("2");
     let output = "";
     for (let i = 0; i < scr.length; i++) {
          output += String.fromCharCode(parseInt(scr[i], 2));
     }
     console.log("input: " + input);
     console.log("output: " + output);
}

function printHelp() {
     console.log(`Usage:

     hide-text <command> <text> [text]

Commands:

     hide <public text> <secret text>

          Print and copy to the clipboard <public text>
          which contains insterted invisible <secret text>

     unhide

          Get <public text> from the clipboard and print the 
          secret text which is hidden in <public text>

     unhide <public text>

          Print the secret text which is hidden in <public text>

     contains <public text>

          Print "true" if <public text> contains hidden secret text,
          otherwise print "false" and exit with code 1

     match <public text> <secret text>

          Print "true" if <public text> contains hidden secret text
          and the hidden secret text is equal to <secret text>,
          otherwise print "false" and exit with code 1

     version

          Print the current version of this program

Examples:

     hide-text hide "You can't read this" "Hello World!"
     hide-text unhide "Hello World!"
     hide-text contains "Hello World!"
     hide-text match "Hello World!" "You can't read this"
     hide-text version
`);
}
