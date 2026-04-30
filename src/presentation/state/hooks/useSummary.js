import { useDispatch, useSelector } from "react-redux";
import { loadSummary } from "../summary/summaryThunks";

export const useSummary = () => {
  const dispatch = useDispatch();

  const summary = useSelector((state) => state.summary.data);
  const isLoading = useSelector((state) => state.summary.isLoading);
  const error = useSelector((state) => state.summary.error);

  return {
    summary,
    isLoading,
    error,
    loadSummary: () => dispatch(loadSummary()).unwrap(),
  };
};
