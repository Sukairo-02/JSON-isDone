const axios = require('axios')
const axiosRetry = require('axios-retry')

const routes = [
	'https://jsonbase.com/lambdajson_type1/793',
	'https://jsonbase.com/lambdajson_type1/955',
	'https://jsonbase.com/lambdajson_type1/231',
	'https://jsonbase.com/lambdajson_type1/931',
	'https://jsonbase.com/lambdajson_type1/93',
	'https://jsonbase.com/lambdajson_type2/342',
	'https://jsonbase.com/lambdajson_type2/770',
	'https://jsonbase.com/lambdajson_type2/491',
	'https://jsonbase.com/lambdajson_type2/281',
	'https://jsonbase.com/lambdajson_type2/718',
	'https://jsonbase.com/lambdajson_type3/310',
	'https://jsonbase.com/lambdajson_type3/806',
	'https://jsonbase.com/lambdajson_type3/469',
	'https://jsonbase.com/lambdajson_type3/258',
	'https://jsonbase.com/lambdajson_type3/516',
	'https://jsonbase.com/lambdajson_type4/79',
	'https://jsonbase.com/lambdajson_type4/706',
	'https://jsonbase.com/lambdajson_type4/521',
	'https://jsonbase.com/lambdajson_type4/350',
	'https://jsonbase.com/lambdajson_type4/64',
]

//Setup axios to retry requests on fail
axiosRetry(axios, {
	retries: 3,
	retryCondition: (error) => {
		return error && error.response && error.response.status !== 200
	},
})

//Recursively find object by it's key's name, should return object with key named ${keyName}
const findKey = (obj, keyName) => {
	if (typeof obj[keyName] !== 'undefined') {
		return obj
	}

	let nested = []
	for ([key, value] of Object.entries(obj)) {
		if (typeof value === 'object') {
			nested.push(value)
		}
	}

	for (let i = 0; i < nested.length; ++i) {
		let tmpRes = findKey(nested[i], keyName)
		if (tmpRes) {
			return tmpRes
		}
	}

	return null
}

const start = async () => {
	let promises = []
	for (let i = 0; i < routes.length; ++i) {
		promises.push(axios.get(routes[i]))
	}

	let results = []
	for (let i = 0; i < promises.length; ++i) {
		try {
			const tmp = await promises[i]
			results.push(tmp.data)
		} catch (er) {
			console.log(`Route ${er.config.url} has failed!`)
		}
	}

	let [trues, falses] = [0, 0]
	results.forEach((e) => {
		const key = findKey(e, 'isDone')

		trues += +key.isDone
		falses += +!key.isDone
	})

	console.log(`True: ${trues}\nFalse: ${falses}\n`)
}

start()
