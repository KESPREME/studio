"use client"

// Vendored from 'react-leaflet-cluster' to solve Next.js HMR issue
// Original source: https://github.com/yuzhva/react-leaflet-cluster/

import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';

const MarkerClusterGroupContext = createContext(null);

const useMarkerClusterGroup = () => useContext(MarkerClusterGroupContext);

const MarkerClusterGroup = forwardRef(function MarkerClusterGroup(
  { children, ...props },
  ref,
) {
  const markerClusterGroup = useMemo(() => new L.MarkerClusterGroup(props), []);
  const map = useMap();
  const context = useMarkerClusterGroup();
  const instanceRef = useRef(markerClusterGroup);

  useImperativeHandle(ref, () => instanceRef.current, []);

  useEffect(() => {
    (context || map).addLayer(markerClusterGroup);

    return () => {
      (context || map).removeLayer(markerClusterGroup);
    };
  }, [map, markerClusterGroup, context]);

  const recursivelyFindMarkers = (children) => {
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === L.Marker) {
          return child;
        }

        if (child.props.children) {
          return recursivelyFindMarkers(child.props.children);
        }
      }

      return null;
    });
  };

  return (
    <MarkerClusterGroupContext.Provider value={markerClusterGroup}>
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, { ...child.props }) : child,
      )}
    </MarkerClusterGroupContext.Provider>
  );
});

export default MarkerClusterGroup;
