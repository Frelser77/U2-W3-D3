document.addEventListener("DOMContentLoaded", function () {
	const container = document.querySelector("#book-container"); // Seleziona l'elemento corretto
	const carrello = []; // Inizializza un array vuoto per il carrello

	// Funzione per aggiungere un libro al carrello
	function aggiungiAlCarrello(libro) {
		carrello.push(libro);
		localStorage.setItem("carrello", JSON.stringify(carrello)); // Salva il carrello nel localStorage

		// Aggiorna il carrello
		const listCarr = document.getElementById("lista-carrello");
		const carrElem = document.createElement("li");
		carrElem.className = "list-group-item d-flex justify-content-between align-items-center my-1 rounded-2 ";
		carrElem.textContent = `${libro.title} - €${libro.price}`;

		// tasto rimuovi nel carrello
		const btnRemove = document.createElement("button");
		btnRemove.className = "btn btn-danger btn-sm px-3 py-1";
		btnRemove.textContent = "Rimuovi";
		btnRemove.onclick = function () {
			rimuoviDalCarrello(libro, carrElem);
		};

		carrElem.appendChild(btnRemove);
		listCarr.appendChild(carrElem);
	}

	function funClear() {
		document.getElementById("lista-carrello").innerHTML = ""; // Svuota la lista del carrello nel DOM
	}

	// Creo un div che fungerà da contenitore per il pulsante
	const divContainer = document.createElement("div");
	divContainer.className = "text-center mt-3"; // Aggiungi le classi per centraggio e margin-top

	// Creo il btn per svuotare il carrello
	const btnSvuota = document.createElement("button");
	btnSvuota.className = "btn btn-warning btn-sm fw-bold px-3 py-1";
	btnSvuota.textContent = "Svuota Carrello";
	btnSvuota.onclick = funClear;

	// Aggiungo il btn al div contenitore
	divContainer.appendChild(btnSvuota);

	// Aggiungo il div contenitore sotto la lista del carrello
	document.getElementById("carrello").appendChild(divContainer);

	// rimuovere dal carrello il libro
	function rimuoviDalCarrello(libroDaRimuovere, elementoCarrello) {
		// Rimuove il libro dall'array carrello
		const indice = carrello.indexOf(libroDaRimuovere);
		if (indice > -1) {
			carrello.splice(indice, 1);
		}

		// Aggiorna il localStorage
		localStorage.setItem("carrello", JSON.stringify(carrello));
		// Rimuove l'elemento dalla lista nel DOM
		elementoCarrello.remove();
	}

	// Funzione per creare una card di libro
	function creaCard(libro) {
		const col = document.createElement("div"); // creo un div con classe
		col.className = "col-12 col-md-6 col-lg-4 my-4";

		const card = document.createElement("div"); // creo un div con classe
		card.className = "card h-100";
		card.style = "max-height:450px";

		const img = document.createElement("img");
		img.src = libro.img;
		img.className = "card-img-top";
		img.alt = libro.title;

		const cardBody = document.createElement("div"); // creo un div con classe
		cardBody.className = "card-body d-flex flex-column justify-content-between align-items-center";

		const title = document.createElement("h5"); // creo un h5 con classe e contenuto
		title.className = "card-title";
		title.textContent = libro.title;

		const price = document.createElement("p"); // creo un p con classe e con contenuto il prezzo
		price.className = "card-text";
		price.textContent = `Prezzo: €${libro.price}`;

		const btnScarta = document.createElement("button"); // creo un bottono con classe e contenuto con un evento onclick per rimuovere il div.col
		btnScarta.className = "btn btn-danger px-3 py-1";
		btnScarta.textContent = "Scarta";
		btnScarta.onclick = function () {
			col.remove(); // Rimuove la card dalla pagina
		};

		const btnCompra = document.createElement("button"); // creo un bottono con classe e contenuto con un evento onclick per aggiungere al carrello il libro
		btnCompra.className = "btn btn-success mx-2 px-3 py-1";
		btnCompra.textContent = "Compra ora";
		btnCompra.onclick = function () {
			aggiungiAlCarrello(libro); // Aggiunge il libro al carrello
		};

		// gli appendo nel DOM
		cardBody.appendChild(title);
		cardBody.appendChild(price);
		cardBody.appendChild(btnScarta);
		cardBody.appendChild(btnCompra);
		card.appendChild(img);
		card.appendChild(cardBody);
		col.appendChild(card);

		return col;
	}

	// Carico i libri dall'API e creo le card
	fetch("https://striveschool-api.herokuapp.com/books")
		.then((response) => {
			if (response.ok) {
				return response.json(); // Continua solo se la risposta è valida
			} else {
				console.error("Network response ok.");
				return []; // Ritorna un array vuoto in caso di risposta non valida
			}
		})
		.then((libri) => {
			libri.forEach((libro) => {
				const card = creaCard(libro);
				container.appendChild(card);
			});
		})
		.catch((error) => {
			console.error("There are a problem: ", error);
		});
});
