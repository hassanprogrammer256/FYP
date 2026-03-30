import React from 'react';
import { Tab } from "@mui/joy";

const CustomTab = (props) => {
  const { children } = props;
  return (
    <Tab disableIndicator {...props}>
      {children}
    </Tab>
  );
};

export default CustomTab;