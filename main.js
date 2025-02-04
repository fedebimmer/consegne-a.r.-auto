document.addEventListener("DOMContentLoaded", initApp);

const appState = {
  userName: null,
  currentRoute: null,
  selectedClients: null,
  currentView: "login", // possible values: login, routeSelection, clientSelection, departureConfirm, deliveries, history, summary
  optimizedRouteLink: ""
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
    "UNIRADE",
    "LA COPERTON",
    "SCRIMA",
    "POINT DISTRIBUZIONE",
    "RAMBO",
    "RGL"
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

const clientCoordinates = {
  "Giro Binasco": {
    "BUZZETTA GOMME": { lat: 45.4654, lng: 9.1866 },
    "CERTOSA": { lat: 45.4660, lng: 9.1900 },
    "DI LALLA": { lat: 45.4640, lng: 9.1870 },
    "EPR": { lat: 45.4670, lng: 9.1830 },
    "ESSO BINASCO": { lat: 45.4650, lng: 9.1850 },
    "EUROGOMME": { lat: 45.4680, lng: 9.1820 },
    "GIMA": { lat: 45.4630, lng: 9.1840 },
    "M.L. GOMME": { lat: 45.4645, lng: 9.1860 },
    "ROCCO SARLI": { lat: 45.4685, lng: 9.1890 },
    "TIMEOUT": { lat: 45.4675, lng: 9.1880 }
  },
  "Giro Opera": {
    "AGA": { lat: 45.4654, lng: 9.1900 },
    "CGR": { lat: 45.4664, lng: 9.1910 },
    "ESSEGI GARAGE": { lat: 45.4674, lng: 9.1920 },
    "GALBIATI": { lat: 45.4684, lng: 9.1930 },
    "GM GROUP": { lat: 45.4694, lng: 9.1940 },
    "GOMMISTERIA": { lat: 45.4704, lng: 9.1950 },
    "IL GOMMISTA": { lat: 45.4714, lng: 9.1960 },
    "R.VAI": { lat: 45.4724, lng: 9.1970 },
    "SANTA BARBARA": { lat: 45.4734, lng: 9.1980 },
    "TARANTOLA": { lat: 45.4744, lng: 9.1990 },
    "UNIRADE": { lat: 45.4754, lng: 9.2000 },
    "LA COPERTON": { lat: 45.4715, lng: 9.1915 },
    "SCRIMA": { lat: 45.4716, lng: 9.1916 },
    "POINT DISTRIBUZIONE": { lat: 45.4717, lng: 9.1917 },
    "RAMBO": { lat: 45.4718, lng: 9.1918 },
    "RGL": { lat: 45.4719, lng: 9.1919 }
  },
  "Giro Vidigulfo": {
    "ARETUSA": { lat: 45.4654, lng: 9.2010 },
    "CARBIKE": { lat: 45.4664, lng: 9.2020 },
    "CARROZZERIA GARAGE ROMA": { lat: 45.4674, lng: 9.2030 },
    "CIBE": { lat: 45.4684, lng: 9.2040 },
    "CORSI": { lat: 45.4694, lng: 9.2050 },
    "DAMIANI": { lat: 45.4704, lng: 9.2060 },
    "GAZZONIS": { lat: 45.4714, lng: 9.2070 },
    "ISAM": { lat: 45.4724, lng: 9.2080 },
    "MARTELLI": { lat: 45.4734, lng: 9.2090 },
    "MIGLIAVACCA": { lat: 45.4744, lng: 9.2100 },
    "OFFICINA GARAGE ROMA": { lat: 45.4754, lng: 9.2110 },
    "PENITI": { lat: 45.4764, lng: 9.2120 },
    "SEDE MELEGNANO": { lat: 45.4774, lng: 9.2130 },
    "TRC": { lat: 45.4784, lng: 9.2140 }
  }
};

function initApp() {
  const savedName = localStorage.getItem("fattorinoNome");
  if (savedName) {
    appState.userName = savedName;
    appState.currentView = "routeSelection";
  }
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
  } else if (appState.currentView === "departureConfirm") {
    renderDepartureConfirm();
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
  
  const welcomeEl = document.createElement("p");
  welcomeEl.textContent = `Benvenuto, ${appState.userName}!`;
  headerEl.appendChild(welcomeEl);
  
  const nav = document.createElement("nav");

  const btnConsegne = document.createElement("button");
  btnConsegne.textContent = "Consegne";
  btnConsegne.addEventListener("click", () => {
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
    localStorage.removeItem("fattorinoNome");
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
      localStorage.setItem("fattorinoNome", name);
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
  title.textContent = "Seleziona i Giri";
  container.appendChild(title);

  // Add instructions
  const instructions = document.createElement("p");
  instructions.textContent = "Puoi selezionare più giri per una sessione di consegna.";
  instructions.style.textAlign = "center";
  instructions.style.marginBottom = "20px";
  container.appendChild(instructions);

  Object.keys(routes).forEach((route) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = route;
    checkbox.value = route;

    const label = document.createElement("label");
    label.htmlFor = route;
    label.textContent = route;
    label.style.marginLeft = "10px";

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });

  const nextBtn = document.createElement("button");
  nextBtn.className = "route-btn";
  nextBtn.textContent = "Avanti";
  nextBtn.addEventListener("click", () => {
    const selectedRoutes = [];
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedRoutes.push(checkbox.value);
      }
    });

    if (selectedRoutes.length === 0) {
      alert("Seleziona almeno un giro.");
      return;
    }

    // Merge clients from all selected routes
    const mergedClients = {};
    selectedRoutes.forEach(route => {
      mergedClients[route] = routes[route];
    });

    appState.currentRoute = selectedRoutes[0]; // Set first route as current
    appState.selectedClients = mergedClients[appState.currentRoute];
    appState.currentView = "clientSelection";
    renderApp();
  });
  container.appendChild(nextBtn);

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
    appState.currentView = "departureConfirm";
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

