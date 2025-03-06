import { DateTime } from 'luxon'
document.addEventListener('alpine:init', () => {
  window.Alpine.data('map', function (data) {
    return {
      createMap() {
        return L.map(this.$root).setView([data.center.latitude, data.center.longitude], data.zoom)
      },

      addMarker(map, markerData) {
        const formattedDate = DateTime.fromISO(markerData.date).toFormat('dd/MM/yyyy HH:mm');
        const popupContent = `
          <div>
            <h3>${markerData.label}</h3>
            <p>${markerData.description}</p>
            <p>${formattedDate}</p>
            <p>${markerData.adress}</p>
            <p>${markerData.city}</p>
          </div>
        `
        const popup = L.popup({ offset: [0, -15] }).setContent(popupContent)
        L.marker([markerData.latitude, markerData.longitude]).bindPopup(popup).addTo(map)
      },

      init() {
        const map = this.createMap()

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        if (data.markers && Array.isArray(data.markers)) {
          data.markers.forEach((marker) => {
            this.addMarker(map, marker)
          })
        }
      }
    }
  })
})