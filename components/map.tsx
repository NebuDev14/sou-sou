import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

import { useAtom } from "jotai";
import { selectedAddressAtom } from "../server/atoms";
import { useQuery } from "../hooks/trpc";
import { MarkerModal } from "./modals/marker-modal";
import { useState } from "react";

export const MapView: React.FC = () => {
  const container = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 40.7128,
    lng: -74,
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const [address] = useAtom(selectedAddressAtom);
  const { data: nearbyData } = useQuery([
    "location.get-nearby",
    { address: address },
  ]);

  console.log(nearbyData);

  const [markerData, setMarkerData] = useState();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
  });

  // const mapRef = useRef<google.maps.Map | null>(null);

  // const onLoad = (map: google.maps.Map): voi
  // }d => {
  //   mapRef.current = map;

  // const unMount = (): void => { mapRef.current = null; }

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={container}
          zoom={12}
          options={options}
          center={center}
          // onLoad={onLoad}
          // onUnmount={unMount}
        >
          {nearbyData?.map((marker: any) => (
            <Marker
              key={marker.place_id}
              position={marker.geometry.location}
              onClick={() => setMarkerData({
                business_status: marker.business_status,
                
              })}
            />
          ))}
        </GoogleMap>
      ) : (
        <h1>Loading</h1>
      )}
      <MarkerModal markerData={markerData} />
    </>
  );
};
