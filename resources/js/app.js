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
          <div class="popup-content">
            <h4 class="popup-title">${markerData.label}</h4>
            <p class="popup-address">${markerData.adress}, ${markerData.city}</p>
            <p class="popup-date">${formattedDate}</p>
            <p class="popup-description">${markerData.description}</p>
          </div>
        `
        const popup = L.popup({ offset: [0, -15] }).setContent(popupContent)

       /* var MarkerIcon = L.Icon.extend({
          options: {
              iconSize:     [25, 41],
              iconAnchor:   [12, 41],
              popupAnchor:  [1, -34]
          }
      });

      var greenMarker = new MarkerIcon({iconUrl: 'resources/images/marker-icon-green.png'});
      var redMarker = new MarkerIcon({iconUrl: 'resources/images/marker-icon-red.png'});

      const markerIcon = new Date(markerData.date) >= new Date() ? greenMarker : redMarker;*/
        
        const marker = L.marker([markerData.latitude, markerData.longitude])
        marker.bindPopup(popup)
        marker.on('mouseover', function (e) {
          this.openPopup()
        })
        marker.on('mouseout', function (e) {
          this.closePopup()
        })
        .addTo(map)
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