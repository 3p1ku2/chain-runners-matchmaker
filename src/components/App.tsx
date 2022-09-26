import { CycleEllipsis } from "./CycleEllipsis";
import { useGetUnclaimedXR } from "../hooks";

export function App(): JSX.Element {
  /**
   * Our hooks
   */

  const { unclaimed, unclaimedStatus } = useGetUnclaimedXR();

  /**
   * Render
   */

  return (
    <div className="flex">
      {/* XR UNCLAIMED COUNT */}
      <p>Unclaimed {Intl.NumberFormat().format(unclaimed?.length || 0)}</p>

      {/* XR UNCLAIMED COUNT PROGRESS */}
      {unclaimedStatus === "loading" && (
        <CycleEllipsis
          ariaLabel="Refreshing unclaimed XR count..."
          intervalMs={300}
        />
      )}
    </div>
  );
}
