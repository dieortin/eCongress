/*
 * Copyright 2018 Diego Ortín Fernández
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to
 * do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// noinspection JSUnusedGlobalSymbols
/**
 * Removes the text in an input element if it hasn't been modified by the user (if it's still the default one)
 * @param input The input element to be cleared
 * @param value The default value of said input element
 */
function clearInput(input, value) {
	if (input.value === value) {
		input.value = '';
	}
}

// noinspection JSUnusedGlobalSymbols
/**
 * Sends a request to vote/remove the vote for the proposal with the provided ID
 * @param propId The ID of the proposal to vote/remove the vote for
 */
function voteToggle(propId) {
	function processResponse() {
		console.log(this)
		if (this.status === 200) {
			location.reload()
		}
	}

	const req = new XMLHttpRequest()
	req.addEventListener('load', processResponse)
	req.open('POST', '/voteToggle/' + propId)
	req.send()
}