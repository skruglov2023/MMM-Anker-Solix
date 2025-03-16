const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-Solix helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_SOLIX_DATA") {
            this.fetchData(payload.apiUrl, payload.authToken);
        }
    },

    fetchData: function(apiUrl, authToken) {
        const url = `${apiUrl}/devices/data`; // Adjust API endpoint as needed

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            this.sendSocketNotification("SOLIX_DATA", data);
        })
        .catch(error => {
            console.error("MMM-Solix: Error fetching data", error);
        });
    }
});
