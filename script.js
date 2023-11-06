/**
 * The function fetches cryptocurrency data from a specified API endpoint and returns the result.
 * @returns the result, which is the data retrieved from the API endpoint.
 */
async function fetchCryptoData() {
	try {
		const response = await fetch(
			"http://localhost:3000/api/v1/cryptocurrencies"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		const result = data.data.cryptocurrencies;
		console.log(result);
		return result;
	} catch (error) {
		console.error("Error fetching cryptocurrency data:", error);
	}
}

/**
 * The function fetches user data from a specified API endpoint and returns the result.
 * @returns the result, which is an array of user data.
 */
async function fetchUesrData() {
	try {
		const response = await fetch("http://localhost:3000/api/v1/users");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		const result = data.data.users;
		console.log(result);
		return result;
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}

/**
 * The function fetchWallet is an asynchronous function that fetches wallet data from a specified API
 * endpoint and returns the result.
 * @returns the result of the fetch request, which is an array of wallet objects.
 */
async function fetchWallet() {
	try {
		const response = await fetch("http://localhost:3000/api/v1/wallets");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		const result = data.data.wallets;
		// console.log(result)
		return result;
	} catch (error) {
		console.error("Error fetching wallet data:", error);
	}
}

/**
 * The function fetchOneWallet fetches wallet data from a specified API endpoint and returns the
 * result.
 * @param id - The `id` parameter is the unique identifier of the wallet that you want to fetch. It is
 * used to construct the URL for the API request.
 * @returns the result of the fetch request, which is the data retrieved from the API endpoint.
 */
async function fetchOneWallet(id) {
	try {
		const response = await fetch(`http://localhost:3000/api/v1/wallets/${id}`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		const result = data.data;
		console.log(result);
		return result;
	} catch (error) {
		console.error("Error fetching wallet data:", error);
	}
}

/**
 * The function fetches wallet cryptocurrency data from a specified API endpoint and returns the
 * result.
 * @returns the result of the wallet cryptocurrency data fetched from the API.
 */
async function fetchWalletCrypto() {
	try {
		const response = await fetch(
			"http://localhost:3000/api/v1/wallet_cryptocurrency"
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		const result = data.data.walletCryptocurrency;
		return result;
	} catch (error) {
		console.error("Error fetching wallet cryptocurrency data:", error);
	}
}

/**
 * The function `renderCryptoList` takes in a list of cryptocurrencies and dynamically renders them as
 * HTML elements with their name, symbol, price, and buttons for buying, selling, and exchanging.
 * @param cryptoList - An array of objects representing cryptocurrencies. Each object should have the
 * following properties:
 */
async function renderCryptoList(cryptoList) {
	const user = await fetchUesrData().catch((error) => console.error(error));

	const cryptoListElement = document.getElementById("crypto-list");
	cryptoListElement.innerHTML = "";

	cryptoList.forEach((crypto) => {
		const cryptoItem = document.createElement("li");
		cryptoItem.className = "crypto-item";
		cryptoItem.innerHTML = `
			<h2>${crypto.name}</h2>
			<p><b>Symbol</b>: ${crypto.symbol}</p>
			<p><b>Price</b>: $${crypto.current_price}/${crypto.symbol}</p>
			<button onclick="buyCrypto('${user[0]._id}', '${crypto.current_price}')">Buy</button>
			<button onclick="sellCrypto('${user[0]._id}', '${crypto.current_price}')">Sell</button>
		`;
		cryptoListElement.appendChild(cryptoItem);
	});
}

/**
 * The function `renderUser` takes a user object as input and updates the HTML elements with the user's
 * username.
 * @param user - The `user` parameter is an array containing user information. The first element of the
 * array is an object that contains the user's username.
 */
async function renderUser(user) {
	const username = user[0].username;
	const wallet = await fetchWallet().catch((error) => console.error(error));

	const currentWallet = wallet.find((item) => item.user_id === user[0]._id);
	const currenCrypto = await fetchOneWallet(currentWallet._id).catch((error) =>
		console.error(error)
	);
	const walletCryptocurrency = currenCrypto.walletCryptocurrency;

	const userElement = document.querySelector(".user");
	console.log("currencypto: ", walletCryptocurrency);
	userElement.innerHTML = `
		<h1>User : ${username}</h1>
	`;

	const titleElement = document.querySelector(".title");
	titleElement.innerHTML = `
		<h3>Balance : $${currentWallet.balance}</h3>
	`;
}

/**
 * The function `buyCrypto` is an asynchronous function that buys cryptocurrency using the provided
 * user ID and price, updates the user's wallet balance, and renders the page if the update is
 * successful.
 * @param userId - The userId parameter represents the ID of the user who wants to buy cryptocurrency.
 * It is used to fetch the user's wallet information and update the balance after the purchase.
 * @param price - The price parameter represents the current price of the cryptocurrency that the user
 * wants to buy.
 */
async function buyCrypto(userId, price) {
	console.log("Buying cryptocurrency with ID:", userId);
	console.log(`Buying cryptocurrency on current price:`, price);
	const amount = 0.0001 * price;
	console.log(amount);
	try {
		const wallet = await fetch(`http://localhost:3000/api/v1/users/${userId}`);
		const currentBalance = await wallet.json();
		const oldBalance = currentBalance.data.wallet[0].balance;
		console.log("currentBalance: ", oldBalance);
		const response = await fetch(
			`http://localhost:3000/api/v1/wallets/${currentBalance.data.wallet[0]._id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					balance: oldBalance - amount,
					user_id: userId,
				}),
			}
		);

		if (response.ok) {
			console.log("การขายเหรียญเสร็จสิ้น");
			renderPage();
		}
	} catch (error) {
		console.error("Error buyFunction :", error);
	}
}

/**
 * The `sellCrypto` function sells a cryptocurrency for a given user ID and updates the user's wallet
 * balance accordingly.
 * @param userId - The `userId` parameter represents the ID of the user who wants to sell their
 * cryptocurrency. It is used to fetch the user's wallet information and update the balance after the
 * sale.
 * @param price - The price parameter represents the current price of the cryptocurrency that you want
 * to sell.
 */
async function sellCrypto(userId, price) {
	console.log("Selling cryptocurrency with ID:", userId);
	console.log(`Selling cryptocurrency on current price:`, price);
	const amount = 0.0001 * price;
	console.log(amount);

	try {
		const wallet = await fetch(`http://localhost:3000/api/v1/users/${userId}`);
		const currentBalance = await wallet.json();
		const oldBalance = currentBalance.data.wallet[0].balance;
		console.log("currentBalance: ", oldBalance);
		const response = await fetch(
			`http://localhost:3000/api/v1/wallets/${currentBalance.data.wallet[0]._id}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					balance: oldBalance + amount,
					user_id: userId,
				}),
			}
		);

		if (response.ok) {
			console.log("การขายเหรียญเสร็จสิ้น");
			renderPage();
		}
	} catch (error) {
		console.error("Error sellCrypto :", error);
	}
}

/**
 * The function `renderPage` fetches crypto data and user data, and then renders the crypto list and
 * user information on the page.
 */
async function renderPage() {
	const cryptoData = await fetchCryptoData().catch((error) =>
		console.error(error)
	);
	const userData = await fetchUesrData().catch((error) => console.error(error));

	renderCryptoList(cryptoData);
	renderUser(userData);
}

/* The code `fetchCryptoData().then((data) => renderCryptoList(data)).catch((error) =>
console.error(error));` is fetching cryptocurrency data from an API endpoint using the
`fetchCryptoData` function. */
fetchCryptoData()
	.then((data) => renderCryptoList(data))
	.catch((error) => console.error(error));

/* The code `fetchUesrData().then((user) => renderUser(user)).catch((error) => console.error(error));`
is fetching user data from an API endpoint using the `fetchUesrData` function. Once the data is
successfully retrieved, it calls the `renderUser` function with the user data as an argument to
update the HTML elements with the user's username. If there is an error during the fetch request, it
will be caught and logged to the console. */
fetchUesrData()
	.then((user) => renderUser(user))
	.catch((error) => console.error(error));
