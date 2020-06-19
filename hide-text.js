#!/usr/bin/env node

"use strict"
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
          console.log(newPub)
          break
     case "unhide":
          expectArgs(1)
          const sec = unhideText(args.first)
          console.log(sec)
          break
     case "version":
          console.log(require("./package.json").version)
          break
     case "contains":
          expectArgs(1)
          console.log(containsText(args.first).toString())
          break
     case "match":
          expectArgs(2)
          console.log(matchText(args.first, args.second).toString())
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

function containsText(pub) {
     return pub.indexOf(inv0) > -1 || pub.indexOf(inv1) > -1 || pub.indexOf(inv2) > -1
}

function matchText(pub, sec) {
     if (!containsText(pub)) {
          return false
     }
     return sec === unhideText(pub)
}

function expectArgs(n) {
     if (args.len < n + 3) {
          console.error("expected more arguments")
          process.exit(1)
     }
}

function printHelp() {
     console.log(`Usage:

     hide-text <command> <text> [text]

Commands:

     hide <public text> <secret text>

          Print <public text> which contains insterted
          invisible <secret text>

     unhide <public text>

          Print the secret text which is hidden in <public text>

     contains <public text>

          Print "true" if <public text> contains invisible secret text,
          otherwise print "false" and exit with status code 1

     match <public text> <secret text>

          Print "true" if <public text> contains invisible secret text
          and the invisible secret text is equal to <secret text>,
          otherwise print "false" and exit with status code 1

     version

          Print the current version of this program

Examples:

     hide-text hide "Hello World!" "You can't read this"
     hide-text unhide "H‌​‌‌​​‌‍‌‌​‌‌‌‌‍‌‌‌​‌​‌‍‌​​​​​‍‌‌​​​‌‌‍‌‌​​​​‌‍‌‌​‌‌‌​‍‌​​‌‌‌‍‌‌‌​‌​​‍‌​​​​​‍‌‌‌​​‌​‍‌‌​​‌​‌‍‌‌​​​​‌‍‌‌​​‌​​‍‌​​​​​‍‌‌‌​‌​​‍‌‌​‌​​​‍‌‌​‌​​‌‍‌‌‌​​‌‌‍ello World!"
     hide-text contains "H‌​‌‌​​‌‍‌‌​‌‌‌‌‍‌‌‌​‌​‌‍‌​​​​​‍‌‌​​​‌‌‍‌‌​​​​‌‍‌‌​‌‌‌​‍‌​​‌‌‌‍‌‌‌​‌​​‍‌​​​​​‍‌‌‌​​‌​‍‌‌​​‌​‌‍‌‌​​​​‌‍‌‌​​‌​​‍‌​​​​​‍‌‌‌​‌​​‍‌‌​‌​​​‍‌‌​‌​​‌‍‌‌‌​​‌‌‍ello World!"
     hide-text match "H‌​‌‌​​‌‍‌‌​‌‌‌‌‍‌‌‌​‌​‌‍‌​​​​​‍‌‌​​​‌‌‍‌‌​​​​‌‍‌‌​‌‌‌​‍‌​​‌‌‌‍‌‌‌​‌​​‍‌​​​​​‍‌‌‌​​‌​‍‌‌​​‌​‌‍‌‌​​​​‌‍‌‌​​‌​​‍‌​​​​​‍‌‌‌​‌​​‍‌‌​‌​​​‍‌‌​‌​​‌‍‌‌‌​​‌‌‍ello World!" "You can't read this"
     hide-text version
`)
}
