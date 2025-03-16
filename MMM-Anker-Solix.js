'use strict';

Module.register("MMM-Solix", {
    defaults: {
        updateInterval: 10 * 60 * 1000, // 10 minutes
        apiUrl: "https://ankerpower-api.anker.com",
        authToken: "",
    },

    start: function() {
        this.data = {
            usage: "--",
            generation: "--",
            draw: "--",
            export: "--",
            date: "--"
        };
        this.getData();
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getData: function() {
        this.sendSocketNotification("GET_SOLIX_DATA", { apiUrl: this.config.apiUrl, authToken: this.config.authToken });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SOLIX_DATA") {
            this.processData(payload);
        }
    },

    processData: function(data) {
        if (data && data.devices) {
            const device = data.devices[0]; // Assuming first device for now
            this.data = {
                usage: device.usage || "--",
                generation: device.generation || "--",
                draw: device.draw || "--",
                export: device.export || "--",
                date: new Date().toLocaleString()
            };
            this.updateDom();
        }
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        wrapper.className = "solix-container";
        wrapper.innerHTML = `
            <div class="solix-title">Solix Data</div>
            <div class="solix-item">Usage: <span>${this.data.usage} W</span></div>
            <div class="solix-item">Generation: <span>${this.data.generation} W</span></div>
            <div class="solix-item">Draw: <span>${this.data.draw} W</span></div>
            <div class="solix-item">Export: <span>${this.data.export} W</span></div>
            <div class="solix-update">Last Updated: ${this.data.date}</div>
        `;
        return wrapper;
    }
});
