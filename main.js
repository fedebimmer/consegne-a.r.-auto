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

// Mappa preimpostata delle coordinate GPS per ogni cliente
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
    "UNIRADE": { lat: 45.4754, lng: 9.2000 }
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
    // Dopo aver selezionato i clienti, passa alla schermata di conferma (con mappa integrata)
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

  // Aggiungi la mappa interattiva per mostrare i clienti selezionati
  const mapContainer = document.createElement("div");
  mapContainer.id = "map";
  mapContainer.style.height = "300px";
  mapContainer.style.marginBottom = "20px";
  container.appendChild(mapContainer);

  const message = document.createElement("p");
  message.style.marginBottom = "20px";
  message.style.textAlign = "center";
  message.textContent =
    "Hai caricato le consegne sul mezzo? Se clicchi SI aggiorneremo l'orario di uscita della merce.";
  container.appendChild(message);

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Sì";
  yesBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const driverCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const coordsMap = clientCoordinates[appState.currentRoute];
        const markers = [];
        appState.selectedClients.forEach((client) => {
          if (coordsMap[client]) {
            markers.push(coordsMap[client]);
          }
        });
        if (markers.length > 0) {
          const origin = `${driverCoords.lat},${driverCoords.lng}`;
          const destination = `${markers[markers.length - 1].lat},${markers[markers.length - 1].lng}`;
          const waypoints = markers
            .slice(0, markers.length - 1)
            .map((coord) => `${coord.lat},${coord.lng}`)
            .join("|");
          let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
          if (waypoints) {
            url += `&waypoints=optimize:true|${waypoints}`;
          }
          appState.optimizedRouteLink = url;
        }
        const now = new Date();
        const departureRecord = {
          name: appState.userName,
          route: appState.currentRoute,
          datetime: now.toISOString(),
          type: "departure",
          driverCoords: driverCoords,
          routeLink: appState.optimizedRouteLink || "",
        };
        saveDeparture(departureRecord);
        sendDepartureNotification(departureRecord);
        // Salva il percorso completato in LocalStorage
        saveCompletedRoute({
          ...departureRecord,
          clients: appState.selectedClients,
        });
        appState.currentView = "deliveries";
        renderApp();
      },
      function (error) {
        alert("Errore nel rilevamento della posizione: " + error.message);
      }
    );
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
  // Dopo aver inserito il container, carica la mappa con i punti dei clienti selezionati
  loadMap();
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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const now = new Date();
        const delivery = {
          name: appState.userName,
          route: appState.currentRoute,
          client: client,
          datetime: now.toISOString(),
          lat: position.coords.latitude,
          lng: position.coords.longitude
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
      },
      function (error) {
        alert("Posizione non disponibile. Per favore, abilita la geolocalizzazione nel browser.");
      }
    );
  } else {
    alert("Geolocation non supportata dal tuo browser.");
  }
}

function sendWhatsAppNotification(delivery) {
  let message = `Consegna effettuata da ${delivery.name} per il cliente ${delivery.client}.`;
  if (delivery.lat && delivery.lng) {
    message += ` Posizione: https://www.google.com/maps?q=${delivery.lat},${delivery.lng}`;
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
      if (record.lat && record.lng) {
        const posLink = document.createElement("a");
        posLink.href = `https://www.google.com/maps?q=${record.lat},${record.lng}`;
        posLink.target = "_blank";
        posLink.textContent = " (Posizione)";
        item.appendChild(posLink);
      }
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
  return appState.selectedClients.every((client) => isDeliveredForToday(client));
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

function loadMap() {
  if (!window.google || !google.maps) {
    console.error("Google Maps API non caricato.");
    return;
  }
  const mapEl = document.getElementById("map");
  if (!mapEl) return;
  const coordsMap = clientCoordinates[appState.currentRoute];
  const markersData = [];
  appState.selectedClients.forEach((client) => {
    if (coordsMap[client]) {
      markersData.push({ client: client, position: coordsMap[client] });
    }
  });
  let center = { lat: 45.4654, lng: 9.1866 }; // coordinate di default
  if (markersData.length > 0) {
    center = markersData[0].position;
  }
  const map = new google.maps.Map(mapEl, {
    center: center,
    zoom: 14,
    disableDefaultUI: true,
    gestureHandling: "greedy"
  });
  markersData.forEach((markerData) => {
    const marker = new google.maps.Marker({
      position: markerData.position,
      map: map,
      title: markerData.client,
      animation: google.maps.Animation.DROP
    });
  });
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