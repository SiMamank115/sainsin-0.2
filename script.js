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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function setDark(state = false) {
	window.localStorage.setItem("theme", state);
}
function setToHistory(id) {
	let hs = localStorage.getItem("tryoutClicked");
	hs = hs ? JSON.parse(hs) : [];
	hs.push(id);
	localStorage.setItem("tryoutClicked", JSON.stringify(hs));
}
function setModuleHistory(id) {
	let hs = localStorage.getItem("moduleClicked");
	hs = hs ? JSON.parse(hs) : [];
	hs.push(id);
	localStorage.setItem("moduleClicked", JSON.stringify(hs));
}
let tm;
function doneCracking() {
	apikey.focus();
	cracker.classList.add("btn-error");
	clearTimeout(tm);
	tm = setTimeout(() => {
		cracker.classList.remove("btn-error");
	}, 2000);
}
function decodeSubtesType(type) {
	let res;
	switch (type) {
		case 11:
			res = "Penalaran Umum";
			break;
		case 12:
			res = "Penalaran Deduktif";
			break;
		case 13:
			res = "Penalaran Kuantitatif";
			break;
		case 14:
			res = "Pengetahuan dan Pemahaman Umum";
			break;
		case 15:
			res = "Kemampuan Memahami Bacaan dan Menulis";
			break;
		case 16:
			res = "Pengetahuan Kuantitatif";
			break;
		case 17:
			res = "Literasi dalam Bahasa Indonesia";
			break;
		case 18:
			res = "Literasi dalam Bahasa Inggris";
			break;
		case 19:
			res = "Penalaran Matematika";
			break;
	}
	return res;
}
let fetchedTryouts;
async function loadTO(str) {
	let module = str.split(",");
	let questions = await getQuestions(module).then((e) => e.json());
	let menus = ``;
	questions.forEach((e, idx) => {
		menus += `<button class='btn bg-base-200 shadow-base-content/20 shadow grow md:basis-40 basis-20'>${idx}</button>`;
	});
	console.log(questions);
	await sleep(100);
	hero.innerHTML += createAccordion([
		[menus, "Menu"],
		["LMAO2", "Question"],
	]);
}
function createAccordion(
	content = [
		["", ""],
		["", ""],
	]
) {
	let opening = '<div class="join join-vertical w-full">';
	let body = "";
	let ending = "</div>";
	content.forEach((e) => {
		body += `
		<div class="collapse collapse-arrow join-item border-2 border-base-content">
			<input type="radio" name="my-accordion-4" checked="checked" /> 
			<div class="collapse-title text-xl font-medium">
				${e?.dataset?.title ?? e?.[1] ?? "Click"}
			</div>
			<div class="collapse-content flex flex-wrap gap-3"> 
			${e?.outerHTML ?? e?.[0] ?? "<p>sad</p>"}
			</div>
		</div>`;
	});
	return opening + body + ending;
}
async function crack() {
	cracker.setAttribute("disabled", true);
	if (await checkApiKey()) {
		console.log("go in");
		modaltryouts.showModal();
		let tryouts = fetchedTryouts ? fetchedTryouts : await getTryouts().then((e) => e.json());
		if (tryouts || fetchedTryouts) {
			tryouts = _.orderBy(tryouts, ["id"], ["desc"]);
			fetchedTryouts = tryouts;
			let partition = {};
			for (let i = 0; i <= moment().format("y") - 2020; i++) {
				partition[moment().format("y") - i] = tryouts.filter((e) => moment(e.created_at).format("YYYY") == moment().format("y") - i);
			}
			let partitionKey = Object.keys(partition);
			let hs = localStorage.getItem("tryoutClicked");
			hs = hs ? JSON.parse(hs) : [];
			modaltryoutsbody.innerHTML = "";
			let rev = partitionKey.reverse();
			for (let rr = 0; rr < rev.length; rr++) {
				let r = rev[rr];
				let divider = document.createElement("div");
				divider.classList.add("divider");
				divider.classList.add("w-full");
				divider.textContent = r;
				modaltryoutsbody.appendChild(divider);
				for (let i = 0; i < partition[r].length; i++) {
					let e = partition[r][i];
					modaltryoutsbody.appendChild(createToCard(e, hs));
					await sleep(_.random(0, 25));
				}
			}
		}
	} else {
		doneCracking();
	}
	cracker.removeAttribute("disabled");
}
function createToCard(to, hs) {
	let e = to;
	let newCard = document.createElement("div");
	newCard.classList.add(..."indicator grow flex sm:tooltip".split(" "));
	newCard.id = `tryoutbutton${e.id}`;
	newCard.dataset.toid = e.id;
	newCard.dataset.tip = moment(e.created_at).format("MMM");
	newCard.onclick = async () => {
		cracker.setAttribute("disabled", true);
		setToHistory(e.id);
		let modules = e.modules;
		if (modules) {
			modalmodulesbody.innerHTML = "";
			await modules.forEach(async (t, idx) => {
				if (t) {
					let newCard2 = document.createElement("div");
					let newButton = document.createElement("button");
					let info = await getModulesInfo(t);
					if (info) {
						info[1] = info[1].map((ee) => ee.id);
						newCard2.classList.add(..."indicator grow flex sm:tooltip".split(" "));
						newCard2.id = `subtesbutton${e.id}`;
						newButton.dataset.module = t;
						newButton.dataset.question = info[1];
						newButton.classList.add(..."btn bg-base-200 grow w-full".split(" "));
						newButton.textContent = `${decodeSubtesType(info[0])} (${t})`;
						newCard2.appendChild(newButton);
						newButton.onclick = (e) => loadTO(e.target.dataset.question);
						modalmodulesbody.appendChild(newCard2);
					}
				}
			});
			modalmodules.showModal();
		} else {
			doneCracking();
		}
		cracker.removeAttribute("disabled");
	};
	let clicked = hs.filter((r) => r == e.id).length;
	if (clicked > 0) {
		newCard.innerHTML = `<span class="indicator-item font-bold badge ${clicked < 5 ? "badge-primary" : "badge-accent"} text-[10px] mr-5 select-none">${clicked}</span>`;
	}
	newCard.innerHTML += `<button class="btn bg-base-200 grow w-full">${e.name
		.replace("Try Out", "TO")
		.replace(" SainsIn", "")
		.replace("2021", "")
		.replace("2022", "")
		.replace("2023", "")
		.replace("UTBK", "")
		.replace("SNBT", "")
		.replace("Premium", "Prem")}</button>`;
	newCard.innerHTML += `<span class="indicator-item indicator-start sm:hidden select-none badge badge-outline bg-base-100 font-bold text-[10px] ml-5">${moment(e.created_at).format("MMM")}</span>`;
	return newCard;
}
async function getModulesInfo(id) {
	let modules = await getModules(id, "&select=id,question_id,module_id").then((e) => e.json());
	if (modules.length > 0) {
		let type = await getQuestion(modules[0].question_id, "&select=type").then((e) => e.json());
		return [type[0].type, modules];
	} else {
		return;
	}
}
async function getQuestion(id, option = "") {
	var head = new Headers();
	head.append("apikey", apikey.value);
	return await fetch(issuer + "questions?id=eq." + (id ?? 0) + option, {
		headers: head,
	});
}
async function getQuestions(id, option = "") {
	var head = new Headers();
	head.append("apikey", apikey.value);
	return await fetch(issuer + "questions?id=in.(" + (id?.join(",") ?? 0) + ")" + option, {
		headers: head,
	});
}
async function getModules(id, opstion) {
	var head = new Headers();
	head.append("apikey", apikey.value);
	return await fetch(issuer + "module_question?module_id=eq." + (id ?? 0) + opstion, {
		headers: head,
	});
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