function renderDepartureConfirm() {
  const app = document.getElementById("app");
  const container = document.createElement("div");
  container.className = "container fade-in";

  const message = document.createElement("p");
  message.style.marginBottom = "20px";
  message.style.textAlign = "center";
  message.textContent =
    "Hai caricato le consegne sul mezzo? Se clicchi SI aggiorneremo l'orario di uscita della merce.";
  container.appendChild(message);

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Sì";
  yesBtn.addEventListener("click", () => {
    processDeparture();
  });
  container.appendChild(yesBtn);

  const backBtn = document.createElement("button");
  backBtn.className = "nav-button";
  backBtn.textContent = "Modifica Selezione";
  backBtn.style.marginTop = "10px";
  backBtn.addEventListener("click", () => {
    appState.currentView = "clientSelection";
    renderApp();
  });
  container.appendChild(backBtn);

  app.appendChild(container);
}

function processDeparture() {
  const now = new Date();
  const departureRecord = {
    name: appState.userName,
    route: appState.currentRoute,
    datetime: now.toISOString(),
    type: "departure",
    routeLink: appState.optimizedRouteLink || ""
  };
  saveDeparture(departureRecord);
  sendDepartureNotification(departureRecord);
  saveCompletedRoute({
    ...departureRecord,
    clients: appState.selectedClients
  });
  appState.currentView = "deliveries";
  renderApp();
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
    btn.className = `complete-btn ${isDeliveredForToday(client) ? 'disabled' : ''}`;
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
  
  // Immediately disable and gray out the button
  const buttons = document.querySelectorAll('.complete-btn');
  buttons.forEach(btn => {
    if (btn.textContent.includes(client)) {
      btn.disabled = true;
      btn.classList.add('completed');
      btn.textContent = 'Consegnato';
    }
  });
  
  // Check if all deliveries are completed after a short delay
  setTimeout(() => {
    if (checkAllDeliveriesCompleted()) {
      finishCycle();
    }
  }, 100);
}

