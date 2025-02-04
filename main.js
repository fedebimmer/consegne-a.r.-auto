document.addEventListener("DOMContentLoaded", initApp);

const appState = {
  userName: null,
  currentRoute: null,
  selectedClients: null,
  currentView: "login" // possible values: login, routeSelection, clientSelection, mapView, deliveries, history, summary
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

const clientCoordinates = {
  "Giro Binasco": {
    "BUZZETTA GOMME": { lat: 45.460, lng: 9.150 },
    "CERTOSA": { lat: 45.461, lng: 9.152 },
    "DI LALLA": { lat: 45.462, lng: 9.154 },
    "EPR": { lat: 45.463, lng: 9.156 },
    "ESSO BINASCO": { lat: 45.464, lng: 9.158 },
    "EUROGOMME": { lat: 45.465, lng: 9.160 },
    "GIMA": { lat: 45.466, lng: 9.162 },
    "M.L. GOMME": { lat: 45.467, lng: 9.164 },
    "ROCCO SARLI": { lat: 45.468, lng: 9.166 },
    "TIMEOUT": { lat: 45.469, lng: 9.168 }
  },
  "Giro Opera": {
    "AGA": { lat: 45.470, lng: 9.170 },
    "CGR": { lat: 45.471, lng: 9.172 },
    "ESSEGI GARAGE": { lat: 45.472, lng: 9.174 },
    "GALBIATI": { lat: 45.473, lng: 9.176 },
    "GM GROUP": { lat: 45.474, lng: 9.178 },
    "GOMMISTERIA": { lat: 45.475, lng: 9.180 },
    "IL GOMMISTA": { lat: 45.476, lng: 9.182 },
    "R.VAI": { lat: 45.477, lng: 9.184 },
    "SANTA BARBARA": { lat: 45.478, lng: 9.186 },
    "TARANTOLA": { lat: 45.479, lng: 9.188 },
    "UNIRADE": { lat: 45.480, lng: 9.190 }
  },
  "Giro Vidigulfo": {
    "ARETUSA": { lat: 45.481, lng: 9.191 },
    "CARBIKE": { lat: 45.482, lng: 9.193 },
    "CARROZZERIA GARAGE ROMA": { lat: 45.483, lng: 9.195 },
    "CIBE": { lat: 45.484, lng: 9.197 },
    "CORSI": { lat: 45.485, lng: 9.199 },
    "DAMIANI": { lat: 45.486, lng: 9.201 },
    "GAZZONIS": { lat: 45.487, lng: 9.203 },
    "ISAM": { lat: 45.488, lng: 9.205 },
    "MARTELLI": { lat: 45.489, lng: 9.207 },
    "MIGLIAVACCA": { lat: 45.490, lng: 9.209 },
    "OFFICINA GARAGE ROMA": { lat: 45.491, lng: 9.211 },
    "PENITI": { lat: 45.492, lng: 9.213 },
    "SEDE MELEGNANO": { lat: 45.493, lng: 9.215 },
    "TRC": { lat: 45.494, lng: 9.217 }
  }
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
  } else if (appState.currentView === "mapView") {
    renderMapView();
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
    appState.currentView = "mapView";
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

function renderMapView() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  if(appState.userName) {
    app.appendChild(renderNav());
  }
  const container = document.createElement("div");
  container.className = "container fade-in";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Percorso Selezionato";
  container.appendChild(title);

  const mapDiv = document.createElement("div");
  mapDiv.id = "map";
  container.appendChild(mapDiv);

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Carica Consegne e Parti";
  confirmBtn.addEventListener("click", confirmDepartureWithMap);
  container.appendChild(confirmBtn);

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
  setTimeout(initMapForView, 300);
}

function initMapForView() {
  if (typeof google === "undefined" || !google.maps) {
    console.error("Google Maps API non disponibile.");
    return;
  }
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  let sumLat = 0, sumLng = 0, count = 0;
  appState.selectedClients.forEach(client => {
    const coord = clientCoordinates[appState.currentRoute][client];
    if (coord) {
      sumLat += coord.lat;
      sumLng += coord.lng;
      count++;
    }
  });
  const center = count > 0 ? { lat: sumLat / count, lng: sumLng / count } : { lat: 45.465, lng: 9.190 };

  const map = new google.maps.Map(mapDiv, {
    center: center,
    zoom: 13
  });

  const bounds = new google.maps.LatLngBounds();
  appState.selectedClients.forEach(client => {
    const coord = clientCoordinates[appState.currentRoute][client];
    if (coord) {
      const marker = new google.maps.Marker({
        position: coord,
        map: map,
        title: client
      });
      bounds.extend(marker.getPosition());
    }
  });
  if (count > 0) {
    map.fitBounds(bounds);
  }
}

function confirmDepartureWithMap() {
  const now = new Date();
  const departureRecord = {
    name: appState.userName,
    route: appState.currentRoute,
    datetime: now.toISOString()
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        departureRecord.gps = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        proceedWithDeparture(departureRecord);
      },
      (error) => {
        console.warn("Geolocalizzazione non disponibile. Procedo senza GPS.");
        proceedWithDeparture(departureRecord);
      }
    );
  } else {
    proceedWithDeparture(departureRecord);
  }
}

function proceedWithDeparture(departureRecord) {
  saveDeparture(departureRecord);
  const mapsLink = generateMapsLink();
  sendDepartureNotification(departureRecord, mapsLink);
  appState.currentView = "deliveries";
  renderApp();
}

function generateMapsLink() {
  const waypoints = [];
  appState.selectedClients.forEach(client => {
    const coord = clientCoordinates[appState.currentRoute][client];
    if (coord) {
      waypoints.push(coord.lat + "," + coord.lng);
    }
  });
  if (waypoints.length > 0) {
    return "https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=My+Location&travelmode=driving&waypoints=optimize:true|" + waypoints.join("|");
  }
  return "https://www.google.com/maps";
}

function sendDepartureNotification(departure, mapsLink) {
  const departureTimeFormatted = new Date(departure.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let message = `🛻 ${departure.name} è partito per le consegne del giro ${departure.route} alle ${departureTimeFormatted}.`;
  if (mapsLink) {
    message += ` Ecco il percorso: ${mapsLink}`;
  }
  const url = `https://api.whatsapp.com/send?phone=393939393799&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
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

  const records = getDeliveries().sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );

  if (records.length === 0) {
    const para = document.createElement("p");
    para.textContent = "Nessuna consegna registrata.";
    container.appendChild(para);
  } else {
    records.forEach((record) => {
      const item = document.createElement("div");
      item.className = "list-item";
      const date = new Date(record.datetime);
      let text = `${date.toLocaleString()} - ${record.name} - ${record.route}`;
      if (record.type === "departure") {
        text += " - Partenza";
      } else {
        text += " - " + record.client;
      }
      const info = document.createElement("span");
      info.textContent = text;
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

function saveDeparture(departure) {
  const records = getDeliveries();
  records.push(departure);
  localStorage.setItem("deliveries", JSON.stringify(records));
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