import React from 'react';
import Services from "@src/services";

/**
 * Контекст для Services
 * @type {React.Context<{}>}
 */
export const ServicesContext = React.createContext({});

interface ServiceProviderProps {
  services: Services,
  children: React.ReactNode | React.ReactNode[],
}

/**
 * Провайдер Services.
 */
function ServicesProvider(props: ServiceProviderProps) {
  return (
    <ServicesContext.Provider value={props.services}>
      {props.children}
    </ServicesContext.Provider>
  );
}

export default React.memo(ServicesProvider);
