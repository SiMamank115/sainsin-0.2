const issuer = "https://zcyfhqxqagiwsgrafsei.supabase.co/rest/v1/";
const paramJoin = "%2";
const testApiKey = "select=name&limit=1";
const paginate = 10;
const isLight = JSON.parse(window.localStorage.getItem("theme"));
themetoggler.addEventListener("change", (e) => setDark(e.target.checked));
cracker.addEventListener("click", crack);
if (typeof isLight == "boolean") {
	themetoggler.checked = isLight;
}
function setDark(state = false) {
	window.localStorage.setItem("theme", state);
}
function setToHistory(id) {
	let hs = localStorage.getItem("tryoutClicked");
	hs = hs ? JSON.parse(hs) : [];
	hs.push(id);
	localStorage.setItem("tryoutClicked", JSON.stringify(hs));
}
let tm;
async function crack() {
	cracker.setAttribute("disabled", true);
	if (await checkApiKey()) {
		console.log("go in");
		let tryouts = await getTryouts().then((e) => e.json());
		if (tryouts) {
			let hs = localStorage.getItem("tryoutClicked");
			hs = JSON.parse(hs);
			modaltryoutsbody.innerHTML = "";
			tryouts.forEach((e) => {
				let newCard = document.createElement("div");
				newCard.classList.add(..."indicator grow flex sm:tooltip".split(" "));
				newCard.id = `tryoutbutton${e.id}`;
				newCard.dataset.toid = e.id;
				newCard.dataset.tip = moment(e.created_at).format("YYYY");
				newCard.onclick = (card) => {
					setToHistory(e.id);
				};
				let clicked = hs.filter((r) => r == e.id).length;
				if (clicked > 0) {
					newCard.innerHTML = `<span class="indicator-item font-bold badge ${clicked < 5 ? "badge-primary" : "badge-accent"} text-[10px] mr-5 select-none">${clicked}</span>`;
				}
				newCard.innerHTML += `<button class="btn grow w-full">${e.name.replace("Try Out", "TO")}</button>`;
				newCard.innerHTML += `<span class="indicator-item indicator-start sm:hidden select-none badge badge-outline bg-base-100 text-[10px] ml-5">${moment(e.created_at).format(
					"YYYY"
				)}</span>`;
				modaltryoutsbody.appendChild(newCard);
			});
		}
		modaltryouts.showModal();
	} else {
		apikey.focus();
		cracker.classList.add("btn-error");
		clearTimeout(tm);
		tm = setTimeout(() => {
			cracker.classList.remove("btn-error");
		}, 2000);
	}
	cracker.removeAttribute("disabled");
}
async function getTryouts() {
	var head = new Headers();
	head.append("apikey", apikey.value);
	return await fetch(issuer + "tryouts?select=name,id,modules,created_at", {
		headers: head,
	});
}
async function checkApiKey() {
	var head = new Headers();
	head.append("apikey", apikey.value);
	return await fetch(issuer + "tryouts?select=name&limit=1", {
		headers: head,
	}).then((e) => {
		return e.ok;
	});
}
