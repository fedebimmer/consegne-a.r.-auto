document.addEventListener("DOMContentLoaded", initApp);

const appState = {
  userName: null,
  currentRoute: null,
  selectedClients: null,
  currentView: "login" // possible values: login, routeSelection, clientSelection, deliveries, history, summary
};

const routes = {
  "Giro Binasco": [
    "BUZZETTA GOMME",
    "CERTOSA",
    "DI LALLA",
    "EPR",
    "ESSO BINASCO",
    "EUROGOMME",
    "GIMA",
    "M.L. GOMME",
    "ROCCO SARLI",
    "TIMEOUT"
  ],
  "Giro Opera": [
    "AGA",
    "CGR",
    "ESSEGI GARAGE",
    "GALBIATI",
    "GM GROUP",
    "GOMMISTERIA",
    "IL GOMMISTA",
    "R.VAI",
    "SANTA BARBARA",
    "TARANTOLA",
    "UNIRADE"
  ],
  "Giro Vidigulfo": [
    "ARETUSA",
    "CARBIKE",
    "CARROZZERIA GARAGE ROMA",
    "CIBE",
    "CORSI",
    "DAMIANI",
    "GAZZONIS",
    "ISAM",
    "MARTELLI",
    "MIGLIAVACCA",
    "OFFICINA GARAGE ROMA",
    "PENITI",
    "SEDE MELEGNANO",
    "TRC"
  ]
};

function initApp() {
  renderApp();
}

function renderApp() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (appState.userName) {
    app.appendChild(renderNav());
  }

  if (!appState.userName || appState.currentView === "login") {
    renderLogin();
  } else if (appState.currentView === "routeSelection") {
    renderRouteSelection();
  } else if (appState.currentView === "clientSelection") {
    renderClientSelection();
  } else if (appState.currentView === "deliveries") {
    renderDeliveryList();
  } else if (appState.currentView === "history") {
    renderHistory();
  } else if (appState.currentView === "summary") {
    renderSummary();
  }
}

function renderNav() {
  const headerEl = document.createElement("header");
  headerEl.classList.add("fade-in");
  headerEl.innerHTML = `<h1>Gestione Consegne</h1>`;
  const nav = document.createElement("nav");

  const btnConsegne = document.createElement("button");
  btnConsegne.textContent = "Consegne";
  btnConsegne.addEventListener("click", () => {
    // Se non è stata fatta una selezione dei clienti, parte dalla scelta del giro
    appState.currentView = appState.selectedClients ? "deliveries" : "routeSelection";
    renderApp();
  });

  const btnHistory = document.createElement("button");
  btnHistory.textContent = "Cronologia";
  btnHistory.addEventListener("click", () => {
    appState.currentView = "history";
    renderApp();
  });

  const btnSummary = document.createElement("button");
  btnSummary.textContent = "Riepilogo";
  btnSummary.addEventListener("click", () => {
    appState.currentView = "summary";
    renderApp();
  });

  const btnLogout = document.createElement("button");
  btnLogout.textContent = "Logout";
  btnLogout.addEventListener("click", () => {
    appState.userName = null;
    appState.currentRoute = null;
    appState.selectedClients = null;
    appState.currentView = "login";
    renderApp();
  });

  nav.appendChild(btnConsegne);
  nav.appendChild(btnHistory);
  nav.appendChild(btnSummary);
  nav.appendChild(btnLogout);
  headerEl.appendChild(nav);
  return headerEl;
}

function renderLogin() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Accedi";
  container.appendChild(title);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Inserisci il tuo nome";
  container.appendChild(input);

  const btn = document.createElement("button");
  btn.textContent = "Accedi";
  btn.addEventListener("click", () => {
    const name = input.value.trim();
    if (name !== "") {
      appState.userName = name;
      appState.currentView = "routeSelection";
      renderApp();
    }
  });
  container.appendChild(btn);

  app.appendChild(container);
}

function renderRouteSelection() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Seleziona il Giro";
  container.appendChild(title);

  Object.keys(routes).forEach((route) => {
    const btn = document.createElement("button");
    btn.className = "route-btn";
    btn.textContent = route;
    btn.addEventListener("click", () => {
      appState.currentRoute = route;
      appState.selectedClients = null;
      appState.currentView = "clientSelection";
      renderApp();
    });
    container.appendChild(btn);
  });

  app.appendChild(container);
}

function renderClientSelection() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = `Seleziona i clienti per il Giro: ${appState.currentRoute}`;
  container.appendChild(title);

  const form = document.createElement("form");
  const clients = routes[appState.currentRoute]
    .slice()
    .sort((a, b) => a.localeCompare(b));
  clients.forEach((client) => {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginBottom = "8px";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = client;
    checkbox.name = "client";
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + client));
    form.appendChild(label);
  });
  container.appendChild(form);

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Conferma Scelta Clienti";
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let selected = [];
    const checkboxes = form.elements["client"];
    if (checkboxes) {
      if (!checkboxes.length) {
        if (checkboxes.checked) selected.push(checkboxes.value);
      } else {
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            selected.push(checkboxes[i].value);
          }
        }
      }
    }
    if (selected.length === 0) {
      alert("Devi selezionare almeno un cliente.");
      return;
    }
    appState.selectedClients = selected;
    appState.currentView = "deliveries";
    renderApp();
  });
  container.appendChild(submitBtn);

  const backBtn = document.createElement("button");
  backBtn.className = "nav-button";
  backBtn.textContent = "Cambia Giro";
  backBtn.style.marginTop = "10px";
  backBtn.addEventListener("click", () => {
    appState.currentRoute = null;
    appState.selectedClients = null;
    appState.currentView = "routeSelection";
    renderApp();
  });
  container.appendChild(backBtn);

  app.appendChild(container);
}

