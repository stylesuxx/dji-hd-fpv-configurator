import React,{
  useEffect,
  useState,
} from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import Footer from "./features/navigation/Footer";
import Root from "./features/root/Root";

import AdbRouter from "./AdbRouter";
import TabGovernor from "./utils/TabGovernor";

import {
  checkedMaster,
  setCanClaim,
  setMaster,
} from "./features/tabGovernor/tabGovernorSlice";

import {
  selectClaimed,
  setClaimed,
} from "./features/device/deviceSlice";

export default function Router() {
  const dispatch = useDispatch();

  const deviceClaimed = useSelector(selectClaimed);

  /**
   * Set up tab governor in most outer component to have it set up
   * for every following component and minimize re-evaluation.
   */
  const [tabGovernor, setTabGovernor] = useState(null);
  useEffect(() => {
    if(!tabGovernor) {
      const tabGovernor = new TabGovernor((isMaster) => {
        dispatch(setMaster(isMaster));
        dispatch(checkedMaster(true));
      }, (canClaim) => {
        console.log("setting canClaim", canClaim);
        dispatch(setCanClaim(canClaim));
      });
      tabGovernor.connect();
      setTabGovernor(tabGovernor);
    }
  }, [dispatch, tabGovernor, setTabGovernor]);

  // Notify others if we Claimed the device
  useEffect(() => {
    if(tabGovernor) {
      tabGovernor.deviceClaimed(deviceClaimed);
    }
  }, [tabGovernor, deviceClaimed]);

  return(
    <>
      <Routes>
        <Route
          element={<Root />}
          path="/root"
        />

        <Route
          element={<AdbRouter />}
          path="/*"
        />
      </Routes>

      <Footer />
    </>
  );
}
