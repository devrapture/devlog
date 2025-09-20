import { type FC, type PropsWithChildren, type ReactNode } from "react";

interface Props {
    isLoading: boolean;
    Loader: FC | ReactNode;
    EmptyComponent?: FC | ReactNode;
    isEmpty?: boolean;
}

const SkeletonWrapper = ({
    isLoading,
    Loader,
    children,
    EmptyComponent,
    isEmpty = false,
}: PropsWithChildren<Props>) => {
    if (isLoading) {
        // Check if Loader is a function component
        if (typeof Loader === "function") {
            return <Loader />;
        }
        // Otherwise, just return the ReactNode directly
        return Loader;
    }

    if (isEmpty) {
        // Check if Loader is a function component
        if (typeof EmptyComponent === "function") {
            return <EmptyComponent />;
        }
        // Otherwise, just return the ReactNode directly
        return EmptyComponent;
    }

    return <>{children}</>;
};

export default SkeletonWrapper;
