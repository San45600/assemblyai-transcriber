import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const TranscriptText = ({
  confidence,
  time,
  startTime,
  text,
  onClickCallback,
}: {
  confidence: number;
  time: number;
  startTime: number;
  text: string;
  onClickCallback: (time: number) => void;
}) => {
  const textColor =
    time * 1000 > startTime && confidence < 0.35
      ? "text-yellow-500"
      : confidence < 0.35
      ? "text-red-500"
      : time * 1000 > startTime
      ? "text-green-400"
      : "";

  const textElement = (
    <span
      className={`h-fit cursor-pointer ${textColor}`}
      onClick={() => {
        onClickCallback(startTime);
      }}
    >
      {text}
    </span>
  );

  return confidence < 0.35 ? (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{textElement}</TooltipTrigger>
        <TooltipContent>
          <p>Confidence: {confidence}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    textElement
  );
};
