import { Fragment, type PropsWithChildren } from "react";
import { v4 as uuidv4 } from "uuid";
type Props = {
    count: number;
};

const Repeater = ({ count, children }: PropsWithChildren<Props>) => {
    return (
        <>
            {Array.from({ length: count }, (_) => (
                <Fragment key={uuidv4()}>{children}</Fragment>
            ))}
        </>
    );
};

export default Repeater;
