#!/usr/bin/env node

"use strict"

const c_inv0 = String.fromCharCode(8203)
const c_inv1 = String.fromCharCode(8204)
const c_inv2 = String.fromCharCode(8205)

function main() {
	const cmd = process.argv[2] || "help"
	const pkg = require("./package.json")

	switch (cmd) {
		case "hide":
			try {
				console.log(hide_text(process.argv[3] || "", process.argv[4] || ""))
			} catch (err) {
				console.error(err.toString())
				process.exit(1)
			}
			break
		case "unhide":
			try {
				console.log(unhide_text(process.argv[3] || ""))
			} catch (err) {
				console.error(err.toString())
				process.exit(1)
			}
			break
		case "info":
			console.log("Version:", pkg.version)
			console.log("Homepage:", pkg.homepage)
			break
		case "help":
			console.log("Commands: hide, unhide, info, help")
			break
		default:
			console.error("Unknown command:", process.argv[2])
			process.exit(1)
			break
	}
}

function hide_text(pub, sec) {
	if (pub.length < 2) {
		throw new Error("The public text length must be at least 2")
	}
	let result = ""
	for (let i = 0; i < sec.length; i++) {
		result += sec.charCodeAt(i).toString(2) + "2"
	}
	return pub.charAt(0) + result
		.replace(/0/g, c_inv0)
		.replace(/1/g, c_inv1)
		.replace(/2/g, c_inv2) + pub.substring(1)
}

function unhide_text(pub) {
	if (pub.length < 2) {
		throw new Error("The public text length must be at least 2")
	}
	let s = pub.substring(1, pub.lastIndexOf(c_inv2))
	s = s.split(c_inv2).join("2").split(c_inv0).join("0").split(c_inv1).join("1")
	s = s.split("2")
	let result = ""
	for (let i = 0; i < s.length; i++) {
		result += String.fromCharCode(parseInt(s[i], 2))
	}
	return result
}

if (typeof in_browser == "undefined") {
	main()
}
