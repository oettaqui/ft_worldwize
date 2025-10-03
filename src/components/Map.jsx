
import { useNavigate, useSearchParams } from "react-router-dom"
import styles from "./Map.module.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useState, useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useMap, useMapEvents } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

export default function Map(){
    const [ mapPosition, setMapPosition ] = useState([40, 0]);
    
    const [lat, lng] = useUrlPosition();
    const {cities} = useCities();
    const {isloading: isloadingPosition, position: geolocationPosition, getPosition} = useGeolocation();

    useEffect(function() {
        if (lat && lng) {
            setMapPosition([lat, lng]);
        }
    }, [lat, lng]);

    useEffect(function() {
        if (geolocationPosition) {
            setMapPosition([geolocationPosition.lat, geolocationPosition.lng ]);
        }
    }, [geolocationPosition]);
    
    return (
        <div className={styles.mapContainer}>
            {/* { geolocationPosition && (<Button type="position" onClick={getPosition} >
                {isloadingPosition ? "Loading..." : "Use your position"}
            </Button>) } */}
            <Button type="position" onClick={getPosition} >
                {isloadingPosition ? "Loading..." : "Use your position"}
            </Button>
            <MapContainer 
                className={styles.map} 
                center={mapPosition}
                zoom={6} 
                scrollWheelZoom={true}>
                     
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                    <Popup>
                        <span>{city.emoji}</span>
                        <h3>{city.cityName}</h3>
                    </Popup>
                    </Marker>  
                ))}
                
                <ChangeCenter position={mapPosition} /> 
                <DetectClick />  
            </MapContainer> 
        </div>
    )
}

function ChangeCenter({position}){
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick(){
    const navigate = useNavigate();
    useMapEvents({
        click : (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}` ),

    });
    return null;
}