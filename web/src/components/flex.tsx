import type { ElementProps } from "../interfaces";

type Props = ElementProps<HTMLDivElement>;

const FlexRowWrap: React.FunctionComponent<Props> = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    />
  );
};

const FlexRowNoWrap: React.FunctionComponent<Props> = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    />
  );
};

const FlexColumnNoWrap: React.FunctionComponent<Props> = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
      }}
    />
  );
};

export { FlexColumnNoWrap, FlexRowNoWrap, FlexRowWrap };
