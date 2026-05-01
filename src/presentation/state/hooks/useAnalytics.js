import { useDispatch, useSelector } from "react-redux";
import { loadAnalytics } from "../analytics/analyticsThunks";

export const useAnalytics = () => {
  const dispatch = useDispatch();

  const analytics = useSelector((state) => state.analytics.data);
  const isLoading = useSelector((state) => state.analytics.isLoading);
  const error = useSelector((state) => state.analytics.error);

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics: () => dispatch(loadAnalytics()).unwrap(),
  };
};
