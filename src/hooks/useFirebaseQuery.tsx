import { useEffect, useState, useRef } from "react";

export const useFirebaseQuery = (query: any) => {
  const [value, setValue] = useState({});

  // Debounce state changes to avoid excessive initial rendering
  const timer: any = useRef();
  const state: any = useRef({});

  useEffect(() => {
    function update() {
      clearInterval(timer.current);
      timer.current = setTimeout(() => {
        setValue({ ...state.current });
      });
    }

    function childAddedOrChanged(snap: any) {
      state.current[snap.key] = snap.val();
      update();
    }

    function childRemoved(snap: any) {
      delete state.current[snap.key];
      update();
    }

    query.on("child_added", childAddedOrChanged);
    query.on("child_removed", childRemoved);
    query.on("child_changed", childAddedOrChanged);
    return () => {
      query.off("child_added", childAddedOrChanged);
      query.off("child_removed", childRemoved);
      query.off("child_changed", childAddedOrChanged);
      clearInterval(timer.current);
      state.current = {};
      setValue({});
    };
  }, [query]);

  return value;
};
