#!/usr/bin/env node

"use strict"

const c_inv0 = String.fromCharCode(8203)
const c_inv1 = String.fromCharCode(8204)
const c_inv2 = String.fromCharCode(8205)

switch (process.argv[2]) {
	case "hide":
		console.log(hide_text(process.argv[3], process.argv[4]))
		break
	case "unhide":
		console.log(unhide_text(process.argv[3]))
		break
	case "version":
		console.log(require("./package.json").version)
		break
}

function hide_text(pub, sec) {
	let result = ""
	for (let i = 0; i < sec.length; i++) {
		result += sec.charCodeAt(i).toString(2) + "2"
	}
	result = result
		.replace(/0/g, c_inv0)
		.replace(/1/g, c_inv1)
		.replace(/2/g, c_inv2)
	result = pub.charAt(0) + result + pub.substring(1)
	return result
}

function unhide_text(pub) {
	let s = pub.substring(1, pub.lastIndexOf(c_inv2))
	s = s.split(c_inv2).join("2").split(c_inv0).join("0").split(c_inv1).join("1")
	s = s.split("2")
	let result = ""
	for (let i = 0; i < s.length; i++) {
		result += String.fromCharCode(parseInt(s[i], 2))
	}
	return result
}
