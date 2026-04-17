import type { ElementProps } from "../interfaces";

type Props = ElementProps<HTMLSpanElement>;
const BoldText: React.FunctionComponent<Props> = (props) => {
  return <span {...props} style={{ ...props.style, fontWeight: 600 }} />;
};

export { BoldText };
