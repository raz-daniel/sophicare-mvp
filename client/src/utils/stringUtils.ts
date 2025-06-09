export const capitalize = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1);
  
  export const formatEnumValue = (value: string): string =>
    capitalize(value.replace(/([A-Z])/g, ' $1'));