function sendWhatsAppNotification(delivery) {
  const message = `Consegna effettuata da ${delivery.name} per il cliente ${delivery.client}.`;
  const url = `https://api.whatsapp.com/send?phone=393939393799&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function sendDepartureNotification(departure) {
  const departureTimeFormatted = new Date(departure.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let message = ` ${departure.name} è partito per le consegne del giro ${departure.route} alle ${departureTimeFormatted}`;
  if (departure.routeLink) {
    message += `\nEcco il percorso: ${departure.routeLink}`;
  }
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

  const history = getCronologiaConsegne().sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  if (history.length === 0) {
    const para = document.createElement("p");
    para.textContent = "Nessuna consegna registrata.";
    container.appendChild(para);
  } else {
    history.forEach((record) => {
      if (!record.type) {
        const item = document.createElement("div");
        item.className = "list-item";
        const date = new Date(record.datetime);
        let text = `${date.toLocaleString()} - ${record.name} - ${record.route} - ${record.client}`;
        item.textContent = text;
        container.appendChild(item);
      }
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
  title.textContent = "Riepilogo Consegne";
  container.appendChild(title);

  const summaryData = localStorage.getItem("riepilogoConsegne");
  if (!summaryData) {
    const para = document.createElement("p");
    para.textContent = "Nessuna consegna registrata.";
    container.appendChild(para);
  } else {
    const summary = JSON.parse(summaryData);
    const totalDiv = document.createElement("div");
    totalDiv.className = "list-item";
    totalDiv.textContent = `Numero totale di consegne: ${summary.totalConsegne}`;
    container.appendChild(totalDiv);
    const timeDiv = document.createElement("div");
    timeDiv.className = "list-item";
    timeDiv.textContent = `Tempo totale impiegato: ${summary.tempoTotale}`;
    container.appendChild(timeDiv);
  }

  app.appendChild(container);
}

function getCurrentCycle() {
  const data = localStorage.getItem("currentCycle");
  return data ? JSON.parse(data) : [];
}

function saveCurrentCycle(item) {
  const current = getCurrentCycle();
  current.push(item);
  localStorage.setItem("currentCycle", JSON.stringify(current));
}

function resetCurrentCycle() {
  localStorage.removeItem("currentCycle");
}

function saveDelivery(delivery) {
  saveCurrentCycle(delivery);
}

function saveDeparture(departure) {
  saveCurrentCycle(departure);
}

function saveCompletedRoute(routeInfo) {
  const data = localStorage.getItem("completedRoutes");
  let routes = data ? JSON.parse(data) : [];
  routes.push(routeInfo);
  localStorage.setItem("completedRoutes", JSON.stringify(routes));
}

function getTodayDate() {
  const today = new Date();
  return today.toISOString().substring(0, 10);
}

function isDeliveredForToday(client) {
  const deliveries = getCurrentCycle();
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
  return appState.selectedClients.every((client) => isDeliveredForToday(client));
}

function getCronologiaConsegne() {
  const data = localStorage.getItem("cronologiaConsegne");
  return data ? JSON.parse(data) : [];
}

function appendCronologiaConsegne(items) {
  const history = getCronologiaConsegne();
  items.forEach((item) => history.push(item));
  localStorage.setItem("cronologiaConsegne", JSON.stringify(history));
  console.log("CronologiaConsegne:", localStorage.getItem("cronologiaConsegne"));
}

function computeCycleSummary(cycleData) {
  let departureRecord = cycleData.find(item => item.type === "departure");
  let deliveryRecords = cycleData.filter(item => !item.type);
  let totalDeliveries = deliveryRecords.length;
  let summary = {};
  if (departureRecord && deliveryRecords.length > 0) {
    let lastDelivery = deliveryRecords.reduce((prev, curr) => (new Date(curr.datetime) > new Date(prev.datetime) ? curr : prev));
    let departureTime = new Date(departureRecord.datetime);
    let lastTime = new Date(lastDelivery.datetime);
    let diff = lastTime - departureTime;
    let seconds = Math.floor(diff / 1000) % 60;
    let minutes = Math.floor(diff / (1000 * 60)) % 60;
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let tempoTotale = "";
    if (hours > 0) {
      tempoTotale = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      tempoTotale = `${minutes}m ${seconds}s`;
    } else {
      tempoTotale = `${seconds}s`;
    }
    summary = { totalConsegne: totalDeliveries, tempoTotale: tempoTotale };
  } else {
    summary = { totalConsegne: totalDeliveries, tempoTotale: "N/A" };
  }
  return summary;
}

function finishCycle() {
  const currentCycleDeliveries = getCurrentCycle();
  const deliveryRecords = currentCycleDeliveries.filter(item => !item.type);
  appendCronologiaConsegne(deliveryRecords);
  const summary = computeCycleSummary(currentCycleDeliveries);
  localStorage.setItem("riepilogoConsegne", JSON.stringify(summary));
  resetCurrentCycle();
  
  const app = document.getElementById("app");
  
  // Create the completion message container
  const messageContainer = document.createElement("div");
  messageContainer.className = "container fade-in";
  
  // Add the message
  const message = document.createElement("p");
  message.style.textAlign = "center";
  message.style.marginBottom = "20px";
  message.textContent = "HAI TERMINATO IL GIRO CONSEGNE, TORNA IN MAGAZZINO PER IL PROSSIMO GIRO.";
  messageContainer.appendChild(message);
  
  // Add the WhatsApp button
  const whatsappBtn = document.createElement("button");
  whatsappBtn.className = "route-btn";
  whatsappBtn.textContent = "OK";
  whatsappBtn.addEventListener("click", () => {
    const whatsappMessage = `Fattorino ${appState.userName} in rientro`;
    const url = `https://api.whatsapp.com/send?phone=393939393799&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
    setTimeout(() => {
      location.reload();
    }, 500);
  });
  messageContainer.appendChild(whatsappBtn);
  
  // Add the container to the app
  app.appendChild(messageContainer);
  
  // Remove any existing complete message
  const existingMessage = document.querySelector(".complete-message");
  if (existingMessage) {
    existingMessage.remove();
  }
}

let touchstartX = 0;
let touchendX = 0;

function handleGesture() {
  if (touchendX > touchstartX + 50) {
    if (appState.currentView === "clientSelection") {
      appState.currentRoute = null;
      appState.selectedClients = null;
      appState.currentView = "routeSelection";
      renderApp();
    } else if (appState.currentView === "deliveries") {
      appState.currentView = "clientSelection";
      renderApp();
    }
  }
}

document.addEventListener("touchstart", function (e) {
  touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", function (e) {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
});