function renderDeliveryList() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = `Giro: ${appState.currentRoute}`;
  container.appendChild(title);

  const backBtn = document.createElement("button");
  backBtn.className = "nav-button";
  backBtn.textContent = "Cambia Clienti/Giro";
  backBtn.addEventListener("click", () => {
    appState.currentRoute = null;
    appState.selectedClients = null;
    appState.currentView = "routeSelection";
    renderApp();
  });
  container.appendChild(backBtn);

  const clients = appState.selectedClients.slice().sort((a, b) =>
    a.localeCompare(b)
  );

  clients.forEach((client) => {
    const item = document.createElement("div");
    item.className = "list-item";

    const clientName = document.createElement("span");
    clientName.textContent = client;
    item.appendChild(clientName);

    const btn = document.createElement("button");
    btn.className = "complete-btn";
    btn.textContent = isDeliveredForToday(client)
      ? "Consegnato"
      : "Completa Consegna";
    btn.disabled = isDeliveredForToday(client);
    btn.addEventListener("click", () => {
      completeDelivery(client);
    });
    item.appendChild(btn);

    container.appendChild(item);
  });

  app.appendChild(container);
}

function completeDelivery(client) {
  const now = new Date();
  const delivery = {
    name: appState.userName,
    route: appState.currentRoute,
    client: client,
    datetime: now.toISOString()
  };
  saveDelivery(delivery);
  sendWhatsAppNotification(delivery);
  
  if (checkAllDeliveriesCompleted()) {
    // Se tutte le consegne selezionate sono completate, mostra un messaggio e ripristina per il nuovo ciclo.
    const app = document.getElementById("app");
    const notice = document.createElement("div");
    notice.className = "complete-message fade-in";
    notice.textContent = "Tutte le consegne completate! Inizio nuovo ciclo...";
    app.appendChild(notice);
    setTimeout(() => {
      appState.currentRoute = null;
      appState.selectedClients = null;
      appState.currentView = "routeSelection";
      renderApp();
    }, 2000);
  } else {
    renderApp();
  }
}

function sendWhatsAppNotification(delivery) {
  const message = `Fattorino: ${delivery.name}, Giro: ${delivery.route}, Cliente: ${delivery.client}`;
  const url = `https://api.whatsapp.com/send?phone=393939393799&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function renderHistory() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Cronologia Consegne";
  container.appendChild(title);

  const deliveries = getDeliveries().sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );

  if (deliveries.length === 0) {
    const para = document.createElement("p");
    para.textContent = "Nessuna consegna registrata.";
    container.appendChild(para);
  } else {
    deliveries.forEach((delivery) => {
      const item = document.createElement("div");
      item.className = "list-item";
      const info = document.createElement("span");
      const date = new Date(delivery.datetime);
      info.textContent = `${date.toLocaleString()} - ${delivery.name} - ${delivery.route} - ${delivery.client}`;
      item.appendChild(info);
      container.appendChild(item);
    });
  }

  app.appendChild(container);
}

function renderSummary() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Riepilogo Giornaliero";
  container.appendChild(title);

  const deliveries = getDeliveries();
  if (deliveries.length === 0) {
    const para = document.createElement("p");
    para.textContent = "Nessuna consegna registrata.";
    container.appendChild(para);
  } else {
    const summary = {};
    deliveries.forEach((delivery) => {
      const day = delivery.datetime.substring(0, 10);
      if (!summary[day]) summary[day] = 0;
      summary[day]++;
    });

    Object.keys(summary)
      .sort((a, b) => b.localeCompare(a))
      .forEach((day) => {
        const item = document.createElement("div");
        item.className = "list-item";
        item.textContent = `${day}: ${summary[day]} consegne`;
        container.appendChild(item);
      });
  }

  app.appendChild(container);
}

function getDeliveries() {
  const data = localStorage.getItem("deliveries");
  return data ? JSON.parse(data) : [];
}

function saveDelivery(delivery) {
  const deliveries = getDeliveries();
  deliveries.push(delivery);
  localStorage.setItem("deliveries", JSON.stringify(deliveries));
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().substring(0, 10);
}

function isDeliveredForToday(client) {
  const deliveries = getDeliveries();
  const today = getTodayDate();
  return deliveries.some(
    (delivery) =>
      delivery.client === client &&
      delivery.route === appState.currentRoute &&
      delivery.name === appState.userName &&
      delivery.datetime.startsWith(today)
  );
}

function checkAllDeliveriesCompleted() {
  if (!appState.selectedClients || appState.selectedClients.length === 0) return false;
  return appState.selectedClients.every(client => isDeliveredForToday(client));
}

// Swipe gesture per una navigazione mobile semplice
let touchstartX = 0;
let touchendX = 0;

function handleGesture() {
  // Se l'utente effettua uno swipe verso destra (oltre la soglia), torna indietro se possibile
  if (touchendX > touchstartX + 50) {
    if (appState.currentView === "clientSelection") {
      appState.currentRoute = null;
      appState.selectedClients = null;
      appState.currentView = "routeSelection";
      renderApp();
    } else if (appState.currentView === "deliveries") {
      // Torna alla selezione dei clienti se l'utente fa swipe da destra
      appState.currentView = "clientSelection";
      renderApp();
    }
  }
}

document.addEventListener('touchstart', function(e) {
  touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
});