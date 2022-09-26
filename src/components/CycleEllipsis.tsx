import React, { useState, useEffect } from "react";

type CycleEllipsisProps = {
  ariaLabel: string;
  /**
   * What is the interval of cycling the message?
   */
  intervalMs?: number;
  /**
   * Optional settings for the `span` dots.
   */
  fadeInProps?: React.HTMLAttributes<HTMLSpanElement>;
};

const MESSAGES: string[] = ["", ".", ".", "."];

export function CycleEllipsis(props: CycleEllipsisProps) {
  const { ariaLabel, intervalMs = 1000, fadeInProps } = props;

  /**
   * State
   */

  const [upToIndex, setUpToIndex] = useState<number>(1);

  /**
   * Effects
   */

  useEffect(() => {
    const intervalId = setInterval(
      () => setUpToIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length),
      intervalMs
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  /**
   * Render
   */

  return (
    <>
      <span aria-label={ariaLabel}>
        <span>{upToIndex >= 0 && MESSAGES[0]}</span>
        <span {...fadeInProps}>{upToIndex >= 1 && MESSAGES[1]}</span>
        <span {...fadeInProps}>{upToIndex >= 2 && MESSAGES[2]}</span>
        <span {...fadeInProps}>{upToIndex >= 3 && MESSAGES[3]}</span>
      </span>
    </>
  );
}
