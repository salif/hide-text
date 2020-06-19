#!/usr/bin/env node

"use strict"
const clipboardy = require('clipboardy')
const inv0 = String.fromCharCode(8203)
const inv1 = String.fromCharCode(8204)
const inv2 = String.fromCharCode(8205)
const args = {
     len: process.argv.length,
     cmd: process.argv[2],
     first: process.argv[3],
     second: process.argv[4]
}

if (args.len < 3) {
     printHelp()
     process.exit(0)
}

switch (args.cmd) {
     case "hide":
          expectArgs(2)
          const newPub = hideText(args.first, args.second)
          copyText(newPub)
          console.log(newPub)
          break
     case "unhide":
          const pub = (args < 4) ? pasteText() : args.first
          assertValid(pub)
          const sec = unhideText(pub)
          console.log(sec)
          break
     default:
          console.error("invalid command!")
          process.exit(1)
}

function hideText(pub, sec) {
     let result = ""
     for (let i = 0; i < sec.length; i++) {
          result += sec.charCodeAt(i).toString(2) + "2"
     }
     result = result
          .replace(/0/g, inv0)
          .replace(/1/g, inv1)
          .replace(/2/g, inv2)
     result = pub.charAt(0) + result + pub.substring(1)
     return result
}

function unhideText(pub) {
     let s = pub.substring(1, pub.lastIndexOf(inv2))
     s = s.split(inv2).join("2").split(inv0).join("0").split(inv1).join("1")
     s = s.split("2")
     let result = ""
     for (let i = 0; i < s.length; i++) {
          result += String.fromCharCode(parseInt(s[i], 2))
     }
     return result
}

function copyText(text) {
     clipboardy.writeSync(text)
}

function pasteText() {
     return clipboardy.readSync()
}

function expectArgs(n) {
     if (args.len < n + 3) {
          console.error("expected more arguments")
          process.exit(1)
     }
}

function assertValid(...a) {
     for (let i = 0; i < a.length; i++) {
          const e = a[i]
          if (e == undefined || e == null) {
               console.error("something went wrong!")
               process.exit(1)
          }
     }
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
`)
}
